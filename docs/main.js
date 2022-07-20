!function(){"use strict";function t(t){return document.getElementById(t)}function e(t,e,s){s?t.classList.add(e):t.classList.remove(e)}function s(t,e,s){let n=document.createElement(t);return e&&function(t,e){for(let s in e){let n=e[s];s.startsWith("on")?t[s]=n:!0===n?t.setAttribute(s,""):null==n||!1===n||t.setAttribute(s,n)}}(n,e),function(t,e){if(e)if(Array.isArray(e))for(let s of e)t.append(s);else t.append(e)}(n,s),n}function n(t){t.innerHTML=""}let i,r="sock_docs",o=localStorage.getItem(r);if(o)try{i=JSON.parse(o)}catch(t){console.error(t)}i=Object.assign({},{},i);let l=i;let a=t("theme-toggle-icon-light"),c=t("theme-toggle-icon-dark"),h=!1;function u(t){h=t,e(a,"hidden",!t),e(c,"hidden",t),e(document.documentElement,"light",t),e(document.documentElement,"dark",!t)}t("theme-toggle").onclick=()=>{u(!h),function(t){for(let e in t)i[e]=t[e];localStorage.setItem(r,JSON.stringify(i))}({isLight:h})},u(l.isLight??document.documentElement.classList.contains("light"));let p=[];addEventListener("message",(t=>{let e=t.data;if(e&&"object"==typeof e){let s=e.type;if(s){let n=e.data,i=[],r=[];for(let e of p)e.type!==s||e.iframe&&e.iframe.contentWindow!==t.source?i.push(e):r.push(e);p=i;for(let t of r)t(n)}}}));class f{constructor(t){this.summary=t.dataset.summary;let e=t.querySelectorAll("h2");this.signatures=Array.from(e).map((t=>{let e=t.textContent,s=t.dataset.type;return t.remove(),s?new k(e,s):function(t){if(/^[a-zA-Z0-9]+$/.test(t))return new H(t);let e=t.indexOf(".");if(e>0){let s=t.slice(0,e),n=/^[A-Z]/.test(t);s=s[0].toUpperCase()+s.slice(1);let i=t.slice(e+1),r=i.indexOf("(");if(r>0){let t=i.slice(0,r),e=i.lastIndexOf(")");if(e<0)throw Error("missing closing paren");let o=[],l=i.slice(r+1,e).split(/,\s*/);if(1!==l.length||l[0].length>0)for(let t of l){let e=t.indexOf(":"),s=e<0?t:t.slice(0,e),n=e<0?null:t.slice(e+1).trim();o.push(new A(s,n))}let a=i.indexOf(":",e),c=a<0?null:i.slice(a+1).trim();return new b(s,n,t,o,c)}let o=i.indexOf(":"),l=o<0?i:i.slice(0,o),a=o<0?null:i.slice(o+1).trim();return new C(s,n,l,a)}throw Error("invalid signature: "+t)}(e)}));let s=t.dataset.tag;if(this.tags=s?s.split(/\s+/):[],this.nodes=[],this.fromHtml(t,this.nodes),!this.summary){let t=this.nodes.find((t=>t instanceof HTMLParagraphElement));t&&(this.summary=t.textContent)}}fromHtml(t,e){for(let s of Array.from(t.children))if(s instanceof HTMLScriptElement){let t=m.fromElement(s);e.push(t)}else if(s instanceof HTMLDetailsElement){let t=[];this.fromHtml(s,t);let n=new d("details",{},t);e.push(n)}else s instanceof HTMLPreElement&&(s.textContent=g(s.textContent)),e.push(s)}toHTML(t){let e=s("section");for(let t of this.signatures){let n=s("h2");t.toHTML(n),e.append(n)}j(e,this.nodes),t.append(e)}matchesTitle(t){return this.signatures.some((e=>e&&e.matchesTitle(t)))}searchScore(t){for(let e of this.signatures){if(e.keywords.includes(t))return 6;for(let s of e.keywords)if(s.includes(t))return 5;if(e.signature.includes(t))return 4}for(let e of this.tags){if(e===t)return 3;if(e.includes(t))return 2}return 0}}class d{constructor(t,e,s){this.tag=t,this.attributes=e||{},this.nodes=s||[]}toHTML(t){let e=s(this.tag,this.attributes);j(e,this.nodes),t.append(e)}}class m{constructor(t,e){this.code=t,this.script=e}toHTML(t){t.append(s("pre",{},this.code));let e=s("button",{class:"accent-button"});e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accent-button-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Run Example',t.append(e),e.onclick=()=>{let t=s("iframe",{src:"player",width:"100%",height:"100%"}),n=s("button",{class:"player-stop hidden"});n.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="player-stop-icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';let i=s("div",{class:"player"},[t,n]);e.replaceWith(i),function(t,e){return new Promise((s=>{s.type=t,s.iframe=e,p.push(s)}))}("ready",t).then((()=>{t.contentWindow.postMessage({type:"script",data:this.script}),n.classList.remove("hidden"),n.onclick=()=>{t.src="about:blank",t=null,i.replaceWith(e)}}))}}static fromElement(t){let e=g(t.text),s=t.dataset.tag?.split(/\s+/)??[],n=e;return e.includes("Game.begin")||s.includes("noloop")||(n="Game.begin {\n",s.includes("noclear")||(n+="Game.clear()\n"),n+=e+"\n",s.includes("once")&&(n+="Game.quit()\n"),n+="}"),new m(e,n)}}function g(t){let e,s=/^\s+/.exec(t.slice(1));return e=s?("\n"+t).replaceAll("\n"+s[0],"\n"):t,e=e.trim(),e}let y="sg-class",w="sg-type";class L{toHTML(t){throw Error("not implemented")}matchesTitle(t){return this.signature===t}}function T(t){let e=t.split(/([a-zA-Z]+)/),n=s("span",{class:w});return e.forEach(((t,e)=>{e%2==0?n.append(t):n.append(x(t,t))})),n}function x(t,e,n){let i="no-underline";n&&(i+=" "+n),"null"===e&&(e="Null");let r=s("a",{class:i,href:"#"+e},t),o=S.find((t=>t.matchesTitle(e)));return o&&o.summary&&(r.title=o.summary),r}L.prototype.signature="",L.prototype.keywords=[];class k extends L{constructor(t,e){super(),this.name=t,this.type=e,this.signature=t,this.keywords=[t.toLowerCase()]}toHTML(t){let e="";"type"===this.type&&(e=w),t.append(x(this.name,this.name,e))}}class H extends L{constructor(t){super(),this.name=t,this.signature=t,this.keywords=[t.toLowerCase()]}toHTML(t){t.append(x(this.name,this.name,y))}}function M(t,e){return e?t:t[0].toLowerCase()+t.slice(1)}function v(t,e,s,n,i){t.append(x(M(e,s),e,y),".",x(n,i,"sg-property"))}function E(t,e){e&&t.append(": ",T(e))}class C extends L{constructor(t,e,s,n){super(),this.class=t,this.isStatic=e,this.property=s,this.type=n,this.signature=M(t,e)+"."+s,this.keywords=[t.toLowerCase(),s.toLowerCase()]}matchesTitle(t){return this.class===t||super.matchesTitle(t)}toHTML(t){v(t,this.class,this.isStatic,this.property,this.signature),E(t,this.type)}}class b extends L{constructor(t,e,s,n,i){super(),this.class=t,this.isStatic=e,this.method=s,this.parameters=n,this.returnType=i,this.signature=M(t,e)+"."+s+"("+n.map((()=>"_")).join(",")+")",this.keywords=[t.toLowerCase(),s.toLowerCase()];for(let t of n)this.keywords.push(t.name.toLowerCase())}matchesTitle(t){return this.class===t||super.matchesTitle(t)}toHTML(t){v(t,this.class,this.isStatic,this.method,this.signature),t.append("("),this.parameters.forEach(((e,n)=>{n>0&&t.append(", "),t.append(s("span",{class:"sg-parameter"},e.name),": ",T(e.type))})),t.append(")"),E(t,this.returnType)}}class A{constructor(t,e){this.name=t,this.type=e}}let S=[],O=async function(){let t=await fetch("docs.html"),e=await t.text(),n=s("div");n.innerHTML="<template>"+e+"</template>";let i=n.firstChild.content;return S=Array.from(i.children).map((t=>new f(t))),console.log(S),S}();function j(t,e){for(let s of e)s instanceof HTMLElement?t.append(s):Array.isArray(s)?j(t,e):s.toHTML(t)}function I(t){t?location.hash="#"+t:(history.pushState(null,null," "),dispatchEvent(new Event("hashchange")))}let W=t("search-form"),G=t("search"),N=document.querySelector("main");function q(){let t=location.hash.slice(1);if(t)if(t=decodeURIComponent(t),"~"===t[0])!function(t){G.value=t,n(N);let e=function(t){if((t=t.trim().toLowerCase()).length<=1)return[];let e=[];for(let s of S){let n=s.searchScore(t);n>0&&e.push({score:n,section:s})}return e.sort(((t,e)=>e.score-t.score)),e.map((t=>t.section))}(t);if(0===e.length)N.append(`No items match search "${t}".`);else for(let t of e)t.toHTML(N)}(t.slice(1));else{let e=S.filter((e=>e.matchesTitle(t)));if(n(N),e.length>0)for(let t of e)t.toHTML(N);else N.append(s("p",{},`Could not find information about "${t}".`))}else n(N),S[0].toHTML(N)}W.onsubmit=t=>{t.preventDefault();let e=G.value.trim();e?I("~"+e):I()},O.then((()=>{q()})),t("title-link").onclick=t=>{t.ctrlKey||t.metaKey||t.shiftKey||(t.preventDefault(),I())},addEventListener("hashchange",(t=>{q()}))}();
//# sourceMappingURL=main.js.map