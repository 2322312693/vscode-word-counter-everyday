# Code Word Counter

A lightweight VSCode extension that tracks your daily typing activity and helps you monitor your coding productivity.

## ✨ Features

- **Real-time Input Tracking**: Automatically counts your daily input actions in VSCode
- **Daily Auto-reset**: Statistics automatically reset at midnight for a fresh start each day
- **7-day History**: Hover over the status bar to view your input statistics for the past 7 days
- **Reset Protection**: Confirmation dialog prevents accidental data loss when manually resetting
- **Persistent Storage**: Your statistics are saved and persist across VSCode sessions
- **Clean Interface**: Minimal status bar display that doesn't clutter your workspace

## 📊 How It Works

The extension tracks each input action (typing, pasting, etc.) and displays the count in your status bar as "Today Input: X". Each keystroke or input event increments the counter by 1.

### Status Bar Display

- Shows current day's input count
- Click to manually reset with confirmation
- Hover to see 7-day history (only shows days with activity)

### Automatic Features

- **Daily Reset**: Automatically resets at midnight
- **Data Persistence**: Saves your statistics across sessions
- **Smart History**: Only displays days with input activity in the hover tooltip

## 🚀 Installation

1. Open VSCode
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Code Word Counter"
4. Click Install

## 📈 Usage

Once installed, the extension works automatically:

1. **View Today's Count**: Check the status bar for "Today Input: X"
2. **View History**: Hover over the status bar item to see the last 7 days
3. **Manual Reset**: Click the status bar item and confirm to reset today's count
4. **Automatic Reset**: Statistics reset automatically each day at midnight

## 🎯 Use Cases

- **Productivity Tracking**: Monitor your daily coding activity
- **Work Habits**: Understand your typing patterns over time
- **Goal Setting**: Set daily input targets for consistency
- **Team Insights**: Share productivity metrics with your team

## ⚙️ Technical Details

- **Storage**: Uses VSCode's workspace state for data persistence
- **Performance**: Lightweight with minimal impact on editor performance
- **Privacy**: All data is stored locally, nothing is sent to external servers
- **Compatibility**: Works with all file types and VSCode themes

## 📝 Changelog

### v1.0.0

- Initial release
- Basic input counting functionality
- Daily auto-reset feature
- 7-day history with hover tooltip
- Reset confirmation dialog
- Persistent data storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Issues

If you encounter any issues or have suggestions, please file them in the [GitHub Issues](https://github.com/your-username/vscode-daily-input-stats/issues).

---

**Enjoy tracking your coding productivity!** 🚀
