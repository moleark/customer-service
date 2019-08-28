import { nav } from 'tonva';
import { CApp, CUq } from 'tonva';
import { consts } from './consts';
import { CWebUser } from 'webUser/CWebUser';
import { CMe } from 'me/CMe';
import { COrder } from 'order/COrder';

export class CCustomerServiceApp extends CApp {
    topKey: any;

    currentSalesRegion: any;
    currentLanguage: any;

    cUqOrder: CUq;
    cUqProduct: CUq;
    cUqCommon: CUq;
    cUqWebUser: CUq;
    cUqCustomer: CUq;
    cUqCustomerDiscount: CUq;
    cUqPromotion: CUq;
    cUqWarehouse: CUq;
    cUqMember: CUq;

    cWebUser: CWebUser;
    cMe: CMe;
    cOrder: COrder;

    protected async internalStart() {
        this.cUqOrder = this.getCUq(consts.uqOrder);
        this.cUqProduct = this.getCUq(consts.uqProduct);
        this.cUqCommon = this.getCUq(consts.uqCommon);
        this.cUqWebUser = this.getCUq(consts.uqWebUser);
        this.cUqCustomer = this.getCUq(consts.uqCustomer);
        this.cUqCustomerDiscount = this.getCUq(consts.uqCustomerDiscount);
        this.cUqPromotion = this.getCUq(consts.uqPromotion);

        this.cWebUser = new CWebUser(this, undefined);
        this.cMe = new CMe(this, undefined);
        this.cOrder = new COrder(this, undefined);

        let salesRegionTuid = this.cUqCommon.tuid('salesregion');
        this.currentSalesRegion = await salesRegionTuid.load(1);

        let languageTuid = this.cUqCommon.tuid('language');
        this.currentLanguage = await languageTuid.load(197);

        this.topKey = nav.topKey();
        this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(this.VAppMain, initTabName);
    }
}
