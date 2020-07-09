import { nav, CAppBase, IConstructor } from 'tonva';
import { CWebUser } from 'webUser/CWebUser';
import { CMe } from 'me/CMe';
import { COrder } from 'order/COrder';
import { UQs } from 'uqs';
import { VMain } from 'VMain';
import { CUqBase, CUqApp } from 'CBase';
import { CProduct } from 'product/CProduct';
import { WebUser } from 'currentUser';
import { GLOABLE } from 'configuration';

export class CCustomerServiceApp extends CUqApp {
    // get uqs(): UQs { return this._uqs; }

    topKey: any;

    currentSalesRegion: any;
    currentLanguage: any;
    currentUser: WebUser;

    cWebUser: CWebUser;
    cProduct: CProduct;
    cMe: CMe;
    cOrder: COrder;

    protected async internalStart() {

        let { uqs } = this;
        let { common } = uqs;
        let { SalesRegion, Language } = common;
        let [currentSalesRegion, currentLanguage] = await Promise.all([
            SalesRegion.load(GLOABLE.SALESREGION_CN),
            Language.load(GLOABLE.CHINESE),
        ]);
        this.currentUser = new WebUser(this.uqs);
        if (this.isLogined) {
            this.currentUser.setUser(this.user);
        }

        this.cWebUser = this.newC(CWebUser);
        this.cProduct = this.newC(CProduct);
        this.cMe = this.newC(CMe);
        this.cOrder = this.newC(COrder);

        this.topKey = nav.topKey();
        this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
    }
}
