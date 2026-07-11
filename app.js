// ─────────────────────────────────────────────
// 1. BASE DE DADOS AMPLIADA (Preços Fixos e Mais Itens)
// ─────────────────────────────────────────────
const MARKET_DB = {
  "Hortifrúti": [
    {e:'🍎', n:'Maçã', p:2.50}, {e:'🍌', n:'Banana', p:1.80}, {e:'🍊', n:'Laranja', p:2.20},
    {e:'🍇', n:'Uva', p:4.50}, {e:'🍓', n:'Morango', p:5.00}, {e:'🍉', n:'Melancia', p:7.90},
    {e:'🍍', n:'Abacaxi', p:6.50}, {e:'🥑', n:'Abacate', p:5.20}, {e:'🍋', n:'Limão', p:1.50},
    {e:'🥕', n:'Cenoura', p:2.40}, {e:'🥦', n:'Brócolis', p:4.50}, {e:'🍅', n:'Tomate', p:4.90},
    {e:'🧅', n:'Cebola', p:3.80}, {e:'🥔', n:'Batata', p:3.20}, {e:'🌽', n:'Milho', p:3.00}
  ],
  "Padaria e Laticínios": [
    {e:'🍞', n:'Pão', p:4.50}, {e:'🥛', n:'Leite', p:5.00}, {e:'🧀', n:'Queijo', p:12.50},
    {e:'🥚', n:'Ovos', p:8.00}, {e:'🧈', n:'Manteiga', p:6.50}, {e:'🫙', n:'Iogurte', p:3.20},
    {e:'🥐', n:'Croissant', p:5.80}, {e:'🍰', n:'Bolo', p:15.00}, {e:'🍩', n:'Donut', p:4.50}
  ],
  "Mercearia": [
    {e:'🍚', n:'Arroz', p:6.50}, {e:'🫘', n:'Feijão', p:7.80}, {e:'🍝', n:'Macarrão', p:3.40},
    {e:'☕', n:'Café', p:8.50}, {e:'🍿', n:'Pipoca', p:2.50}, {e:'🧂', n:'Sal', p:2.00},
    {e:'🫒', n:'Azeite', p:19.90}, {e:'🥫', n:'Molho', p:2.80}, {e:'🥜', n:'Amendoim', p:3.50}
  ],
  "Carnes e Peixes": [
    {e:'🍗', n:'Frango', p:14.90}, {e:'🥩', n:'Carne', p:24.90}, {e:'🐟', n:'Peixe', p:18.00},
    {e:'🍤', n:'Camarão', p:28.00}, {e:'🥓', n:'Bacon', p:9.90}
  ],
  "Doces e Bebidas": [
    {e:'🍫', n:'Chocolate', p:4.50}, {e:'🍬', n:'Bala', p:0.50}, {e:'🍦', n:'Sorvete', p:15.00},
    {e:'🍪', n:'Biscoito', p:3.50}, {e:'🍭', n:'Pirulito', p:0.80}, {e:'🧃', n:'Suco', p:3.50}, 
    {e:'🥤', n:'Refrigerante', p:5.50}, {e:'💧', n:'Água', p:2.00}
  ],
  "Limpeza e Higiene": [
    {e:'🧴', n:'Shampoo', p:8.90}, {e:'🧻', n:'Papel Higiênico', p:7.50}, {e:'🧼', n:'Sabonete', p:1.90},
    {e:'🪥', n:'Escova de Dentes', p:4.20}, {e:'🧹', n:'Vassoura', p:12.00}, {e:'🧼', n:'Detergente', p:2.30}
  ]
};

let ALL_PRODUCTS = [];
Object.values(MARKET_DB).forEach(list => ALL_PRODUCTS.push(...list));

const NAMES = ['João','Maria','Pedro','Ana','Lucas','Sofia','Gabriel','Isabela','Mateus','Júlia','Rafael','Beatriz'];
const CLIENT_EMOJIS = ['👨','👩','👴','👵','🧑','👱','👷'];

