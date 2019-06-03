import { AppUI } from 'tonva';
import { CCustomerServiceApp } from '../CCustomerServiceApp';
import commonUI from './common';
import customerUI from './customer';
import productUI from './product';
import { VMain } from 'VMain';
import webUserUIs from './webUserUI';

const ui: AppUI = {
    appName: "百灵威系统工程部/customer-service",
    CApp: CCustomerServiceApp,
    main: VMain as any,
    uqs: {
        '百灵威系统工程部/common': commonUI,
        '百灵威系统工程部/product': productUI,
        '百灵威系统工程部/webUser': webUserUIs,
        '百灵威系统工程部/customer': customerUI,
    },
}

export default ui;
