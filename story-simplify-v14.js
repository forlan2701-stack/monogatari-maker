(function(){
  const STEP=[
    {k:'genre',q:'どんなジャンルにする？'},
    {k:'hero',q:'主人公はどんな人？'},
    {k:'theme',q:'物語の中心に置くものは？'},
    {k:'length',q:'どれくらいの長さにする？'}
  ];
  const ALL_HERO=['高校生','会社員','店主','探偵','旅人','人ではない存在','大学生','作家','図書館司書','料理人','配達員','医師','教師','ミュージシャン','弁護士','小学生'];
  const CORE={
    '忘れられない約束':['果たせなかった約束の相手が現れる','約束した場所だけが残っている','約束を守ると別の誰かを傷つける','二人が約束の内容を違って覚えている','亡くなった人から約束を知らせる物が届く','子どもの頃の約束を今の自分が引き受ける'],
    '秘密':['誰にも言えない過去が記録に残っている','一人だけ知らされていない家族の秘密','秘密を守るためにつかれた嘘が崩れる','公開すると誰かを救い誰かを傷つける秘密','長年隠された名前の意味を追う','自分自身について知らなかった事実が出る'],
    '再会':['絶交した友人と仕事で組む','初恋の相手と偶然再会する','失踪した人が別人のように戻る','昔のライバルと同じ目的を追う','家族と何年ぶりかに会う','再会した相手だけが過去を違って覚えている'],
    '挑戦':['一度失敗したことに再挑戦する','誰にも期待されていない役目に立候補する','期限のある大仕事を仲間とやり切る','苦手な相手と組まなければ成功できない','失敗すれば居場所を失う勝負に出る','成功の条件そのものを変えて挑む'],
    '家族':['家族が隠していた借金の理由を知る','家を手放すか家族で決める','疎遠な家族から突然連絡が来る','家族の中で一人だけ知らない過去がある','親の決めた進路に初めて反対する','きょうだいの失踪を家族で追う'],
    '一冊の本':['余白に知らない人の告白が残る本','自分の未来と同じ出来事が書かれた本','絶版の本を探す人の理由を追う','一冊の本を巡って二人の証言が食い違う','本の最後の一頁だけが切り取られている','誰かが自分のために選んだ一冊の意味を知る'],
    '手紙':['十年前に出された手紙が今届く','差出人のない手紙が毎週届く','出せなかった手紙を本人に渡す','同じ内容の手紙を二人が持っている','亡くなった人が残した最後の手紙','手紙の一文だけが別人の筆跡になっている'],
    '夢':['昔あきらめた夢に再び誘われる','夢を叶える期限を自分で決める','家族の夢と自分の夢がぶつかる','叶った夢が思っていた生活と違う','他人の夢を背負わされていると気づく','小さな形に変えて夢を続ける'],
    '居場所':['必要とされなければ居場所がないと思っている','閉鎖される場所を残す方法を探す','新しい町で一人だけ馴染めない','帰る場所と進みたい場所が違う','誰かに譲られた席を自分の場所にする','居場所だと思っていた集団から外される'],
    '失くしもの':['昔なくした物が今になって戻る','失くした物が誰かの秘密につながる','なくなった物を追ううち人の失踪に行き着く','大切な物をなくした日の記憶が間違っていた','探していた物はずっと身近な場所にあった','物ではなく失った時間を取り戻そうとする'],
    '嘘':['一つの嘘のために全員の証言がずれる','守るための嘘が本人を傷つけていた','自分が信じてきた説明そのものが嘘だった','嘘をついた人だけが真相を知らない','嘘だと思った言葉だけが本当だった','真実を言うと大切な関係が終わる'],
    '時間':['同じ一日を何度も繰り返す','十年前の出来事を現在の証拠で追う','残り時間が決められた中で選ぶ','未来から届いた記録の意味を確かめる','止まった時計だけが事件の時刻を示す','過去を変えずに現在の選択を変える'],
    '赦し':['傷つけた相手と再び協力する','謝罪されても元には戻れない','自分自身を許せず次へ進めない','許したふりをしてきた関係が崩れる','事情を知るほど怒りの形が変わる','赦さないまま前へ進む方法を選ぶ'],
    '別れ':['別れる日を自分たちで決める','閉店する場所で最後の一日を過ごす','去る人を引き止めるか見送るか選ぶ','終わった関係から届いた物を返す','別れを告げる前に一つだけやり残しがある','失踪ではなく別れだったと知る'],
    '始まり':['準備不足のまま新しい役目を始める','知らない土地で最初の一日を迎える','一度終わった場所を別の形で始め直す','二人で新しい約束を作る','名前のない仕事に自分で名前をつける','始めるために何か一つを終わらせる'],
    '願い':['願いが叶う代わりに代償が必要になる','自分と他人の願いが同時には叶わない','叶えたい願いが本当に自分のものか疑う','昔の願いが今になって叶いそうになる','願いを一つだけ選ばなければならない','願いを叶えないことを自分で選ぶ']
  };
  const DEFAULT={
    ミステリー:{place:'都会',mood:'不穏',ending:'謎が残る'},
    恋愛:{place:'都会',mood:'しっとり',ending:'幸せになる'},
    ファンタジー:{place:'異世界',mood:'わくわく',ending:'未来につながる'},
    青春:{place:'学校',mood:'爽やか',ending:'未来につながる'},
    ほっこり:{place:'商店街',mood:'あたたかい',ending:'希望が残る'},
    SF:{place:'遠い未来',mood:'考えさせる',ending:'静かな余韻'},
    ヒューマンドラマ:{place:'小さな町',mood:'静かな余韻',ending:'希望が残る'},
    冒険:{place:'異世界',mood:'わくわく',ending:'未来につながる'},
    不思議:{place:'古い書店',mood:'静かな余韻',ending:'謎が残る'},
    日常:{place:'小さな町',mood:'あたたかい',ending:'希望が残る'},
    歴史:{place:'小さな町',mood:'考えさせる',ending:'未来につながる'},
    ホラー:{place:'古いアパート',mood:'不穏',ending:'謎が残る'},
    ロードノベル:{place:'駅',mood:'爽やか',ending:'未来につながる'},
    お仕事:{place:'都会',mood:'前向き',ending:'再出発する'},
    家族:{place:'小さな町',mood:'あたたかい',ending:'希望が残る'},
    短編連作:{place:'小さな町',mood:'静かな余韻',ending:'未来につながる'}
  };
  const CORE_INDEX={
    ホラー:{'忘れられない約束':4,秘密:4,再会:2,挑戦:0,家族:3,'一冊の本':4,手紙:4,夢:3,居場所:5,失くしもの:2,嘘:2,時間:0,赦し:4,別れ:4,始まり:1,願い:0},
    ミステリー:{'忘れられない約束':3,秘密:0,再会:5,挑戦:0,家族:3,'一冊の本':3,手紙:5,夢:3,居場所:5,失くしもの:3,嘘:0,時間:4,赦し:4,別れ:5,始まり:1,願い:4},
    SF:{'忘れられない約束':4,秘密:5,再会:2,挑戦:0,家族:3,'一冊の本':1,手紙:0,夢:0,居場所:2,失くしもの:5,嘘:2,時間:3,赦し:5,別れ:2,始まり:1,願い:0},
    青春:{'忘れられない約束':0,秘密:0,再会:0,挑戦:0,家族:4,'一冊の本':5,手紙:2,夢:0,居場所:5,失くしもの:3,嘘:5,時間:2,赦し:0,別れ:2,始まり:0,願い:2},
    歴史:{'忘れられない約束':0,秘密:4,再会:2,挑戦:0,家族:3,'一冊の本':2,手紙:0,夢:0,居場所:0,失くしもの:1,嘘:2,時間:1,赦し:4,別れ:2,始まり:0,願い:1}
  };
  function placeFor(g,t){
    if(g==='ホラー')return ({再会:'駅',挑戦:'学校',家族:'古いアパート','一冊の本':'古い書店',手紙:'古いアパート',夢:'古いアパート',失くしもの:'古いアパート',時間:'古いアパート',別れ:'古いアパート',始まり:'古いアパート'}[t]||'古いアパート');
    if(g==='ミステリー')return ({'一冊の本':'図書館',手紙:'古い書店',失くしもの:'駅',家族:'小さな町'}[t]||'都会');
    if(g==='青春')return '学校';
    if(g==='SF')return '遠い未来';
    if(g==='歴史')return ({'一冊の本':'古い書店',手紙:'駅'}[t]||'小さな町');
    return DEFAULT[g]?.place||'小さな町';
  }
  function heroPool(g){if(g==='青春')return ['小学生','高校生','大学生'];if(g==='恋愛')return ALL_HERO.filter(x=>!['小学生','人ではない存在'].includes(x));if(g==='お仕事')return ALL_HERO.filter(x=>!['小学生','人ではない存在'].includes(x));return ALL_HERO}
  function applyAuto(){
    const a=state.ans,g=a.genre,t=a.theme;if(!g||!t)return;
    const d=DEFAULT[g]||DEFAULT.ヒューマンドラマ;
    a.place=placeFor(g,t);a.mood=d.mood;a.ending=d.ending;
    const list=CORE[t]||[];const idx=(CORE_INDEX[g]?.[t]??0)%Math.max(1,list.length);a.core=list[idx]||t;
  }
  function poolFor(k){if(k==='genre')return pools.genre;if(k==='hero')return heroPool(state.ans.genre);if(k==='theme')return pools.theme;if(k==='length')return pools.length;return[]}
  function resetAfter(k){const order=STEP.map(x=>x.k),i=order.indexOf(k);order.slice(i+1).forEach(x=>delete state.ans[x]);delete state.ans.place;delete state.ans.mood;delete state.ans.core;delete state.ans.ending;state.title='';state.heroName=''}
  const baseTitle=window.titlePage;
  const baseGenerate=window.generate;
  window.startCreate=function(){if(!user()){try{sessionStorage.setItem('mm_after_signup','create')}catch(e){};toast('先に表示名を決めてください');account();return}state={step:0,ans:{},options:{},unlock:{},title:'',heroName:''};renderQ()};
  window.choose=function(k,v){resetAfter(k);state.ans[k]=v;renderQ()};
  window.renderQ=function(){
    const q=STEP[state.step],full=poolFor(q.k);if(!state.options[q.k])state.options[q.k]=q.k==='length'?[...full]:shuffle(full).slice(0,6);
    let o=state.unlock[q.k]?[...full]:state.options[q.k].filter(x=>full.includes(x));if(!o.length)o=full.slice(0,6);
    const pct=Math.round(state.step/STEP.length*100);
    main.innerHTML=`<div class="question"><div class="progress"><div style="width:${pct}%"></div></div><div class="qnum">QUESTION ${state.step+1} / ${STEP.length}</div><h2>${q.q}</h2>${q.k==='genre'?'<div class="meta" style="margin-bottom:10px;line-height:1.7">質問は4つだけ。<br>舞台・出来事・読後感・結末は、ジャンルとテーマに合わせて自動で決めます。</div>':''}<div class="options">${o.map(x=>`<button class="option ${state.ans[q.k]===x?'active':''}" onclick="choose('${q.k}','${String(x).replaceAll("'","\\'")}')">${x}</button>`).join('')}</div><div class="actions"><button class="ghost" onclick="reroll()">別の候補を表示</button><button class="secondary" onclick="reward()" ${state.unlock[q.k]?'disabled':''}>全候補</button></div><div class="actions"><button class="ghost" onclick="backQ()" ${state.step===0?'disabled':''}>戻る</button><button class="primary" onclick="nextQ()" ${state.ans[q.k]?'':'disabled'}>${state.step===STEP.length-1?'タイトルへ':'次へ'}</button></div></div>`;
  };
  window.reroll=function(){const q=STEP[state.step],full=poolFor(q.k);state.options[q.k]=q.k==='length'?[...full]:shuffle(full).slice(0,6);if(state.ans[q.k]&&!state.options[q.k].includes(state.ans[q.k]))delete state.ans[q.k];renderQ()};
  window.reward=function(){const q=STEP[state.step];let s=5;main.innerHTML=`<div class="reward"><h2>全候補を開放</h2><div class="meta">試作版は5秒待機で再現しています。</div><div id="timer" class="timer">5</div><button class="ghost wide" onclick="renderQ()">戻る</button></div>`;const tm=setInterval(()=>{s--;const e=document.getElementById('timer');if(e)e.textContent=s;if(s<=0){clearInterval(tm);state.unlock[q.k]=true;renderQ()}},1000)};
  window.backQ=function(){if(state.step>0){state.step--;renderQ()}};
  window.nextQ=function(){const q=STEP[state.step];if(!state.ans[q.k])return;if(state.step<STEP.length-1){state.step++;renderQ()}else{applyAuto();titlePage()}};
  window.titlePage=function(){applyAuto();const r=baseTitle();setTimeout(()=>{const card=[...document.querySelectorAll('.card')].find(el=>(el.textContent||'').includes('今回の物語の設計'));if(card){const meta=card.querySelector('.meta:last-child');if(meta)meta.innerHTML=`舞台：${esc(state.ans.place)}（自動）<br>出来事：${esc(state.ans.core)}（自動）<br>読後感：${esc(state.ans.mood)}（自動）<br>長さ：${esc(state.ans.length)}<br>生成方式：4問シンプル版 v14`;}} ,0);return r};
  window.generate=function(){applyAuto();return baseGenerate()};
})();
