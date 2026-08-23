(function(){
  const BOOKS_URL='https://t.co/gGElTIIC9E';

  function currentPage(){return document.querySelector('.nav button.active')?.dataset.page||'home'}

  function nameBadge(){
    const old=document.getElementById('mmDisplayName');
    if(old)old.remove();
    const u=user();
    if(!u)return;
    const top=document.querySelector('.top');
    if(!top)return;
    const wrap=document.createElement('div');
    wrap.id='mmDisplayName';
    wrap.style.cssText='display:flex;justify-content:flex-end;margin-top:8px';
    wrap.innerHTML=`<button class="pill" style="border:0;cursor:pointer" onclick="account()">👤 表示名：${esc(u.name)}</button>`;
    top.appendChild(wrap);
  }
  window.refreshDisplayName=nameBadge;

  window.creditbar=function(){
    return `<div class="credit"><div><div class="meta">AI物語生成</div><div class="pill">✦ 準備中</div></div><button class="mini" onclick="toast('生成AIは現在準備中です')">準備中</button></div>`;
  };

  function bookPromo(){return `<div id="touuBookPromo" class="card" style="margin-top:18px;background:linear-gradient(145deg,#fffdf9,#f2e7da)">
    <div class="meta">📚 灯雨文庫の通常作品</div>
    <div style="font-weight:900;font-size:16px;margin:5px 0 7px">物語メーカーとは別に、灯雨文庫の本も公開しています。</div>
    <div class="meta" style="line-height:1.7;margin-bottom:10px">静かな夜に読みたい短編やシリーズ作品はこちらから。</div>
    <a href="${BOOKS_URL}" target="_blank" rel="noopener" style="display:block;background:var(--accent);color:#fff;text-decoration:none;border-radius:12px;padding:11px 13px;font-weight:800;font-size:13px;text-align:center">灯雨文庫の本を見る →</a>
  </div>`}

  function placeLowerPromo(){
    if(!document.querySelector('.homehero'))return;
    document.getElementById('touuBookPromo')?.remove();
    const foot=document.querySelector('.creditfoot');
    if(foot)foot.insertAdjacentHTML('beforebegin',bookPromo());
  }

  const previousHome=window.home;
  window.home=async function(){
    await previousHome();
    nameBadge();
    placeLowerPromo();
  };

  const previousStartCreate=window.startCreate;
  window.startCreate=function(){
    if(!user()){
      sessionStorage.setItem('mm_after_signup','create');
      toast('先に表示名を決めてください');
      account();
      return;
    }
    return previousStartCreate();
  };

  window.account=function(){
    const u=user();
    if(!u){
      const from=currentPage();
      if(from&&from!=='account')sessionStorage.setItem('mm_after_signup',from);
    }
    nav('account');
    if(u){
      main.innerHTML=`<div class="card"><h2>アカウント</h2><div class="meta" style="margin-bottom:8px">現在の表示名</div><div class="pill" style="display:inline-block;font-size:14px">👤 ${esc(u.name)}</div><div class="meta" style="margin-top:10px">この名前が、公開した本や掲示板に表示されます。</div><div class="actions"><button class="secondary" onclick="plans()">料金プラン</button><button class="ghost" onclick="mmLogout()">ログアウト</button></div></div>`;
    }else{
      const dest=sessionStorage.getItem('mm_after_signup');
      main.innerHTML=`<div class="card"><h2>表示名を決める</h2><div class="meta" style="line-height:1.7;margin-bottom:10px">本や掲示板で使う名前です。あとで分かるよう、画面上部にも表示します。${dest==='create'?'<br><b>登録後は、そのまま本づくりに戻ります。</b>':''}</div><input id="name" class="input" maxlength="20" placeholder="表示名を入力"><button class="primary wide" style="margin-top:10px" onclick="signup()">この名前で始める</button></div>`;
    }
    nameBadge();
  };

  window.signup=function(){
    const el=document.getElementById('name');
    const n=(el?.value||'').trim();
    if(!n){toast('表示名を入力してください');return}
    localStorage.setItem('mm_user',JSON.stringify({id:'u'+Date.now(),name:n}));
    const dest=sessionStorage.getItem('mm_after_signup')||'account';
    sessionStorage.removeItem('mm_after_signup');
    toast('表示名を登録しました');
    nameBadge();
    if(dest==='create')startCreate();
    else if(dest==='community')community();
    else if(dest==='ranking')ranking('today');
    else if(dest==='mine')mine();
    else account();
  };

  window.mmLogout=function(){
    localStorage.removeItem('mm_user');
    document.getElementById('mmDisplayName')?.remove();
    sessionStorage.removeItem('mm_after_signup');
    account();
  };

  function relabelButtons(){
    document.querySelectorAll('button').forEach(b=>{
      const t=(b.textContent||'').trim();
      if(t==='候補を入れ替える')b.textContent='別の候補を表示';
      if(t==='名前候補を変える')b.textContent='別の名前候補を表示';
    });
  }
  const obs=new MutationObserver(()=>relabelButtons());
  obs.observe(document.documentElement,{subtree:true,childList:true});
  relabelButtons();
  setTimeout(()=>{nameBadge();placeLowerPromo();relabelButtons()},0);
})();