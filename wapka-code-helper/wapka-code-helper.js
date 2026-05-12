(function(){
var s=document.currentScript||document.querySelector('script[src*="wapka-code-helper.js"]');
var base='';if(s&&s.src){base=s.src.replace(/[^\/]+$/,'');}
var lang=(s&&s.dataset.lang)||localStorage['wkh-lang']||(navigator.language||'en').slice(0,2);
var langs=['en','hi','ar','id','ur','bn'];
if(langs.indexOf(lang)<0)lang='en';

if(!window.__WKH_DATA){
  var dl=document.createElement('script');dl.src=base+'data/'+lang+'.js';
  dl.onerror=function(){var f=document.createElement('script');f.src=base+'data/en.js';document.head.appendChild(f);};
  document.head.appendChild(dl);
}

function boot(){
var D=window.__WKH_DATA;if(!D)return;
var typeEl=null,editor=null,panel=null,open=false;

function find(){
  typeEl=document.getElementById('typeInput');
  editor=document.getElementById('codeContent')||document.getElementById('jsonData');
  return typeEl&&editor;
}

function listen(){
  document.addEventListener('change',function(e){if(e.target===typeEl||e.target.id==='typeInput')refresh();});
  editor.addEventListener('keydown',function(e){if(e.key==='?'&&!e.ctrlKey&&!e.metaKey)toggle();});
}

function toggle(){
  open=!open;
  if(open){panel.classList.add('open');document.getElementById('wkh-toggle').style.display='none';refresh();}
  else{panel.classList.remove('open');document.getElementById('wkh-toggle').style.display='';}
}

function refresh(){
  var t=parseInt(typeEl.value)||0,info=D.types[t]||{},name=info.n||'Unknown';
  var te=document.getElementById('wkh-type-name');if(te)te.textContent=name+' (type '+t+')';
  // Quick
  var qb=document.getElementById('wkh-quick-body');if(qb){
    var h='<div class="wkh-q-desc">'+esc(info.q||'')+'</div>';
    if(info.cat)h+='<div class="wkh-badge">'+esc(info.cat)+'</div>';
    qb.innerHTML=h;
  }
  // Explain
  var eb=document.getElementById('wkh-explain-body');if(eb){
    var h='<div class="wkh-e-desc">'+esc(info.e||'')+'</div>';
    var pk=Object.keys(info.p||{});
    if(pk.length){ h+='<div class="wkh-section"><div class="wkh-section-h">Config Parameters</div>';
      for(var i=0;i<pk.length;i++)h+='<div class="wkh-item"><span class="wkh-item-k">'+esc(pk[i])+'</span><span class="wkh-item-v">'+esc(info.p[pk[i]])+'</span></div>';
      h+='</div>'; }
    var vk=Object.keys(info.v||{});
    if(vk.length){ h+='<div class="wkh-section"><div class="wkh-section-h">Template Variables</div>';
      for(var i=0;i<vk.length;i++)h+='<div class="wkh-item"><code class="wkh-item-k">'+esc(vk[i])+'</code><span class="wkh-item-v">'+esc(info.v[vk[i]])+'</span></div>';
      h+='</div>'; }
    eb.innerHTML=h;
  }
  // Tags tab: only for type 1
  var tt=document.getElementById('wkh-tab-tags');if(tt)tt.style.display=t===1?'':'none';
  // Lua tab: only for type 29
  var lt=document.getElementById('wkh-tab-lua');if(lt)lt.style.display=t===29?'':'none';
  showTab('quick');
}

function inject(){
  var b=document.createElement('button');b.id='wkh-toggle';b.textContent='?';b.title='Code Helper (? key)';
  b.onclick=function(e){e.stopPropagation();toggle();};document.body.appendChild(b);
  var p=document.createElement('div');p.id='wkh-panel';p.innerHTML=
    '<div id="wkh-header"><span id="wkh-type-name">Code Helper</span><button class="wkh-close" onclick="window._wkhClose()">&times;</button></div>'+
    '<div id="wkh-tabs">'+
      '<button data-tab="quick" class="active" onclick="window._wkhShowTab(\'quick\')">Quick</button>'+
      '<button data-tab="explain" onclick="window._wkhShowTab(\'explain\')">Explain</button>'+
      '<button data-tab="tags" id="wkh-tab-tags" style="display:none" onclick="window._wkhShowTab(\'tags\')">Tags</button>'+
      '<button data-tab="lua" id="wkh-tab-lua" style="display:none" onclick="window._wkhShowTab(\'lua\')">Lua</button>'+
      '<button data-tab="index" onclick="window._wkhShowTab(\'index\')">Index</button>'+
    '</div>'+
    '<div id="wkh-content">'+
      '<div id="wkh-pane-quick"><div id="wkh-quick-body"></div></div>'+
      '<div id="wkh-pane-explain" style="display:none"><div id="wkh-explain-body"></div></div>'+
      '<div id="wkh-pane-tags" style="display:none" class="wkh-tag-list"></div>'+
      '<div id="wkh-pane-lua" style="display:none"><div id="wkh-lua-body"></div></div>'+
      '<div id="wkh-pane-index" style="display:none"><div id="wkh-index-body"></div></div>'+
    '</div>';
  document.body.appendChild(p);panel=p;
  buildTagList();buildIndex();buildLuaTab();
  refresh();
}

function buildTagList(){
  var pane=document.getElementById('wkh-pane-tags'),tags=D.tags;
  var groups={};for(var k in tags){var g=tags[k].g||'Other';if(!groups[g])groups[g]=[];groups[g].push({key:k,info:tags[k]});}
  var order=['Data','Transform','Math','Encode','Conditions','Storage','Control','Other'];
  var h='<div class="wkh-tagbar"><input class="wkh-search" placeholder="Filter tags..." oninput="window._wkhFilterTags(this.value)"></div>';
  for(var i=0;i<order.length;i++){
    var g=order[i];if(!groups[g])continue;
    h+='<div class="wkh-group" data-group="'+esc(g)+'"><div class="wkh-group-h">'+esc(g)+'</div>';
    for(var j=0;j<groups[g].length;j++){
      var tg=groups[g][j];
      h+='<div class="wkh-tag" onclick="window._wkhCopyTag(\''+esc(tg.info.t)+'\')" title="'+esc(tg.info.d)+'"><span class="wkh-tag-n">'+esc(tg.info.n)+'</span><span class="wkh-tag-s">'+esc(tg.key)+'</span></div>';
    }
    h+='</div>';
  }
  pane.innerHTML=h;
}
window._wkhFilterTags=function(q){
  if(!q){document.querySelectorAll('.wkh-group').forEach(function(g){g.style.display='';});return;}
  q=q.toLowerCase();
  document.querySelectorAll('.wkh-tag').forEach(function(t){
    t.style.display=(t.textContent.toLowerCase().indexOf(q)>=0)?'':'none';
  });
  document.querySelectorAll('.wkh-group').forEach(function(g){
    g.style.display=g.querySelectorAll('.wkh-tag[style*="display:"]').length===g.querySelectorAll('.wkh-tag').length?'none':'';
  });
};

function buildIndex(){
  var h='';var types=D.types;
  var cats={};for(var k in types){var c=types[k].cat||'Other';if(!cats[c])cats[c]=[];cats[c].push({key:k,info:types[k]});}
  var ord=['Page Logic','Users','Content','Data','Advanced'];
  for(var i=0;i<ord.length;i++){
    var c=ord[i];if(!cats[c])continue;
    h+='<div class="wkh-group"><div class="wkh-group-h">'+esc(c)+'</div>';
    for(var j=0;j<cats[c].length;j++){
      var t=cats[c][j];
      h+='<div class="wkh-idx-item" onclick="window._wkhShowType('+t.key+')"><span class="wkh-idx-n">'+esc(t.info.n)+'</span><span class="wkh-idx-t">type '+t.key+'</span></div>';
    }
    h+='</div>';
  }
  document.getElementById('wkh-index-body').innerHTML=h;
}
window._wkhShowType=function(tid){
  typeEl.value=tid;typeEl.dispatchEvent(new Event('change',{bubbles:1}));
  refresh();showTab('quick');
};

function buildLuaTab(){
  document.getElementById('wkh-lua-body').innerHTML='<div class="wkh-e-desc">'+esc(D.luaNote||'')+'</div>'+
    '<div class="wkh-section"><div class="wkh-section-h">Quick Examples</div>'+
    '<div class="wkh-item"><code class="wkh-item-k">print("text")</code><span class="wkh-item-v">Output to page</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">req.method</code><span class="wkh-item-v">HTTP method (GET/POST)</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">req.get.key</code><span class="wkh-item-v">URL query parameter</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">env.siteid</code><span class="wkh-item-v">Current site ID</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">api.user_info({id:N})</code><span class="wkh-item-v">Get user by ID</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">url.redirect("/")</code><span class="wkh-item-v">Redirect visitor</span></div>'+
    '<div class="wkh-item"><code class="wkh-item-k">server.template("404")</code><span class="wkh-item-v">Show 404 page</span></div>'+
    '</div>';
}

function showTab(name){
  document.querySelectorAll('#wkh-tabs button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});
  document.querySelectorAll('#wkh-content > div').forEach(function(d){d.style.display='none';});
  var el=document.getElementById('wkh-pane-'+name);if(el)el.style.display='block';
}
window._wkhShowTab=showTab;

window._wkhClose=function(){
  var p=document.getElementById('wkh-panel');if(p)p.classList.remove('open');
  var t=document.getElementById('wkh-toggle');if(t)t.style.display='';
  open=false;
};

window._wkhCopyTag=function(t){
  var text=t.replace(/\u2588/g,'');
  if(navigator.clipboard){navigator.clipboard.writeText(text).then(function(){pulseTag();});}else{
    var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);pulseTag();
  }
};
function pulseTag(){var b=document.getElementById('wkh-toggle');if(b){b.style.transform='scale(1.2)';setTimeout(function(){b.style.transform='';},200);}}

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

document.addEventListener('click',function(e){if(open&&!panel.contains(e.target)&&e.target.id!=='wkh-toggle')toggle();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&open)toggle();});

if(!find())return document.addEventListener('DOMContentLoaded',function(){if(find()){inject();listen();}});
inject();listen();
}

if(window.__WKH_DATA)boot();else document.addEventListener('wkh-ready',boot);
})();
