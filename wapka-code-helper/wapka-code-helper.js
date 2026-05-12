(function(){
var D = {
  types: {
    0: {n:'Code', cat:'Page Logic',
        q:'Raw HTML, CSS, or JS. Output as-is with no tag processing.',
        e:'The simplest code type. Everything you write is sent directly to the browser. Use for static content, embedded styles, scripts, or third-party embed codes.',
        p:{}, v:{}},
    1: {n:'TAG Code', cat:'Page Logic',
        q:'Dynamic content using {{TAG()}} macros. Chain functions with @.',
        e:'The most flexible code type. Write TAG macros inside {{ }} brackets. Chain multiple functions with @. Supports 50 built-in functions for data, math, conditions, and output.',
        p:{}, v:{}},
    2: {n:'Youtube API', cat:'Content',
        q:'Display YouTube video and channel data.',
        e:'Fetches YouTube video or channel information and displays it using configurable templates.',
        p:{vid:'Video ID', cid:'Channel ID', search:'Search query', max:'Max results (50)', order:'date/rating/relevance/title', start:'Start index'},
        v:{}},
    3: {n:'Auto Redirect', cat:'Page Logic',
        q:'Redirect visitors to another URL. Stops all further execution.',
        e:'When this code runs, it immediately sends a redirect header and exits. No other codes or page content will be processed. Use with rules to conditionally redirect.',
        p:{url:'Target URL (can use TAG macros)'}, v:{}},
    4: {n:'Head Tags', cat:'Page Logic',
        q:'Inject meta tags, CSS, or JS into <head>. Not visible on page.',
        e:'Content is injected into the HTML <head> section instead of the body. Perfect for meta tags, Open Graph tags, analytics scripts, or CSS that must load before content.',
        p:{}, v:{}},
    5: {n:'File Viewer', cat:'Content',
        q:'Display or stream a file by its ID or hash.',
        e:'Shows a file stored in the File Manager. Can display inline (images, text) or force download.',
        p:{id:'File ID', file:'File hash:ID key'},
        v:{'%name%':'File name','%size%':'File size','%type%':'File type','%url%':'File URL','%date%':'Upload date','%hits%':'Download count'}},
    6: {n:'Online User', cat:'Users',
        q:'Show currently active visitors with count.',
        e:'Displays a list of visitors currently browsing the site. Updates in real-time.',
        p:{limit:'Users per page (max 50)', page:'Page number', order:'Sort order'},
        v:{'%username%':'Visitor username','%time%':'Last seen time','%count%':'Users shown','%total%':'Total online'}},
    7: {n:'User Login', cat:'Users',
        q:'Login form with authentication. Redirects on success.',
        e:'Renders a complete login form. On success, redirects to the configured URL. On failure, shows the form again with error message.\n\nConfig fields can use TAG macros: <email>{{POST(email)}}</email>',
        p:{USERNAME:'Username field',EMAIL:'Email field (optional)',PASSWORD:'Password field',AUTOLOGIN:'Auto-login after register (ON/OFF)',URL:'Redirect after login',ERROR:'Custom error message'},
        v:{'%form%':'The login form HTML','%error%':'Error message if login fails','%username%':'Submitted username'}},
    8: {n:'User Registration', cat:'Users',
        q:'Registration form for new users.',
        e:'Shows a signup form. Collects username, password, and optional email. New users get default level 1 (Subscriber).\n\nConfig fields can use TAG macros.',
        p:{USERNAME:'Username input name',EMAIL:'Email input name',PASSWORD:'Password input name',URL:'Redirect after register',ERROR:'Custom error'},
        v:{'%form%':'The registration form HTML','%error%':'Validation error message'}},
    9: {n:'User Lister', cat:'Users',
        q:'List registered site users with pagination.',
        e:'Displays a directory of all users on the site. Supports search, sorting, and pagination.',
        p:{id:'Filter by user ID',id_not:'Exclude user ID',search:'Search by username',limit:'Users per page (max 50)',page:'Page number', order:'id_asc/desc, username_asc/desc, email_asc/desc, regdate_asc/desc, type_asc/desc'},
        v:{'%id%':'User ID','%username%':'Username','%email%':'Email','%regdate%':'Registration date','%logindate%':'Last login','%type%':'Account type (0-3)','%role%':'User level (0-10)','%avatar%':'Avatar URL','%var(name)%':'Custom meta value','%count%':'Users shown','%total%':'Total users','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
    10:{n:'User Editor', cat:'Users',
        q:'Profile editing form for logged-in users.',
        e:'Allows users to edit their own profile: username, email, password, avatar.',
        p:{name:'Input name', email:'Input email', PASSWORD:'Password input', URL:'Redirect after save'},
        v:{'%form%':'Editor form HTML','%error%':'Error message'}},
    11:{n:'Message Sender', cat:'Content',
        q:'Compose and send a private message to a user.',
        e:'Shows a form to send messages to other site users. Recipient can be pre-filled.',
        p:{USERNAME:'Recipient username',USERID:'Recipient user ID',MESSAGE:'Message body'},
        v:{'%form%':'Message form HTML','%error%':'Error message'}},
    12:{n:'Message Lister', cat:'Content',
        q:'Inbox showing received messages with pagination.',
        e:'Displays a list of messages. Can show inbox (received) or outbox (sent). Supports pagination.',
        p:{limit:'Messages per page',page:'Page number',type:'inbox or outbox',search:'Search content',status:'seen or unseen',group:'Group by sender/receiver'},
        v:{'%id%':'Message ID','%content%':'Message text','%date%':'Sent date','%username%':'Sender name','%userid%':'Sender ID','%count%':'Messages shown','%total%':'Total messages','%pagenum%':'Total pages','#%PAGING()%#':'Pagination'}},
    13:{n:'Message Editor', cat:'Content',
        q:'View, edit, or delete a single message.',
        e:'Shows a single message with edit and delete options. Owner or admin can modify.',
        p:{id:'Message ID'},
        v:{'%content%':'Message text','%username%':'Sender username','%date%':'Sent date'}},
    14:{n:'Forum Creator', cat:'Content',
        q:'Create a new forum category.',
        e:'Form to create a new forum. Can optionally set a parent forum for nesting.',
        p:{name:'Forum name input',parent:'Parent forum ID'},
        v:{'%form%':'Forum creation form HTML','%error%':'Validation error'}},
    15:{n:'Forum Lister', cat:'Content',
        q:'List forums with post counts and nesting.',
        e:'Shows a directory of forums. Displays name, post count, and parent-child hierarchy.',
        p:{id:'Filter by forum ID',parent:'Filter by parent ID',search:'Search by name',limit:'Forums per page',page:'Page number',order:'id_asc/desc or name_asc/desc'},
        v:{'%id%':'Forum ID','%name%':'Forum name','%postnum%':'Post count','%userid%':'Creator user ID','%username%':'Creator username','%parent%':'Parent forum ID','%parent_name%':'Parent forum name','%count%':'Forums shown','%total%':'Total forums','%pagenum%':'Total pages','#%PAGING()%#':'Pagination'}},
    16:{n:'Forum Editor', cat:'Content',
        q:'Edit or delete an existing forum.',
        e:'Allows renaming a forum or changing its parent. Owner or admin access.',
        p:{id:'Forum ID',name:'New forum name',parent:'New parent ID'},
        v:{'%form%':'Editor form HTML','%error%':'Error message'}},
    17:{n:'Post Creator', cat:'Content',
        q:'Write a new forum post.',
        e:'Form to create a new post in a forum. Title, content, and optional thumbnail.',
        p:{forumid:'Forum ID (required)',title:'Post title',content:'Post body',status:'0=Draft, 1=Published, 2=Pending, 3=Trash',thumb:'Thumbnail URL'},
        v:{'%form%':'Post creation form','%error%':'Error message'}},
    18:{n:'Post Lister', cat:'Content',
        q:'List posts within a forum, sorted by date.',
        e:'Shows a paginated list of posts. Supports filtering by forum, user, status, and search.',
        p:{id:'Post ID',forumid:'Filter by forum ID',userid:'Filter by user ID',search:'Search title/content',status:'0-3 status',limit:'Posts per page',page:'Page number',order:'id_asc/desc'},
        v:{'%id%':'Post ID','%title%':'Post title','%content%':'Post content','%date%':'Post date','%username%':'Author username','%userid%':'Author ID','%forumid%':'Forum ID','%forumname%':'Forum name','%count%':'Posts shown','%total%':'Total posts','%pagenum%':'Total pages','#%PAGING()%#':'Pagination'}},
    19:{n:'Post Editor', cat:'Content',
        q:'Edit or delete an existing post.',
        e:'Allows modifying title, content, status, or thumbnail. Owner or admin access.',
        p:{id:'Post ID',title:'New title',content:'New content',status:'New status',thumb:'New thumbnail'},
        v:{'%form%':'Editor form HTML','%error%':'Error message'}},
    20:{n:'Folder Creator', cat:'Content',
        q:'Create a new file folder.',
        e:'Form to create a folder in the file manager. Can nest under a parent folder.',
        p:{name:'Folder name',parent:'Parent folder ID'},
        v:{'%form%':'Folder creation form','%error%':'Error message'}},
    21:{n:'Folder Lister', cat:'Content',
        q:'List folders and their file counts.',
        e:'Shows a directory of folders with file counts. Supports hierarchical display.',
        p:{id:'Filter by folder ID',parent:'Filter by parent ID',search:'Search by name',limit:'Folders per page',page:'Page number',order:'id_asc/desc or name_asc/desc'},
        v:{'%id%':'Folder ID','%name%':'Folder name','%filenum%':'File count inside','%filesize%':'Total size of files inside','%userid%':'Creator user ID','%username%':'Creator username','%parent%':'Parent folder ID','%parent_name%':'Parent folder name','%count%':'Folders shown','%total%':'Total folders','%pagenum%':'Total pages','#%PAGING()%#':'Pagination'}},
    22:{n:'Folder Editor', cat:'Content',
        q:'Rename or delete a folder.',
        e:'Allows modifying folder name or moving to a different parent. Owner or admin.',
        p:{id:'Folder ID',name:'New name',parent:'New parent ID'},
        v:{'%form%':'Editor form HTML','%error%':'Error message'}},
    23:{n:'File Uploader', cat:'Content',
        q:'Upload form for files.',
        e:'Shows a file upload form. Files go to a specified folder in the file manager.',
        p:{dir:'Target folder ID', limit:'Max file size',file:'Pre-set file'},
        v:{'%form%':'Upload form HTML','%error%':'Error message'}},
    24:{n:'File Lister', cat:'Content',
        q:'List uploaded files with name, size, and date.',
        e:'Displays a paginated, searchable list of files. Supports filtering by folder, user, format.\n\nConfig fields can use TAG macros: {{GET(fileid)}} for dynamic filtering.',
        p:{id:'Filter by file ID',id_not:'Exclude file ID',userid:'Filter by uploader ID',userid_not:'Exclude uploader',limit:'Files per page (max 30)',page:'Page number',order:'name/new/old/small/big', dir:'Filter by folder ID',dir_not:'Exclude folder',search:'Search by keyword',name:'Filter by name',name_not:'Exclude name',format:'Filter by extension',format_not:'Exclude extension'},
        v:{'%id%':'File ID','%key%':'File hash:ID key','%name%':'File name','%size%':'File size','%date%':'Upload date','%thumb%':'Thumbnail link','%hits%':'Download count','%format%':'File extension','%userid%':'Uploader ID','%username%':'Uploader username','%dir%':'Folder ID','%dirname%':'Folder name','%category%':'Category label','%var(name)%':'Extra saved meta value','%download_link%':'Download URL','%cdn_link%':'Direct file link (use as audio/video src)','%delete%':'Delete link (owner/admin only)','%count%':'Files shown','%total%':'Total files','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination HTML'}},
    25:{n:'File Editor', cat:'Content',
        q:'Edit file name, meta, or delete a file.',
        e:'Allows renaming, updating metadata, or deleting a file. Owner or admin access.',
        p:{id:'File ID',name:'New file name'},
        v:{'%form%':'Editor form HTML','%error%':'Error message'}},
    26:{n:'API Data Creator', cat:'Data',
        q:'Insert a new row into a custom data table.',
        e:'Creates a record in a predefined data table with typed fields.',
        p:{table_id:'Data table ID',data:'JSON object with field values'},
        v:{}},
    27:{n:'API Data Lister', cat:'Data',
        q:'Query and display custom data rows.',
        e:'Fetches rows from a data table with filtering, sorting, and pagination.',
        p:{tableid:'Data table ID', limit:'Rows per page', page:'Page number', order:'Sort column_dir'},
        v:{}},
    28:{n:'API Data Editor', cat:'Data',
        q:'Edit or delete custom data rows.',
        e:'Modifies or removes rows from a data table. Owner or admin access.',
        p:{pid:'Data row ID',data:'Updated JSON object'},
        v:{}},
    29:{n:'Lua Script', cat:'Advanced',
        q:'Full server-side programming. Variables, loops, HTTP, DB access.',
        e:'Executes Lua code with full sandbox access. Can manipulate HTTP headers, database records, URL routing, and page output. Use the Lua Reference for the complete API.',
        p:{}, v:{}}
  },
  tags: {
    'VAR':        {n:'Get variable',   d:'Read a stored variable by name.',                   t:'{{VAR(█)}}',          g:'Data'},
    'GET':        {n:'Query param',    d:'Read URL query parameter value.',                   t:'{{GET(█)}}',          g:'Data'},
    'POST':       {n:'Form field',     d:'Read submitted form field value.',                  t:'{{POST(█)}}',         g:'Data'},
    'REQUEST':    {n:'Request value',  d:'Read GET or POST parameter.',                       t:'{{REQUEST(█)}}',      g:'Data'},
    'COOKIE':     {n:'Cookie value',   d:'Read browser cookie value.',                        t:'{{COOKIE(█)}}',       g:'Data'},
    'VALUE':      {n:'Literal value',  d:'Set a value directly as text.',                     t:'{{VALUE(█)}}',        g:'Data'},
    'DATE':       {n:'Format date',    d:'Format current time. "AGO" for relative time.',     t:'{{DATE(Y-m-d H:i:s)}}', g:'Data'},
    'DATA':       {n:'Interpolate',    d:'Replace #VAR# #GET# markers in text string.',       t:'{{DATA(Hi #VAR(name)#)}}', g:'Data'},
    'INT':        {n:'To integer',     d:'Cast current value to integer.',                    t:'{{INT}}',             g:'Data'},
    'NULL':       {n:'To null',        d:'Set current value to null/empty.',                  t:'{{NULL}}',            g:'Data'},
    'LOWER':      {n:'Lowercase',      d:'Convert text to lowercase.',                        t:'{{LOWER}}',           g:'Transform'},
    'UPPER':      {n:'Uppercase',      d:'Convert text to uppercase.',                        t:'{{UPPER}}',           g:'Transform'},
    'TRIM':       {n:'Trim spaces',    d:'Remove leading/trailing whitespace.',               t:'{{TRIM}}',            g:'Transform'},
    'CHOP':       {n:'Chop end',       d:'Remove trailing characters (rtrim).',               t:'{{CHOP(.)}}',         g:'Transform'},
    'REPLACE':    {n:'Find & replace', d:'Replace text. JSON: ["find","replace"]',             t:'{{REPLACE(["a","b"])}}', g:'Transform'},
    'CUT':        {n:'Cut substring',  d:'Extract text. JSON: [start, length]',               t:'{{CUT([0,100])}}',    g:'Transform'},
    'ADD':        {n:'Append text',    d:'Add text to the end of current value.',             t:'{{ADD(█)}}',          g:'Transform'},
    'APPEND':     {n:'Prepend text',   d:'Add text before current value.',                    t:'{{APPEND(█)}}',       g:'Transform'},
    'SLUG':       {n:'URL slug',       d:'Convert to URL-safe lowercase-hyphen format.',      t:'{{SLUG}}',            g:'Transform'},
    'REMOVE_TAG': {n:'Strip HTML',     d:'Remove HTML tags. Optionally allow specific tags.',  t:'{{REMOVE_TAG(a,p)}}', g:'Transform'},
    'PLUS':       {n:'Add number',     d:'Add to current numeric value.',                     t:'{{PLUS(5)}}',         g:'Math'},
    'MINUS':      {n:'Subtract',       d:'Subtract from current numeric value.',              t:'{{MINUS(3)}}',        g:'Math'},
    'MULTIPLY':   {n:'Multiply',       d:'Multiply current value by a number.',               t:'{{MULTIPLY(2)}}',     g:'Math'},
    'DIVIDE':     {n:'Divide',         d:'Divide current value by a number (0-safe).',        t:'{{DIVIDE(2)}}',       g:'Math'},
    'LENGTH':     {n:'String length',  d:'Count characters in current value.',                t:'{{LENGTH}}',          g:'Math'},
    'RANDOM':     {n:'Random',         d:'Pick random item from array, or shuffle string.',   t:'{{RANDOM(["a","b"])}}', g:'Math'},
    'HTML_ENCODE':   {n:'Encode HTML',     d:'Convert <>& to HTML entities for safe display.',  t:'{{HTML_ENCODE}}',     g:'Encode'},
    'HTML_DECODE':   {n:'Decode HTML',     d:'Convert HTML entities back to characters.',       t:'{{HTML_DECODE}}',     g:'Encode'},
    'BASE64_ENCODE': {n:'Base64 encode',   d:'Encode text to base64 format.',                   t:'{{BASE64_ENCODE}}',   g:'Encode'},
    'BASE64_DECODE': {n:'Base64 decode',   d:'Decode base64 back to text.',                     t:'{{BASE64_DECODE}}',   g:'Encode'},
    'URL_ENCODE':    {n:'URL encode',      d:'Encode special characters for safe URLs.',         t:'{{URL_ENCODE}}',      g:'Encode'},
    'URL_DECODE':    {n:'URL decode',      d:'Decode URL-encoded text.',                         t:'{{URL_DECODE}}',      g:'Encode'},
    'JSON_ENCODE':   {n:'JSON encode',     d:'Convert value to JSON string.',                    t:'{{JSON_ENCODE}}',     g:'Encode'},
    'JSON_DECODE':   {n:'JSON decode',     d:'Parse JSON string to value.',                      t:'{{JSON_DECODE}}',     g:'Encode'},
    'IFSET':     {n:'If set',          d:'True if variable exists and is not empty.',          t:'{{IFSET(█)}}\n  shown\n{{END}}', g:'Conditions'},
    'IFNOT':     {n:'If not set',      d:'True if variable is empty or missing.',              t:'{{IFNOT(█)}}\n  shown\n{{END}}', g:'Conditions'},
    'IFEQ':      {n:'If equals',       d:'True if value exactly equals text.',                  t:'{{IFEQ(█)}}\n{{END}}', g:'Conditions'},
    'IFNE':      {n:'If not equals',   d:'True if value does not equal text.',                  t:'{{IFNE(█)}}\n{{END}}', g:'Conditions'},
    'IFGE':      {n:'If >=',           d:'True if numeric value is >= number.',                 t:'{{IFGE(█)}}\n{{END}}', g:'Conditions'},
    'IFLE':      {n:'If <=',           d:'True if numeric value is <= number.',                 t:'{{IFLE(█)}}\n{{END}}', g:'Conditions'},
    'IFLIKE':    {n:'If like',         d:'True if case-insensitive match.',                     t:'{{IFLIKE(█)}}\n{{END}}', g:'Conditions'},
    'IFIN':      {n:'If in array',     d:'True if value in JSON array or substring match.',    t:'{{IFIN(["a","b"])}}\n{{END}}', g:'Conditions'},
    'IFMATCH':   {n:'If regex',        d:'True if value matches regex pattern.',                t:'{{IFMATCH(`^[a-z]+`)}}\n{{END}}', g:'Conditions'},
    'OR':        {n:'OR / fallback',   d:'Inside condition: OR next. Outside: fallback value.',  t:'{{OR(█)}}',           g:'Conditions'},
    'THEN':      {n:'Then output',     d:'If condition is true, output this.',                  t:'{{THEN(█)}}',         g:'Conditions'},
    'ELSE':      {n:'Else output',     d:'If condition is false, output this.',                 t:'{{ELSE(█)}}',         g:'Conditions'},
    'END':       {n:'End condition',   d:'Close a conditional block.',                          t:'{{END}}',             g:'Conditions'},
    'SET':       {n:'Set variable',    d:'Store value in page-scoped variable.',                 t:'{{SET(name)}}',       g:'Storage'},
    'SAVE':      {n:'Save to session', d:'Store value in session (persists across pages).',      t:'{{SAVE(name)}}',      g:'Storage'},
    'STOP':      {n:'Stop processing', d:'Halt the tag pipeline, return current value.',         t:'{{STOP}}',            g:'Control'},
    'GOTO':      {n:'Redirect',        d:'Immediately redirect and stop all code execution.',     t:'{{GOTO(https://█)}}', g:'Control'},
    'PAGING':    {n:'Pagination',      d:'Generate pagination HTML from list config.',           t:'{{PAGING}}',          g:'Control'}
  },
  luaNote: 'Lua scripting (type 29) gives you full server-side control — variables, loops, HTTP headers, database access, and URL routing. See the Lua Reference for the complete API.'
};
if(!D)return;
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
})();
