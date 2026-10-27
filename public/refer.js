import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFunctions, httpsCallable} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
import {firebaseConfig} from './firebase-config.js';
const app=initializeApp(firebaseConfig), auth=getAuth(app), fn=getFunctions(app,'asia-south1');
const el=id=>document.getElementById(id), show=(id,v)=>el(id).classList.toggle('hide',!v);
const call=async(name,data={})=>(await httpsCallable(fn,name)(data)).data;
const message=(t)=>el('status').textContent=t;
const fromLink=new URLSearchParams(location.search).get('ref');
if(fromLink) el('code').value=fromLink.toUpperCase();
el('login').onclick=async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){message(e.message)}};
el('logout').onclick=()=>signOut(auth);
el('register').onclick=async()=>{try{await call('registerReferrer',{name:el('partnerName').value});await load()}catch(e){message(e.message)}};
el('copy').onclick=async()=>{await navigator.clipboard.writeText(el('refLink').value);message('Link copied')};
el('share').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent('SriJyotiAstro referral link: '+el('refLink').value),'_blank','noopener');
el('leadForm').onsubmit=async e=>{e.preventDefault();if(!auth.currentUser){message('Please sign in with Google first.');return}try{await call('submitLead',{code:el('code').value,name:el('clientName').value,contact:el('contact').value,consent:el('consent').checked});message('Enquiry recorded. SriJyotiAstro will contact you.');el('leadForm').reset()}catch(e){message(e.message)}};
el('refresh').onclick=loadLeads;
async function loadLeads(){try{const data=await call('adminLeads');const tbody=el('leads');tbody.replaceChildren();for(const lead of data.leads){const row=document.createElement('tr');for(const value of [lead.name,lead.contact,lead.code,lead.status]){const td=document.createElement('td');td.textContent=value||'';row.append(td)}const td=document.createElement('td');if(lead.status==='pending'){const b=document.createElement('button');b.textContent='Approve after payment verification';b.onclick=async()=>{if(!confirm('Confirm consultation completed and payment verified?'))return;try{await call('approveLead',{id:lead.id});await loadLeads();message('Referral approved')}catch(e){message(e.message)}};td.append(b)}row.append(td);tbody.append(row)}}catch(e){message(e.message)}}
async function load(){if(!auth.currentUser)return;try{const a=await call('myAccount');show('join',!a.registered);show('dashboard',a.registered);show('admin',a.isAdmin);if(a.registered){el('counts').textContent=`Completed consultations: ${a.approved} · Pending: ${a.pending} · Reward points: ${a.points}`;el('refLink').value=new URL('/refer.html?ref='+encodeURIComponent(a.code),location.origin).href}if(a.isAdmin)await loadLeads()}catch(e){message(e.message)}}
onAuthStateChanged(auth,async user=>{show('login',!user);show('logout',!!user);el('who').textContent=user?`Signed in as ${user.displayName||user.email} · Firebase UID: ${user.uid}`:'Sign in to register or submit an enquiry.';show('join',false);show('dashboard',false);show('admin',false);if(user)await load()});
