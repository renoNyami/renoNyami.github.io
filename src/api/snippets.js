// src/api/snippets.js
import axios from 'axios';

// 直接通过 process.env 访问环境变量（无需导入 .env 文件）
const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const saveSnippet = async ({ code, language, theme }) => {
  if (!code || !language || !theme) {
    throw new Error('缺少必要字段（code、language、theme）');
  }

  const requestData = {
    code,
    language,
    theme
  };
  
  console.log('发送请求数据:', requestData);

  try {
    const response = await axios.post(`${API_URL}/api/snippets`, requestData);
    return response.data;
  } catch (error) {
    console.error('保存代码片段失败:', error);
    throw error;
  }
};

export const getSnippet = (id) => {
  return axios.get(`${API_URL}/api/snippets/${id}`);
};