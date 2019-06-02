import * as React from 'react';
import { VPage, Page, List, Form, Schema, UiSchema, UiInputItem, UiButton, Context, FA } from 'tonva';
import { CWebUser } from './CWebUser';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'customer', type: 'string', required: true },
    { name: 'teacher', type: 'string', required: false },
    { name: 'submit', type: 'submit' },
];
const uiSchema: UiSchema = {
    items: {
        id: { visible: false },
        customer: { widget: 'text', label: '客户CID', placeholder: '客户CID' } as UiInputItem,
        teacher: { widget: 'text', label: '老师CID', placeholder: '老师CID' } as UiInputItem,
        submit: { widget: 'button', label: '审核通过', visible: false, className: "btn btn-primary" } as UiButton,
    }
}

export class VPendingAuditUser extends VPage<CWebUser> {

    private form: Form;
    private data: any = {};
    private pendingOrderList: JSX.Element;
    @observable displayTip: boolean = false;
    private tip: string;
    async open(user?: any) {
        this.pendingOrderList = await this.controller.renderPendingOrders(user.id);
        this.openPage(this.page, user);
    }

    private auditPendingUser = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        let { data } = context.form;
        let { customer, teacher } = data;
        this.data.customer = customer;
        this.data.teacher = teacher;
        this.displayTip = false;

        let ret = await this.controller.auditPendingUser(data);
        switch (ret) {
            case 1:
                this.tip = "审核失败，必须填写客户CID!";
                break;
            case 2:
                this.tip = "审核失败，你填写的客户CID不存在!";
                break;
            case 4:
                this.tip = "审核失败，你填写的老师CID不存在!";
                break;
            default:
                this.tip = "审核成功!";
                break;
        }
        this.displayTip = true;
    }

    private auditPendingUserRefuse = async () => {
        await this.controller.auditPendingUserRefuse(this.data.id);
    }

    private page = observer((user: any) => {

        let { webUserContact } = this.controller;
        let { id, firstName, lastName, gender, salutation, organizationName, departmentName } = user;

        let contactInfoUi = <div className="col-12 text-danger">该用户未填写手机号、电话或Email信息</div>;
        if (webUserContact) {
            let { telephone, mobile, email } = webUserContact;
            contactInfoUi = <>
                <div className="col-4 text-muted">手机:</div>
                <div className="col-8"><a href={`tel:${mobile}`}>{mobile}</a></div>
                <div className="col-4 text-muted">电话:</div>
                <div className="col-8"><a href={`tel:${telephone}`}>{telephone}</a></div>
                <div className="col-4 text-muted">Email:</div>
                <div className="col-8"><a href={`mailto:${email}`}>{email}</a></div>
            </>;
        }
        let tips = <></>;
        if (this.displayTip) {
            tips = <div className="text-danger"><FA name="exclamation-circle" className="exclamation-circle"></FA> {this.tip}</div>
        }

        this.data.id = id;
        let footer = <div className="justify-content-end">
            <button type="button"
                className="btn btn-primary w-40 mx-3"
                onClick={this.auditPendingUser}>审核通过</button>
            <button type="button"
                className="btn btn-primary w-40 mx-3"
                onClick={this.auditPendingUserRefuse}>审核不通过</button>
        </div>
        return <Page header="待审核客户详情" footer={footer}>
            <div className="row bg-white p-3">
                <div className="col-12"><strong className="large">{firstName}</strong> <span className="small text-muted">{salutation}</span></div>
                {contactInfoUi}
                <div className="col-4 text-muted">单位:</div>
                <div className="col-8">{organizationName}</div>
                <div className="col-4 text-muted">部门:</div>
                <div className="col-8">{departmentName}</div>
            </div>
            <div className="bg-white p-3 mt-1">
                未审核订单列表
            </div>
            {this.pendingOrderList}
            <div className="bg-white p-3 mt-1">
                <div>审核</div>
                {tips}
            </div>
            <Form ref={v => this.form = v} schema={schema}
                uiSchema={uiSchema}
                formData={this.data}
                className="bg-white px-3 pb-3"
                onButtonClick={this.onFormButtonClick}></Form>
        </Page>
    });
}