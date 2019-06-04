import { Controller, Query, Sheet } from 'tonva';
import { CCustomerServiceApp } from 'CCustomerServiceApp';
import { VPendingOrderList } from './VPendingOrderList';
import { VOrderDetail } from './VOrderDetail';
import { LoaderProductChemical } from 'product/productLoader';

export class COrder extends Controller {

    private cApp: CCustomerServiceApp;
    private pendingAuditOrdersQuery: Query;
    private orderSheet: Sheet;
    constructor(cApp: CCustomerServiceApp, res: any) {
        super(res);

        this.cApp = cApp;
        let { cUqOrder } = cApp;
        this.orderSheet = cUqOrder.sheet('order');
        this.pendingAuditOrdersQuery = cUqOrder.query('getPendingAuditOrders');
    }

    async internalStart(param: any) {

    }

    async renderPendingOrder(webUserId: bigint) {
        let pendingAuditOrders = await this.pendingAuditOrdersQuery.table({ webUser: webUserId });
        return this.renderView(VPendingOrderList, pendingAuditOrders);
    }

    async auditPendingOrder(webUserId: bigint) {
        let pendingAuditOrders = await this.pendingAuditOrdersQuery.table({ webUser: webUserId });
        for (let i = 0; i < pendingAuditOrders.length; i++) {
            let order = pendingAuditOrders[i];
            let { id, flow, state } = order;
            await this.orderSheet.action(id, flow, state, "Pass");
        }
    }

    openOrderDetail = async (orderId: number) => {

        let order = await this.orderSheet.getSheet(orderId);
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
