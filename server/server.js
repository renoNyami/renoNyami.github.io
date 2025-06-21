const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('./config/database'); // 引入 Sequelize 实例
const Snippet = require('./models/Snippet'); // 引入模型
const path = require('path');

// 加载环境变量
const envPath = path.join(__dirname, '../.env'); // 假设 .env 在根目录
require('dotenv').config({ path: envPath }); // 显式指定路径

// 打印环境变量路径（调试用）
console.log('加载的 .env 文件路径:', envPath);

// 打印环境变量
console.log('环境变量加载结果：');
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
}));
app.use(express.json());

// 测试数据库连接
sequelize.authenticate()
 .then(() => console.log('MySQL 连接成功'))
 .catch(err => {
    console.error('MySQL 连接失败:', err);
    process.exit(1); // 连接失败时退出进程
  });

// 同步模型到数据库（创建表）
sequelize.sync()
 .then(() => console.log('数据库表同步完成'))
 .catch(err => {
    console.error('数据库表同步失败:', err);
    process.exit(1); // 同步失败时退出进程
  });

// POST 保存代码片段
// POST 保存代码片段
app.post('/api/snippets', async (req, res) => {
  console.log('接收到的请求体内容:', req.body);
  const { code, language, theme } = req.body;

  // 验证必要字段
  if (!code || !language || !theme) {
    return res.status(400).json({ error: '缺少必要字段（code、language、theme）' });
  }
  try {
    const newSnippet = await Snippet.create({
      id: uuidv4(),
      code,
      language,
      theme
    });

    const responseData = { id: newSnippet.id };
    console.log('服务器返回的数据:', responseData); // 添加日志
    res.status(201).json(responseData);
  } catch (error) {
    console.error('保存代码片段失败:', error);
    res.status(500).json({ error: '保存代码片段失败' });
  }
});

// GET 获取代码片段
app.get('/api/snippets/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);
    if (!snippet) {
      return res.status(404).json({ error: '代码片段未找到' });
    }
    res.json({
      code: snippet.code,
      language: snippet.language,
      theme: snippet.theme
    });
  } catch (error) {
    console.error('获取代码片段失败:', error);
    res.status(500).json({ error: '获取代码片段失败' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});