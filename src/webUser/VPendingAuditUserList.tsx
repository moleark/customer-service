import * as React from 'react';
import { CWebUser } from './CWebUser';
import { observer } from 'mobx-react';
import { VPage, Page, List } from 'tonva';

export class VPendingAuditUserList extends VPage<CWebUser> {

    async open(param?: any) {

    }

    render(param?: any): JSX.Element {
        return <this.content />
    }

    private renderPendingUser = (user: any) => {
        let { id, name } = user;
        return <div>
            {id} {name}
        </div>
    }

    private content = observer(() => {

        let { pendingUsers } = this.controller;
        return <Page header="待审核">
            <List items={pendingUsers} item={{ render: this.renderPendingUser }} />
        </Page>
    })
}