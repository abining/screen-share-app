## 项目介绍

这个项目使用node，express框架进行转发，可以通过主机加5555端口号访问到一个浏览器界面，这个界面可以实现实时查看服务端的屏幕。

## 技术方案

### 后端技术栈

- Node.js
- Express - Web服务器框架
- Socket.IO - 实现实时数据传输
- screenshot-desktop - 用于捕获屏幕画面

### 前端技术栈

- HTML5
- JavaScript
- Socket.IO Client - 接收实时屏幕数据
- Canvas - 渲染屏幕画面

## 实现步骤

1. 服务端实现

   - 使用 `screenshot-desktop` 定时捕获屏幕画面
   - 使用 `sharp` 压缩图像数据
   - 使用 Express 搭建 Web 服务器
   - 使用 Socket.IO 推送屏幕数据
   - 提供静态文件服务，托管前端页面
2. 前端实现

   - 创建基础的 HTML 页面
   - 使用 Canvas 显示屏幕画面
   - 实现 Socket.IO 客户端，接收屏幕数据
   - 将接收到的图像数据渲染到 Canvas 上

## 项目结构

项目难点

1. 使用一种方法，拿到电脑屏幕的显示信息。
2. 通过express这个服务器框架进行暴露到5555端口，用户通过主机ip加5555端口，在浏览器里面就可以看到对方的屏幕信息

运行项目：

npm install

node server.js

或者

npm run dev

## 使用方法：

1. 使用[链接](https://github.com/abining/screen-share-app/releases/tag/1.0.0)下载对应的软件。
2. 共享端：打开软件，软件会自动运行服务。
3. 贡献端查看电脑ip（自行搜索关键字“电脑品牌"+”查看设备ip")，通常局域网内是192开头的ip。

4. 查看端：浏览器输入电脑ip+端口号5555。例如我的ip是 `192.168.0.22`，那么就在浏览器输入 `192.168.0.22:5555`

交互很人性，很易懂就不多说了。

## 运行项目可能遇到的问题

## 打包错误的解决方案

让我们一个个解决这些问题：

1. Windows 打包失败问题：
   首先修改 package.json，添加更详细的构建配置：

```json:package.json
{
  "name": "screen-share-app",
  "version": "1.0.0",
  "description": "屏幕共享和截图工具",
  "main": "electron/main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder --win",
    "dev": "nodemon --exec electron ."
  },
  "build": {
    "appId": "com.screen.share",
    "productName": "Screen Share",
    "directories": {
      "output": "dist"
    },
    "files": [
      "electron/**/*",
      "public/**/*",
      "package.json"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "icon": "build/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "unicode": true
    }
  },
  "dependencies": {
    "express": "^4.21.2",
    "screenshot-desktop": "^1.15.1",
    "socket.io": "^4.8.1"
  },
  "devDependencies": {
    "electron": "^28.1.0",
    "electron-builder": "^24.9.1",
    "nodemon": "^3.0.2"
  }
}
```

1. 如果还是遇到打包问题，可以尝试以下步骤：

```bash
# 1. 清理项目
rm -rf node_modules
rm -rf dist
rm package-lock.json

# 2. 安装依赖
npm install --force

# 3. 如果还有问题，可以全局安装 electron-builder
npm install -g electron-builder

# 4. 然后再次尝试打包
npm run build
```

3. 如果打包时出现具体错误，可以添加详细日志：

```json:package.json
{
  "scripts": {
    "build": "electron-builder --win -c.extraMetadata.main=electron/main.js --debug"
  }
}
```

4. 确保项目结构正确：

```
your-app/
├── build/
│   └── icon.ico
├── electron/
│   └── main.js
├── public/
│   ├── index.html
│   ├── client.js
│   └── shear-pic-with-area.js
├── package.json
└── node_modules/
```

1. 如果还遇到问题，可以尝试在 package.json 中添加：

```json:package.json
{
  "build": {
    // ... 其他配置 ...
    "asar": false,  // 禁用 asar 打包
    "win": {
      // ... 其他配置 ...
      "publisherName": "YourName"
    }
  }
}
```

这些修改应该能解决 Windows 下的打包和乱码问题。如果还有具体错误，请提供错误信息，我可以帮你进一步解决。
