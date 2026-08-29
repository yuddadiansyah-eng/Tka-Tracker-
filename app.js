const subjects=[
{id:"kimia",icon:"🧪",name:"Kimia",desc:"Materi esensial TKA Kimia",groups:[
["Kimia Dasar",["Struktur atom","Teori dan model atom","Sistem periodik unsur","Sifat periodik unsur","Ikatan kimia","Geometri molekul","Interaksi antarmolekul","Hukum dasar kimia","Stoikiometri","Persamaan reaksi kimia"]],
["Kimia Analitik",["Larutan","Kesetimbangan larutan","Asam-basa","pH","Koloid"]],
["Kimia Fisik",["Energetika reaksi","Dinamika reaksi"]],
["Kimia Organik",["Struktur senyawa karbon","Kereaktifan senyawa karbon"]]]},
{id:"matematika",icon:"📐",name:"Matematika",desc:"Materi dari Matriks Asesmen",groups:[
["Aljabar — Matriks",["Determinan matriks","Invers matriks","Operasi matriks"]],
["Aljabar — Polinomial",["Operasi polinomial","Pemfaktoran polinomial","Suku sisa"]],
["Aljabar — Fungsi",["Domain dan kodomain","Daerah hasil (range)","Grafik fungsi polinom","Fungsi rasional","Fungsi eksponensial","Fungsi logaritma","Fungsi trigonometri"]],
["Geometri dan Pengukuran — Vektor",["Vektor pada bidang dan ruang","Panjang vektor","Operasi vektor"]],
["Geometri dan Pengukuran — Lingkaran",["Persamaan lingkaran","Garis singgung lingkaran","Luas dan keliling daerah lingkaran"]],
["Geometri dan Pengukuran — Transformasi Geometri",["Translasi","Refleksi","Rotasi","Dilatasi","Komposisi transformasi","Transformasi geometri dengan matriks"]],
["Trigonometri — Limit",["Limit fungsi aljabar","Limit fungsi trigonometri"]]]},
{id:"bahasa",icon:"📖",name:"Bahasa Indonesia",desc:"Materi dari Matriks Asesmen",groups:[
["Pemahaman Tekstual",["Mengidentifikasi informasi penting dalam teks","Mengklasifikasi orang, benda, tempat, atau peristiwa berdasarkan kategori tertentu","Membuat kerangka atau bagan berdasarkan bagian-bagian penting dalam teks","Meringkas teks dengan mengutip bagian penting","Mengidentifikasi kata serapan dari bahasa daerah/asing","Mengidentifikasi latar, karakter, dan/atau fenomena berdasarkan kosakata dalam teks fiksi atau nonfiksi"]],
["Pemahaman Inferensial",["Menyimpulkan detail pendukung","Menyimpulkan topik, ide pokok/gagasan utama, makna, target pembaca, tujuan penulisan, dan alasan moral","Menyimpulkan urutan kejadian dan memperkirakan isi selanjutnya dari teks","Menyimpulkan persamaan atau perbedaan antartokoh, waktu, tempat, dan/atau gagasan","Menyimpulkan hubungan sebab-akibat","Menyimpulkan karakter tokoh berdasarkan petunjuk eksplisit dalam teks","Memprediksi hasil cerita setelah membaca bagian awal"]],
["Evaluasi dan Apresiasi",["Menilai realitas atau fantasi dalam teks","Menilai fakta atau opini","Menilai kecukupan dan validitas informasi","Menilai kesesuaian bagian teks untuk menggambarkan karakter utama atau aspek lain","Menanggapi teks secara emosional dan estetis","Menilai relevansi peristiwa dalam teks dengan kehidupan sehari-hari","Menilai ketepatan dan kesesuaian penggunaan bahasa","Menyimpulkan respons emosional terhadap unsur puisi, prosa, dan drama"]]]}
];

const KEY="tka-tracker-pro-v1";
let state=JSON.parse(localStorage.getItem(KEY)||'{"done":{},"schedule":[],"target":{"score":0,"date":"","subjects":{"kimia":false,"matematika":false,"bahasa":false}}}');
if(!state.done)state.done={}; if(!state.schedule)state.schedule=[]; if(!state.target)state.target={score:0,date:"",subjects:{}};
let page="dashboard", filter="all", query="";

const items=()=>subjects.flatMap(s=>s.groups.flatMap(g=>g[1].map(name=>({id:`${s.id}|${g[0]}|${name}`,subject:s.id,name}))));
const total=items().length;
const doneCount=()=>items().filter(x=>state.done[x.id]).length;
const pct=()=>Math.round(doneCount()/total*100);
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function toast(t){let e=document.getElementById("toast");e.textContent=t;e.classList.add("show");clearTimeout(window._t);window._t=setTimeout(()=>e.classList.remove("show"),1800)}
function subjectPct(id){let a=items().filter(x=>x.subject===id),d=a.filter(x=>state.done[x.id]).length;return Math.round(d/a.length*100)}
function pageTitle(title,sub){return `<div class="page-title"><div><h1>${title}</h1><p>${sub}</p></div></div>`}

