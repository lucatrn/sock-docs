!function(){"use strict";function t(t){return document.getElementById(t)}function e(t,e,s){s?t.classList.add(e):t.classList.remove(e)}function s(t,e,s){let i=document.createElement(t);return e&&function(t,e){for(let s in e){let i=e[s];s.startsWith("on")?t[s]=i:!0===i?t.setAttribute(s,""):null==i||!1===i||t.setAttribute(s,i)}}(i,e),function(t,e){if(e)if(Array.isArray(e))for(let s of e)t.append(s);else t.append(e)}(i,s),i}function i(t){t.innerHTML=""}let n,r="sock_docs",a=localStorage.getItem(r);if(a)try{n=JSON.parse(a)}catch(t){console.error(t)}n=Object.assign({},{},n);let o=n;let l=t("theme-toggle-icon-light"),c=t("theme-toggle-icon-dark"),h=!1;function p(t){h=t,e(l,"hidden",!t),e(c,"hidden",t),e(document.documentElement,"light",t),e(document.documentElement,"dark",!t)}t("theme-toggle").onclick=()=>{p(!h),function(t){for(let e in t)n[e]=t[e];localStorage.setItem(r,JSON.stringify(n))}({isLight:h})},p(o.isLight??document.documentElement.classList.contains("light"));let u=[];addEventListener("message",(t=>{let e=t.data;if(e&&"object"==typeof e){let s=e.type;if(s){let i=e.data,n=[],r=[];for(let e of u)e.type!==s||e.iframe&&e.iframe.contentWindow!==t.source?n.push(e):r.push(e);u=n;for(let t of r)t(i)}}}));class d{constructor(t){this.summary=t.dataset.summary;let e=t.querySelectorAll("h2");this.signatures=Array.from(e).map((t=>{let e=t.textContent,s=t.dataset.type,i=t.dataset.super;return t.remove(),s?new H(e,s):function(t,e){if(/^[a-zA-Z0-9]+$/.test(t))return new M(t,e);let s=/^([^ a-zA-Z0-9]+) ?([a-zA-Z0-9]+)/.exec(t);if(s){let e=s[1],i=z(s[2]),n=(t=t.slice(s[0].length)).indexOf(":"),r=n<0?null:t.slice(n+1).trim();return new C(i,e,r)}if(s=/^([a-zA-Z0-9]+) (\S+) ([a-zA-Z0-9]+)/.exec(t),s){let e=z(s[1]),i=s[2],n=z(s[3]),r=(t=t.slice(s[0].length)).indexOf(":"),a=r<0?null:t.slice(r+1).trim();return new v(e,n,a,i)}let i=j(t,!0,"(",")");if(i)return i;if(i=j(t,!1,"[","]"),i)return i;throw Error("invalid signature: "+t)}(e,i)}));let s=t.dataset.tag;if(this.tags=s?s.split(/\s+/):[],this.nodes=[],this.fromHtml(t,this.nodes),!this.summary){let t=this.nodes.find((t=>t instanceof HTMLParagraphElement));t&&(this.summary=t.textContent)}}fromHtml(t,e){for(let s of Array.from(t.children))if(s instanceof HTMLScriptElement){let t=f.fromElement(s);e.push(t)}else if(s instanceof HTMLDetailsElement){let t=[];this.fromHtml(s,t);let i=new m("details",{},t);e.push(i)}else s instanceof HTMLPreElement&&(s.textContent=y(s.textContent)),e.push(s)}toHTML(t){let e=s("section");for(let t of this.signatures){let i=s("h2");t.toHTML(i),e.append(i)}_(e,this.nodes),t.append(e)}matchesTitle(t){return this.signatures.some((e=>e&&e.matchesTitle(t)))}searchScore(t){for(let e of this.signatures){if(e.keywords.includes(t))return 6;for(let s of e.keywords)if(s.includes(t))return 5;if(e.signature.includes(t))return 4}for(let e of this.tags){if(e===t)return 3;if(e.includes(t))return 2}return 0}}class m{constructor(t,e,s){this.tag=t,this.attributes=e||{},this.nodes=s||[]}toHTML(t){let e=s(this.tag,this.attributes);_(e,this.nodes),t.append(e)}}class f{constructor(t,e){this.code=t,this.script=e}toHTML(t){t.append(s("pre",{},this.code));let e=s("button",{class:"accent-button"});e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accent-button-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>Run Example',t.append(e),e.onclick=()=>{let t=s("iframe",{src:"player",width:"100%",height:"100%"}),i=s("button",{class:"player-stop hidden"});i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="player-stop-icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';let n=s("div",{class:"player"},[t,i]);e.replaceWith(n),function(t,e){return new Promise((s=>{s.type=t,s.iframe=e,u.push(s)}))}("ready",t).then((()=>{t.contentWindow.postMessage({type:"script",data:this.script}),i.classList.remove("hidden"),i.onclick=()=>{t.src="about:blank",t=null,n.replaceWith(e)}}))}}static fromElement(t){let e=y(t.text),s=t.dataset.tag?.split(/\s+/)??[],i=e;return e.includes("Game.begin")||s.includes("noloop")||(i="Game.begin {\n",s.includes("noclear")||(i+="Game.clear()\n"),i+=e+"\n",s.includes("once")&&(i+="Game.quit()\n"),i+="}"),new f(e,i)}}function y(t){for(;"\n"===t[0]||"\r"===t[0];)t=t.slice(1);let e,s=/^\s+/.exec(t);return e=s?("\n"+t).replaceAll("\n"+s[0],"\n"):t,e=e.trim(),e}let g="sg-class",w="sg-parameter",L="sg-type";class T{toHTML(t){t.append(s("a",{href:"#"+this.signature,class:"permalink"},"#"))}matchesTitle(t){return this.signature===t}}function x(t){let e=t.split(/([a-zA-Z]+)/),i=s("span",{class:L});return e.forEach(((t,e)=>{e%2==0?i.append(t):i.append(k(t,t))})),i}function k(t,e,i){if("this"===e)return s("span",{class:L},t);let n="no-underline";i&&(n+=" "+i),"null"===e&&(e="Null");let r=s("a",{class:n,href:"#"+e},t),a=I.find((t=>t.matchesTitle(e)));return a&&a.summary&&(r.title=a.summary),r}T.prototype.signature="",T.prototype.keywords=[];class H extends T{constructor(t,e){super(),this.name=t,this.type=e,this.signature=t,this.keywords=[t.toLowerCase()]}toHTML(t){let e="";"type"===this.type&&(e=L),t.append(k(this.name,this.name,e))}}class M extends T{constructor(t,e){super(),this.name=t,this.superClass=e,this.signature=t,this.keywords=[t.toLowerCase()]}toHTML(t){t.append(k(this.name,this.name,g)),this.superClass&&t.append(s("span",{style:"opacity: 0.6; margin-left: 0.2em;"},[" is ",k(this.superClass,this.superClass,g)]))}}class C extends T{constructor(t,e,s){super(),this.className=t,this.operator=e,this.type=s,this.signature=e+W(t),this.keywords=[t.toLowerCase(),e]}matchesTitle(t){return this.className===t||this.operator===t||super.matchesTitle(t)}toHTML(t){t.append(k(this.operator,this.signature,L),k(W(this.className),this.className,g)),this.type&&t.append(": ",x(this.type)),super.toHTML(t)}}class v extends T{constructor(t,e,s,i){super(),this.className1=t,this.className2=e,this.returnType=s,this.operator=i,this.signature=W(t)+i+W(e),this.keywords=[t.toLowerCase(),e.toLowerCase(),i]}matchesTitle(t){return this.className1===t||this.className2===t||this.operator===t||super.matchesTitle(t)}toHTML(t){t.append(k(W(this.className1),this.className1,g)," "+this.operator+" ",k(W(this.className2),this.className2,g)),this.returnType&&t.append(" ⇒ ",x(this.returnType)),super.toHTML(t)}}function E(t,e){return e?t:W(t)}function S(t,e,s,i,n){t.append(k(E(e,s),e,g),".",i)}function A(t,e){e&&t.append(": ",x(e))}class b extends T{constructor(t,e,s,i){super(),this.class=t,this.isStatic=e,this.property=s,this.type=i,this.signature=E(t,e)+"."+s,this.keywords=[t.toLowerCase(),s.toLowerCase()]}matchesTitle(t){return this.class===t||super.matchesTitle(t)}toHTML(t){S(t,this.class,this.isStatic,this.property,this.signature),A(t,this.type),super.toHTML(t)}}class N extends T{constructor(t,e,s,i,n){super(),this.class=t,this.isStatic=e,this.method=s,this.parameters=i,this.returnType=n,this.signature=E(t,e)+"."+s+"("+i.filter((t=>!t.name.endsWith("..."))).map((()=>"_")).join(",")+")",this.keywords=[t.toLowerCase(),s.toLowerCase()];for(let t of i)this.keywords.push(t.name.toLowerCase())}matchesTitle(t){return this.class===t||super.matchesTitle(t)}toHTML(t){S(t,this.class,this.isStatic,this.method,this.signature),t.append("("),this.parameters.forEach(((e,i)=>{i>0&&t.append(", "),t.append(s("span",{class:w},e.name)),e.type&&t.append(": ",x(e.type))})),t.append(")"),A(t,this.returnType),super.toHTML(t)}}class O extends T{constructor(t,e,s,i,n){super(),this.class=t,this.isStatic=e,this.isSetter=s,this.parameters=i,this.type=n,this.signature=E(t,e)+"["+i.map((()=>"_")).join(",")+"]",s&&(this.signature+="=(_)"),this.keywords=[t.toLowerCase()];for(let t of i)this.keywords.push(t.name.toLowerCase())}matchesTitle(t){return this.class===t||super.matchesTitle(t)}toHTML(t){t.append(k(E(this.class,this.isStatic),this.class,g)),t.append("["),this.parameters.forEach(((e,i)=>{i>0&&t.append(", "),t.append(s("span",{class:w},e.name)),e.type&&t.append(": ",x(e.type))})),t.append(this.isSetter?"] = ":"]: "),t.append(x(this.type||"any")),super.toHTML(t)}}class Z{constructor(t,e){this.name=t,this.type=e}}function j(t,e,s,i){let n=t.indexOf(e?".":s);if(n<0)return null;let r=t.slice(0,n);t=t.slice(e?n+1:n);let a=/^[A-Z]/.test(r);r=z(r);let o=t.indexOf(s);if(o>=0){let e=t.slice(0,o),s=t.lastIndexOf(i);if(s<0)throw Error("missing closing "+i);let n=[],l=t.slice(o+1,s).split(/,\s*/);if(1!==l.length||l[0].length>0)for(let t of l){let e=t.indexOf(":"),s=e<0?t:t.slice(0,e),i=e<0?null:t.slice(e+1).trim();n.push(new Z(s,i))}if(e){let i=t.indexOf(":",s),o=i<0?null:t.slice(i+1).trim();return new N(r,a,e,n,o)}{let e=!1,i=t.indexOf(":",s);i<0&&(i=t.indexOf("=",s),i>=0&&(e=!0));let o=i<0?null:t.slice(i+1).trim();return new O(r,a,e,n,o)}}let l=t.indexOf(":"),c=l<0?t:t.slice(0,l),h=l<0?null:t.slice(l+1).trim();return new b(r,a,c,h)}function z(t){return t[0].toUpperCase()+t.slice(1)}function W(t){return t[0].toLowerCase()+t.slice(1)}let I=[],G=async function(){let t=await fetch("docs.html"),e=await t.text(),i=s("div");i.innerHTML="<template>"+e+"</template>";let n=i.firstChild.content;return I=Array.from(n.children).map((t=>new d(t))),console.log(I),I}();function _(t,e){for(let s of e)s instanceof Element?t.append(s):Array.isArray(s)?_(t,e):s.toHTML(t)}function q(t){t?location.hash="#"+t:(history.pushState(null,null," "),dispatchEvent(new Event("hashchange")))}let B=t("search-form"),D=t("search"),K=document.querySelector("main");function P(){let t=location.hash.slice(1);if(t)if(t=decodeURIComponent(t),"~"===t[0])!function(t){D.value=t,i(K);let e=function(t){t=t.trim().toLowerCase();let e=[];for(let s of I){let i=s.searchScore(t);i>0&&e.push({score:i,section:s})}return e.sort(((t,e)=>e.score-t.score)),e.map((t=>t.section))}(t);if(0===e.length)K.append(`No items match search "${t}".`);else for(let t of e)t.toHTML(K)}(t.slice(1)),document.title="Sock | "+t+" (search)";else{let e=I.filter((e=>e.matchesTitle(t)));if(i(K),e.length>0)for(let t of e)t.toHTML(K);else K.append(s("p",{},`Could not find information about "${t}".`));document.title="Sock | "+t}else i(K),I[0].toHTML(K),document.title="Sock"}B.onsubmit=t=>{t.preventDefault();let e=D.value.trim();e?q("~"+e):q()},G.then((()=>{P()})),t("title-link").onclick=t=>{t.ctrlKey||t.metaKey||t.shiftKey||(t.preventDefault(),q())},addEventListener("hashchange",(t=>{P()}))}();
//# sourceMappingURL=main.js.map
