import { nav, CAppBase, IConstructor } from 'tonva';
import { CWebUser } from 'webUser/CWebUser';
import { CMe } from 'me/CMe';
import { COrder } from 'order/COrder';
import { UQs } from 'uqs';
import { VMain } from 'VMain';
import { CUqBase } from 'CBase';
import { CProduct } from 'product/CProduct';

export class CCustomerServiceApp extends CAppBase {
    get uqs(): UQs { return this._uqs as UQs; }

    topKey: any;

    currentSalesRegion: any;
    currentLanguage: any;

    cWebUser: CWebUser;
    cProduct: CProduct;
    cMe: CMe;
    cOrder: COrder;

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        return new type(this);
    }

    protected async internalStart() {

        this.currentSalesRegion = await this.uqs.common.SalesRegion.load(1);

        this.currentLanguage = await this.uqs.common.Language.load(197);

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
