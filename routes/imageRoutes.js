const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const IMAGE_DATA_FILE = path.join(__dirname, '../data/images.json');

// 确保上传目录存在
async function ensureUploadDir() {
  await fs.ensureDir(UPLOAD_DIR);
}

// 确保图片数据文件存在
async function ensureImageDataFile() {
  try {
    await fs.ensureFile(IMAGE_DATA_FILE);
    const content = await fs.readFile(IMAGE_DATA_FILE, 'utf8');
    if (!content.trim()) {
      await fs.writeJson(IMAGE_DATA_FILE, []);
    }
  } catch (error) {
    console.error('确保图片数据文件失败:', error);
  }
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDir();
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只支持图片文件 (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB限制
  },
  fileFilter: fileFilter
});

// 获取所有图片信息
router.get('/', async (req, res) => {
  try {
    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    
    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取图片列表失败',
      message: error.message
    });
  }
});

// 根据ID获取图片信息
router.get('/:id', async (req, res) => {
  try {
    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    const image = images.find(img => img.id === req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        error: '图片不存在'
      });
    }
    
    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取图片信息失败',
      message: error.message
    });
  }
});

// 上传图片
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '请选择要上传的图片'
      });
    }

    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    
    const newImage = {
      id: uuidv4(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      uploadedAt: new Date().toISOString()
    };
    
    images.push(newImage);
    await fs.writeJson(IMAGE_DATA_FILE, images, { spaces: 2 });
    
    res.status(201).json({
      success: true,
      data: newImage,
      message: '图片上传成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '图片上传失败',
      message: error.message
    });
  }
});

// 更新图片信息
router.put('/:id', async (req, res) => {
  try {
    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    const index = images.findIndex(img => img.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '图片不存在'
      });
    }
    
    images[index] = {
      ...images[index],
      title: req.body.title || images[index].title,
      description: req.body.description || images[index].description,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : images[index].tags,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeJson(IMAGE_DATA_FILE, images, { spaces: 2 });
    
    res.json({
      success: true,
      data: images[index],
      message: '图片信息更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新图片信息失败',
      message: error.message
    });
  }
});

// 删除图片
router.delete('/:id', async (req, res) => {
  try {
    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    const index = images.findIndex(img => img.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '图片不存在'
      });
    }
    
    const deletedImage = images[index];
    
    // 删除文件系统中的图片文件
    try {
      await fs.remove(deletedImage.path);
    } catch (fileError) {
      console.warn('删除图片文件失败:', fileError);
    }
    
    // 从数据文件中移除记录
    images.splice(index, 1);
    await fs.writeJson(IMAGE_DATA_FILE, images, { spaces: 2 });
    
    res.json({
      success: true,
      data: deletedImage,
      message: '图片删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除图片失败',
      message: error.message
    });
  }
});

// 搜索图片
router.get('/search/:keyword', async (req, res) => {
  try {
    await ensureImageDataFile();
    const images = await fs.readJson(IMAGE_DATA_FILE);
    const keyword = req.params.keyword.toLowerCase();
    
    const filteredImages = images.filter(img => 
      img.title.toLowerCase().includes(keyword) ||
      img.description.toLowerCase().includes(keyword) ||
      img.originalName.toLowerCase().includes(keyword) ||
      img.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    
    res.json({
      success: true,
      data: filteredImages,
      count: filteredImages.length,
      keyword: keyword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '搜索图片失败',
      message: error.message
    });
  }
});

module.exports = router;