import{i as k,D as l,s as v,C as d,U as C,g as c,j as m,k as i,l as D,B as q,m as u,o as F,q as t,u as w,M as A,v as B,w as I,x as o,y as _,z as N,A as R,F as T,G as g,H as x,I as y}from"./runtime.CoW0KnnG.js";function p(s,e){var n={f:0,v:s,reactions:null,equals:B,version:0};return n}function H(s){return M(p(s))}function L(s,e=!1){const n=p(s);return e||(n.equals=R),n}function M(s){return i!==null&&i.f&c&&(u===null?I([s]):u.push(s)),s}function O(s,e){return i!==null&&D()&&i.f&(c|q)&&(u===null||!u.includes(s))&&F(),Y(s,e)}function Y(s,e){return s.equals(e)||(s.v=e,s.version=k(),E(s,l),t!==null&&t.f&d&&!(t.f&w)&&(o!==null&&o.includes(s)?(v(t,l),m(t)):_===null?N([s]):_.push(s))),e}function E(s,e){var n=s.reactions;if(n!==null)for(var h=n.length,f=0;f<h;f++){var a=n[f],r=a.f;r&l||(v(a,e),r&(d|C)&&(r&c?E(a,A):m(a)))}}function U(s){T===null&&g(),x(()=>{const e=y(s);if(typeof e=="function")return e})}export{O as a,H as b,Y as i,L as m,U as o,p as s};
