import { AppConfig } from 'tonva';
import { tvs } from 'tvs';

export const appConfig: AppConfig = {
    appName: "百灵威系统工程部/customer-service",
    version: "1.0.5",                   // 版本变化，缓存的uqs才会重载
    tvs: tvs,
};

const GLOABLE = {
    CHINA: 44,
    CHINESE: 196,
    SALESREGION_CN: 1,
    TIPDISPLAYTIME: 3000,
}

/*
const GLOABLE = {
    CHINA: 43,
    CHINESE: 197,
    SALESREGION_CN: 4,
    TIPDISPLAYTIME: 3000,
}
*/

export default GLOABLE;