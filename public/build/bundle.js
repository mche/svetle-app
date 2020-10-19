!function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function l(t){t.forEach(e)}function o(t){return"function"==typeof t}function a(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function r(t){return null==t?"":t}function c(t,e){t.appendChild(e)}function s(t,e,n){t.insertBefore(e,n||null)}function i(t){t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function h(t){return document.createElement(t)}function u(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function d(t){return document.createTextNode(t)}function v(){return d(" ")}function m(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function p(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}let g;function y(t){g=t}const $=[],x=[],b=[],z=[],w=Promise.resolve();let j=!1;function S(t){b.push(t)}let _=!1;const M=new Set;function k(){if(!_){_=!0;do{for(let t=0;t<$.length;t+=1){const e=$[t];y(e),T(e.$$)}for($.length=0;x.length;)x.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];M.has(e)||(M.add(e),e())}b.length=0}while($.length);for(;z.length;)z.pop()();j=!1,_=!1,M.clear()}}function T(t){if(null!==t.fragment){t.update(),l(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}const E=new Set;function L(t,e){t&&t.i&&(E.delete(t),t.i(e))}function H(t,e,n,l){if(t&&t.o){if(E.has(t))return;E.add(t),(void 0).c.push(()=>{E.delete(t),l&&(n&&t.d(1),l())}),t.o(e)}}function N(t){t&&t.c()}function A(t,n,a){const{fragment:r,on_mount:c,on_destroy:s,after_update:i}=t.$$;r&&r.m(n,a),S(()=>{const n=c.map(e).filter(o);s?s.push(...n):l(n),t.$$.on_mount=[]}),i.forEach(S)}function C(t,e){const n=t.$$;null!==n.fragment&&(l(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function P(t,e){-1===t.$$.dirty[0]&&($.push(t),j||(j=!0,w.then(k)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function B(e,o,a,r,c,s,f=[-1]){const h=g;y(e);const u=o.props||{},d=e.$$={fragment:null,ctx:null,props:s,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:n(),dirty:f};let v=!1;if(d.ctx=a?a(e,u,(t,n,...l)=>{const o=l.length?l[0]:n;return d.ctx&&c(d.ctx[t],d.ctx[t]=o)&&(d.bound[t]&&d.bound[t](o),v&&P(e,t)),n}):[],d.update(),v=!0,l(d.before_update),d.fragment=!!r&&r(d.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);d.fragment&&d.fragment.l(t),t.forEach(i)}else d.fragment&&d.fragment.c();o.intro&&L(e.$$.fragment),A(e,o.target,o.anchor),k()}y(h)}class D{$destroy(){C(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}function I(t,e,n){const l=t.slice();return l[9]=e[n],l}function G(t,e,n){const l=t.slice();return l[6]=e[n],l}function O(t){let e,n,l,o,a;return{c(){e=u("circle"),m(e,"class",n="minor "+(t[6]+t[9]==t[2]?"minor-second-on":"")+" svelte-ybfex5"),m(e,"r",l=t[6]+t[9]==t[2]?2:1),m(e,"cy",o=Math.sin(t[4](t[6]+t[9]-15))*(J-.22*J)),m(e,"cx",a=Math.cos(t[4](t[6]+t[9]-15))*(J-.22*J))},m(t,n){s(t,e,n)},p(t,o){4&o&&n!==(n="minor "+(t[6]+t[9]==t[2]?"minor-second-on":"")+" svelte-ybfex5")&&m(e,"class",n),4&o&&l!==(l=t[6]+t[9]==t[2]?2:1)&&m(e,"r",l)},d(t){t&&i(e)}}}function V(t){let e,n,l,o,a,r,c=[1,2,3,4],h=[];for(let e=0;e<4;e+=1)h[e]=O(I(t,c,e));return{c(){e=u("line");for(let t=0;t<4;t+=1)h[t].c();r=d(""),m(e,"class",n="major "+(t[6]%15?"":"major2")+" "+(t[6]==t[2]?"major-second-on":"")+" svelte-ybfex5"),m(e,"y1",l="-"+(.7+(t[6]%15?0:-.1))*J),m(e,"y2",o="-"+.8*J),m(e,"transform",a="rotate("+6*t[6]+")")},m(t,n){s(t,e,n);for(let e=0;e<4;e+=1)h[e].m(t,n);s(t,r,n)},p(t,l){if(4&l&&n!==(n="major "+(t[6]%15?"":"major2")+" "+(t[6]==t[2]?"major-second-on":"")+" svelte-ybfex5")&&m(e,"class",n),20&l){let e;for(c=[1,2,3,4],e=0;e<4;e+=1){const n=I(t,c,e);h[e]?h[e].p(n,l):(h[e]=O(n),h[e].c(),h[e].m(r.parentNode,r))}for(;e<4;e+=1)h[e].d(1)}},d(t){t&&i(e),f(h,t),t&&i(r)}}}function q(e){let n,l,o;return{c(){n=u("text"),l=d(":"),m(n,"x","-1"),m(n,"y",o=.5*J),m(n,"class","digits tick svelte-ybfex5")},m(t,e){s(t,n,e),c(n,l)},p:t,d(t){t&&i(n)}}}function F(e){let n,l,o,a,r,h,v,g,y,$,x,b,z,w,j,S,_,M,k,T,E,L,H,N,A,C,P=(1===e[0].toString().length?"0"+e[0].toString():e[0])+"",B=(1===e[1].toString().length?"0"+e[1].toString():e[1])+"",D=[0,5,10,15,20,25,30,35,40,45,50,55],I=[];for(let t=0;t<12;t+=1)I[t]=V(G(e,D,t));let O=!(e[2]%2)&&q();return{c(){n=u("svg"),l=u("circle");for(let t=0;t<12;t+=1)I[t].c();a=u("g"),r=u("line"),v=u("circle"),y=u("line"),b=u("g"),z=u("line"),S=u("line"),k=u("text"),T=d(P),O&&O.c(),H=u("text"),N=d(B),m(l,"class","clock-face svelte-ybfex5"),m(l,"r",o=J-2),m(r,"y1","2"),m(r,"y2",h=-.4*J),m(v,"r","9"),m(v,"cy","-25"),m(v,"class","svelte-ybfex5"),m(a,"class","hour svelte-ybfex5"),m(a,"transform",g="rotate("+(30*e[0]+e[1]/2)+")"),m(y,"class","minute svelte-ybfex5"),m(y,"y1","4"),m(y,"y2",$=-.6*J),m(y,"transform",x="rotate("+(6*e[1]+e[2]/10)+")"),m(z,"class","second svelte-ybfex5"),m(z,"y1",w=.2*J),m(z,"y2",j=-.76*J),m(S,"class","second-counterweight svelte-ybfex5"),m(S,"y1",_=.2*J),m(S,"y2","2"),m(b,"transform",M="rotate("+6*(e[2]+e[3]/1e3)+")"),m(k,"x",E=-.2*J),m(k,"y",L=.5*J),m(k,"class","digits svelte-ybfex5"),m(H,"x","4"),m(H,"y",A=.5*J),m(H,"class","digits svelte-ybfex5"),m(n,"xmlns","http://www.w3.org/2000/svg"),m(n,"xmlns:xlink","http://www.w3.org/1999/xlink"),m(n,"viewBox",C="-"+J+" -"+J+" "+2*J+" "+2*J),m(n,"class","z-depth-3 green lighten-4 svelte-ybfex5")},m(t,e){s(t,n,e),c(n,l);for(let t=0;t<12;t+=1)I[t].m(n,null);c(n,a),c(a,r),c(a,v),c(n,y),c(n,b),c(b,z),c(b,S),c(n,k),c(k,T),O&&O.m(n,null),c(n,H),c(H,N)},p(t,[e]){if(20&e){let l;for(D=[0,5,10,15,20,25,30,35,40,45,50,55],l=0;l<12;l+=1){const o=G(t,D,l);I[l]?I[l].p(o,e):(I[l]=V(o),I[l].c(),I[l].m(n,a))}for(;l<12;l+=1)I[l].d(1)}3&e&&g!==(g="rotate("+(30*t[0]+t[1]/2)+")")&&m(a,"transform",g),6&e&&x!==(x="rotate("+(6*t[1]+t[2]/10)+")")&&m(y,"transform",x),12&e&&M!==(M="rotate("+6*(t[2]+t[3]/1e3)+")")&&m(b,"transform",M),1&e&&P!==(P=(1===t[0].toString().length?"0"+t[0].toString():t[0])+"")&&p(T,P),t[2]%2?O&&(O.d(1),O=null):O?O.p(t,e):(O=q(),O.c(),O.m(n,H)),2&e&&B!==(B=(1===t[1].toString().length?"0"+t[1].toString():t[1])+"")&&p(N,B)},i:t,o:t,d(t){t&&i(n),f(I,t),O&&O.d()}}}let J=100;function R(t,e,n){let l=new Date;let o,a,r,c;return setInterval(()=>{n(5,l=new Date)},100),t.$$.update=()=>{32&t.$$.dirty&&n(0,o=l.getHours()),32&t.$$.dirty&&n(1,a=l.getMinutes()),32&t.$$.dirty&&n(2,r=l.getSeconds()),32&t.$$.dirty&&n(3,c=l.getMilliseconds())},[o,a,r,c,t=>2*Math.PI/60*t]}class K extends D{constructor(t){super(),B(this,t,R,F,a,{})}}function Q(e){let n,l,o,a,f,h,d,v,p,g,y,$,x,b,z,w,j,S,_,M,k,T,E,L,H,N,A,C;return{c(){n=u("svg"),l=u("path"),o=u("path"),a=u("path"),f=u("path"),h=u("path"),d=u("path"),v=u("path"),p=u("g"),g=u("path"),y=u("path"),$=u("path"),x=u("path"),b=u("path"),z=u("path"),w=u("g"),j=u("path"),S=u("path"),_=u("path"),M=u("path"),k=u("path"),E=u("path"),L=u("path"),N=u("path"),A=u("path"),C=u("path"),m(l,"d","m160 144-6.978-76.756a16 16 0 0 1 9.229-15.976l87.61-40.435a16 16 0 0 1 12.449-.406l86.49 33.266a16 16 0 0 1 10.2 16.263l-7 84.044v16h-192z"),m(l,"fill","#3a1e13"),m(o,"d","m504 512v-33.805l-56-126.195h-384l-56 120v40z"),m(o,"fill","#cce9ea"),m(a,"d","m120 496v16h264v-16c-32-40-24-144-24-144h-216s8 104-24 144z"),m(a,"fill","#354458"),m(f,"d","m304 512v-24c18-24 24-96 24-96v-40h-144v40s6 72 24 96v24z"),m(f,"fill","#9fd3d3"),m(h,"d","m200 264v88l56 48 56-48v-88z"),m(h,"fill","#e28140"),m(d,"d","m272 512v-72h-32v72"),m(d,"fill","#231f20"),m(v,"d","m224 384v32a8 8 0 0 0 .411 2.53l8 24a8 8 0 0 0 7.589 5.47h32a8 8 0 0 0 7.589-5.47l8-24a8 8 0 0 0 .411-2.53v-32z"),m(v,"fill","#3b4c62"),m(g,"d","m8 472v3.864c20.241-8.384 40.86-22.091 59.316-40.548 25.857-25.857 42.4-55.956 48.029-83.316h-51.345z"),m(g,"fill","#f9f2ed"),m(p,"opacity",".4"),m(p,"transform","matrix(-1,0,0,1,507,7)"),m(y,"d","m256 384c-24 8-32 56-32 56l-40-48v-40h16z"),m(y,"fill","#79b5b4"),m($,"d","m328 352v40l-40 48s-8-48-32-56l56-32z"),m($,"fill","#79b5b4"),m(x,"d","m248 280h16v24h-16z"),m(x,"fill","#231f20"),m(b,"d","m200 323.212c52.244 18.922 94.943-7.19 112-20.387v-30.825h-112z"),m(b,"fill","#915024"),m(z,"d","m330.413 260.789-45.919 39.359a16 16 0 0 1 -10.413 3.852h-36.162a16 16 0 0 1 -10.413-3.852l-45.919-39.359a16 16 0 0 1 -5.587-12.148v-176.641c0-8.837 160-8.837 160 0v176.641a16 16 0 0 1 -5.587 12.148z"),m(z,"fill","rgb(235, 165, 116)"),m(j,"d","m291.016 294.557-53.421-38.852a50.121 50.121 0 0 1 -20.607-42.389v-147.186c-23.455.989-40.988 2.945-40.988 5.87v176.641a16 16 0 0 0 5.587 12.148l40.915 35.07 5 4.289a16 16 0 0 0 10.416 3.852h36.162a16 16 0 0 0 10.412-3.851z"),m(j,"fill","#e28140"),m(w,"opacity",".5"),m(S,"d","m176 216-24-24v-48l24 8z"),m(S,"fill","#a8602f"),m(_,"d","m336 216 24-16v-56l-24 8z"),m(_,"fill","#a8602f"),m(M,"d","m320 208v40l-48 40h-32l-48-40v-40h-16v40.641a16 16 0 0 0 5.587 12.148l45.919 39.359a16 16 0 0 0 10.412 3.852h36.162a16 16 0 0 0 10.413-3.852l45.919-39.359a16 16 0 0 0 5.588-12.148v-40.641z"),m(M,"fill","#562719"),m(k,"class",T=r(e[0])+" svelte-jnejli"),m(k,"d","m283.313 152h4.687v16h16v-16h16v-16h-40a8 8 0 0 0 -5.657 2.343l-8 8 11.313 11.313z"),m(E,"d","m511.313 474.949-56-126.194a8 8 0 0 0 -7.313-4.755h-128v-63.749l15.619-13.388a23.971 23.971 0 0 0 8.381-18.222v-28.36l20.438-13.625a8 8 0 0 0 3.562-6.656v-56a7.965 7.965 0 0 0 -7.309-7.956l6.286-75.425a24.125 24.125 0 0 0 -15.3-24.393l-86.496-33.266a24.129 24.129 0 0 0 -18.672.609l-87.609 40.431a24.046 24.046 0 0 0 -13.844 23.964l6.189 68.081a7.965 7.965 0 0 0 -7.245 7.955v48a8 8 0 0 0 2.343 5.657l21.657 21.656v29.328a23.973 23.973 0 0 0 8.381 18.222l15.619 13.388v63.749h-128a8 8 0 0 0 -7.25 4.617l-56 120a8.005 8.005 0 0 0 -.75 3.383v40h16v-38.225l53.095-113.775h67.343a458.971 458.971 0 0 1 -.421 48.485c-1.307 20.245-4.017 37.672-8.017 51.864v-44.349h-16v96h16v-13.309c26.566-36.469 25.633-112.854 24.473-138.691h23.527v32c0 .223.011.444.029.664v.03.008c.28 3.345 6.12 70.63 23.969 97.814v21.484h16v-24a8 8 0 0 0 -1.6-4.8c-9.315-12.42-15.62-41.751-19.194-65.257l22.648 27.178a8 8 0 0 0 14.037-3.806c.012-.071.027-.153.04-.225l.069.208v70.702h16v-64h16v64h16v-70.7l.069-.207c.012.072.028.154.04.225a8 8 0 0 0 14.037 3.806l22.656-27.187c-3.571 23.5-9.875 52.829-19.2 65.263a8 8 0 0 0 -1.6 4.8v24h16v-21.483c17.849-27.184 23.689-94.469 23.969-97.814v-.008-.03c.018-.22.029-.442.029-.664v-32.001h15.538a471.48 471.48 0 0 0 .479 49.515c2.647 41.028 10.715 71 23.983 89.175v13.31h16v-96h-15.998v44.347c-3.984-14.146-6.693-31.506-8-51.666a459.433 459.433 0 0 1 -.437-48.681h75.237l53.2 119.89v32.11h16v-33.806a8.007 8.007 0 0 0 -.687-3.245zm-263.313-194.949v16h-10.082a8 8 0 0 1 -5.206-1.926l-32.712-28.039v-58.035h-16v-131c8.909-1.718 33.51-3.63 72-3.63s63.091 1.912 72 3.63v131h-16v58.035l-32.713 28.04a8.006 8.006 0 0 1 -5.206 1.925h-10.081v-16zm104-84.281-8 5.333v-43.286l8-2.667zm-186.4-137.187 87.613-40.432a8.047 8.047 0 0 1 6.225-.2l86.493 33.26a8.042 8.042 0 0 1 5.1 8.131l-6.794 81.531-.237.078v-68.9c0-9.851-12.245-11.464-32.413-12.949-14.7-1.083-34.44-1.679-55.587-1.679s-40.889.6-55.587 1.679c-20.168 1.485-32.413 3.098-32.413 12.949v68.9l-.256-.085-6.754-74.3a8.014 8.014 0 0 1 4.61-7.983zm-5.6 130.155v-33.587l8 2.667v38.92zm62.3 117.535a24.014 24.014 0 0 0 15.618 5.778h36.163a24.014 24.014 0 0 0 15.619-5.778l14.3-12.257v53.392l-48 27.429-48-27.429v-53.392zm43.934 125.778h-20.468l-5.87-17.609c3.965-9.3 9.337-18.011 16.1-21.68 6.752 3.669 12.124 12.4 16.094 21.712zm-42.7-19.872c-1.41 3.666-2.592 7.246-3.57 10.532l-27.964-33.56v-29.1h5.876l42.664 24.379c-6.612 6.246-12.304 15.521-17.007 27.749zm96.466-23.028-27.963 33.56c-.978-3.286-2.16-6.866-3.57-10.532-4.7-12.227-10.395-21.5-17.006-27.749l42.663-24.379h5.876z"),m(L,"class",H=r(e[0])+" svelte-jnejli"),m(L,"d","m224 168v-16h4.687l5.657 5.657 11.313-11.313-8-8a8 8 0 0 0 -5.657-2.344h-40v16h16v16z"),m(N,"d","m240.572 157.029-16 40a8 8 0 0 0 7.428 10.971h48a8 8 0 0 0 7.428-10.971l-16-40-14.855 5.942 11.611 29.029h-24.368l11.611-29.029z"),m(A,"d","m277.578 232 21.985 14.656 8.875-13.312-24-16a8 8 0 0 0 -4.438-1.344h-40a8 8 0 0 0 -4.437 1.344l-24 16 8.875 13.313 21.984-14.657z"),m(C,"d","m267.578 255.155 16-8-7.155-14.311-14.312 7.156h-22.111v16h24a8 8 0 0 0 3.578-.845z"),m(n,"xmlns","http://www.w3.org/2000/svg"),m(n,"viewBox","0 0 512 512"),m(n,"class","me z-depth-3 svelte-jnejli")},m(t,e){s(t,n,e),c(n,l),c(n,o),c(n,a),c(n,f),c(n,h),c(n,d),c(n,v),c(n,p),c(p,g),c(n,y),c(n,$),c(n,x),c(n,b),c(n,z),c(n,w),c(w,j),c(n,S),c(n,_),c(n,M),c(n,k),c(n,E),c(n,L),c(n,N),c(n,A),c(n,C)},p(t,[e]){1&e&&T!==(T=r(t[0])+" svelte-jnejli")&&m(k,"class",T),1&e&&H!==(H=r(t[0])+" svelte-jnejli")&&m(L,"class",H)},i:t,o:t,d(t){t&&i(n)}}}function U(t,e,n){const l=function(){new Promise(t=>setTimeout(t,100)).then(()=>{n(0,o="on")}),setTimeout(()=>{n(0,o="off"),l()},1e4*Math.random())};let o;return l(),n(0,o=""),[o]}class W extends D{constructor(t){super(),B(this,t,U,Q,a,{})}}var X=[{title:"All glory to... Gloria",html:'Создал Свелт-приложение из  <a href="https://github.com/sveltejs/template">шаблона</a> ... и пошло-поехало, и все закрутилось ...',code:"\n$ cd /path/to/svelte-app\n$ npm run dev\n$ npm run build\n$ surge public mche.us.to\n\n   Running as *******@********* (Student)\n\n        project: public\n         domain: mche.us.to\n         upload: [====================] 100% eta: 0.0s (227 files, 3275006 bytes)\n            CDN: [====================] 100%\n\n             IP: 138.197.235.123\n\n   Success! - Published to mche.us.to\n\n"},{title:"Vue кириллические пропсы",html:"Крутяк, но не проверил на сборщиках parcel, rollup",code:'\n// HTML\n    <v-foo :пропс1=" ... " ></v-foo>\n    \n// JS компонент Foo\n    const props = {\n      "пропс1": ...,\n      ...\n    };\n    \n'}];function Y(t,e,n){const l=t.slice();return l[3]=e[n],l}function Z(t){let e,n,l,a,r,f,u,g,y,$,x=t[3].title+"",b=t[3].html+"",z=t[3].code+"";return{c(){e=h("h2"),n=h("a"),l=d(x),a=v(),r=h("p"),f=v(),u=h("code"),g=d(z),m(n,"href","javascript:"),m(n,"class","gr-color svelte-1git8a0"),m(e,"class","center-000 svelte-1git8a0"),m(u,"class","code svelte-1git8a0")},m(i,h){var d,v,m,p;s(i,e,h),c(e,n),c(n,l),s(i,a,h),s(i,r,h),r.innerHTML=b,s(i,f,h),s(i,u,h),c(u,g),y||(v="click",m=function(){o(t[2](t[3]))&&t[2](t[3]).apply(this,arguments)},(d=n).addEventListener(v,m,p),$=()=>d.removeEventListener(v,m,p),y=!0)},p(e,n){t=e,2&n&&x!==(x=t[3].title+"")&&p(l,x),2&n&&b!==(b=t[3].html+"")&&(r.innerHTML=b),2&n&&z!==(z=t[3].code+"")&&p(g,z)},d(t){t&&i(e),t&&i(a),t&&i(r),t&&i(f),t&&i(u),y=!1,$()}}}function tt(t){let e,n,l,o,a,r,u,g,y,$,x,b,z,w,j,S,_,M,k,T,E=t[0].title+"";l=new K({}),y=new W({});let P=t[1],B=[];for(let e=0;e<P.length;e+=1)B[e]=Z(Y(t,P,e));return{c(){e=h("main"),n=h("div"),N(l.$$.fragment),o=v(),a=h("div"),a.textContent="Это SVG-часы Свелт-компонент.",r=v(),u=h("h1"),g=h("span"),N(y.$$.fragment),$=v(),x=h("span"),b=d(E),z=v(),w=h("span"),w.textContent="доброго всем",j=v(),S=h("p"),S.innerHTML='<a href="https://ru.svelte.dev/tutorial">Svelte учебник</a> - на официальном русскоязычном сайтеге.',_=v(),M=h("p"),M.innerHTML='<a href="https://t.me/sveltejs">Телеграм Свелт</a> - официальный русскоязычный канал.',k=v();for(let t=0;t<B.length;t+=1)B[t].c();m(n,"class","clock svelte-1git8a0"),m(g,"class","me svelte-1git8a0"),m(x,"class","svelt-color font-effect-3d-float svelte-1git8a0"),m(u,"class","gr-color svelte-1git8a0"),m(e,"class","svelte-1git8a0")},m(t,i){s(t,e,i),c(e,n),A(l,n,null),c(n,o),c(n,a),c(e,r),c(e,u),c(u,g),A(y,g,null),c(u,$),c(u,x),c(x,b),c(u,z),c(u,w),c(e,j),c(e,S),c(e,_),c(e,M),c(e,k);for(let t=0;t<B.length;t+=1)B[t].m(e,null);T=!0},p(t,[n]){if((!T||1&n)&&E!==(E=t[0].title+"")&&p(b,E),6&n){let l;for(P=t[1],l=0;l<P.length;l+=1){const o=Y(t,P,l);B[l]?B[l].p(o,n):(B[l]=Z(o),B[l].c(),B[l].m(e,null))}for(;l<B.length;l+=1)B[l].d(1);B.length=P.length}},i(t){T||(L(l.$$.fragment,t),L(y.$$.fragment,t),T=!0)},o(t){H(l.$$.fragment,t),H(y.$$.fragment,t),T=!1},d(t){t&&i(e),C(l),C(y),f(B,t)}}}function et(t,e,n){let{head:l}=e;let o;return t.$set=t=>{"head"in t&&n(0,l=t.head)},n(1,o=X),[l,o,t=>{t.title=" ¡ "+t.title+" ! ",n(1,o)}]}function nt(e){let n,l,o=e[0].title+"";return{c(){n=h("title"),l=d(o)},m(t,e){s(t,n,e),c(n,l)},p(t,[e]){1&e&&o!==(o=t[0].title+"")&&p(l,o)},i:t,o:t,d(t){t&&i(n)}}}function lt(t,e,n){let{head:l}=e;return t.$set=t=>{"head"in t&&n(0,l=t.head)},[l]}let ot={head:{title:"Михаил ★ mche.us.to"}};new class extends D{constructor(t){super(),B(this,t,et,tt,a,{head:0})}}({target:document.body,props:ot}),new class extends D{constructor(t){super(),B(this,t,lt,nt,a,{head:0})}}({target:document.head,props:ot})}();
//# sourceMappingURL=bundle.js.map
