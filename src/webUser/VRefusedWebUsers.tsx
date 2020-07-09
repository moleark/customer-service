import * as React from 'react';
import { VPage, Page, List, tv, LMR, EasyDate, Scroller } from 'tonva';
import { CWebUser } from './CWebUser';

export class VRefusedWebUsers extends VPage<CWebUser> {

    async open() {
        this.openPage(this.page);
    }

    private onScrollBottom = async (scroller: Scroller) => {
        scroller.scrollToBottom();
        let { refusedWebUsersPager } = this.controller;
        refusedWebUsersPager.more();
    }

    private page = () => {
        let { refusedWebUsersPager: pageHavingRefuse } = this.controller;
        let header = <>不通过</>
        return <Page header={header} onScrollBottom={this.onScrollBottom}>
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


