import * as React from 'react';
//import _ from 'lodash';
import { Controller, resLang } from '../../components';
import { UqData } from '../../net';
import { PureJSONContent } from '../tools';
import { UqMan, Action, Sheet, Query, Book, Map, Entity, Tuid, History, Pending, TuidDiv, CreateBoxId, BoxId } from '../../uq';
import { CLink } from '../link';
import { CBook, BookUI } from '../book';
import { CSheet, SheetUI } from '../sheet';
import { ActionUI, CAction } from '../action';
import { QueryUI, CQuery, CQuerySelect } from '../query';
import { CTuidMain, TuidUI, CTuidInfo, CTuidSelect, CTuidEdit, CTuidList } from '../tuid';
import { MapUI, CMap } from '../map';
import { CEntity, EntityUI } from '../CVEntity';
import { VUq } from './vUq';
import { CHistory, HistoryUI } from '../history';
import { CPending, PendingUI } from '../pending';
import { CApp } from '../app';
import { TuidWithUIRes, ReactBoxId } from './reactBoxId';

export type EntityType = 'sheet' | 'action' | 'tuid' | 'query' | 'book' | 'map' | 'history' | 'pending';

export interface UqUI {
    CTuidMain?: typeof CTuidMain;
    CTuidEdit?: typeof CTuidEdit;
    CTuidList?: typeof CTuidList;
    CTuidSelect?: typeof CTuidSelect;
    CTuidInfo?: typeof CTuidInfo;
    CQuery?: typeof CQuery;
    CQuerySelect?: typeof CQuerySelect;
    CMap?: typeof CMap;
    CAction?: typeof CAction;
    CSheet?: typeof CSheet;
    CBook?: typeof CBook;
    CHistory?: typeof CHistory;
    CPending?: typeof CPending;
    tuid?: {[name:string]: TuidUI};
    sheet?: {[name:string]: SheetUI};
    action?: {[name:string]: ActionUI};
    map?: {[name:string]: MapUI};
    query?: {[name:string]: QueryUI};
    book?: {[name:string]: BookUI};    
    history?: {[name:string]: HistoryUI};
    pending?: {[name:string]: PendingUI};
    res?: any;
}

function lowerPropertyName(entities: {[name:string]: EntityUI}) {
    if (entities === undefined) return;
    for (let i in entities) entities[i.toLowerCase()] = entities[i];
}

export class CUq extends Controller /* implements Uq*/ {
    private ui:any;
    private tuidURs: {[name:string]: TuidWithUIRes} = {};
    private CTuidMain: typeof CTuidMain;
    private CTuidEdit: typeof CTuidEdit;
    private CTuidList: typeof CTuidList;
    private CTuidSelect: typeof CTuidSelect;
    private CTuidInfo: typeof CTuidInfo;
    private CQuery: typeof CQuery;
    private CQuerySelect: typeof CQuerySelect;
    private CMap: typeof CMap;
    private CAction: typeof CAction;
    private CSheet: typeof CSheet;
    private CBook: typeof CBook;
    private CHistory: typeof CHistory;
    private CPending: typeof CPending;

    //constructor(cApp:CApp, uq:string, appId:number, uqId:number, access:string, ui:UqUI) {
    constructor(cApp:CApp, uqData:UqData, ui:UqUI) {
        super(resLang(ui.res));
        this.cApp = cApp;
        //this.id = uqId;
        // 每一个ui都转换成小写的key的版本
        lowerPropertyName(ui.tuid);
        lowerPropertyName(ui.sheet);
        lowerPropertyName(ui.map);
        lowerPropertyName(ui.query);
        lowerPropertyName(ui.action);
        lowerPropertyName(ui.book);
        lowerPropertyName(ui.history);
        lowerPropertyName(ui.pending);
        this.ui = ui;
        this.CTuidMain = ui.CTuidMain || CTuidMain;
        this.CTuidEdit = ui.CTuidEdit || CTuidEdit;
        this.CTuidList = ui.CTuidList || CTuidList;
        this.CTuidSelect = ui.CTuidSelect || CTuidSelect;
        this.CTuidInfo = ui.CTuidInfo || CTuidInfo;
        this.CQuery = ui.CQuery || CQuery;
        this.CQuerySelect = ui.CQuerySelect || CQuerySelect;
        this.CMap = ui.CMap || CMap;
        this.CAction = ui.CAction || CAction;
        this.CSheet = ui.CSheet || CSheet;
        this.CBook = ui.CBook || CBook;
        this.CHistory = ui.CHistory || CHistory;
        this.CPending = ui.CPending || CPending;

        this.uq = new UqMan(cApp.uqs, uqData, this.createBoxId, undefined);
    }

