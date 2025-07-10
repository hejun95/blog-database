const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// 导入路由
const dataRoutes = require('./routes/dataRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保必要的目录存在
async function ensureDirectories() {
  const dirs = ['uploads', 'data'];
  for (const dir of dirs) {
    await fs.ensureDir(path.join(__dirname, dir));
  }
}

// 路由
app.use('/api/data', dataRoutes);
app.use('/api/images', imageRoutes);

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '博客数据库API服务',
    version: '1.0.0',
    endpoints: {
      data: '/api/data',
      images: '/api/images'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// 启动服务器
async function startServer() {
  try {
    await ensureDirectories();
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log(`API文档: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
}

startServer();