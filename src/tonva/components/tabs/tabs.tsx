import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { IObservableValue } from 'mobx/lib/internal';
import '../../css/va-tab.css';

export type TabCaption = (selected:boolean) => JSX.Element;

export interface TabProp {
    name: string;
    caption: TabCaption;
    content: () => JSX.Element;
    notify?: IObservableValue<number>;
    load?: () => Promise<void>;
}

export interface TabsProps {
    tabs: TabProp[];
    tabPosition?: 'top' | 'bottom';
    size?: 'sm' | 'lg' | 'md';
    tabBack?: string;
    contentBack?: string;
    sep?: string;
    selected?: string;
}

class Tab {
    name: string;
    @observable selected: boolean;
    caption: TabCaption;
    contentBuilder: ()=>JSX.Element;
    notify: IObservableValue<number>;
    load?: () => Promise<void>;

    private _content: JSX.Element;
    
    get content(): JSX.Element {
        if (this.selected !== true) return this._content;
        if (this._content !== undefined) return this._content;
        return this._content = this.contentBuilder();
    }

    async start() {
        if (this._content !== undefined) return;
        if (this.load === undefined) return;
        await this.load();
    }
}

export const TabCaptionComponent = (label:string, icon:string, color:string) => <div 
    className={'d-flex justify-content-center align-items-center flex-column cursor-pointer ' + color}>
    <div><i className={'fa fa-lg fa-' + icon} /></div>
    <small>{label}</small>
</div>;

@observer export class Tabs extends React.Component<TabsProps> {
    private size: string;
    private tabBack: string;
    private contentBack: string;
    private sep: string;
    @observable private selectedTab: Tab;
    @observable private tabs: Tab[];

    constructor(props: TabsProps) {
        super(props);
        let {size, tabs, tabBack, contentBack, sep, selected} = this.props;
        this.size = size || 'md';
        this.tabs = tabs.map(v => {
            let tab = new Tab();
            tab.name = v.name;
            tab.selected = false;
            tab.caption = v.caption;
            tab.contentBuilder = v.content;
            tab.notify = v.notify;
            tab.load = v.load;
            return tab;
        });
        this.tabBack = tabBack || 'bg-light';
        this.contentBack = contentBack;
        this.sep = sep || 'border-top border-gray';
        if (selected !== undefined) {
            this.selectedTab = this.tabs.find(v => v.name === selected);
        }
        if (this.selectedTab === undefined) this.selectedTab = this.tabs[0];
        this.selectedTab.selected = true;
    }

    async componentWillMount() {
        if (this.tabs === undefined) return;
        if (this.tabs.length === 0) return;
        let tab = this.tabs[0];
        await tab.start();
    }

    private tabClick = async (tab:Tab) => {
        await tab.start();
        this.selectedTab.selected = false;
        tab.selected = true;
        this.selectedTab = tab;
    }

    showTab(tabName: string) {
        let tab = this.tabs.find(v => v.name === tabName);
        if (tab === undefined) return;
        if (this.selectedTab !== undefined) this.selectedTab.selected = false;
        tab.selected = true;
        this.selectedTab = tab;
    }

    render() {
        let cn = classNames('tab', 'tab-' + this.size);
        let content = <div className={classNames(this.contentBack, 'tab-content')}>
            {this.tabs.map((v,index) => {
                let style:React.CSSProperties={
                    display: v.selected===true? undefined : 'none'};
                return <div key={index} style={style}>{v.content}</div>;
            })}
        </div>;

        let tabs = <div className={classNames(this.tabBack, this.sep, 'tab-tabs')}>
            {this.tabs.map((v,index) => {
                let {selected, caption, notify} = v;
                let notifyCircle:any;
                if (notify !== undefined) {
                    let num = notify.get();
                    if (num !== undefined) {
                        if (num > 0) notifyCircle = <u>{num>99?'99+':num}</u>;
                        else if (num < 0) notifyCircle = <u className="dot" />;
                    }
                }
                return <div key={index} className="" onClick={()=>this.tabClick(v)}>
                    <div className="align-self-center">
                        {notifyCircle}
                        {caption(selected)}
                    </div>
                </div>
            })}
        </div>;

        return <div className={cn}>
            {
                this.props.tabPosition === 'top'? 
                    <>{tabs}{content}</> :
                    <>{content}{tabs}</>
            }
        </div>
    }
};
