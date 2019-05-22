import * as React from 'react';
import { Controller } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { VMe } from './VMe';

export class CMe extends Controller {

    private cApp: CCustomerServiceApp;
    constructor(cApp: CCustomerServiceApp, res: any) {
        super(res);
        this.cApp = cApp;
    }

    async internalStart(param?: any) {

    }

    private renderMe = () => {
        return this.renderView(VMe);
    }

    tab = () => <this.renderMe />
}
