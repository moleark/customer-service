import { CUqBase } from '../CBase';
import { VMe } from './VMe';
import { QueryPager } from 'tonva';
import { observable } from 'mobx';
import { VHavingAudit } from './VHavingAudit';
import { VHavingRefuse } from './VHavingRefuse';

export class CMe extends CUqBase {

    @observable pageHavingAudit: QueryPager<any>;
    @observable pageHavingRefuse: QueryPager<any>;

    protected async internalStart() {

    }

    async changeWebUser(webUser: any) {
        let { currentUser } = this.cApp;
        await currentUser.changeWebUser(webUser);
    }

    async changeWebUserContact(webUserContact: any) {
        let { currentUser } = this.cApp;
        await currentUser.changeWebUserContact(webUserContact);
    }

    SearchHavingRefuseUser = async () => {
        this.pageHavingRefuse = new QueryPager(this.uqs.webuser.SearchHavingRefuseUser, 15, 30);
        this.pageHavingRefuse.first({});
    }

    SearchHavingAuditUser = async () => {
        this.pageHavingAudit = new QueryPager(this.uqs.webuser.SearchHavingAuditUser, 15, 30);
        this.pageHavingAudit.first({});
    }

    showHavingAudit = async () => {
        await this.SearchHavingAuditUser();
        this.openVPage(VHavingAudit);
    }

    showHavingRefuse = async () => {
        await this.SearchHavingRefuseUser();
        this.openVPage(VHavingRefuse);
    }

    tab = () => this.renderView(VMe);
}