import { Tuid, Map, Query, Action, Sheet, Book } from "tonva";

export interface UqOrder {
    //a: Tuid;
    //b: Tuid;
    SetCart: Action;
    RemoveFromCart: Action;
    MergeCart: Action;
    Order: Sheet;
    GetPendingAuditOrders: Query
    GetCart: Query;
    GetPendingPayment: Query;
}

export interface UqProduct {
    ProductX: Tuid;
    PriceX: Map;
    AgentPrice: Map;
    ProductChemical: Map;
    Brand: Tuid;
    GetRootCategory: Query;
    GetRootCategories: Query;
    GetChildrenCategory: Query;
    SearchProduct: Query;
    SearchProductByCategory: Query;
    GetFutureDeliveryTime: Query;
}

export interface UqCommon {
    SalesRegion: Tuid;
    Language: Tuid;
    Address: Tuid;
    InvoiceType: Tuid;
    GetCountryProvinces: Query;
    GetProvinceCities: Query;
    GetCityCounties: Query;
}

export interface UqWebUser {
    WebUser: Tuid;
    WebUserContact: Map;
    WebUserSetting: Map;
    WebUserCustomer: Map;
    WebUserContacts: Map;
    PendingAuditWebUser: Book;
    auditPendingUser: Action;
    AuditPendingUserRefuseReason: Tuid;
    auditPendingUserRefuse: Action;
}

export interface UqCustomer {
    Contact: Tuid;
    InvoiceInfo: Tuid;
    CustomerContacts: Map;
    CustomerSetting: Map;
    getCustomerByNo: Query;
}

export interface UqCustomerDiscount {
    GetDiscount: Query;
}

export interface UqPromotion {
    GetPromotionPack: Query;
}

export interface UqWarehouse {
    GetInventoryAllocation: Query;
}

export interface UqSalesTask {
    IsCanUseCoupon: Action;
}

export interface UqMember {
    MemberAction: Action;
    MemberRecommender: Map;
}

export interface UQs {
    order: UqOrder;
    product: UqProduct;
    common: UqCommon;
    webuser: UqWebUser;
    customer: UqCustomer;
    customerDiscount: UqCustomerDiscount;
    promotion: UqPromotion;
    warehouse: UqWarehouse;
    salesTask: UqSalesTask;
    member: UqMember;
}
