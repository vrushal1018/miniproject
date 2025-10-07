// Helpers
function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}

// Storage
const KEY = "quizPlayers"
function loadPlayers(){return JSON.parse(localStorage.getItem(KEY)||"[]")}
function savePlayers(p){localStorage.setItem(KEY,JSON.stringify(p))}

// State
let PLAYERS = loadPlayers()
let currentPlayer = null
let STATE = {stage:null,qIndex:0,score:0,coins:0,correctCount:0,questions:[],timer:600,timerId:null}

// DOM
const registerCard=$('#registerCard'), stageSelect=$('#stageSelect'),
playerNameInput=$('#playerNameInput'), registerBtn=$('#registerBtn'),
playerNameLabel=$('#playerNameLabel'), scoreboardTable=$('#scoreboardTable tbody'),
quizCard=$('#quizCard'), stageLabel=$('#stageLabel'), scoreEl=$('#score'),
coinsEl=$('#coins'), timerEl=$('#timer'), progressBar=$('#progressBar'),
progressText=$('#progressText'), questionText=$('#questionText'),
optionsWrap=$('#options'), nextBtn=$('#nextBtn'), quitBtn=$('#quitBtn'),
hintRevealBtn=$('#hintRevealBtn'), hintEliminateBtn=$('#hintEliminateBtn'),
resultCard=$('#resultCard'), resStage=$('#resStage'), resScore=$('#resScore'),
resCorrect=$('#resCorrect'), resCoins=$('#resCoins'), retryBtn=$('#retryBtn'),
homeBtn=$('#homeBtn')

