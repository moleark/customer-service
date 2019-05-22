import { AppUI } from 'tonva';
import { CCustomerServiceApp } from '../CCustomerServiceApp';
import { VMain } from 'VMain';

const ui: AppUI = {
    appName: "百灵威系统工程部/customer-service",
    CApp: CCustomerServiceApp,
    main: VMain as any,
    uqs: {
    },
}

export default ui;
