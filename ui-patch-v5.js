(function(){
  window.creditbar=function(){
    return `<div class="credit"><div><div class="meta">AI物語生成</div><div class="pill">✦ 準備中</div></div><button class="mini" onclick="toast('AI物語生成は準備中です')">準備中</button></div>
    <div class="card" style="margin-bottom:12px;background:linear-gradient(145deg,#fffdf9,#f2e7da)">
      <div class="meta">📚 灯雨文庫の本も読めます</div>
      <div style="font-weight:900;font-size:16px;margin:5px 0 8px">ものがたりメーカーとは別に、灯雨文庫の通常作品も公開中です。</div>
      <a href="https://t.co/gGElTIIC9E" target="_blank" rel="noopener" style="display:inline-block;background:var(--accent);color:#fff;text-decoration:none;border-radius:12px;padding:10px 13px;font-weight:800;font-size:13px">灯雨文庫の本を見る →</a>
    </div>`;
  };

  window.home=async function(){
    nav('home');
    main.innerHTML=`${creditbar()}<div class="card">トップページを読み込み中…</div>`;
    const mineCount=books().length;
    const localPublished=books().filter(b=>b.published);
    const [cloud,likes]=await Promise.all([cloudBooks(),fetchLikes()]);
    const seen=new Set();
    const actual=[...cloud,...localPublished].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true});
    const todayRank=scoreBooks(actual,likes,'today').slice(0,3);
    const weekly=scoreBooks(actual,likes,'weekly').slice(0,3);
    const overall=scoreBooks(actual,likes,'all').slice(0,3);
    const newest=[...actual].sort((a,b)=>(Number(b.created)||0)-(Number(a.created)||0)).slice(0,3);
    const totalLikes=likes.length.toLocaleString();
    main.innerHTML=`${creditbar()}
    <section class="homehero">
      <div class="eyebrow">📚 STORY APP</div>
      <h1 class="titlefit">📚 ものがたりメーカー</h1>
      <p>答えるだけで、あなたの物語が一冊の本になります。できた本は公開して、みんなに読んでもらえます。</p>
      <div class="chips"><span class="chip">📖 本ができる</span><span class="chip">🌐 共有できる</span><span class="chip">🏆 ランキング</span><span class="chip">📣 SNS共有</span></div>
      <button class="primary wide" onclick="go('create')">新しい本をつくる</button>
    </section>
    <div class="sectionline"><h2>今日のステータス</h2><button class="mini" onclick="go('mine')">マイ本棚</button></div>
    <div class="grid2">
      <div class="card clickcard" onclick="go('mine')"><div class="num">${mineCount}</div><div class="meta">あなたが作った本　›</div></div>
      <div class="card clickcard" onclick="go('community')"><div class="num">${totalLikes}</div><div class="meta">みんなのいいね　›</div></div>
    </div>
    <div class="sectionline"><h2>ランキング</h2><button class="mini" onclick="ranking('today')">すべて見る</button></div>
    <div class="homeranks">
      ${homeRankBox('☀ 今日のランキング','today',todayRank)}
      ${homeRankBox('🔥 週間ランキング','weekly',weekly)}
      ${homeRankBox('🏆 総合ランキング','all',overall)}
    </div>
    <div class="sectionline"><h2>新着作品</h2><button class="mini" onclick="newArrivals()">もっと見る</button></div>
    ${newest.length?newest.map(b=>bookItem(b)).join(''):`<div class="card"><div class="meta">まだ新着作品がありません。</div></div>`}
    ${ad()}
    <div class="sectionline"><h2>みんなの本</h2><button class="mini" onclick="go('community')">もっと見る</button></div>
    ${actual.length?bookItem(actual[0]):bookItem(sampleBooks[0])}
    <div class="creditfoot"><b>Presented by 灯雨文庫</b>読書と創作をつなぐ、小さな物語の場所。</div>`;
  };

  window.ranking=async function(mode='today'){
    if(mode==='new'){newArrivals();return}
    nav('ranking');
    currentRankMode=mode;
    main.innerHTML='<div class="card">読み込み中…</div>';
    const [cloud,likes]=await Promise.all([cloudBooks(),fetchLikes()]);
    const local=books().filter(b=>b.published),seen=new Set();
    const all=[...cloud,...local].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true});
    const ranked=scoreBooks(all,likes,mode);
    const labels={today:'今日',weekly:'週間',all:'総合'};
    main.innerHTML=`<div id="rankroot">
      <div class="sectionline"><h2>${labels[mode]||'今日'}ランキング</h2></div>
      <div class="ranktabs" style="grid-template-columns:repeat(3,1fr)">
        <button class="ranktab ${mode==='today'?'active':''}" onclick="ranking('today')">今日</button>
        <button class="ranktab ${mode==='weekly'?'active':''}" onclick="ranking('weekly')">週間</button>
        <button class="ranktab ${mode==='all'?'active':''}" onclick="ranking('all')">総合</button>
      </div>
      ${ranked.length?ranked.map((b,i)=>`<div class="rankitem"><div class="rankno">#${i+1}</div><div onclick="openBook('${b.id}')"><b>${esc(b.title)}</b><div class="meta">${esc(b.genre||'物語')} · @${esc(b.author||'you')}</div></div><button class="likebtn" onclick="toggleLike('${b.id}')">♥ ${b.realLikes||0}</button></div>`).join(''):`<div class="card"><b>まだランキング対象の本がありません。</b><div class="meta">本が公開されると、ここに並びます。</div></div>`}
      ${ad()}
    </div>`;
  };

  window.newArrivals=async function(){
    nav('community');
    main.innerHTML='<div class="card">読み込み中…</div>';
    const cloud=await cloudBooks();
    const local=books().filter(b=>b.published),seen=new Set();
    const all=[...cloud,...local].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true})
      .sort((a,b)=>(Number(b.created)||0)-(Number(a.created)||0));
    main.innerHTML=`<div class="sectionline"><h2>新着作品</h2><button class="mini" onclick="home()">ホームへ</button></div>
      ${all.length?all.map(b=>bookItem(b)).join(''):`<div class="card"><div class="meta">まだ公開作品がありません。</div></div>`}
      ${ad()}`;
  };

  const params=new URLSearchParams(location.search||'');
  if(!params.get('book')){
    setTimeout(()=>{
      const active=document.querySelector('.nav button.active')?.dataset.page;
      if(!active||active==='home') home();
    },0);
  }
})();