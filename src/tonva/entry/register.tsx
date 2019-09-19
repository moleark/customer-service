import * as React from 'react';
import {nav, Page, Schema, UiSchema, UiTextItem, UiPasswordItem, UiButton, Form, Context, resLang, StringSchema, Controller, 
    VPage, NumSchema} from '../components';
import { userApi, RegisterParameter } from './userApi';
import '../css/va-form.css';
import { RegisterRes, registerRes } from './res';
import { tonvaTop, getSender } from './tools';

export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}
/*
class AccountInput extends TextWidget {
    @observable private buttonDisabled: boolean = true;
    private onClick = () => {
        let {onButtonClick} = this.context.form.props;
        if (onButtonClick === undefined) return;
        onButtonClick(this.name, this.context);
    }
    protected onChange(evt: React.ChangeEvent<any>) {
        this.buttonDisabled = (evt.target.value.trim().length === 0);
    }
    render() {
        return <>
            <div className="input-group">
                <input ref={input=>this.input = input}
                            className="form-control"
                            type={this.inputType}
                            defaultValue={this.value}
                            onChange={(evt: React.ChangeEvent<any>) => this.onChange(evt)}
                            placeholder='手机号/邮箱'
                            readOnly={this.readOnly}
                            disabled={this.disabled}
                            onKeyDown = {this.onKeyDown}
                            onFocus = {(evt: React.FocusEvent<any>) => this.onFocus(evt)}
                            onBlur={(evt: React.FocusEvent<any>) => this.onBlur(evt)}
                            maxLength={(this.itemSchema as StringSchema).maxLength} />
                <div className="input-group-append">
                    <button className="btn btn-sm btn-outline-primary"
                        type="button" disabled={this.buttonDisabled}
                        onClick={this.onClick}>
                        <small>发送验证码</small>
                    </button>
                </div>
            </div>
            {this.renderErrors()}
        </>;
    }
}
*/
export class RegisterController extends Controller {
    account: string;
    type:'mobile'|'email';
    password: string;
    verify: string;

    accountPageCaption = '注册账号';
    accountLabel = '注册账号';
    accountSubmitCaption = '注册新账号'; 
    passwordPageCaption = '账号密码';
    passwordSubmitCaption = '注册新账号'; 
    successText = '注册成功';

    protected async internalStart() {
        this.openVPage(AccountPage);
    }

    toVerify(account:string) {
        this.account = account;
        this.openVPage(VerifyPage);
    }

    toPassword() {
        this.openVPage(PasswordPage);
    }

    toSuccess() {
        this.openVPage(RegSuccess);
    }

    login = async () => {
        let retUser = await userApi.login({user: this.account, pwd: this.password, guest: nav.guest});
        if (retUser === undefined) {
            alert('something wrong!');
            return;
        }
        await nav.logined(retUser);
    }

    private regReturn(registerReturn:number):string {
        let msg:any;
        switch (registerReturn) {
            default: 
                return '服务器发生错误';
            case 4:
                return '验证码错误';
            case 0:
                return;
            case 1:
                msg = '用户名 ' + this.account;
                break;
            case 2:
                msg = '手机号 +' + this.account;
                break;
            case 3:
                msg = '邮箱 ' + this.account;
                break;
        }
        return msg + ' 已经被注册过了';
    }

    async checkAccount():Promise<string> {
        let ret = await userApi.isExists(this.account);
        let error = this.accountError(ret);
        if (error !== undefined) return error;
        ret = await userApi.setVerify(this.account, this.type);
        this.toVerify(this.account);
        return;
    }

    protected accountError(isExists: number) {
        if (isExists > 0) return '已经被注册使用了';
    }

    async execute() {
        let params: RegisterParameter = {
            nick: undefined,
            user: this.account, 
            pwd: this.password,
            country: undefined,
            mobile: undefined,
            mobileCountry: undefined,
            email: undefined,
            verify: this.verify
        }
        switch (this.type) {
            case 'mobile':
                params.mobile = Number(this.account);
                params.mobileCountry=86;
                break;
            case 'email':
                params.email = this.account;
                break;
        }
        let ret = await userApi.register(params);
        if (ret === 0) {
            nav.clear();
            this.toSuccess();
            return;
        }
        let error = this.regReturn(ret)
        return error;
    }
}

export class ForgetController extends RegisterController {
    accountPageCaption = '密码找回';
    accountLabel = '账号';
    accountSubmitCaption = '注册新账号'; 
    passwordPageCaption = '重置密码';
    passwordSubmitCaption = '提交'; 
    successText = '成功修改密码';

    async execute() {
        await userApi.resetPassword(this.account, this.password, this.verify, this.type);
        nav.clear();
        this.toSuccess();
        return undefined;
    }

    protected accountError(isExists: number) {
        if (isExists === 0) return '请输入正确的账号';
    }
}

class AccountPage extends VPage<RegisterController> {
    private schema: Schema = [
        {name: 'user', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'verify', type: 'submit'},
    ]
    private uiSchema: UiSchema;

    protected res: RegisterRes = resLang(registerRes);
    async open() {
        this.uiSchema = {
            items: {
                user: {
                    widget: 'text',
                    label: this.controller.accountLabel,
                    placeholder: '手机号或邮箱',
                } as UiTextItem, 
                verify: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: '发送验证码'} as UiButton,
            }
        }
                
