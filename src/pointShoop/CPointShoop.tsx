import { VPendingExchangeOrderList } from './VPendingExchangeOrderList';
import { VExchangeOrderDetail } from './VExchangeOrderDetail';
import { CUqBase } from 'CBase';
import { BoxId } from 'tonva';

export class CPointShoop extends CUqBase {

    async internalStart(param: any) {
    }

    /**
     * 获取未审核的兑换单列表
     */
    async getAuditPendingExchangeOrder(webUserId: number) {
        let { PointExchangeSheet } = this.uqs.积分商城;
        return await PointExchangeSheet.userSheets("matching", webUserId, 0, 100);
    }

    async renderPendingExchangeOrders(webUserId: number) {
        let pendingAuditExchangeOrders = await this.getAuditPendingExchangeOrder(webUserId);
        return this.renderView(VPendingExchangeOrderList, pendingAuditExchangeOrders);
    }

    async auditPendingExchangeOrder(webUserId: number) {
        let { PointExchangeSheet } = this.uqs.积分商城;
        let pendingAuditExchangeOrders = await this.getAuditPendingExchangeOrder(webUserId);
        for (let i = 0; i < pendingAuditExchangeOrders.length; i++) {
            let order = pendingAuditExchangeOrders[i];
            let { id, flow } = order;
            await PointExchangeSheet.action(id, flow, 'matching', "Pass");
        }
    }

    openExchangeOrderDetail = async (orderId: number) => {
        let exchangeOrder = await this.uqs.积分商城.PointExchangeSheet.getSheet(orderId);
        this.openVPage(VExchangeOrderDetail, exchangeOrder);
    }
}

