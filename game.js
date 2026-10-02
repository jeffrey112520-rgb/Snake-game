const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const scoreEl=document.getElementById('score'),bestEl=document.getElementById('best'),levelEl=document.getElementById('level'),boostEl=document.getElementById('boostState');
const overlay=document.getElementById('overlay'),overlayTitle=document.getElementById('overlayTitle'),overlayText=document.getElementById('overlayText'),startBtn=document.getElementById('startBtn'),musicBtn=document.getElementById('musicBtn');
const N=24,cell=canvas.width/N;
let snake,dir,nextDir,food,power,obstacles,score,best=Number(localStorage.getItem('centralSnakeBest')||0),level,paused,gameOver,boostUntil,doubleUntil,timer,audioOn=true; const bgMusic=document.getElementById('bgMusic'); bgMusic.volume=.22;
bestEl.textContent=best;
const randCell=()=>({x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)});
function occupied(p){return snake.some(s=>s.x===p.x&&s.y===p.y)||obstacles.some(o=>o.x===p.x&&o.y===p.y)}
function freeCell(){let p;do{p=randCell()}while(occupied(p)|| (food&&food.x===p.x&&food.y===p.y));return p}
function makeObstacles(){obstacles=[];const count=Math.min(3+level*2,24);for(let i=0;i<count;i++)obstacles.push(freeCell())}
function spawnFood(){food=freeCell()}
function spawnPower(){const types=['boost','heart','star'];power={...freeCell(),type:types[Math.floor(Math.random()*types.length)],until:Date.now()+9000}}
function reset(){snake=[{x:12,y:12},{x:11,y:12},{x:10,y:12}];dir={x:1,y:0};nextDir=dir;score=0;level=1;paused=false;gameOver=false;boostUntil=0;doubleUntil=0;power=null;makeObstacles();spawnFood();clearInterval(timer);schedule();update();}
function schedule(){clearInterval(timer);const speed=Math.max(55,150-(level-1)*8-(Date.now()<boostUntil?55:0));timer=setInterval(tick,speed)}
function setDirection(x,y){if(x===-dir.x&&y===-dir.y)return;nextDir={x,y}}
function tick(){if(paused||gameOver)return;dir=nextDir;const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(head.x<0||head.x>=N||head.y<0||head.y>=N||snake.some((s,i)=>i>0&&s.x===head.x&&s.y===head.y)||obstacles.some(o=>o.x===head.x&&o.y===head.y)){end();return}snake.unshift(head);let ate=false;if(head.x===food.x&&head.y===food.y){score+=Date.now()<doubleUntil?20:10;ate=true;spawnFood();if(score%50===0){level++;makeObstacles()};if(!power&&Math.random()<.3)spawnPower()}if(power&&head.x===power.x&&head.y===power.y){ate=true;if(power.type==='boost'){boostUntil=Date.now()+6500;boostEl.textContent='ON'}if(power.type==='heart')score+=25;if(power.type==='star'){score+=20;doubleUntil=Date.now()+7000}power=null;schedule()}if(!ate)snake.pop();if(power&&Date.now()>power.until)power=null;update();}
function end(){gameOver=true;clearInterval(timer);best=Math.max(best,score);localStorage.setItem('centralSnakeBest',best);overlayTitle.textContent='We were on a break!';overlayText.textContent=`Final score: ${score}. Grab a coffee and try again.`;startBtn.textContent='Play Again';overlay.classList.remove('hidden');stopMusic()}
function update(){scoreEl.textContent=score;bestEl.textContent=best;levelEl.textContent=level;boostEl.textContent=Date.now()<boostUntil?'ON':(Date.now()<doubleUntil?'2×':'—');}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#2f1e36';ctx.fillRect(0,0,canvas.width,canvas.height);drawGrid();obstacles.forEach(drawObstacle);drawFood();if(power)drawPower();snake.forEach((s,i)=>drawSnake(s,i));requestAnimationFrame(draw)}
function drawGrid(){ctx.strokeStyle='#ffffff09';ctx.lineWidth=1;for(let i=0;i<=N;i++){ctx.beginPath();ctx.moveTo(i*cell,0);ctx.lineTo(i*cell,canvas.height);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*cell);ctx.lineTo(canvas.width,i*cell);ctx.stroke()}}
function roundRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function drawObstacle(o){ctx.fillStyle='#74516b';roundRect(o.x*cell+5,o.y*cell+8,cell-10,cell-13,7);ctx.fillStyle='#d5b27d';ctx.fillRect(o.x*cell+9,o.y*cell+5,cell-18,5);ctx.fillStyle='#fff8e8';ctx.font='13px serif';ctx.textAlign='center';ctx.fillText('◈',o.x*cell+cell/2,o.y*cell+cell/2+5)}
function drawFood(){ctx.fillStyle='#a86638';ctx.beginPath();ctx.arc(food.x*cell+cell/2,food.y*cell+cell/2+3,cell*.25,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e8c994';ctx.fillRect(food.x*cell+cell*.43,food.y*cell+cell*.13,cell*.14,cell*.16);ctx.fillStyle='#fff';ctx.font='12px serif';ctx.textAlign='center';ctx.fillText('☕',food.x*cell+cell/2,food.y*cell+cell*.65)}
function drawPower(){const map={boost:'★',heart:'♥',star:'✦'};ctx.fillStyle=power.type==='boost'?'#3979bd':power.type==='heart'?'#b84f79':'#d49a28';ctx.beginPath();ctx.arc(power.x*cell+cell/2,power.y*cell+cell/2,cell*.29,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 17px Arial';ctx.textAlign='center';ctx.fillText(map[power.type],power.x*cell+cell/2,power.y*cell+cell*.57)}
function drawSnake(s,i){ctx.fillStyle=i===0?'#f2b84b':'#8bb58e';roundRect(s.x*cell+3,s.y*cell+3,cell-6,cell-6,8);if(i===0){ctx.fillStyle='#2b2130';const ex=dir.x? (dir.x>0?cell*.68:cell*.32):cell*.62, ey=dir.y? (dir.y>0?cell*.68:cell*.32):cell*.35;ctx.beginPath();ctx.arc(s.x*cell+ex,s.y*cell+ey,3,0,7);ctx.fill()}}
function start(){reset();overlay.classList.add('hidden');startMusic()}
startBtn.onclick=start;
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='arrowup'||k==='w')setDirection(0,-1);if(k==='arrowdown'||k==='s')setDirection(0,1);if(k==='arrowleft'||k==='a')setDirection(-1,0);if(k==='arrowright'||k==='d')setDirection(1,0);if(k===' '){paused=!paused;overlay.classList.toggle('hidden',!paused);if(paused){overlayTitle.textContent='Paused';overlayText.textContent='Take a quick Central Perk break.';startBtn.textContent='Resume';}else startBtn.textContent='Start Game'} });
let touchStart=null;canvas.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0]}, {passive:true});canvas.addEventListener('touchend',e=>{if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.clientX,dy=t.clientY-touchStart.clientY;if(Math.max(Math.abs(dx),Math.abs(dy))<20)return;if(Math.abs(dx)>Math.abs(dy))setDirection(dx>0?1:-1,0);else setDirection(0,dy>0?1:-1,0);touchStart=null},{passive:true});
function startMusic(){if(!audioOn)return; bgMusic.play().catch(()=>{}); musicBtn.textContent='♫'} function stopMusic(){bgMusic.pause(); bgMusic.currentTime=0}
musicBtn.onclick=()=>{audioOn=!audioOn;if(audioOn)startMusic();else stopMusic();musicBtn.textContent=audioOn?'♫':'🔇'};
reset();draw();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
