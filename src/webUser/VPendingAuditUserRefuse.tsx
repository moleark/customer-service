import * as React from 'react';
import { VPage, Page } from 'tonva';
import { CWebUser } from './CWebUser';

export class VPendingAuditUserRefuse extends VPage<CWebUser> {

    async open(param: any) {
        this.openPage(this.page);
    }

    private page = () => {
        return <Page header='审核不通过'>
            <div>gegege</div>
        </Page>
    }
}