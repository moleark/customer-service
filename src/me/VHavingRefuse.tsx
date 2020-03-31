import * as React from 'react';
import { VPage, Page, List, tv, LMR, EasyDate } from 'tonva';
import { CMe } from './CMe';

export class VHavingRefuse extends VPage<CMe> {

    async open(order: any) {
        this.openPage(this.page, order);
    }

    private page = (order: any) => {
        let { pageHavingRefuse } = this.controller;
        let header = <>已驳回 </>
        return <Page header={header}>
            <List before={""} none={"无"} items={pageHavingRefuse} item={{ render: this.renderItem }} />
        </Page>
    }

    private renderItem = (item: any, index: number) => {
        let { webUser, comments, date } = item;
        let right = <div className="small text-muted" ><EasyDate date={date}></EasyDate></div>
        let content = comments ? <div className="samll samll text-muted mt-3">原因：{comments}</div> : <div></div>

        return <LMR className="p-3" right={right} >
            {tv(webUser)}
            {content}
        </LMR>
    };
}