    protected async internalStart() {
    }

    cApp:CApp;
    res: any;
    uq: UqMan;
    error: string;
    
    private createBoxId:CreateBoxId = (tuid:Tuid, id:number):BoxId =>{
        let {name} = tuid;
        let tuidUR = this.tuidURs[name];
        if (tuidUR === undefined) {
            let {ui, res} = this.getUI(tuid);
            this.tuidURs[name] = tuidUR = new TuidWithUIRes(tuid, ui, res);
        }
        return new ReactBoxId(tuidUR, id);
    }

    async init():Promise<void> {
        return await this.uq.init();
    }

    async loadEntities():Promise<string> {
        try {
            await this.uq.loadEntities();
        }
        catch (err) {
            return err;
        }
    }

    async getQuerySearch(name:string):Promise<Query> {
        let query = this.uq.query(name);
        if (query === undefined) 
            alert(`QUERY ${name} 没有定义!`);
        else {
            await query.loadSchema();
            let {returns} = query;
            if (returns.length > 1) {
                alert(`QUERY ${name} 返回多张表, 无法做QuerySearch`);
            }
        }
        return query;
    }
    getTuidPlaceHolder(tuid:Tuid) {
        let {tuidPlaceHolder, entity} = this.res;
        let {name} = tuid;
        //let type:string;
        if (entity !== undefined) {
            let en = entity[name];
            if (en !== undefined) {
                //type = en.label;
            }
        }
        return (tuidPlaceHolder || 'Select');
    }
    getNone() {
        let {none} = this.res;
        return none || 'none';
    }
    protected isSysVisible = false;
    protected isVisible(entity: Entity):boolean {
        return entity.sys !== true || this.isSysVisible;
    }

    async navSheet(sheetTypeId:number, sheetId:number) {
        let sheet = this.uq.sheetFromTypeId(sheetTypeId);
        if (sheet === undefined) {
            alert('sheetTypeId ' + sheetTypeId + ' is not exists!');
            return;
        }
        let cSheet = this.cSheet(sheet);
        await cSheet.startSheet(sheetId);
    }

    sheet(entityName:string) {return this.uq.sheet(entityName);}
    action(entityName:string) {return this.uq.action(entityName);}
    query(entityName:string) {return this.uq.query(entityName);}
    book(entityName:string) {return this.uq.book(entityName);}
    map(entityName:string) {return this.uq.map(entityName);}
    history(entityName:string) {return this.uq.history(entityName);}
    pending(entityName:string) {return this.uq.pending(entityName);}
    tuid(entityName:string) {return this.uq.tuid(entityName)}
    tuidDiv(entityName:string, divName:string) {
        return this.uq.tuidDiv(entityName, divName);
    }

    cSheetFromName(entityName:string):CSheet {
        let entity = this.uq.sheet(entityName);
        if (entity !== undefined) return this.cSheet(entity);
    }
    cActionFromName(entityName:string) {
        let entity = this.uq.action(entityName);
        if (entity !== undefined) return this.cAction(entity);
    }
    cQueryFromName(entityName:string) {
        let entity = this.uq.query(entityName);
        if (entity !== undefined) return this.cQuery(entity);
    }
    cBookFromName(entityName:string) {
        let entity = this.uq.book(entityName);
        if (entity !== undefined) return this.cBook(entity);
    }
    cMapFromName(entityName:string) {
        let entity = this.uq.map(entityName);
        if (entity !== undefined) return this.cMap(entity);
    }
    cHistoryFromName(entityName:string) {
        let entity = this.uq.history(entityName);
        if (entity !== undefined) return this.cHistory(entity);
    }
    cPendingFromName(entityName:string) {
        let entity = this.uq.pending(entityName);
        if (entity !== undefined) return this.cPending(entity);
    }
    cTuidMainFromName(entityName:string) {
        let entity = this.uq.tuid(entityName);
        if (entity !== undefined) return this.cTuidMain(entity);
    }
    cTuidEditFromName(entityName:string) {
        let entity = this.uq.tuid(entityName);
        if (entity !== undefined) return this.cTuidEdit(entity);
    }
    cTuidInfoFromName(entityName:string) {
        let entity = this.uq.tuid(entityName);
        if (entity !== undefined) return this.cTuidInfo(entity);
    }

