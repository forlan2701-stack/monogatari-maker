(function(){
  const GENRES=['ミステリー','恋愛','ファンタジー','青春','ほっこり','SF','ヒューマンドラマ','冒険','不思議','日常','歴史','ホラー','ロードノベル','お仕事','家族','短編連作'];
  const HEROES=['高校生','大学生','会社員','店主','探偵','旅人','作家','図書館司書','料理人','配達員','医師','教師','ミュージシャン','弁護士','小学生','人ではない存在'];
  const THEMES=['忘れられない約束','秘密','再会','挑戦','家族','一冊の本','手紙','夢','居場所','失くしもの','嘘','時間','赦し','別れ','始まり','願い'];
  const LENGTHS=['ショートショート','短編','中編'];
  const NAMES=['澪','蓮','奏','伊織','悠人','真帆','凪','慧','七海','瑞希','葵','湊','紬','玲','千景','陽菜','透','梓','海斗','楓','亮','美月','新','茜','律','咲良','冬馬','由奈','直人','志乃'];
  const escV=v=>typeof esc==='function'?esc(v):String(v??'');
  const hash=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const fill=(s,c)=>String(s||'').replaceAll('{h}',c.h).replaceAll('{a}',c.a).replaceAll('{k}',c.k).replaceAll('{r}',c.r).replaceAll('{sym}',c.sym);

  const THEME={
    '忘れられない約束':{sym:'古い約束の印',setup:'任務のきっかけには、昔交わしたまま果たせていない約束が関わっていた。',turn:'途中で、その約束を言葉どおり守ると今いる仲間を危険にさらすと分かる。',choice:'{h}は約束の文面ではなく、なぜその言葉を交わしたのかを基準に選び直す。',after:'帰還後、約束は同じ言葉ではなく、今の状況に合う形で結び直された。'},
    '秘密':{sym:'封じられた記録',setup:'出発前、{h}だけに見せられていなかった記録が見つかった。',turn:'隠されていた理由は単純な悪意ではなく、公開すると別の誰かが傷つく事情を含んでいた。',choice:'{h}は全部を暴くのではなく、誰に何を伝えるかを自分で決める。',after:'秘密は消えなかったが、少なくとも{h}だけを外して話が進むことはなくなった。'},
    '再会':{sym:'昔の写真',setup:'今回の出来事で、長く会っていなかった{k}と再び顔を合わせることになった。',turn:'二人が離れた日の記憶は同じではなく、どちらも自分が置いていかれたと思っていた。',choice:'{h}は昔の関係へ戻ることより、今の{k}と何ができるかを選ぶ。',after:'再会は答え合わせで終わらず、次に会う理由を一つ残した。'},
    '挑戦':{sym:'前回の失敗記録',setup:'{h}には、同じ種類のことに一度失敗した経験があった。今回は逃げれば二度と機会が来ない。',turn:'前回の失敗は能力不足ではなく、一人で抱え込み途中で方法を変えなかったことが原因だと分かる。',choice:'{h}は最初の計画に固執せず、{a}の案を採用して途中で役割を変える。',after:'成功か失敗かだけでなく、次に使える方法が手元に残った。'},
    '家族':{sym:'家族から預かった物',setup:'今回の出来事には、家族が長く黙っていた事情が関わっていた。',turn:'守るための沈黙だったと分かる一方で、その沈黙が{h}から選ぶ機会を奪っていた。',choice:'{h}は家族の判断をそのまま受けず、自分の希望も条件に入れる。',after:'全員が同じ考えにはならなかったが、本人抜きで決めることだけはなくなった。'},
    '一冊の本':{sym:'書き込みのある一冊',setup:'手がかりとして、一冊の本が現れた。余白には{h}の知らない書き込みが残っている。',turn:'本に書かれた内容は答えではなく、過去に誰かが選ばなかった可能性の記録だった。',choice:'{h}は本の結末をなぞらず、自分の状況に合わせて別の選択をする。',after:'本は閉じられたが、最後の余白だけは空いたまま残った。'},
    '手紙':{sym:'遅れて届いた手紙',setup:'出発の直前、何年も前に書かれた手紙が今になって届いた。',turn:'手紙が遅れたのは誰かの陰謀ではなく、当時の事情と小さな行き違いが重なった結果だった。',choice:'{h}は過去の自分の代わりではなく、今の自分として返事をする。',after:'返事が届く保証はない。それでも言葉を自分の側で止めないことはできた。'},
    '夢':{sym:'昔の応募票',setup:'今回の出来事は、{h}が昔あきらめた夢と意外な形でつながっていた。',turn:'昔の夢をそのまま取り戻しても、今の生活には合わないと分かる。',choice:'{h}は夢を昔の形へ戻さず、今の自分が続けられる形に作り直す。',after:'夢は突然叶わず、具体的な次の予定として手帳に残った。'},
    '居場所':{sym:'使われなくなった鍵',setup:'{h}は、必要とされなくなれば自分の居場所もなくなると思っていた。',turn:'守りたかったのは場所そのものではなく、そこで続いていた役割や関係だったと気づく。',choice:'{h}は元の形を無理に残さず、別の場所でも続けられる形を選ぶ。',after:'場所は変わったが、帰れる先が一つ増えた。'},
    '失くしもの':{sym:'傷のついた小物',setup:'出来事の中心には、昔なくしたと思っていた物が関わっていた。',turn:'調べるうち、なくした日の記憶そのものが少しずれていたと分かる。',choice:'{h}は物だけを取り戻そうとせず、その日に何が起きたかを確かめる。',after:'見つかった物より、思い込みを一つ手放せたことの方が大きかった。'},
    '嘘':{sym:'食い違う記録',setup:'関係者の説明の中に、一つだけ意図的な嘘が混じっていた。',turn:'その嘘は自分を守るためではなく、別の人を守るためにつかれていた。',choice:'{h}は嘘を暴くこと自体を目的にせず、真実を誰にどう返すかを選ぶ。',after:'真実が出ても、関係が元通りになるわけではなかった。それでも次の話は本当の情報から始められる。'},
    '時間':{sym:'止まった時計',setup:'残された時間は短く、先延ばしにできない状況だった。',turn:'急ぐほど同じ失敗を繰り返していると分かり、一度だけ立ち止まって順番を変える必要が出る。',choice:'{h}は最短の方法ではなく、失敗した時に戻れる方法を選ぶ。',after:'時計は進み続けたが、間に合ったかどうかだけでは測れないものが残った。'},
    '赦し':{sym:'欠けた徽章',setup:'今回、{h}は過去に自分を傷つけた{k}と協力しなければならない。',turn:'事情を知っても、受けた傷まで消えるわけではなかった。',choice:'{h}は許したふりをせず、今回どこまで任せるかだけを具体的に決める。',after:'二人は元の関係には戻らなかったが、過去だけで次の行動を決めることもなくなった。'},
    '別れ':{sym:'返せなかった物',setup:'今回の出来事の先には、避けられない別れが待っていた。',turn:'引き止めることが相手のためとは限らず、終わりを認める必要が出てくる。',choice:'{h}は別れを無かったことにせず、最後に返す物と伝える言葉を自分で決める。',after:'別れたあとにも持っていけるものがあると分かった。'},
    '始まり':{sym:'まだ白い名札',setup:'{h}は準備が整わないまま、新しい役目を引き受けることになった。',turn:'最初から正しくやることより、途中で直せる状態を作る方が重要だと分かる。',choice:'{h}は一つだけ終わらせることを決め、その日のうちに最初の一歩を始める。',after:'始まりは大きな宣言ではなく、翌日の予定に一つ項目が増える形で残った。'},
    '願い':{sym:'願いを書いた紙',setup:'{h}には叶えたい願いがあったが、それを選ぶと別の誰かの希望とぶつかる。',turn:'願いは無料ではなく、誰が何を負うかまで含めて選ばなければならないと分かる。',choice:'{h}は一つを選び、選ばなかった方にも理由を与える。',after:'願いはそのまま叶わず、自分で引き受けられる形へ変わった。'}
  };

  const ROUTES={
    'ミステリー':[
      {id:'case',label:'身近な事件を追う',desc:'小さな違和感から証拠を積み上げて真相へ。',setting:'雨の街',goal:'三日以内に食い違う記録の原因を突き止める',obstacle:'証言と記録が互いに矛盾している',turn:'犯人探しより、最初の前提が間違っていた可能性が浮かぶ',climax:'現場の動線をもう一度再現し、最後の矛盾を説明する',titles:['十二分のずれ','最後の照合','嘘をつかない証言']},
      {id:'missing',label:'消えた人を探す',desc:'失踪の手がかりを追い、本人の選択へたどり着く。',setting:'古書店の多い町',goal:'突然姿を消した人物の行き先を探す',obstacle:'残された手がかりが意図的に消されている',turn:'失踪は事件ではなく、本人が誰かを守るために選んだ行動かもしれない',climax:'最後に残った記録から、現在の居場所ではなく失踪の理由を突き止める',titles:['消された住所','最後の配達先','戻っていた記録']},
      {id:'locked',label:'閉ざされた場所の謎',desc:'入れないはずの場所で起きた出来事を解く。',setting:'閉館前の図書館',goal:'施錠後の部屋で起きた不可解な出来事を説明する',obstacle:'鍵の記録と目撃証言の両方が正しいように見える',turn:'問題は「誰が入ったか」ではなく「いつ部屋と呼ばれたか」にある',climax:'時刻表と設備記録を重ね、密室に見えた条件を崩す',titles:['閉館後の部屋','鍵のない十二分','最後に閉じた扉']},
      {id:'memory',label:'記憶の食い違いを追う',desc:'同じ日の記憶が違う理由を探る。',setting:'海辺の町',goal:'複数人が違って覚えている一日の事実を確かめる',obstacle:'誰も嘘をついていないのに記憶が一致しない',turn:'同じ出来事を見たのではなく、それぞれ別の場所から同じ音を聞いていたと分かる',climax:'写真、時刻、移動経路を重ねて一日の順番を組み直す',titles:['同じ日の三つの記憶','写真の外側','午後五時の音']}
    ],
    '恋愛':[
      {id:'reunion',label:'再会から始める',desc:'昔の誤解を確かめ、今の距離を決める。',setting:'地方駅',goal:'町を離れる前の相手と一度だけ話す',obstacle:'昔の別れについて二人の記憶が違う',turn:'嫌われたのではなく、連絡そのものが届いていなかったと分かる',climax:'最終列車の前に、過去ではなく今の希望を話す',titles:['前日のホーム','今度は届いた','一番遅い列車']},
      {id:'choice',label:'進路と恋を両方描く',desc:'一緒にいることと夢を選ぶことを両立させる。',setting:'大学のある街',goal:'卒業までに二人の進路を決める',obstacle:'同じ町に残れば片方が第一希望を諦める',turn:'二人とも相手のために本当の希望を隠していた',climax:'別々の面接を受けたうえで、関係を続ける条件を話し合う',titles:['二枚の進路票','同じ春ではなく','別々の駅へ']},
      {id:'daily',label:'日常の積み重ねで描く',desc:'派手な事件ではなく、毎日の小さな変化から関係が動く。',setting:'商店街の小さな店',goal:'閉店までの一か月を一緒に働く',obstacle:'互いに好意はあるが、店がなくなれば会う理由もなくなる',turn:'続いていたのは場所ではなく、二人が作っていた習慣だと気づく',climax:'最後の日、次に会う理由を店の外で決める',titles:['閉店後の待ち合わせ','最後の一杯','店の外で会う日']},
      {id:'distance',label:'離れている二人を描く',desc:'遠距離やすれ違いを、具体的な予定で乗り越える。',setting:'二つの町',goal:'半年会えない期間をどう続けるか決める',obstacle:'連絡頻度の差が不安を大きくする',turn:'気持ちの強さではなく、期待している連絡の形が違っていた',climax:'次の半年を「会いたい時に言う」ではなく具体的な予定へ落とす',titles:['次の土曜日まで','二つの町の間','会えない日の予定']}
    ],
    'ファンタジー':[
      {id:'delivery',label:'魔法の品を届ける',desc:'期限つきの護送任務。',setting:'二つの月が昇る王国',goal:'夜明けまでに結界を動かす石を王都へ届ける',obstacle:'街道が魔獣で封鎖されている',turn:'守るべき物を一部使わなければ仲間を救えない',climax:'残った力を仲間と重ね、王都の結界を再点火する',titles:['黎明石を運ぶ夜','夜明け前の門','二つの月の下で']},
      {id:'forest',label:'呪われた森へ入る',desc:'入るたびに何かを失う森から人を探す。',setting:'王国西端の森',goal:'森から戻らない人物を探す',obstacle:'奥へ進むほど名前や記憶が一つずつ薄れる',turn:'森は奪っているのではなく、本人が捨てたい記憶を選んでいる',climax:'失いたくない一つを声に出して出口を作る',titles:['名前を食べる森','呼ばれない名前','森の最後の札']},
      {id:'curse',label:'呪いを解く',desc:'代償のある魔法のルールを破らずに解決する。',setting:'古い塔の町',goal:'日没ごとに一人ずつ眠る呪いを止める',obstacle:'解除には誰か一人の記憶を差し出す必要がある',turn:'呪いの契約には「一人分」としか書かれておらず、分けられないとは書かれていない',climax:'町の人々が一つずつ小さな記憶を差し出して代償を分ける',titles:['百人分の一つ','眠りの契約','塔に残った名前']},
      {id:'school',label:'魔法学院を舞台にする',desc:'試験や禁書から始まる成長物語。',setting:'王立魔法学院',goal:'卒業試験までに封印術を完成させる',obstacle:'教科書どおりの術式では毎回同じ場所で崩れる',turn:'失敗の原因は魔力不足ではなく、術式の前提が古いことにある',climax:'禁書庫の旧式と仲間の新しい術式を組み合わせて試験へ挑む',titles:['最後の術式','禁書庫の余白','卒業試験の夜']}
    ],
    '青春':[
      {id:'festival',label:'学校行事を中心にする',desc:'文化祭や舞台を、仲間との関係ごと描く。',setting:'高校',goal:'四日後の文化祭までに止まった企画を完成させる',obstacle:'役割が一人に集中し準備が止まっている',turn:'やる気不足ではなく、担当の境界が曖昧だったことが分かる',climax:'欠員が出た本番直前に役割を組み替えて舞台を成立させる',titles:['四日前','最後の役割表','本番前夜']},
      {id:'club',label:'部活の挑戦を描く',desc:'勝敗より、どう挑むかを中心に。',setting:'放課後の学校',goal:'六日後の地区予選へ出場する',obstacle:'けが人が出て最低人数ぎりぎり',turn:'去年の敗因は実力差より同じ人へ負担を集中させたことだった',climax:'試合中に役割を変え、最後まで全員で戦う',titles:['あと一人','予選まで六日','帰りのバス']},
      {id:'music',label:'創作や音楽を描く',desc:'作品を完成させるまでの迷いと仲間。',setting:'放送室と音楽室',goal:'十日後の学生音楽祭へ曲を出す',obstacle:'評価を意識するほど自分の作りたい曲から離れる',turn:'去年やめた理由は才能ではなく、怖くなって一人で抱えたことだった',climax:'仲間に途中稿を見せながら完成させ、締切日に送信する',titles:['屋上の録音','十日後の送信','次の一曲']},
      {id:'friendship',label:'友人関係を中心にする',desc:'すれ違った友人と今の距離を決める。',setting:'海沿いの学校',goal:'卒業までに疎遠になった友人と一度話す',obstacle:'離れた理由を互いに違って理解している',turn:'どちらかが裏切ったのではなく、同じ出来事を別の意味で受け取っていた',climax:'元通りを約束せず、次に会う日だけを決める',titles:['卒業前の海','同じ帰り道','次の土曜日']}
    ],
    'ほっこり':[
      {id:'shop',label:'小さな店を舞台にする',desc:'町の習慣や人のつながりを描く。',setting:'商店街',goal:'閉店する店の最後の一週間を手伝う',obstacle:'皆が「残したい」と言うが店主には続ける体力がない',turn:'残したいのは建物ではなく、店で続いてきた小さな習慣だと分かる',climax:'道具やレシピを町の別々の場所へ引き継ぐ',titles:['最後の日曜日','閉店時間','次の台所']},
      {id:'delivery',label:'届け物から始める',desc:'小さな親切が別の人へつながる。',setting:'雨の町',goal:'宛名のない小包の送り主を探す',obstacle:'受け取った人たちが皆、別の人から届いたと思っている',turn:'送り主は一人ではなく、親切を受けた人が次へ回していた',climax:'最後の小包を最初の送り主へ返す',titles:['宛名のない小包','雨の日の箱','最初の送り主']},
      {id:'meal',label:'食事を中心にする',desc:'一緒に食べることで少しずつ距離が変わる。',setting:'小さな食堂',goal:'一週間だけ臨時で店を切り盛りする',obstacle:'常連ごとに「いつもの味」の記憶が違う',turn:'同じ味を再現するより、それぞれが大事にしていた一皿を聞く方が近道だと分かる',climax:'最後の日に皆で一つずつ持ち寄った献立を出す',titles:['いつもの味は一つじゃない','七日目の献立','最後の一皿']},
      {id:'library',label:'図書館で人をつなぐ',desc:'本を介して知らない人同士がつながる。',setting:'町の図書館',goal:'返却本に挟まる短いメモの書き手を探す',obstacle:'メモは毎回別の筆跡に見える',turn:'一人の書き手ではなく、読んだ人が次の人へ一行ずつ足していた',climax:'最後の空白へ主人公も一行だけ書く',titles:['返却本の一行','余白のつづき','最後の空白']}
    ],
    'SF':[
      {id:'mars',label:'火星移住を描く',desc:'未来の進路と今の生活を天秤にかける。',setting:'西暦2187年の地球圏',goal:'再開された火星移住選考へ参加するか決める',obstacle:'合格すれば九年間地球へ戻れない',turn:'昔の不合格理由は能力ではなく当時のリスク計算の誤りだった',climax:'永久移住ではなく一年間の先行任務へ計画を変更して応募する',titles:['十一年前の再選考','ORBIT-9','九年後の帰還']},
      {id:'loop',label:'時間ループを描く',desc:'同じ六時間を繰り返しながら原因を探す。',setting:'軌道都市',goal:'六時間後に止まる酸素循環を救う',obstacle:'同じ修理をしても毎回同じ時刻に失敗する',turn:'故障ではなく、修理開始前の自動判断が原因だと分かる',climax:'修理ではなく判断順序を変え、初めて零時を越える',titles:['六時間の反復','00:00を越えて','最初の判断']},
      {id:'memory',label:'記憶技術を描く',desc:'記憶コピーと本人性をめぐる話。',setting:'月面記憶図書館',goal:'消えた十年分の記憶データを探す',obstacle:'失った記憶が別人のバックアップに保存されている',turn:'コピーは盗まれたのではなく、事故時に本人が救命用として共有していた',climax:'全部を戻さず、今の自分が必要だと思う範囲だけ復元する',titles:['十年分の空白','他人の中の記憶','復元しない一頁']},
      {id:'ai',label:'AIとの判断を描く',desc:'AIが先に下した決定を人間が見直す。',setting:'自律都市',goal:'AIが出した避難命令の根拠を確かめる',obstacle:'安全指標は正しいのに住民の生活条件が反映されていない',turn:'AIは嘘をついていないが、評価項目に「戻れない人」が含まれていなかった',climax:'避難か残留かの二択をやめ、段階避難の第三案を作る',titles:['第三の避難案','安全率99.7%','戻れない人']}
    ],
    'ヒューマンドラマ':[
      {id:'decision',label:'人生の決断を描く',desc:'本人抜きで進んでいた話に自分の意見を戻す。',setting:'小さな町',goal:'生活を変える大きな決定に自分の意見を入れる',obstacle:'周囲が「あなたのため」と先に結論を出している',turn:'反対している人も別の損失を恐れていると分かる',climax:'全員が揃う場で条件と希望を具体的に伝える',titles:['自分抜きの話','決まらない夜','自分の席']},
      {id:'care',label:'支える側と支えられる側を描く',desc:'善意だけでは解けない負担を具体化する。',setting:'町立病院の近く',goal:'退院後の生活方法を家族と決める',obstacle:'一人が全部を引き受けようとしている',turn:'支える人にも限界があり、それを言わないことが全員を苦しくしていた',climax:'できることを時間と回数に分け、外部の支援も入れる',titles:['退院日の前','できることの表','誰か一人ではなく']},
      {id:'work',label:'仕事と人生を描く',desc:'肩書きの外にある自分を取り戻す。',setting:'地方都市',goal:'退職か続投かを一週間で決める',obstacle:'仕事を辞めた自分を想像できない',turn:'怖いのは退職そのものではなく、仕事以外の予定が何もないことだと分かる',climax:'辞表より先に、仕事の外で続ける予定を三つ作る',titles:['辞める前の予定','肩書きの外','月曜日のあと']},
      {id:'past',label:'過去の言葉と向き合う',desc:'昔の一言が今の選択を縛っている話。',setting:'雨の町',goal:'昔の出来事について本人と一度だけ話す',obstacle:'相手はその言葉を覚えていない',turn:'謝罪を得ることより、自分がその言葉をどう使い続けてきたかが問題だったと気づく',climax:'相手の答えとは別に、自分の今の選択を決める',titles:['覚えていない一言','古い言葉を返す夜','雨のあと']}
    ],
    '冒険':[
      {id:'rescue',label:'救助遠征にする',desc:'期限までに消息を絶った隊を救い出す。',setting:'北方山脈',goal:'灰の嵐が来る三日後までに測量隊を救助する',obstacle:'前年使った最短路が崩落している',turn:'撤退した前年の失敗記録に、当時見落とした地下水路の記号がある',climax:'高価な装備を一部捨て、負傷者を連れて地下水路から全員で帰還する',titles:['二度目の山脈','灰の嵐の前に','地図にない帰還路']},
      {id:'delivery',label:'重要な物を運ぶ',desc:'危険な道を越えて物資を届ける。',setting:'城壁都市と辺境',goal:'夜明けまでに水路を動かす青星石を王都へ届ける',obstacle:'風喰いの谷と崩れた石橋を越える必要がある',turn:'石を守るための最短路より、仲間全員が戻れる遠回りが必要になる',climax:'石橋を両側から修復し、地下水路経由で王都へ入る',titles:['青星石を運ぶ夜','風喰いの谷','夜明け前の北門']},
      {id:'ruins',label:'失われた遺跡を探す',desc:'地図にない遺跡の目的を追う。',setting:'砂漠の辺境',goal:'季節風が来る前に失われた観測所を見つける',obstacle:'古地図の方角が現在の星の位置と合わない',turn:'地図は北ではなく、百年前の季節風を基準に描かれていた',climax:'夜の星と風向きを使って観測所へ到達し、帰路の目印を残す',titles:['風を北にした地図','百年前の観測所','星のない方角']},
      {id:'escape',label:'脱出と生還を描く',desc:'閉ざされた場所から仲間と抜け出す。',setting:'海に沈みかけた島',goal:'満潮までに島から脱出する',obstacle:'唯一の船は壊れ、島の中央部も浸水していく',turn:'外へ出る道ではなく、古い排水路を逆に使えば高台へ抜けられる',climax:'残った資材で浮橋を作り、最後の一人まで渡してから島を離れる',titles:['満潮まで二時間','沈む島の出口','最後の浮橋']}
    ],
    '不思議':[
      {id:'letters',label:'言えなかった言葉が現れる',desc:'毎晩、誰かの言えなかった一言が浮かぶ。',setting:'古い書店',goal:'七日続く不可解な現象の意味を確かめる',obstacle:'現れる言葉の主が毎日違う',turn:'未来予知ではなく、その日に言えなかった言葉だけが残っていると分かる',climax:'七日目を待たず、主人公自身が先に伝えるべき相手へ会いに行く',titles:['七日目を待たずに','余白に浮かぶ言葉','言う前の一文字']},
      {id:'door',label:'昨日までなかった扉',desc:'決まった時刻だけ現れる扉の向こうへ。',setting:'古いアパート',goal:'毎晩23時17分に現れる扉の先を確かめる',obstacle:'入るたび廊下の長さが変わる',turn:'扉の先は別世界ではなく、住人が忘れた部屋の記憶がつながった場所だった',climax:'一番奥の部屋で残された物を持ち主へ返す',titles:['23時17分の扉','長くなる廊下','昨日までなかった部屋']},
      {id:'book',label:'読むたび変わる本',desc:'読者によって内容が変わる一冊。',setting:'町の図書館',goal:'最後の頁だけ毎回変わる本の規則を知る',obstacle:'読む人ごとに別の結末が現れる',turn:'本は未来を書いているのではなく、読んだ人が避けている選択を文章にしている',climax:'主人公は最後の頁を閉じ、自分で決めた行動を先にする',titles:['最後の頁は読まない','読者ごとの結末','閉じたあと']},
      {id:'clock',label:'止まった時間を描く',desc:'町の一角だけ同じ十分を繰り返す。',setting:'駅前商店街',goal:'毎日17時40分から十分だけ繰り返す原因を探す',obstacle:'外から見ると何も起きていない',turn:'繰り返しているのは町ではなく、その十分を忘れられない一人の記憶だった',climax:'本人が最後にやり残した行動を一緒に終える',titles:['17時40分','十分だけの商店街','止まらない時計']}
    ],
    '日常':[
      {id:'neighbor',label:'ご近所の小さな出来事',desc:'大事件ではなく、日々の習慣から人が見える。',setting:'小さな町',goal:'毎朝置かれる一本の傘の持ち主を知る',obstacle:'誰も自分が置いたとは言わない',turn:'一人の持ち主ではなく、雨の日に困った人が次へ回していた',climax:'主人公も次の雨の日に一本置く',titles:['青い傘の順番','雨の日だけ','次の人へ']},
      {id:'cafe',label:'常連たちの日常',desc:'同じ場所に集まる人の小さな変化。',setting:'喫茶店',goal:'一か月来なくなった常連の理由を知る',obstacle:'皆が勝手に悪い想像をしてしまう',turn:'本人は単に新しい仕事の時間が変わっていただけだった',climax:'久しぶりに来た日に、変わった「いつもの時間」を受け入れる',titles:['いつもの席が空いた日','午後四時ではなく','戻ってきた火曜日']},
      {id:'apartment',label:'アパートの住人たち',desc:'顔は知っているけど名前は知らない関係。',setting:'古いアパート',goal:'共同廊下に毎晩置かれる椅子の理由を知る',obstacle:'住人全員が自分ではないと言う',turn:'夜勤から帰る住人が少し休めるよう、別の住人が黙って出していた',climax:'理由を知ったあと、椅子の隣に小さな灯りが増える',titles:['廊下の椅子','午前二時の灯り','名前を知らない隣人']},
      {id:'weekend',label:'休日の一日を描く',desc:'一日だけで気持ちが少し変わる話。',setting:'海辺の町',goal:'何も予定を入れなかった休日を過ごす',obstacle:'休むことに落ち着かず予定を探してしまう',turn:'何もしないのではなく、自分の速度を取り戻す時間だと気づく',climax:'帰りの電車を一本遅らせ、海辺で最後まで日が落ちるのを見る',titles:['一本遅い電車','予定のない日','日が落ちるまで']}
    ],
    '歴史':[
      {id:'meiji',label:'明治の仕事と挑戦',desc:'制度が変わる時代の中で新しい役目へ。',setting:'明治三十年代の地方町',goal:'三日後までに新設鉄道の測量記録を県庁へ届ける',obstacle:'大雨で旧街道が寸断される',turn:'公文書にはない農道の情報を地元の人が持っている',climax:'役人の地図と住民の知識を合わせて別路を作る',titles:['県庁まで三日','新しい線路の前','雨の測量図']},
      {id:'taisho',label:'大正の街と秘密',desc:'新聞・写真・手紙から隠された出来事を追う。',setting:'大正七年の東京',goal:'新聞記事から消された一人の名前の理由を調べる',obstacle:'写真には写っているのに記事本文だけ名前がない',turn:'本人が事件を隠したのではなく、家族を守るため掲載を断っていた',climax:'新しい記事では実名を出さず、出来事だけを正確に残す',titles:['写真にいる人','大正七年の空欄','名前を出さない記事']},
      {id:'bakumatsu',label:'幕末の旅',desc:'立場の違う二人が同じ道を進む。',setting:'幕末の山道',goal:'夜明けまでに薬を峠の向こうの村へ届ける',obstacle:'関所が閉じ、通行証も片方にしかない',turn:'敵対する藩の者だと思っていた同行者も同じ村へ薬を運ぼうとしていた',climax:'身分を隠して抜けるのではなく、二人分の荷を一つにまとめて正式に交渉する',titles:['夜明け前の関所','二つの通行証','峠の薬箱']},
      {id:'school',label:'昔の学校を舞台にする',desc:'旧制学校で進路や学びをめぐる話。',setting:'明治末の県立学校',goal:'卒業前に海外留学の推薦を受けるか決める',obstacle:'家業を継ぐ約束と留学の機会がぶつかる',turn:'家族は留学そのものではなく、何も相談されなかったことに怒っていた',climax:'家業を捨てるか二択にせず、帰国後の計画まで含めて話し合う',titles:['消えた推薦状','汽車が出る前に','明治の春']}
    ],
    'ホラー':[
      {id:'room',label:'部屋の怪異',desc:'決まった時刻にだけ起きる現象の規則を追う。',setting:'古いアパート',goal:'毎晩零時に点く空き部屋の灯りの理由を確かめる',obstacle:'部屋は十年前から誰も借りていない',turn:'怪異は人を追っているのではなく、十年前の最後の夜を同じ順番で再現している',climax:'記録で一度だけ抜けていた行動を主人公がやり直す',titles:['消えない部屋','七回目の零時','最後の灯り']},
      {id:'rule',label:'怪異のルールを追う',desc:'守れば安全だった規則が途中で崩れる。',setting:'山あいの宿',goal:'泊まった夜を無事に越える',obstacle:'「三回ノックされても開けない」という規則がある',turn:'七回目だけノックが二回で止まり、規則そのものが変わる',climax:'宿の古い記録から、回数ではなく名前を呼ばれた時だけ危険だと突き止める',titles:['三回目は開けない','七回目の規則','名前を呼ぶ音']},
      {id:'object',label:'呪われた物を中心にする',desc:'持ち主を変えて戻ってくる物の話。',setting:'古い書店',goal:'捨てても戻る古い鏡の由来を調べる',obstacle:'鏡を持った人だけ同じ夢を見る',turn:'鏡は呪いの源ではなく、夢の中の部屋への入口だった',climax:'鏡を壊さず、映っている部屋の持ち主へ返す',titles:['戻ってくる鏡','夢の中の部屋','最後の持ち主']},
      {id:'disappear',label:'人が一人ずつ消える',desc:'名前や記録から人が消えていく。',setting:'終電後の駅',goal:'同じホームから消えた三人の共通点を探す',obstacle:'防犯映像には乗車した記録がない',turn:'三人は同じ「存在しない終電」の時刻表を見ていた',climax:'次に時刻表へ名前が出た主人公が、列車が来る前に表示板を止める',titles:['存在しない終電','0時13分のホーム','次の名前']}
    ],
    'ロードノベル':[
      {id:'return',label:'故郷へ向かう旅',desc:'いくつもの町を経て帰る理由が変わる。',setting:'海沿いの長距離バス',goal:'十年ぶりに故郷へ戻る',obstacle:'途中の町で昔の知人から別の記憶を聞く',turn:'帰る目的が謝ることから、今の相手の生活を知ることへ変わる',climax:'終点で答えを迫らず、まず一晩だけ話す',titles:['終点のひとつ前','海沿いのバス','帰る理由']},
      {id:'delivery',label:'届け物の旅',desc:'一つの荷物を届けながら人に会う。',setting:'地方鉄道',goal:'亡くなった人の荷物を三つの町へ届ける',obstacle:'受取人ごとに故人の印象がまるで違う',turn:'一人の人物像にまとめる必要はないと気づく',climax:'最後の荷物だけは自分宛てだったと分かる',titles:['三つの町へ','最後の荷物','終着駅の箱']},
      {id:'escape',label:'逃げる旅から始める',desc:'逃避が少しずつ自分の選択へ変わる。',setting:'大陸横断列車',goal:'仕事を辞めた翌日に遠くまで行く',obstacle:'目的地を決めないまま乗り継いでいる',turn:'逃げたい場所は分かっても、行きたい場所がないことに気づく',climax:'途中の町で列車を降り、初めて「ここに一週間いる」と決める',titles:['終点を決めない切符','七日だけの町','途中下車']},
      {id:'pair',label:'二人旅にする',desc:'相性の悪い二人が同じ目的地を目指す。',setting:'国境沿いの街道',goal:'三日後の式典までに同じ町へ着く',obstacle:'互いに違う道を正しいと思っている',turn:'地図の新しさではなく、雨季か乾季かで正しい道が変わる',climax:'二人の地図を重ね、途中から別の道を作る',titles:['二枚の地図','同じ町へ','三日目の分かれ道']}
    ],
    'お仕事':[
      {id:'deadline',label:'納期ものにする',desc:'期限・工程・顧客の条件を具体的に描く。',setting:'小さな制作会社',goal:'五日後までに遅れている案件を納品する',obstacle:'作業量ではなく承認待ちが全工程を止めている',turn:'担当者を増やすより、確認順序を変える方が早いと分かる',climax:'顧客と範囲を再合意し、完成部分から段階納品する',titles:['五日後の納品','止まっていた承認','最初の一便']},
      {id:'customer',label:'難しい依頼人を描く',desc:'要望の奥にある本当の目的を探る。',setting:'広告会社',goal:'三日で広告案を作る',obstacle:'依頼人が毎回「違う」と言うが理由を説明しない',turn:'欲しいのは派手な広告ではなく、古い顧客に変化を伝えることだった',climax:'コピーを増やさず、一つの事実だけを前面に出す案へ変える',titles:['三回目の修正','違う、の理由','一行だけの広告']},
      {id:'team',label:'チーム立て直しを描く',desc:'弱いチームが役割を見直す。',setting:'物流センター',goal:'繁忙期前に遅配率を下げる',obstacle:'ベテラン一人へ判断が集中している',turn:'能力差ではなく、判断基準が共有されていないことが原因だった',climax:'判断表を作り、現場で役割を分散してピークを乗り切る',titles:['判断表の一行','繁忙期前夜','一人で決めない日']},
      {id:'career',label:'転職や退職を描く',desc:'仕事を変える怖さを現実的に扱う。',setting:'都市部の会社',goal:'異動か退職かを二週間で決める',obstacle:'辞めたい理由と次にしたいことが混ざっている',turn:'嫌なのは仕事全部ではなく、今の働き方の一部だと分かる',climax:'退職届の前に条件交渉をし、残る・辞める両方の選択肢を具体化する',titles:['二週間後の返事','退職届の前に','条件を言う日']}
    ],
    '家族':[
      {id:'house',label:'家をどうするか決める',desc:'思い出と現実の負担を両方扱う。',setting:'小さな町の実家',goal:'空き家になった実家を一か月でどうするか決める',obstacle:'きょうだい全員の思い入れと負担が違う',turn:'残したいのは家全部ではなく、それぞれ違う物や場所だった',climax:'家は手放し、残したい物だけを分けて持つ',titles:['空き家の一か月','残すものを選ぶ','鍵を返す日']},
      {id:'care',label:'介護や支え方を描く',desc:'誰か一人に負担を集中させない。',setting:'地方都市',goal:'親の退院後の生活を決める',obstacle:'一人のきょうだいが全部引き受けようとする',turn:'「家族だから当然」という言葉が一番話し合いを止めていた',climax:'役割を曜日・費用・外部支援に分けて具体化する',titles:['退院日の前','家族会議の表','水曜日の担当']},
      {id:'secret',label:'家族の秘密を扱う',desc:'知らなかった過去を今の関係へ戻す。',setting:'古い家',goal:'古い戸籍と写真に残る知らない名前を調べる',obstacle:'親族ごとに話したがらない理由が違う',turn:'隠したのは恥ではなく、本人の希望を守るためだった',climax:'全員に公開せず、直接関係する人だけで記録の扱いを決める',titles:['写真の知らない名前','家族だけの記録','残す名前']},
      {id:'distance',label:'疎遠な家族との再会',desc:'元通りではなく今の距離を決める。',setting:'駅前の小さな店',goal:'十年会っていない家族と一度だけ話す',obstacle:'双方が「相手が連絡を断った」と思っている',turn:'当時の連絡先変更が伝わっておらず、最初の行き違いは意図的ではなかった',climax:'過去の責任を一度で決めず、次に会う日だけを決める',titles:['十年ぶりの席','連絡先の空白','次の日曜日']}
    ],
    '短編連作':[
      {id:'place',label:'同じ場所でつなぐ',desc:'別々の主人公が同じ場所を通る。',setting:'小さな駅',goal:'五つの短い出来事を一つの場所でつなぐ',obstacle:'各話は無関係に見える',turn:'前の話で残された物が次の話の人物を少しだけ助けている',climax:'最終話で最初の主人公が戻り、つながりに気づく',titles:['五人目の待合室','同じ駅の五つの話','最後のベンチ']},
      {id:'object',label:'一つの物でつなぐ',desc:'持ち主を変える物が各話を渡っていく。',setting:'町全体',goal:'一つの古い鍵が五人の手を渡る',obstacle:'誰も鍵が何を開けるか知らない',turn:'鍵そのものより、渡した理由が各話で少しずつ明らかになる',climax:'最後の人物が最初の持ち主へ鍵を返す',titles:['五人を渡った鍵','最後の持ち主','戻ってきた鍵']},
      {id:'day',label:'同じ一日でつなぐ',desc:'同じ日を別の視点から見る。',setting:'雨の街',goal:'一日の出来事を五人の視点で描く',obstacle:'同じ出来事の意味が人によって違う',turn:'誰かの失敗に見えたことが別の人には救いになっていた',climax:'最終話で全員が同じ場所に一瞬だけ居合わせる',titles:['同じ雨の一日','午後六時の交差点','五つの窓']},
      {id:'family',label:'世代でつなぐ',desc:'同じ家族を年代の違う人物から描く。',setting:'古い家',goal:'三世代にわたる五つの短い話をつなぐ',obstacle:'同じ家族の出来事が世代ごとに違って語られている',turn:'誰かが隠した事実ではなく、語られなかった部分が違いを生んでいた',climax:'最後の世代が古い記録を読み、語られなかった一文を足す',titles:['五つ目の家族写真','語られなかった一文','古い家の五話']}
    ]
  };

  function roleFor(g,h){
    const special={
      '青春':{小学生:'小学生',高校生:'高校生',大学生:'大学生'},
      '歴史':{高校生:'旧制中学校の生徒',大学生:'帝国大学の学生',会社員:'商社の書記',店主:'町の商人',探偵:'私立探偵',配達員:'郵便配達人',医師:'町医者',教師:'師範学校出の教師',弁護士:'代言人',小学生:'尋常小学校の児童','人ではない存在':'古いからくり人形'},
      'ファンタジー':{高校生:'見習い魔術師',大学生:'王立学院の研究生',会社員:'王都の文官',店主:'魔道具店主',探偵:'呪具調査師',旅人:'境界を渡る旅人',作家:'王都の書記',図書館司書:'禁書庫の司書',料理人:'魔獣料理人',配達員:'飛竜便の配達人',医師:'治癒術師',教師:'魔法学院教師',ミュージシャン:'音律術師',弁護士:'王都の法術士',小学生:'村の子ども','人ではない存在':'古い精霊'},
      'SF':{高校生:'軌道都市の高校生',大学生:'惑星大学の研究生',会社員:'居住区管理会社の職員',店主:'月面区画の店主',探偵:'記録犯罪調査員',旅人:'星間旅客',作家:'記憶文学の作家',図書館司書:'記憶保管庫の司書',料理人:'合成食材の料理人',配達員:'無人区画の配送員',医師:'再生医療医',教師:'遠隔教育区の教師',ミュージシャン:'重力音響の演奏家',弁護士:'AI権利を扱う弁護士',小学生:'月面学区の児童','人ではない存在':'旧式対話端末'},
      '冒険':{会社員:'隊商の記録係',高校生:'探検家見習い',大学生:'測量学校の研究生',店主:'旅装店の店主',探偵:'遺跡調査員',旅人:'旅人',作家:'探検記の書き手',図書館司書:'探検記録庫の司書',料理人:'隊商の料理人',配達員:'街道便の使者',医師:'遠征医',教師:'測量学校の教師',ミュージシャン:'旅芸人',弁護士:'国境交渉の随行員',小学生:'隊商について旅する子ども','人ではない存在':'古い案内機械'}
    };
    return special[g]?.[h]||h||'旅人';
  }
  function heroPool(g){
    if(g==='青春')return ['小学生','高校生','大学生'];
    if(g==='恋愛')return HEROES.filter(x=>!['小学生','人ではない存在'].includes(x));
    if(g==='お仕事')return HEROES.filter(x=>!['小学生','人ではない存在'].includes(x));
    return HEROES;
  }
  function routeList(){return ROUTES[state.ans.genre]||[]}
  function route(){return routeList().find(x=>x.id===state.ans.route)||null}
  function heroName(){if(state.heroName)return state.heroName.trim();const seed=`${state.ans.genre}|${state.ans.hero}|${state.ans.theme}|${state.ans.route}`;state.heroName=NAMES[hash(seed)%NAMES.length];return state.heroName}
  function names(){const h=heroName(),pool=NAMES.filter(x=>x!==h),n=hash(`${state.ans.genre}|${state.ans.theme}|${state.ans.route}|${h}`);return [pool[n%pool.length],pool[(n+11)%pool.length]]}
  function ctx(){const [a,k]=names();return{h:heroName(),a,k,r:roleFor(state.ans.genre,state.ans.hero),sym:(THEME[state.ans.theme]||THEME.秘密).sym}}
  function makeBeats(){
    const r=route(),t=THEME[state.ans.theme]||THEME.秘密,c=ctx();
    if(!r)return[];
    const b=[];
    b.push(`${r.setting}。${c.h}は${c.r}として暮らしていた。${fill(t.setup,c)}\n\nその日、${c.h}は${r.goal}ことになった。期限も条件もはっきりしていた。`);
    b.push(`${c.h}は${c.a}と準備を始めた。最初に立ちはだかったのは、${r.obstacle}ことだった。\n\n${fill(t.turn,c)}`);
    b.push(`予定どおりには進まなかった。${c.h}は一度、最初の方法に戻ろうとしたが、そこで同じ問題が起きた。${c.a}は「前と同じやり方なら、結果も同じになる」と止めた。`);
    b.push(`${r.turn}。ここで初めて、出発時に立てた計画のままでは最後まで行けないと分かった。\n\n${fill(t.choice,c)}`);
    b.push(`${c.h}と${c.a}は役割と順番を組み直した。途中で${c.k}とも向き合う必要が出たが、全部を信じる・全部を疑うという二択にはしなかった。必要な部分だけを確かめて先へ進んだ。`);
    b.push(`${r.climax}。最後の場面で${c.h}は、最初に考えていた「正しいやり方」ではなく、その場で引き受けられる選択をした。`);
    b.push(`${fill(t.after,c)}\n\n${r.setting}に戻った時、出発前と同じ景色が少しだけ違って見えた。変わったのは景色ではなく、次に同じことが起きた時の選び方だった。`);
    return b;
  }
  function chapterize(beats){
    const r=route(),t=['始まり','手がかり','行き止まり','前提が変わる','組み直す','決着','その後'];
    const ct=[r?.titles?.[0]||t[0],t[1],t[2],t[3],t[4],r?.titles?.[1]||t[5],r?.titles?.[2]||t[6]];
    if(state.ans.length==='ショートショート')return [
      {t:`第一章　${ct[0]}`,p:[beats[0],beats[1]].join('\n\n')},
      {t:`第二章　${ct[3]}`,p:[beats[2],beats[3],beats[4]].join('\n\n')},
      {t:`第三章　${ct[6]}`,p:[beats[5],beats[6]].join('\n\n')}
    ];
    if(state.ans.length==='中編')return beats.map((p,i)=>({t:`${i===6?'終章':`第${['一','二','三','四','五','六'][i]}章`}　${ct[i]}`,p}));
    return [
      {t:`第一章　${ct[0]}`,p:[beats[0],beats[1]].join('\n\n')},
      {t:`第二章　${ct[2]}`,p:beats[2]},
      {t:`第三章　${ct[3]}`,p:[beats[3],beats[4]].join('\n\n')},
      {t:`第四章　${ct[5]}`,p:beats[5]},
      {t:`第五章　${ct[6]}`,p:beats[6]}
    ];
  }
  function candidates(){const r=route();if(!r)return['まだ名前のない物語'];const base=[...(r.titles||[])];const th=state.ans.theme;if(th&&base.length<4)base.push(`${th}のあとで`);return [...new Set(base)].slice(0,4)}

  window.startCreate=function(){
    if(!user()){try{sessionStorage.setItem('mm_after_signup','create')}catch(e){}toast('先に表示名を決めてください');account();return}
    state={step:0,ans:{},options:{},unlock:{},title:'',heroName:''};renderQ();
  };
  window.renderQ=function(){
    const s=state.step||0,total=5,progress=(s/(total-1))*100;
    const base=(q,opts,nextOk)=>`<div class="question"><div class="progress"><div style="width:${progress}%"></div></div><div class="qnum">QUESTION ${s+1} / ${total}</div><h2>${q}</h2>${opts}<div class="actions"><button class="ghost" onclick="backQ()" ${s===0?'disabled':''}>戻る</button><button class="primary" onclick="nextQ()" ${nextOk?'':'disabled'}>${s===4?'タイトルへ':'次へ'}</button></div></div>`;
    if(s===0){main.innerHTML=base('どんなジャンルにする？',`<div class="options">${GENRES.map(x=>`<button class="option ${state.ans.genre===x?'active':''}" onclick="mm16Pick('genre','${x}')">${x}</button>`).join('')}</div>`,!!state.ans.genre);return}
    if(s===1){const list=heroPool(state.ans.genre);main.innerHTML=base('主人公はどんな人？',`<div class="options">${list.map(x=>`<button class="option ${state.ans.hero===x?'active':''}" onclick="mm16Pick('hero','${x}')">${x}</button>`).join('')}</div>`,!!state.ans.hero);return}
    if(s===2){main.innerHTML=base('物語の中心に置くものは？',`<div class="options">${THEMES.map(x=>`<button class="option ${state.ans.theme===x?'active':''}" onclick="mm16Pick('theme','${x}')">${x}</button>`).join('')}</div>`,!!state.ans.theme);return}
    if(s===3){const list=routeList();main.innerHTML=base('この組み合わせを、どんな展開で描く？',`<div class="meta" style="margin-bottom:12px">${escV(state.ans.genre)}に合う展開だけを表示しています。テーマは「${escV(state.ans.theme)}」として物語の中へ入ります。</div><div class="options">${list.map(x=>`<button class="option ${state.ans.route===x.id?'active':''}" onclick="mm16Pick('route','${x.id}')"><b>${escV(x.label)}</b><span class="meta" style="display:block;margin-top:4px">${escV(x.desc)}</span></button>`).join('')}</div>`,!!state.ans.route);return}
    main.innerHTML=base('どれくらいの長さにする？',`<div class="options">${LENGTHS.map(x=>`<button class="option ${state.ans.length===x?'active':''}" onclick="mm16Pick('length','${x}')">${x}</button>`).join('')}</div>`,!!state.ans.length);
  };
  window.mm16Pick=function(k,v){
    state.ans[k]=v;state.title='';state.heroName='';
    const order=['genre','hero','theme','route','length'],i=order.indexOf(k);order.slice(i+1).forEach(x=>delete state.ans[x]);
    renderQ();
  };
  window.nextQ=function(){const order=['genre','hero','theme','route','length'],k=order[state.step];if(!state.ans[k])return;if(state.step===4){titlePage();return}state.step++;renderQ()};
  window.backQ=function(){if(state.step>0){state.step--;renderQ()}};
  window.mm16Title=function(t){state.title=t;titlePage()};
  window.mm16Name=function(){const old=heroName();let n=old;while(n===old)n=NAMES[Math.floor(Math.random()*NAMES.length)];state.heroName=n;titlePage()};
  window.titlePage=function(){
    const r=route();if(!r){state.step=3;renderQ();return}const h=heroName(),cs=candidates();if(!state.title)state.title=cs[0];
    main.innerHTML=`<div class="question"><div class="qnum">FINAL STEP</div><h2>主人公の名前とタイトルを決めます。</h2><div class="card" style="margin-bottom:14px"><b>${escV(state.ans.genre)} × ${escV(state.ans.theme)}</b><div class="meta" style="margin-top:6px;line-height:1.7">主人公：${escV(roleFor(state.ans.genre,state.ans.hero))}<br>展開：${escV(r.label)}<br>舞台：${escV(r.setting)}<br>生成方式：バランス型 v16</div></div><div class="titleedit"><div class="meta" style="margin-bottom:6px">主人公の名前</div><input id="heroName" class="input" maxlength="16" value="${escV(h)}" oninput="state.heroName=this.value"><button class="ghost wide" style="margin-top:8px" onclick="mm16Name()">別の名前候補を表示</button></div><div class="titleflow" style="margin-top:18px"><div class="flow"><b>タイトル候補</b><div class="meta">選んだ展開の具体的な出来事から出しています。</div></div></div><div class="titlechoices">${cs.map(x=>`<button class="titlechoice ${state.title===x?'active':''}" onclick="mm16Title('${x.replaceAll("'","\\'")}')">${escV(x)}</button>`).join('')}</div><div class="titleedit"><div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div><input id="title" class="input" value="${escV(state.title)}" oninput="state.title=this.value"></div><button class="primary wide" style="margin-top:14px" onclick="generate()">この設定で本を作る</button><button class="ghost wide" style="margin-top:8px" onclick="state.step=4;renderQ()">前の質問に戻る</button></div>`;
  };
  window.generate=function(){
    const r=route(),u=user();if(!r||!u)return;const h=(document.getElementById('heroName')?.value||heroName()).trim()||heroName();state.heroName=h;const title=(document.getElementById('title')?.value||state.title||candidates()[0]).trim();state.title=title;
    const beats=makeBeats(),chapters=chapterize(beats),id='b'+Date.now()+Math.random().toString(36).slice(2,7);
    const b={id,title,genre:state.ans.genre,author:u.name,authorId:u.id,summary:`${r.setting}を舞台にした${state.ans.genre}。テーマは「${state.ans.theme}」。${r.desc}`,answers:{...state.ans,engine:'v16-balanced'},chapters,created:Date.now(),published:false,likes:0,shares:0};
    const all=books();all.unshift(b);saveBooks(all);showBook(id);
  };
})();
