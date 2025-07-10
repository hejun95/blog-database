const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// 测试文字数据API
async function testDataAPI() {
  console.log('=== 测试文字数据API ===');
  
  try {
    // 1. 创建数据
    console.log('1. 创建数据...');
    const createResponse = await axios.post(`${BASE_URL}/data`, {
      title: '测试标题',
      content: '这是一个测试内容',
      tags: ['测试', '示例']
    });
    console.log('创建成功:', createResponse.data);
    
    const postId = createResponse.data.data.id;
    
    // 2. 获取所有数据
    console.log('\n2. 获取所有数据...');
    const getAllResponse = await axios.get(`${BASE_URL}/data`);
    console.log('数据总数:', getAllResponse.data.count);
    
    // 3. 根据ID获取数据
    console.log('\n3. 根据ID获取数据...');
    const getByIdResponse = await axios.get(`${BASE_URL}/data/${postId}`);
    console.log('获取成功:', getByIdResponse.data.data.title);
    
    // 4. 更新数据
    console.log('\n4. 更新数据...');
    const updateResponse = await axios.put(`${BASE_URL}/data/${postId}`, {
      title: '更新后的标题',
      content: '更新后的内容'
    });
    console.log('更新成功:', updateResponse.data.data.title);
    
    // 5. 搜索数据
    console.log('\n5. 搜索数据...');
    const searchResponse = await axios.get(`${BASE_URL}/data/search/测试`);
    console.log('搜索结果数量:', searchResponse.data.count);
    
    // 6. 删除数据
    console.log('\n6. 删除数据...');
    const deleteResponse = await axios.delete(`${BASE_URL}/data/${postId}`);
    console.log('删除成功:', deleteResponse.data.message);
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

// 测试图片API
async function testImageAPI() {
  console.log('\n=== 测试图片API ===');
  
  try {
    // 1. 获取所有图片
    console.log('1. 获取所有图片...');
    const getAllResponse = await axios.get(`${BASE_URL}/images`);
    console.log('图片总数:', getAllResponse.data.count);
    
    // 2. 搜索图片
    console.log('\n2. 搜索图片...');
    const searchResponse = await axios.get(`${BASE_URL}/images/search/测试`);
    console.log('搜索结果数量:', searchResponse.data.count);
    
  } catch (error) {
    console.error('测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('开始API测试...\n');
  
  await testDataAPI();
  await testImageAPI();
  
  console.log('\n测试完成！');
}

// 如果直接运行此文件
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testDataAPI, testImageAPI }; 