(function(){
  const ACCESS_PREFIX='a:';

  function visitorId(){
    let id=localStorage.getItem('mm_visitor_id');
    if(!id){
      id='v'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
      localStorage.setItem('mm_visitor_id',id);
    }
    return id;
  }

  function todayJst(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get=t=>parts.find(x=>x.type===t)?.value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  async function registerAccess(){
    const day=todayJst();
    const sessionKey=`mm_access_session_${day}`;
    try{
      if(sessionStorage.getItem(sessionKey))return;
    }catch(e){}

    const now=Date.now();
    const accessId=`${ACCESS_PREFIX}${visitorId()}:${now.toString(36)}:${Math.random().toString(36).slice(2,8)}`;
    try{
      const r=await fetch(`${SUPABASE_URL}/rest/v1/site_daily_visits`,{
        method:'POST',
        headers:{apikey:SUPABASE_KEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({visitor_id:accessId,visit_date:day,created:now})
      });
      if(r.ok){
        try{sessionStorage.setItem(sessionKey,accessId)}catch(e){}
      }
    }catch(e){}
  }

  async function countAccesses(day){
    try{
      const filter=day?`&visit_date=eq.${day}`:'';
      const r=await fetch(`${SUPABASE_URL}/rest/v1/site_daily_visits?select=visitor_id&visitor_id=like.a:*${filter}`,{
        headers:{apikey:SUPABASE_KEY,Prefer:'count=exact',Range:'0-0'}
      });
      const cr=r.headers.get('content-range')||'';
      const m=cr.match(/\/(\d+)$/);
      if(m)return Number(m[1]);
      const d=await r.json();
      return Array.isArray(d)?d.length:0;
    }catch(e){return 0}
  }

  async function refreshAccessStats(){
    if(!document.querySelector('.homehero'))return;
    const day=todayJst();
    const [today,total]=await Promise.all([countAccesses(day),countAccesses()]);
    document.querySelectorAll('.grid2 .card').forEach(card=>{
      const meta=card.querySelector('.meta');
      const num=card.querySelector('.num');
      if(!meta||!num)return;
      const label=(meta.textContent||'').trim();
      if(label==='今日の訪問者数'||label==='今日のアクセス数'){
        meta.textContent='今日のアクセス数';
        num.textContent=today.toLocaleString();
      }
      if(label==='累計訪問者数'||label==='累計アクセス数'){
        meta.textContent='累計アクセス数';
        num.textContent=total.toLocaleString();
      }
    });
  }

  const previousHome=window.home;
  window.home=async function(){
    await previousHome();
    await registerAccess();
    await refreshAccessStats();
  };

  window.registerAccess=registerAccess;
  window.refreshAccessStats=refreshAccessStats;

  setTimeout(async()=>{
    if(document.querySelector('.homehero')){
      await registerAccess();
      await refreshAccessStats();
    }
  },0);
})();