// Web-based Questions (20 each)
const QUESTIONS = {
  easy:[
    {q:"What does HTML stand for?",choices:["Hyper Text Markup Language","Hyperlinks Text Mark Language","Home Tool Markup Language","HighText Machine Language"],aIndex:0,hint:"It structures web pages"},
    {q:"Which tag is used for a line break in HTML?",choices:["<br>","<lb>","<break>","<b>"],aIndex:0,hint:"Short for 'break'"},
    {q:"Which property changes text color in CSS?",choices:["font-color","color","text-style","text-color"],aIndex:1,hint:"Simply 'color'"},
    {q:"Which language adds interactivity to websites?",choices:["HTML","CSS","JavaScript","Python"],aIndex:2,hint:"Used for scripting"},
    {q:"CSS stands for?",choices:["Colorful Style Sheets","Cascading Style Sheets","Creative Style Syntax","Computer Style Sheets"],aIndex:1,hint:"Cascading..."},
    {q:"Which HTML element displays largest heading?",choices:["<h6>","<head>","<h1>","<heading>"],aIndex:2,hint:"Starts with 1"},
    {q:"Which tag is used for images?",choices:["<img>","<picture>","<src>","<image>"],aIndex:0,hint:"Short tag"},
    {q:"Which symbol is used for comments in CSS?",choices:["//","<!-- -->","/* */","#"],aIndex:2,hint:"Similar to C language"},
    {q:"Which input type is used for password field?",choices:["text","password","pass","hidden"],aIndex:1,hint:"Hides characters"},
    {q:"Which HTML tag creates hyperlinks?",choices:["<link>","<href>","<a>","<url>"],aIndex:2,hint:"Anchor tag"},
    {q:"Which CSS property controls font size?",choices:["text-size","font-size","size","font"],aIndex:1,hint:"Two words"},
    {q:"Which tag defines a table row?",choices:["<th>","<tr>","<td>","<table>"],aIndex:1,hint:"R for row"},
    {q:"Which attribute is used to provide an image source?",choices:["link","src","href","url"],aIndex:1,hint:"Source = src"},
    {q:"What is default display of <div>?",choices:["inline","block","flex","grid"],aIndex:1,hint:"Block element"},
    {q:"Which CSS property adds background color?",choices:["bgcolor","background","background-color","color-bg"],aIndex:2,hint:"Background-color"},
    {q:"HTML comments start with?",choices:["/*","//","<!--","**"],aIndex:2,hint:"Arrow and dash"},
    {q:"Which HTML tag is used for list items?",choices:["<ul>","<ol>","<li>","<list>"],aIndex:2,hint:"List Item"},
    {q:"Which extension is correct for HTML files?",choices:[".html",".ht","._html",".h"],aIndex:0,hint:"Five letters"},
    {q:"Which CSS property sets space between lines?",choices:["line-space","line-height","spacing","line-gap"],aIndex:1,hint:"Height"},
    {q:"In HTML, <b> tag makes text?",choices:["Bold","Big","Blue","Broken"],aIndex:0,hint:"Bold text"}
  ],
  medium:[
    {q:"Which HTML5 element defines navigation links?",choices:["<nav>","<navigate>","<links>","<menu>"],aIndex:0,hint:"Short for navigation"},
    {q:"In CSS, what does z-index control?",choices:["Zoom","Stack order","Size","Opacity"],aIndex:1,hint:"Layer order"},
    {q:"Which JavaScript method writes to console?",choices:["console.log()","log.console()","write.log()","log.print()"],aIndex:0,hint:"console dot log"},
    {q:"Which HTML attribute specifies alternate text for images?",choices:["alt","src","title","name"],aIndex:0,hint:"Alt text"},
    {q:"How do you make a list numbered?",choices:["<ul>","<li>","<ol>","<dl>"],aIndex:2,hint:"Ordered list"},
    {q:"Which CSS layout uses rows and columns?",choices:["Flexbox","Grid","Float","Table"],aIndex:1,hint:"CSS Grid"},
    {q:"How do you declare a JavaScript variable?",choices:["variable name","v name","var name","def name"],aIndex:2,hint:"Use var"},
    {q:"Which function converts JSON to object?",choices:["JSON.parse()","JSON.stringify()","parse.JSON()","JSON.convert()"],aIndex:0,hint:"Parsing"},
    {q:"Which tag is used for a checkbox?",choices:["<input type='checkbox'>","<check>","<cb>","<tick>"],aIndex:0,hint:"input"},
    {q:"Which CSS unit is relative to font size?",choices:["em","px","cm","%"],aIndex:0,hint:"em"},
    {q:"Which keyword prevents variable change in JS?",choices:["let","var","const","static"],aIndex:2,hint:"Constant"},
    {q:"Which HTTP method is used to submit data?",choices:["GET","POST","FETCH","SEND"],aIndex:1,hint:"Form submission"},
    {q:"Which event fires when button is clicked?",choices:["onhover","onclick","onpress","onsubmit"],aIndex:1,hint:"Click"},
    {q:"Which API handles browser storage?",choices:["Storage API","LocalStorage","Web Storage API","Session API"],aIndex:2,hint:"Web Storage"},
    {q:"Which tag defines footer?",choices:["<bottom>","<footer>","<foot>","<end>"],aIndex:1,hint:"footer tag"},
    {q:"Which JS operator compares value and type?",choices:["==","===","!=","="],aIndex:1,hint:"Triple equals"},
    {q:"Which attribute opens link in new tab?",choices:["target='_blank'","open='new'","tab='new'","newtab"],aIndex:0,hint:"Target"},
    {q:"Which CSS property sets element transparency?",choices:["opacity","filter","transparency","visibility"],aIndex:0,hint:"opacity"},
    {q:"Which tag is used for inline CSS?",choices:["<css>","<style>","<link>","<script>"],aIndex:1,hint:"style tag"},
    {q:"Which HTML element represents a section?",choices:["<part>","<div>","<section>","<seg>"],aIndex:2,hint:"<section>"}
  ],
  hard:[
    {q:"Which method adds element to end of array?",choices:["push()","pop()","concat()","join()"],aIndex:0,hint:"Opposite of pop"},
    {q:"Which CSS property creates 3D transformations?",choices:["transform","perspective","translate3d","matrix3d"],aIndex:2,hint:"translate3d"},
    {q:"Which JS method executes a function after delay?",choices:["setInterval","setTimeout","wait","sleep"],aIndex:1,hint:"Timeout"},
    {q:"Which object handles promises in JS?",choices:["Promise","Await","Async","Then"],aIndex:0,hint:"Promise object"},
    {q:"Which attribute enables autoplay of video?",choices:["play","autoplay","start","auto"],aIndex:1,hint:"auto-play"},
    {q:"Which HTML tag supports SVG?",choices:["<svg>","<vector>","<draw>","<canvas>"],aIndex:0,hint:"SVG tag"},
    {q:"Which CSS property controls flex alignment horizontally?",choices:["align-items","justify-content","align-content","align"],aIndex:1,hint:"Justify"},
    {q:"Which protocol does HTTPS use for security?",choices:["SSL/TLS","SSH","FTP","SMTP"],aIndex:0,hint:"TLS"},
    {q:"Which JS method removes last array item?",choices:["delete","pop","splice","remove"],aIndex:1,hint:"Opposite of push"},
    {q:"Which tag defines metadata?",choices:["<data>","<meta>","<info>","<head>"],aIndex:1,hint:"meta"},
    {q:"Which keyword creates async function?",choices:["await","async","promise","then"],aIndex:1,hint:"async"},
    {q:"Which event is fired when page finishes loading?",choices:["onload","ready","onstart","load"],aIndex:0,hint:"onload"},
    {q:"Which CSS property adds shadow to text?",choices:["shadow","box-shadow","text-shadow","font-shadow"],aIndex:2,hint:"text-shadow"},
    {q:"Which HTML5 tag embeds audio?",choices:["<music>","<sound>","<audio>","<mp3>"],aIndex:2,hint:"audio tag"},
    {q:"Which API is used to fetch data asynchronously?",choices:["HTTP","XMLHttpRequest","Fetch API","Ajax"],aIndex:2,hint:"fetch()"},
    {q:"Which tag defines main content?",choices:["<main>","<body>","<section>","<content>"],aIndex:0,hint:"<main>"},
    {q:"Which CSS function creates gradient?",choices:["linear-gradient()","gradient()","color-mix()","blend()"],aIndex:0,hint:"linear-gradient"},
    {q:"Which tag defines scripts?",choices:["<js>","<javascript>","<script>","<code>"],aIndex:2,hint:"script"},
    {q:"Which storage persists data after closing browser?",choices:["sessionStorage","localStorage","tempStorage","cacheStorage"],aIndex:1,hint:"localStorage"},
    {q:"Which JS statement handles errors?",choices:["try...catch","throw...catch","handle...error","debug"],aIndex:0,hint:"try-catch"}
  ]
}

