import * as React from 'react';
import { View, List, EasyDate } from 'tonva';
import { CPointShoop } from './CPointShoop';

export class VPendingExchangeOrderList extends View<CPointShoop> {

    private renderExchangeOrder = (order: any) => {
        let { openExchangeOrderDetail } = this.controller;
        let { id, no, date } = order;
        return <div className="m-3 justify-content-between cursor-pointer" onClick={() => openExchangeOrderDetail(id)}>
            <div><span className="small text-muted">兑换单号: </span><strong>{no}</strong></div>
            <div className="small text-muted"><EasyDate date={date} /></div>
        </div>;
    }

    render(pendingExchangeOrders?: any): JSX.Element {
        return <List items={pendingExchangeOrders} item={{ render: this.renderExchangeOrder }} none='无未审核兑换单'></List>;
    }
}