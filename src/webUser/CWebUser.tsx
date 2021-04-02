import { VPendingAuditUserList } from './VPendingAuditUserList';
import { observable } from 'mobx';
import { VPendingAuditUser } from './VPendingAuditUser';
import { VPendingAuditUserRefuse } from './VPendingAuditUserRefuse';
import { CUqBase } from 'CBase';
import { QueryPager } from 'tonva';
import { VPassedWebUsers } from './VPassedWebUsers';
import { VRefusedWebUsers } from './VRefusedWebUsers';

export class CWebUser extends CUqBase {

    @observable pendingUsers: any[];
    @observable passedWebUsersPager: QueryPager<any>;
    @observable refusedWebUsersPager: QueryPager<any>;

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
        let { uqs } = this;
        let { webuser } = uqs;
        this.currentAuditingUser = await webuser.WebUser.load(webUserBox);
        this.webUserContact = await webuser.WebUserContact.obj({ webUser: webUserBox });
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
        customerNo = customerNo.trim();

        if (!customerNo)
            return 1;
        let customerResult = await getCustomerByNo.obj({ customerNo: customerNo });
        if (!customerResult)
            return 2;
        let { customer } = customerResult;

        let buyerAccountNo = customerNo;
        let buyerAccountInner = await customer.assure();
        if (teacherNo) {
            // step1:确保输入的Teacher的CID存在
            teacherNo = teacherNo.trim();
            let teacherBox = await getCustomerByNo.obj({ customerNo: teacherNo });
            if (!teacherBox)
                return 4;
            buyerAccountNo = teacherNo;
            buyerAccountInner = await teacherBox.customer.assure();
        }

        /* 创建buyeraccount */
        let buyerAccount = await getBuyerAccountByNo.obj({ buyerAccountNo: buyerAccountNo });
        if (!buyerAccount) {
            // 用内部CID的信息新建BuyerAccount
            let { id, name, xyz } = buyerAccountInner.obj;
            let organizationBox = await getCustomerOrganization.obj({ customerId: id });
            buyerAccount = await BuyerAccountTuid.save(undefined,
                {
                    "organization": organizationBox && organizationBox.organization,
                    "description": name, "xyz": xyz, "no": buyerAccountNo, "createTime": Date.now(), "isValid": 1
                });
        }

        let { auditPendingUser, getPendingAuditUser } = uqWebUser;
        await auditPendingUser.submit({ id: id, customerId: customer, buyerAccountId: buyerAccount });

        let { cOrder, cPointShoop } = this.cApp;
        await cOrder.auditPendingOrder(id, buyerAccount);
        await cPointShoop.auditPendingExchangeOrder(id);
        // 刷新列表
        this.pendingUsers = await getPendingAuditUser.table(undefined);
    }

    /**
     * 
     */
    searchPassedWebUsers = async () => {
        this.passedWebUsersPager = new QueryPager(this.uqs.webuser.SearchHavingAuditUser, 15, 30);
        this.passedWebUsersPager.first({});
    }

    /**
     * 
     */
    showPassedWebUsers = async () => {
        await this.searchPassedWebUsers();
        this.openVPage(VPassedWebUsers);
    }

    /**
     * 打开审核不通过界面
     */
    openAuditRefuse = async () => {

        let reasons = await this.uqs.webuser.AuditPendingUserRefuseReason.search(undefined, 0, 100);
        this.openVPage(VPendingAuditUserRefuse, reasons);
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
     * 
     */
    searchRefusedWebUsers = async () => {
        this.refusedWebUsersPager = new QueryPager(this.uqs.webuser.SearchHavingRefuseUser, 15, 30);
        this.refusedWebUsersPager.first({});
    }

    /**
     * 显示审核不通过的客户信息 
     */
    showRefusedWebUsers = async () => {
        await this.searchRefusedWebUsers();
        this.openVPage(VRefusedWebUsers);
    }

    /**
     * 显示待审核客户的未审核订单
     */
    renderPendingOrders = async (webUserId: number) => {
        let { cOrder } = this.cApp;
        return await cOrder.renderPendingOrder(webUserId);
    }
    renderPendingExchangeOrders = async (webUserId: number) => {
        let { cPointShoop } = this.cApp;
        return await cPointShoop.renderPendingExchangeOrders(webUserId);
    }
}