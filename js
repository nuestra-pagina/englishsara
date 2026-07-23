const total = 5;
let current = 0;
const track = document.getElementById('track');
const nav = document.getElementById('nav');
const arrowLeft = document.getElementById('arrow-left');
const arrowRight = document.getElementById('arrow-right');

for(let i=0;i<total;i++){
  const d = document.createElement('button');
  d.className = 'dot' + (i===0?' active':'');
  d.addEventListener('click', ()=>goTo(i));
  nav.appendChild(d);
}

function updateDots(){
  [...nav.children].forEach((d,i)=> d.classList.toggle('active', i===current));
}

function goTo(i){
  if(i<0||i>=total) return;
  current = i;
  track.style.transform = `translateX(-${i*100}vw)`;
  document.body.setAttribute('data-slide', i);
  updateDots();
  arrowLeft.disabled = i===0;
  arrowRight.disabled = i===total-1;
  triggerSlideAnimation(i);
}

arrowLeft.addEventListener('click', ()=>goTo(current-1));
arrowRight.addEventListener('click', ()=>goTo(current+1));
document.addEventListener('keydown', (e)=>{
  if(e.key==='ArrowRight') goTo(current+1);
  if(e.key==='ArrowLeft') goTo(current-1);
});

/* ---------- typing effect ---------- */
function typeInto(el, html, speed=16){
  return new Promise(resolve=>{
    el.innerHTML = '';
    let i = 0;
    const parts = html.split(/(<[^>]+>)/g).filter(Boolean);
    let buffer = '';
    let pi = 0;
    function step(){
      if(pi>=parts.length){ resolve(); return; }
      const part = parts[pi];
      if(part.startsWith('<')){
        buffer += part;
        el.innerHTML = buffer + '<span class="cursor"></span>';
        pi++;
        setTimeout(step, 4);
      } else {
        if(i < part.length){
          buffer += part[i];
          el.innerHTML = buffer + '<span class="cursor"></span>';
          i++;
          setTimeout(step, speed);
        } else {
          i = 0; pi++;
          setTimeout(step, 4);
        }
      }
    }
    step();
  });
}

const htmlCode = `<span class="tag">&lt;h1&gt;</span>Hello, world!<span class="tag">&lt;/h1&gt;</span>\n<span class="tag">&lt;p&gt;</span>This is my page.<span class="tag">&lt;/p&gt;</span>`;
const cssCode = `<span class="kw">h1</span> {\n  color: <span class="str">#2E86F0</span>;\n  text-align: <span class="str">center</span>;\n}\n<span class="kw">p</span> { color: <span class="str">#999</span>; }`;
const jsCode = `button.<span class="kw">addEventListener</span>(<span class="str">'click'</span>, () =&gt; {\n  count++;\n  output.textContent = <span class="str">\`clicks: \${count}\`</span>;\n});`;

let played = { 1:false, 2:false, 3:false };

async function triggerSlideAnimation(i){
  if(i===1 && !played[1]){
    played[1]=true;
    await typeInto(document.getElementById('code-html'), htmlCode, 18);
    const p = document.getElementById('preview-html');
    p.innerHTML = '<div class="plain-h1">Hello, world!</div><div class="plain-p" style="margin-top:6px;">This is my page.</div>';
  }
  if(i===2 && !played[2]){
    played[2]=true;
    await typeInto(document.getElementById('code-css'), cssCode, 18);
  }
  if(i===3 && !played[3]){
    played[3]=true;
    await typeInto(document.getElementById('code-js'), jsCode, 18);
  }
}

arrowLeft.disabled = true;

/* live counter — real working JS */
let count = 0;
const counterBtn = document.getElementById('counter-btn');
const counterOut = document.getElementById('counter-out');
counterBtn.addEventListener('click', ()=>{
  count++;
  counterOut.textContent = `clicks: ${count}`;
  counterOut.classList.remove('pulse');
  void counterOut.offsetWidth;
  counterOut.classList.add('pulse');
});