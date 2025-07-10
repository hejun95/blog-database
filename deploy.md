# 部署指南 - Render

## 快速部署到Render

### 1. 自动部署（推荐）

1. 访问 [Render.com](https://render.com)
2. 用GitHub账号登录
3. 点击 "New" → "Web Service"
4. 连接您的GitHub仓库：`blog-database`
5. 配置设置：
   - **Name**: `blog-database`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. 点击 "Create Web Service"
7. 等待部署完成（约2-3分钟）

### 2. 配置持久化存储

部署完成后，在Render控制台：

1. 进入您的服务
2. 点击 "Environment" 标签
3. 添加环境变量：
   ```
   NODE_ENV=production
   PORT=10000
   ```

4. 点击 "Disk" 标签
5. 添加磁盘存储：
   - **Name**: `data`
   - **Mount Path**: `/opt/render/project/src/data`
   - **Size**: `1 GB`

   - **Name**: `uploads`
   - **Mount Path**: `/opt/render/project/src/uploads`
   - **Size**: `5 GB`

### 3. 获取API地址

部署完成后，您会得到一个域名：
```
https://your-app-name.onrender.com
```

您的API地址：
- 文字数据：`https://your-app-name.onrender.com/api/data`
- 图片管理：`https://your-app-name.onrender.com/api/images`

## 自动重新部署

Render支持自动重新部署：
- 每次推送到GitHub的main分支
- Render会自动检测并重新部署
- 无需手动操作

## 本地部署

1. 克隆仓库：
```bash
git clone https://github.com/your-username/blog-database.git
cd blog-database
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务器：
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 测试API

部署完成后，测试您的API：

```bash
# 测试文字数据API
curl https://your-app-name.onrender.com/api/data

# 测试图片API
curl https://your-app-name.onrender.com/api/images
```

## Render优势

✅ **完全免费**：无时间限制  
✅ **持久化存储**：数据不会丢失  
✅ **自动部署**：GitHub推送后自动更新  
✅ **稳定可靠**：适合生产环境  
✅ **简单易用**：一键部署 