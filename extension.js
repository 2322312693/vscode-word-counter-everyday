const vscode = require('vscode');

// 用于存储字符计数、删除字符数和日期
let charCount = 0;
let deleteCount = 0;
let currentDate = new Date().toDateString();

// 状态栏项
let statusBarItem;

/**
 * 初始化状态栏项
 */
function initStatusBarItem() {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'hello-vscode.resetCharCount';
    statusBarItem.tooltip = '点击重置当日字符统计';
    updateStatusBar();
    statusBarItem.show();
}

/**
 * 更新状态栏显示内容
 */
function updateStatusBar() {
    statusBarItem.text = `当日输入: ${charCount} 字符 | 删除: ${deleteCount} 字符`;
}

/**
 * 重置统计
 */
function resetCount() {
    charCount = 0;
    deleteCount = 0;
    currentDate = new Date().toDateString();
    updateStatusBar();
    vscode.window.showInformationMessage('当日字符统计已重置');
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    initStatusBarItem();

    // 监听文档内容变化
    vscode.workspace.onDidChangeTextDocument((event) => {
        const today = new Date().toDateString();
        if (today !== currentDate) {
            resetCount();
        }

        const changes = event.contentChanges;
        for (const change of changes) {
            const addedLength = change.text.length;
            const removedLength = change.rangeLength;

            // 计算新增字符数
            charCount += addedLength;
            // 计算删除字符数
            if (removedLength > addedLength) {
                deleteCount += removedLength - addedLength;
            }
        }
        updateStatusBar();
    });

    // 注册重置命令
    const resetDisposable = vscode.commands.registerCommand('hello-vscode.resetCharCount', resetCount);
    context.subscriptions.push(resetDisposable);
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