            this.openPage(this.page);
    }

    private page = ():JSX.Element => {
        return <Page header={this.controller.accountPageCaption}>
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                {tonvaTop()}
                <div className="h-3c" />
                <Form schema={this.schema} uiSchema={this.uiSchema} 
                    onButtonClick={this.onSubmit}
                    onEnter={this.onEnter} 
                    requiredFlag={false} />
            </div>
        </Page>;
    }

    private onSubmit = async (name:string, context:Context):Promise<string> => {
        context.clearContextErrors();
        let user = 'user';
        let value = context.getValue(user);
        let sender = getSender(value);
        if (sender === undefined) {
            context.setError(user, '必须是手机号或邮箱');
            return;
        }
        let type:'mobile'|'email' = sender.type as 'mobile'|'email';
        if (type === 'mobile') {
            if (value.length !== 11 || value[0] !== '1') {
                context.setError(user, '请输入正确的手机号');
                return;
            }
        }
        this.controller.account = value;
        this.controller.type = type;
        let ret = await this.controller.checkAccount();
        if (ret !== undefined) context.setError(user, ret);
    }

    private onEnter = async (name:string, context:Context):Promise<string> => {
        if (name === 'user') {
            return await this.onSubmit('verify', context);
        }
    }
}

class VerifyPage extends VPage<RegisterController> {
    private schema: Schema = [
        {name: 'verify', type: 'number', required: true, maxLength: 6} as NumSchema,
        {name: 'submit', type: 'submit'},
    ]

    private onVerifyChanged = (context:Context, value:any, prev:any) => {
        context.setDisabled('submit', !value || (value.length !== 6));
    }
    private uiSchema: UiSchema = {
        items: {
            verify: {
                widget: 'text',
                label: '验证码',
                placeholder: '请输入验证码',
                onChanged: this.onVerifyChanged,
            } as UiTextItem, 
            submit: {
                widget: 'button', 
                className: 'btn btn-primary btn-block mt-3', 
                label: '下一步 >',
                disabled: true
            } as UiButton,
        }
    }
    async open() {
        this.openPage(this.page);
    }
    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let verify = this.controller.verify = context.getValue('verify');
        let ret = await userApi.checkVerify(this.controller.account, verify);
        if (ret === 0) {
            context.setError('verify', '验证码错误');
            return;
        }
        this.controller.toPassword();
    }

    private onEnter = async (name:string, context:Context):Promise<string> => {
        if (name === 'verify') {
            return await this.onSubmit('submit', context);
        }
    }
    private page = ():JSX.Element => {
        let typeText:string, extra:any;
        switch (this.controller.type) {
            case 'mobile': typeText = '手机号'; break;
            case 'email': 
                typeText = '邮箱'; 
                extra = <><span className="text-danger">注意</span>: 有可能误为垃圾邮件，请检查<br/></>;
                break;
        }
        return <Page header="验证码">
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                验证码已经发送到{typeText}<br/>
                <div className="py-2 px-3 my-2 text-primary bg-light"><b>{this.controller.account}</b></div>
                {extra}
                <div className="h-1c" />
                <Form schema={this.schema} uiSchema={this.uiSchema} 
                    onButtonClick={this.onSubmit} 
                    onEnter={this.onEnter}
                    requiredFlag={false} />
            </div>
        </Page>
    }
}

class PasswordPage extends VPage<RegisterController> {
    private schema: Schema = [
        {name: 'pwd', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'rePwd', type: 'string', required: true, maxLength: 100} as StringSchema,
        {name: 'submit', type: 'submit'},
    ]
    private uiSchema: UiSchema;
    async open() {
        this.uiSchema = {
            items: {
                pwd: {widget: 'password', placeholder: '密码', label: '密码'} as UiPasswordItem,
                rePwd: {widget: 'password', placeholder: '重复密码', label: '重复密码'} as UiPasswordItem,
                submit: {widget: 'button', className: 'btn btn-primary btn-block mt-3', label: this.controller.passwordSubmitCaption} as UiButton,
            }
        }
        this.openPage(this.page);
    }
    private onSubmit = async (name:string, context:Context):Promise<string> => {
        let values = context.form.data;
        let {pwd, rePwd} = values;
        let error:string;
        if (!pwd || pwd !== rePwd) {
            context.setValue('pwd', '');
            context.setValue('rePwd', '');
            error = '密码错误，请重新输入密码！';
            context.setError('pwd', error);
        }
        else {
            this.controller.password = pwd;
            error = await this.controller.execute();
            if (error !== undefined) {
                nav.push(<Page header="注册不成功"><div className="p-5 text-danger">{error}</div></Page>);
            }
        }
        return error;
    }
    private onEnter = async (name:string, context:Context):Promise<string> => {
        if (name === 'rePwd') {
            return await this.onSubmit('submit', context);
        }
    }
    private page = ():JSX.Element => {
        return <Page header={this.controller.passwordPageCaption}>
            <div className="w-max-20c my-5 py-5"
                style={{marginLeft:'auto', marginRight:'auto'}}>
                注册账号<br/>
                <div className="py-2 px-3 my-2 text-primary bg-light"><b>{this.controller.account}</b></div>
                <div className="h-1c" />
                <Form schema={this.schema} uiSchema={this.uiSchema}                    
                    onButtonClick={this.onSubmit}
                    onEnter={this.onEnter}
                    requiredFlag={false} />
            </div>
        </Page>
    }
}

class RegSuccess extends VPage<RegisterController> {
    async open() {
        this.openPage(this.page);
    }

    private page = () => {
        const {account, successText, login} = this.controller;
        return (
        <Page header={false}>
            <div className="container w-max-30c">
                <form className="my-5">
                    <div className="py-5">
                        账号 <strong className="text-primary">{account} </strong> {successText}！
                    </div>
                    <button className="btn btn-success btn-block" type="button" onClick={login}>
                        直接登录
                    </button>
                </form>
            </div>
        </Page>
        );
    }
}
