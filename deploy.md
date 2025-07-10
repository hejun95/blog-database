# 部署指南

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

## 服务器部署

### 使用PM2部署

1. 安装PM2：
```bash
npm install -g pm2
```

2. 启动应用：
```bash
pm2 start server.js --name "blog-database"
```

3. 设置开机自启：
```bash
pm2 startup
pm2 save
```

### 使用Docker部署

1. 创建Dockerfile：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

2. 构建镜像：
```bash
docker build -t blog-database .
```

3. 运行容器：
```bash
docker run -p 3000:3000 -d blog-database
```

## 环境变量

可以创建 `.env` 文件来配置环境变量：

```env
PORT=3000
NODE_ENV=production
```

## 生产环境注意事项

1. 使用HTTPS
2. 配置反向代理（Nginx）
3. 设置防火墙规则
4. 定期备份数据
5. 监控服务器状态 