// ─────────────────────────────────────────────
// 2. SISTEMA DE MOEDAS E ECONOMIA LOCAL
// ─────────────────────────────────────────────
let SYS = {
  coins: parseInt(localStorage.getItem('tito_coins')) || 0,
  unlocked: JSON.parse(localStorage.getItem('tito_unlocked')) || ['Maçã','Banana','Leite','Pão','Sabonete','Feijão','Macarrão','Biscoito','Suco']
};

let G = {}; 

function saveSYS() {
  localStorage.setItem('tito_coins', SYS.coins);
  localStorage.setItem('tito_unlocked', JSON.stringify(SYS.unlocked));
  updateCoinDisplays();
}

function updateCoinDisplays() {
  const wCoins = document.getElementById('welcome-coins');
  const sCoins = document.getElementById('shop-coins');
  if(wCoins) wCoins.innerText = SYS.coins;
  if(sCoins) sCoins.innerText = SYS.coins;
}

// MENU SECRETO DO DESENVOLVEDOR
function devManageCoins() {
  let userInp = prompt("🐱 MENU SECRETO DO TITO 🐱\nDigite a nova quantidade de moedas desejada (ou digite 0 para zerar tudo):");
  if (userInp !== null) {
    let parsed = parseInt(userInp);
    if (!isNaN(parsed) && parsed >= 0) {
      SYS.coins = parsed;
      saveSYS();
      alert(`Sucesso! Seu saldo de moedas foi alterado para: ${parsed} ⭐`);
    } else {
      alert("Por favor, insira um número válido maior ou igual a zero!");
    }
  }
}

