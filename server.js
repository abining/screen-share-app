const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const screenshot = require('screenshot-desktop');
const path = require('path');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 定义截图间隔时间（毫秒）
const SCREENSHOT_INTERVAL = 500;

// WebSocket连接处理
io.on('connection', (socket) => {
    console.log('客户端已连接');
    
    let screenInterval;

    // 开始发送屏幕截图
    socket.on('start-stream', () => {
        screenInterval = setInterval(async () => {
            try {
                // 捕获屏幕截图
                const screenshot_data = await screenshot();
                
                // 将图片数据转换为base64格式
                const base64Image = screenshot_data.toString('base64');
                
                // 发送给客户端
                socket.emit('screen-data', base64Image);
            } catch (err) {
                console.error('截图错误:', err);
            }
        }, SCREENSHOT_INTERVAL);
    });

    // 处理客户端断开连接
    socket.on('disconnect', () => {
        console.log('客户端断开连接');
        if (screenInterval) {
            clearInterval(screenInterval);
        }
    });
});

// 启动服务器
const PORT = 5555;
http.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
