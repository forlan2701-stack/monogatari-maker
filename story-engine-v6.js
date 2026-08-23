(function(){
  const NAMES=['蒼','凛','紬','湊','澪','朔','奏','灯','遥','凪','蓮','結衣','美月','真帆','圭','栞','陸','奈緒','航','梓','理央','千景','宗一','悠人','玲','冬馬','啓介','志乃','朝陽','伊織','颯太','七海','琴葉','柚葉','慧','律','陽菜','咲良','樹','直人','透','紗季','和真','茜','瑞希','颯','優斗','葵','楓','朱里','海斗','由奈','誠','沙耶','晴人','杏','響','翼','香澄','新','真琴','修一','澄江','悠','佳奈','拓海','恵','亮','千尋'];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const para=(...x)=>x.filter(Boolean).join('\n\n');
  const safe=v=>typeof esc==='function'?esc(v):String(v??'');
  const previousGenerate=window.generate;
  const previousTitlePage=window.titlePage;

  function heroCandidate(){
    const role=state?.ans?.hero;
    const pools={高校生:['蓮','澪','美月','奏','七海','陽菜'],大学生:['紬','陸','伊織','凛','湊','由奈'],会社員:['悠人','真帆','直人','奈緒','和真','茜','晴人'],店主:['千景','志乃','宗一','香澄','透'],探偵:['朔','玲','冬馬','慧','透'],旅人:['凪','遥','湊','翼','新'],作家:['灯','啓介','栞','紗季','響']};
    return pick(pools[role]||NAMES);
  }

  function heroIntro(a,h){
    if(a.place==='異世界'){
      if(a.hero==='会社員')return `元の世界で会社員だった${h}が異世界に迷い込んで半年。今は王都の地図工房で働きながら、帰る方法を探していた。`;
      if(a.hero==='高校生')return `放課後に開いた見知らぬ扉を抜け、${h}が異世界へ来てから三日目だった。制服の上から旅装を借りていた。`;
      if(a.hero==='大学生')return `遺跡の写真を見ていたはずの${h}は、気づけば写真と同じ石門の前に立っていた。異世界へ来て二週間になる。`;
      return `${h}は異世界の辺境都市で暮らしていた。城壁の外には、地図にない土地がまだいくつも残っていた。`;
    }
    return `${h}は${a.place||'町'}で暮らしていた。いつもの日常が続くはずだった。`;
  }

  function themeSeed(theme,h,key){
    const m={
      赦し:{symbol:'欠けた銀の徽章',past:`数年前の遠征で${key}が${h}を置き去りにしたと思っている`,question:'許すことは、元の関係に戻ることと同じなのか'},
      家族:{symbol:'家紋の入った古い鍵',past:'家族にだけ知らせず決められたことがある',question:'守るための秘密は、本当に相手のためなのか'},
      秘密:{symbol:'封蝋された地図',past:`${key}が何かを隠している`,question:'秘密を暴くことと、真実を知ることは同じなのか'},
      再会:{symbol:'片方だけの方位石',past:`長く会っていなかった${key}と再び向き合う`,question:'昔の続きを始めるのか、今から別の関係を作るのか'},
      挑戦:{symbol:'折れた登山杖',past:'一度失敗した道へもう一度進む',question:'失敗を避けることと、前へ進むことは両立するのか'},
      夢:{symbol:'星を描いた古い地図',past:'諦めた夢をもう一度口にする',question:'夢を持ち続けることに期限はあるのか'},
      嘘:{symbol:'二重に刻印された通行証',past:`${key}の言葉のどこまでが本当か分からない`,question:'嘘をついた理由まで知れば、受け止め方は変わるのか'},
      別れ:{symbol:'返せなかった指輪',past:'別れを先延ばしにしてきた',question:'終わらせることは、捨てることなのか'},
      願い:{symbol:'青白く光る願い石',past:'願いが叶えば誰かが代わりに失うかもしれない',question:'叶える価値のある願いは誰が決めるのか'},
      時間:{symbol:'逆向きに進む砂時計',past:'取り戻せない時間に答えを求め続けている',question:'過去を変えられなくても、意味は変えられるのか'},
      居場所:{symbol:'空欄のままの宿帳',past:'自分がここにいてよいのか確信を持てない',question:'居場所は与えられるものか、自分で作るものか'},
      手紙:{symbol:'雨に濡れた手紙',past:'届かなかった言葉の意味を確かめたい',question:'遅れて届いた言葉に、今から返事をしてよいのか'},
      '一冊の本':{symbol:'余白だらけの古い本',past:'他人の言葉に自分だけが強く反応してしまう',question:'他人の言葉を、自分の答えとして使ってよいのか'}
    };
    return m[theme]||{symbol:'古い印章',past:`「${theme}」について決着をつけられずにいる`,question:`「${theme}」を抱えたままでも先へ進めるのか`};
  }

  function adventureChapters(a,h,n){
    const [ally,key,witness]=n,seed=themeSeed(a.theme,h,key);
    const realm=a.place==='異世界'?'王都ラウネ':a.place;
    const c=[];
    c.push({t:'第一章　閉ざされた北門',p:para(
      heroIntro(a,h),
      `${realm}では三日後に「灰の嵐」が来ると騒ぎになっていた。嵐が来れば、街へ水を送る山上の導水路が一週間は止まる。修理に必要な《青星石》は、封鎖された北の遺跡にしかない。`,
      `依頼を持ってきたのは旅の仲間の${ally}だった。地図の端には${seed.symbol}が留められていた。${h}はそれを見た瞬間、${seed.past}ことを思い出した。`,
      `さらに厄介なことに、遺跡までの旧道を知る案内人として名前が挙がったのは${key}だった。${h}は断ろうとしたが、街の貯水槽に残る水は四日分しかなかった。`,
      `「好き嫌いで選べる仕事じゃない」。${ally}の言葉に、${h}は北門の通行証へ署名した。目的は一つ。嵐が来る前に青星石を持ち帰ることだった。`
    )});
    c.push({t:'第二章　風喰いの谷',p:para(
      `翌朝、${h}、${ally}、${key}の三人は北門を出た。最初の難所は、音に反応して突風が吹く「風喰いの谷」だった。大声を出せば足場ごと吹き飛ばされるため、合図は指だけで送らなければならない。`,
      `${key}は先頭を歩き、石壁の亀裂を三度指した。そこだけ風が弱い。悔しいが、道の読みは正確だった。`,
      `谷の途中で荷車の綱が切れ、青星石を運ぶための空箱が斜面へ滑った。${h}が飛びつこうとした瞬間、${key}が腕をつかんだ。「箱は作り直せる。お前まで落ちる必要はない」`,
      `その言葉は、過去に聞きたかった言葉に似ていた。だからこそ${h}は素直に受け取れなかった。`,
      `夜営で巡礼者の${witness}に会った。${witness}は数年前の遠征記録を持っており、「あの崩落の日、${key}は一人で逃げたわけではない」とだけ告げた。`
    )});
    c.push({t:'第三章　崩れた石橋',p:para(
      `三日目、遺跡手前の石橋は半分崩れていた。残った梁を渡るには、二人が反対側から綱を張る必要がある。${h}と${key}が別々の岸へ立つことになった。`,
      `綱を結びながら、${h}はついに聞いた。「あの日も、こうやって理由を言わずに決めたよね」`,
      `${key}は手を止めた。過去の崩落で${h}を置いて走ったのは、谷底に落ちた子どもを助けるためだったという。だが戻った時には隊は撤退し、その後は責められるのが怖くて連絡を断った。`,
      `${h}はすぐには納得しなかった。理由があっても、黙って消えたことまで消えるわけではない。${key}も「それは俺が悪かった」と認めた。`,
      `橋の中央で梁が軋んだ。議論を続ける時間はない。${h}は${key}の結んだ綱を一度だけ強く引き、体重を預けた。信じ切ったのではない。今、この一本の綱だけを信じると決めた。`
    )});
    c.push({t:'第四章　赦しの門',p:para(
      `遺跡の最深部には、青星石を収めた円形の扉があった。扉には二つの窪みがあり、その形は${seed.symbol}の割れた両端と一致していた。`,
      `${key}が自分の持っていた片割れを差し出した。過去の遠征で拾い、そのまま返せずにいたものだった。${h}の片割れと合わせると、扉の文字が青く浮かんだ。`,
      `刻まれていたのは「同じ道を歩く者だけが開ける」ではなく、「違う答えのまま、同じ門を押せる者に開く」という一文だった。`,
      `${h}は${seed.question}と考えた。答えはまだ出ない。ただ、元通りになることと、今必要な協力を選ぶことは別だと思えた。`,
      `二人で扉を押すと青星石が姿を現した。その直後、灰の嵐の前触れが遺跡を揺らした。三人は石を背負い、地下水路から脱出した。`
    )});
    c.push({t:'第五章　帰還路',p:para(
      `街へ戻ったのは、灰の嵐が城壁へ届く半日前だった。青星石が導水炉へ据えられると、止まりかけていた水車がゆっくり回り始めた。`,
      `${h}は報酬を受け取ったあと、${key}へ${seed.symbol}を返そうとした。${key}は首を振った。「片方は持っていてくれ。勝手に答えを決めないために」`,
      `${h}は連絡先を消さなかったが、昔のように戻ろうとも言わなかった。次に一緒に旅をするかは、その時に決めればいい。`,
      `夜、城壁の上から見る荒野は、来た時より少しだけ広く見えた。${a.theme}について結論が出たからではない。結論を急がなくても、足を止めずに進めると知ったからだった。`
    )});
    c.push({t:'第六章　新しい地図',p:para(
      `一週間後、北門の掲示板には新しい地図が貼られた。風喰いの谷の安全な足場、崩れた石橋、地下水路の出口まで細かく記されている。最後に書き足したのは${h}だった。`,
      `${ally}が横から覗き込み、「次は南？」と笑った。${h}は即答せず、地図の余白を指でなぞった。`,
      `まだ知らない道がある。行くかどうかは、自分で決められる。`
    )});
    c.push({t:'終章　未開封の依頼状',p:para(
      `数か月後、${h}の手元には新しい依頼状が届いた。差出人の欄には${key}の名前があった。`,
      `封を切る前に、${h}は一度だけ窓の外を見た。返事はまだ決めていない。それでも、紙を捨てることはしなかった。`
    )});
    return c;
  }

  function makeAdventure(){
    const a=state.ans,u=user();
    if(!u){toast('先に表示名を決めてください');account();return}
    const h=(state.heroName||heroCandidate()).trim()||heroCandidate();
    state.heroName=h;
    const n=shuffle(NAMES.filter(x=>x!==h)).slice(0,3);
    const all=adventureChapters(a,h,n);
    const chapters=a.length==='ショートショート'?[all[0],all[1],all[3],all[4]]:(a.length==='中編'?all:all.slice(0,6));
    const title=(document.getElementById('title')?.value||state.title||'').trim()||`${a.place}の北門`;
    const b={id:'b'+Date.now(),title,genre:a.genre,author:u.name,authorId:u.id,likes:0,shares:0,summary:`${a.genre}／${a.place}／テーマ「${a.theme}」。${h}が青星石を求めて危険な旧道を進み、過去の関係にも向き合う物語。`,answers:{...a,heroName:h},chapters,created:Date.now(),published:false,coverSeed:Math.random(),coverStyle:Math.floor(Math.random()*4)};
    const saved=books();saved.unshift(b);saveBooks(saved);showBook(b.id);
  }

  window.mmChooseAdventureTitle=function(t){state.title=t;window.titlePage()};
  window.titlePage=function(){
    const a=state.ans;
    if(!['冒険','ファンタジー','ロードノベル'].includes(a.genre))return previousTitlePage();
    if(!state.heroName)state.heroName=heroCandidate();
    const candidates=[`${a.place}の北門`,`灰の嵐が来る前に`,`${a.theme}の門を越えて`,`${state.heroName}と風喰いの谷`,`青星石を運ぶ夜`];
    if(!state.title)state.title=candidates[0];
    main.innerHTML=`<div class="question"><div class="qnum">FINAL STEP</div><h2>主人公の名前と、本のタイトルを決めます。</h2><div class="card" style="margin-bottom:14px"><div class="meta">今回の設定</div><b>${safe(a.genre)} ／ ${safe(a.mood)} ／ テーマ「${safe(a.theme)}」</b><div class="meta">${safe(a.hero)}・${safe(a.place)}・${safe(a.length)}</div></div><div class="titleedit"><div class="meta" style="margin-bottom:6px">主人公の名前</div><input id="heroName" class="input" maxlength="16" value="${safe(state.heroName)}" oninput="state.heroName=this.value" placeholder="好きな名前を入力"><button class="ghost wide" style="margin-top:8px" onclick="state.heroName='${pick(NAMES)}';titlePage()">別の名前候補を表示</button></div><div class="titleflow" style="margin-top:18px"><div class="flow"><b>タイトル候補</b><div class="meta">冒険の内容に合う候補を出しています。</div></div></div><div class="titlechoices">${candidates.map(t=>`<button class="titlechoice ${state.title===t?'active':''}" onclick="mmChooseAdventureTitle('${t.replaceAll("'","\\'")}')">${safe(t)}</button>`).join('')}</div><div class="titleedit"><div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div><input id="title" class="input" value="${safe(state.title)}" oninput="state.title=this.value" placeholder="好きなタイトルを入力"></div><button class="primary wide" style="margin-top:14px" onclick="generate()">この設定で本を作る</button><button class="ghost wide" style="margin-top:8px" onclick="state.step=qs.length-1;renderQ()">前の質問に戻る</button></div>`;
  };

  window.generate=function(){
    if(['冒険','ファンタジー','ロードノベル'].includes(state?.ans?.genre))return makeAdventure();
    return previousGenerate();
  };
})();