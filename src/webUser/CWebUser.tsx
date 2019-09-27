import { VPendingAuditUserList } from './VPendingAuditUserList';
import { observable } from 'mobx';
import { VPendingAuditUser } from './VPendingAuditUser';
import { VPendingAuditUserRefuse } from './VPendingAuditUserRefuse';
import { CUqBase } from 'CBase';

export class CWebUser extends CUqBase {

    @observable pendingUsers: any[];

    currentAuditingUser: any;
    webUserContact: any;

    protected async internalStart() {
        // this.pendingUsers = await this.uqs.webuser.getPendingAuditUser.table(undefined);
    }

    tab = () => this.renderView(VPendingAuditUserList);

    async getPendingUsers() {
        this.pendingUsers = await this.uqs.webuser.getPendingAuditUser.table(undefined);
    }

    async openPendingAuditUserDetail(user: any) {
        let { webUser: webUserBox } = user;
        let { id } = webUserBox;
        this.currentAuditingUser = await this.uqs.webuser.WebUser.load(id);
        this.webUserContact = await this.uqs.webuser.WebUserContact.obj({ webUser: id });
        this.openVPage(VPendingAuditUser);
    }

    /**
     * 审核通过操作
     * @param data ：包含审核通过之后的内部cid
     */
    async auditPendingUser(data: any) {
        let { id, customer: customerNo } = data;
        if (!customerNo)
            return 1;
        let customerBox = await this.uqs.customer.getCustomerByNo.obj({ customerNo: customerNo });
        if (!customerBox)
            return 2;
        let { id: customerId } = customerBox.customer;

        /*
        let teacherId = undefined;
        if (teacherNo) {
            let teacherBox = await this.uqs.customer.getCustomerByNo.obj({ customerNo: teacherNo });
            if (!teacherBox)
                return 4;
            teacherId = teacherBox.customer.id;
        }
        */

        await this.uqs.webuser.auditPendingUser.submit({ id: id, customerId: customerId });
        let { cOrder } = this.cApp;
        await cOrder.auditPendingOrder(id);
        // 刷新列表
        this.pendingUsers = await this.uqs.webuser.getPendingAuditUser.table(undefined);
    }

    /**
     * 打开审核不通过界面
     */
    openAuditRefuse = async () => {

        let reasons = await this.uqs.webuser.AuditPendingUserRefuseReason.search(undefined, 0, 100);
        this.openVPage(VPendingAuditUserRefuse, reasons);
        //await this.controller.auditPendingUserRefuse(this.data.id);
    }

    /**
     * 审核不通过操作
     * @param reasonData
     */
    async auditPendingUserRefuse(reasonData: any) {
        let { reason, comments } = reasonData;
        let { id: currentAuditingUserId } = this.currentAuditingUser;
        await this.uqs.webuser.auditPendingUserRefuse.submit({ id: currentAuditingUserId, reason: reason, comments: comments });
        /*
        let { cOrder } = this.cApp;
        await cOrder.cancelPendingOrder(currentAuditingUserId);
        */
        this.pendingUsers = await this.uqs.webuser.getPendingAuditUser.table(undefined);
    }

    /**
     * 显示待审核客户的未审核订单
     */
    renderPendingOrders = async (webUserId: bigint) => {
        let { cOrder } = this.cApp;
        return await cOrder.renderPendingOrder(webUserId);
    }
}