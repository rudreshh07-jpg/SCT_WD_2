const minutesEl=document.getElementById("minutes"),secondsEl=document.getElementById("seconds"),centisecondsEl=document.getElementById("centiseconds");
const startBtn=document.getElementById("startBtn"),resetBtn=document.getElementById("resetBtn"),lapBtn=document.getElementById("lapBtn"),clearBtn=document.getElementById("clearBtn");
const lapsEl=document.getElementById("laps"),lapCountEl=document.getElementById("lapCount"),stateLabel=document.getElementById("stateLabel"),progress=document.getElementById("progress");
let running=false,elapsed=0,lastFrame=0,animationId=null,laps=[];
const pad=v=>String(v).padStart(2,"0");
function render(){
 const cs=Math.floor(elapsed/10),m=Math.floor(cs/6000),s=Math.floor((cs%6000)/100),c=cs%100;
 minutesEl.textContent=pad(m);secondsEl.textContent=pad(s);centisecondsEl.textContent=pad(c);
 progress.style.width=`${((elapsed%60000)/60000)*100}%`;
}
function tick(t){
 if(!running)return;if(!lastFrame)lastFrame=t;elapsed+=t-lastFrame;lastFrame=t;render();animationId=requestAnimationFrame(tick);
}
function setRunning(next){
 running=next;startBtn.textContent=running?"Pause":(elapsed>0?"Resume":"Start");
 lapBtn.disabled=!running;stateLabel.textContent=running?"RUNNING":(elapsed>0?"PAUSED":"READY");
 if(running){lastFrame=0;animationId=requestAnimationFrame(tick)}else if(animationId){cancelAnimationFrame(animationId);animationId=null}
}
startBtn.addEventListener("click",()=>setRunning(!running));
resetBtn.addEventListener("click",()=>{setRunning(false);elapsed=0;laps=[];render();renderLaps()});
lapBtn.addEventListener("click",()=>{if(!running)return;const previous=laps.length?laps[laps.length-1].total:0;laps.push({total:elapsed,split:elapsed-previous});renderLaps()});
clearBtn.addEventListener("click",()=>{laps=[];renderLaps()});
function formatTime(ms){const cs=Math.floor(ms/10),m=Math.floor(cs/6000),s=Math.floor((cs%6000)/100),c=cs%100;return `${pad(m)}:${pad(s)}.${pad(c)}`}
function renderLaps(){
 lapCountEl.textContent=`${pad(laps.length)} LAPS`;clearBtn.disabled=laps.length===0;
 if(!laps.length){lapsEl.className="laps-empty";lapsEl.innerHTML='<span class="empty-mark">＋</span><p>Your recorded laps will appear here.</p>';return}
 const fastest=Math.min(...laps.map(l=>l.split)),longest=Math.max(...laps.map(l=>l.split));
 lapsEl.className="laps-list";
 lapsEl.innerHTML=laps.slice().reverse().map((lap,i)=>{
   const number=laps.length-i,fast=lap.split===fastest&&laps.length>1,width=longest?Math.max(8,lap.split/longest*100):8;
   return `<div class="lap-row ${fast?"fastest":""}"><span class="number">LAP ${pad(number)}</span><span class="bar"><span style="width:${width}%"></span></span><span class="time">${formatTime(lap.split)}</span></div>`;
 }).join("");
}
render();renderLaps();
