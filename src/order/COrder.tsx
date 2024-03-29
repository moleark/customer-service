import { VPendingOrderList } from './VPendingOrderList';
import { VOrderDetail } from './VOrderDetail';
import { CUqBase } from 'CBase';
import { BoxId } from 'tonva';

export class COrder extends CUqBase {

    async internalStart(param: any) {
    }

    async renderPendingOrder(webUserId: number) {
        let pendingAuditOrders = await this.uqs.order.Order.userSheets("matching", webUserId, 0, 100);
        return this.renderView(VPendingOrderList, pendingAuditOrders);
    }

    async auditPendingOrder(webUserId: number, buyAccount: BoxId) {
        let { Order: OrderSheet, OrderBuyerAccount } = this.uqs.order;
        let pendingAuditOrders = await OrderSheet.userSheets("matching", webUserId, 0, 100);
        for (let i = 0; i < pendingAuditOrders.length; i++) {
            let order = pendingAuditOrders[i];
            let { id, flow } = order;
            // 建立map
            await OrderBuyerAccount.add({ order: order, arr1: [{ buyerAccount: buyAccount }] })
            await OrderSheet.action(id, flow, 'matching', "Pass");
        }
    }

    openOrderDetail = async (orderId: number) => {

        let order = await this.uqs.order.Order.getSheet(orderId);
        let { data } = order;
        let { orderItems } = data;
        let orderItemsGrouped = orderItemGroupByProduct(orderItems);
        data.orderItems = orderItemsGrouped;
        this.openVPage(VOrderDetail, order);
    }

    renderOrderItemProduct = (product: BoxId) => {
        let { cProduct } = this.cApp;
        return cProduct.renderCartProduct(product);
    }
}

export function orderItemGroupByProduct(packItems: any[]) {
    let result: any[] = [];
    for (let cd of packItems) {
        let { product, pack, quantity, price, currency } = cd;
        let cpi = result.find(e => e.product.id === product.id);
        if (cpi === undefined) {
            cpi = { product: product, packs: [] };
            result.push(cpi);
        }
        let packRow: any = {
            pack: pack,
            price: price,
            quantity: quantity,
            currency: currency && currency.id
        }
        cpi.packs.push(packRow);
    }
    return result;
}