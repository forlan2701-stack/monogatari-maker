(function(){
  const FULL=[...pools.hero];
  function allowed(g){
    if(g==='青春')return ['小学生','高校生','大学生'];
    if(g==='恋愛')return FULL.filter(x=>!['小学生','人ではない存在'].includes(x));
    if(g==='お仕事')return FULL.filter(x=>x!=='小学生');
    return [...FULL];
  }
  const baseStart=window.startCreate;
  window.startCreate=function(){pools.hero=[...FULL];return baseStart()};
  const baseChoose=window.choose;
  window.choose=function(k,v){if(k==='genre')pools.hero=allowed(v);return baseChoose(k,v)};
  const baseTitle=window.titlePage;
  window.titlePage=function(){const r=baseTitle();setTimeout(()=>{
    document.querySelectorAll('.meta').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t==='生成方式：全ジャンル統合 v12')el.textContent='生成方式：全ジャンル対応 v13';
    });
  },0);return r};
})();