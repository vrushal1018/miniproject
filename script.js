// Helpers
function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}

// State - NO localStorage (not supported in Claude artifacts)
let PLAYERS = []
let currentPlayer = null
let STATE = {framework:null,stage:null,qIndex:0,score:0,coins:0,correctCount:0,questions:[],timer:600,timerId:null}

// DOM
const registerCard=$('#registerCard'), frameworkSelect=$('#frameworkSelect'), stageSelect=$('#stageSelect'),
playerNameInput=$('#playerNameInput'), registerBtn=$('#registerBtn'),
playerNameLabel=$('#playerNameLabel'), scoreboardTable=$('#scoreboardTable tbody'),
quizCard=$('#quizCard'), stageLabel=$('#stageLabel'), scoreEl=$('#score'),
coinsEl=$('#coins'), timerEl=$('#timer'), progressBar=$('#progressBar'),
progressText=$('#progressText'), questionText=$('#questionText'),
optionsWrap=$('#options'), nextBtn=$('#nextBtn'), quitBtn=$('#quitBtn'),
hintRevealBtn=$('#hintRevealBtn'), hintEliminateBtn=$('#hintEliminateBtn'),
resultCard=$('#resultCard'), resStage=$('#resStage'), resScore=$('#resScore'),
resCorrect=$('#resCorrect'), resCoins=$('#resCoins'), retryBtn=$('#retryBtn'),
homeBtn=$('#homeBtn'), frameworkLabel=$('#frameworkLabel'),
resFramework=$('#resFramework'), playerAvatar=$('#playerAvatar'),
playerNameSmall=$('#playerNameSmall'), viewDashboardBtn=$('#viewDashboardBtn'),
viewDashboardBtn2=$('#viewDashboardBtn2'), backToFrameworkBtn=$('#backToFrameworkBtn'),
dashboardCard=$('#dashboardCard'), dashboardTable=$('#dashboardTable tbody'),
backToHomeBtn=$('#backToHomeBtn'), openDashboardFromResult=$('#openDashboardFromResult'),
logoutBtn=$('#logoutBtn')

