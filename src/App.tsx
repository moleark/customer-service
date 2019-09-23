import React from 'react';
import './App.css';
import { NavView, AppConfig, start, nav } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { tvs } from 'tvs';

const appConfig: AppConfig = {
  appName: "百灵威系统工程部/customer-service",
  version: "1.0.3",                   // 版本变化，缓存的uqs才会重载
  tvs: tvs,
};

nav.setSettings(appConfig);

const App: React.FC = () => {

  let onLogined = async () => {
    await start(CCustomerServiceApp, appConfig);
  }

  return <NavView onLogined={onLogined} />;
}

export default App;