const header=document.querySelector('.site-header');
if(header){
  header.innerHTML=`<div class="container nav"><a class="brand" href="/" aria-label="Candidait home"><img src="/assets/candidait-logo.png" alt="Candidait"></a><form class="nav-search" action="/search/" method="get" role="search"><span class="ai-mark" aria-hidden="true">AI</span><label class="sr-only" for="site-search">Ask Candidait AI</label><input id="site-search" name="q" type="search" placeholder="Ask about jobs or hiring" autocomplete="off"><button type="submit">Go</button></form><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-nav-toggle>Menu</button><nav class="primary-nav" id="primary-nav" aria-label="Primary navigation" data-primary-nav>
  <div class="nav-group" data-nav-group><button class="nav-trigger" type="button" aria-expanded="false">Candidates <span class="chevron">▼</span></button><div class="dropdown mega"><p class="dropdown-label">Candidate tools</p><a href="/personalized-search/"><strong>AI Job Search</strong><span>New and relevant jobs selected around your goals</span></a><a href="/resume-optimizer/"><strong>Resume Optimizer</strong><span>Evidence-based analysis and candidate-approved improvements</span></a><a href="/candidates/#dashboard" data-candidate-dashboard><strong>Candidate Dashboard</strong><span>Profile progress, applications, interviews, and next steps</span></a><a href="/candidates/#interview"><strong>Interview Practice</strong><span>Role-specific questions, practice, and structured feedback</span></a><a href="/candidates/#community"><strong>Community Network</strong><span>Peers, mentors, and professional communities</span></a><a href="/candidates/#privacy"><strong>Candidate Privacy</strong><span>Visibility, blocked employers, sharing, and data controls</span></a></div></div>
  <div class="nav-group" data-nav-group><button class="nav-trigger" type="button" aria-expanded="false">Employers <span class="chevron">▼</span></button><div class="dropdown mega"><p class="dropdown-label">Employer tools</p><a href="/employers/#job-post-optimizer"><strong>Job Post Optimizer</strong><span>Clear requirements, inclusive language, and complete job details</span></a><a href="/employers/#talent"><strong>Candidate Discovery</strong><span>Search candidate-authorized evidence and preferences</span></a><a href="/employers/#dashboard" data-employer-dashboard><strong>Employer Dashboard</strong><span>Jobs, applicants, team activity, and hiring priorities</span></a><a href="/employers/#pipeline"><strong>Applicant Pipeline</strong><span>Coordinate review, communication, and decisions</span></a><a href="/employers/#interview"><strong>Interview Planning</strong><span>Structured questions, scorecards, and team guidance</span></a><a href="/employers/#compliance"><strong>Compliance Center</strong><span>Notices, accommodations, retention, and audit readiness</span></a></div></div>
  <div class="nav-actions"><a class="login-link" href="/sign-in/" data-account-link>Login</a></div></nav></div>`;
}

const demoParams=new URLSearchParams(location.search);
document.querySelectorAll('h3,.breadcrumb span,.eyebrow').forEach(el=>{if(el.textContent.trim()==='Personalized Search')el.textContent='AI Job Search'});
document.querySelectorAll('a').forEach(el=>{if(el.textContent.trim()==='Explore personalized search')el.textContent='Explore AI job search'});
if(document.title.startsWith('Personalized Search'))document.title=document.title.replace('Personalized Search','AI Job Search');
if(demoParams.get('demo')==='reset'){localStorage.removeItem('candidait-demo-signed-in');localStorage.removeItem('candidait-demo-role');document.cookie='candidait_personalization=; Max-Age=0; Path=/; SameSite=Lax';history.replaceState({},'',location.pathname)}
const signedIn=localStorage.getItem('candidait-demo-signed-in')==='true';
const accountLink=document.querySelector('[data-account-link]');
if(signedIn){
  const role=localStorage.getItem('candidait-demo-role');
  const dashboard=document.querySelector(role==='employer'?'[data-employer-dashboard]':'[data-candidate-dashboard]');
  dashboard?.parentElement.querySelector('.dropdown-label')?.after(dashboard);
  if(accountLink){accountLink.href=role==='employer'?'/employers/#dashboard':'/candidates/#dashboard';accountLink.className='account-avatar';accountLink.setAttribute('aria-label','Account');accountLink.title='Account';accountLink.innerHTML='<span aria-hidden="true">●</span>'}
}

const navToggle=document.querySelector('[data-nav-toggle]');
const primaryNav=document.querySelector('[data-primary-nav]');
const navGroups=[...document.querySelectorAll('[data-nav-group]')];
const closeGroups=(except=null)=>navGroups.forEach(group=>{if(group!==except){group.classList.remove('open');group.querySelector('button')?.setAttribute('aria-expanded','false')}});
navToggle?.addEventListener('click',()=>{const open=primaryNav.classList.toggle('mobile-open');document.querySelector('.nav')?.classList.toggle('nav-open',open);navToggle.setAttribute('aria-expanded',String(open));navToggle.textContent=open?'Close':'Menu'});
navGroups.forEach(group=>{const trigger=group.querySelector('button');trigger?.addEventListener('click',event=>{event.stopPropagation();const opening=!group.classList.contains('open');closeGroups(group);group.classList.toggle('open',opening);trigger.setAttribute('aria-expanded',String(opening))})});
document.addEventListener('click',()=>closeGroups());
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeGroups();document.activeElement?.blur()}});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