// QUESTIONS: reorganized by framework -> levels
const QUESTIONS = {
  htmlcssjs: {
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
  },

  react: {
    easy:[
      {q:"What is JSX in React?",choices:["A CSS framework","A JavaScript syntax extension","A database","A testing tool"],aIndex:1,hint:"Looks like HTML inside JS"},
      {q:"Which method is used to create components in React?",choices:["createClass","function or class","new Component","makeComponent"],aIndex:1,hint:"Functions or classes"},
      {q:"How do you pass data from parent to child?",choices:["props","state","context","redux"],aIndex:0,hint:"Short for properties"},
      {q:"Which hook is used for state in functional components?",choices:["useEffect","useState","useRef","useMemo"],aIndex:1,hint:"State hook"},
      {q:"What does 'props' stand for?",choices:["properties","proper types","propellers","props"],aIndex:0,hint:"Properties"},
      {q:"Which attribute is used to set key in lists?",choices:["id","key","index","unique"],aIndex:1,hint:"key attribute"},
      {q:"Which company maintains React?",choices:["Google","Facebook/Meta","Microsoft","Apple"],aIndex:1,hint:"Meta owns it"},
      {q:"How do you create an element in React?",choices:["React.createElement","createElement() from DOM","document.createElement","create.react"],aIndex:0,hint:"React API"},
      {q:"Which file usually contains React entry point?",choices:["index.html","index.js","app.css","style.js"],aIndex:1,hint:"index.js"},
      {q:"What is a React component?",choices:["A function or class returning UI","A database model","A CSS style","A static HTML page"],aIndex:0,hint:"Returns UI"}
    ],
    medium:[
      {q:"What does useEffect hook do?",choices:["Manages state","Runs side-effects","Styles component","Creates refs"],aIndex:1,hint:"Side effects"},
      {q:"How do you lift state up?",choices:["Move state to common parent","Use Redux only","Use CSS","Use refs"],aIndex:0,hint:"Common parent"},
      {q:"What is Virtual DOM?",choices:["Real DOM tree","Lightweight DOM copy","Browser API","CSS engine"],aIndex:1,hint:"React's optimized copy"},
      {q:"How to prevent re-render in child?",choices:["useMemo/useCallback","useState","useEffect","setState"],aIndex:0,hint:"Memoization hooks"},
      {q:"Which hook returns a mutable ref object?",choices:["useRef","useState","useEffect","useContext"],aIndex:0,hint:"useRef"},
      {q:"How do you conditionally render in JSX?",choices:["if(){}","ternary or &&","switch","for loop"],aIndex:1,hint:"Ternary or &&"},
      {q:"Which lifecycle method runs after mount in class components?",choices:["componentWillMount","componentDidMount","render","componentWillUpdate"],aIndex:1,hint:"Did mount"},
      {q:"Which package is used for routing in React apps?",choices:["react-router-dom","next/router","angular-router","vue-router"],aIndex:0,hint:"react-router-dom"},
      {q:"How do you update state that depends on previous state?",choices:["setState(new)","setState(prev => ... )","useStateAgain","direct mutation"],aIndex:1,hint:"Use updater function"},
      {q:"What is Context API used for?",choices:["Styling","Passing data without props drilling","Testing","Animations"],aIndex:1,hint:"Avoid prop drilling"}
    ],
    hard:[
      {q:"What does reconciliation mean in React?",choices:["Merging props","Diffing virtual DOM to update real DOM","Styling components","Server-side rendering"],aIndex:1,hint:"Diff algorithm"},
      {q:"How to optimize context value to avoid re-renders?",choices:["Memoize value with useMemo","Use state only","Use refs","No solution"],aIndex:0,hint:"useMemo helps"},
      {q:"What is server-side rendering (SSR)?",choices:["Rendering on client only","Rendering on server and sending HTML","Only API server","Rendering CSS on server"],aIndex:1,hint:"Server returns HTML"},
      {q:"How do you handle errors in components?",choices:["try...catch in render","Error boundaries","useError hook","No error handling"],aIndex:1,hint:"Error boundaries"},
      {q:"What is code splitting in React?",choices:["Splitting CSS files","Splitting code to lazy-load parts","Splitting database","Splitting components visually"],aIndex:1,hint:"Lazy loading chunks"},
      {q:"Which hook can replace lifecycle methods in many cases?",choices:["useState","useEffect","useLayoutEffect","useReducer"],aIndex:1,hint:"useEffect covers many lifecycles"},
      {q:"What does useCallback do?",choices:["Memoizes a value","Memoizes a function reference","Creates callbacks","Schedules callbacks"],aIndex:1,hint:"Keeps function identity"},
      {q:"How to manage complex state transitions?",choices:["useState only","useReducer","context only","props only"],aIndex:1,hint:"useReducer for reducers"},
      {q:"Which React feature helps with accessibility for forms?",choices:["aria-* attributes","tabIndex only","role only","no features"],aIndex:0,hint:"aria attributes"},
      {q:"What is hydration in SSR frameworks?",choices:["Converting CSS to JS","Attaching event listeners to server HTML on client","Removing server HTML","Optimizing images"],aIndex:1,hint:"Make server HTML interactive"}
    ]
  },

  next: {
    easy:[
      {q:"What is Next.js primarily used for?",choices:["Mobile apps","Server-rendered React apps","Databases","Email templates"],aIndex:1,hint:"React + SSR features"},
      {q:"Which command starts a Next dev server?",choices:["next dev","npm start","npm run dev","next start"],aIndex:2,hint:"npm run dev (commonly)"},
      {q:"Which file in pages becomes a route?",choices:["_app.js","index.js inside pages","package.json","next.config.js"],aIndex:1,hint:"pages folder"},
      {q:"What is getStaticProps used for?",choices:["Client data fetching","Server-side logging","Build-time data fetching","Styling"],aIndex:2,hint:"Static generation data"},
      {q:"What is getServerSideProps used for?",choices:["Build-time fetch","Client fetch","Server-side per-request fetch","Styling"],aIndex:2,hint:"Runs per request"},
      {q:"Which folder contains API routes in Next?",choices:["api inside pages","api root","server","routes"],aIndex:0,hint:"pages/api"},
      {q:"Which component wraps all pages (global)?",choices:["_document","_app","_error","_meta"],aIndex:1,hint:"_app.js"},
      {q:"What extension do Next pages usually use?",choices:[".html",".jsx",".js or .jsx",".css"],aIndex:2,hint:"JS/JSX files"},
      {q:"Which feature allows incremental static regeneration?",choices:["ISR","SSG","SSR","CSR"],aIndex:0,hint:"ISR"},
      {q:"How do you link between pages in Next?",choices:["<a href> only","Link component from next/link","useRouter only","window.location"],aIndex:1,hint:"next/link"}
    ],
    medium:[
      {q:"What is image optimization feature in Next.js called?",choices:["next/image","image/optimize","optimImage","imgnext"],aIndex:0,hint:"next/image component"},
      {q:"How do you create a dynamic route in pages?",choices:["[id].js filename",":id.js","id.js","{id}.js"],aIndex:0,hint:"Square brackets"},
      {q:"What is a fallback option in getStaticPaths used for?",choices:["Error handling","Allowing dynamic routes not pre-built","Styling fallback","Cache control"],aIndex:1,hint:"fallback pages"},
      {q:"Which hook gives router object in Next?",choices:["useLocation","useRouter","useNavigate","useRoute"],aIndex:1,hint:"next/router's hook"},
      {q:"What is middleware in Next.js used for?",choices:["UI animations","Server-side route logic before request","Client caching","Image sizing"],aIndex:1,hint:"Edge/server logic"},
      {q:"Which config file customizes Next.js behavior?",choices:["next.json","next.config.js","app.config.js","config.next"],aIndex:1,hint:"next.config.js"},
      {q:"What does getStaticPaths work with?",choices:["getServerSideProps","getStaticProps for dynamic routes","client only","_app"],aIndex:1,hint:"Dynamic SSG"},
      {q:"How to pre-render a page at build time?",choices:["Use SSR","Use SSG/getStaticProps","Use client fetch","Use ISR only"],aIndex:1,hint:"getStaticProps"},
      {q:"Which rendering type runs on each request?",choices:["SSR","SSG","ISR","CSR"],aIndex:0,hint:"Server-side rendering"},
      {q:"Where are environment variables for Next available at build time?",choices:["process.env (with NEXT_PUBLIC)","window.env","localStorage","cookies"],aIndex:0,hint:"process.env"}
    ],
    hard:[
      {q:"What is App Router feature introduced in newer Next versions?",choices:["New routing system using /app","Older pages router","CSS-in-JS","Image API"],aIndex:0,hint:"/app directory routing"},
      {q:"How does Next handle server components in app router?",choices:["They are shipped to the client","Rendered on server and not bundled to client","Not supported","Only for images"],aIndex:1,hint:"Server-only rendering possible"},
      {q:"What is React Server Components benefit?",choices:["Smaller client bundles","Slower performance","No benefits","Only for CSS"],aIndex:0,hint:"Reduce client JS"},
      {q:"How to enable TypeScript in Next project?",choices:["Install types and create tsconfig","Change file extension only","Use babel plugin","Add tsconfig only"],aIndex:0,hint:"Install types + create tsconfig"},
      {q:"What is edge runtime in Next.js?",choices:["Client runtime","Serverless functions near user (edge)","Old Node server","Local dev server"],aIndex:1,hint:"Edge functions"},
      {q:"How to protect a page with authentication server-side?",choices:["Use getServerSideProps to check auth","Use client redirect only","Use CSS","Use image optimization"],aIndex:0,hint:"Server check"},
      {q:"Which method caches data for ISR?",choices:["revalidate in getStaticProps","cache-control header only","localStorage","sessionStorage"],aIndex:0,hint:"revalidate value"},
      {q:"What does 'next/link' prefetching do?",choices:["Loads images only","Preloads the code/data for linked page","Runs server logic","None"],aIndex:1,hint:"Speeds navigation"},
      {q:"How to deploy Next optimized server functions?",choices:["Use any static host","Use platform supporting node/edge (Vercel)","Only GitHub pages","Only AWS S3"],aIndex:1,hint:"Vercel/edge platforms"},
      {q:"What is turbopack in Next ecosystem?",choices:["A bundler/pack tool","A CSS library","A database","A UI kit"],aIndex:0,hint:"New bundler replacement for webpack"}
    ]
  },

  angular: {
    easy:[
      {q:"What language is primarily used to write Angular apps?",choices:["JavaScript","TypeScript","Python","Ruby"],aIndex:1,hint:"TypeScript is recommended"},
      {q:"Which company developed Angular (modern)?",choices:["Facebook","Google","Microsoft","Amazon"],aIndex:1,hint:"Google maintains it"},
      {q:"Which decorator is used to create a component?",choices:["@NgModule","@Component","@Injectable","@Directive"],aIndex:1,hint:"@Component"},
      {q:"What CLI command creates a new angular app?",choices:["ng new app","npm init angular","create-angular","ng create"],aIndex:0,hint:"ng new"},
      {q:"Which file holds module declarations?",choices:["app.module.ts","main.ts","index.html","styles.css"],aIndex:0,hint:"app.module.ts"},
      {q:"Which directive binds data to text?",choices:["[text]","{{}} interpolation","ngBind","v-text"],aIndex:1,hint:"{{ }}"},
      {q:"How to add routing in Angular basic module?",choices:["Add RouterModule.forRoot","Add BrowserModule only","Add Routes in CSS","Use window.location"],aIndex:0,hint:"RouterModule.forRoot"},
      {q:"Which lifecycle runs after component creation?",choices:["ngOnDestroy","ngOnInit","ngAfterViewInit","ngDoCheck"],aIndex:1,hint:"ngOnInit"},
      {q:"What is a service used for?",choices:["Components UI","Reusable business logic & DI","CSS only","Routing"],aIndex:1,hint:"Use dependency injection"},
      {q:"Which binding allows calling component methods?",choices:["() event binding","[] property binding","{{}} interpolation","{} object binding"],aIndex:0,hint:"(click) etc."}
    ],
    medium:[
      {q:"What does Angular's NgModule do?",choices:["Declare components and providers","Only styles","Only HTML templating","Only routing"],aIndex:0,hint:"Organizes app pieces"},
      {q:"How to make HTTP calls in Angular?",choices:["fetch only","HttpClient from @angular/common/http","XHR only","axios only"],aIndex:1,hint:"Use HttpClient"},
      {q:"Which decorator provides dependency injection metadata?",choices:["@Injectable","@NgModule","@Component","@Input"],aIndex:0,hint:"@Injectable for services"},
      {q:"What is AOT in Angular?",choices:["Ahead-of-Time compilation","All-on-Time","Async Only Tasks","App On Top"],aIndex:0,hint:"Compiles templates at build"},
      {q:"How to pass data from parent to child?",choices:["@Output","@Input","Service only","ViewChild only"],aIndex:1,hint:"@Input decorator"},
      {q:"Which RxJS operator maps values?",choices:["filter","map","reduce","switchMap"],aIndex:1,hint:"map operator"},
      {q:"What is change detection in Angular?",choices:["UI styling engine","Sync of model and view","Routing handler","HTTP interceptor"],aIndex:1,hint:"Updates view from model"},
      {q:"What are Angular pipes used for?",choices:["Format display values","Validation only","Routing","Dependency Injection"],aIndex:0,hint:"Transform display"},
      {q:"How to lazy-load a module?",choices:["Add to imports normally","Use loadChildren with dynamic import","Use CSS import","Use script tag"],aIndex:1,hint:"Dynamic import with loadChildren"},
      {q:"What is an Angular CLI command to generate a service?",choices:["ng generate service name","ng create service name","npm gen service","ng service-create"],aIndex:0,hint:"ng generate service"}
    ],
    hard:[
      {q:"What are Angular decorators used for?",choices:["Add metadata to classes/members","Styling only","Routing only","HTTP only"],aIndex:0,hint:"Add metadata"},
      {q:"What is an injector in Angular?",choices:["A service instance provider","A CSS tool","A router plugin","An HTTP library"],aIndex:0,hint:"Provides dependencies"},
      {q:"How do you implement route guards?",choices:["Create CanActivate guard","Use CSS guards","Use services only","Use interceptors"],aIndex:0,hint:"CanActivate/CanDeactivate"},
      {q:"What is NgZone used for?",choices:["Manage change detection and async tasks","Styling animations","HTTP optimization","Routing"],aIndex:0,hint:"For outside-Angular async tasks"},
      {q:"What is a structural directive?",choices:["Change layout of DOM (e.g., *ngIf)","Style element","Create service","Define module"],aIndex:0,hint:"structural directives alter DOM structure"},
      {q:"What is OnPush change detection strategy?",choices:["More frequent checks","Checks only when inputs change","Deprecated","Styling method"],aIndex:1,hint:"Optimized checks"},
      {q:"How to intercept all HTTP requests?",choices:["Use HTTP interceptor","Modify HttpClient directly","Edit HttpModule","Use fetch intercept"],aIndex:0,hint:"HTTP interceptors"},
      {q:"What is Zone.js role in Angular?",choices:["DOM manipulation library","Tracks async to trigger change detection","Routing library","Styling engine"],aIndex:1,hint:"Tracks async operations"},
      {q:"How to bundle optimization for production?",choices:["Use ng build --prod or --configuration=production","Use ng serve","Use npm start","Use webpack manually only"],aIndex:0,hint:"Production build"},
      {q:"What is Ivy in Angular?",choices:["New rendering & compilation engine","CSS preprocessor","Routing plugin","Testing framework"],aIndex:0,hint:"Ivy engine"}
    ]
  }
}

