import * as React from 'react';
import { VPage, Page, Form, Schema, UiSchema, UiInputItem, UiButton, Context, FA, LMR } from 'tonva';
import { CWebUser } from './CWebUser';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import GLOABLE from 'ui';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'customer', type: 'string', required: true },
    { name: 'teacher', type: 'string', required: false },
    { name: 'submit', type: 'submit' },
];

const uiSchema: UiSchema = {
    items: {
        id: { visible: false },
        customer: {
            widget: 'text', label: '客户CID', placeholder: '客户CID', rules: (value) => {
                return value && value.length > 30 ? 'CID过长，请检查后输入。' : undefined;
            }
        } as UiInputItem,
        teacher: {
            widget: 'text', label: '老师CID', placeholder: '老师CID', rules: (value) => {
                return value && value.length > 30 ? 'CID过长，请检查后输入。' : undefined;
            }
        } as UiInputItem,
        submit: { widget: 'button', label: '审核通过', visible: false, className: "btn btn-primary" } as UiButton,
    }
}

export class VPendingAuditUser extends VPage<CWebUser> {

    private form: Form;
    private data: any = {};
    private pendingOrderList: JSX.Element;
    @observable tips: JSX.Element;

    async open(param?: any) {
        let { currentAuditingUser } = this.controller;
        this.pendingOrderList = await this.controller.renderPendingOrders(currentAuditingUser.id);
        this.openPage(this.page, param);
    }

    private auditPendingUser = async () => {
        if (!this.form) return;
        await this.form.buttonClick("submit");
    }

    private onFormButtonClick = async (name: string, context: Context) => {
        let { data } = context.form;
        let { customer, teacher } = data;
        // 为了在界面更新后仍显示填写的内容，需要将结果保存起来
        this.data.customer = customer;
        this.data.teacher = teacher;

        let ret = await this.controller.auditPendingUser(data);
        switch (ret) {
            case 1:
                this.tips = <div className="alert alert-danger" role="alert">
                    <FA name="exclamation-circle" className="exclamation-circle mr-2"></FA>审核失败，必须填写客户CID!
                </div>
                break;
            case 2:
                this.tips = <div className="alert alert-danger" role="alert">
                    <FA name="exclamation-circle" className="exclamation-circle mr-2"></FA>审核失败，你填写的客户CID不存在!
                </div>
                break;
            case 4:
                this.tips = <div className="alert alert-danger" role="alert">
                    <FA name="exclamation-circle" className="exclamation-circle mr-2"></FA>审核失败，你填写的老师CID不存在!
                </div>
                break;
            default:
                let leftseconds = 3;
                this.tips = <div className="alert alert-success" role="alert">
                    <FA name="check-circle" className="check-circle mr-2"></FA>审核成功{leftseconds}
                </div>
                let h = setInterval(() => {
                    leftseconds--;
                    this.tips = <div className="alert alert-success" role="alert">
                        <FA name="check-circle" className="check-circle mr-2"></FA>审核成功{leftseconds}
                    </div>
                }, 1000);
                setTimeout(() => {
                    clearInterval(h);
                    this.backPage();
                }, 3000);
                break;
        }
        setTimeout(() => {
            this.tips = undefined;
        }, GLOABLE.TIPDISPLAYTIME);
    }

    private page = observer(() => {

        let { currentAuditingUser, webUserContact, openAuditRefuse } = this.controller;
        let { id, firstName, salutation, organizationName, departmentName } = currentAuditingUser;

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

        this.data.id = id;
        let footer = <LMR
            right={<button type="button"
                className="btn btn-primary m-1"
                onClick={this.auditPendingUser}>通过</button>}
            left={
                <button type="button"
                    className="btn btn-outline-primary m-1"
                    onClick={openAuditRefuse}>不通过</button>}
        />
        return <Page header="待审核客户详情" footer={footer}>
            <div className="bg-white p-3 mt-1">
                <strong className="large">{firstName}</strong> <span className="small text-muted">{salutation}</span>
            </div>
            <div className="row bg-white pb-3 pl-4 pr-3">
                {contactInfoUi}
                <div className="col-4 text-muted">单位:</div>
                <div className="col-8">{organizationName}</div>
                <div className="col-4 text-muted">部门:</div>
                <div className="col-8">{departmentName}</div>
            </div>
            <div className="card my-2 p-2">
                <h5 className="card-title">审核</h5>
                {this.tips}
                <Form ref={v => this.form = v} schema={schema}
                    uiSchema={uiSchema}
                    formData={this.data}
                    className="bg-white px-3"
                    onButtonClick={this.onFormButtonClick}></Form>
            </div>
            <div className="card my-2 p-2">
                <h5 className="card-title">未审核订单列表</h5>
                {this.pendingOrderList}
            </div>
        </Page>
    });
}