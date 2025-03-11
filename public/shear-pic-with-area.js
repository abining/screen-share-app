// 选区状态
let isDrawing = false;
let selectionBox = {
    x: 100,
    y: 100,
    width: 200,
    height: 150
};
let dragHandle = null;
const handleSize = 8;

// 初始化选区
function initSelection(canvas, ctx) {
    // 绘制选区
    function drawSelectionBox() {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
        
        // 绘制拖拽手柄
        ctx.fillStyle = '#ffffff';
        const handles = [
            { x: selectionBox.x, y: selectionBox.y }, // 左上
            { x: selectionBox.x + selectionBox.width, y: selectionBox.y }, // 右上
            { x: selectionBox.x, y: selectionBox.y + selectionBox.height }, // 左下
            { x: selectionBox.x + selectionBox.width, y: selectionBox.y + selectionBox.height } // 右下
        ];
        
        handles.forEach(handle => {
            ctx.fillRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
            ctx.strokeRect(handle.x - handleSize/2, handle.y - handleSize/2, handleSize, handleSize);
        });
    }

    // 判断鼠标是否在手柄上
    function getHandle(x, y) {
        const handles = {
            'nw': { x: selectionBox.x, y: selectionBox.y },
            'ne': { x: selectionBox.x + selectionBox.width, y: selectionBox.y },
            'sw': { x: selectionBox.x, y: selectionBox.y + selectionBox.height },
            'se': { x: selectionBox.x + selectionBox.width, y: selectionBox.y + selectionBox.height }
        };

        for (let pos in handles) {
            const handle = handles[pos];
            if (x >= handle.x - handleSize/2 && x <= handle.x + handleSize/2 &&
                y >= handle.y - handleSize/2 && y <= handle.y + handleSize/2) {
                return pos;
            }
        }
        
        if (x >= selectionBox.x && x <= selectionBox.x + selectionBox.width &&
            y >= selectionBox.y && y <= selectionBox.y + selectionBox.height) {
            return 'move';
        }
        
        return null;
    }

    // 鼠标事件处理
    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        dragHandle = getHandle(x, y);
        if (dragHandle) {
            isDrawing = true;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (isDrawing && dragHandle) {
            if (dragHandle === 'move') {
                selectionBox.x = x - selectionBox.width/2;
                selectionBox.y = y - selectionBox.height/2;
            } else {
                if (dragHandle.includes('n')) {
                    selectionBox.height = selectionBox.height + (selectionBox.y - y);
                    selectionBox.y = y;
                }
                if (dragHandle.includes('s')) {
                    selectionBox.height = y - selectionBox.y;
                }
                if (dragHandle.includes('w')) {
                    selectionBox.width = selectionBox.width + (selectionBox.x - x);
                    selectionBox.x = x;
                }
                if (dragHandle.includes('e')) {
                    selectionBox.width = x - selectionBox.x;
                }
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        dragHandle = null;
    });

    // 返回绘制函数供外部调用
    return drawSelectionBox;
}

// 裁剪并下载图片
function cropAndDownload(canvas) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = selectionBox.width;
    tempCanvas.height = selectionBox.height;
    
    // 将选中区域绘制到临时画布
    tempCtx.drawImage(
        canvas,
        selectionBox.x, selectionBox.y,
        selectionBox.width, selectionBox.height,
        0, 0,
        selectionBox.width, selectionBox.height
    );
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = 'cropped-screenshot.png';
    link.href = tempCanvas.toDataURL();
    link.click();
}

// 导出函数供其他文件使用
window.initSelection = initSelection;
window.cropAndDownload = cropAndDownload;