function dashboard(){
return pageTitle("Dashboard","Pantau perjalanan belajarmu dalam satu halaman.")+
`<section class="hero"><div><span class="label">PROGRES KESELURUHAN</span><h2>${pct()===100?"Semua materi selesai! 🎉":pct()>0?"Teruskan progresmu hari ini.":"Mulai perjalanan TKA-mu."}</h2><p>${doneCount()} dari ${total} materi sudah ditandai selesai.</p></div><div class="ring">${pct()}%</div></section>
<div class="grid three"><div class="card stat"><div><span class="muted">Materi selesai</span><strong>${doneCount()}</strong></div></div><div class="card stat"><div><span class="muted">Materi tersisa</span><strong>${total-doneCount()}</strong></div></div><div class="card stat"><div><span class="muted">Target nilai</span><strong>${state.target.score||"—"}</strong></div></div></div>
<div class="grid"><div class="card"><h3>Progres per mata pelajaran</h3>${subjects.map(s=>`<div class="subject-row"><div class="line"><span>${s.icon} ${s.name}</span><span>${subjectPct(s.id)}%</span></div><div class="bar"><div class="fill" style="width:${subjectPct(s.id)}%"></div></div></div>`).join("")}</div>
<div class="card"><h3>Akses cepat</h3><div class="quick"><button data-go="checklist">✓ Checklist</button><button class="secondary" data-go="schedule">▣ Jadwal</button><button class="secondary" data-go="stats">◔ Statistik</button><button class="secondary" data-go="target">★ Target</button></div></div></div>
<div class="grid"><div class="card"><h3>Jadwal terdekat</h3>${schedulePreview()}</div><div class="card"><h3>Target TKA</h3><p class="muted">Target nilai: <b>${state.target.score||"Belum diatur"}</b></p><p class="muted">Tanggal target: <b>${state.target.date||"Belum diatur"}</b></p></div></div>`;
}
function schedulePreview(){
if(!state.schedule.length)return `<div class="empty">Belum ada jadwal. Tambahkan jadwal belajarmu.</div>`;
return `<div class="schedule-list">${state.schedule.slice().sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3).map(s=>`<div class="schedule-item"><div class="datebox"><small>${s.date}</small>${s.time||"—"}</div><div class="schedule-info"><b>${esc(s.title)}</b><span>${esc(s.subject)}${s.note?" · "+esc(s.note):""}</span></div></div>`).join("")}</div>`;
}

function checklist(){
let q=query.toLowerCase();
return pageTitle("Checklist","Centang materi setelah kamu benar-benar mempelajarinya.")+
`<div class="toolbar"><input id="search" value="${esc(query)}" placeholder="Cari materi..."><button class="primary" id="clearSearch">Bersihkan</button></div>
<div class="tabs"><button class="tab ${filter==="all"?"active":""}" data-filter="all">Semua</button>${subjects.map(s=>`<button class="tab ${filter===s.id?"active":""}" data-filter="${s.id}">${s.icon} ${s.name}</button>`).join("")}</div>
${subjects.filter(s=>filter==="all"||filter===s.id).map(s=>{
let groups=s.groups.map(([g,arr])=>{let v=arr.filter(n=>!q||n.toLowerCase().includes(q));if(!v.length)return "";return `<div class="group"><h4>${g}</h4>${v.map(n=>{let id=`${s.id}|${g}|${n}`,d=!!state.done[id];return `<div class="item ${d?"done":""}"><input type="checkbox" data-id="${esc(id)}" ${d?"checked":""}><label>${esc(n)}</label></div>`}).join("")}</div>`}).join("");
return `<article class="subject"><div class="subject-head"><div class="subject-name"><div class="subject-icon">${s.icon}</div><div><h3>${s.name}</h3><small>${s.desc}</small></div></div><div class="pct">${subjectPct(s.id)}%</div></div>${groups}</article>`}).join("")}`;
}

function schedule(){
return pageTitle("Jadwal Belajar","Buat agenda belajar yang realistis dan mudah diikuti.")+
`<div class="grid"><div class="card"><h3>Tambah jadwal</h3><form class="form" id="scheduleForm"><div class="form-grid"><div><label>Tanggal</label><input name="date" type="date" required></div><div><label>Waktu</label><input name="time" type="time"></div></div><div><label>Materi / kegiatan</label><input name="title" placeholder="Contoh: Latihan Stoikiometri" required></div><div><label>Mata pelajaran</label><select name="subject"><option>Kimia</option><option>Matematika</option><option>Bahasa Indonesia</option></select></div><div><label>Catatan</label><textarea name="note" placeholder="Target sesi belajar..."></textarea></div><button class="primary">＋ Tambah Jadwal</button></form></div>
<div class="card"><h3>Tips menyusun jadwal</h3><p class="muted">• Tentukan satu tujuan jelas per sesi.</p><p class="muted">• Sisakan waktu untuk latihan soal dan review.</p><p class="muted">• Jangan membuat jadwal terlalu padat.</p></div></div>
<div class="card" style="margin-top:16px"><h3>Semua jadwal</h3>${state.schedule.length?`<div class="schedule-list">${state.schedule.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time)).map((s,i)=>`<div class="schedule-item"><div class="datebox"><small>${s.date}</small>${s.time||"—"}</div><div class="schedule-info"><b>${esc(s.title)}</b><span>${esc(s.subject)}${s.note?" · "+esc(s.note):""}</span></div><div class="schedule-actions"><button data-del="${s.id}">✕</button></div></div>`).join("")}</div>`:`<div class="empty">Belum ada jadwal belajar.</div>`}</div>`;
}

