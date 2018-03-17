/*
minified version of the scripts in /js/ from commit b5743dcf8b69f080aca8aeb5f2ab7ea41f834b1e
@author robalb / http://halb.it / https://github.com/robalb/morsechat
*/
var context,lastMessageType,lastPersonId,audioSupport=!0,isAuth=!1,connectedChannel="",oX1101o=!0;function chConnect(e){document.getElementById("ch-menu").style.display="none";var t="presence-ch"+e;if(t==connectedChannel)chat.insertMsg("already connected to this channel",!1);else{history.replaceState({foo:""},"morse chat","?ch="+e),document.getElementById("ch-display").innerText=e,chatId.innerHTML='<p id="connecting-msg">connecting...</p>',isAuth=!1,pusher.unsubscribe(connectedChannel),channel=pusher.subscribe(t),connectedChannel=t,channel.bind("pusher:subscription_succeeded",function(){isAuth=!0;var e=channel.members.count,t=channel.name.substr(11);document.getElementById("connecting-msg").innerHTML="connected to channel "+t+"<br>username: <a onclick='displaySenderInfo("+channel.members.me.id+")'>"+channel.members.me.info.username+"</a><br>"+e+" morser"+(e>1?"s":"")+" online",document.getElementById("sidebar_username_disp").innerText=channel.members.me.info.username,console.log(channel.members)}),channel.bind("pusher:subscription_error",function(e){document.getElementById("connecting-msg").innerHTML="<p>connection error. status: "+e+"</p>"}),channel.bind("morsebroadcast",function(e){lastMessageType=0;var t=channel.members.get(e.sender),n=e.sender==channel.members.me.id?"you":t.info.username;chat.insertMorsingMsg(e.sender,n,e.message)}),channel.bind("pusher:member_added",function(e){var t=channel.members.count;0!=lastMessageType&&lastPersonId==e.id?(console.log("still him"),document.querySelectorAll(".msg-normal:last-child .editable")[0].innerHTML="<span class='editable'> reconnected. <br>"+t+" morser"+(t>1?"s":"")+" online</span></p>"):(lastMessageType=1,lastPersonId=e.id,chat.insertMsg("<p class='msg-normal' ><a onclick='displaySenderInfo("+e.id+")'>"+e.info.username+"</a><span class='editable'> joined the chat.<br>"+t+" morsers online</span></p>",!0),console.log("new member"),console.log(e))}),channel.bind("pusher:member_removed",function(e){var t=channel.members.count;0!=lastMessageType&&lastPersonId==e.id?(console.log("still him"),document.querySelectorAll(".msg-normal:last-child .editable")[0].innerHTML="<span class='editable'> joined and left the chat <br>"+t+" morser"+(t>1?"s":"")+" online</span></p>"):(lastMessageType=2,lastPersonId=e.id,chat.insertMsg("<p class='msg-normal' ><a onclick='displaySenderInfo("+e.id+")' >"+e.info.username+"</a><span class='editable'> left the chat. <br>"+t+" morser"+(t>1?"s":"")+" online</span></p>",!0),console.log("removed member"),console.log(e))})}console.log(e)}function openMlSidebar(){document.getElementById("morseListSideBar").style.display="block"}function closeMlSidebar(){document.getElementById("morseListSideBar").style.display="none"}function stretchMlSidebar(){document.getElementById("morseListSideBar").style.width="100%",document.getElementById("morseList").style.columnCount=4}function unstretchMlSidebar(){document.getElementById("morseListSideBar").style.width="180px",document.getElementById("morseList").style.columnCount=2}function openMenu(){document.getElementById("menu").style.display="block"}function openSettings(){document.getElementById("settings").style.display="block"}function popup(e,t){document.getElementById("popup").style.display="table",document.getElementById("popupTitle").innerText=e,document.getElementById("popupContent").innerHTML=t}function displaySenderInfo(e){var t=channel.members.get(e);popup("user info",t?"<p>username: "+t.info.username+"<br>continent: "+t.info.continent+"<br>country: "+t.info.countryName+"<br>id: "+e+"</p>":"<p>this user doesn't exist anymore</p>")}function scrollDown(){document.getElementById("radiobt").style.display="none",chatId.scrollTop=chatId.scrollHeight,viewTagDisplaied&&(viewedMessages=!0)}window.addEventListener("load",function(){Pusher.logToConsole=!0,keyId=document.getElementById("key"),barId=document.getElementById("timebar_bar"),letterDisplayId=document.getElementById("letterDisp"),phraseDisplayId=document.getElementById("phraseDisp"),chatId=document.getElementById("chatContainer"),chMenuId=document.getElementById("ch-menu"),settings.applyMultipliers(settings.defaultMultipliers),"undefined"!=typeof AudioContext?context=new AudioContext:"undefined"!=typeof webkitAudioContext?context=new webkitAudioContext:void 0!==window.webkitAudioContext?context=new window.webkitAudioContext:void 0!==window.AudioContext?context=new window.AudioContext:"undefined"!=typeof mozAudioContext?context=new mozAudioContext:audioSupport=!1,chatId.addEventListener("scroll",function(e){chat.viewTagDisplaied&&(chatId.scrollTop<chatId.scrollHeight-chatId.offsetHeight||(document.getElementById("radiobt").style.display="none",chat.viewedMessages=!0))},!1);for(var e="",t=1,n=config.MAX_CHANNELS+1;t<n;t++)e+='<a onclick="chConnect('+t+')" >channel '+t+"</a>";chMenuId.innerHTML=e,document.getElementById("ch-open").addEventListener("click",function(e){chMenuId.style.display="block",e.stopPropagation()}),window.addEventListener("click",function(e){chMenuId.contains(e.target)||(chMenuId.style.display="none")}),keyId.addEventListener("touchstart",function(e){e.stopPropagation(),e.preventDefault(),morseKey.down()},!1),keyId.addEventListener("touchend",function(e){e.stopPropagation(),e.preventDefault(),morseKey.up()},!1),keyId.addEventListener("mousedown",function(){console.log(morseKey),morseKey.down()},!1),keyId.addEventListener("mouseup",function(){morseKey.up()},!1);var s=!1;document.addEventListener("keydown",function(e){s||32!=e.keyCode&&32!=e.which&&" "!=e.key&&"Space"!=e.code||(e.preventDefault(),s=!0,morseKey.down())},!1),document.addEventListener("keyup",function(e){32!=e.keyCode&&32!=e.which&&" "!=e.key&&"Space"!=e.code||(e.preventDefault(),s=!1,morseKey.up())},!1),pusher=new Pusher(config.PUSHER_KEY,{authEndpoint:"app/auth.php",cluster:config.PUSHER_CLUSTER,encrypted:!0});var o="ch";o=o.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var i=new RegExp("[\\?&]"+o+"=([^&#]*)").exec(location.search);chConnect(null===i?1:decodeURIComponent(i[1].replace(/\+/g," "))),window.requestAnimationFrame||(window.requestAnimationFrame=window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e,t){window.setTimeout(e,1e3/60)})},!1);var morseKey={isDown:!1,startHold:0,letter:"",phrase:"",down:function(){if(!this.isDown){this.isDown=!0,clearTimeout(this.spaceTimer),sender.stopCountDown(),this.startHold=Date.now();var e=this;this.dashTimer=setTimeout(function(){e.up(),console.log(morseKey),console.log("holded dash for too long. released it")},3*settings.dashLength),keyId.style.backgroundColor="#404040",audioSupport&&settings.keySound&&(this.o=context.createOscillator(),this.o.frequency.value=1175,this.g=context.createGain(),this.o.connect(this.g),this.g.connect(context.destination),this.o.start(0))}},up:function(){if(this.isDown){this.isDown=!1,clearTimeout(this.dashTimer),keyId.style.backgroundColor="#212121";var e=Date.now()-this.startHold;this.letter+=e>settings.dashLength?"1":"0",console.log("letter is now "+this.letter),letterDisplayId.insertAdjacentText("beforeend",e>settings.dashLength?"_":".");var t=this;this.spaceTimer=setTimeout(function(){t.pushWord()},settings.charactersPause),audioSupport&&settings.keySound&&this.o.stop(context.currentTime)}},pushWord:function(){if("000000"==this.letter)if(this.phrase=this.phrase.slice(0,-1),phraseDisplayId.innerText=this.phrase,console.log("undo"),console.log("phrase is now "+this.phrase),this.phrase.length>0){var e=this;this.spaceTimer=setTimeout(function(){e.pushSpace()},settings.wordsPause)}else chat.insertMsg("<p>message removed</p>",!1);else{this.phrase+=""+(morse.tree[this.letter]?morse.tree[this.letter]:"");var t=morse.tree[this.letter]?morse.tree[this.letter]:"<span>|</span>";phraseDisplayId.insertAdjacentHTML("beforeend",t),console.log("decoded "+this.letter+" into "+t),this.letter="",letterDisplayId.innerText="",console.log("letter added to phrase"),console.log("phrase is now "+this.phrase);e=this;this.spaceTimer=setTimeout(function(){console.log(e),e.pushSpace()},settings.wordsPause)}this.letter="",letterDisplayId.innerText=""},pushSpace:function(){this.phrase+=" ",phraseDisplayId.insertAdjacentHTML("beforeend"," "),console.log("added space"),sender.startCountDown(this.phrase)}};sender={countDownCtrl:0,msg:"",startCountDown:function(e){this.msg=e,this.countDownCtrl=Date.now(),this.update(),barId.style.height="2px",console.log("started a "+settings.phraseInactivityTime+"ms countdown")},stopCountDown:function(){this.countDownCtrl=0},update:function(){if(0==this.countDownCtrl)console.log("send countdown interrupted. progress bar removed"),barId.style.height="0px",barId.style.width="0px";else{var e=Date.now()-this.countDownCtrl;e<settings.phraseInactivityTime?(barId.style.width=100*e/settings.phraseInactivityTime+"%",window.requestAnimationFrame(function(){sender.update()})):this.send()}},send:function(){if(console.log("made it to "+settings.phraseInactivityTime+"! sending the message"),barId.style.height="0px",barId.style.width="0px",isAuth){var e=morse.webEncode(this.msg),t=new XMLHttpRequest;t.open("GET","app/send.php?msg="+e),t.onload=function(){200===t.status?console.log(t.statusText):chat.insertMsg("<p>error "+t.status+" "+t.statusText+"</p>",!0)},t.send()}else chat.insertMsg("<p>failed to broadcast the message. <br> you are not connected to a channell</p>",!0);morseKey.phrase="",phraseDisplayId.innerHTML=""}};var settings={defaultMultipliers:[80,3,1,3,5,2e3],newMultipliers:[80,3,1,3,5,2e3],morserDotSpeed:80,updateMorserSpeed:function(e){this.morserDotSpeed=e,document.getElementById("morserSpeedDisp").text=e,document.getElementById("morserWpmDisp").text=Math.floor(1200/e)},updateMultiplier:function(e,t){0==e&&(document.getElementById("dotSpeedDisp").text=t),t>0&&(t<=500||5==e&&t<=4e3)&&(this.newMultipliers[e]=t,console.log("applying multipliers"),this.applyMultipliers(this.newMultipliers))},restoreDefaultMultipliers:function(){console.log("applying default multipliers"),this.applyMultipliers(this.defaultMultipliers),this.newMultipliers=this.defaultMultipliers.slice(0)},applyMultipliers:function(e){var t=e[0];this.dashLength=t*e[1],this.elementsPause=t*e[2],this.charactersPause=t*e[3],this.wordsPause=t*e[4],this.phraseInactivityTime=e[5],document.getElementById("dotSpeedDisp").text=e[0],document.getElementById("dotWpmDisp").text=Math.floor(1200/e[0]),document.getElementById("speedRange").value=e[0];for(var n=document.getElementsByClassName("tElement"),s=0;s<n.length;s++)n[s].value=e[s+1]},dumpAsString:function(){var e="";this.newMultipliers.forEach(function(t){e+="x"+t}),popup("export code","<p>this is your configuration code. Keep it somewhere safe.</p><p><b>"+e+"</i></p><br>")},importFromString:function(){var e=document.getElementById("stringInput").value.split("x");if(7==e.length){for(var t=1;t<7;t++)console.log(e[t]),parseFloat(e[t])>0&&parseFloat(e[t])<=4e3?this.newMultipliers[t-1]=parseFloat(e[t]):(console.log("invalid value"),this.newMultipliers[t-1]=this.defaultMultipliers[t-1]);this.applyMultipliers(this.newMultipliers)}else popup("import error","<p>Invalid code!</p>")},keySound:!0,receivedMorseSound:!0,toggleKeySound:function(){this.keySound?(this.keySound=!1,document.getElementById("ksbutton").innerText="enable key sound"):(this.keySound=!0,document.getElementById("ksbutton").innerText="disable key sound")},toggleReceivedSound:function(){this.receivedMorseSound?(this.receivedMorseSound=!1,document.getElementById("rmbutton").innerText="unmute received morse"):(this.receivedMorseSound=!0,document.getElementById("rmbutton").innerText="mute received morse")}},chat={viewTagDisplaied:!1,viewedMessages:!1,insertMsg:function(e,t){if(chatId.scrollTop<chatId.scrollHeight-chatId.offsetHeight){if(document.getElementById("radiobt").style.display="block",this.viewTagDisplaied&&this.viewedMessages){this.viewedMessages=!1,this.viewTagDisplaied=!1;var n=document.getElementById("unread-msg");n.outerHTML="",delete n}this.viewTagDisplaied||(this.viewTagDisplaied=!0,chatId.insertAdjacentHTML("beforeend","<p style='color:grey' id='unread-msg'>unread messages</p>")),chatId.insertAdjacentHTML("beforeend",e)}else chatId.insertAdjacentHTML("beforeend",e),chatId.scrollTop=chatId.scrollHeight;if(!0===t&&audioSupport&&settings.keySound){var s=context.createOscillator();s.frequency.value=440;var o=context.createGain();s.connect(o),o.connect(context.destination),s.start(0),o.gain.exponentialRampToValueAtTime(.001,context.currentTime+.1),s.stop(context.currentTime+.2)}},activeMorsers:[],updatingMorsers:!1,frequencies:[1046,987,880,784,698],lastFrequencyUsed:0,insertMorsingMsg:function(e,t,n){var s="<p class='msg-normal'><a onclick='displaySenderInfo("+e+")'>"+t+"</a>: <span class='msg-phrase' ></span> <span class='msg-letter' ></span></p>";this.insertMsg(s,!1);var o=document.getElementsByClassName("msg-phrase").length-1,i=this.activeMorsers.length,r=this.frequencies[this.lastFrequencyUsed];this.lastFrequencyUsed=this.lastFrequencyUsed<this.frequencies.length-1?this.lastFrequencyUsed+1:0,this.activeMorsers[i]=new Morser(o,n,r),0==this.updatingMorsers&&(this.updatingMorsers=!0,this.updateMorsers()),console.log("spawned morser")},updateMorsers:function(){var e=this.activeMorsers.length;if(e>0){for(var t=0;t<e;t++){this.activeMorsers[t].update()&&(this.activeMorsers.splice(t,1),e--,console.log("morser terminated"))}var n=this;this.updaterTimer=setTimeout(function(){n.updateMorsers()},settings.morserDotSpeed)}else this.updatingMorsers=!1}};function Morser(e,t,n){this.msgP=document.getElementsByClassName("msg-phrase")[e],this.msgL=document.getElementsByClassName("msg-letter")[e],this.noteFreq=n,this.encodedMsg=t,this.phrase=morse.webDecode(this.encodedMsg).split(""),this.currentLetter=this.phrase.shift(),this.currentLetterMorse=morse.translateLetterToMorse(this.currentLetter),this.steps=2,this.finishedMorsing=!1,this.update=function(){if(this.steps>0)this.steps--;else if(this.phrase.length>0)if(this.currentLetterMorse.length>0){var e=this.currentLetterMorse.shift();if(this.steps=0==e?1:3,this.msgL.insertAdjacentHTML("beforeend",0==e?".":"_"),audioSupport&&settings.receivedMorseSound){var t=context.createOscillator();t.frequency.value=this.noteFreq;var n=context.createGain();t.connect(n),n.connect(context.destination),t.start(0);var s=settings.morserDotSpeed/(100*(0==e?6:2.8));t.stop(context.currentTime+s)}}else this.msgL.innerText="",this.msgP.insertAdjacentHTML("beforeend",this.currentLetter),this.currentLetter=this.phrase.shift()," "==this.currentLetter?this.steps=4:(this.steps=3,this.currentLetterMorse=morse.translateLetterToMorse(this.currentLetter));else this.finishedMorsing=!0;return this.finishedMorsing}}var morse={tree:{"01":"a",1000:"b",1010:"c",100:"d",0:"e","0010":"f",110:"g","0000":"h","00":"i","0111":"j",101:"k","0100":"l",11:"m",10:"n",111:"o","0110":"p",1101:"q","010":"r","000":"s",1:"t","001":"u","0001":"v","011":"w",1001:"x",1011:"y",1100:"z","010101":".",110011:",","001100":"?","011110":"'",101011:"!",10010:"/",111000:":",101010:";",10001:"=",100001:"-","01010":"+","011010":"@","01111":"1","00111":"2","00011":"3","00001":"4","00000":"5",10000:"6",11000:"7",11100:"8",11110:"9",11111:"0","00000010":" "},specialChars:{A:".",B:",",C:"?",D:"'",E:"!",F:"/",G:":",H:";",I:"=",L:"-",M:"+",N:"@",J:" ",K:"|"},escapeRegExp:function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},webEncode:function(e){var t=e;for(var n in this.specialChars){var s=new RegExp(this.escapeRegExp(this.specialChars[n]),"g");t=t.replace(s,n)}return console.log("encoded phrase to "+t),t},webDecode:function(e){var t=e;for(var n in this.specialChars)t=t.replace(new RegExp(n,"g"),this.specialChars[n]);return t.toLowerCase()},translateLetterToMorse:function(e){for(var t in this.tree)if(this.tree[t]==e)return t.split("");return null}};