/* unzipit@1.4.0, license MIT */
function e(e,r){var t=e.length;if(r<=t)return e;var n=new Uint8Array(Math.max(t<<1,r));return n.set(e,0),n}function r(e,r,t,n,a,f){for(var s=o,d=i,l=0;l<t;){var u=e[d(n,a)&r];a+=15&u;var v=u>>>4;if(v<=15)f[l]=v,l++;else{var c=0,p=0;16==v?(p=3+s(n,a,2),a+=2,c=f[l-1]):17==v?(p=3+s(n,a,3),a+=3):18==v&&(p=11+s(n,a,7),a+=7);for(var w=l+p;l<w;)f[l]=c,l++}}return a}function t(e,r,t,n){for(var a=0,f=0,o=n.length>>>1;f<t;){var s=e[f+r];n[f<<1]=0,n[1+(f<<1)]=s,s>a&&(a=s),f++}for(;f<o;)n[f<<1]=0,n[1+(f<<1)]=0,f++;return a}function n(e,r){for(var t,n,a,f,o=e.length,s=d.bl_count,i=0;i<=r;i++)s[i]=0;for(i=1;i<o;i+=2)s[e[i]]++;var l=d.next_code;for(t=0,s[0]=0,n=1;n<=r;n++)t=t+s[n-1]<<1,l[n]=t;for(a=0;a<o;a+=2)0!=(f=e[a+1])&&(e[a]=l[f],l[f]++)}function a(e,r,t){for(var n=e.length,a=d.rev15,f=0;f<n;f+=2)if(0!=e[f+1])for(var o=f>>1,s=e[f+1],i=o<<4|s,l=r-s,u=e[f]<<l,v=u+(1<<l);u!=v;){t[a[u]>>>15-r]=i,u++}}function f(e,r){for(var t=d.rev15,n=15-r,a=0;a<e.length;a+=2){var f=e[a]<<r-e[a+1];e[a]=t[f]>>>n}}function o(e,r,t){return(e[r>>>3]|e[1+(r>>>3)]<<8)>>>(7&r)&(1<<t)-1}function s(e,r,t){return(e[r>>>3]|e[1+(r>>>3)]<<8|e[2+(r>>>3)]<<16)>>>(7&r)&(1<<t)-1}function i(e,r){return(e[r>>>3]|e[1+(r>>>3)]<<8|e[2+(r>>>3)]<<16)>>>(7&r)}let d=(l=Uint16Array,u=Uint32Array,{next_code:new l(16),bl_count:new l(16),ordr:[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],of0:[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,999,999,999],exb:[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0],ldef:new l(32),df0:[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,65535,65535],dxb:[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0],ddef:new u(32),flmap:new l(512),fltree:[],fdmap:new l(32),fdtree:[],lmap:new l(32768),ltree:[],ttree:[],dmap:new l(32768),dtree:[],imap:new l(512),itree:[],rev15:new l(32768),lhst:new u(286),dhst:new u(30),ihst:new u(19),lits:new u(15e3),strt:new l(65536),prev:new l(32768)});var l,u;!function(){for(var e=0;e<32768;e++){var r=e;r=(4278255360&(r=(4042322160&(r=(3435973836&(r=(2863311530&r)>>>1|(1431655765&r)<<1))>>>2|(858993459&r)<<2))>>>4|(252645135&r)<<4))>>>8|(16711935&r)<<8,d.rev15[e]=(r>>>16|r<<16)>>>17}function t(e,r,t){for(;0!=r--;)e.push(0,t)}for(e=0;e<32;e++)d.ldef[e]=d.of0[e]<<3|d.exb[e],d.ddef[e]=d.df0[e]<<4|d.dxb[e];t(d.fltree,144,8),t(d.fltree,112,9),t(d.fltree,24,7),t(d.fltree,8,8),n(d.fltree,9),a(d.fltree,9,d.flmap),f(d.fltree,9),t(d.fdtree,32,5),n(d.fdtree,5),a(d.fdtree,5,d.fdmap),f(d.fdtree,5),t(d.itree,19,0),t(d.ltree,286,0),t(d.dtree,30,0),t(d.ttree,320,0)}();let v={table:function(){for(var e=new Uint32Array(256),r=0;r<256;r++){for(var t=r,n=0;n<8;n++)1&t?t=3988292384^t>>>1:t>>>=1;e[r]=t}return e}(),update:function(e,r,t,n){for(var a=0;a<n;a++)e=v.table[255&(e^r[t+a])]^e>>>8;return e},crc:function(e,r,t){return 4294967295^v.update(4294967295,e,r,t)}};function c(f,l){return function(f,l){var u=Uint8Array;if(3==f[0]&&0==f[1])return l||new u(0);var v=s,c=o,p=r,w=i,y=null==l;y&&(l=new u(f.length>>>2<<3));for(var b,h,m=0,g=0,A=0,M=0,U=0,x=0,E=0,B=0,L=0;0==m;)if(m=v(f,L,1),g=v(f,L+1,2),L+=3,0!=g){if(y&&(l=e(l,B+(1<<17))),1==g&&(b=d.flmap,h=d.fdmap,x=511,E=31),2==g){A=c(f,L,5)+257,M=c(f,L+5,5)+1,U=c(f,L+10,4)+4,L+=14;for(var _=0;_<38;_+=2)d.itree[_]=0,d.itree[_+1]=0;var k=1;for(_=0;_<U;_++){var P=c(f,L+3*_,3);d.itree[1+(d.ordr[_]<<1)]=P,P>k&&(k=P)}L+=3*U,n(d.itree,k),a(d.itree,k,d.imap),b=d.lmap,h=d.dmap,L=p(d.imap,(1<<k)-1,A+M,f,L,d.ttree);var S=t(d.ttree,0,A,d.ltree);x=(1<<S)-1;var q=t(d.ttree,A,M,d.dtree);E=(1<<q)-1,n(d.ltree,S),a(d.ltree,S,b),n(d.dtree,q),a(d.dtree,q,h)}for(;;){var z=b[w(f,L)&x];L+=15&z;var F=z>>>4;if(F>>>8==0)l[B++]=F;else{if(256==F)break;var O=B+F-254;if(F>264){var R=d.ldef[F-257];O=B+(R>>>3)+c(f,L,7&R),L+=7&R}var $=h[w(f,L)&E];L+=15&$;var j=$>>>4,C=d.ddef[j],D=(C>>>4)+v(f,L,15&C);for(L+=15&C,y&&(l=e(l,B+(1<<17)));B<O;)l[B]=l[B++-D],l[B]=l[B++-D],l[B]=l[B++-D],l[B]=l[B++-D];B=O}}}else{0!=(7&L)&&(L+=8-(7&L));var G=4+(L>>>3),H=f[G-4]|f[G-3]<<8;y&&(l=e(l,B+H)),l.set(new u(f.buffer,f.byteOffset+G,H),B),L=G+H<<3,B+=H}return l.length==B?l:l.slice(0,B)}(f,l)}async function p(e){let r=await function(e){return e.arrayBuffer?e.arrayBuffer():new Promise(((r,t)=>{let n=new FileReader;n.addEventListener("loadend",(()=>{r(n.result)})),n.addEventListener("error",t),n.readAsArrayBuffer(e)}))}(e);return new Uint8Array(r)}let w="undefined"!=typeof process&&process.versions&&void 0!==process.versions.node&&void 0===process.versions.electron,y=function(){if(w){let{parentPort:e}=require("worker_threads");return{postMessage:e.postMessage.bind(e),addEventListener:e.on.bind(e)}}return{postMessage:self.postMessage.bind(self),addEventListener(e,r){self.addEventListener(e,(e=>{r(e.data)}))}}}();let b={inflate:async function(e){let{id:r,src:t,uncompressedSize:n,type:a}=e;try{let e;f=t,e="undefined"!=typeof Blob&&f instanceof Blob?await p(t):new Uint8Array(t);let o=new Uint8Array(n);c(e,o);let s=[];let i;a?i=new Blob([o],{type:a}):(i=o.buffer,s.push(i)),y.postMessage({id:r,data:i},s)}catch(e){console.error(e),y.postMessage({id:r,error:`${e.toString()}`})}var f}};y.addEventListener("message",(function(e){let{type:r,data:t}=e,n=b[r];if(!n)throw new Error("no handler for type: "+r);n(t)})),w||y.postMessage("start");