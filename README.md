# react-imvc

下一代前端 MVC 架构。MVC 三者都是 Isomorphic，既是服务端 MVC，也是浏览器端 MVC。

react-imvc 是 isomorphic mvc 的 react 实现，它是一个 Web 框架。通过 react-imvc，我们可以更便利地实现同构 Web 应用的开发。

用法示例：

- react-imvc-template [DEMO地址](https://lucifier129.github.io/react-imvc-template/publish/static/) 和 [源代码地址](https://github.com/Lucifier129/react-imvc-template)
- isomorphic-cnode [DEMO地址](https://lucifier129.github.io/isomorphic-cnode/publish/static/) 和 [源代码地址](https://github.com/Lucifier129/isomorphic-cnode)


[点击访问详细文档地址：Documents](./doc/index.md)

## react-imvc 的作用和特性

- 一条命令启动完整的开发环境
- 一条命令编译和构建源代码
- 一份代码，既可以在 node.js 做服务端渲染(SSR)，也可以在浏览器端复用后继续渲染(CSR & SPA)
- 既是多页应用，也是单页应用，还可以通过配置自由切换两种模式，用「同构应用」打破「单页 VS 多页」的两难抉择
- 构建时自动生成一份 hash history 模式的静态文件，可以当做普通单页应用的入口文件（如 DEMO 所示）
- 构建时自动根据路由切割代码，按需加载 js 文件
- 支持在 IE8 及更高版本浏览器里，使用包括 async/await 在内的 ES2015+ 语言新特性
- 丰富的生命周期，让业务代码有更清晰的功能划分
- 内部自动解决在浏览器端复用服务端渲染的 html 和数据，无缝过渡
- 好用的同构方法 fetch、redirect 和 cookie 等，贯通前后端的请求、重定向和 cookie 等操作
- 还有更多隐藏特性，在等待你去发掘……

## 安装 react-imvc

react-imvc 是一个整体解决方案，包括服务端和客户端，所以必须从 npm 或 yarn 里下载到 package.json 里。

```shell
npm install --save react-imvc
```

## 使用 react-imvc 开发 Hello World

### 第一步：添加 npm scripts 任务

在你的 package.json 里添加 npm scripts 如下命令：

```json
{
    "scripts": {
        "start": "react-imvc start",
        "build": "react-imvc build",
        "test": "react-imvc test"
    }
}
```

### 第二步：添加源代码目录 src/ 和路由文件 index.js

在 package.json 所在的目录下，新建一个文件夹，名称为 src

在 src 文件夹里新增 index.js 入口文件，添加一组 {path, controller} 的路由配置

```javascript
// src/index.js
export default [
    {
        path: '/',
        controller: require('./home/Controller')
    }
]
```

在 package.json 平级目录下添加 .babelrc 文件

```json
{
	"presets": ["latest", "stage-0", "react"]
}
```

### 第三步：编写每个页面的 MVC 结构

每个页面必须是一个包含 controller.js 的文件夹，其中 controller.js 是页面的入口文件

```javascript
// src/home/Controller
import Controller from 'react-imvc/controller' // 加载 react-imvc controller 控制器
import React from 'react'

export default class Home extends Controller { // 继承它，编写你的控制器逻辑
    View = View // 将 react 组件赋值给控制器的 View 属性
}

function View() {
    return (
        <h1>Hello React-IMVC</h1>
    )
}
```

### 第四步：npm start 启动应用

在命令行输入 npm start，然后打开 `http://localhost:3000`，将看到 Hello React-IMVC

查看页面源代码，可以看到服务端渲染的内容。

## 欢迎提 Issue 和 Pull Request