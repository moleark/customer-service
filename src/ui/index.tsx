import { AppUI } from 'tonva';
import { CCustomerServiceApp } from '../CCustomerServiceApp';
import commonUI from './common';
import customerUI from './customer';
import productUI from './product';
import { VMain } from 'VMain';
import webUserUIs from './webUserUI';
/*
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
    version: '0.0.1'
}

export default ui;
*/

/*
export const GLOABLE = {
    CHINA: 44,
    CHINESE: 196,
    SALESREGION_CN: 1,
    ROOTCATEGORY: {
        47: {
            src: OrganicChemistry,
            labelColor: 'text-info',
        },
        470: {
            src: AnalyticalChemistry,
            labelColor: 'text-success',
        },
        1013: {
            src: LifeScience,
            labelColor: 'text-danger',
        },
        1219: {
            src: MaterialScience,
            labelColor: 'text-warning',
        },
        1545: {
            src: LabSupplies,
            labelColor: 'text-primary',
        },
    }
}
*/

const GLOABLE = {
    CHINA: 43,
    CHINESE: 197,
    SALESREGION_CN: 4,
    TIPDISPLAYTIME: 3000,
}

export default GLOABLE;