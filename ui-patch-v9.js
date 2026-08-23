(function(){
  const previousHome=window.home;

  window.creditbar=function(){return ''};

  function moveAiStatus(){
    document.querySelectorAll('.credit').forEach(el=>{
      if((el.textContent||'').includes('AI')||(el.textContent||'').includes('クレジット'))el.remove();
    });
    document.getElementById('aiRoadmapStatus')?.remove();
    const beta=[...document.querySelectorAll('.card')].find(x=>(x.textContent||'').includes('BETA / テスト版'));
    if(!beta)return;
    const box=document.createElement('div');
    box.id='aiRoadmapStatus';
    box.style.cssText='margin-top:12px;padding:11px 12px;border:1px solid var(--line);border-radius:14px;background:#fffdf9';
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>🤖 生成AIによる文章強化</b><span class="badge">準備中</span></div><div class="meta" style="margin-top:5px;line-height:1.65">現在はテスト版です。今後、生成AIを導入して物語のつながり・会話・文章表現をさらに自然にしていく予定です。</div>';
    beta.appendChild(box);
  }

  window.home=async function(){
    await previousHome();
    moveAiStatus();
  };

  const obs=new MutationObserver(()=>moveAiStatus());
  obs.observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(()=>{
    if(document.querySelector('.homehero'))window.home();
    else moveAiStatus();
  },0);
})();