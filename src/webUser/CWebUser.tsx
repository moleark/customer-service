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

        let { customer: uqCustomer, webuser: uqWebUser } = this.uqs;
        let { getCustomerByNo, getBuyerAccountByNo, getCustomerOrganization, BuyerAccount: BuyerAccountTuid } = uqCustomer;

        let { id, customer: customerNo, teacher: teacherNo } = data;
        if (!customerNo)
            return 1;
        let customerResult = await getCustomerByNo.obj({ customerNo: customerNo.trim() });
        if (!customerResult)
            return 2;
        let { customer } = customerResult;

        let buyerAccount = customer;
        if (teacherNo) {
            // step1:确保输入的Teacher的CID存在
            let teacherBox = await getCustomerByNo.obj({ customerNo: teacherNo.trim() });
            if (!teacherBox)
                return 4;

            let teacherBuyerAccount = await getBuyerAccountByNo.obj({ buyerAccountNo: teacherNo });
            if (!teacherBuyerAccount) {
                // 用内部CID的信息新建BuyerAccount
                let { customer: buyerAccountInner } = teacherBox;
                let { id, name, firstName, lastName, xyz, createTime } = buyerAccountInner;
                let organizationBox = await getCustomerOrganization.obj({ customerId: id });
                teacherBuyerAccount = await BuyerAccountTuid.save(undefined,
                    {
                        "organization": organizationBox && organizationBox.organization,
                        "description": name, "xyz": xyz, "no": teacherNo, "createTime": createTime, "isValid": 1
                    });
                // 设置buyerAccount为老师的账号
                buyerAccount = teacherBuyerAccount;
            }
        }
        let { WebUserBuyerAccount, auditPendingUser, getPendingAuditUser } = uqWebUser;
        // 创建WebUser和BuyerAccount的关联
        await WebUserBuyerAccount.add({ webUser: id, arr1: [{ buyerAccount: buyerAccount }] });
        await auditPendingUser.submit({ id: id, customerId: customer });
        let { cOrder } = this.cApp;
        await cOrder.auditPendingOrder(id, buyerAccount);
        // 刷新列表
        this.pendingUsers = await getPendingAuditUser.table(undefined);
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