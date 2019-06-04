import * as React from 'react';
import { Controller, Query, Map, Tuid, Action } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { VPendingAuditUserList } from './VPendingAuditUserList';
import { observable } from 'mobx';
import { VPendingAuditUser } from './VPendingAuditUser';

export class CWebUser extends Controller {

    private cApp: CCustomerServiceApp;
    private webUserTuid: Tuid;
    private webUserContactMap: Map;
    private pendingAuditUserQuery: Query;
    private auditPendingUserAction: Action;
    private auditPendingUserRefuseAction: Action;

    private getCustomerByNoQuery: Query;

    @observable pendingUsers: any[];
    webUserContact: any;
    constructor(cApp: CCustomerServiceApp, res: any) {
        super(res);
        this.cApp = cApp;

        let { cUqWebUser, cUqCustomer } = this.cApp;
        this.webUserTuid = cUqWebUser.tuid('webUser');
        this.webUserContactMap = cUqWebUser.map('webUserContact');
        this.pendingAuditUserQuery = cUqWebUser.query('getpendingaudituser');
        this.auditPendingUserAction = cUqWebUser.action('auditPendingUser');
        this.auditPendingUserRefuseAction = cUqWebUser.action('auditPendingUserRefuse');
        this.getCustomerByNoQuery = cUqCustomer.query('getCustomerByNo');
    }

    protected async internalStart(param?: any) {
        this.pendingUsers = await this.pendingAuditUserQuery.table(undefined);
    }

    private renderUserList = () => {
        return this.renderView(VPendingAuditUserList);
    }

    tab = () => <this.renderUserList />

    async openPendingAuditUserDetail(user: any) {
        let { webUser: webUserBox } = user;
        let { id } = webUserBox;
        let webUser = await this.webUserTuid.load(id);
        this.webUserContact = await this.webUserContactMap.obj({ webUser: id });
        this.openVPage(VPendingAuditUser, webUser);
    }

    async auditPendingUser(data: any) {
        let { id, customer: customerNo, teacher: teacherNo } = data;
        if (!customerNo)
            return 1;
        let customer = await this.getCustomerByNoQuery.obj({ customerNo: customerNo });
        if (!customer)
            return 2;

        let { id: customerId } = customer;
        let teacherId;
        if (teacherNo) {
            let teacher = await this.getCustomerByNoQuery.obj({ customerNo: teacherNo });
            if (!teacher)
                return 4;
            teacherId = teacher.id;
        }

        await this.auditPendingUserAction.submit({ id: id, customerId: customerId, teacherId: teacherId });
        let { cOrder } = this.cApp;
        await cOrder.auditPendingOrder(id);
        // 刷新列表
        this.pendingUsers = await this.pendingAuditUserQuery.table(undefined);
    }

    async auditPendingUserRefuse(webUserId: number) {
        await this.auditPendingUserRefuseAction.submit({ id: webUserId });
        this.pendingUsers = await this.pendingAuditUserQuery.table(undefined);
    }

    renderPendingOrders = async (webUserId: bigint) => {
        let { cOrder } = this.cApp;
        return await cOrder.renderPendingOrder(webUserId);
    }
}