    cTuidSelectFromName(entityName:string) {
        let entity = this.uq.tuid(entityName);
        if (entity !== undefined) return this.cTuidSelect(entity);
    }

    cFromName(entityType:EntityType, entityName:string): CEntity<Entity, EntityUI> {
        switch (entityType) {
            case 'sheet':
                let sheet = this.uq.sheet(entityName);
                if (sheet === undefined) return;
                return this.cSheet(sheet);
            case 'action':
                let action = this.uq.action(entityName);
                if (action === undefined) return;
                return this.cAction(action);
            case 'tuid':
                let tuid = this.uq.tuid(entityName);
                if (tuid === undefined) return;
                return this.cTuidMain(tuid);
            case 'query':
                let query = this.uq.query(entityName);
                if (query === undefined) return;
                return this.cQuery(query);
            case 'book':
                let book = this.uq.book(entityName);
                if (book === undefined) return;
                return this.cBook(book);
            case 'map':
                let map = this.uq.map(entityName);
                if (map === undefined) return;
                return this.cMap(map);
            case 'history':
                let history = this.uq.history(entityName);
                if (history === undefined) return;
                return this.cHistory(history);
            case 'pending':
                let pending = this.uq.pending(entityName);
                if (pending === undefined) return;
                return this.cPending(pending);
        }
    }

    linkFromName(entityType:EntityType, entityName:string) {
        return this.link(this.cFromName(entityType, entityName));
    }

    private getUI<T extends Entity, UI extends EntityUI>(t:T):{ui:UI, res:any} {
        let ui:any, res:any;
        let {name, typeName} = t;
        if (this.ui !== undefined) {
            if (typeName === 'div') {
                let tuidDiv:TuidDiv = t as unknown as TuidDiv;
                let ownerTuid = tuidDiv.owner;
                let tUIs = this.ui[ownerTuid.typeName] as TuidUI;
                if (tUIs) {
                    let tUI = tUIs[ownerTuid.name];
                    if (tUI) {
                        let divs = tUI.divs;
                        if (divs) {
                            ui = divs[name];
                        }
                    }
                }
            }
            else {
                let tUI = this.ui[typeName];
                if (tUI !== undefined) {
                    ui = tUI[name];
                }
            }
        }
        let {entity} = this.res;
        if (entity !== undefined) {
            res = entity[name];
        }
        return {ui: ui || {}, res: res || {} };
    }

    link(cEntity:CEntity<Entity, EntityUI>) {
        return new CLink(cEntity);
    }

    get tuidLinks() {
        return this.uq.tuidArr.filter(v => this.isVisible(v)).map(v => this.link(this.cTuidMain(v)));
    }
    cTuidMain(tuid:Tuid):CTuidMain {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new ((ui && ui.CTuidMain) || this.CTuidMain)(this, tuid, ui, res);
    }
    cTuidEdit(tuid:Tuid):CTuidEdit {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new ((ui && ui.CTuidEdit) || this.CTuidEdit)(this, tuid, ui, res);
    }
    cTuidList(tuid:Tuid):CTuidList {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new ((ui && ui.CTuidList) || this.CTuidList)(this, tuid, ui, res);
    }
    cTuidSelect(tuid:Tuid):CTuidSelect {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new ((ui && ui.CTuidSelect) || this.CTuidSelect)(this, tuid, ui, res);
    }
    cTuidInfo(tuid:Tuid):CTuidInfo {
        let {ui, res} = this.getUI<Tuid, TuidUI>(tuid);
        return new ((ui && ui.CTuidInfo) || this.CTuidInfo)(this, tuid, ui, res);
    }

