import{ai as Y,aj as I,a7 as L,V as j,k as $,q as C,ae as H,b as B,ak as Q,h as g,al as M,am as R,_ as y,Z as T,c as h,af as q,an as A,ao as N,W as X,ap as Z,aq as x,ar as z,as as G,at as J,au as K,a as U,e as ee,p as re,F as ae,n as k,I as te,av as ne,Q as se}from"./runtime.CoW0KnnG.js";import{b as ie}from"./disclose-version.CvBO89_N.js";import{m as ue,a as oe}from"./index-client.DFNAKGzJ.js";const fe=["touchstart","touchmove"];function de(e){return fe.includes(e)}const le=["textarea","script","style","title"];function ge(e){return le.includes(e)}const ce=new Set,V=new Set;function w(e){var O;var r=this,t=r.ownerDocument,n=e.type,u=((O=e.composedPath)==null?void 0:O.call(e))||[],a=u[0]||e.target,l=0,p=e.__root;if(p){var c=u.indexOf(p);if(c!==-1&&(r===document||r===window)){e.__root=r;return}var b=u.indexOf(r);if(b===-1)return;c<=b&&(l=c)}if(a=u[l]||e.target,a!==r){Y(e,"currentTarget",{configurable:!0,get(){return a||t}});var S=$,f=C;I(null),L(null);try{for(var s,i=[];a!==null;){var d=a.assignedSlot||a.parentNode||a.host||null;try{var _=a["__"+n];if(_!==void 0&&!a.disabled)if(j(_)){var[P,...W]=_;P.apply(a,[e,...W])}else _.call(a,e)}catch(m){s?i.push(m):s=m}if(e.cancelBubble||d===r||d===null)break;a=d}if(s){for(let m of i)queueMicrotask(()=>{throw m});throw s}}finally{e.__root=r,delete e.currentTarget,I(S),L(f)}}}let o;function _e(){o=void 0}function me(e){let r=null,t=g;var n;if(g){for(r=h,o===void 0&&(o=q(document.head));o!==null&&(o.nodeType!==8||o.data!==M);)o=R(o);o===null?y(!1):o=T(R(o))}g||(n=document.head.appendChild(H()));try{B(()=>e(n),Q)}finally{t&&(y(!0),o=h,T(r))}}function we(e,r){var t=r==null?"":typeof r=="object"?r+"":r;t!==(e.__t??(e.__t=e.nodeValue))&&(e.__t=t,e.nodeValue=t==null?"":t+"")}function he(e,r){return F(e,r)}function Ee(e,r){A(),r.intro=r.intro??!1;const t=r.target,n=g,u=h;try{for(var a=q(t);a&&(a.nodeType!==8||a.data!==M);)a=R(a);if(!a)throw N;y(!0),T(a),X();const l=F(e,{...r,anchor:a});if(h===null||h.nodeType!==8||h.data!==Z)throw x(),N;return y(!1),l}catch(l){if(l===N)return r.recover===!1&&z(),A(),G(t),y(!1),he(e,r);throw l}finally{y(n),T(u),_e()}}const v=new Map;function F(e,{target:r,anchor:t,props:n={},events:u,context:a,intro:l=!0}){A();var p=new Set,c=f=>{for(var s=0;s<f.length;s++){var i=f[s];if(!p.has(i)){p.add(i);var d=de(i);r.addEventListener(i,w,{passive:d});var _=v.get(i);_===void 0?(document.addEventListener(i,w,{passive:d}),v.set(i,1)):v.set(i,_+1)}}};c(J(ce)),V.add(c);var b=void 0,S=K(()=>{var f=t??r.appendChild(H());return U(()=>{if(a){ee({});var s=ae;s.c=a}u&&(n.$$events=u),g&&ie(f,null),b=e(f,n)||{},g&&(C.nodes_end=h),a&&re()}),()=>{var d;for(var s of p){r.removeEventListener(s,w);var i=v.get(s);--i===0?(document.removeEventListener(s,w),v.delete(s)):v.set(s,i)}V.delete(c),f!==t&&((d=f.parentNode)==null||d.removeChild(f))}});return D.set(b,S),b}let D=new WeakMap;function Te(e,r){const t=D.get(e);return t?(D.delete(e),t(r)):Promise.resolve()}function pe(e,r,t){if(e==null)return r(void 0),k;const n=te(()=>e.subscribe(r,t));return n.unsubscribe?()=>n.unsubscribe():n}let E=!1;function Se(e,r,t){const n=t[r]??(t[r]={store:null,source:ue(void 0),unsubscribe:k});if(n.store!==e)if(n.unsubscribe(),n.store=e,e==null)n.source.v=void 0,n.unsubscribe=k;else{var u=!0;n.unsubscribe=pe(e,a=>{u?n.source.v=a:oe(n.source,a)}),u=!1}return se(n.source)}function Ne(){const e={};return ne(()=>{for(var r in e)e[r].unsubscribe()}),e}function Re(e){var r=E;try{return E=!1,[e(),E]}finally{E=r}}export{we as a,Se as b,Re as c,me as d,Ee as h,ge as i,he as m,Ne as s,Te as u};