// keep selected avatar
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
    const scoresTemplate = {
      htmlcssjs: {easy:0, medium:0, hard:0},
      react: {easy:0, medium:0, hard:0},
      next: {easy:0, medium:0, hard:0},
      angular: {easy:0, medium:0, hard:0}
    }
    player = {name, avatar:selectedAvatar, coins:150, scores:scoresTemplate}
    PLAYERS.push(player)
  } else {
    player.avatar = selectedAvatar;
    player.scores = player.scores || {
      htmlcssjs: {easy:0, medium:0, hard:0},
      react: {easy:0, medium:0, hard:0},
      next: {easy:0, medium:0, hard:0},
      angular: {easy:0, medium:0, hard:0}
    }
  }

  currentPlayer = player;
  playerNameLabel.textContent = currentPlayer.name;
  playerNameSmall.textContent = currentPlayer.name;
  playerAvatar.src = `https://img.icons8.com/emoji/48/000000/${currentPlayer.avatar}-emoji.png`
  registerCard.classList.add('hidden');
  frameworkSelect.classList.remove('hidden');
  renderScoreboard();
}

// Framework selection buttons
$all('.framework-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    const fw = b.dataset.framework;
    STATE.framework = fw;
    frameworkLabel.textContent = fw.toUpperCase();
    frameworkSelect.classList.add('hidden');
    stageSelect.classList.remove('hidden');
    playerNameLabel.textContent = currentPlayer.name;
  })
});

