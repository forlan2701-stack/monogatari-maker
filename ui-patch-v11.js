(function(){
  function polishTop(){
    const sub=document.querySelector('.top .small');
    if(sub){
      sub.textContent='あなたの物語が、本になるかも。';
      sub.style.cssText='font-size:14px;font-weight:700;line-height:1.45;margin-top:5px;color:var(--muted)';
    }
  }

  function polishHero(){
    const hero=document.querySelector('.homehero');
    if(!hero)return;

    const p=hero.querySelector('p');
    if(p){
      p.innerHTML='質問に答えるだけで、あなただけの物語が生まれます。<br>できた作品は公開して、みんなに読んでもらえます。';
    }

    const duplicate=[...hero.querySelectorAll('div')].filter(el=>{
      const t=(el.textContent||'').trim();
      return t.includes('人気作品はKindle出版のチャンス') || el.id==='kindleChanceNote' || el.id==='kindlePublishNotice';
    });
    const roots=duplicate.filter(el=>!duplicate.some(other=>other!==el&&other.contains(el)));
    roots.forEach(el=>el.remove());

    let note=document.getElementById('kindlePublishNotice');
    if(!note){
      note=document.createElement('div');
      note.id='kindlePublishNotice';
      note.style.cssText='margin:13px 0 14px;padding:12px 13px;border-radius:14px;background:#fff8f1;border:1px solid var(--line);line-height:1.65';
      note.innerHTML='<b style="font-size:13px">📚 人気作品はKindle出版へ</b><div class="meta" style="margin-top:5px">公開作品の中から、作者の同意をいただいた作品をKindle化する企画を予定しています。</div><div class="meta" style="margin-top:3px">※出版を保証するものではありません。</div>';
      const chips=hero.querySelector('.chips');
      if(chips)chips.insertAdjacentElement('afterend',note);
      else {
        const btn=hero.querySelector('.primary');
        if(btn)btn.insertAdjacentElement('beforebegin',note);
        else hero.appendChild(note);
      }
    }
  }

  function polish(){polishTop();polishHero()}

  const prevHome=window.home;
  window.home=async function(){
    await prevHome();
    polish();
  };

  setTimeout(polish,0);
})();