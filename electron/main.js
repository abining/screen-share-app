const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const screenshot = require('screenshot-desktop');

// Express 服务器设置
const expressApp = express();
const httpServer = createServer(expressApp);
const io = new Server(httpServer);

// 设置静态文件目录
expressApp.use(express.static(path.join(__dirname, '../public')));

// WebSocket 处理
io.on('connection', (socket) => {
    console.log('客户端已连接');
    let screenInterval;

    socket.on('start-stream', () => {
        screenInterval = setInterval(async () => {
            try {
                const screenshot_data = await screenshot();
                const base64Image = screenshot_data.toString('base64');
                socket.emit('screen-data', base64Image);
            } catch (err) {
                console.error('截图错误:', err);
            }
        }, 500);
    });

    socket.on('disconnect', () => {
        console.log('客户端断开连接');
        if (screenInterval) {
            clearInterval(screenInterval);
        }
    });
});

// 启动服务器
const PORT = 5555;
httpServer.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadURL('http://localhost:5555');
    // win.webContents.openDevTools(); // 开发时打开调试工具
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});