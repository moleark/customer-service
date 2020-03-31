import React from 'react';
import './App.css';
import { NavView, start, nav } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { appConfig } from 'configuration';

nav.setSettings(appConfig);
const App: React.FC = () => {

    let onLogined = async () => {
        await start(CCustomerServiceApp, appConfig);

    }

    return <NavView onLogined={onLogined} />;
}

export default App;