import React from 'react';
//import logo from './logo.svg';
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

  /*
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  */
}

export default App;
