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
