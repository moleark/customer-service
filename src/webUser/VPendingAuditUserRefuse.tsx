import * as React from 'react';
import { VPage, Page, Schema, UiSchema, UiInputItem, UiButton, UiRadio, Form, Context } from 'tonva';
import { CWebUser } from './CWebUser';

const schema: Schema = [
    { name: 'id', type: 'id', required: false },
    { name: 'reason', type: 'id', required: true },
    { name: 'comments', type: 'string', required: false },
    { name: 'submit', type: 'submit' },
];

export class VPendingAuditUserRefuse extends VPage<CWebUser> {

    async open(param: any) {
        (this.uiSchema.items.reason as UiRadio).list = (param as any[]).map(v => { return { value: v.id, title: v.description } });
        this.openPage(this.page);
    }

    private onFormButtonClick = async (name: string, context: Context) => {

        let { data } = context.form;
        this.controller.auditPendingUserRefuse(data);
    }

    private uiSchema: UiSchema = {
        items: {
            id: { visible: false },
            reason: { widget: 'radio', label: '拒绝原因', placeholder: '', defaultValue: 1, list: [] } as UiRadio,
            comments: {
                widget: 'text', label: '备注', placeholder: '备注', rules: (value) => {
                    return value && value.length > 100 ? '备注最多可以输入100个字。' : undefined;
                }
            } as UiInputItem,
            submit: { widget: 'button', label: '审核不通过', visible: true, className: "btn btn-primary w-100" } as UiButton
        }
    }

    private page = () => {
        return <Page header='审核不通过'>
            <Form schema={schema}
                className="px-3 pb-3"
                uiSchema={this.uiSchema} onButtonClick={this.onFormButtonClick}></Form>
        </Page>
    }
}