(function(){
  const X_URL='https://x.com/akariame_bunko';
  const BOARD_CATEGORIES=['ひとこと','感想','質問','機能アイデア'];

  function todayJst(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get=t=>parts.find(x=>x.type===t)?.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  // 旧「ユニーク訪問者」集計は停止。現在は visitor-access-v17.js のアクセス集計だけを使用する。
  async function registerVisit(){return}

  async function countRows(table,query=''){
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=visitor_id${query}`,{
        headers:{apikey:SUPABASE_KEY,Prefer:'count=exact',Range:'0-0'}
      });
      const cr=r.headers.get('content-range')||'';
      const m=cr.match(/\/(\d+)$/);
      if(m)return Number(m[1]);
      const d=await r.json();return Array.isArray(d)?d.length:0;
    }catch{return 0}
  }

  async function visitorStats(){
    const day=todayJst();
    const [today,total]=await Promise.all([
      countRows('site_daily_visits',`&visitor_id=like.a:*&visit_date=eq.${day}`),
      countRows('site_daily_visits','&visitor_id=like.a:*')
    ]);
    return{today,total};
  }
  window.registerVisit=registerVisit;

  function betaCard(){return `<div class="card" style="margin-top:12px;background:linear-gradient(145deg,#fffdf8,#f7efe5)">
    <span class="badge">BETA / テスト版</span>
    <h2 style="margin:8px 0 6px">ものがたりメーカーは、まだ育てている途中です。</h2>
    <div class="meta" style="line-height:1.75">現在はテスト版です。これから生成AIを導入し、物語のつながりや文章表現を、より精度の高いものにしていく予定です。<br>「こんな機能がほしい」「ここが分かりにくい」など、ぜひ教えてください。</div>
    <div class="actions" style="margin-top:12px"><button class="secondary" onclick="board()">みんなの掲示板へ</button><a href="${X_URL}" target="_blank" rel="noopener" class="ghost" style="text-decoration:none;text-align:center">Xで意見を送る</a></div>
    <div class="meta" style="margin-top:8px">灯雨文庫｜静かな夜に読む物語　@akariame_bunko</div>
  </div>`}

  window.home=async function(){
    nav('home');
    main.innerHTML=`${creditbar()}<div class="card">トップページを読み込み中…</div>`;
    const mineCount=books().length;
    const localPublished=books().filter(b=>b.published);
    const [cloud,likes,vis]=await Promise.all([cloudBooks(),fetchLikes(),visitorStats()]);
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
      <div class="chips"><span class="chip">📖 本ができる</span><span class="chip">🌐 共有できる</span><span class="chip">🏆 ランキング</span><span class="chip">💬 掲示板</span></div>
      <button class="primary wide" onclick="go('create')">新しい本をつくる</button>
    </section>
    ${betaCard()}
    <div class="sectionline"><h2>今日のステータス</h2><button class="mini" onclick="go('mine')">マイ本棚</button></div>
    <div class="grid2">
      <div class="card clickcard" onclick="go('mine')"><div class="num">${mineCount}</div><div class="meta">あなたが作った本　›</div></div>
      <div class="card clickcard" onclick="go('community')"><div class="num">${totalLikes}</div><div class="meta">みんなのいいね　›</div></div>
      <div class="card"><div class="num">${vis.today.toLocaleString()}</div><div class="meta">今日のアクセス数</div></div>
      <div class="card"><div class="num">${vis.total.toLocaleString()}</div><div class="meta">累計アクセス数</div></div>
    </div>
    <div class="sectionline"><h2>コミュニティ</h2><button class="mini" onclick="board()">掲示板を見る</button></div>
    <div class="card clickcard" onclick="board()"><b>💬 みんなの掲示板</b><div class="meta" style="margin-top:6px">感想・質問・機能アイデア・ひとことを気軽にどうぞ。</div></div>
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

  async function fetchBoard(){
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/board_posts?select=*&order=created.desc&limit=50`,{headers:{apikey:SUPABASE_KEY}});
      if(!r.ok)return[];const d=await r.json();return Array.isArray(d)?d:[];
    }catch{return[]}
  }
  window.board=async function(){
    nav('community');
    main.innerHTML='<div class="card">掲示板を読み込み中…</div>';
    const posts=await fetchBoard();
    const u=user();
    main.innerHTML=`<div class="sectionline"><h2>💬 みんなの掲示板</h2><button class="mini" onclick="community()">みんなの本</button></div>
      <div class="card"><div class="meta" style="line-height:1.7">作品の感想、質問、「こんな機能がほしい！」など自由にどうぞ。個人情報や他の人が嫌な気持ちになる投稿は控えてください。</div>
      ${u?`<select id="boardCat" class="input" style="margin-top:10px">${BOARD_CATEGORIES.map(x=>`<option>${x}</option>`).join('')}</select><textarea id="boardText" class="input" maxlength="500" rows="4" style="margin-top:8px" placeholder="500文字まで"></textarea><button class="primary wide" style="margin-top:8px" onclick="postBoard()">投稿する</button>`:`<button class="primary wide" style="margin-top:10px" onclick="account()">名前を決めて投稿する</button>`}
      </div>
      <div class="sectionline"><h2>最新の投稿</h2></div>
      ${posts.length?posts.map(p=>`<div class="item"><span class="badge">${esc(p.category||'ひとこと')}</span><div style="white-space:pre-wrap;line-height:1.75;margin:8px 0">${esc(p.text||'')}</div><div class="meta">@${esc(p.user_name||'guest')} · ${new Date(Number(p.created)||0).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo'})}</div></div>`).join(''):`<div class="card"><div class="meta">まだ投稿はありません。最初のひとことをどうぞ。</div></div>`}
      <div class="card" style="margin-top:12px"><b>質問や意見はXでも受け付けています</b><div class="meta" style="margin:6px 0">灯雨文庫｜静かな夜に読む物語　@akariame_bunko</div><a href="${X_URL}" target="_blank" rel="noopener" class="secondary" style="display:block;text-decoration:none;text-align:center">Xを開く →</a></div>`;
  };
  window.postBoard=async function(){
    const u=user();if(!u){account();return}
    const text=(document.getElementById('boardText')?.value||'').trim();
    const category=document.getElementById('boardCat')?.value||'ひとこと';
    if(!text){toast('本文を入力してください');return}
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/board_posts`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({id:'p'+Date.now()+Math.random().toString(36).slice(2,6),user_id:u.id,user_name:u.name,category,text,created:Date.now()})});
      if(!r.ok)throw new Error();toast('投稿しました');board();
    }catch{toast('投稿できませんでした')}
  };

  window.community=async function(){
    nav('community');
    main.innerHTML='<div class="card">読み込み中…</div>';
    const [cloud,likes]=await Promise.all([cloudBooks(),fetchLikes()]);const local=books().filter(b=>b.published),seen=new Set();const all=[...cloud,...local].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true});const counts={};likes.forEach(l=>counts[l.book_id]=(counts[l.book_id]||0)+1);
    main.innerHTML=`<div class="sectionline"><h2>みんなの本</h2><button class="mini" onclick="board()">💬 掲示板</button></div>${all.length?all.map(b=>`<div class="item"><span class="badge">${esc(b.genre||'物語')}</span><h3 onclick="openBook('${b.id}')">${esc(b.title)}</h3><div class="meta">${esc(b.summary||'')}</div><div class="row" style="margin-top:10px"><span class="meta">@${esc(b.author||'you')}</span><button class="likebtn" onclick="toggleLike('${b.id}')">♥ ${counts[b.id]||0}</button></div></div>`).join(''):`<div class="card"><b>まだ公開された本がありません。</b><div class="meta" style="margin-top:5px">最初の一冊を公開してみましょう。</div></div>`}${ad()}`;
  };

  const params=new URLSearchParams(location.search||'');
  if(!params.get('book'))setTimeout(()=>{const active=document.querySelector('.nav button.active')?.dataset.page;if(!active||active==='home')home()},0);
})();