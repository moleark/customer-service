import * as React from 'react';
import { VPage, Page, List, tv, LMR, EasyDate, Scroller } from 'tonva';
import { CWebUser } from './CWebUser';

export class VPassedWebUsers extends VPage<CWebUser> {

    async open() {
        this.openPage(this.page);
    }

    private onScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        let { passedWebUsersPager } = this.controller;
        passedWebUsersPager.more();
    }

    private page = () => {
        let { passedWebUsersPager: pageHavingAudit } = this.controller;
        let header = <>已通过</>
        return <Page header={header} onScrollBottom={this.onScrollBottom}>
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