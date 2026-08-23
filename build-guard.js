(function(){
  const BUILD='20260823u';
  const KEY='mm_build_seen';
  window.MM_BUILD=BUILD;
  function activeCreate(){
    const q=document.querySelector('.question');
    return !!q;
  }
  function showUpdateBanner(next){
    if(document.getElementById('mmUpdateBanner'))return;
    const b=document.createElement('div');
    b.id='mmUpdateBanner';
    b.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:9999;background:#2f2924;color:white;border-radius:14px;padding:12px 14px;box-shadow:0 8px 30px rgba(0,0,0,.2);font-size:13px;line-height:1.5';
    b.innerHTML='<b>最新版があります</b><div style="margin-top:3px;opacity:.9">古い生成方式のまま作らないよう、更新してください。</div><button id="mmReloadNow" style="margin-top:8px;border:0;border-radius:10px;padding:8px 12px;font-weight:800;cursor:pointer">最新版に更新</button>';
    document.body.appendChild(b);
    document.getElementById('mmReloadNow').onclick=function(){
      location.replace(location.pathname+'?build='+encodeURIComponent(next)+'&t='+Date.now());
    };
  }
  async function check(){
    try{
      const r=await fetch('/version.json?t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return;
      const v=await r.json();
      if(v&&v.build&&v.build!==BUILD){
        if(activeCreate())showUpdateBanner(v.build);
        else location.replace(location.pathname+'?build='+encodeURIComponent(v.build)+'&t='+Date.now());
      }
    }catch(e){}
  }
  try{localStorage.setItem(KEY,BUILD)}catch(e){}
  window.addEventListener('focus',check);
  setInterval(check,60000);
})();