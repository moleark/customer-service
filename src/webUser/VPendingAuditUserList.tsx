import * as React from 'react';
import { CWebUser } from './CWebUser';
import { observer } from 'mobx-react';
import { VPage, Page, List, LMR, FA, tv, DropdownAction, DropdownActions, View } from 'tonva';

export class VPendingAuditUserList extends VPage<CWebUser> {

    async open(param?: any) {

    }

    render(param?: any): JSX.Element {
        this.controller.getPendingUsers();
        return <this.pageContent />
    }

    private renderPendingUser = (item: any) => {
        let { webUser } = item;
        let right = <FA name="chevron-right" className="chevron-right align-self-center"></FA>
        return <LMR right={right} className="p-3">
            {tv(webUser)}
        </LMR>
    }

    private showUserDetail = async (user: any) => {
        await this.controller.openPendingAuditUserDetail(user);
    }

    private pageContent = observer(() => {

        let { pendingUsers, showPassedWebUsers, showRefusedWebUsers } = this.controller;
        let actions: DropdownAction[] = [
            {
                icon: 'get-pocket',
                caption: '已通过',
                action: showPassedWebUsers
            },
            {
                icon: 'get-pocket',
                caption: '不通过',
                action: showRefusedWebUsers
            }
        ];
        let right = <DropdownActions className="align-self-center mr-1" icon="navicon" actions={actions} />;
        return <Page header="待审核客户" back="none" right={right}>
            <List items={pendingUsers} none="暂无待审核客户" item={{ render: this.renderPendingUser, onClick: this.showUserDetail }} />
        </Page>
    })
}