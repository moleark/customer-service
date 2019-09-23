import * as React from 'react';
import { VPage, Page, Schema, UiSchema, UiInputItem, UiButton, UiRadio, Form, Context, FA } from 'tonva';
import { CWebUser } from './CWebUser';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'reason', type: 'id', required: true },
    { name: 'comments', type: 'string', required: false },
    { name: 'submit', type: 'submit' },
];

export class VPendingAuditUserRefuse extends VPage<CWebUser> {

    @observable tips: JSX.Element;
    async open(param: any) {
        (this.uiSchema.items.reason as UiRadio).list = (param as any[]).map(v => { return { value: v.id, title: v.description } });
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name: string, context: Context) => {

        let { data } = context.form;
        this.controller.auditPendingUserRefuse(data);
        let leftseconds = 3;
        this.tips = <div className="alert alert-success" role="alert">
            <FA name="check-circle" className="check-circle mr-2"></FA>操作成功{leftseconds}
        </div>
        let h = setInterval(() => {
            leftseconds--;
            this.tips = <div className="alert alert-success" role="alert">
                <FA name="check-circle" className="check-circle mr-2"></FA>操作成功{leftseconds}
            </div>
        }, 1000);
        setTimeout(() => {
            clearInterval(h);
            this.closePage(2);
        }, 3000);
    }

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            reason: { widget: 'radio', label: '拒绝原因', list: [] } as UiRadio,
            comments: {
                widget: 'text', label: '备注', placeholder: '备注', rules: (value) => {
                    return value && value.length > 100 ? '备注最多可以输入100个字。' : undefined;
                }
            } as UiInputItem,
            submit: { widget: 'button', label: '审核不通过', visible: true, className: "btn btn-primary w-100" } as UiButton
        }
    }

    private page = observer(() => {
        return <Page header='审核不通过'>
            <Form schema={schema}
                className="px-3 pb-3"
                uiSchema={this.uiSchema} onButtonClick={this.onFormButtonClick}></Form>
            {this.tips}
        </Page>
    })
}