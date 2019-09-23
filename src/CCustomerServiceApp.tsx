import { nav, CAppBase, IConstructor } from 'tonva';
import { CWebUser } from 'webUser/CWebUser';
import { CMe } from 'me/CMe';
import { COrder } from 'order/COrder';
import { UQs } from 'uqs';
import { VMain } from 'VMain';
import { CUqBase } from 'CBase';
import { CProduct } from 'product/CProduct';
import { WebUser } from 'currentUser';
import GLOABLE from 'ui';

export class CCustomerServiceApp extends CAppBase {
    get uqs(): UQs { return this._uqs as UQs; }

    topKey: any;

    currentSalesRegion: any;
    currentLanguage: any;
    currentUser: WebUser;

    cWebUser: CWebUser;
    cProduct: CProduct;
    cMe: CMe;
    cOrder: COrder;

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        return new type(this);
    }

    protected async internalStart() {

        this.currentSalesRegion = await this.uqs.common.SalesRegion.load(GLOABLE.SALESREGION_CN);
        this.currentLanguage = await this.uqs.common.Language.load(GLOABLE.CHINESE);
        this.currentUser = new WebUser(this.uqs);
        this.currentUser.setUser(this.user);

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
