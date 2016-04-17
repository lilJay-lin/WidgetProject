# 组件开发环境

本项目组件全部依赖jquery

## 开发规范：

1. 组件在src/components文件夹下定义，比如新建slider组件：

    目录结构

    <pre>
        - slider
            - index.js //入口文件
            - slider.js //组件js
            - slider.less/css  //组件样式
            - img
    </pre>

2. 新增组件在webpack.config.js 和 webpack.production.config.js增加开发环境和生产环境打包入口

## 运行

开发中执行`npm start`， 使用chrome浏览器 打开`http://localhost:8080`

生产编译执行`npm run build`, 在dist目录下会生成组件的js