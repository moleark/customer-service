import * as React from 'react';
import { VPage, Page, BoxId, EasyDate } from 'tonva';
import { CPointShoop } from './CPointShoop';
import { tv } from 'tonva';
import { List } from 'tonva';
import { PointProductImage } from 'tools/productImage';

export class VExchangeOrderDetail extends VPage<CPointShoop> {

    async open(order: any) {
        this.openPage(this.page, order);
    }

    private renderexchangeItem = (orderItem: any) => {
        let { product, pack, quantity, point } = orderItem;
        return <>
            {tv(product, (v) => {
                return <div className="row m-1 w-100">
                    <div title={v.description} className="col-4 m-0 p-0"><PointProductImage chemicalId={v.imageUrl} className="w-100" /></div>
                    {tv(pack, (c) => {
                        return <div className="col-8 small">
                            <div><label>{v.descriptionC}</label></div>
                            <div className="d-flex justify-content-between my-3">
                                <div className="mt-1"><b>{c.radioy}{c.unit}</b></div>
                                <div>
                                    <span className="text-danger h6">{(point * quantity)}</span>
                                    <small className="text-muted">分 ({point} × {quantity})</small>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </>;
    }

    private page = (order: any) => {
        let { brief, data } = order;
        let { no, date } = brief;
        let { exchangeItems, shippingContact, amount } = data;
        let header = <>订单详情: {no}</>
        return <Page header={header}>
            <List items={exchangeItems} item={{ render: this.renderexchangeItem }} />
            <div className="bg-white row no-gutters p-3 my-1">
                <div className="col-3 text-muted">收货地址:</div>
                <div className="col-9">{tv(shippingContact)}</div>
            </div>
            <div className="bg-white row no-gutters p-3 my-1">
                <div className="col-3 text-muted">下单时间:</div>
                <div className="col-9 text-right"><EasyDate date={date} /></div>
            </div>
            <div className="bg-white p-3 my-1 text-right">
                <span className="text-danger font-weight-bold">总积分: {amount}</span>
            </div>
        </Page>
    }
}