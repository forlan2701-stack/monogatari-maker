(function(){
  const baseGenerate=window.generate;
  function storyText(b){return [b.title,b.summary,...(b.chapters||[]).flatMap(c=>[c.t,c.p])].join('\n')}
  function validGenre(b){
    const text=storyText(b);
    const rules={
      SF:['西暦','軌道','月面','火星','記憶','AI','システム','宇宙'],
      歴史:['明治','大正','幕末','電報','役所','戸籍','推薦状','停車場'],
      ファンタジー:['魔法','王都','結界','禁書','黎明石','精霊','魔導'],
      冒険:['遺跡','谷','地図','青星石','北門','石橋','旅'],
      ホラー:['怪異','午前零時','写真','閉ざ','名前','夜'],
      ミステリー:['記録','証言','時刻','照合','真相','手がかり','推理']
    };
    const list=rules[b.genre];
    if(!list)return true;
    return list.some(x=>text.includes(x));
  }
  function rejectBook(b,reason){
    const all=books().filter(x=>x.id!==b.id);saveBooks(all);
    main.innerHTML=`<div class="card"><span class="badge">生成を中止しました</span><h2 style="margin:10px 0 6px">古い生成方式または条件不一致を検出しました。</h2><div class="meta" style="line-height:1.7">${reason}<br>作品として保存せず、最新版で作り直せる状態にしています。</div><button class="primary wide" style="margin-top:12px" onclick="location.replace('/?build=20260823q&t='+Date.now())">最新版に更新して作り直す</button></div>`;
  }
  window.generate=function(){
    const before=books()[0]?.id||null;
    baseGenerate();
    setTimeout(()=>{
      const b=books()[0];if(!b||b.id===before)return;
      const engine=b.answers?.engine;
      if(engine!=='v9'&&engine!=='v10'){rejectBook(b,'現在の生成エンジンではない文章が作られました。');return}
      if(!b.answers?.theme||!b.answers?.core){rejectBook(b,'選んだテーマまたは具体的な出来事が作品データへ反映されていません。');return}
      if(!validGenre(b)){rejectBook(b,`「${b.genre}」として必要な世界設定が本文に反映されていません。`);return}
    },0);
  };
})();
