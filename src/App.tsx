import * as React from 'react';
import './App.css';
import { NavView, nav, start } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { appConfig } from 'configuration';

//const tonvaApp = "bruce/TestApp";
nav.setSettings(appConfig);

class App extends React.Component {

    private onLogined = async () => {
        await start(CCustomerServiceApp, appConfig);
    }
    public render() {
        return <NavView onLogined={this.onLogined} />
    }
}

export default App;