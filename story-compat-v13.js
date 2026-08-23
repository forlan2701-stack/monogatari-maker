(function(){
  const FULL=[...pools.hero];
  const NONHUMAN_OK=new Set(['SF','ファンタジー','冒険','不思議','ホラー','ロードノベル','短編連作']);
  function allowed(g){
    let list=[...FULL];
    if(g==='青春')return ['小学生','高校生','大学生'];
    if(g==='恋愛')list=list.filter(x=>!['小学生','人ではない存在'].includes(x));
    if(g==='お仕事')list=list.filter(x=>!['小学生','人ではない存在'].includes(x));
    if(g==='歴史')list=list.filter(x=>!['小学生','人ではない存在'].includes(x));
    if(!NONHUMAN_OK.has(g))list=list.filter(x=>x!=='人ではない存在');
    return list;
  }
  const baseStart=window.startCreate;
  window.startCreate=function(){pools.hero=[...FULL];return baseStart()};
  const baseChoose=window.choose;
  window.choose=function(k,v){
    if(k==='genre'){
      pools.hero=allowed(v);
      if(state.ans.hero&&!pools.hero.includes(state.ans.hero)){
        delete state.ans.hero;
        delete state.options.hero;
      }
    }
    return baseChoose(k,v);
  };
  const baseTitle=window.titlePage;
  window.titlePage=function(){const r=baseTitle();setTimeout(()=>{
    document.querySelectorAll('.meta').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t==='生成方式：全ジャンル統合 v12')el.textContent='生成方式：全ジャンル対応 v13';
    });
  },0);return r};
})();