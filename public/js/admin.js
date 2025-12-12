
function showTab(id){document.querySelectorAll('.tab-content').forEach(e=>e.classList.remove('active'));document.querySelectorAll('.sidebar-menu li').forEach(e=>e.classList.remove('active'));document.getElementById(id).classList.add('active');event.currentTarget.classList.add('active');loadData(id);}
async function loadData(type){
    const res=await fetch('/api/'+(type==='register'?'registrations':type));
    const data=await res.json();
    const cont=document.getElementById(type+'List');
    cont.innerHTML='';
    if(type==='register'){cont.innerHTML=data.map(r=>`<li>${r.name} (${r.email}) - ${r.teamId}</li>`).join('');return;}
    data.forEach(i=>{
        let h=`<strong>${i.title||i.name}</strong>`;
        if(type==='past-glory'||type==='gallery') h=`<img src="${i.image}" style="height:40px;margin-right:10px;">`+h;
        if(type==='events') h=`<strong>${i.title}</strong> (${i.prize})`;
        const div=document.createElement('div');div.className='admin-item';
        div.innerHTML=`${h} <button onclick="delItem('${type}',${i.id})" class="icon-btn delete"><i class="fas fa-trash"></i></button>`;
        cont.appendChild(div);
    });
}
async function addItem(e,type){e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());await fetch('/api/'+type,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});e.target.reset();loadData(type);}
async function delItem(type,id){if(confirm('Delete?'))await fetch('/api/'+type+'/'+id,{method:'DELETE'});loadData(type);}
async function logout(){await fetch('/api/logout',{method:'POST'});window.location.href='/admin-login';}
loadData('events');
