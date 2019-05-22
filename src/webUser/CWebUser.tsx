import * as React from 'react';
import { Controller, Query } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { VPendingAuditUserList } from './VPendingAuditUserList';
import { observable } from 'mobx';

export class CWebUser extends Controller {

    private cApp: CCustomerServiceApp;
    private pendingAuditUserQuery: Query;
    @observable pendingUsers: any[];
    constructor(cApp: CCustomerServiceApp, res: any) {
        super(res);
        this.cApp = cApp;

        let { cUqWebUser } = this.cApp;
        this.pendingAuditUserQuery = cUqWebUser.query('getpendingaudituser');
    }

    protected async internalStart(param?: any) {
        let v = 1;
        this.pendingUsers = await this.pendingAuditUserQuery.table(undefined);
    }

    private renderUserList = () => {
        return this.renderView(VPendingAuditUserList);
    }

    tab = () => <this.renderUserList />
}