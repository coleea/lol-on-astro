import{e as d}from"./vendor.09c785d8.js";const m="modulepreload",i={},_="/",l=function(n,r){return!r||r.length===0?n():Promise.all(r.map(e=>{if(e=`${_}${e}`,e in i)return;i[e]=!0;const o=e.endsWith(".css"),c=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${c}`))return;const t=document.createElement("link");if(t.rel=o?"stylesheet":m,o||(t.as="script",t.crossOrigin=""),t.href=e,document.head.appendChild(t),o)return new Promise((a,u)=>{t.addEventListener("load",a),t.addEventListener("error",u)})})).then(()=>n())};d("ZrhDoF",{value:!0},async()=>{const[{default:s},{default:n}]=await Promise.all([l(()=>import("./App.2630c51e.js"),["assets/App.2630c51e.js","assets/vendor.09c785d8.js"]),l(()=>import("./client.ed1621de.js"),["assets/client.ed1621de.js","assets/vendor.09c785d8.js"])]);return(r,e)=>n(r)(s,{},e)});
