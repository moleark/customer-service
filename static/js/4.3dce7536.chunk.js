(window["webpackJsonpjk-customer-service"]=window["webpackJsonpjk-customer-service"]||[]).push([[4],{81:function(e,r,t){"use strict";t.r(r),t.d(r,"ChangePasswordPage",(function(){return p}));var n=t(1),a=t.n(n),s=t(2),o=t(3),c=t(5),i=t(4),u=t(10),d=t(6),w=t(0),m=t(7),l=t(14),h=function(e,r,t,n){return new(t||(t=Promise))((function(a,s){function o(e){try{i(n.next(e))}catch(r){s(r)}}function c(e){try{i(n.throw(e))}catch(r){s(r)}}function i(e){var r;e.done?a(e.value):(r=e.value,r instanceof t?r:new t((function(e){e(r)}))).then(o,c)}i((n=n.apply(e,r||[])).next())}))},p=function(e){function r(){var e;return Object(s.a)(this,r),(e=Object(c.a)(this,Object(i.a)(r).apply(this,arguments))).schema=[{name:"orgPassword",type:"string",maxLength:60,required:!0},{name:"newPassword",type:"string",maxLength:60,required:!0},{name:"newPassword1",type:"string",maxLength:60,required:!0},{name:"submit",type:"submit"}],e.uiSchema={items:{orgPassword:{widget:"password",label:"\u539f\u5bc6\u7801",placeholder:"\u8f93\u5165\u539f\u6765\u7684\u5bc6\u7801"},newPassword:{widget:"password",label:"\u65b0\u5bc6\u7801",placeholder:"\u8f93\u5165\u65b0\u8bbe\u7684\u5bc6\u7801"},newPassword1:{widget:"password",label:"\u786e\u8ba4\u5bc6\u7801",placeholder:"\u518d\u6b21\u8f93\u5165\u65b0\u8bbe\u5bc6\u7801"},submit:{widget:"button",label:"\u63d0\u4ea4",className:"btn btn-primary"}}},e.onSubmit=function(r,t){return h(Object(u.a)(e),void 0,void 0,a.a.mark((function e(){var r,n,s,o,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.data,n=r.orgPassword,s=r.newPassword,o=r.newPassword1,s===o){e.next=4;break}return t.setError("newPassword1","\u65b0\u5bc6\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165"),e.abrupt("return");case 4:return c=new l.c("tv/",void 0),e.next=7,c.changePassword({orgPassword:n,newPassword:s});case 7:if(!1!==e.sent){e.next=11;break}return t.setError("orgPassword","\u539f\u5bc6\u7801\u9519\u8bef"),e.abrupt("return");case 11:return m.u.replace(w.createElement(m.l,{header:"\u4fee\u6539\u5bc6\u7801",back:"close"},w.createElement("div",{className:"m-3  text-success"},"\u5bc6\u7801\u4fee\u6539\u6210\u529f\uff01"))),e.abrupt("return");case 13:case"end":return e.stop()}}),e)})))},e}return Object(d.a)(r,e),Object(o.a)(r,[{key:"render",value:function(){return w.createElement(m.l,{header:"\u4fee\u6539\u5bc6\u7801"},w.createElement(m.e,{className:"m-3",schema:this.schema,uiSchema:this.uiSchema,onButtonClick:this.onSubmit,fieldLabelSize:2}))}}]),r}(w.Component)}}]);
//# sourceMappingURL=4.3dce7536.chunk.js.map