(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new URLSearchParams(location.search).has(`debug`),t=class{el;frames=0;updates=0;update_ms=0;draw_ms=0;since=performance.now();constructor(){this.el=document.createElement(`div`),this.el.id=`debug-meter`,document.body.appendChild(this.el)}update(e){this.updates++,this.update_ms+=e}draw(e){this.frames++,this.draw_ms+=e;let t=performance.now(),n=t-this.since;if(n<500)return;let r=this.frames*1e3/n,i=this.updates*1e3/n,a=this.updates?this.update_ms/this.updates:0,o=this.frames?this.draw_ms/this.frames:0;this.el.textContent=`${r.toFixed(0)} fps  ${i.toFixed(0)} ups  update ${a.toFixed(2)} ms  draw ${o.toFixed(2)} ms`,this.frames=this.updates=0,this.update_ms=this.draw_ms=0,this.since=t}},n=1024,r=2048,i=4096,a=8192,o={down:0,held:0,repeat:0,touch_down:!1,touch_held:!1,touch_x:0,touch_y:0},s=class{keys=0;keysold=0;keysdown=0;keysrepeat=0;count;delay;rate;constructor(e=20,t=5){this.delay=e,this.rate=t,this.count=e}scan(e){this.keysold=this.keys,this.keys=e,this.delay!==0&&(this.keys!==this.keysold&&(this.count=this.delay,this.keysrepeat=this.keys&~this.keysold),this.count=this.count-1&255,this.count===0&&(this.count=this.rate,this.keysrepeat=this.keys)),this.keysdown=this.keys&~this.keysold}takeRepeat(){let e=this.keysrepeat;return this.keysrepeat=0,e}},c={ArrowUp:64,ArrowDown:128,ArrowLeft:32,ArrowRight:16,KeyX:1,KeyK:1,KeyZ:2,KeyJ:2,KeyS:n,KeyL:n,KeyA:r,KeyU:r,KeyQ:512,KeyE:256,Enter:8,NumpadEnter:8,Escape:8,ShiftLeft:4,ShiftRight:4,Tab:4},l=[[0,1],[1,2],[2,r],[3,n],[4,512],[5,256],[8,4],[9,8],[12,64],[13,128],[14,32],[15,16]],u=.5;function d(e,t,n=u){let r=0;return e<=-n?r|=32:e>=n&&(r|=16),t<=-n?r|=64:t>=n&&(r|=128),r}var f=new s;function p(e){let t=e.touch(),n=e.keyboard()|e.gamepad();t&&(n|=i),e.lid()&&(n|=a),f.scan(n),o.down=f.keysdown,o.held=f.keys,o.repeat=f.takeRepeat(),o.touch_held=(o.held&i)!==0,o.touch_down=(o.down&i)!==0,t&&(o.touch_x=t.x,o.touch_y=t.y)}function m(e,t,n,r){return o.touch_down&&o.touch_x>=e&&o.touch_x<e+n&&o.touch_y>=t&&o.touch_y<t+r}var h=`delve.settings`,g={name:`Player`,layout:`auto`,pad:`auto`,keymap:null};try{let e=window.localStorage.getItem(h);if(e){let t=JSON.parse(e);if(typeof t.name==`string`&&(g.name=t.name),(t.layout===`auto`||t.layout===`stacked`||t.layout===`side`)&&(g.layout=t.layout),(t.pad===`auto`||t.pad===`on`||t.pad===`off`)&&(g.pad=t.pad),t.keymap&&typeof t.keymap==`object`){let e={};for(let[n,r]of Object.entries(t.keymap))typeof r==`number`&&r>0&&(e[n]=r);g.keymap=e}}}catch{}var _=null;function v(e){_=e}function y(){_?.();try{window.localStorage.setItem(h,JSON.stringify(g))}catch{}}function b(){let e=``;for(let t of g.name.slice(0,10)){let n=t.charCodeAt(0);e+=n>=32&&n<127?t:`?`}return e}function x(e){g.name=e.trim().slice(0,10),y()}function S(e){let t=b();return t.length?t:e}function C(){let e=window.prompt(`Your name (up to 10 letters)`,g.name);return e!==null&&(x(e),!0)}function w(){return g.layout}function T(e){g.layout=e,y()}function E(){return g.pad}function D(e){g.pad=e,y()}function O(){return{...g.keymap??c}}function ee(e){g.keymap=e?{...e}:null,y()}function te(e,t){e.style.left=`${t.x}px`,e.style.top=`${t.y}px`,e.style.width=`${t.w}px`,e.style.height=`${t.h}px`}function ne(e,t,n,r){let i=null;e.addEventListener(`pointerdown`,n=>{if(i===null){n.preventDefault(),i=n.pointerId;try{e.setPointerCapture(n.pointerId)}catch{}e.classList.add(`pressed`),t(n)}}),e.addEventListener(`pointermove`,e=>{e.pointerId===i&&n(e)});let a=t=>{t.pointerId===i&&(i=null,e.classList.remove(`pressed`),r())};e.addEventListener(`pointerup`,a),e.addEventListener(`pointercancel`,a),e.addEventListener(`contextmenu`,e=>e.preventDefault())}var re=class{root;dpad;face;pills;input;dpadBits=0;constructor(e){this.input=e,this.root=document.createElement(`div`),this.root.id=`touch-pad`,this.root.hidden=!0,document.body.appendChild(this.root),this.dpad=this.make(`pad-dpad`,``);for(let e of[`up`,`down`,`left`,`right`]){let t=document.createElement(`div`);t.className=`pad-arm pad-arm-${e}`,this.dpad.appendChild(t)}let t=e=>{let t=this.dpad.getBoundingClientRect(),n=(e.clientX-(t.left+t.width/2))/(t.width/2),r=(e.clientY-(t.top+t.height/2))/(t.height/2),i=0;Math.hypot(n,r)>.2&&(i=[16,144,128,160,32,96,64,80][(Math.round(Math.atan2(r,n)/(Math.PI/4))+8)%8]),this.setDpad(i)};ne(this.dpad,t,t,()=>this.setDpad(0)),this.face=this.make(`pad-face`,``);for(let[t,i,a]of[[`X`,n,`top`],[`A`,1,`right`],[`B`,2,`bottom`],[`Y`,r,`left`]]){let n=document.createElement(`div`);n.className=`pad-button pad-${a}`,n.textContent=t,this.face.appendChild(n),ne(n,()=>e.setVirtual(i,!0),()=>{},()=>e.setVirtual(i,!1))}let i=(t,n,r)=>{let i=this.make(`pad-pill ${t}`,n);return ne(i,()=>e.setVirtual(r,!0),()=>{},()=>e.setVirtual(r,!1)),i};this.pills={l:i(`pad-l`,`L`,512),r:i(`pad-r`,`R`,256),select:i(`pad-select`,`SELECT`,4),start:i(`pad-start`,`START`,8)}}make(e,t){let n=document.createElement(`div`);return n.className=e,n.textContent=t,this.root.appendChild(n),n}setDpad(e){for(let t of[64,128,32,16]){let n=(e&t)!==0;n!==((this.dpadBits&t)!==0)&&this.input.setVirtual(t,n)}this.dpadBits=e;for(let[t,n]of[[`up`,64],[`down`,128],[`left`,32],[`right`,16]])this.dpad.querySelector(`.pad-arm-${t}`)?.classList.toggle(`lit`,(e&n)!==0)}place(e){this.root.hidden=!e,e&&(te(this.dpad,e.dpad),te(this.face,e.face),te(this.pills.l,e.l),te(this.pills.r,e.r),te(this.pills.select,e.select),te(this.pills.start,e.start))}get visible(){return!this.root.hidden}};function ie(e){if(!document.fullscreenEnabled)return null;let t=document.createElement(`button`);return t.id=`fullscreen-button`,t.type=`button`,t.title=`Fullscreen (F)`,t.setAttribute(`aria-label`,`Fullscreen`),t.innerHTML=`<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6V1h5M10 1h5v5M15 10v5h-5M6 15H1v-5"/></svg>`,t.addEventListener(`click`,n=>{n.preventDefault(),e(),t.blur()}),document.body.appendChild(t),t}function ae(){let e=[];for(let t=0;t<5;t++)e.push({score:0,level:0,cause:0,name:``});return{entries:e,count:0}}function oe(){return{music_volume:0,sfx_volume:0,default_zoom:0,auto_attack:0,left_handed:0,screen_shake:0,hit_numbers:0,hints:0}}function se(){return{total_runs:0,best_depth:0,currency:0,upgrades:0,total_kills:0,bosses_slain:0,hints_seen:0,waypoints:0,play_seconds:0,last_played:0,cheats_used:0}}function ce(){return{depth:0,start_depth:0,kills:0,gold:0,rooms_cleared:0,earned:0,bosses:0,seconds:0,cause:0,new_best:!1,abandoned:!1,cheated:!1,seed:0,boons:new Uint8Array(16)}}function le(e,t){let n=e.boons;Object.assign(e,t),e.boons=n,n.set(t.boons)}function ue(){let e=[];for(let t=0;t<8;t++)e.push(ce());return{options:oe(),meta:se(),rogue_board:ae(),history:{count:0,runs:e},last_run:ce(),storage_ok:!1}}var k=ue(),A={game_frames:0};function de(e){Object.assign(e,ue()),e.options.music_volume=7,e.options.sfx_volume=8,e.options.default_zoom=0,e.options.screen_shake=1,e.options.hit_numbers=1,e.options.hints=1}function fe(e,t){e.options={...t.options},e.meta={...t.meta},e.rogue_board={count:t.rogue_board.count,entries:t.rogue_board.entries.map(e=>({...e}))};let n=t.history.runs.map(e=>{let t=ce();return le(t,e),t});e.history={count:t.history.count,runs:n},e.last_run=ce(),le(e.last_run,t.last_run),e.storage_ok=t.storage_ok}var pe=1024;function me(e,t,n){e[t]=n&255,e[t+1]=n>>>8&255}function he(e,t,n){for(let r=0;r<4;r++)e[t+r]=n>>>8*r&255}function ge(e,t){return e[t]|e[t+1]<<8}function _e(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0}function ve(e,t,n){let r=2166136261;for(let i=0;i<n;i++)r^=e[t+i],r=Math.imul(r,16777619)>>>0;return r>>>0}var ye=1,be=2,xe=3,Se=4,Ce=5,we=6,Te=7,Ee=8,j=9,De=10,Oe=11,ke=16,M=17,Ae=18,je=19,Me=20,Ne=21,Pe=22,Fe=23,Ie=32,Le=33,Re=28,ze=27,Be=1,Ve=2,He=4,Ue=17,We=24;function Ge(e,t,n,r){return e[t]=n,e[t+1]=4,he(e,t+2,r),t+6}function Ke(e,t,n,r){return e[t]=n,e[t+1]=1,e[t+2]=r&255,t+3}function qe(e,t,n){let r=n.count>5?5:n.count;e[t]=Ie,e[t+1]=1+r*Ue&255,e[t+2]=r,t+=3;for(let i=0;i<r;i++){let r=n.entries[i];he(e,t,r.score),e[t+4]=r.level&255,e[t+5]=r.cause&255;for(let n=0;n<11;n++)e[t+6+n]=n<r.name.length?r.name.charCodeAt(n)&255:0;e[t+6+11-1]=0,t+=Ue}return t}function Je(e,t,n){let r=ae();if(n<1)return r;let i=e[t];if(i>5||n!==1+i*Ue)return r;for(let n=0;n<i;n++){let i=t+1+n*Ue,a=r.entries[n];a.score=_e(e,i),a.level=e[i+4],a.cause=e[i+5]<=30?e[i+5]:29;let o=``;for(let t=0;t<10&&e[i+6+t]!==0;t++)o+=String.fromCharCode(e[i+6+t]);a.name=o}return r.count=i,r}function Ye(e){return e<0?0:e>65535?65535:e}function Xe(e,t,n){let r=n.count>8?8:n.count;e[t]=Le,e[t+1]=1+r*Re&255,e[t+2]=r,t+=3;for(let i=0;i<r;i++){let r=n.runs[i];he(e,t,r.seed);let a=[r.depth,r.kills,r.gold,r.earned,r.rooms_cleared,r.seconds];for(let n=0;n<6;n++)me(e,t+4+2*n,Ye(a[n]));e[t+16]=r.cause&255,e[t+17]=r.bosses>255?255:r.bosses<0?0:r.bosses,e[t+18]=(r.new_best?Be:0)|(r.abandoned?Ve:0)|(r.cheated?He:0);for(let n=0;n<8;n++){let i=r.boons[2*n]>15?15:r.boons[2*n],a=r.boons[2*n+1]>15?15:r.boons[2*n+1];e[t+19+n]=i|a<<4}e[t+27]=r.start_depth>255?255:r.start_depth<0?0:r.start_depth,t+=Re}return t}function Ze(e,t,n,r){let i=ue().history;if(r.count=0,r.runs=i.runs,n<1)return;let a=e[t],o=n===1+a*Re?Re:n===1+a*ze?ze:0;if(!(a>8||o===0)){for(let n=0;n<a;n++){let i=t+1+n*o,a=r.runs[n];a.seed=_e(e,i),a.depth=ge(e,i+4),a.kills=ge(e,i+6),a.gold=ge(e,i+8),a.earned=ge(e,i+10),a.rooms_cleared=ge(e,i+12),a.seconds=ge(e,i+14),a.cause=e[i+16],a.bosses=e[i+17],a.new_best=(e[i+18]&Be)!==0,a.abandoned=(e[i+18]&Ve)!==0,a.cheated=(e[i+18]&He)!==0;for(let t=0;t<8;t++)a.boons[2*t]=e[i+19+t]&15,a.boons[2*t+1]=e[i+19+t]>>4;a.start_depth=o>ze?e[i+27]:1}r.count=a}}function Qe(e,t=new Uint8Array(pe)){t.fill(0);let n=12;n=Ge(t,n,ye,e.meta.total_runs),n=Ge(t,n,be,e.meta.best_depth),n=Ge(t,n,xe,e.meta.currency),n=Ge(t,n,Se,e.meta.upgrades),n=Ge(t,n,Ce,e.meta.total_kills),n=Ge(t,n,we,e.meta.bosses_slain),n=Ge(t,n,Te,e.meta.hints_seen),n=Ge(t,n,Ee,e.meta.waypoints),n=Ge(t,n,j,e.meta.play_seconds),n=Ge(t,n,De,e.meta.last_played),n=Ge(t,n,Oe,e.meta.cheats_used),n=Ke(t,n,ke,e.options.music_volume),n=Ke(t,n,M,e.options.sfx_volume),n=Ke(t,n,Ae,e.options.default_zoom),n=Ke(t,n,je,e.options.auto_attack),n=Ke(t,n,Me,e.options.left_handed),n=Ke(t,n,Ne,e.options.screen_shake),n=Ke(t,n,Pe,e.options.hit_numbers),n=Ke(t,n,Fe,e.options.hints),n=qe(t,n,e.rogue_board),n=Xe(t,n,e.history);let r=n-12;return t.set([68,76,86,83],0),me(t,4,2),me(t,6,r),he(t,8,ve(t,12,r)),t.subarray(0,12+r)}function $e(e){e.music_volume>10&&(e.music_volume=10),e.sfx_volume>10&&(e.sfx_volume=10),e.default_zoom!==1&&(e.default_zoom=0),e.auto_attack=e.auto_attack===0?0:1,e.left_handed=e.left_handed===0?0:1,e.screen_shake=e.screen_shake===0?0:1,e.hit_numbers=e.hit_numbers===0?0:1,e.hints=e.hints===0?0:1}function et(e,t,n,r){n.total_runs=_e(e,t+0),n.best_depth=_e(e,t+4),n.currency=_e(e,t+8),n.upgrades=_e(e,t+12),n.total_kills=_e(e,t+16),r.music_volume=e[t+20],r.sfx_volume=e[t+21],r.default_zoom=e[t+22]}function tt(e,t,n,r){let i=r.meta,a=r.options,o=0;for(;o<n;){if(o+2>n||o+2+e[t+o+1]>n)return!1;let s=e[t+o],c=e[t+o+1],l=t+o+2;if(s===Ie)r.rogue_board=Je(e,l,c);else if(s===Le)Ze(e,l,c,r.history);else if(c===4){let t=_e(e,l);switch(s){case ye:i.total_runs=t;break;case be:i.best_depth=t;break;case xe:i.currency=t;break;case Se:i.upgrades=t;break;case Ce:i.total_kills=t;break;case we:i.bosses_slain=t;break;case Te:i.hints_seen=t;break;case Ee:i.waypoints=t;break;case j:i.play_seconds=t;break;case De:i.last_played=t;break;case Oe:i.cheats_used=t}}else if(c===1){let t=e[l];switch(s){case ke:a.music_volume=t;break;case M:a.sfx_volume=t;break;case Ae:a.default_zoom=t;break;case je:a.auto_attack=t;break;case Me:a.left_handed=t;break;case Ne:a.screen_shake=t;break;case Pe:a.hit_numbers=t;break;case Fe:a.hints=t}}o+=2+c}return!0}function nt(e,t,n){if(t<12||e[0]!==68||e[1]!==76||e[2]!==86||e[3]!==83)return!1;let r=ge(e,4),i=ge(e,6);if(r<1||12+i>t||_e(e,8)!==ve(e,12,i))return!1;let a=ue();if(de(a),r===1){if(i!==We)return!1;et(e,12,a.meta,a.options)}else if(!tt(e,12,i,a))return!1;return $e(a.options),n.meta=a.meta,n.options=a.options,n.rogue_board=a.rogue_board,n.history=a.history,!0}var rt=null,it=`delve.sav`,at=`delve`,ot=-1;function st(e){rt=e}function ct(e){at=e,ot=-1}function lt(e){return`${at}-${e+1}.sav`}function ut(e){it=lt(e),ot=e}function dt(){return ot}function ft(e,t){let n=rt?.read(e)??null;return n?nt(n,Math.min(n.length,pe),t):!1}function pt(e){let t=e.storage_ok;de(e),e.storage_ok=t}function mt(e,t){let n=lt(e);return pt(t),ft(n,t)||ft(`${n}.tmp`,t)}function ht(e){let t=lt(e);return rt?(rt.remove(t),rt.remove(`${t}.tmp`),rt.read(t)===null):!1}var gt=ue();function _t(){let e=-1,t=0;for(let n=0;n<3;n++)mt(n,gt)&&(e<0||gt.meta.last_played>t)&&(e=n,t=gt.meta.last_played);return e}function vt(e,t){let n=0;for(let t=0;t<3;t++)t!==e&&mt(t,gt)&&gt.meta.last_played>n&&(n=gt.meta.last_played);t.meta.last_played<=n&&(t.meta.last_played=n+1>>>0),ut(e)}function yt(e){return ft(it,e)||ft(`${it}.tmp`,e)?!0:(pt(e),!1)}var bt=new Uint8Array(pe);function xt(e){if(!e.storage_ok||!rt)return!1;let t=Qe(e,bt).slice(),n=`${it}.tmp`;return rt.write(n,t)?(rt.remove(it),rt.rename(n,it)):!1}var St=`delve`;function Ct(e){let t=/^delve-(\d)\.sav(\.tmp)?$/.exec(e);return t?`delve.slot.${t[1]}${t[2]??``}`:`delve.file.${e}`}function wt(e){let t=``;for(let n of e)t+=String.fromCharCode(n);return btoa(t)}function Tt(e){try{let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}catch{return null}}var Et=class{ls;constructor(e){this.ls=e}read(e){let t=this.ls.getItem(Ct(e));return t===null?null:Tt(t)}write(e,t){try{return this.ls.setItem(Ct(e),wt(t)),!0}catch{return!1}}remove(e){try{this.ls.removeItem(Ct(e))}catch{}}rename(e,t){let n=this.ls.getItem(Ct(e));if(n===null)return!1;try{this.ls.setItem(Ct(t),n)}catch{return!1}return this.ls.removeItem(Ct(e)),!0}};function Dt(){try{let e=window.localStorage,t=`delve.probe`;return e.setItem(t,`1`),e.removeItem(t),e}catch{return null}}function Ot(e=k){let t=Dt();if(!t)return st(null),!1;st(new Et(t)),ct(St),e.storage_ok=!0;let n=_t();return n>=0&&(ut(n),yt(e)),!0}function kt(e){return xt(e)}function At(e){let t=Dt();if(!t)return null;let n=new Et(t),r=lt(e),i=n.read(r)??n.read(`${r}.tmp`);return i?{name:r,data:i}:null}function jt(e,t){let n=Dt();if(!n||t.length>1024)return!1;let r=ue();if(!nt(t,t.length,r))return!1;let i=new Et(n),a=lt(e);return i.write(`${a}.tmp`,t)?(i.remove(a),i.rename(`${a}.tmp`,a)):!1}var Mt=e=>1<<e>>>0,Nt=(Mt(3)|Mt(4)|Mt(5))>>>0,Pt=[{code:1526618878,name:`God mode`},{code:3735928559,name:`One-hit kills`},{code:2899203565,name:`All upgrades`},{code:3730628610,name:`Start: Sewers`},{code:3730628611,name:`Start: Caverns`},{code:3730628612,name:`Start: Depths`},{code:186275821,name:`Endless blast`},{code:12648430,name:`Endless dash`},{code:14313186,name:`Endless daggers`},{code:3253350096,name:`Room wipe`},{code:1612537885,name:`Gold x5`},{code:11627286,name:`Giant mode`},{code:232110800,name:`Hard mode`}],Ft={active:0};function It(e,t,n){if(t>>>=0,t===195936478)return 3;for(let r=0;r<13;r++){if(Pt[r].code!==t)continue;let i=Mt(r);return n.id=r,e.active&i?(e.active=(e.active&~i)>>>0,2):(i&Nt&&(e.active=(e.active&~Nt)>>>0),e.active=(e.active|i)>>>0,1)}return 0}function Lt(e,t){return(e&Mt(t))!==0}function Rt(e){return Lt(e,3)?1:Lt(e,4)?2:Lt(e,5)?3:0}function zt(e,t){return Lt(e,2)?4294967295:t>>>0}var Bt=`data:audio/wav;base64,UklGRhQGAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YfAFAACAgYB+enR2en+HkJqVjIJ2aFhfbX2OoLWtmoZwWD9GXneSrMa/pIpwVj1BW3SOp8HApo10W0JAWXKKo7zBqJB3X0c/V2+Hn7fBqpJ6Y0w+Vm2Em7LCq5R9Z1A+VGuBmK7DrJaAalQ/U2l/lKq/rZiDbVhDUmd8kaa6rpqFcVxIUWZ6jqK2r5uHc2BMUWR4i56ysJyJdmNQUGN2iJuusJ6LeWdUUGJ0hpiqsZ+Ne2pYT2FyhJWmsaCOfW1cT2BxgpKjsaCQgG9fT19vgI+fr6GRgXJiU19ufo2cq6KSg3RlVl5tfIuZqKKThXZoWl5seomXpKKUhnhrXV5reYeUoaKViHptYF5reIWSnqKWiXxwY15qd4OPm6KWin5yZl5qdoGNmaKWi390aF5pdYCLlqGXjIF2a2BpdH+JlJ6XjIJ3bWNpc36IkpyXjYN5b2Zpc3yGkJmXjYR7cWhpcnyFjpeXjoV8c2ppcnuDjJWXjoZ9dW1pcnqCipKXjoZ+dm9qcnmBiZGWj4d/eHBqcXmAh4+Wj4eAeXJrcXh/ho2UjoiBenRtcnh/hYuSjoiCe3Vvcnh+hIqQjoiCfHdxcnh9g4mOjoiDfXhzcnh9goeNjoiDfnl0c3h9gYaLjYiEf3p2c3h8gYWKjYiEf3t3c3h8gISJjIiEgHx4dHh8gISHi4iEgH15dXh8f4OGioiEgX16d3h8f4KFiYiEgX57eHl8f4KFiIeEgX98eXl8f4GEh4eEgn99e3l6enl3e35/gYSIjJOSjoqEfnZpXF5lbXeFlKO0s6aXh3doWElNXWx8i5qmsq+gkYJ2a19TU2JueoWRnaisoZWKfnNmWFFcaHOAjpupsqaajH9xZFdNW2h1go+bprGkl4p+c2hdUl5qdX+KlaCro5iOg3htYVVbZnF7h5OfqqabkIR5bWJWWmVxfIeSnaelmo+EenBmW1tmcHqEjpiipZuRh31zaV9aZG54goyWoKackoh+dGthWmRud4GLlJ6mnJOJgHZtZFtkbXZ/iZKbpJyTioF4b2deY2x1foeQmKGdlIuDenFpYWNsdH2FjpaenZSMhHxza2Nja3R8hIyUm52VjYV9dW1mY2tze4KKkZmdlY2GfndwaGNrcnqBiI+XnZWOh4B5cWpka3J5gIeOlZuVjoiBenNtZmtxeH+FjJKZlY+Ignt1b2hrcXd+hIqRl5WPiYN9dnBqa3F3fYOJj5WVj4mDfnhybGtxdnyCh42TlY+KhH95dG5rcXZ7gYaMkZWPioWAenVwa3F2e4CFio+Uj4qFgHt3cm1xdnp/hImNko+KhoF8eHNvcXV6f4OHjJCPi4aCfXl1cXF1en6ChouPj4uGgn56dnJxdXl9gYWJjY+Lh4N/e3d0cnV5fYGEiIyOioeDgHx4dXJ2eX2AhIeKjoqHhIB9enZzdnl8gIOGiYyKh4SBfnp3dHZ5fH+ChYiLioeEgX57eXZ2eXx/goSHioqHhIF/fHl3d3l8foGEhomJh4SCf316eHd5fH6Bg4WHiYeEgoB9e3l3enx+gIKEh4mGhIKAfnx6eHp8foCChIaIhoSCgH59e3l6fH6AgYOFh4aEgoF/fXx6enx+f4GDhIaGhIKBf358e3t8fn+BgoOFhYSCgYB+fXt7fH5/gIKDhIWEgoGAf318e31+f4CBgoSFg4KBgH9+fXx9fn+AgYKDhIOCgYB/fn18fX5/gIGCgoODgoGAf39+fX1+f4CAgYKDg4KBgIB/fn1+fn+AgIGCgoKCgYCAf39+fn5/gICBgYKCgoGAgH9/fn5/f4CAgYGBgoGBgICAf39+f3+AgICBgYGBgYCAgH9/f39/gICAgYGBgYGAgICAf39/f4CAgICBgYGBgICAgH9/f3+AgICAgIGBgICAgICAf3+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==`,Vt=new URL(`blast-QO0Kyyy9.wav`,import.meta.url).href,Ht=new URL(`buy-DgdpwztI.wav`,import.meta.url).href,Ut=new URL(`charged-C8JdEF1E.wav`,import.meta.url).href,Wt=new URL(`chime-18AO3ns5.wav`,import.meta.url).href,Gt=new URL(`coin-O8hZ1kp_.wav`,import.meta.url).href,Kt=`data:audio/wav;base64,UklGRuQNAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YcANAACAgICAgICAgICAgICAgICAf39/gICAgICAf3+AgH+AgYCBgYGAgYGCgoCAf359fn9+f39/gYGAgIF/gX+Bgn+BgIB+fX2Bf4GDhIKAgIJ/gYKDf4J+fn+CgIOBf358e3t/g4B9goKBfoCDgoB9gn1/g36ChYSFf357gX5/hIaIg4GCgH18eXuDhoSBfnl5gISAg4WEg4R/gXx9gYJ9hIOBeHx5f36Eg4Z/gYOGf4SGhIiJgX52foR/gIGCeH9+gHx+goGCdXJ3fnmAgnd7eHR0eXh5dn+Bh4mBjX1/fYB6iIR5g3qCgIWRkYaLiYB2foGNkYl+h3NueoB2gIuBfnd3ioGOkYh6ioF7domBd3pwfX14ho11fHeLjnx2cYt+g4CFhYp2hHp+eXZ+f3yIh3Jze5CWinGFf4KJiIGPf3mJdXKHcIeKf3aHknZ6fn53bn6NcnGKkY1vhJacj22Fcn+RjG9tinF+em1/a2h1bGqDk558f3qHhpuEbYZzhYWZjIp2f3OJhG5udox1i45whm5qg3iXin2Sbopta5iVeWuYk5lzg3lvc4V7e2ySkZmEloaFg416YlpkX5SKl2p8m5KCf2dmZ3d9n3h0dW52doZtooqonZeGoG6Gc4iSbGZaaGN6qIh7gneVmnJujaeXgaJjWIx+YH+ojXlhW5qKpmlpXHVkcIB8aGSsf42Hj214a4uxnap3W4GGjn+Pmqp6epluW2pdlKV8Y1tpYX+TemWYa294g26GgqabtKGjkH+ckqmXjmWNcFRLVmWPdVyYkl5XYHquv59yend0VoiqpWWCZpWFsKhiaKSEeXiYroipiVGNc0qhVHx8pHpfYl2Ed51vcmmzsa2Rc1SXgU1UUpW1bp91k6uTn3JDc4dfcG1Pa3qIo4W9sreaj32XanyKel1DRGeKpKFwrWySUJSWtbCTnZF/TWueWqV/ZjZgUouytpBsRoiElnCmXV1cibJeiaBhQ4CstqF0bnusZ1qDt1s6RIOUYVuPnqSnUHmuw3CmkrFZiKN2PkZHRFGTW6mxuLOit7uLrj8wMElpfJ2pT26IdlGPeqGLxshLl51iQnNsocB2XXmaqoteX6mFPGpal0xfTYTVnHrDUWivRKR3P12DfpFPYdSSilBmz7KPRXCxhZXDnpQ4LqJ9vLrBbL2hrTuOZLO/RVZGZlKNQkN1Q3DIzV0zsNSaR0+/zTtCb16reLBSgdGqQDiSdG+BldNhh1uFqUp5pTipfYWXtT15OG1wPWmLsN6BjazS0tFXMrQzZZ+CZr5dfK8/WHeJT3Q5O21U3nRovb1nu6BylFhWv4DDTzwyqZk5OL+WzUSRTKuinlrMSzagSz+Frda4Q5fBSqdfXjGuk82GSVBd0mFBbkmCqbBeUY20jZvRVFyFkcyVnXSqtls0TmfCY5SbzEShZDmPvJI1xHKRoVZoYDw5qILGR2JV0sLKhjxrVTaPbU6P2dyHQqlKhkXSlnteitF8T37FcpHAYqZ+PCy+gHW/jHlVnVd0ppBCSZypRcpMR0B9oMZYoUuPY3FFrVi1eZqjisHJYF61SGxyy0uSqaMvumSwl2yplFyVd5SGoD5sKKGqsTN3d0FOyr9arJZpjVFVMpeWrIZ2YqRxjql5mDtVtFE9OrJYhoi+jo1BsractpOcr4krqcRKLVtAa0hdQ4V5uIdg09CpW3F8dz9/tKq+oKWytZ5hgYSljWE6UEyQo016rWk8iGxLYj5VhFtLnt/LeMZOTz9Lob2Su4fEl4ZOcnmyXmGwSIVenZdMpHxsubBol0uAR5bEmz9+f3xSZIFPo2xvVHTReVV40Vp1ZqmOVsB6pYW8SltpabqQdIm5knyXkXJzS3e6bG2QkVZ5pUdLqsVOSJhvn0yCX3ark767lq9SdWWPTLRzpr25aaK4P4yQa1BEabZxV4p1jHhgP6udYYCOhLenYmKKUbdFfGSGSWDLtGF7RlJhznloUVnTtcW0p1xMXUhZpo1Kb7y+qKK2hGiAXT1dfVVQan/NkbapkGlwaZOyqGNMPYxlR3Bsa6egdatpwFySpKaDsJGURVB5iFChdIGIsGuHj5VoYnyPlVR5i15SvFCFcU9uZoXHYHqooFFoc8GLbYiKYJ+piIunvY9DepNrlXCMjpOxlZCNUn+FQZRbeYCZnniuc32yYYysQpGIeZafR22Cjq2ZlzpjpKqQWox0goCbiaVraH10OKVgcj9Sr2dlpGSSia58Zl5tRlZfdq7De2hul4dbiXBgrGGDq5GzcrVPq3pGY72gnaJDYnqwsFWwg2JIcoJ8bLSBaZ5kdVRkvpaFlJOAbVVJWH1Vn35veI5vtY5bW7iZdKBYsbqYTnWnjmBhUodmgra2hJ9Yrah6omOpZaKboolAVYSjikJiaFhgg3dsfLeSna5MoVNbmZ6Ne5R1W15XUra7dndqoIRfqbFRd2OPdW1vkIeEl4Gwe5uqh4CUjFVqVEiRcmhTVZuAhZ20nGaxY4aPa6aMklebaYeVa2Nsr5F6gYtkUFaKkLSQoa15bXNrk4JUpoCSfoB/UlSTclufnJtzWJZlj5RqTomhja9mkXeEamODjKiKfImIcmSMc1FfdZiWhKBycZiTeaJSfqGjYJZ/o2qGhqZpalOJVZxgYaqEl3Flcq1mo6SOZI2ggl2Ao4JXW4ZVUHZwh2KNm3mOiqCMjoecW1qgoVWgi56Pb1eRkXpncKR9Y6epYF2PdHqOa4VmZoV+pWWkbnFfcq97n6yRYXRgaXNnlIl0b2dmhGiNeaN6qLCra6F+nHp9ZpBym451Umd4dolaf6arko2FpJJ0dZp8fWaDd5yhnpdLS2WSf2VZZ2FlmG9qkGyhlaSWk2x2dXehfZaJXGSFmG1rd399pY1vc4FoeWORpKWLdoKDZoGBanycjnRrioZyfnuMn3iBhIxsap9ojG9/fm5qpWRnln5vmatwj3uliZqJX3SLZF6ioopciaKSinSBl3lYXZuOm2Jbh3l7a5GVj3h7dXpyfKCWZIaUc5abXYBzeYCWh5ZqjHNjj4Npln6HnXB7fWx9nItrhYNyhnSOdZFvZHBmmaR8bJaXbW58Zmt6amyMe6KmkHKPdpZ7io6KjHFjcptibnN9mm9nY3mVhY+Ge31nn5ZrbpSGk5Nrkm9oj5d2eI51fJ9rmZidbWZ2aZeFk358l2dpkYWOm4yAh3pmbZN+X4Kbhnt4goJ7k5OLhoRldWtolW+OkXhfaIaNeYVtiJGRg4Fhb3ppaZ2SiI2WiHp3l5hqi4RzhXCIgYFkkZiMcIVnfHV7c2d8dHF6cWygc5qEcYCGb4dte5Obd3+cfW51l36MmopxfXd/h5qMf41+bYRzb3l/anmahnt/i4J8hHaJfop6hnJ+gWpugJKVlZGXcGprjHN3b5V3dYaOboWFhoSQkpJ4Z3tqhYKNkoyId4eFcY1+fm+LfomOf4B6cImRamV7bX17d4+IlnZ6hY5/cnqElomPjnt8iod4bYV1cnOGh5OEfY1vf5J4bWxqiYCPkW52dndveH6Dh5p3c5N9hHuSloZweYiEeHtvfI+AgHWJgH2Me3CGjHJ6kYV+c3iFk4qTfm53enBwkZR3cZJ4eXd3coKQd4N4jpWThXSHcol7jnuIgXd+fnSBg4l9hHeAeIp4eXJ6hHt2kIB6f4+OkYV7f3GFjZCMhIh3fXKKgHOMhHWHg4KKeHV+dYN/dXJ0go+NjYOIenmKeIGBcX+JjX6KcYiFiH1/h3Zyg4p4fn55iHqGfXSLd3Jxe3R3j3+JfHRzeJCGfneGgHuCioGFe4R3jZGHgX6Hg4Z/fIV4enh4iX6HdoqCh3eBiXx1fIeJd3qKfXaIioGFh4l4g4mHf3uIi4Z9hYZ8cnxzd35/goeKe4d7eYKJgISFen6HdHKEgX2EfnZ6hISAdYh4eoWLhn6Eg4GFgH95g3d1gHeGfH98gIN8gYt8enp4d4qOe4eEfId7goSFfHiBfYKGeYOKgYF9hnx3fn+CfIeDf4R5hod9fneDiYSIgIWFhn59dYN4foB6e3t3fX6EhYmIfoCDhHp7gH2FgIN5hIiIfoOGenZ/hnmCgn95fn97hIR8gIGGiIZ6fHmBeoOCgoaGg4F/fnh5gH5/hH+ChIV9f36Aenp7goWAgYCAfX2Fhn16g4CCgoGFfYN9enx/g4KGfn6AgYKAe4GDfIJ7gIF+e3yBgYR+gX97fHx8fIWChIKCf4V/hYSFfoOCgYB/g4WFfX6AfIGCfHyAg4V/goB+fHt6fXx9fn1+foSCgoKFhIWEg4N/f36CfoJ+fYCAfXyBfn+CgYB+goGBgIF/fX6Bg4GBg4KDf4GBgIB9e3uAf4CAgoKAgH6Cf4GBfoJ/gH99gIKDgoF+gX+AfX5/f39/foB/fn+BgoF/gIGAgoGAfn5+fn5+gYGBgYCCgoF/fn6Af4CAgICCg4KBgoGAf35+f4B/f3+AgYKCgIGAgIB/gH+AgIGAf3+BgYCAgICAf4F/f39/gICAgYGAf3+AgIGAgYGBgH+Af4CAgH9/gIGBgICAgICAgICAgYCAgIB/gICAgYGAgYGAgICAgICAgICAgICAgICAgICAgICAgICAf39/gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA`,qt=new URL(`death-BzU6e37h.wav`,import.meta.url).href,Jt=`data:audio/wav;base64,UklGRmQLAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YUALAACAgoSHiYyOkZOVmJqdn6GkpqirrbCytLe5vL7Aw8XHyszMzMzMzMzMzMzMzMzMzMzMzMzMzH9ZRj04NjU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0gae6w8jKy8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMf1lGPTg2NTQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0gae6w8jKy8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMf1lGPTg2NTQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0gae6w8jKy8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzH9ZRj04NjU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NIGnusPIysvMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMx/WUY9ODY1NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDU1NTU1NTU1NTY2NjY2NjY2Nzc3NzeBpbfAxMbHyMjIyMjHx8fHx8fHx8fGxsbGxsbGxsXFxcXFxcXFxcTExMTExMTEw8PDw8PDw8PDf15ORkJAPz8/Pz8/Pz8/Pz9AQEBAQEBAQEBBQUFBQUFBQUJCQkJCQkJCQkNDQ0NDQ0NDQ0RERESBn621uLq6u7u7u7u7urq6urq6urq6ubm5ubm5ubm5uLi4uLi4uLi4t7e3t7e3t7e3tra2tra2f2RXUU5MTEtLS0tMTExMTExMTExNTU1NTU1NTU1OTk5OTk5OTk5PT09PT09PT09QUFBQUFBQUIGYpKqsrq6vr6+urq6urq6urq6ura2tra2tra2trKysrKysrKysq6urq6urq6urqqqqqqqqqqqqf2thXFlYWFhXWFhYWFhYWFhYWFlZWVlZWVlZWVlaWlpaWlpaWlpbW1tbW1tbW1tbXFxcXFxcXFyAkpufoaKio6OjoqKioqKioqKioqGhoaGhoaGhoaGgoKCgoKCgoKCgn5+fn5+fn5+fnp6enp6enoBxamZkZGNjY2NjY2NkZGRkZGRkZGRkZWVlZWVlZWVlZWZmZmZmZmZmZmZnZ2dnZ2dnZ2dnaGhogIySlZaXl5eXl5eXl5eXl5eXlpaWlpaWlpaWlpWVlZWVlZWVlZWUlJSUlJSUlJSUlJOTk5OTk5OAdnJwb25ubm5ubm5ubm9vb29vb29vb29vcHBwcHBwcHBwcHBxcXFxcXFxcXFxcXJycnJycnJycnKAh4qMjI2NjY2NjY2MjIyMjIyMjIyMjIyLi4uLi4uLi4uLi4qKioqKioqKioqKiomJiYmJiYmJiYB8enl4eHh4eHh4eHh4eHl5eXl5eXl5eXl5eXl6enp6enp6enp6enp6e3t7e3t7e3t7e3t7e3x8fICCg4SEhISEhISEg4ODg4ODg4ODg4ODg4OCgoKCgoKCgoKCgoKCgoKBgYGBgYGBgYGBgYGBgYGBgYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIKEh4mMjpGTlZianZ+hpKaoq62wsrS3uby+wMPFx8rMzMzMzMzMzMzMzMzMzMzMzMzMzMx/WUY9ODY1NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NIGnusPIysvMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzH9ZRj04NjU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NIGnusPIysvMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzH9ZRj04NjU0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NIGnusPIysvMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMx/WUY9ODY1NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDSBp7rDyMrLzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMf1lGPTg2NTQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ1NTU1NTU1NTU2NjY2NjY2Njc3Nzc3gaW3wMTGx8jIyMjIx8fHx8fHx8fHxsbGxsbGxsbFxcXFxcXFxcXExMTExMTExMPDw8PDw8PDw39eTkZCQD8/Pz8/Pz8/Pz8/QEBAQEBAQEBAQUFBQUFBQUFCQkJCQkJCQkJDQ0NDQ0NDQ0NEREREgZ+ttbi6uru7u7u7u7q6urq6urq6urm5ubm5ubm5ubi4uLi4uLi4uLe3t7e3t7e3t7a2tra2tn9kV1FOTExLS0tLTExMTExMTExMTU1NTU1NTU1NTk5OTk5OTk5OT09PT09PT09PUFBQUFBQUFCBmKSqrK6ur6+vrq6urq6urq6urq2tra2tra2traysrKysrKysrKurq6urq6urq6qqqqqqqqqqqn9rYVxZWFhYV1hYWFhYWFhYWFhZWVlZWVlZWVlZWlpaWlpaWlpaW1tbW1tbW1tbW1xcXFxcXFxcgJKbn6GioqOjo6KioqKioqKioqKhoaGhoaGhoaGhoKCgoKCgoKCgoJ+fn5+fn5+fn56enp6enp6AcWpmZGRjY2NjY2NjZGRkZGRkZGRkZGVlZWVlZWVlZWVmZmZmZmZmZmZmZ2dnZ2dnZ2dnZ2hoaICMkpWWl5eXl5eXl5eXl5eXl5aWlpaWlpaWlpaVlZWVlZWVlZWVlJSUlJSUlJSUlJSTk5OTk5OTgHZycG9ubm5ubm5ubm5vb29vb29vb29vb3BwcHBwcHBwcHBwcXFxcXFxcXFxcXFycnJycnJycnJygIeKjIyNjY2NjY2NjIyMjIyMjIyMjIyMi4uLi4uLi4uLi4uKioqKioqKioqKioqJiYmJiYmJiYmAfHp5eHh4eHh4eHh4eHh5eXl5eXl5eXl5eXl5enp6enp6enp6enp6ent7e3t7e3t7e3t7e3t8fHyAgoOEhISEhIODg4ODg4ODg4KCgoKCgoKCgoKBgYGBgYGBgYGBgYGBgYGBgYCAgICAgICAgICAgICAgICAgICAgICAgIA=`,Yt=new URL(`door-CF5NLllk.wav`,import.meta.url).href,Xt=`data:audio/wav;base64,UklGRqQCAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YYACAACAgYaMfIGJoXmilHiZkpGwd4W5YV1qbIZWYndvf29YXIB7Snp4aYCjmICch4aZlpaen52YlYx+hJxwdFxqhm5yW3CBbnpabnppeGxgaKiAi5KcmomNl4SNlZKAio2elZmOY3l7ZWN1cW9tcoVne2xwgG1td3qMlIaMkYmQiYSImJGSiomClYGNh3d0d3t0b3x3eGh6fG1xfnJ0fHFxiIuQiI+BiY+KipCDhYWOiYuEh42QdH52dHtyent2dHN7dXl6fXd2e3N3ioiEiIyEioKOiISMiIGGiYyChIiFe3t6d3d/eXp6e3x6eXd3eH93fH14hYaJhYaBiIWFiIaHhYaDhYaEg4aHfHh7ent+enp7fH17e3t8fnp9en57fYODg4aEhIOFhIKFg4WDhIKEhISEg4N9fH19fX19fXx8fnx+fX1+fXx9fX19hIKDg4OCg4OCgoOCg4OCgoOCgoOCgoJ+fn5+fn5+fn5+f35+fn5+fn5/fn5+gYKCgoKBgoKCgYGBgoKBgYKBgYKBgYF/f39/f39/f39/f39/f39/f39/f39/f3+BgYGBgYGBgYGBgYGBgYGBgYGBgYGBgX9/f39/f39/f39/f39/f39/f39/f4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA`,Zt=new URL(`explode-CVApJQM3.wav`,import.meta.url).href,Qt=new URL(`fall-D1lrmmSR.wav`,import.meta.url).href,$t=new URL(`fanfare-CTjS7tPb.wav`,import.meta.url).href,en=new URL(`heartbeat-1wHOwgKK.wav`,import.meta.url).href,tn=`data:audio/wav;base64,UklGRqQHAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YYAHAACAgH6Ih3N7tYef1qHFtMfS383Z4Mmp2OS9qOHA4ea+rqLNi6+sfnKGpl9uSD41Mz1DXFhqZWEyCzs3Ng4RHkM5GBlaV0RTPk1Vd3M/VmZ2XnuPkqaMoK2VsMKwl5jSxfTuxtzy4sTEwsOmpc6pvcSlvaKmqqGzt5WjnZaMjHFNZ3+JampTV0E9MDUnLUIrMD84QTMqPTQtMTQzTzs7JzVPUFZFR2Jgc4ZubW94fn91eI+bnbe6tsuvutvRyLHHvLTI29jR2czEyc+5vr28vKi5t6SsuJKKjpqBdWtcYGxiWUVXWFdLWF9eWkI8MDktNEY5NTZAREw2QUY/RlJaXWVdXGNfVl9zfmxra3GJiIKEiZSTkZKTq6Kvp7iuvryzrLzCwrzGw7m/vMfFyri9wMPIwbm6q6usqKSmrJeGiXuJgH6Bg21rX1xTYFlSXF9TT1BEO0g9RElJQUpNPkpKQjs2RlBLRUBGSERJW1NZYF1aW152goePiISSlZ+ZmaGqoJ6YorGyqrO3rry+vLiytbWxuL3FysHBubW1vayrpq2yqpyenZ6fl5SVhX6Diox+g3ZyaGllaG1fYF9XTVhZV0xUT0xNSlNOT1JXS0hSUU1VTEpGT1JRVFRcY2JqYmdkY2tpaWtyfn58h4+YjouQnJ2knqCloaWssbK2u7ixraiztLW6ubW1raqqsLGxrKmmn5+nqKCeoJiVlY+Uio+OiIKGhXx4cXRxbXBqZGlsbGhnZ1xYVlpWWVRaVlZWWFZRUFJNVFFYVVtcWVxVU1hZW2FiZWltaG5yb2xtbXR+fn18hoeGjY2Uk5GQjpaWnKCfoKOlo6Ghn6Snq6qsrK+tra2opKmrqaymqKahnZqZnZyXmJyclpSRjY6IiIuLiYiIgYOCfXd2dHdxcXFvamxnaWpnYF5bWlpcXlpcWFtXV1xeWVldWlpZWVtaWmBjY2FgY2ZjamlpbHFwcXByd3t6foF/g4KGiYyKjI6OjI+TlJeamZiZmJidnJ2goZ6eoJ+hoqShn5+gn6CfnaCgoqChoJ6fnJ2bnJeWlJWVlZGNj4uMioqJhYOBgYGBf3x4d3d3c3FycnJvb21sbGpqamdnaGhlZmZlZGNlYmNlZmZkZWZlZGRkZWVnZmdoamxtbW1ubnBxcXFyc3Z3dnh5fH9/gYCBgYKDhYiIiYqMjY+PkJGSk5KSkpSVlpWXmZeZmZiYmZqam5mamZiYmJmZmJmYl5aWlpaUk5OSkpKQj46OjIuLiomIh4WFhYSCgIB+fn19e3p5eHd2dXV0dHRzcXFwcG5ubm5tbGtsa2tqa2pqaWpqamprampqampqa2xtbW1ubm9wcHBxcnJzc3R0dXV3d3h5enp7fHx+f3+AgYGCg4SFhoaHh4iJiYqLi4yMjY6Ojo+PkJCQkZGRkZKSkpKSkpKTk5KSkpKSkZGRkZGQkJCQj4+Pjo6NjIyLi4uKiomIiIeHhoWFhISDgoKBgYB/f359fXx8e3t6enl5eHh3d3Z2dnV1dHR0c3Nzc3JycnJycnFxcXFxcXFxcXFxcnJycnJyc3Nzc3R0dHR1dXV2dnZ3d3h4eXl5enp7e3x8fX1+fn5/f4CAgYGCgoODg4SEhYWFhoaHh4eIiIiIiYmJioqKioqLi4uLi4uLi4uLjIyMjIyLi4uLi4uLi4uLioqKioqJiYmJiYiIiIiHh4eGhoaFhYWEhISDg4OCgoKBgYGAgIB/f39+fn5+fX19fHx8fHt7e3t6enp6enl5eXl5eXh4eHh4eHh4eHh4eHd3d3d3eHh4eHh4eHh4eHh4eHl5eXl5eXl6enp6ent7e3t7fHx8fHx9fX19fn5+fn5/f39/gICAgICBgYGBgoKCgoKCg4ODg4OEhISEhISEhYWFhYWFhYWFhYWGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhYWFhYWFhYWFhYWFhISEhISEhISEg4ODg4ODg4KCgoKCgoKCgYGBgYGBgYCAgICAgIB/f39/f39/f39+fn5+fn5+fn5+fX19fX19fX19fX19fX19fX19fX19fHx8fHx8fHx8fX19fX19fX19fX19fX19fX19fX19fX19fn5+fn5+fn5+fn5+fn5/f39/f39/f39/f39/f4CAgICAgICAgICAgICAgIGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=`,nn=new URL(`hurt-BBNA0QI7.wav`,import.meta.url).href,rn=new URL(`pickup-BKH1CFkW.wav`,import.meta.url).href,an=`data:audio/wav;base64,UklGRiQKAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQAKAACAgICIhIuclJ+sn6e+v9C4r52qx7u8nqF0ZHB0XTkuIh89JENSJygzHzJfSGFVcpqIeHqckJGu2M7H0rK+p7LIlpaTb19+iFJYZj5AHiE3P1E0O2NrbXKeoIWtqLCqtranwKrFoLe+qaWBhnBUbVNBUz1EKkg2JVlIc5GQc215j6vRw7DArqCxvpqZoaOGj2RpamxUMBosIjsrUUg+SWaAiYedxsXet9rj0cO3wZCShm1yb0ZQREBFKTw8Xk9vgIqjhp2uvrqmo7ipl5qcm3iJc3pOZ1tobmg/OjVVSk1PV46xp7q5vbjDsaesmJWoemBzT0JZVDsmKS5PbniKm6e1xaOjobW5s8e2n5GOjoV0WFFFND4wRlE/VFVid5Cos6Guq5uussWuuKaCiXBrSzRUNiwoJk1ucm2LjICcnp2iqKGxwreRmXZ1gnl7cVE7P05CRmFhdIGgiYqruaWcmqa5nIeOfoWKhXRfP1NMT1x5eZGli5CwvtC0tce5tLqRcYF2WmZPPDovPltff2lrcY2Npq61w8XJopSiiXFpU2NfQ15ZTl15cWRscIuTsqWVoJORh3qCjnRvW2heQVVKQUFrgIGPopOqtsamqaSrlI+SdWpyTWRSUk5mbH5wkaSrnpyjlbKms5KRkYVwUVFNY3B5gmlcZmVui4yhop22nqyemHl+gWJcXlhiZV1tfX+KlpqPma61m5ydlX1/fnJ5a01JWkxteIV4cZWcn6Wyp66Wpp2FeoBpaXF2Xmttemlzf5iajY+otq6TnJ+Fe2pUYVBFYFFneHB1d5CpsKqqo6iXiI56iIBlT1hMVWFyb3iMgYefnLCajo+Ph3l1gIJ2YGFTS2VjYn95foCfqJmNo42UkYh7bmBlVVlWW3R5g41/l6iuqLC0m4d+amRYTFNIVGlxYndzipSZma6cqpaFfW5+a2xgXGhnX29mY3yRnaOvtauXmI+QgWthWGVqaGFub3Vyj4+TjpSXlp2Qj4x1fGRda1taYHiIfIeXl5OMhoF8jIx3hYp3anNxdGZ0dW1td36FnZiPhHt9e2tuaFheWFdrbnB8ipGho5mnj4Z8fHdzdWtpbXiAdXOIkZqKio+OkZ+SjIB/empdanNrZGFyfZCVlpmkqZSGfHGAiHx7d3Vte3JraYGPm6CTkIuXgnyBf2phXVxlXXJ1f3+QhZePkpOVkI95eXV1Zm9jXl56dIN7iYaQmJiTk3xwbG51ZGFpaWVsa22GhpKLlJuGiI6Ldnp7bHF1bXyHe4GKgImYj42VlZR8hHZvZ3R2dnp+hX+MiICThY6QhYJ2bXl7fXdse4mCiYKUl4iPkImGi4Z8gn1+en+EgoJ+iJCNg4yOjX6GhYRzbXFne3Nxgn6GjYZ/ipGSgHp4bHl+g4aHfYKLfnqOhJGLg4CJhXd+dnx5gH56iJGNjI6QiJKKkYmLi3xudHd0dXVze4KEj4uPkIqFe3+Dh4WHgX2Hh3yJipGLjYyLjoSEiHd+f3pwdnR1fYSPj5GNf353fHh7dm5ufHuAgYKHj46RiYN5fnV0dnVxc39/gYuJkI+RjpSNhYZ6eoN3d3R6gnyAeHl+hY2Qi4KIiomFgnx8eX+Ff4V9enp8f4CIfIR8eHl5e3N6dHR3foV9eX17g4eKjIx/fnd6gIKJhIKKjIOBh3yEiIV6fHaAenV6eYR+en1/gomDiH19g4WDeYR/gnt4fISIg3+BgHt3c3J8hIaFgX1/f4aMhYCEiYyNiomDg3yFfoOHioSDe4SEfXx8fXt5fIF/f36Gh4d+hIKEgnt+gnt/e3Z0eHh4eoKCgoiAhoaGiX9+f3+Gf3yChYF6foCFhIOFhYR7gH+AgIR9hH2Dh31/hIB7g36FgIaEfHp/eXl7eIKBf356foGEhoiCfnp/gnyBhX2AhIV/fnp5foSAgoaGf36EfH59e359fIKDhn2CgYCFg4aHfoN/gICCfH6BfoKBgHx6fH6EhH58g3yDhYeAhIKAfX2BfoSFh4WFgHx5foSAgX6BhYWChYKGhoaFgX9+gYR/f359e4GAg36CgoWCf3uBg31+gX98fX9/gXt9foOFhoOEg4aCg4GAfnt8foR/g4SEgoGBg4V+g4SGgX+DhYGAfnx7fHt+goF/fX58fXyAgn18fHyBgHx9gISAhH99gYGAfX99goWEg358fX6AhIKDhYB8e4CAgoV/gICAgICCgYOAhIKDgYKBgoR+f358en98f3x7fYCCgICBfX5/fH5/gX6BgoB8gYGEhoGBgYKBgX2Cfn+Cf36AfX+DgIGBgICDf4B/fX2BgICDfoCDhYF/gYB9fIGBg4OAgH9/fn59foCAfX+ChISEgIKAf3+CgoKAgX9/gYSCgYB+gIF+fn6BgoB/f319fX1/fYCCf3+Ag3+Bf4GCgH5+gIF/fn58f4F+fYCBgoGDg4GAfX+AgICCg4F+fYF/goJ+f35+fn58fICAgH5/gYKAgoKAfn5+fX+BgYKDhIKCgoOCgoGCg3+CgIGCf4CBgYCBgICCgoKDgoKBgYKCgX9/f4GBgoKBgH5/gX+Af35+foB/gX+BgoOAfoCAf4GAf4CBf3+AgIKAgYB/gICAgIGBgH9+fn5+gH6AgIGBgH+Af36BgYKDgX+AgX9/gX9/f4F/fn5/gIF/f4B+foGCgYKAgYGCgICCgoGAgYKAgYCBgICBgIB/fn5+foB/f35+f4CBgX9/f4CBgIB/f36Af4CAgH+AgH+Af3+Af4GAf4GAf4CBgICAf39/f4GBgYGBgIF/f3+Af4GAgYCBgYGAgIF/f3+Af39/gIGBgYKCgYB/gH9/f4F/gH9/gICBgICAf3+AgIGBgYGAf3+AgYGAgH9/gICBgIGBgYCAf3+AgIGBgICAgIGAgICAf3+AgYCAgYCAgH+AgICBgICBgICBgICAgICBgICAgH9/f4CAgICAgIGBgICBgYGAgYGAgICAgICAgYCAgICAgIB/f39/f3+AgICAgICAgICAgICAgICAgICAgH+AgICAgICAgICAgICAgIGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA`,on=new URL(`portal-DS84JRGy.wav`,import.meta.url).href,sn=new URL(`roar-Ct9sTNr6.wav`,import.meta.url).href,cn=`data:audio/wav;base64,UklGRhQGAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YfAFAACAgYB9eXN1eX+HkZ2XjYJ1ZVRca3yPo7qxnYZuVDlBW3aTsMzEqItvUzc7V3OPq8bFqo5zVzw6VXCLpsHGrJF2XEI5U26IorzHrZN6YEc4UmuFnrfIr5Z9ZEw4UGmBmrLJsJiAaFA5T2d/lq3FsZqDbFU+TmV8k6nAspyFb1lDTWN5j6W7s56Icl1ITGJ3jKG2tJ+KdWFMTGB1iZ6ytaCMeGRQS19zh5qutaGOe2hVS15xhJeqtaKQfWtYS11vgpSmtaORf25cS1xuf5Gis6STgnBgT1xtfY6fr6WUg3NjU1trfIycq6WVhXZmVltqeomZqKWWh3hpWltqeIeWpKWXiHpsXVppd4WToaaYinxuYVpodoORnqWYi35xZFtodYKOm6WZjH9zZltndICMmKSZjYF1aV1nc3+KlqGZjoJ3a2Bncn2Ik56ZjoN4bmNncnyHkZuZj4R6cGZncXuFj5mZj4V8cmhncXqEjZaZj4Z9dGtncHmCi5SZkId+dm1ocHmBipKYkId/d29ocHiAiJCYkIiAeXFpcHh/h46VkIiBenNscHd/hoyTkImCe3RucHd+hIuRj4mDfHZwcXd9g4mPj4mDfXdxcXd9goiOj4mEfnhzcXd8goeMjomEf3p1cnd8gYaLjomEf3t2cnd8gIWJjomEgHx3c3d7gISIjImFgHx4dXd7f4OHi4mFgX16dnh7f4KGiYiFgX56d3h7f4KFiIiFgn57eHh7foGEh4iFgn98eHR1e4KKlZGIfG9ocHqKnJeKfGtfb4CSp52Jc1xMZ4SctayPclZCX3uXs7OXe19EXHSPqq6WfmdMX3ePpqyTfGRNXnmRqLKYfmRMWXKMpbadhGtSV26Gn7Ochm9YWXCGnLKbhW9ZWG+HnLKfh3BZVGuCmbCii3VeU2l+lauijHdiVGl+k6ehjHhjU2h+kqakj3plUGV6j6SmkX1oVGR4jKCmkn9rWGR3ip6mk4BtWmN2iZyolYFvXGF0h5mploRxX2BzhZepl4VzYWBxg5WmmIZ1Y19wgpOkmYh3Zl5vgJGimol4aF1ufo+fm4p6al1tfY2dnIx8bFxsfIubnI19bl5reoqZnY5/cGFqeYiXno+AcWNpeIeVnpCBc2Vpd4WTn5GDdWdodoSRn5GEdmlodYKQnZKFeGtndIGOm5OGeWxnc4CNmZOHem5mc3+Ll5SIfHBmcn6KlpSJfXFmcX2IlJWJfnNncXyHkpWKf3RpcHuGkZaLgHVrcHqFj5aLgXdsb3mEjpaMgnhub3mDjZaMg3lvbniCi5WNg3pxbniBipONhHtybneAiZKOhXxzbnd/iJCOhX10bnZ+h4+Ohn52bXZ+ho6Ph393b3V9hY2Ph394cHV9hIyPh4B5cXV8g4qPiIF6c3V8g4mPiIF6dHR7goiPiIJ7dXR7gYiOiYJ8dnR6gYeNiYN9d3R6gIaMiYN9eHR6f4WLiYR+eHR6f4SKiYR/eXR5f4SJiYR/enV5foOIiYSAe3Z5foOHiYWAe3d5foKHiYWAfHh5fYKGiYWBfXh5fYGFiYWBfXl5fYGFiIWBfnp5fYCEiIWCfnp5fICEh4WCfnt5fICDhoWCf3x5fH+DhoWCf3x5fH+ChYWCf316fH+ChYWCgH16fH+BhIWDgH17fH+BhIWDgH57fH+Bg4WDgH58fH6Bg4WDgX58fH6AgoSDgX99fH6AgoSDgX99fH6AgoODgX9+fX6AgYODgX9+fX6AgYOCgYB+fX6AgYKCgYB+fX6AgYKCgYB/fn5/gYKCgYB/fn5/gIGCgYB/fn5/gIGCgYB/fn9/gIGCgYB/f39/gIGCgYCAf39/gIGBgYCAf39/gIGBgYCAf39/gICBgYCAf39/gICBgYCAgH+AgICBgYCAgH+AgICAgYCAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==`,ln=`data:audio/wav;base64,UklGRpcOAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YXMOAACAgoOHcHV0fJ1pkG98jLWIOXVpzqmZkoGafTqfZpFzZ2h5bVzBpq95aos7mHJWaZlvjpt3WpRudXSNZbXFZ5ipL1m3poBHe7Oii0ClX5NIv3yMS4+FhGicZGljqlh0Z7KVjE6OfmJj31h7eaFalYG1RICSwHV1j2BOlbuRVpWfUohrZ3VwhmKUa7yUTLNhjI9ycodlvVaxXnSCW3ORk7qwOohbr2uveVBVf79djH17rF+fjqRsnWF6gZeUPVmQpntmsl1VYmu4ZayqqIZefpSBV5RNdLtyY6B0TWOEicBmqZpmp4JnW3yndll5hWiVW7JjZ554sXp/nFiYhnCnQqZWpllelLNjg41niliOpXFsZKmBrIxPqZuHhnZ9enVcX5+IVpmNf5aXY5RxfXGjbJ9fiJl8ZFWHf6GSnGVsgJBSb2+EgbhkqmZosFZocnKRfXpwrWiAm6qIiYWLi1BalYWDl16Vd3pueJKJoWSQWpNmpqBdlWBzaIttoot7k2h4fmOwY2+pm3V3ZmWWeXWwXYOfk12YgoabhnWGcHqPe2xan3N+dYx9nIF+jnF9jYaFjnF3YXCDh6BZfZl8mGCWd4Ngg52NfXVfmH6Rg3SYXqFbo311mXR4XpuGamqGpZNyXJxqlH6cXpOHWIp1kpx/dYBqgGqYZoxyj2pxm5eYgpVZhYRnbnuOmIt+YpOAbI5ze4WVZ4R3k5RtjnpueIqWgl+Yg3lxgpBycJ97aJ9of46LlGSElHaHd4iSaohwk4WIhnWMXYFmi4xyk3dvdY1+bYKkfIl4aY10dJKOZ6BldoKZjYh1kmSYYXKVjoRtk3ptb6FneIKbjol8X49vmpFfi3Bvmnx2h22FjpNplml2gHh4lYF3iXSSmHh5e3t/dX6RgW54mnuSgoF1g3uBk2h1l5CFhWOIbJJ4f4Fzh5F5e3p1fZWTc3R7knN0fnZ8gZKWc3mIbneOhH6BcYB9gXqZcIZ6fpSUjW9+em+DiX2Ne3eRf3OQeoF8jIN3d4qIfYh4d3d5d5aBb3qEkIyGcYONc41ckXiWmH5qjm5ujoRvb494fIqEkGB4mIZ/eIaUaHmbXIGajXCTimR+b41/h3iEc4WCi396gnqAeJF9hoWEeXR3fJCIlmx2h5Rjm1yPfI1sfHuEgYF2gqJ5gXl9gJh2YpKNf4ZvdXuRf4SCd4+Oe3J/dnx/iH+IgoN7dIh9fJR9cnuGfnp8hH+KcoKKgYl3hYdxeXWPjoaIcXt9gIx7hHWFj3iFhHx4gHh/iYNydZV7gYN6eYB4iYuPdXtzh4B6ioOIenh9g3mKgHuCgHZ5g46BgHiRdoR/jYNse4R4jHmEkXyIfneFdYiAfn+KhXp6hIlsjXV6fISAiXt+hHiOh3OGfIOCg3V1h4J/gHuAfoKEfnyKen+DfYOMhIKCgXWHc39+fIKBgIh1g36IeoCFfoZ2fXqHhICEiHh5f4qFeXmLhnh/eoJ7h3mFfYKIf4SBd3yGhXeGfIGFg3d6f4WHf4OAfnuDgYOEe3t6hH9/goSAfoOBhH+BeYR3hnmDfn6GfIR6f4GDhH6FeX6Ag4OEfYGBe3+AgoB8foB+hoWCe4F6f4CEgoF8goSEfX+EeoJ8hYJ7fId+goF/fIR/gISEfH6Df4R9e3+GgISBf3t/fIB/hnyAfX+FgIGEgXyDgYB/g397hIF9g4OAfoJ7fIGBgoGAf4KAfYGAg4GDgH6AfYCEe4CAgn2CfYV8goKAfn+Ef4CDfoF/gX98fn9/goCAfYWAfoJ9f4WBf36CfoB/gn9+hIB+foSAgIJ8fn+DfoKCf4F9gYCCf4GCgoCAgX58gn9/g39+g31+gn+CfYCBgoKBfoJ9gH6DgICCfoGBfYJ/gYF/f4B+gYGCf4CAgYCBgIF+f36AgH+CgYB+gIF/gH6CgH+BfoCAgn+BgH2AgH+CgYF/foGBf4GAf4KAgYCAfoF+gYB/gIGAf4GAf39/gIF/gX9/f4F/f4KBf4B/goF+gX+Cf4F/gICBf4GAgH6Af4KAgYB+g4F/fIWBfnSDi3x6hHeBiHx/i3p9eIeAfIx+fYV5iH57f4h8dop8fYN8h4F/f32GhHWGhIR/gXyCf3mEgH96ioGAeH1/g4CFfYd1gYd9gYN+eXyLfIB7hH59hoKAgoKAd4ODg31+fX+HeIeEdn+BhoKBfX5/gYJ7hnqHfHp/hoR4fYKGfIF/fYCChIKAg36AgX2FeoV+fYCBfX6Bh4B9gnx+goCFeoR8hYCCfnuFgn+AgH5+f4J/gn5+hYCAgYJ+foR7gYF+gISBe4KCf4F8gH6DgH56gIx4iX19hn58jHiAdop7eoqAe4V8gYVzjoOBdIV1iX+JdYOBiHt+goN/e4N9hXt5fZFzh4N8hXyHf3SHeYWEf4R3foiBfIR9g3Z/g4mEeICBf4N7gYd/eIOAhHuChX92fYF9gYqGeHyIgX58foeCd36Af4l+gYV6gnqDfIl/eoN7gIV7gYR7h3qJfYF7fYKAhH6Ce4KBhoB8goF6hH2BfIJ/goF+gIOCf36DeoF9hX2DgnyAg399hIGBgIB6f4R/gH1/gn+Bg4F9gn6Ee4OBgnqDg4B/fn+Ag3+BfX2Dgn2CgX99gH+AgIWAgX5+hH9/gH9/gX9/goKCgH2Bf4GAf4GAfoF/gIGAgYF+gIGAf3+BgYKAfYCBgIB+goF+gn6Af4CBgYB/f4B/gH+AgoF/gX6CgH+AgIF/f4J/f4GAgIB+goB/gIGAgH6AgYGAf4CBfoCBgICAf3+BgIB/gYF/gH+Af4CAgYCAgICAgYCAgH+AgICBgICAgICAgICAgIGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAf3yJeoZufpyDZIiBeXmGfICYdnuCd5h6g4xmh3+Jfnp0iYuIc36Id3yJh3+FaoRzl3KEhnt/gIODg3p8eHqGlHl1hYmFdYNykXl2gJCHcI9xeHyCj4GJcXqPe36HcHyAhnyJgH99g4mHg2uHhYZ5d4KMcoR+f3qGhYaFdHx8hoeAfImDgHWEdIh7g4p2fIZ4gIp2iXx/iHp4hn+GfYOAf4N+dn5+hol3e4CHhoJ0foSBh3uEh39yjGyUdXJ+kYx3bnp/goaHd2+icHqjeH5/hWiFeqF1bICAh4yGZIJ+lHR4gpN4hZJrkH58bYKNhHeEf3eFeXabeXaIdo2BfW2KfJFrjH2Mhnpwen6WinZ1d42BgHWMhol/bX6FgY2LYn+SbnyCd4p4loR9eoGCe3t7hIeFfoB3eplweo+FdYSAen6EgYVug4d/goqLcX+JcYJ6fJJ4fX6Ign9+iHGCdIuJe3eOeIGFdoCBhXiHgH2LhXZ6jHd+iHWGfIiDdYh7hH2BgX6DeYV9fH6FgXqGfoCCgX17h4CCenuIeoaBf4CAh3uDenqAgYaAfoKAe4R+g4SAg3mAf4OCgHiBg4F/f4KAfYKBfIKAg4GBfn6DeoJ8gYKCgH9+f4R/fn6He36FfIGBgIB9hXqFfX2Gf3+Df4KAfYJ8gYGBf4GAfoJ8gn+Cgn5+f4N/gX+AgoB+f4GAf3+AgYCAgYB/gH+Af4N/f4B/gn+Agn6Af4KAf4CAf3+Bf3+Bf4GAgX+AgH+BgIB/gIGBf3+BgH+AgIB/gYCAgICAgICAgICAgICAgICAgICAgYCAgICAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIJ+iXaGfY1ygIB+eYl6i3aDhI1wfI9ykX14ioJ0hnWNfI16fX56hoKMhXN7fIKPboiFgnp1hXCOfYR4hYV8gnqMgX94jIB6f4R+hn5/d3yEhXiDiHxzhYR9fXeGgZB+gnV8g4d+foSHfoF+e4F7hXKQeX6IioB1f4KChoN5doGIf4h+fH97f4B/inh+foB+iHp8jHp+foZ4hYGMf3d/f3+EgIh9goF+e4GAhXmAhX6DeoiAfn1/g3t8iH2DgH2CgoR9e4Z4gYSIeoJ/hnp8h3yEen6ChH58gX+DhH9/f4J+hnd9h4R+fYV7g4R6hH2AgYB7hIB+gIR5f4KDfYF/gH6FgoF+fIV/fX2EgX9+g3+DgH97hYJ9f4N+fYCAhXyFfIGBf4OBgH9+foCBgYCBfoKAgoF5fY1+e4eIdYxzioFxjHR6iY5uj4J9d36AhXt6hnuJfH6Ch4aBdYeFeoZ8d36JeIqDfnR6jXh/hoN7gYKAgnx5f4KGfX2Md4mAgIZzhYKEeHx/goN/e32CgX1+hIp+gXyIfnWFfX2Mg3yDdYh8fYCChX2GeXqKfYOAe32GfH5/f4SGeYR5g4F9gn1+hnyAgIV+fICDg4OAe4V7f3yDhICDgXiAfoB/g4GDfH6AhoR8g4B+gXx/hH98g4N+gH2Ff3yBgIWAfISBe3x/hH6EfYF/goOAfH6BfoV9gYKAf4F9f4GAgX6BgICCf4KBf32CgYCCfIOAgX2DgH5/gnyCgn2Cf4F/f4CCgH+BfoCEf4GCgIB9gX9/gIN/f4J+gIGAf4CCf4B+goCAf4KBfoKAgX9+f4CBf4B/gIJ/gX6Af4GBgX9/gH+AgYF/gYGAgH9/gICAf4F/gIGAgH+AgH+AgICAf4CBf4CAgICAgIF/gICAgICAgYCAgICAgIGAgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=`,un=`data:audio/wav;base64,UklGRqQMAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YYAMAACAgYGCgH6Ae3p3c3JxeHV3eH6FkpKSmKGQkYiHe3pwa2pcUFFvcW6JjJelm5+4m6SJkY+Ti3ZdTlRWS3JygHN1b4KKmaC0uI2HcoOVaXdbPFxVTWBebnqBlIt/f4CVjKSRlaZhQz1JV21cjFOJbJ9tsbvXwY/AnGuGgHdRPV1WMEt1hnhxcGZlg26swbVudnxUop9+hUo1T3mAPHGqrsrfjoKh36LPzqGbvK1qkUtFiZljU3mmpsi/zLqcm5ubu35NiGBgOHtKO3pwVpp8cbnAwozBvc6ZtLqIk6G6taBJX3Y9Wpezw2yQvbiUbMDPuIuus6aQZE9KQVU0c2FKUWd3qG9uenSrcFJ9nKyQaJWQbWeUr7RhXmtYmGOyrrSgzK/Fy7DDj2yRd1JqYz6Ee6+UvIVvjbbOwX2AVmmqe46ITnI4LFo8kXeItmy3bZSr2qbOt5lrXmRgXollcDErapdsQ05jb4t9oL/Mxa6Bq3ukg4d3flxmel9zbnFtgJtwYad1scGInXmqcFE6dVJNjIaHfIJHiHCiibdsu36XmMi6zciSX0p5n4thaHZWe1k/PWqSdH6jiJulkXOWn2yVkaGbeYBYcENRaZqbtb3Ns62fhbGqeGthjIxif3tZW45QR2qSq4SdanWprJunoJ67y4OctJmCa2pwckGKYnFYe1ZkcXGFcIu0sMrPoY2frY+OjHhuXVxjh1tKkoiZtrOkxrajfmydtoqHkYtok36DgGh9WG6Di3FhVldggZivmq5vclx1gYR1ZltAO1NoSYNRSmhrf5mcsZ+tmnRfX3NpfIqjZZROgJhuiHt9m6+Ba6OeuouziHFzqYuCb1NmcGJ+YY6XglRtfol8lLascpGfoMN/YI9pW454mZ2QbkiEkJ2CZnx1YVVsYWqrwsmutIGStK+7oHhPUoB1d4VkTYWEV4CToHNwlqOPvZSyfoKto6KqlYWTf5eOTlGEXEZuiay6p6ecs7KFmG90c6B3cn1iaV55h3qNeoldZmaVin6Ts7i6srqnj39ycXuZcm1faUpohJRzWX2Oa1Z+eoWOrYB7apFwnJmOdZhqeZCKWEdMb1OImouelW91XHSok6CQoYurkXp7X2WEdnJegZFySVuFh2tYjGeCjHR/pL+HbXBhmW9ylYVsVFRZgHBwXGKLY39wc4t8goaJb3yDiH6DmHBedoGTY0xsW2ZbR2RgbI1/lnppc3KRdZWAh3ptZpxzmoidc3yFbXeOdE9rg3mQenl5ZFt/oYCljo1wYH+emXOGaHKHdmhiXEVsaFpeUGd6hoCkfHCFhX+alpWci4mmenuDj2dWWHFdR1pTc5OVi35icX94faOPgomoe4GklH51h2mPjpluUVdhbXlah2phW2pkhX5ueJmXeouLi5l3ipaihW6BmaCLcIhmd4yEjX+LdIhwamVwY4mnrn+FcYJmkYRtcGtxb41yV2dtaY2WgWqNmKWNeoSKmn+kmoaOcZCLdWFzinGQh32Sdn5xa3ORbXBfbWGHkaakjpV/hXKamYGFfZWSkoxud4p2WFtNZ29egnF1aHiCj3BraXKTpKWZdnR/joF+dHt3cYyFhI6KcICBfoeTfHN9a4h3d5CiiXiOkoh3mHiRenBzZX5rZmZ+X3VqeZFzX2V+cXGUnqmIk4WUoZ6TlZd8i3ONfWlbcmBoWXKFYnJ8fZN8kIh2cWeEd4WVg4+XjpqNeGtogoJvjWx5eYuFjXJ0gXWCeXJtf5Z0bmVmeIOQe5WClYqJmKGTdXOEkJiLb2puYWVkd3V6cICAa4pyb2aElYuWnaOroZl6dJSNnIGPlJJ+k36Sl3NhZ2RqZHtpeHNyf2uDgo6Yon96fId/gYSQeHhydnVviWxgeGyEgomSj5d6bmFbe4Z7b2l4lHiDjoF4k5mImo2WlIl/bnGBd3FvYn2Af4mEe4l3hJR5cnSFhYCTiX1vkKGom5KekoWKe35zbnF/inF1hW5odW6EbHt/dYJ4bHdse3R8k5SQl42OnKOBiI+WjHd5c3ltZoJ9hoN5fIlzfo6XjHSAf5J/c2x7hYWTn4aJhndzfn95bn+OeoqAjpaZeIJtYnBsg391eXprgoSKkZN5hYmMjJaAgI+HlZySknt3fW18fnF9e21qaHJ2dINvgHxxb26Hhnx3in6MgnNrhpWaknyCe36Nfod4bWpxa3x7e3J5amZkaHx0bnRobnp/i4SEd36Ni3l8iXiMkpGUjI2IjH15d36KhIKMenR9hoF2gX5taXx2bm9/c3aFgH90cXN0dHF0gJCIh3x9eHlzh419cXZ2hnmHjYWMjXqFjYKIdoWPlZaRjISBf3dvdIl7e4KLlJCLk4WGg4B9f4uRfXx2hoSDfnR2dIGFe3hzhIWEeYiOfniGeHx7hYOBfHxzcH6BeYCDfHt7d3Z9dIN9dn91fXGAdnB2fHp3eYKBeIN4fXd2b3lyhoqRipCBgomIfnuFeHF/e395doaOkYh+hICGgIJ+gHx7cniFeHJvbnyGf3t1eYOMhYyAi4uCgoiOhoqQg3l3gYyMkIiGg4CEd3Nzc3BsbmtwfIJ4dnVvf4SBenpycHZ1eIKIi4CMkYaGfH6BiX13e3lzfnaChnuDgoB8fHl4dn51fnmBdoB4eoB9e3l6eHp3cX9+eX5/ioB4eoZ7eXiDf3+BiomKgnuGhISAfoCDe3R1gnt6c3V/hH6HgoiAfIeIg4eDiYqBgoqGgoiGfIB7enl+gXt4fYJ6dXN7dXZ3dHyGhoOKg4l/eX55g394g4WEg4N9fIGHhYSEfnp3gYOHi4mCe395g4mAfoCFg4mAgnt4dnd5f3iCfIB6dXl7hHyDgId9fYR/fXl3d3V9hX58fX+Bh4l/fYOGgod+fX57gHqEhoCGhYiMg4iAenl6fYB8gIGAhoJ8d3l6f4J8eXZ3d35+eYF9hYaFf3t8g4KEhYaIi4qHgoiBfn19eH9/e3yCiIaEfYOHiYeDf4N+eHV9hH19g4F9gYd+f35+gH5+gIWBhYmHh4iEg4J9gnx9foF8f3p+god/g4iCh4iDgYOHhYF8e3x7fX15dnx8goaCfYKFhod/foCEgX9/gn18e3l4dnh5f4N/gH+BgIWFiIiGgISGhIWChIOAe3x9f4OAgn57gYWBfoF/gX2BhYB8e398fYKCgX1/f35+fYGBgX1+goWBgICDg4OBgYN/e4GFgYWEh4KGgYN/f3yCgYF+fn+DgYB8f3+Bg359gH+Bfn5/foGBhIKFhYCBhH5+fH1/fH5/gn9+goKAgoSEgYCBgX99fYGDgn1+gH5+f318e4GEf4GDgYKAhIOBgISEgIOBg4WFg4B/goGAg4WAg4KEgIOGgoGBgoKEf4B/foF/gIOCf4B+fHt8gIOFg36BgoR/goSFgIN/gH+AgIJ+gYF/goCCgYCDg4F+fn2BgIOFhYOAf36AgoSCgoODgIKAgIGEhIWGhoOBg4CAfn5/foB/goCCg4F/gIKCgH58fX18e32AgIKBgoGDhIODg4CCgICAgIGCgoODg4OAgYKDgH6BgIGCgH9+fn+BgIF/foB+f4F/gYKAf359fH19fXx8fn59f39/gIGAgYCBgoKAgoGBgYB+f4B/f359f4GAfn9+fn19fX2AgYGCgoOEg4OCgoKBgICBgIGCgX9/gYKCgX+Af36AgYCBgH+BgIKBgX+AgIGCgH9/f4CBf4B/f4CAgIGAf4GCgYGBgYCCgYCBgYB/f35+f4CAgYGBgYF/f359f3+AgYB/gIGBgYGAf4B/gIGCgoGAgICAgYGAf3+AgIB/gIGBf4CBgYB/gICAf35/gH+AgICAgICBgYB/gIB/f35/f4B/gIGAf4CAgH+AgYGAf4CBgYCAgH+Af4B/gICBgIGAgYGAgH9/f39/gICBgH9/f39/f3+Af4CAgICAgH9/f4CAf3+AgH9/gH9/gICAgICAf4CAgICAgICAf39/gH9/f39/f3+AgICAgICAgICAgIGAgICAgICAgIGAgICAgICAgICAgICAgICAgICAgICAgIGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==`,dn=new URL(`slam-B7WqCsrU.wav`,import.meta.url).href,fn=`data:audio/wav;base64,UklGRmQGAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YUAGAACAhX5rfYORcnqNak21sI9nTZh6rYJcglmfnJduUmORz2p8Woh+r3htRYaM0nhgdG2FpZJvU3psu6tfN5esdYibYFlmtaiCOnSrjHagckmOk5WlaD+BoJBwXW+tjJSgdieNj7qIWlF2m510jltZm8GIYFd8q5eGc2BlfKqHj1xesaGAb2t7drCRZWJog7aKZWmJgY+PeW9XdsGzYlVej6OaWXWRdZaHo1k9mK+FgGt6fm6djXVOfqmvjkVNqoyQkl5xZJOgmFtafp+OinNndIe3ll9Rb6ygendegH6eh5NwY3yzeHJxb4akiX9lXXSll2xsdqKSfIdeeoSHun5Ld4+VhGN9jH2Gm3heeIOOmHBgiH+HfptmeHeLmo5zZoqGgYSKd2OOjphpY4CriXZ1XZGQeY6GbWSHt4tsW3WPoXaQXVWNn5NpY3uLoIttenJ0oaVmbmuVo39wfYN4dJeHaXR1rIWCUIF+jpiTW3Fsn5eDb1mfhqBraX15jJGUX1t9pqV9ZXGNjHSddW9xkZuLWWd5kp6EeWpsgK6KaWp1ooh5g3dmjp+Ve19ugJiEenB8i46DfGxkgrCeZ16DknmVjmtxeZKSiGNzhJeJg2FvdY6llVNfh56ReWmEg4qBkYJjapeUfGZ1hIiRg4FuZZiPi3lddpOJiYBxcZOPk3F1Xp6ZfXR4eYt6hpFra4KTnGtvgI6PiXRzboGWlnxgdYOdf3x9eXeKipNddniNlnRyjX95kY1vZnuZoH1tbYmIjXt8Z3yFmo5qY4OYgpJ9aHeIgJ53aWmYh4aAdnaAiI2DbHGQmoKBZn+LiIiAe2F+lZBzbnmFlod7c3aChIuObWiEnohwcX95k5KKeGJ5kJV9anV8kIWQe218epWSa3l8f5iJcnp4dJiOeV99iJp5cnmIeY2Tf2h4fpCUcG56jI5+h3xlg42ShXBshI6MeXd0hoSKhnRqjIuJeoF8doSKiXNpfJeNeXqAgn6EioJqd4edhml7dYiUe4N3doWQhHVveIqUgHGCfoOGiIJxdYWNhnF4gn+PjHpvcoeSi39peYaEhIxydISGkH1ueI6FgoV7doGBhod3c4ORiXd7c36JjoB/dHeEkoNxcX2RjHeAfnqEh4Z1dYCGk3p6fHuDiYx7eHeGkIFzdH2Ei4Z6eHl9lId1enuBhImFdXiCiI54eHuAjIB9f3Z/g4iMcHp9jYZ9eX6BgIiHf29/ho9/c3mFgoSDg3l0h4yFdHWCho2AeXh6iIiIe3Z2hY6Ae3l7g4yHgHN3g4mIfXp3hIeEgnV+f4aNfnJ2g46Cf3aAe4aIhXd5fImMfXN6hIGFh3p4fomHhnJ8gYWFgn18e4OHiXlyg4SJgnx2gIGDiH91eIeJgnt8gIKEgoF4eIOPg3p7fIWGg3t9e32Lg3x4e4OIhX57f4CGh4F4eX6LgX96eoOCiYR4e3qFjIB1e4GFgYR+e3qDiIR6eICGh4J8eXyEhIZ8d3yGi4N4fX+DhIKBdnyFhYN/eHyEhIGDe3uBiYV9d3yChoSAfXiBhoZ/ent/iIN/e399hoSBenqAhoZ+e3uChIV/f3l+hIiBenp/hISCfHyAgYaEenp9hoaAfH6AgIODf3h9g4aEe3t+hIOCf3t8gIaFfXp9g4eCf3t+foSEgnl8goaDfnt9gIOEgn15f4aEfnx8g4OEgH58fISIgXp8f4SEgH19foKFg317foWEgX19f4GEgn97fYOGgX18foKDgn59fIGFhH17f4ODgYB9fYGChIB6fIOEgn99foCDhIF8fIGFg359fYGDgoF+e3+EhIF7fICFg4B+fX+ChIF9fH+EhIB+fX+BhIJ+fH6ChYF9fX+CgoJ/fX2BhYN+e3+CgoF/fn6Ag4N/fH6ChIF/fX+AgoOBfH2BhIJ/fX6BgoKBfX2Ag4OAfX2Ag4KAfn1/goOBfnyAg4OAfn5/gYKBf31/goSAfn5/gYKBf35+gYOCfn1/goKBf35+gIOCf31+gYOBf35/gIKCgH1+gYOCf31/gYKCgH5+gIKCgH1+gYKBgH9+f4KCgX5+gIKCgH9/gIGCgX9+f4GCgH9/gIGBgYB/f4GBgH9/gIGBgIB/f4CBgIB/gICBgICAgICAgICAgICAgICA`,pn=new URL(`splat-CHQX2lBD.wav`,import.meta.url).href,mn=`data:audio/wav;base64,UklGRoQJAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YWAJAACAgICAgICAgICAgH9/f4CBgoGAf359fn9/gYGBgH5+fn+Dg4CDg4OEg4OAgoN+f4B+fn6BgIJ+gYOAf4KCf3t6fnqBfYN/hISBf4CAfHl8hIN7goSHfYF4fnt5g3t+hn96hYGFeXt4gXqIe4R5eoZ9eoSCeYt/d3uEi359dn6JjZKQkIuBdn54cHeHeYB9gHaLfoOAcX12cG9zdIiLnJ+gg351foSMi3l4fWtndXGIfnV1eHmHiYOOgJehmIWBgmt0fXJrioGFmZB8lYBnf21xjpBveXyBdYVwdHydeZB5hoCCkoNuZ2WSlqeabIKRkoN1d410e3yamZ6XcF9tZXCGnIyUZWmXbHFcWpWummxqZ4iThIRmfaSfaXmNcZmDjXmgmYRcaU95nm98fnmRqZp/n3KHho2WYnVqgKGLTGaGn4+XUJGRhJqdU4KMWoF+WItafHZkgH9lqmRKeKmipoiRb2B3T06YcKGwh5akrF1MZXhsTITAiYt5e6x2joGDrVaWa4ihk2+bTXxufKanj2BOallftmGjfHBpTHlignfB0I+UuG5ATVCWfnaubqqeeahwqrp/ia2VjpqjiJ9DYHJPUDenam+sU69KKlpsw8yzd3lOoXBWiU1dwFRGVGOEcn1ycKqJhcBaU8OVvFyFv3epmHDEc26GXKaOhXu9xadhTmIhKLxSu6S+PEugNzdmWVerYdq4Tr5rgJBSgUlZzs+XoLtKbkE+RF1Pa4233d+3h7pLMqOZVWVgeH16t76SeVify1iNlo4sck1MjKKfq6J6Mpu0tIkrPDuTlVzJ2cR1TUCinlqviGhllnWOQZFeuFpfg3SGxFuhnqdxaltxVk59XISbdFqbyWmUoL+fXUanZDGyX2VrZq58goC8R4xVVJ2EUZzVrImuv0lRu8BOiqyDi3FEQTSUVZd+gM59e25WWYy8U8OmQZd3g0mCjbOVn6BSL3ZRU3SaqKnOUYNImoJTaqONy3ZnvJRDn268lKKtcasoTKAzi8adpzRuhG5rok02isu3llmqN0yju3KvQn49VFhEgpl6qliRmYbJW3mDeMuWgnR0vKqMQnxFYz+h0Z6IWHB6dmJcqsu0jTRXrMWEfYxRjmaldYt+eXCzm2Ztp5WDqTdxgGuwtF91jodYkVs9iJBueLylZ6V7X4CXpoV/WytnR7h0jJ5TpWlDi3q8f0g+SI60WniQydC4jn1NgU5grI6ceFx6iV6swlRSo51Yg1ysjX1Obn5yW2Cmx7aPnkdNlUJKrGligLxTuXaQhVa/Yqm2erJCRnpOrI+raEKyZXhYk4llUHq4amyfpLSbrVOsQ0lQq5C9wLSCWqWOR3I5O5Gks6BOk7ePcFc+iLpSoK9onU1cg62DSKyIm1hiSluAgp+zc7KTaFOylESOcnWgYWOHtVSlnViNjpaAY3lfeXhXZ3qDl6twjHVnX8HBq1dQUW6DVoWpuGlMqoF0YnF1dnWXuXyBibGmt1eXY4B+g2hMSbe4gVGkhHyOWl+mobZ1qaBxl0k9llZ8mpNemU2DrYZmsJaWnp9zimpOVVpIjX2xVZ1kb2+4mH5dUHe9hZWqT2d4aHmcY5p0lmajf6WyhUVpr5CVdaKffHZFPluZqp6kSUVkVZK6s1uNko90YaSpkXpFX2Rpa5ueaKxWr4+OaY+kYFWaalqDam13Zq+Zm3SfsrFOYlR+lZB1rY2qcoFQeopkiF18joJiZnuZhWx4eGqVjHxdsmZmequ5omedVlphj5aWsJuTXJyhlU2EeXpjkpiSZYpTiFRRYZi5h4+JnaeVZUyYaZCcXVx1nqCoZX6XbHxflnd4iGyVenSOi4yZkWx+k0+Ae3Faa5ekqZGVjlV+k4lggm1wi4lbhFllnadukmV8dGB+jKRmcF1weqiycoGGg6emWHB/i4KXXniZZ2SKaYdqbnyhlI+OeqSIhVlnhqWRW5FqhGlfl4eMk4h5cIFub5p6kpB+k3JXl5aRm3RxgJVriptnU2GKcKJonHmddWGKdKCZbXqBkW6Af4SCeXZ3ooNhdZKOY3d+mnObll16gYmaa5BdkXFflaSNj3RohZJucm5wmWRhcJuQmJKahV1hemx5eqenj3p3YntthZqAj5WaeGmSfm2GlJtzaGlvbpqNZWZvooCWdG6cbICFepKZcnJ/gIqSd5d9YXeCcJeKgnNqdIyQj2iPjouAkZeAdHqKhIhufGt+Y3+OmICQbV9/eXyIkZZ3gYWIgnqMZIlubYiBemxreXOTfIKFk5iNdG2Efo92i313co+GhpNrgHp1knl9f3J5bYWPoJ17k2xqf4qGa3qCfo+Pb32Kj4mUiXaIgH5+hYR4hXeEjXxpiXBtaHt+kXd8jnB9dI9+dHN4j3lye3WSl4t/cYx8hpl7iH+CfYiCbYt4eoCGjXN6hoF3jJWIgHB7inl8fXiEepCPeW1ri4J0cI18k4GHfYZ1d3Ryhph2j352cX13hYZ7kouOe4iJinWMf2+Keot3b36DiId8iIF0gHyBdnh6iHZ/gZB6go2Bj3t+eXhziYmNgnaDjoN4fomKg4RvcG59gnWKhoqQioeCfYOFd4NzfIl4h3+EdXB2goyFgXx/hYp9gnt3cnyEg4GIgYWCi318hHqFe3V/gnx6jIOFf4B6d4aGfX2Bd4GNh4B2foGFiXx1h4KIg4eBgoCGg4Z7dHN6f4N/iH90fYJ7hHuHgYmDg3mEiXl+d4SHiIR8fnV0foR9d3Z8f4qIioeEhHqBgIF/fYSEeoOAd4GGf316eX9/g4R8g4B/e4GDhYZ/f4F+eIGGgYZ6f36BfoJ8fH5/f4aCgnt/g4SHgn6DhYZ7fnp6gYSCfX58fHuEh36Dg4N9foKChHt7fH6EhoWCgoJ8foN8fX2Cf3x9gIF8gn98gIKCfXuBgX2AfoCDgICDgIJ+gX+AhIR/goCAfn2DgH6Cfn99fIOCgn9/fYJ+g4WAf359f4GDgn+Afn1/gn+DhISCf4F+f4GAgX+Bfn6Agn9+gX9/foKCgIKCgH6AgH99foGBgYGAgYCBgYGBgoGBf35+foB/f36AgYB/gIGAgICAgIGAgYGAgX+AgYGBgICAf4CAgICAf3+Af4B/f39/gICBgYCAgYCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=`,hn=`data:audio/wav;base64,UklGRgQHAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YeAGAACAgIB+fn5+foOFhoiEeXx0dnqEh4+OgYV/dWpqdYKZlJCRendrYnmHfYubiI2JeGp0aIGElYyaeXaEemZxd4SbjYWMdoF6dnB2hn+miIBve3ZujIR3k6mGg2F3bW54iIuQg5CjcldYgmh4hKLAioB4dmp+i350kalpc42FdG2Fb5Khe52Hi0KNdoeJVotsm6tebldjb2/EqoCej3dsgGxVb5GScKSvm3dAbFFggZmxnnmdf3hebmuVfoGNk52SjV6BiYhwRKSjVX18m31XXGtyuLlxoKRTemqWhj9rspSMnoyRTz+KVZGqfZducpiflTSVcWx+l4Vzr455e4pGkJFrjIdvhmqoV4F+oItrfWpyirRUYo52brRkoIx/cW+Bk3OPlFyljHyEnGdRm1Jhn3uBpaxxnHhyaUhpnZlpoY2OeWl1n1eWel6naa97o4Rgd5FQZXuqen+bjXh+UltseLK1aoltkJiHkGlNeIaAcaiTmXVfc2uEbnGafIGGraKRdHR7Z3eMiImPg2p2kHONZoNge6l1mWiVgZmEeF2BY4iGkH55jo99kG5YiXana4uXoHRphn6GeFahmXWJko95Tlh3gXmZlnuVcKRqZ3uWeoCKbpuaeomMdViDcYxgX3mBlIiNl3KHeV+RgpKUXpaHnWSWdF57lF17b3SvlY2bX5mDgXpjWKOHjIxyi3tsgHpujpR8XoyUmnNxfW+UXYaVYXStfJloh2x7bZR/eH+Rdnd6oJZ0hJlwgGl8jYeCdW+Nl3mLdl6DgnZ0poiQZ5Rvg3t4jGiXjXaQfpZ4k4B4iXNbfWd9knSHf4l8lJJ1f4CCgnuDhX2Oa4yEenyJfnmGhGmPkX2PZIprdnx3f2tym4CCmZOAjG+LeIKAe4iAc2uDjm2Nf39obpB6dp5xlpmTgGF8kXN4hXxzhIB8dYOleHmXZXB7gX96eJB9eJ2UeZBojX58YoxxiIp0gp6NcpFigYiHe4FtjYiDdYpshIl1gGl8hpSCk3iRf3pvj4hxb3N7dJmCd5J5mGyHiHdxkX+CbW2beHaZiW6IhJF8Z4KKjm+Abpp1i5B7jnJ5hWOMimyIeHmKkH17d4aEioRicXiClYePjndreYuFc4lsdoiLk3uNfniSfINyindocYKGeZeIlIOGbW56g3SUeIpuj3uDiId6eoGGcHt3komJgGp8k4F8eJRzfn2IjYGHboKDbYWQcXuIiIKLdoB7hXaKhoCHfnSNd3iEf412hnZxgIZ5hYB1eoePeZJ6cXeRioBthXN+fJGRepB+hnCFfm6Hh3l4doqAfoV7i358gIB/eoqMfoOFdoqAgX+IeoF0c4KKdId6d453hIqIh3J2fo2KeHaCfnSHkISEcoSNd3l6hHyJgn2DdXmBgYOQe4iGdnpzh4B3jH54gXp+ioh4iYh/gICDgIF6enWFhIaCfnWGhnd7gnqPdYWIc3+AjYl9goVydoaLg4Vyd3mDjHh/gIN9gXh6iH2IgoB9iXuHdIN6i3eJh312h4aFgYN5f4V3eHx4i3x5gYaNfoiHhXt9fIF/dH2IfoWFgoF5foZ9gHaAgnuAeox6hXyKhn15eYGAfouDeIB+hoF2goF9gX58gY16g4eGfYF9f3iFhHqBeoV6fIKAgnyGfXyEiIOCen2CfX+GeoR+foeGeHqAgoGEf3yIh4GBgn98dnuDgoZ4gHyAgYaFgn1/goF6hIOBf356en19gYuDeYV7gIJ+hn+BhHyCgn98hn5+gXyAfoJ8fIV/fH+Hh4V8fYCEgYF4f4J9f3yFgnyEhn+Df3x+hYN9f32Dg3x9hIB6fIWFe4N7foCFgH6AfIF/fn6Hf4OAf4R9f4CDhH56fIODfIWBfXyAf4Z+goCEf4CDfX9/gn18g4KAf4N+foN+g3x/f4SAhIGAfX+Af31/gX+Bf4N+goKDgX58fIGDgYCCgICBf4F7gX6DgoGAe3yAfoV+gICBg32AfoKBfoJ/f4N/gYJ+gn+Af4OCfn6CgoGBgX2Bf39+gYF9goB+gYB/gIN+gIB+gYGBgH9+goJ/f4GAgYF/gX5+f3+BgoJ/gYB/f3+Bf39/gH+Af4KAgIB/gIGCgICAgIGBf4CBgX9+goCAf4GAgX+Bfn+AgH+Bf3+CgIF/gX+BgYB/gX+AgIGAgH9/f4CBgYGAgH9/gH+Af3+AgYCBgICAgH+Af4F/gICAgIGBgYB/gIGAf4CAgICAgICAf4CBgH+AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgA==`,gn=`data:audio/wav;base64,UklGRiQKAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YQAKAACAhHl0dIKXj4yAR1a5xHRPXYKrmXN9blGNypVRTnOss3JefXB0r6xmSmKaxI9IZYx/kqd8VV2CurJXP4WdjZOBYWV4nbyANGCpo4p5Ym2DiqafTj+TuZdzWmeRkoqbdkBut618VlaNqod+hV1anbaOX0t2tqFrcndlha2ZcFFdpb96VnN8gZ2YeWJYhMOfUVeDj5iRdm1ocKi5bEJxmqCSbmZ5eImxj0lWkqqdcVV2j4SVnGVMfaioglBemZqDjHxYbJupk15JhrGPdnpqbI6fmHZKZa+sdGdvdY2YjoJhVJO9jFxjeZKbhXp1X3Wyp2ZUcJOmi2p0d3CVrn5TYomqnWdfgIKEn5BhXHuhq3pOb5WMjI5wYXSRqZNVVJChi4F0aXeJmZ1vSXarm3xtaXyPjZKFWF6drYZnYnmYkoGEcFyDrZdtXGyYo39yem11nqF6X2GJrZFlbn17jpyEaWF3paduWXmJjJOFcGpxka2HVGWOlpCBbnF5g56aZVSBn5iBaWyDh4yYfFZtmqGJaWCBloiIhmdki6KUclpynZd9fHZqf5qXf2BhkaiFbnR1fpKThG5ffKmabGZ4hJGPgHdrb5infF1uh5aRenJ3dIWij2NhgJiZfWh2gYGSlnNfdZOfiWVoh4yHjn9mbomclW9bfJiNg35wcIOTl39daZacgnZydISOj4hsYIWkj3JsdIeRiIN5ZnWcnHlnboaYi3l5dXGMnoZpZ32ZlnduenuDlo5yZ3SRn4NlcoSGjIx5bHKGnZJqZIKQjIZ6cXaAkZh6XnSTlIV3cHqEiZGHZ2eKm4x2a3eKi4aHdWd9mZR8aW6KlIV9fHB2kJaEbmiAmo53dnh5iJOIdml0lJp8bHaAh46HenFxh52Ka22Ai46EeHZ2f5SUdGZ5jZKGdHN9gImTgWhwiZWMdmx8iIaKhnFsgZOSfWlzjI6EgXlwfI2ShW5qhZaIe3h2fImOiHdpeZWSe3J2f4mLhH1wcoyYhG9xfoyNgXt4dIGVjXRseYuSg3V4fH6MkHxtdIeUinNxf4SHi4JycoCRkXpreYmJhoF2dH6KkYRtcIePh353d3+HjIh1a3+SjX10doGIh4Z9b3aNkoJzcn+MiYB+d3WFkoh3b3qMj394enmAjYt8cXWHk4Z0dn6CiIl/dXSAkY13cHyGiId/eHd9ipCAbnWGjId9d3p/hYyGc3CBjot+dHiChYeHe3F7i46CdHOCioWCfnV4ho6HeHB8jIp/e3l6g4uIfXJ2iY+CeHh8g4iGf3d0gpCJeHR8hImFfnp4fYuNfXJ4hIuGfHl7foWMg3R1gYuKfXV7gYSIhXl0fYmMgnR3g4eFg3x2e4WLhndzf4qHgXx5fIOIh31zeYmLgXp5fYSGhYB3doSNhXp3fIWHg397d3+LiX11eYSKhHx7e36HioF3d4GLiHx4fYCEiIN6d32Ii392eoKFhYJ8eXyEi4R3doGHhoF8en2Ch4d8dH2HiIJ7eX6DhYV/d3mFioR7d32FhYOAenmBiYd9d3qFiIJ+fHt/hoeAeHiCioV9e3yAhIaBe3h+iIh+eHyBhYWBfHp8hYmCeHmAhoWAfHx9goeFe3d+hoeBe3t/goWFfnh7hIiEe3l/hISDgHp7gYeFfnh8hIaCf3x7gIWGgHl6g4eDfnx8gISFgXx5f4eGfnp8gYSEgX17fYWHgXp7gIWEgH18fYKHg3t5foWGgHx8f4GFhH56fYOHgnt7f4KDg397fIGGhH15foOEgn98fYCEhYB6fIOFg358fYGDhIF8eoCGhH97fYGDg4F+e36FhYB7e4CEg4B+fX6DhYJ8e3+EhIB9fX+ChIJ+e32DhoF8fH+Cg4J/fH2BhYN9e3+Cg4J/fX6AhIR/e32ChIJ+fX6Ag4OBfHyBhIN/fH6BgoKBfXx/hISAfHyBg4KAfn1/goSBfXyAhIOAfn1/goOCfnx+g4SBfX1/goOBf319gYSCfnx/goOBf35+gIODf3x+goOCfn5/gIKDgH19gYOCf31+gYKCgH59gIODgH1+gYKCgH5+f4KDgX19gIOCgH5+f4GCgX59f4ODgH5+f4KCgX99foKDgX59f4KCgX9+foGDgn99foGDgX9+f4CCgoB9foGDgn9+f4CCgoB+foCCgoB9foGCgYB+foCCgoB+foCCgoB+foCBgoF+fX+CgoB+foCBgoF/fn+BgoF/foCBgoF/fn+BgoF/fn+BgoF/f3+AgoGAfn6BgoF/fn+AgYGAf36AgoJ/fn+AgYGAf3+AgYKAfn6AgoGAf3+AgYKBf36AgYKAf3+AgYGBf35/gYKBf36AgYGAf39/gYKBf35/gYGAf39/gIGBgH5/gYKBf39/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgH9/gIGBgIB/f4CBgX9/gIGBgIB/gICBgYB/f4GBgIB/gICBgYB/f4CBgYB/f4CBgYB/f4CBgYB/f4CBgYB/f4CBgYB/f4CBgYB/f4CAgYB/f4CBgYB/f4CAgYCAf4CAgYB/f4CAgYCAf4CAgYCAf4CAgYCAf4CAgYCAf4CAgYCAf4CAgICAgICAgYGAf4CAgYCAgICAgICAgH+AgYCAgICAgICAgH+AgIGAgICAgICAgICAgIGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA`,_n=`data:audio/wav;base64,UklGRmQLAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YUALAACAhYqUkIyXnZKdlKSEdp2Jc5KTaHJ+WWxIRCwmYlF2WldqYi02PB8LQ0UuOC1YWTtnRUQxY01kT2aEiomMjJt8jIS01aKPtL+awOnXxsvpwayXrKmVk3N3raiLrpF3VkxIR3hgUGKCYHFaWlx2dF1pSTdZTVxCZWJFbWFRRTQ0XElJWmxri3V0eWdnYo57moqktKjP0Mujq6a13uuzwtzKnr6ty9LQ1ZWojG5vflhkgXl2Yodkb3FBb05yf4J/Wkg2VysdU2dsg3F/bIVXW2mCdoShi3FZiYmEjXZzdHemlYKxtZSxw8zbzLPIyM2pobKkqqOxm5iskXeIbY93lYlnbXlxdWSCWm5CSi8jO1xDOzpFPTlcW05phW9ISXNZT3RagGxtfmeJhp2phKO1maOQnrWpr5m/xdixx6Svnb+bn5+Yfpa1nbGWgoKipZxvcFNFUU1BU22DjXFQcF1NYVpuZ3JJZ19mUkVDO2tQS2JVUFFSRW6AdZaTfqKJobCGpp6gvbCdiLOwv8Td6OrP2beZp4iwnJaKhIygeXdulIeAmIJ1bl9yYmVqd3psf4eKfWVSZFZdUEgxUEhRZXeIgmeDX2OEkoyaemNmjnFzgHeagXSjhIGMraGpvb3LpK+WtZWHkqGFmYSEc4+jqZKAnqSvlZ+ZmoqQgmxrUWVcTmdkVm98Zl88PV5Ycks3MC5Udnx5a2VWXVN0eHOLe5KYl5WYqbipuJuxvLWWsaWdu52toLynk5yerpySjJWDj6KkjYx2fY5vf5V+c39pYm9wXlRedV5pZ1dVaExTUj5CO0Q3TGV2g2l4anZxfXOLgIx0hHN2doaLf5t+hXlzdZyEmqCxu563n5KSqKuynZ6WsKmrn4h5d41/g35wdHqRlod3a2pwiGldX2hURldGYmlidmh1WkNKVGBPYVl0fIBhU0taUFFPeXhvZ2ljgJaegYuckZ6DjJyXh6awn6qYo66wqrWokYeBmYWin4afrZOSgnVqiHlwaWmFc2hbcGB2hnFteXFkd4Noc1ZnW29RS1FZalhMT0ttbmJiYGhndGt6jZF4fI13kX1zaol4g46Qp6SKjYahlaGfn6OYoaOssZWjlaigjY6QjoiLi5SGg26AbYOAf3d5Z19pZGlrfnpfaWBWVmtxZ3BqWWZ0dWhoXFpTc3t3fYJ8cXZ6d3F7hHpxhZian5+TlJGjjaOPjJSnsLGtsKKPmI+SnqyTo5GRm5uQnIeTn6CFgHJzdWxygoR3aWF1a3BlcWFlZmheaXhkVVNUaVdPXGJcaml8bXBlXnmGiIGEd29tbnN7d3mJk4aKfYmPhJWXpZWJmKCUlIySp5mUoqyinZibpKedlJuZoYiPlIh1doqNgYp2gH+Le3RwcHBnal5qdmxqeXx4c3twcHlua3F2eXJrd3x5cGZvgImKgYuRg4N+d314jJiJf3uPiZWhlJ2MgY+MiI+cmJqgj5GEgn59koKGfHWLipORjpF9d4GPf3yCgIhxcXyHjoqIdWtdU252h2l1gW1wdWxnY3B7eYB9jYCMgH15goWMh46Da3ZxaXVzc3F4f35wc32AiICBiKCXm4KDjp6qqJuBlqORh4ScgX6RloyWi4mHcm51cGl3hJKBhIqNh4pzbnVqZWxxcW1wc25maG9xXlNkaV1kdHh1cWheY3lufH+Kfnhwb4OMg4aEf3R4dWlzgn+JjYGHi5OIi3mCi3yMjJyVlY6XnZqXmpOQmpSBeH2KhoaEgoaJfn2PkYWHeXV5d3J6c35xcHqDdn50dHFte3Jvc3mAfXiAeHaCi4SAc3NzhnR6d3x4e3V0bHeAhYGNf4GEi4qSh4uIh4aChIqEg4iLgo6MlpOUjoeFenx0fICEfISLjoqAh46PkJGKkYaHe3aCfnhweYV4bW95en9/dHuCenFxb3l0cXZ3gHx5d3SAhHJvdm90fYiBiIR8gIaMiJGMh3t9fY2JiZSSmZOMiYyAgYeCgoaPm5GZlJKSl5+KiH+CfH+AhIiKg4aFiI+LgXl3gIGDgYGKhIp7gYiKfYB6g4B8e3d6fHV3e3R4cn17c3BnbnF+cneAfnp0dHV+hYl+io6Bh4F7fn2De399goeHhYCDjYV8f4eIjoGAhH6IgoGGkJeNhYOFjIaGipGOjI+OkIiKgYGHiYWEfHp1eYR9h4V9gH2HhIKJgnl6g3x9fXR3e3R1d359cnlzeXqCeXd8fYV7gXmEiYR+fHt8eXR4c29ud3h6fYeHiImLiIh/eYCAgYZ/g3+Ih4J/h4KHi5KNiY2Jg4OBg4CCgoOFhYqLjIuCg4OAhIeIiYR9goGCiIuGioaChIB/fHV7dnN8d32ChH94cXt8eXyBgIOBfXZyd3h8fHx/hYB8gHh5d316gHt8goF/f4B8enyFg4B9gYOEfnx9foGChn9+fYF+goWAhIF8fX6FgoSBgIGEgHx6gYJ+goOBhIiIgHp7d4B/fHt5foB6eX2BgX5/hH5/en99fn98fX15end9e3h9gYJ7enh7gYR/goN+fIKFiIOEg4GCfXx8g358gX+Eg4B+fH18gH6BfoOFiIuMiIqHhYaGhIWDfoJ+gYCEf358gYKAgoF/goOEg4WBgH+CgH18fYCDhYF/fX99gn19gX59eXt9fXx9gH2AfoB+fX9/fH59enp7gICBgIKBfHt+gX58gYF+fH19f3yBgoB/f32AgYGBgYSBgoKAgoGDgH6AhISAgoF+gYOCgoOBgYKDgIGAf4CAgoGAfX58foGAgYGBgoB+f31/gn9/fn2BgIGAgYF/fYGAgYCCgIKEhIKCgn99fICAf35/gIF/foF/fn5+f359gIKBf4CCg4KCgn5/fn9/foCBgIKBgIGBgYB/gYKCgoKAfn+BgYGBgICAf3+BgICAgIGBg4GBgoF/gIB+f32AgYKAf39/gIGBf4B/gH+Af3+AgYF/f39+fX5+fn5/gIGBgH+BgICBgYB/gIF/gIB+fX59foB+f4CBgYCBgH+BgX9/gIF/gYF/fn9/gIGBgoKBgoKBgYGAgIGCgYCBgoGCgYKAgYB/gICAgYCBgYB/gH9/gH+Bf4GAgIGAgH+BgH9/gICAgYB/gICBgICBf4B/f4B/gICAgICBgH+Af4CAgH+AgH+Af4B/f4CAf4CAgICAgYGAgIB/gICBgIGAgYCAgYCBgIGAgYCAf4CBgIB/gIGAgIB/gICAf3+AgYGAgICBgYGAgYGAgICAf4CBgICAgYGAgICBgICBgYGBgICAgICAgICAgICBgYGAgICBgYGBgICAgICBgICAgICAgICBgIB/f3+AgICAgICBgICAgICBgICBgYGBgYGBgYCAgICAgICBgICAgICAf4CAgIGAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=`,vn=new URL(`boss-BqKnsWf0.xm`,import.meta.url).href,yn=new URL(`camp-BVHgvw9D.it`,import.meta.url).href,bn=new URL(`caverns-s3odexj0.xm`,import.meta.url).href,xn=new URL(`dungeon-aNSEtMbz.xm`,import.meta.url).href,Sn=new URL(`molten-pr0BDa6v.xm`,import.meta.url).href,Cn=new URL(`sewers-Cio0LsT1.it`,import.meta.url).href,wn=new URL(`title-w50CYSck.xm`,import.meta.url).href,Tn=4096,En=Tn/2;function N(e){return Math.trunc(e*4096+(e>=0?.5:-.5))|0}function P(e){return Math.imul(e,Tn)}function F(e){return e>>12}function I(e,t){return Math.floor(e*t/4096)|0}function Dn(e,t){return Math.trunc(e*4096/t)|0}function On(e){return e<0?-e|0:e}function kn(e,t,n){return e<t?t:e>n?n:e}function An(e,t,n){return e+I(t-e|0,n)|0}function jn(e){return I(I(e,e),P(3)-2*e|0)}function Mn(e){if(e<=0)return 0;let t=e*4096,n=0,r=2**62;for(;r>t;)r/=4;for(;r;)t>=n+r?(t-=n+r,n=Math.floor(n/2)+r):n=Math.floor(n/2),r=r>=4?r/4:0;return n|0}function L(e,t){return Math.trunc(e/t)|0}var Nn=[1,1.58,1.973,1.882,1.151,1.713,1.429,1.849],Pn=`modulepreload`,Fn=function(e,t){return new URL(e,t).href},In={},Ln=function(e){return e.pathname.endsWith(`.css`)},Rn=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},zn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=Fn(t,n);let r=s(t),i=Ln(r);return Rn(In,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:Pn,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{t.addEventListener(`load`,e),t.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${r}`)))})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},Bn=[];if(Bn[0]=`select`,Bn[1]=`swing`,Bn[2]=`hit`,Bn[3]=`hurt`,Bn[4]=`dash`,Bn[5]=`door`,Bn[6]=`pickup`,Bn[7]=`death`,Bn[8]=`shoot`,Bn[9]=`pop`,Bn[10]=`throw`,Bn[11]=`tink`,Bn[12]=`blast`,Bn[13]=`charged`,Bn[14]=`shatter`,Bn[15]=`wood`,Bn[16]=`explode`,Bn[17]=`coin`,Bn[18]=`fall`,Bn[19]=`spikes`,Bn[20]=`roar`,Bn[21]=`slam`,Bn[22]=`splat`,Bn[23]=`fanfare`,Bn[24]=`portal`,Bn[25]=`chime`,Bn[26]=`back`,Bn[27]=`deny`,Bn[28]=`empty`,Bn[29]=`heartbeat`,Bn[30]=`buy`,Bn.length!==31)throw Error(`audio: sound_files`);var Vn=[];Vn[1]=`title.xm`,Vn[2]=`camp.it`,Vn[3]=`dungeon.xm`,Vn[4]=`sewers.it`,Vn[5]=`boss.xm`,Vn[6]=`caverns.xm`,Vn[7]=`molten.xm`;var Hn=[];Hn[1]=84,Hn[2]=58,Hn[3]=62,Hn[4]=100,Hn[5]=56,Hn[6]=25,Hn[7]=46;var Un=24,Wn=0,Gn=0,Kn=0,qn=Object.assign({"../../assets/audio/back.wav":Bt,"../../assets/audio/blast.wav":Vt,"../../assets/audio/buy.wav":Ht,"../../assets/audio/charged.wav":Ut,"../../assets/audio/chime.wav":Wt,"../../assets/audio/coin.wav":Gt,"../../assets/audio/dash.wav":Kt,"../../assets/audio/death.wav":qt,"../../assets/audio/deny.wav":Jt,"../../assets/audio/door.wav":Yt,"../../assets/audio/empty.wav":Xt,"../../assets/audio/explode.wav":Zt,"../../assets/audio/fall.wav":Qt,"../../assets/audio/fanfare.wav":$t,"../../assets/audio/heartbeat.wav":en,"../../assets/audio/hit.wav":tn,"../../assets/audio/hurt.wav":nn,"../../assets/audio/pickup.wav":rn,"../../assets/audio/pop.wav":an,"../../assets/audio/portal.wav":on,"../../assets/audio/roar.wav":sn,"../../assets/audio/select.wav":cn,"../../assets/audio/shatter.wav":ln,"../../assets/audio/shoot.wav":un,"../../assets/audio/slam.wav":dn,"../../assets/audio/spikes.wav":fn,"../../assets/audio/splat.wav":pn,"../../assets/audio/swing.wav":mn,"../../assets/audio/throw.wav":hn,"../../assets/audio/tink.wav":gn,"../../assets/audio/wood.wav":_n,"../../assets/music/boss.xm":vn,"../../assets/music/camp.it":yn,"../../assets/music/caverns.xm":bn,"../../assets/music/dungeon.xm":xn,"../../assets/music/molten.xm":Sn,"../../assets/music/sewers.it":Cn,"../../assets/music/title.xm":wn});function Jn(e){let t=qn[`../../assets/${e}`];if(!t)throw Error(`missing asset ${e}`);return t}async function Yn(e){let t=Jn(e);if(t.startsWith(`data:`)){let e=atob(t.slice(t.indexOf(`,`)+1)),n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n.buffer}return(await fetch(t)).arrayBuffer()}var Xn=null,Zn=!1;function Qn(e){let t=Xn,n=t?.modules[e];t?.node&&n&&t.node.port.postMessage({cmd:`play`,val:n.slice(0)})}function $n(){Xn?.node?.port.postMessage({cmd:`stop`})}function er(e){let t=Xn;if(!t)return;let n=Wn===0?1:Nn[Wn];t.music_gain.gain.setTargetAtTime(e/1024*n,t.ctx.currentTime,.008)}function tr(){Wn!==0&&Qn(Wn),ir()}function nr(){if(Xn){Xn.ctx.state===`suspended`&&!document.hidden&&Xn.ctx.resume();return}if(Zn)return;Zn=!0;let e;try{e=new AudioContext}catch{return}e.resume();let t=e.createGain();t.gain.value=0,t.connect(e.destination);let n={ctx:e,music_gain:t,node:null,modules:Array(8).fill(null),sounds:Array(31).fill(null)};Xn=n;for(let t=0;t<31;t++)Yn(`audio/${Bn[t]}.wav`).then(t=>e.decodeAudioData(t)).then(e=>{n.sounds[t]=e}).catch(e=>console.error(`audio: sound`,Bn[t],e));let r=Promise.all(Vn.map((e,t)=>e?Yn(`music/${e}`).then(e=>{n.modules[t]=e}):Promise.resolve()));zn(async()=>{let{worklet_url:e,worklet_src:t}=await import(`./_virtual_delve-worklet-BaPHxrQu.js`);return{worklet_url:e,worklet_src:t}},[],import.meta.url).then(({worklet_url:t,worklet_src:n})=>e.audioWorklet.addModule(t??`data:text/javascript;charset=utf-8,${encodeURIComponent(n??``)}`)).then(()=>r).then(()=>{let r=new AudioWorkletNode(e,`libopenmpt-processor`,{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});r.port.postMessage({cmd:`config`,val:{repeatCount:-1,stereoSeparation:100,interpolationFilter:0}}),r.connect(t),n.node=r,tr()}).catch(e=>console.error(`audio: music`,e))}function rr(e){Xn&&(e?Xn.ctx.suspend():Xn.ctx.resume())}function ir(){let e=Wn===0?100:Hn[Wn];er(L(L(L(k.options.music_volume*1024,10)*e,100)*Kn,Un))}function ar(e){Gn=e,Wn===0&&e!==0&&(Wn=e,Kn=0,Qn(e),ir())}function or(){Wn===Gn?Wn!==0&&Kn<Un&&(Kn++,ir()):(Kn>0?Kn--:(Wn!==0&&$n(),Wn=Gn,Wn!==0&&Qn(Wn)),ir())}function R(e){let t=L(k.options.sfx_volume*255,10);if(t===0)return;let n=Xn,r=n?.sounds[e];if(!n||!r||n.ctx.state!==`running`)return;let i=n.ctx.createBufferSource();i.buffer=r;let a=n.ctx.createGain();a.gain.value=t/255,i.connect(a).connect(n.ctx.destination),i.start()}function sr(){ir()}function cr(){return{playing:Wn,wanted:Gn,fade:Kn,unlocked:Xn!==null,music_ready:!!Xn?.node,sounds:Xn?Xn.sounds.filter(e=>e).length:0,context:Xn?.ctx.state??`none`,time:Xn?.ctx.currentTime??0}}var lr=null;function ur(){let e=Xn;if(!e)return 0;lr||(lr=e.ctx.createAnalyser(),lr.fftSize=2048,e.music_gain.connect(lr));let t=new Float32Array(lr.fftSize);lr.getFloatTimeDomainData(t);let n=0;for(let e of t)n+=e*e;return Math.sqrt(n/t.length)}async function dr(e){let t=Xn,n=t?.modules[e];if(!t||!t.node||!n)throw Error(`audio: not ready`);let r=new AudioWorkletNode(t.ctx,`libopenmpt-processor`,{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[2]});r.port.postMessage({cmd:`config`,val:{repeatCount:0,stereoSeparation:100,interpolationFilter:0}});let i=await new Promise(e=>{r.port.onmessage=t=>{t.data.cmd===`fullAudioData`&&e(t.data.data)},r.port.postMessage({cmd:`decodeAll`,val:n.slice(0)})}),a=0,o=0;for(let e of i)for(let t of e)a+=t*t,o++;return 10*Math.log10(a/o)}var fr=class{heldCodes=new Set;tapped=0;pointerId=null;pointer=null;tapPoint=null;blurred=!1;keymap={...c};onPageKey=null;capture=null;virtualHeld=0;virtualTapped=0;onPhysicalInput=null;padWasActive=!1;touchCanvas;constructor(e){this.touchCanvas=e,window.addEventListener(`keydown`,e=>this.keyDown(e)),window.addEventListener(`keyup`,e=>this.keyUp(e)),window.addEventListener(`blur`,()=>{this.blurred=!0,this.heldCodes.clear(),this.virtualHeld=0}),window.addEventListener(`focus`,()=>{this.blurred=!1});let t=e;t.addEventListener(`pointerdown`,e=>this.pointerDown(e)),t.addEventListener(`pointermove`,e=>this.pointerMove(e)),t.addEventListener(`pointerup`,e=>this.pointerUp(e)),t.addEventListener(`pointercancel`,e=>this.pointerUp(e)),t.addEventListener(`contextmenu`,e=>e.preventDefault())}captureNextKey(e){this.capture=e}setVirtual(e,t){t?(this.virtualHeld&e||(this.virtualTapped|=e),this.virtualHeld|=e):this.virtualHeld&=~e}keyDown(e){if(this.capture&&!e.repeat){e.preventDefault();let t=this.capture;this.capture=null,t(e.code);return}if(e.ctrlKey||e.metaKey||e.altKey)return;let t=this.keymap[e.code];t!==void 0&&this.onPhysicalInput?.(),t===void 0?e.repeat||this.onPageKey?.(e.code):(e.preventDefault(),this.heldCodes.has(e.code)||(this.tapped|=t),this.heldCodes.add(e.code))}keyUp(e){this.keymap[e.code]!==void 0&&e.preventDefault(),this.heldCodes.delete(e.code)}keyboard(){let e=this.tapped|this.virtualTapped|this.virtualHeld;this.tapped=0,this.virtualTapped=0;for(let t of this.heldCodes)e|=this.keymap[t]??0;return e}gamepad(){if(typeof navigator.getGamepads!=`function`)return 0;let e=0;for(let t of navigator.getGamepads())if(t&&t.connected&&t.mapping===`standard`){for(let[n,r]of l)t.buttons[n]?.pressed&&(e|=r);e|=d(t.axes[0]??0,t.axes[1]??0)}return e&&!this.padWasActive&&this.onPhysicalInput?.(),this.padWasActive=e!==0,e}toDs(e){let t=this.touchCanvas.getBoundingClientRect(),n=Math.floor((e.clientX-t.left)/t.width*256),r=Math.floor((e.clientY-t.top)/t.height*192);return{x:Math.min(255,Math.max(0,n)),y:Math.min(191,Math.max(0,r))}}pointerDown(e){this.pointerId===null&&(e.pointerType!==`mouse`||e.button===0)&&(e.preventDefault(),this.pointerId=e.pointerId,this.touchCanvas.setPointerCapture(e.pointerId),this.pointer=this.toDs(e),this.tapPoint=this.pointer)}pointerMove(e){e.pointerId===this.pointerId&&(e.preventDefault(),this.pointer=this.toDs(e))}pointerUp(e){e.pointerId===this.pointerId&&(this.pointerId=null,this.pointer=null)}touch(){let e=this.pointer??this.tapPoint;return this.tapPoint=null,e}lid(){return this.blurred||document.visibilityState===`hidden`}},pr=class{canvas;ctx;display;displayCtx;constructor(e){this.display=e,this.canvas=document.createElement(`canvas`),this.canvas.width=256,this.canvas.height=192,this.ctx=mr(this.canvas),this.displayCtx=mr(e)}place(e,t){let n=this.display.style;n.left=`${e.x}px`,n.top=`${e.y}px`,n.width=`${e.w}px`,n.height=`${e.h}px`;let r=256*t,i=192*t;(this.display.width!==r||this.display.height!==i)&&(this.display.width=r,this.display.height=i),this.displayCtx.imageSmoothingEnabled=!1}present(){this.displayCtx.imageSmoothingEnabled=!1,this.displayCtx.drawImage(this.canvas,0,0,this.display.width,this.display.height)}};function mr(e,t=!1){let n=e.getContext(`2d`,{alpha:t});if(!n)throw Error(`2D canvas is not available`);return n.imageSmoothingEnabled=!1,n}function z(e,...t){let n=``,r=0,i=()=>t[r++];for(let a=0;a<e.length;a++){let o=e[a];if(o!==`%`){n+=o;continue}a++;let s=!1,c=!1,l=!1,u=!1;for(;;a++){let t=e[a];if(t===`-`)s=!0;else if(t===`0`)c=!0;else if(t===`+`)l=!0;else if(t===` `)u=!0;else break}let d=0;if(e[a]===`*`)d=Number(i()),d<0&&(s=!0,d=-d),a++;else for(;e[a]>=`0`&&e[a]<=`9`;)d=d*10+(e.charCodeAt(a++)-48);let f=-1;if(e[a]===`.`){if(a++,f=0,e[a]===`*`)f=Number(i()),a++;else for(;e[a]>=`0`&&e[a]<=`9`;)f=f*10+(e.charCodeAt(a++)-48)}for(;e[a]===`h`||e[a]===`l`||e[a]===`z`;)a++;let p=e[a],m,h=``,g=!0;switch(p){case`d`:case`i`:{let e=Math.trunc(Number(i()));e<0?h=`-`:l?h=`+`:u&&(h=` `),m=String(Math.abs(e));break}case`u`:m=String(Number(i())>>>0);break;case`x`:m=(Number(i())>>>0).toString(16);break;case`X`:m=(Number(i())>>>0).toString(16).toUpperCase();break;case`c`:g=!1,m=typeof t[r]==`string`?String(i())[0]??``:String.fromCharCode(Number(i()));break;case`s`:g=!1,m=String(i()??`(null)`),f>=0&&(m=m.slice(0,f));break;case`%`:n+=`%`;continue;default:throw Error(`cfmt: unsupported conversion %${p}`)}g&&f>=0&&(m=m.padStart(f,`0`),c=!1);let _=h.length+m.length;n+=_>=d?h+m:s?h+m+` `.repeat(d-_):c&&g?h+`0`.repeat(d-_)+m:` `.repeat(d-_)+h+m}return n}var hr=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,15,15,1,0,0,0,0,0,0,0,0,0,0,0,1,15,15,10,1,0,0,0,0,0,0,0,0,0,0,1,15,15,10,1,0,0,0,0,0,0,0,0,0,0,1,15,15,10,1,0,0,0,0,0,0,0,0,0,0,1,15,15,10,1,0,0,0,0,0,0,1,1,0,0,1,15,15,10,1,0,0,0,0,0,0,0,1,6,1,0,1,15,10,1,0,0,0,0,0,0,0,0,0,1,6,11,1,15,10,1,0,0,0,0,0,0,0,0,0,0,1,6,11,10,1,0,0,0,0,0,0,0,0,0,0,0,1,6,11,1,0,0,0,0,0,0,0,0,0,0,0,1,6,1,1,6,11,1,0,0,0,0,0,0,0,0,1,6,6,1,0,1,6,1,0,0,0,0,0,0,0,1,6,6,1,0,0,0,1,1,0,0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,13,13,9,9,1,0,1,9,9,9,9,1,0,0,1,13,13,13,9,9,9,1,9,9,9,9,9,9,3,1,1,13,13,9,9,9,9,9,9,9,9,9,9,9,3,1,1,13,9,9,9,9,9,9,9,9,9,9,9,9,3,1,1,9,9,9,9,9,9,9,9,9,9,9,9,3,3,1,0,1,9,9,9,9,9,9,9,9,9,9,3,3,1,0,0,0,1,9,9,9,9,9,9,9,9,3,3,1,0,0,0,0,0,1,9,9,9,9,9,9,3,3,1,0,0,0,0,0,0,0,1,9,9,9,9,3,3,1,0,0,0,0,0,0,0,0,0,1,9,9,3,3,1,0,0,0,0,0,0,0,0,0,0,0,1,9,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,7,7,7,7,7,7,7,7,7,7,1,0,0,0,1,7,7,6,7,7,7,7,7,7,6,7,7,1,0,0,1,7,6,11,11,11,11,11,11,11,11,6,7,1,0,0,1,6,6,6,6,6,11,11,6,6,6,6,6,1,0,0,1,11,11,11,11,11,14,14,11,11,11,11,11,1,0,0,1,7,7,7,7,1,14,14,1,7,7,7,7,1,0,0,1,7,7,7,7,1,11,11,1,7,7,7,7,1,0,0,1,7,7,7,7,7,1,1,7,7,7,7,7,1,0,0,1,7,6,7,7,7,7,7,7,7,7,6,7,1,0,0,1,7,6,7,7,7,7,7,7,7,7,6,7,1,0,0,1,6,6,6,6,6,6,6,6,6,6,6,6,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,14,14,14,14,14,11,1,0,0,0,0,0,0,0,1,14,14,11,11,11,11,11,11,1,0,0,0,0,0,1,14,14,11,11,6,6,11,11,11,11,1,0,0,0,0,1,14,11,11,6,11,11,6,11,11,11,1,0,0,0,0,1,14,11,11,6,11,11,11,11,11,11,1,0,0,0,0,1,14,11,11,11,6,6,11,11,11,11,1,0,0,0,0,1,14,11,11,11,11,11,6,11,11,11,1,0,0,0,0,1,14,11,11,6,11,11,6,11,11,11,1,0,0,0,0,1,11,11,11,11,6,6,11,11,11,6,1,0,0,0,0,0,1,11,11,11,11,11,11,11,6,1,0,0,0,0,0,0,0,1,11,6,6,6,6,6,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,4,0,0,4,2,2,0,0,0,0,0,0,0,0,2,12,10,4,4,10,12,2,0,0,0,0,0,0,2,2,8,10,8,8,8,8,10,8,2,2,0,0,0,0,2,12,10,4,2,8,4,2,4,10,12,2,0,0,2,2,8,10,4,2,2,8,4,2,2,4,10,8,2,2,2,12,10,4,2,0,4,8,4,4,0,2,4,10,12,2,4,10,8,2,0,4,8,12,12,8,4,0,2,8,10,4,0,4,8,4,0,4,12,10,10,12,4,0,4,8,4,0,0,4,8,4,0,2,12,10,10,12,2,0,4,8,4,0,4,12,8,2,0,2,8,12,12,8,2,0,2,8,12,4,2,10,10,4,2,0,2,8,4,2,0,2,4,10,10,2,2,2,8,12,4,2,2,8,4,2,2,4,12,8,2,2,0,0,2,10,10,4,2,8,4,2,4,10,10,2,0,0,0,0,2,2,8,12,8,8,8,8,12,8,2,2,0,0,0,0,0,0,2,10,10,4,4,10,10,2,0,0,0,0,0,0,0,0,2,2,4,0,0,4,2,2,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,6,6,6,6,6,6,6,6,6,6,6,1,0,0,0,0,1,5,5,5,5,5,5,5,5,1,0,0,0,0,0,0,1,5,5,11,11,11,11,5,5,1,0,0,0,0,0,0,1,5,11,5,5,5,5,11,5,1,0,0,0,0,0,0,1,5,5,5,5,5,5,5,3,1,0,0,0,0,0,0,1,5,5,11,11,11,5,5,3,1,0,0,0,0,0,0,1,5,5,5,11,5,5,5,3,1,0,0,0,0,0,0,1,5,5,5,5,5,5,5,3,1,0,0,0,0,0,0,1,5,5,5,5,5,5,5,3,1,0,0,0,0,0,0,1,5,5,5,5,5,5,5,3,1,0,0,0,0,0,0,1,5,5,5,1,1,5,5,3,1,0,0,0,0,0,0,1,5,5,1,0,0,1,5,3,1,0,0,0,0,0,0,1,5,1,0,0,0,0,1,3,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,2,4,8,10,10,8,4,2,0,0,0,0,0,0,0,2,4,8,10,10,10,10,8,4,2,0,0,0,0,0,2,8,8,4,8,8,8,8,4,8,8,2,0,0,0,0,2,4,8,10,10,10,10,10,10,8,4,2,0,0,0,0,2,4,4,8,10,10,10,10,8,4,4,2,0,0,0,0,0,2,4,4,4,4,4,4,4,4,2,0,0,0,0,0,0,2,4,2,2,4,4,2,2,4,2,0,0,0,0,0,0,2,4,4,2,4,4,2,4,4,2,0,0,0,0,0,2,8,8,4,2,2,2,2,4,8,8,2,0,0,0,2,4,4,2,4,8,8,8,8,4,2,4,4,2,0,0,2,4,4,2,4,4,4,4,4,4,2,4,4,2,0,0,0,2,4,2,4,4,4,4,4,4,2,4,2,0,0,0,0,2,4,2,4,4,2,2,4,4,2,4,2,0,0,0,0,0,2,2,4,4,2,2,4,4,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,15,15,15,15,15,15,1,0,0,0,0,0,0,0,1,15,15,15,15,15,15,15,12,1,0,0,0,0,0,0,1,15,1,1,15,1,1,15,12,1,0,0,0,0,0,0,1,15,1,1,15,1,1,15,12,1,0,0,0,0,0,0,1,12,15,15,1,15,15,12,12,1,0,0,0,0,0,0,0,1,12,1,15,1,15,12,1,0,0,0,0,0,0,0,0,0,1,12,12,12,12,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]),gr=new Uint16Array([31775,3106,7398,5200,10569,5301,3442,5557,14798,8413,17968,6876,22164,19039,15295,27549]),_r=1024,vr=2048,yr=e=>(e&15)<<12;function B(e,t,n){return e&31|(t&31)<<5|(n&31)<<10}function br(e){let t=e&31,n=e>>5&31,r=e>>10&31;return(255<<24|((r<<3|r>>3)&255)<<16|((n<<3|n>>3)&255)<<8|(t<<3|t>>3)&255)>>>0}var xr=class{tiles=new Uint32Array(8192);map=new Uint16Array(1024);hofs=0;vofs=0;lines=null;priority=0;visible=!0},Sr=class{bgs=[new xr,new xr,new xr,new xr];pal=new Uint16Array(256);objPal=new Uint16Array(256);sprites=[];rgba=new Uint32Array(256);objRgba=new Uint32Array(256);constructor(){for(let e=0;e<16;e++)this.sprites.push({hidden:!0,x:0,y:0,priority:0,pixels:new Uint8Array(256),offset:0})}render(e,t=0,n=3,r=!0){for(let e=0;e<256;e++)this.rgba[e]=br(this.pal[e]),this.objRgba[e]=br(this.objPal[e]);r&&e.fill(this.rgba[0]);for(let r=n;r>=t;r--){for(let t=3;t>=0;t--){let n=this.bgs[t];n.visible&&n.priority===r&&this.drawBg(n,e)}for(let t=this.sprites.length-1;t>=0;t--){let n=this.sprites[t];!n.hidden&&n.priority===r&&this.drawSprite(n,e)}}}drawBg(e,t){let{tiles:n,map:r,lines:i}=e,a=this.rgba;for(let o=0;o<192;o++){let s=e.hofs,c=e.vofs;i&&(s=i[o]&511,c=i[o]>>>16&511);let l=o+c&255,u=(l>>3)*32,d=o*256;for(let e=0;e<256;e++){let i=e+s&255,o=r[u+(i>>3)],c=o&1023,f=i&7,p=l&7;o&1024&&(f=7-f),o&2048&&(p=7-p);let m=n[c*8+p]>>>f*4&15;m&&(t[d+e]=a[o>>12<<4|m])}}}drawSprite(e,t){let n=this.objRgba;for(let r=0;r<16;r++){let i=e.y+r;if(!(i<0||i>=192))for(let a=0;a<16;a++){let o=e.x+a;if(o<0||o>=256)continue;let s=e.pixels[e.offset+r*16+a];s&&(t[i*256+o]=n[s])}}}};function Cr(e){return e>=`1`&&e<=`9`?e.charCodeAt(0)-48:e>=`a`&&e<=`f`?e.charCodeAt(0)-97+10:0}function wr(e,t,n){for(let r=0;r<8;r++){let i=0;for(let e=0;e<8;e++)i|=Cr(n[r][e])<<e*4;e[t+r]=i>>>0}}function Tr(e,t,n){let r=Math.imul(n&15,286331153)>>>0;for(let n=0;n<8;n++)e[t+n]=r}var Er=[[0,2],[3,1]];function Dr(e,t,n,r,i){for(let a=0;a<8;a++){let o=0;for(let e=0;e<8;e++){let t=Er[a&1][e&1]<i?r:n;o|=(t&15)<<e*4}e[t+a]=o>>>0}}var Or=new Uint32Array([0,0,0,0,0,0,0,0,15724544,15724544,15724544,15724544,15724544,15654912,15724544,15654912,4025544688,4025544688,4025544688,4007718624,0,0,0,0,4026466048,4294967280,4026466272,4026466048,4026466048,4294967280,4026466272,4008635904,15724544,4026531584,4008636400,251658208,4026461696,4009754608,250609376,15654912,4009816048,4025544688,4009750240,250605568,15662848,4026462192,4025544432,4007661280,251654144,4026466048,4026466048,4009754112,4294901504,4026462192,4294967264,4008635904,15724544,15724544,15724544,15654912,0,0,0,0,251592704,250605568,15662848,982784,982784,15728128,251650048,250478592,982784,15728128,251650048,251592704,251592704,250605568,15662848,978432,251654128,250609632,4026531839,4008706030,251654128,250539744,0,0,0,15663104,15663104,4026531584,4008701440,15663104,15597568,0,0,0,0,0,15724544,15724544,15662848,978432,0,0,0,4026531824,4008636128,0,0,0,0,0,0,0,0,15724544,15724544,15654912,4009754624,4025483264,4009689088,250605568,15662848,978928,61168,3808,251657984,4026462192,4025544688,4025544688,4025544688,4025544688,4009754592,250539520,15724544,15728384,15728128,15724544,15724544,15724544,4026531824,4008636128,251657984,4026462192,4025544416,4009750528,250543872,978928,4026531824,4008636128,251657984,4026462192,4025544416,4009750528,4026458112,4025544688,4009754592,250539520,251654144,251657984,251654128,251654128,4026531824,4009750240,4026527744,4008632320,4026531824,4008636400,251658224,4026461920,4025483264,4025544688,4009754592,250539520,251657984,4026462192,4007718896,251658224,4026462192,4025544688,4009754592,250539520,4026531824,4026461920,4009689088,250605568,15724544,15724544,15724544,15654912,251657984,4026462192,4025544688,4009754592,4026462192,4025544688,4009754592,250539520,251657984,4026462192,4025544688,4026531808,4026461696,4025544688,4009754592,250539520,0,15724544,15724544,15654912,15724544,15724544,15654912,0,0,15724544,15724544,15654912,15724544,15724544,15659008,974848,4025483264,4009689088,250605568,15662848,15728128,251650048,4026400768,4007657472,0,0,4026531824,4008636128,4026531824,4008636128,0,0,982784,15728128,251650048,4026400768,4009689088,250605568,15662848,978432,251657984,4026461936,4025487072,4009750528,250605568,15654912,15724544,15654912,251657984,4025413360,4277141231,4278120431,4277202927,4026531567,4008636158,251658208,251657984,4026462192,4025544688,4026531824,4026462192,4025544688,4025544688,4007718624,251658224,4026462192,4025544688,4009754608,4026462192,4025544688,4009754608,250539744,251657984,4026462192,4007718896,61424,61424,4025544688,4009754592,250539520,251658224,4026462192,4025544688,4025544688,4025544688,4025544688,4009754608,250539744,4026531824,4008636400,61424,15728624,15658992,61424,4026531824,4008636128,4026531824,4008636400,61424,15728624,15658992,61424,61424,61152,251657984,4026462192,4007718896,4026527728,4026462192,4025544688,4009754592,250539520,4025544688,4025544688,4025544688,4026531824,4026462192,4025544688,4025544688,4007718624,251657984,250609152,15724544,15724544,15724544,15724544,251657984,250539520,4025483264,4025483264,4025483264,4025483264,4025483264,4025544688,4009754592,250539520,4025544688,4009750512,250609648,15663088,15728624,251654128,4026462192,4007718624,61424,61424,61424,61424,61424,61424,4026531824,4008636128,4025487103,4026527743,4026531839,4026466047,4026461951,4025487103,4025487103,4007661294,4025544688,4025544688,4026466288,4026531824,4026527728,4026462192,4025544688,4007718624,251657984,4026462192,4025544688,4025544688,4025544688,4025544688,4009754592,250539520,251658224,4026462192,4025544688,4009754608,250540016,61424,61424,61152,251657984,4026462192,4025544688,4025544688,4025544688,4025544688,4009754592,4026461696,251658224,4026462192,4025544688,4009754608,250609648,251654128,4026462192,4007718624,251657984,4026462192,4007718896,251658208,4026461696,4025544688,4009754592,250539520,4026531824,4008705760,15724544,15724544,15724544,15724544,15724544,15654912,4025544688,4025544688,4025544688,4025544688,4025544688,4025544688,4009754592,250539520,4025544688,4025544688,4025544688,4025544688,4025544688,4009754592,250609152,15654912,4025487103,4025487103,4025487103,4026466047,4026531839,4026527743,4026461951,4007661294,4025544688,4025544688,4009754592,250609152,251657984,4026462192,4025544688,4007718624,4025544688,4025544688,4025544688,4009754592,250609152,15724544,15724544,15654912,4026531824,4026461920,4009689088,250605568,15662848,978928,4026531824,4008636128,251657984,250543872,982784,982784,982784,982784,251657984,250539520,3824,61424,983008,15728128,251650048,4026400768,4024434688,3992977408,251657984,251653632,251592704,251592704,251592704,251592704,251657984,250539520,15663104,251654144,4026466048,4025413376,3993038336,0,0,0,0,0,0,0,0,0,0,4294967295,15724544,251650048,250478592,0,0,0,0,0,0,0,251657984,4026461696,4026531584,4026462192,4026531808,4008635904,61424,61424,251658224,4026462192,4025544688,4025544688,4009754608,250539744,0,0,251657984,4026462192,4007718896,4025544688,4009754592,250539520,4025483264,4025483264,4026531584,4026462192,4025544688,4025544688,4026531808,4008635904,0,0,251657984,4026462192,4009754608,250540016,4026531808,4008635904,4026466304,4008701952,251657984,250609152,15724544,15724544,15724544,15654912,0,0,4026531584,4026462192,4025544688,4026531808,4026461696,4009754368,61424,61424,251658224,4026462192,4025544688,4025544688,4025544688,4007718624,15724544,15654912,15728384,15728128,15724544,15724544,251657984,250539520,4025483264,4007657472,4026466304,4026400768,4025483264,4025483264,4025544688,4009754592,61424,61424,4025544688,4009750512,250609648,251654128,4026462192,4007718624,251654144,251650048,251592704,251592704,251592704,251592704,4026527744,4008632320,0,0,251654143,4026531839,4026466047,4026466047,4026466047,4008636142,0,0,251658224,4026462192,4025544688,4025544688,4025544688,4007718624,0,0,251657984,4026462192,4025544688,4025544688,4009754592,250539520,0,0,251658224,4026462192,4025544688,4025544688,4009754608,250540016,0,0,4026531584,4026462192,4025544688,4025544688,4026531808,4026461696,0,0,4026527728,4008640496,978928,61424,61424,61152,0,0,4026531584,4008636400,251658208,4026461696,4009754608,250539744,15724544,15724544,251657984,250609152,15724544,15724544,251650048,250478592,0,0,4025544688,4025544688,4025544688,4025544688,4026531808,4008635904,0,0,4025544688,4025544688,4025544688,4009754592,250609152,15654912,0,0,4026466047,4026466047,4026531839,4009754622,251654128,250539744,0,0,4025544688,4009754592,250609152,251657984,4026462192,4007718624,0,0,4025544688,4025544688,4025544688,4026531808,4026461696,4009754368,0,0,4026531824,4009750240,250605568,15662848,4026531824,4008636128,251592704,250605568,15724544,15662848,15728128,15724544,251650048,250478592,15724544,15724544,15724544,15724544,15724544,15724544,15724544,15724544,982784,15728128,15724544,251650048,250605568,15724544,15662848,978432,0,0,982784,4293914608,4026461920,4007657472,0,0,978944,15728384,4278190063,4026531839,4009754622,250609632,251658224,250539744]),kr=new Uint32Array([0,0,0,0,0,0,0,0,0,0,0,0,0,286331152,2576980240,2290649360,0,0,0,0,0,286331153,2576980377,2290649224,0,0,0,0,0,17895697,26843545,20482184,0,0,0,0,0,286330880,2576945152,2290683904,0,0,0,0,0,69905,104857,80008,0,0,0,0,0,286261248,2567962624,2299527168,0,0,0,0,0,268435456,268435456,268435456,0,0,0,0,0,286331153,2576980377,948471945,0,0,0,0,0,268435457,268435457,268435457,0,0,0,0,0,1,1,1,0,0,0,0,0,273,409,312,2290649360,2004318480,2004318480,2004318480,2004318480,2004318480,2004318480,1717987600,2290649224,858993527,286331191,572662071,572662071,139575,139575,139574,557353096,288847667,2574743825,2004318482,2004318482,2004318480,2004318480,1717987600,0,273,409,311,8503,139575,139575,139574,2290683904,2004422656,2004422656,2004422656,2004422656,2004422656,2004422656,1718161408,2290649224,859010935,286340983,572602231,572602231,35731319,35731319,35731046,2290649224,858993459,286331153,572662306,572662306,0,0,0,2177160,35730227,35721489,35791394,35791394,0,0,0,2299527168,2031091712,2031091712,2031091712,2031091712,2031091712,2031091712,1762656256,557353096,557283191,557283191,557283191,557283191,557283191,557283191,557213286,0,2,2,2,2,2,2,2,268435456,268435456,268435456,268435456,268435456,268435456,268435456,268435456,948471945,930576249,930576249,930576249,930576249,930576249,930576249,912680553,268435489,268436001,268436001,268436001,268436001,268436001,268436001,268436001,33,545,545,545,545,545,545,545,8504,139571,139537,139810,139810,0,0,0,1717987600,1717987600,1717987600,1717987600,1717987600,1717987600,1431656720,1431656720,139574,139574,139574,139574,139574,139574,139573,139573,1718161408,1718161408,1718161408,1718161408,1718161408,1718161408,1431900160,1431900160,35731046,286340710,2576967270,1717986918,1717986918,859006566,286340437,572601685,0,69905,104857,79462,2176614,35730227,35721489,35791394,1762656256,1762656256,1762656256,1762656256,1762656256,1762656256,1494220800,1494220800,557213286,557213286,557213286,557213286,557213286,557213286,557143381,557143381,2,2,2,2,2,2,2,2,912680553,912680553,912680553,912680553,912680553,912680553,894784857,894784857,268436001,268436001,268436001,268436001,268436001,268436001,268436001,268436001,545,545,545,545,545,545,545,545,139574,286331190,2576980326,1717986918,1717986918,858993510,286331189,572662069,0,273,409,310,8502,139571,139537,139810,1431656720,1431656720,1431656720,1431656720,1145325840,1145325840,1145325840,1145325840,139573,139573,139573,139573,139572,286331188,2576980292,1145324612,1431656720,1431656720,1431656720,1431656720,1145325840,860113169,288638105,557073476,139573,139573,139573,139573,139572,139571,139537,139810,1431900160,1431900160,1431900160,1431900160,1145638912,1145638912,1145638912,1145638912,572601685,35730773,35730773,35730773,35730500,286340164,2576958532,1145324612,35791394,0,0,0,0,286331153,2576980377,1145324612,0,0,0,0,0,69905,104857,78916,1494220800,1494220800,1494220800,1494220800,1225785344,1225785344,1225785344,1225785344,557143381,557143381,557143381,557143381,557073476,288638020,2571387972,1145324612,2,2,2,2,2,286331153,2576980377,1145324612,0,0,0,0,0,17895697,26843545,20202564,268435456,268435456,268435456,0,0,0,0,0,894784857,894776121,1431900433,1431900672,1145638912,859377664,286330880,301989888,268436001,286331153,2576980377,1431655765,1145324612,1145324612,876889161,876889161,894784857,859002201,286340437,572601685,572601412,35730227,35721489,35791393,545,545,545,546,546,0,0,0,572662069,139573,139573,139573,139572,286331188,2576980292,1145324612,139810,0,0,0,0,286331153,2576980377,1145324612,0,0,0,0,0,273,409,308,1145325840,858994960,286331152,572653568,572522496,0,0,0,1145324612,858993459,286331153,572662306,572662306,0,0,0,557073476,557003571,554766609,572662306,572662306,0,0,0,139810,2,2,2,2,0,0,0,1145638912,859377664,286330880,570425344,536870912,0,0,0,2176068,35730227,35721489,35791394,35791394,0,0,0,1225785344,957349888,286261248,0,0,0,0,0,1145324612,858993459,286331153,572662306,572662304,0,0,0,0,2,2,2,2,0,0,0,876889161,858993465,286331153,572662272,572661760,0,0,0,35791393,545,545,546,546,0,0,0,8500,139571,139537,139810,139810,0,0,0,2299527168,2031161616,2006554896,2004318480,2004318480,2004318480,2004318480,1717987600,1431656720,1431656720,1431656720,1431656720,1145325840,1144207632,1225855248,1225916416,0,286261248,2567962624,2031091712,2031091712,957349888,286261248,0,2290649360,2004318481,2004318105,2004318071,2004318071,2004318003,2004318481,1717987602,8504,139575,139575,139575,139575,139575,139575,139574,0,0,0,0,0,286331152,2576980240,1145325840,1431656720,1431656720,1431656720,1431656720,1145325840,1145325841,1145324697,1145324612,2299527168,2031161616,2006554896,2004318480,2004318480,858994960,286331152,572653568,2290649224,858993527,286331191,572662071,572662071,139571,139537,139810,572522496,0,0,0,0,286261248,2567962624,1494220800,139810,286331152,2576980240,1717987600,1717987600,862349585,288707993,557143381,1717987600,862349585,288777881,557213286,557213286,557003571,554766609,572662306,139574,139571,139537,139810,139810,2,2,2,1494220800,1494290704,1436129552,1431656720,1145325840,1145325840,1145325840,1145325840,557143381,557003605,554766645,572662069,572662068,286331188,2576980292,1145324612,572662306,2,2,2,2,286331153,2576980377,1145324612,2,0,0,0,0,273,409,308,572522496,0,0,0,0,0,0,0,139810,286331152,2576980240,1717987600,1717987600,858994960,286331152,572653568,1717987600,862349585,288777881,557213286,557213286,288777779,2572507409,1431656722,139574,139571,139537,139810,139810,273,409,309,0,286331152,2576980240,1431656720,1145325840,1144207632,1225855248,1225916416,572522496,273,409,309,8500,286331188,2576980292,1145324612,1431656722,1431656720,1431656720,1431656720,1145325840,860113169,288638105,557073476,8501,139573,139573,139573,139572,139571,139537,139810,0,286261248,2567962624,2031091712,2031091712,2031161616,2006554896,1717987600,2290649360,2004318481,2004318105,2004318071,2004318071,1999844215,2031161655,1762795830,1762795830,1762795830,1762795830,1762795830,1762795830,1762726198,1436129621,1431655765,557213286,557213286,557213286,557213286,557213286,288777830,2572506453,1431655765,2,2,2,2,2,273,409,309,1431656720,858994960,286331152,572653568,572522496,0,0,0,1431655765,1429418803,1494290705,1494360610,1225925154,1225855248,1150916880,1145325840,1431655765,861230421,288707925,557143381,557073476,288638020,2571387972,1145324612,8501,139571,139537,139810,139810,273,409,308,2290649224,858993527,286331191,572662071,572662071,286331191,2576980343,1717986918,2290649224,858993459,286331153,572662306,572662306,17895697,26843545,20342374,1717987600,858994960,286331152,572653568,572522496,0,0,0,1717986918,858993459,286331153,572662306,572662306,0,0,0,557213286,288777779,2573625617,1717987602,1717987602,1717987600,1431656720,1431656720,0,273,409,310,8502,139574,139573,139573,0,273,409,309,8500,286331188,2576980292,1145324612,557353096,288847667,2574743825,2004318482,2004318482,858994960,286331152,572653568,0,273,409,311,8503,139571,139537,139810,572522496,17895697,26843545,20342374,557213286,288777779,2572507409,1431656722,139810,0,0,0,0,273,409,309,2290649360,858994960,286331152,572653568,572522496,0,0,0,2290649224,858993459,286331153,572662306,572662306,286261248,2567962624,1762656256,2290649224,2004318003,2004318481,2004318482,2004318482,863467793,288847769,557213286,8504,139575,139575,139575,139575,139571,139537,139810,1762656256,1762726160,1721342224,1717987600,1717987600,1717987600,1431656720,1431656720,557213286,557003622,554766646,572662070,572662070,139574,139573,139573,139573,139573,139573,139573,139572,139572,139572,139572,139572,139571,139537,139810,139810,0,0,0,1717987600,1714632976,1762726160,1762787328,1762656256,1762726160,1436129552,1431656720,1717987600,1714632976,1762726160,1762787328,1762656256,957349888,286261248,0,139574,286331190,2576980326,1717986918,1717986918,858993459,286331153,572662306,1717987600,1717987601,1717986969,1717986918,1717986918,1717986867,1431656721,1431656722,572662304,273,409,309,8500,286331188,2576980292,1145324612,0,286331152,2576980240,1431656720,1145325840,1145325840,1145325840,1145325840,0,273,409,309,8500,139572,139572,139572]),Ar=new Uint16Array([0,1,2,3,0,4,2,2,5,6,3,0,0,7,8,9,8,10,1,2,2,11,0,0,12,13,14,15,16,17,18,19,20,21,22,0,23,24,25,24,26,12,13,18,27,0,0,28,29,28,29,30,31,32,0,33,34,35,0,23,36,37,36,38,28,39,40,0,0,0,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,41,58,59,60,0,0,61,62,63,64,65,62,62,66,67,68,62,63,69,53,70,71,0,61,62,62,72,0]),jr=new Uint16Array([6,2,3,0,73,13,14,15,28,29,28,29,74,42,43,44,67,68,63,64,NaN,1,11,0,75,76,77,0,0,28,29,0,78,79,42,60,61,62,62,72,NaN,2,3,0,80,81,14,15,82,83,84,85,86,87,88,89,61,62,62,72,NaN,2,3,0,80,81,14,15,90,91,92,93,94,95,96,97,67,68,63,64,NaN,1,3,0,98,99,21,22,28,100,101,102,103,104,105,106,0,61,62,72,NaN,2,2,11,12,107,108,27,109,110,111,112,94,113,43,44,67,68,63,64,NaN,2,3,0,73,13,114,115,28,39,116,117,74,58,96,97,67,68,63,64,NaN,2,2,11,118,119,120,121,0,122,123,64,0,41,124,0,0,61,125,0,NaN,2,3,0,73,13,14,15,126,39,92,93,74,58,96,97,67,68,63,64,NaN,2,3,0,73,13,14,15,127,128,129,29,94,130,96,44,67,68,63,64,NaN,0,0,0,0,0,0,0,0,0,0,0,131,132,0,0,61,125,0,0,NaN]),Mr=new Uint8Array([4,4,4,4,4,4,4,4,4,4,2]),Nr=new Uint16Array([0,1026,5156,1228,2385,3575,6811,12093,21407,27583,0,0,0,0,0,0]),Pr=B(2,1,5),Fr=new Sr,Ir=class{bg;constructor(e){this.bg=e}clear(){this.bg.map.fill(0)}putc(e,t,n,r){if(e<0||t<0||e>=32||t>=24)return;let i=n.charCodeAt(0);(i<32||i>127)&&(i=32),this.bg.map[e+t*32]=yr(r)|i-32}print(e,t,n,r){let i=r.slice(0,32),a=32-e;t===23&&a--,i.length>a&&(i=i.slice(0,a>0?a:0));for(let r=0;r<i.length;r++)this.putc(e+r,t,i[r],n)}},Lr=new Ir(Fr.bgs[1]),Rr=128,zr=129,Br=130,Vr=131,Hr=132,Ur=133,Wr=134,Gr=135,Kr=136,qr=137,Jr=[`.11.11..`,`1221221.`,`1222221.`,`1222231.`,`.12231..`,`..131...`,`...1....`,`........`],Yr=[`.11.11..`,`1441441.`,`1444441.`,`1444441.`,`.14441..`,`..141...`,`...1....`,`........`],Xr=[`........`,`..1111..`,`.155561.`,`.155561.`,`.156661.`,`..1111..`,`........`,`........`],Zr=[`........`,`..1111..`,`.144441.`,`.144441.`,`.144441.`,`..1111..`,`........`,`........`],Qr=[`......1.`,`.....171`,`....171.`,`...171..`,`.1171...`,`..181...`,`.181.1..`,`..1.....`],$r=[`......1.`,`.....141`,`....141.`,`...141..`,`.1141...`,`..141...`,`.141.1..`,`..1.....`],ei=[`........`,`11111111`,`99999999`,`88888888`,`88888888`,`11111111`,`........`,`........`],ti=[`........`,`11111111`,`44444444`,`44444444`,`44444444`,`11111111`,`........`,`........`],ni=[`........`,`11111111`,`66666666`,`55555555`,`55555555`,`11111111`,`........`,`........`];function ri(e){e[0]=B(0,0,0),e[255]=B(31,31,31);let t=[B(0,0,0),B(15,0,0),B(0,15,0),B(15,15,0),B(0,0,15),B(15,0,15),B(0,15,15),B(24,24,24),B(15,15,15),B(31,0,0),B(0,31,0),B(31,31,0),B(0,0,31),B(31,0,31),B(0,31,31)];for(let n=0;n<t.length;n++)e[(n+1)*16-1]=t[n]}function ii(e){e.tiles.set(Or,0)}function ai(e){for(let t of[15,8,11,9,10,14])e[t*16+14]=B(1,1,3);e[255]=B(30,29,24),e[143]=B(15,14,19),e[191]=B(31,25,10),e[159]=B(31,11,9),e[175]=B(14,28,12),e[239]=B(14,27,31)}function oi(){let e=Fr.bgs[1];e.priority=0,ri(Fr.pal),ii(e),ai(Fr.pal),e.tiles.set(kr.subarray(0,1064),1096),wr(e.tiles,1024,Jr),wr(e.tiles,1032,Yr),wr(e.tiles,1040,Xr),wr(e.tiles,1048,Zr),wr(e.tiles,1056,Qr),wr(e.tiles,1064,$r),wr(e.tiles,1072,ei),wr(e.tiles,1080,ti),wr(e.tiles,1088,ni),Fr.pal[81]=B(2,1,3),Fr.pal[82]=B(29,6,8),Fr.pal[83]=B(17,2,5),Fr.pal[84]=B(7,5,10),Fr.pal[85]=B(10,24,31),Fr.pal[86]=B(24,30,31),Fr.pal[87]=B(26,27,29),Fr.pal[88]=B(28,20,6),Fr.pal[89]=B(31,29,16);for(let e=1;e<16;e++)Fr.pal[32+e]=Nr[e]}function si(){Fr.bgs[0].priority=1,Fr.bgs[0].visible=!1,oi(),Fr.pal[0]=Pr}function ci(){Lr.clear()}function li(e,t,n,r,...i){Lr.print(e,t,n,z(r,...i))}function ui(e,t,n,...r){let i=z(n,...r).slice(0,32),a=Math.trunc((32-i.length)/2);Lr.print(a<0?0:a,e,t,i)}function di(e){Fr.bgs[1].hofs=0,Fr.bgs[1].vofs=e&511}function fi(e,t,n,r){Lr.putc(e,t,n,r)}function pi(e){Fr.bgs[2].visible=!e,Fr.bgs[3].visible=!e,Fr.pal[0]=e?B(0,0,0):Pr}function mi(e){let t=Fr.bgs[1].map,n=yr(2);for(let r=0;r<5;r++)for(let i=0;i<23;i++)t[(e+r)*32+4+i]=qr+Ar[r*23+i]|n}var hi=`0123456789.`;function gi(e,t){let n=0;for(let e of t){let t=hi.indexOf(e);t>=0&&(n+=Mr[t])}let r=Fr.bgs[1].map,i=yr(2),a=Math.trunc((32-n)/2);for(let n of t){let t=hi.indexOf(n);if(t<0)continue;let o=t*4*5;for(let n=0;n<5;n++)for(let s=0;s<Mr[t];s++)r[(e+n)*32+a+s]=qr+jr[o+n*4+s]|i;a+=Mr[t]}}function _i(e){let t=Fr.bgs[1].map,n=yr(5),r=1;for(let i=0;i<e.max_hp&&r<20;i++,r++){let a=i<e.hp&&!(e.blink&1&&i===e.hp-1);t[r]=(a?Rr:zr)|n}t[r++]=0;for(let i=0;i<e.dash_max&&r<24;i++,r++)t[r]=i<e.dash?Br|n:e.blink&2?0:Vr|n;for(;r<24;)t[r++]=0;e.depth>0?li(24,0,11,`D%3d`,e.depth):li(24,0,11,`CAMP`),fi(29,0,e.genie?``:` `,14),r=1;for(let i=0;i<e.dagger_max&&r<8;i++,r++)t[32+r]=i<e.daggers?Hr|n:e.blink&4?0:Ur|n;t[32+r++]=0;let i=e.meter>=e.meter_max;for(let a=0;a<e.meter_max&&r<20;a++,r++)t[32+r]=e.blink&8&&!i&&a>=e.meter?0:(i?Kr:a<e.meter?Wr:Gr)|n;for(;r<24;)t[32+r++]=0;i&&li(r-3,1,14,` X!`)}function vi(e){if(e.count>16)throw Error(`menu: too many items`);return{cursor:0,x:0,y:0,w:0,step:0,value_x:0,has_back:!1,quiet_activate:!1,rows:0,top:0,...e}}var yi=new Sr,bi=new Ir(yi.bgs[0]),xi=yi.bgs[1],Si=yi.bgs[2],Ci=yi.bgs[3],wi=0,Ti=1,Ei=2,Di=3,Oi=4,ki=5,Ai=6,ji=7,Mi=8,Ni=9,Pi=[`........`,`........`,`........`,`...7....`,`........`,`........`,`........`,`........`],Fi=[`........`,`.....8..`,`....878.`,`.....8..`,`........`,`........`,`........`,`........`],Ii=[`..111111`,`.1222222`,`12ba9999`,`12aa9333`,`12993444`,`12934444`,`12934444`,`12934444`],Li=[`11111111`,`22222222`,`99999999`,`33333333`,`44444444`,`44444444`,`44444444`,`44444444`],Ri=[`12934444`,`12934444`,`12934444`,`12934444`,`12934444`,`12934444`,`12934444`,`12934444`],zi=[`44444444`,`44111111`,`41222222`,`41222222`,`41222222`,`41222222`,`44333333`,`44444444`],Bi=[`44444444`,`11111111`,`22222222`,`22222222`,`22222222`,`22222222`,`33333333`,`44444444`],Vi=[`66666666`,`55555565`,`55555565`,`55555565`,`66666666`,`55655555`,`55655555`,`55655555`],Hi=e=>(e|yr(3))&65535,Ui=e=>(e|yr(4))&65535;function Wi(){yi.bgs[0].priority=0,ri(yi.pal),ai(yi.pal),ii(yi.bgs[0]),Si.tiles=xi.tiles,Ci.tiles=xi.tiles,xi.priority=1,Ci.priority=2,Si.priority=3;let e=xi.tiles;Tr(e,0,0),wr(e,8,Ii),wr(e,16,Li),wr(e,24,Ri),Tr(e,32,4),wr(e,40,Bi),wr(e,48,zi),wr(e,56,Vi),wr(e,64,Pi),wr(e,72,Fi);let t=48;yi.pal[t+1]=B(2,1,4),yi.pal[t+2]=B(21,15,6),yi.pal[t+3]=B(9,6,12),yi.pal[t+4]=B(5,4,9),yi.pal[t+5]=B(4,3,7),yi.pal[t+6]=B(2,2,4),yi.pal[t+7]=B(9,7,14),yi.pal[t+8]=B(14,11,20),yi.pal[t+9]=B(13,8,3),yi.pal[t+10]=B(28,6,8),yi.pal[t+11]=B(31,22,22),t=64,yi.pal[t+1]=B(20,12,26),yi.pal[t+2]=B(13,7,19),yi.pal[t+3]=B(8,4,12),yi.pal[t+4]=B(5,4,9),yi.pal[0]=B(1,1,3);for(let e=0;e<1024;e++)Si.map[e]=Hi(ji);for(let e=0;e<1024;e++){let t=(Math.imul(e,2654435761)>>>0>>>24)%100;Ci.map[e]=t<5?Hi(Mi):t<7?Hi(Ni):0}for(let e=0;e<16;e++)yi.objPal[e]=gr[e];for(let e of yi.sprites)e.pixels=hr;qi()}function Gi(e,t,n,r){let i=yi.sprites[e];i.hidden=!1,i.offset=t*256,i.x=n,i.y=r,i.priority=0}function Ki(){for(let e=0;e<8;e++)yi.sprites[e].hidden=!0}function qi(){Ki(),bi.clear(),xi.map.fill(0)}function Ji(){wi=wi+40|0;let e=wi>>8;Si.hofs=L(e,4)&511,Si.vofs=L(e,8)&511,Ci.hofs=e&511,Ci.vofs=L(e,2)&511}function Yi(e,t,n,r){bi.putc(e,t,n,r)}var Xi=0;function Zi(e){e?(Xi=yi.pal[0],xi.visible=!1,Si.visible=!1,Ci.visible=!1,yi.pal[0]=B(0,0,0)):(xi.visible=!0,Si.visible=!0,Ci.visible=!0,Xi&&(yi.pal[0]=Xi))}function V(e,t,n,r,...i){bi.print(e,t,n,z(r,...i))}function H(e,t,n,...r){let i=z(n,...r).slice(0,32),a=Math.trunc((32-i.length)/2);V(a<0?0:a,e,t,`%s`,i)}function Qi(e){V(0,e,15,`%*s`,e===23?31:32,``)}function $i(e,t,n,r){let i=xi.map;for(let a=t;a<t+r;a++)for(let o=e;o<e+n;o++){let s=o===e,c=o===e+n-1,l=a===t,u=a===t+r-1,d;d=(s||c)&&(l||u)?Ti:l||u?Ei:s||c?Di:Oi,c&&(d|=_r),u&&(d|=vr),i[a*32+o]=Hi(d)}}function ea(e,t,n,r){let i=xi.map;for(let a=e;a<e+n;a++){let o;o=r?a===e?Ui(Ai):a===e+n-1?Ui(Ai|_r):Ui(ki):Hi(Oi),i[t*32+a]=o}}var ta=1,na=21,ra=8;function ia(){$i(ta,na,ra,3),V(2,22,11,`B`),V(4,22,15,`Back`)}function aa(){return m(8,168,64,24)}function oa(e){return e.rows>0&&e.rows<e.count?e.rows:e.count}function sa(e,t){let n=t-(oa(e)<e.count?e.top:0);return n>=0&&n<oa(e)?e.y+n*e.step:-1}function ca(e){let t=oa(e)<e.count;for(let n=0;n<e.count;n++){let r=sa(e,n);if(r<0)continue;let i=n===e.cursor;ea(e.x-1,r,e.w,i),V(e.x,r,i?11:15,`%-*s`,t?e.w-2:0,e.items[n])}if(t){let t=e.x-1+e.w,n=e.y+(oa(e)-1)*e.step;V(t,e.y,8,`%c`,e.top>0?`^`:` `),V(t,n,8,`%c`,e.top+oa(e)<e.count?`v`:` `)}}function la(e){let t=oa(e);e.cursor<e.top?e.top=e.cursor:e.cursor>=e.top+t&&(e.top=e.cursor-t+1)}function ua(e,t,n){let r=(e.x-1)*8,i=r+e.w*8;if(t<r||t>=i)return-1;for(let t=0;t<e.count;t++){let r=sa(e,t);if(r<0)continue;let i=r*8-(e.step-1)*4;if(n>=i&&n<i+e.step*8)return t}return-1}function da(e){let t=e.cursor,n=0;if(o.repeat&64)e.cursor=(e.cursor+e.count-1)%e.count;else if(o.repeat&128)e.cursor=(e.cursor+1)%e.count;else if(e.value_x&&o.repeat&32)n=4;else if(e.value_x&&o.repeat&16)n=5;else if(o.down&1)n=2;else if(e.has_back&&(o.down&2||aa()))n=3;else if(o.touch_down){let t=ua(e,o.touch_x,o.touch_y);if(t>=0){if(e.cursor=t,e.value_x&&o.touch_x>=e.value_x*8){let t=(e.value_x+(e.x-1+e.w))*4;n=o.touch_x<t?4:5}else n=2}}return e.cursor!==t&&(la(e),ca(e),n===0&&(n=1)),n===3?R(26):n!==0&&!(n===2&&e.quiet_activate)&&R(0),n}var fa=new ImageData(256,192),pa=new Uint32Array(fa.data.buffer),ma=new ImageData(256,192),ha=new Uint32Array(ma.data.buffer),ga=new ImageData(256,192),_a=new Uint32Array(ga.data.buffer),va=0;function ya(e){va=Math.max(-16,Math.min(16,Math.trunc(e)))}function ba(e){if(va===0)return;let t=e.ctx;t.save(),t.globalAlpha=Math.abs(va)/16,t.fillStyle=va<0?`#000`:`#fff`,t.fillRect(0,0,256,192),t.restore()}var xa=null,Sa=null;function Ca(e,t){if(Fr.render(pa,2,3,!0),e.ctx.putImageData(fa,0,0),t&&e.ctx.drawImage(t,0,0),!xa&&(xa=document.createElement(`canvas`),xa.width=256,xa.height=192,Sa=xa.getContext(`2d`),!Sa))throw Error(`2D canvas is not available`);ha.fill(0),Fr.render(ha,0,1,!1),Sa.putImageData(ma,0,0),e.ctx.drawImage(xa,0,0),ba(e)}function wa(e){yi.render(_a,0,3,!0),e.ctx.putImageData(ga,0,0),ba(e)}var Ta=window.parent!==window;function Ea(e,t){if(Ta)try{window.parent.postMessage({source:`delve`,type:e,version:`2.5.0`,detail:t},location.origin)}catch{}}function Da(){Ta&&window.focus(),Ea(`ready`),window.isSecureContext&&`serviceWorker`in navigator&&navigator.serviceWorker.register(`./sw.js`).catch(e=>console.error(`service worker`,e))}var Oa=!1,ka=null;function Aa(e){ka=e,window.addEventListener(`error`,e=>ja(e.error??e.message)),window.addEventListener(`unhandledrejection`,e=>ja(e.reason))}function ja(e){if(Oa)return;Oa=!0,ka?.(),console.error(e);let t=e instanceof Error?`${e.name}: ${e.message}`:String(e);Ea(`error`,t);let n=e instanceof Error&&e.stack?e.stack:``,r=`Delve 2.5.0 (Web, 7806548, 2026-10-22)\n${navigator.userAgent}\n\n${t}\n\n${n}`,i=document.createElement(`div`);i.id=`error-overlay`;let a=document.createElement(`h1`);a.textContent=`Delve stopped`;let o=document.createElement(`div`);o.textContent=r;let s=document.createElement(`button`);s.textContent=`Copy`,s.addEventListener(`click`,()=>{navigator.clipboard?.writeText(r)}),i.append(a,o,s),document.body.append(i)}function Ma(e){return e===`stacked`?{w:256,h:392}:{w:520,h:192}}function Na(e,t,n,r){let i=Ma(e),a=Math.floor(Math.min(t*r/i.w,n*r/i.h)+1e-9);return Math.max(1,a)}function Pa(e,t,n,r){return r?e===`stacked`?{x:0,y:0,w:t,h:Math.max(1,n-190)}:{x:150,y:0,w:Math.max(1,t-300),h:n}:{x:0,y:0,w:t,h:n}}function Fa(e,t,n){if(e===`stacked`){let e=n-190,r=Math.min(152,t*.38),i=Math.max(8,t*.04),a=e+(190-r)/2,o=i+r+4,s=Math.max(40,t-2*(i+r+4)),c=t=>({x:o,y:e+8+174/4*t,w:s,h:174/4-6});return{dpad:{x:i,y:a,w:r,h:r},face:{x:t-i-r,y:a,w:r,h:r},l:c(0),r:c(1),select:c(2),start:c(3)}}let r=15/2,i=(n-135)/2,a=Math.min(36,Math.max(24,(n-135)/2-16)),o=t-150;return{l:{x:r,y:8,w:135,h:a},dpad:{x:r,y:i,w:135,h:135},select:{x:r,y:n-8-a,w:135,h:a},r:{x:o+r,y:8,w:135,h:a},face:{x:o+r,y:i,w:135,h:135},start:{x:o+r,y:n-8-a,w:135,h:a}}}function Ia(e,t,n,r=`auto`,i=!1){let a=r=>{let a=Pa(r,e,t,i);return Na(r,a.w,a.h,n)},o;if(r!==`auto`)o=r;else{let r=a(`stacked`),s=a(`side`),c=(r,a)=>{let o=Ma(r),s=Pa(r,e,t,i);return o.w*a<=s.w*n+1e-6&&o.h*a<=s.h*n+1e-6};o=s===r?!c(`stacked`,r)&&c(`side`,s)?`side`:`stacked`:s>r?`side`:`stacked`}let s=a(o),c=s/n,l=Ma(o),u=Pa(o,e,t,i),d=u.x+Math.max(0,Math.floor((u.w-l.w*c)/2*n)/n),f=u.y+Math.max(0,Math.floor((u.h-l.h*c)/2*n)/n),p=256*c,m=192*c,h=8*c,g={x:d,y:f,w:p,h:m},_=o===`stacked`?{x:d,y:f+m+h,w:p,h:m}:{x:d+p+h,y:f,w:p,h:m};return{arrangement:o,devScale:s,cssScale:c,top:g,bottom:_,pad:i?Fa(o,e,t):null}}var La=1e3/60,Ra=1,za=class{acc=0;last=null;advance(e){if(this.last===null)return this.last=e,1;let t=e-this.last;this.last=e,t<0&&(t=0),Math.abs(t-16.666666666666668)<Ra&&(t=La),this.acc+=t;let n=Math.floor(this.acc/La+1e-9);return this.acc-=n*La,this.acc<0&&(this.acc=0),n>5&&(n=5,this.acc=0),n}reset(){this.last=null,this.acc=0}};function Ba(e=0){let t={state:0};return Va(t,e),t}function Va(e,t){t>>>=0,e.state=t||2654435769}function Ha(e){let t=e.state;return t=(t^t<<13)>>>0,t=(t^t>>>17)>>>0,t=(t^t<<5)>>>0,e.state=t,t}function Ua(e,t){let n=e>>>16,r=e&65535,i=n*t,a=r*t,o=Math.floor(i/65536),s=i-o*65536;return o+Math.floor((s*65536+a)/4294967296)>>>0}function Wa(e,t){return t>>>=0,t===0?0:Ua(Ha(e),t)}function U(e,t,n){return n<=t?t:t+(Wa(e,((n-t|0)>>>0)+1>>>0)|0)|0}function Ga(e,t){return Wa(e,100)<t>>>0}function Ka(e){return e=(e^e>>>16)>>>0,e=Math.imul(e,2246822507)>>>0,e=(e^e>>>13)>>>0,e=Math.imul(e,3266489909)>>>0,e=(e^e>>>16)>>>0,e}function qa(e,t,n){let r=Ka((e^2769414579)>>>0);return r=Ka((r^Math.imul(t,2654435761))>>>0),r=Ka((r^Math.imul(n,2146121005))>>>0),r}var Ja=Fr.bgs[2],Ya=Fr.bgs[3],Xa=0,Za=0,Qa=0,$a=0,eo=0,to=!1,no=new Uint32Array(192),ro=new Uint32Array(192),io=0,ao=1,oo=2,so=3,co=4,lo=5,uo=[`........`,`........`,`........`,`...1....`,`........`,`........`,`........`,`........`],fo=[`........`,`........`,`........`,`........`,`....2...`,`........`,`........`,`........`],po=[`........`,`.3......`,`........`,`........`,`........`,`........`,`........`,`........`],mo=[`........`,`........`,`...1....`,`..141...`,`...1....`,`........`,`........`,`........`],ho=[];for(let e=0;e<8;e++)ho.push(new Uint8Array(8));function go(e,t){let n=e>>2,r=t>>2,i=e&3,a=t&3,o=ho[r&7][n&7],s=ho[r&7][n+1&7],c=ho[r+1&7][n&7],l=ho[r+1&7][n+1&7],u=o*(4-i)+s*i,d=c*(4-i)+l*i;return u*(4-a)+d*a>>4}function _o(e){let t=Ba();Va(t,e),Ja.priority=2,Ya.priority=3,Ja.tiles=Ya.tiles;let n=Ya.tiles;Tr(n,0,0),wr(n,8,uo),wr(n,16,fo),wr(n,24,po),wr(n,32,mo);for(let e=0;e<4;e++)Dr(n,(lo+e)*8,0,1,e+1);Fr.pal[1]=B(10,10,18),Fr.pal[2]=B(24,24,30),Fr.pal[3]=B(30,22,12),Fr.pal[4]=B(31,31,31),Fr.pal[17]=B(6,4,11);let r=yr(0);for(let e=0;e<1024;e++){let n=Wa(t,100),i=io;n<6?i=ao:n<9?i=oo:n<10?i=so:n<11&&(i=co),Ga(t,50)&&(i|=_r),Ga(t,50)&&(i|=vr),Ya.map[e]=i|r}for(let e=0;e<8;e++)for(let n=0;n<8;n++)ho[e][n]=Wa(t,256);let i=yr(1);for(let e=0;e<32;e++)for(let t=0;t<32;t++){let n=L(go(t,e)-110,28),r=io;n>=1&&(r=lo+(n>4?4:n)-1),Ja.map[e*32+t]=r|i}Xa=Za=0,Qa=$a=0,Ya.lines=no,Ja.lines=ro}var vo=[3,5,7,9,11,13,16,20],yo=[0,1,1,2,2,2,1,1,0,-1,-1,-2,-2,-2,-1,-1];function bo(){let e=(Xa>>8)+L(Qa,4),t=(Za>>8)+L($a,4),n=(Xa*3>>8)+L(Qa,2),r=(Za*3>>8)+L($a,2);Ya.hofs=e&511,Ya.vofs=t&511,Ja.hofs=n&511,Ja.vofs=r&511;let i=(Xa>>4)+Qa*4,a=(Za>>4)+$a*4;for(let e=0;e<192;e++){let t=vo[L(e,24)],o=to?yo[(e>>2)+(eo>>1)&15]:0,s=((Math.imul(i,t)>>8)+o&511)>>>0,c=(Math.imul(a,t)>>8&511)>>>0;no[e]=s|c<<16;let l=n+(to?2*yo[(e>>2)+(eo>>1)&15]:yo[(e>>3)+(eo>>3)&15])&511;ro[e]=l|(r&511)<<16}}var xo=(e,t,n,r,i)=>({star_dim:e,star_small:t,star_warm:n,fog:r,backdrop:i}),So=[xo(B(10,10,18),B(24,24,30),B(30,22,12),B(6,4,11),B(2,1,5)),xo(B(6,14,16),B(18,28,28),B(28,26,14),B(2,8,10),B(0,3,4)),xo(B(16,8,8),B(30,22,18),B(31,16,6),B(10,3,3),B(4,1,1)),xo(B(8,14,8),B(20,28,18),B(28,28,10),B(3,8,4),B(1,3,1)),xo(B(14,8,18),B(28,20,31),B(31,18,26),B(8,2,12),B(3,0,5)),xo(B(14,16,24),B(28,30,31),B(31,28,18),B(3,5,12),B(1,2,7)),xo(B(6,14,18),B(16,30,31),B(24,31,31),B(1,6,9),B(0,2,4)),xo(B(10,6,16),B(22,18,31),B(30,20,31),B(4,2,8),B(1,0,3)),xo(B(24,10,4),B(31,22,8),B(31,28,14),B(12,3,1),B(6,1,0)),xo(B(16,8,6),B(28,16,10),B(31,20,8),B(7,3,2),B(3,1,1))];function Co(e){to=e}function wo(e){e<0&&(e=0),e>=10&&(e=9);let t=So[e];Fr.pal[1]=t.star_dim,Fr.pal[2]=t.star_small,Fr.pal[3]=t.star_warm,Fr.pal[17]=t.fog,Fr.pal[0]=t.backdrop}function To(e,t){eo++,Xa=Xa+e&65535,Za=Za+t&65535,bo()}function Eo(e,t){Qa=e,$a=t,bo()}var Do=1e3,Oo=1001,ko=1002,Ao=1003,jo=1004,Mo=1005,No=1006,Po=1007,Fo=1008,Io=1009,Lo=1010,Ro=1011,zo=1012,Bo=1013,Vo=1014,Ho=1015,Uo=1016,Wo=1017,Go=1018,Ko=1020,qo=35902,Jo=35899,Yo=1021,Xo=1022,Zo=1023,Qo=1026,$o=1027,es=1028,ts=1029,ns=1030,rs=1031,is=1033,as=33776,os=33777,ss=33778,cs=33779,ls=35840,us=35841,ds=35842,fs=35843,ps=36196,ms=37492,hs=37496,gs=37488,_s=37489,vs=37490,ys=37491,bs=37808,xs=37809,Ss=37810,Cs=37811,ws=37812,Ts=37813,Es=37814,Ds=37815,Os=37816,ks=37817,As=37818,js=37819,Ms=37820,Ns=37821,Ps=36492,Fs=36494,Is=36495,Ls=36283,Rs=36284,zs=36285,Bs=36286,Vs=2300,Hs=2301,Us=2302,Ws=2303,Gs=2400,Ks=2401,qs=2402,Js=3200,Ys=`srgb`,Xs=`srgb-linear`,Zs=`linear`,Qs=`srgb`,$s=7680,ec=35044,tc=35048,nc=`300 es`,rc=2e3;function ic(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ac(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function oc(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function sc(){let e=oc(`canvas`);return e.style.display=`block`,e}var cc={};function lc(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function uc(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function W(...e){e=uc(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function dc(...e){e=uc(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function fc(...e){let t=e.join(` `);t in cc||(cc[t]=!0,W(...e))}function pc(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var mc={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},hc=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},gc=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),_c=Math.PI/180,vc=180/Math.PI;function yc(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(gc[e&255]+gc[e>>8&255]+gc[e>>16&255]+gc[e>>24&255]+`-`+gc[t&255]+gc[t>>8&255]+`-`+gc[t>>16&15|64]+gc[t>>24&255]+`-`+gc[n&63|128]+gc[n>>8&255]+`-`+gc[n>>16&255]+gc[n>>24&255]+gc[r&255]+gc[r>>8&255]+gc[r>>16&255]+gc[r>>24&255]).toLowerCase()}function bc(e,t,n){return Math.max(t,Math.min(n,e))}function xc(e,t){return(e%t+t)%t}function Sc(e,t,n){return(1-n)*e+n*t}function Cc(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function wc(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var Tc=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=bc(this.x,e.x,t.x),this.y=bc(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=bc(this.x,e,t),this.y=bc(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(bc(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ec=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:W(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(bc(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},G=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Oc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Oc.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=bc(this.x,e.x,t.x),this.y=bc(this.y,e.y,t.y),this.z=bc(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=bc(this.x,e,t),this.y=bc(this.y,e,t),this.z=bc(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Dc.copy(this).projectOnVector(e),this.sub(Dc)}reflect(e){return this.sub(Dc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(bc(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Dc=new G,Oc=new Ec,kc=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return fc(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(Ac.makeScale(e,t)),this}rotate(e){return fc(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(Ac.makeRotation(-e)),this}translate(e,t){return fc(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(Ac.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ac=new kc,jc=new kc().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Mc=new kc().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nc(){let e={enabled:!0,workingColorSpace:Xs,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Fc(e.r),e.g=Fc(e.g),e.b=Fc(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Ic(e.r),e.g=Ic(e.g),e.b=Ic(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Zs:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return fc(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return fc(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Xs]:{primaries:t,whitePoint:r,transfer:Zs,toXYZ:jc,fromXYZ:Mc,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ys},outputColorSpaceConfig:{drawingBufferColorSpace:Ys}},[Ys]:{primaries:t,whitePoint:r,transfer:Qs,toXYZ:jc,fromXYZ:Mc,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ys}}}),e}var Pc=Nc();function Fc(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Ic(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Lc,Rc=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Lc===void 0&&(Lc=oc(`canvas`)),Lc.width=e.width,Lc.height=e.height;let t=Lc.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Lc}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=oc(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Fc(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Fc(t[e]/255)*255):t[e]=Fc(t[e]);return{data:t,width:e.width,height:e.height}}return W(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},zc=0,Bc=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:zc++}),this.uuid=yc(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Vc(r[t].image)):e.push(Vc(r[t]))}else e=Vc(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Vc(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?Rc.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(W(`Texture: Unable to serialize Texture.`),{})}var Hc=0,Uc=new G,Wc=class e extends hc{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=Oo,i=Oo,a=No,o=Fo,s=Zo,c=Io,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hc++}),this.uuid=yc(),this.name=``,this.source=new Bc(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new Tc(0,0),this.repeat=new Tc(1,1),this.center=new Tc(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kc,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Uc).x}get height(){return this.source.getSize(Uc).y}get depth(){return this.source.getSize(Uc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){W(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Do:e.x-=Math.floor(e.x);break;case Oo:e.x=e.x<0?0:1;break;case ko:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Do:e.y-=Math.floor(e.y);break;case Oo:e.y=e.y<0?0:1;break;case ko:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Wc.DEFAULT_IMAGE=null,Wc.DEFAULT_MAPPING=300,Wc.DEFAULT_ANISOTROPY=1;var Gc=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=bc(this.x,e.x,t.x),this.y=bc(this.y,e.y,t.y),this.z=bc(this.z,e.z,t.z),this.w=bc(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=bc(this.x,e,t),this.y=bc(this.y,e,t),this.z=bc(this.z,e,t),this.w=bc(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(bc(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Kc=class extends hc{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:No,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Gc(0,0,e,t),this.scissorTest=!1,this.viewport=new Gc(0,0,e,t),this.textures=[];let r=new Wc({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:No,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Bc(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},qc=class extends Kc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Jc=class extends Wc{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ao,this.minFilter=Ao,this.wrapR=Oo,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Yc=class extends Wc{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Ao,this.minFilter=Ao,this.wrapR=Oo,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Xc=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Zc.setFromMatrixColumn(e,0).length(),i=1/Zc.setFromMatrixColumn(e,1).length(),a=1/Zc.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($c,e,el)}lookAt(e,t,n){let r=this.elements;return rl.subVectors(e,t),rl.lengthSq()===0&&(rl.z=1),rl.normalize(),tl.crossVectors(n,rl),tl.lengthSq()===0&&(Math.abs(n.z)===1?rl.x+=1e-4:rl.z+=1e-4,rl.normalize(),tl.crossVectors(n,rl)),tl.normalize(),nl.crossVectors(rl,tl),r[0]=tl.x,r[4]=nl.x,r[8]=rl.x,r[1]=tl.y,r[5]=nl.y,r[9]=rl.y,r[2]=tl.z,r[6]=nl.z,r[10]=rl.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],ee=r[2],te=r[6],ne=r[10],re=r[14],ie=r[3],ae=r[7],oe=r[11],se=r[15];return i[0]=a*x+o*T+s*ee+c*ie,i[4]=a*S+o*E+s*te+c*ae,i[8]=a*C+o*D+s*ne+c*oe,i[12]=a*w+o*O+s*re+c*se,i[1]=l*x+u*T+d*ee+f*ie,i[5]=l*S+u*E+d*te+f*ae,i[9]=l*C+u*D+d*ne+f*oe,i[13]=l*w+u*O+d*re+f*se,i[2]=p*x+m*T+h*ee+g*ie,i[6]=p*S+m*E+h*te+g*ae,i[10]=p*C+m*D+h*ne+g*oe,i[14]=p*w+m*O+h*re+g*se,i[3]=_*x+v*T+y*ee+b*ie,i[7]=_*S+v*E+y*te+b*ae,i[11]=_*C+v*D+y*ne+b*oe,i[15]=_*w+v*O+y*re+b*se,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,ee=_*O-v*D+y*E+b*T-x*w+S*C;if(ee===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let te=1/ee;return e[0]=(o*O-s*D+c*E)*te,e[1]=(r*D-n*O-i*E)*te,e[2]=(m*S-h*x+g*b)*te,e[3]=(d*x-u*S-f*b)*te,e[4]=(s*T-a*O-c*w)*te,e[5]=(t*O-r*T+i*w)*te,e[6]=(h*y-p*S-g*v)*te,e[7]=(l*S-d*y+f*v)*te,e[8]=(a*D-o*T+c*C)*te,e[9]=(n*T-t*D-i*C)*te,e[10]=(p*x-m*y+g*_)*te,e[11]=(u*y-l*x-f*_)*te,e[12]=(o*w-a*E-s*C)*te,e[13]=(t*E-n*w+r*C)*te,e[14]=(m*v-p*b-h*_)*te,e[15]=(l*b-u*v+d*_)*te,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Zc.set(r[0],r[1],r[2]).length(),o=Zc.set(r[4],r[5],r[6]).length(),s=Zc.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Qc.copy(this);let c=1/a,l=1/o,u=1/s;return Qc.elements[0]*=c,Qc.elements[1]*=c,Qc.elements[2]*=c,Qc.elements[4]*=l,Qc.elements[5]*=l,Qc.elements[6]*=l,Qc.elements[8]*=u,Qc.elements[9]*=u,Qc.elements[10]*=u,t.setFromRotationMatrix(Qc),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=rc,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=rc,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Zc=new G,Qc=new Xc,$c=new G(0,0,0),el=new G(1,1,1),tl=new G,nl=new G,rl=new G,il=new Xc,al=new Ec,ol=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(bc(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-bc(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(bc(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-bc(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(bc(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-bc(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:W(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return il.makeRotationFromQuaternion(e),this.setFromRotationMatrix(il,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return al.setFromEuler(this),this.setFromQuaternion(al,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ol.DEFAULT_ORDER=`XYZ`;var sl=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},cl=0,ll=new G,ul=new Ec,dl=new Xc,fl=new G,pl=new G,ml=new G,hl=new Ec,gl=new G(1,0,0),_l=new G(0,1,0),vl=new G(0,0,1),yl={type:`added`},bl={type:`removed`},xl={type:`childadded`,child:null},Sl={type:`childremoved`,child:null},Cl=class e extends hc{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cl++}),this.uuid=yc(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new G,n=new ol,r=new Ec,i=new G(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Xc},normalMatrix:{value:new kc}}),this.matrix=new Xc,this.matrixWorld=new Xc,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new sl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ul.setFromAxisAngle(e,t),this.quaternion.multiply(ul),this}rotateOnWorldAxis(e,t){return ul.setFromAxisAngle(e,t),this.quaternion.premultiply(ul),this}rotateX(e){return this.rotateOnAxis(gl,e)}rotateY(e){return this.rotateOnAxis(_l,e)}rotateZ(e){return this.rotateOnAxis(vl,e)}translateOnAxis(e,t){return ll.copy(e).applyQuaternion(this.quaternion),this.position.add(ll.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gl,e)}translateY(e){return this.translateOnAxis(_l,e)}translateZ(e){return this.translateOnAxis(vl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(dl.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?fl.copy(e):fl.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),pl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?dl.lookAt(pl,fl,this.up):dl.lookAt(fl,pl,this.up),this.quaternion.setFromRotationMatrix(dl),r&&(dl.extractRotation(r.matrixWorld),ul.setFromRotationMatrix(dl),this.quaternion.premultiply(ul.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(dc(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yl),xl.child=e,this.dispatchEvent(xl),xl.child=null):dc(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(bl),Sl.child=e,this.dispatchEvent(Sl),Sl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),dl.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),dl.multiply(e.parent.matrixWorld)),e.applyMatrix4(dl),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yl),xl.child=e,this.dispatchEvent(xl),xl.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pl,e,ml),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pl,hl,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};Cl.DEFAULT_UP=new G(0,1,0),Cl.DEFAULT_MATRIX_AUTO_UPDATE=!0,Cl.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var wl=class extends Cl{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Tl={type:`move`},El=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new wl,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new wl,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new wl,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Tl)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new wl;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Dl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ol={h:0,s:0,l:0},kl={h:0,s:0,l:0};function Al(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var jl=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ys){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Pc.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=Pc.workingColorSpace){return this.r=e,this.g=t,this.b=n,Pc.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=Pc.workingColorSpace){if(e=xc(e,1),t=bc(t,0,1),n=bc(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Al(i,r,e+1/3),this.g=Al(i,r,e),this.b=Al(i,r,e-1/3)}return Pc.colorSpaceToWorking(this,r),this}setStyle(e,t=Ys){function n(t){t!==void 0&&parseFloat(t)<1&&W(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:W(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);W(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ys){let n=Dl[e.toLowerCase()];return n===void 0?W(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fc(e.r),this.g=Fc(e.g),this.b=Fc(e.b),this}copyLinearToSRGB(e){return this.r=Ic(e.r),this.g=Ic(e.g),this.b=Ic(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ys){return Pc.workingToColorSpace(Ml.copy(this),e),Math.round(bc(Ml.r*255,0,255))*65536+Math.round(bc(Ml.g*255,0,255))*256+Math.round(bc(Ml.b*255,0,255))}getHexString(e=Ys){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Pc.workingColorSpace){Pc.workingToColorSpace(Ml.copy(this),t);let n=Ml.r,r=Ml.g,i=Ml.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=Pc.workingColorSpace){return Pc.workingToColorSpace(Ml.copy(this),t),e.r=Ml.r,e.g=Ml.g,e.b=Ml.b,e}getStyle(e=Ys){Pc.workingToColorSpace(Ml.copy(this),e);let t=Ml.r,n=Ml.g,r=Ml.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Ol),this.setHSL(Ol.h+e,Ol.s+t,Ol.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Ol),e.getHSL(kl);let n=Sc(Ol.h,kl.h,t),r=Sc(Ol.s,kl.s,t),i=Sc(Ol.l,kl.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ml=new jl;jl.NAMES=Dl;var Nl=class extends Cl{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ol,this.environmentIntensity=1,this.environmentRotation=new ol,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Pl=new G,Fl=new G,Il=new G,Ll=new G,Rl=new G,zl=new G,Bl=new G,Vl=new G,Hl=new G,Ul=new G,Wl=new Gc,Gl=new Gc,Kl=new Gc,ql=class e{constructor(e=new G,t=new G,n=new G){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Pl.subVectors(e,t),r.cross(Pl);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Pl.subVectors(r,t),Fl.subVectors(n,t),Il.subVectors(e,t);let a=Pl.dot(Pl),o=Pl.dot(Fl),s=Pl.dot(Il),c=Fl.dot(Fl),l=Fl.dot(Il),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Ll)!==null&&Ll.x>=0&&Ll.y>=0&&Ll.x+Ll.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Ll)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Ll.x),s.addScaledVector(a,Ll.y),s.addScaledVector(o,Ll.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Wl.setScalar(0),Gl.setScalar(0),Kl.setScalar(0),Wl.fromBufferAttribute(e,t),Gl.fromBufferAttribute(e,n),Kl.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Wl,i.x),a.addScaledVector(Gl,i.y),a.addScaledVector(Kl,i.z),a}static isFrontFacing(e,t,n,r){return Pl.subVectors(n,t),Fl.subVectors(e,t),Pl.cross(Fl).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Pl.subVectors(this.c,this.b),Fl.subVectors(this.a,this.b),Pl.cross(Fl).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Rl.subVectors(r,n),zl.subVectors(i,n),Vl.subVectors(e,n);let s=Rl.dot(Vl),c=zl.dot(Vl);if(s<=0&&c<=0)return t.copy(n);Hl.subVectors(e,r);let l=Rl.dot(Hl),u=zl.dot(Hl);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(Rl,a);Ul.subVectors(e,i);let f=Rl.dot(Ul),p=zl.dot(Ul);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(zl,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Bl.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Bl,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Rl,a).addScaledVector(zl,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Jl=class{constructor(e=new G(1/0,1/0,1/0),t=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Xl.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Xl.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Xl.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Xl):Xl.fromBufferAttribute(r,t),Xl.applyMatrix4(e.matrixWorld),this.expandByPoint(Xl);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Zl.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Zl.copy(e.boundingBox)),Zl.applyMatrix4(e.matrixWorld),this.union(Zl)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Xl),Xl.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(iu),au.subVectors(this.max,iu),Ql.subVectors(e.a,iu),$l.subVectors(e.b,iu),eu.subVectors(e.c,iu),tu.subVectors($l,Ql),nu.subVectors(eu,$l),ru.subVectors(Ql,eu);let t=[0,-tu.z,tu.y,0,-nu.z,nu.y,0,-ru.z,ru.y,tu.z,0,-tu.x,nu.z,0,-nu.x,ru.z,0,-ru.x,-tu.y,tu.x,0,-nu.y,nu.x,0,-ru.y,ru.x,0];return!cu(t,Ql,$l,eu,au)||(t=[1,0,0,0,1,0,0,0,1],!cu(t,Ql,$l,eu,au))?!1:(ou.crossVectors(tu,nu),t=[ou.x,ou.y,ou.z],cu(t,Ql,$l,eu,au))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Xl).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Xl).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Yl[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yl[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yl[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yl[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yl[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yl[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yl[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yl[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yl)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Yl=[new G,new G,new G,new G,new G,new G,new G,new G],Xl=new G,Zl=new Jl,Ql=new G,$l=new G,eu=new G,tu=new G,nu=new G,ru=new G,iu=new G,au=new G,ou=new G,su=new G;function cu(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){su.fromArray(e,a);let o=i.x*Math.abs(su.x)+i.y*Math.abs(su.y)+i.z*Math.abs(su.z),s=t.dot(su),c=n.dot(su),l=r.dot(su);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var lu=new G,uu=new Tc,du=0,fu=class extends hc{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:du++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=ec,this.updateRanges=[],this.gpuType=Ho,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)uu.fromBufferAttribute(this,t),uu.applyMatrix3(e),this.setXY(t,uu.x,uu.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)lu.fromBufferAttribute(this,t),lu.applyMatrix3(e),this.setXYZ(t,lu.x,lu.y,lu.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)lu.fromBufferAttribute(this,t),lu.applyMatrix4(e),this.setXYZ(t,lu.x,lu.y,lu.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)lu.fromBufferAttribute(this,t),lu.applyNormalMatrix(e),this.setXYZ(t,lu.x,lu.y,lu.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)lu.fromBufferAttribute(this,t),lu.transformDirection(e),this.setXYZ(t,lu.x,lu.y,lu.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Cc(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=wc(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Cc(t,this.array)),t}setX(e,t){return this.normalized&&(t=wc(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Cc(t,this.array)),t}setY(e,t){return this.normalized&&(t=wc(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Cc(t,this.array)),t}setZ(e,t){return this.normalized&&(t=wc(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Cc(t,this.array)),t}setW(e,t){return this.normalized&&(t=wc(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=wc(t,this.array),n=wc(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=wc(t,this.array),n=wc(n,this.array),r=wc(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=wc(t,this.array),n=wc(n,this.array),r=wc(r,this.array),i=wc(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},pu=class extends fu{constructor(e,t,n){super(new Uint16Array(e),t,n)}},mu=class extends fu{constructor(e,t,n){super(new Uint32Array(e),t,n)}},hu=class extends fu{constructor(e,t,n){super(new Float32Array(e),t,n)}},gu=new Jl,_u=new G,vu=new G,yu=class{constructor(e=new G,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?gu.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_u.subVectors(e,this.center);let t=_u.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(_u,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(vu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_u.copy(e.center).add(vu)),this.expandByPoint(_u.copy(e.center).sub(vu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},bu=0,xu=new Xc,Su=new Cl,Cu=new G,wu=new Jl,Tu=new Jl,Eu=new G,Du=class e extends hc{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=yc(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(ic(e)?mu:pu)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new kc().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return xu.makeRotationFromQuaternion(e),this.applyMatrix4(xu),this}rotateX(e){return xu.makeRotationX(e),this.applyMatrix4(xu),this}rotateY(e){return xu.makeRotationY(e),this.applyMatrix4(xu),this}rotateZ(e){return xu.makeRotationZ(e),this.applyMatrix4(xu),this}translate(e,t,n){return xu.makeTranslation(e,t,n),this.applyMatrix4(xu),this}scale(e,t,n){return xu.makeScale(e,t,n),this.applyMatrix4(xu),this}lookAt(e){return Su.lookAt(e),Su.updateMatrix(),this.applyMatrix4(Su.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Cu).negate(),this.translate(Cu.x,Cu.y,Cu.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new hu(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&W(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Jl);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)dc(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];wu.setFromBufferAttribute(n),this.morphTargetsRelative?(Eu.addVectors(this.boundingBox.min,wu.min),this.boundingBox.expandByPoint(Eu),Eu.addVectors(this.boundingBox.max,wu.max),this.boundingBox.expandByPoint(Eu)):(this.boundingBox.expandByPoint(wu.min),this.boundingBox.expandByPoint(wu.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&dc(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yu);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)dc(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new G,1/0);else if(e){let n=this.boundingSphere.center;if(wu.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Tu.setFromBufferAttribute(n),this.morphTargetsRelative?(Eu.addVectors(wu.min,Tu.min),wu.expandByPoint(Eu),Eu.addVectors(wu.max,Tu.max),wu.expandByPoint(Eu)):(wu.expandByPoint(Tu.min),wu.expandByPoint(Tu.max))}wu.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)Eu.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(Eu));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)Eu.fromBufferAttribute(a,t),o&&(Cu.fromBufferAttribute(e,t),Eu.add(Cu)),r=Math.max(r,n.distanceToSquared(Eu))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&dc(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){dc(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new fu(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new G,s[e]=new G;let c=new G,l=new G,u=new G,d=new Tc,f=new Tc,p=new Tc,m=new G,h=new G;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new G,y=new G,b=new G,x=new G;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new fu(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new G,i=new G,a=new G,o=new G,s=new G,c=new G,l=new G,u=new G;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Eu.fromBufferAttribute(e,t),Eu.normalize(),e.setXYZ(t,Eu.x,Eu.y,Eu.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new fu(a,r,i)}if(this.index===null)return W(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Ou=new G,ku=new G,Au=new kc,ju=class{constructor(e=new G(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Ou.subVectors(n,t).cross(ku.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Ou),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Au.getNormalMatrix(e),r=this.coplanarPoint(Ou).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Mu=0,Nu=class extends hc{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Mu++}),this.uuid=yc(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jl(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=$s,this.stencilZFail=$s,this.stencilZPass=$s,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){W(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?W(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new jl().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new ju().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new Tc().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Tc().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Pu=new G,Fu=new G,Iu=new G,Lu=new G,Ru=class{constructor(e=new G,t=new G(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pu)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Pu.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pu.copy(this.origin).addScaledVector(this.direction,t),Pu.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Fu.copy(e).add(t).multiplyScalar(.5),Iu.copy(t).sub(e).normalize(),Lu.copy(this.origin).sub(Fu);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Iu),o=Lu.dot(this.direction),s=-Lu.dot(Iu),c=Lu.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Fu).addScaledVector(Iu,d),f}intersectSphere(e,t){if(e.radius<0)return null;Pu.subVectors(e.center,this.origin);let n=Pu.dot(this.direction),r=Pu.dot(Pu)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Pu)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,ee,te,ne,re,ie;if(y>=b&&y>=x?(w=s,D=u,te=p,ie=g,s>=0?(S=c,C=l,T=d,E=f,O=m,ee=h,ne=_,re=v):(S=l,C=c,T=f,E=d,O=h,ee=m,ne=v,re=_)):b>=x?(w=c,D=d,te=m,ie=_,c>=0?(S=l,C=s,T=f,E=u,O=h,ee=p,ne=v,re=g):(S=s,C=l,T=u,E=f,O=p,ee=h,ne=g,re=v)):(w=l,D=f,te=h,ie=v,l>=0?(S=s,C=c,T=u,E=d,O=p,ee=m,ne=g,re=_):(S=c,C=s,T=d,E=u,O=m,ee=p,ne=_,re=g)),w===0)return null;let ae=S/w,oe=C/w,se=1/w,ce=T-ae*D,le=E-oe*D,ue=O-ae*te,k=ee-oe*te,A=ne-ae*ie,de=re-oe*ie,fe=A*k-de*ue,pe=ce*de-le*A,me=ue*le-k*ce;if(r){if(fe<0||pe<0||me<0)return null}else if((fe<0||pe<0||me<0)&&(fe>0||pe>0||me>0))return null;let he=fe+pe+me;if(he===0)return null;let ge=se*(fe*D+pe*te+me*ie);return(he>0?ge<0:ge>0)?null:this.at(ge/he,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},zu=class extends Nu{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new jl(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ol,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Bu=new Xc,Vu=new Ru,Hu=new yu,Uu=new G,Wu=new G,Gu=new G,Ku=new G,qu=new G,Ju=new G,Yu=new G,Xu=new G,Zu=class extends Cl{constructor(e=new Du,t=new zu){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Ju.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(qu.fromBufferAttribute(s,e),a?Ju.addScaledVector(qu,r):Ju.addScaledVector(qu.sub(t),r))}t.add(Ju)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Hu.copy(n.boundingSphere),Hu.applyMatrix4(i),Vu.copy(e.ray).recast(e.near),!(Hu.containsPoint(Vu.origin)===!1&&(Vu.intersectSphere(Hu,Uu)===null||Vu.origin.distanceToSquared(Uu)>(e.far-e.near)**2))&&(Bu.copy(i).invert(),Vu.copy(e.ray).applyMatrix4(Bu),(n.boundingBox===null||Vu.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Vu)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=$u(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=$u(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=$u(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=$u(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Qu(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Xu.copy(s),Xu.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Xu);return l<n.near||l>n.far?null:{distance:l,point:Xu.clone(),object:e}}function $u(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Wu),e.getVertexPosition(c,Gu),e.getVertexPosition(l,Ku);let u=Qu(e,t,n,r,Wu,Gu,Ku,Yu);if(u){let e=new G;ql.getBarycoord(Yu,Wu,Gu,Ku,e),i&&(u.uv=ql.getInterpolatedAttribute(i,s,c,l,e,new Tc)),a&&(u.uv1=ql.getInterpolatedAttribute(a,s,c,l,e,new Tc)),o&&(u.normal=ql.getInterpolatedAttribute(o,s,c,l,e,new G),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new G,materialIndex:0};ql.getNormal(Wu,Gu,Ku,t.normal),u.face=t,u.barycoord=e}return u}var ed=class extends Wc{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Ao,l=Ao,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},td=new yu,nd=new Tc(.5,.5),rd=new G,id=class{constructor(e=new ju,t=new ju,n=new ju,r=new ju,i=new ju,a=new ju){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=rc,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),td.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),td.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(td)}intersectsSprite(e){return td.center.set(0,0,0),td.radius=.7071067811865476+nd.distanceTo(e.center),td.applyMatrix4(e.matrixWorld),this.intersectsSphere(td)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(rd.x=r.normal.x>0?e.max.x:e.min.x,rd.y=r.normal.y>0?e.max.y:e.min.y,rd.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(rd)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},ad=class extends Wc{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},od=class extends Wc{constructor(e,t,n=Vo,r,i,a,o=Ao,s=Ao,c,l=Qo,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Bc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},sd=class extends od{constructor(e,t=Vo,n=301,r,i,a=Ao,o=Ao,s,c=Qo){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},cd=class extends Wc{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},ld=class e extends Du{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new hu(c,3)),this.setAttribute(`normal`,new hu(l,3)),this.setAttribute(`uv`,new hu(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new G;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},ud=class e extends Du{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new hu(p,3)),this.setAttribute(`normal`,new hu(m,3)),this.setAttribute(`uv`,new hu(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}};function dd(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(pd(i))i.isRenderTargetTexture?(W(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(pd(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function fd(e){let t={};for(let n=0;n<e.length;n++){let r=dd(e[n]);for(let e in r)t[e]=r[e]}return t}function pd(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function md(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function hd(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Pc.workingColorSpace}var gd={clone:dd,merge:fd},_d=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,yd=class extends Nu{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=_d,this.fragmentShader=vd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=dd(e.uniforms),this.uniformsGroups=md(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new jl().setHex(r.value);break;case`v2`:this.uniforms[n].value=new Tc().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Gc().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new kc().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Xc().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},bd=class extends yd{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},xd=class extends Nu{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Js,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Sd=class extends Nu{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Cd(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function wd(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Td=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ed=class extends Td{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Gs,endingEnd:Gs}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ks:i=e,o=2*t-n;break;case qs:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Ks:a=e,s=2*n-t;break;case qs:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Dd=class extends Td{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Od=class extends Td{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},kd=class extends Td{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Md(n,t,g,y,r);i[p]=Ad(x,o,_,b,m)}return i}};function Ad(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function jd(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Md(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ad(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=jd(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Nd=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Cd(t,this.TimeBufferType),this.values=Cd(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Cd(e.times,Array),values:Cd(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),wd(e.settings)&&(n.settings={inTangents:Cd(e.settings.inTangents,Array),outTangents:Cd(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Od(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Dd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ed(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new kd(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Vs:t=this.InterpolantFactoryMethodDiscrete;break;case Hs:t=this.InterpolantFactoryMethodLinear;break;case Us:t=this.InterpolantFactoryMethodSmooth;break;case Ws:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return W(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vs;case this.InterpolantFactoryMethodLinear:return Hs;case this.InterpolantFactoryMethodSmooth:return Us;case this.InterpolantFactoryMethodBezier:return Ws}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;wd(this.settings)&&(Pd(this.settings.inTangents,e),Pd(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(dc(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(dc(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){dc(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){dc(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ac(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){dc(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Us,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,wd(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Pd(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Nd.prototype.ValueTypeName=``,Nd.prototype.TimeBufferType=Float32Array,Nd.prototype.ValueBufferType=Float32Array,Nd.prototype.DefaultInterpolation=Hs;var Fd=class extends Nd{constructor(e,t,n){super(e,t,n)}};Fd.prototype.ValueTypeName=`bool`,Fd.prototype.ValueBufferType=Array,Fd.prototype.DefaultInterpolation=Vs,Fd.prototype.InterpolantFactoryMethodLinear=void 0,Fd.prototype.InterpolantFactoryMethodSmooth=void 0;var Id=class extends Nd{constructor(e,t,n,r){super(e,t,n,r)}};Id.prototype.ValueTypeName=`color`;var Ld=class extends Nd{constructor(e,t,n,r){super(e,t,n,r)}};Ld.prototype.ValueTypeName=`number`;var Rd=class extends Td{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ec.slerpFlat(i,0,a,c-o,a,c,s);return i}},zd=class extends Nd{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Rd(this.times,this.values,this.getValueSize(),e)}};zd.prototype.ValueTypeName=`quaternion`,zd.prototype.InterpolantFactoryMethodSmooth=void 0;var Bd=class extends Nd{constructor(e,t,n){super(e,t,n)}};Bd.prototype.ValueTypeName=`string`,Bd.prototype.ValueBufferType=Array,Bd.prototype.DefaultInterpolation=Vs,Bd.prototype.InterpolantFactoryMethodLinear=void 0,Bd.prototype.InterpolantFactoryMethodSmooth=void 0;var Vd=class extends Nd{constructor(e,t,n,r){super(e,t,n,r)}};Vd.prototype.ValueTypeName=`vector`;var Hd=new G,Ud=new Ec,Wd=new G,Gd=class extends Cl{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Xc,this.projectionMatrix=new Xc,this.projectionMatrixInverse=new Xc,this.coordinateSystem=rc,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Hd,Ud,Wd),Wd.x===1&&Wd.y===1&&Wd.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hd,Ud,Wd.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Hd,Ud,Wd),Wd.x===1&&Wd.y===1&&Wd.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hd,Ud,Wd.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Kd=new G,qd=new Tc,Jd=new Tc,Yd=class extends Gd{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=vc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(_c*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vc*2*Math.atan(Math.tan(_c*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Kd.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Kd.x,Kd.y).multiplyScalar(-e/Kd.z),Kd.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kd.x,Kd.y).multiplyScalar(-e/Kd.z)}getViewSize(e,t){return this.getViewBounds(e,qd,Jd),t.subVectors(Jd,qd)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(_c*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Xd=class extends Gd{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},Zd=-90,Qd=1,$d=class extends Cl{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Yd(Zd,Qd,e,t);r.layers=this.layers,this.add(r);let i=new Yd(Zd,Qd,e,t);i.layers=this.layers,this.add(i);let a=new Yd(Zd,Qd,e,t);a.layers=this.layers,this.add(a);let o=new Yd(Zd,Qd,e,t);o.layers=this.layers,this.add(o);let s=new Yd(Zd,Qd,e,t);s.layers=this.layers,this.add(s);let c=new Yd(Zd,Qd,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},ef=class extends Yd{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},tf=`\\[\\]\\.:\\/`,nf=RegExp(`[\\[\\]\\.:\\/]`,`g`),rf=`[^\\[\\]\\.:\\/]`,af=`[^`+tf.replace(`\\.`,``)+`]`,of=`((?:WC+[\\/:])*)`.replace(`WC`,rf),sf=`(WCOD+)?`.replace(`WCOD`,af),cf=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,rf),lf=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,rf),uf=RegExp(`^`+of+sf+cf+lf+`$`),df=[`material`,`materials`,`bones`,`map`],ff=class{constructor(e,t,n){let r=n||pf.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},pf=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(nf,``)}static parseTrackName(e){let t=uf.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);df.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){W(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){dc(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){dc(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){dc(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){dc(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){dc(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){dc(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){dc(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;dc(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){dc(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){dc(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};pf.Composite=ff,pf.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},pf.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},pf.prototype.GetterByBindingType=[pf.prototype._getValue_direct,pf.prototype._getValue_array,pf.prototype._getValue_arrayElement,pf.prototype._getValue_toArray],pf.prototype.SetterByBindingTypeAndVersioning=[[pf.prototype._setValue_direct,pf.prototype._setValue_direct_setNeedsUpdate,pf.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[pf.prototype._setValue_array,pf.prototype._setValue_array_setNeedsUpdate,pf.prototype._setValue_array_setMatrixWorldNeedsUpdate],[pf.prototype._setValue_arrayElement,pf.prototype._setValue_arrayElement_setNeedsUpdate,pf.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[pf.prototype._setValue_fromArray,pf.prototype._setValue_fromArray_setNeedsUpdate,pf.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function mf(e,t,n,r){let i=hf(r);switch(n){case Yo:return e*t;case es:return e*t/i.components*i.byteLength;case ts:return e*t/i.components*i.byteLength;case ns:return e*t*2/i.components*i.byteLength;case rs:return e*t*2/i.components*i.byteLength;case Xo:return e*t*3/i.components*i.byteLength;case Zo:return e*t*4/i.components*i.byteLength;case is:return e*t*4/i.components*i.byteLength;case as:case os:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ss:case cs:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case us:case fs:return Math.max(e,16)*Math.max(t,8)/4;case ls:case ds:return Math.max(e,8)*Math.max(t,8)/2;case ps:case ms:case gs:case _s:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case hs:case vs:case ys:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case bs:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case xs:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Ss:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Cs:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ws:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ts:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Es:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Ds:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Os:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case ks:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case As:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case js:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ms:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ns:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ps:case Fs:case Is:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Ls:case Rs:return Math.ceil(e/4)*Math.ceil(t/4)*8;case zs:case Bs:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function hf(e){switch(e){case Io:case Lo:return{byteLength:1,components:1};case zo:case Ro:case Uo:return{byteLength:2,components:1};case Wo:case Go:return{byteLength:2,components:4};case Vo:case Bo:case Ho:return{byteLength:4,components:1};case qo:case Jo:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?W(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function gf(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function _f(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var vf={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},K={common:{diffuse:{value:new jl(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kc},alphaMap:{value:null},alphaMapTransform:{value:new kc},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kc}},envmap:{envMap:{value:null},envMapRotation:{value:new kc},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kc}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kc}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kc},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kc},normalScale:{value:new Tc(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kc},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kc}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kc}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kc}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jl(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new jl(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kc},alphaTest:{value:0},uvTransform:{value:new kc}},sprite:{diffuse:{value:new jl(16777215)},opacity:{value:1},center:{value:new Tc(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kc},alphaMap:{value:null},alphaMapTransform:{value:new kc},alphaTest:{value:0}}},yf={basic:{uniforms:fd([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.fog]),vertexShader:vf.meshbasic_vert,fragmentShader:vf.meshbasic_frag},lambert:{uniforms:fd([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new jl(0)},envMapIntensity:{value:1}}]),vertexShader:vf.meshlambert_vert,fragmentShader:vf.meshlambert_frag},phong:{uniforms:fd([K.common,K.specularmap,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.fog,K.lights,{emissive:{value:new jl(0)},specular:{value:new jl(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:vf.meshphong_vert,fragmentShader:vf.meshphong_frag},standard:{uniforms:fd([K.common,K.envmap,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.roughnessmap,K.metalnessmap,K.fog,K.lights,{emissive:{value:new jl(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vf.meshphysical_vert,fragmentShader:vf.meshphysical_frag},toon:{uniforms:fd([K.common,K.aomap,K.lightmap,K.emissivemap,K.bumpmap,K.normalmap,K.displacementmap,K.gradientmap,K.fog,K.lights,{emissive:{value:new jl(0)}}]),vertexShader:vf.meshtoon_vert,fragmentShader:vf.meshtoon_frag},matcap:{uniforms:fd([K.common,K.bumpmap,K.normalmap,K.displacementmap,K.fog,{matcap:{value:null}}]),vertexShader:vf.meshmatcap_vert,fragmentShader:vf.meshmatcap_frag},points:{uniforms:fd([K.points,K.fog]),vertexShader:vf.points_vert,fragmentShader:vf.points_frag},dashed:{uniforms:fd([K.common,K.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vf.linedashed_vert,fragmentShader:vf.linedashed_frag},depth:{uniforms:fd([K.common,K.displacementmap]),vertexShader:vf.depth_vert,fragmentShader:vf.depth_frag},normal:{uniforms:fd([K.common,K.bumpmap,K.normalmap,K.displacementmap,{opacity:{value:1}}]),vertexShader:vf.meshnormal_vert,fragmentShader:vf.meshnormal_frag},sprite:{uniforms:fd([K.sprite,K.fog]),vertexShader:vf.sprite_vert,fragmentShader:vf.sprite_frag},background:{uniforms:{uvTransform:{value:new kc},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vf.background_vert,fragmentShader:vf.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kc}},vertexShader:vf.backgroundCube_vert,fragmentShader:vf.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vf.cube_vert,fragmentShader:vf.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vf.equirect_vert,fragmentShader:vf.equirect_frag},distance:{uniforms:fd([K.common,K.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vf.distance_vert,fragmentShader:vf.distance_frag},shadow:{uniforms:fd([K.lights,K.fog,{color:{value:new jl(0)},opacity:{value:1}}]),vertexShader:vf.shadow_vert,fragmentShader:vf.shadow_frag}};yf.physical={uniforms:fd([yf.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kc},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kc},clearcoatNormalScale:{value:new Tc(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kc},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kc},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kc},sheen:{value:0},sheenColor:{value:new jl(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kc},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kc},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kc},transmissionSamplerSize:{value:new Tc},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kc},attenuationDistance:{value:0},attenuationColor:{value:new jl(0)},specularColor:{value:new jl(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kc},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kc},anisotropyVector:{value:new Tc},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kc}}]),vertexShader:vf.meshphysical_vert,fragmentShader:vf.meshphysical_frag};var bf={r:0,b:0,g:0},xf=new Xc,Sf=new kc;Sf.set(-1,0,0,0,1,0,0,0,1);function Cf(e,t,n,r,i,a){let o=new jl(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Zu(new ld(1,1,1),new yd({name:`BackgroundCubeMaterial`,uniforms:dd(yf.backgroundCube.uniforms),vertexShader:yf.backgroundCube.vertexShader,fragmentShader:yf.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(xf.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Sf),l.material.toneMapped=Pc.getTransfer(i.colorSpace)!==Qs,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Zu(new ud(2,2),new yd({name:`BackgroundMaterial`,uniforms:dd(yf.background.uniforms),vertexShader:yf.background.vertexShader,fragmentShader:yf.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=Pc.getTransfer(i.colorSpace)!==Qs,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(bf,hd(e)),n.buffers.color.setClear(bf.r,bf.g,bf.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function wf(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Tf(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ef(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(W(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&W(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Df(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ju,s=new kc,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Of=4,kf=6,Af=20,jf=256,Mf=new Xd,Nf=new jl,Pf=null,Ff=0,If=0,Lf=!1,Rf=new G,zf=new G,Bf=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Rf}=i;Pf=this._renderer.getRenderTarget(),Ff=this._renderer.getActiveCubeFace(),If=this._renderer.getActiveMipmapLevel(),Lf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Pf,Ff,If),this._renderer.xr.enabled=Lf,e.scissorTest=!1,Uf(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pf=this._renderer.getRenderTarget(),Ff=this._renderer.getActiveCubeFace(),If=this._renderer.getActiveMipmapLevel(),Lf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:No,minFilter:No,generateMipmaps:!1,type:Uo,format:Zo,colorSpace:Xs,depthBuffer:!1},r=Hf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hf(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Vf(r)),this._blurMaterial=Gf(r,e,t),this._ggxMaterial=Wf(r,e,t)}return r}_compileMaterial(e){let t=new Zu(new Du,e);this._renderer.compile(t,Mf)}_sceneToCubeUV(e,t,n,r,i){let a=new Yd(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(Nf),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Zu(new ld,new zu({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(Nf),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;Uf(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=qf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kf());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;Uf(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Mf)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Of?n-d+Of:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,Uf(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Mf),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,Uf(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Mf)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];Uf(t,3*l*(r>this._lodMax-Of?r-this._lodMax+Of:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Mf)}};function Vf(e){let t=[],n=[],r=e,i=e-Of+1+kf;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?zf.set(1,r,n):e===1?zf.set(-n,1,-r):e===2?zf.set(-n,r,1):e===3?zf.set(-1,r,-n):e===4?zf.set(-n,-1,r):zf.set(n,r,-1),zf.toArray(l,(e*6+t)*3)}}let u=new Du;u.setAttribute(`position`,new fu(c,3)),u.setAttribute(`outputDirection`,new fu(l,3)),n.push(new Zu(u,null)),r>Of&&r--}return{lodMeshes:n,sizeLods:t}}function Hf(e,t,n){let r=new qc(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function Uf(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function Wf(e,t,n){return new yd({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:jf,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Gf(e,t,n){return new yd({name:`SphericalGaussianBlur`,defines:{SAMPLES:Af,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Jf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Kf(){return new yd({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function qf(){return new yd({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Jf(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Yf=class extends qc{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ad(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ld(5,5,5),i=new yd({name:`CubemapFromEquirect`,uniforms:dd(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Zu(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=No),new $d(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function Xf(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Yf(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new Bf(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new Bf(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Zf(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&fc(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Qf(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?mu:pu)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function $f(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function ep(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:dc(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function tp(e,t,n){let r=new WeakMap,i=new Gc;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Jc(h,p,m,u);g.type=Ho,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new Tc(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function np(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var rp={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function ip(e,t,n,r,i,a){let o=new qc(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new Du;l.setAttribute(`position`,new hu([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new hu([0,2,0,0,2,0],2));let u=new bd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Zu(l,u),f=new Xd(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new qc(t,n,{type:Uo,depthBuffer:!1,stencilBuffer:!1}),c=new qc(t,n,{type:Uo,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},Pc.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=rp[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var ap=new Wc,op=new od(1,1),sp=new Jc,cp=new Yc,lp=new ad,up=[],dp=[],fp=new Float32Array(16),pp=new Float32Array(9),mp=new Float32Array(4);function hp(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=up[i];if(a===void 0&&(a=new Float32Array(i),up[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function gp(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function _p(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function vp(e,t){let n=dp[t];n===void 0&&(n=new Int32Array(t),dp[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function yp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function bp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(gp(n,t))return;e.uniform2fv(this.addr,t),_p(n,t)}}function xp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(gp(n,t))return;e.uniform3fv(this.addr,t),_p(n,t)}}function Sp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(gp(n,t))return;e.uniform4fv(this.addr,t),_p(n,t)}}function Cp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(gp(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),_p(n,t)}else{if(gp(n,r))return;mp.set(r),e.uniformMatrix2fv(this.addr,!1,mp),_p(n,r)}}function wp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(gp(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),_p(n,t)}else{if(gp(n,r))return;pp.set(r),e.uniformMatrix3fv(this.addr,!1,pp),_p(n,r)}}function Tp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(gp(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),_p(n,t)}else{if(gp(n,r))return;fp.set(r),e.uniformMatrix4fv(this.addr,!1,fp),_p(n,r)}}function Ep(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Dp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(gp(n,t))return;e.uniform2iv(this.addr,t),_p(n,t)}}function Op(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(gp(n,t))return;e.uniform3iv(this.addr,t),_p(n,t)}}function kp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(gp(n,t))return;e.uniform4iv(this.addr,t),_p(n,t)}}function Ap(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function jp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(gp(n,t))return;e.uniform2uiv(this.addr,t),_p(n,t)}}function Mp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(gp(n,t))return;e.uniform3uiv(this.addr,t),_p(n,t)}}function Np(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(gp(n,t))return;e.uniform4uiv(this.addr,t),_p(n,t)}}function Pp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(op.compareFunction=n.isReversedDepthBuffer()?518:515,a=op):a=ap,n.setTexture2D(t||a,i)}function Fp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||cp,i)}function Ip(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||lp,i)}function Lp(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||sp,i)}function Rp(e){switch(e){case 5126:return yp;case 35664:return bp;case 35665:return xp;case 35666:return Sp;case 35674:return Cp;case 35675:return wp;case 35676:return Tp;case 5124:case 35670:return Ep;case 35667:case 35671:return Dp;case 35668:case 35672:return Op;case 35669:case 35673:return kp;case 5125:return Ap;case 36294:return jp;case 36295:return Mp;case 36296:return Np;case 35678:case 36198:case 36298:case 36306:case 35682:return Pp;case 35679:case 36299:case 36307:return Fp;case 35680:case 36300:case 36308:case 36293:return Ip;case 36289:case 36303:case 36311:case 36292:return Lp}}function zp(e,t){e.uniform1fv(this.addr,t)}function Bp(e,t){let n=hp(t,this.size,2);e.uniform2fv(this.addr,n)}function Vp(e,t){let n=hp(t,this.size,3);e.uniform3fv(this.addr,n)}function Hp(e,t){let n=hp(t,this.size,4);e.uniform4fv(this.addr,n)}function Up(e,t){let n=hp(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function Wp(e,t){let n=hp(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function Gp(e,t){let n=hp(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Kp(e,t){e.uniform1iv(this.addr,t)}function qp(e,t){e.uniform2iv(this.addr,t)}function Jp(e,t){e.uniform3iv(this.addr,t)}function Yp(e,t){e.uniform4iv(this.addr,t)}function Xp(e,t){e.uniform1uiv(this.addr,t)}function Zp(e,t){e.uniform2uiv(this.addr,t)}function Qp(e,t){e.uniform3uiv(this.addr,t)}function $p(e,t){e.uniform4uiv(this.addr,t)}function em(e,t,n){let r=this.cache,i=t.length,a=vp(n,i);gp(r,a)||(e.uniform1iv(this.addr,a),_p(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?op:ap;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function tm(e,t,n){let r=this.cache,i=t.length,a=vp(n,i);gp(r,a)||(e.uniform1iv(this.addr,a),_p(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||cp,a[e])}function nm(e,t,n){let r=this.cache,i=t.length,a=vp(n,i);gp(r,a)||(e.uniform1iv(this.addr,a),_p(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||lp,a[e])}function rm(e,t,n){let r=this.cache,i=t.length,a=vp(n,i);gp(r,a)||(e.uniform1iv(this.addr,a),_p(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||sp,a[e])}function im(e){switch(e){case 5126:return zp;case 35664:return Bp;case 35665:return Vp;case 35666:return Hp;case 35674:return Up;case 35675:return Wp;case 35676:return Gp;case 5124:case 35670:return Kp;case 35667:case 35671:return qp;case 35668:case 35672:return Jp;case 35669:case 35673:return Yp;case 5125:return Xp;case 36294:return Zp;case 36295:return Qp;case 36296:return $p;case 35678:case 36198:case 36298:case 36306:case 35682:return em;case 35679:case 36299:case 36307:return tm;case 35680:case 36300:case 36308:case 36293:return nm;case 36289:case 36303:case 36311:case 36292:return rm}}var am=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Rp(t.type)}},om=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=im(t.type)}},sm=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},cm=/(\w+)(\])?(\[|\.)?/g;function lm(e,t){e.seq.push(t),e.map[t.id]=t}function um(e,t,n){let r=e.name,i=r.length;for(cm.lastIndex=0;;){let a=cm.exec(r),o=cm.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){lm(n,l===void 0?new am(s,e,t):new om(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new sm(s),lm(n,e)),n=e}}}var dm=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);um(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function fm(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var pm=37297,mm=0;function hm(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var gm=new kc;function _m(e){Pc._getMatrix(gm,Pc.workingColorSpace,e);let t=`mat3( ${gm.elements.map(e=>e.toFixed(4))} )`;switch(Pc.getTransfer(e)){case Zs:return[t,`LinearTransferOETF`];case Qs:return[t,`sRGBTransferOETF`];default:return W(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function vm(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+hm(e.getShaderSource(t),r)}return i}function ym(e,t){let n=_m(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var bm={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function xm(e,t){let n=bm[t];return n===void 0?(W(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Sm=new G;function Cm(){return Pc.getLuminanceCoefficients(Sm),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Sm.x.toFixed(4)}, ${Sm.y.toFixed(4)}, ${Sm.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function wm(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Dm).join(`
`)}function Tm(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Em(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Dm(e){return e!==``}function Om(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function km(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Am=/^[ \t]*#include +<([\w\d./]+)>/gm;function jm(e){return e.replace(Am,Nm)}var Mm=new Map;function Nm(e,t){let n=vf[t];if(n===void 0){let e=Mm.get(t);if(e!==void 0)n=vf[e],W(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return jm(n)}var Pm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fm(e){return e.replace(Pm,Im)}function Im(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Lm(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Rm={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function zm(e){return Rm[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var Bm={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function Vm(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:Bm[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var Hm={302:`ENVMAP_MODE_REFRACTION`};function Um(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:Hm[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var Wm={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function Gm(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:Wm[e.combine]||`ENVMAP_BLENDING_NONE`}function Km(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function qm(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=zm(n),l=Vm(n),u=Um(n),d=Gm(n),f=Km(n),p=wm(n),m=Tm(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Dm).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Dm).join(`
`),_.length>0&&(_+=`
`)):(g=[Lm(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Dm).join(`
`),_=[Lm(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:vf.tonemapping_pars_fragment,n.toneMapping===0?``:xm(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,vf.colorspace_pars_fragment,ym(`linearToOutputTexel`,n.outputColorSpace),Cm(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Dm).join(`
`)),o=jm(o),o=Om(o,n),o=km(o,n),s=jm(s),s=Om(s,n),s=km(s,n),o=Fm(o),s=Fm(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=fm(i,i.VERTEX_SHADER,y),S=fm(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=vm(i,x,`vertex`),n=vm(i,S,`fragment`);dc(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):W(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new dm(i,h),T=Em(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,pm)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=mm++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Jm=0,Ym=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Xm(e),t.set(e,n)),n}},Xm=class{constructor(e){this.id=Jm++,this.code=e,this.usedTimes=0}};function Zm(e){return e===1030||e===37490||e===36285}function Qm(e,t,n,r,i,a){let o=new sl,s=new Ym,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&W(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,ee,te;if(C){let e=yf[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),ee=e.id,te=t.id}let ne=e.getRenderTarget(),re=e.state.buffers.depth.getReversed(),ie=h.isInstancedMesh===!0,ae=h.isBatchedMesh===!0,oe=!!i.map,se=!!i.matcap,ce=!!x,le=!!i.aoMap,ue=!!i.lightMap,k=!!i.bumpMap&&i.wireframe===!1,A=!!i.normalMap,de=!!i.displacementMap,fe=!!i.emissiveMap,pe=!!i.metalnessMap,me=!!i.roughnessMap,he=i.anisotropy>0,ge=i.clearcoat>0,_e=i.dispersion>0,ve=i.retroreflectivity>0,ye=i.iridescence>0,be=i.sheen>0,xe=i.transmission>0,Se=he&&!!i.anisotropyMap,Ce=ge&&!!i.clearcoatMap,we=ge&&!!i.clearcoatNormalMap,Te=ge&&!!i.clearcoatRoughnessMap,Ee=ye&&!!i.iridescenceMap,j=ye&&!!i.iridescenceThicknessMap,De=be&&!!i.sheenColorMap,Oe=be&&!!i.sheenRoughnessMap,ke=!!i.specularMap,M=!!i.specularColorMap,Ae=!!i.specularIntensityMap,je=xe&&!!i.transmissionMap,Me=xe&&!!i.thicknessMap,Ne=!!i.gradientMap,Pe=!!i.alphaMap,Fe=i.alphaTest>0,Ie=!!i.alphaHash,Le=!!i.extensions,Re=0;i.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Re=e.toneMapping);let ze={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:ee,customFragmentShaderID:te,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:ae,batchingColor:ae&&h._colorsTexture!==null,instancing:ie,instancingColor:ie&&h.instanceColor!==null,instancingMorph:ie&&h.morphTexture!==null,outputColorSpace:ne===null?e.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Pc.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:oe,matcap:se,envMap:ce,envMapMode:ce&&x.mapping,envMapCubeUVHeight:S,aoMap:le,lightMap:ue,bumpMap:k,normalMap:A,displacementMap:de,emissiveMap:fe,normalMapObjectSpace:A&&i.normalMapType===1,normalMapTangentSpace:A&&i.normalMapType===0,packedNormalMap:A&&i.normalMapType===0&&Zm(i.normalMap.format),metalnessMap:pe,roughnessMap:me,anisotropy:he,anisotropyMap:Se,clearcoat:ge,clearcoatMap:Ce,clearcoatNormalMap:we,clearcoatRoughnessMap:Te,dispersion:_e,retroreflection:ve,iridescence:ye,iridescenceMap:Ee,iridescenceThicknessMap:j,sheen:be,sheenColorMap:De,sheenRoughnessMap:Oe,specularMap:ke,specularColorMap:M,specularIntensityMap:Ae,transmission:xe,transmissionMap:je,thicknessMap:Me,gradientMap:Ne,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Pe,alphaTest:Fe,alphaHash:Ie,combine:i.combine,mapUv:oe&&m(i.map.channel),aoMapUv:le&&m(i.aoMap.channel),lightMapUv:ue&&m(i.lightMap.channel),bumpMapUv:k&&m(i.bumpMap.channel),normalMapUv:A&&m(i.normalMap.channel),displacementMapUv:de&&m(i.displacementMap.channel),emissiveMapUv:fe&&m(i.emissiveMap.channel),metalnessMapUv:pe&&m(i.metalnessMap.channel),roughnessMapUv:me&&m(i.roughnessMap.channel),anisotropyMapUv:Se&&m(i.anisotropyMap.channel),clearcoatMapUv:Ce&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:we&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Ee&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:j&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:De&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&m(i.sheenRoughnessMap.channel),specularMapUv:ke&&m(i.specularMap.channel),specularColorMapUv:M&&m(i.specularColorMap.channel),specularIntensityMapUv:Ae&&m(i.specularIntensityMap.channel),transmissionMapUv:je&&m(i.transmissionMap.channel),thicknessMapUv:Me&&m(i.thicknessMap.channel),alphaMapUv:Pe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(A||he),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(oe||Pe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&A===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:re,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Re,decodeVideoTexture:oe&&i.map.isVideoTexture===!0&&Pc.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:fe&&i.emissiveMap.isVideoTexture===!0&&Pc.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Le&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Le&&i.extensions.multiDraw===!0||ae)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return ze.vertexUv1s=c.has(1),ze.vertexUv2s=c.has(2),ze.vertexUv3s=c.has(3),c.clear(),ze}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=yf[t];n=gd.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new qm(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function $m(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function eh(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function th(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function nh(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||eh),r.length>1&&r.sort(t||th),i.length>1&&i.sort(t||th)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function rh(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new nh,e.set(t,[i])):n>=r.length?(i=new nh,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function ih(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new G,color:new jl};break;case`SpotLight`:n={position:new G,direction:new G,color:new jl,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new G,color:new jl,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new G,skyColor:new jl,groundColor:new jl};break;case`RectAreaLight`:n={color:new jl,position:new G,halfWidth:new G,halfHeight:new G}}return e[t.id]=n,n}}}function ah(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tc};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tc};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tc,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var oh=0;function sh(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ch(e){let t=new ih,n=ah(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new G);let i=new G,a=new Xc,o=new Xc;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(sh);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=K.LTC_FLOAT_1,r.rectAreaLTC2=K.LTC_FLOAT_2):(r.rectAreaLTC1=K.LTC_HALF_1,r.rectAreaLTC2=K.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=oh++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function lh(e){let t=new ch(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function uh(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new lh(e),t.set(n,[a])):r>=i.length?(a=new lh(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var dh=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fh=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ph=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],mh=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],hh=new Xc,gh=new G,_h=new G;function vh(e,t,n){let r=new id,i=new Tc,a=new Tc,o=new Gc,s=new xd,c=new Sd,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new yd({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tc},radius:{value:4}},vertexShader:dh,fragmentShader:fh}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Du;m.setAttribute(`position`,new fu(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Zu(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(W(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){W(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){W(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new qc(i.x,i.y,{format:ns,type:Uo,minFilter:No,magFilter:No,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new od(i.x,i.y,Ho),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Qo,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ao,d.map.depthTexture.magFilter=Ao}else l.isPointLight?(d.map=new Yf(i.x),d.map.depthTexture=new sd(i.x,Vo)):(d.map=new qc(i.x,i.y),d.map.depthTexture=new od(i.x,i.y,Vo)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Qo,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=No,d.map.depthTexture.magFilter=No):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Ao,d.map.depthTexture.magFilter=Ao);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),gh.setFromMatrixPosition(l.matrixWorld),e.position.copy(gh),_h.copy(e.position),_h.add(ph[t]),e.up.copy(mh[t]),e.lookAt(_h),e.updateMatrixWorld(),n.makeTranslation(-gh.x,-gh.y,-gh.z),hh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(hh,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new qc(i.x,i.y,{format:ns,type:Uo}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function yh(e,t){function n(){let t=!1,n=new Gc,r=null,i=new Gc(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?pe(e.DEPTH_TEST):me(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=mc[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?pe(e.STENCIL_TEST):me(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new jl(0,0,0),T=0,E=!1,D=null,O=null,ee=null,te=null,ne=null,re=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ie=!1,ae=0,oe=e.getParameter(e.VERSION);oe.indexOf(`WebGL`)===-1?oe.indexOf(`OpenGL ES`)!==-1&&(ae=parseFloat(/^OpenGL ES (\d)/.exec(oe)[1]),ie=ae>=2):(ae=parseFloat(/^WebGL (\d)/.exec(oe)[1]),ie=ae>=1);let se=null,ce={},le=e.getParameter(e.SCISSOR_BOX),ue=e.getParameter(e.VIEWPORT),k=new Gc().fromArray(le),A=new Gc().fromArray(ue);function de(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let fe={};fe[e.TEXTURE_2D]=de(e.TEXTURE_2D,e.TEXTURE_2D,1),fe[e.TEXTURE_CUBE_MAP]=de(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[e.TEXTURE_2D_ARRAY]=de(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),fe[e.TEXTURE_3D]=de(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),pe(e.DEPTH_TEST),o.setFunc(3),Se(!1),Ce(1),pe(e.CULL_FACE),be(0);function pe(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function me(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function he(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ge(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function _e(t){return h!==t&&(e.useProgram(t),h=t,!0)}let ve={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};ve[103]=e.MIN,ve[104]=e.MAX;let ye={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function be(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(me(e.BLEND),g=!1);else if(g===!1&&(pe(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:dc(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:dc(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:dc(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:dc(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(ve[n],ve[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(ye[r],ye[i],ye[o],ye[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function xe(t,n){t.side===2?me(e.CULL_FACE):pe(e.CULL_FACE);let r=t.side===1;n&&(r=!r),Se(r),t.blending===1&&t.transparent===!1?be(0):be(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),Te(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?pe(e.SAMPLE_ALPHA_TO_COVERAGE):me(e.SAMPLE_ALPHA_TO_COVERAGE)}function Se(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function Ce(t){t===0?me(e.CULL_FACE):(pe(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function we(t){t!==ee&&(ie&&e.lineWidth(t),ee=t)}function Te(t,n,r){t?(pe(e.POLYGON_OFFSET_FILL),(te!==n||ne!==r)&&(te=n,ne=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):me(e.POLYGON_OFFSET_FILL)}function Ee(t){t?pe(e.SCISSOR_TEST):me(e.SCISSOR_TEST)}function j(t){t===void 0&&(t=e.TEXTURE0+re-1),se!==t&&(e.activeTexture(t),se=t)}function De(t,n,r){r===void 0&&(r=se===null?e.TEXTURE0+re-1:se);let i=ce[r];i===void 0&&(i={type:void 0,texture:void 0},ce[r]=i),(i.type!==t||i.texture!==n)&&(se!==r&&(e.activeTexture(r),se=r),e.bindTexture(t,n||fe[t]),i.type=t,i.texture=n)}function Oe(){let t=ce[se];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ke(){try{e.compressedTexImage2D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function M(){try{e.compressedTexImage3D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Ae(){try{e.texSubImage2D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function je(){try{e.texSubImage3D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Me(){try{e.compressedTexSubImage2D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Ne(){try{e.compressedTexSubImage3D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Pe(){try{e.texStorage2D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Fe(){try{e.texStorage3D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Ie(){try{e.texImage2D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Le(){try{e.texImage3D(...arguments)}catch(e){dc(`WebGLState:`,e)}}function Re(t){return d[t]===void 0?e.getParameter(t):d[t]}function ze(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Be(t){k.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),k.copy(t))}function Ve(t){A.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),A.copy(t))}function He(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Ue(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function We(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},se=null,ce={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new jl(0,0,0),T=0,E=!1,D=null,O=null,ee=null,te=null,ne=null,k.set(0,0,e.canvas.width,e.canvas.height),A.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:pe,disable:me,bindFramebuffer:he,drawBuffers:ge,useProgram:_e,setBlending:be,setMaterial:xe,setFlipSided:Se,setCullFace:Ce,setLineWidth:we,setPolygonOffset:Te,setScissorTest:Ee,activeTexture:j,bindTexture:De,unbindTexture:Oe,compressedTexImage2D:ke,compressedTexImage3D:M,texImage2D:Ie,texImage3D:Le,pixelStorei:ze,getParameter:Re,updateUBOMapping:He,uniformBlockBinding:Ue,texStorage2D:Pe,texStorage3D:Fe,texSubImage2D:Ae,texSubImage3D:je,compressedTexSubImage2D:Me,compressedTexSubImage3D:Ne,scissor:Be,viewport:Ve,reset:We}}function bh(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Tc,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):oc(`canvas`)}function g(e,t,n){let r=1,i=ke(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),W(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&W(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];W(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||W(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Zs:Pc.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,W(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function ee(){O=0}function te(){return O}function ne(e){O=e}function re(){let e=O;return e>=i.maxTextures&&W(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&De(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)W(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)W(`WebGLRenderer: Texture marked for update but image is incomplete`);else{me(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function se(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?me(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?he(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let le={[Do]:e.REPEAT,[Oo]:e.CLAMP_TO_EDGE,[ko]:e.MIRRORED_REPEAT},ue={[Ao]:e.NEAREST,[jo]:e.NEAREST_MIPMAP_NEAREST,[Mo]:e.NEAREST_MIPMAP_LINEAR,[No]:e.LINEAR,[Po]:e.LINEAR_MIPMAP_NEAREST,[Fo]:e.LINEAR_MIPMAP_LINEAR},k={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function A(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&W(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,le[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,le[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,le[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ue[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ue[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,k[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function de(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function fe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function pe(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=fe(n.start,r.width,4),c=fe(t.start,r.width,4);n.start<=i+1&&a===c&&fe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function me(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=de(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=Pc.getPrimaries(Pc.workingColorSpace),r=o.colorSpace===``?null:Pc.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Oe(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);A(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===$o,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&pe(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=mf(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=mf(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=ke(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=ke(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function he(t,o,s){if(o.image.length!==6)return;let c=de(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=Pc.getPrimaries(Pc.workingColorSpace),r=o.colorSpace===``?null:Pc.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Oe(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);A(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?W(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=ke(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ge(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,Ee(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function _e(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;j(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ee(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ee(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);j(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,Ee(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,Ee(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ve(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),A(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else ae(i.depthTexture,0);let u=l.__webglTexture,d=Ee(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)j(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function ye(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ve(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?ve(i.__webglFramebuffer[0],t,0):ve(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),_e(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),_e(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,i){let a=r.get(t);n!==void 0&&ge(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&ye(t)}function xe(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&j(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=Ee(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),_e(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),A(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ge(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),A(c,a),ge(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),A(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ge(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ge(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&ye(t)}function Se(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let Ce=[],we=[];function Te(t){if(t.samples>0){if(j(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ce.length=0,we.length=0,Ce.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(Ce.push(l),we.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,we)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function Ee(e){return Math.min(i.maxSamples,e.samples)}function j(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function De(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Oe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(Pc.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&W(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):dc(`WebGLTextures: Unsupported texture color space:`,n)),t}function ke(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=re,this.resetTextureUnits=ee,this.getTextureUnits=te,this.setTextureUnits=ne,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=se,this.setTextureCube=ce,this.rebindTextures=be,this.setupRenderTarget=xe,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=Te,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=j,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function xh(e,t){function n(n,r=``){let i,a=Pc.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Sh=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ch=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,wh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new cd(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new yd({vertexShader:Sh,fragmentShader:Ch,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Zu(new ud(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Th=class extends hc{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new wh,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new Tc,C=null,w=null,T=new Yd;T.viewport=new Gc;let E=new Yd;E.viewport=new Gc;let D=[T,E],O=new ef,ee=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new El,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new El,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new El,b[e]=t),t.getHandSpace()};function ne(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function re(){r.removeEventListener(`select`,ne),r.removeEventListener(`selectstart`,ne),r.removeEventListener(`selectend`,ne),r.removeEventListener(`squeeze`,ne),r.removeEventListener(`squeezestart`,ne),r.removeEventListener(`squeezeend`,ne),r.removeEventListener(`end`,re),r.removeEventListener(`inputsourceschange`,ie);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}ee=null,te=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,A.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&W(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,ne),r.addEventListener(`selectstart`,ne),r.addEventListener(`selectend`,ne),r.addEventListener(`squeeze`,ne),r.addEventListener(`squeezestart`,ne),r.addEventListener(`squeezeend`,ne),r.addEventListener(`end`,re),r.addEventListener(`inputsourceschange`,ie),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?$o:Qo,a=_.stencil?Ko:Vo);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new qc(d.textureWidth,d.textureHeight,{format:Zo,type:Io,depthTexture:new od(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new qc(f.framebufferWidth,f.framebufferHeight,{format:Zo,type:Io,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),A.setContext(r),A.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function ie(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let ae=new G,oe=new G;function se(e,t,n){ae.setFromMatrixPosition(t.matrixWorld),oe.setFromMatrixPosition(n.matrixWorld);let r=ae.distanceTo(oe),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ce(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(ee!==O.near||te!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),ee=O.near,te=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ce(O,i);for(let e=0;e<a.length;e++)ce(a[e],i);a.length===2?se(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),le(e,O,i)};function le(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=vc*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let ue=null;function k(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Yd,o.layers.enable(n),o.viewport=new Gc,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new cd,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let A=new gf;A.setAnimationLoop(k),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},Eh=new Xc,Dh=new kc;Dh.set(-1,0,0,0,1,0,0,0,1);function Oh(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,hd(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Eh.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Dh),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function kh(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return dc(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?W(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):W(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Ah=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),jh=null;function Mh(){return jh===null&&(jh=new ed(Ah,16,16,ns,Uo),jh.name=`DFG_LUT`,jh.minFilter=No,jh.magFilter=No,jh.wrapS=Oo,jh.wrapT=Oo,jh.generateMipmaps=!1,jh.needsUpdate=!0),jh}var Nh=class{constructor(e={}){let{canvas:t=sc(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Io}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([is,rs,ts]),g=new Set([Io,Vo,zo,Ko,Wo,Go]),_=new Uint32Array(4),v=new Int32Array(4),y=new G,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,ee=null,te=null;this._outputColorSpace=Ys;let ne=0,re=0,ie=null,ae=-1,oe=null,se=new Gc,ce=new Gc,le=null,ue=new jl(0),k=0,A=t.width,de=t.height,fe=1,pe=null,me=null,he=new Gc(0,0,A,de),ge=new Gc(0,0,A,de),_e=!1,ve=new id,ye=!1,be=!1,xe=new Xc,Se=new G,Ce=new Gc,we={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Te=!1;function Ee(){return ie===null?fe:1}let j=n;function De(e,n){return t.getContext(e,n)}let Oe,ke,M,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,Qe,!1),t.addEventListener(`webglcontextrestored`,$e,!1),t.addEventListener(`webglcontextcreationerror`,et,!1),j===null){let t=`webgl2`;if(j=De(t,e),j===null)throw De(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Xe()}catch(e){throw t.removeEventListener(`webglcontextlost`,Qe,!1),t.removeEventListener(`webglcontextrestored`,$e,!1),t.removeEventListener(`webglcontextcreationerror`,et,!1),dc(`WebGLRenderer: `+e.message),e}function Xe(){Oe=new Zf(j),Oe.init(),qe=new xh(j,Oe),ke=new Ef(j,Oe,e,qe),M=new yh(j,Oe),ke.reversedDepthBuffer&&d&&M.buffers.depth.setReversed(!0),O=j.createFramebuffer(),ee=j.createFramebuffer(),te=j.createFramebuffer(),Ae=new ep(j),je=new $m,Me=new bh(j,Oe,M,je,ke,qe,Ae),Ne=new Xf(T),Pe=new _f(j),Je=new wf(j,Pe),Fe=new Qf(j,Pe,Ae,Je),Ie=new np(j,Fe,Pe,Je,Ae),We=new tp(j,ke,Me),Ve=new Df(je),Le=new Qm(T,Ne,Oe,ke,Je,Ve),Re=new Oh(T,je),ze=new rh,Be=new uh(Oe),Ue=new Cf(T,Ne,M,Ie,p,s),He=new vh(T,Ie,ke),Ye=new kh(j,Ae,ke,M),Ge=new Tf(j,Oe,Ae),Ke=new $f(j,Oe,Ae),Ae.programs=Le.programs,T.capabilities=ke,T.extensions=Oe,T.properties=je,T.renderLists=ze,T.shadowMap=He,T.state=M,T.info=Ae}m!==1009&&(w=new ip(m,t.width,t.height,o,r,i));let Ze=new Th(T,j);this.xr=Ze,this.getContext=function(){return j},this.getContextAttributes=function(){return j.getContextAttributes()},this.forceContextLoss=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Oe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(e){e!==void 0&&(fe=e,this.setSize(A,de,!1))},this.getSize=function(e){return e.set(A,de)},this.setSize=function(e,n,r=!0){Ze.isPresenting?W(`WebGLRenderer: Can't change size while VR device is presenting.`):(A=e,de=n,t.width=Math.floor(e*fe),t.height=Math.floor(n*fe),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(A*fe,de*fe).floor()},this.setDrawingBufferSize=function(e,n,r){A=e,de=n,fe=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)dc(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){W(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(se)},this.getViewport=function(e){return e.copy(he)},this.setViewport=function(e,t,n,r){e.isVector4?he.set(e.x,e.y,e.z,e.w):he.set(e,t,n,r),M.viewport(se.copy(he).multiplyScalar(fe).round())},this.getScissor=function(e){return e.copy(ge)},this.setScissor=function(e,t,n,r){e.isVector4?ge.set(e.x,e.y,e.z,e.w):ge.set(e,t,n,r),M.scissor(ce.copy(ge).multiplyScalar(fe).round())},this.getScissorTest=function(){return _e},this.setScissorTest=function(e){M.setScissorTest(_e=e)},this.setOpaqueSort=function(e){pe=e},this.setTransparentSort=function(e){me=e},this.getClearColor=function(e){return e.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(ie!==null){let t=ie.texture.format;e=h.has(t)}if(e){let e=ie.texture.type,t=g.has(e),n=Ue.getClearColor(),r=Ue.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,j.clearBufferuiv(j.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,j.clearBufferiv(j.COLOR,0,v))}else r|=j.COLOR_BUFFER_BIT}t&&(r|=j.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=j.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&j.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,Qe,!1),t.removeEventListener(`webglcontextrestored`,$e,!1),t.removeEventListener(`webglcontextcreationerror`,et,!1),Ue.dispose(),ze.dispose(),Be.dispose(),je.dispose(),Ne.dispose(),Ie.dispose(),Je.dispose(),Ye.dispose(),Le.dispose(),Ze.dispose(),Ze.removeEventListener(`sessionstart`,st),Ze.removeEventListener(`sessionend`,ct),lt.stop()};function Qe(e){e.preventDefault(),lc(`WebGLRenderer: Context Lost.`),E=!0}function $e(){lc(`WebGLRenderer: Context Restored.`),E=!1;let e=Ae.autoReset,t=He.enabled,n=He.autoUpdate,r=He.needsUpdate,i=He.type;Xe(),Ae.autoReset=e,He.enabled=t,He.autoUpdate=n,He.needsUpdate=r,He.type=i}function et(e){dc(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function tt(e){let t=e.target;t.removeEventListener(`dispose`,tt),nt(t)}function nt(e){rt(e),je.remove(e)}function rt(e){let t=je.get(e).programs;t!==void 0&&(t.forEach(function(e){Le.releaseProgram(e)}),e.isShaderMaterial&&Le.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=we);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=yt(e,t,n,r,i);M.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Fe.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Je.setup(i,r,s,n,c);let h,g=Ge;if(c!==null&&(h=Pe.get(c),g=Ke,g.setIndex(h)),i.isMesh)r.wireframe===!0?(M.setLineWidth(r.wireframeLinewidth*Ee()),g.setMode(j.LINES)):g.setMode(j.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),M.setLineWidth(e*Ee()),i.isLineSegments?g.setMode(j.LINES):i.isLineLoop?g.setMode(j.LINE_LOOP):g.setMode(j.LINE_STRIP)}else i.isPoints?g.setMode(j.POINTS):i.isSprite&&g.setMode(j.TRIANGLES);if(i.isBatchedMesh){if(Oe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Pe.get(c).bytesPerElement:1,o=je.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(j,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function it(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ye===!0&&Ve.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ht(e,t,r),e.side=0,e.needsUpdate=!0,ht(e,t,r),e.side=2):ht(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Be.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),be=this.localClippingEnabled,ye=Ve.init(this.clippingPlanes,be),ye===!0&&Ve.setGlobalState(this.clippingPlanes,t),D!==null&&He.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];it(o,n,t,e),r.add(o)}else it(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=je.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Oe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let at=null;function ot(e){at&&at(e)}function st(){lt.stop()}function ct(){lt.start()}let lt=new gf;lt.setAnimationLoop(ot),typeof self<`u`&&lt.setContext(self),this.setAnimationLoop=function(e){at=e,Ze.setAnimationLoop(e),e===null?lt.stop():lt.start()},Ze.addEventListener(`sessionstart`,st),Ze.addEventListener(`sessionend`,ct),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){dc(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ze.enabled===!0&&Ze.isPresenting===!0,r=w!==null&&(ie===null||n)&&w.begin(T,ie);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ze.enabled===!0&&Ze.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ze.cameraAutoUpdate===!0&&Ze.updateCamera(t),t=Ze.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,ie),x=Be.get(e,C.length),x.init(t),x.state.textureUnits=Me.getTextureUnits(),C.push(x),xe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ve.setFromProjectionMatrix(xe,rc,t.reversedDepth),be=this.localClippingEnabled,ye=Ve.init(this.clippingPlanes,be),b=ze.get(e,S.length),b.init(),S.push(b),Ze.enabled===!0&&Ze.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&ut(e,t,-1/0,T.sortObjects)}ut(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(pe,me),Te=Ze.enabled===!1||Ze.isPresenting===!1||Ze.hasDepthSensing()===!1,Te&&Ue.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ye===!0&&Ve.beginShadows();let i=x.state.shadowsArray;if(He.render(i,e,t),ye===!0&&Ve.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];ft(n,r,e,a)}Te&&Ue.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];dt(b,e,n,n.viewport)}}else r.length>0&&ft(n,r,e,t),Te&&Ue.render(e),dt(b,e,t)}ie!==null&&re===0&&(Me.updateMultisampleRenderTarget(ie),Me.updateRenderTargetMipmap(ie)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Je.resetDefaultState(),ae=-1,oe=null,C.pop(),C.length>0?(x=C[C.length-1],Me.setTextureUnits(x.state.textureUnits),ye===!0&&Ve.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function ut(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ve)){r&&Ce.setFromMatrixPosition(e.matrixWorld).applyMatrix4(xe);let i=Ie.update(e),a=e.material;a.visible&&b.push(e,i,a,n,Ce.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ve))){let i=Ie.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ce.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ce.copy(e.boundingSphere.center)),Ce.applyMatrix4(e.matrixWorld).applyMatrix4(xe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,Ce.z,s,t)}}else a.visible&&b.push(e,i,a,n,Ce.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)ut(i[e],t,n,r)}function dt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ye===!0&&Ve.setGlobalState(T.clippingPlanes,n),r&&M.viewport(se.copy(r)),i.length>0&&pt(i,t,n),a.length>0&&pt(a,t,n),o.length>0&&pt(o,t,n),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function ft(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Oe.has(`EXT_color_buffer_half_float`)||Oe.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new qc(1,1,{generateMipmaps:!0,type:e?Uo:Io,minFilter:Fo,samples:Math.max(4,ke.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Pc.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||se;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(ue),k=T.getClearAlpha(),k<1&&T.setClearColor(16777215,.5),T.clear(),Te&&Ue.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ye===!0&&Ve.setGlobalState(T.clippingPlanes,r),pt(e,n,r),Me.updateMultisampleRenderTarget(a),Me.updateRenderTargetMipmap(a),Oe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,mt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Me.updateMultisampleRenderTarget(a),Me.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(ue,k),d!==void 0&&(r.viewport=d),T.toneMapping=u}function pt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&mt(o,t,n,s,l,c)}}function mt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ht(e,t,n){t.isScene!==!0&&(t=we);let r=je.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Le.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Le.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ne.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,tt),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return _t(e,s),d}else s.uniforms=Le.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Le.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ve.uniform),_t(e,s),r.needsLights=xt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function gt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=dm.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function _t(e,t){let n=je.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function vt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function yt(e,t,n,r,i){t.isScene!==!0&&(t=we),Me.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=ie===null?T.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Pc.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ne.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=je.get(r),y=x.state.lights;if(ye===!0&&(be===!0||e!==oe)){let t=e===oe&&r.id===ae;Ve.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ve.numPlanes||v.numIntersection!==Ve.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=ht(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),ee=v.uniforms;if(M.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==ae&&(ae=r.id,w=!0),v.needsLights){let e=vt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||oe!==e){M.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(j,`projectionMatrix`,e.projectionMatrix),O.setValue(j,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(j,Se.setFromMatrixPosition(e.matrixWorld)),ke.logarithmicDepthBuffer&&O.setValue(j,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(j,`isOrthographic`,e.isOrthographicCamera===!0),oe!==e&&(oe=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(j,`sunShadowMap`,y.state.sunShadowMap,Me),y.state.directionalShadowMap.length>0&&O.setValue(j,`directionalShadowMap`,y.state.directionalShadowMap,Me),y.state.spotShadowMap.length>0&&O.setValue(j,`spotShadowMap`,y.state.spotShadowMap,Me),y.state.pointShadowMap.length>0&&O.setValue(j,`pointShadowMap`,y.state.pointShadowMap,Me)),i.isSkinnedMesh){O.setOptional(j,i,`bindMatrix`),O.setOptional(j,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(j,`boneTexture`,e.boneTexture,Me))}i.isBatchedMesh&&(O.setOptional(j,i,`batchingTexture`),O.setValue(j,`batchingTexture`,i._matricesTexture,Me),O.setOptional(j,i,`batchingIdTexture`),O.setValue(j,`batchingIdTexture`,i._indirectTexture,Me),O.setOptional(j,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(j,`batchingColorTexture`,i._colorsTexture,Me));let te=n.morphAttributes;if((te.position!==void 0||te.normal!==void 0||te.color!==void 0)&&We.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(j,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(ee.envMapIntensity.value=t.environmentIntensity),ee.dfgLUT!==void 0&&(ee.dfgLUT.value=Mh()),w){if(O.setValue(j,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&bt(ee,E),a&&r.fog===!0&&Re.refreshFogUniforms(ee,a),Re.refreshMaterialUniforms(ee,r,fe,de,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;ee.probesSH.value=e.texture,ee.probesMin.value.copy(e.boundingBox.min),ee.probesMax.value.copy(e.boundingBox.max),ee.probesResolution.value.copy(e.resolution)}dm.upload(j,gt(v),ee,Me)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(dm.upload(j,gt(v),ee,Me),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(j,`center`,i.center),O.setValue(j,`modelViewMatrix`,i.modelViewMatrix),O.setValue(j,`normalMatrix`,i.normalMatrix),O.setValue(j,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ye.update(n,S),Ye.bind(n,S)}}return S}function bt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function xt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ne},this.getActiveMipmapLevel=function(){return re},this.getRenderTarget=function(){return ie},this.setRenderTargetTextures=function(e,t,n){let r=je.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),je.get(e.texture).__webglTexture=t,je.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=je.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){ie=e,ne=t,re=n;let r=null,i=!1,a=!1;if(e){let o=je.get(e);if(o.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(j.FRAMEBUFFER,o.__webglFramebuffer),se.copy(e.viewport),ce.copy(e.scissor),le=e.scissorTest,M.viewport(se),M.scissor(ce),M.setScissorTest(le),ae=-1;return}if(o.__webglFramebuffer===void 0)Me.setupRenderTarget(e);else if(o.__hasExternalTextures)Me.rebindTextures(e,je.get(e.texture).__webglTexture,je.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&je.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Me.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=je.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Me.useMultisampledRTT(e)===!1?je.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,se.copy(e.viewport),ce.copy(e.scissor),le=e.scissorTest}else se.copy(he).multiplyScalar(fe).floor(),ce.copy(ge).multiplyScalar(fe).floor(),le=_e;if(n!==0&&(r=O),M.bindFramebuffer(j.FRAMEBUFFER,r)&&M.drawBuffers(e,r),M.viewport(se),M.scissor(ce),M.setScissorTest(le),i){let r=je.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=je.get(e.textures[t]);j.framebufferTextureLayer(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=je.get(e.texture);j.framebufferTexture2D(j.FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,t.__webglTexture,n)}ae=-1};function St(e){let t=je.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=ke.textureFormatReadable(e.format),t.__typeReadable=ke.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){dc(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=je.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){M.bindFramebuffer(j.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let u=St(o);if(u.__formatReadable===!1){dc(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){dc(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&j.readPixels(t,n,r,i,qe.convert(c),qe.convert(l),a)}finally{let e=ie===null?null:je.get(ie).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=je.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){M.bindFramebuffer(j.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&j.readBuffer(j.COLOR_ATTACHMENT0+s);let d=St(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=j.createBuffer();j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.bufferData(j.PIXEL_PACK_BUFFER,a.byteLength,j.STREAM_READ),j.readPixels(t,n,r,i,qe.convert(l),qe.convert(u),0),j.bindBuffer(j.PIXEL_PACK_BUFFER,null);let p=ie===null?null:je.get(ie).__webglFramebuffer;M.bindFramebuffer(j.FRAMEBUFFER,p);let m=j.fenceSync(j.SYNC_GPU_COMMANDS_COMPLETE,0);return j.flush(),await pc(j,m,4),j.bindBuffer(j.PIXEL_PACK_BUFFER,f),j.getBufferSubData(j.PIXEL_PACK_BUFFER,0,a),j.bindBuffer(j.PIXEL_PACK_BUFFER,null),j.deleteBuffer(f),j.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Me.setTexture2D(e,0),j.copyTexSubImage2D(j.TEXTURE_2D,n,0,0,o,s,i,a),M.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=qe.convert(t.format),_=qe.convert(t.type),v;t.isData3DTexture?(Me.setTexture3D(t,0),v=j.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Me.setTexture2DArray(t,0),v=j.TEXTURE_2D_ARRAY):(Me.setTexture2D(t,0),v=j.TEXTURE_2D),M.activeTexture(j.TEXTURE0),M.pixelStorei(j.UNPACK_FLIP_Y_WEBGL,t.flipY),M.pixelStorei(j.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),M.pixelStorei(j.UNPACK_ALIGNMENT,t.unpackAlignment);let y=M.getParameter(j.UNPACK_ROW_LENGTH),b=M.getParameter(j.UNPACK_IMAGE_HEIGHT),x=M.getParameter(j.UNPACK_SKIP_PIXELS),S=M.getParameter(j.UNPACK_SKIP_ROWS),C=M.getParameter(j.UNPACK_SKIP_IMAGES);M.pixelStorei(j.UNPACK_ROW_LENGTH,h.width),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,h.height),M.pixelStorei(j.UNPACK_SKIP_PIXELS,l),M.pixelStorei(j.UNPACK_SKIP_ROWS,u),M.pixelStorei(j.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=je.get(e),r=je.get(t),h=je.get(n.__renderTarget),g=je.get(r.__renderTarget);M.bindFramebuffer(j.READ_FRAMEBUFFER,h.__webglFramebuffer),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,je.get(e).__webglTexture,i,d+n),j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,je.get(t).__webglTexture,a,m+n)),j.blitFramebuffer(l,u,o,s,f,p,o,s,j.DEPTH_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||je.has(e)){let n=je.get(e),r=je.get(t);M.bindFramebuffer(j.READ_FRAMEBUFFER,ee),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,te);for(let e=0;e<c;e++)w?j.framebufferTextureLayer(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):j.framebufferTexture2D(j.READ_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,n.__webglTexture,i),T?j.framebufferTextureLayer(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):j.framebufferTexture2D(j.DRAW_FRAMEBUFFER,j.COLOR_ATTACHMENT0,j.TEXTURE_2D,r.__webglTexture,a),i===0?T?j.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):j.copyTexSubImage2D(v,a,f,p,l,u,o,s):j.blitFramebuffer(l,u,o,s,f,p,o,s,j.COLOR_BUFFER_BIT,j.NEAREST);M.bindFramebuffer(j.READ_FRAMEBUFFER,null),M.bindFramebuffer(j.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?j.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):j.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?j.compressedTexSubImage2D(j.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):j.texSubImage2D(j.TEXTURE_2D,a,f,p,o,s,g,_,h);M.pixelStorei(j.UNPACK_ROW_LENGTH,y),M.pixelStorei(j.UNPACK_IMAGE_HEIGHT,b),M.pixelStorei(j.UNPACK_SKIP_PIXELS,x),M.pixelStorei(j.UNPACK_SKIP_ROWS,S),M.pixelStorei(j.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&j.generateMipmap(v),M.unbindTexture()},this.initRenderTarget=function(e){je.get(e).__webglFramebuffer===void 0&&Me.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Me.setTextureCube(e,0):e.isData3DTexture?Me.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Me.setTexture2DArray(e,0):Me.setTexture2D(e,0),M.unbindTexture()},this.resetState=function(){ne=0,re=0,ie=null,M.reset(),Je.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return rc}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Pc._getDrawingBufferColorSpace(e),t.unpackColorSpace=Pc._getUnpackColorSpace()}},Ph=`
in vec3 position;
in vec2 uv;
in vec4 color;
in vec3 qp0;
in vec3 qp1;
in vec3 qp2;
in vec3 qp3;
in vec3 qc0;
in vec3 qc1;
in vec3 qc2;
in vec3 qc3;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 texSize;
out vec2 vUv;
flat out float vAlpha;
flat out vec2 s0;
flat out vec2 s1;
flat out vec2 s2;
flat out vec2 s3;
flat out vec3 c0;
flat out vec3 c1;
flat out vec3 c2;
flat out vec3 c3;
// DS screen coordinates: whole pixels, y down.
vec2 screen(vec3 p) {
  vec4 k = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  vec2 s = (k.xy / k.w * 0.5 + 0.5) * vec2(256.0, 192.0);
  return vec2(s.x, 192.0 - s.y);
}
void main() {
  vUv = uv / texSize;
  vAlpha = color.a;
  s0 = screen(qp0);
  s1 = screen(qp1);
  s2 = screen(qp2);
  s3 = screen(qp3);
  c0 = qc0;
  c1 = qc1;
  c2 = qc2;
  c3 = qc3;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Fh=`
precision highp float;
uniform sampler2D map;
uniform bool textured;
uniform bool flash;
in vec2 vUv;
flat in float vAlpha;
flat in vec2 s0;
flat in vec2 s1;
flat in vec2 s2;
flat in vec2 s3;
flat in vec3 c0;
flat in vec3 c1;
flat in vec3 c2;
flat in vec3 c3;
out vec4 fragColor;
float xl;
float xr;
vec3 cl;
vec3 cr;
vec3 interp(vec3 a, vec3 b, float x, float xdiff) {
  if (xdiff <= 0.0) return a;
  return a + (b - a) * x / xdiff;
}
void edge(vec2 a, vec2 b, vec3 ca, vec3 cb, float y) {
  if (a.y == b.y) return;
  if (a.y > b.y) {
    vec2 t = a; a = b; b = t;
    vec3 tc = ca; ca = cb; cb = tc;
  }
  if (y < a.y || y > b.y) return;
  float x = a.x + (b.x - a.x) * (y - a.y) / (b.y - a.y);
  vec3 c = interp(ca, cb, y - a.y, b.y - a.y);
  if (x < xl) { xl = x; cl = c; }
  if (x > xr) { xr = x; cr = c; }
}
vec3 widen9(vec3 c) {
  return mix(vec3(0.0), c * 16.0 + 15.0, step(0.5, c));
}
void main() {
  // DS screen row, y down.
  float py = 192.0 - gl_FragCoord.y;
  xl = 1e9;
  xr = -1e9;
  cl = widen9(c0);
  cr = cl;
  edge(s0, s1, widen9(c0), widen9(c1), py);
  edge(s1, s2, widen9(c1), widen9(c2), py);
  edge(s2, s3, widen9(c2), widen9(c3), py);
  edge(s3, s0, widen9(c3), widen9(c0), py);
  vec3 c9 = xr > xl ? interp(cl, cr, clamp(gl_FragCoord.x - xl, 0.0, xr - xl), xr - xl) : cl;
  vec3 v6 = floor(c9 / 8.0);
  vec3 r6 = v6;
  if (textured) {
    vec4 t = texture(map, vUv);
    if (t.a < 0.5) discard;
    vec3 t6 = vec3(63.0);
    if (!flash) {
      vec3 t5 = floor(t.rgb * (255.0 / 8.0) + 0.001);
      t6 = t5 * 2.0 + step(0.5, t5);
    }
    r6 = floor(((t6 + 1.0) * (v6 + 1.0) - 1.0) / 64.0);
  }
  fragColor = vec4((r6 * 4.0 + floor(r6 / 16.0)) / 255.0, (vAlpha + 1.0) / 32.0);
}
`,Ih=32768,Lh=e=>e*2+ +(e>0);function Rh(e){let t=e.getContext(),n=t.getExtension(`WEBGL_debug_renderer_info`),r=n?t.getParameter(n.UNMASKED_RENDERER_WEBGL):t.getParameter(t.RENDERER);return typeof r==`string`?r:`unknown`}var zh=class{renderer;canvas;camera=new Xd(-4,4,3,-3,1,64);scene=new Nl;geometry=new Du;mesh;materials=[];materialIndex=new Map;pos=new Float32Array(Ih*3);uv=new Float32Array(Ih*2);col=new Float32Array(Ih*4);col5=new Float32Array(Ih*3);qp=[0,1,2,3].map(()=>new Float32Array(Ih*3));qc=[0,1,2,3].map(()=>new Float32Array(Ih*3));qpAttr;qcAttr;idx=new Uint16Array(Ih/4*6);posAttr;uvAttr;colAttr;idxAttr;verts=0;indices=0;prim=1;primStart=0;batchStart=[];batchMat=[];texture=null;variant=null;flash=!1;alpha=31;cull=0;r6=63;g6=63;b6=63;r5=31;g5=31;b5=31;u=0;v=0;overflowed=!1;constructor(){this.canvas=document.createElement(`canvas`),this.renderer=new Nh({canvas:this.canvas,antialias:!1,alpha:!0,premultipliedAlpha:!0,preserveDrawingBuffer:!1}),this.renderer.setPixelRatio(1),this.renderer.setSize(256,192,!1),this.renderer.setClearColor(0,0),this.renderer.sortObjects=!1,this.renderer.outputColorSpace=Xs,this.posAttr=new fu(this.pos,3).setUsage(tc),this.uvAttr=new fu(this.uv,2).setUsage(tc),this.colAttr=new fu(this.col,4).setUsage(tc),this.idxAttr=new fu(this.idx,1).setUsage(tc),this.geometry.setAttribute(`position`,this.posAttr),this.geometry.setAttribute(`uv`,this.uvAttr),this.geometry.setAttribute(`color`,this.colAttr),this.geometry.setIndex(this.idxAttr),this.qpAttr=this.qp.map(e=>new fu(e,3).setUsage(tc)),this.qcAttr=this.qc.map(e=>new fu(e,3).setUsage(tc));for(let e=0;e<4;e++)this.geometry.setAttribute(`qp${e}`,this.qpAttr[e]),this.geometry.setAttribute(`qc${e}`,this.qcAttr[e]);this.mesh=new Zu(this.geometry,this.materials),this.mesh.frustumCulled=!1,this.scene.add(this.mesh)}begin(){this.verts=0,this.indices=0,this.batchStart.length=0,this.batchMat.length=0,this.texture=null,this.variant=null,this.flash=!1,this.alpha=31,this.cull=0,this.overflowed=!1}view(e,t,n,r){let i=this.camera;i.left=-e,i.right=e,i.top=t,i.bottom=-t,i.near=1,i.far=64,i.position.set(n[0],n[1],n[2]),i.up.set(0,1,0),i.lookAt(r[0],r[1],r[2]),i.updateProjectionMatrix(),i.updateMatrixWorld()}materialUse(e){this.texture=e,this.variant=null,this.flash=!1}paletteUse(e){e===`white`?this.flash=!0:this.variant=e}polyFormat(e,t,n,r){this.alpha=e,this.cull=r}color(e){this.r5=e&31,this.g5=e>>5&31,this.b5=e>>10&31,this.r6=Lh(this.r5),this.g6=Lh(this.g5),this.b6=Lh(this.b5)}texCoord(e,t){this.u=e,this.v=t}polyBegin(e){this.prim=e,this.primStart=this.verts}polyEnd(){}vertex(e,t,n){if(this.verts>=32764){this.overflowed=!0;return}let r=this.verts++;this.pos[r*3]=(e>>1)/2048,this.pos[r*3+1]=(t>>1)/2048,this.pos[r*3+2]=(n>>1)/2048,this.uv[r*2]=this.u,this.uv[r*2+1]=this.v,this.col[r*4]=this.r6,this.col[r*4+1]=this.g6,this.col[r*4+2]=this.b6,this.col[r*4+3]=this.alpha,this.col5[r*3]=this.r5,this.col5[r*3+1]=this.g5,this.col5[r*3+2]=this.b5;let i=r-this.primStart+1;this.prim===1&&i%4==0?(this.corners(r-3,[r-3,r-2,r-1,r]),this.emit([r-3,r-2,r-1,r-3,r-1,r])):this.prim===0&&i%3==0&&(this.corners(r-2,[r-2,r-1,r,r]),this.emit([r-2,r-1,r]))}corners(e,t){let n=t[3]===t[2]?3:4;for(let r=e;r<e+n;r++)for(let e=0;e<4;e++){let n=t[e];for(let t=0;t<3;t++)this.qp[e][r*3+t]=this.pos[n*3+t],this.qc[e][r*3+t]=this.col5[n*3+t]}}emit(e){let t=this.materialFor();(this.batchMat.length===0||this.batchMat[this.batchMat.length-1]!==t)&&(this.batchStart.push(this.indices),this.batchMat.push(t));for(let t of e)this.idx[this.indices++]=t}materialFor(){let e=this.texture,t=e?this.variant??e.tex:null,n=this.alpha<31,r=`${t?t.id:-1}|${+!!this.flash}|${+!!n}|${this.cull}`,i=this.materialIndex.get(r);if(i===void 0){let a=new bd({glslVersion:nc,vertexShader:Ph,fragmentShader:Fh,uniforms:{map:{value:t},textured:{value:!!t},flash:{value:this.flash},texSize:{value:new Tc(e?e.w:1,e?e.h:1)}},side:this.cull===1?2:0,transparent:n,depthWrite:!n,depthTest:!0,depthFunc:2,blending:+!!n});n&&(a.blending=5,a.blendSrc=204,a.blendDst=205,a.blendSrcAlpha=201,a.blendDstAlpha=205),i=this.materials.length,this.materials.push(a),this.materialIndex.set(r,i)}return i}render(){let e=this.geometry;e.clearGroups();for(let t=0;t<this.batchStart.length;t++){let n=this.batchStart[t],r=t+1<this.batchStart.length?this.batchStart[t+1]:this.indices;e.addGroup(n,r-n,this.batchMat[t])}for(let e of[this.posAttr,this.uvAttr,this.colAttr,...this.qpAttr,...this.qcAttr])e.clearUpdateRanges(),e.addUpdateRange(0,this.verts*e.itemSize),e.needsUpdate=!0;this.idxAttr.clearUpdateRanges(),this.idxAttr.addUpdateRange(0,this.indices),this.idxAttr.needsUpdate=!0,e.setDrawRange(0,this.indices),this.renderer.render(this.scene,this.camera)}clear(){this.renderer.clear()}},Bh=N(.28),Vh=N(.075),Hh=N(.025),Uh=N(.26),Wh=N(.16),Gh=N(.55),Kh=N(.65),qh=N(.22),Jh=N(.18),Yh=N(2.2),Xh=N(.36),Zh=N(5);function Qh(){return{x:0,z:0,facing:0,action:0,action_timer:0,dash_charges:0,dash_recharge:0,dash_recharge_time:0,dash_gap:0,iframes:0,hurt_frames:0,hp:0,max_hp:0,attack_damage:0,kb_x:0,kb_z:0,anim_timer:0,safe_x:0,safe_z:0,daggers:0,dagger_recharge:0,meter:0,dash_max:0,dagger_max:0,dagger_recharge_time:0,dagger_pierce:0,dagger_damage:0,iframes_hurt:0,meter_max:0,attack_radius:0,blast_radius:0,blast_damage:0}}var $h=N(3),eg=N(5),tg=N(4.5),ng=N(7),rg=N(4),ig=N(7),ag=N(5.5),og=N(1),sg=N(.6);function cg(){return{active:!1,type:0,state:0,timer:0,x:0,z:0,aim_x:0,aim_z:0,kb_x:0,kb_z:0,hp:0,max_hp:0,damage:0,speed:0,cooldown:0,flash:0,strafe:0,hit_done:!1,elite:!1,anim:0,owner:0,stunned:!1,pattern:0,sees:!1,attack_kind:0,tx:0,tz:0}}function lg(e){return e===9||e===10||e===14||e===18}function ug(e){return e===11}function dg(e){return e===6||e===13}function fg(){return{active:!1,kind:0,owner:0,x:0,z:0,vx:0,vz:0,life:0,damage:0}}function pg(){return{active:!1,x:0,z:0,timer:0,radius:0,damage:0,owner:0}}function mg(){return{active:!1,x:0,z:0,vx:0,vz:0,life:0,pierce:0,hit_mask:0,dir:0}}var hg=N(.12),gg=N(.45);function _g(e){return e===0||e===1||e===11||e===12||e===22}function vg(e){return e===4||e===5||e===8||e===9||e===10}function yg(e){return e===3||e===2||e===6}var bg=N(.3);function xg(){let e=[];for(let t=0;t<12;t++)e.push(new Uint8Array(12));let t=[];for(let e=0;e<3;e++)t.push({side:0,pos:0,leads_to:0});let n=[];for(let e=0;e<12;e++)n.push({type:0,elite:0,x:0,z:0});let r=[];for(let e=0;e<24;e++)r.push({kind:0,variant:0,wall:0,x:0,z:0});let i=[];for(let e=0;e<4;e++)i.push({kind:0,phase:0,x:0,z:0,x2:0,z2:0});return{cells:e,seed:0,type:0,entry_side:0,entry_pos:0,doors:t,door_count:0,spawn_x:0,spawn_z:0,enemies:n,enemy_count:0,feature_x:0,feature_z:0,hub:!1,dirt:new Uint16Array(12),area:0,decor:r,decor_count:0,hazards:i,hazard_count:0}}function Sg(e){return(e+2)%4}var Cg=1024,wg=2048,Tg=4096,Eg=8192,Dg=16384,Og=32768,kg=65536,Ag=1<<17,jg=1<<18,Mg=1<<19,Ng=1<<20,Pg=1<<21,Fg=1<<22,Ig=1<<23,Lg=1<<24,Rg=1<<25,zg=1<<26,Bg=1<<27,Vg=1<<28,Hg=1<<29,Ug=1<<30,Wg=2**31,Gg=e=>4+e*2,Kg=e=>18+e*5,qg=e=>40+e*4,Jg=N(1.8),Yg=N(.3),Xg=N(.45),Zg=N(1.6),Qg=N(.09);function $g(){return{active:!1,kind:0,value:0,age:0,x:0,y:0,z:0,vx:0,vy:0,vz:0}}var e_=N(.04),t_=N(.5),n_=N(.45),r_=N(.35),i_=N(.55),a_=N(.5);function o_(){return{active:!1,x:0,z:0,life:0,hit_mask:0}}var s_=N(1.1);function c_(e){return e<1?0:Math.trunc((e-1)/10)%4}function l_(e){return e>0&&e%10==0}function u_(e){return e*10+1}function d_(e){let t=Array(24).fill(0);for(let[n,r]of e)t[n]=r;return t}var f_=[{banner:`THE DUNGEON DEPTHS`,name:`the Dungeon`,waypoint:`The Dungeon`,boss:9,music:3,sky:[0,1],shapes:[20,20,10,10,12,10,18,0,0],pct:d_([[0,100],[1,100],[2,100],[3,100],[4,100],[5,100],[6,100]]),native:d_([]),traps:[0,1,2],wall_light:0,banners:!0,masonry:!0,pit_cause:32,count_pct:0},{banner:`THE SUNKEN SEWERS`,name:`the Sewers`,waypoint:`The Sewers`,boss:10,music:4,sky:[3,4],shapes:[10,14,8,8,18,18,24,0,0],pct:d_([[0,60],[1,80],[2,80],[3,150],[4,100],[5,200],[6,100]]),native:d_([]),traps:[0,1,2],wall_light:0,banners:!0,masonry:!0,pit_cause:40,count_pct:0},{banner:`THE CRYSTAL CAVERNS`,name:`the Caverns`,waypoint:`The Caverns`,boss:14,music:6,sky:[6,7],shapes:[4,10,4,4,10,16,12,40,0],pct:d_([[0,40],[1,50],[2,90],[3,110],[4,60]]),native:d_([[11,26],[12,16],[13,10]]),traps:[3,0,3],wall_light:22,banners:!1,masonry:!1,pit_cause:32,count_pct:90},{banner:`THE MOLTEN DEPTHS`,name:`the Molten Depths`,waypoint:`Molten Depths`,boss:18,music:7,sky:[8,9],shapes:[16,14,6,6,12,8,14,0,20],pct:d_([[0,50],[2,30],[3,50],[4,110],[5,60],[6,70]]),native:d_([[15,18],[16,7],[17,22]]),traps:[4,1,4],wall_light:0,banners:!1,masonry:!0,pit_cause:39,count_pct:85}],p_=N(24),m_=N(.57923),h_=N(.57358),g_=N(.57923),__=N(.81915),v_=N(.40558),y_=N(8),b_=N(16);function x_(){return{x:0,z:0,goal_x:0,goal_z:0,view_w:0,zoom_from:0,zoom_to:0,zoom_t:0,zoom:0,room_size:0}}var S_=N(1),C_=N(1.3);function w_(e){return I(e.view_w,N(.75))}function T_(e,t){return I(e-t|0,N(.70711))}function E_(e,t){return-I(e+t|0,v_)|0}function D_(e,t,n,r,i){e.zoom=t,e.view_w=t===1?b_:y_,e.zoom_from=e.zoom_to=e.view_w,e.zoom_t=16,e.room_size=n;let a=j_(e,r,i);e.x=e.goal_x=a.x,e.z=e.goal_z=a.z}function O_(e){e.zoom=e.zoom===1?0:1,e.zoom_from=e.view_w,e.zoom_to=e.zoom===1?b_:y_,e.zoom_t=0}function k_(e,t,n){e.goal_x=t,e.goal_z=n}function A_(e,t,n){return t>n?L(t+n,2):kn(e,t,n)}function j_(e,t,n){let r=L(e.room_size,2),i=t-r|0,a=n-r|0,o=I(e.room_size,N(.70711)),s=I(e.room_size,v_)+C_|0,c=I(e.room_size,v_),l=L(e.view_w,2),u=L(w_(e),2),d=T_(i,a),f=E_(i,a);d=A_(d,-o+l-S_,o-l+S_),f=A_(f,-c+u-S_,s-u+S_);let p=I(d,N(1.41421)),m=-Dn(f,v_)|0;return{x:r+L(m+p,2)|0,z:r+L(m-p,2)|0}}function M_(e){if(e.zoom_t<16){e.zoom_t++;let t=jn(L(e.zoom_t*Tn,16));e.view_w=An(e.zoom_from,e.zoom_to,t)}let t=j_(e,e.goal_x,e.goal_z);e.x=e.x+L(t.x-e.x,6)|0,e.z=e.z+L(t.z-e.z,6)|0}var N_=N(.012);function P_(e){e.active=!1,e.kind=e.life=e.max_life=0,e.x=e.y=e.z=e.vx=e.vy=e.vz=0}function F_(e){e.active=!1,e.value=e.life=0,e.kill=!1,e.x=e.y=e.z=0}function I_(){let e=[];for(let t=0;t<96;t++){let t={};P_(t),e.push(t)}let t=[];for(let e=0;e<8;e++){let e={};F_(e),t.push(e)}return{parts:e,floaters:t,next:0,rng:Ba()}}function L_(e,t){R_(e),e.next=0,Va(e.rng,t)}function R_(e){for(let t of e.parts)P_(t);for(let t of e.floaters)F_(t)}function z_(e){for(let t=0;t<96;t++)if(!e.parts[t].active)return e.parts[t];let t=e.parts[e.next];return e.next=(e.next+1)%96,t}function B_(e,t,n,r,i,a,o,s,c){let l=z_(e);l.active=!0,l.kind=t&255,l.life=l.max_life=(c>255?255:c)&255,l.x=n,l.y=r,l.z=i,l.vx=a,l.vy=o,l.vz=s}function V_(e,t){return L(t*(Wa(e.rng,2001)-1e3),1e3)}function H_(e){return e===5||e===4||e===8||e===9||e===10||e===11}function U_(e,t,n,r,i,a,o){let s=H_(t);for(let c=0;c<n;c++){let n=V_(e,o),c=V_(e,o),l=s?L(o,3)+V_(e,L(o,4)):L(o,2)+Wa(e.rng,(o>>>0)+1>>>0),u=18+Wa(e.rng,18);(t===1||t===2)&&(u+=30),B_(e,t,r,i,a,n,l,c,u)}}function W_(e,t,n,r,i){let a=e.floaters[0];for(let t=0;t<8;t++){if(!e.floaters[t].active){a=e.floaters[t];break}e.floaters[t].life<a.life&&(a=e.floaters[t])}a.active=!0,a.value=t>99?99:t<0?0:t,a.life=40,a.kill=i,a.x=n+V_(e,N(.15)),a.z=r+V_(e,N(.15)),a.y=N(1)}function G_(e){for(let t=0;t<96;t++){let n=e.parts[t];if(n.active){if(n.life=n.life-1&255,n.life===0)n.active=!1;else{switch(n.x+=n.vx,n.z+=n.vz,n.y+=n.vy,n.kind){case 9:n.vx=I(n.vx,N(.9))+V_(e,N(.008)),n.vz=I(n.vz,N(.9))+V_(e,N(.008));continue;case 10:n.vy=I(n.vy,N(.9)),n.vx=I(n.vx,N(.8)),n.vz=I(n.vz,N(.8));continue;case 11:n.vy=I(n.vy,N(.985)),n.vx=I(n.vx,N(.96))+V_(e,N(.0015)),n.vz=I(n.vz,N(.96))+V_(e,N(.0015));continue}H_(n.kind)?(n.vx=I(n.vx,N(.94)),n.vz=I(n.vz,N(.94))):(n.vy-=N_,n.y<=0&&n.vy<=0&&(n.y=0,n.vy=n.vy<-N(.04)?I(-n.vy,N(.35)):0,n.vx=I(n.vx,N(.5)),n.vz=I(n.vz,N(.5))))}}}for(let t=0;t<8;t++){let n=e.floaters[t];n.active&&(n.y+=N(.02),n.life=n.life-1&255,n.life===0&&(n.active=!1))}}function K_(e){for(let t=0;t<12;t++)e.cells[t].fill(0);e.seed=0,e.type=0;for(let t=0;t<3;t++){let n=e.doors[t];n.side=0,n.pos=0,n.leads_to=0}e.door_count=0,e.spawn_x=e.spawn_z=0;for(let t=0;t<12;t++){let n=e.enemies[t];n.type=n.elite=n.x=n.z=0}e.enemy_count=0,e.hub=!1,e.dirt.fill(0),e.area=0;for(let t=0;t<24;t++){let n=e.decor[t];n.kind=n.variant=n.wall=n.x=n.z=0}e.decor_count=0;for(let t=0;t<4;t++){let n=e.hazards[t];n.kind=n.phase=n.x=n.z=n.x2=n.z2=0}e.hazard_count=0,e.entry_side=-1,e.entry_pos=0,e.feature_x=e.feature_z=-1}function q_(e,t){let n=P(t)+En|0,r=P(12);switch(e){case 0:return[0,n];case 1:return[n,0];case 2:return[r,n];default:return[n,r]}}function J_(e){return[e===0?Tn:e===2?-Tn:0,e===1?Tn:e===3?-Tn:0]}function Y_(e,t){switch(e){case 0:return[0,t];case 1:return[t,0];case 2:return[11,t];default:return[t,11]}}function X_(e,t,n){for(let r=0;r<e.door_count;r++)if(e.doors[r].side===t&&e.doors[r].pos===n)return r;return-1}function Z_(e,t,n){return e.cells[n][t]}function Q_(e,t,n){return t>=0&&n>=0&&t<12&&n<12&&e.cells[n][t]===0}function $_(e,t,n){return!Q_(e,t,n)}var ev=new Uint8Array(144),tv=new Uint8Array(144),nv=[[1,0],[-1,0],[0,1],[0,-1]];function rv(e,t,n){let r=0,i=0,a=0,o=0;ev.fill(0);for(let t=0;t<12;t++)for(let n=0;n<12;n++)o+=+!$_(e,n,t);if($_(e,t,n))return!1;for(ev[n*12+t]=1,tv[i++]=n*12+t;r<i;){let t=tv[r++],n=t%12,o=L(t,12);a++;for(let t=0;t<4;t++){let r=n+nv[t][0],a=o+nv[t][1];$_(e,r,a)||ev[a*12+r]||(ev[a*12+r]=1,tv[i++]=a*12+r)}}return a===o}function iv(e,t,n){let r=F(t),i=F(n);return r>=0&&i>=0&&r<12&&i<12&&e.cells[i][r]===6}function av(e){switch(e){case 1:return N(.12);case 2:return N(.15);case 3:return N(.2);case 4:return N(.25);case 7:return N(.2);default:return 0}}function ov(e){switch(e){case 1:return N(1.6);case 2:return N(.8);case 3:return N(.6);case 4:return N(.5);case 7:return N(.9);default:return 0}}var sv={x0:0,z0:0,x1:0,z1:0};function cv(e,t,n,r,i){if(t<0||n<0||t>=12||n>=12)return!1;let a=Z_(e,t,n);if(a===0||a===6&&!i)return!1;let o=av(a);return r.x0=P(t)+o|0,r.z0=P(n)+o|0,r.x1=P(t+1)-o|0,r.z1=P(n+1)-o|0,!0}function lv(e,t,n,r){return t+r>e.x0&&t-r<e.x1&&n+r>e.z0&&n-r<e.z1}function uv(e,t,n,r){let i=P(12);if(t-r<0||n-r<0||t+r>i||n+r>i)return!0;for(let i=F(n-r);i<=F(n+r);i++)for(let a=F(t-r);a<=F(t+r);a++)if(cv(e,a,i,sv,!1)&&lv(sv,t,n,r))return!0;return!1}function dv(e,t,n,r,i,a,o){let s=P(12),c=(a?t:n)+r|0,l=a?n:t;c=kn(c,i,s-i|0);for(let t=F(l-i);t<=F(l+i);t++)for(let n=F(c-i);n<=F(c+i);n++){if(!cv(e,a?n:t,a?t:n,sv,o)||!lv(sv,a?c:l,a?l:c,i))continue;let s=a?sv.x0:sv.z0,u=a?sv.x1:sv.z1;c=r>0?s-i|0:u+i|0}return c}function fv(e,t,n,r,i){n&&(t.x=dv(e,t.x,t.z,n,i,!0,!0)),r&&(t.z=dv(e,t.x,t.z,r,i,!1,!0))}function pv(e,t,n,r,i){n&&(t.x=dv(e,t.x,t.z,n,i,!0,!1)),r&&(t.z=dv(e,t.x,t.z,r,i,!1,!1))}function mv(e,t,n,r,i,a){let o=r-t|0,s=i-n|0,c=F((On(o)>On(s)?On(o):On(s))*4)+1;for(let r=1;r<c;r++){let i=t+L(Math.imul(o,r),c)|0,l=n+L(Math.imul(s,r),c)|0;if(cv(e,F(i),F(l),sv,a)&&lv(sv,i,l,0))return!1}return!0}function hv(e,t,n,r,i){return mv(e,t,n,r,i,!1)}function gv(e,t,n,r,i){return mv(e,t,n,r,i,!0)}function _v(e,t,n,r){let i=0,a=0;for(let e=0;e<12;e++)r[e].fill(255);if(Q_(e,t,n))for(r[n][t]=0,tv[a++]=n*12+t;i<a;){let t=tv[i++],n=t%12,o=L(t,12);for(let t=-1;t<=1;t++)for(let i=-1;i<=1;i++){let s=n+i,c=o+t;(i||t)&&Q_(e,s,c)&&r[c][s]===255&&(!i||!t||Q_(e,n+i,o)&&Q_(e,n,o+t))&&(r[c][s]=r[o][n]+1&255,tv[a++]=c*12+s)}}}function vv(e,t,n,r,i,a,o){let s=Z_(e,t,n);if(s!==1&&s!==2||!cv(e,t,n,sv,!0))return!1;let c=sv;if(L(c.x0+c.x1+c.z0+c.z1,2)<=r+i)return!1;let l=T_(c.x0,c.z1),u=T_(c.x1,c.z0),d=E_(c.x1,c.z1),f=E_(c.x0,c.z0)+I(ov(Z_(e,t,n)),__)|0,p=T_(r,i),m=E_(r,i),h=I(o,__);return p+a>l&&p-a<u&&m+h>d&&m<f}function yv(){let e=[];for(let t=0;t<12;t++)e.push(new Uint8Array(12));return e}function bv(e){for(let t=0;t<12;t++)e[t].fill(31)}function xv(e,t,n,r,i,a){for(let o=0;o<12;o++)for(let s=0;s<12;s++){let c=t[o][s];c=vv(e,s,o,n,r,i,a)?c-3<14?14:c-3:c+3>31?31:c+3,t[o][s]=c&255}}var Sv=(e,t,n,r=-1)=>({name:e,desc:t,cost:n,requires:r}),Cv=(()=>{let e=[];return e[0]=Sv(`Vitality`,`+1 max heart`,50),e[1]=Sv(`Swift Dash`,`Dash recharges faster`,80),e[3]=Sv(`Quiver`,`+1 dagger charge`,120),e[2]=Sv(`Heavy Blade`,`+1 sword damage`,150),e[4]=Sv(`Deep Pockets`,`+25% gold found`,250),e[6]=Sv(`Kindling`,`Runs start blast-ready`,350),e[5]=Sv(`Vitality II`,`+1 more max heart`,450,0),e[7]=Sv(`Second Wind`,`Revive once per run`,900),e[8]=Sv(`Keen Edge`,`+1 more sword damage`,1200,2),e[9]=Sv(`Fletching`,`Daggers return faster`,300),e[10]=Sv(`Barbed Tips`,`Daggers pierce +1 foe`,650,9),e[11]=Sv(`Hunter's Mark`,`+1 dagger damage`,1100,10),e[12]=Sv(`Iron Hide`,`Longer safety when hit`,200),e[13]=Sv(`Thorns`,`Getting hit lashes out`,550,12),e[14]=Sv(`Mending`,`Heal 1 every 4 fights`,950,13),e})();function wv(e,t,n){return e<0&&(e=0),t<0&&(t=0),n<0&&(n=0),n+e*3+t*1|0}var Tv=4294967295;function Ev(e,t){t.earned=wv(Pv(t),t.kills,t.gold),t.new_best=t.depth>>>0>e.best_depth,t.new_best&&(e.best_depth=t.depth>>>0),e.total_runs=e.total_runs+1>>>0,e.total_kills=e.total_kills+(t.kills>>>0)>>>0,e.bosses_slain=e.bosses_slain+(t.bosses>>>0)>>>0;let n=e.play_seconds+(t.seconds>0?t.seconds:0)>>>0;e.play_seconds=n<e.play_seconds?Tv:n;let r=e.currency+(t.earned>>>0)>>>0;e.currency=r<e.currency?Tv:r}function Dv(e,t){return!!(e.upgrades>>>t&1)}function Ov(e,t){return Dv(e,t)?1:Cv[t].requires>=0&&!Dv(e,Cv[t].requires)?3:e.currency<Cv[t].cost?2:(e.currency=e.currency-Cv[t].cost>>>0,e.upgrades=(e.upgrades|1<<t)>>>0,0)}function kv(e,t){let n=e.count<8?e.count:7;for(let t=n;t>=1;t--)le(e.runs[t],e.runs[t-1]);le(e.runs[0],t),e.count=n+1&255}var Av=[];Av[0]=[`Slain by an orc`,`Orc`],Av[1]=[`Burned by a mage`,`Mage`],Av[2]=[`Crushed by a brute`,`Brute`],Av[3]=[`Shot by an archer`,`Archer`],Av[4]=[`Cursed by a warlock`,`Warlock`],Av[5]=[`Slain by a shaman`,`Shaman`],Av[6]=[`Struck by a stone idol`,`Stone idol`],Av[7]=[`Smothered by a slime`,`Slime`],Av[8]=[`Beaten by the dummy`,`Dummy`],Av[9]=[`Slain by the Warlord`,`Warlord`],Av[10]=[`Crushed by the King`,`Slime King`],Av[11]=[`Bitten by a bat`,`Bat`],Av[12]=[`Ambushed by a cave crab`,`Cave crab`],Av[13]=[`Pierced by a crystal`,`Crystal`],Av[14]=[`Crushed by the Yeti`,`Yeti`],Av[15]=[`Burned by a fire slime`,`Fire slime`],Av[16]=[`Trampled by a magma brute`,`Lava brute`],Av[17]=[`Scorched by an imp`,`Imp`],Av[18]=[`Felled by the Magma Lord`,`Magma Lord`];function jv(e,t){if(e<19&&Av[e])return Av[e][t];switch(e){case 32:return t?`Pit`:`Fell into a pit`;case 33:return t?`Explosion`:`Caught in a blast`;case 34:return t?`Spikes`:`Impaled on spikes`;case 35:return t?`Fire vent`:`Burned by a fire vent`;case 36:return t?`Saw blade`:`Cut by a saw blade`;case 37:return t?`Rockfall`:`Crushed by falling rock`;case 39:return t?`Lava`:`Fell into the lava`;case 40:return t?`Sewer water`:`Lost in the sewer water`;case 48:return t?`Abandoned`:`Abandoned the run`;default:return t?`?`:`Fell in the depths`}}function Mv(e){return jv(e&255,0)}function Nv(e){return jv(e&255,1)}function Pv(e){let t=e.start_depth>0?e.start_depth:1,n=e.depth-t+1;return n>0?n:0}function Fv(e,t){return t===0||!!(e.waypoints>>>t&1)}function Iv(e,t){if(!l_(t))return!1;let n=L(t,10);return n<1||n>=4||Fv(e,n)?!1:(e.waypoints=(e.waypoints|1<<n)>>>0,!0)}var Lv=(e,t,n)=>({name:e,desc:t,max:n}),Rv=[Lv(`Keen Blade`,`Sword deals +1 damage`,2),Lv(`Wide Arc`,`Sword reaches 25% further`,2),Lv(`Twin Daggers`,`+1 dagger to throw`,2),Lv(`Piercing`,`Daggers pierce +1 enemy`,2),Lv(`Quick Draw`,`Daggers return 25% faster`,2),Lv(`Flame Dash`,`Dashing leaves fire`,1),Lv(`Shock Dash`,`Dash ends in a shockwave`,1),Lv(`Fleet Foot`,`+1 dash charge`,1),Lv(`Overcharge`,`Blast needs 3 fewer hits`,2),Lv(`Big Bang`,`Blast: wider, +1 damage`,2),Lv(`Vampiric`,`Kills may drop a heart`,2),Lv(`Thick Skin`,`+1 max heart, healed`,3),Lv(`Gold Rush`,`+50% gold`,2)],zv=N(.4),Bv=N(1.6),Vv=N(.3),Hv=3,Uv=4,Wv=N(.6),Gv=Ba(),Kv=[];function qv(e,t){Kv.length=0;for(let t=0;t<13;t++)e.boons[t]<Rv[t].max&&Kv.push(t);let n=Kv.length,r=Gv;Va(r,qa(e.seed,e.depth>>>0,2816+e.rooms_cleared>>>0));for(let e=n-1;e>0;e--){let t=Wa(r,e+1),n=Kv[e];Kv[e]=Kv[t],Kv[t]=n}let i=n<3?n:3;for(let e=0;e<i;e++)t[e]=Kv[e];return i}function Jv(e,t){if(t>>>0>=13||e.boons[t]>=Rv[t].max)return;e.boons[t]++;let n=e.player;switch(t){case 0:n.attack_damage++;break;case 1:n.attack_radius+=L(Kh,4);break;case 2:n.dagger_max++,n.daggers++;break;case 3:n.dagger_pierce++;break;case 4:n.dagger_recharge_time=L(n.dagger_recharge_time*3,4);break;case 7:n.dash_max++,n.dash_charges++;break;case 8:n.meter_max-=Hv,n.meter_max<Uv&&(n.meter_max=Uv),n.meter>n.meter_max&&(n.meter=n.meter_max);break;case 9:n.blast_radius+=Wv,n.blast_damage++;break;case 11:n.max_hp++,n.hp++}}function Yv(e,t){let n=t+L(t*(50*e.boons[12]+(e.deep_pockets?25:0)),100);return Lt(e.cheats,10)?n*5:n}function Xv(e,t,n,r,i,a,o,s,c){let l=Array(19).fill(0);return a.forEach((e,t)=>l[t]=e),{depth:e,enemy_count:t,hp_pct:n,damage_bonus:r,elite_chance:i,weights:l,hazards:o,hazard_kinds:s,explosive_pct:c}}var Zv=[Xv(1,2,100,0,0,[100,0,0,0,0,0,0,0],0,0,0),Xv(2,3,100,0,0,[75,25,0,0,0,0,0,0],0,0,20),Xv(3,3,105,0,0,[60,25,15,0,0,0,0,0],1,1,22),Xv(4,4,110,0,0,[50,25,15,10,0,0,0,0],1,2,25),Xv(5,4,118,0,0,[45,22,15,12,0,0,0,0],2,3,27),Xv(6,5,125,0,5,[40,20,15,12,8,0,0,0],2,3,30),Xv(7,5,132,0,6,[36,18,14,12,8,0,6,0],2,3,31),Xv(8,5,138,0,7,[32,16,14,12,8,10,6,0],2,3,32),Xv(10,6,150,0,10,[28,15,14,13,10,10,8,0],2,3,35),Xv(15,7,180,1,15,[24,14,14,14,12,12,8,0],3,3,40),Xv(20,8,220,1,20,[22,13,15,14,13,13,8,0],3,3,40),Xv(30,10,300,1,30,[20,12,16,14,14,14,8,0],4,3,45)],Qv=Zv.length,$v=8,ey=6,ty=15,ny=45,ry=10;function iy(e,t,n,r){return e+L((t-e)*n,r)|0}function ay(e,t,n,r){return e===0?0:iy(e,t,n,r)}function oy(e,t,n){return e<t?t:e>n?n:e}function sy(e){let t={enemy_count:0,hp_pct:0,damage_bonus:0,elite_chance:0,weights:Array(19).fill(0),hazards:0,hazard_kinds:0,explosive_pct:0};e<1&&(e=1);let n=Zv[Qv-1];if(e>=n.depth){let r=e-n.depth;t.enemy_count=n.enemy_count+L(r,ey),t.hp_pct=n.hp_pct+r*$v,t.damage_bonus=n.damage_bonus+L(r,ty),t.elite_chance=n.elite_chance+L(r,2);for(let e=0;e<19;e++)t.weights[e]=n.weights[e];t.hazards=n.hazards,t.hazard_kinds=n.hazard_kinds,t.explosive_pct=n.explosive_pct}else{let n=0;for(;Zv[n+1].depth<=e;)n++;let r=Zv[n],i=Zv[n+1],a=e-r.depth,o=i.depth-r.depth;t.enemy_count=iy(r.enemy_count,i.enemy_count,a,o),t.hp_pct=iy(r.hp_pct,i.hp_pct,a,o),t.damage_bonus=r.damage_bonus,t.elite_chance=ay(r.elite_chance,i.elite_chance,a,o);for(let e=0;e<19;e++)t.weights[e]=ay(r.weights[e],i.weights[e],a,o);t.hazards=r.hazards,t.hazard_kinds=r.hazard_kinds,t.explosive_pct=ay(r.explosive_pct,i.explosive_pct,a,o)}let r=ry<12?ry:12;t.enemy_count=oy(t.enemy_count,1,r),t.hp_pct=oy(t.hp_pct,100,1e3),t.damage_bonus=oy(t.damage_bonus,0,3),t.elite_chance=oy(t.elite_chance,0,ny);for(let e=0;e<19;e++)t.weights[e]=oy(t.weights[e],0,100);return t.hazards=oy(t.hazards,0,4),t.hazard_kinds=oy(t.hazard_kinds,0,3),t.explosive_pct=oy(t.explosive_pct,0,100),t}var cy=(e,t,n,r,i,a,o,s,c,l)=>({hp:e,damage:t,speed:n,radius:r,windup:i,attack:a,recover:o,range:s,attack_speed:c,cooldown:l}),ly=(()=>{let e=[];return e[0]=cy(3,1,N(.042),N(.3),24,10,36,N(1.2),N(.13),0),e[1]=cy(2,1,N(.032),N(.3),32,1,20,N(8),N(.07),100),e[2]=cy(6,2,N(.03),N(.36),30,45,36,ag,N(.2),90),e[3]=cy(2,1,N(.034),N(.3),36,1,24,N(9),N(.14),110),e[4]=cy(3,2,N(.026),N(.3),30,1,30,N(9),0,150),e[5]=cy(4,1,N(.024),N(.32),34,1,30,N(10),0,240),e[6]=cy(6,1,0,N(.4),30,1,10,N(12),N(.06),120),e[9]=cy(50,2,N(.034),N(.5),36,50,40,N(9),N(.21),50),e[10]=cy(55,2,N(.026),N(.55),30,40,40,N(10),N(.06),48),e[8]=cy(99,0,0,N(.3),0,0,0,0,0,0),e[7]=cy(1,1,N(.05),N(.25),0,0,30,0,0,0),e[11]=cy(1,1,N(.05),N(.25),16,22,30,N(2.6),N(.13),40),e[12]=cy(4,2,N(.045),N(.3),36,8,90,N(1),0,0),e[13]=cy(5,1,0,N(.4),26,1,10,N(12),N(.065),100),e[15]=cy(2,1,N(.038),N(.28),0,0,30,0,0,0),e[16]=cy(7,1,N(.03),N(.36),30,45,36,ag,N(.2),100),e[17]=cy(3,1,N(.036),N(.3),30,1,24,N(8),N(.075),110),e[18]=cy(80,2,N(.024),N(.55),32,1,30,N(12),N(.085),34),e[14]=cy(55,2,N(.026),N(.55),38,24,46,N(10),N(.07),62),e})(),uy=N(.25),dy={x:0,z:0};function fy(e,t){let n=t.x-e.x|0,r=t.z-e.z|0,i=Mn(I(n,n)+I(r,r)|0);return i<N(.001)?(dy.x=Tn,dy.z=0,0):(dy.x=Dn(n,i),dy.z=Dn(r,i),i)}function py(e,t,n,r,i){fv(t,e,I(n,i),I(r,i),uy)}function my(e){return e.sees}function hy(e,t){e.sees=hv(t.room,e.x,e.z,t.player.x,t.player.z)}function gy(e,t,n){if(gv(t.room,e.x,e.z,t.player.x,t.player.z))return;let r=F(e.x),i=F(e.z);if(r<0||i<0||r>=12||i>=12)return;let a=t.room,o=t.path[i][r],s=0,c=0;for(let e=-1;e<=1;e++)for(let n=-1;n<=1;n++){let l=r+n,u=i+e;!n&&!e||!Q_(a,l,u)||t.path[u][l]>=o||(!n||!e||Q_(a,r+n,i)&&Q_(a,r,i+e))&&(o=t.path[u][l],s=n,c=e)}if(!s&&!c)return;let l=P(r+s)+En-e.x|0,u=P(i+c)+En-e.z|0,d=Mn(I(l,l)+I(u,u)|0);d<N(.01)||(n.x=Dn(l,d),n.z=Dn(u,d))}var _y={x:0,z:0};function vy(e,t,n,r){return _y.x=n,_y.z=r,gy(e,t,_y),_y}function yy(e,t){let n=t.player,r=n.x-e.x|0,i=n.z-e.z|0,a=ly[e.type].radius+Bh;return I(r,r)+I(i,i)<I(a,a)}function by(e,t){yy(e,t)&&(dS(t,t.player,e.damage,e.x,e.z,e.type),e.hit_done=!0)}function xy(e,t,n){e.state=2,e.timer=ly[e.type].windup,e.aim_x=t,e.aim_z=n}function Sy(e){e.state=4,e.timer=ly[e.type].recover}function Cy(e){--e.timer<=0&&(e.state=1,e.cooldown=ly[e.type].cooldown,e.stunned=!1)}function wy(e,t,n,r,i,a,o){if(o<n)py(e,t.room,-i,-a,e.speed);else if(o>r||!my(e)){let n=vy(e,t,i,a);py(e,t.room,n.x,n.z,e.speed)}else{let n=-a*e.strafe,r=i*e.strafe,o=e.x,s=e.z;py(e,t.room,n,r,L(e.speed,2)),(e.x===o&&e.z===s||e.anim%120==119)&&(e.strafe=-e.strafe)}e.cooldown>0&&e.cooldown--,e.cooldown===0&&hy(e,t)}function Ty(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.state){case 1:{let o=vy(e,t,i,a);py(e,t.room,o.x,o.z,e.speed),r<n.range&&(hy(e,t),my(e)&&xy(e,i,a));break}case 2:--e.timer<=0&&(e.state=3,e.timer=n.attack,e.hit_done=!1);break;case 3:py(e,t.room,e.aim_x,e.aim_z,n.attack_speed),e.hit_done||by(e,t),--e.timer<=0&&Sy(e);break;case 4:--e.timer<=0&&(e.state=1)}}function Ey(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.state){case 1:{let o=vy(e,t,i,a);py(e,t.room,o.x,o.z,e.speed),e.cooldown>0&&e.cooldown--,e.cooldown===0&&r<n.range&&(hy(e,t),my(e)&&xy(e,i,a));break}case 2:--e.timer<=0&&(e.state=3,e.timer=n.attack,e.hit_done=!1,t.events|=Ug);break;case 3:{let r=e.x,i=e.z,a=I(e.aim_x,n.attack_speed),o=I(e.aim_z,n.attack_speed);if(pv(t.room,e,a,o,uy),iv(t.room,e.x,e.z)){BS(t,e);return}if(e.hit_done||by(e,t),e.type===16&&e.timer%15==0&&yS(t,r,i,34,sg,1,16),On(e.x-r|0)+On(e.z-i|0)<L(n.attack_speed,3)){let n=e.x+I(e.aim_x,N(.5))|0,r=e.z+I(e.aim_z,N(.5))|0;HS(t,n,r,N(.5),2),t.events|=Wg,_S(t,15,0,n,r),e.state=4,e.timer=60,e.stunned=!0;break}--e.timer<=0&&Sy(e);break}case 4:Cy(e)}}function Dy(e,t){fy(e,t.player);let n=dy.x,r=dy.z;switch(e.state){case 1:{let i=vy(e,t,n,r);py(e,t.room,i.x,i.z,e.speed),yy(e,t)&&(by(e,t),Sy(e));break}case 4:py(e,t.room,-n,-r,L(e.speed,2)),--e.timer<=0&&(e.state=1);break;default:e.state=1}}function Oy(e){return e.type===14?2:0}function ky(e,t,n,r,i,a){let o=lg(t.type)||t.type===13||t.type===17?1:t.damage,s=fS(e,n,t.x,t.z,I(r,a),I(i,a),o);s&&(s.owner=t.type),e.events|=32}function Ay(e,t){let n=ly[e.type],r=e.type===3,i=fy(e,t.player),a=dy.x,o=dy.z;switch(e.state){case 1:wy(e,t,r?tg:$h,r?ng:eg,a,o,i),e.cooldown===0&&i<n.range&&my(e)&&xy(e,a,o);break;case 2:if(--e.timer<=0){if(ky(t,e,+!!r,e.aim_x,e.aim_z,n.attack_speed),e.type===17){let r=N(.93969),i=N(.34202);for(let a=-1;a<=1;a+=2){let o=i*a;ky(t,e,0,I(e.aim_x,r)-I(e.aim_z,o)|0,I(e.aim_x,o)+I(e.aim_z,r)|0,n.attack_speed)}}Sy(e)}break;case 4:Cy(e)}}function jy(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.state){case 1:wy(e,t,rg,ig,i,a,r),e.cooldown===0&&r<n.range&&xy(e,i,a);break;case 2:--e.timer<=0&&(vS(t,t.player.x,t.player.z),Sy(e));break;case 4:Cy(e)}}function My(e,t){let n=0;for(let r=0;r<12;r++){let i=e.enemies[r];n+=i.active&&i.state!==5&&i.type===7&&i.owner===t?1:0}return n}function Ny(e,t){let n=ly[e.type],r=t.enemies.indexOf(e),i=fy(e,t.player),a=dy.x,o=dy.z;switch(e.state){case 1:wy(e,t,rg,ig,a,o,i),e.cooldown===0&&i<n.range&&My(t,r)<3&&xy(e,a,o);break;case 2:if(--e.timer<=0){for(let n=-1;n<=1&&!(My(t,r)>=3);n+=2){let i=e.x-I(o,N(.8))*n|0,s=e.z+I(a,N(.8))*n|0;if(uv(t.room,i,s,uy)||iv(t.room,i,s))continue;let c=uS(t,7,i,s);if(!c)break;c.timer=14,c.owner=r<<24>>24,c.elite=e.elite,_S(t,16,0,i,s),t.events|=Hg}Sy(e)}break;case 4:Cy(e)}}var Py=N(.70711),Fy=[[Tn,0],[-Tn,0],[0,Tn],[0,-Tn]],Iy=[[Py,Py],[-Py,Py],[Py,-Py],[-Py,-Py]];function Ly(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.kb_x=e.kb_z=0,e.state){case 1:e.cooldown>0&&e.cooldown--,e.cooldown===0&&r<n.range&&xy(e,i,a);break;case 2:if(--e.timer<=0){let r=e.pattern&1?Iy:Fy;for(let i=0;i<4;i++)ky(t,e,0,r[i][0],r[i][1],n.attack_speed);e.pattern=e.pattern+1&255,Sy(e)}break;case 4:Cy(e)}}var Ry=0,zy=1,By=3,Vy=4,Hy=40,Uy=8,Wy=N(1.2),Gy=[[N(1),0],[N(.70711),N(.70711)],[0,N(1)],[N(-.70711),N(.70711)],[N(-1),0],[N(-.70711),N(-.70711)],[0,N(-1)],[N(.70711),N(-.70711)]];function Ky(e,t,n,r){let i=N(.92388),a=N(.38268);for(let o=0;o<Uy;o++){let s=Gy[o][0],c=Gy[o][1];if(r){let e=I(s,i)-I(c,a)|0;c=I(s,a)+I(c,i)|0,s=e}ky(e,t,Oy(t),s,c,n)}}var qy=[[N(.86603),N(-.5)],[N(.96593),N(-.25882)],[N(1),0],[N(.96593),N(.25882)],[N(.86603),N(.5)]];function Jy(e,t,n,r,i){for(let a=0;a<5;a++){let o=qy[a][0],s=qy[a][1];ky(e,t,Oy(t),I(n,o)-I(r,s)|0,I(n,s)+I(r,o)|0,i)}}function Yy(e,t){let n=0;for(let r=0;r<12;r++){let i=e.enemies[r];n+=i.active&&i.state!==5&&i.owner===t?1:0}return n}function Xy(e,t,n,r,i,a){let o=e.enemies.indexOf(t);for(let s=-1,c=0;s<=1&&c<r&&!(Yy(e,o)>=Vy);s+=2){let r=t.x-I(a,N(1.2))*s|0,l=t.z+I(i,N(1.2))*s|0;if(uv(e.room,r,l,uy)||iv(e.room,r,l))continue;let u=uS(e,n,r,l);if(!u)break;u.timer=14,u.owner=o<<24>>24,_S(e,16,0,r,l),e.events|=Hg,c++}}function Zy(e,t){let n=ly[e.type],r=e.hp*2<=e.max_hp;fy(e,t.player);let i=dy.x,a=dy.z;switch(e.state){case 1:{let n=vy(e,t,i,a);if(py(e,t.room,n.x,n.z,e.speed),e.cooldown>0){e.cooldown--;break}hy(e,t);let o=r?e.pattern%3:Ry;o===Ry&&!my(e)&&(o=zy),e.attack_kind=o&255,e.pattern=e.pattern+1&255,xy(e,i,a);break}case 2:if(--e.timer>0)break;switch(e.attack_kind){case Ry:e.state=3,e.timer=n.attack,e.hit_done=!1,t.events|=Ug;break;case zy:Jy(t,e,i,a,N(.08)),Sy(e);break;default:Xy(t,e,0,2,i,a),Sy(e)}break;case 3:{let r=e.x,i=e.z;fv(t.room,e,I(e.aim_x,n.attack_speed),I(e.aim_z,n.attack_speed),uy*2),e.hit_done||by(e,t);let a=On(e.x-r|0)+On(e.z-i|0)<L(n.attack_speed,3);if(a||--e.timer<=0){if(Ky(t,e,N(.06),!1),a){let n=e.x+I(e.aim_x,N(.7))|0,r=e.z+I(e.aim_z,N(.7))|0;HS(t,n,r,N(.7),3),t.events|=Wg,_S(t,15,0,n,r),e.state=4,e.timer=Hy,e.stunned=!0}else Sy(e)}break}case 4:Cy(e)}}function Qy(e,t){let n=ly[e.type];fy(e,t.player);let r=dy.x,i=dy.z,a=L((e.max_hp-e.hp)*5,e.max_hp);for(;e.pattern<a&&e.pattern<4;)e.pattern=e.pattern+1&255,Xy(t,e,7,2,r,i);switch(e.state){case 1:{let n=vy(e,t,r,i);py(e,t.room,n.x,n.z,e.speed),e.cooldown>0?e.cooldown--:xy(e,r,i);break}case 2:--e.timer<=0&&(e.tx=t.player.x,e.tz=t.player.z,e.state=3,e.timer=n.attack,e.attack_kind=By,t.events|=Ug);break;case 3:if(e.timer>0){let n=L(e.tx-e.x,e.timer),r=L(e.tz-e.z,e.timer);fv(t.room,e,n,r,uy)}if(--e.timer<=0){Ky(t,e,N(.06),!1),e.hp*2<=e.max_hp&&Ky(t,e,N(.04),!0),t.events|=Wg,_S(t,15,0,e.x,e.z);let n=t.player,r=n.x-e.x|0,i=n.z-e.z|0,a=Wy+Bh;I(r,r)+I(i,i)<I(a,a)&&dS(t,n,e.damage,e.x,e.z,e.type),Sy(e)}break;case 4:Cy(e)}}function $y(e,t,n,r,i){pv(t,e,I(n,i),I(r,i),uy)}var eb=[0,3,5,3,0,-3,-5,-3];function tb(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.state){case 1:{let o=eb[L(e.anim,6)&7]*N(.12);$y(e,t.room,i-I(a,o)|0,a+I(i,o)|0,e.speed),e.cooldown>0?e.cooldown--:r<n.range&&xy(e,i,a);break}case 2:--e.timer<=0&&(e.state=3,e.timer=n.attack,e.hit_done=!1,t.events|=Ug);break;case 3:$y(e,t.room,e.aim_x,e.aim_z,n.attack_speed),e.hit_done||by(e,t),--e.timer<=0&&Sy(e);break;case 4:$y(e,t.room,-i,-a,e.speed),Cy(e)}}var nb=N(1.1);function rb(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.state){case 1:{let o=vy(e,t,i,a);py(e,t.room,o.x,o.z,e.speed),r<n.range&&xy(e,i,a);break}case 2:if(--e.timer<=0){e.state=3,e.timer=n.attack,t.events|=Wg,_S(t,15,0,e.x,e.z);let r=t.player,i=r.x-e.x|0,a=r.z-e.z|0,o=nb+Bh;I(i,i)+I(a,a)<I(o,o)&&dS(t,r,e.damage,e.x,e.z,e.type)}break;case 3:--e.timer<=0&&Sy(e);break;case 4:{let n=vy(e,t,i,a);py(e,t.room,n.x,n.z,L(e.speed,3)),--e.timer<=0&&(e.state=1,_S(t,13,0,e.x,e.z));break}}}var ib=[[N(1),0],[N(.93969),N(.34202)],[N(.76604),N(.64279)],[N(.5),N(.86603)],[N(.17365),N(.98481)],[N(-.17365),N(.98481)],[N(-.5),N(.86603)],[N(-.76604),N(.64279)],[N(-.93969),N(.34202)],[N(-1),0],[N(-.93969),N(-.34202)],[N(-.76604),N(-.64279)],[N(-.5),N(-.86603)],[N(-.17365),N(-.98481)],[N(.17365),N(-.98481)],[N(.5),N(-.86603)],[N(.76604),N(-.64279)],[N(.93969),N(-.34202)]];function ab(e,t){let n=ly[e.type],r=fy(e,t.player),i=dy.x,a=dy.z;switch(e.kb_x=e.kb_z=0,e.state){case 1:e.cooldown>0&&e.cooldown--,e.cooldown===0&&r<n.range&&xy(e,i,a);break;case 2:if(--e.timer<=0){for(let r=0;r<6;r++){let i=ib[(e.pattern+r*3)%18];ky(t,e,2,i[0],i[1],n.attack_speed)}e.pattern=e.pattern+1&255,Sy(e)}break;case 4:Cy(e)}}var ob=0,sb=1,cb=2,lb=N(2.4),ub=N(1.25),db=N(1.7);function fb(e,t){let n=ly[e.type],r=e.hp*2<=e.max_hp,i=fy(e,t.player),a=dy.x,o=dy.z;switch(e.state){case 1:{let n=vy(e,t,a,o);if(py(e,t.room,n.x,n.z,e.speed),e.cooldown>0){e.cooldown--;break}e.attack_kind=e.pattern%(r?4:3)&255,e.pattern=e.pattern+1&255,xy(e,a,o);break}case 2:if(--e.timer>0)break;switch(e.attack_kind){case ob:{let r=i<lb?i:lb;e.tx=e.x+I(a,r)|0,e.tz=e.z+I(o,r)|0,e.state=3,e.timer=n.attack,t.events|=Ug;break}case sb:Jy(t,e,a,o,N(.075)),Sy(e);break;case cb:{let n=t.player;yS(t,n.x,n.z,50,og,2,14);for(let r=0;r<3;r++){let i=ib[(e.pattern*5+r*6)%18];yS(t,n.x+I(i[0],db)|0,n.z+I(i[1],db)|0,50,og,2,14)}Sy(e);break}default:Xy(t,e,13,2,a,o),Sy(e)}break;case 3:if(e.timer>0){let n=L(e.tx-e.x,e.timer),r=L(e.tz-e.z,e.timer);fv(t.room,e,n,r,uy)}if(--e.timer<=0){Ky(t,e,N(.06),!1),r&&Ky(t,e,N(.045),!0),t.events|=Wg,_S(t,15,0,e.x,e.z),HS(t,e.x,e.z,ub,2);let n=t.player,i=n.x-e.x|0,a=n.z-e.z|0,o=ub+Bh;I(i,i)+I(a,a)<I(o,o)&&dS(t,n,e.damage,e.x,e.z,e.type),Sy(e)}break;case 4:Cy(e)}}var pb=0,mb=1,hb=2,gb=70,_b=40;function vb(e,t){let n=ly[e.type],r=e.hp*2<=e.max_hp,i=fy(e,t.player),a=dy.x,o=dy.z,s=L(e.hp*100,e.max_hp);switch(s<=gb&&uC(t,0),s<=_b&&t.flooded&1&&uC(t,1),e.state){case 1:if(wy(e,t,rg,ig,a,o,i),e.cooldown>0)break;e.attack_kind=e.pattern%(r?4:3)&255,e.pattern=e.pattern+1&255,xy(e,a,o);break;case 2:if(--e.timer>0)break;switch(e.attack_kind){case pb:for(let n=1;n<=3;n++){let r=e.x+I(e.aim_x,N(1.6)*n)|0,i=e.z+I(e.aim_z,N(1.6)*n)|0;for(let a=-2;a<=2;a++)yS(t,r-I(e.aim_z,N(1.4)*a)|0,i+I(e.aim_x,N(1.4)*a)|0,30+n*14,N(.8),2,18)}r&&Jy(t,e,a,o,n.attack_speed);break;case mb:Jy(t,e,a,o,n.attack_speed);break;case hb:{let n=t.player;yS(t,n.x,n.z,50,og,2,18);for(let r=0;r<6;r++){let i=ib[(e.pattern*4+r*3+2)%18];yS(t,n.x+I(i[0],N(1.5))|0,n.z+I(i[1],N(1.5))|0,60,N(.8),2,18)}break}default:Xy(t,e,15,2,a,o)}r&&Ky(t,e,N(.05),!!(e.pattern&1)),Sy(e);break;case 4:Cy(e)}}function yb(e,t){if(e.anim++,e.flash>0&&e.flash--,(e.kb_x||e.kb_z)&&(pv(t.room,e,e.kb_x,e.kb_z,uy),e.kb_x=I(e.kb_x,N(.7)),e.kb_z=I(e.kb_z,N(.7)),On(e.kb_x)<N(.005)&&On(e.kb_z)<N(.005)&&(e.kb_x=e.kb_z=0),e.state!==5&&!ug(e.type)&&iv(t.room,e.x,e.z)))BS(t,e);else{switch(e.state){case 0:--e.timer<=0&&(e.state=1);return;case 5:--e.timer<=0&&(e.active=!1);return}if(!(t.player.hp<=0))switch(e.sees=e.type===7||e.type===15||hv(t.room,e.x,e.z,t.player.x,t.player.z),e.type){case 0:Ty(e,t);break;case 2:Ey(e,t);break;case 7:Dy(e,t);break;case 4:jy(e,t);break;case 5:Ny(e,t);break;case 6:Ly(e,t);break;case 8:e.kb_x=e.kb_z=0;break;case 9:Zy(e,t);break;case 10:Qy(e,t);break;case 11:tb(e,t);break;case 12:rb(e,t);break;case 13:ab(e,t);break;case 14:fb(e,t);break;case 15:Dy(e,t);break;case 16:Ey(e,t);break;case 18:vb(e,t);break;default:Ay(e,t)}}}var bb=[[N(.70711),N(-.70711)],[N(1),0],[N(.70711),N(.70711)],[0,N(1)],[N(-.70711),N(.70711)],[N(-1),0],[N(-.70711),N(-.70711)],[0,N(-1)]];function xb(e){return e<0||e>=8?[0,0]:bb[e]}var Sb=[[5,6,7],[4,-1,0],[3,2,1]];function Cb(e,t){return Sb[t+1][e+1]}function wb(e,t){let n=e-t|0,r=I(e+t|0,N(.57358)),i=On(n),a=On(r),o=N(.41421);return i===0&&a===0?2:a<=I(i,o)?n>0?0:4:i<=I(a,o)?r>0?2:6:r>0?n>0?1:3:n>0?7:5}function Tb(e,t,n){e.x=e.safe_x=t,e.z=e.safe_z=n,e.facing=2,e.action=0,e.action_timer=0,e.dash_max=2,e.dash_charges=e.dash_max,e.dash_recharge=0,e.dash_recharge_time=50,e.dash_gap=0,e.iframes=0,e.max_hp=e.hp=6,e.attack_damage=1,e.kb_x=e.kb_z=0,e.anim_timer=0,e.dagger_max=3,e.dagger_recharge_time=90,e.dagger_pierce=1,e.dagger_damage=1,e.iframes_hurt=60,e.meter_max=10,e.attack_radius=Kh,e.blast_radius=Yh,e.blast_damage=2,e.daggers=e.dagger_max,e.dagger_recharge=e.dagger_recharge_time,e.meter=0}function Eb(e,t,n,r){let[i,a]=xb(n);pv(t,e,I(i,r),I(a,r),Bh)}function Db(e){e.dash_gap>0&&e.dash_gap--,e.dash_charges>=e.dash_max?e.dash_recharge=e.dash_recharge_time:--e.dash_recharge<=0&&(e.dash_charges++,e.dash_recharge=e.dash_recharge_time)}function Ob(e){e.daggers>=e.dagger_max?e.dagger_recharge=e.dagger_recharge_time:--e.dagger_recharge<=0&&(e.daggers++,e.dagger_recharge=e.dagger_recharge_time)}function kb(e){return e.action===0||e.action===1}function Ab(e,t,n){switch(Db(e),Ob(e),e.iframes>0&&e.iframes--,e.hurt_frames>0&&e.hurt_frames--,e.anim_timer++,(e.kb_x||e.kb_z)&&(fv(t,e,e.kb_x,e.kb_z,Bh),e.kb_x=I(e.kb_x,N(.75)),e.kb_z=I(e.kb_z,N(.75)),On(e.kb_x)<N(.005)&&On(e.kb_z)<N(.005)&&(e.kb_x=e.kb_z=0)),n.dash&&e.action!==2&&e.dash_charges>0&&e.dash_gap===0?(n.move!==-1&&(e.facing=n.move),e.action=2,e.action_timer=10,e.dash_charges--,e.dash_gap=14,e.iframes<14&&(e.iframes=14)):n.blast&&e.meter>=e.meter_max&&e.action!==5?(e.action=5,e.action_timer=18,e.meter=0,e.iframes<24&&(e.iframes=24)):n.attack&&kb(e)?(n.move!==-1&&(e.facing=n.move),e.action=3,e.action_timer=16):n.throw_dagger&&kb(e)&&e.daggers>0&&(n.move!==-1&&(e.facing=n.move),e.action=4,e.action_timer=12,e.daggers--),e.action){case 2:Eb(e,t,e.facing,Uh),--e.action_timer<=0&&(e.action=0);break;case 3:case 4:n.move!==-1&&Eb(e,t,e.facing,Hh),--e.action_timer<=0&&(e.action=0);break;case 5:--e.action_timer<=0&&(e.action=0);break;default:n.move===-1?e.action=0:(e.facing=n.move,e.action=1,Eb(e,t,n.move,Vh))}}function jb(e){return e.action===3&&e.action_timer===11}function Mb(e){return e.action===4&&e.action_timer===8}function Nb(e){return e.action===5&&e.action_timer===12}function Pb(e,t){e.meter+=t,e.meter>e.meter_max&&(e.meter=e.meter_max)}function Fb(e){let[t,n]=xb(e.facing);return[e.x+I(t,Gh)|0,e.z+I(n,Gh)|0]}function Ib(e,t,n,r){if(e.iframes>0||e.hp<=0)return!1;e.hp-=t,e.hp<0&&(e.hp=0),e.iframes=e.iframes_hurt,e.hurt_frames=60;let i=e.x-n|0,a=e.z-r|0,o=Mn(I(i,i)+I(a,a)|0);return o>N(.01)&&(e.kb_x=I(Dn(i,o),Wh),e.kb_z=I(Dn(a,o),Wh)),(e.action===3||e.action===4)&&(e.action=0),!0}var Lb=N(2.5),Rb=N(8.5),zb=N(9.5),Bb=N(8),Vb=2,Hb=9,Ub=N(1.2),Wb=N(4.5);function Gb(e,t,n){return qa(e>>>0,t>>>0,n>>>0)}function Kb(e,t,n,r){for(let i=n-r;i<=n+r;i++)for(let n=t-r;n<=t+r;n++)n>=0&&i>=0&&n<12&&i<12&&(e[i][n]=1)}function qb(e,t,n){let[r,i]=Y_(t,n);Kb(e,r,i,1);let[a,o]=J_(t);Kb(e,r+F(a)*2,i+F(o)*2,0)}function Jb(e,t,n){let[r,i]=Y_(t,n),[a,o]=J_(t);return Q_(e,r,i)&&Q_(e,r+F(a),i+F(o))}var Yb=64;function Xb(e){let t=0;for(let n=0;n<12;n++)for(let r=0;r<12;r++)t+=+!!Q_(e,r,n);return t}function Zb(e,t,n){if(!rv(e,t,n)||Xb(e)<Yb)return!1;for(let t=0;t<4;t++)if(t!==e.entry_side){for(let n=Vb;n<=Hb;n++)if(Jb(e,t,n))return!0}return!1}function Qb(e,t,n,r,i,a,o){for(let s=r;s<=a;s++)for(let r=n;r<=i;r++)r>=0&&s>=0&&r<12&&s<12&&!t[s][r]&&(e.cells[s][r]=o)}function $b(e,t,n,r,i){let a=n&1?12-r:0,o=n&2?12-i:0;Qb(e,t,a,o,a+r-1,o+i-1,5)}var ex=[[0,1],[2,3],[0,2],[1,3]];function tx(e,t,n,r){switch(r){case 1:{let r=U(t,1,2);for(let i=0;i<r;i++)$b(e,n,Wa(t,4),U(t,2,4),U(t,2,4));break}case 2:{let r=U(t,3,4);for(let t=0;t<4;t++)$b(e,n,t,r,r);break}case 3:{let r=Wa(t,4),i=U(t,3,4);$b(e,n,ex[r][0],i,i),$b(e,n,ex[r][1],i,i);break}case 4:{let r=U(t,2,4),i=U(t,3,9-r),a=U(t,3,9-r);Qb(e,n,i,a,i+r-1,a+r-1,6);break}case 5:{let r=Ga(t,50),i=U(t,4,7),a=U(t,1,2),o=U(t,2,8),s=Ga(t,50)?6:5;for(let t=0;t<12;t++)if(t!==o&&t!==o+1)for(let o=0;o<a;o++)r?Qb(e,n,t,i+o,t,i+o,s):Qb(e,n,i+o,t,i+o,t,s);break}case 7:{for(let r=0;r<4;r++){let i=U(t,0,2),[a,o]=J_(r);for(let s=0;s<12;s++){Ga(t,40)&&(i+=Ga(t,50)?1:-1),i=i<0?0:i>2?2:i;let[c,l]=Y_(r,s);for(let t=0;t<i;t++){let r=c+F(a)*t,i=l+F(o)*t;Qb(e,n,r,i,r,i,5)}}}let r=U(t,1,3);for(let i=0;i<r;i++){let r=U(t,3,8),i=U(t,3,8),a=+!!Ga(t,50);Qb(e,n,r,i,r+a,i+ +!a,1)}break}case 8:{let r=Ga(t,50),i=U(t,4,6),a=[U(t,1,5),U(t,6,10)],o=U(t,1,2);for(let s=0;s<12;s++){s>0&&Ga(t,35)&&(i+=Ga(t,50)?1:-1),i=i<3?3:i>7?7:i;let c=!1;for(let e=0;e<o;e++)c||=s===a[e];if(!c)for(let t=0;t<2;t++)r?Qb(e,n,s,i+t,s,i+t,6):Qb(e,n,i+t,s,i+t,s,6)}break}case 6:{let r=U(t,1,3);for(let i=0;i<r;i++){let r=U(t,1,2),i=U(t,1,2),a=U(t,2,10-r),o=U(t,2,10-i);Qb(e,n,a,o,a+r-1,o+i-1,6)}break}}}var nx=[];for(let e=0;e<12;e++)nx.push(new Uint8Array(12));function rx(e,t,n,r,i,a){if(r<=1||e.type===3)return;let o=f_[e.area].shapes,s=0;for(let e=0;e<9;e++)s+=o[e];let c=Wa(t,s),l=0;for(let e=0;e<9;e++){if(c<o[e]){l=e;break}c-=o[e]}for(let t=0;t<12;t++)nx[t].set(e.cells[t]);for(let r=0;r<4;r++){if(tx(e,t,n,l),Zb(e,i,a))return;for(let t=0;t<12;t++)e.cells[t].set(nx[t])}}function ix(e,t){let n=Wa(e,100);return l_(t+1)?3:t<2||n<62?0:n<82?2:1}function ax(e,t,n,r){let i=[];for(let t=0;t<4;t++)t!==e.entry_side&&i.push(t);let a=i.length;for(let e=a-1;e>0;e--){let n=Wa(t,e+1),r=i[e];i[e]=i[n],i[n]=r}let o=U(t,1,3);l_(n+1)&&(o=1),e.door_count=0;let s=[];for(let c=0;c<a&&e.door_count<o;c++){s.length=0;for(let t=Vb;t<=Hb;t++)Jb(e,i[c],t)&&s.push(t);if(s.length===0)continue;let a=e.doors[e.door_count++];a.side=i[c],a.pos=s[Wa(t,s.length)],a.leads_to=ix(t,n),qb(r,a.side,a.pos)}let c=!1;for(let t=0;t<e.door_count;t++)c||=e.doors[t].leads_to===0;!c&&!l_(n+1)&&(e.doors[Wa(t,e.door_count)].leads_to=0)}function ox(e,t,n,r,i){let a=U(t,0,6);for(let o=0;o<a;o++)for(let a=0;a<20;a++){let a=U(t,1,10),o=U(t,1,10);if(!(n[o][a]||e.cells[o][a]!==0)){if(e.cells[o][a]=Ga(t,50)?1:2,rv(e,r,i))break;e.cells[o][a]=0}}}var sx=2,cx=2;function lx(e,t){let n=0;for(let r=0;r<e.enemy_count;r++)n+=+(e.enemies[r].type===t);return n}var ux=Array(19).fill(0);function dx(e,t,n){let r=f_[n.area],i=ux,a=0;for(let e=0;e<19;e++)i[e]=L(t.weights[e]*r.pct[e],100)+r.native[e],(e===6&&lx(n,6)>=sx||e===5&&lx(n,5)>=cx)&&(i[e]=0),a+=i[e];if(a===0)return 0;let o=Wa(e,a);for(let e=0;e<19;e++){if(o<i[e])return e;o-=i[e]}return 0}function fx(e){let t=F(e.spawn_x),n=F(e.spawn_z),r=11-t,i=11-n;r=r<2?2:r>9?9:r,i=i<2?2:i>9?9:i,e.cells[i][r]=0;let a=e.enemies[e.enemy_count++];a.type=f_[e.area].boss,a.elite=0,a.x=P(r)+En|0,a.z=P(i)+En|0}function px(e,t,n,r){if(e.type===1)return;if(e.type===3){fx(e);return}let i=sy(n),a=i.enemy_count,o=f_[e.area].count_pct;o&&(a=L(a*o+50,100)),e.type===2&&(a=L(a+1,2));let s=I(Wb,Wb);for(let n=0;n<a&&e.enemy_count<12;n++)for(let n=0;n<30;n++){let n=U(t,0,11),a=U(t,0,11);if(e.cells[a][n]!==0||r[a][n]===2)continue;let o=P(n)+En|0,c=P(a)+En|0,l=o-e.spawn_x|0,u=c-e.spawn_z|0;if(I(l,l)+I(u,u)<s)continue;let d=e.enemies[e.enemy_count++];d.type=dx(t,i,e),d.elite=+!!Ga(t,i.elite_chance),d.x=o,d.z=c;break}}var mx=3,hx=2,gx=5,_x=3,vx=N(.22);function yx(e,t,n,r,i,a){if(e.decor_count>=24)return null;let o=e.decor[e.decor_count++];return o.kind=t&255,o.variant=n&255,o.wall=r,o.x=i,o.z=a,o}function bx(e,t,n){for(let r=0;r<e.door_count;r++)if(e.doors[r].side===t&&n>=e.doors[r].pos-1&&n<=e.doors[r].pos+1)return!0;return e.entry_side===t&&n>=e.entry_pos-1&&n<=e.entry_pos+1}var xx=[0,1];function Sx(e,t){let n=0;for(let r=0;r<2;r++){let i=xx[r],a=-3,o=U(t,1,3);for(let r=o;r<11;r++){let[o,s]=Y_(i,r);if(r-a<mx||bx(e,i,r)||!Q_(e,o,s)||!Ga(t,55))continue;let[c,l]=q_(i,r),u=f_[e.area],d=n<4&&!Ga(t,25),f=Ga(t,50);if(d)n++,yx(e,u.wall_light,0,i,c,l);else if(u.banners)f?yx(e,12,Wa(t,2),i,c,l):yx(e,1,0,i,c,l);else continue;a=r}if(Ga(t,40)){let n=Ga(t,50)?0:11,[r,a]=Y_(i,n);if(!bx(e,i,n)&&Q_(e,r,a)){let[t,r]=q_(i,n);yx(e,11,0,i,t,r)}}}}function Cx(e,t,n,r){let i=U(t,hx,gx);for(let a=0;a<i;a++)for(let i=0;i<12;i++){let i=Wa(t,4),[a,o]=Y_(i,U(t,0,11));if(n[o][a]||e.cells[o][a]!==0)continue;let[s,c]=J_(i),l=P(a)+En-I(s,vx)|0,u=P(o)+En-I(c,vx)|0,d=!1;for(let t=0;t<e.decor_count;t++){let n=e.decor[t];if(vg(n.kind))continue;let r=F(n.x),i=F(n.z);n.wall===0&&(r=0),n.wall===1&&(i=0),d||=r===a&&i===o}if(d)continue;let f=Wa(t,100);f<45?yx(e,3,0,-1,l,u):f<55?yx(e,7,0,-1,l,u):e.type!==1&&Ga(t,r)?yx(e,6,0,-1,l,u):yx(e,2,Wa(t,2),-1,l,u);break}}var wx=[8,9,10,4,5];function Tx(e,t){let n=f_[e.area].masonry?5:3,r=U(t,1,_x);for(let i=0;i<r;i++){let r=U(t,1,10),i=U(t,1,10);e.cells[i][r]===0&&yx(e,wx[Wa(t,n)],0,-1,P(r)+En|0,P(i)+En|0)}}var Ex=Ba();function Dx(e,t,n){let r=Ex;Va(r,qa(e.seed,57024,0)),Tx(e,r),Sx(e,r),Cx(e,r,t,sy(n).explosive_pct)}var Ox=4,kx=6;function Ax(e,t,n,r){if(n<1||r<1||n>10||r>10||t[r][n]||e.cells[r][n]!==0)return!1;for(let t=0;t<e.hazard_count;t++){let i=e.hazards[t],a=F(i.x),o=F(i.z);if(n>=a-1&&n<=a+1&&r>=o-1&&r<=o+1)return!1}for(let t=0;t<e.decor_count;t++){let i=e.decor[t];if(!vg(i.kind)&&i.wall===-1&&F(i.x)===n&&F(i.z)===r)return!1}return!0}function jx(e,t,n,r,i,a,o){let s=e.hazards[e.hazard_count++];s.kind=n&255,s.phase=Wa(t,256),s.x=P(r)+En|0,s.z=P(i)+En|0,s.x2=P(a)+En|0,s.z2=P(o)+En|0}function Mx(e,t,n){for(let r=0;r<20;r++){let r=Ga(t,50),i=U(t,Ox,kx),a=U(t,1,10),o=U(t,1,10),s=+!!r,c=+!r,l=!0;for(let t=0;t<i&&l;t++)l=Ax(e,n,a+s*t,o+c*t);if(l)return jx(e,t,2,a,o,a+s*(i-1),o+c*(i-1)),!0}return!1}var Nx=Ba();function Px(e,t,n){if(e.type===1||e.type===3)return;let r=sy(n),i=e.type===2?L(r.hazards,2):r.hazards;if(i===0||r.hazard_kinds===0)return;let a=Nx;Va(a,qa(e.seed,1186,0));for(let n=0;n<i&&e.hazard_count<4;n++){let n=f_[e.area].traps[Wa(a,r.hazard_kinds)];if(n===2)Mx(e,a,t);else for(let r=0;r<20;r++){let r=U(a,1,10),i=U(a,1,10);if(Ax(e,t,r,i)){jx(e,a,n,r,i,r,i);break}}}}var Fx=[`.....###....`,`......#.....`,`......#.....`,`......#.....`,`....###.....`,`....#.#.....`,`....###.....`,`......#.....`,`...#######..`,`......#.....`,`.....##.....`,`.....##.....`],Ix=[[13,4,N(.5),N(.6),!0],[13,1,N(1.5),N(.4),!0],[13,3,N(.5),N(1.7),!0],[13,0,N(11.5),N(.5),!0],[13,5,N(11.4),N(4.6),!0],[13,0,N(.5),N(10.5),!0],[18,0,N(1.5),N(4.4),!0],[19,0,N(10.5),N(2.5),!0],[21,0,N(4.15),N(5.5),!1],[21,0,N(6.85),N(5.5),!1],[17,0,N(5.5),N(3.9),!1],[20,0,N(7.7),N(1.4),!1],[14,0,N(11.5),N(9.6),!1],[14,0,N(2.4),N(11.5),!1],[15,0,N(9.6),N(11.4),!1],[16,0,N(3.4),N(9.4),!1],[16,0,N(8.8),N(6.6),!1],[17,0,N(2.6),N(2.4),!1],[15,0,N(1.3),N(7.4),!1],[21,1,N(2.8),N(4.6),!1]];function Lx(e){K_(e),e.seed=51771,e.type=1,e.hub=!0,e.entry_side=3,e.entry_pos=6,e.spawn_x=N(6.5),e.spawn_z=N(10.3);for(let t=0;t<12;t++)for(let n=0;n<12;n++)Fx[t][n]===`#`&&(e.dirt[t]|=1<<n);e.cells[5][5]=4,e.feature_x=e.feature_z=5,e.door_count=1,e.doors[0].side=1,e.doors[0].pos=6,e.doors[0].leads_to=0;for(let t=-1;t<=1;t+=2){let[n,r]=q_(1,6+t);yx(e,0,0,1,n,r)}for(let[t,n,r,i,a]of Ix)yx(e,t,n,-1,r,i),a&&(e.cells[F(i)][F(r)]=7);let t=e.enemies[0];t.type=8,t.elite=0,t.x=zb,t.z=Bb,e.enemy_count=1}var Rx=[];for(let e=0;e<12;e++)Rx.push(new Uint8Array(12));var zx=Ba();function Bx(e,t,n,r,i,a){let o=zx;t>>>=0,Va(o,t),K_(e),e.seed=t,e.type=r,e.area=c_(n)&255,e.entry_side=i,e.entry_pos=a<<24>>24;for(let e=0;e<12;e++)Rx[e].fill(0);let[s,c]=q_(i,a),[l,u]=J_(i);e.spawn_x=s+I(l,Ub)|0,e.spawn_z=c+I(u,Ub)|0;let d=F(e.spawn_x),f=F(e.spawn_z);Kb(Rx,d,f,2),qb(Rx,i,a),(r===1||r===2)&&(Kb(Rx,5,5,1),Rx[5][5]=2),rx(e,o,Rx,n,d,f),ax(e,o,n,Rx),ox(e,o,Rx,d,f),(r===2||r===1)&&(e.cells[5][5]=r===2?3:4,e.feature_x=5,e.feature_z=5),px(e,o,n,Rx),Dx(e,Rx,n),Px(e,Rx,n)}function Vx(e){let t=[];for(let n=0;n<12;n++){let n=[];for(let t=0;t<12;t++)n.push(e());t.push(n)}return t}function Hx(){let e=[];for(let t=0;t<12;t++)e.push(new Uint8Array(12));return e}function Ux(e,t){let n=[];for(let r=0;r<e;r++)n.push(t());return n}function Wx(){return{seed:0,depth:0,start_depth:0,kills:0,gold:0,rooms_cleared:0,chest_opened:!1,decor_broken:0,decor_hp:new Uint8Array(24),fuse:new Uint8Array(24),crate_hp:Hx(),crate_broken:Vx(()=>!1),pickups:Ux(16,$g),trap_hits:new Uint16Array(4),crust:new Uint8Array(4),flood_ring:0,flood_timer:0,flooded:0,flood_cells:Vx(()=>!1),path:Hx(),boons:new Uint8Array(13),boon_pending:!1,second_wind:!1,deep_pockets:!1,thorns:!1,thorns_due:!1,mending:!1,mend_fights:0,flames:Ux(10,o_),hurt_by:0,bosses:0,time:0,cheats:0,exit_door:0,reward_amount:0,room:xg(),player:Qh(),enemies:Ux(12,cg),shots:Ux(24,fg),daggers:Ux(6,mg),zones:Ux(12,pg),hits:Ux(12,()=>({kind:0,amount:0,x:0,z:0})),hit_count:0,status:0,frames:0,events:0,events2:0}}function Gx(e){Object.assign(e,Wx())}function Kx(e,t){for(let n of e)Object.assign(n,t())}var qx=N(.6),Jx=N(.24),Yx=N(.06),Xx=N(.42),Zx=N(.95);function Qx(e){Gx(e),e.seed=51771,e.depth=0,Tb(e.player,N(6.5),N(10.3)),Lx(e.room),aS(e)}function $x(e){if(!e.room.hub)return!1;let t=e.player.x-Lb|0,n=e.player.z-Rb|0;return I(t,t)+I(n,n)<I(s_,s_)}var eS=[0,0,0];function tS(e,t,n){let r=u_(n);Gx(e),e.seed=t>>>0,e.hurt_by=63,e.depth=e.start_depth=r,Tb(e.player,N(6),N(10.5)),Bx(e.room,Gb(e.seed,r,0),r,0,3,6),aS(e);for(let t=0;t<n*3;t++)qv(e,eS)>0&&Jv(e,eS[0]),e.rooms_cleared++;e.rooms_cleared=0}var nS=32;function rS(e,t){let n=e.player,r=e=>!!(t>>>e&1);r(0)&&(n.max_hp++,n.hp++),r(1)&&(n.dash_recharge_time=nS),r(2)&&n.attack_damage++,r(8)&&n.attack_damage++,r(5)&&(n.max_hp++,n.hp++),r(3)&&(n.dagger_max++,n.daggers++),r(6)&&(n.meter=n.meter_max),r(9)&&(n.dagger_recharge_time=L(n.dagger_recharge_time*75,100)),r(10)&&n.dagger_pierce++,r(11)&&n.dagger_damage++,r(12)&&(n.iframes_hurt=L(9e3,100)),e.second_wind=r(7),e.deep_pockets=r(4),e.thorns=r(13),e.mending=r(14)}var iS=[1,3,5,7];function aS(e){let t=e.room,n=e.player;lS(e),e.chest_opened=!1,e.decor_broken=0,e.fuse.fill(0);for(let t of e.crate_broken)t.fill(!1);e.trap_hits.fill(0),e.crust.fill(0);for(let t of e.flood_cells)t.fill(!1);e.flood_ring=-1,e.flooded=0,e.decor_hp.fill(2);for(let t of e.crate_hp)t.fill(3);n.x=n.safe_x=t.spawn_x,n.z=n.safe_z=t.spawn_z,n.kb_x=n.kb_z=0,_v(t,F(n.x),F(n.z),e.path),n.action=0,t.entry_side>=0&&(n.facing=iS[t.entry_side]);let r=sy(e.depth);for(let n=0;n<t.enemy_count;n++){let i=t.enemies[n],a=uS(e,i.type,i.x,i.z);if(!a)break;let o=L(a.max_hp*r.hp_pct+50,100);i.elite&&(a.elite=!0,o*=2,a.speed=L(a.speed*115,100)),a.hp=a.max_hp=o>0?o:1,a.damage+=r.damage_bonus}if(t.type===1&&!t.hub&&n.hp<n.max_hp){let t=2;n.hp+t>n.max_hp&&(t=n.max_hp-n.hp),n.hp+=t,e.reward_amount=t,e.events=(e.events|wg)>>>0}}function oS(e,t){let n={...e.room.doors[t]};e.depth++,Bx(e.room,Gb(e.seed,e.depth,t),e.depth,n.leads_to,Sg(n.side),n.pos),aS(e)}function sS(e,t){let[n,r]=q_(t.side,t.pos),i,a;return t.side===0||t.side===2?(a=On(e.x-n|0),i=On(e.z-r|0)):(a=On(e.z-r|0),i=On(e.x-n|0)),a<=Bh+Yx&&i<=Xx}function cS(e){let t=e.player,n=e.room;if(n.type===2&&!e.chest_opened&&n.feature_x>=0){let r=P(n.feature_x)+En,i=P(n.feature_z)+En,a=t.x-r|0,o=t.z-i|0;I(a,a)+I(o,o)<I(Zx,Zx)&&(e.chest_opened=!0,e.reward_amount=Yv(e,Kg(e.depth)),e.gold+=e.reward_amount,e.events=(e.events|Tg|Cg)>>>0)}if(e.status===1&&!e.boon_pending){for(let r=0;r<n.door_count;r++)if(sS(t,n.doors[r])){e.exit_door=r,e.events=(e.events|512)>>>0;break}}}function lS(e){Kx(e.enemies,cg),Kx(e.shots,fg),Kx(e.daggers,mg),Kx(e.zones,pg),Kx(e.flames,o_),e.boon_pending=!1,Kx(e.pickups,$g),e.hit_count=0,e.status=0,e.frames=0,e.events=0}function uS(e,t,n,r){for(let i=0;i<12;i++){let a=e.enemies[i];if(a.active)continue;let o=ly[t];return Object.assign(a,cg()),a.active=!0,a.type=t,a.state=0,a.timer=36,a.x=n,a.z=r,a.hp=a.max_hp=o.hp,a.damage=o.damage,a.speed=o.speed,a.cooldown=L(o.cooldown,2)+i*17%40,a.strafe=i&1?1:-1,a.owner=-1,a}return null}function dS(e,t,n,r,i,a){return Lt(e.cheats,0)||(Lt(e.cheats,12)&&(n*=2),!Ib(t,n,r,i))?!1:(e.events=(e.events|4)>>>0,e.hurt_by=a&255,e.thorns&&(e.thorns_due=!0),!0)}function fS(e,t,n,r,i,a,o){for(let s=0;s<24;s++){let c=e.shots[s];if(!c.active)return c.active=!0,c.kind=t&255,c.owner=63,c.x=n,c.z=r,c.vx=i,c.vz=a,c.life=240,c.damage=o,c}return null}function pS(e){return e.active&&e.state!==5}function mS(e){let t=0;for(let n=0;n<12;n++)t+=pS(e.enemies[n])&&e.enemies[n].type!==8?1:0;return t}function hS(e,t,n,r){let i=e-n|0,a=t-r|0;return I(i,i)+I(a,a)|0}function gS(e,t){return qa(e.room.seed,36977,t>>>0)%100<40}function _S(e,t,n,r,i){bS(e,t,n,r,i)}function vS(e,t,n){return yS(e,t,n,50,og,2,4)}function yS(e,t,n,r,i,a,o){for(let s=0;s<12;s++){let c=e.zones[s];if(!c.active)return c.active=!0,c.x=t,c.z=n,c.timer=r,c.radius=i,c.damage=a&255,c.owner=o&255,e.events=(e.events|Bg)>>>0,c}return null}function bS(e,t,n,r,i){if(e.hit_count>=12)return;let a=e.hits[e.hit_count++];a.kind=t&255,a.amount=(n>255?255:n)&255,a.x=r,a.z=i}function xS(e,t,n,r,i){for(let a=0;a<16;a++){let o=e.pickups[a];if(o.active)continue;let s=qa(e.room.seed,e.frames,a>>>0);return Object.assign(o,$g()),o.active=!0,o.kind=t&255,o.value=n&255,o.x=r,o.z=i,o.y=N(.2),o.vy=N(.07),o.vx=s%41*N(.001)-N(.02),o.vz=(s>>>8)%41*N(.001)-N(.02),o}return null}function SS(e){let t=e.player;for(let n=0;n<16;n++){let r=e.pickups[n];if(!r.active||(r.age<255&&r.age++,fv(e.room,r,r.vx,r.vz,N(.1)),r.y+=r.vy,r.vy-=N(.008),r.y<=0&&(r.y=0,r.vy=0,r.vx=r.vz=0),r.age<16||t.hp<=0)||r.kind===1&&t.hp>=t.max_hp)continue;let i=t.x-r.x|0,a=t.z-r.z|0,o=I(i,i)+I(a,a)|0;if(o<I(Xg,Xg))r.active=!1,r.kind===0?(e.gold+=r.value,e.reward_amount=r.value,e.events=(e.events|Fg)>>>0,bS(e,10,r.value,r.x,r.z)):(t.hp++,e.events=(e.events|Ig)>>>0,bS(e,11,1,r.x,r.z));else if(e.status===1||o<I(Zg,Zg)){let e=Mn(o);r.x=r.x+I(Dn(i,e),Qg)|0,r.z=r.z+I(Dn(a,e),Qg)|0}}}function CS(e,t,n){return qa(e.room.seed,t,n>>>0)%100}function wS(e,t){let n=e.room.decor[t];if(e.decor_broken=(e.decor_broken|1<<t)>>>0,n.kind===3)e.events=(e.events|Eg)>>>0,bS(e,2,0,n.x,n.z),gS(e,t)&&xS(e,0,Yv(e,2),n.x,n.z);else if(n.kind===2){e.events=(e.events|jg)>>>0,bS(e,5,0,n.x,n.z);let r=CS(e,47684,t);r<15?xS(e,1,1,n.x,n.z):r<45&&xS(e,0,Yv(e,1),n.x,n.z)}}function TS(e,t,n,r,i,a){let o=av(a),s=P(r)+o,c=P(r+1)-o,l=P(i)+o,u=P(i+1)-o;return hS(e,t,kn(e,s,c),kn(t,l,u))<I(n,n)}function ES(e,t,n,r){let i=P(t)+En,a=P(n)+En;e.crate_hp[n][t]>r?(e.crate_hp[n][t]=e.crate_hp[n][t]-r,bS(e,6,0,i,a)):(e.crate_hp[n][t]=0,e.room.cells[n][t]=0,e.crate_broken[n][t]=!0,e.events=(e.events|Mg)>>>0,bS(e,7,0,i,a))}function DS(e,t,n,r){let i=e.room,a=r+bg;for(let r=0;r<i.decor_count;r++){let o=i.decor[r];if(yg(o.kind)&&!(e.decor_broken&1<<r)&&hS(t,n,o.x,o.z)<I(a,a))return r}return-1}function OS(e,t,n,r,i,a){let o=e.room,s=r+bg;for(let r=0;r<o.decor_count;r++){let c=o.decor[r];if(!(!yg(c.kind)||e.decor_broken&1<<r)&&!(hS(t,n,c.x,c.z)>=I(s,s))){if(c.kind===6){let t=a?12:45;(e.fuse[r]===0||e.fuse[r]>t)&&(e.fuse[r]===0&&(e.events=(e.events|Ng)>>>0,bS(e,8,0,c.x,c.z)),e.fuse[r]=t)}else c.kind===2&&e.decor_hp[r]>i?(e.decor_hp[r]=e.decor_hp[r]-i,bS(e,6,0,c.x,c.z)):wS(e,r)}}let c=F(t-r),l=F(t+r),u=F(n-r),d=F(n+r);for(let a=u;a<=d;a++)for(let s=c;s<=l;s++)s<0||a<0||s>=12||a>=12||Z_(o,s,a)===2&&TS(t,n,r,s,a,2)&&ES(e,s,a,i)}function kS(e,t,n){return Lt(e.cheats,1)&&t.hp>n?t.hp:n}function AS(e,t){return Lt(e.cheats,1)?255:t}function jS(e,t,n,r,i,a){let o=e.player;return(t.type===2||t.type===9||t.type===16)&&t.stunned&&(n*=2),lg(t.type)&&(r=L(r,4),i=L(i,4)),t.type===8?(t.flash=6,e.events=(e.events|8)>>>0,a&&o.meter<o.meter_max&&(Pb(o,1),o.meter===o.meter_max&&(e.events=(e.events|Ag)>>>0)),bS(e,0,n,t.x,t.z),!1):(t.hp-=n,t.flash=6,dg(t.type)||(t.kb_x=r,t.kb_z=i),e.events=(e.events|8)>>>0,a&&o.meter<o.meter_max&&(Pb(o,1),o.meter===o.meter_max&&(e.events=(e.events|Ag)>>>0)),t.hp<=0?(t.state=5,t.timer=24,e.kills++,t.type===15&&yS(e,t.x,t.z,34,sg,1,15),e.events=(e.events|16)>>>0,bS(e,1,n,t.x,t.z),qa(e.seed,e.kills>>>0,e.frames)%100<10*e.boons[10]>>>0&&xS(e,1,1,t.x,t.z),!0):(bS(e,0,n,t.x,t.z),t.state===2&&t.type===0&&(t.state=4,t.timer=L(ly[t.type].recover,2)),!1))}function MS(e){return pS(e)&&e.state!==0&&(e.type!==10||e.state!==3)&&!NS(e)}function NS(e){return e.type===12&&(e.state===1||e.state===2)}function PS(e,t,n,r){let i=r+hg;for(let r=0;r<24;r++){let a=e.shots[r];a.active&&hS(t,n,a.x,a.z)<I(i,i)&&(a.active=!1,e.events=(e.events|256)>>>0,bS(e,4,0,a.x,a.z))}}function FS(e){let t=e.player;e.events=(e.events|1)>>>0;let[n,r]=Fb(t),[i,a]=xb(t.facing);OS(e,n,r,t.attack_radius,AS(e,t.attack_damage),!1);for(let o=0;o<12;o++){let s=e.enemies[o];if(!MS(s))continue;let c=t.attack_radius+ly[s.type].radius;hS(n,r,s.x,s.z)>=I(c,c)||jS(e,s,kS(e,s,t.attack_damage),I(i,Jx),I(a,Jx),!0)}PS(e,n,r,t.attack_radius)}function IS(e){let t=e.player;for(let n=0;n<6;n++){let r=e.daggers[n];if(r.active)continue;let[i,a]=xb(t.facing);Object.assign(r,mg()),r.active=!0,r.x=t.x+I(i,N(.3))|0,r.z=t.z+I(a,N(.3))|0,r.vx=I(i,qh),r.vz=I(a,qh),r.life=40,r.pierce=t.dagger_pierce,r.dir=t.facing,e.events=(e.events|Dg)>>>0;return}}function LS(e,t){for(let n=0;n<2&&t.active;n++){if(t.x=t.x+L(t.vx,2)|0,t.z=t.z+L(t.vz,2)|0,uv(e.room,t.x,t.z,N(.05))){t.active=!1;let n=F(t.x),r=F(t.z);n>=0&&r>=0&&n<12&&r<12&&Z_(e.room,n,r)===2&&ES(e,n,r,AS(e,e.player.dagger_damage)),e.events=(e.events|Og)>>>0,bS(e,3,0,t.x-L(t.vx,2)|0,t.z-L(t.vz,2)|0);return}for(let n=0;n<12&&t.active;n++){let r=e.enemies[n];if(!MS(r)||t.hit_mask&1<<n)continue;let i=Jh+ly[r.type].radius;hS(t.x,t.z,r.x,r.z)>=I(i,i)||(t.hit_mask=(t.hit_mask|1<<n)&65535,jS(e,r,kS(e,r,e.player.dagger_damage),L(t.vx,2),L(t.vz,2),!0),t.pierce--<=0&&(t.active=!1))}t.active&&(PS(e,t.x,t.z,Jh),DS(e,t.x,t.z,Jh)>=0&&(t.active=!1,OS(e,t.x,t.z,Jh,AS(e,e.player.dagger_damage),!1)))}t.active&&--t.life<=0&&(t.active=!1)}var RS=P(14);function zS(e){let t=e.player;e.events=(e.events|kg)>>>0;let n=Lt(e.cheats,9);for(let r=0;r<12;r++){let i=e.enemies[r];if(n?!pS(i):!MS(i))continue;let a=i.x-t.x|0,o=i.z-t.z|0,s=t.blast_radius+ly[i.type].radius,c=I(a,a)+I(o,o)|0;if(!n&&c>=I(s,s))continue;let l=Mn(c),u=l>N(.01)?I(Dn(a,l),Xh):0,d=l>N(.01)?I(Dn(o,l),Xh):Xh;jS(e,i,n&&i.hp>t.blast_damage?i.hp:kS(e,i,t.blast_damage),u,d,!1)}PS(e,t.x,t.z,n?RS:t.blast_radius),OS(e,t.x,t.z,t.blast_radius,AS(e,t.blast_damage),!1)}function BS(e,t){t.state=5,t.timer=1,t.active=!1,e.kills++,e.events=(e.events|16|zg)>>>0,bS(e,13,0,t.x,t.z)}function VS(e){let t=e.player;t.hp<=0||(iv(e.room,t.x,t.z)?t.action!==2&&(bS(e,13,0,t.x,t.z),e.events=(e.events|Rg)>>>0,e.hurt_by=f_[e.room.area].pit_cause,Lt(e.cheats,0)||--t.hp,t.hp<0&&(t.hp=0),t.x=t.safe_x,t.z=t.safe_z,t.kb_x=t.kb_z=0,t.action=0,t.iframes=t.iframes_hurt,t.hurt_frames=60):t.action!==2&&(t.safe_x=t.x,t.safe_z=t.z))}function HS(e,t,n,r,i){OS(e,t,n,r,i,!1)}function US(e){let t=e.player;for(let n=0;n<12;n++){let r=e.zones[n];if(!r.active||--r.timer>0)continue;r.active=!1,e.events=(e.events|Vg)>>>0,bS(e,14,+(r.radius<og),r.x,r.z);let i=r.radius+Bh;t.hp>0&&hS(r.x,r.z,t.x,t.z)<I(i,i)&&dS(e,t,r.damage,r.x,r.z,r.owner),OS(e,r.x,r.z,r.radius,r.damage,!1)}}function WS(e,t){let n=e.room.decor[t],r=n.x,i=n.z;e.decor_broken=(e.decor_broken|1<<t)>>>0,e.fuse[t]=0,e.events=(e.events|Pg)>>>0,bS(e,9,0,r,i);for(let t=0;t<12;t++){let n=e.enemies[t];if(!MS(n))continue;let a=n.x-r|0,o=n.z-i|0,s=Jg+ly[n.type].radius,c=I(a,a)+I(o,o)|0;if(c>=I(s,s))continue;let l=Mn(c);jS(e,n,3,l>N(.01)?I(Dn(a,l),Yg):0,l>N(.01)?I(Dn(o,l),Yg):0,!1)}let a=e.player,o=Jg+Bh;a.hp>0&&hS(r,i,a.x,a.z)<I(o,o)&&dS(e,a,1,r,i,33),PS(e,r,i,Jg),OS(e,r,i,Jg,3,!0)}function GS(e){for(let t=0;t<e.room.decor_count;t++)e.fuse[t]&&(e.fuse[t]--,e.fuse[t]===0&&WS(e,t))}function KS(e,t,n){let r=n??{t:0},i,a,o;switch(e.kind){case 0:i=150,a=90,o=110;break;case 1:i=180,a=120,o=140;break;case 4:return r.t=t|0,0;case 3:{let n=(t+e.phase>>>0)%210;return n>=196||n<150?(r.t=n,0):(r.t=n>=190?n-190:n-150,n>=190?2:1)}default:return r.t=t|0,2}let s=(t+e.phase>>>0)%i;return s>=o?(r.t=s-o,2):s>=a?(r.t=s-a,1):(r.t=s,0)}function qS(e,t){let n=On(e.x2-e.x|0)+On(e.z2-e.z|0)|0,r=F(Dn(2*n,e_));if(r<=0)return[e.x,e.z];let i=(t+e.phase*4>>>0)%r,a=Math.imul(i,e_);a>n&&(a=2*n-a);let o=Dn(a,n);return[e.x+I(e.x2-e.x|0,o)|0,e.z+I(e.z2-e.z|0,o)|0]}function JS(e,t){let n=e<t?e:t,r=11-(e>t?e:t);return n<r?n:r}function YS(e,t,n){for(let r=0;r<12;r++){let i=e.enemies[r];pS(i)&&!ug(i.type)&&!lg(i.type)&&F(i.x)===t&&F(i.z)===n&&BS(e,i)}}function XS(e,t){let n=e.room.hazards[t],r=F(n.x),i=F(n.z),a=e.player;e.crust[t]===0?a.hp>0&&a.action!==2&&hS(n.x,n.z,a.x,a.z)<I(a_,a_)&&(e.crust[t]=1,e.events=(e.events|Lg)>>>0,bS(e,12,4,n.x,n.z)):(e.crust[t]++,e.crust[t]===45?(e.room.cells[i][r]=6,YS(e,r,i),bS(e,13,0,n.x,n.z)):e.crust[t]>=195&&(e.room.cells[i][r]=0,e.crust[t]=0))}var ZS={t:0};function QS(e){let t=e.player;for(let n=0;n<e.room.hazard_count;n++){let r=e.room.hazards[n];if(r.kind===4){XS(e,n);continue}let i=KS(r,e.frames,ZS),a=ZS.t,o=r.x,s=r.z,c=t_;if(r.kind===2?([o,s]=qS(r,e.frames),c=r_):r.kind===1?c=n_:r.kind===3&&(c=i_),i!==2){e.trap_hits[n]=0;continue}a===0&&r.kind!==2&&(e.events=(e.events|Lg)>>>0,bS(e,12,r.kind,o,s));let l=c+Bh;t.hp>0&&hS(o,s,t.x,t.z)<I(l,l)&&dS(e,t,1,o,s,34+r.kind-0&255);for(let t=0;t<12;t++){let i=e.enemies[t];if(!MS(i))continue;let a=c+ly[i.type].radius,l=hS(o,s,i.x,i.z)<I(a,a),u=1<<t&65535;if(!l){r.kind===2&&(e.trap_hits[n]&=~u);continue}if(e.trap_hits[n]&u)continue;e.trap_hits[n]|=u;let d=i.x-o|0,f=i.z-s|0,p=Mn(I(d,d)+I(f,f)|0);jS(e,i,1,p>N(.01)?I(Dn(d,p),Jx):0,p>N(.01)?I(Dn(f,p),Jx):0,!1)}}}function $S(e,t){let n=e.player;if(t.move!==-1||!(t.attack||t.throw_dagger)||n.action!==0&&n.action!==1)return;let r=I(Zh,Zh),i=null;for(let t=0;t<12;t++){let a=e.enemies[t];if(!MS(a))continue;let o=hS(n.x,n.z,a.x,a.z);o<r&&(r=o,i=a)}i&&(n.facing=wb(i.x-n.x|0,i.z-n.z|0))}function eC(e){for(let t=0;t<6;t++)e.daggers[t].active&&LS(e,e.daggers[t])}function tC(e){let t=e.player;for(let n=0;n<24;n++){let r=e.shots[n];if(!r.active)continue;if(r.x=r.x+r.vx|0,r.z=r.z+r.vz|0,--r.life<=0||uv(e.room,r.x,r.z,L(hg,2))){r.active=!1;continue}let i=hg+Bh;t.hp>0&&hS(r.x,r.z,t.x,t.z)<I(i,i)&&dS(e,t,r.damage,r.x-r.vx|0,r.z-r.vz|0,r.owner)&&(r.active=!1)}}function nC(e){let t=I(qx,qx);for(let n=0;n<12;n++){let r=e.enemies[n];if(pS(r))for(let i=n+1;i<12;i++){let n=e.enemies[i];if(!pS(n))continue;let a=n.x-r.x|0,o=n.z-r.z|0;if(I(a,a)+I(o,o)>=t)continue;let s=N(a>=0?.02:-.02),c=N(o>=0?.02:-.02);dg(r.type)||fv(e.room,r,-s,-c,N(.25)),dg(n.type)||fv(e.room,n,s,c,N(.25))}}}function rC(e,t){Jv(e,t),e.boon_pending=!1,e.events2=(e.events2|2)>>>0}function iC(e,t,n){for(let r=0;r<10;r++){let i=e.flames[r];if(!i.active){i.active=!0,i.x=t,i.z=n,i.life=70,i.hit_mask=0;return}}}function aC(e){for(let t=0;t<10;t++){let n=e.flames[t];if(n.active){if(--n.life<=0)n.active=!1;else for(let t=0;t<12;t++){let r=e.enemies[t],i=1<<t&65535;if(!MS(r)||n.hit_mask&i)continue;let a=zv+ly[r.type].radius;hS(n.x,n.z,r.x,r.z)<I(a,a)&&(n.hit_mask=(n.hit_mask|i)&65535,jS(e,r,kS(e,r,1),0,0,!1))}}}}function oC(e,t){let n=e.player;e.events2=(e.events2|4)>>>0,bS(e,17,0,n.x,n.z);for(let r=0;r<12;r++){let i=e.enemies[r];if(!MS(i))continue;let a=i.x-n.x|0,o=i.z-n.z|0,s=Bv+ly[i.type].radius,c=I(a,a)+I(o,o)|0;if(c>=I(s,s))continue;let l=Mn(c),u=l>N(.01)?I(Dn(a,l),Vv):0,d=l>N(.01)?I(Dn(o,l),Vv):0;jS(e,i,kS(e,i,t),u,d,!1)}}function sC(e){let t=e.player;Lt(e.cheats,6)&&(t.meter=t.meter_max),Lt(e.cheats,7)&&(t.dash_charges=t.dash_max),Lt(e.cheats,8)&&(t.daggers=t.dagger_max)}var cC=[0,0,0];function lC(e,t){e.events=(e.events&wg)>>>0,e.events2=0,e.frames>0&&(e.events=0),e.frames=e.frames+1>>>0;let n=e.player;if(e.status===2)return;e.time=e.time+1>>>0,e.hit_count=0;let r=n.action;if($S(e,t),Ab(n,e.room,t),sC(e),n.action===2&&r!==2&&(e.events=(e.events|2)>>>0),e.boons[5]&&n.action===2&&e.frames%3==0&&iC(e,n.x,n.z),e.boons[6]&&r===2&&n.action!==2&&oC(e,1),jb(n)&&FS(e),Mb(n)&&IS(e),Nb(n)&&zS(e),VS(e),e.frames%8==1){let t=F(n.x),r=F(n.z);Q_(e.room,t,r)&&_v(e.room,t,r,e.path)}eC(e),GS(e),QS(e);for(let t=0;t<12;t++)e.enemies[t].active&&yb(e.enemies[t],e);if(tC(e),US(e),dC(e),aC(e),nC(e),SS(e),e.thorns_due&&(e.thorns_due=!1,n.hp>0&&oC(e,1)),n.hp<=0&&e.second_wind&&(e.second_wind=!1,n.hp=2<n.max_hp?2:n.max_hp,n.iframes=180,e.events2=(e.events2|16)>>>0),n.hp<=0)e.status=2,e.events=(e.events|128)>>>0;else if(e.status===0&&mS(e)===0){e.status=1,e.events=(e.events|64)>>>0,e.rooms_cleared++;for(let t=0;t<24;t++)e.shots[t].active=!1;for(let t=0;t<12;t++)e.zones[t].active=!1;let t=e.room.type===0||e.room.type===3;e.room.type===3&&(xS(e,1,1,n.x+N(.8)|0,n.z),e.events2=(e.events2|8)>>>0,e.bosses++,fC(e)),t&&e.room.enemy_count>0&&(e.reward_amount=Yv(e,e.room.type===3?qg(e.depth):Gg(e.depth)),e.gold+=e.reward_amount,e.events=(e.events|Cg)>>>0,e.mending&&++e.mend_fights>=4&&(e.mend_fights=0,n.hp<n.max_hp&&(n.hp++,e.events2=(e.events2|256)>>>0)),qv(e,cC)>0&&(e.boon_pending=!0,e.events2=(e.events2|1)>>>0))}n.hp>0&&cS(e)}function uC(e,t){return e.flood_ring>=0||e.flooded&1<<t?!1:(e.flood_ring=t,e.flood_timer=100,e.events2=(e.events2|32)>>>0,!0)}function dC(e){if(e.flooded||e.flood_ring>=0){let t=!1;for(let n=0;n<12;n++)t||=pS(e.enemies[n])&&lg(e.enemies[n].type);if(!t){fC(e);return}}if(e.flood_ring<0||--e.flood_timer>0)return;let t=e.flood_ring,n=e.room;for(let r=0;r<12;r++)for(let i=0;i<12;i++)JS(i,r)===t&&n.cells[r][i]===0&&(n.cells[r][i]=6,e.flood_cells[r][i]=!0,YS(e,i,r));let r=P(12)/2;for(let t=0;t<12;t++){let i=e.enemies[t];pS(i)&&lg(i.type)&&iv(n,i.x,i.z)&&(i.x=r,i.z=r)}let i=e.player;iv(n,i.safe_x,i.safe_z)&&(i.safe_x=r,i.safe_z=r+N(1.5)),e.flooded=(e.flooded|1<<t)&255,e.flood_ring=-1,e.events2=(e.events2|64)>>>0}function fC(e){if(e.flooded){for(let t=0;t<12;t++)for(let n=0;n<12;n++)e.flood_cells[t][n]&&(e.room.cells[t][n]=0,e.flood_cells[t][n]=!1);e.flooded=0,e.flood_ring=-1,e.events2=(e.events2|128)>>>0}}function pC(e){for(let t=0;t<12;t++){let n=e.enemies[t];pS(n)&&(n.state=5,n.timer=24,e.kills++)}}var mC=new URL(`spr_archer-elite-DfvL1550.png`,import.meta.url).href,hC=new URL(`spr_archer-BEv7VmQQ.png`,import.meta.url).href,gC=new URL(`spr_brute-elite-Dy3zT1mR.png`,import.meta.url).href,_C=new URL(`spr_brute-2IvSgDkD.png`,import.meta.url).href,vC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAGsElEQVR42u1dy5HcOAxVCBOG0/BxQ9ijj3v00dcNwSH4uGlsCA5jgugtlgs2jCVAkIBIUXqvijXdPaIAUXjgRwR0HEAa3t7eXhnHQH/gkQaws/zy+7dPx6v8tQodA/335sHt5GcYwGoDXCm//Pb1z+Nn+f7l98L/d1f970J+rR1nEHiZ/KgBrDbAqxC4lL//OF7/fv5Vt3wuv1k3cnf97+QAeFvxtvQ66AiBl8qPGvBqAq2WX8o/fx2vjx9+1OGl/Fb+VzvH+/v7q1f/Uidb/6JfS3+6hrs7gVLKNcu2aF17lMDL5GcYwGoDXEVgIiQRmWSVv/yzPI47APrNoz8df2b7afo/gfy8rWptcTaBl8mPGMBqA4zIL985ySz5RE5+Dk7KIqccU+QQgelGlv9JB8C/9+ivOYFI+xVdW/pbPckdniJw4vA256Mx6xqiBF4mP2oAfK5hGaCleNQA6TwtAmgOgMhnyS+faw6AemqqzwlN8onY/BqIyHIEYOnP62gOoKa/5gAi+t9tEZHaiI+8+H1oTYEyCDxdftQAavU1Ap1lgPziLfle/UcIwM9R68FrdTUHYBG45gBIfima/poBcAdIbVjTn86pDSXvsIjI7yN1CN5htCQv3bdeAkfkk5wuBxI1gFoPqhHoLAOUIwhNfqt+L4FrBkDH80IyawuAvHCyS/3LZ3m8bEOSI/WX/7emQJb+tSlQ1hTkCvsQpC2SvVA79JB3ZB4elS8dQG1KqTqAUQOQ9S0Caz1wVD5dcEu+x4B7CKzdQDkEtm68JLWmv0Z+zYny4u29+VC+kK0UPnTXplBZI7jVIwhpi9Rm3gW8Gnm9BM6QzzlEerjkRwxA1rcIZPXAEQPULrhG4JYXteT3PMftqV9zArxY5NfakMv3Pg/m94jq87b1GH7GFGLVUwjLDiPk9RA4Kl92YtwZeOUPGUAPAaweOGqAdMFRAkevf7Q+kVvT3yL/GfpzY/LMXbMc+KgDyd4NKNvR4wBkG/QSOCJf6iA7gm4H0GMAlgHyxQdPDxw1QDp2JgHObL+Z8nlbat/P0D86As2eQtTa0VuvyCLde4bwWfJJXqlPenj3EKQaQGQv86j8mhecSYAz9J8tP2sYnWU/sxxI6zp6HAB3OKOjllH5vL16NxGdYgBXebZ7AMDFHeAd5G8fMw5nAZxlN1vY1upwxtXXvrP+Oxsw8kFcoP1WhzNm3OSoA4vqvyv5kQ/iufkg0gkciYaKOqCMhAqj+u/sAJAP4tn5INIIwFc/R6KhogkRovWj4Zi7L14hH0QsnJzq80Jbua+aDyKVwLUQV280lNzxRmXEAUXisUejuXYmP3d6mgHPyAexSv4ogaXN03ZoXmgj04x8EKPt9/NEcjtjbzijTI7REw0lzyFLz2aYUQcWCcfc+SkCd5yaAc8g8Gz5tVgWTX4rHwTJq8WClOLJB+HR3woHH2m//zUGD+LoDWfkkW0j0VAUumo5Am/9EQc2Go658yIiv26rePJBWAZ4lvweAlhbkVsE1qJhibRkb7IH57/zjog7Dq/+3JHUdLD0b3aCGQSQ5+iNhuKEqcXAtwJiavW9C4KRcMxdFxHl/ZJBLDXD1qIxW6WVD2JEvrx3vU4kQmB5DnkeWU/WlaPbFoGtfBB8lKDp73IAUQL33DTvTaw5gZ76vfHYI+GYR1JGmNn7EGrRlDUD9uSDaBHYkw+iVz53Ii35Vv0RAte4Y9mdJx+ERWArH4QMBa5ds8sBaN7QS4Cs+uTRepxArb4so3vKvfpHRlArRhBa+GjNgD35ICwD9OaD6JXPcy60CODJB+ElcE8H5MkH0dK/ZftR/Q/+vDESj5xZnzsBjwPg9csNl8Eg3r0Eo+GYkSnEqqcQ2fkgNAOclQ/CIsCV80G09PesgUX0DxPgjPrkBKwhUKb8IxiOGR1BRNcgMh4HIh/E/HwQWQ4oIj9MgDPre9cBMuQfgSiqrIQOkYQSkX0QyAfx7HwQYQLcpX7WsDraE88cgRzIB4F8EACwyvE9QZ9L37iMYwAA2JD8eD88ADzYAeD98ACAuduj3w8PAI8lf0o4IQAAe48AQuGEAADsSf6McEyPHLQ2AFyU/KPhmFhEBICNHUA0HPPAIiIA7O0ARsMxM9YQsA8BABY7gYz3w0czumAEAQCLHUH0/fDRKQSeQgDABRzAqvfDjzoQAAASpwPa9+wRxHHB98MDALDYgax+PzwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATMN/Y6OtUjDe2M4AAAAASUVORK5CYII=`,yC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAGsUlEQVR42u1du5HcMAxVeKHDDS90Gw4duhy3cCU4dAluwSVdAeuhZ3ADwwQIEpAoSu/NcG53TxQgCg/8iIC2DUjD4/F4ZhwD/YFbGsDK8svvPx6fnuWvVegY6L82Dy4nP8MAZhvgTPnlt7eX7aP8/vb1n8L/d1X9r0J+rR2PIPA0+VEDmG2AZyFwKd9fH89fnx8fdcvn8pt1I1fX/0oOgLcVb0uvg44QeKr8qAHPJtBs+aX8fP30/PKy/a3DS/mt/K92jvf392ev/qVOtv5Fv5b+dA1XdwKllGuWbdG69iiBp8nPMIDZBjiLwERIIjLJKn/5Z3kcdwD0m0d/On7P9tP0vwP5eVvV2mJvAk+THzGA2QYYkV++c5JZ8omc/ByclEVOOabIIQLTjSz/kw6Af+/RX3MCkfYrurb0t3qSKzxF4MThbc5HY9Y1RAk8TX7UAPhcwzJAS/GoAdJ5WgTQHACRz5JfPtccAPXUVJ8TmuQTsfk1EJHlCMDSn9fRHEBNf80BRPS/2iIitREfefH70JoCZRD4cPlRA6jV1wi0lwHyi7fke/UfIQA/R60Hr9XVHIBF4JoDIPmlaPprBsAdILVhTX86pzaUvMIiIr+P1CF4h9GSvHTfegkckU9yuhxI1ABqPahGoL0MUI4gNPmt+r0ErhkAHc8LyawtAPLCyS71L5/l8bINSY7UX/7fmgJZ+temQFlTkDPsQ5C2SPZC7dBD3pF5eFS+dAC1KaXqAEYNQNa3CKz1wFH5dMEt+R4D7iGwdgPlENi68ZLUmv4a+TUnyou39+ZD+UK2UvjQXZtCZY3gZo8gpC1Sm3kX8Grk9RI4Qz7nEOnhkh8xAFnfIpDVA0cMULvgGoFbXtSS3/Mct6d+zQnwYpFfa0Mu3/s8mN8jqs/b1mP4GVOIWU8hLDuMkNdD4Kh82YlxZ+CVP2QAPQSweuCoAdIFRwkcvf7R+kRuTX+L/Hvoz43JM3fNcuCjDiR7N6BsR48DkG3QS+CIfKmD7Ai6HUCPAVgGyBcfPD1w1ADp2CMJsGf7HSmft6X2fQ/9oyPQ7ClErR299Yos0r1nCJ8ln+SV+qSHdw9BqgFE9jKPyq95wSMJsIf+R8vPGkZn2c9RDqR1HT0OgDuc0VHLqHzeXr2biHYxgLM8290A4OQO8Aryl48Zh7MA9rKbJWxrdjjj7GtfWf+VDRj5IE7QfrPDGTNuctSBRfVflfzIB3HffBDpBI5EQ0UdUEZChVH9V3YAyAdx73wQaQTgq58j0VDRhAjR+tFwzNUXr5APIhZOTvV5oa3cZ80HkUrgWoirNxpK7nijMuKAIvHYo9FcK5OfOz3NgI/IBzFL/iiBpc3TdmhevjDi7p0PYrT9Pk4ktzP2hjPK5Bg90VDyHLL0bIYZdWCRcMyVnyJwx6kZ8BEEPlp+LZZFk9/KB0HyarEgpXjyQXj0t8LBR9rvv8bgQRy94Yw8sm0kGopCVy1H4K0/4sBGwzFXXkTk120VTz4IywD3kt9DAGsrcovAWjQskZbsTfbg/HfeEXHH4dWfO5KaDpb+zU4wgwDyHL3RUJwwtRj4VkBMrb53QTASjrnqIqK8XzKIpWbYWjRmq7TyQYzIl/eu14lECCzPIc8j68m6cnTbIrCVD4KPEjT9XQ4gSuCem+a9iTUn0FO/Nx57JBxzS8oIc/Q+hFo0Zc2APfkgWgT25IPolc+dSEu+VX+EwDXuWHbnyQdhEdjKByFDgWvX7HIAmjf0EiCrPnm0HidQqy/L6J5yr/6REdSMEYQWPlozYE8+CMsAvfkgeuXznAstAnjyQXgJ3NMBefJBtPRv2X5U/40/b4zEI2fW507A4wB4/XLDZTCIdy/BaDhmZAox6ylEdj4IzQCPygdhEeDM+SBa+nvWwCL6hwmwR/03RgTvNCAifwuGY0ZHENE1iIzHgcgHcXw+iCwHFJEfJsCe9b3rABnyt0AUVVZCh0hCicg+COSDuHc+iDABrlI/a1gd7YmPHIFsyAeBfBAAMMvx3UGfU9+4jGMAAFiQ/Hg/PADc2AHg/fAAgLnbrd8PDwC3JX9KOCEAAGuPAELhhAAArEn+jHBMjxy0NgCclPyj4ZhYRASAhR1ANBxzwyIiAKztAEbDMTPWELAPAQAmO4GM98NHM7pgBAEAkx1B9P3w0SkEnkIAwAkcwKz3w486EAAAEqcD2vfsEcR2wvfDAwAw2YHMfj88AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAByGPxDMftH9mOoOAAAAAElFTkSuQmCC`,bC=new URL(`spr_caster-elite-ClOK1m1V.png`,import.meta.url).href,xC=new URL(`spr_caster-DGXQSq-b.png`,import.meta.url).href,SC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAADIUlEQVR42u2azXHbMBCFVYKOLiEl6JqjSvARJeioNlhCjm4jZeSYMnxQBjQXXjzsAgtCVGxqdwZjm8YjAbwPC/DncJDiMt3EYg3UvV4/yho9aXv0VH9t+586lsE6/v5zO7+/zyX+fpjebCZE/fQ2a5KOyoieYLCYz66X9eEbQhDb/rir0eBdpmzgMjNqJgjgJJ1lJi7Xlcync7b0GXALSA+HYDSDMvMfBwCfOZh+cWAlCJZ6mVGQiqsmAHSo50Zq+gI4aH/6/5YQjGZQAGDWVuJ4fLnF0tvMXMfNx8HT1lPeGZY5xLUb4aC6AjyF+QBBZrDFfA3iLSAYzKA425OmVuf4cns9XbogKDVLw7PBP4e8SCZp2WONnkNW0YuzWIJH0W8GwGgGbcx6yiiSmdPlVwFB7fdYN2o+j4fr58BKg8cGMc3ikGeAjPCKPl0nKBmkoU+gcn1g7TLoLXsZMfNZzF+TQcHoYubz5UsBACGIP08/znPhx8j81QAkEsGAHr0KgAEgDQCCs6mn2agBgMuJZe8wmkGlAABaKR0hiMb//XmaC0Egm89m0GoDRwEI9gySQFmZQRIk4WrbSFr2Dh0ZCPtPumx/JBm+HC/qCwDEQrOfCh2vArCmAx8LVzADkGZK/Bv0JgDIEK4P9gwiLmGsHWIaZ7v67LrQ/uzup9L2ov+DGQD3Ai0Ayg3jaAc69YWBHKCWngrorZvQlpFFysesoOm0p5/aRlABoHcPIN3a8WWAp3/9lnG0A8vAic8AOvQFBMJtYDr/Sn3VSOlcBHxNgxBKzyE0+AfvAlow2J8TjHYAswDoszVO0ZsfBFlnr/AgqGkknUsqxjHk9/7ZpDCYj8sAwrDtk8HBDmSZhJ0nM7ahL64H57HMQukcltl37zEsgO68du+s/xodgExiSrsSRCN6DgG/c9ja/NEM8l/fBdyzA99d/5RvAj08PDw8PDw8PDy098keTwQAvk/2eDLz8X2yj8xOzcaivU6U6voI7gAA+kiAf1QgAYD1HIAdAsBnOt8D4CdFDsAOIZC+LG1/Ueqxq73Avep5eHh4eHh4fOn4BycGZPU4e2crAAAAAElFTkSuQmCC`,CC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAOLklEQVR42u2dMZLjuA6GFU444YQv7HDDSXWEPYav8o6wR+gjbLpHeOEcRq/kGmopipTcJn6QtL+vSlXT7mkIggCIku0f0wQAAAAAAAAAAADgwFLY8H9Q///z8bG8UHzePn+UDi4ftx/LX/987Lb1Nct94H+xQM39X23/+vVr+b2P0c/vK+RPtw4uP+Zvd3v/+/XHYR/r7yz2gf/lAlX4r7bvXECj50+XDm5ddLXx51/Twfb6WmT/6f3g/3WBWvuvtu9YQKPnT/2SR+Tg/e+/sn3VPv4/VqAK/9X21/+72leeX6/8WY8jbMF2/NqT8alvAOIE35ZWIQjrzyEA4QSvv3tyqYX/XyhQY/+Xv//7x7ap4hMXh6LBeOVPiE3aAMJrLZ8FKBN812lL9iuXPvj/QIGK/I+Lwtx+uDqKz6+8wQc76dU+fi2JZZun/6IEv9v/jJZZ8ba+9mlgH//Pr3Ai/7fiUNiPi+OR+NQ0AYH93aohF5s4Run/d28AwgS//33Yvn98223x72r3UfL/VpkcYv/vvt0cClTl/ySKT9QApukkPvM03bfKh4HW9i9jn8YorETcnwMIE3zX1W7Jvj5/v1bZ/Xa2Uv9vdcnh4n9IspL/FgVa8t/wymNuP10if/4+l+stzfpcY91mm/fsN3+N7S9X8b81/mCQOsF390+3wjbVdb/DMeTs115Bhf5PcYLkbFsWqMB3mf24AaxbyM+1QMNr4UNItXVwi/xM7SefdjSNz63xpwFdCjRsc8a2QQc/PYbZ6P5c6P+2n1lcoA/4P/VkP20AZ5tBkd5XYmus4xWApf1Zk582DwA9Evznx7f7FmwlP5scQ3wss22Alf5PBZ8tl4Zy/xX2PRtAzv/QCCrtH2yLzkHfCfLn/P2+BfvJz+rj6d1/72SQx9/KvkPxq+NTsqU+B2/NaMElGZ5oAkQGAAAAAAAAAAAAAAAAAAAAAAAgAV33144P/icw1yA6+N51yxsnOHMN2hYocw2UhdO7bnnjBGeuQQP/X3WuQU/fa/DWLVd1QOUJ/Pfbf4/FB/8FBarwX23/Kj49NAEPWeRDB4yDYHCFUyf4ZUws1IDw/7xAFf6r7T8Sny6aQDjAsMUnLw5CjRpQ6IC5rXKFoU7w6RHp6Brb+H9doAL/d7LpLePTRROIt/jgLeS6ktXDwb7BCkN5Anf7ENnH/4sCFfm/y7uW8WneAJSy4MIVhleCT+mzkpyue8cFOqr/m4+zxv8t9+bG8WnZAFx0+x8ZjNBxgp/G6GagST+4/6r47wr0zP/bVC9YK7C/21dO87H1LYCH7v0uOdLgGjxhVSf4brpOLj6zsf1SE+7U/8v4f/+on647Tef+Wzyk9rIfbAX14eYNQC0LHgczF+DOE/wyRlay5iX/b5WDR8T+n54DQ+nr0/y0mP+oth+u/qudID/e1QNAgSz45dAOi8k66gJNp7uEzUjFt2jfKAHV/l+eA0tJ+RP/q86xp/1gRzR/oD7IhrLgu8Q4k9W2GDwyJUmn1r0XqPieDY2ovkoL/dc3mCR3wvEYHYO3/Sm1bziByC4IVgdfsJcNumGBquPj1YhH8F9dQK3Oyej2YUBeKSlIcAAAAAAAAAAAAAAAAAAAAAAAgFdDLYvMXIPXjg/+D+ygWneduQbt44P/A+fnyLr0zDVoHx/8P7G9ftOv5/wcWZfeQ/defnVQN8ic6GsmPvgv8D+dPyDw32bZo9alj1VPcrronereu9y+qBP8LE6Wsxnw/7wBiPyvSz6vAgpFnjaASDm2avlWUh62mmmQuzoYrQTkCR6SOI5TrFDbe4GO7H9uvoGx/zb3n8rBCKn8cW5VYCELfjHboKox5lZHlY3RK8F38VEUEP4/fgvQYwOYPAYvnMlGz0b36Nay1HFCGDYX7wTfknzdgiilQvce/4924wEnQv/rE7CkW26hqHsl212rd6eUBU+bisHtRYsEn1Lp90rJbvx/4kJY8v/7RwfvBJR0yyvECk813T+NBi5cyYJbDO4ICRGSJN4MVwLKBD/YNxp4McUJPKj/l/GvPI4tfz4L/nfRAM50yw1US09lwWsbgFj3fioNTomTxeJKoU7wnFS7qgF82gzU8PA/eyExLNBT6f0ePhHooVt+OPCwz59GwVXr3p+tMqwagDDBd/ZDw5wn2+IUDNRw8z9+t0tQoNmL09zJx4HVuuXFIQuW2vRK3fvSKiMjfb10muCHhvlTsDwXrb5c/M9dSKymGoUcifMk5GvPqsnKwQi9+nqVHId9Ge9XleBnyTgNlOAy/0sXEI/BIHxpbSziEwfjJ3jWf0GjAQAAAAAAAAAAAAAAAAAAAAAA0IOuftv4EP/Xjk+//ge9Mi/d9VgKLJIE6znAzDV47fhPbzsXINYs89ZdN2wCzDVoXPzMBRj0/Drolp8GwKAJDK9LL7YvL36PBhnrMoY4jTLXQOy/XQNopbte2QTcdeljX63iI5TVdmkAygKNxTpUsuMD+2/XAFrprls0AE9d+nTGgUKWOhYh7XiqkVuBBqm63HkYocEI/a87ebFscSvd9doG4K1Ln045UshSx1eiGsm0WO1WdN/pkeCHfVg2gMH9rz+BsQRyC911i+cAal36WK5LER+BLPVW9HFTSRvMCAU6ReKcYR9hM1LU3dkc0H+bJZxYt3yXJOu/g/Co0bsBRfuVisZTThhULXttYH/3YCttAGFmQqJ9t3SW4NvgmFiENRVm7bhAPfyvT7ycfr9At3w7+Hj2gOFnAk7t1wqbpkNO1Lr0Bvazo8zCcaRDWZ7U71Mn+Gb/VrBfKT2+yeF/iuyL/bdtBGLd8u2gw4rDWnpcaL8oP96xbv9pA4gTcFv2VjQAVYHmYh7HvmJ47XaVP/O/cjiu0n/b4hfrlpfsbvZrr9Bi+7urRbyf2zT1qntfbABr0eYK9JkG4JTgu9kVBdnxpx4ef2GoTG/+Gz4E1Mo6j25/tw+RdPShoGplwcP9bHr/nyZ88qzBZPaDooBK59doqEx2BayQMzf0374BiGSdR7c/OUpHm9qMh6TGo9o9ckqc4CrJ7rTJe9YcgMvDXqAwAQAAAAAAAAAAAAAAAAAAAAAAnsNVVz+InBL2NvHnk4fjxcdVFz1oECp09VOlY2V8mGvgYv/l8r+3+LjqoscFqpB1NrZ/GR/mGrjq3iuK5n3nArTQRVc0ALX9q/j0PNfAQ1ffSff+8LXajgt08y/EJ7WdxKdZI3DXRU+lyHu3/0h8alWNW+jSW05lUspqp1/zDl/XrfzmnrpAi1L1pa1ZA/DWRc/co5vaT6XOPXTjaxpAa1362gZQsm+Q2JtacqraExpBxXf3PQr0IDJa2poqAnnrohsX6FSSpU6uqtL41K4ARPHfiqck2230EDNr32Bpe7cbBExzYqO1uokOBbqc7aeXdwOUuuhbEOZoM172LKnCq+HYpYNsdIiXVQN4xH5NAc0F2WsjVVq17v22Cghb5vxW32IIC/Tub9wgY+n6z14agHrwQiq7bDwXbWc/bjQWy/9bRjI9/fnJBvCQ/QpB04Pku7XqrVoWPH46H98WZZbmS4cFeohFaWt6C7AWuXhwwU522bBAs/YNRR0PstdXDUBh30IyPSd7bfCet1IW/DDwNVZOzjycWzor0IPE+2cmb6YOZgPcg5k7gYaOXckuT0L7JqujM/9rB5pc2beQNL9pYiTX7c+9PZdZ/lc9BBQVaFaFucfZAFkHBY4pZZexf2I3p0nvsY9a3f7ch3Pit+d+354+7bNDgS7x86nbA/Mrmt0GPHACTfejkovGfibR8x+esdyXue79Wtzp+/PpcJPKBuBZoGk8+pwL8HM/IMIjGWXHgv2m+zKxHR5K5z4bYVD8ngV6aJA9yY+jhQ7dEg83SQadAAAAAAAAAAAAAAAAAAAAAAC8H/HXlQ2FQAAeZnTd+Ka6+s9+G7BU+AM2AeYaDBxgD130pv7Xfl33zH6iofhU8TPXoHl+9l38g+uiN/X/2QJV2k+Ln7kGTfOz7+IfXBd9VP+l9uPif3SuwZvlj7duf/r37TUABtdFH97/0eND/L+wrw6/Djy6Lnp3/j9xC/Al+5GM+rsUkFq220u3v1s9gNF10bvxP5lzYG7/DQtoO+acYm+s3FsRn8lJt/8uLpJqGnSjCDS4Lnpz/yuXiJf2a6W71fER2D9IfpfiM9Ur60plwdPbpFTWrIe3HE8DcJuq9PvVuuibrr6ywVz5XlugD8Zm6bUBC+xv0l+P5s+T50AqC54bk5bTN2w5IejywOfp6QGVHrroh8EUosELp/5PevvVz3lEsVHaX1LZ8Qfiv3SUn9nhJbkZBy3nAhyCYKjd76WLfuq7UXBVuvpq+9s5mIUNRmhfGR91fi7p7VHucxIG8w3qG0ApCLPh4Ai17PKsnW1w5X/1eRDaXwa3r4yPR352/0GjwzJKMbpLLbuc8dmys8r9x/7jtj32YWU7N9/AeMCJpikMpovuPWiB+QN+9ku2lPswjU9u6G4yfLc7RpsVwGwD6BrmGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOhYLjYAeMPCpxEAUPw0AQCKnyYAQAMgfADcAgDAmzUBAHjDRrDj/153kLGL94LkAAAAAElFTkSuQmCC`,wC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAOa0lEQVR42u2dMZLjthKGGb5www0dTqjQ6YQOJ3ToI7zQ1/ARfJUXviM43IPIRa1AgSBAaoj+G8Do+6pYtaPZaTab3U2Qkv6eJgAAAAAAAAAAAAAHroUN/wf1/+1yuX6h+Lx8/igdvF7++8v17/9fVtv8muU+8L9YoOb+z7Z//Phxve9j9PP7FfKnWwevv/z27Wbvnx+/bvYx/85iH/hfLlCF/2r7zgU0ev506eDSRWcbv//9n43t+bXI/un94P9xgVr7r7bvWECj50/9kkfk4O3vP7N91j7+P1egCv/V9uf/O9tXnl+v/JmPI2zBdvzayfjUNwBxgi9LqxCE+ecQgHCC59+dXGrh/ycK1Nj/6//++nXZVPGJi0PRYLzyJ8QmbQDhtZbPApQJvuq0JfuVSx/8f6JARf7HRWFuP1wdxedX3uCDnfRqH7+WxLLN039Rgv+0/+cfyzIr3m7Lqz//qLeP/7tXOJH/j+IQ2I+L45n41DQBgf3VqiEXm1WMkv/v3wB0Cf7z7+/b98u31Rb/rnYfRf8/3uuSQ+v/T98+3uUFqvI/jpGl/agBTKUiusXn8nbbKh8GWts/jH0ao7AS8X8QqEvwdVf7eF/bm7f5tbrut7K18X+2fz45XPxfkqzkv0WBlvy3u/KY20+XyDd7l7fbLc38XOP2+YM5bvVP0B/+2tq/Hsb/nj/N3gUQJ/j6/mm2ldui+zCTIs3Yr76C6vyfVgmSsW1aoPa+y+zHDeDWBO75ORdoeC18CKn6InhfJc5+pvaTTzvaxueRn01wKdBlu1/lVlt9B98/hof96rdKRf4/9pOzb1mgx/5PPdlPG8DeZlCkt5XYHOt4BWBp/yA+zXBL8PfLt9sWbCU/2xxDfCxhM/qkmND/qeCz5dJQ7r/CvmcDyPkfGkGl/Y1t0TnoO0F+/+37bQv2k5/Vx9O7/97JII+/lX2H4lfHp2RLfQ5emtGCSzKcaAJEBgAAAAAAAAAAAAAAAAAAAAAAIAFd968dH/xPYK5BdPC965Y3TnDmGrQtUOYaKAund93yxgnOXIMG/n/VuQY9fa/BW7dc1QGVJ/Dx7b/n4oP/ggJV+K+2fxSfHpqAhyzypgPGQTC4wqkT/DAmJmpA+L9boAr/1fafiU8XTSAcYNjikxcHoUYNKHTA3Fa5wlAn+PSMdHSNbfw/LlCB/yvZ9Jbx6aIJxFt88BZyXcnqYWPfYIWhPIGrfYjs4/9BgYr8X+Vdy/i0bwBCWXDhCsMrwaf0WUlO173jAh3V/0eB3mXSjP1/5J7G/tPxadkAXHT7nxmM0HGC78forulv8aBuUP9V8V8X6I7/J9V11xqS9vbX+8poPra+BfDQvV8lRxpcgyes6gRfTdfJxqduKMXGfrEJ9+n/Yfy/X+qn66b7SP23eEjtZT/YCurDzRuAXBY8DmYuwH0n+HGMrGTNS/5/vFcNHhH7v38O7KSvd/PTZP6j2v796j/bCfLjfT0AtJcFPx7aYTBZR12gm+ku981Ixbdo3ygB1f4fnwNLSfmy/1Xn2NX+3Y5o/oBBkO1kwVeJsSerbTJ4JE4+B917gYrv3tCI6qu00H99g0lyJxyP0TF4259S+4YTiOyCYHXwBXvZoBsWqDo+Xo14BP/VBdTqnIxuHwbkKyUFCQ4AAAAAAAAAAAAAAAAAAAAAAPDVUMsiM9fga8cH/wd2UK27zlyD9vHB/4Hzc2RdeuYatI8P/u/Ynr/p13N+jqxL76F7L786qBtkTvQ1Ex/8F/ifzh8Q+G+z7FHr0seqJzld9E51711uX9QJvhcny9kM+L/fAET+1yWfVwGFIk8bQKQcW7V8KykPW800yF0djFYC8gQPSRzHKVao7b1AR/Y/N9/A2H+b+0/lYIRU/ji3KrCQBT+YbVDVGHOro8rG6JXgq/goCgj/n78F6LEBTB6DF3Zlo+uFIyWy1HFCGDYX7wRfknzegiilQvce/7d24wEnQv8N7kMLuuUmiroHst21endKWfC0qRjcXrRI8CmVfq+U7Mb/MxfCgv/fLx28E1DSLa8QK9zXdI/mDpgEd0dWu/adjJAQIUnizXAloEzwjX2jgRfTKoHH9P8w/pXH8XiOlsnNfhrAjm65gWrprix4bQMQ695PxcEpUbKYPO1WJ3hOql3UAOKLieW7JQL/8xcSuwLdl97v4BOBHrrlmwMP+3y3Cq5Y935vlWHWAHQJvrK/NEyboR1Tdq6BzUANN/9X73bZF2j+4mTnf2WCa3XLi0MWLLXplbr3pVVGRvr62mmCbxrmu2J5rll9+fifu5AYTTUKORLnScjXnlWTlYMRevX1KDk2+zLeryrB95JxGijBZf6XLiAeg0H40tpYxCcOxk/wrP+CRgMAAAAAAAAAAAAAAAAAAAAAAKAHXf228SH+Xzs+/fof9Mq8dNdjKbBIEqznADPX4GvHf3rZuQCxZpm37rphE2CuQePiZy7AoOfXQbd8NwAGTWB4XXqxfXnxezTIWJcxxGmUuQZi/+0aQCvd9com4K5LH/tqFR+hrLZLA1AWaCzWoZIdH9h/uwbQSnfdogF46tKnMw4UstSxCGnHU43cCjRI1eXOwwgNRuh/3cmLZYtb6a7XNgBvXfp0ypFCljq+EtVIpsVqt6L7To8E3+zDsgEM7n/9CYwlkFvorls8B1Dr0sdyXYr4CGSpl6KPm0raYEYo0LDN2othH2EzUtRd2RzQf6MlnFa3fJUk87+D8KjRuwFF+5WKxlNOGFQte21gf/VgK20Ay0yGtfbdtbMEfwyOidV6U2HWfgvUw3+DxMvp99vrli8HH88eMPxMwK79WmHTzZATsS69gf3sKLNwHOlQlpP6feoEf9gPdm2lxx/DcAr+19oX+2/cCLS65ctBhxWHufS4zn5Rfrxj3f7dBhAn4LLsrWkAqgLNxTyKfcXw2seSf8f/yuG4Sv+Ni1+rW16yu9ivnkKktb++WsT7MRxOYSwLXmwAt6LNFOiZBuCU4OvZFXnZ8VMPjz8xVKY3/w0fAmplnUe3v9qHSDp6U1C1suDhfja9/08TPnnWYDP7QVBApfNrNFQmvwIWyJkb+m/fAESyzqPbnxylo01troakRqPaPXJKnOAqye60yXvWHIDLw16gMAEAAAAAAAAAAAAAAAAAAAAAAM7hqqsfRE4Je5v488nD8eLjqoseNAgVuvqp0rEyPsw1cLH/5fK/t/i46qLHBaqQdTa2fxgf5hq46t4riuZ15wK00EVXNAC1/aP49DzXwENX30n3fvO12o4LdPEvxCe1ncSnWSNw10VPpch7t/9MfGpVjVvo0ltOZVLKaqdf8w5f16385p66QItS9aWtWQPw1kXP3KOb2k+lzj1042saQGtd+toGULJvkNiLWnKq2hMaQcV39z0KdCMyWtqaKgJ566IbF+hUkqVOrqrS+NSuAETxX4qnJNtt9BAza99gaXuzuwiY5sRGK3UTHQr0urefXt4NUOqiP5ZbQVPv8ma97LmmCq+GY5c2stEhXlYN4Bn7VQ3gri2Yyl4bqdKqde+XVcCyGtie3+pbDGGB3vyNG2QsXd+DLPjkMXghlV02nou2th81Govl/+bqk/n5ZAN4yn6FoOlW8t1Y9VYtCx4/nY9vizJL82uHBbqNRWlreQtwK3Lt4IK17LJdgebt24k6bmWvDxqAwr6JZHpO9rr+PW+lLPhm4GusnJx5OHftrEC3Eu+pzXuONn8IeAtm5gQaOnYkuzwJ7dvcXuz4Xz3Q5MC+iaR5zn59jOS6/bm35zLL/6qHgKICzaow9zgbIO+gvWNK2WXs79jNatJ77KNStz/34Zz47bn77elpnx0K9Lp6PlWeu9H+w0BPnEDb/YjkorGfSfT8h2cs92Wuez8Xd/r+fDrcpLIBeBZoGo8+5wK8rwdEeCSj7Fiw33RfJrbDQ+ncZyMMit+zQDcNsif5cbTQoVvi4SbJoBMAAAAAAAAAAAAAAAAAAAAAgNcj/rqyoRAIwNOMrhvfVFf/7LcBS4U/YBNgrsHAAfbQRW/qf+3XdffsJxqKp4qfuQbN87Pv4h9cF72p/2cLVGk/LX7mGjTNz76Lf3Bd9FH9l9qPi//ZuQYvlj/euv3p37fXABhcF314/0ePD/H/xL46/Drw6Lro3fl/4hbgU/YjGfVXKSC1bLeXbn+3egCj66J3438y58Dc/gsW0HLMOcXelXLv+fhMTrr9N3GRVNOgG0WgwXXRm/tfuUQ8tF8r3S2Pj739jeR3MT5Rgzyt26eUBU9uk1JZsx7ectwPwMd71RVCrIu+6OpLG8yB79UF+lxsrt02YHv7D8HOJ/Pn5DmQyoLnxqTl9A1bTgg6PvDL29knuR666NvBFJrBC7v+m1xF9+1XP+cRxUZp/7qRHT+O/7Wj/MwOL8nNOGg5F2AbBDvtfi9d9F3fjYKr0tVX23+cg1yT7N++Mj7q/Lymt0e5z0kYzDeobwDFIBiM1vKSXc7at5ttcOR/fYLr7F8Ht6+Mj0d+dv9Bo+0ySjC6Sy27nPHZsrPK/cf+87Y99mFlOzffwHjAiaYpDKaL7j1ogfkDfvZLtpT7MI1PbuhuMny3O0abFcBsA+ga5hsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADouB5sAPCChU8jAKD4aQIAFD9NAIAGQPgAuAUAgBdrAgDwgo1gxb8lVNFJP7nhAwAAAABJRU5ErkJggg==`,TC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAFiUlEQVR42u2aMXIbMQxFdQSXPoJLXcGly5QpfYSUvoLKlClTunSZa+QILnMIZajx93zBAAhyKe7KBmY4lrULapf/LUASu9utbC8vf44tbbdRu7m5Pba00f5XaxBViquJ3QLAfr8/zgbg8f4u3KSIS/2vHgDvc6v4awAAEZ/v7tzmCVeO7b/9ctunevotoUeF/zWiAIR+fXk4a60ASP8vAYBMB1Z6aAFgJgQAgAVnIKIAsOAMxDQAZk40NJFHATA7CtRSwOH2ZlEKeHh4uLwu5Qf+vf49NevHRgKihXcZ9kdGgF4gIjNwKwX0AKCF/ykA1CDAsefnn1VAIksXb7K3BAAWGp+j4svrLZ8Ph6f35t23FvZ7I4BMBdMAsCCIig8/2TSf2sx/1OQvOh+A2DzY/J0nwqdIAR4ES8S3fGtP+cjlXxQATejWFDATgHJfcp/g94/7syaPh1Mhi+qJz+dioORnCwBP5NbNn9qNWcelwJrY1wCAJrZ2LATA6YbeRItODnsAGCV+77mRHK+lhhoAuPdeAOAfAUBCoDUWvzpeLH50hQAfmTYg/iUBWDJPsHK8NhmMRgDp1wqA9PcAgLgeBFJ8FwB+eluOSXAic4dRuX9kMSf6xFsAmBEkCIDlb10LhD35K/MBKT4A6d4Iqg0IIODWOnvdQuWvdb8jMm6XOA7xAYAGAb5nSKY9UZ9u/3rDxiFeawzK1dzMyHw/wx4fvx+1FvXHXES2Wf6bAqCkgiUCjuoj6l8GWqtkljRYEwFClbkHUic+8yS1xZ/7cf3LBKWlzQRgiYCtfVj1g4i/JX4EAhZPAwCfSyTR+ijflWNSfO7P9C+CnpYph6fj6/7WbafO3pY0PaGxZQLCAxoJYe8TIAq33EdkkwjntvZREx8AaBBo4kkQPAg88SP+JwBqwn8AYQEA1iBCPFwgC1IDgM+FgLIPLw9Lf+6jDJoHQDkv8j4jCyEB0wS3BEQ4H+XfHP5700C5AAx0TYBykdjE+HDBAfFKg39NfI4eLDj7e30AgHJ/LDT7SyHQFz+9NRH5HMAZ8dfaWRRABKilAKSJ3hRgAVATkMWxdrLkOQwQvm+ZRUt/D6ByTArMAGjHGAAWxQv9ssl5gwWB5/8hBZzq2BUIegFACNUA0ETGJoYGh5fP0Qf8y83KvqNzFfh7AFkAwN8DALDyctF6amXjiNXTzgCYkQIgXGQ2jTCMAYqKzyEZg9QCEOdz9seAadevAYAaiBb+JQBS9AgEgFRLAfy/1ZebAqwosDQFYOBrqwAWgW8SN93jGxGfYYHg2gSvBgC/A8ETQP4rAWh58nksNH8eLy1CfBhLLAM1wWXo11YB6FDepPXkRXJqy/LPEpF9ayuQmm9kGegBwI37BqT8JEvR5DyBVzgMOe/6WXME6f9+Ea3hX75zF2kcAaJCtG4ALd08sjZ9oqlLAiAh0IBmCBgGFksek+OP8zQfbVv67F5YpIjwcjC44iQrUPiLyMDnXGoLd+n275IahAeBFc1kmpPCaf9LACxwNPGl/y4qvoTgUnOAEUKsWe3qKQZZEGiiWi+9aoKH/GcBgAhwFaXIFaufVgqIzGE8EFz/VgB6n4wpLyN80pr+LP+sR39Vk/VkuQ990Xp02vrie/VkdQfJ8LcKGp5/2gbFj76UoG049ECUtiIAXhWptR6tvdUijyUAG3z6LQh66tFafxkFNv7099STI/7VcmTaumvO3nrysHp02roAtJQiI/XoqH8CsCEARtajay8mRGv7aZMA4L3jWp736tEWBJGKVtpGokCtnOjVo62m9ZPibzgK1ACw6tEtECUAVwSBbC316BT/yiDoricP8E/bGAir1aPT0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tK67T+US2v2dIwMLAAAAABJRU5ErkJggg==`,EC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAgCAYAAAD9qabkAAAD10lEQVR42u1d25HrIAz15366hC1jW7qt0NaWsGWkhHzkTjLBQzAPwZEthMWMZ+7GPuLYV5KFQHhZTmrruj7Co/W8dDuav/bnY015QxWwdP7598/fz3as7vOaF8ZF1yRkHMVPmn8NX+t/Vl2UwHM4WHX8UQWk4F8Ytz6+f7+z8p/n/HXc/Y/Ov4Yv9T+b4b+ew/v+YsdZuu8Yv3uGNSfciVXPH1XAGt5f48+HRhYah5efe0MiBjgqfwq+1P+sEeh2BM+sFP3Eyt8iB8Gq548qIBUfPqTN2AKvFcrLYZH+R+ZPwef6n8r438/fH1//vl6Hd54lx5eT8fytJgfBquePKmAOHz+gXZji9h6Kiu8xwJH5t+LD/qdxANFbyj+j+/3+iJ1n1oAqMnJyEKx6/hwKGCqy//12u23ytn8H53MetBWvnT8HXvssQk6BU46y1YB2MhJyEOwM/HkUOHojekPbCLgGBa3h3QEGKM3fYXjNSUSKAtcy3FQZKTkIdgb+LAoYXpcl4ggGQMAnb0o5/5b+Y6XSnkSkhLBHykD7184fVsAaNpaRNQAivofDqPx7+t9lfTmGQMLrEHJJrNxwqRSBlWQU8Wj/GvmzKOBbQZ7Zxhr+lZHMGAAVHybsZuDf2n8qYdkbAY0QQaSGWP5v/7xbxtHhtRQ82r9q/qgCemxuKuLDI7nE9bEMAj4lQzP/1v5DDEcEJD0L4WX6/78PpXWf0VXNgEI5VDzav2r+qAJSVj6ljqwBVI7Uwgft/Fv6zy38QCOIXgfCHgFkEryU6CMlh4JH+1fNH1XAnvXHJQNoXe+snX9v/3EIjzhAjggKGUKUFDiOUmur6VJyani0f+38IQXkKFg4u3hiNP5nF89wOlC2HAZ1qoxwvjhdV/i9t3/t/K1Zs2aN7w1pzdrIEZy1yoPtLWc0BbQhUO8MAJLDscZoBL3ljJrv25KgsvzRaVBrXMYPlDNqvnebBpXljyYRrXE4ALCcUbvzs4VQcvyRlZxmvQc6gJZyxhmGALYU+nz+ywALkcwBMJQzas7SWjGUPH+0mtNmEQ4eAsycRLRy6AH4AxvCWBKR2Qm0ljNqTyLahihy/NFiJEsiHvEG7CyHRHMIEusQbEs0ef7opqhcQ6DlqusQOMoh4R1VhCII2xRVnj9LMRHiQK8eQXCUM8JDCKFZCNsWXZb/Au5pyBUBXXoWgqMcEt0QAd1SicMJ2IdR5Pj3bknG4QCvvi07TzkkuKECPAQBhhD2aTRZ/gvTtxt7IwjYgdgQ4jgHcmoEYh9HFePPNpPTeX9SEYhNQVxppsU+j25tsPYfwUEE8PP/bWwAAAAASUVORK5CYII=`,DC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAgCAYAAAD9qabkAAAD1klEQVR42u1dy3HcMAxVGXtMCWnDZeSYEtJCynBbKWOPe3CGmcBBOAR/DxIICpzR2F7pAU8yAIEfcI/jovZ4PD74MXreup3N3/vziea8oQZYO5/+fr5//zzev33975r0e/qMX1OScRY/a/4tfEv/rrZogdcIsO74owbYg0/n0/Hr55soP52j67T1r86/ha/p383x0z3S/eWBs3bfOT5/hq0gPIt1zx81wBaerqHz3Mm4c5B86Q2JOOCq/HvwNf27ZqB08GdWy35y4x+Rg2Dd80cNsBfPHxI5G49aXJ6ERfSvzL8HL+nfyfnp+dPx4+3Ln4OCZy3wSTLSZy05CNY9f9QAJXz+gPI0haIQJ96Ln3HAlfmP4rn+XQJA/paiZ/R6vT7y4Ck5UEuGJAfBuuevYYDckOnz5/P57w3793d+Xoqgo3jv/DXw3mcRJAMuBcpRB8pllOQg2B34qxhw/kYkRyMC/HzLQFv4Uh/fO/8R/bsNIvYYcGuEu1dGSQ6C3YG/igHy6yQihKs5QA++dFPe+Y/oz43K+yBiTwp7pgxUv3f+sAG2sLkMyQF68TMcVuU/oz/Ha3SBrNchSINYUneploHVZNTwqH6X/DUMkAwkjTa28OkayQF68XzAbgf+o/pLA5azGdAKGUSpi0V/0/Me6Ufza3vwqH7X/FEDJKw0FcGPz/654AC9+JIMz/xH9XOMRgZkPQtBMun/x42WuPGfNQficnrxqH7X/FED7Fn5VDokB2gdpYUP3vmP6JcWfqAZxGwA0c4ApAHenuyjJKcHj+p3zR81wJn1xzUHGF3v7J3/rP48hUcCoEYGhXQhagacZ6mt1XQlOS08qt87f8gANQoWri6eWI3/1cUzmgFUKwPpnSrrOV+brqt9PqvfO/9o0aJF03tDRou2cgYXrfFgZ8sZwwCjCzQ7A4CM4URTdILZckbP9x2DoLb80WnQaErOj5Qzer73mAa15Y8OIkZTcAK0nNF78IuFUHb8kZWc4b0nBoCRcsYdugCxFPp6/scCC5EiACiUM3oepY1iKHv+aDVnzCKc3AXYeRAxyqHt+SMbwsQgonIQGC1n9D6IGBui2PFHi5FiEPGEN+BsOSQ6hmCxDiG2RLPnj26KqtUFOu66DkGjHBLdUcUqg4hNUe35axQTIQHo9hmERjkj2oWwmoWIbdFt+R/gnoZaGdCtZyE0yiHRDRHQLZU0gkB8MYod/9ktyTQC4N23ZVcph0Q3VEC7IEgXIr4azZb/ofTdjbMZBBpAogtxYgC5MgOJL0e1469lg7P3Z5WBxBTEjWZa4uvRo63WfgP+7gx4d0mqxAAAAABJRU5ErkJggg==`,OC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACACAYAAADktbcKAAALUElEQVR42u2dPZLbOBCFdYQNHU7oI2zqcEKFG24415hj7BF8BKc+woYbOnToA8wWaUHVajUoEgTQTeF7VSyPRxo2GsDrH4BEn04AFOLlj08f0+Ul+8f73/Pl1QYAAVwn38gEnGT++vbPfHn2wdDGBwL4EmBUAibdk3yPPhg+AoEAvh4IAn76+Pft74/vX16HjUDcDQAE8CEABPR1ABH6P4T3hwC+BBiVgPR/ECMAAcZOgXr2v17vyenfa12INQAIMJQB9CbgdM/v5/NHun+SLdsgv0MEAAHwQE9EwHnN5+v7h07/dBqYvkME8IQTcGQPZOlvGcCW+nsSMN170lnLTtf8WUP5nv0fgvDeE3BkDxRFfw8CTvf7+eO/3/p9ef3d/1/fb67pd2kupu8+cwrS3dhAQH8P5G6Avrw+1L9FSpZILY2AdenvPXsK0nUbHAL6EWBkD3x1LN++35Db2gZOn0/fre0dveeflX533QaHgJ+uBJgnvZb/9f0q+5n0T/qUeOC97UgRZbp3MgI5ByTJP7epYjTqPf/cFyFHJaAkwFYP2KIdPfWXKV2JB95DQE1+GQn8+fnzPNcSAaafp99Jz7/HCMh77O1/6161xqYZ36J1gFcIKidxiQfcSwB5lRqg0r6XBCz2wDsImGTfGZfz+ePX6WUmfNJ9/vn0Mn+mjdTWNsjcOuXXe/pf3yt8BBClAywClISgNQhQ7AF3ECANrmlY1hqgy1htnSQWAUs8cE0CJtlzu87nu/5Pv9dtKJl/SwZoS/+X6B9iEd67AywClBKwBgGyHjAZwIwHrEGA1PYS/bWnXtOGJQew1QPvIaA03Kk/07hMek0y09imn6/pigiLS52ApwMIsQjv1QEWAfYQsBYBpBfKDYD2PjUIcDP5N+pfGgVZBCzxwDVTQMv7yeizxVb0w0XIB/1/+EVIrw7QE3cPAWsRQHrAbAisPGBNApToX3sBuMQD116MTD9PEYe89Oe1tyFL59/h1+A8OmDpQZCtBKy9F/0oBG61B+2tv4cHtgyQ/L9OE63vHrH/w61BQECxHfYgBG5FgCj69/bAsg1Ljmnpu0fs/1BrEBDw3gNaIXBTD+itv6MH9oZn/0eIwCGgWlR7GAI3zoF76+/tgSMZAK/55xmBD09APamXPGCrENRb/5ERwQF4RuDDE3BNaNZDXiT9RzQCrg7AOQIcnoARJ+TI+o/U/yEjQCYgADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHB48FgqYMIP3J7aVYEi6+/Z1xjaQAYgndAa4cWMCASc31dXR1f1fGOul/65sfecdzCys/W9OR/vMhijE/Dt7a/5Su3Qx1a1JmVL/XNjv1SMpla/e8oGaiB0RSRdP68XAa3B7kXA3GRLeqd26KPja76n3lv/3Nhb41673z1lAz0QxnnsoxAwV5ZKVi9amozy8JhadRJ66b809ua4V+53L9nACjXFWexyMHoR0JoQLQmYI/4jr5QOrJQHWO4xiF76L419dtwrGz5P2cCYgNdSWGIwakxA6/eagFZIWIuA1gm/6e/Tvzn5OhqQJ9amduwpldZD/61jb417S8PXW/aQJF8zAXVVlr0TUMrQoa0m4LUNaTKIo9pLCZiTL+Wme5gEvBg4XaRiNoSXU2xl+3PR0BoD1EL/PWOfG/ethi939HoP2RDfkYBWQVR97rsk4HyftAApJkMpAZfkp4KTSWaSmyP/TX2Iy6RMfy/lT+0pNUAt9K8x9nrc1xq+nPweskEQAkqCSNJZBLwWZjFC8BICLsm/ybulAbBKmE9boqmNKUQV/XKtVSe8V4kBqql/zbHX477W8C3p3lL2btLICX90A+BJQOkFNOksAlptSLJLCLgk/2YR6nJ/vSAoJ6SWL4+q1sdXr+n/1vrXHns97umSJF6re2vZu8mvPcAzpABeBFzKQzUB0/2tq4SAq+Ur4mQfjLoYidxC1pb+76F/7bG3xl0WUs31TU5+S9lEAMEIuGobSFSJqUXArW3IGa+9FWnXGKBW+tca+9Jxz/ZpB9mrPaQOXXKh5FPv/z8xAde24RFRW8j30n/P2O8dd0/Z9wtlIv+z9rjld579IaARCfjIU679/Ij6e459d9m5HCwJSls/+tFE6yGXZ3sxYXQCRk7TWusfIfrpIvu612hsMVgPI0jrJL93XfRqZBW9Hm4YnYAjwzv66SpbGoK0xZAeN9TPuU+/m/cfL/XJe4TCz7gICUBIq3fdY5wWGy4PtiQDMP98evltLC4GoNZLL6QgAETIe8UKZHqQRT7UclOfvKLnv1vtvDzuaL5oI4wPpAegUf6h9xitrcBWCyAy9LfeQuuxCAcAAAAAAAAAAADQEyx0AgAAAAC0jrZafBcAEJyA6RH3Nffd8l0MEICAByCgfsflZDyglvvesxggMDj5RyegrvhknYh1PY/v8kTqs+gPMABDE1C3Yc3LcK1ke+lvNoptqHEMwMgEPKkX4rIvo1V4ES6q/maDIpXHBv2MwGgElMbNOpVXvpPSKgT3NkCnU/Dy2KDNWO+dgLVKc0cg4KSfPNpdX/MZmY2iH2/9rw2JUh4btCW/DO1LJ6BMFWoYAS8CntTR3frY7fRGrDzWu1UE5qX/zcTwLo8N+hgAOW5bJ6B1j1pp5yMCtuqTWc7rOX8exeu5+glVVqmyNQaomdP1LI8NOhoAMW4yGlgzAW8IIiLFPammPGMyS0BxhqV11eiPn+9v907wcs2fFei7yhCnIiAr9NfOuckaQKvy2CCoEdgyAcXflJD/Ls0QMizZ2c9VelIy5+Z5/Xq+OXjmofxpPeT1XM3oSNlr5Ov+29QOr/LYe4wRdO1gBMREXJqA1hpRabhtnfq0lQB7D46VbbkzcCoVlt/ZKzNH/rX6bzYC3vXp2YWIbQRKCLjXwFtpxhYC1iBiyutlCpQr0ClToLQmUDLHrfbLY/ge6a8d9sN+8C6PzS5EfCNQMgFrL4CtJWDN3H8icSJykiV5oDlxnZPi7/bqrRdBH+n/6D7Z1VXP8tgsQh7DEGyZgK3SkTUErLbg/Xq+qdIrKzzris8y8pF/ewj9o5THPsoi5GhPQnoQMJeKrCFgzcjnZhtQzB9ZHFfOdf2+xKH09yqPfZQ1iFFTEA8CWrnxFgLWli/rXViVqWrXxIikf9Py2EdJQUbeBoWA9/m4tbjW9ElAR/3vjEDtMsXeKcgRIhBvAzAyAXNOq9e6Um5BMDeP204E5/rsRCD9t0HDTEAnAlrRkNz67NkGb/nu9dlbRCCeBuhoEcjwBDBemHJZk3GU7x6OehggzwjI2wBCAOQDAAEW0qLR5AOMAAQAAAAAAAAAAAAAAAAAAAAAAAAAAADHAvXZARiY/NRnB2BwA0B9dgAGNQDh6rMDMFIOHEF+qPrsAIySA3vIj1QeG4Chc+De8iOWxwZg2By4t/yo5bEB6Ep6HcqW5MA1y0T1ysG9y2NHXAMBg5FfH7dUkgPvCYG9c3Cv8tgRUzAwqAGQ4WtJDlwaAkfJwb3KY0dLwcCIBkCFwFtz4D0hcKQc3LM8NrsQII4RuEzoNTnw3hA4Wg7euzw2uxAgnhHoHAJHysFlm3qUx2YXAoQzAr1D4Eg5+MmhPHbERUhehhrYCPQMgaMYoFw7etanZxEShDIEPULgSAZItsGrPLaH/ixCAtcQOJIBOgWpz951DSLYg1Ag0FpArxA4kgHyLo89cgoCghgArxA4ggGy+qJneerRUhAQ0AB4hsDeBsg0SB2r00bof68IjEehgxgA7xDYOwf3NAARIpBe/c8axEHSgd4T0NMArWlT9zWZwQyQ9yI0GHgCHiEqG2X8I8jHADABAMAIjOqBAAADGyAAAAAAAAAAAOBg+B+Q6tUsbCWTBAAAAABJRU5ErkJggg==`,kC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAgCAYAAAD9qabkAAABYklEQVR42u3au03FMAAF0IxDyQqUlJSMQssYjPBK1qBkhIzAAEEW2DhficROeOEcyXp6SXQNiq7zgaYBAAAAANhBNzOuJR8UdG32+9Nd9/H20hthW6E5aufDuctfsUDd5fH2K7N9Hc0R9m2co3Y+nLv8uxT08jDKDtuuIB/+wdV/pkAF7gJ+8idGify2bdOIP3u+zQIABxY0XIVjEWNBY3E3XqFTTvzMF4B8n0UA9i9o7yo9lb+l/GGBGt0BfC9cwzuAeKzTDfsUtFfU9JyejbhtxRwpo/cOYGLEBSw/3umGugUdFTWM5/ub3sj3/XKO9Hgylz2cIx5rAYD6BR1dpafeM8T3C2sXgXws5fvHIDigoHlG+Jwa+dxb7jSW8p1qOKag6cobHieG2dkLxiJ/aVjIB44saHysiFmD703J7ApzwLkXglD2vPCD7385fy6r9O8AAAAAAAAAAAAAAAAAAPV8AlCqn6bZgY25AAAAAElFTkSuQmCC`,AC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAGbElEQVR42u1dMXLbMBBkmdJlSpcuVbpVmdJPSJkyZb6QMs/QN1KmzDNSulShDBRCA8KgCOyeeWC4O8MZWdaCwN3iQPtOwDAs4PV0uAwgfhyPMNcKv78+X/Z4bxMEBzJOtOB7jp8Rfw/3Z+0//Px0uDAqDgNg+cwAWAOyM5i9vwU/+JAyANpI4AQuy2ecwM4ARoCx/6gDAu/854HimwgA7UTsAMv3FBDrQOb+UQBe/IkDkUZiByz4qAAC1yKCMQ6w4CP9j5MXFnFs4Px6ghpJ+YgAbnxQQCzfSoAoP+0/zH894cuIpQCQWWAioNEA3gL0cCA1/lv4Dw2AAsj58ABYAYD8tP8e93flHx6fL7++v/xr4Hy+vg7vufBfT+KvzL828O3l6UoMV3jd2gHxt8ufNAKRxd88fzgeDpfPx6frFV6Lvy++ZtDeI0BsBCaLv3m+IPijh5qCXdvRygGeuXU0IbJ78bH1AEOSkvXOra8tHksBMX2g7M6mU9mctoWAvKt6Nj37mXTmQBaUDB0UVfSw7LmVhbH5ZLYgJO0DOvtZPhvCLZZPXwGw6Ugyn84WpMSMHipitqSKFVAcA8tvHsMkHczkw3vIx4MC6KWkzGIJhMbA5sO98+lsPYNFTZ6nAOJfcNAYdp8PN6optCjqtHgGC31oakP5cKOSLoOiTvoZDH0G2ns2zLUmj+RblPTtPh/OPIPkDvDmKwI88g+RazvA+/43I+41H85WNXfBP5+vl/4dDiI6YK/8LuD9DV/VIzgbf8ubLPQQejctYHqDA2fnWfTd0wYmg2DTyV4FGeG+FmNfu43SZ90iEZJMiZ21SIYg3NSA6NP3YLRBg0U9A5vQotSDfqt4TgA1A8n5KadlJs05cMke8R5oLiD9fKmgpjUa5BGk2Z9rZsPS9c5qgwrrZM6SA2LiZS4XUDsWtKAm7V8+huZowDyAIDMgLYDI9weoKY5I+4skY9Ii2JKAatqKnyndv8aWef9TASzxUxvl6WCouITdJApxQBxwKZu1NIDIH2YKSuLvWvnh/Zr1OBV9KZlTY4vUWSm/Zfx5G7X2K84Gi5KwlrAXOlz6X3ZsD+Wnzq3h5w6sCceRM+fAGlukzir1v0aAqb1a+LNrEJKNygVQc+PogLTz1/9nj21UGWBBABR//F2TAEZ+/PmeLVOR3MZvdP8aflkAQDYJyUY9fPh4Cdfpy9P1ij/PvS++LX8+hK8ggNjBl8PDraPhdf5z+jodhPgc32QGswKIHQ7FG+EKAoyv0yt+LjdAzp9ro4VfaqOVn7exxJ8bd3y/5v732ijx7ztwzCfDBQ2V+ejQoXCPUsfz9+dCYOmzpTbu8WvaWOIvtVHDv9dGLX+ujaolID40ND04ZGjNR+fr1twl/vvwBUEQBEEQBEEQBEEQBEEQBEEQBEEQBEHYAfTd+J37QFuL7Hgilb5Y6CEg723iWee5f78ftYWFACwGzuwUbuH8/0EAkC16EYB3FPQWgNsWORYbHHg/Q/QwezcvAOawBc8IwhreaocPtg038UkAEsBNAMx25V4nbvQiAKtDs9wEwO5Xjw6ePS/H6sAp9sg2bwHAUdhCAD2cuOF1YFUPAqBsYCkAjwhiKQCm/xbLIDqLqSWIPfbNwoDM7GH4pQ2WPAQQ++EShdlt2izOHbQ4M5AVAPsM5HlwFCViqz2CvAVAnTnoeOYPKwA6ikUH9CAAVv2wAIjTNnoSADQGZJcvSwFY8T0EUNoljYlizMGXvADAPYKsTv70EJCFAKLxGRF6jsFVAN4RhD06d26jSBcRJhttYiHMWQAeEWTrAkj/fIT6MAlhgILQnUItDcgc/GgtgLVDeD6BcQGMu3yhu36jDrQWgMUMRpdPNISbRWB3AbAbTQIzyDuE9yCANII3j2GyfgANrL3T6LsKoPH+b2Yfu4R6CaC0W/daAsgF6CogRgDBdt4RtFUAbxQ8CqDVCKwA2Bm0ZwFMJlDrBO5RAN4zCBp7QQAu9kMEMBkAK4CRDw0AnEEWMzDlUwIAllB2AtgLoNEIEwckHYAc6MCfCKBxt3SLCfRe45cAHAXQcmyOWQQBx29uwNYlgOXTBojnHSQCgP6G3+gEoB3AGpDl32YRMIMnRhz58P8RwPv3YH9BEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEPrBX9S1KgSd1tcUAAAAAElFTkSuQmCC`,jC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAADzklEQVR42u1bO3LjMAxNuaVLl1vmCNumTJkj5Ai5xpYpfQRfI0dwmTJHcOlCO9QaGhhD8ANIskU+zGBsUQIE4j2CkOI8PUEgEAgkIvv9fkAWOk1iiPtyuQze+Mk+fK6dC/M9yTCmVj9rg+a5J/kh9cZf42eufAUf398/o7qM5fdaXx7b2sRw4Oa43+Hjz2x+agig5as0FsqVK+/kIATvcUS2pczWJl4aQ0h0iNkLXrA9Hd5n81Ezf75ouJaQiOfKTWBvEsieSJQDUZZwzuQSAvD9NtxXxl4zD8vcefIl+LWVLuSM5kA5zFU3ma9YDlYjgAQht4p5+Y5N3pJIspcramkCUOW09k3eCqBhUN2UW5PAGVxr66kAqX28xt6z/cmYrVuvpweI5YAqyOKNEIFo3X+8PUCqJK/VAHsJMPdTk6k5tj4KcZt7P9NawdviI3BJLNVPRxYjPul7T/7eADTxJhGvQyEQCKQL+Xr+PQS1nodsHPjL4XlUCXTu/PFjN8SU3yN1Tl6TOhe7ZvdrNwSV3yEVBBjBPR//6xXk0vMBkHH89DJpjAB0jZUAMfsANhFSfgeyFvAFyLnzEzgMfJUAyrliAkTsOehcQQAQAARYdQu4EwFiJAD4nTWBnAQAv+PHQIBvFPnHG/rzoXb8+fl3CDrZXysDHb++vA5Bp/PX0q0RaWli8dhSY5rwudK8+PyaAJ//GCOlBD4pgU9K4JPK3iDWsJFvIoEkxBjb+XhLKH4cAfPGPlzPrpGEJZLHCM4/JfhNkGATBAiNJ6tQvJqUrH4iDIE+jV2P+b0lAcIcUiTAFvDgW8D09BLmyKuAiCflQ4LdFPj06pSrHNeueyRFJ+cgAN8CeFLpOHWdNsY/a20tY0DSSQANsFgFkESJ2WpjOT+1/kCAhQjgrQDWVazFgQpwRwLUrlhrpZDx5OLrtQK8fV2GmM7aA3j3YksPkCJA7xVAA91NhqW6caut9emjB+BP5zJ1VwXINoE3EQHvAR4XfAloqb1GBL0HYK9qbxqs63HqOm2Mf9baWsZaBt/qq4gEOcCi7wEEUWK22ljOT62/lggwJ/jFJNAS7K0A1lWsxdFDBZgbfI0E1QSoXbHWSiHjycXXUgWQq39u/2oVWGovtvQAKQK0XgGWBD9GArwH6Gj1Z6sApP3Vn6wCEBAA0nj5xzYAAoAAIAAIAAKAACAACAACgAB4DAT4IACkr20A5b/zKoDV33EVwOrfWBVY7QchkMetAqv8JAzSLgkAfkMkWOxn4ZDHJsHi/xgCaY8IAL5xIsz6z6GQdshg8fUPqONHBK02dKIAAAAASUVORK5CYII=`,MC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAHKElEQVR42u1dwZHdNgzVMcctw0cf3YJLSBlpwyWkhJSQNnLM0cctwYf1cGfgwcIACRIQKUrvzWj+riQIEEhAICWAxwEAwK3w8vLyVrZLCLFKmNX8If/e8l9Nf9N1OMKcziu//376/+3Lpy/vW/mbH7sr/yvJv6rT7iz/VQxY6k/q8DT+kQYs+19fX9+I9r/PP37Rl7/pGnTO3fhfQf6VD4Cryb/a+EcNmOvP0uEp/KMNSMe+//3jww3QVvaVYy363fmvkr/s9xqwPDfTgY3KfzfjHzXgcvzbH/+8b0VXUoce+iH+GQ1Y9pdzivDlfL6VfeXYmR1oJf8Meq/8mkHz67YMmM4/I4Ia1f+dHEDUgAvtn8dfv/oT6bP8nupAog1InbMIT7/871Y4uTP/iAFzo2zJL42dHECvAVsOIOqAI/q/kwOIGDDprWyFXurwNP6RBiz7qbOQ9+GeqPzScesJSMdq/GuyR/jLBqjdv2bAXME1emoMfg1u2HQdTf5yTDoA/n+PAVtRQMQBcv1rm0f/u79FiBqw1GWhoXY/1YFEGpBoqbOQ0Hzj++Q1OH05z+JvdYYof9npLP50DU1+ujbRawYsz9McAG90KX85ZjkA2ucxYE6T8QCQ+qcOS+eTY6vp/06TiJoB8z7sobX6speeeLv4RxtQMwDuhcioawbA91v8aw4owl8qzuJfkz/qgHgEVJNf0koH4DFgzQFEHwBcL9b9t/R/h0lEqy/w9vFM4ll92RMFc6fv4h9tQBkCW0+gWggsQ+jeCCLK32PAFr1mQJoBt0JgHoFY8lsTgDyCqBmwPF/Kz4ca0gHSNVpDoJoDs/SXNYez+jsEy4B7nuBSlz3Rg+Tt4p/RgHy81urAtcaPPMFH+fdEEK15kF4DtiZxLHqNRhq1ZcCW8VtRmAw9a52I64YM7+vnr+8b/V/Tf9YQYnUEYT2MPE9wqUfqd1Hn4eIfaUB5nRq9dxa15wke5d8TQXjkj97/CL3mBKRBWcav6UDy9+heXofoPW0WHUJc5S1EzY56vgjl7e6l13h38x9pwGz6qAMa4e91gFfWnzRi3vC9OpD8vTPyUoYR3iMRRIYDyXQCvN1GHcAIPd2/7Dvuex5twDPo+Y33vEKJ8ideUQNepT/auP56PumN8D+UbLTefIgzHXhtCJo5hJB663U4o/Qy8hlpv1ADZnaASDJFhvwrDOAM+Wfzzwqjs/rPDAfiuY+oHnZpv3RFAMCT++sl0oF3M2DIDyNGPYrgq4zp+chJ9Bny767/Jxow6lEk0C/LR06iz5D/Csa/q/zRez9Qj2JJPYrfZh+n5yMn0kfkXx3BZMm/o/GjHsW6ehS/dcAl+chJ9PwLsl75rxDBRPS/uwNAPYo19Sg+XGhZPnKCAcuc+V755Rdz/Bv7WRFMNJ10ZyeQVQ9Cy+ScWY9iNv9IPQr1YtPzkYUBEa8Rellco1d+ij60bcYQJJJOuvNbhIgByWxO7QnYU4/C4u9psxH+0n4s/rVkLK/+mqXBpucjKzcjP+vsMWDNAfTIzyMYazszAspIJ91tEjFiQFoyUW2r1aNo8ffWQ+jhb8mh8fek41v0rk+hl+QjJzsgmRrrlb8WwXidQFYEFEkn3W0SMcOApc6sZK5WPYoR443yH9FBLZ191AGpIfiUfOTK06DXgKUR9shfC5+1YUEP/WgyzUg6aUZJqpnfIWQZsNZnZft76lG0+HvqUfTy5w56JBtW2oxG7yrJtiwfuWLAvRlcshFG6GUYpVXTqUUBWhjmeQpH00kzhhCzIwitIIw1hvXUo2iNgT31KCwD9tSj6OVvPTitknieoqwjk5AfLrQsHznAP5NeDj3ICHqGAVr45Y2kIumg0SHEircQV6pHMeKAIvx7HKBH/sj9p3ZAegLNzIfOpOeTmN7CGhq97MA9UcxIOmg0gog4kMxoAPUo5tejSOmAvLPI/OSz+Z9J7x0CZPA/gumgEQcedSAZX5KiHsWaehRpHTAjH3lVPvVV6LPC6lHaFRHIgXoUy+tRAADwdGB9egB4oNEfWJ8eAJ5p/FifHgAe7gCwPj0APHjMj/XpAeDB4b/nU0JtfXruBFoGXHMAWevThz6FBIAnOgBpwNpHHLXlqb0GXHMCGevTR/KxR+cgAOAWDqCVSjhrffqeJ3hGOiQmEYHHOwHq6JYBa8ZjrU/fGkJYy1O3IpAz87ExiQhgItCRjmhNAPYYsOUAtCIgfJ9nffrRbK6Mmm4HvkMAdncCvemI3AF4Dbi2Pn2Nftb69KNDCEQQwPYOYCQdURqwpPcYMC8jptHPWp9+ZAhx4C0EcBcHEFmfnhcBlfSemoIt/jusTz/qQADgUg5gdT421qfHEAJYOBk4YkBXoF95/1danx4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYDz8BU1swQVMfnMYAAAAASUVORK5CYII=`,NC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAHLElEQVR42u1dMZLcOAyc8MIL9wn3hEv9hA0vvGfct/wFP+VChxs6WBenjC0sDJAgAZGi1F2l8npGECCSDYEcAXw8AAC4FF5eXt7LcQojVhmzWj/s39v+s7Xf9DYcUU7nlX////f1/cuXL8+j/M2/u6r+M9m/atDubP9ZCCzbT7bhYfojHVg+f3t7eyfZH1//+ZAvf9M16Jyr6T+D/SsfAGezfzX5RwnM289qw0P0RzuQvvvx/dunG6Dj+dn3b0353fWvsr987iWwPDfTgY3afzXyjxK4fP/177+ex7M9RRt65If0Z3Rg+bycU4wv5/OjfFa+O3IArdSfIe+1XyM0v26LwHT+ERHUaPtfyQFECVxk//vzj4/xRO1Z/j3UgUQ7kAZnMZ7+5X+3wsmd9UcIzEnZsl+SnRxAL4EtBxB1wJH2v5IDiBCY2q0cRV624WH6Ix34HPy/Bgt5H+6JngT49b31BKTvavqr5A3olx1Qu3+NwLyBa/LUGfwanNh0Hc3+8p10APz/PQS2ooCIA+Ttrx2e9t/9V4QogWVbFhnq90MdSKQDSZYGCxnND/6ZvAaXL+dZ+q3BENUvB52ln66h2U/XJnmNwPI8zQHwTpf2l+8sB0CfeQjMZTIeALL9acDS+eTYau1/pUVEjcB8DHtkrbHslSfdLv3RDtQIwL0QkbpGAP65pb/mgCL6ZcNZ+mv2Rx0Qj4Bq9ktZ6QA8BNYcQPQBwNvFuv9W+19hEdEaC7x/PIt41lj2RMHc6bv0RztQhsDWE6gWAssQujeCiOr3ENiS1wikEbgVAvMIxLLfWgDkEUSNwPJ8aT+fakgHSNdoTYFqDsxqv6w1nNXvIVgE7nmCy7bsiR6kbpf+jA7k87XWAK51fuQJPqq/J4JorYP0EthaxLHkNRlJaovAFvmtKEyGnrVBxNuGiPf6+vo86P+19s+aQqyOIKyHkecJLtuRxl3Uebj0RzpQXqcm711F7XmCR/X3RBAe+6P3PyKvOQFJKIv8WhtI/Z62l9cheU+fRacQZ/kVosajnjdCeb975TXd3fpHOjBbPuqARvR7HeCZ20+SmHd8bxtI/d4VeWnDiO6RCCLDgWQ6Ad5vow5gRJ7uX44d9z2PduAR8vzGe35CieonXVECr2o/Onj79bzSG9H/ULLRevMhjnTgtSlo5hRCtluvwxmVl5HPSP+FOjBzAESSKTLsX0GAI+yfrT8rjM4aPzMciOc+ou2wS/+lNwQA3Hm8niIdeDcCw36QGPUogj9lTM9HTpLPsH/39r8jgVGPIkF+WT5yknyG/Wcg/672R+/9gXoUS+pR/Lb6OD0fOVE+Yv/qCCbL/h3Jj3oU6+pR/DYAl+QjJ8nzN8h67T9DBBNp/90dAOpRrKlH8elCy/KREwgsc+Z77ZdvzPF37GdFMNF00p2dQFY9CC2Tc2Y9itn6I/UodENm5yMLAn1kvw3Iy+IavfZT9KEdM6YgkXTSnX9FiBBIZnOqT8COehSWfk+fjeiX/LH015KxvO3XLA02PR9ZuRn5WmcPgTUH0GM/j2Cs48gIKCOddLdFxAiBtGSi2lGrR9HS762H0KPfskPT70nHt+Rdr0IvyUdOdkAyNdZrfy2C8TqBrAgokk662yJiBoFlm1nJXK16FCPkjeofaYNaOvuoA1JD8Cn5yJWnQS+BJQl77K+Fz9q0oEd+NJlmJJ00oyTVzPcQsgisjVnZ/556FC39nnoUvfq5gx7JhpWcUdcAPCXZluUjVwjcm8ElO2FEXoZRWjWdWhSghWGep3A0nTRjCjE7gtAKwlhzWE89itYc2FOPwiKwpx5Fr37rwWmVxPMUZR1ZhPx0oWX5yAH9mfJy6kEk6JkGaOGXN5KKpINGpxArfoU4Uz2KEQcU0d/jAD32R+4/dQDSE2hmPnSmPF/E9BbW0OTlAO6JYkbSQaMRRMSBZEYDqEcxvx5FygDkg0XmJx+t/0h57xQgQ/8jmA4aceBRB5LxJinqUaypR5E2ADPykVflU59FPiusHpVdEYE8UI9ieT0KAADuDuxPDwA3JP0D+9MDwD3Jj/3pAeDmDgD70wPAjef82J8eAG4c/nteJdT2p+dOoEXgmgPI2p8+9CokANzRAUgCay9x1Lan9hK45gQy9qeP5GOPrkEAwCUcQCuVcNb+9D1P8Ix0SCwiArd3AjTQLQJr5LH2p29NIaztqVsRyJH52FhEBLAQ6EhHtBYAewhsOQCtCAj/zLM//Wg2V0ZNtwfeQwB2dwK96YjcAXgJXNufviY/a3/60SkEIghgewcwko4oCSzlPQTmZcQ0+Vn7049MIR74FQK4igOI7E/Pi4BKeU9NwZb+HfanH3UgAHAqB7A6Hxv702MKASxcDBwh0BnkV97/mfanBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPbDT8ZuKtZOoFpJAAAAAElFTkSuQmCC`,PC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAACA0lEQVR42u2ZMW7DMAxFPXb02CNk9BV6hIw9QseOXTt29DEy5ho9QseMGTt2aCEDBBiFlCmJsGX3f4CIYcVO4P8kk2LXZap/ePwN0UH/T8H4z6/vKWIICAwJkNQYtEHz3z7ON0aG459xnOI6PE1B4+GTzsVj2uoyF9ZVCuAtbD4HgIyOzad47w939zm9HEyRMnP6P9fXu7icB0Dgbb42+y3BAeDmj886CHxMMpObHwyXAhA4ms8ByDFfAyAYrBlHQRCIIEbmh+9K9wQEhuzeYr72jreYHwNAZvGIjeShAcCvkY4BQAIA/mAJgJT5JRDE5tP10mxPLec5AGAFyISAHpIVACsEkvlaAsiXdG08BQBeAQ4QWM23QKCZnwKAG1YCAF4BDqtAyfU55qdKQMpLLKUgcgDnPKAGBA7BnPlxFTC3B5CqAqSZH5svJZBQlInH2XnNSjBnvhcAqWQS5heYr5WHNaWl5fetkXqdWEtHSCkB19yH8OgHoBdQaACeArTILMaT2qn5Ht08aIMz2CuLhzY6gz2zeGhl80v68eH4OPRZAQAaBKC0H08ATM2by/H2UzgHABreCCrpx3v086GVAajpx3v086HGEsCcfrxHPx9qEABrP96jnw81WAJa+/Ee/XyokSqgZCMHG0EAAADssQy07uRhJ3AnENT04z37+RAELaQ/XB4qqh2dccQAAAAASUVORK5CYII=`,FC=new URL(`spr_player-DOTmU2j0.png`,import.meta.url).href,IC=`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAG/ElEQVR42u1bPXbbTAz0UVimVOk2pcocIaVKl2lT+gguc4SUucZ3IH0PtIYaDoH9EUlLiYH39lnkEktyZxbAAvTTU0rKZ5dhOJy5HQ9+0+ui8Z6fn89ee+hJwEt+//plaqVzqmt9P77NG+vxeW8MDxCd+D0AtL/fT6exRe/B7zNec7neeyYD+ng8nn+8nM4/X1/HZr/tXIkEtTnZGufFyV8vX8eH/fP6bWz//br+xW9rdo1dy4PYxNg51mU9HcOuNZ0ITJtsHs9+2zlvwhlAkM2u99pESALQ2tvb23hs99Dn13exa+x6a/o8I/kEfCWB9w42l3jPPUkAnO1es/vgATwAdQLQlAAlXY8EHgEYfLVAEQkAoDUlDT8vzlljAFUfze71+/efseGZPP3Zs7+cJqDx2zun78DATBbyeAxbtBBKOjYmCL4gmpr6kgn03AAG52siXXYD3ksw+MMwjI1J4BGAgVKwFFQGFgTwXID1Y/IwdskFlFZ/qxXQ+QHRuNl9zZXove2c9Xk6is9i7sEMdQG8esEcuADTUQsA8NCvJpxNu1oA+G5YF4DPJLj2zV8egNbcEJ5FCWCThHPjhF1AR/AGMuh1HgFqLsAjAEjIJLC/3qqOyDeR2LEWPCYIPHsGBcubQDWjSgA2YQw0rgU5vBiAAzeYJ48A6GMSeC4gcj/WPBfAEwbQQQKAz+dLQBbNcIv5JkusgStWeYkAsA4cEM8st/cc93YBfH+QRV0AiKT3ZwK0ugAlQNR4sqLm7QAi/WgnoMTxdkDqriICRDsi75kWQSBcgE2WZwHYBURBYKTPv9UCqOmLdgFqynTyALQGf2q9FJjrqhka22Hhh/VZSr9LOxmQE9aHXQ5igBIBbtGfRaHsQxlIndzWbSCbZR4/IgDI4VkQtQI66WplNDicLNgOBNBdgGdNol3AFAOQq4ka4gCPALfqP6mvaHEBPAAnWyJdTQIxgfj+bMJ51Sr4GgN4QRzYXgriAE4vAXg1Mwk5EaTbQI4hFECQqqWp+1mr/9SSRfN8khcDeNlD9tteDMD3rbmAZRA4LAItBEsADMHRMiC7xBiVwC0O6IYZATC5pQCQ44SHI4BGjNHvGgHYirBViQjgkcBrCj4IgFWpJvf9ZYcgkFuu6r42TARgEtQIEMUBD1EMuZUAvNf0XAnOgQDY47rRcMWC+HrDdfVddDXw4mcHMUr6EQE9fd4BeCtNffBDFoZ6CbAIYqifXUHkGqJVELmiUkGIV3C7CxvOW+lrFdDLKfDxX1EixdbOoveocFPS5SCuV/8jRYO13tZaoWx9HibN5GLvQR4DDdu4WwgQbflKOmuOH4kAs63p6T0t3EoCA9l2KKaDMey3nfswAsAUIg8Q+d5a2RGWoFbiBNkAau/xKqKfygDX+iMQsS9vBY8zfagdcLNznOkrWY+adamCj8IEkjluAaFCAAapRADPXfQcb0GACOTpO4PT8lyNAFjByMC1EIBXPid3YFFApuhDFOxMvHvV+hflVaxirGBUz7aOATx30XP8iC5AzXiJAFiVWPmcT2ACIC6AJdDVrNtaP1CO+10CsAXoJUBrDMBbQ80VlI5rlmUNAXjle1agRgBe+QCNg7oSWQAq4gfEAbzVjNxKDdwq+J4LgAXodQGtMQC+AgIBWo+3+oYuAl/r+SCAEqFEAAYrIgCusbEUfC7gMAkQE0Rjrg8AL3VpDgJ7Mlg9McAaAmwRBEYr3yYYZhYE8CxBCVS1BOF8XWoHuAZ6IB/r67W77wKutfn21dYTA6xxAfxRijep3HpdgEeAXhfAJOghALsFNfcfQgD143vmARRg/S5Aq5N6HE2o+u9owkoE8FzA1jEArmUXoN/3IehjF1Aj1SYE4M+pe3VR0QNovQSoHZcswLXmfa0GRpPlAbs2CMQKBviwJqUtowaBugvQINAbc5M8QFTh6/3+XM12rwuoHZdigF4C1JI9HjlaE0HsTmrbQJCmtA1ki8BjbpYH2IoA3udbpSCQK4ZaVNKPUaL/UNrKBfRkBmug8t9a3MWWIEoERWnlzfIAXoWvt37NujV9LtVOZdzDvKyrYzEZ9ggCt6gFcEnY+36wlApGTMANK79eFV2ZB9iSAAxiy7cIs69XD8uvW73jPfIAay0Ag85EaC0GsSVoiSN23QreMtEM0C0Eulc5uBbwef3/bDn4XlIzYU8p/zb47zUHP4iJ+pJAGwKwJohY0w+AawQokWALAn1q8BGARBOIQCTqX6OPf8LEP2X29m9BoE9PgOs+MwZwr36OfiMC7NmfskEqcW0/ALpXf0pKSkpK5gFSMg+QeYDMA2QeIPMAmQfIPEDmATIPkJKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKS8nfI/wIrSo6lGBhTAAAAAElFTkSuQmCC`,LC=new URL(`spr_shaman-elite-D28DqVmM.png`,import.meta.url).href,RC=new URL(`spr_shaman-2AaWT7pY.png`,import.meta.url).href,zC=new URL(`spr_shooter-elite-B6SdqRX0.png`,import.meta.url).href,BC=new URL(`spr_shooter-Bn6LfncK.png`,import.meta.url).href,VC=Object.assign({"../../../assets/gfx/spr_archer-elite.png":mC,"../../../assets/gfx/spr_archer.png":hC,"../../../assets/gfx/spr_brute-elite.png":gC,"../../../assets/gfx/spr_brute.png":_C,"../../../assets/gfx/spr_bull-elite.png":vC,"../../../assets/gfx/spr_bull.png":yC,"../../../assets/gfx/spr_caster-elite.png":bC,"../../../assets/gfx/spr_caster.png":xC,"../../../assets/gfx/spr_cave.png":SC,"../../../assets/gfx/spr_chaser-elite.png":CC,"../../../assets/gfx/spr_chaser.png":wC,"../../../assets/gfx/spr_clutter.png":TC,"../../../assets/gfx/spr_crab-elite.png":EC,"../../../assets/gfx/spr_crab.png":DC,"../../../assets/gfx/spr_dragon.png":OC,"../../../assets/gfx/spr_dummy.png":kC,"../../../assets/gfx/spr_fire.png":AC,"../../../assets/gfx/spr_fx.png":jC,"../../../assets/gfx/spr_imp-elite.png":MC,"../../../assets/gfx/spr_imp.png":NC,"../../../assets/gfx/spr_items.png":PC,"../../../assets/gfx/spr_player.png":FC,"../../../assets/gfx/spr_props.png":IC,"../../../assets/gfx/spr_shaman-elite.png":LC,"../../../assets/gfx/spr_shaman.png":RC,"../../../assets/gfx/spr_shooter-elite.png":zC,"../../../assets/gfx/spr_shooter.png":BC,"../../../assets/gfx/spr_slime-elite.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAC0klEQVR42u3cvXHbMBgGYI2QEVxmhLQZwSOozFouU3qNlClTahDmIB90MEWKsogP/NHz3OHiyL6PNCS8BAEmhwMAT68bacDOB2j36/DS/fv7+6O9H7u3Hy/n14QArGDwBw7Q7jXVfj9+qp+P8SoEmjqdTvqaZgO0+374dq6Ta6ZQyS29nlr6GSEQI/e/ADBFX2KAngMkB0mqU7byezV+ly2vMaSBOdTm1s39m0OgX7Pof55wih49QC81+rVzqxQA0WsM3UQLGfw1QqDs6/JY6ev8npczhL0uQpmiLzNAWwRA9BrDVbiU9WuETGQA9ENgqO19ESo8wSP7pdUUPSoAUo0/x+tZRj5u+t6c82/RP0PhUjNkIgMg9/3Y+5vOfelbgK0neHdnW/UUPfAe/eP9fft5qZXrptdqzWACzv9muNRcyIwKgDJ48yDv3wKUtwFLrAdsPcFHw6VSyGz9Cn0VAmWrEe65D271z4PnfzNcai9kRlz98+9eDup+/ZHPUtur/0YTfDJcKoRMs3voNND7AzS99hp/Gza77lT/RIVvzYXMmgHQP++pGUY/JBYJgIDOjUzwu8JlZsh8mprd6p8Ke+mbXSNp8fmJDoDatwD9z0xZY6juogEQOAUdrV3hGJer5r0B88DVdPIYM2rvZodko5+fJmsAQwt8Q7WXXgiMnIKO1q5wjMnaLY7xxIN/65+fJrsA/cFd1kx/rmEXIHoKGrpK/8W2tvPf1UxgZI+7i6pd8RhhTwIOHefW34EdEwAAAAAAAABAS1EPPwAAa/DI88dreWYZEADAnuV/U60nIMi9/yvp1M9FDFYBAE8cAEBlNbf5bBnCBgd/jYE7VafGYqEFR9hIsOgF2Lm8DWg7EISAAAADuP35exdhZgDoCQBgHg8Bwc58ZWtPAMDOBr+9fXD1XwWLlgAAALBtFhpBAAAAAAAAAAAAAAAAAAAAAADAU/kPXTX5NAIcnsYAAAAASUVORK5CYII=`,"../../../assets/gfx/spr_slime-magma.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAC1klEQVR42u3cvXHbMBgGYJUpPYJLl1nDI6TMCF4hZUbIKF5HpUdIwRzkgw6hSFEW8YE/ep47XGzJ95GGhJcgIOdwAODhdSMN2PkA7X69HLq/738+2+/X7v316fSYEIAVDP7AAdr9fD6capb18zHSc0KgnePxqK9pNkC770+HU51cM4VKbunx1NLPCIEYuf8FgCn6EgP0FCA5SFKdspXP1fhdtrzGkAbmUJtbN/dvDoF+zaL/ecApevQAPdfo186tUgBErzF0Ey1k8NcIgbKvy2Olr/NrXs4Q9roIZYq+zABtEQDRawwX4VLWrxEykQHQD4GhtvdFqPAEj+yXVlP0qABINT5+fLuYZeTjpufmnH+L/hkKl5ohExkAue/HXt907kvfAmw9wbsb26qn6IH36J+v79vLuVaumx6rNYMJOP+r4VJzITMqAMrgzYO8fwtQ3gYssR6w9QQfDZdKIbP1K/RFCJStRrjnPrjWP3ee/9Vwqb2QGXH1z797Oaj79UfeS22v/htN8MlwqRAyze6h00DvD9D0WMV9+qjbr8n+iQrfmguZNQOgf95TM4x+SCwSAAGdG5ngN4XLzJD5b2p2rX8q7KVvdo2kxfsnOgBq3wL03zNljaG6iwZA4BR0tHaFY5yvmrcGzB1X08ljzKi9mx2Sjb5/mqwBDC3wDdVeeiEwcgo6WrvCMSZrtzjGAw/+rb9/muwC9Ad3WTP9u4ZdgOgpaOgq/Rfb2s5/VzOBkT3uLqp2xWOEfRJw6DjXvgd2TAAAAAAAAAAALUV9+AEAWIN7Pn+8ls8sAwIA2LP8N9V6AoLc+r+STv1cxGAVAPDAAQBUVnObz5YhbHDw1xi4U3VqLBZacISNBItegJ3L24C2A0EICAAwgNufv1cRZgaAngAA5vEhINiZr2ztCQDY2eC3tw+u/qtg0RIAAAC2zUIjCAAAAAAAAAAAAAAAAAAAAAAAeCj/AMgZDGvy95PjAAAAAElFTkSuQmCC`,"../../../assets/gfx/spr_slime.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAC2UlEQVR42u3dPXLaQBgGYMocgSNQcoWUOYKO4DLXcpky10iZkpJDyCMN4EUWCKP9Vj88z8xOJhB/K2/YV6uV4mw2ALy8+kYDVj5B6x+/d/X/w5+2/T281T/fd+1rQgBmMPkDJ2i9qXZtzbT+uY/mPSFQzvF4NNYUm6D1Zr9t65xrNqFybs3rbR/7rRCIchp/AWCJPsUEbQPkEiRNnbSl7+X4Xha8x9BMzL42tu55fM8h0K2ZjD8vuESPnqCfNbq1Ty1TAETvMdQDLWTyZwmBdLyTvtr3Tn/n6QphrZtQlujTTNASARC9x/AlXNL6OUImNAC6IdDXVr4JFZ7goZO/1BI9KgD22/rtX88q49Rv896o4y8wPn3hkjNkIgPgMva3Jn81/SXA0hO8frDNe4ked43efv374ddnrVPd5rVsK5j8x383XHJuZEYFwFXwVrv+S4DkMmCK/YClJ/jNcMkUMks/Q38JgbTlCPfLGNwbn+eO/364ZN7IjDj7X7736vouwFX9/s9S2bP/QhN8MFwyhEyxa+hmoncnaDv5q/DLsNF1B8cnKHxzbmRmDYDOcQ+uMDohMU0A5B/cyAR/KFxGhsz10uzO+GS4l77cPZISn5/gAMh9CdD9zKQ1eutOGgBxS9Dbtcf3cTlrPhowT5xNh/t4vvZ67pAs8/NTZhOwZ4Ovt/bEG4GRS9CbtTP0MVi7RB8vPPmX/vkpchegO7nTmu2v1TweBIpcgsbu0n+vze34V7USuHGPuw6rna+PsCcB+/q593tgxQQAAAAAAAAAUFLUww8AwCw88/xx5YcXggAAiHb5N9VAkEd/KunAn4uYrAIAXjgAgMxy3uZzyxAWOPlzTNzBOjk2C204wjKCxSjA2lXJf3Dg7AwvHgKACVz8+IGRAQAAMIqHgGBlvnNrTwDAyia/e/vg7D8PNi0BAABg0Ww0ggAAAAAAAAAAAAAAAAAAAAAAgJfyATrmPuP/kLp6AAAAAElFTkSuQmCC`,"../../../assets/gfx/spr_world.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABACAYAAADS1n9/AAAFIElEQVR42u1csXLbMAz1J3TsmNGjR68eM3rMJ2Ts2LWfkDFjx44d8wsdM3bMh6gHnZ8OoUESJGiRqvHucEkoQaT4nggRpLLb/Yc4fjtNZDtH347s4U/n/3w/z2YVQW374RfaVvybdGQP//3pMD29PC5+9DuV1ZJf0346l7eBt0Vznd7+TTqylz+d8/3X4yerEUBt/eh8qjckgMpyJPT2b9aRPfzpON1c6EdlpSKobf/59HX6eHuaXp/32xFAWFDSkVJssRJR40/l+/NxvkF0AG54fnrPR7UILO0nARD5ZKF/KYGr+fMYV9KRUoy0ElHrD9JwXmgl4rO2n0RAxv1JEDQyUHnOn7c7rD8Xiri/RL7oz2OctiNjMdJKRK3/w2G/vOlKPmR0jvbpb91+jAoaAazefzzGaTsyFiOtRNT6z206H6fY9IeOaQTQqv0gG74YFW51/1I/iORL/cBjnLYjYzHSSoTFH76SachvIST4411gzfsP+0DyjQqAxzjeCB7j+bFUjMz5a0moIZKOk4EA/F0yA7AKaXP+t4jx1jxALZHcB8NwqQBaCGlT/reI8dY8gIVIOg9+NeS3ENKm/K/iRGYenItRrRIyLYi0wFr/Zvx5jNbOg2MxvmVCxrESRsoDODpgpDzAVWLj4ctE5izV4fnxYSJTCaBFjG+VkAH5i7gqRXDPG0OIeEo/kyVF0DTGX0YBSx4A5IfXLxVBy40hWyT//eW0CIBeBKMiaB3jESJM+wHY018zCljrR9qWDL/Tzy2SDwFERTBaHoCIDpc1F3EqRWCpH4TzPD7qH10EEvkQAJWLImiaB2CjRE0eYH7pC5ZEw6XQnAis6/lUz++3H4vxvyGILZFPRuWwKxE0ywNcyDetp1+e/tQIkxKAtX4il5Mv2YgCSJEfCuBKBEPtB2ACiI4yGQFY6r+VAFB/qR+WkXPnpMiXBAARzNceKQ+AEJAMMQkBWOu/hQDCEFJCPshK1akRAN4BkgIYYT8ABJC0jAAs9bcSABdd6K+ZknLycyLARtTUk49ZgHjNpvsBGuQBkiJQzAIs6+mYAcTI18wEwieeX0+bj8BqHicq1vaYAKQnXhTAqHkAMsTA0pRw7Xo6n//zHEBYpiGfi6D0HaBkOVcSAEIC+g9lXARLCBhxPwDIRy4bIlhjPV1KAmnI37Ft2eEIULOUWyIA/g4AgiUB8HCwCGCkPEAoAjS0Zi3Asp6OjgtNm4LmD0Xt1E7bfi4ATn4oAEkE8z2NlAdwlCN8wnkoCAUQimARgO8H8P0AQ+4HcKwogNH2AzhWFEDrPX+1eYDYy1fNy5ijME/d+7sAKfsVs5QIMHWMmTOeSFv2zAPweW/OYgLAqljKbiWCnPCGFWLr7wJSawW5lTjrCKARkWX0iJFX0nbNKLYqPuXLC2J8LNdemwdoMQJYBGARIM9aam0YAfBcuTbGx3LtljyAhgDNU8xfFnln514gLQIs8dXcw+oCQK5ZG+NjuWpLHgAE0fWwC5gb/tGChkh+Le7jAkiMAKXr6VKu2rwf4HRYcv+SzceM7xGpEFA7fG86BEiLEL2+bydyaRUtJoD5WGZLWe7Jiy0s3e0IECOxx/ftRO7fjz+iCKiMjrkAVhJAj+/bkUAioiXTJJS4aDDc8rKcr+QTlpf6aq8xnAjW/r4dAuA7acLdNSUfmJTuJ4j5aK6VO8e6v+GuENuTV5TfcAE4HA6Hw+FwOBwOh8PhcDgcDofD4XA4HA6Hw+FwOO4R/wDTB994bPmiRgAAAABJRU5ErkJggg==`,"../../../assets/gfx/spr_yeti.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAABACAYAAAD1Xam+AAAG1klEQVR42u1dO47dOgz1MmYZ2UbKlClTZhsps4SUWULKtFnKK1855RQT+AIMCIKiKJK2rOtzAOPOxzR5KR1aP0rbdgBeXl7etWs7CbP1w/617b+qH5cowP2+t7e3d/rkP488Y1X9V7B/dqVd2f6rEHi///f//z0u7sfD9WcLkO7lhtPPI/Kr659l/1VeADPtvwr5owQmWenHyDOG9VcQSBpNzziLwLP1z7D/9fX13Utgfu8RASzj/2cif4TAmv9GSZwKIJkC3P//5+e3f5FHXvv/Ig5YRX9GnkjqsV8+Zyc0kdpDYH5/ZQCr8P8zkT9CYJLffaX58tAAki1Aqpzfv35+fH759PFx8b/15FfVnyGwJKtlv1aQWgCwCNwLAJkAnPH/MwWAKIH5M3bf7Z/cn4cGkEwB8sq537tXsP2T/2xFIf6WsvT3mq5R/fw5PQJqBN6dTfdY8vunDCTcdo/9Gpl5AOgRWMpUBUBuv3aNvAVXnwWJElj6cpfhdeCwAJIpQC5LiikC0UXGaM+Q8i39rYqQ1a8FQO2y7CeC9AhMBLO+/4j9nMxeAlsBIPIC0Owne0ifx//PMoioEZjXYa8s+ZLXh4h8V3+2ADkB6FlkOF0k0yIAl2/ptwJQRr9WaJp+y/5sAJJ995b9reY/t7dHYC0AcOL1AqDH//L79/z/LIOILQLz8vE24bW64G0Fkw9d+rMFKJvAsvBk/1ZrAkt5Tb8VgLL6peNa31+TzxBYewNb9rcGAOnqEVjePxIAreDF/c8rPl1UZ1r+qxpDmL0OoUXgkTd4qy5HgodLf0UB8r6aFcGtZiSXb+m33uBR/dJxlv7eOMgogSvegJLULQK3yM/rANUDGQD533rl9+HHz8f18fevx0W/W/6v7ELMbEG0COx5g2v1eHQGQfLYrT9TgPI5lnx2Gs16g0T1W46LTANmv39EXpJbEtgiv+YDqd/je9mVIPleH76qC3GFWQiLRyOLeHi5e+U13VLetQ5gtACr5bMBKKLfGwDP+P5Ref4Wly0YTxNUvn24fu9ovAwkI4Ej04KoGoOoCgK83KIBICKvld3wSsBIAVbKSwJ4pgEr9ZNslMCz/UeXjPxn6Oc2tH4/IgBWtmAruhDSb5F1/BF5PosVLb9UAVZUAFkBz9SvzUOfSYAj7D9bf1Uzuqr+HN0C8X6PrB9WKb/yCgB7AGBixV+VALAf9Rb7USS+xJR85CL5CvtX9/8dCYz9KAoC0NR85AL5CvuvQP5V7c9+d+xHMW8/ivn5yBfIp57Zgqm0f+UAgP0o5uxHMTcfuUjeSs29egumIp109QBQsR+EJn/mfhQz9G9V05jT8pELCMyTXciWEfvlijm6ZrSAoumkK5M/QyC5hFarO979IFbTLzljybtXA56ajyycwJfljsrzADBqP+lsBYKztnSKppOuPIuQIZCVg6HlZFh9Z0u/p8wi+rWWo6bfm4zVku+uiZiSj9xoQUQJLAPAqP28BdMKBEe2gDLppKsOImYIpGVzapd3P4po8Ijq9/rAux+FdXWXQk/JRy4OQLLZ7rXfasFEgkC2CxVNJ11tELGCwDKbs9UH9uxHEQlAGf3eAOjdjyIagNTmxCn5yJ1IGCXwSNOrN4+qBYHReVjvWvRMOmnVGMKZ6xAqCCx9JlteI/tRtPSP7Ecxqr+lx5sNK7swLXnXxqBT8pE7lS+6BiG7jkDm8nuCQKsQsmvSR4NnZkeaM1sQWQJtxftRWPrP2I/C0u/dj8KSdxXItHzkhP5KeS0AeVsBmjwfF/D4MZsOGu1CzJqFwH4U19iPoqQCktE8nXN0Dn5WPrWU52mpno01LPlIWmckHTTbgsgGkKqFQNiP4vz9KEoqoJSLTmHNyKe25L1dgAr9WzIdNBPAKwJIZiEX9qOYtx9FWQWsyEeelU99FfmqZnVUdkYLZMN+FNP3owCAW+P2+1HgfHoAuHH0w/n0AHDzAIDz6QHgpgEA59MDwE0HPiLphFc8nz6ajw0At232e9IhVzifPpqPDQC3DwCjKZlHnU8f2RChIh97wywCcOcAMJpO2Dqf3iJw73z60Td4ZTokBhGBWweB0XRC7Xz6HoF759P3CHxEPjYGEQEEgUA6oXY+vUVgz/n0kQ0ZsumkVWMIWIcALB8EsufTt4jrPZ/e6kKccT59tguBFgSwdADInk/fIoD3fPqW/rPOp492ITALATzNWEDmfPpWE9y7G46lf4Xz6TNjEAAwPQDgfPr1z6cHgPRgYIRAG86nv8z59AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBC+Au3VYUZFl8+tQAAAABJRU5ErkJggg==`,"../../../assets/gfx/tex_basalt.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA1klEQVR42u1WQQ6EIAzsEzz22CNH37gfd4MJidtFcRhADh7GRGFwnNa28rFlSzC1Ldg14p4jh+VLvKwhPIY/AVElcyDK/xFwtKr25Sh/vhCglrIh2wWcHeLtzFmMWJ7jwyFonaTwX9B6XVIBSfD3HqV1U4X4cwhgoKo7LIP4vMQX9osV/GIPGW35nAIY+Jj7nLiVAz1hJwmaMLwSPj4PXJbi3vNAVTMa0o5HNp+qeSCto/PAnf3vPAC3Y7b00vOA9hCA9Hu01tPzAGt5ac8rQGr6vTXMgS9UbuKwboFfFAAAAABJRU5ErkJggg==`,"../../../assets/gfx/tex_basaltcol.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAoUlEQVR42uWUwQ6AIAxD+QyOPe7o//8cZgYWQMC5JWriodz6snUNIcaYWLip4gv8bEQmMSigB2BhwhUAlUZmaCZwr2ACQGnqVrRNAM8VRoCjRECSVRRC9kiRCkQdXjYLAAZAqXMoZgGsylQDMuQMUISpA9DrgEUWDaDpgTaDvgdyRhjO6AY0GYBUkHmI+NQZHwNMe0CWHpC3Bz/9D6IDwN4d8gjgv601C2gAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_basaltfloor.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADvklEQVR42u1bubLbMAxk+cqULlGqzG+p1C/kx1/GGXuGpkHs4qCsSVKokGleSwJYHGqbyLf1CGgf/6s9VeMz/X9u28uj/fb8/f60fx6AQ75SCxQAwI7Gv93MOdD67uNbIFAAzCY5HoNrm0SnLo/N3Re4d+OM738AeICgjf1Lfrys77necTxt/fe+6Aa1LXkFPTeGFYvZSXqf2an3bc36UzUAW3Dz0bXNxujf3wC4XxtrYrjB2w3KLAPQbPFIJ4ztEIBRZp6PdYWn8v+U5wGEqfw7rUavD2YKdzd02lQHaGj3J29dwQozhjZuiUF2fhOA8cr8lQBoMu8CAMg8enbF1HoA2B3XfQoAYy9ndni049SJd//v9UJkfk2vuABgqSOrhdHJZc3gETxxTadNeUCFDUZE5AwewFBjigf0kx9JOy7EFa/kARAADw94yl/GlmtcYhzf8k3G9n481D/sC1jXT8C1y4pChnozc10agL5/VO6Xe4MzE8b6Fkhmx/7MAYz90wDIGMCY2HFRuPuoU8Z3S2aZ/oz/YPV3u8NSQD8tu8z4JpaIefuHAMj6+yz1PqPdBYAU+PvI98i2IwDG/i4lqMXvNH98N+y4pZQQD/H6LUz/lqWdXiIUmSd64kz/liUqkgRh+7DOgACIw5/3JkUuA4DrdAEPQEBoXD5Df7NmudwKsN7eqrC790adzgOkOBFTDsDquP9emIuMxiinOkCIXF+vA7TNWTph1s5GiAVxEbA+2hmSQB4vYiY940tR+p22AlcDwBrPKzIuALIyi0wkCokLAgFc9x3EGxpSKFp+fxaT2wL1Ad78voD4hDb/WF9AxwNWyKskXOZK34TmARk9kJF5RG29c9MAZJkckuediOt7ub02v0XFXwDwbALF3NEpWzmFfvyoz49ETlt/+zQtrQihReKXoYjQfwAWeHdMfh/F+E4FAPn3q/t744QC9Fj7RElMpTvrDeG9WQFkZrYL+O/RvF84IOJ5r64zZEygtfnDyTNKrQBbZyjB/ixPOUBe4sUX2BaaoauY0ZL6gKsCsF0dgOh1ruIhqH05E0T1AJ74nVVXxOqEdH0A665eXVxS3wtEUlHVi/9YYiQLQPYbJUSEDmd9wqne4FudcVGk2MsDTo8HRMvsTkmNXZXIrFKcrvQ4a+ZWxQMYAI5kPKFlsz+euh1x1hlmeQCz3ha9sh5TNyYrorm8bAittwIlShBt/hPfErNmegpAJNs6+9x2lq5aWT/A1hmqAAhRC8jE/acJ0SF/760zZOZn6gz79t/sWNDjQmkZWAAAAABJRU5ErkJggg==`,"../../../assets/gfx/tex_cave.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABoElEQVR42s1WIXLDQBDTs0oDDQMDAw0DTQ0NAwMLAwv7OXf2JkqVnT1nPAIt0Phu96TVeZzs4jLd1grTcn9Z677K59xWXoGKVK3nJDI/4u9yW9ovBtSpHhinaxNkkdiziKLKcd/TbgbO4/xC1uc0fzbQBOO6Z0HGda/8qkbUbgZIVsJy+26Yr18NmlfRbPZp+MGjTtYPNAPH01gWUzJJ8eSZWIdAIMd5VnUrU1G7GdDDLBhxFuAZJUf8MJwaYq3FevyqBobjeQ3ERhHCXDOv5IjRQKy1gHKylmoG8HEY1oASVJwFsslsoBLPGppnXWiAB/XD5A2yiZ4BLR57/eAY1wsjC2pxJWUTlYF883wZfjdqGPqa9C2oGOOaYzxz9mgFoISeYI7/vsaxocpt6agJ8KdCoYyIV3nGt3LvNJ//hH8JjJelm4ycopffy9NzcPu5O0/A7efuPAG3n7vzBNx+7s4TcPu5O0/A7efuPAG3n7vzBNx+7s4TcPu5O0/A7efuPAG3n7vzBNx+7s4TcPu5O0/A7efuPPE/54E9/dydJ34AhcohsEyH3LIAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_cavefloor.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEEklEQVR42uVbvZZiMQjmsba1tLS0tLylpe08wr7w7IkOHhYJAQK5rlvkODNObsIXws8HF06ny3cb5/OWMvB5bRyP5+ewriPN9Qy6vmVAluAaCPT3CACX7eYWfrt+dYWm65UDoC1uAe/X4XgHQAOBr9GEb+NwOA3XLAGgDboBKwiSIJften9O+6TC9YRuP+Oc6/Xr+3b7vQaAtlAb7UTw57aJHggcCP4dzkXBUTAUTvp//B6f3QBALSkHoC2CC+JnA0G7i56rMjN3lyvQQEAgvEJE7Uxkn2UAWDctGbHIM6N72hWASJygGbWRwdsdgB4I1tOnhlayQfj9WwOg2QLtFLlxpf9HgeF2Z6QhSwGgG5CER+GaEJpx5VoQnVcOgBQb8A3Qk6enWOGVJO0Bi7pmxwZcFdEQoutc4ZrxIMB6V6tig70HVAca7z7Aa6X/SwBoPP/xAEhZFk01PxaAXo4t5eORkHPGk8ysN5oPEoMSycerhOcxhCfc1eY/OUEUkqt65phhlfBgeDzhDcTofHqAgMlIA0GjsVaDwFmemUAMgyuRFZ6hlL209GzCVJGJwkgAPhGvSJSrr6bVvfUK8JwgvZORAsWKuoIXhJcr0DOC3Fj2ePps9a8C4HkFpKCHuj4+Hkbpdi9YZJ46tdwznOHIRb4YQUm9NQA8xi8atOA+UNOsz7bGDFTLgQc9I+GtAMyQJzT6bJpmuVY9n89jBmSG0N1DhuvLuKe4YcsB9Og0C6HCQQFr0SLTzUULqxXRJlgKF9l+vgKAtMqQBIDk8jybsCQve+UcQwCwPm9JkkaWuUrwGRBUALYfg/IAQa/PS4sjV0+pbp6OVgMw5AO0TKwNfIiXD6BUN/5Nm18BgoVPAG8oOhvbW6rDWQBYYoMwALNGLaPDKyM2CAEQFb6izW3WILoB2AylK03oUcvbiI/IBsJVGEEPoHFy2ulju5uUSY5yimUa0HNRlA/Q/PqIT+j1/WU2SoXjAFpn7z28V2dvw8oncFZpppeQD3eHCJ3oqc9rdFkko7OeoDaPaqe1hvDCB0SE9/IJFS1yG9FMSw3hhRHK9PEragbSIVgbLMS6QBUAqxqtInP/YoVnOrqzOMF/EoCq0/eyu9GiC2RUb7JPXmuIzH4fAXrRl7YBjxpa6/vUZVErLs2Nap5YHJXCXHoCMx1dnvq+lLn1+v29Rlh9Z4iHqqOePs+9tXL1q0hTFQCuOt6evl4La3bzYxkAWa2oe71zEOUadukWn+n3jwrfA+FtAIjS5x8BgNbvr70MmfFWKWSraKSnT+r313iELOGHAFj6/Uf1+UiHaY9Iebjqm/lVWgvRChn9/pIaUwpttkeIB0ONVtN4RQ/DDF5X13N31OdnkR0r3iCHirQ1++3xytfn/wDlcS+P81TqlAAAAABJRU5ErkJggg==`,"../../../assets/gfx/tex_cliff.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABsElEQVR42s1WIW7DQBCc5xQWhgYGGhoGGhaaBgYaGhoWBvZzrvaSscbbsytrQAtGvtu5nZ07WdrFbTrPNQyPy2qt+xqfuT1egZx0H5uVANfjiwtEfHzFyUWMvHJ72sUABUnqt2Boi+BiYGiXIooax31NmzXR980qWb/j1BXQxMLr/lWQcd1rfq1G1H4aoKgkPL5uBdNnX6D8SjSZJcc86vwwNLRPA9fuXC2mycsrTN1yJtYhEMhxnlXdmqmoXQzoYRaMOAvwjCZHvGnfC2KtxbbyazXQXk9zIDaKEOaavCZHjAZirQU0J2upZgCX5m0OaIKKs0A2mQ3UxLOG8qwLDfCg/pi8QTaxZUCLx15/OMb1wsiCWlyTsomagXzzfBn+N2oY+kz6CirGuHKM55wjWgFowpZgjjPGW9S4PR01gY/7aQ5QKCPiNZ7xPe43zcBi4K+Aftgmg1Ns8Ufz9Bzcfu7OE3D7uTtPwO3n7jwBt5+78wTcfu7OE3D7uTtPwO3n7jwBt5+78wTcfu7OE3D7uTtPwO3n7jwBt5+78wTcfu7OE3D7uTtP/M954Eg/d+eJb+AV9iHf5dHCAAAAAElFTkSuQmCC`,"../../../assets/gfx/tex_crate.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA0UlEQVR42qVTKw7DMAz1EQYLBwMDQwsHAwcHCwt3hR0hsEco7DV2IE/P04usVupHAU/Oc/1eY7uV7tZpC6TZ4BGjAq8+1EjscerMYPlkwzT2Fr/TH+CIzIGzBtEM4OaTawHN/AsYoZV4T/rOwYAEz2c4tJJS0mEYDaUUneelxjWQB1gPrYQQFAC5AuqshaOpI/qbMG8tkKAnnH2v5P7abJXPhUV7Q2O/eCNnVg3ObOGZs4kJ8M0W/OTXZ4pQR7PNFo424W9weQv+2/c5a6H1b/wB2OjcGjnHdSsAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_dirt.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABSklEQVR42u2bMQ7CMBAE72uUKfkSz6CkTJkyLQ8zcmEJkJDs+MT6nCmuwzl7kGBv17Hb45JybeuSntu1qu6PJZV1tWt+lbq/lealahblz5VNeABQ9rcW8qV5y2Zrnqfsb14P+hcA77J9XdIu3IS6vynpj1AAAAAAAAAAAASuXiF1OgDfUjo8gDwU9QxT4QHkQxQIR8ZpG+EAUj9gBABSPyD6j9jpAEynA/ADUIIAAAAAAACAcwJQiyA3AEfl6RQAWsfRd1h53RQACoSWb95rmnOJx5XzuNpPkN8PUPsJ8vsBclN0lIPIbHH1PK72E1CCAAAAAAAAAAAQjBCNRc33p0iHe/L9YQwR9fsGrYaM2wWJEd43OGrJuQAYwU/oMWUt+t9Y795NPY+rfQSUIAAAAAAAAAAA5xNBHwAi5/su6XDkfN8tHo+a7/fWC06aJXHNI1/TAAAAAElFTkSuQmCC`,"../../../assets/gfx/tex_floor.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABfElEQVR42u2bva7CMAyF/aqMHTvm6e8VSEgMkDhx/XPSM2RA5jTUxLH9NZXzPP5aZ2jso2G9vqddbu+A43h0v/S0t4G9d/NavXX+Vf3LAb9u4m37tI8+o+llZsloljWaXqrFZLRdVmJuJ7uMYuabvbfhoelFEzPNGHNZaVRzbakQk951RNcBo5gZTXCF3uIAzfxDB2h+xEoeRtBP1wGWf7yinnUA64CFPLqTXdDbWXMavL0D0Pt5jX65DrgtD7CExRX6dB5g3ROQ9hTxYnwWPXkAGg+oGjInynOBzD1DKvTz3jxg+bkAeUBSP2/JIrN6Qavdr9aX5AGRdQh5QDaWzk6TdEAEDxhd31vP8wF34wEz82/JA8x1ADoPcK8DtuMB2Us+U08HVOjnM/XkAeQB5AHkAeQB3kuu8qADImKusp08AL2fL8kD4OsApH6ePCCCB1iH53n/EB6Q5YAW4YCZVnIlz3qf9ycPqMgDrP08/PsC8OcEs/M43xcItP8DHDyt9QBEmvUAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_floor2.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABkUlEQVR42u2avQ6DMAyEedWOjB55+lYMlRDNz9nEcdLckEooHC1Xx3Y+2Pb99V55bOfHIbtpfC9i1UcPGkADEgZIZdQMkMEHZEDOMdSAQ3GNnvOQAaWQTp2r0UfPp37rlrupVPigBpT0ubnrvKdeFQH3daONAGkQsi31kAFS+AJLDhgpJ5iSoLcBtTXdUi/RZRBdw17z4WUQaZo0WVx7TrgBAnRnPfXd+4DoCBiiD6iVuZ767lUAvQEvfXgZtIRwS70pB1yPLTng3hlqk1hLPZwDcr01agCqz/2DvfQhfQDSyHjpyQPIA8gDyAPIA8gDyAPIA8gDyAPIA/AIkIcRMBIPGM6A3jzA1AiV9uNIEhyJB8BJ8Lp/vo+/5wHeVSCSB4QDkSl4gLcBkTxAnQPIA1bkAZ59QHROCOkDpuYBqTWl4QEz6PmiJA2gAXxdngYwB9AAGvDTSOQ2FmgjktKXYAu6uakdP26EyAPIA8p77pl5gPrJkBieDo/MA0yPxp4YwPcDZuYBy5ZBdoI0gDxgqfEBDPel5fENuOgAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_floor3.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADjUlEQVR42u2bO3brMAxEuT2WKrMElyrdstSm847z8ZMoYGb4k+3IhYoceyJpDICXIBk+Uvz8WKbtNa+vmP29um7fvenX12xdjvZXb94X3H8x9LOoz941nN6A6Ro/dyasBNMFG3DXOwa4+iXTOy9h6hdDP4v6nQGX34e0H/7++c8L3m74/6arz5H+auhnUX819BdRfzX02feDFHJWuNeE7CZSKkJ2E2WCfjH0WVqWGfAEOYvNIwYs+/8fzJwxhUJNmH9yEhRVqaa4BXnSagr4gXJ9YDm7DjuUb17OrsOO6o2ctZ7P1CdDP3N9kHK2NmRpvk+7l7CHVeH+brjjqw8HgJCVagpkiB41xTc5sJxlBrCcZQZ44a4acL9/iwEMZtw8Sjhnod7hCkkPuILqs+ct5gBWZVlN0X4xP9y/X3aq5gBjFHhzwNBxtjRnGbuzCNjoDQO6cEAJu1scUMLu7tykgQOyuUCklfKZQraMAyaBA85ugBfudD4/G/P5WnYf3g+o5AArZ0o4AOoFDnD1IgeY+h0HwDkzobNK/v66YMgSqoP4TvRpqw8UHa3QoRzwOjUl0JzJXkLjAN+A1+AAMs6iBqipF7nf1Ced+3f6ZOjH9APYnP7R/QBfH0bPtx9rAOeIwMZZZgAbZ5kBXrirBtyfv9qA0/cDioaZSKssG4e1XwwbgLrWigHbtcEXY3cMUYI+5QY8ZT/ArwsaB/g1pQsHlLC7xQEl7G5xgLSWCTiA9wNk7hdDPkWyjA70VNvWtj+oHyAY3DS5auaAVnaPhN1JVQcvgZbSNnrHALaWGUpzFvYHhJxl/QWWs6y/kBc8pv+j/YDIp/WYA543Z/tzQFXOTo05O1XnrLZ/oYQE3/2AHiF7HLraq9davusccCYDGAe8Rj+A0WYlByj7fFDOKvt8UM4q+3wQB9B+hrtPEIQ7q9JsjGYrTYoBLVtu9rPB0/cDBvfdS3t4Ekd05YDB822295ix++j9C8cMg2KBeoT2bUAfdid6MqzSnKX7F/D2WWrAufsBVT28WM0B9BiNHO4tW2/ZeYHWJuajzyAVmDeoH/DHOQAtWijjOFq0kPSpjQM2m6SOGaJqt972GhrRucEjxmPK7q0LI737AQUGSPqGM0jK9LrZAOklKs4NKn09qid9PXaOyKszY/sBDTtP8S8m9gNATdHOCwzP2cFnkArOM4w5N9i69/jQc4Mn7wf8A4j1q0GH7yykAAAAAElFTkSuQmCC`,"../../../assets/gfx/tex_grass.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACBklEQVR42u1bS24DMQjlal32SN32CF7OMkfoBVtVjSWU+ocNGDwsRooSM7KfbXg8CHw+3r7v/ICHSV5f72I25gH4uP4WQwEhj/+13QbA6AR670jP96QnADUw8PfYpgcccC44Lxp/ngUh2ya0gIQAKY3Pv+PxvTkA51HFyM8c3aOcYGu3IgoEADIhcea6gbfFXw0nOONzwMsOt5wrBqbld0rvBkuMLi8uNcalwimYtRMHoMYNemOTQOisnR6QprEj3ACTniTIG3BozhuhegUscoPgAQGAUD5+DABekpplAGo59mg+Li2ISNlDjWJS83Gpxb9yCMoGjNiD5fy9RHEpGzBiDz2quFsPXCFHI/YRBjUk6mMAuAxeE3YAZvLxYwBYyat3VoFW7EErH6dWgWZO2qj9Pz1AKx/fHfNLJxjuFPOxMhQ8IABQ1AMsh0xxPcA6bwCu+ryEvYaeAFz1eW57LT3haCdI0gNOfEIPsKgHWIsGqnqART2BXQ/wpiew6gEe9QQ2PcCrnsCiB3jWE+BOMT94QADgCACtMAnWk5htAHBNYLS+P9vvz9ogwdnvT63vz/b7swHA0e//OnZV69/qA6jqTa2FdSc5UnWCyWnVGO4Y+kwCsCtNBmtxn9rvr64ISRzjnToCjO7MCDtbre/P9PuLAkDhBhoxv9Tvr3oFqP/cjDDo4PkBxu9tUdFvCLwAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_lava.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAHx0lEQVR42tVbK3YlNxAVNHzQ0EvwFgbOEh4MbBgYGpgleAmGs4WBgYGBgYGBA16O+qnaV7duldTdtnMCdM74TXdLuqrvrVL56fJws/Hr48Pt2/PD7a/r5fbj9fn249uX29+/PN7++Hq5/f7lYRv17/oMjvpbfbeOl6f7qN9TA+fEues76/zLZZ27jn9+e1zXYKP+XYetbxvfr/fx58/9qP/38rR+s67d1mXzlo8EgMduAL5fHQAGQt3UukYbDISNBmJdYwpAt4Dr2wnUCe3lDAQDSYHAfyupsOfqN+qc22ZeniQIKA04VmAMHHi3rtHWgQdReBHdAgAAlgIDAYf9biDYhtTvLB32e51r3YiJ8+vz2yYWL3luLPdhINk7LKG258KL6BYA4qMAiADBxeCJ4WIiiVrBryeoABCSxkMdTgZ+wf9YF1H1ry6gGZAVgGThTiWWy5soVilCg9RAtU3ZxjoRrqKLxgwMoYlxZmdQmmZG6U7NFm8Lp8kNBAVE9z6dXqefZrDYWqsBYJkdYhGO7MkIFFt3MTHdFomLawAwCAiEA0+ojnv2egkNGVv3yIgpT4IGncHAjeOaSzchil79N1hStsRmbBBA2zyLa6SrChgEB+2Gnf5o8wwCA2BqbnsqMngAXd3cSjbqc2gzTuiqMmJsvY8CYECjrSnZxp1fxWBD6KvS1ZG+ZuLKlnt28wyAAbt5GZD2ghETi3ynl7xxewcN1RL726MnNxNFZpFld/ps5FcAYBMq6pIurcXXCBLrqoq69oyZ/GEGADz9TfThEIvaPEZcGwjKNS5z4fCRDZwZLP7y9JsEOwBcuMkvgl9mNxdFXP8FABzdsu4PAUDXxABgWMpBUWS8PguEyPgp8XcAqIjPAQDPqYhQAfCZUpACgHasAwCMWqgCzVuwwcs2//8CQKWdif6PsrIzPvzs5qcBWL0AxQEuBiDrz7l1Fup+NggKgMj/v7lBoo86momyuj2bV97ho0FQEaX0ADAKi4QjF8HqR5SXTDiQobmejxBPi/8QAJUQDTafZlzXPs1Gz5FRY0dAifKJVPxTANrm9yQ3UuwshFaGVhAse2KHmWRqJP59MpScfiS6EbMrrW7A9LCEvFcmObL+b16AiwtCAka6qyyvirtH6TQGWQwEzz3iGLrTxzloFJfv2+KC/D4STWd8kFyNCBblcaAYMmN41ebl6QcET5F8nC26lpR2AMBS0J0ASFVU7XFSQ3lHZjwj2isiaDdKjPl7lfjY5Jn7iqxwB4JgmXlsa6A4ZCQRfPoOfE73m3suHPd3hYkmjghAJAWZK1K5RFRjwCSsI1vt3YBvHIl/BHwJCxvt5VlDqFxTV2ts9mBvRMmVKqvy7gIAKDt2vYWZWCc+iR2YUYdOCsT3ouyRN2TrYZVkEFIArr7CVVTB4CwADMJWcG2LiQAYFkybBE0DIGwIpvFraUxJALIne8tSHyYBoEIKgNADNAOoWKwVACX+s4ZnNjJDEWZAR2PzJC1GQRVQgG0SPKH/qwqkxdEqrsucD56q91PDxWjjXU4h3LJ8R1W3BYFrozjqS5S5Zk9L2ZPMBWbvdesJ6LjQYwgCR5Xc7nHAQsEHhKPq9N1CRYeG+p4iU6NvuiYJzE1Er4Ijb0F1s3lWALoweBB58WSudsj5RFBIYT2Upy4q1FmbDHquTHKxl6G+U1zTAnSF4El1ISaCxSkm5f7T/T2iOSNrkOKR2YkoVL6Xx23BXOVdfH2giw+A3MgG9hFwz1CYCFFjxlRn2MBrSTf5+hyUx0nkIteo+gedbVguusmRGx1F4VVt2pXqUeWC089K5MWRoUxe4ATQcZlFbjKu4Aozz2OgqPK8si1Rf0LiZbaYAlS4hMbLDJCo/XNGONuNIfv+hHp0J530JDBozDVyE1dnK9r+Sjeh8AJ7WlRGhEjE9LB1lnRa0Kuk+olCAyv4gaI6vOrHFDk5S1GHPMCA0HCJDII20yUqYpHIwNpBlM7CN2Ts1I9y9C4BopBa5RGOUQabM9OkibFEF4gJnhOlu9gHDID6gHVVn2lOUAlQxisicKaOs6F4GkIHHacdIbIB0Ba7px9PjQ4A8s2ROikAssQni/BkLSAIpXsJAACOSoABsG3kgAQg+TGbjHGEFwHgJKBrg2mU03sAUD/ONiCqEhsgthF8T3WjjABwiVTU/1CNYIdYE7uzpeyMCBkZQeYAI91lIGS4TgURLsXdkyFMhOCkzgCA4oxsTkSxq3jdnSTlKFmWqhKq6FZJ1x9gE5xtaJABEcQYGacXhtIJqbI9v1y6xAgjRJdLuFbZiZD3KAidbyd7MHPzQzJLoA5Ztur6nSgnKdJIXN9XClivo2xyqkAijGN2XwGfcR6i6xZ/ZykIi6WC31MJDIPQsb3ife5l5PJbRLeViMI6KwUMgFMF0FHVRqOMXETIbKI9IHMdCLU/IGJksrt2py4sJC1rQ+KTew7wTsNEOx+HzKsbPFISO9q1pUhJeVtMVHJC3pAZJQJxdJexSP8rqjCzFaE9N0EkYSF6ksO8PmGG1D1FeW0uq+MxwRj57qjVbdTPw99SgZO8uxB1fYmbLxGxY+ss4eXlppNZMpJdiT0iJYpHQOrM8YuKzxStv1G3W357vOmWIhlVZSjq89t7fX4rpYM/Z3bakR2qw3Xy9vi/9qGNP0xvGNYAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_murk.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEyklEQVR42tWbO3bcMAxFsQSVLFmynFItS5cpvYTsfwHOsR3JHAifB5BynALNnJmRcAmC+JG2ur0dUj6kfEpTpJbz+1thYv3H8dnwPE8u3y0BAZ9BywBUHED5qQAgCMYqYr+NQUgBqBEAwo9ORUwlvhSBLMcAIUkaQhAmhcx4tVRNEtZxWUADZtEALIBQD3kwaXHr8JUrgDAIxQNQMACiko8KCABDePHwVtMsCgWwKQ/7UlxXsu2yiDA0C5nxMZZFzVrAqLymKCIiPM9HmAvxtf3ckyvkAy4PDSrfB4GAAD7GtEAdQhBAyQPo9e3RmyoWDM0aJMVNq7KsAAbQEubvKK9CQbYIAF+1hAgA3fzjAPaXZ3FB9DnfYm6neQDAigwA3hXuvx5PEoHxBAXwI4gVpACEjj4BwMvrfooE4g4rEX1BCEDw7B8hHC/KlecQRhDcUqTvWD7jxwGQVl8CgMoFQL8VQFliARqE/xhAkcNYBwJi5mkIhnM83skKhgiJAcQMrzGRjkghJpgBknGQl+PQA1AsAE3P5JA4QQKRgRAF8bQVmBUQkgOUFsjnvbC1VzVI4oKA8I7QEcLFCtSi6MKqT5VyCCBc5hAiTlQ6MrkVFA4glXNXO2XVcolIzqBBsISDOLaD5BCpTFdbANEg8HS5644zAmCEwK2AJ0cUWUGsqpuA4CRVGSs4IJxWsMtxAc1XcwMFSje28POKDAR1G7QlAPLbwfUTQkBlOT/YCgZLILOWdnv9X4ajOUvt2BvhoFZwBEiE1tOmj0eg6fEMIV5hGgG8/u4fcrECFiCRGTa2hINsyc4yy0Pe30OKIL0jUwIwWgGHMA3AC5GLk43NAODH5rgNDgCSFYy/p0vMzLykBaAqMgdgO/8bAsC2SQTAu8QA1J9pARYA6TTIW0Cdd4IrfYAEQKtDiolSF33ADQC0E8AoxXl5w1MhpOuptqb48VtCujL5UFkfqPAmS6yoUKwCAcelVDnCACAgqjU9EswV2poGLCIk19Fmojp5KgPNNnkD5h8BqO5xlgZg1hqxPiA2iIH9F1mFxFUQROXhiRKjDa4VaJVirdTGI61+Bo+zoFCi9YA9OV4DFmvPQMgqIrqTF5kaIag8tBBgul1bUU8U4tVUKTBaAaIGlceOZeeUUQCM8QJJlVTZJ8RBVK9f0O0RGj05Q+YEi5xes+YtaeGiDaHqzucBlLr2awirPg+Y8kBmnLTmLVkxs74qkjcOjrSwyM0FgChvtPjO3OLvc498gbTyEW4JccXV2N5pbJbI0LSQW8AA4lYQGGSaALDdDQDtw3+fBZRJAIEtYPXVZsLQyCjd5TktCcAqsnInqHVWvaGDKRCOBUirn9r/zjH4EQdEprBCMboTi8P9/BWrb0WC3vxdOEFBQ2DlGLxn9ZUItAvpcN7M/ehQa3vpgwz2rD865mtNrhCccj6sCxJ4R0kqda30/FtwyJPQ2r4Z8rYCz/pf9uOuz/KU6I0xd875+s60YgTGnx+QIRwgzJm+xHW5SPWa7u0EszRVLVQYo+0pADgEWtb4MCvDmbJ6/tIkegP2c0IkMcQwNSBREze9ZqzAEfKqKZE+f+w+X6x5kodgC4Xv5blDDltayciNz3V3hxMAwrfHE9diyzfdHv8DVtCOuTzYPkQAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_pillar.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAtElEQVR42u2UMRKAIAwE+RolJc+g5P+FzhWnUZCEqIUzFqHA3EqSgxBjXBAppamgLmCptboCoIBFbpZSLgXnbw0ACYyeWAU8UoILMKq7VwbzXSeQP5ueQhcAH+ScF5ZiCeRCsxmJEGsZFG8AEmcAtHOgmICRmSSAkAZgaaYJoJXwPmDUiwNA+sDag8YH3LDeicMYbwNkD7T5q02cOcEHfGAGXPlAewu7PnBd5/892KfgAUC7ArN+VR3NJ9MHAAAAAElFTkSuQmCC`,"../../../assets/gfx/tex_wall.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6ElEQVR42u1WOxLEIAjlapaWHsPS+xfukBlmXGKC4IcttniF4eMLJPAghFARMcaaUqo551egD/r2YIkHvLyU4gZAFu0DZDmTUBv/RaAtlfVybfytAu4t0JZ0tmUXgackvJy9EmtK3otXt2D1R6r+C1bbgQYIgZ85VtuvQaRJwP2XEKBRzEG21t6ee/bReALMvtFsPJzu+Y3A6p6aCGh7+rSOLfEgJd0NtR6YnYTueuB1FO/WA6ZldGQdn1w+Jj1Adq0eGPH/64Hf0wPSbtiqB/gsl/SAtB9G4rdvQ8lnux4QCbhXwFsPfAAAEGQx8sZqiAAAAABJRU5ErkJggg==`,"../../../assets/gfx/tex_wall2.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABi0lEQVR42u2WO7aEMAiGWYrllJa0lpYpp5wypeVtZymz0dyDiiIi5tFacNDAl5DoCT+EEJK0cRyTHpMxNi+nhAcraRiGQzIbj18tUMOfCqCkGGOapulkNE5xr4BSHnSFV7CcxNpdLQ98JOQpSObtkHMk18JvBXD1PBkipq7rDp5z5VG28sAP8seR4DuEw7tcUPsafi6AjWEJas+TyO/ewoP8e8lTpWTWBByT+a38qQD+fgxor4+wlQdvEm1Xi7fwEL7vJC3notFMCw9DHNJimPZnbZjw07vxWjazgPtFalmQL/4u/XgtC0t1uB0Vmxy/i9dyZPDogUcPPHrA6+cvfM1NhHyNHsjhTT0gQe1z9EAJb+uBsV/ap+Gz9EABb+uBFaCrUnoaz9EDmpM+Sw/Mdzei6XP0AOdTu5Xe4m09QD5e+Bw9sOb//eLBW/ypHdMxewtQ3Gu3pfy5gLVtUjJVzsa7stsqHtquW8Cn9/WAlaTjVz2fWbmJ7dOsvJ7D1AN3O/D0gC5CFr8vvrP/aGygcePF3NAAAAAASUVORK5CYII=`,"../../../assets/gfx/tex_walltop.png":`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaElEQVR42mMIDAz8j4w9PT3/o4shy8EwTIyBFAOwyWMY4OjoiNcAdHkGZGeBJGEYWRxdHlmMgRg/43MRA6l+xjCAkJ+JMgCXn4kJBwZS0wFGLAzNdIASBhRHI1XSAT5FhMKEgVQ/o/MBT1LmiOf5E6EAAAAASUVORK5CYII=`}),HC=new Map;function UC(e){let t=VC[`../../../assets/gfx/${e}.png`];if(!t)throw Error(`missing asset gfx/${e}.png`);return t}async function WC(e){let t=new Image;t.src=UC(e),await t.decode(),HC.set(e,t)}async function GC(){let e=Object.keys(VC).map(e=>e.slice(e.lastIndexOf(`/`)+1,-4));await Promise.all(e.map(WC))}function KC(e,t){let n=new Wc(e);return n.magFilter=Ao,n.minFilter=Ao,n.generateMipmaps=!1,n.flipY=!1,n.colorSpace=``,n.premultiplyAlpha=!1,n.anisotropy=1,n.wrapS=n.wrapT=t?Do:Oo,n.needsUpdate=!0,{tex:n,w:e.width,h:e.height}}function qC(e,t){let n=HC.get(e);if(!n)throw Error(`texture ${e} not loaded`);return KC(n,t)}function JC(e){let t=HC.get(e);if(!t)throw Error(`texture ${e} not loaded`);let n=document.createElement(`canvas`);n.width=t.width,n.height=t.height;let r=n.getContext(`2d`,{willReadFrequently:!0});if(!r)throw Error(`2D canvas is not available`);r.drawImage(t,0,0);let i=r.getImageData(0,0,n.width,n.height);for(let e=0;e<i.data.length;e+=4){let t=i.data[e];i.data[e]=i.data[e+2],i.data[e+2]=t}return r.putImageData(i,0,0),KC(n,!1)}var q,YC=!1,XC=N(1.5),ZC=N(.25),QC=N(.5),$C=16,ew=N(.18),tw=N(.05),nw=e=>I(m_,e),rw=e=>I(h_,e),iw=e=>I(g_,e),aw=N(1/49),ow=3.5,sw=N(1/(ow*ow)),cw=N(.8),lw=N(.6),uw=N(.9),dw=N(1/9),fw=N(.95),pw=N(1/20.25),mw=N(.75),hw=N(1/17.64),gw=2,_w=0,vw=1,yw=2,bw=3,xw=4,Sw=5,Cw=6,ww=7,Tw=8,Ew=9,Dw=10,Ow=11,kw=12,Aw=13,jw=14,Mw=15,Nw=16,Pw=17,Fw=18,Iw=[`tex_floor`,`tex_floor2`,`tex_wall`,`tex_walltop`,`tex_pillar`,`tex_crate`,`tex_wall2`,`tex_floor3`,`tex_grass`,`tex_dirt`,`tex_cliff`,`tex_cave`,`tex_cavefloor`,`tex_basalt`,`tex_basaltfloor`,`tex_basaltcol`,`tex_lava`,`tex_murk`],Lw=0,Rw=1,zw=2,Bw=3,Vw=4,Hw=[{floor:_w,floor_room:vw,wall:yw,walltop:bw,cliff:yw,pillar:xw,dark:[31,28,24],lit:[31,28,24],ambient:N(.32),outdoor:!1,rough:!1,liquid:-1,glow:!1},{floor:ww,floor_room:vw,wall:Cw,walltop:bw,cliff:Cw,pillar:xw,dark:[26,30,24],lit:[31,29,24],ambient:N(.32),outdoor:!1,rough:!1,liquid:Pw,glow:!1},{floor:kw,floor_room:kw,wall:Ow,walltop:Ow,cliff:Ow,pillar:Ow,dark:[6,10,20],lit:[22,30,31],ambient:N(.24),outdoor:!1,rough:!0,liquid:-1,glow:!1},{floor:jw,floor_room:jw,wall:Aw,walltop:bw,cliff:Aw,pillar:Mw,dark:[22,8,6],lit:[31,24,14],ambient:N(.36),outdoor:!1,rough:!1,liquid:Nw,glow:!0},{floor:Tw,floor_room:Tw,wall:yw,walltop:bw,cliff:Dw,pillar:xw,dark:[9,12,24],lit:[31,25,16],ambient:N(.3),outdoor:!0,rough:!1,liquid:-1,glow:!1}],Uw=Hw[Lw],Ww=N(.32),Gw=0;function Kw(e){if(e.hub)return Vw;switch(e.area){case 1:return Rw;case 2:return zw;case 3:return Bw;default:return Lw}}function qw(e){Uw=Hw[Kw(e)],Ww=Uw.ambient,Gw=Dn(Tn,Tn-Ww)}var Jw=[[`spr_player`,!1],[`spr_chaser`,!0],[`spr_shooter`,!0],[`spr_props`,!1],[`spr_items`,!1],[`spr_fx`,!1],[`spr_clutter`,!1],[`spr_brute`,!0],[`spr_archer`,!0],[`spr_caster`,!0],[`spr_shaman`,!0],[`spr_slime`,!0],[`spr_dummy`,!1],[`spr_world`,!1],[`spr_cave`,!1],[`spr_imp`,!0],[`spr_bull`,!0],[`spr_crab`,!0],[`spr_yeti`,!1],[`spr_dragon`,!1],[`spr_fire`,!1]],Yw=[],Xw=0,Zw=[],Qw=[],$w=[],eT=[];for(let e=0;e<6;e++)eT.push({x:0,z:0,inv_r2:0,power:0});var tT=0;function nT(e,t,n,r,i){let a=eT[e];a.x=t,a.z=n,a.inv_r2=r,a.power=i}function rT(){return q?Rh(q.renderer):`none`}function iT(e){q=e;for(let e=0;e<21;e++){let[t,n]=Jw[e];Zw[e]=qC(t,!1),Qw[e]=n?qC(`${t}-elite`,!1):null,$w[e]=[,,,,].fill(null)}Qw[5]=JC(`spr_fx`),$w[11][3]=qC(`spr_slime-magma`,!1);for(let e=0;e<Fw;e++)Yw[e]=qC(Iw[e],!0)}function aT(e){let t=L(e.view_w,2),n=L(w_(e),2);q.begin(),YC=!0,q.view(t/4096,n/4096,[(e.x+I(m_,p_))/4096,I(h_,p_)/4096,(e.z+I(g_,p_))/4096],[e.x/4096,0,e.z/4096]),q.polyFormat(31,0,0,0)}function oT(){YC?q.render():q.clear(),YC=!1}function J(e,t,n){q.vertex(e,t,n)}function sT(e){q.materialUse(Yw[e]),Xw=Yw[e].h}var cT=13,lT=new Int32Array(cT*cT);function uT(e,t){let n=0;for(let r=0;r<tT;r++){let i=eT[r],a=e-i.x|0,o=t-i.z|0,s=Tn-I(I(a,a)+I(o,o)|0,i.inv_r2)|0;s<=0||(s=I(I(s,s),i.power),s>n&&(n=s))}return Ww+I(Tn-Ww,n)|0}function dT(e,t){let n=F(e+En),r=F(t+En);return n=n<0?0:n>=cT?cT-1:n,r=r<0?0:r>=cT?cT-1:r,lT[r*cT+n]}var fT=new Int32Array(cT*cT),pT=0,mT=null,hT=!1;function gT(e){tT=0,e.feature_x>=0&&Z_(e,e.feature_x,e.feature_z)===4&&nT(tT++,P(e.feature_x)+En,P(e.feature_z)+En,pw,fw);for(let t=0;t<e.decor_count&&tT<5;t++){let n=e.decor[t];if(n.kind!==0&&n.kind!==22)continue;let[r,i]=J_(n.wall),a=n.kind===22;nT(tT++,n.x+I(r,lw)|0,n.z+I(i,lw)|0,a?hw:sw,a?mw:cw)}for(let e=0;e<cT;e++)for(let t=0;t<cT;t++)fT[e*cT+t]=uT(P(t),P(e))-Ww|0;pT=e.seed,mT=Uw,hT=!0}var _T=[0,3,1,4,2,0,5,1],vT={t:0};function yT(e,t,n,r,i){(!hT||pT!==e.seed||mT!==Uw)&&gT(e),nT(0,t,n,aw,Tn),tT=1;for(let t=0;t<e.hazard_count&&tT<3;t++){let n=e.hazards[t];n.kind===1&&KS(n,i,vT)===2&&nT(tT++,n.x,n.z,dw,uw)}let a=Tn-_T[r>>2&7]*N(.025)|0;for(let e=0;e<cT;e++)for(let t=0;t<cT;t++){let n=Ww+I(fT[e*cT+t],a)|0,r=uT(P(t),P(e));lT[e*cT+t]=n>r?n:r}}function bT(e,t){let n=I(e,t),r=I(e-Ww|0,Gw);r=r<0?0:r>4096?Tn:r;let i=[0,0,0];for(let e=0;e<3;e++){let t=Uw.dark[e]+((Uw.lit[e]-Uw.dark[e])*r>>12);i[e]=Math.imul(t,n)>>12,i[e]=i[e]>31?31:i[e]}q.color(B(i[0],i[1],i[2]))}var xT=N(1),ST=N(.85),CT=N(.62),wT=N(.45);function TT(e,t,n,r,i,a,o){let s=F(Math.imul(e,o)),c=F(Math.imul(n,o)),l=F(Math.imul(t,o)),u=F(Math.imul(r,o));bT(dT(e,r),a),q.texCoord(s,u),J(e,i,r),bT(dT(n,r),a),q.texCoord(c,u),J(n,i,r),bT(dT(n,t),a),q.texCoord(c,l),J(n,i,t),bT(dT(e,t),a),q.texCoord(s,l),J(e,i,t)}function ET(e){return Xw-F(Math.imul(e,$C))}function DT(e,t,n,r,i,a){let o=$C,s=F(Math.imul(e,o)),c=F(Math.imul(t,o)),l=ET(r),u=ET(i),d=dT(e,n),f=dT(t,n);bT(d,a),q.texCoord(s,l),J(e,r,n),bT(f,a),q.texCoord(c,l),J(t,r,n),bT(f,I(a,N(.7))),q.texCoord(c,u),J(t,i,n),bT(d,I(a,N(.7))),q.texCoord(s,u),J(e,i,n)}function OT(e,t,n,r,i,a){let o=$C,s=F(Math.imul(t,o)),c=F(Math.imul(n,o)),l=ET(r),u=ET(i),d=dT(e,t),f=dT(e,n);bT(f,a),q.texCoord(c,l),J(e,r,n),bT(d,a),q.texCoord(s,l),J(e,r,t),bT(d,I(a,N(.7))),q.texCoord(s,u),J(e,i,t),bT(f,I(a,N(.7))),q.texCoord(c,u),J(e,i,n)}function kT(e,t,n,r,i){TT(e,t,n,r,i,xT,$C),OT(n,t,r,0,i,ST),DT(e,n,r,0,i,CT)}function AT(e,t,n){if(t<0||n<0||t>=12||n>=12)return!1;let r=e.cells[n][t];return r!==5&&r!==6}function jT(e,t,n){return!!(e.dirt[n]>>t&1)}function MT(e,t){q.polyBegin(1);for(let n=0;n<12;n+=gw)for(let r=0;r<12;r+=gw){let i=!0;for(let a=0;a<gw;a++)for(let o=0;o<gw;o++)i&&=AT(e,r+o,n+a)&&jT(e,r+o,n+a)===t;if(i)TT(P(r),P(n),P(r+gw),P(n+gw),0,Tn,$C);else for(let i=0;i<gw;i++)for(let a=0;a<gw;a++)AT(e,r+a,n+i)&&jT(e,r+a,n+i)===t&&TT(P(r+a),P(n+i),P(r+a+1),P(n+i+1),0,Tn,$C)}q.polyEnd()}function NT(e){sT(e.type===0||e.type===3||Uw.outdoor?Uw.floor:Uw.floor_room),MT(e,!1),Uw.outdoor&&(sT(Ew),MT(e,!0))}var PT=N(2),FT=N(.3),IT=N(.25);function LT(e,t,n){let r=$C,i=F(Math.imul(t,r)),a=F(Math.imul(n,r)),o=ET(0),s=ET(-PT),c=dT(e,t);bT(dT(e,n),N(.5)),q.texCoord(a,o),J(e,0,n),bT(0,0),q.texCoord(a,s),J(e,-PT,n),bT(0,0),q.texCoord(i,s),J(e,-PT,t),bT(c,N(.5)),q.texCoord(i,o),J(e,0,t)}function RT(e,t,n){let r=$C,i=F(Math.imul(e,r)),a=F(Math.imul(t,r)),o=ET(0),s=ET(-PT),c=dT(e,n),l=dT(t,n);bT(c,N(.4)),q.texCoord(i,o),J(e,0,n),bT(0,0),q.texCoord(i,s),J(e,-PT,n),bT(0,0),q.texCoord(a,s),J(t,-PT,n),bT(l,N(.4)),q.texCoord(a,o),J(t,0,n)}function zT(e){sT(Uw.wall),q.polyBegin(1);for(let t=0;t<12;t++)for(let n=0;n<12;n++){if(!AT(e,n,t))continue;let r=P(n),i=P(n+1),a=P(t),o=P(t+1),s=n>0&&e.cells[t][n-1]===5,c=t>0&&e.cells[t-1][n]===5,l=n<11&&e.cells[t][n+1]===5,u=t<11&&e.cells[t+1][n]===5;s&&OT(r,a,o,0,FT,ST),c&&DT(r,i,a,0,FT,CT),l?(OT(i+IT,a,o,0,FT,ST),LT(i+IT,a,o)):n<11&&e.cells[t][n+1]===6&&LT(i,a,o),u?(DT(r,i,o+IT,0,FT,CT),RT(r,i,o+IT)):t<11&&e.cells[t+1][n]===6&&RT(r,i,o)}q.polyEnd(),sT(Uw.walltop),q.polyBegin(1);for(let t=0;t<12;t++)for(let n=0;n<12;n++){if(!AT(e,n,t))continue;let r=P(n),i=P(n+1),a=P(t),o=P(t+1);n>0&&e.cells[t][n-1]===5&&TT(r-IT,a,r,o,FT,wT,$C),t>0&&e.cells[t-1][n]===5&&TT(r,a-IT,i,a,FT,wT,$C),n<11&&e.cells[t][n+1]===5&&TT(i,a,i+IT,o,FT,wT,$C),t<11&&e.cells[t+1][n]===5&&TT(r,o,i,o+IT,FT,wT,$C)}q.polyEnd()}var BT=e=>e%8*16,VT=e=>L(e,8)*16;function HT(e,t,n){let r=e%8*16,i=L(e,8)*16,a=t-En|0,o=n-En|0,s=t+En|0,c=n+En|0,l=nw(tw),u=N(.005)+rw(tw)|0,d=iw(tw);bT(dT(a,c),Tn),q.texCoord(r,i+16),J(a+l,u,c+d),bT(dT(s,c),Tn),q.texCoord(r+16,i+16),J(s+l,u,c+d),bT(dT(s,o),Tn),q.texCoord(r+16,i),J(s+l,u,o+d),bT(dT(a,o),Tn),q.texCoord(r,i),J(a+l,u,o+d)}function UT(e,t){if(t)switch(e.kind){case 3:return[7,6];case 2:return[9,6];case 6:return[4,6];default:return[-1,6]}switch(e.kind){case 4:return[11,3];case 5:return[12,3];case 8:return[0,6];case 9:return[3,6];case 10:return[4,6];default:return[-1,6]}}function WT(e,t){switch(KS(e,t,vT)){case 1:return 1+L(vT.t*3,20);case 2:return vT.t<4?4:5;default:return 0}}function GT(e,t){for(let n=0;n<2;n++){let r=n?6:3,i=!1,a=()=>{i||=(q.materialUse(Zw[r]),q.polyFormat(31,3,0,0),q.polyBegin(1),!0)};for(let n=0;n<e.decor_count;n++){let i=e.decor[n],[o,s]=UT(i,!!(t.broken>>>n&1));o<0||s!==r||(a(),HT(o,i.x,i.z))}if(n===1&&t.crate_broken)for(let e=0;e<12;e++)for(let n=0;n<12;n++)t.crate_broken[e][n]&&(a(),HT(9,P(n)+En,P(e)+En));for(let r=0;n===1&&r<e.hazard_count;r++){let n=e.hazards[r];(n.kind===3||n.kind===4)&&(n.kind===4&&t.crust&&t.crust[r]>=45||(a(),HT(n.kind===4?3:4,n.x,n.z)))}for(let r=0;n===0&&r<e.hazard_count;r++){let n=e.hazards[r],i;if(n.kind===0)i=15+WT(n,t.room_frame);else if(n.kind===1)i=11;else continue;a(),HT(i,n.x,n.z)}i&&q.polyEnd()}let n=!1;for(let t=0;t<e.hazard_count;t++){let r=e.hazards[t];if(r.kind!==2)continue;n||=(q.materialUse(null),q.polyFormat(31,3,0,0),q.polyBegin(1),!0);let i=N(.08),a=N(.006),o=(r.x<r.x2?r.x:r.x2)-(r.x===r.x2?i:N(.3)),s=(r.x>r.x2?r.x:r.x2)+(r.x===r.x2?i:N(.3));XT(o,(r.z<r.z2?r.z:r.z2)-(r.z===r.z2?i:N(.3)),s,(r.z>r.z2?r.z:r.z2)+(r.z===r.z2?i:N(.3)),a,B(4,3,4))}n&&q.polyEnd(),q.polyFormat(31,0,0,0)}var KT=N(1.1);function qT(e){switch(e){case 1:return B(28,8,10);case 2:return B(31,24,6);default:return B(12,18,31)}}function JT(e,t,n,r,i,a,o){q.color(a),J(e,r,n),q.color(a),J(t,r,n),q.color(o),J(t,i,n),q.color(o),J(e,i,n)}function YT(e,t,n,r,i,a,o){q.color(a),J(e,r,n),q.color(a),J(e,r,t),q.color(o),J(e,i,t),q.color(o),J(e,i,n)}function XT(e,t,n,r,i,a){q.color(a),J(e,i,r),q.color(a),J(n,i,r),q.color(a),J(n,i,t),q.color(a),J(e,i,t)}var ZT=0,QT=1,$T=2;function eE(e,t,n,r){return X_(e,t,n)>=0?r?$T:QT:e.entry_side===t&&e.entry_pos===n?QT:ZT}var tE=[N(-.2),0,N(.15),N(.3),N(.45)];function nE(e,t,n){return Uw.rough?XC+tE[qa(e.seed,t>>>0,n>>>0)%5]|0:XC}function rE(e,t){sT(Uw.wall),q.polyBegin(1);for(let n=0;n<12;n++){let r=P(n),i=P(n+1);if(AT(e,n,0)){let a=nE(e,1,n);if(DT(r,i,0,eE(e,1,n,t)===ZT?0:KT,a,CT),!AT(e,n+1,0))OT(i,-QC,0,0,a,ST);else{let t=nE(e,1,n+1);t<a&&OT(i,-QC,0,t,a,ST)}}if(AT(e,0,n)){let a=nE(e,0,n);if(OT(0,r,i,eE(e,0,n,t)===ZT?0:KT,a,ST),!AT(e,0,n+1))DT(-QC,0,i,0,a,CT);else{let t=nE(e,0,n+1);t<a&&DT(-QC,0,i,t,a,CT)}}}q.polyEnd(),sT(Uw.walltop),q.polyBegin(1);for(let t=0;t<12;t++){let n=P(t),r=P(t+1);AT(e,t,0)&&TT(n,-QC,r,0,nE(e,1,t),wT,$C),AT(e,0,t)&&TT(-QC,n,0,r,nE(e,0,t),wT,$C)}AT(e,0,0)&&TT(-QC,-QC,0,0,nE(e,1,0),wT,$C),q.polyEnd(),sT(Sw),q.polyBegin(1);for(let n=0;n<12;n++){let r=P(n),i=P(n+1);eE(e,1,n,t)===QT&&DT(r,i,0,0,KT,CT),eE(e,0,n,t)===QT&&OT(0,r,i,0,KT,ST)}q.polyEnd()}function iE(e,t){let n=P(12);sT(Uw.wall),q.polyBegin(1);for(let r=0;r<12;r++){let i=P(r),a=P(r+1);AT(e,r,11)&&(eE(e,3,r,t)!==$T&&DT(i,a,n+QC,0,ZC,CT),RT(i,a,n+QC)),AT(e,11,r)&&(eE(e,2,r,t)!==$T&&OT(n+QC,i,a,0,ZC,ST),LT(n+QC,i,a))}AT(e,11,11)&&(DT(n,n+QC,n+QC,0,ZC,CT),OT(n+QC,n,n+QC,0,ZC,ST),RT(n,n+QC,n+QC),LT(n+QC,n,n+QC)),q.polyEnd(),sT(Uw.walltop),q.polyBegin(1);for(let r=0;r<12;r++){let i=P(r),a=P(r+1);AT(e,r,11)&&eE(e,3,r,t)!==$T&&TT(i,n,a,n+QC,ZC,wT,$C),AT(e,11,r)&&eE(e,2,r,t)!==$T&&TT(n,i,n+QC,a,ZC,wT,$C)}AT(e,11,11)&&TT(n,n,n+QC,n+QC,ZC,wT,$C),q.polyEnd()}function aE(e,t){if(!t||e.door_count===0)return;let n=P(12);q.materialUse(null),q.polyBegin(1);for(let t=0;t<e.door_count;t++){let r=e.doors[t],i=P(r.pos),a=P(r.pos+1),o=qT(r.leads_to),s=B(1,1,2);switch(r.side){case 1:JT(i,a,0,0,KT,o,s);break;case 0:YT(0,i,a,0,KT,o,s);break;case 3:XT(i,n,a,n+QC,N(.005),o);break;case 2:XT(n,i,n+QC,a,N(.005),o)}}q.polyEnd()}var oE=N(.1);function sE(e,t,n){let[r,i]=J_(e.wall),a=e.x+I(r,oE)|0,o=e.z+I(i,oE)|0,s=3,c,l;switch(e.kind){case 0:s=20,c=0+(L(n,4)+t*5)%12,l=N(.5);break;case 12:s=6,c=e.variant?6:5,l=N(.35);break;case 11:s=6,c=2,l=N(.75);break;case 22:eD(14,(L(n,6)+t*7)%40<3?96:80,0,16,16,!1,a,N(.6),o,0);return;default:c=13,l=N(.55)}eD(s,BT(c),VT(c),16,16,!1,a,l,o,0)}function cE(e,t,n){for(let r=0;r<e.hazard_count;r++){let i=e.hazards[r],a=KS(i,t,vT),o=vT.t;switch(i.kind){case 0:a===2&&eD(3,BT(20),VT(20),16,8,!1,i.x,0,i.z,0);break;case 1:a===2&&eD(20,(L(n,3)+r)%8*16,64,16,32,!!(r&1),i.x,0,i.z,0);break;case 3:if(a===1){oD(i.x,i.z,N(.3)+L(Math.imul(N(.9),o),40)|0);let e=40-o;if(e<18){let t=14+r%4;eD(6,BT(t),VT(t),16,16,!1,i.x,Math.imul(N(.15),e),i.z,0)}}else if(a===2){let e=14+r%4;eD(6,BT(e),VT(e),16,16,!1,i.x,0,i.z,0)}break;case 2:{let[e,r]=qS(i,t),a=10+L(n,2)%4;eD(6,BT(a),VT(a),16,16,!1,e,-N(.25),r,0);break}}}}var lE=(e,t,n,r,i)=>({u:e,v:t,w:n,h:r,scale:i}),uE=[];uE[0]=lE(32,0,16,16,2),uE[1]=lE(48,0,16,16,2),uE[2]=lE(64,0,16,16,1),uE[3]=lE(80,0,16,16,2),uE[4]=lE(96,0,16,16,2),uE[5]=lE(112,0,16,16,2),uE[6]=lE(32,16,16,16,2);function dE(e){switch(e.kind){case 13:return uE[e.variant<7?e.variant:0];case 14:return lE(48,16,16,16,1);case 15:return lE(64,16,16,16,1);case 16:return lE(80,16,16,16,1);case 17:return lE(96,16,16,16,1);case 18:return lE(112,16,16,16,2);case 19:return lE(32,32,16,16,2);case 20:return lE(48,32,16,16,1);case 21:return e.variant?lE(80,32,16,16,1):lE(64,32,16,16,1);default:return null}}function fE(e,t,n,r){qE(13,e.u,e.v,e.w,e.h,r,t,0,n,0,31,1,e.scale)}var pE=72,mE=[],hE=-1,gE=[0,1,4,5,0,3];function _E(e,t,n,r,i,a,o){for(let s=-N(3);s<P(12)&&hE<pE;s+=n){let n=L(Math.imul(Wa(e,4096),3),10)-N(.15)|0,c=s+n|0;if(c>a&&c<o)continue;let l=t+L(Wa(e,4096),5)|0,u={x:r?c:-l,z:r?-l:c,kind:i?7:gE[Wa(e,gE.length)],mirror:!1};u.mirror=Ga(e,50),mE[hE++]=u}}function vE(e){if(hE<0){let t=Ba();Va(t,986711),hE=0;let[n,r]=AE(e),i=n-N(.6)|0,a=r+N(.6)|0;_E(t,N(.5),N(1.1),!0,!1,i,a),_E(t,N(1.6),N(1.3),!0,!1,i,a),_E(t,N(3),N(1.7),!0,!0,0,0),_E(t,N(.5),N(1.1),!1,!1,0,0),_E(t,N(1.6),N(1.3),!1,!1,0,0),_E(t,N(3),N(1.7),!1,!0,0,0)}for(let e=0;e<hE;e++){let t=mE[e];if(t.kind===7)qE(13,0,0,32,48,t.mirror,t.x,0,t.z,0,31,1,1);else{let e=uE[t.kind];qE(13,e.u,e.v,e.w,e.h,t.mirror,t.x,0,t.z,0,31,1,e.scale)}}}var yE=[0,1,2,2,2,1,0,-1];function bE(e,t,n,r,i){Uw.outdoor&&vE(e);let a=Math.imul(yE[L(i,6)&7],N(.02));if(t&&!e.hub)for(let t=0;t<e.door_count;t++){let n=e.doors[t],[r,i]=q_(n.side,n.pos),[o,s]=J_(n.side),c=n.side===0||n.side===1;r=r+I(o,N(c?.45:.6))|0,i=i+I(s,N(c?.45:.6))|0,n.leads_to===3?eD(6,BT(1),VT(1),16,16,!1,r,N(c?1:.2)+a|0,i,0):eD(4,n.leads_to*16,0,16,16,!1,r,N(c?1.15:.35)+a|0,i,0)}if(e.feature_x>=0){let t=P(e.feature_x)+En,r=P(e.feature_z)+En;if(oD(t,r,N(1.1)),Z_(e,e.feature_x,e.feature_z)===3){let e=n?4:3;eD(3,BT(e),VT(e),16,16,!1,t,0,r,0)}else{let e=18+L(i,6)%6;eD(20,BT(e),VT(e),16,16,!1,t,0,r,0)}}for(let t=0;t<e.decor_count;t++){let n=e.decor[t];if(_g(n.kind)){sE(n,t,i);continue}if(r.broken&1<<t)continue;let a=dE(n);if(a){fE(a,n.x,n.z,!!(t&1));continue}let o=3,s=0,c;switch(n.kind){case 2:c=+!!n.variant;break;case 3:c=2;break;case 6:o=6,c=8,r.fuse&&r.fuse[t]&&L(i,r.fuse[t]>20?4:2)&1&&(s=1);break;case 7:o=6,c=1;break;default:continue}eD(o,BT(c),VT(c),16,16,!1,n.x,0,n.z,s)}cE(e,r.room_frame,i)}function xE(e){return e===1?Uw.pillar:Sw}function SE(e,t,n,r,i){let a=$C,o=L(n-e,3),s=e+o,c=n-o,l=t+o,u=r-o,d=ET(0),f=ET(i);TT(s,l,c,u,i,xT,a);let p=dT(n,t),m=dT(n,r);bT(m,ST),q.texCoord(F(Math.imul(r,a)),d),J(n,0,r),bT(p,ST),q.texCoord(F(Math.imul(t,a)),d),J(n,0,t),bT(p,I(ST,N(.7))),q.texCoord(F(Math.imul(l,a)),f),J(c,i,l),bT(m,I(ST,N(.7))),q.texCoord(F(Math.imul(u,a)),f),J(c,i,u),p=dT(e,r),m=dT(n,r),bT(p,CT),q.texCoord(F(Math.imul(e,a)),d),J(e,0,r),bT(m,CT),q.texCoord(F(Math.imul(n,a)),d),J(n,0,r),bT(m,I(CT,N(.7))),q.texCoord(F(Math.imul(c,a)),f),J(c,i,u),bT(p,I(CT,N(.7))),q.texCoord(F(Math.imul(s,a)),f),J(s,i,u)}function CE(e,t,n,r){let i=av(n),a=P(e)+i,o=P(t)+i,s=P(e+1)-i,c=P(t+1)-i;if(Uw.rough&&n===1){let e=L(i,2);SE(a-e,o-e,s+e,c+e,r)}else kT(a,o,s,c,r)}function wE(e,t,n){let r=!1;for(let i=0;i<12;i++)for(let a=0;a<12;a++){if(Z_(e,a,i)!==n)continue;let o=ov(n);t[i][a]<31||(r||=(sT(xE(n)),q.polyBegin(1),!0),CE(a,i,n,o))}r&&q.polyEnd()}var TE=N(3.5),EE=1,DE=N(2.4),OE=N(1.6),kE=N(.5);function AE(e){let t=e.door_count?e.doors[0].pos:6;return[P(t-EE),P(t+1+EE)]}function jE(e){let t=P(12),n=TE,r=N(.75),[i,a]=AE(e);sT(Uw.floor),q.polyBegin(1);for(let e=-4;e<12;e+=2){let i=P(e),a=P(e+2)<t?P(e+2):t;TT(-n,i>-n?i:-n,0,a,0,r,$C)}for(let e=0;e<12;e+=2){let t=P(e),o=P(e+2);TT(t,-n,o,-DE,0,r,$C),o<=i||t>=a?TT(t,-DE,o,0,0,r,$C):(t<i&&TT(t,-DE,i,0,0,r,$C),o>a&&TT(a,-DE,o,0,0,r,$C))}q.polyEnd(),sT(Uw.cliff),q.polyBegin(1);for(let e=0;e<12;e++){let n=P(e),r=P(e+1);RT(n,r,t),LT(t,n,r)}q.polyEnd()}var ME=[B(9,8,10),B(6,5,7),B(3,3,4),B(1,1,2)];function NE(e){let[t,n]=AE(e),r=t+P(EE),i=r+Tn,a=-DE,o=OE,s=N(.4),c=o+kE;sT(yw),q.polyBegin(1),DT(t,r,0,0,o,CT),DT(i,n,0,0,o,CT),DT(r,i,0,KT,o,CT),OT(n,a,0,0,o,ST),DT(t+s,n-s,-s,o,c,CT),OT(n-s,a+s,-s,o,c,ST),q.polyEnd(),sT(bw),q.polyBegin(1),TT(t,a,n,-s,o,wT,$C),TT(t,-s,n,0,o,wT,$C),TT(t+s,a+s,n-s,-s,c,wT,$C),q.polyEnd(),q.materialUse(null),q.polyBegin(1);let l=N(.35),u=N(.22);for(let e=0;e<4;e++){let t=-l*e,n=-l*(e+1),a=-u*e;XT(r,n,i,t,a,ME[e]),e<3&&JT(r,i,n,a-u,a,ME[e+1],ME[e])}JT(r,i,-l*4,-u*4,KT,B(0,0,1),B(0,0,1)),YT(r,-l*4,0,-u*4,KT,B(1,1,2),B(4,4,5)),q.polyEnd()}var PE=N(-.3),FE=[31,30,28,27,27,28,30,31];function IE(e,t){if(Uw.liquid<0)return;sT(Uw.liquid),q.polyBegin(1);let n=L(t,4)%64,r=L(t,7)%64,i=FE[L(t,10)&7];for(let t=0;t<12;t++)for(let a=0;a<12;a++){if(e.cells[t][a]!==6)continue;let o=P(a),s=P(a+1),c=P(t),l=P(t+1),u=a*16+n,d=t*16+r,f=[[o,l],[s,l],[s,c],[o,c]],p=[[u,d+16],[u+16,d+16],[u+16,d],[u,d]];for(let e=0;e<4;e++)Uw.glow?q.color(B(i,i,i)):bT(dT(f[e][0],f[e][1]),N(.8)),q.texCoord(p[e][0],p[e][1]),J(f[e][0],PE,f[e][1])}q.polyEnd()}function LE(e,t,n){let r=!1,i=()=>{r||=(q.materialUse(null),q.polyBegin(1),!0)};if(t.flood_ring>=0){let r=L(n,6)&1?B(31,10,2):B(18,4,1);for(let n=0;n<12;n++)for(let a=0;a<12;a++)JS(a,n)===t.flood_ring&&e.cells[n][a]===0&&(i(),XT(P(a)+N(.06),P(n)+N(.06),P(a+1)-N(.06),P(n+1)-N(.06),N(.004),r))}for(let r=0;t.crust&&r<e.hazard_count;r++){let a=e.hazards[r];if(a.kind!==4||t.crust[r]>=45)continue;let o=t.crust[r],s=o===0?B(10,3,1):L(n,o>L(45,2)?2:4)&1?B(31,16,2):B(20,6,1);i(),XT(a.x-N(.42),a.z-N(.42),a.x+N(.42),a.z+N(.42),N(.003),s)}r&&q.polyEnd()}function RE(e,t,n,r,i,a,o){qw(e),yT(e,n,r,a,o.room_frame),NT(e),IE(e,a),LE(e,o,a),GT(e,o),Uw.outdoor?(jE(e),NE(e)):(rE(e,i),iE(e,i),zT(e),aE(e,i)),wE(e,t,1),wE(e,t,2)}function zE(e,t){let n=8;for(let r=0;r<12;r++)for(let i=0;i<12;i++){let a=Z_(e,i,r);a!==1&&a!==2||t[r][i]>=31||(sT(xE(a)),q.polyFormat(t[r][i],n,0,0),q.polyBegin(1),CE(i,r,a,ov(a)),q.polyEnd(),n=n<62?n+1:8)}q.polyFormat(31,0,0,0)}var BE=N(.375),VE=N(1.3),HE=N(.0625),UE=N(.0763),WE=N(.7);function GE(e,t){q.materialUse(Zw[e]),t===1?q.paletteUse(`white`):t===2&&Qw[e]?q.paletteUse(Qw[e].tex):t>=3&&$w[e][t]&&q.paletteUse($w[e][t].tex)}function KE(e,t,n,r,i,a,o,s,c,l,u,d,f){let p=t,m=t+r;a&&(p=t+r,m=t);let h=I(I(L(Math.imul(r,HE),2),f),N(.70711)),g=o,_=c;o=o+nw(ew)|0,s=s+rw(ew)|0,c=c+iw(ew)|0;let v=s+I(Math.imul(i,UE),f)|0;GE(e,l),q.polyFormat(u,d,0,1),q.polyBegin(1);let y=dT(g,_);y<WE&&(y=WE),bT(l===1?Tn:y,Tn),q.texCoord(p,n+i),J(o-h,s,c+h),q.texCoord(m,n+i),J(o+h,s,c-h),q.texCoord(m,n),J(o+h,v,c-h),q.texCoord(p,n),J(o-h,v,c+h),q.polyEnd(),q.polyFormat(31,0,0,0)}function qE(e,t,n,r,i,a,o,s,c,l,u,d,f){KE(e,t,n,r,i,a,o,s,c,l,u,d,Math.imul(f,Tn))}function JE(e,t,n,r,i,a,o,s,c,l,u,d){qE(e,t,n,r,i,a,o,s,c,l,u,d,1)}var YE=N(3),XE=Tn;function ZE(e){XE=e}function QE(e,t,n,r,i,a,o,s,c){qE(e,t%10*24,L(t,10)*24,24,24,n,i,a-Math.imul(Math.imul(24-r,c),UE)|0,o,s,31,1,c)}function $E(e,t,n,r,i,a,o,s,c,l){let u=L(256,t),d=n%u*t,f=L(n,u)*t;XE!==4096&&(l=I(l,XE),l>YE&&(l=YE)),KE(e,d,f,t,t,r,a,o-I(Math.imul(t-i,UE),l)|0,s,c,31,1,l)}function eD(e,t,n,r,i,a,o,s,c,l){JE(e,t,n,r,i,a,o,s,c,l,31,1)}function tD(e,t,n,r,i,a,o,s){KE(e,t%10*24,L(t,10)*24,24,24,n,i,-I(Math.imul(24-r,UE),XE)|0,a,1,o,s,XE)}function nD(e,t,n,r,i,a,o,s,c,l,u){let d=N(.02)+rw(tw)|0;a=a+nw(tw)|0,o=o+iw(tw)|0,q.materialUse(Zw[e]),u===2&&Qw[e]&&q.paletteUse(Qw[e].tex),q.polyFormat(c,l,0,1),q.polyBegin(1),q.color(B(31,31,31)),q.texCoord(t,n+i),J(a-s,d,o+s),q.texCoord(t+r,n+i),J(a+s,d,o+s),q.texCoord(t+r,n),J(a+s,d,o-s),q.texCoord(t,n),J(a-s,d,o-s),q.polyEnd(),q.polyFormat(31,0,0,0)}function rD(e){let t,n;switch(e.kind){case 8:return 3;case 4:return e.life*2>=e.max_life?4:(t=8,n=2,t+L((L(e.max_life,2)-e.life)*n,L(e.max_life,2)+1));case 9:t=10,n=4;break;case 10:t=14,n=3;break;case 11:t=17,n=3;break;default:return e.kind}let r=e.max_life-e.life;return t+L(r*n,e.max_life+1)}function iD(e){let t=I(L(4*HE,2),N(.70711)),n=4*UE,r=!1;for(let i=0;i<96;i++){let a=e.parts[i];if(!a.active)continue;r||=(q.materialUse(Zw[5]),q.polyFormat(31,1,0,1),q.polyBegin(1),!0);let o=rD(a)*4,s=dT(a.x,a.z),c=a.x+nw(ew)|0,l=a.y+rw(ew)|0,u=a.z+iw(ew)|0;bT(a.kind===4||a.kind===9||a.kind===10||a.kind===0?Tn:s<WE?WE:s,Tn),q.texCoord(o,28),J(c-t,l,u+t),q.texCoord(o+4,28),J(c+t,l,u-t),q.texCoord(o+4,24),J(c+t,l+n,u-t),q.texCoord(o,24),J(c-t,l+n,u+t)}r&&(q.polyEnd(),q.polyFormat(31,0,0,0));for(let t=0;t<8;t++){let n=e.floaters[t];if(!n.active||n.life<10&&n.life&1)continue;let r=n.kill?36:28,i=n.value>=10?2:1;for(let e=0;e<i;e++){let t=e===0&&i===2?L(n.value,10):n.value%10,a=I((e*2-(i-1))*L(5*HE,2),N(.70711)),o=-a;eD(5,t*5,r,5,7,!1,n.x+a,n.y,n.z+o,0)}}}function aD(e,t,n,r,i,a,o){KE(e,t%10*24,L(t,10)*24,24,24,n,i,-I(Math.imul(24-r,UE),XE)|0,a,o,31,1,XE)}function oD(e,t,n){let r=I(I(N(.45),n),XE),i=N(.01)+rw(tw)|0;e=e+nw(tw)|0,t=t+iw(tw)|0,q.materialUse(Zw[0]),q.polyFormat(31,2,0,1),q.polyBegin(1),q.color(B(31,31,31)),q.texCoord(240,248),J(e-r,i,t),q.texCoord(256,248),J(e,i,t-r),q.texCoord(256,256),J(e+r,i,t),q.texCoord(240,256),J(e,i,t+r),q.polyEnd(),q.polyFormat(31,0,0,0)}var sD=10,cD=0,lD=1,uD=2,dD=3,fD=[];for(let e=0;e<sD;e++)fD.push({kind:0,frame:0,depth:0,phase:0,x:0,y:0,z:0,size:0});function pD(e){let t=Ba();Va(t,qa(e,28701,0));for(let e=0;e<sD;e++){let n=fD[e];if(n.kind=Wa(t,dD),n.frame=Wa(t,4),n.depth=U(t,4,12),n.phase=Wa(t,64),n.size=N(.5)+Math.imul(Wa(t,1001),N(.001))|0,Ga(t,50)){let e=U(t,-4,12),r=U(t,3,7),i=Ga(t,50);n.x=P(i?-r:e),n.z=P(i?e:-r),n.y=P(U(t,-2,2))}else{let e=Wa(t,4),r=U(t,-2,14),i=U(t,2,6);n.x=P(e===0?-i:e===1?12+i:r),n.z=P(e===2?-i:e===3?12+i:r),n.y=-P(U(t,4,8))}}}var mD=[0,1,2,2,1,0,-1,-1];function hD(e,t){let n=P(12)/2;for(let r=0;r<sD;r++){let i=fD[r],a=Tn-i.depth*L(Tn,16)|0,o=i.x+I(e.x-n,a)|0,s=i.z+I(e.z-n,a)|0,c=i.y+Math.imul(mD[(t>>4)+i.phase&7],N(.04))|0,l=Tn;if(c>-P(3)&&o>-l&&s>-l&&o<P(12)+l&&s<P(12)+l)continue;let u=N(.15)+Math.imul(i.depth,N(.025))|0;switch(i.kind){case cD:case lD:{let e=i.kind===lD?N(.7):i.size,t=i.kind===lD?i.size*4:i.size;sT(i.kind===lD?xw:yw),q.polyBegin(1);let n=o-L(e,2),r=o+L(e,2),a=s-L(e,2),l=s+L(e,2);q.color(B(F(31*u),F(28*u),F(30*u))),q.texCoord(0,0),J(n,c+t,l),q.texCoord(16,0),J(r,c+t,l),q.texCoord(16,16),J(r,c+t,a),q.texCoord(0,16),J(n,c+t,a),q.color(B(F(24*u),F(22*u),F(24*u))),q.texCoord(16,32),J(r,c,l),q.texCoord(0,32),J(r,c,a),q.texCoord(0,0),J(r,c+t,a),q.texCoord(16,0),J(r,c+t,l),q.color(B(F(17*u),F(16*u),F(18*u))),q.texCoord(0,32),J(n,c,l),q.texCoord(16,32),J(r,c,l),q.texCoord(16,0),J(r,c+t,l),q.texCoord(0,0),J(n,c+t,l),q.polyEnd();break}case uD:{let e=14+i.frame;eD(6,BT(e),VT(e),16,16,!!(i.phase&1),o,c,s,0);break}}}}var gD=0;function _D(e){ci(),di(0),e&&mi(2)}function vD(){To(48,20),gD+=96}var yD=7434725,bD=xg(),xD=yv(),SD=x_(),CD=!1;function wD(){Bx(bD,yD,1,2,3,6),bD.enemy_count=0,bv(xD),pD(yD),D_(SD,0,P(12),N(4.6),N(4.6)),CD=!0}var TD={broken:0,fuse:null,crate_broken:null,room_frame:0,crust:null,flood_ring:-1};function ED(){CD||wD();let e=A.game_frames|0,t=N(5.5),n=N(7.3);TD.room_frame=e>>>0,aT(SD),hD(SD,e),RE(bD,xD,t,n,!1,e,TD),bE(bD,!1,!1,TD,e),oD(t,n,Tn),aD(0,0+Math.trunc(e/32)%2,!1,19,t,n,0)}function DD(e){let t=Math.trunc((e>>>0)/60);return t>=60?z(`%luh%02lum`,Math.trunc(t/60),t%60):z(`%lum`,t)}function OD(e,t){ui(e,8,`- records -`),li(8,e+2,15,`Best depth`),li(20,e+2,11,`%4lu`,t.best_depth),li(8,e+4,15,`Runs`),li(20,e+4,11,`%4lu`,t.total_runs),li(8,e+6,15,`Gold`),li(20,e+6,11,`%4lu`,t.currency);let n=DD(t.play_seconds);li(8,e+8,15,`Played`),li(24-n.length,e+8,11,`%s`,n),t.cheats_used&&fi(24,e+2,``,14)}function kD(e,t){ci(),ui(1,e.abandoned?8:9,`%s`,t),ui(3,15,`%s`,Mv(e.cause)),ui(5,15,`Depth %d, %s`,e.depth,f_[c_(e.depth)].name),e.new_best&&ui(7,11,`* new best depth *`);let n=[`Rooms`,`Kills`,`Bosses`,`Gold`,`Time`,`Earned`],r=[z(`%d`,e.rooms_cleared),z(`%d`,e.kills),z(`%d`,e.bosses),z(`%d`,e.gold),e.seconds>=3600?z(`%d:%02d:%02d`,Math.trunc(e.seconds/3600),Math.trunc(e.seconds/60)%60,e.seconds%60):z(`%d:%02d`,Math.trunc(e.seconds/60),e.seconds%60),z(`%d`,e.earned)].map(e=>e.slice(0,23));for(let e=0;e<6;e++){let t=e&1?17:2,i=9+Math.trunc(e/2)*2;li(t,i,8,`%s`,n[e]),li(t+13-r[e].length,i,11,`%s`,r[e])}e.cheated?(li(3,15,8,`Seed %08lX`,e.seed),fi(18,15,``,14),li(20,15,14,`Code Genie`)):ui(15,8,`Seed %08lX`,e.seed);let i=0;for(let t=0;t<13;t++)i+=+(e.boons[t]>0);if(i===0){ui(18,8,`No boons taken`);return}ui(17,8,`- boons -`);let a=i>6,o=0;for(let t=0;t<13;t++){if(!e.boons[t])continue;let n=o&1?16:1,r=a?18+Math.trunc(o/2):19+Math.trunc(o/2)*2;if(a&&o===11&&i>12){li(n,r,8,`+%d more`,i-11);break}e.boons[t]>1?li(n,r,11,`%s x%d`,Rv[t].name,e.boons[t]):li(n,r,11,`%s`,Rv[t].name),o++}}var AD={now:!1},jD=Array(14),MD=-1,ND=-1,PD=-1,FD=0;function ID(e,t){jD[e]=t}function LD(e){PD=e}function RD(){return ND}function zD(){return FD}function BD(){if(PD===-1)return;let e=PD;PD=-1,MD!==-1&&jD[MD]?.exit?.(),ND=MD,MD=e,FD=0,jD[MD]?.enter?.()}function VD(){BD(),MD!==-1&&(jD[MD]?.update?.(),FD=FD+1>>>0)}function HD(){MD!==-1&&jD[MD]?.draw?.()}function UD(){return MD===-1?`none`:jD[MD]?.name??`?`}var WD=5,GD=60,KD=48,qD=22,JD=20,YD=`v2.5.0`,XD=0,ZD=0,QD=0,$D=-1,eO=``;function tO(){return 31-YD.length}function nO(){$D>=0&&V(31-eO.length,$D,15,`%*s`,eO.length,``),$D=-1}function rO(){let e=JD-Math.trunc((KD-QD)*4/KD);e!==$D&&(nO(),$D=e);let t=QD>Math.trunc(KD/3)?11:8;V(31-eO.length,e,t,`%s`,eO)}function iO(){let e=zD();if(XD=XD>0&&e-ZD>>>0<=GD?XD+1:1,ZD=e,XD>=WD){XD=0,nO(),R(6),LD(11);return}R(0),nO();let t=WD-XD;eO=z(`%d tap%s to go`,t,t===1?``:`s`).slice(0,23),QD=KD,rO()}function aO(){let e=tO();m((e-1)*8,168,(32-e+1)*8,24)&&iO(),QD>0&&(--QD===0?nO():rO())}function oO(e){let t=0;for(let n=0;n<13;n++)Lt(Ft.active,n)&&(li(t%2?17:1,e+Math.trunc(t/2),14,`%s`,Pt[n].name),t++)}var sO=[{artist:`Kosmo The Cat`,licence:`CC0`,tracks:`title, dungeon, boss`},{artist:`Beyond`,licence:`public domain`,tracks:`camp, sewers`},{artist:`Drozerix`,licence:`public domain`,tracks:`caverns`},{artist:`JAM`,licence:`public domain`,tracks:`molten depths`}];function cO(){ar(1),_D(!0),ui(0,11,`- ABOUT DELVE -`),ui(9,15,`An endless dungeon crawl`),ui(11,15,`for the Nintendo DS`),ui(13,8,`Version %s`,`2.5.0`),Ft.active?(fi(9,15,``,14),li(11,15,14,`Code Genie`),oO(17)):k.meta.cheats_used&&(fi(3,15,``,14),li(5,15,8,`This save used Code Genie`)),qi(),$i(2,0,28,17),H(1,8,`- MUSIC -`);for(let e=0;e<4;e++){let t=3+e*3;V(3,t,11,`%s`,sO[e].artist),V(28-sO[e].licence.length,t,8,`%s`,sO[e].licence),V(4,t+1,15,`%s`,sO[e].tracks)}V(3,15,8,`Art Shade, font devurandom`),V(3,17,8,`See LICENSES.md`),ia(),V(tO(),qD,8,`%s`,YD),XD=0,QD=0,$D=-1}function lO(){vD(),aO(),(o.down&11||aa())&&(R(26),LD(1))}var uO={name:`about`,enter:cO,update:lO},dO=`# Credits

Delve by pandymic. Code written with Claude (Anthropic). Licences and
sources for everything below: [LICENSES.md](LICENSES.md).

## Libraries (linked into delve.nds)

| Library | Author | Licence |
|---|---|---|
| [BlocksDS](https://github.com/blocksds/sdk) (libnds, crt, ARM7 core) | Antonio Niño Díaz and contributors; libnds from devkitPro | zlib |
| [Nitro Engine](https://github.com/AntonioND/nitro-engine) | Antonio Niño Díaz | MIT |
| [Maxmod](https://github.com/blocksds/maxmod) | Mukunda Johnson and contributors | ISC |
| [picolibc](https://github.com/picolibc/picolibc) | Keith Packard and contributors | BSD-style (see the project) |

## Art

| Asset | Author | Licence | Used for |
|---|---|---|---|
| [Puny Characters](https://opengameart.org/content/puny-characters) | Shade | CC0 1.0 | Player, orc and mage sprites |
| [Miniworld Sprites](https://opengameart.org/content/miniworld-sprites) | Shade | CC0 1.0 | The Caverns' and Molten Depths' monsters: cave crab, imp, magma brute, Cavern Yeti, Magma Lord |
| [16x16 Puny Dungeon Tileset](https://opengameart.org/content/16x16-puny-dungeon-tileset) | Shade | CC0 1.0 | Floors, walls, pillars, crates, torch handles, chests, barrels, pots, chains, decals, traps, idols, icons |
| [16x16 Puny World Tileset](https://opengameart.org/content/16x16-puny-world-tileset) | Shade | CC0 1.0 | The camp (grass, dirt, cliffs, trees, tent, well, signpost, benches, rocks) and, recoloured, cave rock and lava |
| [8x8 fonts for Grafx2 and Linux](https://opengameart.org/content/a-package-of-8-bit-fonts-for-grafx2-and-linux) (Victoria Bold) | devurandom | CC0 1.0 | The text font and the title logo's letters |

The originals are in \`art/third_party/\` and are imported by
\`tools/import_art.py\`. The same script draws a few original pieces in the
Puny palette:
- the clutter (bones, skull, cobweb, crack, rubble, banners);
- the effects (fireball, coin, heart, particles, digits, blast ring);
- every flame: torch flames on Shade's handles, the campfire, fire jets and
  the Flame Dash trail, drawn by \`tools/flames.py\`;
- the recoloured or broken versions of Puny props (explosive barrel, broken pot, crate debris).

The remaining placeholder art (door reward icons, the UI icons) is
generated by \`tools/make_art.py\`.

## Music

CC0 and public-domain tracker modules. [LICENSES.md](LICENSES.md) lists each
one with its source.

| Track | Artist | Licence | Plays in |
|---|---|---|---|
| *Calm and simple title music* | Kosmo The Cat | CC0 1.0 | Title and menus |
| *Piano tune* | Beyond | Public domain | The camp |
| *Wander in a dungeon* | Kosmo The Cat | CC0 1.0 | The Dungeon |
| *Song0* | Beyond | Public domain | The Sunken Sewers |
| *Ambient Starfield* | Drozerix | Public domain | The Crystal Caverns |
| *Crusaders* | JAM | Public domain | The Molten Depths |
| *Evil boss music* | Kosmo The Cat | CC0 1.0 | Bosses |

## Sound effects

Original to Delve, synthesized from scratch by \`tools/make_audio.py\`. Its
earlier original soundtrack can still be generated (\`--songs\`).

## Easter egg

A hidden tribute to **Rogue** (1980) by Michael Toy, Glenn Wichman and Ken
Arnold (see [EASTER_EGG.md](EASTER_EGG.md)). It is a new implementation
with no original code. The monster names, item names and a few
of the original's famous messages are quoted in homage.

## Tools

grit, mmutil and ndstool (BlocksDS), melonDS (testing), Pillow.
`,fO=`# Licences and attribution

Every third-party piece in Delve, with its author, licence and source. The
originals are kept unmodified in \`art/third_party/\`; the tools that convert
them are named below. A short version of this list is on the game's About
screen and in its credits.

## Music

All CC0 or public domain. Thank you to the composers.

| Track | Artist | Licence | Source | In the game |
|---|---|---|---|---|
| *Calm and simple title music* | Kosmo The Cat | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [OpenGameArt](https://opengameart.org/content/calm-and-simple-title-music) | Title and menus |
| *Wander in a dungeon* | Kosmo The Cat | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/wander-in-a-dungeon) | The Dungeon (depths 1–10) |
| *Evil boss music* | Kosmo The Cat | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/evil-boss-music) | Boss fights |
| *Piano tune* | Beyond | Public domain | [The Mod Archive #213498](https://modarchive.org/index.php?request=view_by_moduleid&query=213498) | The camp |
| *Song0* | Beyond | Public domain | [The Mod Archive #184094](https://modarchive.org/index.php?request=view_by_moduleid&query=184094) | The Sunken Sewers (11–20) |
| *Ambient Starfield* | Drozerix | Public domain | [The Mod Archive #174160](https://modarchive.org/index.php?request=view_by_moduleid&query=174160) | The Crystal Caverns (21–30) |
| *Crusaders* | JAM | Public domain | [The Mod Archive #177809](https://modarchive.org/index.php?request=view_by_moduleid&query=177809) | The Molten Depths (31–40) |

- **Files:** \`art/third_party/music/\`. \`tools/import_music.py\` writes the
  game's copies (\`audio/music_*\`):
  - the XM modules' 16-bit samples become 8-bit, to fit the DS's memory;
  - two empty credit "instruments" in *Crusaders* lose their sample
    headers;
  - the notes and arrangements are unchanged.
- **Public domain:** this is The Mod Archive's licence attribution. Per its
  [licensing FAQ](https://modarchive.org/index.php?faq-licensing), the
  composer has released the module to the public domain, free to use for
  any purpose.

## Art

| Asset | Author | Licence | Source | Used for |
|---|---|---|---|---|
| Puny Characters | Shade | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/puny-characters) | The hero, the orcs, mages and archers, the slimes (and their recolours), the training dummy; grass, dirt and tree tiles |
| 16x16 Puny Dungeon Tileset | Shade | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/16x16-puny-dungeon-tileset) | Dungeon floors and walls, props, traps, gems, the basalt textures (recoloured) |
| 16x16 Puny World Tileset | Shade | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/16x16-puny-world-tileset) | The camp, cave rock and floor (recoloured) |
| Miniworld Sprites | Shade | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/miniworld-sprites) | The imp (red demon), magma brute (minotaur, recoloured), cave crab, Cavern Yeti and Magma Lord (red dragon) |
| Victoria Bold, from "a package of 8 bit fonts for grafx2 and linux" | devurandom | CC0 1.0 | [OpenGameArt](https://opengameart.org/content/a-package-of-8-bit-fonts-for-grafx2-and-linux) | The text font and the title logo |

\`tools/import_art.py\` crops, recolours and packs them; for the Miniworld
monsters it also draws hurt and death frames from their first walk frame. The bat, the
clutter, the effects, the flames (\`tools/flames.py\`: torch flames on
Shade's torch handles, campfires, fire jets), the lava and murk textures and
the placeholder icons are original (drawn by \`tools/import_art.py\` and
\`tools/make_art.py\`).

## Sound effects

Original to Delve: synthesized by \`tools/make_audio.py\`. The script can
also write Delve's earlier original soundtrack (\`--songs\`, into
\`art/generated/music/\`); the game no longer plays it.

## Libraries linked into delve.nds

| Library | Author | Licence |
|---|---|---|
| [BlocksDS](https://github.com/blocksds/sdk) (libnds, crt, ARM7 core) | Antonio Niño Díaz and contributors; libnds from devkitPro | zlib |
| [Nitro Engine](https://github.com/AntonioND/nitro-engine) | Antonio Niño Díaz | MIT |
| [Maxmod](https://github.com/blocksds/maxmod) | Mukunda Johnson and contributors | ISC |
| [picolibc](https://github.com/picolibc/picolibc) | Keith Packard and contributors | BSD-style (see the project) |

## Homage

The hidden Rogue tribute ([EASTER_EGG.md](EASTER_EGG.md)) is a new
implementation of *Rogue* (1980) by Michael Toy, Glenn Wichman and Ken
Arnold, with no original code. A few names and messages are quoted in
homage.
`,pO=`# Libraries in the web build

The web port bundles these libraries into \`dist/\` and \`delve.html\`. The
game's art, music and sounds are credited in [LICENSES.md](LICENSES.md) and
[CREDITS.md](CREDITS.md), copied from the reference repository.

| Library | Version | Licence | Use |
|---|---|---|---|
| [three.js](https://threejs.org/) | 0.186.1 | MIT | the 3D top screen |
| [chiptune3](https://github.com/DrSnuggles/chiptune) | 0.8.9 | MIT | the AudioWorklet music player |
| [libopenmpt](https://lib.openmpt.org/) (compiled to WebAssembly, inside chiptune3) | as built by chiptune3 0.8.9 | BSD 3-clause | playing the tracker modules |

## three.js

\`\`\`
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
\`\`\`

## chiptune3

\`\`\`
All code in this project is MIT (X11) licensed. The only exception are the compiled libopenmpt parts which remain under the OpenMPT project BSD license.

License text below:

Copyright © 2013-2024 The chiptune2.js and chiptune3 contributers.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
\`\`\`

## libopenmpt

From https://github.com/OpenMPT/openmpt/blob/master/LICENSE (chiptune3's
licence names it but does not include it).

\`\`\`
Copyright (c) 2004-2026, OpenMPT Project Developers and Contributors
Copyright (c) 1997-2003, Olivier Lapicque
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * Neither the name of the OpenMPT project nor the
      names of its contributors may be used to endorse or promote products
      derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
\`\`\`
`,mO={ArrowDown:40,ArrowUp:-40,PageDown:400,PageUp:-400,Space:400},hO=null,gO=null;function _O(e){e.captureNextKey(t=>{mO[t]!==void 0&&hO?(hO.scrollBy(0,mO[t]),_O(e)):yO()})}function vO(e){if(hO)return;let t=document.createElement(`div`);t.id=`licences`,t.setAttribute(`role`,`dialog`),t.setAttribute(`aria-label`,`Licences`);let n=document.createElement(`button`);n.type=`button`,n.textContent=`Close`,n.addEventListener(`click`,yO);let r=document.createElement(`pre`);r.textContent=[fO,dO,pO].map(e=>e.trim()).join(`


`),t.append(n,r),document.body.appendChild(t),hO=t,gO=e,_O(e)}function yO(){gO?.captureNextKey(null),hO?.remove(),hO=null,gO=null}function bO(){return hO!==null}var xO=[`D E L V E`,``,`an endless descent`,``,``,`- design & code -`,`pandymic`,``,`with help from Claude`,``,``,`- art -`,`Puny Characters`,`Puny Dungeon Tileset`,`Miniworld Sprites`,`by Shade (CC0)`,``,`Victoria Bold font`,`by devurandom (CC0)`,``,``,`- music -`,`Kosmo The Cat (CC0)`,`Beyond (public domain)`,`Drozerix (public domain)`,`JAM (public domain)`,``,`- sound effects -`,`original, synthesized`,`for Delve`,``,``,`- built with -`,`BlocksDS`,`Nitro Engine`,`libnds  Maxmod`,``,``,`- web port -`,`TypeScript  Vite`,`three.js (MIT)`,`libopenmpt (BSD)`,`via chiptune3 (MIT)`,``,``,`- tested on -`,`melonDS`,`Nintendo 3DS`,`(TWiLight Menu++)`,``,``,`thanks for playing`],SO=xO.length,CO=0,wO=-1;function TO(e){ci();for(let t=0;t<24;t++){let n=e+t-24;if(n<0||n>=SO)continue;let r=xO[n][0]===`-`?8:15;n===0&&(r=11),ui(t,r,`%s`,xO[n])}}var EO=13,DO=null;function OO(e){DO=e}function kO(){ar(1),CO=0,wO=-1,ci(),qi(),$i(4,6,24,5),H(8,8,`- CREDITS -`),H(EO,15,`X: licences`),ia()}function AO(){vD(),zD()%2==0&&CO++,CO>=(24+SO)*8&&(CO=0);let e=Math.trunc(CO/8);e!==wO&&(TO(e),wO=e),di(CO%8),bO()?(o.down||o.touch_down)&&yO():(o.down&1024||m(32,96,192,24))&&DO?(R(0),vO(DO)):(o.down&11||aa())&&(R(26),LD(1))}function jO(){di(0),yO()}var MO={name:`credits`,enter:kO,update:AO,exit:jO},NO=0,PO=1,FO=2,IO=NO,LO=0,RO=1,zO=vi({items:[`Play Rogue`,`Code Genie`],count:2,x:10,y:9,w:14,step:4,has_back:!0});function BO(e,t,n,r){li(1,e,8,`%s`,t),li(12,e,n,`%.19s`,r)}function VO(){let e=Math.trunc((A.game_frames>>>0)/60);li(1,23,8,`Uptime %02u:%02u:%02u`,Math.trunc(e/3600),Math.trunc(e/60)%60,e%60)}function HO(){let e=navigator.userAgent;for(let[t,n]of[[`Edge`,/Edg\/(\d+)/],[`Firefox`,/Firefox\/(\d+)/],[`Chrome`,/Chrome\/(\d+)/],[`Safari`,/Version\/(\d+)[.\d]* .*Safari/]]){let r=n.exec(e);if(r)return`${t} ${r[1]}`}return e}function UO(){let e=navigator.userAgentData,t=e?.platform||navigator.platform||`unknown`;return e?.mobile?`${t} (mobile)`:t}function WO(){ci(),ui(0,11,`- BUG REPORT -`),BO(2,`Version`,15,`2.5.0 Web`),BO(3,`Commit`,15,`7806548`),BO(4,`Built`,15,`2026-10-22`),BO(6,`three.js`,15,`r186`),BO(7,`chiptune3`,15,`0.8.9`),BO(8,`GPU`,15,rT()),BO(9,`Browser`,15,HO()),BO(11,`Platform`,15,UO()),BO(12,`Screen`,14,`${screen.width}x${screen.height} @${window.devicePixelRatio}x`),BO(13,`User`,15,S(`(not set)`)),BO(14,`Language`,15,navigator.language||`unknown`);let e=dt();BO(16,`Storage`,k.storage_ok?10:9,k.storage_ok?`browser storage OK`:`none (not saving)`),BO(17,`Save`,15,k.storage_ok&&e>=0?`delve.slot.${e+1}`:`-`),BO(18,`Records`,15,z(`%lu runs, %lu kills`,k.meta.total_runs,k.meta.total_kills)),BO(19,`Best`,15,z(`%lu`,k.meta.best_depth)),BO(20,`Upgrades`,15,z(`0x%02lX`,k.meta.upgrades)),BO(21,`Cheats`,15,z(`0x%04lX / 0x%04lX`,Ft.active,k.meta.cheats_used)),li(1,22,8,`Include this in bug reports.`),VO(),qi(),$i(4,7,24,9),H(9,11,`Bug report`),H(11,15,`on the upper screen`),H(13,8,`Any button to close`)}var GO=4,KO=6,qO=5,JO=5,YO=3,XO=17,ZO=10,QO=KO,$O=16,ek=2,tk=10,nk=22,rk=21,ik=11,ak=16,ok=17,sk=Array(8).fill(`0`),ck=0,lk=0,uk=`0123456789ABCDEF`;function dk(e,t){V(tk,nk,e,`%-*s`,rk,t)}function fk(){let e=``;for(let t=0;t<8;t++)t===4&&(e+=`-`),e+=t<ck?sk[t]:`_`;H(ek,11,`%s`,e)}function pk(e){return e<ak?[KO+e%GO*JO,qO+Math.trunc(e/GO)*YO,JO]:[e===ak?QO:$O,XO,ZO]}function mk(e){let[t,n,r]=pk(e),i=e===lk;ea(t+1,n+1,r-2,i);let a=i?11:15;e<ak?V(t+Math.trunc(r/2),n+1,a,`%c`,uk[e]):V(t+2,n+1,a,`%s`,e===ak?`Del`:`Clear`)}function hk(e){let t=0;for(let n=0;n<13;n++)Lt(Ft.active,n)&&(li(t%2?17:1,e+Math.trunc(t/2),14,`%s`,Pt[n].name),t++);t===0&&ui(e,8,`No cheats on`)}function gk(){_D(!1),ui(0,11,`- CODE GENIE -`),fi(7,0,``,14),fi(24,0,``,14),ui(2,15,`A code is eight hex digits.`),ui(4,15,`Enter one again to undo it.`),ui(6,8,`Runs with cheats mark the save`),ui(9,8,`- cheats on -`),hk(ik)}function _k(){qi(),$i(5,0,22,5),fk();for(let e=0;e<16;e++)$i(KO+e%GO*JO,qO+Math.trunc(e/GO)*YO,JO,YO);$i(QO,XO,ZO,YO),$i($O,XO,ZO,YO);for(let e=0;e<=ok;e++)mk(e);ia(),dk(8,`B: delete`)}function vk(){IO=PO,ck=0,lk=0,gk(),_k()}function yk(){let e=0;for(let t=0;t<8;t++)e=(e<<4|uk.indexOf(sk[t]))>>>0;return e}function bk(){let e={id:0},t=It(Ft,yk(),e);switch(ck=0,fk(),t){case 1:R(25),dk(10,z(`%s on`,Pt[e.id].name).slice(0,31));break;case 2:R(26),dk(8,z(`%s off`,Pt[e.id].name).slice(0,31));break;case 3:R(0),IO=FO,WO();return;case 0:R(27),dk(9,`Unknown code`);return}for(let e=ik;e<ik+7;e++)li(0,e,15,`%32s`,``);hk(ik)}function xk(e){if(e===ak||e===ok){if(ck===0){R(27);return}ck=e===ak?ck-1:0,R(26),fk()}else R(0),sk[ck++]=uk[e],fk(),ck===8?bk():ck===1&&dk(8,`B: delete`)}function Sk(e,t){for(let n=0;n<=ok;n++){let[r,i,a]=pk(n);if(e>=r*8&&e<(r+a)*8&&t>=i*8&&t<(i+YO)*8)return n}return-1}function Ck(){let e=lk;if(o.repeat&32)lk=lk<ak?Math.trunc(lk/GO)*GO+(lk+GO-1)%GO:lk===ak?ok:ak;else if(o.repeat&16)lk=lk<ak?Math.trunc(lk/GO)*GO+(lk+1)%GO:lk===ak?ok:ak;else if(o.repeat&64)lk>=ak?lk=12+(lk===ak?0:3):lk<GO?lk=lk<GO/2?ak:ok:lk-=GO;else if(o.repeat&128)lk>=ak?lk=lk===ak?0:3:lk>=12?lk=lk%GO<GO/2?ak:ok:lk+=GO;else if(o.down&1)xk(lk);else if(o.down&2){if(ck>0)xk(ak);else{R(26),Ek();return}}else if(aa()){R(26),Ek();return}else if(o.touch_down){let t=Sk(o.touch_x,o.touch_y);if(t>=0&&(lk=t,mk(e),xk(t),IO!==PO))return}lk!==e&&(o.touch_down||R(0),mk(e),mk(lk))}function wk(){zD()%60==0&&VO(),(o.down||o.touch_down)&&(R(26),IO=PO,gk(),_k(),dk(8,`Bug report closed`))}function Tk(){let e=`2.5.0`.split(`.`).slice(0,2).join(`.`).slice(0,15);_D(!1),gi(4,e),ui(11,11,`Delve %s`,`2.5.0`),ui(13,8,`built %s`,`2026-10-22`);let t=0;for(let e=0;e<13;e++)t+=+!!Lt(Ft.active,e);t&&(fi(8,17,``,14),li(10,17,14,`%d cheat%s on`,t,t===1?``:`s`)),qi(),H(1,8,`- v%s -`,`2.5.0`);for(let e=0;e<zO.count;e++)$i(zO.x-2,zO.y+e*zO.step-1,zO.w+2,3);ca(zO),Yi(zO.x+zO.w-3,zO.y+RO*zO.step,``,14),ia()}function Ek(){IO=NO,Tk()}function Dk(){switch(da(zO)){case 2:zO.cursor===LO?LD(8):vk();break;case 3:LD(5);break;case 1:Yi(zO.x+zO.w-3,zO.y+RO*zO.step,``,14)}}function Ok(){ar(1),RD()!==8&&(zO.cursor=LO),Ek()}function kk(){switch(vD(),IO){case NO:Dk();break;case PO:Ck();break;case FO:wk()}}var Ak={name:`egg`,enter:Ok,update:kk};function jk(){return IO}var Mk=vi({items:[],count:0,x:4,y:5,w:26,step:2,has_back:!0}),Nk=-1;function Pk(){let e=k.history,t=Mk.cursor,n=t===0?`LAST RUN`:z(`%d RUNS BEFORE`,t);kD(e.runs[t],n)}function Fk(){let e=k.history;Nk=RD(),Nk!==7&&ar(1),_D(!1),qi(),$i(2,0,28,21),H(1,8,`- RUN HISTORY -`),H(3,8,`%lu kills, %lu bosses`,k.meta.total_kills,k.meta.bosses_slain),Mk.count=e.count,Mk.cursor=0;for(let t=0;t<e.count;t++){let n=e.runs[t];Mk.items[t]=z(`D%-3d %-10s %+5d%s`,n.depth>999?999:n.depth,Nv(n.cause),n.earned>99999?99999:n.earned,n.new_best?`*`:``).slice(0,39)}if(e.count===0)H(10,15,`No runs yet.`),H(12,8,`Finished runs show here.`),OD(12,k.meta);else{ca(Mk);for(let t=0;t<e.count;t++)e.runs[t].cheated&&Yi(Mk.x+22,Mk.y+t*Mk.step,``,14);Pk()}ia()}function Ik(){if(vD(),Mk.count===0){(o.down&2||aa())&&(R(26),LD(Nk===-1?1:Nk));return}let e=Mk.cursor,t=da(Mk);Mk.cursor!==e&&Pk(),t===3&&LD(Nk===-1?1:Nk)}var Lk={name:`history`,enter:Fk,update:Ik},Rk=[[`Up`,64],[`Down`,128],[`Left`,32],[`Right`,16],[`A`,1],[`B`,2],[`X`,n],[`Y`,r],[`L`,512],[`R`,256],[`START`,8],[`SELECT`,4]],zk=vi({items:Rk.map(([e])=>e),count:Rk.length,x:4,y:3,w:26,step:2,value_x:13,has_back:!0,rows:9}),Bk=10,Vk=22,Hk=null,Uk=!1,Wk={};function Gk(e){Hk=e}function Kk(e){let t=/^(?:Key|Digit)(.)$/.exec(e);if(t)return t[1];let n={ArrowUp:`Up`,ArrowDown:`Down`,ArrowLeft:`Left`,ArrowRight:`Right`,Escape:`Esc`,Enter:`Enter`,ShiftLeft:`Shift`,ShiftRight:`RShift`,ControlLeft:`Ctrl`,ControlRight:`RCtrl`,AltLeft:`Alt`,AltRight:`RAlt`,Space:`Space`,Tab:`Tab`,Backspace:`Bksp`,NumpadEnter:`NEnter`};if(n[e])return n[e];let r=/^Numpad(.+)$/.exec(e);return r?`N${r[1]}`.slice(0,6):e.slice(0,6)}function qk(e){return Object.keys(Wk).filter(t=>Wk[t]===e)}function Jk(e,t){V(Bk,Vk,e,`%-21s`,t)}function Yk(e){let t=sa(zk,e);if(t<0)return;let n=qk(Rk[e][1]),r=n.length?n.map(Kk).join(` `):`-`;V(zk.value_x,t,e===zk.cursor?11:15,`%-16s`,r.slice(0,16))}function Xk(){qi(),$i(2,0,28,21),H(1,8,`- KEYS -`),ca(zk);for(let e=0;e<zk.count;e++)Yk(e);ia(),Jk(8,`A: change  X: reset`)}function Zk(){Wk=O(),Uk=!1,zk.cursor=0,zk.top=0,_D(!1),ui(1,11,`- KEYBOARD -`),ui(3,15,`Two keys for each DS button.`),ui(5,15,`A on one, then press a key.`),ui(7,8,`Esc cancels. X: the defaults.`),ui(11,11,`- GAMEPAD -`),ui(13,15,`South A  East B  West Y  North X`),ui(15,15,`LB L  RB R  Start  Back SELECT`),ui(17,8,`Nintendo's places, not labels`),Xk()}function Qk(e,t){let n=Rk[e][1];delete Wk[t];let r=qk(n);r.length>=2&&delete Wk[r[0]],Wk[t]=n,ee(Wk)}function $k(){if(vD(),Uk)return;let e=zk.cursor,t=zk.top,n=da(zk);if(zk.top!==t)for(let e=0;e<zk.count;e++)Yk(e);else zk.cursor!==e&&(Yk(e),Yk(zk.cursor));if(n===2&&Hk){let e=zk.cursor;Uk=!0,Jk(11,`Key for ${Rk[e][0]}...`),Hk.captureNextKey(t=>{if(Uk=!1,t===`Escape`)R(26),Jk(8,`Unchanged`);else{Qk(e,t),R(25);for(let e=0;e<zk.count;e++)Yk(e);Jk(10,`${Rk[e][0]}: ${Kk(t)}`)}})}else if(n===3)LD(2);else if(o.down&1024){ee(null),Wk=O(),R(0);for(let e=0;e<zk.count;e++)Yk(e);Jk(10,`The default keys`)}else n===2&&R(27)}function eA(){Hk?.captureNextKey(null),Uk=!1}var tA={name:`keys`,enter:Zk,update:$k,exit:eA};function nA(){return{cls:0,kind:0,count:0,flags:0,hit:0,dmg:0,gold:0,x:0,y:0}}function rA(){return{active:!1,type:0,x:0,y:0,hp:0,max_hp:0,awake:!1,held:0,disguise:``}}var iA=e=>e<<24>>24,aA=e=>e&255,oA=e=>e<<16>>16,sA=(e,t,n,r,i,a,o,s)=>{for(;a.length<3;)a.push([0,0]);return{glyph:e,name:t,level:n,armor:r,exp:i,dice:a,special:o,flags:s}},cA=[sA(`A`,`aquator`,5,2,20,[[0,0]],1,1),sA(`B`,`bat`,1,3,1,[[1,2]],0,2),sA(`C`,`centaur`,4,4,17,[[1,2],[1,5],[1,5]],0,0),sA(`D`,`dragon`,10,-1,5e3,[[1,8],[1,8],[3,10]],0,1),sA(`E`,`emu`,1,7,2,[[1,2]],0,1),sA(`F`,`venus flytrap`,8,3,80,[[1,6]],2,9),sA(`G`,`griffin`,13,2,2e3,[[4,3],[3,5]],0,17),sA(`H`,`hobgoblin`,1,5,3,[[1,8]],0,1),sA(`I`,`ice monster`,1,9,5,[[0,0]],3,0),sA(`J`,`jabberwock`,15,6,3e3,[[2,12],[2,4]],0,0),sA(`K`,`kestrel`,1,7,1,[[1,4]],0,1),sA(`L`,`leprechaun`,3,8,10,[[1,1]],4,0),sA(`M`,`medusa`,8,2,200,[[3,4],[3,4],[2,5]],6,1),sA(`N`,`nymph`,3,9,37,[[0,0]],5,0),sA(`O`,`orc`,1,6,5,[[1,8]],0,1),sA(`P`,`phantom`,8,3,120,[[4,4]],0,4),sA(`Q`,`quagga`,3,3,15,[[1,5],[1,5]],0,1),sA(`R`,`rattlesnake`,2,3,9,[[1,6]],7,1),sA(`S`,`snake`,1,5,2,[[1,3]],0,1),sA(`T`,`troll`,6,4,120,[[1,8],[1,8],[2,6]],0,17),sA(`U`,`black unicorn`,7,-2,190,[[1,9],[1,9],[2,9]],0,1),sA(`V`,`vampire`,8,1,350,[[1,10]],8,17),sA(`W`,`wraith`,5,4,55,[[1,6]],9,0),sA(`X`,`xeroc`,7,7,100,[[4,4]],0,32),sA(`Y`,`yeti`,4,6,50,[[1,6],[1,6]],0,0),sA(`Z`,`zombie`,2,8,6,[[1,8]],0,1)],lA=`KEBSHIROZLCQANYFTWPXUMVGJD`,uA=`amber.aquamarine.black.blue.brown.clear.crimson.cyan.ecru.gold.green.grey.magenta.orange.pink.plaid.purple.red.silver.tan.tangerine.topaz.turquoise.violet.white.yellow`.split(`.`),dA=uA.length,fA=[`healing`,`extra healing`,`gain strength`,`restore strength`,`raise level`,`see invisible`,`detect monsters`,`confusion`,`blindness`,`sleep`,`poison`],pA=[15,6,12,12,3,6,8,9,7,9,9],mA=[`identify`,`magic mapping`,`teleportation`,`enchant armor`,`enchant weapon`,`hold monster`,`sleep`,`create monster`,`aggravate monsters`,`scare monster`,`remove curse`],hA=[25,8,10,9,8,4,4,6,4,5,8],gA=`ab.ag.aks.ala.an.ankh.arg.ash.bek.bu.cer.dan.el.eep.fid.gan.hi.ion.ix.ka.kli.la.lem.mar.mik.nag.neg.nih.nom.oo.pay.po.qua.re.ri.sne.ta.uk.ul.vo.xu.za.zok`.split(`.`),_A=gA.length,vA=[{name:`mace`,n:2,sides:4},{name:`long sword`,n:3,sides:4},{name:`dagger`,n:1,sides:6},{name:`two handed sword`,n:4,sides:4},{name:`spear`,n:2,sides:3}],yA=[{name:`leather armor`,ac:8,weight:20},{name:`ring mail`,ac:7,weight:15},{name:`studded leather armor`,ac:7,weight:15},{name:`scale mail`,ac:6,weight:13},{name:`chain mail`,ac:5,weight:12},{name:`splint mail`,ac:4,weight:10},{name:`banded mail`,ac:4,weight:10},{name:`plate mail`,ac:3,weight:5}],bA=[10,20,40,80,160,320,640,1300,2600,5200,13e3,26e3,5e4,1e5,2e5,4e5,8e5,2e6,4e6,8e6],xA=bA.length,SA=1300,CA=2e3,wA=300,TA=150,EA=-500,DA=255,OA=70,kA=30;function Y(e,t){return t>0?Wa(e.rng,t>>>0):0}function AA(e,t,n){let r=0;for(let i=0;i<t;i++)r+=Y(e,n)+1;return r}var jA=(e,t)=>e>t?e:t,MA=(e,t)=>e<t?e:t,NA=e=>e<0?-e:e;function PA(e,t){return e>=0&&t>=0&&e<32&&t<22}function FA(e){return e===3||e===4||e===5||e===6}function IA(e,t,n){return PA(t,n)&&FA(e.map[n][t].tile)}function LA(e,t,n,r,i){return t===r||n===i?!0:e.map[n][t].tile===4||e.map[i][r].tile===4?!1:IA(e,r,n)&&IA(e,t,i)}function RA(e,t,n){for(let r=0;r<24;r++)if(e.monsters[r].active&&e.monsters[r].x===t&&e.monsters[r].y===n)return r;return-1}function zA(e,t,n){for(let r=0;r<32;r++)if(e.floor[r].cls!==0&&e.floor[r].x===t&&e.floor[r].y===n)return r;return-1}function BA(e){return`aeiou`.includes(e[0])?`an`:`a`}function VA(e,t){let n=cA[t.type];return n.flags&4&&!e.player.see_invisible?`it`:n.name}function HA(e,t){return e.length<t?e:e.slice(0,t-1)}function X(e,t,...n){let r=HA(z(t,...n),64);r[0]>=`a`&&r[0]<=`z`&&(r=r[0].toUpperCase()+r.slice(1));let i=e.msg_count<8?e.msg_count++:7;e.msgs[i]=r,e.history[e.history_head]=r,e.history_head=(e.history_head+1)%12}function UA(e,t,n){let r=0;for(let e=0;e<n;e++)r+=t[e];let i=Y(e,r);for(let e=0;e<n;e++){if(i<t[e])return e;i-=t[e]}return n-1}function WA(e,t,n){if(Object.assign(t,nA()),n===0){let t=Y(e,100);n=t<27?3:t<64?4:t<81?2:t<90?5:6}switch(t.cls=n,t.count=1,n){case 3:t.kind=UA(e,pA,11);break;case 4:t.kind=UA(e,hA,11);break;case 2:t.kind=+(Y(e,10)===0);break;case 5:t.kind=Y(e,5),Y(e,10)===0?(t.flags|=2,t.hit=iA(-(Y(e,3)+1))):Y(e,10)===0&&(t.hit=iA(Y(e,3)+1),t.dmg=iA(Y(e,2)));break;case 6:{t.kind=UA(e,yA.map(e=>e.weight),8);let n=Y(e,100);n<20?(t.flags|=2,t.hit=iA(-(Y(e,3)+1))):n<28&&(t.hit=iA(Y(e,3)+1));break}}}function GA(e){return e===3||e===4||e===2}function KA(e,t){if(GA(t.cls))for(let n=0;n<e.pack_count;n++){let r=e.pack[n];if(r.cls===t.cls&&r.kind===t.kind&&r.count<99)return r.count=aA(r.count+t.count),n}return e.pack_count>=17?-1:(e.pack[e.pack_count]={...t},e.pack[e.pack_count].flags&=251,e.pack_count++)}function qA(e,t,n){let r=e.pack[t];if(!n&&r.count>1){r.count--;return}for(let n=t;n<e.pack_count-1;n++)e.pack[n]={...e.pack[n+1]};e.pack_count--;let i=e.player;i.weapon===t?i.weapon=-1:i.weapon>t&&i.weapon--,i.armor===t?i.armor=-1:i.armor>t&&i.armor--}function JA(e,t,n,r){for(let i=0;i<32;i++)if(e.floor[i].cls===0)return e.floor[i]={...t,x:iA(n),y:iA(r)},i;return-1}function YA(e){switch(e){case 1:return`*`;case 2:return`:`;case 3:return`!`;case 4:return`?`;case 5:return`)`;case 6:return`]`;case 7:return`,`;default:return` `}}function XA(e,t,n=64){let r=t.count,i=r>1,a;switch(t.cls){case 1:a=z(`%u gold pieces`,t.gold);break;case 2:a=t.kind===1?i?z(`%d slime-molds`,r):`a slime-mold`:i?z(`%d food rations`,r):`a food ration`;break;case 3:{let n=uA[e.potion_color[t.kind]];a=e.potion_known[t.kind]?i?z(`%d potions of %s`,r,fA[t.kind]):z(`a potion of %s`,fA[t.kind]):i?z(`%d %s potions`,r,n):z(`%s %s potion`,BA(n),n);break}case 4:a=e.scroll_known[t.kind]?i?z(`%d scrolls of %s`,r,mA[t.kind]):z(`a scroll of %s`,mA[t.kind]):i?z(`%d scrolls titled '%s'`,r,e.scroll_title[t.kind]):z(`a scroll titled '%s'`,e.scroll_title[t.kind]);break;case 5:a=t.flags&1?z(`%+d,%+d %s`,t.hit,t.dmg,vA[t.kind].name):z(`%s %s`,BA(vA[t.kind].name),vA[t.kind].name);break;case 6:a=t.flags&1?z(`%+d %s [%d]`,t.hit,yA[t.kind].name,yA[t.kind].ac-t.hit):yA[t.kind].name;break;case 7:a=`the Amulet of Yendor`;break;default:a=``}return HA(HA(a,64),n)}function ZA(e,t){if(t<0||t>=e.pack_count)return null;switch(e.pack[t].cls){case 3:return`quaff`;case 4:return`read`;case 2:return`eat`;case 5:return t===e.player.weapon?null:`wield`;case 6:return t===e.player.armor?`take off`:`wear`;default:return null}}var QA=[0,10,21,32],$A=[0,7,14,22];function ej(e,t,n,r,i){e.map[n][t].tile=r,e.map[n][t].room=i}function tj(e){let t=Array(9).fill(!1),n=Y(e,4);for(let r=0;r<n;r++)t[Y(e,9)]=!0;for(let n=0;n<9;n++){let r=e.rooms[n],i=n%3,a=Math.trunc(n/3),o=QA[i],s=$A[a],c=QA[i+1]-o,l=$A[a+1]-s;if(r.gone=t[n],r.dark=!r.gone&&Y(e,10)<e.level-1,r.gone)r.x=iA(o+1+Y(e,c-2)),r.y=iA(s+1+Y(e,l-2)),r.w=r.h=1,ej(e,r.x,r.y,5,DA);else{r.w=iA(4+Y(e,c-4)),r.h=iA(4+Y(e,l-4)),r.x=iA(o+Y(e,c-r.w)),r.y=iA(s+Y(e,l-r.h));for(let t=r.y;t<r.y+r.h;t++)for(let i=r.x;i<r.x+r.w;i++){let a=3;t===r.y||t===r.y+r.h-1?a=1:(i===r.x||i===r.x+r.w-1)&&(a=2),ej(e,i,t,a,n)}}}}function nj(e,t,n){PA(t,n)&&e.map[n][t].tile===0&&(e.map[n][t].tile=5)}function rj(e,t,n,r){let i=e.rooms[t];if(i.gone)return[i.x,i.y];let a,o;return n?(a=n>0?i.x+i.w-1:i.x,o=i.y+1+Y(e,i.h-2)):(o=r>0?i.y+i.h-1:i.y,a=i.x+1+Y(e,i.w-2)),e.map[o][a].tile=4,[a+n,o+r]}function ij(e,t,n){let r=n===t+1,[i,a]=rj(e,t,+!!r,+!r),[o,s]=rj(e,n,r?-1:0,r?0:-1);if(r){let t=i+Y(e,o-i+1);for(let n=i;n<=t;n++)nj(e,n,a);for(let n=MA(a,s);n<=jA(a,s);n++)nj(e,t,n);for(let n=t;n<=o;n++)nj(e,n,s)}else{let t=a+Y(e,s-a+1);for(let n=a;n<=t;n++)nj(e,i,n);for(let n=MA(i,o);n<=jA(i,o);n++)nj(e,n,t);for(let n=t;n<=s;n++)nj(e,o,n)}}function aj(e,t){return e>t&&([e,t]=[t,e]),t===e+1&&e%3!=2||t===e+3}function oj(e){let t=Array.from({length:9},()=>Array(9).fill(!1)),n=Array(9).fill(!1),r=1;for(n[Y(e,9)]=!0;r<9;){let i=Y(e,9),a=Y(e,9);n[i]&&!n[a]&&aj(i,a)&&(n[a]=!0,r++,t[i][a]=t[a][i]=!0,ij(e,i<a?i:a,i<a?a:i))}for(let n=Y(e,5);n>0;n--){let n=Y(e,9),r=Y(e,9);n!==r&&aj(n,r)&&!t[n][r]&&(t[n][r]=t[r][n]=!0,ij(e,n<r?n:r,n<r?r:n))}}function sj(e){for(;;){let t=Y(e,9);if(!e.rooms[t].gone)return t}}function cj(e,t){let n=e.rooms[t];for(let t=0;t<40;t++){let t=n.x+1+Y(e,n.w-2),r=n.y+1+Y(e,n.h-2);if(!(e.map[r][t].tile!==3||e.map[r][t].trap)&&!(zA(e,t,r)>=0||RA(e,t,r)>=0)&&(t!==e.player.x||r!==e.player.y))return[t,r]}return null}function lj(e,t){for(;;){let n=e.level+Y(e,10)-6;n<0&&(n=Y(e,5)),n>25&&(n=Y(e,5)+21);let r=lA.charCodeAt(n)-65;if(!(t&&cA[r].flags&40))return r}}function uj(e,t,n,r,i){for(let a=0;a<24;a++){let o=e.monsters[a];if(o.active)continue;let s=cA[t];return Object.assign(o,rA()),o.active=!0,o.type=t,o.x=iA(n),o.y=iA(r),o.hp=o.max_hp=oA(jA(1,AA(e,s.level,8))),o.awake=i,s.flags&32&&(o.disguise=`!?])*:%`[Y(e,7)]),o}return null}function dj(e){let t;for(;t=cj(e,sj(e)),!t;);e.player.x=iA(t[0]),e.player.y=iA(t[1])}function fj(){return{tile:0,room:DA,trap:0,flags:0}}function pj(e){for(let t=0;t<22;t++)for(let n=0;n<32;n++)e.map[t][n]=fj();for(let t=0;t<24;t++)e.monsters[t]=rA();for(let t=0;t<32;t++)e.floor[t]=nA();e.player.held=!1,e.player.stuck=0,e.level>e.max_level&&(e.max_level=e.level),tj(e),oj(e);let t=cj(e,sj(e))??[0,0];if(e.map[t[1]][t[0]].tile=6,Y(e,10)<e.level){let t=MA(Y(e,Math.trunc(e.level/4)+1)+1,10);for(let n=0;n<t;n++){let t=cj(e,sj(e));t&&(e.map[t[1]][t[0]].trap=1+Y(e,6))}}let n=nA(),r=!1;for(let t=0;t<9;t++){if(e.rooms[t].gone||Y(e,2))continue;let r=cj(e,t);r&&(Object.assign(n,nA()),n.cls=1,n.gold=Y(e,50+10*e.level)+2&65535,JA(e,n,r[0],r[1]))}for(let t=0;t<9;t++){if(Y(e,3)!==0)continue;let t=cj(e,sj(e));t&&(WA(e,n,0),r||=n.cls===2,JA(e,n,t[0],t[1]))}if(!r&&++e.levels_without_food>=3){let t=cj(e,sj(e));t&&(WA(e,n,2),JA(e,n,t[0],t[1]),r=!0)}if(r&&(e.levels_without_food=0),e.level>=26&&!e.player.has_amulet){let t=cj(e,sj(e));t&&(Object.assign(n,nA()),n.cls=7,n.count=1,JA(e,n,t[0],t[1]))}for(let t=0;t<9;t++){if(e.rooms[t].gone||Y(e,4)!==0)continue;let n=cj(e,t);if(!n)continue;let r=lj(e,!1),i=!!(cA[r].flags&1)&&Y(e,3)!==0;cA[r].flags&40&&(i=!1),uj(e,r,n[0],n[1],i)}dj(e),_j(e)}function mj(e){let t=[];for(let e=0;e<dA;e++)t.push(e);for(let n=dA-1;n>0;n--){let r=Y(e,n+1),i=t[n];t[n]=t[r],t[r]=i}for(let n=0;n<11;n++)e.potion_color[n]=t[n];for(let t=0;t<11;t++){let n=``,r=1+Y(e,2);for(let t=0;t<r;t++){t&&(n+=` `);let r=1+Y(e,2);for(let t=0;t<r;t++){let t=gA[Y(e,_A)];n.length+t.length<15&&(n+=t)}}e.scroll_title[t]=n}}function hj(){return{rng:Ba(0),status:0,level:0,max_level:0,cause:0,turns:0,name:``,map:Array.from({length:22},()=>Array.from({length:32},()=>({tile:0,room:0,trap:0,flags:0}))),rooms:Array.from({length:9},()=>({x:0,y:0,w:0,h:0,gone:!1,dark:!1})),monsters:Array.from({length:24},rA),floor:Array.from({length:32},nA),pack:Array.from({length:17},nA),pack_count:0,player:{x:0,y:0,hp:0,max_hp:0,str:0,max_str:0,xlevel:0,exp:0,gold:0,food:0,weapon:0,armor:0,confused:0,blind:0,frozen:0,asleep:0,stuck:0,held:!1,see_invisible:!1,has_amulet:!1},levels_without_food:0,potion_color:new Uint8Array(11),scroll_title:Array(11).fill(``),potion_known:Array(11).fill(!1),scroll_known:Array(11).fill(!1),visible:Array.from({length:22},()=>Array(32).fill(!1)),detect_monsters:!1,dist:Array.from({length:22},()=>new Uint8Array(32)),msgs:Array(8).fill(``),msg_count:0,history:Array(12).fill(``),history_head:0}}function gj(e,t,n){Object.assign(e,hj()),Va(e.rng,t>>>0),e.name=HA(n||`Rodney`,11),mj(e);let r=e.player;r.hp=r.max_hp=12,r.str=r.max_str=16,r.xlevel=1,r.food=SA,r.weapon=r.armor=-1,KA(e,{...nA(),cls:2,kind:0,count:1}),r.weapon=iA(KA(e,{...nA(),cls:5,kind:0,count:1,hit:1,dmg:1,flags:1})),r.armor=iA(KA(e,{...nA(),cls:6,kind:1,count:1,hit:1,flags:1})),e.level=1,pj(e),X(e,`hello %s, welcome to the Dungeons of Doom`,e.name)}function _j(e){for(let t of e.visible)t.fill(!1);let t=e.player;if(t.blind)e.visible[t.y][t.x]=!0;else{let n=e.map[t.y][t.x].room;if(n!==DA&&!e.rooms[n].dark)for(let t=0;t<22;t++)for(let r=0;r<32;r++)e.map[t][r].room===n&&(e.visible[t][r]=!0);for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++)PA(t.x+r,t.y+n)&&(e.visible[t.y+n][t.x+r]=!0)}for(let t=0;t<22;t++)for(let n=0;n<32;n++)e.visible[t][n]&&(e.map[t][n].flags|=1)}var vj=new Int8Array(1408);function yj(e){for(let t of e.dist)t.fill(255);let t=0,n=0;for(e.dist[e.player.y][e.player.x]=0,vj[n*2]=e.player.x,vj[n*2+1]=e.player.y,n++;t<n;){let r=vj[t*2],i=vj[t*2+1];t++;let a=e.dist[i][r];if(!(a>=kA))for(let t=-1;t<=1;t++)for(let o=-1;o<=1;o++){let s=r+o,c=i+t;(o||t)&&IA(e,s,c)&&e.dist[c][s]===255&&LA(e,r,i,s,c)&&(e.dist[c][s]=a+1,vj[n*2]=s,vj[n*2+1]=c,n++)}}}function bj(e,t,n,r){return Y(e,20)+r>=20-t-n}function xj(e){let t=e.player;if(t.armor<0)return 10;let n=e.pack[t.armor];return yA[n.kind].ac-n.hit}function Sj(e){return e<7?e-7:e<17?0:e<19?1:2}function Cj(e){return e<7?e-7:e<16?0:e-15>4?4:e-15}function wj(e){return e<1?0:e>xA?4294967295:bA[e-1]}function Tj(e){let t=e.player;for(;t.exp>=wj(t.xlevel);){t.xlevel=aA(t.xlevel+1);let n=AA(e,1,10);t.max_hp=oA(t.max_hp+n),t.hp=oA(t.hp+n),X(e,`welcome to level %d`,t.xlevel)}}function Ej(e,t){e.status!==2&&(e.player.hp=0,e.status=2,e.cause=t)}function Dj(e,t){let n=cA[t.type];if(X(e,`you have defeated the %s`,VA(e,t)),e.player.exp=e.player.exp+n.exp+Math.trunc((t.max_hp>>>0)/6)>>>0,n.special===4&&zA(e,t.x,t.y)<0){let n=nA();n.cls=1,n.gold=Y(e,50+10*e.level)+10&65535,JA(e,n,t.x,t.y)}t.active=!1,Tj(e)}function Oj(e,t){let n=e.player,r=cA[t.type];if(t.disguise){t.disguise=``,t.awake=!0,X(e,`wait! That's a %s!`,r.name);return}let i=Sj(n.str),a=1,o=2,s=0;if(n.weapon>=0){let t=e.pack[n.weapon];i+=t.hit,a=vA[t.kind].n,o=vA[t.kind].sides,s=t.dmg}if((!t.awake||t.held)&&(i+=4),t.awake=!0,!bj(e,n.xlevel,r.armor,i)){X(e,`you miss the %s`,VA(e,t));return}let c=jA(1,AA(e,a,o)+s+Cj(n.str));t.hp=oA(t.hp-c),t.hp<=0?Dj(e,t):X(e,`you hit the %s`,VA(e,t))}function kj(e){let t=e.player;if(t.armor<0)return;let n=e.pack[t.armor];n.kind===0||yA[n.kind].ac-n.hit>=9||(n.hit=iA(n.hit-1),X(e,`your armor weakens, oh my!`))}function Aj(e,t){let n=e.player;switch(cA[t.type].special){case 1:kj(e);break;case 2:n.held||X(e,`you are being held`),n.held=!0;break;case 3:Y(e,3)===0&&(n.frozen=aA(n.frozen+Y(e,3)+2),X(e,`you are frozen by the %s`,VA(e,t)));break;case 4:if(n.gold){let r=Y(e,50+10*e.level)+2>>>0;n.gold=n.gold>r?n.gold-r>>>0:0,X(e,`your purse feels lighter`),t.active=!1}break;case 5:{let r=[];for(let t=0;t<e.pack_count;t++)t!==n.weapon&&t!==n.armor&&e.pack[t].cls!==7&&r.push(t);if(r.length){let n=r[Y(e,r.length)],i=XA(e,{...e.pack[n],count:1});qA(e,n,!1),X(e,`she stole %s!`,i),t.active=!1}break}case 6:n.confused=aA(n.confused+Y(e,4)+2),X(e,`the %s's gaze has confused you`,VA(e,t));break;case 7:Y(e,2)===0&&n.str>3&&(n.str=iA(n.str-1),X(e,`you feel a bite in your leg and now feel weaker`));break;case 8:Y(e,3)===0&&n.max_hp>3&&(n.max_hp=oA(n.max_hp-1),n.hp>n.max_hp&&(n.hp=n.max_hp),X(e,`you feel weaker`));break;case 9:Y(e,5)===0&&n.xlevel>1&&(n.xlevel=aA(n.xlevel-1),n.exp=wj(n.xlevel-1),n.max_hp=oA(jA(3,n.max_hp-AA(e,1,10))),n.hp>n.max_hp&&(n.hp=n.max_hp),X(e,`you suddenly feel weaker`))}}function jj(e){let t=zA(e,e.player.x,e.player.y);return t>=0&&e.floor[t].cls===4&&e.floor[t].kind===9}function Mj(e,t){let n=cA[t.type],r=xj(e),i=0,a=!1;for(let t=0;t<3;t++){let o=n.dice[t][0],s=n.dice[t][1];if(t>0&&!o)break;bj(e,n.level,r,0)&&(a=!0,o&&(i+=AA(e,o,s)))}a?(i&&X(e,`the %s hits`,VA(e,t)),e.player.hp=oA(e.player.hp-i),e.player.hp<=0?Ej(e,t.type):Aj(e,t)):X(e,`the %s misses`,VA(e,t))}function Nj(e,t,n,r,i){return IA(e,r,i)&&RA(e,r,i)<0&&(r!==e.player.x||i!==e.player.y)&&LA(e,t,n,r,i)}function Pj(e,t){let n=Y(e,3)-1,r=Y(e,3)-1;Nj(e,t.x,t.y,t.x+n,t.y+r)&&(t.x=iA(t.x+n),t.y=iA(t.y+r))}function Fj(e,t){let n=cA[t.type],r=e.player;if(n.flags&16&&t.hp<t.max_hp&&Y(e,3)===0&&(t.hp=oA(t.hp+1)),t.held){t.held--;return}if(!t.awake){e.visible[t.y][t.x]&&!t.disguise&&Y(e,n.flags&1?2:4)===0&&(t.awake=!0);return}if(t.disguise)return;let i=NA(t.x-r.x)<=1&&NA(t.y-r.y)<=1;if(n.flags&2&&Y(e,2)===0){Pj(e,t);return}if(i&&LA(e,t.x,t.y,r.x,r.y)){jj(e)||Mj(e,t);return}if(n.flags&8)return;let a=e.dist[t.y][t.x];if(a===255){Y(e,3)===0&&Pj(e,t);return}let o=a,s=0,c=0;for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++){let i=t.x+r,a=t.y+n;!r&&!n||!PA(i,a)||e.dist[a][i]>=o||Nj(e,t.x,t.y,i,a)&&(o=e.dist[a][i],s=r,c=n)}t.x=iA(t.x+s),t.y=iA(t.y+c)}function Ij(e){if(Y(e,OA)===0)for(let t=0;t<10;t++){let t=cj(e,sj(e));if(t&&!e.visible[t[1]][t[0]]){uj(e,lj(e,!0),t[0],t[1],!0);return}}}function Lj(e){let t=e.player;if(t.food=oA(t.food-1),t.food===wA)X(e,`you are starting to get hungry`);else if(t.food===TA)X(e,`you are starting to feel weak`);else if(t.food<=0){if(t.food<=EA){Ej(e,26);return}!t.frozen&&Y(e,5)===0&&(t.frozen=aA(Y(e,8)+4),X(e,`you faint from lack of food`))}let n=jA(3,20-t.xlevel*2);t.hp<t.max_hp&&(e.turns>>>0)%n==0&&(t.hp=oA(t.hp+1)),t.confused&&--t.confused===0&&X(e,`you feel less confused now`),t.blind&&--t.blind===0&&X(e,`the veil of darkness lifts`),t.asleep&&--t.asleep===0&&X(e,`you wake up`),t.frozen&&--t.frozen===0&&X(e,`you can move again`),t.stuck&&t.stuck--}function Rj(e){if(e.turns=e.turns+1>>>0,Lj(e),e.status!==2){_j(e),yj(e);for(let t=0;t<24&&e.status!==2;t++)e.monsters[t].active&&Fj(e,e.monsters[t]);Ij(e),_j(e)}}function zj(e){e.msg_count=0,e.detect_monsters=!1}function Bj(e){dj(e),e.player.held=!1,e.player.stuck=0}function Vj(e,t){e.level=aA(t),pj(e)}function Hj(e){let t=e.player,n=e.map[t.y][t.x];switch(n.flags|=2,n.trap){case 1:X(e,`you fell through a trap door!`),Vj(e,e.level+1);break;case 2:Bj(e),X(e,`you feel a wrenching sensation`);break;case 3:t.asleep=aA(t.asleep+Y(e,5)+2),X(e,`a strange white mist envelops you and you fall asleep`);break;case 4:bj(e,e.level-1,xj(e),1)?(t.hp=oA(t.hp-AA(e,1,6)),X(e,`oh no! An arrow shot you`),t.hp<=0&&Ej(e,27)):X(e,`an arrow shoots past you`);break;case 5:t.stuck=aA(Y(e,4)+4),X(e,`you are caught in a bear trap`);break;case 6:X(e,`a gush of water hits you on the head`),kj(e)}}function Uj(e){let t=zA(e,e.player.x,e.player.y);if(t<0)return;let n=e.floor[t];if(n.cls===1){e.player.gold=e.player.gold+n.gold>>>0,X(e,`you found %u gold pieces`,n.gold),n.cls=0;return}if(n.cls===4&&n.kind===9&&n.flags&4){X(e,`the scroll turns to dust as you pick it up`),n.cls=0;return}let r=KA(e,n);r<0?X(e,`there's no room for %s`,XA(e,n)):(n.cls===7&&(e.player.has_amulet=!0,X(e,`you have the Amulet of Yendor! Now go up!`)),n.cls=0,X(e,`%c) %s`,String.fromCharCode(97+r),XA(e,e.pack[r])))}function Wj(e,t,n){if(e.status!==0||qj(e))return!1;zj(e);let r=e.player;if(r.confused&&Y(e,5)!==0)do t=Y(e,3)-1,n=Y(e,3)-1;while(!t&&!n);let i=r.x+t,a=r.y+n;if(!PA(i,a))return!1;let o=RA(e,i,a);return o>=0&&LA(e,r.x,r.y,i,a)?(Oj(e,e.monsters[o]),Rj(e),!0):!IA(e,i,a)||!LA(e,r.x,r.y,i,a)?!1:r.held?(X(e,`you are being held`),Rj(e),!0):r.stuck?(X(e,`you are still stuck in the bear trap`),Rj(e),!0):(r.x=iA(i),r.y=iA(a),_j(e),e.map[a][i].trap&&Hj(e),Uj(e),e.status===0&&Rj(e),!0)}function Gj(e){if(e.status!==0||qj(e))return!1;zj(e);let t=e.player;for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++){let i=t.x+r,a=t.y+n;!PA(i,a)||!e.map[a][i].trap||e.map[a][i].flags&2||Y(e,3)===0&&(e.map[a][i].flags|=2,X(e,`you found a trap`))}return Rj(e),!0}function Kj(e){if(e.status!==0||qj(e))return!1;zj(e);let t=e.player;if(e.map[t.y][t.x].tile!==6)return X(e,t.has_amulet?`I see no way up`:`I see no way down`),!1;if(t.has_amulet){if(e.level<=1)return e.level=0,e.status=3,!0;Vj(e,e.level-1),X(e,`you climb up to level %d`,e.level)}else Vj(e,e.level+1);return!0}function qj(e){return e.player.frozen>0||e.player.asleep>0}function Jj(e){e.status===0&&(zj(e),Rj(e))}function Yj(e){Ej(e,29)}function Xj(e,t,n){let r=e.player;r.hp=oA(r.hp+t),r.hp>r.max_hp&&(r.max_hp=oA(r.max_hp+n),r.hp=r.max_hp)}function Zj(e,t){let n=e.player;switch(e.potion_known[t]=!0,t){case 0:Xj(e,AA(e,n.xlevel,4),1),n.blind=0,X(e,`you begin to feel better`);break;case 1:Xj(e,AA(e,n.xlevel,8),2),n.blind=0,X(e,`you begin to feel much better`);break;case 2:n.str=iA(n.str+1),n.str>n.max_str&&(n.max_str=n.str),X(e,`you feel stronger, now. What bulging muscles!`);break;case 3:n.str=n.max_str,X(e,`hey, this tastes great. It make you feel warm all over`);break;case 4:n.exp=wj(n.xlevel),X(e,`you suddenly feel much more skillful`),Tj(e);break;case 5:n.see_invisible=!0,X(e,`this potion tastes like slime-mold juice`);break;case 6:{let t=!1;for(let n=0;n<24;n++)t||=e.monsters[n].active;t?(e.detect_monsters=!0,X(e,`you sense the presence of monsters`)):X(e,`you have a strange feeling for a moment, then it passes`);break}case 7:n.confused=aA(n.confused+Y(e,8)+8),X(e,`wait, what's going on here. Huh? What? Who?`);break;case 8:n.blind=aA(MA(250,n.blind+Y(e,30)+30)),X(e,`oh, bummer! Everything is dark! Help!`);break;case 9:n.asleep=aA(n.asleep+Y(e,5)+4),X(e,`you fall asleep`);break;case 10:n.str=iA(jA(3,n.str-(Y(e,3)+1))),X(e,`you feel very sick now`)}}function Qj(e){for(let t=0;t<e.pack_count;t++){let n=e.pack[t];if(n.cls===3&&!e.potion_known[n.kind]||n.cls===4&&!e.scroll_known[n.kind]||(n.cls===5||n.cls===6)&&!(n.flags&1))return!0}return!1}function $j(e,t){let n=e.player;switch(e.scroll_known[t]=!0,t){case 0:X(e,`this is a scroll of identify`),Qj(e)&&(e.status=1);break;case 1:for(let t=0;t<22;t++)for(let n=0;n<32;n++)e.map[t][n].tile!==0&&(e.map[t][n].flags|=1);X(e,`oh, now this scroll has a map on it`);break;case 2:Bj(e);break;case 3:if(n.armor>=0){let t=e.pack[n.armor];t.hit=iA(t.hit+1),t.flags&=253,X(e,`your armor glows silver for a moment`)}else X(e,`you feel a strange sense of loss`);break;case 4:if(n.weapon>=0){let t=e.pack[n.weapon];Y(e,2)?t.hit=iA(t.hit+1):t.dmg=iA(t.dmg+1),t.flags&=253,X(e,`your %s glows blue for a moment`,vA[t.kind].name)}else X(e,`you feel a strange sense of loss`);break;case 5:{let t=!1;for(let r=0;r<24;r++){let i=e.monsters[r];i.active&&NA(i.x-n.x)<=2&&NA(i.y-n.y)<=2&&(i.held=aA(Y(e,10)+10),t=!0)}X(e,t?`the monsters around you freeze`:`you feel a strange sense of loss`);break}case 6:n.asleep=aA(n.asleep+Y(e,5)+4),X(e,`you fall asleep`);break;case 7:for(let t=0;t<16;t++){let t=n.x+Y(e,3)-1,r=n.y+Y(e,3)-1;if(Nj(e,t,r,t,r)){uj(e,lj(e,!0),t,r,!0);return}}X(e,`you hear a faint cry of anguish in the distance`);break;case 8:for(let t=0;t<24;t++)e.monsters[t].awake=!0;X(e,`you hear a high pitched humming noise`);break;case 9:X(e,`you hear maniacal laughter in the distance`);break;case 10:n.weapon>=0&&(e.pack[n.weapon].flags&=253),n.armor>=0&&(e.pack[n.armor].flags&=253),X(e,`you feel as if somebody is watching over you`)}}function eM(e,t){if(e.status!==0||qj(e)||t<0||t>=e.pack_count)return!1;zj(e);let n=e.player,r=e.pack[t];switch(r.cls){case 3:{let n=r.kind;qA(e,t,!1),Zj(e,n);break}case 4:{let n=r.kind;qA(e,t,!1),$j(e,n);break}case 2:{let i=r.kind===1;qA(e,t,!1),n.food=oA(MA(CA,jA(n.food,0)+SA)),X(e,i?`my, that was a yummy slime-mold`:`yum, that tasted good`);break}case 5:if(t===n.weapon)return!1;if(n.weapon>=0&&e.pack[n.weapon].flags&2)return X(e,`you can't. It appears to be cursed`),!1;n.weapon=iA(t),r.flags|=1,X(e,`you are now wielding %s`,XA(e,r));break;case 6:if(n.armor>=0&&e.pack[n.armor].flags&2)return X(e,`you can't. It appears to be cursed`),!1;t===n.armor?(n.armor=-1,X(e,`you used to be wearing %s`,yA[r.kind].name)):(n.armor=iA(t),r.flags|=1,X(e,`you are now wearing %s`,XA(e,r)));break;default:return!1}return(e.status===0||e.status===1)&&Rj(e),!0}function tM(e,t){if(e.status!==0||qj(e)||t<0||t>=e.pack_count)return!1;zj(e);let n=e.player;if(zA(e,n.x,n.y)>=0||e.map[n.y][n.x].tile===6)return X(e,`there is something there already`),!1;if((t===n.weapon||t===n.armor)&&e.pack[t].flags&2)return X(e,`you can't. It appears to be cursed`),!1;let r={...e.pack[t],count:1};r.cls===4&&r.kind===9&&(r.flags|=4),r.cls===7&&(n.has_amulet=!1);let i=XA(e,r);return qA(e,t,!1),JA(e,r,n.x,n.y),X(e,`dropped %s`,i),Rj(e),!0}function nM(e,t){if(e.status!==1||t<0||t>=e.pack_count)return!1;let n=e.pack[t];switch(n.cls){case 3:e.potion_known[n.kind]=!0;break;case 4:e.scroll_known[n.kind]=!0;break;case 5:case 6:n.flags|=1}let r=XA(e,n);return e.msg_count=0,X(e,`%c) %s`,String.fromCharCode(97+t),r),e.status=0,!0}function rM(e){let t=e.player;if(e.status!==0||e.msg_count>0)return!0;for(let n=0;n<24;n++){let r=e.monsters[n];if(r.active&&e.visible[r.y][r.x]&&!r.disguise&&!(cA[r.type].flags&4&&!t.see_invisible))return!0}let n=e.map[t.y][t.x].tile;if(n===4||n===6)return!0;for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++)if(PA(t.x+r,t.y+n)&&(zA(e,t.x+r,t.y+n)>=0||e.map[t.y+n][t.x+r].tile===6))return!0;if(n===5){let n=0,r=[[1,0],[-1,0],[0,1],[0,-1]];for(let i=0;i<4;i++)n+=+!!IA(e,t.x+r[i][0],t.y+r[i][1]);if(n>2)return!0}return!1}function iM(e,t,n){let r=e.player,i=e.map[n][t];if(t===r.x&&n===r.y)return[`@`,2];let a=RA(e,t,n);if(a>=0){let i=e.monsters[a],o=!!(cA[i.type].flags&4)&&!r.see_invisible;if(e.detect_monsters||e.visible[n][t]&&!o&&!r.blind)return i.disguise&&!e.detect_monsters?[i.disguise,5]:[cA[i.type].glyph,3]}if(!(i.flags&1))return[` `,0];let o=zA(e,t,n);if(o>=0){let t=e.floor[o].cls;return[YA(t),t===1||t===7?2:t===2?4:5]}if(i.trap&&i.flags&2)return[`^`,3];switch(i.tile){case 1:return[`-`,0];case 2:return[`|`,0];case 4:return[`+`,0];case 5:return[`#`,1];case 6:return[`%`,4];case 3:return[i.room!==DA&&e.rooms[i.room].dark&&!e.visible[n][t]?` `:`.`,1];default:return[` `,1]}}function aM(e){let t=e.player.food;return t<=0?`Faint`:t<TA?`Weak`:t<wA?`Hungry`:``}function oM(e,t=64){let n;if(e<26){let t=cA[e].name;n=z(`killed by %s %s`,BA(t),t)}else switch(e){case 26:n=`starved`;break;case 27:n=`killed by an arrow`;break;case 28:n=`killed by a dart`;break;case 29:n=`quit`;break;case 30:n=`escaped with the Amulet`;break;default:n=`died`}return HA(n,t)}function sM(e){let t=e.player.gold>>>0;return e.status===3?t:t-Math.trunc(t/10)>>>0}function cM(e,t){let n={score:sM(t),level:t.max_level,cause:t.status===3?30:t.cause,name:HA(t.name,11)},r=e.count;for(;r>0&&e.entries[r-1].score<n.score;)r--;if(r>=5)return-1;let i=e.count<5?e.count:4;for(let t=i;t>r;t--)e.entries[t]={...e.entries[t-1]};return e.entries[r]=n,e.count<5&&e.count++,r}var lM={now:()=>Math.floor(Date.now()/1e3),year:()=>new Date().getFullYear()},uM=0,dM=1,fM=2,pM=3,mM=4,hM=5,gM=6,_M=7,vM=8,yM=9,bM=10,xM=1,SM=23,CM=4,wM=4,TM=8,EM=2,DM=20,Z=hj(),OM=uM,kM=0,AM=0,jM=0,MM=0,NM=0,PM=0,FM=0,IM=-1,LM=!1,RM=!1,zM=128,BM=8,VM=Array(BM).fill(``),HM=0,UM=0,WM=e=>e.slice(0,zM-1);function GM(e){switch(e){case 1:return 8;case 2:return 11;case 3:return 9;case 4:return 10;case 5:return 14;default:return 15}}function KM(e,t,n){let r=n.length;for(let i=0;i<32;i++)fi(i,e,i<r?n[i]:` `,t)}function qM(e,t,n){let r=n.length,i=Math.trunc((32-r)/2);for(let a=0;a<32;a++)fi(a,e,a>=i&&a<i+r?n[a-i]:` `,t)}function JM(e,t,n){let r=n.length;for(let i=0;i<32;i++)Yi(i,e,i<r?n[i]:` `,t)}function YM(e,t,n){let r=n.length,i=Math.trunc((32-r)/2);for(let a=0;a<32;a++)Yi(a,e,a>=i&&a<i+r?n[a-i]:` `,t)}function XM(){for(let e=0;e<24;e++)KM(e,15,``),JM(e,15,``)}function ZM(){let e=``;for(let t=0;t<Z.msg_count;t++)t&&(e+=`  `),e+=Z.msgs[t];HM=UM=0;let t=0;for(;t<e.length&&HM<BM;){let n=e.length-t,r=n<=32?32:23,i=n<r?n:r;if(i<n){let n=i;for(;n>0&&e[t+n]!==` `;)n--;n>0&&(i=n)}for(VM[HM++]=e.slice(t,t+i),t+=i;e[t]===` `;)t++}}function QM(){return Z.status===2||Z.status===3}function $M(){let e=``,t=UM<HM-1||RM&&QM();UM<HM&&(e=WM(VM[UM]+(t?` --More--`:``))),KM(0,15,e)}function eN(){for(let e=0;e<22;e++)for(let t=0;t<32;t++){let[n,r]=iM(Z,t,e);fi(t,e+xM,n,GM(r))}}function tN(){let e=Z.player,t=WM(z(`Lv:%d Au:%lu Hp:%d(%d) Ac:%d`,Z.level,e.gold,e.hp,e.max_hp,xj(Z)));KM(SM,e.hp*4<=e.max_hp?9:15,t)}function nN(){$M(),eN(),tN()}function rN(e){for(let t=0;t<17;t++){let n=CM+t;if(t>=Z.pack_count){JM(n,15,``);continue}let r=XA(Z,Z.pack[t]),i=e&&t===kM,a=t===Z.player.weapon?` (in hand)`:t===Z.player.armor?` (worn)`:``,o=WM(z(`%c%c) %s%s`,i?`>`:` `,97+t,r,a));JM(n,i?11:a?14:15,o)}}function iN(){let e=Z.player;JM(0,15,WM(z(`Str:%d(%d) Exp:%d/%lu`,e.str,e.max_str,e.xlevel,e.exp)));let t=aM(Z),n=t.length;for(let e=0;e<n;e++)Yi(32-n+e,0,t[e],9);let r=``;e.confused&&(r+=`Confused `),e.blind&&(r+=`Blind `),e.asleep&&(r+=`Asleep `),e.frozen&&(r+=`Frozen `),e.held&&(r+=`Held `),e.has_amulet&&(r+=`Amulet`),JM(1,14,r),JM(2,8,WM(z(`Turn %lu   Depth %d (max %d)`,Z.turns,Z.level,Z.max_level))),JM(3,8,`--------------------------------`)}function aN(){switch(JM(21,8,`--------------------------------`),OM){case mM:JM(22,15,WM(z(`A:%s Y:drop B:close`,ZA(Z,kM)||`-`))),JM(23,8,`Tap an item twice to use it`);break;case hM:JM(22,11,`Identify which item?`),JM(23,8,`Pad: choose  A: identify`);break;case pM:JM(22,15,`A: more`),JM(23,8,``);break;default:JM(22,15,`A:stairs B:search X:pack Y:rest`),JM(23,8,`R+pad:run L:log SEL:help ST:menu`)}}function oN(){iN(),rN(OM===mM||OM===hM),aN()}function sN(){nN(),oN()}var cN=[`          - COMMANDS -`,``,`D-pad    move / attack`,`         (two directions at`,`         once move diagonally)`,`R + pad  run`,`A        use the stairs  %`,`B        rest a turn, search`,`Y        rest 20 turns`,`X        pack: quaff, read, eat,`,`         wield, wear, drop`,`L        previous messages`,`START    menu (quit)`,``,`@ you   A-Z monsters   * gold`,`! potion  ? scroll  : food`,`) weapon  ] armor  ^ trap`,`+ door  # corridor  , amulet`,``,`Find the Amulet of Yendor on`,`level 26, then climb back out.`,``,`        Any button: back`];function lN(){for(let e=0;e<24;e++)JM(e,e===0?11:e>=19&&e<=20?14:15,e<cN.length?cN[e]:``)}var uN=[`####   ###   ###  #   # #####`,`#   # #   # #     #   # #    `,`####  #   # #  ## #   # #### `,`#  #  #   # #   # #   # #    `,`#   #  ###   ###   ###  #####`];function dN(){XM();for(let e=0;e<5;e++)qM(3+e,11,uN[e]);qM(10,8,`The Dungeons of Doom`),qM(13,15,`A tribute to Rogue (1980)`),qM(14,15,`by Michael Toy, Glenn Wichman`),qM(15,15,`and Ken Arnold`),qM(18,14,`Find the Amulet of Yendor`),qM(19,14,`on level 26 and bring it back`),qM(23,8,`hidden in Delve 2.5.0`),JM(3,15,WM(z(`Hello %s, just a moment`,S(`Rodney`).slice(0,10)))),JM(4,15,`while I dig the dungeon...`)}function fN(){YM(10,11,`A: descend`),YM(12,15,`X: Top Rogueists`),YM(14,15,`SELECT: commands`),YM(16,8,`B: back to Delve`)}function pN(e,t){let n=k.rogue_board;if(YM(e,11,`- Top Rogueists -`),n.count===0)YM(e+3,8,`No one yet.`);else for(let r=0;r<n.count;r++){let i=n.entries[r],a=r===t?11:15;JM(e+2+r*3,a,WM(z(`%d %7lu  %s`,r+1,i.score,i.name)));let o=oM(i.cause),s=i.cause===30?z(`  %s`,o):z(`  %s on lvl %d`,o,i.level);JM(e+3+r*3,r===t?11:8,WM(s))}}var mN=[`          __________`,`         /          \\`,`        /    REST    \\`,`       /      IN      \\`,`      /     PEACE      \\`,`     /                  \\`,`     |                  |`,`     |                  |`,`     |                  |`,`     |                  |`,`     |                  |`,`    *|     *  *  *      | *`,`  ___)/\\\\_//(\\/(/\\)/\\//\\/|_)___`];function hN(){for(let e=0;e<24;e++)KM(e,15,``);for(let e=0;e<mN.length;e++)KM(3+e,e>=11?10:15,mN[e]);let e=[];e[0]=Z.name.slice(0,63),e[1]=z(`%lu Au`,sM(Z));let t=oM(Z.cause),n=t.startsWith(`killed by `)?t.indexOf(` `,10):-1;n>=0?(e[2]=t.slice(0,n),e[3]=t.slice(n+1)):(e[2]=t,e[3]=``),e[4]=z(`%d`,lM.year());for(let t=0;t<5;t++){let n=e[t].length,r=6+Math.trunc((18-n)/2);for(let i=0;i<n;i++)fi(r+i,9+t,e[t][i],11)}}function gN(){for(let e=0;e<24;e++)KM(e,15,``);qM(4,11,`Congratulations!`),qM(7,15,`You have made it to the light`),qM(8,15,`of day with the Amulet of Yendor`),qM(9,15,WM(z(`and %lu pieces of gold.`,Z.player.gold))),qM(12,11,`A total winner!`),qM(16,8,`Thanks to Michael Toy, Glenn`),qM(17,8,`Wichman and Ken Arnold for the`),qM(18,8,`game that started it all.`)}function _N(){RM=!1,LM||(LM=!0,IM=cM(k.rogue_board,Z),k.storage_ok&&kt(k));for(let e=0;e<24;e++)JM(e,15,``);Z.status===3?(OM=bM,gN()):(OM=yM,hN()),pN(1,IM),YM(19,15,`A: play again`),YM(20,8,`B: back to Delve`)}function vN(){let e=S(`Rodney`).slice(0,10);gj(Z,qa(lM.now()>>>0,A.game_frames,1549),e),LM=!1,RM=!0,IM=-1,jM=MM=0,NM=0,FM=0,OM=fM,XM(),ZM(),HM>1&&(OM=pM),sN()}function yN(){FM=0,QM()?(jM=MM=0,NM=0,ZM(),HM===0&&(VM[0]=Z.status===3?`You escape the dungeon!`:`You die...`,HM=1),OM=pM,sN()):(Z.status===1&&(OM=hM,kM=0),ZM(),HM>1&&OM!==hM&&(OM=pM,jM=MM=0,NM=0),sN())}function bN(){let e=o.held;return[e&16?1:e&32?-1:0,e&128?1:e&64?-1:0]}function xN(e,t){(e||t)&&(o.held&256&&Wj(Z,e,t)?(yN(),OM===fM&&!rM(Z)&&(jM=e,MM=t,PM=0)):Wj(Z,e,t)&&yN())}function SN(){o.down?(jM=MM=0,NM=0):++PM<EM||(PM=0,jM||MM?(!Wj(Z,jM,MM)||rM(Z))&&(jM=MM=0):NM>0&&(NM--,Gj(Z),rM(Z)&&(NM=0)),yN())}function CN(){for(let e=0;e<12;e++){FM=FM%12+1;let e=(Z.history_head+12-FM)%12;if(Z.history[e]){KM(0,8,WM(Z.history[e]));return}}}var wN=240;function TN(){if(jM||MM||NM)SN();else if(qj(Z))++PM>=TM&&(PM=0,Jj(Z),yN());else{if(o.down&wN)AM=wM;else if(AM===0&&o.repeat&wN){let[e,t]=bN();xN(e,t);return}if(AM>0){let[e,t]=bN();(--AM===0||e&&t)&&(AM=0,xN(e,t))}else if(o.down&1)Kj(Z),yN();else if(o.down&2)Gj(Z)&&yN();else if(o.down&2048)NM=DM,PM=0;else if(o.down&1024)OM=mM,kM=0,oN();else if(o.down&512)CN();else if(o.down&4)OM=gM,lN();else if(o.down&8){OM=_M;for(let e=0;e<24;e++)JM(e,15,``);YM(8,11,`- PAUSED -`),YM(11,15,`A: resume`),YM(13,15,`SELECT: commands`),YM(15,15,`X: quit this game`),YM(19,8,`The dungeon waits.`)}else o.touch_down&&o.touch_y>=32&&o.touch_y<(CM+Z.pack_count)*8&&(OM=mM,kM=Math.trunc(o.touch_y/8)-CM,oN())}}function EN(e){let t=kM;o.repeat&64&&kM--,o.repeat&128&&kM++,kM<0&&(kM=Z.pack_count-1),kM>=Z.pack_count&&(kM=0);let n=!!(o.down&1);if(o.touch_down&&o.touch_y>=32&&o.touch_y<(CM+Z.pack_count)*8){let e=Math.trunc(o.touch_y/8)-CM;n=e===kM,kM=e}e?n&&nM(Z,kM)?(OM=fM,yN()):kM!==t&&oN():n&&ZA(Z,kM)?(OM=fM,eM(Z,kM),yN()):o.down&2048?(OM=fM,tM(Z,kM),yN()):o.down&1026?(OM=fM,oN()):kM!==t&&oN()}function DN(){ar(0),pi(!0),qi(),Zi(!0),ci(),OM=uM,RM=!1,PM=0,dN()}function ON(){ci(),qi(),pi(!1),Zi(!1)}function kN(){LD(11)}function AN(){switch(OM){case uM:if(++PM===45&&fN(),PM<45)break;if(o.down&9||o.touch_down)vN();else if(o.down&1024){OM=dM;for(let e=0;e<24;e++)JM(e,15,``);pN(2,-1),YM(22,8,`Any button: back`)}else o.down&4?(OM=gM,lN()):o.down&2&&kN();break;case dM:(o.down||o.touch_down)&&(dN(),fN(),OM=uM);break;case gM:if(o.down||o.touch_down){if(!RM)dN(),fN(),OM=uM;else{OM=fM;for(let e=0;e<24;e++)JM(e,15,``);oN()}}break;case pM:if(!(o.down&(3|wN))&&!o.touch_down)break;if(UM<HM-1)UM++;else if(QM()){_N();break}UM===HM-1&&!QM()&&(OM=Z.status===1?hM:fM),$M(),aN(),OM===hM&&oN();break;case fM:TN();break;case mM:EN(!1);break;case hM:EN(!0);break;case _M:if(o.down&11){OM=fM;for(let e=0;e<24;e++)JM(e,15,``);oN()}else o.down&4?(OM=gM,lN()):o.down&1024&&(OM=vM,YM(15,9,`Really quit? A: yes  B: no`));break;case vM:if(o.down&1)Yj(Z),_N();else if(o.down&2){OM=fM;for(let e=0;e<24;e++)JM(e,15,``);oN()}break;case yM:case bM:o.down&1?vN():o.down&2&&kN()}}var jN={name:`rogue`,enter:DN,update:AN,exit:ON};function MN(){return{game:Z,mode:OM,playing:Z.status===0}}var NN=0,PN=1,FN=2,IN=3,LN=4,RN=5,zN=vi({items:[`Start Run`,`Upgrades`,`History`,`Options`,`Credits`,`About`],count:6,x:10,y:4,w:14,step:3,has_back:!0}),BN=[0,2,7,4,5,6];function VN(){ar(1),_D(!0),OD(12,k.meta),qi(),$i(6,1,20,20),H(2,8,`- DELVE -`),ca(zN);for(let e=0;e<zN.count;e++)Gi(e,BN[e],(zN.x-3)*8,(zN.y+e*zN.step)*8-4);ia(),k.storage_ok||V(10,22,9,`Not saved: storage off`)}function HN(){switch(vD(),da(zN)){case 2:switch(zN.cursor){case NN:LD(6);break;case PN:LD(3);break;case FN:LD(9);break;case IN:LD(2);break;case LN:LD(4);break;case RN:LD(5)}break;case 3:LD(0)}}var UN={name:`menu`,enter:VN,update:HN},WN=0,GN=1,KN=2,qN=3,JN=4,YN=5,XN=0,ZN=1,QN=2,$N=3,eP=4,tP=5,nP=6,rP=7,iP=8,aP=9,oP=10,sP=11,cP=12,lP=13,uP=[];uP[XN]={kind:WN,desc:`Music volume`},uP[ZN]={kind:WN,desc:`Sound effect volume`},uP[QN]={kind:GN,desc:`Camera zoom at start`},uP[$N]={kind:KN,desc:`Hold A: keep swinging`},uP[eP]={kind:KN,desc:`ABXY move, D-pad acts`},uP[tP]={kind:KN,desc:`Shake on hits, blasts`},uP[nP]={kind:KN,desc:`Damage numbers`},uP[rP]={kind:KN,desc:`Tips for new players`},uP[iP]={kind:qN,desc:`Erase this slot`},uP[aP]={kind:JN,desc:`For Rogue's scores`},uP[oP]={kind:YN,desc:`How the screens sit`},uP[sP]={kind:YN,desc:`On-screen buttons`},uP[cP]={kind:qN,desc:`Rebind keyboard keys`};var dP=[[`auto`,`Auto`],[`stacked`,`Stack`],[`side`,`Side`]],fP=[[`auto`,`Auto`],[`on`,`On`],[`off`,`Off`]];if(uP.length!==lP)throw Error(`options: items`);var pP=vi({items:[`Music`,`Sound FX`,`Zoom`,`Auto-attack`,`Left-handed`,`Screen shake`,`Hit numbers`,`Hints`,`Reset save`,`Name`,`Screens`,`Touch pad`,`Keys`],count:lP,x:4,y:3,w:26,step:2,value_x:17,has_back:!0,rows:9}),mP=10,hP=22,gP=-1,_P=!1,vP={...k.options},yP=!1;function bP(e){switch(e){case $N:return`auto_attack`;case eP:return`left_handed`;case tP:return`screen_shake`;case nP:return`hit_numbers`;case rP:return`hints`;default:return null}}function xP(e){let t=k.options,n=sa(pP,e);if(n<0)return;let r=e===pP.cursor?11:15;switch(uP[e].kind){case WN:{let i=e===XN?t.music_volume:t.sfx_volume,a=``;for(let e=0;e<10;e++)a+=e<i?`=`:`.`;V(pP.value_x,n,r,`<%s>`,a);break}case GN:V(pP.value_x,n,r,`< %-5s >`,t.default_zoom===1?`Far`:`Close`);break;case KN:V(pP.value_x,n,r,`< %-5s >`,t[bP(e)]?`On`:`Off`);break;case JN:V(pP.value_x,n,r,`%-11s`,S(`(not set)`));break;case YN:{let t=e===oP?dP.find(([e])=>e===w())[1]:fP.find(([e])=>e===E())[1];V(pP.value_x,n,r,`< %-5s >`,t);break}}}function SP(){V(mP,hP,8,`%-22s`,uP[pP.cursor].desc)}function CP(){qi(),$i(2,0,28,21),H(1,8,`- OPTIONS -`),ca(pP);for(let e=0;e<pP.count;e++)xP(e);ia(),SP()}function wP(){qi(),$i(4,7,24,9);let e=dt();e>=0?H(9,9,`Erase slot %d progress?`,e+1):H(9,9,`Erase all progress?`),H(11,8,`(options are kept)`),V(7,13,11,`A`),V(9,13,15,`Yes`),V(18,13,11,`B`),V(20,13,15,`No`)}function TP(){_P=!1,RD()===13||(gP=RD(),vP={...k.options},yP=!1,pP.cursor=0,pP.top=0),CP()}function EP(e,t){let n=k.options;switch(uP[e].kind){case WN:{let r=e===XN?`music_volume`:`sfx_volume`,i=n[r]+t;n[r]=i<0?0:i>10?10:i;break}case GN:n.default_zoom=n.default_zoom===1?0:1;break;case KN:{let t=bP(e);n[t]=+!n[t];break}case YN:e===oP?T(dP[(dP.findIndex(([e])=>e===w())+dP.length+t)%dP.length][0]):D(fP[(fP.findIndex(([e])=>e===E())+fP.length+t)%fP.length][0]),xP(e);return;default:return}xP(e),sr(),e===rP&&n.hints&&k.meta.hints_seen&&(k.meta.hints_seen=0,yP=!0,V(mP,hP,10,`%-22s`,`All tips will show`))}function DP(){let e=!!(o.down&1)||m(32,96,96,24),t=!!(o.down&2)||m(128,96,96,24);if(e){let e={...k.options},t=k.storage_ok,n=k.meta.last_played,r=k.meta.cheats_used;de(k),k.options=e,k.storage_ok=t,k.meta.last_played=n,k.meta.cheats_used=r,kt(k)}(e||t)&&(_P=!1,CP(),e&&V(mP,hP,10,`%-22s`,`Progress erased`))}function OP(e,t){return Object.keys(e).every(n=>e[n]===t[n])}function kP(){if(vD(),_P){DP();return}let e=pP.cursor,t=pP.top,n=da(pP);if(pP.top!==t){for(let e=0;e<pP.count;e++)xP(e);SP()}else pP.cursor!==e&&(xP(e),xP(pP.cursor),SP());switch(n){case 4:EP(pP.cursor,-1);break;case 5:EP(pP.cursor,1);break;case 2:pP.cursor===iP?(_P=!0,wP()):pP.cursor===aP?C()&&xP(aP):pP.cursor===cP?LD(13):uP[pP.cursor].kind!==WN&&EP(pP.cursor,1);break;case 3:(!OP(k.options,vP)||yP)&&kt(k),LD(gP===-1?1:gP)}}var AP={name:`options`,enter:TP,update:kP},jP=2,MP=28,NP=5,PP=2,FP=6,IP=22,LP=21,RP=9,zP=10,BP=22,VP=11,HP=20,UP=3,WP=17,GP=Array.from({length:3},()=>ue()),KP=[,,,].fill(!1),qP=0,JP=null;function YP(e){return PP+e*FP}function XP(e){let t=0;for(let n=0;n<15;n++)t+=+!!Dv(e,n);return t}function ZP(e,t){V(zP,BP,e,`%-*s`,VP,t)}function QP(e){let t=YP(e),n=e===qP,r=n?11:15;if($i(jP,t,MP,NP),ea(3,t+1,26,n),V(4,t+1,r,`Slot %d`,e+1),KP[e]&&GP[e].meta.cheats_used&&Yi(11,t+1,``,14),!KP[e]){V(22,t+1,8,`Empty`),V(4,t+3,8,`Begin a new descent`);return}let i=GP[e].meta,a=z(`Depth %lu`,i.best_depth).slice(0,11);V(28-a.length,t+1,r,`%s`,a);let o=DD(i.play_seconds).slice(0,11);V(4,t+3,15,`%lu run%s`,i.total_runs,i.total_runs===1?``:`s`),V(13,t+3,15,`%s`,o),V(20,t+3,15,`Upg %d`,XP(i))}function $P(){for(let e=12;e<21;e++)li(0,e,15,`%31s`,``);KP[qP]?(OD(12,GP[qP].meta),li(0,12,15,`%31s`,``)):ui(16,15,`An empty slot`),ui(12,8,`- slot %d -`,qP+1)}function eF(){qi(),H(0,8,`- CHOOSE A SAVE -`);for(let e=0;e<3;e++)QP(e);V(UP,HP,11,`Y`),V(5,HP,15,`Export`),V(WP,HP,11,`SEL`),V(21,HP,15,`Import`),ia(),$i(IP,LP,RP,3),V(23,22,11,`X`),V(25,22,15,`Erase`),ZP(8,`A: play`),$P()}function tF(){qi(),$i(4,7,24,9),JP===`import`?(H(9,9,`Replace slot %d?`,qP+1),H(11,8,`(with a file you pick)`)):(H(9,9,`Erase slot %d?`,qP+1),H(11,8,`(cannot be undone)`)),V(7,13,11,`A`),V(9,13,15,`Yes`),V(18,13,11,`B`),V(20,13,15,`No`)}function nF(){for(let e=0;e<3;e++)KP[e]=mt(e,GP[e])}function rF(){ar(1),_D(!0),nF(),JP=null;let e=dt();qP=e>=0?e:0,eF()}function iF(){let e=k.storage_ok;if(KP[qP])fe(k,GP[qP]);else{let e={...k.options};de(k),k.options=e}k.storage_ok=e,vt(qP,k),kt(k),sr(),LD(1)}function aF(){let e=KP[qP]?At(qP):null;if(!e){R(27),ZP(8,`Empty slot`);return}let t=document.createElement(`a`);t.href=URL.createObjectURL(new Blob([e.data],{type:`application/octet-stream`})),t.download=e.name,t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),1e3),R(0),ZP(10,`Exported`)}function oF(){let e=qP,t=document.createElement(`input`);t.type=`file`,t.accept=`.sav,application/octet-stream`,t.addEventListener(`change`,()=>{let n=t.files?.[0];n&&n.arrayBuffer().then(t=>{let n=jt(e,new Uint8Array(t));nF(),eF(),R(n?0:27),ZP(n?10:9,n?`Imported`:`Not a save`)})}),t.click()}function sF(){let e=!!(o.down&1)||m(32,96,96,24),t=!!(o.down&2)||m(128,96,96,24);if(!e&&!t)return;let n=JP;if(JP=null,n===`import`){R(e?0:26),eF(),e&&oF();return}let r=!1;e?(r=ht(qP),R(r?0:27)):R(26),nF(),eF(),e&&ZP(r?10:9,r?`Slot erased`:`Erase failed`)}function cF(e,t){if(e<16||e>=240)return-1;for(let e=0;e<3;e++)if(t>=YP(e)*8&&t<(YP(e)+NP)*8)return e;return-1}function lF(){if(vD(),JP){sF();return}let e=qP,t=!1;if(o.repeat&64)qP=(qP+3-1)%3;else if(o.repeat&128)qP=(qP+1)%3;else if(o.down&1)t=!0;else if(o.down&2||aa()){R(26),LD(0);return}else if(o.down&1024||m(176,168,72,24)){KP[qP]?(R(0),JP=`erase`,tF()):(R(27),ZP(8,`Empty slot`));return}else if(o.down&2048||m(16,152,MP/2*8,16)){aF();return}else if(o.down&4||m(128,152,MP/2*8,16)){KP[qP]?(R(0),JP=`import`,tF()):oF();return}else if(o.touch_down){let e=cF(o.touch_x,o.touch_y);e>=0&&(qP=e,t=!0)}qP!==e&&(QP(e),QP(qP),$P(),ZP(8,`A: play`),t||R(0)),t&&(R(0),iF())}var uF={name:`slots`,enter:rF,update:lF};function dF(e){if(!e.ticks)return e.count*e.tick;let t=0;for(let n=0;n<e.count;n++)t+=e.ticks[n];return t}function fF(e,t){t<0&&(t=0);let n=dF(e);e.loop&&n>0&&(t%=n);for(let n=0;n<e.count;n++){let r=e.ticks?e.ticks[n]:e.tick;if(t<r)return n;t-=r}return e.count-1}var pF=[];pF[0]=2,pF[1]=1,pF[2]=0,pF[3]=1,pF[4]=2,pF[5]=3,pF[6]=4,pF[7]=3;function mF(e){return(e<0||e>=8)&&(e=2),[pF[e],e===3||e===4||e===5]}function hF(e,t){return wb(e,t)}var gF=[3,2,5,6],_F=[10,255],vF=[2,2,4,4],yF=(e,t,n,r,i)=>({first:e,count:t,tick:n,loop:r,ticks:i}),bF=[yF(0,2,32,!0,null),yF(1,4,7,!0,null),yF(2,1,1,!1,null),yF(5,4,0,!1,gF),yF(9,4,0,!1,vF),yF(7,1,1,!1,null),yF(13,1,1,!1,null),yF(14,2,0,!1,_F)];function xF(e){if(e.hp<=0)return 7;switch(e.action){case 3:return 3;case 4:return 4;case 5:return 5;case 2:return 2}return e.hurt_frames>46?6:+(e.action===1)}function SF(e,t,n){let r=xF(t);r!==e.anim&&(e.anim=r,e.start=n>>>0);let i=r===3?16-t.action_timer:r===4?12-t.action_timer:n-e.start>>>0|0,a=bF[r],[o,s]=mF(r===5?(t.facing+L(i,2))%8:t.facing);return{slot:o*16+a.first+fF(a,i),mirror:s}}function CF(e,t,n){if(e<=0)return n-1;let r=L((e-t)*n,e);return r<0?0:r>=n?n-1:r}var wF=(e,t,n,r,i,a,o,s,c,l)=>({per_dir:e,dirs:t,idle:n,walk:r,walk_count:i,attack:a,attack_count:o,hurt:s,death:c,death_count:l}),TF=[];TF[0]=wF(12,5,0,1,4,5,4,9,10,2),TF[1]=wF(11,5,0,0,4,4,3,7,8,3),TF[2]=wF(12,5,0,1,4,5,4,9,10,2),TF[3]=wF(12,5,0,0,4,4,4,8,9,3),TF[4]=wF(11,5,0,0,4,4,3,7,8,3),TF[5]=wF(11,5,0,1,4,5,3,8,9,2),TF[6]=wF(1,1,0,0,1,0,1,0,0,1),TF[7]=wF(13,1,0,0,8,3,1,8,9,4),TF[9]=wF(12,5,0,1,4,5,4,9,10,2),TF[10]=wF(13,1,0,0,8,3,1,8,9,4),TF[12]=wF(10,3,0,0,3,3,3,6,7,3),TF[14]=wF(13,3,0,0,5,5,4,9,10,3),TF[15]=wF(13,1,0,0,8,3,1,8,9,4),TF[16]=wF(12,3,0,0,4,4,4,8,9,3),TF[17]=wF(13,3,0,0,5,5,4,9,10,3),TF[18]=wF(10,3,0,0,4,4,2,6,7,3),TF[11]=wF(1,1,0,0,1,0,1,0,0,1),TF[13]=wF(1,1,0,0,1,0,1,0,0,1),TF[8]=wF(3,1,0,0,2,0,1,2,2,1);var EF=[0,1,1,1,2];function DF(e,t){let n=ly[e.type],r=TF[e.type];if(e.type===6||e.type===11||e.type===13)return{slot:0,mirror:!1};let i=e.type===0||e.type===2||e.type===9||e.type===12||e.type===14||e.type===16,a;switch(e.state){case 1:a=r.walk+L(e.anim,e.type===7||e.type===15?5:8)%r.walk_count;break;case 2:{let t=r.attack_count>2?2:r.attack_count;a=r.attack+CF(n.windup,e.timer,t);break}case 3:a=e.type===2||e.type===9||e.type===16?r.walk+L(e.anim,3)%r.walk_count:r.attack+(r.attack_count>2?2:r.attack_count-1);break;case 4:a=e.stunned?r.hurt:i?r.attack+r.attack_count-1:r.idle;break;case 5:a=r.death+CF(24,e.timer,r.death_count);break;default:a=r.idle+L(e.anim,24)%2}e.flash>0&&e.state!==5&&(a=r.hurt);let o=0,s;return r.dirs===1?s=t===3||t===4||t===5:([o,s]=mF(t),r.dirs===3&&(o=EF[o])),{slot:o*r.per_dir+a,mirror:s}}var OF=[{title:`WELCOME TO CAMP`,lines:[`Walk down into the crypt`,`to begin a run.`,`Spend gold at the shrine`,`(the idol) and practise`,`on the training dummy.`],lefty:null},{title:`FIGHT!`,lines:[`Clear the room to open`,`the doors. A sword,`,`B dash (you can't be`,`hit mid-dash), Y dagger,`,`X blast when charged.`],lefty:[`Clear the room to open`,`the doors. Left sword,`,`Down dash (can't be hit`,`mid-dash), Right dagger,`,`Up blast when charged.`]},{title:`CHOOSE A DOOR`,lines:[`Each door shows what`,`lies beyond: a sword is`,`a fight for gold, a`,`heart a rest, a chest`,`treasure. Walk into one.`],lefty:null},{title:`BOONS`,lines:[`Pick one of three boons.`,`They stack and last`,`until the run ends.`,`The pause screen lists`,`the ones you have.`],lefty:null},{title:`PITS`,lines:[`Falling in costs a`,`heart. Dash to cross a`,`gap, and knock enemies`,`in to finish them.`],lefty:null},{title:`TRAPS`,lines:[`Spikes, fire vents and`,`saw blades hurt anyone,`,`enemies too. Watch for`,`the warning before`,`they strike.`],lefty:null},{title:`A BOSS`,lines:[`Every 10th depth a boss`,`guards the way. Learn`,`its wind-ups and dash`,`through its attacks.`,`Beat it to go deeper.`],lefty:null},{title:`UPGRADES`,lines:[`You have the gold for`,`an upgrade. Stand by`,`the shrine (the idol)`,`and press A to shop.`,`Upgrades last forever.`],lefty:[`You have the gold for`,`an upgrade. Stand by`,`the shrine (the idol)`,`and press Left to shop.`,`Upgrades last forever.`]},{title:`WAYPOINTS`,lines:[`A boss has fallen: the`,`crypt can now take you`,`straight to the next`,`area, with 3 boons for`,`each area you skip.`],lefty:null}];function kF(e,t){return!!(e.hints_seen>>>t&1)}function AF(e,t){t>=0&&t<9&&(e.hints_seen=(e.hints_seen|1<<t)>>>0)}function jF(e){for(let t=0;t<15;t++){let n=Cv[t];if(!Dv(e,t)&&e.currency>=n.cost&&(n.requires<0||Dv(e,n.requires)))return!0}return!1}function MF(e){for(let t=0;t<12;t++)for(let n=0;n<12;n++)if(Z_(e,n,t)===6)return!0;return!1}function NF(e,t){let n=e.room;return n.hub?kF(t,0)?!kF(t,7)&&jF(t)?7:!kF(t,8)&&t.waypoints?8:-1:0:n.type===3&&!kF(t,6)?6:n.type===0&&!kF(t,1)?1:!kF(t,4)&&MF(n)?4:!kF(t,5)&&n.hazard_count>0?5:-1}function PF(e){return e>=0&&e<9?OF[e].title:``}function FF(e,t,n){if(e<0||e>=9||t<0||t>=5)return null;let r=OF[e];return n&&r.lefty?r.lefty[t]??null:r.lines[t]??null}var IF=12,LF=44,RF=120,zF=3,BF=0,VF=1,HF=2,UF=3,WF=4,GF=5,KF=6,qF=7,JF=0,YF=1,XF=2,ZF=vi({items:[`Resume`,`Options`,`Abandon run`],count:3,x:10,y:13,w:16,step:3,has_back:!1}),Q=Wx(),QF=x_(),$F=yv(),eI=BF,tI=0,nI=0,rI=0,iI=3,aI=5,oI=6,sI=6,cI=10,lI=16,uI=4,dI=12,$=I_(),fI=0,pI=0,mI=0,hI=0,gI=0,_I=0,vI=Array.from({length:uI},()=>({life:0,slot:0,mirror:!1,x:0,z:0})),yI=0,bI=0,xI=0,SI=0,CI=0,wI=0,TI=0,EI=0,DI=24,OI=100,kI=14,AI=0,jI=0,MI=0,NI=[`Combat`,`Rest`,`Treasure`,`Boss`],PI=[`Fight for gold`,`Rest and heal`,`Treasure chest`,`The boss`];if(NI.length!==4||PI.length!==4)throw Error(`play: room names`);function FI(e){switch(e){case 10:return`SLIME KING`;case 14:return`CAVERN YETI`;case 18:return`MAGMA LORD`;default:return`ORC WARLORD`}}function II(e){let t=(e<1?0:e-1)%10;return f_[c_(e)].sky[+(t>=L(10,2))]}var LI=[];if(LI[0]=`upper left`,LI[1]=`upper right`,LI[2]=`lower right`,LI[3]=`lower left`,LI.length!==4)throw Error(`play: side names`);function RI(){let e=0;return AI>0&&AI&4&&(e|=jI),Q.player.hp===1&&Q.status!==2&&A.game_frames%OI<kI&&(e|=1),e}function zI(){let e=Q.player,t={hp:e.hp,max_hp:e.max_hp,dash:e.dash_charges,dash_max:e.dash_max,daggers:e.daggers,dagger_max:e.dagger_max,meter:e.meter,meter_max:e.meter_max,depth:Q.depth,genie:Q.cheats!==0,blink:RI()};_i(t),EI=t.blink,bI=e.hp,xI=e.dash_charges,SI=e.daggers,CI=e.meter}function BI(e,t){li(0,zF,15,`%31s`,``),ui(zF,e,`%s`,t),rI=RF}function VI(){let e=mS(Q);V(5,3,15,`Enemies`),V(15,3,e?9:10,`%-3d`,e),V(5,5,15,`Kills`),V(15,5,11,`%-3d`,Q.kills),V(5,7,15,`Gold`),V(15,7,11,`%-5d`,Q.gold),wI=e,TI=Q.gold}function HI(e,t,n,r){V(e,t,11,`%s`,n),V(e+n.length+1,t,15,`%s`,r)}function UI(){let e=k.options.left_handed!==0;$i(2,10,28,12),HI(5,12,e?`Left`:`A`,`sword`),HI(17,12,e?`Down`:`B`,`dash`),HI(5,14,e?`Right`:`Y`,`dagger`),HI(17,14,e?`Up`:`X`,`blast`),HI(5,16,e?`ABXY`:`D-pad`,`move`),HI(5,18,`SELECT`,`zoom`),HI(17,18,`START`,`pause`)}function WI(){$i(2,10,28,13),H(11,8,`- choose a door -`);for(let e=0;e<Q.room.door_count;e++){let t=Q.room.doors[e],n=13+e*3;Gi(e,t.leads_to===3?7:t.leads_to,32,n*8-4),V(7,n,15,`%s`,PI[t.leads_to]),V(7,n+1,8,`%s wall`,LI[t.side])}}function GI(){qi(),$i(2,0,28,10),H(1,11,`- CAMP -`);let e=k.meta;V(5,3,15,`Best depth`),V(19,3,11,`%5lu`,e.best_depth),V(5,5,15,`Runs`),V(19,5,11,`%5lu`,e.total_runs),V(5,7,15,`Gold`),V(19,7,11,`%5lu`,e.currency),$i(2,11,28,12),Gi(0,0,32,100),V(7,13,15,`The crypt: descend`),Gi(1,6,32,124),V(7,16,15,`The shrine: upgrades`),Gi(2,7,32,148),V(7,19,15,`The dummy: practice`)}function KI(e){e?H(21,11,`%s: buy upgrades`,k.options.left_handed?`Left`:`A`):Qi(21)}function qI(){for(let e=0;e<12;e++)if(Q.enemies[e].active&&lg(Q.enemies[e].type))return Q.enemies[e];return null}var JI=4,YI=24,XI=-1;function ZI(){let e=qI(),t=e&&e.state!==5?e.hp:0,n=e&&e.max_hp?L(t*YI+e.max_hp-1,e.max_hp):0;for(let e=0;e<YI;e++)ea(JI+e,15,1,e<n);XI=t}function QI(){let e=qI();$i(2,10,28,12),H(12,9,`- %s -`,FI(e?e.type:9)),H(18,8,`Beat it to go on`),ZI()}function $I(){Q.room.hub?GI():(qi(),$i(2,0,28,10),H(1,8,`- DEPTH %d: %s -`,Q.depth,NI[Q.room.type]),VI(),Q.status===1?WI():Q.room.type===3?QI():UI())}var eL=[,,,].fill(0),tL=0,nL=0,rL=13,iL=4;function aL(){qi(),$i(2,0,28,10),H(1,8,`- DEPTH %d: %s -`,Q.depth,NI[Q.room.type]),VI(),$i(1,10,30,14),H(11,11,`- choose a boon -`);for(let e=0;e<tL;e++){let t=Rv[eL[e]],n=rL+e*iL,r=e===nL;ea(2,n,28,r),V(4,n,r?11:15,`%s`,t.name),t.max>1&&V(22,n,8,`%d/%d`,Q.boons[eL[e]]+1,t.max),V(4,n+1,8,`%s`,t.desc)}}function oL(){tL=qv(Q,eL),tL===0?(Q.boon_pending=!1,yL()):_L(3,!0)||(nL=0,eI=GF,BI(11,`Choose a boon`),aL())}function sL(){let e=nL;o.repeat&64&&(nL=(nL+tL-1)%tL),o.repeat&128&&(nL=(nL+1)%tL);let t=!!(o.down&1);for(let e=0;e<tL&&o.touch_down;e++)m(16,(rL+e*iL-1)*8,224,24)&&(t=e===nL,nL=e);t?(rC(Q,eL[nL]),R(25),eI=BF,zI(),$I(),BI(11,Rv[eL[nL]].name),yL()):nL!==e&&(R(0),aL())}function cL(){return Q.room.hub?2:Q.room.type===3&&Q.status!==1?5:f_[Q.room.area].music}var lL=!1;function uL(){lL=!1,bv($F),ar(cL()),pD(Q.room.seed),wo(Q.room.hub?5:II(Q.depth)),Co(!Q.room.hub&&Q.room.area===3),R_($),fI=pI=mI=AI=0;for(let e=0;e<uI;e++)vI[e].life=0;if(D_(QF,QF.zoom,P(12),Q.player.x,Q.player.z),MI=Q.status,rI=0,ci(),zI(),$I(),Q.room.hub)BI(11,`The camp. The crypt awaits.`);else if(Q.room.type===3){let e=qI();BI(9,FI(e?e.type:9)),XI=-1}else Q.depth>1&&Q.depth%10==1?BI(14,f_[c_(Q.depth)].banner):k.meta.best_depth>0&&Q.depth>>>0===k.meta.best_depth+1?(BI(11,`New best depth!`),R(25)):Q.events&2048?BI(10,`Rested by the fire: +${Q.reward_amount}`.slice(0,31)):Q.room.type===1&&BI(10,`A quiet campfire`)}function dL(){qi(),$i(2,0,28,10),Q.room.hub?(H(1,11,`- CAMP -`),H(5,8,`Best depth %lu`,k.meta.best_depth)):(H(1,8,`- DEPTH %d: %s -`,Q.depth,NI[Q.room.type]),VI())}function fL(){dL(),$i(6,10,20,12),H(11,11,`PAUSED`),ca(ZF),li(0,zF,15,`%31s`,``),ui(zF,11,`PAUSED`),rI=0;let e=5;for(let t=0;t<13&&e<20;t++)Q.boons[t]&&(e===5&&li(2,e++,8,`Boons:`),Q.boons[t]>1?li(3,e++,11,`%s x%d`,Rv[t].name,Q.boons[t]):li(3,e++,11,`%s`,Rv[t].name));if(Q.cheats&&e<19){fi(2,++e,``,14),li(4,e++,14,`Code Genie:`);for(let t=0;t<13&&e<21;t++)Lt(Q.cheats,t)&&li(3,e++,14,`%s`,Pt[t].name)}}var pL=20,mL=-1,hL=!1,gL=0;function _L(e,t){if(!k.options.hints||e===-1||kF(k.meta,e))return!1;mL=e,hL=t,gL=0,eI=KF,R(25),qi(),$i(2,2,28,15),H(3,11,`- %s -`,PF(e));for(let t=0;t<5;t++){let n=FF(e,t,k.options.left_handed!==0);n&&V(4,5+t*2,15,`%s`,n)}let n=k.options.left_handed?`SEL`:`X`;return $i(1,18,12,3),V(2,19,11,`A`),V(4,19,15,`Got it`),$i(13,18,18,3),V(14,19,11,`%s`,n),V(15+n.length,19,15,`No more tips`),li(0,zF,15,`%31s`,``),ui(zF,11,`TIP: see the lower screen`),rI=0,!0}function vL(){if(++gL<pL)return;let e=k.options.left_handed?4:n,t=!!(o.down&3)||m(8,144,96,24),r=(o.down&e)!==0||m(104,144,144,24);(t||r)&&(R(r?26:0),AF(k.meta,mL),r&&(k.options.hints=0),kt(k),mL=-1,hL?oL():DL())}function yL(){!Q.room.hub&&Q.room.door_count>0&&_L(2,!1)}var bL=vi({items:[],count:0,x:6,y:6,w:22,step:3,has_back:!0}),xL=[,,,,].fill(0);function SL(){qi(),$i(3,2,26,4+bL.count*3),H(3,11,`- DESCEND TO -`),ca(bL);for(let e=0;e<bL.count;e++){let t=xL[e],n=bL.y+e*bL.step+1;t===0?V(bL.x,n,8,`depth 1`):V(bL.x,n,8,`depth %d, +%d boons`,u_(t),t*3)}H(19,8,`Gold counts only the`),H(20,8,`depths you go down.`),ia()}function CL(){let e=0;for(let t=0;t<4;t++)Fv(k.meta,t)&&(bL.items[e]=f_[t].waypoint.slice(0,31),xL[e++]=t);bL.count=e,bL.cursor=e-1;for(let t=0;t<e;t++)xL[t]===nI&&(bL.cursor=t);eI=qF,li(0,zF,15,`%31s`,``),ui(zF,11,`Where to?`),rI=0,SL()}function wL(){switch(da(bL)){case 2:nI=xL[bL.cursor],eI=VF,tI=0,$I();break;case 3:Q.player.z=Q.player.z+N(.8)|0,DL()}}function TL(){dL(),$i(3,11,26,8),H(12,9,`Abandon this run?`),H(14,8,`Gold found is kept`),V(7,16,11,`A`),V(9,16,15,`Yes`),V(18,16,11,`B`),V(20,16,15,`No`)}function EL(){ZF.items[XF]=Q.room.hub?`Main menu`:`Abandon run`,eI=UF,ZF.cursor=0,R(0),fL()}function DL(){eI=BF,ci(),zI(),$I()}function OL(){let e=qa(lM.now()>>>0,A.game_frames,3553);tS(Q,e,nI),rS(Q,zt(Ft.active,k.meta.upgrades)),Q.cheats=Ft.active,k.meta.cheats_used=(k.meta.cheats_used|Ft.active)>>>0,L_($,e)}function kL(){Qx(Q),rS(Q,zt(Ft.active,k.meta.upgrades)),Q.cheats=Ft.active,L_($,A.game_frames)}function AL(){if(ZE(Lt(Ft.active,11)?L(Tn*200,100):Tn),RD()===2){ar(cL()),ci(),zI(),eI=UF,fL();return}if(AD.now){AD.now=!1,OL(),QF.zoom=k.options.default_zoom,R(24),uL(),eI=HF,tI=IF,ya(-16);return}let e=0,t=0,n=RD()===3&&Q.room.hub;n&&(e=Q.player.x,t=Q.player.z),kL(),n&&(Q.player.x=e,Q.player.z=t),QF.zoom=k.options.default_zoom,eI=BF,ya(0),uL()}function jL(){ZE(Tn),ya(0),wo(0),Co(!1),Ki()}var ML={up:64,down:128,left:32,right:16,attack:1,dash:2,dagger:r,blast:n},NL={up:n,down:2,left:r,right:1,attack:32,dash:128,dagger:16,blast:64};function PL(){return k.options.left_handed?NL:ML}function FL(){return(o.down&PL().attack)!==0}function IL(){let e=PL(),t=0,n=0;o.held&e.right&&t++,o.held&e.left&&t--,o.held&e.down&&n++,o.held&e.up&&n--;let r=k.options.auto_attack?o.held:o.down;return{move:Cb(t,n),dash:(o.down&e.dash)!==0,attack:(r&e.attack)!==0,throw_dagger:(o.down&e.dagger)!==0,blast:(o.down&e.blast)!==0}}function LL(){o.down&4&&O_(QF),k_(QF,Q.player.x,Q.player.z),M_(QF);let e=L(P(12),2),t=T_(QF.x-e,QF.z-e),n=E_(QF.x-e,QF.z-e);To(16,6),Eo(F(Math.imul(t,20)),F(Math.imul(-n,20)))}function RL(e){let t=k.last_run;t.depth=Q.depth,t.kills=Q.kills,t.gold=Q.gold,t.rooms_cleared=Q.rooms_cleared,t.earned=0,t.start_depth=Q.start_depth,t.bosses=Q.bosses,t.seconds=L(Q.time>>>0,60),t.cause=e?48:Q.hurt_by,t.new_best=!1,t.abandoned=e,t.cheated=Q.cheats!==0,t.seed=Q.seed,t.boons.fill(0);for(let e=0;e<13;e++)t.boons[e]=Q.boons[e];Ev(k.meta,t),kv(k.history,t),kt(k),LD(7)}function zL(){let e=Q.events;e&128?(R(7),ar(0)):e&4&&R(3),e&3072&&R(6),e&16?R(9):e&8?R(2):e&1&&R(1),e&256&&R(2),e&8192&&R(14),e&786432&&R(15),e&1048576&&R(11),e&2097152&&R(16),e&4194304&&R(17),e&8388608&&R(6),e&100663296&&R(18);let t=Q.room.type===3,n=t&&f_[Q.room.area].boss===10;e&1073741824&&R(t&&!n?20:4),e&Wg&&R(n?22:21),e&536870912&&R(9),e&134217728&&R(11),e&268435456&&R(12),e&2&&R(4),e&32&&R(8),e&512&&R(5),e&16384&&R(10),e&32768&&R(11),e&65536&&R(12),e&131072&&R(13);for(let e=0;e<Q.hit_count;e++)Q.hits[e].kind===12&&R(Q.hits[e].amount===0?19:Q.hits[e].amount===3?21:8)}function BL(){let e=A.game_frames,t=N(.5);for(let e=0;e<Q.hit_count;e++){let n=Q.hits[e];switch(n.kind){case 0:U_($,0,5,n.x,t,n.z,N(.05)),k.options.hit_numbers&&W_($,n.amount,n.x,n.z,!1),fI<iI&&(fI=iI);break;case 1:U_($,0,8,n.x,t,n.z,N(.07)),U_($,3,6,n.x,N(.2),n.z,N(.04)),k.options.hit_numbers&&W_($,n.amount,n.x,n.z,!0),fI<aI&&(fI=aI);break;case 2:U_($,1,8,n.x,N(.3),n.z,N(.05)),U_($,3,4,n.x,N(.2),n.z,N(.03));break;case 3:U_($,0,4,n.x,t,n.z,N(.04)),U_($,3,3,n.x,t,n.z,N(.02));break;case 4:U_($,4,6,n.x,N(.45),n.z,N(.04));break;case 5:U_($,2,10,n.x,N(.4),n.z,N(.05)),U_($,3,4,n.x,N(.2),n.z,N(.03));break;case 6:U_($,2,3,n.x,N(.4),n.z,N(.04));break;case 7:U_($,2,14,n.x,N(.5),n.z,N(.06)),U_($,3,6,n.x,N(.3),n.z,N(.04));break;case 8:U_($,0,4,n.x,N(.7),n.z,N(.03));break;case 9:U_($,4,14,n.x,N(.4),n.z,N(.1)),U_($,9,8,n.x,N(.5),n.z,N(.08)),U_($,5,8,n.x,N(.4),n.z,N(.05)),U_($,11,4,n.x,N(.8),n.z,N(.02)),U_($,0,10,n.x,N(.4),n.z,N(.12)),mI=lI,hI=n.x,gI=n.z,_I=Jg,pI=12,fI<4&&(fI=4);break;case 10:U_($,6,6,n.x,N(.3),n.z,N(.04));break;case 11:U_($,7,5,n.x,N(.4),n.z,N(.03));break;case 14:U_($,4,12,n.x,N(.2),n.z,N(.08)),U_($,5,6,n.x,N(.2),n.z,N(.04));break;case 15:U_($,3,10,n.x,N(.3),n.z,N(.06)),U_($,0,4,n.x,N(.6),n.z,N(.05)),pI<sI&&(pI=sI);break;case 16:U_($,5,8,n.x,N(.2),n.z,N(.03));break;case 17:mI=lI,hI=n.x,gI=n.z,_I=Bv,U_($,0,10,n.x,N(.3),n.z,N(.08)),pI<sI&&(pI=sI);break;case 13:U_($,3,8,n.x,N(.05),n.z,N(.04));break;case 12:if(n.amount===3){U_($,3,12,n.x,N(.2),n.z,N(.06)),U_($,5,6,n.x,N(.3),n.z,N(.04)),pI<3&&(pI=3);break}U_($,n.amount===1?4:3,6,n.x,N(.2),n.z,N(.04))}}for(let t=0;t<Q.room.decor_count;t++)Q.fuse[t]&&!(e&3)&&B_($,0,Q.room.decor[t].x,N(.95),Q.room.decor[t].z,0,N(.03),0,10);for(let t=0;t<Q.room.hazard_count;t++){let n=Q.room.hazards[t];if(n.kind!==1)continue;let r=KS(n,Q.frames),i=qa(e,t,3870),a=i%1024-512,o=(i>>>10)%1024-512;r===1&&!(e&7)?(B_($,11,n.x+L(a,2),N(.15),n.z+L(o,2),0,N(.008),0,50),B_($,9,n.x,N(.1),n.z,L(a,64),N(.03),L(o,64),24)):r===2&&!(e&3)&&(B_($,10,n.x+L(a,2),N(.3)+L((i>>>20)%4096*3,2),n.z+L(o,2),0,N(.03),0,14),B_($,9,n.x+L(a,3),N(1.9),n.z+L(o,3),L(a,40),N(.035),L(o,40),36))}let n=Q.player;if(Q.events&65536&&(mI=lI,hI=n.x,gI=n.z,_I=n.blast_radius,pI=cI,fI=oI,U_($,0,16,n.x,t,n.z,N(.12))),Q.events&4&&(pI=sI,U_($,7,6,n.x,t,n.z,N(.05))),Q.events&131072&&BI(14,`Blast ready!  Press X`),Q.events&33554432){pI=sI;let e=f_[Q.room.area].pit_cause;BI(9,e===39?`Into the lava!`:e===40?`Into the water!`:`You fell!`)}}function VL(e){let t=Q.player,n=0;e.dash&&t.dash_charges===0&&t.action!==2&&(n|=2),e.throw_dagger&&t.daggers===0&&(n|=4),e.blast&&t.meter<t.meter_max&&(n|=8),n&&(R(28),jI=n,AI=DI)}function HL(){let e=A.game_frames,t=qa(e,Q.room.seed,2590);if(Q.room.area===3&&!Q.room.hub&&!(e&3)){let e=t%12,n=(t>>>8)%12,r=Q.room.cells[n][e]===6;(r||(t>>>16)%4==0)&&B_($,(t>>>28)%3==0?9:4,P(e)+(t>>>4)%4096,r?-N(.2):N(.1),P(n)+(t>>>20)%4096,(t>>>3)%64-32,N(.016),0,60)}if(e%6==0){let e=P(t%12)+(t>>>8)%4096,n=P((t>>>12)%12)+(t>>>20)%4096;B_($,8,e,N(.3)+(t>>>4)%4096,n,N(.004),N(.003),-N(.002),90)}for(let t=0;t<Q.room.decor_count;t++){let n=Q.room.decor[t];if(n.kind!==0)continue;let r=e+t*7>>>0,i=qa(e,t,1804),[a,o]=J_(n.wall),s=n.x+I(a,N(.15)),c=n.z+I(o,N(.15)),l=i%64-32;r%9==0&&(i>>>8)%3!=0&&B_($,i>>>12&1?9:4,s,N(1.15),c,l,N(.014)+(i>>>16)%24,0,34+(i>>>20)%16),r%13==0&&B_($,10,s+l*3,N(1.3),c,0,N(.012),0,10),r%41==0&&B_($,11,s,N(1.6),c,L(l,4),N(.006),0,64)}let n=Q.room;if(n.feature_x>=0&&Z_(n,n.feature_x,n.feature_z)===4){let t=P(n.feature_x)+En,r=P(n.feature_z)+En,i=qa(e,n.seed,51791),a=i%1536-768,o=(i>>>11)%1536-768;e%3==0&&B_($,10,t+L(a,2),N(.35),r+L(o,2),0,N(.024),0,12),e%5==0&&B_($,i>>>22&3?9:4,t+L(a,3),N(.7),r+L(o,3),L(a,48),N(.022)+(i>>>24)%48,L(o,48),40),e%11==0&&B_($,11,t+L(a,4),N(1.05),r+L(o,4),N(.002),N(.009),-N(.002),80)}}var UL={anim:0,start:0};function WL(){let e=Q.player;for(let e=0;e<uI;e++)vI[e].life>0&&vI[e].life--;if(e.action!==2||Q.frames&1)return;let t=SF(UL,e,A.game_frames),n=vI[yI];yI=(yI+1)%uI,n.life=dI,n.slot=t.slot,n.mirror=t.mirror,n.x=e.x,n.z=e.z}function GL(){if(zL(),Q.events&4096?BI(11,`Treasure! +${Q.reward_amount} gold`.slice(0,31)):Q.events&64&&Q.events&1024?BI(10,`Room cleared  +${Q.reward_amount} gold`.slice(0,31)):Q.events&64&&Q.room.type!==1&&BI(10,`Room cleared`),Q.events&128){BI(9,`YOU DIED`);for(let e=10;e<23;e++)Qi(e);ea(JI,15,YI,!1),$i(2,10,28,13),H(13,9,`Fell at depth %d`,Q.depth),H(15,8,`%s`,Mv(Q.hurt_by)),H(18,15,`A: continue`)}}var KL=!1;function qL(){if(!lL&&(lL=!0,_L(NF(Q,k.meta),!1)))return;let t={move:-1,dash:!1,attack:!1,throw_dagger:!1,blast:!1};if(Q.status!==2&&(t=IL()),Q.room.hub){let e=$x(Q);if(e!==KL&&(KL=e,KI(e)),e&&FL()){R(25),KL=!1,LD(3);return}}if(fI>0){fI--;return}if(e&&(o.held&512&&o.down&256&&pC(Q),o.held&512&&o.down&1024&&(Pb(Q.player,Q.player.meter_max),t.blast=!1),o.held&256&&o.down&512&&Q.room.door_count)){Q.player.hp=Q.player.max_hp,Q.exit_door=(Q.frames>>>0)%Q.room.door_count,eI=VF,tI=0;return}Q.status!==2&&VL(t),lC(Q,t),xv(Q.room,$F,Q.player.x,Q.player.z,BE,VE),GL(),BL(),HL(),WL(),G_($),pI>0&&pI--,mI>0&&mI--;let n=Q.player;if(AI>0&&AI--,n.hp===1&&Q.status!==2&&!Q.room.hub&&A.game_frames%OI===0&&R(29),(n.hp!==bI||n.dash_charges!==xI||n.daggers!==SI||n.meter!==CI||RI()!==EI)&&zI(),Q.status!==2&&(mS(Q)!==wI||Q.gold!==TI)&&VI(),Q.status!==MI&&(MI=Q.status,Q.status===1&&($I(),Q.boon_pending||yL())),Q.room.type===3&&Q.status===0){let e=qI();(e&&e.state!==5?e.hp:0)!==XI&&ZI()}if(Q.events2&256&&(R(25),zI()),Q.events2&16&&(BI(11,`Second wind!`),R(25),zI()),Q.events2&32&&(BI(9,`The lava rises!`),R(20)),Q.events2&64&&(R(16),pI=cI),Q.events2&8&&(ar(0),R(23),Iv(k.meta,Q.depth)?(BI(11,`Boss slain! A waypoint opens`),kt(k)):BI(11,`The boss falls!`),pI=14,fI=10,U_($,6,20,Q.player.x,N(.6),Q.player.z,N(.1))),Q.events2&1&&oL(),Q.events&512){let e=Rt(Q.cheats);if(Q.room.hub&&!e&&k.meta.waypoints){CL();return}Q.room.hub&&(nI=e),eI=VF,tI=0}Q.status===2&&Q.frames>60&&o.down&9?RL(!1):Q.status!==2&&(o.down&8||o.held&8192)&&EL()}function JL(){switch(eI){case BF:qL();break;case GF:lC(Q,{move:-1,dash:!1,attack:!1,throw_dagger:!1,blast:!1}),G_($),BL(),sL();break;case VF:{let e=Q.room.hub?LF:IF,t=++tI-(e-IF);ya(L(-16*(t>0?t:0),IF)),tI>=e&&(Q.room.hub?OL():oS(Q,Q.exit_door),uL(),eI=HF,tI=IF);break}case HF:ya(L(-16*--tI,IF)),tI<=0&&(eI=BF);break;case UF:if(o.down&10){DL();break}if(da(ZF)===2)switch(ZF.cursor){case JF:DL();break;case YF:LD(2);break;case XF:if(Q.room.hub){LD(1);break}eI=WF,TL()}return;case KF:vL();return;case qF:wL();return;case WF:o.down&1||m(24,120,104,24)?RL(!0):(o.down&2||m(128,120,104,24))&&(eI=UF,fL());return}LL(),rI>0&&--rI===0&&li(0,zF,15,`%31s`,``)}var YL={anim:0,start:0};function XL(){let e=Q.player,t=A.game_frames;eI===VF&&Q.room.hub||oD(e.x,e.z,Tn);let n=e.hurt_frames>0&&e.action!==2&&e.action!==5&&e.hurt_frames<46&&!!(e.hurt_frames&4),r=SF(YL,e,t);if(eI===VF&&Q.room.hub){let[t,n]=mF(7),r=t*16+1+L(tI,6)%4,i=L(Tn*tI,LF);QE(0,r,n,19,e.x,-I(N(.8),i),e.z-I(N(1),i),0,1)}else(e.hp<=0||!n)&&aD(0,r.slot,r.mirror,19,e.x,e.z,0)}var ZL=(e,t,n,r=0,i=0)=>({sheet:e,feet_row:t,pal:n,cell:r,scale:i}),QL=[ZL(1,19,0),ZL(2,19,0),ZL(7,19,0),ZL(8,19,0),ZL(9,19,0),ZL(10,19,0),ZL(3,16,0),ZL(11,16,0),ZL(12,19,0),ZL(7,19,0),ZL(11,16,0),ZL(14,16,0),ZL(17,16,0,16,N(1.25)),ZL(14,16,0),ZL(18,16,0,16,N(2)),ZL(11,16,3),ZL(16,16,0,16,N(1.5)),ZL(15,16,0,16,N(1.125)),ZL(19,32,0,32,N(2))];if(QL.length!==19)throw Error(`play: enemy_sheets`);var $L=[[112,0],[0,16]],eR=[[0,0],[16,0],[32,0],[48,0]],tR=[0,1,2,2,1,0,-1,-1];function nR(e,t){let n=A.game_frames,r=+!!t;switch(e.type){case 11:{if(e.state===5&&e.anim&2)return!0;oD(e.x,e.z,N(.5));let t=L(e.anim,e.state===2?2:5)%2,n=(e.state===3?N(.35):N(.7))+tR[L(e.anim,4)&7]*N(.03),i=Q.player.x-e.x>Q.player.z-e.z;return eD(14,$L[t][0],$L[t][1],16,16,i,e.x,n,e.z,r),!0}case 13:{if(e.state===5&&e.anim&2)return!0;oD(e.x,e.z,N(.6));let t=L(e.anim,e.state===2?3:8)%4;return eD(14,eR[t][0],eR[t][1],16,16,!1,e.x,N(.25)+tR[L(e.anim,6)&7]*N(.03),e.z,r),!0}case 12:if(e.state===1)return n&7||B_($,3,e.x,N(.05),e.z,0,N(.01),0,20),eD(6,64,L(4,8)*16,16,16,!1,e.x,-N(.35),e.z,0),!0;if(e.state===2){let t=ly[e.type].windup,r=L(-N(1.2)*e.timer,t);nD(5,96,32,32,32,e.x,e.z,N(1.1),n&4?22:12,56,2);let i=DF(e,hF(Q.player.x-e.x,Q.player.z-e.z));return $E(17,16,i.slot,i.mirror,16,e.x,r,e.z,e.elite?2:0,QL[12].scale),!0}return!1;default:return!1}}function rR(e){if(e.state===0&&e.anim&2)return;let t=e.state===2||e.state===3?hF(e.aim_x,e.aim_z):hF(Q.player.x-e.x,Q.player.z-e.z),n=e.flash>0||e.state===2&&!!(e.anim&4);if(nR(e,n))return;let r=QL[e.type],i=n?1:e.elite?2:r.pal;if(e.state!==5&&oD(e.x,e.z,e.type===7?N(.6):e.type===2?N(1.2):Tn),e.type===6){if(e.state===5&&e.anim&2)return;eD(3,80,L(5,8)*16,16,16,!1,e.x,0,e.z,+!!n);return}let a=DF(e,t);if(lg(e.type)){let t=0;if((e.type===10||e.type===14)&&e.state===3){let n=ly[e.type].attack,r=n-e.timer;t=L((e.type===14?N(1.6):N(3))*r*(n-r),n*n)}e.type===9&&i===0&&(i=2),r.cell?$E(r.sheet,r.cell,a.slot,a.mirror,r.feet_row,e.x,t,e.z,i,r.scale):QE(r.sheet,a.slot,a.mirror,r.feet_row,e.x,t,e.z,i,2)}else r.cell?$E(r.sheet,r.cell,a.slot,a.mirror,r.feet_row,e.x,0,e.z,i,r.scale):aD(r.sheet,a.slot,a.mirror,r.feet_row,e.x,e.z,i)}function iR(){for(let e=0;e<12;e++){let t=Q.enemies[e];t.active&&(t.type===10||t.type===14)&&t.state===3&&nD(5,96,32,32,32,t.tx,t.tz,N(1.2),A.game_frames&4?24:12,58,2)}}function aR(){for(let e=0;e<uI;e++){let t=vI[e];t.life<=0||t.life>9||tD(0,t.slot,t.mirror,19,t.x,t.z,2+L(t.life*12,dI),40+e)}}function oR(){let e=A.game_frames|0;for(let t=0;t<16;t++){let n=Q.pickups[t];if(n.active){if(oD(n.x,n.z,N(.4)),n.kind===0)eD(5,16+(L(e,5)+t)%4*8,16,8,8,!1,n.x,n.y+N(.1),n.z,0);else{let t=n.y?0:(L(e,8)&1)*N(.04);eD(5,48,16,8,8,!1,n.x,n.y+N(.1)+t,n.z,0)}}}}function sR(){let e=A.game_frames;for(let t=0;t<10;t++){let n=Q.flames[t];if(!n.active)continue;let r=12+(L(e|0,3)+t)%6;eD(20,r%8*16,L(r,8)*16,16,16,!!(t&1),n.x,-N(.1),n.z,0),(e&7)==(t&7)&&B_($,t&2?9:4,n.x,N(.5),n.z,0,N(.02),0,26),(e&31)==(t&31)&&B_($,11,n.x,N(.8),n.z,0,N(.007),0,44)}}function cR(){for(let e=0;e<6;e++){let t=Q.daggers[e];t.active&&eD(5,(L(A.game_frames|0,2)+e)%8*16,0,16,16,!1,t.x,N(.35),t.z,0)}}function lR(){for(let e=0;e<12;e++){let t=Q.zones[e];if(!t.active)continue;let n=t.timer>L(50,2)?8:4,r=L(A.game_frames|0,n)&1?26:14;nD(5,96,32,32,32,t.x,t.z,t.radius,r,44+e,2)}}function uR(){if(mI<=0)return;let e=lI-mI,t=L(_I*(e+2),18);nD(5,96,32,32,32,hI,gI,t,6+L(mI*25,lI),57,0)}var dR=[3,-2,2,-3,1,-1,2,-2],fR={broken:0,fuse:null,crate_broken:null,room_frame:0,crust:null,flood_ring:-1};function pR(){let e=A.game_frames,t=Q.status===1,n={...QF};if(pI>0&&k.options.screen_shake){let t=pI*N(.012);n.x+=t*dR[e&7],n.z+=t*dR[e+3&7]}aT(n),Q.room.hub||hD(n,e|0),fR.broken=Q.decor_broken,fR.fuse=Q.fuse,fR.crate_broken=Q.crate_broken,fR.room_frame=Q.frames,fR.crust=Q.crust,fR.flood_ring=Q.flood_ring,RE(Q.room,$F,Q.player.x,Q.player.z,t,e|0,fR),bE(Q.room,t,Q.chest_opened,fR,e|0),Q.room.hub&&(oD(Lb,Rb,N(1.1)),eD(3,80,L(5,8)*16,16,16,!1,Lb,0,Rb,0),e%12==0&&B_($,6,Lb+(Math.imul(e,997)>>>0)%4096-En,N(.4),Rb,0,N(.015),0,40)),oR(),XL();for(let e=0;e<12;e++)Q.enemies[e].active&&rR(Q.enemies[e]);let r=L(e|0,4)&1;for(let e=0;e<24;e++){let t=Q.shots[e];t.active&&(t.kind===2?eD(14,64,0,16,16,r!==0,t.x,gg-N(.3),t.z,0):t.kind===1?eD(5,(wb(t.vx,t.vz)-2+8)%8*16,0,16,16,!1,t.x,gg-N(.3),t.z,0):eD(5,0+r*8,16,8,8,!1,t.x,gg,t.z,0))}cR(),sR(),iD($),aR(),lR(),iR(),uR(),zE(Q.room,$F)}var mR={name:`play`,enter:AL,update:JL,draw:pR,exit:jL};function hR(){return{run:Q,mode:eI,descend(e){Q.room.hub&&(nI=e,eI=VF,tI=0)}}}var gR=60,_R=45,vR=0,yR=1,bR=2,xR=vi({items:[`Descend again`,`Back to camp`,`Run history`],count:3,x:9,y:14,w:18,step:3,has_back:!0}),SR=0;function CR(){let e=k.last_run;RD()!==9&&(ar(1),xR.cursor=vR),_D(!1),kD(e,e.abandoned?`RUN ABANDONED`:`YOU DIED`),qi(),$i(3,0,26,12),H(1,8,`- RUN SUMMARY -`),V(5,3,15,`Gold found`),V(21,3,15,`%5d`,e.gold),V(5,5,15,`Depth x%d`,3),V(21,5,15,`%5d`,Pv(e)*3),V(5,7,15,`Kills x%d`,1),V(21,7,15,`%5d`,e.kills*1),Gi(0,3,32,68),V(7,9,11,`Earned`),$i(5,12,22,11),ca(xR),k.storage_ok||H(23,9,`Not saved: storage off`),SR=RD()===9?e.earned:-1,V(21,9,11,`%5d`,SR<0?0:SR)}function wR(){vD();let e=k.last_run,t=zD(),n=t>=gR||SR===e.earned?e.earned:Math.trunc((Math.imul(e.earned,t)>>>0)/gR);if(n!==SR&&(V(21,9,11,`%5d`,n),SR=n),!(t<=_R))switch(da(xR)){case 2:switch(xR.cursor){case vR:AD.now=!0,LD(6);break;case yR:LD(6);break;case bR:LD(9)}break;case 3:LD(6)}}var TR={name:`summary`,enter:CR,update:wR},ER=[0,5,1,3,2,8,12,13,14,4,9,10,11,6,7];if(ER.length!==15)throw Error(`upgrades: order`);var DR=vi({items:[],count:15,x:4,y:3,w:25,step:2,has_back:!0,quiet_activate:!0,rows:9}),OR=10,kR=22;function AR(){return Lt(Ft.active,2)}function jR(e){let t=Cv[e].requires;return!AR()&&t>=0&&!Dv(k.meta,t)}function MR(e,t){V(OR,kR,e,`%-22s`,t)}function NR(){Gi(0,3,160,4),V(23,1,11,`%-6lu`,k.meta.currency);for(let e=0;e<15;e++){let t=ER[e],n=sa(DR,e);if(n<0)continue;let r=e===DR.cursor?11:15;AR()?V(20,n,14,`  genie`):Dv(k.meta,t)?V(20,n,10,`  owned`):jR(t)?V(20,n,8,` locked`):k.meta.currency<Cv[t].cost?V(20,n,9,`%5lu g`,Cv[t].cost):V(20,n,r,`%5lu g`,Cv[t].cost)}let e=ER[DR.cursor];jR(e)?MR(8,z(`Needs %s`,Cv[Cv[e].requires].name).slice(0,31)):MR(8,Cv[e].desc)}function PR(){RD()!==6&&ar(1);for(let e=0;e<15;e++)DR.items[e]=Cv[ER[e]].name;DR.cursor=0,DR.top=0,AF(k.meta,7),qi(),$i(2,0,28,21),V(4,1,8,`- UPGRADES -`),ca(DR),NR(),ia()}function FR(e){let t=ER[e];if(AR()){R(27),MR(14,`Code Genie: all owned`);return}let n=Ov(k.meta,t);switch(NR(),n){case 1:R(27),MR(8,`Already owned`);break;case 2:R(27),MR(9,z(`Need %lu more gold`,Cv[t].cost-k.meta.currency>>>0).slice(0,31));break;case 3:R(27),MR(9,z(`Buy %s first`,Cv[Cv[t].requires].name).slice(0,31));break;case 0:R(30),MR(10,z(`Bought %s!`,Cv[t].name).slice(0,31)),kt(k)}}function IR(){switch(vD(),da(DR)){case 1:NR();break;case 2:FR(DR.cursor);break;case 3:LD(RD()===6?6:1)}}var LR={name:`upgrades`,enter:PR,update:IR};function RR(){ar(1),_D(!0),ui(8,11,`an endless descent`),li(25,23,8,`v%s`,`2.5.0`),qi(),$i(4,9,24,5)}function zR(){vD();let e=zD()%60;e===0?H(11,11,`Touch or press START`):e===40&&V(6,11,11,`                    `),(o.down&9||o.touch_down)&&(R(0),LD(k.storage_ok?10:1))}var BR={name:`title`,enter:RR,update:zR,draw:ED},VR=xg(),HR=yv(),UR=x_(),WR={broken:0,fuse:null,crate_broken:null,room_frame:0,crust:null,flood_ring:-1},GR=0,KR=0,qR=!1,JR=0;function YR(){let e=new URLSearchParams(location.search),t=e.get(`view`)??`camp`,n=Number(e.get(`seed`)??1)>>>0;if(t===`camp`)Lx(VR),wo(5);else{let r=Math.max(1,Number(t)|0),i=Number(e.get(`type`)??0)|0;Bx(VR,Gb(n,r,0),r,i,3,6);let a=f_[c_(r)];wo(a.sky[(r-1)%10<5?0:1]),Co(VR.area===3)}bv(HR),pD(VR.seed),GR=VR.spawn_x,KR=VR.spawn_z,D_(UR,0,P(12),GR,KR),ci(),qi(),V(1,1,11,`Room viewer (debug)`),V(1,3,8,`D-pad: move  SELECT: zoom`),V(1,5,8,`A: doors`)}function XR(){let e=N(.08);o.held&64&&(KR-=e),o.held&128&&(KR+=e),o.held&32&&(GR-=e),o.held&16&&(GR+=e),o.down&4&&O_(UR),o.down&1&&(qR=!qR),k_(UR,GR,KR),M_(UR),xv(VR,HR,GR,KR,BE,VE),To(0,0),Eo(F((UR.x-UR.z)*16),F((UR.x+UR.z)*8)),JR++,V(1,22,8,`%3d.%02d %3d.%02d`,F(GR),0,F(KR),0)}function ZR(){let e=A.game_frames|0;WR.room_frame=JR>>>0,aT(UR),hD(UR,e),RE(VR,HR,GR,KR,qR,e,WR),bE(VR,qR,!1,WR,e),oD(GR,KR,N(1)),aD(0,0,!1,19,GR,KR,0),zE(VR,HR)}var QR={name:`viewer`,enter:YR,update:XR,draw:ZR},$R=new za,ez=!0,tz=0;Aa(()=>{ez=!1,cancelAnimationFrame(tz)});var nz=e,rz=new pr(document.getElementById(`top-screen`)),iz=new pr(document.getElementById(`bottom-screen`)),az=new fr(iz.display);az.keymap=O(),Gk(az),OO(az);var oz=w(),sz,cz=new re(az),lz=window.matchMedia?.(`(pointer: coarse)`).matches??!1,uz=!1;function dz(){let e=E();return e===`on`||e===`auto`&&lz&&!uz}az.onPhysicalInput=()=>{uz||(uz=!0,E()===`auto`&&hz())},window.addEventListener(`pointerdown`,e=>{e.pointerType===`touch`&&uz&&(uz=!1,E()===`auto`&&hz())},{capture:!0,passive:!0});function fz(){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.().catch(()=>{})}var pz=ie(fz);function mz(){if(!pz)return;let e=window.innerWidth,t=window.innerHeight,n=[sz.top,sz.bottom,...sz.pad?Object.values(sz.pad):[]],r=(e,t)=>!n.some(n=>e<n.x+n.w&&n.x<e+36&&t<n.y+n.h&&n.y<t+36);for(let[n,i]of[[e-36,0],[0,0],[e-36,t-36],[0,t-36]])if(r(n,i)){pz.hidden=!1,pz.style.left=`${n+3}px`,pz.style.top=`${i+3}px`,pz.style.right=`auto`;return}pz.hidden=!0}function hz(){sz=Ia(window.innerWidth,window.innerHeight,window.devicePixelRatio||1,oz,dz()),rz.place(sz.top,sz.devScale),iz.place(sz.bottom,sz.devScale),rz.present(),iz.present(),cz.place(sz.pad),mz()}v(()=>{az.keymap=O(),oz=w(),hz()}),az.onPageKey=e=>{e===`KeyF`&&fz()},window.addEventListener(`resize`,hz),window.addEventListener(`orientationchange`,hz),document.addEventListener(`fullscreenchange`,hz);var gz=new zh;await GC(),iT(gz),de(k),si(),Wi(),_o(909694),k.storage_ok=Ot(k),sr();for(let e of[`keydown`,`pointerdown`,`pointerup`,`touchend`,`click`])window.addEventListener(e,nr,{capture:!0,passive:!0});document.addEventListener(`visibilitychange`,()=>rr(document.hidden)),ID(0,BR),ID(1,UN),ID(6,mR),ID(7,TR),ID(9,Lk),ID(3,LR),ID(2,AP),ID(10,uF),ID(5,uO),ID(11,Ak),ID(8,jN),ID(4,MO),ID(13,tA),nz&&new URLSearchParams(location.search).has(`view`)?(ID(12,QR),LD(12)):LD(0),hz();var _z=nz?new t:null;function vz(){let e=_z?performance.now():0;Ji(),p(az),or(),VD(),A.game_frames=A.game_frames+1>>>0,_z?.update(performance.now()-e)}function yz(){let e=_z?performance.now():0;HD(),oT(),Ca(rz,gz.canvas),wa(iz),rz.present(),iz.present(),_z?.draw(performance.now()-e)}function bz(e){if(!ez)return;let t=$R.advance(e);for(let e=0;e<t;e++)vz();t>0&&yz(),tz=requestAnimationFrame(bz),Da()}window.__delve={version:`2.5.0`,input:o,get frames(){return A.game_frames},get layout(){return sz},get state(){return UD()},setLayoutMode(e){oz=e,hz()},snapshot(){return{top:rz.canvas.toDataURL(),bottom:iz.canvas.toDataURL()}},...nz?{game:k,state_set:LD,clock:A,redraw:yz,topCanvas:rz.canvas,play:hR,audio:cr,audio_level:ur,audio_measure:dr,rogue:MN,egg_mode:jk,cheats:Ft}:{}},tz=requestAnimationFrame(bz),Da();