function stats(){
let finished=doneCount(), p=pct();
return pageTitle("Statistik","Lihat perkembangan penguasaan materi TKA.")+
`<div class="grid three"><div class="card stat"><div><span class="muted">Keseluruhan</span><strong>${p}%</strong></div></div><div class="card stat"><div><span class="muted">Selesai</span><strong>${finished}</strong></div></div><div class="card stat"><div><span class="muted">Belum selesai</span><strong>${total-finished}</strong></div></div></div>
<div class="card" style="margin-top:16px"><h3>Rincian per mata pelajaran</h3>${subjects.map(s=>`<div class="subject-row"><div class="line"><span>${s.icon} ${s.name}</span><span>${subjectPct(s.id)}%</span></div><div class="bar"><div class="fill" style="width:${subjectPct(s.id)}%"></div></div></div>`).join("")}</div>
<div class="card" style="margin-top:16px"><h3>Ringkasan</h3><p class="muted">Kamu sudah menyelesaikan <b>${finished}</b> dari <b>${total}</b> materi. ${p>=75?"Pertahankan konsistensimu.":p>=40?"Progresmu sudah berjalan bagus.":"Fokus dulu menyelesaikan beberapa materi inti setiap sesi."}</p></div>`;
}

function target(){
return pageTitle("Target TKA","Tetapkan sasaran agar proses belajarmu punya arah.")+
`<div class="grid"><div class="card"><h3>Target utama</h3><form class="form" id="targetForm"><div><label>Target nilai TKA</label><input name="score" type="number" min="0" max="1000" value="${state.target.score||""}" placeholder="Contoh: 700"></div><div><label>Tanggal target</label><input name="date" type="date" value="${state.target.date||""}"></div><button class="primary">Simpan Target</button></form></div>
<div class="card target-card"><div><span class="muted">Target nilai</span><div class="target-score">${state.target.score||"—"}</div><span class="muted">Tanggal: ${state.target.date||"Belum diatur"}</span></div><div class="ring">${pct()}%</div></div></div>
<div class="card" style="margin-top:16px"><h3>Prioritas mata pelajaran</h3><p class="muted">Tandai mata pelajaran yang ingin kamu jadikan fokus utama.</p>${subjects.map(s=>`<label class="subject-check"><input type="checkbox" data-target="${s.id}" ${state.target.subjects?.[s.id]?"checked":""}> ${s.icon} ${s.name}</label>`).join("")}</div>`;
}

function render(){
let html=page==="dashboard"?dashboard():page==="checklist"?checklist():page==="schedule"?schedule():page==="stats"?stats():target();
document.getElementById("content").innerHTML=html;
bind();
document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
}
function bind(){
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{page=b.dataset.go;render();scrollTo(0,0)});
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>{page=n.dataset.page;render();document.getElementById("sidebar").classList.remove("open");scrollTo(0,0)});
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()});
let search=document.getElementById("search"); if(search){search.oninput=e=>{query=e.target.value;render();let s=document.getElementById("search");s.focus();s.setSelectionRange(s.value.length,s.value.length)};document.getElementById("clearSearch").onclick=()=>{query="";render()}}
document.querySelectorAll('input[type="checkbox"][data-id]').forEach(c=>c.onchange=()=>{state.done[c.dataset.id]=c.checked;save();render();toast(c.checked?"Materi selesai ✓":"Checklist dibatalkan")});
let sf=document.getElementById("scheduleForm");if(sf)sf.onsubmit=e=>{e.preventDefault();let f=new FormData(sf);state.schedule.push({id:Date.now(),date:f.get("date"),time:f.get("time"),title:f.get("title"),subject:f.get("subject"),note:f.get("note")});save();render();toast("Jadwal ditambahkan ✓")};
document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{state.schedule=state.schedule.filter(x=>String(x.id)!==String(b.dataset.del));save();render();toast("Jadwal dihapus")});
let tf=document.getElementById("targetForm");if(tf)tf.onsubmit=e=>{e.preventDefault();let f=new FormData(tf);state.target.score=f.get("score");state.target.date=f.get("date");save();render();toast("Target tersimpan ✓")};
document.querySelectorAll("[data-target]").forEach(c=>c.onchange=()=>{state.target.subjects=state.target.subjects||{};state.target.subjects[c.dataset.target]=c.checked;save();toast("Prioritas diperbarui")});
}
document.getElementById("menuBtn").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
let deferred;window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferred=e;document.getElementById("installBtn").classList.remove("hidden")});
document.getElementById("installBtn").onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;document.getElementById("installBtn").classList.add("hidden")}};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
render();
