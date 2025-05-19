import React from 'react';
import Router from './router';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';
import './App.css';

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router />
    </ConfigProvider>
  );
};

export default App; 