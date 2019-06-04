import * as React from 'react';
import { CWebUser } from './CWebUser';
import { observer } from 'mobx-react';
import { VPage, Page, List, LMR, FA, tv } from 'tonva';

export class VPendingAuditUserList extends VPage<CWebUser> {

    async open(param?: any) {

    }

    render(param?: any): JSX.Element {
        return <this.content />
    }

    private renderPendingUser = (item: any) => {
        let { webUser } = item;
        let right = <FA name="chevron-right" className="chevron-right align-self-center"></FA>
        return <LMR right={right} className="p-3">
            {tv(webUser)}
        </LMR>
    }

    private onUserClick = async (user: any) => {
        await this.controller.openPendingAuditUserDetail(user);
    }

    private content = observer(() => {

        let { pendingUsers } = this.controller;
        return <Page header="待审核客户">
            <List items={pendingUsers} item={{ render: this.renderPendingUser, onClick: this.onUserClick }} />
        </Page>
    })
}