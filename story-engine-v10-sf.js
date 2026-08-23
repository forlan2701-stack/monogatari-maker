(function(){
  const baseRender=window.renderQ;
  const baseTitle=window.titlePage;
  const baseGenerate=window.generate;
  const STEP_KEYS=['genre','mood','hero','place','theme','core','ending','length'];
  const NAMES=['蒼','凛','紬','湊','澪','朔','奏','灯','遥','凪','蓮','結衣','美月','真帆','圭','栞','陸','奈緒','航','梓','理央','千景','宗一','悠人','玲','冬馬','啓介','志乃','朝陽','伊織','颯太','七海','琴葉','柚葉','慧','律','陽菜','咲良','樹','直人','透','紗季','和真','茜','瑞希','颯','優斗','葵','楓','朱里','海斗','由奈','誠','沙耶','晴人','杏','響','翼','香澄','新','真琴','修一','澄江','悠','佳奈','拓海','恵','亮','千尋'];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const escx=v=>typeof esc==='function'?esc(v):String(v??'');
  const para=(...xs)=>xs.filter(Boolean).join('\n\n');
  const sfCore={
    '忘れられない約束':['冷凍睡眠に入った友人との約束が百年後に届く','故人の記憶コピーが約束の続きを求めてくる','地球を離れる前に交わした約束の記録だけが残る','約束を果たすと別の居住区が犠牲になる'],
    '秘密':['自分の記憶領域だけ閲覧制限されている','家族の遺伝情報に隠された移住記録がある','AIが一人の名前だけ航行記録から消している','公開すると植民都市の存続に関わるデータを見つける'],
    '再会':['冷凍睡眠から戻った友人だけ年を取っていない','火星へ行った初恋の相手が十八年ぶりに帰還する','失踪した乗員が別の身体で戻ってくる','昔のライバルと同じ救難任務に選ばれる'],
    '挑戦':['一度落ちた火星移住選抜に再招集される','失敗した船外活動試験にもう一度挑む','誰も成功していない航路の操縦を任される','AIが算出した不合格予測を覆す条件を探す'],
    '家族':['家族に黙って地球帰還申請が出されている','両親が自分だけを火星へ残す計画を立てている','家族の記憶バックアップに知らない子どもの記録がある','家族全員の寿命を左右する治療を一人だけ選ばなければならない'],
    '一冊の本':['紙の本に未来の日付の書き込みがある','全電子化された都市で一冊だけ検索不能の本が見つかる','本の余白が読者の記憶に合わせて変わる','最後の一頁だけ地球にしか存在しない本を追う'],
    '手紙':['十八年前に火星から送られた通信が今届く','差出人が未来の自分になっているメッセージを受け取る','光速遅延で届いた手紙の返事を今さら書く','亡くなった乗員が予約送信した最後の通信が届く'],
    '夢':['昔あきらめた火星移住計画から再選考通知が届く','消去したはずの夢の記憶がバックアップから復元される','叶った夢を見せる未来シミュレーションが不幸な結末を示す','AIが本人より先に「本当に望んでいた進路」を申請している'],
    '居場所':['地球にも火星にも住民権を持てない状態になる','閉鎖予定の小型居住区を残す方法を探す','新しい植民都市で自分だけ重力環境に適応できない','人間とAIのどちらの共同体にも属せない主人公が選ぶ'],
    '失くしもの':['消えた十年分の記憶バックアップを探す','宇宙船でなくした物が別の惑星から戻ってくる','失くした端末を追ううち行方不明の乗員に行き着く','なくしたと思った記憶が他人のバックアップに保存されている'],
    '嘘':['AIの安全報告だけが毎回同じ嘘をついている','家族を守るための偽の地球帰還記録が見つかる','自分の経歴データだけ一年分書き換えられている','嘘だと思った救難信号だけが本物だった'],
    '時間':['同じ六時間をシミュレーション内で繰り返す','十年前の事故を現在の量子記録で追う','残り六時間で都市を救う選択を迫られる','未来から届くログが一回ごとに内容を変える'],
    '赦し':['事故の原因を作った相手と救難任務で組む','謝罪する記憶コピーを本人として許せるか迷う','自分の判断で失った乗員の記録と向き合う','赦さないまま同じ船で働く方法を選ぶ'],
    '別れ':['地球を離れる日を自分で決める','意識コピーだけを残して身体は旅立つ','閉鎖される居住区で最後の一日を過ごす','帰還不能の船へ乗る相手を見送る'],
    '始まり':['新設火星都市の最初の住民になる','記憶を一部失った状態で新しい仕事を始める','人間とAIが共同運営する都市の初日を迎える','一度失敗した宇宙船計画を別の形で再始動する'],
    '願い':['一つだけ人生の分岐を選べる予測装置を使う','願いを叶える代わりに一つの記憶を失う','自分と家族の願いが同時には叶わない移住枠を争う','AIに願いを最適化された結果、本心と違う未来が提示される']
  };
  function placeOf(p){const m={小さな町:'西暦2187年、人口八千人の小型居住区ミナト',都会:'西暦2187年、地球軌道都市アウレア',学校:'月面学区セレネ第七校',古い書店:'軌道都市の紙書籍保存区',海辺:'火星第三ドームの人工海岸',遠い未来:'西暦2312年の地球圏',図書館:'月面記憶図書館',雨の街:'人工降雨区画レイン・セクター',山あいの村:'火星峡谷の採掘村',古いアパート:'旧式居住棟C-14',商店街:'軌道都市の市場層',島:'海上自律都市ノア',喫茶店:'月面第二区画の喫茶ドーム',病院:'再生医療センター',駅:'軌道エレベーター中央駅',異世界:'観測外宇宙の植民惑星エルダ'};return m[p]||`西暦2187年の${p||'居住区'}`}
  function roleOf(r){const m={高校生:'軌道都市の高校生',大学生:'惑星大学の研究生',会社員:'居住区管理会社の職員',店主:'月面区画の店主',探偵:'記録犯罪を扱う調査員',旅人:'星間旅客',作家:'記憶文学の作家',図書館司書:'記憶保管庫の司書',料理人:'合成食材を扱う料理人',配達員:'無人区画の配送員',医師:'再生医療医',教師:'遠隔教育区の教師',ミュージシャン:'重力音響の演奏家',弁護士:'AI権利を扱う弁護士',小学生:'月面学区の児童','人ではない存在':'旧式の対話端末'};return m[r]||'軌道都市の住人'}
  function coreList(theme){return sfCore[theme]||[`「${theme}」に関わる記憶データが未来から届く`,`AIが「${theme}」に関する判断を本人より先に下す`,`宇宙航行の記録から「${theme}」に関わる事実が消えている`,`火星と地球で「${theme}」の意味が食い違っている`]}
  function arcFor(a,h,key){
    const c=a.core||coreList(a.theme)[0],place=placeOf(a.place),t=a.theme;
    const common={place,core:c};
    const A={
      '夢':{title:'再選考通知',hook:`${place}で暮らす${h}の端末に、十一年前に不合格だった火星移住計画《ORBIT-9》から再選考通知が届いた。申請履歴には、${h}自身が昔書いた「条件が変わったら再審査を希望する」という一文が残っていた。`,problem:`当時、${h}は不合格を「自分には向いていなかった証拠」として夢ごと閉じた。だが現在の審査AIは、十一年前の放射線リスク計算に重大な誤差があったため、旧候補者を再評価していると告げた。`,investigate:`${h}は${key}と旧審査ログを開き、技能評価、健康データ、当時のリスクモデルを分けて確認した。技能評価は合格圏内だった。落ちた理由は、本人の能力ではなく当時の航行条件だった。`,complication:`ただし、今合格すれば九年間は地球圏へ戻れない。昔の夢が戻ったからといって、今の生活まで昔に戻るわけではなかった。`,twist:`さらに再審査はAIが勝手に復活させたのではなかった。十一年前の${h}自身が「未来の自分に最終判断を渡す」と設定していた。過去の自分は、夢を押しつけず選択肢だけ残していたのだ。`,decision:`${h}は「昔の自分のために行く」のをやめた。現在の生活、九年という時間、火星で本当にやりたい仕事を書き出し、永久移住ではなく一年間の先行調査任務へ応募し直した。`,climax:`締切三分前、申請端末には「夢を継続」ではなく「計画を再設計」の項目が点灯した。${h}はそこへ署名した。`,after:`夢は十一年前の形では叶わなかった。それでも、捨てたはずの夢をそのまま拾うのではなく、今の自分に合う形へ作り直せた。`,titles:['十一年前の再選考','ORBIT-9','九年後の帰還','過去の自分からの申請','計画を再設計','締切三分前','火星行きの一年']},
      '時間':{title:'六時間の反復',hook:`${place}で${h}が目を覚ますと、端末は毎回同じ時刻「18:00」を示した。六時間後に居住区の酸素循環が停止し、00:00になると意識だけが18:00へ戻る。`,problem:`繰り返すたび設備は元に戻るが、${h}だけが前の六時間を覚えていた。最初の三回、${h}は同じ修理を試して同じ場所で失敗した。`,investigate:`${key}の協力で、失敗した操作ではなく「何を確認せずに始めたか」を記録した。すると停止直前、外部から一秒だけ別系統の制御信号が入っていると分かった。`,complication:`反復を止めるには、その信号を遮断する必要がある。しかし遮断すると、次に失敗しても時間は戻らない。`,twist:`信号は未来からの救済ではなく、事故調査用AIが作った閉鎖シミュレーションだった。${h}は実際の事故後、再発防止訓練の中にいた。`,decision:`${h}は「正解を見つけるまで繰り返す」のではなく、一度しかない本番を想定してチーム全員へ判断を分ける。`,climax:`最後の反復で、${h}は自分だけが知る手順を全部共有し、00:00を迎える前に循環系を再起動した。時計は初めて00:01へ進んだ。`,after:`過去の事故は変わらない。それでも次に同じ故障が起きた時、知識が一人に閉じない仕組みだけは残った。`,titles:['18時00分','六時間目','一秒の信号','反復を止める','最後の18時','00時01分','訓練終了']},
      '家族':{title:'地球帰還申請',hook:`${place}の家族共有端末に、${h}の知らない地球帰還申請が見つかった。申請者欄には家族全員の認証があるのに、${h}だけ署名していない。`,problem:`帰還枠は一世帯につき一回。使えば火星へ戻る権利を失う可能性がある。家族は「まだ決定ではない」と言うが、提出期限は四日後だった。`,investigate:`${h}は${key}と医療記録、生活費、帰還条件を一つずつ確認した。すると家族の一人に火星では治療できない疾患が見つかっていた。`,complication:`家族は${h}の仕事を中断させたくなくて病気を隠し、全員で地球へ戻る案だけ先に用意していた。`,twist:`しかし制度を読み直すと「一世帯全員が同時帰還」の義務はなかった。家族は古い規則のまま思い込んでいた。`,decision:`${h}は誰かを残す／全員戻るの二択をやめ、治療する人だけ先に帰還し、自分は一定期間後に合流する計画を申請した。`,climax:`家族会議で初めて、心配だから黙るのではなく、病気・仕事・お金を同じ画面に並べて話した。`,after:`家族は同じ場所にいることより、同じ情報を持って選べることを優先した。`,titles:['署名のない帰還申請','四日後の締切','隠された医療記録','古い規則','別々に帰る','家族会議','二つの航路']},
      '手紙':{title:'十八年遅れの通信',hook:`${place}の通信局へ、十八年前に火星から送信された私信がようやく届いた。宛先は${h}、差出人はもう亡くなっている${key}だった。`,problem:`当時の通信障害で失われたと思われていた手紙には、「返事を待っている」と書かれていた。今は返事を受け取る本人がいない。`,investigate:`${h}は通信経路を追い、手紙が偽物ではなく、小惑星中継器に保存されたまま十八年間再送を繰り返していたことを確かめた。`,complication:`返事を書く意味があるのか。AIは「受信者不在」と表示するだけだった。`,twist:`${key}は同時に、将来の家族へ転送される公開アーカイブも設定していた。返事は本人には届かなくても、残された人には届く。`,decision:`${h}は十八年前の自分のふりをせず、今の自分として返事を書く。許したとも忘れたとも書かず、届かなかった時間に何があったかを記した。`,climax:`送信ボタンを押すと、推定到着先は「火星家族アーカイブ・三日後」と表示された。`,after:`遅れて届いた言葉は過去を変えなかったが、返事をする相手が「過去の人」だけとは限らないと分かった。`,titles:['十八年遅れ','中継器の手紙','返事を待っている','受信者不在','今の自分から','三日後の到着','遅い返信']},
      '失くしもの':{title:'消えた十年',hook:`${place}で${h}の個人記憶バックアップから、十年間分だけが空白になっていると判明した。端末には削除履歴すら残っていない。`,problem:`空白の最後の日、${h}は${key}と同じ航行任務に参加していた。${h}は事故のことだけ断片的に覚えている。`,investigate:`医療ログ、船内映像、外部バックアップを照合すると、記憶は事故で失われたのではなく、帰還後に本人認証で隔離されていた。`,complication:`隔離領域を開けば記憶は戻るが、強い外傷反応が再発する可能性がある。`,twist:`隔離を選んだのは医師でも家族でもなく、事故直後の${h}自身だった。「十年後の自分に開くか決めさせる」と記録していた。`,decision:`${h}は全部を一度に戻さず、一時間分ずつ${key}と確認する方法を選ぶ。`,climax:`最初に戻った記憶は事故そのものではなく、救出後に皆で交わした短い会話だった。失くした十年は恐怖だけでできていなかった。`,after:`記憶はまだ全部戻っていない。それでも、失くしたものを取り戻す速度まで過去の自分に決めさせる必要はなかった。`,titles:['空白の十年','削除履歴なし','本人認証','十年後の自分へ','一時間ずつ','最初に戻った声','未復元']},
      '赦し':{title:'救難船の二人',hook:`${place}で救難警報が鳴り、${h}は救難船の乗員に指名された。相棒欄にあったのは、七年前の事故で${h}を傷つけた${key}の名前だった。`,problem:`七年前、${key}の判断で区画が切り離され、${h}の親しい乗員が帰れなくなった。事情は理解しても、許せたことは一度もない。`,investigate:`任務前に当時のログを見直すと、${key}の判断は規則どおりだったが、避難人数の報告に誤りがあったと分かった。`,complication:`だからといって傷が消えるわけではない。しかも今回も、同じように一部を切り離す判断が必要になる。`,twist:`今回の救難対象には、七年前と同じ誤った人数集計が使われていた。問題は${key}一人ではなく、修正されなかった仕組みにもあった。`,decision:`${h}は${key}を許すことを任務の条件にしない。代わりに判断を二人だけで抱えず、人数確認を別系統へ二重化する。`,climax:`切り離し直前、二重確認で一人の取り残しが見つかり、作業は十二秒遅れて全員を回収した。`,after:`帰還後も${h}は「もう大丈夫」とは言わなかった。ただ、次に同じ船へ乗るかを過去だけで決める必要はなくなった。`,titles:['七年前の相棒','同じ警報','二重確認','十二秒','切り離さない判断','帰還','許さないまま']}
    };
    if(A[t])return {...common,...A[t]};
    const core=c;
    return {...common,title:t,hook:`${place}で${h}は「${core}」という出来事に直面した。同時に、都市AIから六時間以内の判断を求める通知が届いた。`,problem:`テーマは「${t}」。しかしAIが示す最適解と、${h}が守りたいものは一致しなかった。`,investigate:`${h}は${key}とログ、本人の記憶、制度上の条件を分けて確認した。`,complication:`調べるほど、何か一つを守れば別の一つを失う構造がはっきりした。`,twist:`最適解は未来を保証する答えではなく、過去の平均から作った予測にすぎなかった。`,decision:`${h}はAIの答えを採用するか拒否するかではなく、自分で条件を変更して第三の案を作る。`,climax:`期限直前、変更した条件で再計算すると、成功率は下がったが失うものを一人に押しつけない案になった。`,after:`未来は不確実なままだった。それでも「最適」ではなく「選んだ」未来が残った。`,titles:['六時間の通知','最適解','条件を変える','再計算','成功率72％','選んだ未来','軌道夜明け']};
  }
  function endingLine(a,h){const m={'希望が残る':`${h}は、次に同じ選択が来ても、今度は誰かの計算だけに答えを預けないと思った。`,'大逆転':'最後の再計算で、前提にしていた数字そのものが反転した。','少し切ない':'選ばなかった未来は消えた。それでも、選んだ方を自分のものとして歩くしかなかった。','謎が残る':'すべてのログを閉じたあとも、送信元不明の一行だけが残っていた。','幸せになる':'大きな成功より、次の食事を誰かと決められることの方がうれしかった。','静かな余韻':'人工夜明けの光が窓を横切り、答えの出ない部分だけが静かに残った。','再出発する':'翌朝、${h}は新しい申請番号を一つ取得した。','少し笑える':'最後にAIが出した「最適な休息時間」だけは、全員一致で無視された。','未来につながる':'その選択は、まだ記録されていない未来の最初の一行になった。','ほろ苦い':'正解だったとは言えない。それでも、誰かの最適解ではなく自分で選んだ。'};return m[a.ending]||m['希望が残る']}
  function makeChapters(a,h,key,arc){
    const intro=`${arc.place}。${h}は${roleOf(a.hero)}として暮らしていた。`;
    const seven=[
      {t:`第一章　${arc.titles[0]}`,p:para(intro,arc.hook,arc.problem)},
      {t:`第二章　${arc.titles[1]}`,p:para(arc.investigate,`${key}は結論を急がず、確認できる事実と推測を別々の画面へ並べた。`)},
      {t:`第三章　${arc.titles[2]}`,p:para(arc.complication,`${h}は一度、最初に考えた答えへ戻りかけた。だが今度は「何を失うか」まで見てから決めることにした。`)},
      {t:`第四章　${arc.titles[3]}`,p:para(arc.twist,`${h}が信じていた前提が一つ崩れ、選択肢の形そのものが変わった。`)},
      {t:`第五章　${arc.titles[4]}`,p:para(arc.decision,`${key}は賛成も反対もせず、「それは今のあなたが選んだ答え？」とだけ聞いた。${h}はうなずいた。`)},
      {t:`第六章　${arc.titles[5]}`,p:para(arc.climax,`結果が出るまでの数秒は、予測画面の数字より長く感じられた。`)},
      {t:`終章　${arc.titles[6]}`,p:para(arc.after,endingLine(a,h))}
    ];
    if(a.length==='ショートショート')return [
      {t:seven[0].t,p:para(seven[0].p,seven[1].p)},
      {t:seven[3].t,p:para(seven[2].p,seven[3].p,seven[4].p)},
      {t:seven[6].t,p:para(seven[5].p,seven[6].p)}
    ];
    if(a.length==='短編')return [seven[0],seven[1],{t:seven[3].t,p:para(seven[2].p,seven[3].p)},seven[5],seven[6]];
    return seven;
  }
  function titleChoices(a,h){const ns=NAMES.filter(n=>n!==h),key=pick(ns),arc=arcFor(a,h,key);return [arc.title,arc.titles[0],arc.titles[2],arc.titles[4],arc.titles[6]]}
  window.mmV10SfChooseCore=function(v){state.ans.core=v;state.title='';state.step++;window.renderQ()};
  window.mmV10SfChooseTitle=function(v){state.title=v;window.titlePage()};
  window.renderQ=function(){
    const k=STEP_KEYS[state.step];
    if(state?.ans?.genre==='SF'&&k==='core'){
      const options=coreList(state.ans.theme);
      main.innerHTML=`<div class="question"><div class="progress"><div style="width:${Math.round(state.step/STEP_KEYS.length*100)}%"></div></div><div class="qnum">QUESTION ${state.step+1} / ${STEP_KEYS.length}</div><h2>そのテーマを、SFの中でどう描く？</h2><div class="helper"><span>🚀 SF専用の出来事</span></div><div class="options">${options.map(x=>`<button class="option ${state.ans.core===x?'active':''}" onclick="mmV10SfChooseCore('${x.replaceAll("'","\\'")}')">${escx(x)}</button>`).join('')}</div><div class="actions"><button class="ghost" onclick="state.step--;renderQ()">戻る</button></div></div>`;
      return;
    }
    return baseRender();
  };
  window.titlePage=function(){
    if(state?.ans?.genre!=='SF')return baseTitle();
    const a=state.ans;if(!state.heroName)state.heroName=pick(NAMES);const h=state.heroName;const choices=titleChoices(a,h);if(!state.title||/を話す夜$/.test(state.title))state.title=choices[0];const arc=arcFor(a,h,pick(NAMES.filter(n=>n!==h)));
    main.innerHTML=`<div class="question"><div class="qnum">FINAL STEP</div><h2>主人公の名前と、本のタイトルを決めます。</h2><div class="card" style="margin-bottom:14px"><div class="meta">今回の物語の設計</div><b>SF × テーマ「${escx(a.theme)}」</b><div class="meta" style="margin-top:6px;line-height:1.7">出来事：${escx(a.core)}<br>舞台：${escx(arc.place)}<br><span style="font-weight:800">生成方式：最新版 v10</span></div></div><div class="titleedit"><div class="meta" style="margin-bottom:6px">主人公の名前</div><input id="heroName" class="input" maxlength="16" value="${escx(h)}" oninput="state.heroName=this.value" placeholder="好きな名前を入力"></div><div class="titleflow" style="margin-top:18px"><div class="flow"><b>タイトル候補</b><div class="meta">物語で実際に起きる出来事から出しています。</div></div></div><div class="titlechoices">${choices.map(t=>`<button class="titlechoice ${state.title===t?'active':''}" onclick="mmV10SfChooseTitle('${t.replaceAll("'","\\'")}')">${escx(t)}</button>`).join('')}</div><div class="titleedit"><div class="meta" style="margin-bottom:6px">自分でタイトルを編集</div><input id="title" class="input" value="${escx(state.title)}" oninput="state.title=this.value"></div><button class="primary wide" style="margin-top:14px" onclick="generate()">この設定で本を作る</button><button class="ghost wide" style="margin-top:8px" onclick="state.step=7;renderQ()">前の質問に戻る</button></div>`;
  };
  window.generate=function(){
    if(state?.ans?.genre!=='SF')return baseGenerate();
    const a=state.ans,u=user();const h=(state.heroName||pick(NAMES)).trim()||pick(NAMES);const ns=NAMES.filter(n=>n!==h),key=pick(ns);const arc=arcFor(a,h,key);const chapters=makeChapters(a,h,key,arc);const title=(document.getElementById('title')?.value||state.title||arc.title).trim();
    const b={id:'b'+Date.now(),title,genre:'SF',author:u?.name||'you',authorId:u?.id||'',likes:0,shares:0,summary:`SF／テーマ「${a.theme}」。${a.core}を中心にした物語。`,answers:{...a,heroName:h,engine:'v10'},chapters,created:Date.now(),published:false,coverSeed:Math.random(),coverStyle:Math.floor(Math.random()*4)};
    const all=books();all.unshift(b);saveBooks(all);showBook(b.id);
  };
})();