// Back and dashboard buttons
backToFrameworkBtn?.addEventListener('click', ()=>{
  stageSelect.classList.add('hidden');
  frameworkSelect.classList.remove('hidden');
})

viewDashboardBtn?.addEventListener('click', openDashboard)
viewDashboardBtn2?.addEventListener('click', openDashboard)
backToHomeBtn?.addEventListener('click', ()=> {
  dashboardCard.classList.add('hidden');
  frameworkSelect.classList.remove('hidden');
})
openDashboardFromResult?.addEventListener('click', openDashboard)

logoutBtn?.addEventListener('click', ()=>{
  if(confirm("Logout and return to registration?")){
    currentPlayer = null;
    registerCard.classList.remove('hidden');
    frameworkSelect.classList.add('hidden');
    stageSelect.classList.add('hidden');
    quizCard.classList.add('hidden');
    dashboardCard.classList.add('hidden');
  }
})

// Stage Selection handlers
$all('.stage-btn').forEach(b=>{
  b.addEventListener('click', ()=> startStage(b.dataset.stage))
})

function startStage(stage){
  const fw = STATE.framework || 'htmlcssjs';
  STATE = {
    framework: fw,
    stage,
    qIndex:0,
    score:0,
    coins:currentPlayer.coins || 150,
    correctCount:0,
    questions: shuffle([...QUESTIONS[fw][stage]]).slice(0,20),
    timer:600,
    timerId:null
  }
  stageSelect.classList.add('hidden')
  quizCard.classList.remove('hidden')
  stageLabel.textContent = `${fw.toUpperCase()} — ${stage.toUpperCase()}`
  playerNameSmall.textContent = currentPlayer.name
  renderQuestion()
  startTimer()
  updateHUD()
}

