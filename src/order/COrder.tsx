import { VPendingOrderList } from './VPendingOrderList';
import { VOrderDetail } from './VOrderDetail';
import { LoaderProductChemical } from 'product/productLoader';
import { CUqBase } from 'CBase';
import { BoxId } from 'tonva';

export class COrder extends CUqBase {

    async internalStart(param: any) {

    }

    async renderPendingOrder(webUserId: bigint) {
        let pendingAuditOrders = await this.uqs.order.GetPendingAuditOrders.table({ webUser: webUserId });
        return this.renderView(VPendingOrderList, pendingAuditOrders);
    }

    async auditPendingOrder(webUserId: bigint) {
        let pendingAuditOrders = await this.uqs.order.GetPendingAuditOrders.table({ webUser: webUserId });
        for (let i = 0; i < pendingAuditOrders.length; i++) {
            let order = pendingAuditOrders[i];
            let { id, flow, state } = order;
            await this.uqs.order.Order.action(id, flow, state, "Pass");
        }
    }

    openOrderDetail = async (orderId: number) => {

        let order = await this.uqs.order.Order.getSheet(orderId);
        let { data } = order;
        let { orderitems } = data;
        let orderItemsGrouped = orderItemGroupByProduct(orderitems);
        let loaderProduct = new LoaderProductChemical(this.cApp);
        for (let i = 0; i < orderItemsGrouped.length; i++) {
            let productId = orderItemsGrouped[i].product.id;
            orderItemsGrouped[i].product = await loaderProduct.load(productId);
        }
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