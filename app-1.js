const SUPABASE_URL="https://egwscecfsdmqqhxwswhl.supabase.co";
const SUPABASE_KEY="sb_publishable_npjOY3inVJ5w6DPFZWPRqw_bCOXiOWU";
const main=document.getElementById('main');
const sampleBooks=[
{id:'s1',title:'雨の日だけ開く書店',genre:'ほっこり',author:'sora',likes:428,shares:93,summary:'雨の日にだけ現れる小さな書店。そこには、今の自分に必要な一冊が並んでいる。'},
{id:'s2',title:'最後のホームで待っている',genre:'青春',author:'mio',likes:361,shares:71,summary:'廃線になる駅で、十年前の約束を待ち続ける二人の物語。'},
{id:'s3',title:'月面喫茶の忘れもの',genre:'SF',author:'ren',likes:287,shares:54,summary:'月の喫茶店に残された一冊の日記から始まる小さな謎。'}];
const pools={genre:['ミステリー','恋愛','ファンタジー','青春','ほっこり','SF','ヒューマンドラマ','冒険','不思議','日常','歴史','ホラー','ロードノベル','お仕事','家族','短編連作'],mood:['あたたかい','泣ける','ゾクッとする','爽やか','考えさせる','笑える','静かな余韻','やさしい','切ない','前向き','懐かしい','不穏','希望がある','胸が熱くなる','しっとり','わくわく'],hero:['高校生','会社員','店主','探偵','旅人','人ではない存在','大学生','作家','図書館司書','料理人','配達員','医師','教師','ミュージシャン','弁護士','小学生'],place:['小さな町','都会','学校','古い書店','海辺','遠い未来','図書館','雨の街','山あいの村','古いアパート','商店街','島','喫茶店','病院','駅','異世界'],theme:['忘れられない約束','秘密','再会','挑戦','家族','一冊の本','手紙','夢','居場所','失くしもの','嘘','時間','赦し','別れ','始まり','願い'],ending:['希望が残る','大逆転','少し切ない','謎が残る','幸せになる','静かな余韻','再出発する','少し笑える','未来につながる','ほろ苦い'],length:['ショートショート','短編','中編']};
const qs=[{k:'genre',q:'どんなジャンルの本にする？'},{k:'mood',q:'読後感はどんな感じがいい？'},{k:'hero',q:'主人公はどんな人？'},{k:'place',q:'物語の舞台は？'},{k:'theme',q:'物語の中心に置きたいものは？'},{k:'ending',q:'最後はどう終わってほしい？'},{k:'length',q:'今回はどれくらいの長さにする？'}];
let state={step:0,ans:{},options:{},unlock:{}};
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pick(a){return a[Math.floor(Math.random()*a.length)]}
function books(){try{const v=JSON.parse(localStorage.getItem('mm_books')||'[]');return Array.isArray(v)?v:[]}catch{return[]}}
function saveBooks(v){localStorage.setItem('mm_books',JSON.stringify(v))}
function user(){try{return JSON.parse(localStorage.getItem('mm_user')||'null')}catch{return null}}
function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),1500)}
function nav(p){document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===p))}
function go(p){nav(p);if(p==='home')home();if(p==='create')startCreate();if(p==='community')community();if(p==='ranking')ranking();if(p==='mine')mine();if(p==='account')account()}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.page));
function credits(){let s={date:new Date().toDateString(),used:0,bonus:0};try{s={...s,...JSON.parse(localStorage.getItem('mm_money')||'{}')}}catch{}if(s.date!==new Date().toDateString()){s.date=new Date().toDateString();s.used=0;localStorage.setItem('mm_money',JSON.stringify(s))}return Math.max(0,1-s.used)+(s.bonus||0)}
function creditbar(){return `<div class="credit"><div><div class="meta">低コストAI</div><div class="pill">✦ 残り ${credits()} クレジット</div></div><button class="mini" onclick="plans()">料金プラン</button></div>`}
function ad(){return `<div class="ad">ADVERTISEMENT<br>AdSense接続後に広告が表示されます</div>`}
async function home(){
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
 const newest=scoreBooks(actual,likes,'new').slice(0,3);
 const totalLikes=likes.length.toLocaleString();
 main.innerHTML=`${creditbar()}
 <section class="homehero">
  <div class="eyebrow">📚 STORY APP</div>
  <h1 class="titlefit">📚 ものがたりメーカー</h1>
  <p>答えるだけで、あなたの物語が一冊の本になります。できた本は公開して、みんなに読んでもらえます。</p>
  <div class="chips"><span class="chip">📖 本ができる</span><span class="chip">🌐 共有できる</span><span class="chip">🏆 ランキング</span><span class="chip">📣 SNS共有</span></div>
  <button class="primary wide" onclick="go('create')">新しい本をつくる</button>
  <div class="steps">
   <div class="step"><b>1. 質問に答える</b><div>候補は毎回ランダム。広告を見ると全候補から選べます。</div></div>
   <div class="step"><b>2. しっかり読める物語ができる</b><div>ショートショート・短編・中編で文章量も変わります。</div></div>
   <div class="step"><b>3. 公開して読まれる</b><div>いいね・ランキング・コメント・SNS共有につながります。</div></div>
  </div>
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
   ${homeRankBox('✨ 新着ランキング','new',newest)}
 </div>
 ${ad()}
 <div class="sectionline"><h2>みんなの本</h2><button class="mini" onclick="go('community')">もっと見る</button></div>
 ${actual.length?bookItem(actual[0]):bookItem(sampleBooks[0])}
 <div class="creditfoot"><b>Presented by 灯雨文庫</b>読書と創作をつなぐ、小さな物語の場所。</div>`;
}
function homeRankBox(label,mode,items){
 return `<div class="homerank">
   <div class="homerankhead" onclick="ranking('${mode}')"><b>${label}</b><span class="meta">もっと見る ›</span></div>
   ${items.length?items.map((b,i)=>`<div class="homerankrow" onclick="openBook('${b.id}')">
      <span class="homerankno">#${i+1}</span>
      <div><b>${esc(b.title)}</b><div class="meta">${esc(b.genre||'物語')} · @${esc(b.author||'guest')}</div></div>
      <span class="meta">${mode==='new'?'NEW':'♥ '+(b.realLikes||0)}</span>
   </div>`).join(''):`<div class="meta" style="padding:10px 0">まだランキング対象の本がありません。</div>`}
 </div>`;
}
function bookItem(b){
 return `<div class="item clickcard" onclick="${String(b.id).startsWith('s')?`sample('${b.id}')`:`openBook('${b.id}')`}">
   <span class="badge">${esc(b.genre||'物語')}</span>
   <h3>${esc(b.title||'無題の物語')}</h3>
   <div class="meta">${esc(b.summary||'')}</div>
   <div class="row" style="margin-top:9px"><span class="meta">@${esc(b.author||'you')}</span><span class="meta">♥ ${b.realLikes??b.likes??0}</span></div>
 </div>`;
}
function startCreate(){if(!user()){toast('先にアカウントを作ってください');account();return}state={step:0,ans:{},options:{},unlock:{}};renderQ()}
function opts(q){if(state.unlock[q.k])return pools[q.k];if(!state.options[q.k])state.options[q.k]=q.k==='length'?[...pools[q.k]]:shuffle(pools[q.k]).slice(0,6);return state.options[q.k]}
function renderQ(){const q=qs[state.step],o=opts(q),pct=Math.round(state.step/qs.length*100);main.innerHTML=`<div class="question"><div class="progress"><div style="width:${pct}%"></div></div><div class="qnum">QUESTION ${state.step+1} / ${qs.length}</div><h2>${q.q}</h2><div class="helper"><span>🎲 ランダム候補</span>${state.unlock[q.k]?'<span>📚 全候補開放中</span>':''}</div><div class="options">${o.map(x=>`<button class="option ${state.ans[q.k]===x?'active':''}" onclick="choose('${q.k}','${x.replaceAll("'","\\'")}')">${x}</button>`).join('')}</div><div class="actions"><button class="ghost" onclick="reroll()">候補を入れ替える</button><button class="secondary" onclick="reward()" ${state.unlock[q.k]?'disabled':''}>広告で全候補</button></div><div class="actions"><button class="ghost" onclick="backQ()" ${state.step===0?'disabled':''}>戻る</button><button class="primary" onclick="nextQ()" ${state.ans[q.k]?'':'disabled'}>${state.step===qs.length-1?'タイトルへ':'次へ'}</button></div></div>`}
function choose(k,v){state.ans[k]=v;renderQ()}
function reroll(){const q=qs[state.step];state.options[q.k]=q.k==='length'?[...pools[q.k]]:shuffle(pools[q.k]).slice(0,6);if(state.ans[q.k]&&!state.options[q.k].includes(state.ans[q.k]))delete state.ans[q.k];renderQ()}
function reward(){const q=qs[state.step];let s=5;main.innerHTML=`<div class="reward"><h2>広告を見て全候補を開放</h2><div class="meta">試作版は5秒待機で再現しています。</div><div id="timer" class="timer">5</div><button class="ghost wide" onclick="renderQ()">戻る</button></div>`;const t=setInterval(()=>{s--;const e=document.getElementById('timer');if(e)e.textContent=s;if(s<=0){clearInterval(t);state.unlock[q.k]=true;toast('全候補を開放しました');renderQ()}},1000)}
function backQ(){if(state.step>0){state.step--;renderQ()}}
function nextQ(){const q=qs[state.step];if(!state.ans[q.k])return;if(state.step<qs.length-1){state.step++;renderQ()}else titlePage()}
