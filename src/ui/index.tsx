import { AppUI } from 'tonva';
import { CCustomerServiceApp } from '../CCustomerServiceApp';
import { VMain } from 'VMain';
import webUserUIs from './webUserUI';

const ui: AppUI = {
    appName: "百灵威系统工程部/customer-service",
    CApp: CCustomerServiceApp,
    main: VMain as any,
    uqs: {
        '百灵威系统工程部/webUser': webUserUIs,
    },
}

export default ui;
