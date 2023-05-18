# qm-cannon
qm-cannon 是一个快速生成前端项目的脚手架工具，该插件是由安徽阡陌科技的WEB前端团队搭建。


# 创建项目
```bash
qm-cannon create projectName
```
按照屏幕上的提示依次输入，最后就会在当前目录下创建一个 react + typescript 的项目。


# 模版选项

- 输入版本号；
- 提供了 webpack、vite 构建的选项；
- 提供了 redux 数据状态管理的选项。

# 模版提供了哪些内容

- 使用 axios 库封装的 http 请求；
- 使用 html2canvas、jspdf 封装的打印（自动识别内容，不会将一个完成的部分分别打印在不同的页面上）；
- 路由定义、左侧菜单栏
- js、css 资源的按需加载功能
- 生产构建时自动 tree shaking
- 选用 redux 数据状态管理，页面切换时自动完成进行 reducer 更新；
- mockjs 数据模拟

# 前端工程化设置

- commitlint，在 git commit 时对 message 进行校验
- eslint，在 git commit 时通过 lint-staged 对提交的代码进行代码检查
- prettier，在 git commit 时通过 lint-staged 对提交的代码进行格式化

