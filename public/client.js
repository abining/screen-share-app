document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('screen');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startBtn');
    const cropBtn = document.getElementById('cropBtn');
    
    // 连接到WebSocket服务器
    const socket = io();
    let streaming = false;
    let drawSelectionBox;

    // 设置画布大小
    function setCanvasSize(width, height) {
        canvas.width = width;
        canvas.height = height;
    }

    // 初始设置画布大小
    setCanvasSize(1280, 720);

    // 初始化选区
    drawSelectionBox = initSelection(canvas, ctx);

    // 处理开始/停止按钮点击
    startBtn.addEventListener('click', () => {
        if (!streaming) {
            socket.emit('start-stream');
            startBtn.textContent = '停止观看';
            streaming = true;
        } else {
            socket.disconnect();
            socket.connect();
            startBtn.textContent = '开始观看';
            streaming = false;
        }
    });

    // 接收并显示屏幕数据
    socket.on('screen-data', (base64Image) => {
        const image = new Image();
        image.onload = () => {
            // 第一次接收图像时调整画布大小
            if (canvas.width !== image.width || canvas.height !== image.height) {
                setCanvasSize(image.width, image.height);
            }
            // 清除画布并绘制新图像
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            // 绘制选区
            if (drawSelectionBox) {
                drawSelectionBox();
            }
        };
        image.src = `data:image/png;base64,${base64Image}`;
    });

    // 处理连接错误
    socket.on('connect_error', (error) => {
        console.error('连接错误:', error);
        alert('连接服务器失败，请检查网络连接');
    });

    // 处理断开连接
    socket.on('disconnect', () => {
        streaming = false;
        startBtn.textContent = '开始观看';
    });

    // 添加裁剪按钮事件处理
    cropBtn.addEventListener('click', () => {
        cropAndDownload(canvas);
    });
});