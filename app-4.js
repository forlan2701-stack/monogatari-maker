async function openBook(id){
 const local=books().find(x=>x.id===id);
 if(local){showBook(id);return}
 try{
   main.innerHTML='<div class="card">読み込み中…</div>';
   const r=await fetch(`${SUPABASE_URL}/rest/v1/books?id=eq.${encodeURIComponent(id)}&published=eq.true&select=*`,{headers:{apikey:SUPABASE_KEY}});
   if(!r.ok) throw new Error('fetch');
   const d=await r.json();
   const x=Array.isArray(d)?d[0]:null;
   if(!x){toast('本が見つかりませんでした');community();return}
   const b={id:x.id,title:x.title,genre:x.genre,author:x.author_name||x.author_handle||'guest',likes:x.likes||0,shares:x.shares||0,summary:x.summary||'',chapters:Array.isArray(x.chapters)?x.chapters:[],published:true,created:x.created||Date.now()};
   showPublicBook(b);
 }catch{toast('本を読み込めませんでした');community()}
}
function showPublicBook(b){
 nav('community');
 main.innerHTML=`<div class="reader"><span class="badge">${esc(b.genre||'物語')}</span><h1>${esc(b.title||'無題の物語')}</h1><div class="meta">著者：@${esc(b.author||'guest')}</div><hr>${(b.chapters||[]).map(c=>`<h2>${esc(c.t||'')}</h2>${String(c.p||'').split('\\n\\n').map(p=>`<p>${esc(p)}</p>`).join('')}`).join('')}</div><div class="actions"><button class="secondary" onclick="toggleLike('${b.id}')">♥ いいね</button><button class="ghost" onclick="community()">みんなの本へ</button></div>`;
}
async function fetchLikes(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/likes?select=book_id,user_id,created`,{headers:{apikey:SUPABASE_KEY}});if(!r.ok)return[];const d=await r.json();return Array.isArray(d)?d:[]}catch{return[]}}
async function likedByMe(bookId){const u=user();if(!u)return false;try{const r=await fetch(`${SUPABASE_URL}/rest/v1/likes?book_id=eq.${encodeURIComponent(bookId)}&user_id=eq.${encodeURIComponent(u.id)}&select=book_id`,{headers:{apikey:SUPABASE_KEY}});if(!r.ok)return false;const d=await r.json();return Array.isArray(d)&&d.length>0}catch{return false}}
async function toggleLike(bookId){
 const u=user();if(!u){toast('先にアカウントを作ってください');account();return}
 const already=await likedByMe(bookId);
 try{if(already){await fetch(`${SUPABASE_URL}/rest/v1/likes?book_id=eq.${encodeURIComponent(bookId)}&user_id=eq.${encodeURIComponent(u.id)}`,{method:'DELETE',headers:{apikey:SUPABASE_KEY}});toast('いいねを取り消しました')}else{const r=await fetch(`${SUPABASE_URL}/rest/v1/likes`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({book_id:bookId,user_id:u.id,created:Date.now()})});if(!r.ok&&r.status!==409)throw new Error('like failed');toast('いいねしました ♥')}}catch{toast('いいねを保存できませんでした')}
 if(document.getElementById('rankroot'))ranking(currentRankMode||'weekly');else community();
}
let currentRankMode='weekly';
function scoreBooks(all,likes,mode){
 const now=new Date();const week=7*24*60*60*1000;const likeMap={};
 likes.forEach(l=>{const created=Number(l.created)||0;const d=new Date(created);if(mode==='weekly'&&(Date.now()-created)>week)return;if(mode==='today'&&!(d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth()&&d.getDate()===now.getDate()))return;likeMap[l.book_id]=(likeMap[l.book_id]||0)+1});
 return all.map(b=>({...b,realLikes:likeMap[b.id]||0})).sort((a,b)=>{if(mode==='new')return(b.created||0)-(a.created||0);return(b.realLikes-a.realLikes)||((b.created||0)-(a.created||0))});
}
async function community(){
 nav('community');main.innerHTML='<div class="card">読み込み中…</div>';
 const [cloud,likes]=await Promise.all([cloudBooks(),fetchLikes()]);const local=books().filter(b=>b.published),seen=new Set();const all=[...cloud,...local].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true});const counts={};likes.forEach(l=>counts[l.book_id]=(counts[l.book_id]||0)+1);
 main.innerHTML=`<div class="sectionline"><h2>みんなの本</h2></div>${all.length?all.map(b=>`<div class="item"><span class="badge">${esc(b.genre||'物語')}</span><h3 onclick="openBook('${b.id}')">${esc(b.title)}</h3><div class="meta">${esc(b.summary||'')}</div><div class="row" style="margin-top:10px"><span class="meta">@${esc(b.author||'you')}</span><button class="likebtn" onclick="toggleLike('${b.id}')">♥ ${counts[b.id]||0}</button></div></div>`).join(''):`<div class="card"><b>まだ公開された本がありません。</b><div class="meta" style="margin-top:5px">最初の一冊を公開してみましょう。</div></div>`}${ad()}`;
}
async function ranking(mode='today'){
 nav('ranking');currentRankMode=mode;main.innerHTML='<div class="card">読み込み中…</div>';
 const [cloud,likes]=await Promise.all([cloudBooks(),fetchLikes()]);const local=books().filter(b=>b.published),seen=new Set();const all=[...cloud,...local].filter(b=>{if(seen.has(b.id))return false;seen.add(b.id);return true});const ranked=scoreBooks(all,likes,mode);const labels={today:'今日',weekly:'週間',all:'総合',new:'新着'};
 main.innerHTML=`<div id="rankroot"><div class="sectionline"><h2>${labels[mode]}ランキング</h2></div><div class="ranktabs" style="grid-template-columns:repeat(4,1fr)"><button class="ranktab ${mode==='today'?'active':''}" onclick="ranking('today')">今日</button><button class="ranktab ${mode==='weekly'?'active':''}" onclick="ranking('weekly')">週間</button><button class="ranktab ${mode==='all'?'active':''}" onclick="ranking('all')">総合</button><button class="ranktab ${mode==='new'?'active':''}" onclick="ranking('new')">新着</button></div>${ranked.length?ranked.map((b,i)=>`<div class="rankitem"><div class="rankno">#${i+1}</div><div onclick="openBook('${b.id}')"><b>${esc(b.title)}</b><div class="meta">${esc(b.genre||'物語')} · @${esc(b.author||'you')}</div></div><button class="likebtn" onclick="toggleLike('${b.id}')">♥ ${b.realLikes||0}</button></div>`).join(''):`<div class="card"><b>まだランキング対象の本がありません。</b><div class="meta">本が公開されると、ここに並びます。</div></div>`}${ad()}</div>`;
}
function sample(id){const b=sampleBooks.find(x=>x.id===id);if(!b)return;main.innerHTML=`<div class="reader"><span class="badge">${b.genre}</span><h1>${b.title}</h1><div class="meta">@${b.author}</div><hr><p>${b.summary}</p><p>サンプル作品です。</p></div><button class="ghost wide" style="margin-top:12px" onclick="community()">戻る</button>`}
async function postComment(id){const t=document.getElementById('ct').value.trim(),u=user();if(!t)return;try{await fetch(`${SUPABASE_URL}/rest/v1/comments`,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json'},body:JSON.stringify({id:'c'+Date.now(),book_id:id,user_id:u.id,user_name:u.name,text:t,created:Date.now()})});toast('コメントしました')}catch{toast('コメントを保存できませんでした')}}
function account(){nav('account');const u=user();main.innerHTML=u?`<div class="card"><h2>アカウント</h2><div class="pill">👤 ${esc(u.name)}</div><div class="actions"><button class="secondary" onclick="plans()">料金プラン</button><button class="ghost" onclick="localStorage.removeItem('mm_user');account()">ログアウト</button></div></div>`:`<div class="card"><h2>名前を決めて始める</h2><input id="name" class="input" maxlength="20" placeholder="表示名"><button class="primary wide" style="margin-top:10px" onclick="signup()">はじめる</button></div>`}
function signup(){const n=document.getElementById('name').value.trim();if(!n)return;localStorage.setItem('mm_user',JSON.stringify({id:'u'+Date.now(),name:n}));toast('登録しました');home()}
function plans(){nav('account');main.innerHTML=`${creditbar()}<div class="card"><span class="badge">無料</span><h2>無料プラン</h2><div class="num">¥0</div><div class="meta">無料・物語モード / コメント / 公開 / ランキング / 広告あり</div></div><div class="card" style="margin-top:10px"><span class="badge">準備中</span><h2>ライトプラン</h2><div class="meta">広告なし・AI生成回数アップを予定。</div></div>${ad()}`}
function initApp(){const params=new URLSearchParams(location.search||'');const bid=params.get('book');if(bid)openBook(bid);else home()}
initApp();