# 博客数据库项目

一个简单的Node.js数据存储系统，支持图片和文字数据的增删改查操作。

## 功能特性

- 📝 文字数据管理（标题、内容、标签）
- 🖼️ 图片上传和管理
- 🔍 数据搜索功能
- 📊 RESTful API接口
- 💾 文件系统存储

## 项目结构

```
blog-database/
├── server.js              # 主服务器文件
├── package.json           # 项目配置
├── README.md             # 项目说明
├── routes/               # 路由文件
│   ├── dataRoutes.js     # 文字数据路由
│   └── imageRoutes.js    # 图片数据路由
├── data/                 # 数据存储目录
│   ├── posts.json        # 文字数据文件
│   └── images.json       # 图片元数据文件
└── uploads/              # 图片上传目录
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动服务器：
```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

3. 访问API：
- 服务器地址：http://localhost:3000
- API文档：http://localhost:3000

## API接口

### 文字数据接口

#### 获取所有数据
```
GET /api/data
```

#### 根据ID获取数据
```
GET /api/data/:id
```

#### 创建新数据
```
POST /api/data
Content-Type: application/json

{
  "title": "标题",
  "content": "内容",
  "tags": ["标签1", "标签2"]
}
```

#### 更新数据
```
PUT /api/data/:id
Content-Type: application/json

{
  "title": "新标题",
  "content": "新内容",
  "tags": ["新标签"]
}
```

#### 删除数据
```
DELETE /api/data/:id
```

#### 搜索数据
```
GET /api/data/search/:keyword
```

### 图片接口

#### 获取所有图片
```
GET /api/images
```

#### 根据ID获取图片信息
```
GET /api/images/:id
```

#### 上传图片
```
POST /api/images/upload
Content-Type: multipart/form-data

image: [图片文件]
title: "图片标题"
description: "图片描述"
tags: "标签1,标签2"
```

#### 更新图片信息
```
PUT /api/images/:id
Content-Type: application/json

{
  "title": "新标题",
  "description": "新描述",
  "tags": "新标签1,新标签2"
}
```

#### 删除图片
```
DELETE /api/images/:id
```

#### 搜索图片
```
GET /api/images/search/:keyword
```

## 数据格式

### 文字数据格式
```json
{
  "id": "uuid",
  "title": "标题",
  "content": "内容",
  "tags": ["标签1", "标签2"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 图片数据格式
```json
{
  "id": "uuid",
  "filename": "文件名",
  "originalName": "原始文件名",
  "mimetype": "image/jpeg",
  "size": 1024,
  "path": "文件路径",
  "url": "/uploads/文件名",
  "title": "图片标题",
  "description": "图片描述",
  "tags": ["标签1", "标签2"],
  "uploadedAt": "2024-01-01T00:00:00.000Z"
}
```

## 技术栈

- Node.js
- Express.js
- Multer (文件上传)
- fs-extra (文件操作)
- UUID (唯一标识符)
- CORS (跨域支持)

## 注意事项

- 图片文件大小限制：5MB
- 支持的图片格式：jpeg, jpg, png, gif, webp
- 数据存储在本地文件系统中
- 建议在生产环境中使用数据库存储 