const authForm=document.querySelector('[data-auth-form]');
if(authForm){const requested=new URLSearchParams(location.search).get('role');const roleInput=authForm.querySelector(`[name="role"][value="${requested}"]`);if(roleInput)roleInput.checked=true}
authForm?.addEventListener('submit',event=>{event.preventDefault();const role=new FormData(authForm).get('role');localStorage.setItem('candidait-demo-signed-in','true');localStorage.setItem('candidait-demo-role',role);const status=authForm.querySelector('[data-form-status]');status.textContent=`Demo ${role} account is active on this device. Opening your dashboard.`;setTimeout(()=>location.href=role==='employer'?'/employers/#dashboard':'/candidates/#dashboard',650)});

const optimizerForm=document.querySelector('[data-optimizer-form]');
optimizerForm?.addEventListener('submit',event=>{event.preventDefault();const file=optimizerForm.querySelector('[type="file"]').files[0];const role=optimizerForm.querySelector('[name="target-role"]').value.trim();const status=optimizerForm.querySelector('[data-form-status]');status.textContent=file&&role?'Prototype ready: the secure ingest, extraction, and evidence-review steps will begin here.':'Add a resume and target role to preview the workflow.'});

const jobSearch=document.querySelector('[data-job-search]');
if(jobSearch){const fields=[...jobSearch.querySelectorAll('input,select')];const cards=[...document.querySelectorAll('[data-job-card]')];const count=document.querySelector('[data-job-count]');const filterJobs=()=>{const query=jobSearch.querySelector('[name="query"]').value.toLowerCase().trim();const location=jobSearch.querySelector('[name="location"]').value;const type=jobSearch.querySelector('[name="type"]').value;let visible=0;cards.forEach(card=>{const matchQuery=!query||card.textContent.toLowerCase().includes(query);const matchLocation=!location||card.dataset.location===location;const matchType=!type||card.dataset.type===type;const show=matchQuery&&matchLocation&&matchType;card.hidden=!show;if(show)visible++});count.textContent=`${visible} illustrative role${visible===1?'':'s'}`};fields.forEach(field=>field.addEventListener(field.tagName==='INPUT'?'input':'change',filterJobs));jobSearch.addEventListener('submit',event=>{event.preventDefault();filterJobs()})}

const searchQuery=new URLSearchParams(location.search).get('q');
const searchInput=document.querySelector('[data-search-query]');
const searchHeading=document.querySelector('[data-search-heading]');
const aiSearch=document.querySelector('[data-ai-search]');
if(searchInput&&searchQuery){searchInput.value=searchQuery;if(searchHeading)searchHeading.textContent=`Answering: “${searchQuery}”`}
if(aiSearch){
  const answer=aiSearch.querySelector('[data-ai-answer]');
  const answerText=aiSearch.querySelector('[data-ai-answer-text]');
  const cards=[...aiSearch.querySelectorAll('[data-search-result]')];
  const intents={jobs:['job','role','work','remote','salary','opening','career'],resume:['resume','cv','ats','application','experience'],interview:['interview','practice','question','prepare'],employer:['employer','hire','hiring','candidate','post','pipeline','compliance'],privacy:['privacy','private','confidential','data','share','permission']};
  const respond=query=>{
    const clean=query.trim();
    if(!clean)return;
    const lower=clean.toLowerCase();
    const scores=cards.map((card,index)=>{const terms=intents[card.dataset.intent]||[];const score=terms.reduce((total,term)=>total+(lower.includes(term)?1:0),0);return {card,index,score}});
    scores.sort((a,b)=>b.score-a.score||a.index-b.index).forEach(item=>item.card.parentElement.appendChild(item.card));
    const best=scores[0];
    const label=best?.score?best.card.querySelector('h3')?.textContent:'Candidait resources';
    answerText.textContent=`I found the strongest match in ${label}. I also included related options so you can compare the next best paths.`;
    answer.hidden=false;
    answer.focus();
    if(searchHeading)searchHeading.textContent=`Answering: “${clean}”`;
  };
  if(searchQuery)respond(searchQuery);
  aiSearch.querySelector('form')?.addEventListener('submit',event=>{event.preventDefault();const query=searchInput.value;const url=new URL(location.href);url.searchParams.set('q',query);history.replaceState({},'',url);answer.hidden=true;if(searchHeading)searchHeading.textContent='Thinking through your question';setTimeout(()=>respond(query),450)});
  aiSearch.querySelectorAll('[data-ai-prompt]').forEach(button=>button.addEventListener('click',()=>{searchInput.value=button.textContent.trim();aiSearch.querySelector('form')?.requestSubmit()}));
}

const cookiePanel=document.querySelector('[data-personalization-panel]');
if(cookiePanel){
  const accepted=document.cookie.includes('candidait_personalization=accepted');
  const status=cookiePanel.querySelector('[data-personalization-status]');
  const controls=cookiePanel.querySelector('[data-personalization-controls]');
  const results=document.querySelector('[data-personalized-results]');
  const applyState=(personalized)=>{status.textContent=personalized?'Personalized for this device':'Showing general recommendations';controls.hidden=true;results?.classList.toggle('is-personalized',personalized)};
  if(signedIn){status.textContent='Personalized using your demo candidate context';controls.hidden=true;results?.classList.add('is-personalized')}
  else if(accepted){applyState(true)}
  cookiePanel.querySelector('[data-accept-personalization]')?.addEventListener('click',()=>{document.cookie='candidait_personalization=accepted; Max-Age=15552000; Path=/; SameSite=Lax';applyState(true)});
  cookiePanel.querySelector('[data-decline-personalization]')?.addEventListener('click',()=>applyState(false));
}