    cSheet(sheet:Sheet/*, sheetUI?:SheetUI, sheetRes?:any*/):CSheet {
        let {ui, res} = this.getUI<Sheet, SheetUI>(sheet);
        //if (sheetUI !== undefined) ui = sheetUI;
        //if (sheetRes !== undefined) res = sheetRes;
        //return new (ui && ui.CSheet || this.CSheet)(this, sheet, sheetUI, sheetRes);
        return new ((ui && ui.CSheet) || this.CSheet)(this, sheet, ui, res);
    }
    get sheetLinks() { 
        return this.uq.sheetArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cSheet(v))
        });
    }

    cAction(action:Action):CAction {
        let {ui, res} = this.getUI<Action, ActionUI>(action);
        return new ((ui && ui.CAction) || this.CAction)(this, action, ui, res);
    }
    get actionLinks() { 
        return this.uq.actionArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cAction(v))
        });
    }

    cQuery(query:Query):CQuery {
        let {ui, res} = this.getUI<Query, QueryUI>(query);
        return new ((ui && ui.CQuery) || this.CQuery)(this, query, ui, res);
    }
    cQuerySelect(queryName:string):CQuerySelect {
        let query = this.uq.query(queryName);
        if (query === undefined) return;
        let {ui, res} = this.getUI<Query, QueryUI>(query);
        return new ((ui && ui.CQuerySelect) || this.CQuerySelect)(this, query, ui, res);
    }
    get queryLinks() {
        return this.uq.queryArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cQuery(v))
        });
    }
    
    cBook(book:Book):CBook {
        let {ui, res} = this.getUI<Book, BookUI>(book);
        return new ((ui && ui.CBook) || this.CBook)(this, book, ui, res);
    }
    get bookLinks() { 
        return this.uq.bookArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cBook(v))
        });
    }
    
    cHistory(history:History):CHistory {
        let {ui, res} = this.getUI<History, HistoryUI>(history);
        return new ((ui && ui.CHistory) || this.CHistory)(this, history, ui, res);
    }
    get historyLinks() { 
        return this.uq.historyArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cHistory(v))
        });
    }
    
    cPending(pending:Pending):CPending {
        let {ui, res} = this.getUI<Pending, PendingUI>(pending);
        return new ((ui && ui.CPending) || this.CPending)(this, pending, ui, res);
    }
    get pendingLinks() { 
        return this.uq.pendingArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cPending(v))
        });
    }
    
    cMap(map:Map):CMap {
        let {ui, res} = this.getUI<Map, MapUI>(map);
        return new ((ui && ui.CMap) || this.CMap)(this, map, ui, res);
    }
    get mapLinks() { 
        return this.uq.mapArr.filter(v => this.isVisible(v)).map(v => {
            return this.link(this.cMap(v));
        });
    }

    getTuidContent(tuid:Tuid): React.StatelessComponent<any> {
        let {ui} = this.getUI<Tuid, TuidUI>(tuid);
        return (ui && ui.content) || PureJSONContent;
    }

    getTuidDivContent(tuidDiv:TuidDiv): React.StatelessComponent<any> {
        let {owner} = tuidDiv;
        let {ui} = this.getUI<Tuid, TuidUI>(owner);
        return (ui && ui.divs && ui.divs[tuidDiv.name].content) || PureJSONContent;
    }

    async showTuid(tuid:Tuid, id:number):Promise<void> {
        let c = this.cTuidInfo(tuid);
        await c.start(id);
    }

    async showTuidDiv(tuid:TuidDiv, id:number):Promise<void> {
        let {owner} = tuid;
        let c = this.cTuidInfo(owner);
        await c.start(id);
    }

    protected get VUq():typeof VUq {return VUq}

    render() {
        let v = new (this.VUq)(this);
        return v.render();
    }
}

