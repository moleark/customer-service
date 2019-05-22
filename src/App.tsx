import * as React from 'react';
import './App.css';
import { NavView } from 'tonva';
import { startApp } from 'tonva';
import ui from './ui';

//const tonvaApp = "bruce/TestApp";

class App extends React.Component {

    private onLogined = async () => {
        await startApp(ui);
    }
    public render() {
        return <NavView onLogined={this.onLogined} />
    }
}

export default App;