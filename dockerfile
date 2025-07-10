# 使用官方 Node.js 运行时作为基础镜像（根据项目需求选择版本）
FROM node:18-alpine

# 设置容器内工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（优先利用 Docker 层缓存）
COPY package*.json ./

# 安装依赖（生产环境忽略 devDependencies）
RUN npm ci --only=production

# 复制项目所有文件到容器
COPY . .

# 暴露应用运行的端口（需与项目实际端口一致）
EXPOSE 3000

# 启动命令（根据项目启动脚本调整）
CMD ["npm", "start"]