let selectedAvatar = null;

// Avatar click event
$all('.avatar.selectable').forEach(a=>{
  a.addEventListener('click', ()=>{
    $all('.avatar.selectable').forEach(av => av.classList.remove('selected'));
    a.classList.add('selected');
    selectedAvatar = a.dataset.avatar;
  });
});

// Registration
registerBtn.onclick = function(){
  const name = playerNameInput.value.trim();
  if(!name){ alert("Please enter your name!"); return }
  if(!selectedAvatar){ alert("Please select an avatar!"); return }

  let player = PLAYERS.find(p=>p.name===name)
  if(!player){
    player = {name, avatar:selectedAvatar, coins:0, scores:{easy:0,medium:0,hard:0}}
    PLAYERS.push(player)
    savePlayers(PLAYERS)
  } else {
    player.avatar = selectedAvatar;
  }

  currentPlayer = player;
  playerNameLabel.textContent = currentPlayer.name;
  registerCard.classList.add('hidden');
  stageSelect.classList.remove('hidden');
  renderScoreboard();
}
// ----- Stage Selection -----
$all('.stage-btn').forEach(b=>{
  b.addEventListener('click', ()=> startStage(b.dataset.stage))
})

function startStage(stage){
  STATE = {
    stage,
    qIndex:0,
    score:0,
    coins:currentPlayer.coins,
    correctCount:0,
    questions: shuffle([...QUESTIONS[stage]]).slice(0,20),
    timer:600,
    timerId:null
  }
  stageSelect.classList.add('hidden')
  quizCard.classList.remove('hidden')
  stageLabel.textContent = stage.toUpperCase()
  renderQuestion()
  startTimer()
  updateHUD()
}

