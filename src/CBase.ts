import { CSub, CBase, CAppBase, IConstructor } from "tonva";
import { UQs } from "./uqs";
import { CCustomerServiceApp } from "CCustomerServiceApp";

export abstract class CUqBase extends CBase {
    get cApp(): CCustomerServiceApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs }
}

/*
export abstract class CUqSub extends CSub {
    get cApp(): CCustomerServiceApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs }
    protected get owner(): CUqBase { return this._owner as CUqBase }
    // protected readonly owner: CUqBase;
}
*/

export abstract class CUqApp extends CAppBase {
    get uqs(): UQs { return this._uqs };

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        let c = new type(this);
        c.init();
        return c;
    }
}