const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/posts.json');

// 确保数据文件存在
async function ensureDataFile() {
  try {
    await fs.ensureFile(DATA_FILE);
    const content = await fs.readFile(DATA_FILE, 'utf8');
    if (!content.trim()) {
      await fs.writeJson(DATA_FILE, []);
    }
  } catch (error) {
    console.error('确保数据文件失败:', error);
  }
}

// 获取所有数据
router.get('/', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取数据失败',
      message: error.message
    });
  }
});

// 根据ID获取数据
router.get('/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    const item = data.find(item => item.id === req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: '数据不存在'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取数据失败',
      message: error.message
    });
  }
});

// 创建新数据
router.post('/', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    
    const newItem = {
      id: uuidv4(),
      title: req.body.title || '',
      content: req.body.content || '',
      tags: req.body.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.push(newItem);
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    res.status(201).json({
      success: true,
      data: newItem,
      message: '数据创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建数据失败',
      message: error.message
    });
  }
});

// 更新数据
router.put('/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    const index = data.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '数据不存在'
      });
    }
    
    data[index] = {
      ...data[index],
      title: req.body.title || data[index].title,
      content: req.body.content || data[index].content,
      tags: req.body.tags || data[index].tags,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    res.json({
      success: true,
      data: data[index],
      message: '数据更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新数据失败',
      message: error.message
    });
  }
});

// 删除数据
router.delete('/:id', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    const index = data.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '数据不存在'
      });
    }
    
    const deletedItem = data.splice(index, 1)[0];
    await fs.writeJson(DATA_FILE, data, { spaces: 2 });
    
    res.json({
      success: true,
      data: deletedItem,
      message: '数据删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除数据失败',
      message: error.message
    });
  }
});

// 搜索数据
router.get('/search/:keyword', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readJson(DATA_FILE);
    const keyword = req.params.keyword.toLowerCase();
    
    const filteredData = data.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.content.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
    
    res.json({
      success: true,
      data: filteredData,
      count: filteredData.length,
      keyword: keyword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '搜索数据失败',
      message: error.message
    });
  }
});

module.exports = router;