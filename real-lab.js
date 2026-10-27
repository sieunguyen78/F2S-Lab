'use strict';
(function(){
  const $=id=>document.getElementById(id);
  let evidence=null;
  const base=()=>String(window.F2S_API_URL||'http://localhost:8000').replace(/\/$/,'');
  const html=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct=x=>(100*x).toFixed(1).replace('.',',')+'%';
  function getRules(){return [...document.querySelectorAll('[data-rule]')].map(x=>x.value)}
  const show=(id,msg)=>{$(id).textContent=msg};
  function heat(att){return `<div class="attention">${att.map((x,i)=>`<div class="attention-cell" title="Điều ${i}: ${x.toFixed(4)}" style="background:rgba(16,163,127,${Math.max(.08,x)})"><small>${i}</small><strong>${pct(x)}</strong></div>`).join('')}</div>`}
  async function load(){
    try {
      const [h,e]=await Promise.all([fetch(base()+'/api/health'),fetch(base()+'/api/evidence')]);
      if(!h.ok||!e.ok)throw Error('API không sẵn sàng');
      const status=await h.json();evidence=await e.json();
      show('backendStatus','Đã kết nối PyTorch '+status.version+' · '+Object.values(status.checkpoints).filter(Boolean).length+'/4 checkpoint');
      show('apiEndpoint',base());
      const rows=Object.entries(evidence.records).map(([name,e])=>e?`<tr><td>${html(name)}</td><td>${e.parameter_count.toLocaleString('vi-VN')}</td><td>${pct(e.train.accuracy)}</td><td>${pct(e.ood.accuracy)}</td><td>${e.ood.correct}/${e.ood.total}</td><td>${e.seed}</td></tr>`:`<tr><td>${name}</td><td colspan="5">Chưa có checkpoint / báo cáo</td></tr>`).join('');
      $('realEvidence').innerHTML=`<table class="research-table"><thead><tr><th>Checkpoint</th><th>Tham số</th><th>Train</th><th>OOD</th><th>Số câu đúng</th><th>Seed</th></tr></thead><tbody>${rows}</tbody></table>`;
    }catch(err){show('backendStatus','Chưa kết nối backend: '+err.message);$('realEvidence').textContent='Chưa có kết quả thực nghiệm có thể kiểm chứng từ backend.';}
  }
  async function predict(){
    let typ=$('realType').value,idx=+$('realIndex').value;const scenario=+$('realScenario').value;
    const raw=$('freeQuery').value.trim();
    if(raw){
      const m=raw.match(/(?:điều|dieu)\s*(\d+)/i);
      if(m){idx=+m[1];typ='article';}
      else {
        const normalized=s=>s.toLocaleLowerCase('vi').normalize('NFC').replace(/[“”"?.,]/g,'').trim();
        const search=normalized(raw);
        const matches=getRules().map((r,i)=>search.includes(normalized(r))?i:-1).filter(i=>i>=0);
        if(matches.length===1){idx=matches[0];typ='reverse';}
        else {$('realResult').textContent='Không phân tích được câu hỏi. Vui lòng ghi “Điều n ...?” hoặc sử dụng đúng cụm nội dung trong bảng quy chế.';return;}
      }
      if(idx<0||idx>9){$('realResult').textContent='Chỉ hỗ trợ Điều 0 đến Điều 9.';return;}
    }
    const ruleTexts=getRules();
    const mapping=[0,1,2,3,4,5,6,7,8,9];
    const payload={query_type:typ,index:idx,scenario,mapping};
    const q=typ==='article'?`Điều ${idx} quy định nội dung gì?`:`Nội dung “${ruleTexts[idx]}” thuộc điều nào?`;
    $('realResult').textContent='Đang suy luận trên CPU bằng PyTorch…';
    try {
      const res=await fetch(base()+'/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const data=await res.json();if(!res.ok)throw Error(typeof data.detail==='string'?data.detail:'API lỗi '+res.status);
      const decode=t=>t<10?`Nội dung ${t}: ${ruleTexts[t]}`:`Điều ${t-10}`;
      $('realResult').innerHTML=`<h3>Câu hỏi: ${html(q)}</h3><p>Đáp án từ bảng dữ liệu: <b>${html(decode(data.expected_token))}</b></p>`+Object.entries(data.models).map(([name,r])=>`<div class="model-reply"><h3>${name==='f2s'?'F2S PyTorch':'GPT-2 mini PyTorch'} ${r.correct?'✓':'✕'}</h3><p><b>${html(decode(r.answer_token))}</b> · Độ tin cậy softmax: ${pct(r.confidence)}</p><p>Attention tới 10 ô nhớ nội dung (đã gộp các head đối với GPT-2):</p>${heat(r.attention)}<small>Checkpoint SHA-256: ${r.sha256||'chưa có'} · ${r.parameters} tham số</small></div>`).join('')+`<p class="footnote">${html(data.disclaimer)} Bảng nội dung hiển thị có thể sửa, nhưng các mô hình xử lý mã danh tính 0–9; không hiểu ngữ nghĩa văn bản tiếng Việt tự do.</p>`;
    }catch(err){$('realResult').textContent='Không thể chạy suy luận: '+err.message;}
  }
  $('realRun').addEventListener('click',predict);
  $('reloadEvidence').addEventListener('click',load);
  load();
})();
