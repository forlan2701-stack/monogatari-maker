(function(){
  const cfg=()=>window.MM_ADSENSE_CONFIG||{enabled:false,client:'',slots:{}};

  // 旧デモ広告は使わず、配置はこのファイルで統一する。
  window.ad=function(){return ''};

  function loadAdSense(){
    const c=cfg();
    if(!c.enabled||!c.client||!String(c.client).startsWith('ca-pub-'))return false;
    if(document.getElementById('mmAdSenseScript'))return true;
    const s=document.createElement('script');
    s.id='mmAdSenseScript';
    s.async=true;
    s.crossOrigin='anonymous';
    s.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(c.client)}`;
    document.head.appendChild(s);
    return true;
  }

  function slotElement(place){
    const c=cfg(),slot=c.slots?.[place]||'';
    const box=document.createElement('div');
    box.className='mm-ad-slot';
    box.dataset.adPlacement=place;
    box.setAttribute('aria-label','広告');
    box.style.cssText='margin:16px 0;padding:10px 12px;border-radius:14px;border:1px dashed var(--line);background:#fbfaf8;text-align:center;overflow:hidden';

    if(c.enabled&&c.client&&slot){
      loadAdSense();
      box.innerHTML=`<div class="meta" style="margin-bottom:6px;font-size:10px;letter-spacing:.08em">広告</div><ins class="adsbygoogle" style="display:block;min-height:90px" data-ad-client="${String(c.client).replace(/["<>]/g,'')}" data-ad-slot="${String(slot).replace(/\D/g,'')}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
      setTimeout(()=>{try{(window.adsbygoogle=window.adsbygoogle||[]).push({})}catch(e){}},0);
    }else{
      box.innerHTML='<div class="meta" style="font-size:10px;letter-spacing:.08em">広告</div><div style="min-height:62px;display:grid;place-items:center"><div><b style="font-size:13px">広告スペース</b><div class="meta" style="margin-top:4px">AdSense承認後に表示されます</div></div></div>';
    }
    return box;
  }

  function removeLegacyAds(){
    document.querySelectorAll('.ad').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t.includes('ADVERTISEMENT')||t.includes('AdSense')||t.includes('広告'))el.remove();
    });
  }

  function addHomeAd(){
    if(!document.querySelector('.homehero'))return;
    removeLegacyAds();
    if(document.querySelector('[data-ad-placement="home"]'))return;
    const ranks=document.querySelector('.homeranks');
    if(ranks)ranks.insertAdjacentElement('afterend',slotElement('home'));
  }

  function addCommunityAd(){
    removeLegacyAds();
    if(document.querySelector('[data-ad-placement="community"]'))return;
    const items=[...document.querySelectorAll('.item')];
    if(!items.length)return;
    const anchor=items[Math.min(2,items.length-1)];
    anchor.insertAdjacentElement('afterend',slotElement('community'));
  }

  function addReaderAd(){
    removeLegacyAds();
    if(document.querySelector('[data-ad-placement="reader"]'))return;
    const reader=document.querySelector('.reader');
    if(!reader)return;
    reader.insertAdjacentElement('afterend',slotElement('reader'));
  }

  const prevHome=window.home;
  if(typeof prevHome==='function')window.home=async function(){await prevHome();addHomeAd()};

  const prevCommunity=window.community;
  if(typeof prevCommunity==='function')window.community=async function(){await prevCommunity();addCommunityAd()};

  const prevPublicBook=window.showPublicBook;
  if(typeof prevPublicBook==='function')window.showPublicBook=function(b){prevPublicBook(b);addReaderAd()};

  window.mmRefreshAds=function(){
    if(document.querySelector('.homehero'))addHomeAd();
    else if(document.querySelector('.reader'))addReaderAd();
    else addCommunityAd();
  };

  setTimeout(()=>window.mmRefreshAds(),0);
})();