function rand(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function fmt(n) { return 'R$ ' + n.toFixed(2).replace('.',','); }
function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function shuffle(a) { return [...a].sort(()=>Math.random()-.5); }

window.onload = function() {
  saveSYS(); 
};

// ─────────────────────────────────────────────
// 3. ENGENHARIA DO JOGO (Alternância Garantida de Pagamento)
// ─────────────────────────────────────────────
function generateGame() {
  const name = rand(NAMES);
  const clientEmoji = rand(CLIENT_EMOJIS);
  
  let available = ALL_PRODUCTS.filter(p => SYS.unlocked.includes(p.n));
  if(available.length < 2) available = ALL_PRODUCTS; 

  const count = 2 + Math.floor(Math.random()*2); 
  const items = shuffle(available).slice(0, count);
  const realTotal = items.reduce((acc, it) => acc + it.p, 0);
  
  // FIXAÇÃO DE VARIABILIDADE: Lê o último método usado no navegador e força o oposto para testar tudo.
  let lastPay = localStorage.getItem('tito_last_pay') || 'card';
  const payMethod = lastPay === 'card' ? 'money' : 'card';
  localStorage.setItem('tito_last_pay', payMethod); // Grava a escolha atual para a próxima rodada ser diferente.

  let cashGiven = 0;
  if(payMethod === 'money') {
    const notes = [5, 10, 20, 50, 100];
    cashGiven = notes.find(n => n >= realTotal) || (Math.ceil(realTotal/10)*10);
  }

  return {
    clientName: name, 
    clientEmoji: clientEmoji, 
    items: items,
    phase: 'wait_name_q', 
    productIdx: 0, 
    cartItems: [],
    mathErrors: 0, 
    realTotal: realTotal, 
    payMethod: payMethod, 
    cashGiven: cashGiven,
    askedName: false, 
    askedProducts: false
  };
}

function startGame() {
  G = generateGame();
  buildPriceTable();
  buildCartSelect(); 
  renderCart();
  
  document.getElementById('input-row').style.display = 'flex';
  document.getElementById('math-panel').style.display = 'none';
  document.getElementById('cart-add-area').style.display = 'flex';
  document.getElementById('btn-fechar').style.display = 'block';

  document.getElementById('client-emoji').textContent = G.clientEmoji;
  document.getElementById('client-name-display').textContent = 'Cliente';
  document.getElementById('client-pill').style.display = 'flex';
  document.getElementById('chat-window').innerHTML = '';

  showScreen('s-game');
  enableInput();
  
  setTimeout(async () => {
    await clientSay('Olá! Boa tarde! 😊', 800);
  }, 200);
}

function buildPriceTable() {
  const container = document.getElementById('price-cats-container');
  if(!container) return;
  let html = '';
  Object.keys(MARKET_DB).forEach(cat => {
    html += `<div class="price-category-card">`;
    html += `<div class="price-category-title">${cat}</div>`;
    MARKET_DB[cat].forEach(it => {
      html += `
        <div class="price-item-row">
          <span>${it.e} ${it.n}</span>
          <span style="color:var(--coral); font-family:'Fredoka One';">${fmt(it.p)}</span>
        </div>
      `;
    });
    html += `</div>`;
  });
  container.innerHTML = html;
}

function buildCartSelect() {
  const sel = document.getElementById('cart-sel');
  if(!sel) return;
  sel.innerHTML = '<option value="">Produto...</option>';
  let available = ALL_PRODUCTS.filter(p => SYS.unlocked.includes(p.n));
  available.forEach(it => {
    sel.innerHTML += `<option value="${it.n}">${it.e} ${it.n}</option>`;
  });
}

// ─────────────────────────────────────────────
// 4. DIÁLOGOS DE ATENDIMENTO
// ─────────────────────────────────────────────
function addBubble(who, html) {
  const win = document.getElementById('chat-window');
  const row = document.createElement('div');
  row.className = 'brow ' + who;
  if (who === 'client') {
    row.innerHTML = `<span class="bav">${G.clientEmoji}</span><div class="bub client">${html}</div>`;
  } else {
    row.innerHTML = `<div class="bub kid">${html}</div><span class="bav">👧</span>`;
  }
  win.appendChild(row);
  win.scrollTop = win.scrollHeight;
}

async function clientSay(html, ms=900) {
  addBubble('client', html); 
  await sleep(ms);
}

function enableInput() { 
  const input = document.getElementById('chat-input');
  input.disabled = false; 
  document.getElementById('btn-send').disabled = false; 
  input.focus(); 
}

function disableInput() { 
  document.getElementById('chat-input').disabled = true; 
  document.getElementById('btn-send').disabled = true; 
}

async function sendAnswer() {
  const inp = document.getElementById('chat-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  addBubble('kid', esc(text));
  disableInput();
  await sleep(400);

  const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if (G.phase === 'wait_name_q') await handleNamePhase(lower);
  else if (G.phase === 'wait_product_q') await handleProductPhase(lower);
  else if (G.phase === 'wait_more_q') await handleMorePhase(lower);
}

async function handleNamePhase(lower) {
  const isNameQ = /nome|chama|quem|voce e|qual e/.test(lower);
  if (!isNameQ) {
    await clientSay('Olá! Você pode me atender perguntando meu nome por favor? 😊', 800);
    enableInput(); 
    return;
  }
  G.askedName = true;
  document.getElementById('client-name-display').textContent = G.clientName;
  await clientSay(`Eu me chamo <strong>${G.clientName}</strong>! Prazer! 😊`, 900);
  G.phase = 'wait_product_q';
  enableInput();
}

async function handleProductPhase(lower) {
  const isProdQ = /comprar|quer|produto|levar|precisa|o que|lista|pedido/.test(lower);
  if (!isProdQ) {
    await clientSay('Pode me perguntar o que eu vim comprar ou o que está na minha lista? 🛒', 800);
    enableInput(); 
    return;
  }
  G.askedProducts = true;
  const it = G.items[G.productIdx++];
  await clientSay(`Eu quero levar ${it.e} <strong>${it.n}</strong>!`, 1000);
  if (G.productIdx < G.items.length) { 
    G.phase = 'wait_more_q'; 
    enableInput(); 
  } else {
    await finishProductCollection();
  }
}

async function handleMorePhase(lower) {
  const isMoreQ = /mais|outro|outra|tem mais|acabou|tudo|algo/.test(lower);
  if (!isMoreQ) {
    await clientSay('Ainda tenho mais coisas na minha listinha! Pergunta se quero algo mais.', 800);
    enableInput(); 
    return;
  }
  if (G.productIdx < G.items.length) {
    const it = G.items[G.productIdx++];
    await clientSay(`Sim! Também preciso de ${it.e} <strong>${it.n}</strong>, por favor.`, 1000);
    if (G.productIdx < G.items.length) {
      enableInput();
    } else {
      await finishProductCollection();
    }
  } else {
    await finishProductCollection();
  }
}

async function finishProductCollection() {
  await clientSay('É só isso de produto por hoje! Pode fechar meu carrinho. 😄', 800);
  G.phase = 'cart_build';
  disableInput();
}

// ─────────────────────────────────────────────
// 5. OPERAÇÕES DO CARRINHO DE COMPRAS
// ─────────────────────────────────────────────
function addCartItem() {
  const sel = document.getElementById('cart-sel');
  const pInp = document.getElementById('cart-price');
  const name = sel.value;
  const price = parseFloat(pInp.value);

  if (!name || isNaN(price) || price <= 0) return;
  const prodReal = ALL_PRODUCTS.find(p => p.n === name);
  if (Math.abs(price - prodReal.p) > 0.01) { G.mathErrors++; }

  G.cartItems.push({ n: name, e: prodReal.e, price: price });
  sel.value = ''; pInp.value = '';
  renderCart();
}

function removeCartItem(name) {
  G.cartItems = G.cartItems.filter(i => i.n !== name);
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  document.getElementById('cart-badge').textContent = G.cartItems.length;

  if (!G.cartItems.length) {
    list.innerHTML = '<div class="cart-empty"><span>🛒</span>Nenhum produto ainda</div>';
    document.getElementById('cart-total').textContent = 'R$ 0,00';
    return;
  }
  list.innerHTML = G.cartItems.map(it => `
    <div class="cart-item-row">
      <span>${it.e} ${esc(it.n)}</span>
      <div>
        <span style="color:var(--coral); margin-right:8px;">${fmt(it.price)}</span>
        <button class="ci-del" onclick="removeCartItem('${it.n}')">✕</button>
      </div>
    </div>
  `).join('');
  const total = G.cartItems.reduce((s, i) => s + i.price, 0);
  document.getElementById('cart-total').textContent = fmt(total);
}

// ─────────────────────────────────────────────
// 6. VALIDAÇÕES E RELATÓRIO DE PAGAMENTOS
// ─────────────────────────────────────────────
function confirmCart() {
  if(G.cartItems.length === 0) { alert('Adicione os produtos no carrinho primeiro!'); return; }
  document.getElementById('input-row').style.display = 'none'; 
  document.getElementById('cart-add-area').style.display = 'none'; 
  document.getElementById('btn-fechar').style.display = 'none';

  G.phase = 'math_total';
  const panel = document.getElementById('math-panel');
  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="font-family:'Fredoka One'; font-size:16px; color:var(--purple); margin-bottom:6px;">🔢 Qual o valor TOTAL das compras?</div>
    <div style="display:flex; justify-content:center; gap:8px; margin: 10px 0;">
      <span style="font-weight:800; font-size:20px; align-self:center;">R$</span>
      <input type="number" id="math-total-inp" step="0.01" style="font-size:18px; padding:6px; width:120px; border-radius:12px; text-align:center; border:2px solid var(--dark);">
    </div>
    <button class="btn-cart-add" style="padding:8px 18px;" onclick="checkTotal()">Confirmar Valor</button>
  `;
}

async function checkTotal() {
  const inp = document.getElementById('math-total-inp');
  const userTot = parseFloat(inp.value);
  if(isNaN(userTot)) { alert('Por favor, digite um número!'); return; }

  if(Math.abs(userTot - G.realTotal) > 0.01) {
    G.mathErrors++;
    alert(`Opa, a soma correta era ${fmt(G.realTotal)}, mas o caixa registrou o seu valor. Vamos receber o pagamento!`);
  } else {
    alert("Parabéns! Você calculou a soma perfeitamente! 🌟");
  }

  G.phase = 'payment';
  if(G.payMethod === 'money') {
    await clientSay(`Certo! Vou pagar em dinheiro físico. Aqui está uma nota de ${fmt(G.cashGiven)}.`, 500);
    showMoneyChangeUI();
  } else {
    await clientSay(`Vou pagar usando meu cartão de crédito!`, 500);
    showCardUI();
  }
}

function showMoneyChangeUI() {
  const trocoReal = G.cashGiven - G.realTotal;
  const panel = document.getElementById('math-panel');
  panel.innerHTML = `
    <div style="font-family:'Fredoka One'; color:var(--dark); font-size:15px;">💵 O cliente te entregou uma nota de ${fmt(G.cashGiven)}</div>
    <p style="font-weight:700; margin-top:2px; font-size:14px; color:var(--mid);">Digite o troco correto a devolver:</p>
    <div style="display:flex; justify-content:center; gap:8px; margin: 10px 0;">
      <span style="font-weight:800; font-size:16px; align-self:center;">Troco R$</span>
      <input type="number" id="math-change-inp" step="0.01" style="font-size:18px; padding:6px; width:120px; border-radius:12px; text-align:center; border:2px solid var(--dark);">
    </div>
    <button class="btn-cart-add" style="padding:8px 18px; background:var(--coral); box-shadow:0 3px 0 var(--coral-dk);" onclick="checkChange(${trocoReal})">Entregar Troco</button>
  `;
}

function checkChange(trocoReal) {
  const inp = document.getElementById('math-change-inp');
  const userChange = parseFloat(inp.value);
  if(isNaN(userChange)) { alert('Por favor, digite o valor do troco!'); return; }

  if(Math.abs(userChange - trocoReal) > 0.01) {
    G.mathErrors++;
    alert(`O troco exato seria ${fmt(trocoReal)}, mas o cliente aceitou o valor dado. Vamos finalizar!`);
  } else {
    alert("Incrível! Troco perfeito devolvido! 💵🎉");
  }
  finishGame();
}

function showCardUI() {
  const panel = document.getElementById('math-panel');
  panel.innerHTML = `
    <div style="font-family:'Fredoka One'; margin-bottom:6px; font-size:15px;">💳 Maquininha de Cartão Ativa</div>
    <div style="background:#1e293b; padding:10px; border-radius:14px; width:170px; margin:5px auto; color:white; box-shadow:0 5px 0 #0f172a;">
      <div id="pos-screen" style="background:#86efac; color:#14532d; font-family:monospace; font-weight:bold; padding:6px; border-radius:6px; font-size:12px;">INSIRA O CARTÃO<br>${fmt(G.realTotal)}</div>
    </div>
    <div id="card-swp" onclick="swipeCard()" style="background:linear-gradient(135deg, #e11d48, #9f1239); color:white; font-weight:bold; width:160px; height:45px; border-radius:12px; margin:8px auto 0; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); font-size:13px;">💳 APROXIMAR CARTÃO</div>
  `;
}

function swipeCard() {
  const screen = document.getElementById('pos-screen');
  screen.innerHTML = 'PROCESSANDO...<br>⏳';
  setTimeout(() => {
    screen.innerHTML = 'PAGO COM SUCESSO<br>✅ BIP!';
    setTimeout(() => { finishGame(); }, 1000);
  }, 1200);
}

// ─────────────────────────────────────────────
// 7. COMPUTAÇÃO DA AVALIAÇÃO FINAL
// ─────────────────────────────────────────────
function finishGame() {
  let pts = 100;
  const listItems = [];

  if(!G.askedName) { pts -= 15; listItems.push({ icon:'👤', label:'Não perguntou o nome do cliente', ok:false }); }
  else { listItems.push({ icon:'👤', label:'Perguntou o nome com gentileza', ok:true }); }

  if(!G.askedProducts) { pts -= 15; listItems.push({ icon:'❓', label:'Não investigou os produtos da lista', ok:false }); }
  else { listItems.push({ icon:'❓', label:'Anotou o pedido conversando', ok:true }); }

  let carrinhoErrado = false;
  G.items.forEach(req => {
    const check = G.cartItems.find(c => c.n === req.n);
    if(!check) carrinhoErrado = true;
  });
  if(G.cartItems.length !== G.items.length) carrinhoErrado = true;

  if(carrinhoErrado) { pts -= 20; listItems.push({ icon:'🛒', label:'Carrinho com itens errados ou faltantes', ok:false }); }
  else { listItems.push({ icon:'🛒', label:'Produtos colocados perfeitamente', ok:true }); }

  if(G.mathErrors > 0) {
    pts -= (G.mathErrors * 10);
    listItems.push({ icon:'🔢', label: `Erros em tabela de preços ou troco: ${G.mathErrors}`, ok:false });
  } else {
    listItems.push({ icon:'🔢', label:'Matemática e consulta de preços perfeitos!', ok:true });
  }

  pts = Math.max(0, pts);
  let stars = Math.round(pts / 20); if(stars < 1) stars = 1;
  let moedasGanhas = Math.floor(pts / 10); 
  SYS.coins += moedasGanhas;
  saveSYS();

  document.getElementById('sc-grade').textContent = (pts/10).toFixed(1).replace('.',',');
  document.getElementById('earned-coins').innerText = `Ganhou: +${moedasGanhas} Moedas! ⭐`;
  document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('lit', i < stars));
  
  document.getElementById('sc-breakdown').innerHTML = listItems.map(b => `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
      <span>${b.icon}</span>
      <div style="flex:1; color:var(--dark);">${b.label}</div>
      <span style="color:${b.ok ? 'var(--mint-dk)' : 'var(--coral)'}; font-weight:bold;">${b.ok ? '✅' : '❌'}</span>
    </div>
  `).join('');

  showScreen('s-score');
  if(stars >= 4) launchConfetti();
}

function resetToMenu() {
  updateCoinDisplays();
  showScreen('s-welcome');
}

// ─────────────────────────────────────────────
// 8. GERENCIAMENTO DA LOJINHA
// ─────────────────────────────────────────────
function openShop() {
  const grid = document.getElementById('shop-grid');
  if(!grid) return;
  grid.innerHTML = '';
  ALL_PRODUCTS.forEach(it => {
    const isUnlocked = SYS.unlocked.includes(it.n);
    grid.innerHTML += `
      <div class="shop-item-card" style="opacity:${isUnlocked ? '0.65' : '1'};">
        <div style="font-size:32px; margin-bottom:4px;">${it.e}</div>
        <div style="font-weight:800; font-size:13px; color:var(--dark); margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%;">${it.n}</div>
        ${isUnlocked 
          ? `<button disabled style="width:100%; padding:6px; border-radius:8px; border:none; background:#ccc; color:#555; font-weight:bold; font-size:12px;">🔓 Ativo</button>` 
          : `<button onclick="buyItem('${it.n}')" style="width:100%; padding:6px; border-radius:8px; border:none; background:var(--mint); color:white; font-family:'Fredoka One'; cursor:pointer; font-size:12px; box-shadow: 0 3px 0 var(--mint-dk);">⭐ 20 M.</button>`
        }
      </div>
    `;
  });
  showScreen('s-shop');
}

function buyItem(name) {
  if(SYS.coins >= 20) {
    SYS.coins -= 20;
    SYS.unlocked.push(name);
    saveSYS();
    openShop(); 
  } else {
    alert("Você não tem moedas suficientes! Atenda mais clientes para conseguir moedas.");
  }
}

// ─────────────────────────────────────────────
// 9. NAVEGAÇÃO E VISUAIS
// ─────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function showTable() { showScreen('s-table'); }
function backToGame() { showScreen('s-game'); }

function launchConfetti() {
  const colors = ['#FF6F61','#FFD166','#3ECFB2','#7B5EA7','#4FACDE'];
  const wrap = document.getElementById('confetti-wrap');
  if(!wrap) return;
  wrap.innerHTML = '';
  for (let i=0; i<50; i++) {
    const p = document.createElement('div'); p.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    p.style.cssText = `position:absolute; left:${Math.random()*100}%; top:${-Math.random()*20}px; width:${size}px; height:${size}px; background:${rand(colors)}; border-radius:50%; animation:cFall 2.5s linear forwards; animation-delay:${Math.random()*1};`;
    wrap.appendChild(p);
  }
}