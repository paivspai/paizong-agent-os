import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const ROOT=process.cwd(), html=fs.readFileSync(path.join(ROOT,'hub/index.html'),'utf8');
const items=(kind,n)=>Array.from({length:n},(_,i)=>({id:kind+'-'+i,kind,name:kind+' sample '+i,category:'项目管理',status:'planned',summary:'mock',url:''}));
const catalog={articles:items('article',1),skills:items('skill',1),cases:items('case',3),agents:items('agent',1),workbenches:items('workbench',13),pipelines:[],stats:{articleCount:209,skillCandidates:55,caseCount:6,workbenchCount:15}};
const op={version:'mock-v1',note:'preview only',policies:[{id:'rule1',title:'Private Governance Rule',rule:'验收必须附真实证据'}],routes:[{when:'用户贴文章',owner:'ChatGPT',method:'实测',proof:'日志'}],workflows:[{id:'test-sop',name:'SOP Smoke Case',category:'内容生产',status:'待验收',owner:'ChatGPT',trigger:'输入文章',inputs:'原文',steps:['核数'],deliverables:['facts.csv'],acceptance:'零假数',blockers:'不虚报',ref:'test fixture'}],commandCards:[{id:69,title:'核数终审 Test Card',body:'真实Prompt输入输出验收',category:'内容生产'}],manuals:[{id:'test-manual',name:'Video Manual Test',updated:'2026-11-08',sourceFile:'test.md',markdown:'# 视频工厂完整手册'}]};
const tmp=path.join(ROOT,'hub','_smoke.html');
const script='<script>window.PAI_PREVIEW='+JSON.stringify(catalog)+';window.PAI_PREVIEW_SYSTEM='+JSON.stringify(op)+';document.addEventListener("DOMContentLoaded",()=>setTimeout(()=>{const p=location.search.slice(1);document.querySelector(\'[data-tab="\'+(p==="system"?"system":p==="standards"?"standards":"sops")+\'"]\')?.click();if(p==="sops"){const d=document.querySelector(".sop-item details");d.open=true;const cb=document.querySelector(".sop-check");cb.checked=true;document.querySelector(".sop-notes").value="这里已经确实做过真实回归测试，并保存真实证据";document.querySelector(".sop-evidence").value="https://example.com/logs/1";document.querySelector(".sop-save").click();setTimeout(()=>{try{const state=JSON.parse(localStorage.getItem("paizong-hub-draft-v1"));document.documentElement.setAttribute("data-test-progress",state?.progress?.["test-sop"]?.status||"missing")}catch{}},250)}},100));</script>';
fs.writeFileSync(tmp,html.replace('<script src="app.js" defer></script>',script+'<script src="app.js" defer></script>'));
const cmds=['google-chrome','google-chrome-stable','chromium','chromium-browser'];
let chrome;for(const cmd of cmds){const q=spawnSync('which',[cmd],{encoding:'utf8'});if(q.status===0){chrome=q.stdout.trim();break}}
if(!chrome)throw Error('Headless Chrome is not installed; cannot verify UI.');
const checks=[['system','Private Governance Rule'],['standards','核数终审 Test Card'],['sops','SOP Smoke Case']];
try{
 for(const [tab,expected] of checks){
   const r=spawnSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--virtual-time-budget=2200','--dump-dom','file://'+tmp+'?'+tab],{encoding:'utf8',timeout:35000,maxBuffer:8*1024*1024});
   if(r.status!==0||!r.stdout.includes(expected))throw Error('Browser '+tab+' failed: '+r.status+' / '+r.stderr.slice(-550)+' / '+r.stdout.slice(-300));
   if(tab==='sops'&&!r.stdout.includes('data-test-progress="ready_for_review"'))throw Error('SOP save form did not persist to local preview state');
   console.log('PASS real browser: '+tab);
 }
}finally{fs.unlinkSync(tmp)}
