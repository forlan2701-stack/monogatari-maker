function saveBookBack(b){
 const all=books();
 const idx=all.findIndex(x=>x.id===b.id);
 if(idx>=0){all[idx]=b;saveBooks(all)}
}
function rerollCover(id){
 const b=books().find(x=>x.id===id);
 if(!b)return;
 b.coverSeed=Math.random();
 b.coverStyle=Math.floor(Math.random()*4);
 saveBookBack(b);
 drawCover(b);
 toast('表紙を作り直しました');
}
function saveCoverImage(){
 const canvas=document.getElementById('cover');
 if(!canvas)return;
 const link=document.createElement('a');
 link.href=canvas.toDataURL('image/png');
 link.download='monogatari_cover.png';
 link.click();
}
function showBook(id){
 const b=books().find(x=>x.id===id);
 if(!b)return;
 nav('mine');
 main.innerHTML=`<div class="reader">
   <span class="badge">${esc(b.genre)}</span>
   <h1>${esc(b.title)}</h1>
   <div class="meta">著者：@${esc(b.author)}</div>
   <hr>
   ${(b.chapters||[]).map(c=>`<h2>${esc(c.t)}</h2>${String(c.p||'').split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}`).join('')}
 </div>
 <div class="actions">
   <button id="publishBtn" type="button" class="secondary publishbtn" onclick="publishBook('${b.id}')">${b.published?'公開済み ✓':'みんなに公開'}</button>
   <button type="button" class="ghost" onclick="mine()">本棚へ</button>
 </div>
 <div id="publishStatus" class="publishstatus">${b.published?'この本は「みんなの本」とランキングの対象です。':'公開すると、みんなの本・ランキングに表示されます。'}</div>
 <div class="coverbox"><h3>本の表紙</h3><canvas id="cover" width="1000" height="1500"></canvas><div class="covernote">より本の表紙らしいデザインにしています。</div></div>
 ${sharePanel(b)}
 ${b.published?`<div class="comments"><h3>コメント</h3><textarea id="ct" class="input" rows="3" placeholder="感想を書く"></textarea><button class="primary wide" style="margin-top:8px" onclick="postComment('${b.id}')">コメントする</button></div>`:''}`;
 setTimeout(()=>drawCover(b),20);
}
function drawCover(b){
 const c=document.getElementById('cover');
 if(!c)return;
 if(b.coverSeed==null) b.coverSeed=Math.random();
 if(b.coverStyle==null) b.coverStyle=Math.floor(Math.random()*4);
 saveBookBack(b);
 const x=c.getContext('2d');
 x.clearRect(0,0,1000,1500);
 const paletteMap={
  ミステリー:[['#1f2430','#4a5873'],['#32233f','#6f5b8b']],
  恋愛:[['#7b4058','#d291ab'],['#8f5a67','#e0b0be']],
  SF:[['#1f3e59','#4f88b4'],['#17304d','#2d6d96']],
  青春:[['#36608c','#9dc0e6'],['#2f6682','#7eb2cb']],
  ファンタジー:[['#4a345d','#9270b3'],['#5b3d52','#b48dbf']],
  ほっこり:[['#8e644a','#d8b49a'],['#7c6a45','#c9b38e']],
  ホラー:[['#26232b','#5a4f5a'],['#222222','#5e303b']]
 };
 const palettes=paletteMap[b.genre]||[['#6c5246','#cfab90'],['#5e5a73','#b4adc9']];
 const pal=palettes[Math.floor((b.coverSeed*10)%palettes.length)];
 const [a1,a2]=pal;
 const style=(b.coverStyle||0)%4;
 const author=b.author||'灯雨文庫';
 const genre=b.genre||'物語';
 const summary=(b.summary||'あなたの答えから生まれた一冊。').slice(0,72);
 function wrapText(font,text,max){x.font=font;return wrap(x,text,max)}
 const titleLines=wrapText(style===1?'700 84px serif':style===2?'700 84px serif':'700 78px serif',b.title,style===1?500:(style===2?620:600)).slice(0,4);
 const summaryLines=wrapText('500 28px sans-serif',summary,600).slice(0,3);
 function gradientBg(){const g=x.createLinearGradient(0,0,1000,1500);g.addColorStop(0,a1);g.addColorStop(1,a2);x.fillStyle='#efe7de';x.fillRect(0,0,1000,1500);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(72,72,856,1360);x.fillStyle=g;x.fillRect(56,56,856,1360)}
 function dust(){for(let i=0;i<42;i++){x.fillStyle='rgba(255,255,255,'+(Math.random()*0.10+0.03)+')';x.beginPath();x.arc(120+Math.random()*730,120+Math.random()*1200,Math.random()*3+1,0,Math.PI*2);x.fill()}}
 function labelTop(txt){x.fillStyle='rgba(255,255,255,.92)';x.font='700 34px sans-serif';x.fillText(txt,126,150)}
 if(style===0){
   gradientBg();x.strokeStyle='rgba(255,255,255,.28)';x.lineWidth=3;x.strokeRect(110,110,748,1240);x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=1.5;x.strokeRect(124,124,720,1212);dust();labelTop('ものがたりメーカー');
   x.fillStyle='rgba(255,255,255,.96)';x.font='700 78px serif';const startY=490-((titleLines.length-1)*54);titleLines.forEach((l,i)=>x.fillText(l,130,startY+i*110));
   x.fillStyle='rgba(255,255,255,.88)';x.font='500 28px sans-serif';summaryLines.forEach((l,i)=>x.fillText(l,130,980+i*40));
   x.fillStyle='rgba(255,255,255,.96)';x.font='700 34px sans-serif';x.fillText('灯雨文庫',130,1245);x.font='500 26px sans-serif';x.fillText(genre,130,1285);x.font='700 34px sans-serif';x.fillText(author,130,1338);
 }else if(style===1){
   gradientBg();x.fillStyle='rgba(255,255,255,.14)';x.fillRect(110,110,748,220);x.fillRect(110,1060,748,230);x.strokeStyle='rgba(255,255,255,.4)';x.lineWidth=2;x.strokeRect(110,110,748,1180);x.strokeStyle='rgba(255,255,255,.75)';x.lineWidth=4;x.beginPath();x.moveTo(510,390);x.lineTo(560,450);x.lineTo(510,510);x.lineTo(460,450);x.closePath();x.stroke();x.beginPath();x.arc(510,450,80,0,Math.PI*2);x.stroke();
   x.fillStyle='rgba(255,255,255,.95)';x.font='700 30px sans-serif';x.fillText('TOUU BUNKO',130,170);x.fillText('MONOGATARI MAKER',130,230);x.fillStyle='rgba(255,255,255,.98)';x.font='700 84px serif';const startY=710-((titleLines.length-1)*56);titleLines.forEach((l,i)=>x.fillText(l,150,startY+i*108));x.fillStyle='rgba(255,255,255,.88)';x.font='500 28px sans-serif';summaryLines.forEach((l,i)=>x.fillText(l,150,1115+i*38));x.font='700 38px sans-serif';x.fillText(author,150,1260);x.font='500 24px sans-serif';x.fillText(genre,150,1160);
 }else if(style===2){
   gradientBg();x.fillStyle='rgba(255,255,255,.94)';x.fillRect(100,160,800,140);x.fillStyle='rgba(255,255,255,.12)';x.fillRect(100,330,800,860);x.fillStyle='rgba(255,255,255,.94)';x.fillRect(100,1200,800,120);x.fillStyle=a1;x.font='700 34px sans-serif';x.fillText('ものがたりメーカー',130,245);x.fillStyle='rgba(255,255,255,.96)';x.font='700 84px serif';const startY=560-((titleLines.length-1)*56);titleLines.forEach((l,i)=>x.fillText(l,130,startY+i*104));x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=3;x.beginPath();x.moveTo(690,520);x.quadraticCurveTo(810,640,730,840);x.stroke();x.beginPath();x.arc(665,480,40,0,Math.PI*2);x.stroke();x.beginPath();x.moveTo(620,870);x.lineTo(800,870);x.stroke();x.fillStyle='rgba(255,255,255,.90)';x.font='500 28px sans-serif';summaryLines.forEach((l,i)=>x.fillText(l,130,1010+i*40));x.fillStyle=a1;x.font='700 34px sans-serif';x.fillText(author,130,1275);x.font='500 26px sans-serif';x.fillText('灯雨文庫 / '+genre,480,1275);
 }else{
   gradientBg();x.fillStyle='rgba(255,255,255,.1)';x.beginPath();x.arc(730,370,180,0,Math.PI*2);x.fill();x.beginPath();x.arc(240,1040,130,0,Math.PI*2);x.fill();x.strokeStyle='rgba(255,255,255,.32)';x.lineWidth=2;x.strokeRect(112,112,746,1246);labelTop('灯雨文庫');x.fillStyle='rgba(255,255,255,.96)';x.font='700 82px serif';const startY=520-((titleLines.length-1)*54);titleLines.forEach((l,i)=>x.fillText(l,126,startY+i*108));x.fillStyle='rgba(255,255,255,.80)';x.font='500 24px sans-serif';x.fillText('A story generated from your answers',126,940);x.fillStyle='rgba(255,255,255,.90)';x.font='500 28px sans-serif';summaryLines.forEach((l,i)=>x.fillText(l,126,1010+i*40));x.fillStyle='rgba(255,255,255,.95)';x.font='700 36px sans-serif';x.fillText(author,126,1240);x.font='500 26px sans-serif';x.fillText(genre,126,1280);x.fillText('MONOGATARI MAKER',126,1330);
 }
}
function wrap(ctx,t,w){let o=[],l='';for(const ch of String(t)){if(ctx.measureText(l+ch).width>w&&l){o.push(l);l=ch}else l+=ch}if(l)o.push(l);return o}
async function publishBook(id){
 const all=books(),idx=all.findIndex(x=>x.id===id);if(idx<0)return;const b=all[idx];const btn=document.getElementById('publishBtn');const status=document.getElementById('publishStatus');if(btn){btn.disabled=true;btn.textContent='公開しています…'}if(status)status.textContent='サーバーに保存しています。';
 try{const url=`${SUPABASE_URL}/rest/v1/books?on_conflict=id`;const r=await fetch(url,{method:'POST',headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:b.id,title:b.title,genre:b.genre,author_id:b.authorId,author_name:b.author,author_handle:b.author,likes:0,shares:b.shares||0,summary:b.summary,answers:b.answers||{},chapters:b.chapters||[],created:b.created,published:true})});if(!r.ok){const detail=await r.text().catch(()=>String(r.status));throw new Error(detail||String(r.status))}b.published=true;all[idx]=b;saveBooks(all);toast('みんなに公開しました');showBook(id)}catch(err){console.error('publish failed',err);if(btn){btn.disabled=false;btn.textContent='もう一度公開する'}if(status)status.textContent='公開できませんでした。通信状態を確認して、もう一度押してください。';toast('公開できませんでした')}
}
function mine(){nav('mine');const all=books();main.innerHTML=`<div class="sectionline"><h2>マイ本棚</h2><button class="mini" onclick="go('create')">＋新しい本</button></div>${all.length?`<div class="bookgrid">${all.map(b=>`<div class="booktile" onclick="showBook('${b.id}')"><div class="bookcover"><span>${esc(b.genre)}</span><b>${esc(b.title)}</b><span>${b.published?'公開中':'非公開'}</span></div><div class="meta">${new Date(b.created).toLocaleDateString('ja-JP')}</div></div>`).join('')}</div>`:'<div class="card">まだ本がありません。</div>'}`}
async function cloudBooks(){try{const r=await fetch(`${SUPABASE_URL}/rest/v1/books?published=eq.true&select=*&order=created.desc&limit=50`,{headers:{apikey:SUPABASE_KEY}});if(!r.ok)return[];const d=await r.json();return Array.isArray(d)?d.map(x=>({id:x.id,title:x.title,genre:x.genre,author:x.author_name,likes:x.likes||0,shares:x.shares||0,summary:x.summary||'',chapters:x.chapters||[],published:true,created:x.created||Date.now()})):[]}catch{return[]}}
