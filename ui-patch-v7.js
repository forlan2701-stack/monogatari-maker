(function(){
  const FEATURES=[
    {key:'ai_story',icon:'🤖',title:'生成AIで文章をもっと自然に',desc:'物語のつながり・会話・表現を、より自然で読みやすくする。'},
    {key:'ai_cover',icon:'🎨',title:'AIで表紙を作る',desc:'物語の内容や雰囲気に合わせて、毎回違う表紙を生成する。'},
    {key:'follow_author',icon:'⭐',title:'お気に入り作者・フォロー',desc:'好きな作者をフォローして、新作を見つけやすくする。'},
    {key:'theme_event',icon:'🏆',title:'お題イベント・創作コンテスト',desc:'同じお題でみんなが物語を作り、読んだり投票したりできる。'},
    {key:'edit_book',icon:'✏️',title:'作った本をあとから編集',desc:'タイトル・本文・章構成などを作成後にも直せるようにする。'},
    {key:'series',icon:'📚',title:'シリーズ作品をまとめる',desc:'続きものや連作をシリーズとして本棚にまとめられるようにする。'}
  ];

  function voterId(){
    let id=localStorage.getItem('mm_visitor_id');
    if(!id){id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);localStorage.setItem('mm_visitor_id',id)}
    return id;
  }

  async function fetchVotes(){
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/feature_votes?select=feature_key,voter_id`,{headers:{apikey:SUPABASE_KEY}});
      if(!r.ok)return[];
      const d=await r.json();return Array.isArray(d)?d:[];
    }catch{return[]}
  }

  function voteCardHtml(votes){
    const me=voterId();
    const mine=new Set(votes.filter(v=>v.voter_id===me).map(v=>v.feature_key));
    const counts={};votes.forEach(v=>counts[v.feature_key]=(counts[v.feature_key]||0)+1);
    const top=Math.max(0,...FEATURES.map(f=>counts[f.key]||0));
    return `<section id="featureVoteCard" class="card" style="margin-top:12px">
      <div class="sectionline" style="margin:0 0 8px"><h2>🗳️ 欲しい機能投票</h2><span class="badge">開発中</span></div>
      <div class="meta" style="line-height:1.7;margin-bottom:10px">「これが欲しい！」と思う機能に投票してください。複数選べます。みなさんの声を今後の開発の参考にします。</div>
      <div style="display:grid;gap:9px">
        ${FEATURES.map(f=>{const c=counts[f.key]||0,v=mine.has(f.key),isTop=top>0&&c===top;return `<div style="border:1px solid var(--line,#eadfd4);border-radius:14px;padding:11px;background:#fffdfb">
          <div style="display:flex;gap:9px;align-items:flex-start"><div style="font-size:22px">${f.icon}</div><div style="flex:1"><div style="font-weight:900">${f.title}${isTop?'<span class="badge" style="margin-left:6px">人気</span>':''}</div><div class="meta" style="margin-top:4px;line-height:1.55">${f.desc}</div></div></div>
          <div class="row" style="margin-top:9px;align-items:center"><span class="meta">${c}票</span><button class="${v?'secondary':'ghost'}" style="padding:8px 11px" onclick="toggleFeatureVote('${f.key}')">${v?'✓ 投票済み':'♡ 欲しい！'}</button></div>
        </div>`}).join('')}
      </div>
      <button class="ghost wide" style="margin-top:10px" onclick="board()">ほかのアイデアを掲示板に書く</button>
    </section>`;
  }

  async function insertFeatureVote(){
    if(!document.querySelector('.homehero'))return;
    const votes=await fetchVotes();
    document.getElementById('featureVoteCard')?.remove();
    const beta=[...document.querySelectorAll('.card')].find(x=>x.textContent.includes('BETA / テスト版'));
    const anchor=beta||document.querySelector('.homehero');
    anchor.insertAdjacentHTML('afterend',voteCardHtml(votes));
  }

  window.toggleFeatureVote=async function(key){
    const me=voterId();
    try{
      const q=`feature_key=eq.${encodeURIComponent(key)}&voter_id=eq.${encodeURIComponent(me)}`;
      const chk=await fetch(`${SUPABASE_URL}/rest/v1/feature_votes?${q}&select=feature_key`,{headers:{apikey:SUPABASE_KEY}});
      const rows=chk.ok?await chk.json():[];
      if(Array.isArray(rows)&&rows.length){
        const r=await fetch(`${SUPABASE_URL}/rest/v1/feature_votes?${q}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY}});
        if(!r.ok)throw new Error();
        toast('投票を取り消しました');
      }else{
        const r=await fetch(`${SUPABASE_URL}/rest/v1/feature_votes`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({feature_key:key,voter_id:me,created:Date.now()})});
        if(!r.ok&&r.status!==409)throw new Error();
        toast('投票しました！');
      }
      await insertFeatureVote();
    }catch{toast('投票を保存できませんでした')}
  };

  const previousHome=window.home;
  window.home=async function(){
    await previousHome();
    await insertFeatureVote();
  };

  setTimeout(()=>{if(document.querySelector('.homehero'))insertFeatureVote()},250);
})();