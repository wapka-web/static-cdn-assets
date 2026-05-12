(function(){
var D=window.__WKH_DATA;if(!D)return setTimeout(arguments.callee,50);
var typeEl=null,editor=null,panel=null,open=false,curTab='quick';

function find(){
  typeEl=document.getElementById('typeInput');
  editor=document.getElementById('codeContent')||document.getElementById('jsonData');
  return typeEl&&editor;
}

function listen(){
  if(typeEl.tagName==='INPUT'){ var o=new MutationObserver(refresh);o.observe(typeEl,{attributes:1,attributeFilter:['value']}); }
  document.addEventListener('change',function(e){if(e.target.id==='typeInput')refresh();});
  editor.addEventListener('keydown',function(e){if(e.key==='?'&&!e.ctrlKey&&!e.metaKey)toggle();});
}

function refresh(){
  var t=parseInt(typeEl.value)||0,info=D.types[t]||{},name=info.n||'Unknown';
  var h=document.getElementById('wkh-type-name');if(h)h.textContent='Type '+t+': '+name;
  var qt=document.getElementById('wkh-quick-tmpl');
  if(qt){ qt.textContent=info.t||'';qt.style.display=info.t?'block':'none'; }
  var tagsTab=document.getElementById('wkh-tab-tags');
  if(tagsTab)tagsTab.style.display=t===1?'':'none';
  showTab(t===1?'tags':'quick');
}

function inject(){
  var b=document.createElement('button');b.id='wkh-toggle';b.textContent='?';b.title='Code Helper (press ?)';
  b.onclick=function(e){e.stopPropagation();toggle();};document.body.appendChild(b);
  var p=document.createElement('div');p.id='wkh-panel';p.innerHTML=
    '<div id="wkh-header"><span id="wkh-type-name">Code Helper</span><button id="wkh-close" onclick="document.getElementById(\'wkh-panel\').classList.remove(\'open\');document.getElementById(\'wkh-toggle\').style.display=\'\';open=false">&times;</button></div>'+
    '<div id="wkh-tabs">'+
      '<button data-tab="quick" class="active" onclick="window._wkhShowTab(\'quick\')">Quick</button>'+
      '<button data-tab="tags" id="wkh-tab-tags" style="display:none" onclick="window._wkhShowTab(\'tags\')">Tags</button>'+
    '</div>'+
    '<div id="wkh-content">'+
      '<div id="wkh-pane-quick"><pre id="wkh-quick-tmpl" onclick="window._wkhCopy(this)"></pre></div>'+
      '<div id="wkh-pane-tags" style="display:none" class="wkh-tag-list"></div>'+
    '</div>';
  document.body.appendChild(p);panel=p;
  buildTagList();
  refresh();
}

function buildTagList(){
  var pane=document.getElementById('wkh-pane-tags'),tags=D.tags;
  var groups={};for(var k in tags){var g=tags[k].g||'Other';if(!groups[g])groups[g]=[];groups[g].push({key:k,info:tags[k]});}
  var order=['Data','Transform','Math','Encode','Conditions','Storage','Control','Other'];
  var h='';
  for(var i=0;i<order.length;i++){
    var g=order[i];if(!groups[g])continue;
    h+='<div class="wkh-group"><div class="wkh-group-h">'+g+'</div>';
    for(var j=0;j<groups[g].length;j++){
      var t=groups[g][j];
      h+='<div class="wkh-tag" onclick="window._wkhInsert(\''+t.key+'\',\''+escapeHtml(t.info.t)+'\','+(t.info.m?1:0)+')" title="'+escapeHtml(t.info.d)+'"><span class="wkh-tag-n">'+escapeHtml(t.info.n)+'</span><span class="wkh-tag-s">'+escapeHtml(t.key)+'</span></div>';
    }
    h+='</div>';
  }
  pane.innerHTML=h;
}

function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

function toggle(){
  open=!open;if(open){panel.classList.add('open');document.getElementById('wkh-toggle').style.display='none';}else{panel.classList.remove('open');document.getElementById('wkh-toggle').style.display='';}
  if(open)refresh();
}

function showTab(name){
  curTab=name;
  document.querySelectorAll('#wkh-tabs button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});
  document.getElementById('wkh-pane-quick').style.display=name==='quick'?'block':'none';
  document.getElementById('wkh-pane-tags').style.display=name==='tags'?'block':'none';
}
window._wkhShowTab=showTab;

function insert(text){
  var s=editor.selectionStart,e=editor.selectionEnd,v=editor.value;
  var cursor=text.indexOf('\u2588');
  if(cursor>=0)text=text.slice(0,cursor)+text.slice(cursor+1);
  else cursor=text.length;
  editor.value=v.slice(0,s)+text+v.slice(e);
  editor.selectionStart=editor.selectionEnd=s+cursor;
  editor.focus();
}
window._wkhInsert=function(key,tmpl,wrap){
  if(wrap&&editor.selectionStart!==editor.selectionEnd){
    var parts=tmpl.split('\u2588');
    insert(parts[0]+editor.value.slice(editor.selectionStart,editor.selectionEnd)+parts[1]);
  }else{insert(tmpl);}
};

window._wkhCopy=function(el){
  var t=el.textContent;if(!t)return;
  if(navigator.clipboard){navigator.clipboard.writeText(t);pulse(el);}else{
    var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);pulse(el);
  }
};

function pulse(el){el.style.transition='none';el.style.background='#d1fae5';setTimeout(function(){el.style.transition='background 0.5s';el.style.background='';},50);}

document.addEventListener('click',function(e){if(open&&!panel.contains(e.target)&&e.target.id!=='wkh-toggle')toggle();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)toggle();});

if(!find())return document.addEventListener('DOMContentLoaded',function(){if(find()){inject();listen();}});
inject();listen();
})();