// Quiz Functions
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
    const correctBtn = optionsWrap.querySelector(`[data-index="${q.aIndex}"]`)
    if(correctBtn) correctBtn.classList.add('correct')
  }
  updateHUD()
  nextBtn.disabled = false;
}

nextBtn.onclick = ()=> {
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

// HINT BUTTONS
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

    const optionBtns = $all('.option-btn');
    const wrongBtns = optionBtns.filter((b,i) => i !== correctIndex && !b.classList.contains('disabled'));

    shuffle(wrongBtns);
    wrongBtns.slice(0,2).forEach(b=>{
        b.disabled = true;
        b.classList.add('disabled');
        b.style.opacity = "0.5";
    });

    STATE.coins -= 50;
    updateHUD();
}

// Finish Quiz
function finishQuiz(){
  clearInterval(STATE.timerId)
  quizCard.classList.add('hidden')
  resultCard.classList.remove('hidden')
  resStage.textContent=STATE.stage
  resFramework.textContent=STATE.framework.toUpperCase()
  resScore.textContent=STATE.score
  resCorrect.textContent=STATE.correctCount
  resCoins.textContent=STATE.coins

  currentPlayer.coins = STATE.coins
  if(!currentPlayer.scores) currentPlayer.scores = {}
  if(!currentPlayer.scores[STATE.framework]) currentPlayer.scores[STATE.framework] = {easy:0,medium:0,hard:0}
  if(STATE.score > currentPlayer.scores[STATE.framework][STATE.stage]){
    currentPlayer.scores[STATE.framework][STATE.stage] = STATE.score
  }
  renderScoreboard()
}

