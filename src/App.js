import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';
import { saveSnippet, getSnippet } from './api/snippets';

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head><title>Example</title></head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState('html');
  const [theme, setTheme] = useState('vs-light');
  const [sharedId, setSharedId] = useState(null);
  const [isEdited, setIsEdited] = useState(false);

  // 从 URL 加载代码片段
  useEffect(() => {
    const loadSnippet = async () => {
      const path = window.location.pathname;
      const match = path.match(/\/snippets\/([\w-]+)/);
      
      if (match && match[1]) {
        try {
          const response = await getSnippet(match[1]);
          const { code: snippetCode, language: snippetLang, theme: snippetTheme } = response.data;
          setCode(snippetCode);
          setLanguage(snippetLang);
          setTheme(snippetTheme);
          setSharedId(match[1]);
        } catch (error) {
          console.error('加载代码片段失败:', error);
          alert('加载代码片段失败，请检查链接是否正确');
        }
      }
    };
    
    loadSnippet();
  }, []);

  // 检测代码修改
  useEffect(() => {
    const isDefault = code === DEFAULT_CODE;
    setIsEdited(!isDefault && !sharedId);
  }, [code, sharedId]);

  // 分享代码
  const API_URL = process.env.REACT_APP_API_BASE_URL; // 从环境变量获取 API 地址

  const handleShare = async () => {
    if (!API_URL) {
      console.error('API 地址未配置，请检查 .env 文件');
      return;
    }

    if (!code) {
      console.error('代码内容不能为空');
      return;
    }
    try {
      const res = await saveSnippet({ 
        code: code || '', 
        language: language || 'html', 
        theme: theme || 'vs-light' 
      });
      if (res && res.id) {
        setSharedId(res.id);
        console.log('保存成功，ID:', res.id);
        // 更新URL，但不触发页面刷新
        window.history.pushState({}, '', `/snippets/${res.id}`);
      } else {
        console.error('响应数据异常，未正确获取 id');
        throw new Error('响应数据异常，未正确获取 id');
      }
  } catch (err) {
    const errorMessage = err.response?.data?.error || err.message || '未知错误';
    console.error('保存失败:', errorMessage);
    
    // 根据错误类型显示不同的错误提示
    if (errorMessage.includes('缺少必要字段')) {
      alert('请确保填写了所有必要信息（代码内容、语言、主题）');
    } else if (errorMessage.includes('API')) {
      alert('服务器连接失败，请检查API配置');
    } else {
      alert(`保存失败: ${errorMessage}`);
    }
  }
  };

  return (
    <div className="container">
      <div className="controls">
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="javascript">JavaScript</option>
        </select>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="vs-light">Light</option>
          <option value="vs-dark">Dark</option>
        </select>

        <button 
          onClick={handleShare}
          disabled={!code}
        >
          {sharedId ? '更新分享' : '分享代码'}
        </button>

        {sharedId && (
          <div className="share-link">
            分享链接：{window.location.origin}/snippets/{sharedId} {/* 建议与后端路由一致 */}
          </div>
        )}
      </div>

      <div className="editor-container">
        <Editor
          height="80vh"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value)} // 实时更新 code 状态
          options={{ 
            minimap: { enabled: false },
            fontSize: 14
          }}
        />
      </div>
    </div>
  );
}

export default App;