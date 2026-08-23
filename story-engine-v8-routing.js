(function(){
  const prevRender=window.renderQ;
  const prevBack=window.backQ;

  window.renderQ=function(){
    const q=qs[state.step];
    if(q && q.k==='core' && state?.ans?.genre!=='ミステリー'){
      delete state.ans.core;
      state.step++;
      return window.renderQ();
    }
    return prevRender();
  };

  window.backQ=function(){
    if(state.step>0 && qs[state.step-1]?.k==='core' && state?.ans?.genre!=='ミステリー'){
      state.step=Math.max(0,state.step-2);
      return window.renderQ();
    }
    return prevBack();
  };
})();