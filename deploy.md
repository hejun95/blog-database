# 部署指南

## Fly.io 部署（推荐）

### 1. 安装 Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS
curl -L https://fly.io/install.sh | sh

# Linux
curl -L https://fly.io/install.sh | sh
```

### 2. 登录 Fly.io
```bash
fly auth login
```

### 3. 创建应用
```bash
fly apps create blog-database
```

### 4. 创建数据卷
```bash
# 创建数据存储卷
fly volumes create blog_data --size 1 --region hkg

# 创建上传文件卷
fly volumes create blog_uploads --size 5 --region hkg
```

### 5. 部署应用
```bash
fly deploy
```

### 6. 查看应用状态
```bash
fly status
fly logs
```

## 自动部署设置

### 1. 获取 Fly API Token
1. 访问 [Fly.io Dashboard](https://fly.io/dashboard)
2. 点击 "Access Tokens"
3. 创建新的 API Token

### 2. 设置 GitHub Secrets
在您的GitHub仓库中设置以下Secrets：
- `FLY_API_TOKEN`: 您的Fly API Token

### 3. 自动部署
每次推送到 `main` 分支时，GitHub Actions会自动部署到Fly.io

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

## 环境变量

可以创建 `.env` 文件来配置环境变量：

```env
PORT=8080
NODE_ENV=production
```

## Fly.io 优势

- ✅ **免费额度**：每月3个应用免费
- ✅ **无需信用卡**：免费额度内不需要
- ✅ **全球部署**：多地区部署
- ✅ **持久化存储**：支持Volumes
- ✅ **自动部署**：GitHub集成
- ✅ **性能优秀**：基于Docker

## 生产环境注意事项

1. 使用HTTPS（Fly.io自动提供）
2. 配置防火墙规则
3. 定期备份数据
4. 监控应用状态
5. 设置告警通知 