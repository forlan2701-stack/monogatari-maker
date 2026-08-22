(function(){
function renameNewArrivals(root=document){
  const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT);
  const targets=[];
  while(walker.nextNode()){
    const n=walker.currentNode;
    if(n.nodeValue&&n.nodeValue.includes('新着ランキング')) targets.push(n);
  }
  targets.forEach(n=>{n.nodeValue=n.nodeValue.replaceAll('新着ランキング','新着作品')});
}
function patch(){renameNewArrivals(document)}
new MutationObserver(patch).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
patch();
})();