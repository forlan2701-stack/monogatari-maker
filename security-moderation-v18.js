(function(){
  const REASONS=['不適切な内容','嫌がらせ・誹謗中傷','個人情報','スパム','著作権・その他'];

  function localReporterId(){
    const u=typeof user==='function'?user():null;
    if(u&&u.id)return String(u.id);
    let id='';
    try{id=localStorage.getItem('mm_visitor_id')||''}catch(e){}
    if(!id){
      id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('mm_visitor_id',id)}catch(e){}
    }
    return id;
  }

  function closeReport(){document.getElementById('mmReportModal')?.remove()}
  window.mmCloseReport=closeReport;

  window.reportContent=function(type,id){
    const key=`mm_reported_${type}_${id}`;
    try{if(localStorage.getItem(key)){toast('この内容はすでに通報済みです');return}}catch(e){}
    closeReport();
    const modal=document.createElement('div');
    modal.id='mmReportModal';
    modal.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(28,24,21,.48);display:flex;align-items:flex-end;justify-content:center;padding:14px';
    modal.innerHTML=`<div style="width:min(100%,520px);background:#fff;border-radius:18px;padding:17px;box-shadow:0 20px 60px rgba(0,0,0,.24)">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><h3 style="margin:0">この内容を通報</h3><button class="mini" onclick="mmCloseReport()">閉じる</button></div>
      <div class="meta" style="margin:8px 0 12px;line-height:1.7">問題があると思う理由を選んでください。通報した人の情報は公開されません。</div>
      <select id="mmReportReason" class="input">${REASONS.map(x=>`<option>${x}</option>`).join('')}</select>
      <textarea id="mmReportDetail" class="input" maxlength="300" rows="4" style="margin-top:9px" placeholder="補足があれば入力（300文字まで）"></textarea>
      <button class="primary wide" style="margin-top:10px" onclick="mmSubmitReport('${String(type).replaceAll("'","\\'")}','${String(id).replaceAll("'","\\'")}')">通報する</button>
    </div>`;
    modal.addEventListener('click',e=>{if(e.target===modal)closeReport()});
    document.body.appendChild(modal);
  };

  window.mmSubmitReport=async function(type,id){
    const reason=document.getElementById('mmReportReason')?.value||REASONS[0];
    const detail=(document.getElementById('mmReportDetail')?.value||'').trim().slice(0,300);
    const reporter=localReporterId();
    const key=`mm_reported_${type}_${id}`;
    const payload={
      id:'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,9),
      target_type:type,
      target_id:String(id).slice(0,120),
      reporter_id:reporter.slice(0,120),
      reason,
      detail,
      created:Date.now(),
      status:'open'
    };
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/reports`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload)});
      if(!r.ok)throw new Error(await r.text().catch(()=>String(r.status)));
      try{localStorage.setItem(key,'1')}catch(e){}
      closeReport();toast('通報を受け付けました');
    }catch(e){console.error('report failed',e);toast('通報を送信できませんでした')}
  };

  function reportButton(type,id){
    const b=document.createElement('button');
    b.className='mini mm-report-btn';
    b.type='button';
    b.textContent='⚑ 通報';
    b.style.cssText='margin-left:auto;opacity:.78';
    b.onclick=e=>{e.stopPropagation();reportContent(type,id)};
    return b;
  }

  function idFromOpenBook(el){
    const s=el?.getAttribute?.('onclick')||'';
    const m=s.match(/openBook\('([^']+)'\)/);
    return m?m[1]:'';
  }

  function attachBookReportButtons(){
    document.querySelectorAll('.item').forEach(item=>{
      if(item.querySelector('.mm-report-btn'))return;
      const opener=[...item.querySelectorAll('[onclick]')].find(x=>(x.getAttribute('onclick')||'').includes('openBook('));
      const id=idFromOpenBook(opener);if(!id)return;
      let row=item.querySelector('.row');
      if(!row){row=document.createElement('div');row.className='row';row.style.marginTop='9px';item.appendChild(row)}
      row.appendChild(reportButton('book',id));
    });
    document.querySelectorAll('.rankitem').forEach(item=>{
      if(item.querySelector('.mm-report-btn'))return;
      const opener=[...item.querySelectorAll('[onclick]')].find(x=>(x.getAttribute('onclick')||'').includes('openBook('));
      const id=idFromOpenBook(opener);if(!id)return;
      item.appendChild(reportButton('book',id));
    });
  }

  async function attachBoardReports(){
    const items=[...document.querySelectorAll('.item')];if(!items.length)return;
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/board_posts?select=id&order=created.desc&limit=50`,{headers:{apikey:SUPABASE_KEY}});
      if(!r.ok)return;
      const posts=await r.json();
      items.forEach((item,i)=>{
        const id=posts?.[i]?.id;if(!id||item.querySelector('.mm-report-btn'))return;
        const row=document.createElement('div');row.className='row';row.style.cssText='margin-top:8px;justify-content:flex-end';row.appendChild(reportButton('board',id));item.appendChild(row);
      });
    }catch(e){}
  }

  const prevPublicBook=window.showPublicBook;
  if(typeof prevPublicBook==='function')window.showPublicBook=function(b){
    prevPublicBook(b);
    const actions=document.querySelector('.actions');
    if(actions&&b?.id&&!actions.querySelector('.mm-report-btn'))actions.appendChild(reportButton('book',b.id));
  };

  const prevCommunity=window.community;
  if(typeof prevCommunity==='function')window.community=async function(){await prevCommunity();attachBookReportButtons()};

  const prevRanking=window.ranking;
  if(typeof prevRanking==='function')window.ranking=async function(mode){await prevRanking(mode);attachBookReportButtons()};

  const prevBoard=window.board;
  if(typeof prevBoard==='function')window.board=async function(){await prevBoard();await attachBoardReports()};

  window.safetyGuide=function(){
    if(typeof nav==='function')nav('account');
    main.innerHTML=`<div class="sectionline"><h2>安全・利用ルール</h2><button class="mini" onclick="home()">ホームへ</button></div>
      <div class="card"><b>公開するときのルール</b><div class="meta" style="margin-top:7px;line-height:1.8">嫌がらせ・誹謗中傷、他人の個人情報、違法な内容、スパム、権利を侵害する投稿はしないでください。問題がある投稿は、確認のうえ非表示・削除などの対応を行う場合があります。</div></div>
      <div class="card" style="margin-top:10px"><b>通報について</b><div class="meta" style="margin-top:7px;line-height:1.8">公開作品や掲示板には「通報」ボタンがあります。通報内容と通報者の識別情報は一般公開されません。同じ内容への重複通報は、この端末では抑制します。</div></div>
      <div class="card" style="margin-top:10px"><b>プライバシー</b><div class="meta" style="margin-top:7px;line-height:1.8">表示名・公開した作品・掲示板投稿・コメントは公開されます。アクセス数の集計には、ブラウザに保存したランダムな識別子とアクセス日時を利用します。氏名・住所・電話番号などの個人情報は投稿しないでください。</div></div>
      <div class="card" style="margin-top:10px"><b>β版について</b><div class="meta" style="margin-top:7px;line-height:1.8">現在はテスト版です。機能や仕様を変更することがあります。困ったことがあれば、掲示板または灯雨文庫のXからお知らせください。</div><a href="https://x.com/akariame_bunko" target="_blank" rel="noopener" class="secondary" style="display:block;text-decoration:none;text-align:center;margin-top:10px">Xで連絡する →</a></div>`;
  };

  function addSafetyLink(){
    if(!document.querySelector('.homehero')||document.getElementById('mmSafetyLink'))return;
    const foot=document.querySelector('.creditfoot');if(!foot)return;
    const box=document.createElement('div');box.id='mmSafetyLink';box.className='card';box.style.cssText='margin-top:14px;text-align:center';
    box.innerHTML='<button class="ghost wide" onclick="safetyGuide()">利用ルール・プライバシー・通報について</button>';
    foot.insertAdjacentElement('beforebegin',box);
  }

  const prevHome=window.home;
  if(typeof prevHome==='function')window.home=async function(){await prevHome();addSafetyLink()};

  // 公開済み作品を匿名クライアントから上書きしない。公開は新規INSERTだけにする。
  window.publishBook=async function(id){
    const all=books(),idx=all.findIndex(x=>x.id===id);if(idx<0)return;
    const b=all[idx],u=typeof user==='function'?user():null;
    if(b.published){toast('この本は公開済みです');return}
    const btn=document.getElementById('publishBtn'),status=document.getElementById('publishStatus');
    if(btn){btn.disabled=true;btn.textContent='公開しています…'}if(status)status.textContent='サーバーに保存しています。';
    const payload={
      id:String(b.id||'').slice(0,120),title:String(b.title||'無題の物語').slice(0,120),genre:b.genre||'物語',
      author_id:String(b.authorId||u?.id||'local').slice(0,100),author_name:String(b.author||u?.name||'guest').slice(0,40),author_handle:String(b.author||u?.name||'guest').slice(0,40),
      likes:0,shares:0,summary:String(b.summary||'').slice(0,500),answers:b.answers||{},chapters:b.chapters||[],created:Number(b.created)||Date.now(),published:true
    };
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/books`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify(payload)});
      if(!r.ok)throw new Error(await r.text().catch(()=>String(r.status)));
      b.published=true;all[idx]=b;saveBooks(all);toast('みんなに公開しました');showBook(id);
    }catch(e){console.error('publish failed',e);if(btn){btn.disabled=false;btn.textContent='もう一度公開する'}if(status)status.textContent='公開できませんでした。通信状態を確認して、もう一度押してください。';toast('公開できませんでした')}
  };

  setTimeout(()=>{addSafetyLink();attachBookReportButtons()},0);
})();