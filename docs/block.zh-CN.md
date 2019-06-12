---
order: 3
title: 区块
type: 开发
---

## 什么是区块

区块是研发资产的一种，它是一系列快速搭建页面的代码片段，它可以帮助你快速的在项目中初始化好一个页面，帮助你更快速的开发代码。当前的区块都是页面级别的区块，你可以理解为它是一些项目中经常会用到的典型页面的模板，使用区块其实相当于从已有的项目中复制一些页面的代码到你当前的项目中。

* 以前开发一个页面：创建 JS -> 创建 CSS -> 创建 Model -> 创建 service -> 写页面组件。
* 现在开发一个页面：下载区块 -> 基于区块初始化好的页面组件修改代码。

## 使用区块

Dura.* 中，使用 umi 进行区块管理。添加区块非常容易，在命令行中输入：

```bash
umi block add [block url]
```

在我们的[预览网站](https://dura.sh)中，你可以通过点击右下角的“添加到项目中”获取对应页面的命令内容。

![block sample](https://user-images.githubusercontent.com/5378891/58394196-98d26e00-8074-11e9-87c7-c527cf87545d.png)

## 添加到路由

默认情况下，添加的区块路由为 `/[区块名]`。如果希望添加到对应路径上，可以使用 `--path` 参数指定路由：

```bash
umi block add ant-design-pro/analysis --path=your/path/here
```

## 更多内容

如果你想进行区块开发，可以在 [umi 区块](https://umijs.org/zh/guide/block.html)中查看完整内容。
