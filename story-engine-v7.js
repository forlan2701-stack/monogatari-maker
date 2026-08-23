(function(){
  const PREV_GENERATE=window.generate;
  const PREV_TITLE=window.titlePage;
  const SKIP=new Set(['冒険','ファンタジー','ロードノベル']);
  const NAMES=['蒼','凛','紬','湊','澪','朔','奏','灯','遥','凪','蓮','結衣','美月','真帆','圭','栞','陸','奈緒','航','梓','理央','千景','宗一','悠人','玲','冬馬','啓介','志乃','朝陽','伊織','颯太','七海','琴葉','柚葉','慧','律','陽菜','咲良','樹','直人','透','紗季','和真','茜','瑞希','颯','優斗','葵','楓','朱里','海斗','由奈','誠','沙耶','晴人','杏','響','翼','香澄','新','真琴','修一','澄江','悠','佳奈','拓海','恵','亮','千尋'];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const para=(...x)=>x.filter(Boolean).join('\n\n');
  const safe=v=>typeof esc==='function'?esc(v):String(v??'');
  function uniq(hero){return shuffle(NAMES.filter(n=>n!==hero)).slice(0,5)}
  function heroName(){return (state.heroName||pick(NAMES)).trim()||pick(NAMES)}

  function historyRole(role){const m={高校生:'尋常中学校の生徒',大学生:'帝国大学の学生',会社員:'商社の書記',店主:'町の商人',探偵:'私立探偵',旅人:'旅装の青年',作家:'新聞小説の書き手',図書館司書:'図書館の書記',料理人:'洋食店の料理人',配達員:'郵便配達人',医師:'町医者',教師:'師範学校出の教師',ミュージシャン:'楽士',弁護士:'代言人',小学生:'尋常小学校の児童','人ではない存在':'古いからくり人形'};return m[role]||'町の若者'}
  function historicalPlace(place){const m={雨の街:'明治二十四年、雨の横浜',都会:'大正七年の東京',学校:'明治三十年の県立学校',小さな町:'明治末の地方町',山あいの村:'幕末の山村',海辺:'明治初年の港町',商店街:'大正期の銀座通り',駅:'鉄道開通直後の停車場',古い書店:'大正期の神田の書店',図書館:'明治末の私設図書館'};return m[place]||`明治二十年代の${place||'町'}`}

  const GENRES={
    歴史:(a,h,n)=>{const [ally,key,witness]=n,role=historyRole(a.hero),where=historicalPlace(a.place);return{
      tag:'歴史',where,role,
      object:pick(['折り目のついた受験票','赤い封蝋の公文書','雨に滲んだ電報','古い活版の校正紙']),
      goal:pick(['電信技手の採用試験に合格する','県費留学生の選抜に通る','新設新聞社の記者採用試験に挑む','鉄道局の測量助手に採用される']),
      deadline:'三日後の締切',
      obstacle:'身分や家柄を理由に「分をわきまえろ」と止める者がいる',
      turn:'提出に必要な推薦状が直前で取り消される',
      climax:'役所の鐘が鳴る前に、代わりの証明をそろえて受付へたどり着く',
      aftermath:'結果だけでなく、誰が挑戦する資格を決めるのかという空気にも小さな亀裂が入る',
      ally:`同じ下宿の${ally}`,key,witness,
      titles:['雨の停車場','消えた推薦状','鐘が鳴る前に','名簿の外側','明治の雨を越えて']
    }},
    ミステリー:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'ミステリー',where:a.place,role:a.hero,object:'鍵のない貸金庫の控え',goal:'消えた記録の持ち主を特定する',deadline:'翌朝の開店まで',obstacle:'三人の証言の時刻が食い違う',turn:'最も怪しく見えた人物には動けない時間帯があった',climax:'時計のずれと受付記録を突き合わせ、最後の一人へたどり着く',aftermath:'犯人だけでなく、なぜその嘘が必要だったのかまで明らかになる',ally:`協力者の${ally}`,key,witness,titles:['消えた記録','十二分のずれ','最後の署名','鍵のない箱','朝になる前に']}},
    恋愛:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'恋愛',where:a.place,role:a.hero,object:'返されなかった小さな封筒',goal:`${key}との関係を、このまま終わらせるか確かめる`,deadline:'相手が町を離れる前日',obstacle:'互いに「相手が望んでいない」と思い込んでいる',turn:'第三者の言葉で、離れた理由と気持ちが冷めたことは別だと分かる',climax:'別れの時間が来る前に、自分の言葉で会いに行く',aftermath:'結ばれることより、曖昧なまま終わらせない選択が残る',ally:`友人の${ally}`,key,witness,titles:['返されなかった封筒','離れた理由','駅へ向かう夜','言わなかったこと','明日の約束']}},
    青春:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'青春',where:a.place==='学校'?'放課後の学校':a.place,role:a.hero,object:'書き直しだらけの企画書',goal:'文化祭の最後の企画を完成させる',deadline:'本番まで四日',obstacle:'仲間の意見が割れ、準備が止まる',turn:'失敗の原因が能力ではなく役割の偏りにあると分かる',climax:'本番直前の欠員を受け、計画をその場で組み替える',aftermath:'成功か失敗かより、誰と何を作ったかが残る',ally:`同級生の${ally}`,key,witness,titles:['四日前の企画書','空いた席','前日の雨','開演五分前','帰り道の拍手']}},
    SF:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'SF',where:a.place==='遠い未来'?'西暦2187年、月軌道都市':`西暦2187年の${a.place}`,role:a.hero,object:'明日の日付で届いたログ',goal:'停止寸前の記憶保管庫を復旧する',deadline:'軌道夜明けまで六時間',obstacle:'復旧すると一部の個人記憶が上書きされる可能性がある',turn:'未来ログは予言ではなく、前回の失敗を繰り返さないための自動送信だった',climax:'全保存ではなく、失う情報を自分たちで選びながらシステムを再起動する',aftermath:'未来は確定していなかったが、選ばなかったものの重さは残る',ally:`技術担当の${ally}`,key,witness,titles:['明日からのログ','六時間の残量','消える記憶','再起動','朝のない都市']}},
    ホラー:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'ホラー',where:a.place,role:a.hero,object:'顔だけ消えた古い写真',goal:'午前零時になる前に写真の場所を突き止める',deadline:'午前零時',obstacle:'写真を見るたび一人ずつ名前を思い出せなくなる',turn:'怪異は新しい犠牲を求めているのではなく、忘れられた一人を思い出させようとしていた',climax:'最後の名前を声に出し、閉鎖された部屋の扉を開ける',aftermath:'朝になっても写真の一角だけは白いまま残る',ally:`同行する${ally}`,key,witness,titles:['顔のない写真','十一時四十分','忘れた名前','閉ざされた部屋','白い朝']}},
    お仕事:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'お仕事',where:a.place,role:a.hero,object:'赤字だらけの見積書',goal:'失注寸前の案件を立て直す',deadline:'翌日の最終提案',obstacle:'上司と現場で優先順位が真逆',turn:'顧客が本当に困っている点は、社内で重要視されていた部分ではなかった',climax:'完成度を下げてでも必要な機能に絞った提案へ切り替える',aftermath:'派手な成功より、仕事の進め方そのものが変わる',ally:`同僚の${ally}`,key,witness,titles:['赤字の見積書','聞いていない要望','前夜の会議','削る決断','翌朝の提案']}},
    家族:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'家族',where:a.place,role:a.hero,object:'家計簿に挟まれた古い領収書',goal:'家を手放す本当の理由を確かめる',deadline:'週末の家族会議まで',obstacle:'「心配させたくなかった」という理由で誰も全体を話さない',turn:'一人の秘密だと思っていたことが、家族全員の黙った合意だった',climax:'守られる側をやめ、自分の希望と負担できることを数字で話す',aftermath:'問題は残るが、黙って決めないという新しい約束ができる',ally:`家族の相談相手${ally}`,key,witness,titles:['古い領収書','食卓の沈黙','誰が決めたのか','家を売る日','新しい約束']}},
    ほっこり:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'ほっこり',where:a.place,role:a.hero,object:'名前のない小さな弁当箱',goal:'閉店する店の最後の一日を開く',deadline:'日曜日の閉店まで',obstacle:'手伝う人は多いのに、店主本人だけが続ける気を失っている',turn:'店を残すことと、同じ形で続けることは別だと分かる',climax:'一日だけの食卓を開き、店のレシピを町のみんなへ渡す',aftermath:'店は閉じても、味と人のつながりは別の場所へ続く',ally:`常連の${ally}`,key,witness,titles:['最後の日曜日','空の弁当箱','一日だけの食卓','閉店時間','次の台所']}},
    日常:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'日常',where:a.place,role:a.hero,object:'何度も書き直された回覧板',goal:'町内の小さな行事を予定通り終える',deadline:'今週の日曜日',obstacle:'誰も悪くないのに少しずつ予定がずれる',turn:'問題は大事件ではなく、全員が遠慮して本音を言わなかったことだった',climax:'完璧を諦め、できる人だけで小さく実行する',aftermath:'何も劇的には変わらないが、次から相談しやすくなる',ally:`近所の${ally}`,key,witness,titles:['回覧板の余白','雨天中止ではなく','日曜日の朝','小さく始める','月曜の町']}},
    ヒューマンドラマ:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'ヒューマンドラマ',where:a.place,role:a.hero,object:'署名のない申請書',goal:'人生を左右する決定に自分の意思を取り戻す',deadline:'月末の手続きまで',obstacle:'周囲は善意で「これが一番」と答えを決めている',turn:'正解を選ぶ話ではなく、誰が決めるかの話だと気づく',climax:'反対されると分かっていても、自分の条件を言葉にして提出する',aftermath:'すべてが丸く収まらなくても、自分の人生の主語が戻る',ally:`友人の${ally}`,key,witness,titles:['署名のない紙','正しい答え','月末まで','自分の条件','名前を書く']}},
    不思議:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'不思議',where:a.place,role:a.hero,object:'雨の日だけ文字が増える切符',goal:'切符に書かれた最後の駅を確かめる',deadline:'次の雨が止むまで',obstacle:'駅名は地図にも時刻表にも存在しない',turn:'切符は場所ではなく、過去に行かなかった選択を示していた',climax:'存在しないホームで、乗るか破るかを自分で決める',aftermath:'現実へ戻っても、切符の裏に一文字だけ新しい字が残る',ally:`付き添う${ally}`,key,witness,titles:['雨の日の切符','ない駅','三番線の向こう','乗らない選択','乾いた紙']}},
    短編連作:(a,h,n)=>{const[ally,key,witness]=n;return{tag:'短編連作',where:a.place,role:a.hero,object:'同じ赤い傘',goal:'別々の三人に渡った一つの物を追う',deadline:'三日間',obstacle:'各話ではまったく別の問題に見える',turn:'三人の選択が次の人物の一日を少しずつ変えていた',climax:'最後の人物が、最初の人物へ物を返す',aftermath:'直接会わない人同士の選択が一つの輪になる',ally:`一話目の${ally}`,key,witness,titles:['一日目　赤い傘','二日目　忘れ物','三日目　返す人','つながった三日間','雨上がり']}}
  };

  function fallbackGenre(a,h,n){const[ally,key,witness]=n;return{tag:a.genre,where:a.place,role:a.hero,object:'古い封筒',goal:'目の前の問題を期限までに解決する',deadline:'三日後',obstacle:'最初に信じた説明だけでは筋が通らない',turn:'別の証言で前提が崩れる',climax:'自分で選んだ方法で最後の決断をする',aftermath:'結果より、選び方が変わったことが残る',ally:`知人の${ally}`,key,witness,titles:['始まり','違和感','前提が崩れる','選ぶ','その後']}}

  function themeArc(theme,c,h){const k=c.key;const M={
    '忘れられない約束':{incite:`${h}には、${k}と交わしたまま果たせていない約束がある。その約束が今回の${c.goal}に直接関わっていた。`,pressure:'約束を守るには、今の自分が大切にしているものを一つ手放す必要がある。',turn:'約束の言葉そのものより、なぜ交わしたかを思い出す。',choice:`約束を形だけ守るのではなく、${k}に今の事情を伝えた上で新しい形を選ぶ。`,resolve:'約束は昔のままでは果たされなかったが、二人で意味を更新した。',noun:'約束'},
    秘密:{incite:`${c.object}には、${k}が隠してきた事実が記されていた。それを知らなければ${c.goal}は進められない。`,pressure:'秘密を暴けば前へ進めるが、関係まで壊す可能性がある。',turn:'隠した事実と、隠した理由は同じではないと分かる。',choice:'人前で暴くのではなく、必要な人だけで事実を共有する。',resolve:'秘密は消えたのではなく、誰が何を背負うかが変わった。',noun:'秘密'},
    再会:{incite:`${c.goal}のために必要な人物が、何年も会っていなかった${k}だった。`,pressure:'昔の別れを清算しないまま協力しなければならない。',turn:'二人は同じ出来事を、互いに「拒絶された」と覚えていた。',choice:'昔に戻るのではなく、今の関係を一から作る。',resolve:'再会は答え合わせではなく、次に会う理由を作った。',noun:'再会'},
    挑戦:{incite:`${h}は以前、${c.goal}に一度失敗している。今回の機会は二度目で、${c.deadline}を逃せば当分次はない。`,pressure:'前回と同じやり方を続ければ、同じ場所で崩れることが分かっている。',turn:'失敗の原因は才能不足ではなく、一人で抱え込み、途中で方法を変えなかったことだった。',choice:'恥を承知で助けを求め、やり方を変えて再挑戦する。',resolve:'結果だけでなく、「失敗した後に方法を変えた」という事実が残った。',noun:'再挑戦'},
    家族:{incite:`${c.object}に家族の名前が残っていた。${c.goal}は、家族が隠してきた事情と切り離せなかった。`,pressure:'守るために黙った家族と、知らされなかった側の怒りがぶつかる。',turn:'一人の判断ではなく、家族全員がそれぞれの理由で沈黙していた。',choice:'守られる側に留まらず、自分の希望と責任を言葉にする。',resolve:'問題は残っても、今後は黙って決めないという約束ができた。',noun:'家族'},
    '一冊の本':{incite:`${c.object}の中に、一冊の本から写した文章が挟まっていた。その一節が${c.goal}の手がかりになる。`,pressure:'誰かの言葉を自分の答えにしてしまいそうになる。',turn:'同じ一節を読んだ人が、まったく違う選択をしていたと分かる。',choice:'本の答えではなく、自分が今どう読むかを決める。',resolve:'本は答えをくれず、考え直すための余白だけを残した。',noun:'一冊'},
    手紙:{incite:`${c.object}に、${h}宛ての未開封の手紙が重ねられていた。差出人は${k}だった。`,pressure:'読むこと自体が、終わったはずの関係を開き直す行為になる。',turn:'手紙は今書かれたものではなく、届かなかった過去の言葉だった。',choice:'返事を強制されるのではなく、今の自分として返すかどうかを決める。',resolve:'遅れて届いた言葉にも、今から返事をする自由があると知った。',noun:'手紙'},
    夢:{incite:`${c.goal}は、${h}が一度あきらめた夢と同じ方向にあった。`,pressure:'現実的でいることと、もう一度望むことがぶつかる。',turn:'夢を続けるか捨てるかではなく、形を変える選択肢があると分かる。',choice:'昔と同じ形には戻らず、今できる方法で再開する。',resolve:'夢は叶ったのではなく、もう一度予定表の中に戻った。',noun:'夢'},
    居場所:{incite:`${c.goal}を進めるほど、${h}は「自分だけここにいてよいのか」という違和感を強くする。`,pressure:'役に立てなければ居場所を失うと思い込む。',turn:'他の人もまた、自分が必要とされる理由を探していたと知る。',choice:'認められるのを待つのではなく、自分から関わり方を提案する。',resolve:'居場所は席ではなく、関わり続けることで作られていった。',noun:'居場所'},
    失くしもの:{incite:`${c.object}の中から、${h}が何年も前に失くしたと思っていた物が出てくる。`,pressure:'取り戻したい気持ちと、今さら戻しても意味がない気持ちがぶつかる。',turn:'失くした物より、それがなくなった日に何を諦めたかの方が大きかったと分かる。',choice:'物だけを取り戻すのではなく、その時やめたことを一つ再開する。',resolve:'失くしものは戻ったが、同じ時間は戻らない。その違いを受け入れた。',noun:'失くしもの'},
    嘘:{incite:`${c.goal}の途中で、${k}の説明に明らかな嘘が一つ見つかる。`,pressure:'嘘がある以上、全部を疑うべきか迷う。',turn:'嘘は利益のためではなく、別の誰かを守るためにつかれていた。',choice:'嘘を許すかではなく、これから何を事実として共有するか決める。',resolve:'信頼は元に戻らず、確認できることから作り直すことになった。',noun:'嘘'},
    時間:{incite:`${c.object}の日付が、${h}にとって忘れられない一日と一致していた。`,pressure:'過去をやり直せないのに、答えだけを求め続けている。',turn:'変えられないのは出来事であって、その後の選び方ではない。',choice:'過去の正解探しをやめ、今できる一つの行動を選ぶ。',resolve:'時間は戻らない。それでも、その日の意味は少し変わった。',noun:'時間'},
    赦し:{incite:`${c.goal}のためには、${h}を傷つけた${k}と再び協力しなければならない。`,pressure:'事情を理解することが、傷をなかったことにするようで怖い。',turn:'理由があっても傷ついた事実は消えず、赦すことと元通りになることは別だと分かる。',choice:'距離は残したまま、今必要な協力だけを自分の意思で選ぶ。',resolve:'赦しは関係を戻すことではなく、過去だけに次の選択を決めさせないことだった。',noun:'赦し'},
    別れ:{incite:`${c.goal}が終われば、${k}とは別の道へ進むことが決まっている。`,pressure:'終わらせることを失敗だと思いたくない気持ちが残る。',turn:'続けることだけが大切にする方法ではないと分かる。',choice:'曖昧に消えるのではなく、終わる日を自分たちで決める。',resolve:'別れは消失ではなく、関係に区切りを与えた。',noun:'別れ'},
    始まり:{incite:`${c.goal}は、${h}にとって初めて自分で選んだ新しい役割につながっていた。`,pressure:'始めた瞬間から上手くできなければならないと思い込む。',turn:'最初から正しい人はいないと、先に始めた人の失敗を知る。',choice:'準備が整うのを待たず、小さく始める。',resolve:'始まりは大きな決意ではなく、次の日も続ける予定を入れることだった。',noun:'始まり'},
    願い:{incite:`${c.goal}が叶えば、${h}が長く願っていたことにも手が届く。しかし同時に誰かが代償を負う。`,pressure:'自分の願いを優先することへの罪悪感が生まれる。',turn:'願いを諦めるか叶えるかの二択ではなく、代償の分け方を変えられると分かる。',choice:'一人で得る願いではなく、条件を変えて皆が納得できる形を探す。',resolve:'願いはそのまま叶わなかったが、自分で選んだ形で前へ進んだ。',noun:'願い'}
  };return M[theme]||M['秘密']}

  function endingLine(a,h){const m={希望が残る:`${h}は、次に同じ場面が来た時は前より少し違う選び方ができると思った。`,大逆転:'最後に届いた知らせで、結果は誰も予想しなかった方向へひっくり返った。',少し切ない:'失ったものは戻らなかった。それでも、失ったことを知ったまま歩けると思った。',謎が残る:'すべて説明できたはずなのに、最後の一つだけは誰の記憶にもなかった。',幸せになる:'大きな奇跡ではなく、翌日の予定を一緒に決められることがうれしかった。',静かな余韻:'答えは言葉にならないまま、景色だけが少し違って見えた。',再出発する:'翌朝、最初の一歩だけを予定表に書いた。',少し笑える:'最後だけは拍子抜けするほどくだらない理由で、みんなが笑った。',未来につながる:'その選択は、まだ名前のない次の物語につながっていた。',ほろ苦い:'正しかったとは言えない。それでも、自分で選んだことだけは残った。'};return m[a.ending]||m['希望が残る']}

  function buildBook(){const a=state.ans,u=user();const h=heroName();state.heroName=h;const n=uniq(h);const base=(GENRES[a.genre]||fallbackGenre)(a,h,n);const arc=themeArc(a.theme,base,h);const scene=`${base.where}。${h}は${base.role}として暮らしていた。`;
    const ch=[
      {t:`第一章　${base.titles[0]}`,p:para(scene,`${h}の前に${base.object}が現れた。今回の目的は「${base.goal}」。期限は${base.deadline}だった。`,arc.incite,`${base.ally}は、最初に「何を確かめるべきか」を紙に三つだけ書いた。`)},
      {t:`第二章　${base.titles[1]}`,p:para(`${h}たちは動き始めたが、${base.obstacle}。`,arc.pressure,`${h}は前へ進もうとするほど、選んだテーマ「${a.theme}」から逃げられなくなった。`,`${base.witness}の話から、最初に聞いていた説明には抜けがあると分かった。`)},
      {t:`第三章　${base.titles[2]}`,p:para(`${base.turn}。`,arc.turn,`${h}は一度、ここでやめることも考えた。しかし${base.deadline}は待ってくれない。`,`${base.ally}は答えを出さず、「前回と同じやり方をするかだけ決めよう」と言った。`)},
      {t:`第四章　${base.titles[3]}`,p:para(`${h}は${base.key}と正面から話した。`,`${arc.choice}`,`その選択の直後、${base.climax}。`,`${h}は結果より先に、自分が何を変えたのかを理解した。`)},
      {t:`第五章　${base.titles[4]}`,p:para(`${base.aftermath}。`,arc.resolve,endingLine(a,h))},
      {t:'第六章　翌日の記録',p:para(`${h}は翌日、今回の出来事を短く記録した。そこに書いたのは成功や失敗の判定ではなく、どこで迷い、何を変えたかだった。`,`${base.ally}はその記録を読み、「次に同じことが起きても、同じ話にはならないね」と言った。`,arc.resolve)},
      {t:'終章　選び直したあと',p:para(`${base.where}の景色は変わっていなかった。変わったのは、${h}が「${a.theme}」をただの言葉ではなく、自分の選択として持つようになったことだった。`,endingLine(a,h))}
    ];
    let chapters=a.length==='ショートショート'?[ch[0],ch[2],ch[4]]:a.length==='中編'?ch:ch.slice(0,5);
    const title=(document.getElementById('title')?.value||state.title||'').trim()||`${arc.noun}の物語`;
    const b={id:'b'+Date.now(),title,genre:a.genre,author:u.name,authorId:u.id,likes:0,shares:0,summary:`${a.genre}／テーマ「${a.theme}」。${base.where}を舞台に、${h}が「${base.goal}」へ進む中で${arc.noun}と向き合う物語。`,answers:{...a,heroName:h},chapters,created:Date.now(),published:false,coverSeed:Math.random(),coverStyle:Math.floor(Math.random()*4)};
    const all=books();all.unshift(b);saveBooks(all);showBook(b.id)
  }

  function titleCandidates(){const a=state.ans,h=heroName();state.heroName=h;const n=uniq(h);const base=(GENRES[a.genre]||fallbackGenre)(a,h,n);const arc=themeArc(a.theme,base,h);if(a.genre==='歴史')return [`${base.titles[0]}と${arc.noun}`,`${base.titles[2]}`,`${historicalPlace(a.place)}、${arc.noun}`,`${base.object.replace('古い','').replace('折り目のついた','')}の夜`,`鐘が鳴る前に`];return [`${base.titles[0]}`,`${arc.noun}と${base.object.replace('古い','').replace('小さな','')}`,`${base.titles[2]}`,`${a.place}の${arc.noun}`,`${base.titles[4]}`]}

  window.mmChooseV7Title=function(t){state.title=t;window.titlePage()};
  window.titlePage=function(){const a=state?.ans||{};if(SKIP.has(a.genre))return PREV_TITLE();if(!state.heroName)state.heroName=pick(NAMES);const c=titleCandidates();if(!state.title||/^.+を話す夜$/.test(state.title)||state.title.includes('向こう側'))state.title=c[0];const context=(GENRES[a.genre]||fallbackGenre)(a,state.heroName,uniq(state.heroName));const arc=themeArc(a.theme,context,state.heroName);
    main.innerHTML=`<div class="question"><div class="qnum">FINAL STEP</div><h2>主人公の名前と、本のタイトルを決めます。</h2><div class="card" style="margin-bottom:14px"><div class="meta">今回の物語の核</div><b>${safe(a.genre)} × テーマ「${safe(a.theme)}」</b><div class="meta" style="margin-top:5px;line-height:1.65">舞台：${safe(context.where)}<br>外側の目的：${safe(context.goal)}<br>内側のテーマ：${safe(arc.noun)}</div></div><div class="titleedit"><div class="meta" style="margin-bottom:6px">主人公の名前</div><input id="heroName" class="input" maxlength="16" value="${safe(state.heroName)}" oninput="state.heroName=this.value" placeholder="好きな名前を入力"><button class="ghost wide" style="margin-top:8px" onclick="state.heroName='${pick(NAMES)}';state.title='';titlePage()">別の名前候補を表示</button></div><div class="titleflow" style="margin-top:18px"><div class="flow"><b>タイトル候補</b><div class="meta">ジャンルとテーマの両方から候補を作っています。</div></div></div><div class="titlechoices">${c.map(t=>`<button class="titlechoice ${state.title===t?'active':''}" onclick="mmChooseV7Title('${t.replaceAll("'","\\'")}')">${safe(t)}</button>`).join('')}</div><div class="titleedit"><div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div><input id="title" class="input" value="${safe(state.title)}" oninput="state.title=this.value" placeholder="好きなタイトルを入力"></div><button class="primary wide" style="margin-top:14px" onclick="generate()">この設定で本を作る</button><button class="ghost wide" style="margin-top:8px" onclick="state.step=qs.length-1;renderQ()">前の質問に戻る</button></div>`
  };

  window.generate=function(){if(SKIP.has(state?.ans?.genre))return PREV_GENERATE();return buildBook()};
})();