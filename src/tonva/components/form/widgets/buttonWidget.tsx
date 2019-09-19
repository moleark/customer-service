import * as React from 'react';
import { UiButton, TempletType } from '../../schema';
import { Unknown } from './unknown';
import { Widget } from './widget';
import { observer } from 'mobx-react';

export class ButtonWidget extends Widget {
    protected ui: UiButton;

    protected onClick = async () => {
        this.clearError();
        this.clearContextError();
        let {name, type} = this.itemSchema;
        if (type === 'submit') {
            await this.context.submit(name);
        }
        /*
        let {onButtonClick} = this.context.form.props;
        if (onButtonClick === undefined) {
            alert(`button ${name} clicked. you should define form onButtonClick`);
            return;
        }
        let ret = await onButtonClick(name, this.context);
        if (ret === undefined) return;
        this.context.setError(name, ret);
        */
    }

    private observerRender = observer(() => {
        let {name, type} = this.itemSchema;
        let Templet:TempletType, cn:string, caption:string;
        if (this.ui !== undefined) {
            let {widget:widgetType} = this.ui;
            if (widgetType !== 'button') return Unknown(type, widgetType, ['button']);
            Templet = this.ui.Templet;
            cn = this.ui.className;
            caption = this.ui.label;
        }
        let {form, hasError} = this.context;
        let context = this.context;
        let disabled = type==='submit' && hasError;
        let content:any;
        if (this.children !== undefined) content = this.children;
        else if (typeof Templet === 'function') content = Templet();
        else if (Templet !== undefined) content = Templet;
        else content = caption; 
        let button = <button 
            className={cn} 
            type="button"
            disabled={disabled}
            onClick={this.onClick}>
            {content || name}
        </button>;
        if (context.inNode === true) return <>{button}{this.renderErrors()}</>;
        return <div className={form.ButtonClass}>
            <div>{this.renderErrors()}</div>
            {button}
        </div>;
    });
    
    protected get label():string {return null}

    render() {
        return <this.observerRender />
    }
}
