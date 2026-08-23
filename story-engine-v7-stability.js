(function(){
  const baseTitle=window.titlePage;
  const baseGenerate=window.generate;
  const skip=new Set(['冒険','ファンタジー','ロードノベル']);

  function seedValue(){
    if(!state.mmStorySeed)state.mmStorySeed=(Date.now()^Math.floor(Math.random()*0x7fffffff))>>>0;
    return state.mmStorySeed;
  }
  function rng(seed){let x=seed>>>0;return function(){x=(x+0x6D2B79F5)|0;let t=Math.imul(x^(x>>>15),1|x);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
  function withSeed(fn){const old=Math.random;Math.random=rng(seedValue());try{return fn()}finally{Math.random=old}}

  window.titlePage=function(){
    if(skip.has(state?.ans?.genre))return baseTitle();
    const out=withSeed(()=>baseTitle());
    const card=document.querySelector('.question .card');
    if(card){
      const a=state.ans;
      card.innerHTML=`<div class="meta">今回の物語の核</div><b>${esc(a.genre)} × テーマ「${esc(a.theme)}」</b><div class="meta" style="margin-top:5px;line-height:1.65">舞台：${esc(a.place)}<br>この2つが、物語の出来事・葛藤・結末まで反映されます。</div>`;
    }
    return out;
  };

  function cleanNewest(){
    const all=books();if(!all.length)return;
    const b=all[0];let changed=false;
    (b.chapters||[]).forEach(c=>{
      const p=String(c.p||'');
      const next=p.replace(/選んだテーマ「[^」]+」から逃げられなくなった。/g,'その問題を曖昧にしたままでは、目的まで進めないことがはっきりした。');
      if(next!==p){c.p=next;changed=true}
    });
    if(changed){saveBooks(all);showBook(b.id)}
  }

  window.generate=function(){
    if(skip.has(state?.ans?.genre))return baseGenerate();
    const out=withSeed(()=>baseGenerate());
    cleanNewest();
    return out;
  };
})();