// ----- Quiz Functions -----
function renderQuestion(){
  nextBtn.disabled = true;
  const q = STATE.questions[STATE.qIndex]
  progressText.textContent = `Question ${STATE.qIndex+1} / ${STATE.questions.length}`
  progressBar.style.width = (((STATE.qIndex + 1) / STATE.questions.length) * 100) + "%";
  questionText.textContent = q.q
  optionsWrap.innerHTML = ''
  q.choices.forEach((c,i)=>{
    const btn=document.createElement('button')
    btn.className="option-btn"
    btn.textContent=c
    btn.dataset.index=i
    btn.onclick=()=>selectOption(i,btn)
    optionsWrap.appendChild(btn)
  })
}

function selectOption(idx,btn){
  $all('.option-btn').forEach(b=>b.classList.add('disabled'))
  const q = STATE.questions[STATE.qIndex]
  if(idx===q.aIndex){
    btn.classList.add('correct')
    STATE.score +=10
    STATE.coins +=10
    STATE.correctCount++
  } else {
    btn.classList.add('wrong')
    optionsWrap.querySelector(`[data-index="${q.aIndex}"]`).classList.add('correct')
  }
  updateHUD()
  nextBtn.disabled = false;

}

nextBtn.onclick = ()=>{
  STATE.qIndex++
  if(STATE.qIndex>=STATE.questions.length){ finishQuiz(); return }
  renderQuestion()
}

quitBtn.onclick = ()=>{ if(confirm("Quit? Progress will be lost.")) resetToHome() }

function startTimer(){
  updateTimer()
  STATE.timerId = setInterval(()=>{
    STATE.timer--
    if(STATE.timer<=0){ clearInterval(STATE.timerId); finishQuiz() }
    updateTimer()
  },1000)
}

function updateTimer(){
  let m=String(Math.floor(STATE.timer/60)).padStart(2,'0')
  let s=String(STATE.timer%60).padStart(2,'0')
  timerEl.textContent=`${m}:${s}`
}

function updateHUD(){
  scoreEl.textContent=STATE.score
  coinsEl.textContent=STATE.coins
}

// ----- HINT BUTTONS -----

hintRevealBtn.onclick = () => {
    if(STATE.coins < 30){
        alert("Not enough coins for hint!");
        return;
    }
    const q = STATE.questions[STATE.qIndex];
    alert(`Hint: ${q.hint}`);
    STATE.coins -= 30;
    updateHUD();
}

hintEliminateBtn.onclick = () => {
    if(STATE.coins < 50){
        alert("Not enough coins for 50-50!");
        return;
    }
    const q = STATE.questions[STATE.qIndex];
    const correctIndex = q.aIndex;

    // Get all option buttons
    const optionBtns = $all('.option-btn');

    // Filter wrong options
    const wrongBtns = optionBtns.filter((b,i) => i !== correctIndex && !b.classList.contains('disabled'));

    // Shuffle and pick 2 to disable
    shuffle(wrongBtns);
    wrongBtns.slice(0,2).forEach(b=>{
        b.disabled = true;
        b.classList.add('disabled');
        b.style.opacity = "0.5";
    });

    STATE.coins -= 50;
    updateHUD();
}

// ----- Finish Quiz -----
function finishQuiz(){
  clearInterval(STATE.timerId)
  quizCard.classList.add('hidden')
  resultCard.classList.remove('hidden')
  resStage.textContent=STATE.stage
  resScore.textContent=STATE.score
  resCorrect.textContent=STATE.correctCount
  resCoins.textContent=STATE.coins

  currentPlayer.coins = STATE.coins
  if(STATE.score > currentPlayer.scores[STATE.stage]) currentPlayer.scores[STATE.stage] = STATE.score
  savePlayers(PLAYERS)
  renderScoreboard()
}

// ----- Retry & Home -----
retryBtn.onclick = ()=> startStage(STATE.stage)
homeBtn.onclick = ()=> resetToHome()
function resetToHome(){
  resultCard.classList.add('hidden')
  quizCard.classList.add('hidden')
  stageSelect.classList.remove('hidden')
  renderScoreboard()
}

// ----- Scoreboard -----
function renderScoreboard(){
  scoreboardTable.innerHTML=""
  PLAYERS.forEach(p=>{
    Object.keys(p.scores).forEach(stage=>{
      let tr=document.createElement('tr')
      tr.innerHTML=`<td>${p.name}</td><td>${stage}</td><td>${p.scores[stage]}</td>`
      scoreboardTable.appendChild(tr)
    })
  })
}

