const vscode = require('vscode');

let inputCount = 0;
let statusBarItem;
let lastResetDate = new Date().toDateString();
let dailyStats = {}; // 存储每日统计数据

function activate(context) {
    console.log('Congratulations, your extension "hello-vscode" is now active!');

    // Load saved daily statistics
    loadDailyStats(context);
    
    // Check if auto-reset is needed (new day)
    checkAndResetForNewDay(context);

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'vscode-daily-char-stats.resetCharCount';
    context.subscriptions.push(statusBarItem);
    updateStatusBar();

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        // Check for reset needed on each document change
        checkAndResetForNewDay(context);
        
        let hasInput = false;
        event.contentChanges.forEach(change => {
            if (change.text.length > 0 && !hasInput) {
                inputCount += 1;
                hasInput = true;
            }
        });
        
        // Save current day's statistics
        saveDailyStats(context);
        updateStatusBar();
    }));

    // Reset command with confirmation prompt
    const resetCommand = vscode.commands.registerCommand('vscode-daily-char-stats.resetCharCount', async () => {
        // Show confirmation dialog
        const result = await vscode.window.showWarningMessage(
            `Are you sure you want to reset today's input statistics? Current count: ${inputCount}`,
            { modal: true },
            'Reset',
            'Cancel'
        );

        if (result === 'Reset') {
            inputCount = 0;
            lastResetDate = new Date().toDateString();
            saveDailyStats(context);
            updateStatusBar();
            vscode.window.showInformationMessage('Statistics have been reset');
        } else {
            vscode.window.showInformationMessage('Reset operation cancelled');
        }
    });

    context.subscriptions.push(resetCommand);
}

// Load daily statistics from workspace state
function loadDailyStats(context) {
    const saved = context.workspaceState.get('dailyInputStats', {});
    dailyStats = saved;
    
    // Load today's count if exists
    const today = new Date().toDateString();
    inputCount = dailyStats[today] || 0;
    lastResetDate = context.workspaceState.get('lastResetDate', today);
}

// Save daily statistics to workspace state
function saveDailyStats(context) {
    const today = new Date().toDateString();
    dailyStats[today] = inputCount;
    
    // Clean up old data (keep only last 30 days to avoid storage bloat)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    Object.keys(dailyStats).forEach(date => {
        if (new Date(date) < thirtyDaysAgo) {
            delete dailyStats[date];
        }
    });
    
    context.workspaceState.update('dailyInputStats', dailyStats);
    context.workspaceState.update('lastResetDate', lastResetDate);
}

// Check and auto-reset for new day
function checkAndResetForNewDay(context) {
    const currentDate = new Date().toDateString();
    if (currentDate !== lastResetDate) {
        // Save yesterday's final count before reset
        if (inputCount > 0) {
            dailyStats[lastResetDate] = inputCount;
        }
        
        inputCount = dailyStats[currentDate] || 0;
        lastResetDate = currentDate;
        saveDailyStats(context);
        console.log('New day detected, auto-resetting input statistics');
    }
}

// Generate last 7 days statistics for tooltip
function getLast7DaysStats() {
    const stats = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const count = dateStr === today.toDateString() ? inputCount : (dailyStats[dateStr] || 0);
        
        if (count > 0) {
            const dayName = i === 0 ? 'Today' : 
                           i === 1 ? 'Yesterday' : 
                           date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            stats.push(`${dayName}: ${count}`);
        }
    }
    
    return stats;
}

// Update status bar display
function updateStatusBar() {
    statusBarItem.text = `Today Input: ${inputCount}`;
    
    // Create tooltip with last 7 days statistics
    const last7Days = getLast7DaysStats();
    if (last7Days.length > 0) {
        statusBarItem.tooltip = new vscode.MarkdownString(`**Recent Input Statistics**\n\n${last7Days.join('\n\n')}`);
    } else {
        statusBarItem.tooltip = 'No input recorded in the last 7 days';
    }
    
    statusBarItem.show();
}

// Check if it's an IME composition character
function isComposing(text) {
    return /[\u0300-\u036F\u2E80-\u9FFF]/.test(text);
}

// Get effective character length (Chinese characters count as 1)
function getEffectiveLength(text) {
    return Array.from(text).filter(char => {
        const code = char.charCodeAt(0);
        return !(code >= 0x0300 && code <= 0x036F);
    }).length;
}

function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};
