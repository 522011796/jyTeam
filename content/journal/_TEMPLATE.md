---
# 战地记录模板
# 每篇文章一个文件，文件名用编号（如 058.md）
---
id: ※ 编号
date: ※ 日期 YYYY.MM.DD
title: ※ 文章标题
location: 地点
excerpt: ※ 摘要（列表页显示）
relatedMission: 相关任务编号
tags: [标签1, 标签2]
imageTheme: mountain / rain / night / forest / terrain
---

正文直接写。段落之间空一行即可。

## 配图方式（二选一）

### 本地图片（推荐）
把图片放到 `static/images/content/` 目录，然后 Markdown 里写：
```
![图片说明](/images/content/文件名.jpg)
```
系统自动把图片插入到它出现的位置。

### Unsplash 主题图片
使用预设主题，指定跟在哪个段落后面：
```
![图片说明](after:0, theme:mountain)
```
可选主题：mountain / forest / rain / night / terrain / portrait
