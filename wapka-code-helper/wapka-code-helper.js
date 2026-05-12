(function(){
var D={
types:{
 0:{n:'Code',c:'Page Logic',q:'Raw HTML, CSS, or JS output. No tag processing. Whatever you write is sent directly to the browser.',e:'The simplest code type. Use for static content, embedded styles/scripts, or third-party embed codes. No tag processing occurs.',p:{},v:{}},
 1:{n:'TAG Code',c:'Page Logic',q:'Dynamic content using {{TAG()}} macros. Chain functions with @. 50 built-in functions for data, math, and conditions.',e:'Write TAG macros inside double braces. Chain functions with @. Supports {{VAR}}, {{GET}}, {{POST}}, {{IFSET}}/{{ELSE}}/{{END}} conditions, math operations, and storage. See the Tags tab for the full reference.',p:{},v:{}},
 2:{n:'Youtube API',c:'Content',q:'Display YouTube video and channel data.',e:'Fetches YouTube video/channel information and displays it using templates.',p:{id:'Video or channel ID. Multiple IDs: id=one,two,three',category:'Get videos from defined category',type:'VIDEO (default), RELATED (related videos), TRENDING, or CHANNEL',maxresults:'Display limit (max 50)',pagetoken:'Page token',order:'relevance, date, rating, title, videoCount, viewCount'},v:{}},
 3:{n:'Auto Redirect',c:'Page Logic',q:'Redirect visitors to another URL. Stops all further execution.',e:'When this code runs, it immediately sends a redirect header and exits. No other codes or page content will be processed.',p:{url:'Target URL (can use TAG macros)'},v:{}},
 4:{n:'Head Tags',c:'Page Logic',q:'Inject meta tags, CSS, or JS into <head>.',e:'Content goes into HTML <head> instead of body. Use for meta tags, Open Graph, analytics, or CSS that must load before content.',p:{append:'Append to existing head tags'},v:{}},
 5:{n:'File Viewer',c:'Content',q:'Display or stream a file from any Wapka site or account.',e:'Shows a file by its ID. Can display inline or force download.',p:{},v:{}},
 6:{n:'Online User',c:'Users',q:'Show currently active visitors with details.',e:'Lists visitors browsing the site. Filter by user or page.',p:{'ID, ID_NOT':'Set USERID=0 for guests only or ID_NOT=0 for logged users only','PAGEID, PAGEID_NOT':'Filter by page','PAGE':'Page number','ORDER':'NEW or OLD','LIMIT':'Items per page (max 30, default 20)','URL':'Required for pagination'},v:{'%userid%':'User ID','%username%':'Username','%date%':'Last active time','%browser%':'Browser name','%os%':'Device OS','%useragent%':'HTTP user agent','%avatar%':'Profile picture','%point%':'Credit points','%var(name)%':'Extra saved data','%pageid%':'Current page ID','%pagename%':'Page name','%location%':'Full URL (admin only)','%country%':'Country from IP','%ip%':'IP address','%role%':'User role','%count%':'Users shown','%pagenum%':'Total pages','%total%':'Total users','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 7:{n:'User Login',c:'Users',q:'Login form with authentication.',e:'Renders a complete login form. On success, redirects to configured URL. On error, shows form again with message.\n\nConfig fields can use TAG macros for dynamic values: <email>{{POST(email)}}</email>',p:{USERNAME:'Username input field',EMAIL:'Email field (optional)',PASSWORD:'Password field',AUTOLOGIN:'Auto-login after register (ON/OFF)',URL:'Redirect after login',ERROR:'Custom error message'},v:{'%notify%':'Show message on error or success'}},
 8:{n:'User Registration',c:'Users',q:'Registration form for new users.',e:'Shows signup form. New users get default level 1 (Subscriber).\n\nConfig supports TAG macros for dynamic fields. To add custom fields (e.g. country): <var_country>#%POST(country)%#</var_country>\nName: a-z, 0-9, _ (1-20 chars)',p:{USERNAME:'Username input',EMAIL:'Email input',PASSWORD:'Password input',TYPE:'Account type',ROLE:'User role',AUTOLOGIN:'Auto-login after register (ON/OFF)',URL:'Redirect after register',ERROR:'Custom error'},v:{'%notify%':'Show message on error or success'}},
 9:{n:'User Lister',c:'Users',q:'List registered site users with filtering and pagination.',e:'Directory of all site users. Filter by ID, name, email, type, or role. Supports search and sorting.\n\nExample: show all active users with type = active',p:{'id, id_not':'Filter by user ID (multiple: id=1,2,3)','username, username_not':'Filter by username','email, email_not':'Filter by email','type, type_not':'active, inactive, temp_blocked, blocked','role, role_not':'Filter by user role','search':'Search by keyword','page':'Page number','limit':'Display limit (max 30, default 1)','order':'new or old','url':'Required for pagination'},v:{'%id%':'User ID','%username%':'Username','%regdate%':'Registration date','%email%':'Email','%status%':'Online/offline','%type%':'Account type','%role%':'User role','%avatar%':'Profile picture','%point%':'Credit points','%var(name)%':'Extra saved data','%logindate%':'Last login date','%ip%':'Last login IP','%country%':'Country from IP','%useragent%':'HTTP user agent','%count%':'Users shown','%pagenum%':'Total pages','%total%':'Total users','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 10:{n:'User Editor',c:'Users',q:'Profile editing form for logged-in users.',e:'Allows editing username, email, password, avatar, points, role, and custom variables.\n\nUse SET_* parameters to control which fields are editable. All user lister tags available.',p:{'USERID, USERNAME, TYPE, ERROR':'Identify user. ERROR for custom message','SET_USERNAME, SET_EMAIL, SET_PASSWORD, SET_TYPE, SET_AVATAR, SET_POINT, SET_ROLE, SET_VAR_NAME':'Fields to edit. Example: SET_USERNAME=new_name'},v:{'%notify%':'Show message on error or success'}},
 11:{n:'Message Sender',c:'Content',q:'Send private messages between users.',e:'Form to compose and send messages. Recipient identified by userid, username, or email. Use TAG codes for dynamic recipient.\n\nConfig example: <userid>#%GET(userid)%#</userid>',p:{USERID:'Receiver user ID (can use TAG)',USERNAME:'Receiver username (can use TAG)',EMAIL:'Receiver email',MESSAGE:'Message body'},v:{'%notify%':'Show notification on success'}},
 12:{n:'Message Lister',c:'Content',q:'Inbox/outbox showing messages with pagination.',e:'Displays messages with filtering, grouping, and status tracking. Can show unread messages for notification systems.\n\nExample: unread notification system with status=unread',p:{'id, id_not':'Filter by message ID (multiple allowed)','userid, userid_not, username, username_not':'Filter by user','limit':'Messages per page (max 30)','type':'inbox or outbox (default: both)','page':'Page number','group':'Group by sender for one-per-user view','order':'new or old','url':'Pagination URL','status':'read or unread (use unread for notifications)'},v:{'%id%':'Message ID','%sender_id%, %receiver_id%':'User IDs','%sender_name%, %receiver_name%':'Usernames','%sender_avatar%, %receiver_avatar%':'Avatars','%sender_role%, %receiver_role%':'Roles','%sender_email%, %receiver_email%':'Emails','%type%':'inbox or outbox','%msg%, %msg(500)%':'Full or truncated message','%date%':'Sent date','%status%':'read or unread','%delete%':'Delete link','%total%':'Total messages','%count%':'Messages shown','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 13:{n:'Message Editor',c:'Content',q:'View, edit, or delete a message.',e:'Only the sender can edit a message. Use SET_MESSAGE to update content.',p:{'ID, ERROR':'Message ID. ERROR for custom message',SET_MESSAGE:'New message content'},v:{'%msg%':'Get message content','%notify%':'Show message on error or success'}},
 14:{n:'Forum Creator',c:'Content',q:'Create a new forum category.',e:'Form to create a forum. Optionally set parent forum ID for nested forums.',p:{NAME:'Forum name',PARENT:'Parent forum ID',ERROR:'Custom error message'},v:{'%notify%':'Show notification on success'}},
 15:{n:'Forum Lister',c:'Content',q:'List forums with post counts.',e:'Directory of forums with name, post count, and parent info. Filter by ID, name, parent, or search.',p:{'id, id_not':'Filter by forum ID (multiple: id=1,2,5)','name, name_not':'Filter by name','parent, parent_not':'Filter by parent (0=root)','search':'Search by keyword','limit':'Display limit (max 100)','page':'Page number','order':'new, old, or name','url':'Required for pagination'},v:{'%id%':'Forum ID','%name%':'Forum name','%parent_id%':'Parent forum ID','%parent_name%':'Parent forum name','%postnum%':'Post count in forum','%total%':'Total forums','%count%':'Forums shown','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 16:{n:'Forum Editor',c:'Content',q:'Edit or delete a forum.',e:'Rename a forum or change its parent. Use SET_NAME and SET_PARENT to modify.',p:{'ID, NAME, PARENT, ERROR':'Identify forum. ERROR for custom message','SET_NAME, SET_PARENT':'New values'},v:{'%id%':'Forum ID','%name%':'Forum name','%parent_id%':'Parent ID','%notify%':'Show message on error or success'}},
 17:{n:'Post Creator',c:'Content',q:'Write a new forum post with title and content.',e:'Create a post in a specific forum. Supports thumbnail, status, and custom variables via config.\n\nCustom var: var_NAME in config (Name: a-z, 0-9, _ (1-20 chars))',p:{forumid:'Forum ID (required)',title:'Post title',content:'Post body',thumb:'Thumbnail URL',status:'published, draft, or pending'},v:{'%notify%':'Show notification on error or success'}},
 18:{n:'Post Lister',c:'Content',q:'List forum posts with filtering and pagination.',e:'Paginated list of posts. Filter by forum, user, status, or search. Displays title, content, author, and date.',p:{'id, id_not':'Filter by post ID','title, title_not':'Filter by title','userid, userid_not':'Filter by author','forumid, forumid_not':'Filter by forum','limit':'Display limit (max 20)','page':'Page number','order':'new or old','category, category_not':'Filter by category','search':'Search by keyword'},v:{'%id%':'Post ID','%title%':'Post title','%content%':'Full post content','%content(100)%':'Truncated content','%userid%':'Author ID','%username%':'Author username','%date%':'Creation date','%forumid%':'Forum ID','%views%':'View count','%status%':'Post category','%delete%':'Delete link (owner/admin)','%forumname%':'Forum name','%thumb%':'Thumbnail URL','%var(name)%':'Extra saved data','%count%':'Posts shown','%total%':'Total posts','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 19:{n:'Post Editor',c:'Content',q:'Edit or delete an existing post.',e:'Modify title, content, status, thumbnail, or custom variables. All post lister tags available.',p:{'ID, STATUS, STATUS_NOT, FORUMID, FORUMID_NOT, USERID, USERID_NOT, ERROR':'Identify post. ERROR for custom message','SET_TITLE, SET_CONTENT, SET_USERID, SET_FORUMID, SET_STATUS, SET_THUMB, SET_VAR_NAME':'Fields to edit. Example: SET_TITLE=New title'},v:{'%notify%':'Show message on error or success'}},
 20:{n:'Folder Creator',c:'Content',q:'Create a new file folder.',e:'Form to create a folder. Optionally set parent directory ID.',p:{NAME:'Folder name',DIR:'Parent folder ID',ERROR:'Custom error'},v:{'%notify%':'Show notification on success'}},
 21:{n:'Folder Lister',c:'Content',q:'List folders with file counts.',e:'Directory of folders. Shows name, file count inside, parent info. Filter by ID, name, or search.',p:{'dir, dir_not':'Filter by parent directory (0=root)','id, id_not':'Filter by folder ID (multiple allowed)','name, name_not':'Filter by name','search':'Search by keyword','limit':'Display limit (max 100)','page':'Page number','order':'new, old, or name','url':'Required for pagination'},v:{'%id%':'Folder ID','%name%':'Folder name','%dir%':'Directory ID','%dirname%':'Directory name','%filenum%':'File count inside','%size%':'Total folder size','%total%':'Total folders','%count%':'Folders shown','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 22:{n:'Folder Editor',c:'Content',q:'Rename or move a folder.',e:'Change folder name or parent directory. Use SET_NAME and SET_DIR.',p:{'ID, DIR, ERROR':'Identify folder. ERROR for custom message','SET_NAME, SET_DIR':'New values'},v:{'%name%':'Folder name','%dir%':'Directory ID','%notify%':'Show message on error or success'}},
 23:{n:'File Uploader',c:'Content',q:'Upload form for files.',e:'File upload with configurable limits. After upload, file tags (%id%, %name%, %cdn_link%, etc.) become available.\n\nCustom var: var_DESCRIPTION in config to capture extra data. Name: a-z, 0-9, _ (1-20 chars)',p:{FILE:'Input name (default: upload)',NAME:'Custom file name',DIR:'Target folder ID',MAXSIZE:'Max size in MB (max 100)',TYPE:'Allowed types (e.g. jpg,png,gif)'},v:{'%notify%':'Show message on error or success','%id%, %dir%, %name%, %format%, %thumb%, %key%, %download_link%, %cdn_link%':'Available after successful upload'}},
 24:{n:'File Lister',c:'Content',q:'List uploaded files with name, size, and date.',e:'Paginated, searchable file directory. Filter by folder, user, format, or keyword. Supports dynamic filtering via TAG macros.\n\nConfig example: <id>#%GET(fileid)%#</id>',p:{'id, id_not':'Filter by file ID (can use TAG)','userid, userid_not':'Filter by uploader','limit':'Display limit (max 30)','page':'Page number','order':'name, new, old, small, or big','dir, dir_not':'Filter by folder ID','search':'Search by keyword','name, name_not':'Filter by filename','format, format_not':'Filter by extension'},v:{'%id%':'File ID','%key%':'File hash:ID key','%name%':'File name','%size%':'File size','%date%':'Upload date','%thumb%':'Thumbnail link','%hits%':'Download count','%format%':'File extension','%userid%':'Uploader ID','%username%':'Uploader username','%dir%':'Folder ID','%dirname%':'Folder name','%category%':'Category label','%var(name)%':'Extra saved data','%download_link%':'Download URL','%cdn_link%':'Direct file link (use as audio/video src)','%delete%':'Delete link (owner/admin)','%count%':'Files shown','%total%':'Total files','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 25:{n:'File Editor',c:'Content',q:'Edit file name, metadata, or delete a file.',e:'Modify file name, uploader, folder, or custom variables. Use SET_* parameters to control edits.',p:{'ID, DIR, DIR_NOT, USERID, USERID_NOT, ERROR':'Identify file. ERROR for custom message','SET_NAME, SET_USERID, SET_DIR, SET_VAR_NAME':'Fields to edit. Example: SET_NAME=New name'},v:{'%id%, %name%, %format%, %dir%, %userid%, %var(NAME)%':'File data tags','%notify%':'Show message on error or success'}},
 26:{n:'API Data Creator',c:'Data',q:'Insert a row into custom data tables. Build your own systems.',e:'Create records in flexible key-value data tables. Used for comment systems, product catalogs, or any custom data.\n\nBy default, the platform uses this for comment systems.',p:{PID:'Primary ID (category ID)',CATEGORY:'Data category (file, folder, page, forum, post, user). Set for BBcode support.',USERID:'Creator user ID (customizable)',KEY1, KEY2, KEY3:'Optional custom keys',VALUE1, VALUE2, VALUE3:'Data values',ERROR:'Custom error message'},v:{'%notify%':'Show notification on success'}},
 27:{n:'API Data Lister',c:'Data',q:'Query and display custom data rows.',e:'Powerful query system with multi-field filtering, grouping, and pagination. Can query across keys, categories, and users.\n\nExample: one row per PID with GROUP=pid',p:{'id, id_not':'Filter by data ID','pid, pid_not':'Filter by primary ID','key1, key2, key3, keyN_not':'Filter by key values','keyN_like':'Search key with regex','category, category_not':'Filter by category','userid, userid_not':'Filter by creator (0=guest)','limit':'Display limit (max 20)','page':'Page number','order':'new or old','group':'Group by: pid, userid, category, keyN. Example: GROUP=pid,category'},v:{'%id%':'Data ID','%pid%':'Primary ID','%userid%':'Creator ID','%username%':'Creator username','%role%':'User role','%avatar%':'Profile picture','%key1%, %key2%, %key3%':'Key values','%date%':'Creation date','%value1%, %value2%, %value3%':'Data values','%delete%':'Delete link','%count%':'Records shown','%total%':'Total records','%pagenum%':'Total pages','#%PAGING(%first% %prev% %num% %next% %last%)%#':'Pagination'}},
 28:{n:'API Data Editor',c:'Data',q:'Edit or delete custom data rows.',e:'Modify any field in a data record. Use SET_* parameters to specify which fields to change.',p:{'ID, ID_NOT, PID, PID_NOT, CATEGORY, CATEGORY_NOT, USERID, USERID_NOT, KEY(N), KEY(N)_NOT, ERROR':'Identify record. ERROR for custom message','SET_PID, SET_USERID, SET_CATEGORY, SET_KEY(N), SET_VALUE(N)':'Fields to edit. Example: SET_VALUE1=New value'},v:{'%notify%':'Show message on error or success'}},
 29:{n:'Lua Script',c:'Advanced',q:'Full server-side programming. Variables, loops, HTTP, DB access.',e:'Execute Lua code with sandbox access. Control HTTP headers, database records, URL routing, and page output. Use print() for output, api.* for data, req.* for request info.',p:{},v:{}}
},
tags:{
  'VAR':{n:'Get variable',d:'Read a stored variable by name.',t:'{{VAR(█)}}',g:'Data'},
  'GET':{n:'Query param',d:'Read URL query parameter value.',t:'{{GET(█)}}',g:'Data'},
  'POST':{n:'Form field',d:'Read submitted form value.',t:'{{POST(█)}}',g:'Data'},
  'REQUEST':{n:'Request value',d:'Read GET or POST parameter.',t:'{{REQUEST(█)}}',g:'Data'},
  'COOKIE':{n:'Cookie value',d:'Read browser cookie value.',t:'{{COOKIE(█)}}',g:'Data'},
  'VALUE':{n:'Literal value',d:'Set a value directly as text.',t:'{{VALUE(█)}}',g:'Data'},
  'DATE':{n:'Format date',d:'"Y-m-d H:i:s" or "AGO" for relative.',t:'{{DATE(Y-m-d H:i:s)}}',g:'Data'},
  'DATA':{n:'Interpolate',d:'Replace #VAR# #GET# markers in text.',t:'{{DATA(Hi #VAR(name)#)}}',g:'Data'},
  'INT':{n:'To integer',d:'Cast current value to int.',t:'{{INT}}',g:'Data'},
  'NULL':{n:'To null',d:'Set current value to null.',t:'{{NULL}}',g:'Data'},
  'LOWER':{n:'Lowercase',d:'Convert text to lowercase.',t:'{{LOWER}}',g:'Transform'},
  'UPPER':{n:'Uppercase',d:'Convert text to uppercase.',t:'{{UPPER}}',g:'Transform'},
  'TRIM':{n:'Trim',d:'Remove leading/trailing whitespace.',t:'{{TRIM}}',g:'Transform'},
  'CHOP':{n:'Chop end',d:'Remove trailing chars (rtrim).',t:'{{CHOP(.)}}',g:'Transform'},
  'REPLACE':{n:'Find & Replace',d:'JSON: ["find","replace"]',t:'{{REPLACE(["a","b"])}}',g:'Transform'},
  'CUT':{n:'Cut',d:'Extract substring. JSON: [start,len]',t:'{{CUT([0,100])}}',g:'Transform'},
  'ADD':{n:'Append',d:'Add text to end.',t:'{{ADD(█)}}',g:'Transform'},
  'APPEND':{n:'Prepend',d:'Add text before.',t:'{{APPEND(█)}}',g:'Transform'},
  'SLUG':{n:'URL slug',d:'Convert to lowercase-hyphen format.',t:'{{SLUG}}',g:'Transform'},
  'REMOVE_TAG':{n:'Strip HTML',d:'Remove HTML, allow specific tags.',t:'{{REMOVE_TAG(a,p)}}',g:'Transform'},
  'PLUS':{n:'Add',d:'Add to numeric value.',t:'{{PLUS(5)}}',g:'Math'},
  'MINUS':{n:'Subtract',d:'Subtract from numeric value.',t:'{{MINUS(3)}}',g:'Math'},
  'MULTIPLY':{n:'Multiply',d:'Multiply numeric value.',t:'{{MULTIPLY(2)}}',g:'Math'},
  'DIVIDE':{n:'Divide',d:'Divide numeric value (0-safe).',t:'{{DIVIDE(2)}}',g:'Math'},
  'LENGTH':{n:'Length',d:'Count characters.',t:'{{LENGTH}}',g:'Math'},
  'RANDOM':{n:'Random',d:'Pick from array or shuffle.',t:'{{RANDOM(["a","b"])}}',g:'Math'},
  'HTML_ENCODE':{n:'Encode HTML',d:'Convert <>& to entities.',t:'{{HTML_ENCODE}}',g:'Encode'},
  'HTML_DECODE':{n:'Decode HTML',d:'Entities back to chars.',t:'{{HTML_DECODE}}',g:'Encode'},
  'BASE64_ENCODE':{n:'Base64 enc',d:'Encode to base64.',t:'{{BASE64_ENCODE}}',g:'Encode'},
  'BASE64_DECODE':{n:'Base64 dec',d:'Decode from base64.',t:'{{BASE64_DECODE}}',g:'Encode'},
  'URL_ENCODE':{n:'URL encode',d:'Encode for safe URLs.',t:'{{URL_ENCODE}}',g:'Encode'},
  'URL_DECODE':{n:'URL decode',d:'Decode URL-encoded text.',t:'{{URL_DECODE}}',g:'Encode'},
  'JSON_ENCODE':{n:'JSON encode',d:'Value to JSON string.',t:'{{JSON_ENCODE}}',g:'Encode'},
  'JSON_DECODE':{n:'JSON decode',d:'JSON string to value.',t:'{{JSON_DECODE}}',g:'Encode'},
  'IFSET':{n:'If set',d:'True if variable is set and non-empty.',t:'{{IFSET(█)}}\n  shown\n{{END}}',g:'Conditions'},
  'IFNOT':{n:'If not set',d:'True if variable is empty/missing.',t:'{{IFNOT(█)}}\n  shown\n{{END}}',g:'Conditions'},
  'IFEQ':{n:'If equals',d:'True if value equals exactly.',t:'{{IFEQ(█)}}\n{{END}}',g:'Conditions'},
  'IFNE':{n:'If not equals',d:'True if value differs.',t:'{{IFNE(█)}}\n{{END}}',g:'Conditions'},
  'IFGE':{n:'If >=',d:'True if numeric >= value.',t:'{{IFGE(█)}}\n{{END}}',g:'Conditions'},
  'IFLE':{n:'If <=',d:'True if numeric <= value.',t:'{{IFLE(█)}}\n{{END}}',g:'Conditions'},
  'IFLIKE':{n:'If like',d:'Case-insensitive match.',t:'{{IFLIKE(█)}}\n{{END}}',g:'Conditions'},
  'IFIN':{n:'If in',d:'True if in array or substring.',t:'{{IFIN(["a"])}}\n{{END}}',g:'Conditions'},
  'IFMATCH':{n:'If regex',d:'True if matches pattern.',t:'{{IFMATCH(`^[a-z]+`)}}\n{{END}}',g:'Conditions'},
  'OR':{n:'OR/Fallback',d:'OR next condition. Fallback if outside.',t:'{{OR(█)}}',g:'Conditions'},
  'THEN':{n:'Then',d:'If true, output this.',t:'{{THEN(█)}}',g:'Conditions'},
  'ELSE':{n:'Else',d:'If false, output this.',t:'{{ELSE(█)}}',g:'Conditions'},
  'END':{n:'End',d:'Close conditional block.',t:'{{END}}',g:'Conditions'},
  'SET':{n:'Set var',d:'Store in page-scoped variable.',t:'{{SET(name)}}',g:'Storage'},
  'SAVE':{n:'Save to session',d:'Store in session (persists).',t:'{{SAVE(name)}}',g:'Storage'},
  'STOP':{n:'Stop',d:'Halt pipeline, return value.',t:'{{STOP}}',g:'Control'},
  'GOTO':{n:'Redirect',d:'Redirect and stop execution.',t:'{{GOTO(https://█)}}',g:'Control'},
  'PAGING':{n:'Pagination',d:'Generate pagination HTML.',t:'{{PAGING}}',g:'Control'}
},
lua:'Lua scripting (type 29) gives full server-side control — variables, loops, HTTP headers, database access, and URL routing. Use print() for output, api.* for data access, req.* for request info, server.* for HTTP control.'
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
  var qb=document.getElementById('wkh-quick-body');if(qb){
    var h='<div class="wkh-desc">'+esc(info.q||'')+'</div>';
    if(info.c)h+='<div class="wkh-badge">'+esc(info.c)+'</div>';
    var pk=Object.keys(info.p||{});if(pk.length){h+='<div class="wkh-sec"><div class="wkh-sh">Parameters</div>';
      for(var i=0;i<pk.length;i++)h+='<div class="wkh-row"><span class="wkh-k">'+esc(pk[i])+'</span><span class="wkh-v">'+esc(info.p[pk[i]])+'</span></div>';
    h+='</div>';}
    var vk=Object.keys(info.v||{});if(vk.length){h+='<div class="wkh-sec"><div class="wkh-sh">Template Tags</div>';
      for(var i=0;i<vk.length;i++)h+='<div class="wkh-row"><code class="wkh-vk">'+esc(vk[i])+'</code><span class="wkh-v">'+esc(info.v[vk[i]])+'</span></div>';
    h+='</div>';}
    qb.innerHTML=h;
  }
  var eb=document.getElementById('wkh-explain-body');if(eb){
    eb.innerHTML='<div class="wkh-desc">'+esc(info.e||'').replace(/\n/g,'<br>')+'</div>';
  }
  var tt=document.getElementById('wkh-tab-tags');if(tt)tt.style.display=t===1?'':'none';
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
  buildTagList();buildIndex();buildLuaTab();refresh();
}

function buildTagList(){
  var pane=document.getElementById('wkh-pane-tags'),tags=D.tags;
  var groups={};for(var k in tags){var g=tags[k].g||'Other';if(!groups[g])groups[g]=[];groups[g].push({key:k,info:tags[k]});}
  var order=['Data','Transform','Math','Encode','Conditions','Storage','Control','Other'];
  var h='<div class="wkh-tagbar"><input class="wkh-search" placeholder="Filter tags..." oninput="window._wkhFilterTags(this.value)"></div>';
  for(var i=0;i<order.length;i++){var g=order[i];if(!groups[g])continue;
    h+='<div class="wkh-group" data-group="'+esc(g)+'"><div class="wkh-group-h">'+esc(g)+'</div>';
    for(var j=0;j<groups[g].length;j++){var tg=groups[g][j];
      h+='<div class="wkh-tag" onclick="window._wkhCopyTag(\''+esc(tg.info.t)+'\')" title="'+esc(tg.info.d)+'"><span class="wkh-tag-n">'+esc(tg.info.n)+'</span><span class="wkh-tag-s">'+esc(tg.key)+'</span></div>';}
    h+='</div>';}
  pane.innerHTML=h;
}
window._wkhFilterTags=function(q){
  if(!q){document.querySelectorAll('.wkh-group').forEach(function(g){g.style.display='';});return;}
  q=q.toLowerCase();document.querySelectorAll('.wkh-tag').forEach(function(t){t.style.display=(t.textContent.toLowerCase().indexOf(q)>=0)?'':'none';});
  document.querySelectorAll('.wkh-group').forEach(function(g){g.style.display=g.querySelectorAll('.wkh-tag[style*="display:"]').length===g.querySelectorAll('.wkh-tag').length?'none':'';});
};

function buildIndex(){
  var h='';var types=D.types,cats={};for(var k in types){var c=types[k].c||'Other';if(!cats[c])cats[c]=[];cats[c].push({key:k,info:types[k]});}
  var ord=['Page Logic','Users','Content','Data','Advanced'];
  for(var i=0;i<ord.length;i++){var c=ord[i];if(!cats[c])continue;
    h+='<div class="wkh-group"><div class="wkh-group-h">'+esc(c)+'</div>';
    for(var j=0;j<cats[c].length;j++){var t=cats[c][j];h+='<div class="wkh-idx-item" onclick="window._wkhShowType('+t.key+')"><span class="wkh-idx-n">'+esc(t.info.n)+'</span><span class="wkh-idx-t">type '+t.key+'</span></div>';}
    h+='</div>';}
  document.getElementById('wkh-index-body').innerHTML=h;
}
window._wkhShowType=function(tid){typeEl.value=tid;typeEl.dispatchEvent(new Event('change',{bubbles:1}));refresh();showTab('quick');};

function buildLuaTab(){document.getElementById('wkh-lua-body').innerHTML='<div class="wkh-desc">'+esc(D.lua||'')+'</div>';}

function showTab(name){
  document.querySelectorAll('#wkh-tabs button').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});
  document.querySelectorAll('#wkh-content > div').forEach(function(d){d.style.display='none';});
  var el=document.getElementById('wkh-pane-'+name);if(el)el.style.display='block';
}
window._wkhShowTab=showTab;
window._wkhClose=function(){var p=document.getElementById('wkh-panel');if(p)p.classList.remove('open');var t=document.getElementById('wkh-toggle');if(t)t.style.display='';open=false;};
window._wkhCopyTag=function(t){var text=t.replace(/\u2588/g,'');if(navigator.clipboard){navigator.clipboard.writeText(text).then(function(){pulseTag();});}else{var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);pulseTag();}};
function pulseTag(){var b=document.getElementById('wkh-toggle');if(b){b.style.transform='scale(1.2)';setTimeout(function(){b.style.transform='';},200);}}
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

if(!find())return document.addEventListener('DOMContentLoaded',function(){if(find()){inject();listen();}});
inject();listen();
})();
