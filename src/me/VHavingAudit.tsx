import * as React from 'react';
import { VPage, Page, List, tv, LMR, EasyDate } from 'tonva';
import { CMe } from './CMe';

export class VHavingAudit extends VPage<CMe> {

    async open(order: any) {
        this.openPage(this.page, order);
    }

    private page = (order: any) => {
        let { pageHavingAudit } = this.controller;
        let header = <>已审批</>
        return <Page header={header}>
            <List before={""} none={"无"} items={pageHavingAudit} item={{ render: this.renderItem }} />
        </Page>
    }

    private renderItem = (item: any, index: number) => {
        let { webUser, date } = item;
        let right = <div className="small text-muted" ><EasyDate date={date}></EasyDate></div>
        return <LMR className="p-3" right={right}>
            {tv(webUser)}
        </LMR>
    };
}

