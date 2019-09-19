import * as React from 'react';
import { AppUI, CApp } from './app';
//import { nav } from '../components';

function convertUIKeyToLowercase(obj: any) {
    for (let i in obj) {
        let v = obj[i];
        obj[i.toLowerCase()] = v;
        if (typeof v !== 'object') continue;
        if (React.isValidElement(v)) continue;
        if (Array.isArray(v) !== true) {
            convertUIKeyToLowercase(v);
            continue;
        }
        for (let i of (v as any[])) {
            convertUIKeyToLowercase(i);
        }
    }
}

// const appName = 'JKDev/jkOrder';
export async function startApp(ui: AppUI) {
    convertUIKeyToLowercase(ui);
    let cApp = new ((ui && ui.CApp) || CApp)(ui);
    await cApp.start();
}
