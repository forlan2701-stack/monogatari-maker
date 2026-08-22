function titlePage(){
 const a=state.ans;
 const candidates=[
   `${a.theme}のある${a.place}`,
   `${a.place}で、${a.hero}は待っている`,
   `${a.theme}を忘れる前に`
 ];
 if(!state.title) state.title=candidates[0];
 main.innerHTML=`<div class="question">
   <div class="qnum">FINAL STEP</div>
   <h2>最後に、本のタイトルを決めます。</h2>
   <div class="titleflow">
     <div class="flow"><b>① 候補から選ぶ</b><div class="meta">気に入ったタイトルをタップします。</div></div>
     <div class="flow"><b>② 好きなように直す</b><div class="meta">下の入力欄で自由に変更できます。</div></div>
     <div class="flow"><b>③ 本を作る</b><div class="meta">タイトルが決まったら、そのまま作成します。</div></div>
   </div>
   <div class="titlechoices">
     ${candidates.map(t=>`<button class="titlechoice ${state.title===t?'active':''}" onclick="selectTitle('${t.replaceAll("'","\\'")}')">${esc(t)}</button>`).join('')}
   </div>
   <div class="titleedit">
     <div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div>
     <input id="title" class="input" value="${esc(state.title)}" oninput="state.title=this.value" placeholder="好きなタイトルを入力">
   </div>
   <button class="primary wide" style="margin-top:14px" onclick="generate()">このタイトルで本を作る</button>
   <button class="ghost wide" style="margin-top:8px" onclick="state.step=qs.length-1;renderQ()">前の質問に戻る</button>
 </div>`;
}
function selectTitle(t){state.title=t;titlePage()}
function generate(){
 const a=state.ans,u=user();
 const hero=pick({高校生:['澪','蓮','美月'],会社員:['悠人','真帆','直樹'],店主:['千景','宗一','志乃'],探偵:['冬馬','玲','朔'],旅人:['凪','遥','湊'],大学生:['奏','紬','陸'],作家:['灯','啓介','栞'],図書館司書:['栞','理央','梓'],料理人:['湊','奈緒','航']}[a.hero]||['灯','朔','澪']);
 const ally=pick(['幼なじみの結衣','古書店主の志乃','無口な同級生の圭','旅先で会った真帆','少し年上の朝倉','近所に住む美月']);
 const genreKit={
  ミステリー:{trigger:['存在しないはずの人物から手紙が届いた','古い日記から一ページだけ消えていた','毎晩同じ時刻にだけ灯る部屋を見つけた'],clue:['青いしおり','書き直された一行','古い鍵','写真の端の影'],truth:['事件は誰かを陥れるためではなく、ある人を守るために仕組まれていた','最初の手がかりだけが本物で、残りは意図的に作られていた','消えた人物は自分の意思で姿を隠していた']},
  恋愛:{trigger:['十年前に書かれた未送信の手紙を見つけた','もう会わないはずの人と再会した','名前のない花束が届くようになった'],clue:['昔だけ使っていた呼び名','一度だけ交わした約束','消せなかったメッセージ'],truth:['離れた理由は嫌いになったからではなかった','二人とも同じ約束を忘れられずにいた','伝わらなかった言葉が別の形で残されていた']},
  ファンタジー:{trigger:['昨日までなかった扉が現れた','夜だけ言葉を話す本を見つけた','地図にない道が伸びていた'],clue:['銀色の鍵','消えない星印','夜明け前だけ光る石'],truth:['不思議な場所は願いを叶える場所ではなく、選択を試す場所だった','探していたものは魔法ではなく、ずっと避けていた決断だった','案内役は過去の自分が残した存在だった']},
  SF:{trigger:['明日の日付のメッセージを受け取った','一時間だけ時間が巻き戻った','存在しない利用者の記録が端末に現れた'],clue:['未来の自分しか知らない暗号','一秒だけずれる時計','削除できないログ'],truth:['未来からの情報は警告ではなく選択を託すためのものだった','変えるべきなのは出来事そのものではなく主人公の判断だった','未来を変えた原因は最初の小さな選択だった']},
  青春:{trigger:['卒業までに叶えたいことを書いたノートを拾った','誰も使わなくなった部室の鍵を見つけた','昔の仲間が残した録音を聞いた'],clue:['途中で止まった目標リスト','消されなかった名前','録音の最後の一言'],truth:['取り戻したかったのは結果ではなく一緒に挑戦した時間だった','離れていた仲間も同じ後悔を抱えていた','一人の夢だと思っていたものがみんなの夢になっていた']},
  ほっこり:{trigger:['宛名のない小包が届いた','毎週同じ曜日にだけ置かれる手紙を見つけた','忘れ物を届ける小さな箱を見つけた'],clue:['丁寧に包まれたお菓子','同じ色の便箋','短いお礼の言葉'],truth:['小さな贈り物は言えなかった感謝の代わりだった','送り主は昔受けた親切を返したかっただけだった','誰かの優しさが知らないうちに別の人へ受け継がれていた']}
 };
 const kit=genreKit[a.genre]||genreKit.青春;
 const trigger=pick(kit.trigger),clue=pick(kit.clue),truth=pick(kit.truth);
 const trait=pick(['人に頼るのが苦手だった','傷つくのが怖くて本音を隠しがちだった','正しい答えを探しすぎる癖があった','誰かのためなら自分のことを後回しにしてしまった']);
 const sensory=pick(['窓ガラスが風に小さく鳴っていた','濡れたアスファルトの匂いが残っていた','遠くで電車の音が一度だけ響いた','冷えた空気にコーヒーの匂いが混じっていた']);
 const symbol=pick(['古い時計','白い傘','青いしおり','銀色の鍵','赤いノート']);
 const moodLine={あたたかい:'胸の奥に、小さな灯りがともるような気がした。',泣ける:'言葉にしようとすると、先に喉の奥が痛くなった。',爽やか:'息を吸うと、昨日より空気が軽く感じられた。',切ない:'手に入らないものほど、輪郭だけが鮮明だった。',笑える:'深刻な顔をしていた二人は、同時に同じ勘違いに気づいて吹き出した。'}[a.mood]||'答えを急がなくてもいいのかもしれない、と初めて思えた。';
 const c1=[`${a.place}の夕暮れは、いつもより少しだけ静かだった。${sensory}。${hero}は${trait}ため、その日も誰にも頼らず帰ろうとしていた。`,`${hero}には、「${a.theme}」について、ずっと心の奥に引っかかっていることがあった。考えないふりをすれば日常は続く。だからこそ、終わらないまま残っていた。`,`その日、${hero}は${trigger}。最初は偶然だと思った。けれど、そこには${clue}が残されていた。`,`手に取るべきではない気がした。それでも視線を外せなかった。見覚えがあるわけではないのに、自分に向けられたものだと分かってしまったからだ。`,`そこへ${ally}が現れた。「それ、放っておけないんじゃない？」。軽い口調だったが、目は笑っていなかった。`,`${hero}は「大したことじゃない」と答えた。けれど、帰り道の途中で三度も${clue}を確かめた。家に着くころには、もう調べると決めていた。`,`${moodLine}`];
 const c2=[`翌日、${hero}と${ally}は最初の手がかりを追った。ところが、話を聞く人によって記憶が少しずつ食い違っていた。`,`誰かが嘘をついている、と決めつけるのは簡単だった。けれど、話している本人たちはどこか本気で、自分の記憶を信じているように見えた。`,`「どうしてそこまで気にするの？」と${ally}が聞いた。${hero}はすぐに答えられなかった。`,`やがて、${a.theme}について自分が避けてきたことを、途切れ途切れに話した。言葉にするほど、忘れたつもりだった場面が細部まで戻ってきた。`,`${ally}は最後まで口を挟まずに聞いたあと、「答えを知ることより、知ったあとにどうするかの方が怖いんだろ」と言った。`,`腹が立つほど図星だった。${hero}は反論する代わりに、もう一度${clue}を見た。そこには、昨日は気づかなかった小さな印があった。`,`その印は、${a.place}の別の場所を示していた。二人は日が落ちる前にそこへ向かった。`];
 const c3=[`たどり着いた場所には、探していた人ではなく、古い記録だけが残っていた。`,`記録を一つずつ確かめるうち、${hero}は自分が長い間ひとつの前提を疑っていなかったことに気づいた。`,`そして最後の一行で、すべての見え方が変わった。${truth}。`,`怒り、悲しさ、安堵が同時に押し寄せた。どれか一つなら扱えたかもしれない。混ざった感情は、名前を付けることさえ難しかった。`,`${ally}は何も急かさなかった。沈黙のあと、${hero}は「これで終わり、じゃないんだね」と言った。`,`真実を知ることと、それを自分の人生にどう置くかは別の話だった。${hero}は初めて、自分の答えを自分で決めなければならないと分かった。`,`「自分で決めるよ」。声は思ったより落ち着いていた。${ally}は小さくうなずいた。`];
 const c4=[`数日後、${a.place}にはいつもの時間が戻っていた。けれど${hero}の中では、まだ終わっていないことがあった。`,`${hero}は関係した人を一人ずつ訪ねた。責めるためではなく、これまで聞けなかった言葉を聞くためだった。`,`話してみると、誰も完全な悪人でも完全な善人でもなかった。それぞれが自分なりの正しさと弱さを抱えていた。`,`以前なら、その曖昧さに苛立ったかもしれない。今は、割り切れないものを抱えたままでも人は次の選択をできるのだと思えた。`,`${symbol}はもう手がかりではなかった。過去へ引き戻す物ではなく、自分が一度立ち止まり、そこから進んだ証になっていた。`,`帰り道、${ally}が「少し顔が変わった」と言った。${hero}は笑って「それ、褒めてる？」と聞き返した。`,`二人の間に流れた短い笑い声が、これまでの重さを少しだけほどいた。`];
 const c5=[`季節が少し進んだころ、${hero}は再び${a.place}を訪れた。`,`あの日と同じ道、同じ建物、同じ空の色。それでも、見えるものは少しずつ違っていた。`,`${ally}が隣で「結局、答えは出た？」と聞いた。`,`${hero}はしばらく考えてから、「全部じゃない。でも、それでいい」と答えた。`,`「${a.theme}」は、きれいに終わらせるものではなく、持ち方を変えていくものなのかもしれない。`,`ポケットの中で${symbol}が小さく触れた。以前ほど重くは感じなかった。`,ending(a.ending,hero,symbol)];
 let sets;
 if(a.length==='ショートショート'){sets=[[c1[0],c1[1],c1[2],c1[4],c2[2],c2[5],c3[2],c3[4],c3[6],ending(a.ending,hero,symbol)]]}else if(a.length==='中編'){sets=[c1,c2,c3,c4,c5]}else{sets=[c1,c2,c3]}
 const names=['第一章　始まりの合図','第二章　食い違う記憶','第三章　自分で選ぶ答え','第四章　言えなかったこと','第五章　これから'];
 const chapters=sets.map((p,i)=>({t:names[i],p:p.join('\n\n')}));
 const title=(document.getElementById('title')?.value||state.title||'').trim()||'無題の物語';
 const b={id:'b'+Date.now(),title,genre:a.genre,author:u.name,authorId:u.id,likes:0,shares:0,summary:`${a.place}で起きた小さな出来事から、${hero}が「${a.theme}」と向き合い、自分の答えを選ぶ${a.genre}。`,answers:a,chapters,created:Date.now(),published:false,coverSeed:Math.random(),coverStyle:Math.floor(Math.random()*4)};
 const all=books();all.unshift(b);saveBooks(all);showBook(b.id);
}
function ending(e,h,c){return ({'希望が残る':`${h}は${c}をしまい、まだ薄暗い道を歩き出した。すべては戻らない。それでも、続きを選ぶことはできる。`,'大逆転':`${h}は最後の一行を読み、最初から思い違いをしていたと気づいた。`,'少し切ない':`答えは見つかった。けれど過去は戻らない。${h}は${c}を握りしめ、今度こそさよならを言った。`,'謎が残る':`翌朝、机の上に見覚えのない${c}が置かれていた。「まだ、ひとつ残っている」。`,'幸せになる':`${h}が欲しかったのは完璧な答えではなく、もう一度ちゃんと話す機会だった。`,'静かな余韻':`${h}は振り返らずに歩いた。${c}の重さだけが、今日の出来事が夢ではなかったと教えていた。`}[e]||`${h}は前を向いて歩き出した。`)}
function getBookShareUrl(b){const base=location.origin&&location.origin!=='null'?`${location.origin}${location.pathname}`:location.href.split('?')[0];return b.published?`${base}?book=${encodeURIComponent(b.id)}`:base}
function buildShareText(b){const url=getBookShareUrl(b);return `本を作りました📚\n\n『${b.title}』\nジャンル：${b.genre}\n${b.summary||''}\n\nものがたりメーカーで作成しました。\n${b.published?'読めます👇':'アプリはこちら👇'}\n${url}\n\n#ものがたりメーカー #灯雨文庫`}
async function copyShareText(bid){const b=books().find(x=>x.id===bid);if(!b)return;const text=buildShareText(b);try{await navigator.clipboard.writeText(text);toast('SNS用テキストをコピーしました')}catch{toast('コピーできませんでした')}}
async function shareBook(bid){const b=books().find(x=>x.id===bid);if(!b)return;const text=buildShareText(b);const url=getBookShareUrl(b);try{if(navigator.share){await navigator.share({title:b.title,text,url})}else{await copyShareText(bid)}}catch(e){}}
function sharePanel(b){return `<div class="sharebox"><h3>SNSで共有しよう</h3><div class="meta" style="margin-bottom:8px">本を作ったら、SNSでみんなに知らせよう。</div><div class="sharepreview">${esc(buildShareText(b))}</div><div class="actions"><button class="secondary" onclick="shareBook('${b.id}')">SNSで共有</button><button class="ghost" onclick="copyShareText('${b.id}')">テンプレをコピー</button></div><div class="covernote">${b.published?'公開済みなので、この本へのリンクも入ります。':'まだ未公開なので、まず「みんなに公開」すると本のリンクも付けられます。'}</div></div>`}
