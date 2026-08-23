(function(){
  const previousHome=window.home;

  // 準備中のAI機能をトップ最上部には出さない
  window.creditbar=function(){return ''};

  function moveAiStatus(){
    document.querySelectorAll('.credit').forEach(el=>{
      if((el.textContent||'').includes('AI')||(el.textContent||'').includes('クレジット'))el.remove();
    });

    const beta=[...document.querySelectorAll('.card')].find(x=>(x.textContent||'').includes('BETA / テスト版'));
    if(!beta)return;

    let box=document.getElementById('aiRoadmapStatus');
    if(!box){
      box=document.createElement('div');
      box.id='aiRoadmapStatus';
      box.style.cssText='margin-top:12px;padding:11px 12px;border:1px solid var(--line);border-radius:14px;background:#fffdf9';
      beta.appendChild(box);
    }
    box.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>🤖 生成AIによる文章強化</b><span class="badge">準備中</span></div><div class="meta" style="margin-top:5px;line-height:1.65">現在はテスト版です。今後、生成AIを導入して物語のつながり・会話・文章表現をさらに自然にしていく予定です。</div>';
  }

  function updateHeroCopy(){
    const hero=document.querySelector('.homehero');
    if(!hero)return;

    const p=hero.querySelector('p');
    if(p){
      p.innerHTML='質問に答えるだけで、あなただけの物語が生まれます。できた作品は公開して、みんなに読んでもらえます。<br><b style="color:var(--ink)">人気作品は、作者の同意のもとKindleで出版することも予定しています。</b><br>あなたの作った物語が、本になるかもしれません。';
    }

    let note=document.getElementById('kindleChance');
    if(!note){
      note=document.createElement('div');
      note.id='kindleChance';
      note.style.cssText='margin:12px 0 2px;padding:10px 12px;border-radius:14px;background:#fff8f1;border:1px solid var(--line)';
      const chips=hero.querySelector('.chips');
      if(chips)chips.insertAdjacentElement('afterend',note);
      else if(p)p.insertAdjacentElement('afterend',note);
      else hero.appendChild(note);
    }
    note.innerHTML='<div style="font-weight:900;font-size:13px">📚 人気作品はKindle出版のチャンス</div><div class="meta" style="margin-top:3px">※出版を保証するものではありません。候補作品は作者へ確認のうえ進めます。</div>';
  }

  function applyHomeLayout(){
    updateHeroCopy();
    moveAiStatus();
  }

  window.home=async function(){
    await previousHome();
    applyHomeLayout();
  };

  // MutationObserverで自分自身を書き換え続ける処理は使わない
  setTimeout(()=>{
    if(document.querySelector('.homehero'))applyHomeLayout();
  },80);
})();