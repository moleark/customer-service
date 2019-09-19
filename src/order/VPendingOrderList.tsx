import * as React from 'react';
import { View, List, EasyDate } from 'tonva';
import { COrder } from './COrder';

export class VPendingOrderList extends View<COrder> {

    private renderOrder = (order: any, index: number) => {
        let { openOrderDetail } = this.controller;
        let { id, no, date } = order;
        return <div className="m-3 justify-content-between cursor-pointer" onClick={() => openOrderDetail(id)}>
            <div><span className="small text-muted">订单编号: </span><strong>{no}</strong></div>
            <div className="small text-muted"><EasyDate date={date} /></div>
        </div>;
    }

    render(pendingOrders?: any): JSX.Element {
        return <List items={pendingOrders} item={{ render: this.renderOrder }} none='无未审核订单'></List>;
    }
}