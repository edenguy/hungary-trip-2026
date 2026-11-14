(() => {
const T = window.TRIP;
const KEY = 'hu-trip-v1';
const BUILD = '20261114161939';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&hl=en&query=' + encodeURIComponent(q);
const HU_SITE = /(kodmoncsarda\.hu|programturizmus\.hu|szallas\.hu)/;
const enUrl = u => HU_SITE.test(u) ? 'https://translate.google.com/translate?sl=hu&tl=en&u=' + encodeURIComponent(u) : u;
const waUrl = q => 'https://www.google.com/search?tbm=isch&hl=en&q=' + encodeURIComponent(q);

// ---------- state ----------
let S;
const blank = () => ({ status: {}, booking: {}, tasks: {}, customTasks: [], customRest: {}, notes: {}, expenses: [], packing: {}, flight: '', pick: {}, vote: {}, names: ['גיא','ענת'], tab: 'day', day: null, mapMode: '', walk: {} });
function load() { try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = blank(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } scheduleSync(); }
load();
S.expenses.forEach((e, i) => { e.id ||= 'e0' + String(i).padStart(3, '0'); });
if (S.names[0] === 'אני' && S.names[1] === 'בת הזוג') { S.names = ['גיא', 'ענת']; save(); }

// ---------- dates ----------
const D = s => new Date(s + 'T00:00:00');
const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
const dayDiff = (a, b) => Math.round((a - b) / 864e5);
function focusDay() {
  if (S.day) return T.days.find(d => d.id === S.day) || T.days[0];
  const t = today();
  const f = T.days.find(d => dayDiff(D(d.date), t) >= 0);
  return f || T.days[T.days.length - 1];
}
function whenLabel(d) {
  const diff = dayDiff(D(d.date), today());
  if (diff === 0) return 'היום';
  if (diff === 1) return 'מחר';
  if (diff > 1) return `בעוד ${diff} ימים`;
  if (diff === -1) return 'אתמול';
  return `לפני ${-diff} ימים`;
}
const fmt = s => { const d = D(s); return `${d.getDate()}.${d.getMonth() + 1}`; };

// ---------- booking status ----------
const ST = { need: ['🟥', 'צריך להזמין', 'need'], sent: ['🟧', 'בקשה נשלחה', 'sent'], booked: ['🟩', 'הוזמן', 'booked'], na: ['⬜', 'לא נדרש', 'na'] };
const NEXT = { need: 'sent', sent: 'booked', booked: 'na', na: 'need' };
const pickOf = s => (s in S.pick ? S.pick[s] : (T.defaultPicks || {})[s]) || '';
function stOf(x) { if (x.alias) { const l = T.lodging.find(y => y.id === x.alias) || {}; return S.status[x.alias] || l.status || 'need'; } return S.status[x.id] || x.status || 'need'; }
function allBookables() {
  const out = [];
  T.lodging.forEach(l => out.push({ ...l, day: l.id === 'hotel-eger' ? 'd1' : 'd4', label: l.name }));
  T.days.forEach(d => {
    d.items.filter(i => i.book && !i.alias).forEach(i => out.push({ ...i, day: d.id, label: i.bookLabel || i.title }));
    const all = [...d.restaurants, ...(S.customRest[d.id] || [])];
    all.filter(r => r.book && (!r.slot || pickOf(r.slot) === r.id)).forEach(r => out.push({ ...r, day: d.id, label: r.name }));
    (d.slots || []).forEach(s => { if (!pickOf(s.id) && all.some(r => r.slot === s.id && r.book && !vetoed(r))) out.push({ id: 'slot:' + s.id, synthetic: true, label: 'לבחור מסעדה: ' + s.label, day: d.id, status: 'need' }); });
  });
  return out;
}
const vetoed = x => Object.values(S.vote[x.id] || {}).includes('no');
const vetoBy = x => Object.entries(S.vote[x.id] || {}).filter(([, v]) => v === 'no').map(([k]) => S.names[k]).join(' ו');
const VET_IDS = /^(d1-dobo|d1-spa|d2-lake|d2-palace|d2-cave|d3-caves|d3-winery|d4-basilica|d4-advent|d4-vorosmarty)$/;
const vettable = i => VET_IDS.test(i.id);
const openBookings = () => allBookables().filter(b => stOf(b) === 'need' && !vetoed(b));
function vetBar(x) {
  const v = S.vote[x.id] || {};
  const who = k => `<span class="who"><small>${esc(S.names[k])}</small><button class="vt ${v[k] === 'up' ? 'up' : ''}" data-act="vote" data-id="${esc(x.id)}" data-who="${k}" data-v="up" aria-label="מעדיף">👍</button><button class="vt ${v[k] === 'no' ? 'no' : ''}" data-act="vote" data-id="${esc(x.id)}" data-who="${k}" data-v="no" aria-label="לא רוצה">🚫</button></span>`;
  return `<div class="vet">${who(0)}${who(1)}</div>`;
}
function linksHtml(x, name) {
  const nm = name || x.name || x.title || x.label || '';
  const L = [];
  if (x.site) L.push(`<a class="btn" target="_blank" rel="noopener" href="${esc(enUrl(x.site))}">🌐 אתר (EN)</a>`);
  if (x.info) L.push(`<a class="btn" target="_blank" rel="noopener" href="${esc(enUrl(x.info))}">ℹ️ מידע ואווירה (EN)</a>`);
  if (x.reserve) L.push(`<a class="btn pri" target="_blank" rel="noopener" href="${esc(x.reserve)}">🗓️ הזמנה</a>`);
  if (x.phone) L.push(`<a class="btn" href="tel:${esc(x.phone)}">📞 ${esc(x.phone)}</a>`);
  if (x.email) L.push(`<a class="btn" href="mailto:${esc(x.email)}?subject=Table%20reservation&body=${encodeURIComponent(bookMsg(x))}">✉️ ${esc(x.email)}</a>`);
  if (!x.site && !x.reserve) L.push(`<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/search?hl=en&q=${encodeURIComponent(nm + ' reservation')}">🔎 חיפוש אתר והזמנה</a>`);
  return `<div class="actions links">${L.join('')}</div>${x.bk ? `<div class="tiny muted">📌 ${esc(x.bk)}</div>` : ''}`;
}
const dishBadge = r => r && r.dish && r.dish.includes('pacal') ? `<span class="glow" title="${esc(r.dishNote || '')}">🍲 יש פקל · pacalpörkölt</span>` : '';
const rtimeHtml = x => x.rtime ? `<div class="rtime">🗓️ <b>להזמין ל:</b> ${esc(x.rdate || '')} · <bdi dir="ltr">${esc(x.rtime)}</bdi>${x.party ? ' · ' + x.party + ' סועדים' : ''}</div>` : '';
const bookMsg = x => T.emailTemplate.replace('{PARTY}', x.party || 2).replace('{DATE}', x.rdateEn || '[date]').replace('{TIME}', (x.rtime || '').replace(/ .*/, '') || '[time]');
const openTasks = () => [...T.tasks, ...S.customTasks].filter(t => !S.tasks[t.id]);

function statusBtn(x) {
  if (x.synthetic) return `<button class="st st-need" data-act="gotoday" data-id="${x.day}">🟥 בחרו ›</button>`;
  const s = stOf(x), [ic, label] = ST[s];
  return `<button class="st st-${s}" data-act="cycle" data-id="${esc(x.id)}" title="לחצו לשינוי">${ic} ${label}</button>`;
}
function bookingForm(x) {
  const b = S.booking[x.id] || {};
  const f = (k, p, type = 'text') => `<input data-act="bk" data-id="${esc(x.id)}" data-k="${k}" type="${type}" placeholder="${p}" value="${esc(b[k] || '')}">`;
  let cx = '';
  if (b.cancel && !b.nocancel) { const n = dayDiff(D(b.cancel), today()); cx = `<div class="cxn ${n <= 3 ? 'red' : ''}">⏰ ביטול חינם עד ${fmt(b.cancel)} (${n > 0 ? 'בעוד ' + n + ' ימים' : n === 0 ? 'היום!' : 'עבר'})</div>`; }
  else if (b.nocancel) cx = '<div class="cxn green">✔ אין צורך לבטל</div>';
  return `<div class="bk">${f('when', 'תאריך ושעה')}${f('conf', 'מספר אישור')}${f('phone', 'טלפון', 'tel')}${f('note', 'הערה')}</div>
  <div class="bk cxrow"><label class="cx"><small>ביטול חינם עד</small>${f('cancel', '', 'date')}</label><label class="cx chk"><input type="checkbox" data-act="bk" data-id="${esc(x.id)}" data-k="nocancel" ${b.nocancel ? 'checked' : ''}> אין צורך לבטל</label></div>${cx}<div class="tiny muted">מדיניות ביטול לא נמצאה אונליין — לשאול בעת ההזמנה ולרשום כאן.</div>`;
}

// ---------- render ----------
function render() {
  const d = focusDay();
  const open = openBookings().length, ot = openTasks().length;
  $('#top').innerHTML = `<span class="brand">${esc(T.title)}</span>` + countdown();
  const tabs = [['day', 'calendar-days', 'יום'], ['map', 'map', 'מפה'], ['food', 'utensils', 'אוכל'], ['todo', 'list-checks', `משימות${open + ot ? ' ' + (open + ot) : ''}`], ['more', 'ellipsis', 'עוד']];
  $('#nav').innerHTML = tabs.map(([k, i, l]) => `<button class="${S.tab === k ? 'on' : ''}" data-act="tab" data-k="${k}"><svg class="i"><use href="#i-${i}"/></svg>${l}</button>`).join('');
  const v = { day: viewDay, map: viewMap, food: viewFood, todo: viewTodo, more: viewMore }[S.tab];
  $('#app').innerHTML = v(d);
  if (S.tab === 'day') { wireGallery(); loadHero(); }
  if (S.tab === 'map') { initMap(d); markSaved(d); } else destroyMap();
}
function countdown() {
  const t = today(), s = D(T.start), e = D(T.end);
  let msg;
  if (t < s) msg = `⏳ עוד ${dayDiff(s, t)} ימים לנסיעה`;
  else if (t <= e) msg = `🎒 יום ${dayDiff(t, s) + 1} מתוך ${T.days.length}`;
  else msg = '🏡 הטיול הסתיים — מקווים שנהניתם!';
  const open = openBookings().length, wait = allBookables().filter(b => stOf(b) === 'sent' && !vetoed(b)).length;
  const sp = SY.url ? `<span class="pill">${SY.err ? '⚠️ לא מסונכרן' : '🔄 מסונכרן'}</span>` : '';
  return `<div class="pills"><span class="pill">${msg}</span>${sp}${open ? `<span class="pill red">🟥 ${open} הזמנות פתוחות</span>` : (wait ? '' : '<span class="pill green">🟩 הכל הוזמן</span>')}${wait ? `<span class="pill amber">🟧 ${wait} ממתינות לאישור</span>` : ''}</div>`;
}

// ----- day view -----
function dayChips(d) {
  return `<div class="chips">` + T.days.map(x => `<button class="chip ${x.id === d.id ? 'on' : ''}" data-act="day" data-id="${x.id}"><b>${x.dow}</b><small>${fmt(x.date)}</small></button>`).join('') + `</div>`;
}
function nowNext(d) {
  if (dayDiff(D(d.date), today()) !== 0) return null;
  const n = new Date(), m = n.getHours() * 60 + n.getMinutes();
  return d.items.find(i => { const [h, mm] = i.t.split(':').map(Number); return h * 60 + mm >= m - 20; })?.id || null;
}
const restOf = d => [...d.restaurants, ...(S.customRest[d.id] || [])].sort((a, b) => vetoed(a) - vetoed(b));
const restWarn = rest => rest.every(vetoed) ? '<p class="warn">⚠️ כל האפשרויות נפסלו — הוסיפו חלופה בלשונית "אוכל".</p>' : '';
function restSection(d) {
  const all = [...d.restaurants, ...(S.customRest[d.id] || [])];
  let h = '';
  (d.slots || []).forEach(s => {
    const opts = all.filter(r => r.slot === s.id).sort((x, y) => vetoed(x) - vetoed(y)), p = pickOf(s.id), live = opts.filter(r => !vetoed(r));
    h += `<h4>${esc(s.label)} <small class="muted">${p ? '✅ נבחרה אפשרות' : 'בחרו אחת מ-' + opts.length}</small></h4>`;
    if (!live.length) h += '<p class="warn">⚠️ כל האפשרויות נפסלו — הוסיפו חלופה בלשונית "אוכל".</p>';
    else if (live.length === 1 && !p) h += '<p class="tiny muted">נשארה אפשרות אחת — אפשר לבחור בה.</p>';
    h += opts.map(restHtml).join('');
  });
  const extra = all.filter(r => !r.slot);
  if (extra.length) h += '<h4>עוד</h4>' + extra.map(restHtml).join('');
  return h;
}

// ---------- "where we eat": chosen restaurant per meal, status, navigation ----------
const slotOfItem = i => { const d = T.days.find(x => x.items.includes(i)); const s = d && (d.slots || []).find(s => s.id === (i.slot || i.id)); return s ? { d, s } : null; };
const mealOpts = (d, s) => [...d.restaurants, ...(S.customRest[d.id] || [])].filter(r => r.slot === s.id);
const navUrl = r => 'https://www.google.com/maps/dir/?api=1&hl=en&destination=' + encodeURIComponent(r.addr ? r.name + ', ' + r.addr : (r.maps || r.name));
function mealCard(d, s) {
  const opts = mealOpts(d, s), r = opts.find(x => x.id === pickOf(s.id));
  if (!r) return `<div class="meal none"><div class="muted tiny">${esc(s.label)}</div><b>עוד לא בחרתם מסעדה</b> <span class="muted">· ${opts.length} אפשרויות למטה</span></div>`;
  const others = opts.filter(x => x !== r && ['sent', 'booked'].includes(stOf(x)) && !vetoed(x));
  return `<div class="meal"><div class="muted tiny">${esc(s.label)}</div>
    <div class="rh"><div><b>${esc(r.name)}</b>${dishBadge(r)}</div>${r.book ? statusBtn(r) : ''}</div>
    ${r.rtime ? `<div class="tiny">🗓️ ${esc(r.rdate || '')} · <bdi dir="ltr">${esc(r.rtime)}</bdi>${r.party ? ' · ' + r.party + ' סועדים' : ''}</div>` : ''}
    <div class="tiny muted">📍 ${r.addr ? esc(r.addr) : 'הניווט לפי שם המסעדה — ודאו במפה שזה המקום הנכון'}</div>
    ${r.sentNote ? `<div class="tiny muted">✉️ ${esc(r.sentNote)}</div>` : ''}
    <div class="actions"><a class="btn pri" target="_blank" rel="noopener" href="${navUrl(r)}">🧭 נווט ל-${esc(r.name.split(/[(—·]/)[0].trim())}</a>${r.phone ? `<a class="btn" href="tel:${esc(r.phone)}">📞 חייג</a>` : ''}<a class="btn" target="_blank" rel="noopener" href="${mapsUrl(r.maps || r.name)}">🗺️ מפה</a></div>
    ${others.length ? `<div class="warn">⚠️<span>שימו לב: סימנתם "${others.map(x => ST[stOf(x)][1]).join('/')}" גם ב-${others.map(x => esc(x.name)).join(', ')}, אבל נבחרה ${esc(r.name)}. ודאו לאן הולכים.</span></div>` : ''}</div>`;
}
const mealsHtml = d => (d.slots || []).length ? (d.slots || []).map(s => mealCard(d, s)).join('') : '';

function viewDay(d) {
  const next = nowNext(d);
  const opens = allBookables().filter(b => b.day === d.id && stOf(b) === 'need' && !vetoed(b)).length, waits = allBookables().filter(b => b.day === d.id && stOf(b) === 'sent' && !vetoed(b)).length;
  let html = dayChips(d);
  const idx = T.days.findIndex(x => x.id === d.id) + 1;
  html += `<section class="hero" data-day="${d.id}" data-hero="${esc(d.hero || '')}"><div class="hero-inner"><div class="eyebrow">יום ${idx} מתוך ${T.days.length} · ${d.dow} ${fmt(d.date)} · ${whenLabel(d)}</div><h1 class="hero-title">${esc(d.title)}</h1>
    <div class="hero-pills"><span class="gp">🌇 שקיעה ${d.sunset}</span><span class="gp" id="wx-${d.id}">⛅ …</span>${opens ? `<button class="gp need" data-act="tab" data-k="todo">🟥 ${opens} לסגור — מה?</button>` : '<span class="gp done">🟩 הכל סגור</span>'}${waits ? `<span class="gp wait">🟧 ${waits} ממתינות לאישור</span>` : ''}</div></div></section>
    <p class="lead">${esc(d.summary)}</p>
    ${d.note ? `<div class="warn">💡<span>${esc(d.note)}</span></div>` : ''}
    ${ownGal(d)}
    <div class="actions"><button class="btn pri" data-act="tab" data-k="map">🗺️ מפה ומסלול היום</button></div>
    ${d.lore ? `<details class="lore-d"><summary>📖 ${esc(d.lore.t)} — היסטוריה, פיקנטריה ועובדות</summary>${loreHtml(d)}</details>` : ''}`;
  if (d.flight) html += flightBox();
  if ((d.slots || []).length) html += `<h3>🍽️ לאן אוכלים היום</h3>` + mealsHtml(d);
  html += `<h3>לוח זמנים</h3><div class="tl">` + d.items.map(i => itemHtml(i, next)).join('') + `</div>`;
  if (d.restaurants.length || (S.customRest[d.id] || []).length) html += `<h3>🍽️ אוכל היום — שתי אפשרויות לכל ארוחה</h3>` + restSection(d);
  html += `<h3>📝 הערות ליום</h3><textarea data-act="note" data-id="${d.id}" placeholder="מה קרה, מה לזכור, מה לשנות…">${esc(S.notes[d.id] || '')}</textarea>`;
  html += `<p class="muted tiny">זמני נסיעה ופעילות משוערים. שעות פתיחה וזמינות יש לאמת סמוך לנסיעה.</p>`;
  fetchWeather(d);
  return html;
}
function flightBox() {
  const v = S.flight || T.flightTime || '';
  let calc = '';
  if (v) {
    const [h, m] = v.split(':').map(Number), base = h * 60 + m;
    const f = x => { x = ((x % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0'); };
    calc = `<ul class="calc"><li>🛫 המראה: <b>${v}</b></li><li>🚪 להיות בטרמינל: <b>${f(base - 180)}</b></li><li>🚗 להחזיר רכב עד: <b>${f(base - 210)}</b></li><li>⛽ תדלוק: <b>${f(base - 240)}</b></li><li>🏨 לצאת מבודפשט: <b>${f(base - 285)}</b></li></ul>`;
  }
  return `<section class="card"><b>שעת הטיסה חזרה (LY2366)</b><div class="row"><input type="time" data-act="flight" value="${esc(v)}"></div>${calc}</section>`;
}
const NOPIC = /^(d\d-(land|car|arrive|back|fuel|return|out|bf|drive|eve|lunch|dinner|free|fly|checkin-air))$/;
const galOk = i => !NOPIC.test(i.id) && (i.wiki?.length || i.maps);
const deepHtml = dp => dp && dp.length ? `<details class="deep"><summary>📖 העמק — הסיפור המלא</summary>${dp.map(s => `<h5>${esc(s.t)}</h5>` + s.p.map(p => `<p>${esc(p)}</p>`).join('')).join('')}<p class="tiny muted">מבוסס על חיפוש במקורות פתוחים (Wikipedia, אתרי תיירות ומוזיאונים). איפה שהמקורות חלוקים — כתוב.</p></details>` : '';
const loreHtml = (x, withTitle) => {
  const L = x.lore; if (!L) return '';
  const ul = a => a && a.length ? `<ul class="ll">${a.map(s => `<li>${esc(s)}</li>`).join('')}</ul>` : '';
  const sec = (ic, t, body) => body ? `<div class="ls"><b>${ic} ${t}</b>${body}</div>` : '';
  return `<div class="lore">${withTitle && L.t ? `<h4>${esc(L.t)}</h4>` : ''}${sec('📜', 'היסטוריה', L.h ? `<p>${esc(L.h)}</p>` : '')}${sec('🌶️', 'פיקנטריה', L.f ? `<p>${esc(L.f)}</p>` : '')}${sec('⚡', 'עובדות מהירות', ul(L.q))}${sec('⚠️', 'כדאי לדעת', ul(L.k))}${sec('🍴', 'מה להזמין', ul(L.o))}${deepHtml(L.dp)}</div>`;
};
function itemHtml(i, next) {
  const hasMore = i.desc || i.wiki?.length || i.maps || i.book;
  return `<details class="item ${next === i.id ? 'next' : ''} ${i.book ? 'b-' + stOf(i) : ''} ${vetoed(i) ? 'vetoed' : ''}" data-wiki="${esc((i.wiki || []).join('|'))}" data-q="${esc(i.maps || '')}" data-id="${i.id}" ${next === i.id ? 'open' : ''}>
    <summary><span class="ic">${i.icon}</span><span class="tt"><small><bdi dir="ltr">${esc(i.time)}</bdi>${next === i.id ? ' · <b class="nowtag">הבא</b>' : ''}</small>${esc(i.title)}${(() => { const m = slotOfItem(i); if (!m) return ''; const r = mealOpts(m.d, m.s).find(x => x.id === pickOf(m.s.id)); return r ? `<span class="msub">${r.book ? ({ need: '🟥', sent: '🟧', booked: '🟩', na: '⬜' }[stOf(r)]) : ''} ${esc(r.name.split(/[(—·]/)[0].trim())}${dishBadge(r) ? ' <span class="glow sm">🍲 פקל</span>' : ''}</span>` : '<span class="msub">בחרו מסעדה</span>'; })()}</span>${vetoed(i) ? '<span class="dot">🚫</span>' : i.book ? (['need', 'sent'].includes(stOf(i)) ? `<span class="st st-${stOf(i)} sm">${ST[stOf(i)][0]} ${ST[stOf(i)][1]}</span>` : `<span class="dot">${ST[stOf(i)][0]}</span>`) : ''}</summary>
    <div class="det">
      ${i.desc ? `<p>${esc(i.desc)}</p>` : ''}
      ${(() => { const m = slotOfItem(i); return m ? mealCard(m.d, m.s) : ''; })()}
      ${i.sentNote ? `<div class="hrs hrs-ok">🎟️<span>${esc(i.sentNote)}</span></div>` : ''}
      ${loreHtml(i)}
      ${i.hours ? `<div class="hrs hrs-${i.hl || 'unk'}">🕒 <b>${{ ok: 'שעות — אומת', warn: 'שעות — לאמת', unk: 'שעות — לא נמצא' }[i.hl || 'unk']}:</b> ${esc(i.hours)}</div>` : ''}
      ${galOk(i) ? `<div class="gal" data-gal></div><div class="tiny muted">תמונות מ-Wikipedia/Wikimedia לפי חיפוש — להמחשה בלבד · <a target="_blank" rel="noopener" href="${waUrl((i.maps || i.title) + ' Hungary')}">🔎 עוד בגוגל</a></div>` : ''}
      ${i.book ? rtimeHtml(i) + linksHtml(i, i.bookLabel || i.title) : ''}
      <div class="actions">${i.maps ? `<a class="btn" target="_blank" rel="noopener" href="${mapsUrl(i.maps)}">🗺️ מפה</a><a class="btn" target="_blank" rel="noopener" href="${'https://www.google.com/maps/dir/?api=1&hl=en&destination=' + encodeURIComponent(i.maps)}">🧭 נווט</a>` : ''}${i.book ? statusBtn(i) : ''}</div>
      ${vettable(i) ? vetBar(i) : ''}${vetoed(i) ? `<p class="warn">🚫 נפסל ע״י ${esc(vetoBy(i))} — אפשר לדלג או להחליף במשהו אחר.</p>` : ''}
      ${i.book && !vetoed(i) ? bookingForm(i) : ''}
    </div></details>`;
}
function restHtml(r) {
  const picked = r.slot && pickOf(r.slot) === r.id, dim = r.slot && pickOf(r.slot) && !picked;
  return `<div class="card rest b-${stOf(r)} ${vetoed(r) ? 'vetoed' : ''} ${picked ? 'picked' : ''} ${dim ? 'dim' : ''}"><div class="rh"><div><b>${esc(r.name)}</b><div class="muted">${esc(r.kind || '')}</div>${dishBadge(r)}</div>${vetoed(r) ? '<span class="st st-na">🚫 נפסל</span>' : r.book ? statusBtn(r) : ''}</div>
    ${r.desc ? `<p>${esc(r.desc)}</p>` : ''}
    ${r.sentNote ? `<div class="hrs hrs-warn">✉️<span>${esc(r.sentNote)}</span></div>` : ''}
    ${loreHtml(r)}
    ${r.hours ? `<div class="hrs hrs-${r.hl || 'unk'}">🕒 <b>${{ ok: 'שעות — אומת', warn: 'שעות — לאמת', unk: 'שעות — לא נמצא' }[r.hl || 'unk']}:</b> ${esc(r.hours)}</div>` : ''}
    <div class="gal" data-rgal="${esc(r.id)}" hidden></div>
    ${r.book ? rtimeHtml(r) : ''}
    ${r.book ? linksHtml(r) : (r.info || r.phone || r.site ? linksHtml(r) : '')}
    <div class="actions">${r.slot && !vetoed(r) ? `<button class="btn ${picked ? 'pri' : ''}" data-act="pick" data-slot="${esc(r.slot)}" data-id="${esc(r.id)}">${picked ? '✅ נבחרה' : 'בחרו במסעדה הזו'}</button>` : ''}<a class="btn" target="_blank" rel="noopener" href="${mapsUrl(r.maps || r.name)}">🗺️ מפה</a><button class="btn" data-act="rphotos" data-id="${esc(r.id)}" data-q="${esc(r.name + ' ' + (r.maps || ''))}">📷 תמונות</button><a class="btn" target="_blank" rel="noopener" href="${waUrl(r.name + ' Hungary')}">🔎 גוגל</a>${r.book ? `<button class="btn" data-act="copymail" data-id="${esc(r.id)}">✉️ הודעת הזמנה</button>` : ''}${r.custom ? `<button class="btn del" data-act="delrest" data-id="${esc(r.id)}">מחק</button>` : ''}</div>
    ${vetBar(r)}${vetoed(r) ? `<div class="tiny">🚫 נפסל ע״י ${esc(vetoBy(r))} — בחרו אחת מהחלופות.</div>` : ''}${r.book && !vetoed(r) ? bookingForm(r) : ''}${r.suggested ? '<div class="tiny muted">הצעה של Claude — לאמת שעות פתיחה בנובמבר</div>' : ''}</div>`;
}

// ----- food view -----
function viewFood() {
  const pac = T.days.flatMap(d => d.restaurants.filter(r => r.dish && r.dish.includes('pacal')).map(r => ({ d, r }))), other = T.days.flatMap(d => d.restaurants.filter(r => r.slot && !(r.dish && r.dish.includes('pacal')) && pickOf(r.slot) === r.id).map(r => ({ d, r })));
  let h = `<h2>🍲 פקל וחלקי פנים — איפה?</h2><div class="card">${pac.map(({ d, r }) => `<div class="rh"><div><b>${esc(r.name)}</b> ${dishBadge(r)}<div class="tiny muted">${d.dow} ${fmt(d.date)} · ${esc(r.rtime || '')}${r.addr ? ' · ' + esc(r.addr) : ''}</div><div class="tiny">${esc(r.dishNote || '')}</div></div>${r.book ? statusBtn(r) : ''}</div><div class="actions"><a class="btn pri" target="_blank" rel="noopener" href="${navUrl(r)}">🧭 נווט</a></div>`).join('')}
    <p class="tiny muted"><b>חלקי פנים (belsőség):</b> במסעדות שלכם לא מצאתי אף מקום שמאשר אותם בתפריט, ולכן לא סימנתי. לשאול בעת ההזמנה, או במקום: <b>Van pacalpörkölt?</b> (יש פקל?) · <b>Van máj / velő / vese?</b> (יש כבד / מח עצם / כליות?).</p>
    <p class="tiny muted">נבחרו אצלכם ולא אומת שיש בהם: ${other.map(({ r }) => esc(r.name.split(/[(—·]/)[0].trim())).join(' · ')}.</p></div>
    <h2 style="margin-top:2rem">🔥 מנות מופרעות — איפה מזמינים</h2><p class="tiny muted">צהוב בוהק = יש אסמכתא שהמנה מוגשת שם (תפריטים משתנים — לאמת). בלי צבע = לא נמצא, ולכן מופיע המשפט לשאול בהונגרית.</p>` + wildHtml() + `
    <h2 style="margin-top:2rem">🍽️ לאן אוכלים</h2>` + T.days.filter(d => (d.slots || []).length).map(d => `<h3>${d.dow} ${fmt(d.date)}</h3>` + mealsHtml(d)).join('') + `<h2 style="margin-top:2rem">כל האפשרויות</h2><div class="legend"><span>🟥 צריך להזמין</span><span>🟩 הוזמן</span><span>⬜ לא נדרש</span></div>`;
  T.days.forEach(d => {
    const rest = restOf(d);
    h += `<h3>${d.emoji} ${d.dow} ${fmt(d.date)} — ${esc(d.title)}</h3>` + (rest.length ? restSection(d) : '<p class="muted">אין מסעדות.</p>') +
      `<details class="add"><summary>➕ הוספת מסעדה ל${d.dow}</summary><form data-act="addrest" data-day="${d.id}"><input name="name" placeholder="שם המסעדה" required><input name="kind" placeholder="סוג / מה היא"><input name="desc" placeholder="הערה"><label><input type="checkbox" name="book" checked> דורשת הזמנה</label><button class="btn pri">הוסף</button></form></details>`;
  });
  return h;
}

// ----- todo view -----
function viewTodo() {
  const b = openBookings();
  let h = `<h2>✅ הזמנות ומשימות</h2>` + summaryHtml();
  h += `<h3>🟥 הזמנות שעוד לא נסגרו (${b.length})</h3>` + (b.length ? b.map(x => `<div class="card slim b-need"><div class="rh"><div><b>${esc(x.label)}</b><div class="muted">${(T.days.find(d => d.id === x.day) || {}).dow || ''}${x.rtime ? ' · ' + esc(x.rtime) : ''}</div></div>${statusBtn(x)}</div></div>`).join('') : '<p class="muted">הכל הוזמן 🎉</p>');
  const wt = allBookables().filter(x => stOf(x) === 'sent' && !vetoed(x));
  if (wt.length) h += `<h3>🟧 ממתינות לאישור (${wt.length})</h3>` + wt.map(x => `<div class="card slim"><div class="rh"><div><b>${esc(x.label)}</b><div class="muted">${(T.days.find(d => d.id === x.day) || {}).dow || ''}${x.rtime ? ' · ' + esc(x.rtime) : ''}</div></div>${statusBtn(x)}</div>${x.sentNote ? `<div class="tiny muted">${esc(x.sentNote)}</div>` : ''}</div>`).join('');
  const bkd = allBookables().filter(x => stOf(x) === 'booked' && !x.synthetic);
  const cx = bkd.filter(x => (S.booking[x.id] || {}).cancel && !(S.booking[x.id] || {}).nocancel).sort((p, q) => S.booking[p.id].cancel.localeCompare(S.booking[q.id].cancel));
  const nocx = bkd.filter(x => !(S.booking[x.id] || {}).cancel && !(S.booking[x.id] || {}).nocancel);
  h += `<h3>⏰ ביטולים</h3>` + (cx.map(x => { const n = dayDiff(D(S.booking[x.id].cancel), today()); return `<div class="card slim"><b>${esc(x.label)}</b><div class="cxn ${n <= 3 ? 'red' : ''}">ביטול חינם עד ${fmt(S.booking[x.id].cancel)} · ${n > 0 ? 'בעוד ' + n + ' ימים' : n === 0 ? 'היום!' : 'עבר'}</div></div>`; }).join('') || '') + (nocx.length ? `<p class="tiny muted">הוזמן, אבל חסרה מדיניות ביטול: ${nocx.map(x => esc(x.label)).join(' · ')}</p>` : (cx.length ? '' : '<p class="muted tiny">אחרי שתסמנו 🟩 הוזמן — רשמו בכרטיס "ביטול חינם עד" או "אין צורך לבטל".</p>'));
  const pend = [];
  T.days.forEach(d => { d.items.filter(vettable).forEach(i => pend.push(i)); restOf(d).forEach(r => pend.push(r)); });
  const un = pend.filter(x => { const v = S.vote[x.id] || {}; return !v[0] || !v[1]; });
  h += `<h3>🗳️ ממתינים להצבעה (${un.length})</h3><p class="tiny muted">👍 מעדיף · 🚫 לא רוצה. מקום שמישהו פסל יוצא מהרשימה ולא נספר כהזמנה פתוחה.</p>` + (un.slice(0, 12).map(x => `<div class="card slim"><b>${esc(x.title || x.name)}</b>${vetBar(x)}</div>`).join('') || '<p class="muted">כולם הצביעו 🎉</p>') + (un.length > 12 ? `<p class="muted tiny">ועוד ${un.length - 12} — ביום/באוכל.</p>` : '');
  const vet = pend.filter(vetoed);
  if (vet.length) h += `<h3>🚫 נפסלו (${vet.length})</h3>` + vet.map(x => `<div class="card slim vetoed"><b>${esc(x.title || x.name)}</b><div class="tiny muted">נפסל ע״י ${esc(vetoBy(x))}</div>${vetBar(x)}</div>`).join('');
  const all = [...T.tasks, ...S.customTasks];
  h += `<h3>📋 לברר / לוודא (${openTasks().length} פתוחות)</h3><div class="card">` + all.map(t => `<label class="task ${S.tasks[t.id] ? 'done' : ''}"><input type="checkbox" data-act="task" data-id="${t.id}" ${S.tasks[t.id] ? 'checked' : ''}><span>${esc(t.text)}${t.pdf ? ' <small class="muted">· מהתוכנית</small>' : ''}</span>${t.custom ? `<button class="x" data-act="deltask" data-id="${t.id}">✕</button>` : ''}</label>`).join('') + `</div>
  <form data-act="addtask" class="row"><input name="text" placeholder="משימה חדשה…" required><button class="btn pri">הוסף</button></form>`;
  h += `<h3>🏨 לינה</h3>` + T.lodging.map(l => `<div class="card b-${stOf(l)}"><div class="rh"><div><b>${esc(l.name)}</b><div class="muted">${esc(l.dates)} · ${esc(l.note)}</div></div>${statusBtn(l)}</div>${linksHtml(l)}<div class="actions"><a class="btn" target="_blank" rel="noopener" href="${mapsUrl(l.maps)}">🗺️ מפה</a></div>${bookingForm(l)}</div>`).join('');
  return h;
}

// ----- more view -----
function viewMore() {
  const tot = S.expenses.reduce((a, e) => a + (+e.amt || 0), 0);
  let h = `<h2>🧳 עוד</h2>` + syncCard();
  h += `<h3>🎒 רשימת אריזה</h3><div class="card">` + T.packing.map((p, i) => `<label class="task ${S.packing[i] ? 'done' : ''}"><input type="checkbox" data-act="pack" data-id="${i}" ${S.packing[i] ? 'checked' : ''}><span>${esc(p)}</span></label>`).join('') + `</div>`;
  h += `<h3>💶 הוצאות <small class="muted">(סה״כ ${tot.toLocaleString('he-IL')})</small></h3><div class="card">` +
    (S.expenses.map((e, i) => `<div class="exp"><span>${esc(e.what)}</span><b>${(+e.amt).toLocaleString('he-IL')} ${esc(e.cur || '')}</b><button class="x" data-act="delexp" data-id="${i}">✕</button></div>`).join('') || '<p class="muted">עוד אין הוצאות.</p>') +
    `</div><form data-act="addexp" class="row"><input name="what" placeholder="על מה" required><input name="amt" type="number" step="any" placeholder="סכום" required style="max-width:7rem"><select name="cur"><option>₪</option><option>€</option><option>HUF</option></select><button class="btn pri">הוסף</button></form>`;
  h += `<h3>ℹ️ מידע שימושי</h3><div class="card"><ul class="info">${T.info.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  h += `<h3>📚 תרבות האוכל ההונגרית — העמקה</h3><div class="card">${deepHtml(T.foodDeep)}</div>`;
  h += `<h3>🍽️ מילון אוכל הונגרי</h3><div class="card phrases">` + (T.food || []).map(p => `<div style="grid-template-columns:1fr 2fr"><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div>`).join('') + `</div>`;
  h += `<h3>🗣️ ביטויים בהונגרית</h3><div class="card phrases">` + T.phrases.map(p => `<div><span>${p[0]}</span><b>${p[1]}</b><small>${p[2]}</small></div>`).join('') + `</div>`;
  h += `<h3>💾 גיבוי ושחזור</h3><div class="card"><p class="tiny muted">הנתונים נשמרים בדפדפן במכשיר הזה בלבד. כדאי לייצא גיבוי מדי פעם, או לפני החלפת מכשיר.</p><div class="actions"><button class="btn" data-act="export">⬇️ ייצוא</button><label class="btn">⬆️ ייבוא<input type="file" id="imp" accept="application/json" hidden></label><button class="btn" data-act="names">✏️ שמות</button><button class="btn del" data-act="reset">איפוס</button></div></div>`;
  return h;
}

// ---------- gallery via Wikipedia ----------
const wcache = {};
async function wikiImgs(title) {
  if (wcache[title]) return wcache[title];
  const ck = 'wk:' + title;
  try { const c = localStorage.getItem(ck); if (c) return (wcache[title] = JSON.parse(c)); } catch { }
  const out = [];
  try {
    const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/media-list/' + encodeURIComponent(title));
    if (r.ok) {
      const j = await r.json();
      for (const m of j.items || []) {
        if (m.type !== 'image') continue;
        const set = m.srcset?.[m.srcset.length - 1] || m.srcset?.[0];
        if (!set) continue;
        let u = set.src; if (u.startsWith('//')) u = 'https:' + u;
        if (/\.svg|icon|logo|flag|map/i.test(u)) continue;
        out.push({ u, c: m.caption?.text || '', page: 'https://en.wikipedia.org/wiki/' + title });
        if (out.length >= 6) break;
      }
    }
  } catch { }
  if (out.length) { wcache[title] = out; try { localStorage.setItem(ck, JSON.stringify(out)); } catch { } }
  return out;
}
async function commonsImgs(q) {
  const ck = 'cm:' + q;
  try { const c = localStorage.getItem(ck); if (c) return JSON.parse(c); } catch { }
  const out = [];
  try {
    const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|mime&iiurlwidth=420&format=json&origin=*&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap'));
    if (r.ok) {
      const j = await r.json();
      for (const p of Object.values(j.query?.pages || {})) { const ii = p.imageinfo?.[0]; if (ii?.thumburl) out.push({ u: ii.thumburl, c: (p.title || '').replace(/^File:/, ''), page: ii.descriptionurl }); if (out.length >= 6) break; }
    }
  } catch { }
  if (out.length) { try { localStorage.setItem(ck, JSON.stringify(out)); } catch { } }
  return out;
}
async function fillGal(g, titles, q, gq) {
  g.innerHTML = '<span class="muted tiny">טוען תמונות…</span>';
  let imgs = (await Promise.all(titles.map(wikiImgs))).flat().slice(0, 8);
  if (!imgs.length && q) imgs = await commonsImgs(q);
  g.innerHTML = imgs.length ? imgs.map(m => `<a href="${esc(m.page)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(m.u)}" alt="${esc(m.c)}"></a>`).join('') + `<a class="btn more" target="_blank" rel="noopener" href="${waUrl(gq)}">עוד ›</a>` : `<a class="btn" target="_blank" rel="noopener" href="${waUrl(gq)}">📷 לא נמצאו תמונות כאן — חיפוש בגוגל</a>`;
}
function ownGal(d) {
  const P = (window.TRIP_PHOTOS || {})[d.id]; if (!P || !P.items || !P.items.length) return '';
  return `<section class="own"><h3>📸 התמונות שלנו</h3><div class="gal">${P.items.map((p, i) => `<img src="${phUrl(p.f, 500)}" alt="${esc(p.c)}" loading="lazy" onerror="this.remove()" data-act="ownimg" data-d="${d.id}" data-i="${i}">`).join('')}</div></section>`;
}
function showOwn(d, i) {
  const P = (window.TRIP_PHOTOS || {})[d]; if (!P) return; const n = P.items.length; i = (i + n) % n; const p = P.items[i];
  openViewer(`<div class="vbar"><b>${esc(p.c)} · ${i + 1}/${n}</b><span><button class="btn" data-act="ownimg" data-d="${d}" data-i="${i + 1}">›</button><button class="btn" data-act="ownimg" data-d="${d}" data-i="${i - 1}">‹</button><button class="btn" data-act="vclose">✕</button></span></div><div class="vimg"><img src="${phUrl(p.f, 1200)}" alt="${esc(p.c)}"></div>`);
}
function wireGallery() {
  document.querySelectorAll('details.item').forEach(el => {
    el.addEventListener('toggle', () => {
      if (!el.open || el.dataset.loaded) return;
      el.dataset.loaded = 1;
      const g = el.querySelector('[data-gal]'); if (!g) return;
      const titles = (el.dataset.wiki || '').split('|').filter(Boolean), q = el.dataset.q, tt = el.querySelector('summary .tt').textContent;
      fillGal(g, titles, q ? q.replace(/ (Eger|Budapest)$/i, '') + ' Hungary' : '', (q || tt) + ' Hungary');
    });
    if (el.open) el.dispatchEvent(new Event('toggle'));
  });
}


// ---------- map: driving route + walking tour ----------
let MAP = null, rcache = {};
const dist = (a, b) => { const R = 6371e3, r = x => x * Math.PI / 180, dl = r(b[0] - a[0]), dn = r(b[1] - a[1]), h = Math.sin(dl / 2) ** 2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(dn / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
const kmTxt = m => m >= 1000 ? (m / 1000).toFixed(m > 10000 ? 0 : 1) + ' ק״מ' : Math.round(m / 10) * 10 + ' מ׳';
const minTxt = s => { const m = Math.round(s / 60); return m >= 60 ? Math.floor(m / 60) + ' שע׳ ' + (m % 60 ? m % 60 + ' דק׳' : '') : Math.max(1, m) + ' דק׳'; };
const dirLink = (p, mode) => `https://www.google.com/maps/dir/?api=1&hl=en&travelmode=${mode}&destination=${p.ll[0]},${p.ll[1]}`;
function destroyMap() { if (MAP) { try { MAP.remove(); } catch { } MAP = null; } }
async function osrm(profile, pts, steps) {
  const key = profile + pts.map(p => p.join(',')).join(';') + steps, lk = 'rt:' + key;
  if (rcache[key]) return rcache[key];
  try { const c = localStorage.getItem(lk); if (c) return (rcache[key] = JSON.parse(c)); } catch { }
  const c = pts.map(p => p[1] + ',' + p[0]).join(';');
  const base = profile === 'foot' ? 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/' : 'https://router.project-osrm.org/route/v1/driving/';
  try {
    const r = await fetch(`${base}${c}?overview=full&geometries=geojson&steps=${steps ? 'true' : 'false'}`);
    const j = await r.json(); const rt = j.routes?.[0]; if (!rt) throw 0;
    const slim = { distance: rt.distance, duration: rt.duration, geometry: { type: 'LineString', coordinates: rt.geometry.coordinates.map(c => [+c[0].toFixed(5), +c[1].toFixed(5)]) }, legs: (rt.legs || []).map(l => ({ steps: (l.steps || []).map(s => ({ distance: Math.round(s.distance), name: s.name, maneuver: { type: s.maneuver?.type, modifier: s.maneuver?.modifier, exit: s.maneuver?.exit } })) })) };
    try { localStorage.setItem(lk, JSON.stringify(slim)); } catch { }
    return (rcache[key] = slim);
  } catch { return null; }
}
const MOD = { left: 'שמאלה', right: 'ימינה', 'slight left': 'מעט שמאלה', 'slight right': 'מעט ימינה', 'sharp left': 'חד שמאלה', 'sharp right': 'חד ימינה', straight: 'ישר', uturn: 'פניית פרסה' };
function stepTxt(s) {
  const m = s.maneuver || {}, nm = s.name ? ' אל ' + s.name : '', t = m.type, mod = MOD[m.modifier] || '';
  if (t === 'depart') return 'התחילו לנסוע' + nm;
  if (t === 'arrive') return 'הגעתם ליעד';
  if (t === 'roundabout' || t === 'rotary') return `בכיכר צאו ביציאה ${m.exit || ''}${nm}`;
  if (t === 'merge') return 'הצטרפו' + nm;
  if (t === 'on ramp') return 'היכנסו לרמפה' + nm;
  if (t === 'off ramp') return 'צאו מהכביש' + nm;
  if (t === 'fork') return `בפיצול התקדמו ${mod}${nm}`;
  if (t === 'end of road') return `בסוף הדרך פנו ${mod}${nm}`;
  if (t === 'turn') return `פנו ${mod}${nm}`;
  return `המשיכו ${mod || 'ישר'}${nm}`;
}
function viewMap(d) {
  const M = (window.TRIP_MAP || {})[d.id] || {};
  const mode = M.walk && (S.mapMode === 'walk' || !M.route) ? 'walk' : 'drive';
  let h = dayChips(d);
  h += `<h2>${d.emoji} ${esc(d.title)}</h2>`;
  if (M.route && M.walk) h += `<div class="seg"><button class="${mode === 'drive' ? 'on' : ''}" data-act="mapmode" data-m="drive">🚗 נסיעה והוראות</button><button class="${mode === 'walk' ? 'on' : ''}" data-act="mapmode" data-m="walk">🚶 סיור הליכה</button></div>`;
  h += `<div id="map"></div><div class="actions"><button class="btn" data-act="locate">📍 איפה אני</button><span class="tiny muted">המפה: OpenStreetMap. הנקודות משוערות — לניווט מדויק השתמשו בכפתורי "נווט".</span></div><div id="mapPanel"></div>`;
  if (M.route || M.walk) h += `<h3>🖼️ מפה כתמונה (לשימוש אופליין)</h3><p class="tiny muted">תמונת PNG עם כל הנקודות A·B·C והמסלול, שנשמרת במכשיר ונפתחת גם בלי קליטה. יוצרים אותה פעם אחת כשיש רשת.</p><div class="actions">${modesOf(d).map(m => `<button class="btn" data-act="mapimg" data-day="${d.id}" data-m="${m}">🖼️ ${m === 'walk' ? 'סיור הליכה' : 'מסלול נסיעה'}</button>`).join('')}<button class="btn pri" data-act="mapall">📥 שמור את כל המפות לאופליין</button></div>`;
  if (!M.route && !M.walk) h += '<p class="muted">אין מפה ליום הזה.</p>';
  return h;
}
const pin = (txt, cls) => L.divIcon({ className: '', html: `<div class="pin ${cls || ''}">${txt}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] });
function initMap(d) {
  destroyMap();
  const M = (window.TRIP_MAP || {})[d.id] || {}, el = $('#map');
  if (!el || !window.L || (!M.route && !M.walk)) { if (el && !window.L) el.innerHTML = '<p class="muted pad">המפה לא נטענה.</p>'; return; }
  MAP = L.map(el, { zoomControl: true, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(MAP);
  const mode = M.walk && (S.mapMode === 'walk' || !M.route) ? 'walk' : 'drive';
  if (mode === 'drive') driveMap(d, M.route); else walkMap(d, M.walk);
}
async function driveMap(d, route) {
  const pts = route.map(p => p.ll), bounds = L.latLngBounds(pts);
  route.forEach((p, i) => L.marker(p.ll, { icon: pin(i === 0 ? 'A' : String.fromCharCode(65 + i)) }).addTo(MAP).bindPopup(esc(p.n)));
  MAP.fitBounds(bounds.pad(0.2));
  const panel = $('#mapPanel');
  const gm = `https://www.google.com/maps/dir/?api=1&hl=en&travelmode=driving&origin=${pts[0]}&destination=${pts[pts.length - 1]}${pts.length > 2 ? '&waypoints=' + pts.slice(1, -1).map(p => p.join(',')).join('|') : ''}`;
  panel.innerHTML = `<h3>🚗 מסלול הנסיעה</h3><div class="actions"><a class="btn pri" target="_blank" rel="noopener" href="${gm}">🧭 פתח את כל המסלול ב-Google Maps</a><a class="btn" target="_blank" rel="noopener" href="https://waze.com/ul?ll=${pts[pts.length - 1].join(',')}&navigate=yes">Waze ליעד האחרון</a></div><div id="legs"></div>`;
  const legs = $('#legs'); legs.innerHTML = '<p class="muted">טוען מסלולים…</p>';
  const out = [];
  for (let i = 0; i < route.length - 1; i++) {
    const a = route[i], b = route[i + 1], rt = await osrm('driving', [a.ll, b.ll], true);
    const col = ['#7a1f2b', '#2e6f95', '#c27c0e'][i % 3];
    if (rt) { L.geoJSON(rt.geometry, { style: { color: col, weight: 5, opacity: .8 } }).addTo(MAP); }
    else L.polyline([a.ll, b.ll], { color: col, weight: 3, dashArray: '6 8' }).addTo(MAP);
    const m = rt ? rt.distance : dist(a.ll, b.ll) * 1.3, s = rt ? rt.duration : m / 20;
    const steps = rt ? rt.legs[0].steps.filter(x => x.distance > 0 || x.maneuver.type === 'arrive').map(x => `<li>${esc(stepTxt(x))}${x.distance ? ` <small class="muted">(${kmTxt(x.distance)})</small>` : ''}</li>`).join('') : '';
    out.push(`<details class="item"><summary><span class="ic">${String.fromCharCode(65 + i)}→${String.fromCharCode(66 + i)}</span><span class="tt"><small>${kmTxt(m)} · ${minTxt(s)}${rt ? '' : ' (הערכה)'}</small>${esc(a.n)} ← ${esc(b.n)}</span></summary><div class="det">${steps ? `<ol class="steps">${steps}</ol>` : '<p class="muted">לא ניתן לטעון הוראות כרגע (אין חיבור). ההערכה לפי קו אווירי.</p>'}<div class="actions"><a class="btn" target="_blank" rel="noopener" href="${dirLink(b, 'driving')}">🧭 נווט ליעד</a></div></div></details>`);
  }
  if ($('#legs') === legs) legs.innerHTML = out.join('') + '<p class="tiny muted">זמני הנסיעה הם הערכה לפי מסלול רגיל; בפועל תלוי בתנאי הדרך, מזג האוויר ובחושך (בנובמבר החשכה בסביבות 16:00).</p>';
}
async function walkMap(d, walk) {
  const done = (S.walk[d.id] ||= {}), st = walk.stops;
  const nextI = st.findIndex(s => !done[s.id]), next = st[nextI], prev = nextI > 0 ? st[nextI - 1] : null;
  const all = st.map(s => s.ll);
  L.polyline(all, { color: '#7a1f2b', weight: 2, opacity: .45, dashArray: '4 8' }).addTo(MAP);
  st.forEach((s, i) => { const cls = done[s.id] ? 'done' : (s === next ? 'next' : ''); L.marker(s.ll, { icon: pin(done[s.id] ? '✓' : i + 1, cls), zIndexOffset: s === next ? 1000 : 0 }).addTo(MAP).bindPopup(`<b>${esc(s.n)}</b>`); });
  MAP.fitBounds(L.latLngBounds(all).pad(0.25));
  const panel = $('#mapPanel');
  const list = `<h4>כל הנקודות (${Object.values(done).filter(Boolean).length}/${st.length})</h4><div class="card">` + st.map((s, i) => `<label class="task ${done[s.id] ? 'done' : ''}"><input type="checkbox" data-act="visit" data-id="${s.id}" data-day="${d.id}" ${done[s.id] ? 'checked' : ''}><span>${i + 1}. ${esc(s.n)} <small class="muted">${esc(s.time || '')}</small></span></label>`).join('') + '</div>';
  if (!next) { panel.innerHTML = `<h3>🎉 סיימתם את הסיור!</h3><p>${esc(walk.title)} — כל הנקודות סומנו.</p>${list}`; if (MAP) MAP.fitBounds(L.latLngBounds(all).pad(0.25)); return; }
  panel.innerHTML = `<h3>🚶 ${esc(walk.title)}</h3><p class="muted">${esc(walk.intro)}</p>
    <div class="card next-card"><div class="muted tiny">הנקודה הבאה · ${nextI + 1} מתוך ${st.length}${next.time ? ' · ' + esc(next.time) : ''}</div><h3 style="margin:.2rem 0">${esc(next.n)}</h3>
    <div class="tiny muted" id="wkinfo">${prev ? 'טוען מרחק מהנקודה הקודמת…' : 'נקודת ההתחלה של הסיור'}</div>
    <p><b>📜 היסטוריה:</b> ${esc(next.story)}</p><p><b>🌶️ פיקנטריה:</b> ${esc(next.fun)}</p>${deepHtml(next.deep)}
    <div class="actions"><a class="btn" target="_blank" rel="noopener" href="${dirLink(next, 'walking')}">🧭 נווט בהליכה</a><a class="btn" target="_blank" rel="noopener" href="${mapsUrl(next.q || next.n)}">🗺️ מפה</a><button class="btn pri" data-act="visit" data-id="${next.id}" data-day="${d.id}">✅ הייתי</button></div></div>${list}`;
  if (prev) {
    const rt = await osrm('foot', [prev.ll, next.ll], false);
    if (!MAP) return;
    if (rt) L.geoJSON(rt.geometry, { style: { color: '#2e8b57', weight: 5, opacity: .85 } }).addTo(MAP); else L.polyline([prev.ll, next.ll], { color: '#2e8b57', weight: 4, dashArray: '2 8' }).addTo(MAP);
    const m = rt ? rt.distance : dist(prev.ll, next.ll) * 1.3, s = rt ? rt.duration : m / 1.2, w = $('#wkinfo');
    if (w) w.textContent = `🚶 ${kmTxt(m)} · כ-${minTxt(s)} הליכה מ"${prev.n}"${rt ? '' : ' (הערכה)'}`;
  } else { const rt = next; MAP.setView(next.ll, 16); }
}
let me = null;
function locate() {
  if (!MAP || !navigator.geolocation) return toast('אין גישה למיקום');
  navigator.geolocation.getCurrentPosition(p => { const ll = [p.coords.latitude, p.coords.longitude]; if (me) me.remove(); me = L.circleMarker(ll, { radius: 8, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1 }).addTo(MAP); MAP.setView(ll, Math.max(MAP.getZoom(), 15)); }, () => toast('לא הצלחתי לקבל מיקום'), { enableHighAccuracy: true, timeout: 8000 });
}


// ---------- offline map image (PNG) ----------
const idb = () => new Promise((res, rej) => { const q = indexedDB.open('hu-trip', 1); q.onupgradeneeded = () => q.result.createObjectStore('maps'); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
const idbGet = async k => { const db = await idb(); return new Promise(r => { const q = db.transaction('maps').objectStore('maps').get(k); q.onsuccess = () => r(q.result); q.onerror = () => r(null); }); };
const idbPut = async (k, v) => { const db = await idb(); return new Promise((r, j) => { const tx = db.transaction('maps', 'readwrite'); tx.objectStore('maps').put(v, k); tx.oncomplete = r; tx.onerror = () => j(tx.error); }); };
const TS = 256, mx = (lon, z) => (lon + 180) / 360 * 2 ** z * TS, my = (lat, z) => { const r = lat * Math.PI / 180; return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z * TS; };
const modesOf = d => { const M = (window.TRIP_MAP || {})[d.id] || {}; return [M.route && 'drive', M.walk && 'walk'].filter(Boolean); };
async function mapSpec(d, mode) {
  const M = TRIP_MAP[d.id];
  const pts = mode === 'walk' ? M.walk.stops.map((s, i) => ({ ll: s.ll, label: String(i + 1), name: s.n })) : M.route.map((p, i) => ({ ll: p.ll, label: String.fromCharCode(65 + i), name: p.n }));
  const lines = [];
  for (let i = 0; i < pts.length - 1; i++) { const rt = await osrm(mode === 'walk' ? 'foot' : 'driving', [pts[i].ll, pts[i + 1].ll], mode !== 'walk'); lines.push(rt ? rt.geometry.coordinates.map(c => [c[1], c[0]]) : [pts[i].ll, pts[i + 1].ll]); }
  return { pts, lines };
}
const loadTile = (z, x, y) => new Promise(res => { const im = new Image(); im.crossOrigin = 'anonymous'; const t = setTimeout(() => res(null), 9000); im.onload = () => { clearTimeout(t); res(im); }; im.onerror = () => { clearTimeout(t); res(null); }; im.src = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`; });
async function renderPng(d, mode) {
  const { pts, lines } = await mapSpec(d, mode), W = 1080, H = 1080, rowH = 54, LH = 120 + pts.length * rowH;
  const all = [...pts.map(p => p.ll), ...lines.flat()];
  const la = all.map(p => p[0]), lo = all.map(p => p[1]), minLa = Math.min(...la), maxLa = Math.max(...la), minLo = Math.min(...lo), maxLo = Math.max(...lo);
  let z = 17; for (; z > 3; z--) if (mx(maxLo, z) - mx(minLo, z) <= W - 240 && my(minLa, z) - my(maxLa, z) <= H - 240) break;
  const ox = (mx(minLo, z) + mx(maxLo, z)) / 2 - W / 2, oy = (my(minLa, z) + my(maxLa, z)) / 2 - H / 2;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H + LH; const c = cv.getContext('2d');
  c.fillStyle = '#e8e4dc'; c.fillRect(0, 0, W, H + LH);
  const jobs = []; const n = 2 ** z;
  for (let x = Math.floor(ox / TS); x <= Math.floor((ox + W) / TS); x++) for (let y = Math.floor(oy / TS); y <= Math.floor((oy + H) / TS); y++) if (y >= 0 && y < n) jobs.push(loadTile(z, ((x % n) + n) % n, y).then(im => ({ im, x, y })));
  const tiles = await Promise.all(jobs); let ok = 0;
  c.save(); c.beginPath(); c.rect(0, 0, W, H); c.clip(); tiles.forEach(t => { if (t.im) { c.drawImage(t.im, t.x * TS - ox, t.y * TS - oy); ok++; } }); c.restore();
  const px = p => [mx(p[1], z) - ox, my(p[0], z) - oy], cols = ['#7a1f2b', '#2e6f95', '#c27c0e', '#2e8b57'];
  c.lineJoin = c.lineCap = 'round';
  lines.forEach((ln, i) => { c.beginPath(); ln.forEach((p, k) => { const [x, y] = px(p); k ? c.lineTo(x, y) : c.moveTo(x, y); }); c.strokeStyle = '#fff'; c.lineWidth = 14; c.stroke(); c.strokeStyle = cols[i % 4]; c.lineWidth = 8; c.stroke(); });
  c.font = 'bold 30px system-ui, Arial'; c.textAlign = 'center'; c.textBaseline = 'middle';
  pts.forEach(p => { const [x, y] = px(p.ll); c.beginPath(); c.arc(x, y, 27, 0, 7); c.fillStyle = '#7a1f2b'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.fillText(p.label, x, y + 1); });
  c.fillStyle = 'rgba(255,255,255,.88)'; c.fillRect(0, 0, W, 64); c.fillStyle = '#2b2422'; c.font = 'bold 30px system-ui, Arial'; c.textAlign = 'right'; c.direction = 'rtl';
  c.fillText(`${d.dow} ${fmt(d.date)} · ${mode === 'walk' ? TRIP_MAP[d.id].walk.title : 'מסלול נסיעה'}`, W - 24, 33);
  c.font = '18px system-ui, Arial'; c.fillStyle = '#555'; c.textAlign = 'left'; c.direction = 'ltr'; c.fillText(ok ? '© OpenStreetMap contributors' : 'ללא רקע מפה (אין חיבור) · OpenStreetMap', 14, H - 14);
  c.fillStyle = '#fff'; c.fillRect(0, H, W, LH); c.fillStyle = '#7a1f2b'; c.fillRect(0, H, W, 6);
  c.textBaseline = 'middle'; c.font = '26px system-ui, Arial'; c.textAlign = 'right'; c.direction = 'rtl';
  pts.forEach((p, i) => { const y = H + 50 + i * rowH; c.beginPath(); c.arc(W - 44, y, 19, 0, 7); c.fillStyle = '#7a1f2b'; c.fill(); c.fillStyle = '#fff'; c.font = 'bold 22px system-ui, Arial'; c.textAlign = 'center'; c.fillText(p.label, W - 44, y + 1); c.fillStyle = '#2b2422'; c.font = '26px system-ui, Arial'; c.textAlign = 'right'; c.fillText(p.name, W - 80, y + 1); });
  c.font = '18px system-ui, Arial'; c.fillStyle = '#777'; c.textAlign = 'center'; c.direction = 'ltr'; c.fillText('נשמר ' + new Date().toLocaleString('he-IL'), W / 2, H + LH - 22);
  return new Promise((res, rej) => cv.toBlob(b => b ? res(b) : rej(new Error('toBlob')), 'image/png'));
}
async function makeImg(d, mode) { const rec = { blob: await renderPng(d, mode), ts: Date.now() }; await idbPut(d.id + '-' + mode, rec); return rec; }
function openViewer(html) { let v = $('#viewer'); if (!v) { v = document.createElement('div'); v.id = 'viewer'; document.body.appendChild(v); } v.innerHTML = html; v.hidden = false; }
async function showMapImg(d, mode, force) {
  const key = d.id + '-' + mode; let rec = force ? null : await idbGet(key).catch(() => null);
  if (!rec) { openViewer('<div class="vbar"><b>יוצר תמונת מפה…</b><button class="btn" data-act="vclose">✕</button></div><p class="pad" style="color:#fff">טוען אריחי מפה (דורש חיבור לרשת)…</p>'); try { rec = await makeImg(d, mode); } catch (e) { openViewer('<div class="vbar"><b>שגיאה</b><button class="btn" data-act="vclose">✕</button></div><p class="pad" style="color:#fff">לא הצלחתי ליצור תמונה (אין חיבור?). נסו שוב כשיש רשת.</p>'); return; } }
  const url = URL.createObjectURL(rec.blob), fn = `hungary-${d.id}-${mode}.png`;
  openViewer(`<div class="vbar"><b>${esc(d.dow)} ${fmt(d.date)} · ${mode === 'walk' ? 'סיור הליכה' : 'נסיעה'}</b><span><a class="btn" download="${fn}" href="${url}">⬇️ שמור</a><button class="btn" data-act="vshare" data-day="${d.id}" data-m="${mode}">📤</button><button class="btn" data-act="vrefresh" data-day="${d.id}" data-m="${mode}">🔄</button><button class="btn" data-act="vclose">✕</button></span></div><div class="vimg"><img src="${url}" alt="map"></div><p class="tiny" style="color:#ddd;text-align:center">שמורה במכשיר — נפתחת גם בלי קליטה. נשמרה ${new Date(rec.ts).toLocaleString('he-IL')}</p>`);
}
async function saveAllMaps(btn) {
  const jobs = T.days.flatMap(d => modesOf(d).map(m => [d, m])); let i = 0, fail = 0;
  for (const [d, m] of jobs) { btn.textContent = `שומר… ${++i}/${jobs.length}`; try { await makeImg(d, m); } catch { fail++; } }
  btn.textContent = fail ? `נשמרו ${jobs.length - fail}/${jobs.length} (נכשלו ${fail})` : `✅ נשמרו כל ${jobs.length} המפות`;
}
async function markSaved(d) { for (const m of modesOf(d)) { const r = await idbGet(d.id + '-' + m).catch(() => null); const b = document.querySelector(`[data-act=mapimg][data-m=${m}]`); if (b && r) b.textContent = b.textContent.replace('🖼️', '✅🖼️'); } }


// ---------- icons: replace emoji with line icons (DOM-level, attribute-safe) ----------
const EMO = { '✈': 'plane', '🛫': 'plane-takeoff', '🛬': 'plane-landing', '🚗': 'car', '📍': 'map-pin', '🍽': 'utensils', '🍴': 'utensils', '🏰': 'castle', '🏨': 'hotel', '♨': 'droplets', '🥐': 'croissant', '🌊': 'waves', '🕳': 'mountain', '🏘': 'house', '🏠': 'house', '🏡': 'house', '🚶': 'footprints', '⛽': 'fuel', '🧳': 'luggage', '🛂': 'id-card', '⛪': 'church', '✨': 'sparkles', '🎄': 'tree-pine', '🍷': 'wine', '🌅': 'sunset', '🌇': 'sunset', '🌲': 'trees', '🧖': 'bath', '☕': 'coffee', '🏛': 'landmark', '🗺': 'map', '🧭': 'navigation', '📷': 'camera', '🔎': 'search', '📞': 'phone', '✉': 'mail', '🌐': 'globe', 'ℹ': 'info', '🗓': 'calendar-days', '📅': 'calendar', '🕒': 'clock', '⏰': 'clock', '📜': 'scroll-text', '🌶': 'flame', '⚡': 'zap', '⚠': 'triangle-alert', '👍': 'thumbs-up', '🚫': 'ban', '✅': 'circle-check', '✔': 'check', '🔄': 'refresh-cw', '⟳': 'refresh-cw', '⬇': 'download', '📥': 'download', '📤': 'share-2', '🖼': 'image', '📝': 'pencil', '✏': 'pencil', '💡': 'lightbulb', '🎒': 'backpack', '⏳': 'hourglass', '🎉': 'party-popper', '⛅': 'cloud-sun', '☀': 'sun', '🌫': 'cloud-fog', '🌧': 'cloud-rain', '❄': 'snowflake', '🌦': 'cloud-sun-rain', '🍇': 'grape', '🥩': 'beef', '🔗': 'external-link', '💶': 'banknote', '🗣': 'languages', '📌': 'pin', '📋': 'clipboard-list', '💾': 'save', '🗳': 'check', '📖': 'scroll-text', '🔖': 'pin', '🎟': 'ticket' };
const EMO_RE = /[\p{Extended_Pictographic}⟳]️?/gu, EMO_TEST = /[\p{Extended_Pictographic}⟳]/u, SVGNS = 'http://www.w3.org/2000/svg';
function emoNode(ch) {
  const c = ch.replace(/️/g, '');
  if (c === '🟥' || c === '🟩' || c === '⬜' || c === '🟧') { const s = document.createElement('i'); s.className = 'sq ' + (c === '🟥' ? 'sq-r' : c === '🟩' ? 'sq-g' : c === '🟧' ? 'sq-a' : 'sq-n'); return s; }
  const n = EMO[c]; if (!n) return document.createTextNode('');
  const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('class', 'i'); const u = document.createElementNS(SVGNS, 'use'); u.setAttribute('href', '#i-' + n); s.appendChild(u); return s;
}
function iconify(root) {
  const skip = /^(TEXTAREA|SCRIPT|STYLE|TITLE|OPTION|svg)$/, nodes = [];
  if (root.nodeType === 3) { if (EMO_TEST.test(root.nodeValue) && root.parentNode && !skip.test(root.parentNode.nodeName)) nodes.push(root); }
  else { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (EMO_TEST.test(n.nodeValue) && !skip.test(n.parentNode.nodeName)) nodes.push(n); }
  nodes.forEach(n => {
    const t = n.nodeValue, f = document.createDocumentFragment(); let last = 0, m; EMO_RE.lastIndex = 0;
    while ((m = EMO_RE.exec(t))) { if (m.index > last) f.appendChild(document.createTextNode(t.slice(last, m.index))); f.appendChild(emoNode(m[0])); last = m.index + m[0].length; }
    if (last < t.length) f.appendChild(document.createTextNode(t.slice(last)));
    n.parentNode && n.parentNode.replaceChild(f, n);
  });
}
new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType === 1 || n.nodeType === 3) iconify(n); }))).observe(document.body, { childList: true, subtree: true });

// ---------- hero photo (Wikipedia lead image, with gradient fallback) ----------
async function heroImg(title) {
  const ck = 'hero2:' + title;
  try { const c = localStorage.getItem(ck); if (c) return c; } catch { }
  try {
    const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title));
    if (!r.ok) return '';
    const j = await r.json(), o = j.originalimage, t = j.thumbnail;
    let u = '';
    if (o && o.width && o.width <= 1400) u = o.source;           // small enough to use as is
    else if (t && /\/\d+px-/.test(t.source)) u = t.source.replace(/\/\d+px-/, '/960px-'); // standard Wikimedia thumb size
    else u = (o && o.source) || (t && t.source) || '';
    if (u) { try { localStorage.setItem(ck, u); } catch { } }
    return u;
  } catch { return ''; }
}
const tryImg = u => new Promise(res => { const im = new Image(); im.onload = () => res(true); im.onerror = () => res(false); im.src = u; });
const phUrl = (u, w) => /googleusercontent\.com/.test(u) ? `${u}=w${w}` : u;
async function loadHero() {
  const el = document.querySelector('.hero[data-hero]'); if (!el) return;
  const mine = (window.TRIP_PHOTOS || {})[el.dataset.day];
  if (mine && mine.hero) { const u = phUrl(mine.hero, 1000); if (await tryImg(u)) { if (document.body.contains(el)) { el.style.backgroundImage = `url("${u}")`; el.style.backgroundPosition = mine.pos || 'center'; } return; } }
  if (!el.dataset.hero) return;
  for (const title of el.dataset.hero.split('|')) {
    const u = await heroImg(title);
    if (u && await tryImg(u)) { if (document.body.contains(el)) el.style.backgroundImage = `url("${u}")`; return; }
    try { localStorage.removeItem('hero2:' + title); } catch { }
  }
}


// ---------- bookings summary (one place for everything reserved) ----------
const AREA = { 'd1-lunch': 'Eger', 'd1-dinner': 'Eger', 'd2-lunch': 'Lillafüred', 'd2-dinner': 'Eger', 'd3-lunch': 'Noszvaj', 'd3-dinner': 'Eger', 'd4-lunch': 'Budapest', 'd4-dinner': 'Budapest' };
const EN_DOW = { d1: 'Thu 12 Nov', d2: 'Fri 13 Nov', d3: 'Sat 14 Nov', d4: 'Sun 15 Nov', d5: 'Mon 16 Nov' };
const EN_ITEM = { 'd1-car': 'Car pickup, Budapest Airport (BUD)', 'd1-checkin': 'Hotel: Imola Hotel Platán Adults Only, Eger (12–15 Nov)', 'd2-cave': 'Anna Cave, Lillafüred', 'd4-hotel': 'Hotel: Budapest Marriott Hotel (15–16 Nov)' };
const SQ = { need: '🟥', sent: '🟧', booked: '🟩', na: '⬜' };
function bookingRows() {
  const rows = [];
  T.days.forEach(d => {
    d.items.filter(i => i.book).forEach(i => rows.push({ d, key: i.alias || i.id, time: (i.rtime || i.time || '').replace(/ \(.*/, ''), name: i.bookLabel || i.title, en: EN_ITEM[i.id] || i.title, addr: '', st: stOf(i), x: i, kind: 'item' }));
    (d.slots || []).forEach(s => {
      const p = pickOf(s.id), r = mealOpts(d, s).find(x => x.id === p);
      if (!r) rows.push({ d, key: 'slot:' + s.id, time: '', name: 'לבחור מסעדה: ' + s.label, en: 'Restaurant not chosen yet (' + s.id + ')', addr: '', st: 'need', synthetic: true, kind: 'none' });
      else rows.push({ d, key: r.id, time: (r.rtimeUnverified && r.status !== 'booked' ? '~' : '') + (r.rtime || ''), name: r.name, en: r.name, addr: r.addr || AREA[s.id] || '', st: stOf(r), x: r, kind: 'rest' });
    });
  });
  const order = d => T.days.indexOf(d);
  return rows.map((r, i) => ({ ...r, i })).sort((p, q) => order(p.d) - order(q.d) || (p.time.replace('~', '') || '99').localeCompare(q.time.replace('~', '') || '99') || p.i - q.i);
}
function summaryHtml() {
  const rows = bookingRows(), cnt = s => rows.filter(r => r.st === s).length;
  let h = `<h3>📋 סיכום הזמנות</h3><div class="pills"><span class="pill green">🟩 ${cnt('booked')} אושרו</span><span class="pill amber">🟧 ${cnt('sent')} ממתינות</span><span class="pill red">🟥 ${cnt('need')} פתוחות</span></div>
  <div class="actions"><button class="btn pri" data-act="copysum" data-l="he">📋 העתק לווטסאפ (עברית)</button><button class="btn" data-act="copysum" data-l="en">📋 Copy (English)</button></div>`;
  T.days.forEach(d => {
    const rs = rows.filter(r => r.d === d); if (!rs.length) return;
    h += `<div class="card sum"><div class="muted tiny">${d.dow} ${fmt(d.date)}</div>` + rs.map(r => `<div class="srow"><div class="stime"><bdi dir="ltr">${esc(r.time || '—')}</bdi></div><div class="sname"><b>${esc(r.name)}</b>${r.x ? dishBadge(r.x) : ''}${r.addr ? `<div class="tiny muted">${esc(r.addr)}</div>` : ''}</div><div class="sact">${r.synthetic ? `<button class="st st-need sm" data-act="gotoday" data-id="${d.id}" style="pointer-events:auto">בחרו ›</button>` : `<button class="st st-${r.st}" data-act="cycle" data-id="${esc(r.key)}">${ST[r.st][0]} ${ST[r.st][1]}</button>`}${r.kind === 'rest' ? `<a class="btn" style="height:30px;padding:0 10px" target="_blank" rel="noopener" href="${navUrl(r.x)}">🧭</a>` : ''}</div></div>`).join('') + `</div>`;
  });
  return h;
}
function summaryText(lang) {
  const rows = bookingRows(), en = lang === 'en';
  const L = [en ? "*Anat & Guy's Birthday Trip — Hungary, 12–16 Nov 2026*" : '*טיול יום הולדת של ענת וגיא — הונגריה 12–16.11.2026*', en ? '🟩 = confirmed   🟧 = request sent, awaiting reply   🟥 = not booked yet' : '🟩 = אושר   🟧 = נשלחה בקשה   🟥 = עוד לא הוזמן', ''];
  T.days.forEach(d => {
    const rs = rows.filter(r => r.d === d); if (!rs.length) return;
    L.push(`*${en ? EN_DOW[d.id] : d.dow + ' ' + fmt(d.date)}*`);
    rs.forEach(r => L.push(`${SQ[r.st]} ${r.time ? r.time + ' · ' : ''}${en ? r.en : r.name}${r.addr ? ' — ' + r.addr : ''}`));
    L.push('');
  });
  return L.join('\n').trim();
}


function wildHtml() {
  const findR = id => { for (const d of T.days) { const r = d.restaurants.find(x => x.id === id); if (r) return { d, r }; } return null; };
  const findI = id => { for (const d of T.days) { const i = d.items.find(x => x.id === id); if (i) return { d, i }; } return null; };
  return (T.wild || []).map(w => {
    const ok = (w.where || []).map(x => {
      if (x.rid) { const f = findR(x.rid); if (!f) return ''; const chosen = f.r.slot && pickOf(f.r.slot) === f.r.id; return `<div class="wrow"><span class="glow">${esc(f.r.name.split(/[(—·]/)[0].trim())} · ${f.d.dow} ${fmt(f.d.date)}${f.r.rtime ? ' · <bdi dir="ltr">' + esc(f.r.rtime) + '</bdi>' : ''}</span><span class="tiny"> ${chosen ? ST[stOf(f.r)][0] + ' ' + ST[stOf(f.r)][1] : '<span class="muted">(לא נבחרה — אפשרות)</span>'}</span><div class="tiny muted">${esc(x.note || '')}</div></div>`; }
      if (x.item) { const f = findI(x.item); if (!f) return ''; return `<div class="wrow"><span class="glow">${esc(x.label || f.i.title)} · ${f.d.dow} ${fmt(f.d.date)} · <bdi dir="ltr">${esc(f.i.time || '')}</bdi></span><div class="tiny muted">${esc(x.note || '')}</div></div>`; }
      return '';
    }).join('');
    return `<div class="card slim wild"><div class="rh"><div><b>${esc(w.hu)}</b><div class="tiny muted">${esc(w.he)}</div></div></div>${ok || `<div class="tiny nowhere">לא אומת באף מסעדה שלכם — לשאול: <b>${esc(w.ask)}</b></div>`}${!ok && w.hint ? `<div class="tiny muted">${esc(w.hint)}</div>` : ''}${ok ? `<div class="tiny muted">לאמת בתפריט: <b>${esc(w.ask)}</b></div>` : ''}</div>`;
  }).join('');
}

// ---------- weather ----------
const wxc = {};
async function fetchWeather(d) {
  const c = T.weather[d.id]; if (!c) return;
  const set = t => { const e = $('#wx-' + d.id); if (e) e.textContent = t; };
  try {
    if (!wxc[d.id]) {
      const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c[0]}&longitude=${c[1]}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=Europe%2FBudapest&start_date=${d.date}&end_date=${d.date}`);
      if (!r.ok) throw 0;
      const j = (await r.json()).daily;
      const code = j.weathercode[0], ic = code === 0 ? '☀️' : code < 4 ? '⛅' : code < 50 ? '🌫️' : code < 70 ? '🌧️' : code < 80 ? '❄️' : '🌦️';
      wxc[d.id] = `${ic} ${Math.round(j.temperature_2m_min[0])}–${Math.round(j.temperature_2m_max[0])}° · גשם ${j.precipitation_probability_max[0] ?? '?'}%`;
    }
    set(wxc[d.id]);
  } catch { set('⛅ תחזית לא זמינה'); }
}


// ---------- sync (last-writer-wins per field, via a shared JSON document) ----------
const SHARED = ['status', 'booking', 'tasks', 'customTasks', 'customRest', 'notes', 'expenses', 'packing', 'pick', 'vote', 'names', 'flight'];
const SYK = 'hu-trip-sync', SEP = '|', DEL = '__del__';
let SY;
try { SY = JSON.parse(localStorage.getItem(SYK) || 'null'); } catch { SY = null; }
SY = Object.assign({ url: '', meta: {}, last: {}, ok: 0, err: '' }, SY || {});
const saveSy = () => { try { localStorage.setItem(SYK, JSON.stringify(SY)); } catch { } };
function flat(st) {
  const out = {};
  const walk = (v, p) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) { const objs = v.length && v.every(x => x && typeof x === 'object' && !Array.isArray(x)); v.forEach((x, i) => walk(x, [...p, objs ? '#' + (x.id ?? i) : '@' + i])); }
    else if (typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, [...p, k]));
    else out[p.join(SEP)] = v;
  };
  SHARED.forEach(k => walk(st[k], [k]));
  return out;
}
function unflat(leaves) {
  const root = {};
  for (const [p, v] of Object.entries(leaves)) {
    if (v === null || v === undefined) continue;
    const seg = p.split(SEP); let n = root;
    seg.forEach((s, i) => { if (i === seg.length - 1) n[s] = v; else n = (n[s] ||= {}); });
  }
  const conv = n => {
    if (n === null || typeof n !== 'object') return n;
    const ks = Object.keys(n); ks.forEach(k => { n[k] = conv(n[k]); });
    if (ks.length && ks.every(k => k[0] === '#')) return ks.sort().map(k => { const o = n[k]; if (o && typeof o === 'object' && o.id === undefined) o.id = k.slice(1); return o; });
    if (ks.length && ks.every(k => k[0] === '@')) return ks.sort((x, y) => x.slice(1) - y.slice(1)).map(k => n[k]);
    return n;
  };
  return conv(root);
}
function track() { // stamp local changes since last time
  const cur = flat(S), now = Date.now();
  for (const p in cur) if (SY.last[p] !== cur[p]) SY.meta[p] = now;
  for (const p in SY.last) if (!(p in cur)) SY.meta[p] = now;
  SY.last = cur; return cur;
}
const doc = cur => ({ v: 1, leaves: Object.entries(SY.meta).map(([p, t]) => [p, p in cur ? cur[p] : DEL, t]) });
let syncing = false, timer = null, pendingRender = false;
function scheduleSync() { if (!SY.url || syncing) return; clearTimeout(timer); timer = setTimeout(syncNow, 1200); }
async function syncNow() {
  if (!SY.url || syncing) return;
  syncing = true;
  try {
    const r = await fetch(SY.url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    let rem = [];
    if (r.ok) { const j = await r.json().catch(() => null); if (j && Array.isArray(j.leaves)) rem = j.leaves; }
    else if (r.status !== 404) throw new Error('http ' + r.status);
    track();
    const remote = new Map(rem.map(([p, v, t]) => [p, [v, t]]));
    let applied = false, push = false;
    for (const [p, [v, t]] of remote) {
      if (!(p in SY.meta) || t > SY.meta[p]) { SY.meta[p] = t; applied = true; }
    }
    const merged = {};
    for (const [p, t] of Object.entries(SY.meta)) {
      const rv = remote.get(p);
      if (rv && rv[1] >= t) merged[p] = rv[0]; else { const cur = flat(S); merged[p] = p in cur ? cur[p] : DEL; push = true; }
    }
    if (remote.size !== Object.keys(SY.meta).length) push = true;
    if (applied) {
      const leaves = {}; for (const [p, v] of Object.entries(merged)) leaves[p] = v === DEL ? null : v;
      const m = unflat(leaves), b = blank();
      SHARED.forEach(k => { S[k] = m[k] ?? b[k]; });
      SY.last = flat(S);
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { }
    }
    if (push) {
      const cur = flat(S);
      const pr = await fetch(SY.url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ v: 1, leaves: Object.entries(SY.meta).map(([p, t]) => [p, p in cur ? cur[p] : DEL, t]) }) });
      if (!pr.ok) throw new Error('put ' + pr.status);
    }
    SY.ok = Date.now(); SY.err = ''; saveSy();
    if (applied) softRender(); else drawTop();
  } catch (e) { SY.err = String(e.message || e); saveSy(); drawTop(); }
  syncing = false;
}
function softRender() {
  const ae = document.activeElement;
  if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) { pendingRender = true; return; }
  pendingRender = false; keepOpen();
}
document.addEventListener('focusout', () => { if (pendingRender) setTimeout(softRender, 300); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) syncNow(); });
addEventListener('online', syncNow);
setInterval(() => { if (!document.hidden) syncNow(); }, 15000);
async function enableSync() {
  const cur = flat(S), now = Date.now();
  for (const p in cur) SY.meta[p] = now;
  SY.last = cur;
  const body = JSON.stringify(doc(cur));
  const r = await fetch('https://jsonblob.com/api/jsonBlob', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body });
  let loc = r.headers.get('Location');
  if (!loc && r.headers.get('X-jsonblob')) loc = 'https://jsonblob.com/api/jsonBlob/' + r.headers.get('X-jsonblob');
  if (!r.ok || !loc) throw new Error('create failed');
  SY.url = loc.replace(/^http:/, 'https:'); saveSy();
  await syncNow();
}
function joinSync(url, fresh) {
  SY.url = url; SY.err = '';
  const cur = flat(S);
  for (const p in cur) if (!(p in SY.meta)) SY.meta[p] = fresh ? Date.now() : 1;
  SY.last = cur; saveSy(); syncNow();
}
const shareLink = () => location.origin + location.pathname + '?sync=' + encodeURIComponent(SY.url);
function syncCard() {
  if (!SY.url) return `<h3>🔄 סנכרון בין הטלפונים</h3><div class="card"><p>כרגע ההצבעות והסימונים נשמרים רק במכשיר הזה. הפעילו סנכרון, ושלחו את הקישור לבן/בת הזוג: כשפותחים אותו, שני המכשירים מתחברים לאותו מסמך משותף.</p><div class="actions"><button class="btn pri" data-act="sy-enable">🔄 הפעל סנכרון</button></div>
    <details class="add"><summary>יש לי כתובת של מסמך JSON (למשל Firebase)</summary><form data-act="sy-url"><input name="url" type="url" placeholder="https://…" required><label class="tiny"><input type="checkbox" name="fresh" checked> זה המכשיר הראשון (הנתונים שלו נשארים)</label><button class="btn pri">חבר</button></form></details></div>`;
  const ago = SY.ok ? Math.max(0, Math.round((Date.now() - SY.ok) / 1000)) + ' שנ׳' : '—';
  return `<h3>🔄 סנכרון בין הטלפונים</h3><div class="card"><p>${SY.err ? '⚠️ אין חיבור כרגע (' + esc(SY.err) + '). הנתונים נשמרים במכשיר ויסונכרנו כשיחזור החיבור.' : '✅ מסונכרן · עודכן לפני ' + ago}</p>
    <p class="tiny muted">כל שינוי נשלח תוך שניות, והמכשיר השני מתעדכן כל ~15 שניות. אם שני אנשים משנים את אותו שדה, הכתיבה האחרונה מנצחת.</p>
    <div class="actions"><button class="btn pri" data-act="sy-share">📤 שלח קישור הצטרפות</button><button class="btn" data-act="sy-now">⟳ סנכרן עכשיו</button><button class="btn del" data-act="sy-off">נתק</button></div></div>`;
}
function drawTop() { const t = $('#top'); if (t) t.innerHTML = `<span class="brand">${esc(T.title)}</span>` + countdown(); }
(function () { // join via ?sync=
  const u = new URLSearchParams(location.search).get('sync');
  if (u && /^https:\/\//.test(u) && u !== SY.url) { if (confirm('לחבר את המכשיר הזה לסנכרון הטיול?')) joinSync(u, false); history.replaceState(null, '', location.pathname); }
  else if (u) history.replaceState(null, '', location.pathname);
})();

// ---------- events ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act, id = t.dataset.id;
  if (a === 'tab') { S.tab = t.dataset.k; save(); render(); scrollTo(0, 0); }
  else if (a === 'day') { S.day = id; save(); render(); }
  else if (a === 'cycle') { const x = allBookables().find(b => b.id === id); if (x) { S.status[id] = NEXT[stOf(x)]; if (x.slot && ['sent', 'booked'].includes(S.status[id]) && !pickOf(x.slot)) S.pick[x.slot] = x.id; save(); keepOpen(); } }
  else if (a === 'sy-enable') { t.disabled = true; t.textContent = 'מתחבר…'; enableSync().then(() => { render(); toast('סנכרון הופעל'); }).catch(() => { SY.url = ''; saveSy(); render(); alert('לא הצלחתי ליצור מסמך משותף. אפשר להשתמש בכתובת Firebase (ראו "יש לי כתובת").'); }); }
  else if (a === 'sy-share') { const l = shareLink(); if (navigator.share) navigator.share({ title: 'טיול הונגריה', url: l }).catch(() => { }); else (navigator.clipboard?.writeText(l) || Promise.reject()).then(() => toast('הקישור הועתק')).catch(() => prompt('העתיקו:', l)); }
  else if (a === 'sy-now') { syncNow().then(() => render()); }
  else if (a === 'sy-off') { if (confirm('לנתק את הסנכרון? הנתונים נשארים במכשיר.')) { SY.url = ''; SY.meta = {}; SY.last = {}; saveSy(); render(); } }
  else if (a === 'mapimg') { showMapImg(T.days.find(x => x.id === t.dataset.day), t.dataset.m); }
  else if (a === 'mapall') { t.disabled = true; saveAllMaps(t).then(() => { t.disabled = false; render(); }); }
  else if (a === 'ownimg') showOwn(t.dataset.d, +t.dataset.i);
  else if (a === 'vclose') { const v = $('#viewer'); if (v) v.hidden = true; if (S.tab === 'map') markSaved(focusDay()); }
  else if (a === 'vrefresh') { showMapImg(T.days.find(x => x.id === t.dataset.day), t.dataset.m, true); }
  else if (a === 'vshare') { const dd = T.days.find(x => x.id === t.dataset.day); idbGet(dd.id + '-' + t.dataset.m).then(r => { const f = new File([r.blob], `hungary-${dd.id}.png`, { type: 'image/png' }); if (navigator.canShare?.({ files: [f] })) navigator.share({ files: [f] }).catch(() => { }); else toast('השיתוף לא נתמך — השתמשו ב"שמור"'); }); }
  else if (a === 'mapmode') { S.mapMode = t.dataset.m; save(); render(); }
  else if (a === 'locate') { locate(); }
  else if (a === 'visit') { const dd = t.dataset.day, m = (S.walk[dd] ||= {}); m[id] = t.type === 'checkbox' ? t.checked : !m[id]; save(); render(); }
  else if (a === 'copysum') { const msg = summaryText(t.dataset.l); (navigator.clipboard?.writeText(msg) || Promise.reject()).then(() => toast(t.dataset.l === 'en' ? 'Copied' : 'הועתק — אפשר להדביק בווטסאפ')).catch(() => prompt('העתיקו:', msg)); }
  else if (a === 'pick') { const s = t.dataset.slot; S.pick[s] = pickOf(s) === id ? '' : id; save(); keepOpen(); }
  else if (a === 'gotoday') { S.day = id; S.tab = 'day'; save(); render(); scrollTo(0, 0); }
  else if (a === 'rphotos') { const g = document.querySelector(`[data-rgal="${CSS.escape(id)}"]`); if (g) { g.hidden = !g.hidden; if (!g.hidden && !g.dataset.l) { g.dataset.l = 1; fillGal(g, [], t.dataset.q, t.dataset.q + ' Hungary'); } } }
  else if (a === 'vote') { const v = (S.vote[id] ||= {}), w = t.dataset.who; v[w] = v[w] === t.dataset.v ? '' : t.dataset.v; save(); keepOpen(); }
  else if (a === 'names') { const n0 = prompt('שם ראשון (אתה):', S.names[0]), n1 = prompt('שם שני:', S.names[1]); if (n0) S.names[0] = n0; if (n1) S.names[1] = n1; save(); render(); }
  else if (a === 'delrest') { for (const k in S.customRest) S.customRest[k] = S.customRest[k].filter(r => r.id !== id); save(); render(); }
  else if (a === 'deltask') { S.customTasks = S.customTasks.filter(x => x.id !== id); save(); render(); }
  else if (a === 'delexp') { S.expenses.splice(+id, 1); save(); render(); }
  else if (a === 'copymail') { const msg = bookMsg(allBookables().find(b => b.id === id) || {}); (navigator.clipboard?.writeText(msg) || Promise.reject()).then(() => toast('ההודעה הועתקה')).catch(() => prompt('העתיקו:', msg)); }
  else if (a === 'export') { const b = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }), l = document.createElement('a'); l.href = URL.createObjectURL(b); l.download = 'hungary-trip-backup.json'; l.click(); }
  else if (a === 'reset') { if (confirm('למחוק את כל הסימונים וההערות?')) { S = blank(); save(); render(); } }
});
function keepOpen() { // re-render but preserve open <details>
  const open = [...document.querySelectorAll('details[open]')].map(x => x.dataset.id).filter(Boolean), y = scrollY;
  render(); open.forEach(i => { const el = document.querySelector(`details[data-id="${i}"]`); if (el) el.open = true; }); scrollTo(0, y);
}
document.addEventListener('change', e => {
  const t = e.target, a = t.dataset?.act;
  if (a === 'task') { S.tasks[t.dataset.id] = t.checked; save(); keepOpen(); }
  else if (a === 'pack') { S.packing[t.dataset.id] = t.checked; save(); t.closest('.task').classList.toggle('done', t.checked); }
  else if (a === 'flight') { S.flight = t.value; save(); keepOpen(); }
  else if (t.id === 'imp') { const f = t.files[0]; if (!f) return; f.text().then(x => { try { S = Object.assign(blank(), JSON.parse(x)); save(); render(); toast('יובא בהצלחה'); } catch { toast('קובץ לא תקין'); } }); }
});
document.addEventListener('input', e => {
  const t = e.target, a = t.dataset?.act;
  if (a === 'bk') { (S.booking[t.dataset.id] ||= {})[t.dataset.k] = t.type === 'checkbox' ? t.checked : t.value; save(); if (t.type === 'checkbox' || t.type === 'date') keepOpen(); }
  else if (a === 'note') { S.notes[t.dataset.id] = t.value; save(); }
});
document.addEventListener('submit', e => {
  const f = e.target, a = f.dataset?.act; if (!a) return; e.preventDefault();
  const v = Object.fromEntries(new FormData(f));
  if (a === 'sy-url') { joinSync(v.url, !!v.fresh); render(); return; }
  if (a === 'addtask') S.customTasks.push({ id: 'c' + Date.now(), text: v.text, custom: true });
  if (a === 'addexp') S.expenses.push({ id: 'e' + Date.now(), what: v.what, amt: v.amt, cur: v.cur });
  if (a === 'addrest') (S.customRest[f.dataset.day] ||= []).push({ id: 'cr' + Date.now(), name: v.name, kind: v.kind, desc: v.desc, maps: v.name + ' ' + 'Hungary', book: !!v.book, status: 'need', custom: true });
  save(); render();
});
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1800); }

// ---------- auto-update check: if a newer build was published, reload to it ----------
async function checkUpdate(first) {
  try {
    const r = await fetch('version.json?_=' + Date.now(), { cache: 'no-store' }); if (!r.ok) return;
    const v = (await r.json()).v; if (!v || v === BUILD) { try { sessionStorage.removeItem('reloaded'); } catch { } return; }
    let tried = false; try { tried = sessionStorage.getItem('reloaded') === v; } catch { }
    if (tried) return;
    const go = async () => { try { sessionStorage.setItem('reloaded', v); const rs = await navigator.serviceWorker?.getRegistrations(); rs && await Promise.all(rs.map(x => x.unregister())); const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } catch { } location.reload(); };
    if (first) return go();
    const t = $('#toast'); t.innerHTML = 'יש גרסה חדשה של האתר — <button class="btn pri" id="upd" style="height:28px;margin-inline-start:8px">עדכן עכשיו</button>'; t.classList.add('on'); t.style.pointerEvents = 'auto'; $('#upd').onclick = go;
  } catch { }
}
setInterval(() => { if (!document.hidden) checkUpdate(false); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkUpdate(false); });
checkUpdate(true);

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
