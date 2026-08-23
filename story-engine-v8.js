(function(){
  const PREV_TITLE=window.titlePage;
  const PREV_GENERATE=window.generate;
  const PREV_RENDER=window.renderQ;
  const PREV_CHOOSE=window.choose;
  const SKIP=new Set(['冒険','ファンタジー','ロードノベル']);
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const safe=v=>typeof esc==='function'?esc(v):String(v??'');
  const para=(...xs)=>xs.filter(Boolean).join('\n\n');
  const NAMES=['蒼','凛','紬','湊','澪','朔','奏','灯','遥','凪','蓮','結衣','美月','真帆','圭','栞','陸','奈緒','航','梓','理央','千景','宗一','悠人','玲','冬馬','啓介','志乃','朝陽','伊織','颯太','七海','琴葉','柚葉','慧','律','陽菜','咲良','樹','直人','透','紗季','和真','茜','瑞希','颯','優斗','葵','楓','朱里','海斗','由奈','誠','沙耶','晴人','杏','響','翼','香澄','新','真琴','修一','澄江','悠','佳奈','拓海','恵','亮','千尋'];

  const CORE_OPTIONS={
    '忘れられない約束':['果たせなかった約束の相手が現れる','約束した場所だけが残っている','約束を守ると別の誰かを傷つける','そもそも約束の内容を二人が違って覚えている','死んだはずの人から約束を知らせる物が届く','子どもの頃の約束を今の自分が引き受ける'],
    '秘密':['誰にも言えない過去が記録に残っている','一人だけ知らされていない家族の秘密','秘密を守るためにつかれた嘘が崩れる','公開すると誰かを救い、誰かを傷つける秘密','長年隠された名前の意味を追う','自分自身について知らなかった事実が出る'],
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

  if(typeof qs!=='undefined' && !qs.some(q=>q.k==='core')){
    const idx=qs.findIndex(q=>q.k==='theme');
    qs.splice(idx>=0?idx+1:5,0,{k:'core',q:'そのテーマを、どんな出来事として描く？'});
  }
  if(typeof pools!=='undefined' && !pools.core)pools.core=[];

  window.renderQ=function(){
    const q=qs[state.step];
    if(q&&q.k==='core'){
      pools.core=CORE_OPTIONS[state.ans.theme]||['そのテーマが物語の中心になる出来事'];
      if(state.options.core && !state.options.core.every(x=>pools.core.includes(x)))delete state.options.core;
      if(state.ans.core && !pools.core.includes(state.ans.core))delete state.ans.core;
    }
    return PREV_RENDER();
  };

  window.choose=function(k,v){
    if(k==='theme' && state.ans.theme!==v){delete state.ans.core;delete state.options.core}
    return PREV_CHOOSE(k,v);
  };

  function heroName(){return (state.heroName||pick(NAMES)).trim()||pick(NAMES)}
  function names(h){return shuffle(NAMES.filter(n=>n!==h)).slice(0,6)}
  function relation(role,name){const m={高校生:`同級生の${name}`,大学生:`同じゼミの${name}`,会社員:`同僚の${name}`,店主:`常連客の${name}`,探偵:`助手の${name}`,旅人:`旅先で知り合った${name}`,作家:`担当編集の${name}`,図書館司書:`同僚の${name}`,料理人:`厨房で働く${name}`,配達員:`同僚の${name}`,医師:`同じ病院の${name}`,教師:`同僚の${name}`,ミュージシャン:`バンド仲間の${name}`,弁護士:`事務所の同僚${name}`,小学生:`同級生の${name}`};return m[role]||`知人の${name}`}

  function lostMystery(a,h,n){
    const [ally,suspect,witness,owner]=n;
    const core=a.core||CORE_OPTIONS['失くしもの'][0];
    const rel=relation(a.hero,ally);
    const place=a.place||'町';
    let x;
    if(core.includes('人の失踪'))x={
      object:'八年前に失くしたフィルムカメラ',
      hook:`${place}の喫茶店で、${h}は八年前に失くしたはずのフィルムカメラを見つけた。落とし物箱に入ったのは三日前。しかも中には未現像のフィルムが残っていた。`,
      question:'誰が八年間持っていたのか。そして、なぜ今ここへ戻したのか。',
      clue1:`現像した最後の一枚には、八年前に姿を消した${suspect}が古い駅のコインロッカーを開ける姿が写っていた。写真の時計は18時12分。`,
      falseLead:`${h}は、${suspect}がカメラを持ち去ってそのまま失踪したのだと思う。`,
      clue2:`だがフィルムの通し番号を調べると、その写真は${h}が最後に撮った一枚より前だった。つまりカメラは、${suspect}が消える前から別の誰かの手に渡っていた。`,
      reveal:`${witness}が持っていた当時の駅員日誌から、ロッカーを開けた人物は${suspect}ではなく、よく似た上着を着た${owner}だったと判明する。${owner}は失踪の事情を知り、カメラだけを預かっていた。`,
      climax:`閉鎖前夜の旧駅でロッカーを開けると、中には${suspect}が残した転居先の古い住所と「勝手に消えたと思わせてごめん」という短い紙片があった。`,
      resolve:`失くしていたのはカメラだけではなかった。${h}は八年間、確かめる機会まで失くしたままにしていた。翌朝、その古い住所の先を調べ始めた。`,
      titles:['八年前のカメラ','最後の一枚','18時12分','閉鎖前夜のロッカー','消えた人の住所']
    };
    else if(core.includes('記憶が間違っていた'))x={
      object:'銀色の万年筆',
      hook:`${place}の喫茶店で、${h}は高校卒業の日に失くした銀色の万年筆を見つけた。父からもらった品で、軸には小さく「H」の傷がある。`,
      question:`${h}は当時、最後に机へ近づいた${suspect}が持っていったと思い込み、それきり疎遠になっていた。だが喫茶店の受取票には${suspect}ではなく${owner}の名前があった。`,
      clue1:`キャップの内側には、卒業の二年後にできた修理店の刻印があった。${h}が記憶する「失くしたまま誰にも使われなかった品」ではあり得ない。`,
      falseLead:`${suspect}が誰かへ渡し、長く隠していた可能性を${h}は疑う。`,
      clue2:`${witness}が保存していた卒業式の写真には、万年筆が${h}の胸ポケットではなく、図書室の返却カウンターに置かれている瞬間が写っていた。`,
      reveal:`喫茶店のカウンターは、閉校した母校の図書室から譲り受けたものだった。改装中、引き出しの裏から万年筆を見つけた${owner}が修理して使い、先週ここへ置き忘れた。${suspect}は一度も持ち去っていなかった。`,
      climax:`${h}は${suspect}へ連絡し、まず「盗ったと思っていた」と自分の誤りを伝えた。謝れば八年が戻るわけではない。それでも、誤った記憶の上に関係を置き続けることはやめられる。`,
      resolve:`万年筆は戻った。戻らなかった八年については、これから話すしかなかった。`,
      titles:['図書室の万年筆','二年後の刻印','卒業写真の端','盗まれていなかった物','八年ぶりの連絡']
    };
    else if(core.includes('秘密につながる'))x={
      object:'真鍮の小さな鍵',
      hook:`${place}の喫茶店で、${h}は三年前に失くした真鍮の鍵を見つけた。自宅の鍵ではない。亡くなった祖父から「いつか必要になる」と渡されたものだった。`,
      question:`落とし物の受取票には${suspect}の名前。だが${suspect}は「その鍵を見たことがない」と言う。`,
      clue1:`鍵の歯には青い塗料が付着し、喫茶店の地下倉庫に並ぶ古い保管箱と同じ色だった。`,
      falseLead:`${suspect}が祖父の秘密を知って鍵を持ち出したのではないかと${h}は疑う。`,
      clue2:`防犯記録では鍵を届けたのは${suspect}ではなく、名札を借りていた${witness}だった。受取票の名前は「拾った人」ではなく「一緒にいた人」の欄を店員が写し間違えていた。`,
      reveal:`${witness}は古い保管箱を処分するため鍵を探していた。箱は祖父が喫茶店主に預けたもので、中には土地の権利書ではなく、家族に言えなかった借金の返済記録が残っていた。`,
      climax:`${h}は箱を持ち帰らず、家族全員を喫茶店へ呼んだ。秘密を一人で抱えるやり方まで祖父から受け継ぐ必要はないと思った。`,
      resolve:`失くした鍵は、閉じたままだった話を開けるために戻ってきた。`,
      titles:['真鍮の鍵','青い塗料','名前の違う受取票','地下の保管箱','祖父が残した記録']
    };
    else if(core.includes('ずっと身近'))x={
      object:'赤い革の定期入れ',
      hook:`${place}の喫茶店で、${h}は十年前から探していた赤い革の定期入れを見つけた。ところが、店員は「今朝、店の中で見つかった」と言う。`,
      question:'十年間なかった物が、なぜ今朝までこの店の中にあったのか。',
      clue1:`内側には十年前の切符と、当時この場所には存在しなかった喫茶店の細かな木屑が挟まっていた。`,
      falseLead:`誰かが最近になって持ち込んだと考えるのが自然だった。`,
      clue2:`${witness}の話で、店の本棚が十年前まで${h}の住んでいたアパートの共用棚だったと分かる。`,
      reveal:`定期入れは棚板の裏に挟まったまま、アパートの閉鎖と店の開業を経て、この場所まで運ばれていた。今朝の修理で初めて落ちてきたのだ。`,
      climax:`${h}は十年間疑っていた${suspect}へ「あなたが持っていったんじゃなかった」と伝えた。`,
      resolve:`探し物は遠くへ行っていたのではなかった。自分の思い込みだけが、ずっと遠回りしていた。`,
      titles:['十年前の定期入れ','今朝見つかった物','本棚の来歴','遠くへ行かなかった物','疑いを返す日']
    };
    else if(core.includes('失った時間'))x={
      object:'止まった腕時計',
      hook:`${place}の喫茶店で、${h}は七年前に失くした腕時計を受け取った。針は失くした日の17時26分で止まっていた。`,
      question:`時計を届けた${owner}は「昨日、古いコートのポケットから出てきた」と言う。だがそのコートを着ていたのは${h}ではなく${suspect}だった。`,
      clue1:`時計の裏蓋には、止まった翌日に交換された電池の記録があった。17時26分で止まったという見た目は、後から作られたものだった。`,
      falseLead:`${suspect}が七年間、時計を隠していたように見える。`,
      clue2:`修理伝票には依頼人として${witness}の名前があり、「本人へ返せず保管」と記されていた。`,
      reveal:`${witness}は当時、事故直後で誰とも会いたくなかった${h}へ時計を返せず、${suspect}へ預けた。${suspect}もまた連絡する機会を逃し、時間だけが過ぎた。`,
      climax:`${h}は誰が悪いかを決める代わりに、七年前に途切れた三人の会話をその場で始めた。`,
      resolve:`時計は動き始めたが、七年は戻らない。だからこそ、次の一時間は今から使える。`,
      titles:['17時26分','翌日の電池交換','返せなかった時計','七年ぶりの三人','動き始めた針']
    };
    else x={
      object:'銀のしおり',
      hook:`${place}の喫茶店で、${h}は九年前に失くした銀のしおりを見つけた。裏には自分しか知らない傷がある。`,
      question:`落とし物票には${suspect}の名前。${suspect}は「昨日ここで拾っただけ」と言う。九年間の空白を説明できない。`,
      clue1:`しおりには九年前にはなかった店のロゴが薄く転写されていた。最近まで店内の何かに挟まれていたことになる。`,
      falseLead:`${suspect}が長く持っていて、今になって戻したのではないか。`,
      clue2:`${witness}が昔の店内写真を見せた。現在の壁際の本棚は、九年前に閉店した古書店から丸ごと譲られたものだった。`,
      reveal:`しおりは古書店の本に挟まったまま棚ごと移動し、先週の整理で落ちた。${suspect}は本当に拾っただけだった。`,
      climax:`${h}は、九年間抱えていた「誰かに取られた」という説明を捨てることになった。`,
      resolve:`失くした物は戻った。けれど一番大きかったのは、失くした理由まで自分で作っていたと気づいたことだった。`,
      titles:['九年前の銀のしおり','昨日の落とし物票','古書店の本棚','誰も盗っていなかった','戻った物、消えた疑い']
    };
    return {...x,ally,rel,suspect,witness,owner};
  }

  function mysteryByTheme(a,h,n){
    if(a.theme==='失くしもの')return lostMystery(a,h,n);
    const [ally,suspect,witness,owner]=n,rel=relation(a.hero,ally),place=a.place||'町';
    const map={
      秘密:{object:'封蝋された古い帳簿',question:'誰が帳簿の最後の三頁を抜き取り、なぜ戻したのか。',hook:`${place}で${h}は、自分の名前が記された封蝋付きの帳簿を受け取る。最後の三頁だけが新しい糊で貼り直されていた。`,clue1:'紙の透かしは本文より五年新しく、貼り直した人物が原本を持っていた時期を絞れた。',falseLead:`署名の残る${suspect}が最も怪しく見えた。`,clue2:`${witness}の保管記録では、その期間に帳簿へ触れられたのは${owner}だけだった。`,reveal:`${owner}は横領を隠したのではなく、被害者の住所が載った頁を外して報復から守っていた。`,climax:`${h}は秘密を暴くか守るかではなく、個人情報を伏せて不正だけを公表する方法を選んだ。`,resolve:'秘密はゼロにならなかったが、誰を守るための秘密かは明らかになった。',titles:['封蝋の帳簿','五年新しい紙','最後の三頁','伏せる名前','残す秘密']},
      家族:{object:'父の名義ではない遺言書',question:'家族の誰が遺言書を書き換えたように見せたのか。',hook:`${place}で${h}は、亡くなった父の遺品から二通の遺言書を見つける。日付は同じなのに、家を継ぐ人物だけが違っていた。`,clue1:'新しい方の印影は本物だが、紙は父の死後に発売されたものだった。',falseLead:`家を継ぐことになった${suspect}が偽造したように見えた。`,clue2:`${witness}の証言で、父は生前に内容だけ口述し、正式な清書を${owner}へ頼んでいたと分かる。`,reveal:`二通目は偽造ではなく、法的効力のない「家族への希望」だった。誰かが遺言として扱ったことで争いが始まっていた。`,climax:`${h}はどちらが本物かだけでなく、父の希望と法律上の相続を分けて家族に示した。`,resolve:'家族の争いを終わらせたのは、隠された財産ではなく、二枚の紙の役割を分けることだった。',titles:['二通の遺言','死後に発売された紙','父の口述','遺言ではない一枚','家を継ぐ人']},
      嘘:{object:'時刻の違う三枚のレシート',question:'三人のうち誰が嘘をついているのか。それとも時刻そのものが間違っているのか。',hook:`${place}で小さな盗難が起きた。${h}の前には、同じ店名なのに時刻が食い違う三枚のレシートが残された。`,clue1:'一枚だけ印字の秒数がなく、旧型レジから出たものだった。',falseLead:`そのレシートを持つ${suspect}のアリバイが嘘に見えた。`,clue2:`${witness}が「停電後、旧レジの時計を十三分進めてしまった」と証言する。`,reveal:`嘘をついていたのは${suspect}ではなく${owner}だった。ただし盗難ではなく、別の場所にいたことを隠すための嘘だった。`,climax:`${h}は盗難の犯人と、無関係な嘘を切り分けて追い直した。`,resolve:'一つの嘘が、全部の真実を嘘にするわけではなかった。',titles:['三枚のレシート','十三分進んだ時計','嘘のアリバイ','盗難とは別の秘密','本当の時刻']},
      時間:{object:'止まった柱時計',question:'事件の時刻は本当に時計が止まった22時14分なのか。',hook:`${place}で起きた盗難の現場には、22時14分で止まった柱時計が残されていた。全員がその時刻を犯行時刻だと思った。`,clue1:'時計の振り子には新しい指紋がなく、止めた人物は素手で触れていない。',falseLead:`22時14分に一人だった${suspect}が疑われる。`,clue2:`${witness}の録音に、22時20分を過ぎても時計の鐘が一度鳴る音が残っていた。`,reveal:'時計は事件後に針だけ戻されていた。犯行時刻を六分以上ずらすための偽装だった。',climax:`${h}は「止まった時刻」ではなく、鐘の回数と通話記録から本当の時間を組み直した。`,resolve:'時間は動かせない。でも、時計の針なら誰かが動かせる。',titles:['22時14分','鳴ったはずのない鐘','六分の空白','戻された針','本当の時刻']},
      手紙:{object:'差出人のない手紙',question:'毎週届く手紙を書いているのは誰か。なぜ宛名だけ同じ筆跡なのか。',hook:`${place}で${h}のもとへ、四週続けて差出人のない手紙が届く。内容は毎回違うのに、封筒の宛名だけは同じ筆跡だった。`,clue1:'便箋は三種類、インクも違う。本文は一人が書いたものではなかった。',falseLead:`宛名の筆跡が${suspect}に似ていたため、${h}は仲介役だと疑う。`,clue2:`${witness}が、同じ封筒を町内の別の人も受け取っていると教える。`,reveal:`手紙は一人の告発ではなく、${owner}が複数人の声をまとめて届けていたものだった。宛名だけ${owner}が書いていた。`,climax:`${h}は差出人探しをやめ、手紙に共通する一つの問題を公の場で確かめることにした。`,resolve:'差出人は一人ではなかった。だからこそ、無視できない声になった。',titles:['四通目の手紙','三種類の便箋','同じ宛名','一人ではない差出人','返事をする場所']},
      再会:{object:'昔の集合写真',question:`再会した${suspect}だけが、写真に写る一人の名前を覚えていないのはなぜか。`,hook:`${place}で${h}は十年ぶりに${suspect}と再会する。二人の前に、昔の集合写真が一枚置かれていた。`,clue1:'写真の裏には全員の名前があるのに、一人分だけ後から削られていた。',falseLead:`${suspect}がその人物を意図的に消したように見えた。`,clue2:`${witness}の元データには削られた人物が写っておらず、紙焼き写真だけに姿がある。`,reveal:'集合写真は一枚ではなく、別日に撮った二枚を合成したものだった。削られた人物はその場にいなかった。',climax:`${h}は「誰を忘れたか」ではなく「誰が、なぜ一人を写真に加えたのか」を追い直す。`,resolve:'再会で戻ったのは記憶ではなく、記憶を疑うための手がかりだった。',titles:['十年ぶりの写真','削られた名前','二枚の原版','いなかった一人','再会のあと']}
    };
    return map[a.theme]||{object:'差し替えられた記録',question:`テーマ「${a.theme}」に関わる出来事で、誰が記録を変えたのか。`,hook:`${place}で${h}は、内容の一部が差し替えられた記録を見つけた。それは${a.theme}に関わる過去と直接つながっていた。`,clue1:'紙・時刻・署名の三点のうち、一つだけ年代が合わなかった。',falseLead:`${suspect}の説明が最も不自然に見えた。`,clue2:`${witness}の記録で、最初の前提が一つ崩れた。`,reveal:`差し替えたのは${owner}で、目的は単純な利益ではなかった。`,climax:`${h}は証拠を並べ直し、${a.theme}に関わる本当の出来事を当事者へ突きつけた。`,resolve:`謎が解けても${a.theme}そのものが消えるわけではない。だが、何を引き受けるべきかは見えるようになった。`,titles:['差し替えられた記録','合わない年代','崩れた前提','本当の理由','残ったこと']};
  }

  function mysteryEnding(a,h){const m={希望が残る:`${h}は、次に疑う前に一つだけ確かめることを決めた。`,大逆転:'最後に残った一枚の記録が、解けたはずの結論をもう一度ひっくり返した。',少し切ない:'真相は分かった。それでも、分からなかった時間までは戻らなかった。',謎が残る:'ただ一つ、誰が最初にそれをここへ置いたのかだけは最後まで分からなかった。',幸せになる:'事件のあと、当事者たちはようやく同じテーブルで次の予定を決めた。',静かな余韻:'店を出る頃には雨が止んでいた。答えより、残った沈黙の方が長く感じられた。',再出発する:'翌朝、${h}は最初に謝るべき相手へ連絡を入れた。',少し笑える:'最後の最後に、全員が見落としていた最も単純な理由が一つだけ残っていた。',未来につながる:'その記録は、新しい事件ではなく、次に確かめるべき名前を一つ残した。',ほろ苦い:'真相は正しかった。でも、正しいだけでは埋まらないものも残った。'};return m[a.ending]||m['希望が残る']}

  function buildMystery(){
    const a=state.ans,u=user(),h=heroName();state.heroName=h;const n=names(h),p=mysteryByTheme(a,h,n);
    const all=[
      {t:`第一章　${p.titles[0]}`,p:para(p.hook,`謎は単純ではなかった。${p.question}`,`${p.rel}に相談した${h}は、推測より先に「いつ・誰が・どこで」を記録することにした。`)},
      {t:`第二章　${p.titles[1]}`,p:para(p.clue1,p.falseLead,`${h}は${p.suspect}へ直接確かめた。答えは疑いを消すどころか、別の矛盾を一つ増やした。`)},
      {t:`第三章　${p.titles[2]}`,p:para(p.clue2,`${h}は最初の仮説を捨てた。都合の悪い証拠を無視して犯人像を守る方が、間違った推理より危険だった。`,p.reveal)},
      {t:`第四章　${p.titles[3]}`,p:para(p.climax,`ここで初めて、最初に見えていた「失くした物／怪しい人物／分かりやすい動機」が同じ線上にはなかったと分かった。`)},
      {t:`第五章　${p.titles[4]}`,p:para(p.resolve,mysteryEnding(a,h))},
      {t:'第六章　残った証拠',p:para(`事件が終わったあと、${h}は証拠を一つずつ元の場所へ戻した。`,`${p.suspect}との関係は、真相が出たからといって自動的に元へ戻るわけではなかった。だからこそ、次に話すことだけを決めた。`)},
      {t:'終章　次に確かめること',p:para(`最後に残ったのは「自分は何を見た瞬間に結論を決めたのか」という問いだった。`,mysteryEnding({...a,ending:'静かな余韻'},h))}
    ];
    const chapters=a.length==='ショートショート'?[all[0],all[2],all[4]]:a.length==='中編'?all:all.slice(0,5);
    const title=(document.getElementById('title')?.value||state.title||p.titles[0]).trim();
    const b={id:'b'+Date.now(),title,genre:a.genre,author:u.name,authorId:u.id,likes:0,shares:0,summary:`ミステリー／テーマ「${a.theme}」。${p.question}`,answers:{...a,heroName:h},chapters,created:Date.now(),published:false,coverSeed:Math.random(),coverStyle:Math.floor(Math.random()*4)};
    const allBooks=books();allBooks.unshift(b);saveBooks(allBooks);showBook(b.id);
  }

  function titleCandidates(){
    const a=state.ans,h=heroName();state.heroName=h;
    if(a.genre==='ミステリー'){
      const p=mysteryByTheme(a,h,names(h));return [p.titles[0],p.titles[2],p.titles[4],`${a.theme}の証拠`,`${a.place}に残った手がかり`];
    }
    return null;
  }
  window.mmChooseV8Title=function(t){state.title=t;window.titlePage()};
  window.titlePage=function(){
    const a=state?.ans||{};
    if(a.genre!=='ミステリー')return PREV_TITLE();
    const c=titleCandidates();
    if(!state.title||state.title.includes('を話す夜')||state.title.includes('向こう側')||state.title.includes('の夜'))state.title=c[0];
    main.innerHTML=`<div class="question"><div class="qnum">FINAL STEP</div><h2>主人公の名前と、本のタイトルを決めます。</h2><div class="card" style="margin-bottom:14px"><div class="meta">今回の物語の核</div><b>${safe(a.genre)} × テーマ「${safe(a.theme)}」</b><div class="meta" style="margin-top:5px;line-height:1.65">中心の出来事：${safe(a.core||'自動で設定')}<br>舞台：${safe(a.place)}<br>今回は、この出来事自体が事件になります。</div></div><div class="titleedit"><div class="meta" style="margin-bottom:6px">主人公の名前</div><input id="heroName" class="input" maxlength="16" value="${safe(state.heroName)}" oninput="state.heroName=this.value" placeholder="好きな名前を入力"><button class="ghost wide" style="margin-top:8px" onclick="state.heroName='${pick(NAMES)}';state.title='';titlePage()">別の名前候補を表示</button></div><div class="titleflow" style="margin-top:18px"><div class="flow"><b>タイトル候補</b><div class="meta">事件の内容から候補を出しています。</div></div></div><div class="titlechoices">${c.map(t=>`<button class="titlechoice ${state.title===t?'active':''}" onclick="mmChooseV8Title('${t.replaceAll("'","\\'")}')">${safe(t)}</button>`).join('')}</div><div class="titleedit"><div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div><input id="title" class="input" value="${safe(state.title)}" oninput="state.title=this.value" placeholder="好きなタイトルを入力"></div><button class="primary wide" style="margin-top:14px" onclick="generate()">この設定で本を作る</button><button class="ghost wide" style="margin-top:8px" onclick="state.step=qs.length-1;renderQ()">前の質問に戻る</button></div>`;
  };

  window.generate=function(){
    if(state?.ans?.genre==='ミステリー')return buildMystery();
    return PREV_GENERATE();
  };
})();