// Retry & Home
retryBtn.onclick = ()=> startStage(STATE.stage)
homeBtn.onclick = ()=> resetToHome()
function resetToHome(){
  resultCard.classList.add('hidden')
  quizCard.classList.add('hidden')
  stageSelect.classList.add('hidden')
  frameworkSelect.classList.remove('hidden')
  renderScoreboard()
}

// Scoreboard
function renderScoreboard(){
  scoreboardTable.innerHTML=""
  PLAYERS.forEach(p=>{
    Object.keys(p.scores || {}).forEach(fw=>{
      const stages = p.scores[fw]
      Object.keys(stages).forEach(stage=>{
        let tr=document.createElement('tr')
        tr.innerHTML=`<td>${p.name}</td><td>${fw}</td><td>${stage}</td><td>${stages[stage]}</td>`
        scoreboardTable.appendChild(tr)
      })
    })
  })
}

// Dashboard
function openDashboard(){
  frameworkSelect.classList.add('hidden')
  stageSelect.classList.add('hidden')
  quizCard.classList.add('hidden')
  resultCard.classList.add('hidden')
  dashboardCard.classList.remove('hidden')

  dashboardTable.innerHTML = ''
  if(!currentPlayer || !currentPlayer.scores) return
  Object.keys(currentPlayer.scores).forEach(fw=>{
    const s = currentPlayer.scores[fw]
    let tr = document.createElement('tr')
    tr.innerHTML = `<td>${fw.toUpperCase()}</td>
                    <td>${s.easy}</td>
                    <td>${s.medium}</td>
                    <td>${s.hard}</td>`
    dashboardTable.appendChild(tr)
  })
}

// Initialize UI
(function initUI(){
  renderScoreboard()
})();
