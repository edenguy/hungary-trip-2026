(() => {
const T = window.TRIP;
const KEY = 'hu-trip-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const waUrl = q => 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(q);

// ---------- state ----------
let S;
const blank = () => ({ status: {}, booking: {}, tasks: {}, customTasks: [], customRest: {}, notes: {}, expenses: [], packing: {}, flight: '', pick: {}, vote: {}, names: ['גיא','ענת'], tab: 'day', day: null });
function load() { try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = blank(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { } }
load();
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
const ST = { need: ['🟥', 'צריך להזמין', 'need'], booked: ['🟩', 'הוזמן', 'booked'], na: ['⬜', 'לא נדרש', 'na'] };
const NEXT = { need: 'booked', booked: 'na', na: 'need' };
function stOf(x) { return S.status[x.id] || x.status || 'need'; }
function allBookables() {
  const out = [];
  T.lodging.forEach(l => out.push({ ...l, day: l.id === 'hotel-eger' ? 'd1' : 'd4', label: l.name }));
  T.days.forEach(d => {
    d.items.filter(i => i.book).forEach(i => out.push({ ...i, day: d.id, label: i.bookLabel || i.title }));
    const all = [...d.restaurants, ...(S.customRest[d.id] || [])];
    all.filter(r => r.book && (!r.slot || S.pick[r.slot] === r.id)).forEach(r => out.push({ ...r, day: d.id, label: r.name }));
    (d.slots || []).forEach(s => { if (!S.pick[s.id] && all.some(r => r.slot === s.id && r.book && !vetoed(r))) out.push({ id: 'slot:' + s.id, synthetic: true, label: 'לבחור מסעדה: ' + s.label, day: d.id, status: 'need' }); });
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
  if (x.site) L.push(`<a class="btn" target="_blank" rel="noopener" href="${esc(x.site)}">🌐 אתר</a>`);
  if (x.info) L.push(`<a class="btn" target="_blank" rel="noopener" href="${esc(x.info)}">ℹ️ מידע ואווירה</a>`);
  if (x.reserve) L.push(`<a class="btn pri" target="_blank" rel="noopener" href="${esc(x.reserve)}">🗓️ הזמנה</a>`);
  if (x.phone) L.push(`<a class="btn" href="tel:${esc(x.phone)}">📞 ${esc(x.phone)}</a>`);
  if (x.email) L.push(`<a class="btn" href="mailto:${esc(x.email)}?subject=Table%20reservation">✉️ ${esc(x.email)}</a>`);
  if (!x.site && !x.reserve) L.push(`<a class="btn" target="_blank" rel="noopener" href="https://www.google.com/search?q=${encodeURIComponent(nm + ' reservation')}">🔎 חיפוש אתר והזמנה</a>`);
  return `<div class="actions links">${L.join('')}</div>${x.bk ? `<div class="tiny muted">📌 ${esc(x.bk)}</div>` : ''}`;
}
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
  $('#top').innerHTML = `<h1>🍷 ${esc(T.title)}</h1><div class="sub">${esc(T.subtitle)}</div>` + countdown();
  const tabs = [['day', '📅', 'יום'], ['food', '🍽️', 'אוכל'], ['todo', '✅', `משימות${open + ot ? ' ' + (open + ot) : ''}`], ['more', '🧳', 'עוד']];
  $('#nav').innerHTML = tabs.map(([k, i, l]) => `<button class="${S.tab === k ? 'on' : ''}" data-act="tab" data-k="${k}"><span>${i}</span>${l}</button>`).join('');
  const v = { day: viewDay, food: viewFood, todo: viewTodo, more: viewMore }[S.tab];
  $('#app').innerHTML = v(d);
  if (S.tab === 'day') { wireGallery(); }
}
function countdown() {
  const t = today(), s = D(T.start), e = D(T.end);
  let msg;
  if (t < s) msg = `⏳ עוד ${dayDiff(s, t)} ימים לנסיעה`;
  else if (t <= e) msg = `🎒 יום ${dayDiff(t, s) + 1} מתוך ${T.days.length}`;
  else msg = '🏡 הטיול הסתיים — מקווים שנהניתם!';
  const open = openBookings().length;
  return `<div class="pills"><span class="pill">${msg}</span>${open ? `<span class="pill red">🟥 ${open} הזמנות פתוחות</span>` : '<span class="pill green">🟩 הכל הוזמן</span>'}</div>`;
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
    const opts = all.filter(r => r.slot === s.id).sort((x, y) => vetoed(x) - vetoed(y)), p = S.pick[s.id], live = opts.filter(r => !vetoed(r));
    h += `<h4>${esc(s.label)} <small class="muted">${p ? '✅ נבחרה אפשרות' : 'בחרו אחת מ-' + opts.length}</small></h4>`;
    if (!live.length) h += '<p class="warn">⚠️ כל האפשרויות נפסלו — הוסיפו חלופה בלשונית "אוכל".</p>';
    else if (live.length === 1 && !p) h += '<p class="tiny muted">נשארה אפשרות אחת — אפשר לבחור בה.</p>';
    h += opts.map(restHtml).join('');
  });
  const extra = all.filter(r => !r.slot);
  if (extra.length) h += '<h4>עוד</h4>' + extra.map(restHtml).join('');
  return h;
}
function viewDay(d) {
  const next = nowNext(d);
  const opens = allBookables().filter(b => b.day === d.id && stOf(b) === 'need' && !vetoed(b)).length;
  let html = dayChips(d);
  html += `<section class="hero"><div class="hero-top"><span class="big">${d.emoji}</span><div><div class="muted">${d.dow} ${fmt(d.date)} · ${whenLabel(d)}</div><h2>${esc(d.title)}</h2></div></div>
    <p>${esc(d.summary)}</p>
    ${d.note ? `<p class="warn">💡 ${esc(d.note)}</p>` : ''}
    <div class="facts"><span>🌇 שקיעה ${d.sunset}</span><span id="wx-${d.id}">⛅ …</span>${opens ? `<span class="red">🟥 ${opens} לסגור</span>` : '<span class="green">🟩 הכל סגור</span>'}</div></section>`;
  if (d.flight) html += flightBox();
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
function itemHtml(i, next) {
  const hasMore = i.desc || i.wiki?.length || i.maps || i.book;
  return `<details class="item ${next === i.id ? 'next' : ''} ${i.book ? 'b-' + stOf(i) : ''} ${vetoed(i) ? 'vetoed' : ''}" data-wiki="${esc((i.wiki || []).join('|'))}" data-q="${esc(i.maps || '')}" data-id="${i.id}" ${next === i.id ? 'open' : ''}>
    <summary><span class="ic">${i.icon}</span><span class="tt"><small><bdi dir="ltr">${esc(i.time)}</bdi>${next === i.id ? ' · <b class="nowtag">הבא</b>' : ''}</small>${esc(i.title)}</span>${vetoed(i) ? '<span class="dot">🚫</span>' : i.book ? `<span class="dot">${ST[stOf(i)][0]}</span>` : ''}</summary>
    <div class="det">
      ${i.desc ? `<p>${esc(i.desc)}</p>` : ''}
      ${i.hours ? `<div class="hrs hrs-${i.hl || 'unk'}">🕒 <b>${{ ok: 'שעות — אומת', warn: 'שעות — לאמת', unk: 'שעות — לא נמצא' }[i.hl || 'unk']}:</b> ${esc(i.hours)}</div>` : ''}
      ${galOk(i) ? `<div class="gal" data-gal></div><div class="tiny muted">תמונות מ-Wikipedia/Wikimedia לפי חיפוש — להמחשה בלבד · <a target="_blank" rel="noopener" href="${waUrl((i.maps || i.title) + ' Hungary')}">🔎 עוד בגוגל</a></div>` : ''}
      ${i.book ? linksHtml(i, i.bookLabel || i.title) : ''}
      <div class="actions">${i.maps ? `<a class="btn" target="_blank" rel="noopener" href="${mapsUrl(i.maps)}">🗺️ מפה</a><a class="btn" target="_blank" rel="noopener" href="${'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(i.maps)}">🧭 נווט</a>` : ''}${i.book ? statusBtn(i) : ''}</div>
      ${vettable(i) ? vetBar(i) : ''}${vetoed(i) ? `<p class="warn">🚫 נפסל ע״י ${esc(vetoBy(i))} — אפשר לדלג או להחליף במשהו אחר.</p>` : ''}
      ${i.book && !vetoed(i) ? bookingForm(i) : ''}
    </div></details>`;
}
function restHtml(r) {
  const picked = r.slot && S.pick[r.slot] === r.id, dim = r.slot && S.pick[r.slot] && !picked;
  return `<div class="card rest b-${stOf(r)} ${vetoed(r) ? 'vetoed' : ''} ${picked ? 'picked' : ''} ${dim ? 'dim' : ''}"><div class="rh"><div><b>${esc(r.name)}</b><div class="muted">${esc(r.kind || '')}</div></div>${vetoed(r) ? '<span class="st st-na">🚫 נפסל</span>' : r.book ? statusBtn(r) : ''}</div>
    ${r.desc ? `<p>${esc(r.desc)}</p>` : ''}
    ${r.hours ? `<div class="hrs hrs-${r.hl || 'unk'}">🕒 <b>${{ ok: 'שעות — אומת', warn: 'שעות — לאמת', unk: 'שעות — לא נמצא' }[r.hl || 'unk']}:</b> ${esc(r.hours)}</div>` : ''}
    <div class="gal" data-rgal="${esc(r.id)}" hidden></div>
    ${r.book ? linksHtml(r) : (r.info || r.phone || r.site ? linksHtml(r) : '')}
    <div class="actions">${r.slot && !vetoed(r) ? `<button class="btn ${picked ? 'pri' : ''}" data-act="pick" data-slot="${esc(r.slot)}" data-id="${esc(r.id)}">${picked ? '✅ נבחרה' : 'בחרו במסעדה הזו'}</button>` : ''}<a class="btn" target="_blank" rel="noopener" href="${mapsUrl(r.maps || r.name)}">🗺️ מפה</a><button class="btn" data-act="rphotos" data-id="${esc(r.id)}" data-q="${esc(r.name + ' ' + (r.maps || ''))}">📷 תמונות</button><a class="btn" target="_blank" rel="noopener" href="${waUrl(r.name + ' Hungary')}">🔎 גוגל</a>${r.book ? `<button class="btn" data-act="copymail" data-id="${esc(r.id)}">✉️ הודעת הזמנה</button>` : ''}${r.custom ? `<button class="btn del" data-act="delrest" data-id="${esc(r.id)}">מחק</button>` : ''}</div>
    ${vetBar(r)}${vetoed(r) ? `<div class="tiny">🚫 נפסל ע״י ${esc(vetoBy(r))} — בחרו אחת מהחלופות.</div>` : ''}${r.book && !vetoed(r) ? bookingForm(r) : ''}${r.suggested ? '<div class="tiny muted">הצעה של Claude — לאמת שעות פתיחה בנובמבר</div>' : ''}</div>`;
}

// ----- food view -----
function viewFood() {
  let h = `<h2>🍽️ כל המסעדות</h2><div class="legend"><span>🟥 צריך להזמין</span><span>🟩 הוזמן</span><span>⬜ לא נדרש</span></div>`;
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
  let h = `<h2>✅ מה פתוח</h2>`;
  h += `<h3>🟥 הזמנות שעוד לא נסגרו (${b.length})</h3>` + (b.length ? b.map(x => `<div class="card slim b-need"><div class="rh"><div><b>${esc(x.label)}</b><div class="muted">${(T.days.find(d => d.id === x.day) || {}).dow || ''}</div></div>${statusBtn(x)}</div></div>`).join('') : '<p class="muted">הכל הוזמן 🎉</p>');
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
  let h = `<h2>🧳 עוד</h2>`;
  h += `<h3>🎒 רשימת אריזה</h3><div class="card">` + T.packing.map((p, i) => `<label class="task ${S.packing[i] ? 'done' : ''}"><input type="checkbox" data-act="pack" data-id="${i}" ${S.packing[i] ? 'checked' : ''}><span>${esc(p)}</span></label>`).join('') + `</div>`;
  h += `<h3>💶 הוצאות <small class="muted">(סה״כ ${tot.toLocaleString('he-IL')})</small></h3><div class="card">` +
    (S.expenses.map((e, i) => `<div class="exp"><span>${esc(e.what)}</span><b>${(+e.amt).toLocaleString('he-IL')} ${esc(e.cur || '')}</b><button class="x" data-act="delexp" data-id="${i}">✕</button></div>`).join('') || '<p class="muted">עוד אין הוצאות.</p>') +
    `</div><form data-act="addexp" class="row"><input name="what" placeholder="על מה" required><input name="amt" type="number" step="any" placeholder="סכום" required style="max-width:7rem"><select name="cur"><option>₪</option><option>€</option><option>HUF</option></select><button class="btn pri">הוסף</button></form>`;
  h += `<h3>ℹ️ מידע שימושי</h3><div class="card"><ul class="info">${T.info.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
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

// ---------- events ----------
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act, id = t.dataset.id;
  if (a === 'tab') { S.tab = t.dataset.k; save(); render(); scrollTo(0, 0); }
  else if (a === 'day') { S.day = id; save(); render(); }
  else if (a === 'cycle') { const x = allBookables().find(b => b.id === id); if (x) { S.status[id] = NEXT[stOf(x)]; save(); keepOpen(); } }
  else if (a === 'pick') { const s = t.dataset.slot; S.pick[s] = S.pick[s] === id ? '' : id; save(); keepOpen(); }
  else if (a === 'gotoday') { S.day = id; S.tab = 'day'; save(); render(); scrollTo(0, 0); }
  else if (a === 'rphotos') { const g = document.querySelector(`[data-rgal="${CSS.escape(id)}"]`); if (g) { g.hidden = !g.hidden; if (!g.hidden && !g.dataset.l) { g.dataset.l = 1; fillGal(g, [], t.dataset.q, t.dataset.q + ' Hungary'); } } }
  else if (a === 'vote') { const v = (S.vote[id] ||= {}), w = t.dataset.who; v[w] = v[w] === t.dataset.v ? '' : t.dataset.v; save(); keepOpen(); }
  else if (a === 'names') { const n0 = prompt('שם ראשון (אתה):', S.names[0]), n1 = prompt('שם שני:', S.names[1]); if (n0) S.names[0] = n0; if (n1) S.names[1] = n1; save(); render(); }
  else if (a === 'delrest') { for (const k in S.customRest) S.customRest[k] = S.customRest[k].filter(r => r.id !== id); save(); render(); }
  else if (a === 'deltask') { S.customTasks = S.customTasks.filter(x => x.id !== id); save(); render(); }
  else if (a === 'delexp') { S.expenses.splice(+id, 1); save(); render(); }
  else if (a === 'copymail') { const msg = T.emailTemplate; (navigator.clipboard?.writeText(msg) || Promise.reject()).then(() => toast('ההודעה הועתקה')).catch(() => prompt('העתיקו:', msg)); }
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
  if (a === 'addtask') S.customTasks.push({ id: 'c' + Date.now(), text: v.text, custom: true });
  if (a === 'addexp') S.expenses.push({ what: v.what, amt: v.amt, cur: v.cur });
  if (a === 'addrest') (S.customRest[f.dataset.day] ||= []).push({ id: 'cr' + Date.now(), name: v.name, kind: v.kind, desc: v.desc, maps: v.name + ' ' + 'Hungary', book: !!v.book, status: 'need', custom: true });
  save(); render();
});
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 1800); }

render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
