(function(){
  function applyKindleHero(){
    const hero=document.querySelector('.homehero');
    if(!hero)return;
    const p=hero.querySelector('p');
    if(p){
      p.innerHTML='質問に答えるだけで、あなただけの物語が生まれます。できた作品は公開して、みんなに読んでもらえます。<br><br><b>人気作品は、作者の同意のもとKindleで出版することも予定しています。</b><br>あなたの作った物語が、本になるかもしれません。';
    }
    let note=hero.querySelector('#kindleChanceNote');
    if(!note){
      note=document.createElement('div');
      note.id='kindleChanceNote';
      note.style.cssText='margin:14px 0 8px;padding:10px 12px;border-radius:14px;background:#fff8f1;border:1px solid var(--line);font-size:12px;line-height:1.65';
      note.innerHTML='<b>📚 人気作品はKindle出版のチャンス</b><div class="meta" style="margin-top:4px">※出版を保証するものではありません。候補作品は作者へ確認のうえ進めます。</div>';
      const chips=hero.querySelector('.chips');
      if(chips)chips.insertAdjacentElement('beforebegin',note);
      else hero.appendChild(note);
    }
  }

  const prevHome=window.home;
  window.home=async function(){
    await prevHome();
    applyKindleHero();
  };

  setTimeout(applyKindleHero,0);
})();