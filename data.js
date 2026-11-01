// ===== נתוני הטיול =====
// זה הקובץ שמעדכנים כשהתוכנית משתנה (אפשר גם לבקש מ-Claude).
// book:true = פריט שדורש הזמנה/תיאום -> מופיע עם מרובע 🟥 עד שמסמנים "הוזמן".
// status: ברירת מחדל ('booked' | 'need' | 'na').
// wiki = שמות ערכים בוויקיפדיה (אנגלית) ממנה נטענות תמונות.

window.TRIP = {
  title: "טיול יום הולדת של גיא וענת הונגריה",
  subtitle: "12 עד 16 בנובמבר 2026 · אגר + בודפשט",
  start: "2026-11-12",
  end: "2026-11-16",

  lodging: [
    { id: "hotel-eger", site: "https://booking.com/hotel/hu/imola-plata-n.en-gb.html", phone: "+3636513888", name: "Imola Hotel Platán - Adults Only, אגר", dates: "12–15.11 (3 לילות)", status: "booked", maps: "Imola Hotel Platán Adults Only Eger", note: "ספא, בריכות חמות וסאונות במלון" },
    { id: "hotel-bud", reserve: "https://www.booking.com/searchresults.html?ss=Budapest&checkin=2026-11-15&checkout=2026-11-16&group_adults=2&lang=en-gb", bk: "חיפוש מלונות בבודפשט ל-15–16.11 ל-2 מבוגרים. רצוי לסנן: חניה + צ'ק-אין מוקדם/ביטול חינם.", name: "מלון במרכז בודפשט (טרם נבחר)", dates: "15–16.11 (לילה אחד)", status: "need", maps: "hotels near St. Stephen's Basilica Budapest", note: "רצוי עם חניה — יש רכב שכור עד הבוקר האחרון" },
  ],

  weather: { // לתחזית חיה (open-meteo)
    "d1": [47.90, 20.37], "d2": [48.08, 20.61], "d3": [47.89, 20.43], "d4": [47.50, 19.05], "d5": [47.50, 19.05]
  },

  days: [
    {
      id: "d1", date: "2026-11-12", dow: "חמישי", emoji: "🛬", title: "נחיתה, העיר אגר והמלון",
      sunset: "~15:55",
      summary: "יום מעבר רגוע: נוחתים ב-08:55 (LY2365), לוקחים רכב ונוסעים כשעה וחצי–שעתיים לאגר. צהריים בעיר העתיקה, סיבוב בכיכר Dobó ובאזור הטירה, צ'ק-אין, ואז ספא וארוחת ערב. החשיכה יורדת סביב 16:00 – לכן הסיבוב בעיר לפני הצ'ק-אין.",
      items: [
        { id: "d1-land", t: "08:55", time: "08:55", icon: "✈️", title: "נחיתה בבודפשט — LY2365, טרמינל 2B", desc: "המראה מתל אביב ב-06:20, נחיתה 08:55. ביקורת דרכונים ואיסוף מזוודות. כדאי לוודא מראש אם נדרש אישור כניסה (ETIAS) — ראו משימות.", maps: "Budapest Airport BUD" },
        { id: "d1-car", t: "10:45", time: "10:45–11:00", icon: "🚗", title: "איסוף הרכב ויציאה לכיוון אגר", desc: "צלמו את הרכב מכל הצדדים בנקודת האיסוף. ודאו שיש ויניטה (e-matrica) לכבישים מהירים, מדיניות דלק, וביטוח. נסיעה ~130 ק״מ בכביש M3.", book: true, status: "booked", bookLabel: "הזמנת רכב", maps: "Budapest Airport car rental" },
        { id: "d1-arrive", t: "12:30", time: "12:30–13:00", icon: "📍", title: "הגעה משוערת לאגר", desc: "חניה בעיר העתיקה בד״כ בתשלום (אזורים בצבעים) — מומלץ לחנות ליד הכיכר ולהסתובב ברגל.", maps: "Eger city center parking" },
        { id: "d1-lunch", t: "13:00", time: "13:00–14:30", icon: "🍽️", title: "ארוחת צהריים בעיר העתיקה", desc: "כמה אפשרויות מוצעות בלשונית 'אוכל' של היום. בנובמבר יש מסעדות שסגורות באמצע השבוע — כדאי לאמת.", wiki: [] },
        { id: "d1-dobo", hours: "לא אומת רשמית. מקורות סותרים: מוזיאון הטירה בחורף כנראה 10:00–16:00 וסגור בשני (מקור משנת 2022), שערי הטירה פתוחים ~06:00–22:00 (נתון קיץ). ביום חמישי המוזיאון אמור להיות פתוח אבל קרוב לסגירה — לכן הקדמתי להגעה ב-14:30.", hl: "warn", t: "14:30", time: "14:30–16:00", icon: "🏰", title: "כיכר Dobó, סמטאות העיר וטירת אגר", desc: "הלב ההיסטורי של אגר: כיכר Dobó István עם הכנסייה והבארוק הצבעוני, והטירה שעל שמה נקשר המצור העות׳מאני של 1552, שבו כמה מאות מגינים הונגרים עצרו צבא עות׳מאני ענק. ליד העיר המינרט העות׳מאני הצפוני ביותר באירופה. האור נגמר מוקדם — כדאי לראות את הטירה לפני החשכה ולבדוק שעות פתיחה.", wiki: ["Eger_Castle", "Eger", "Minaret_of_Eger"], maps: "Eger Castle" },
        { id: "d1-checkin", t: "16:00", time: "16:00–16:30", icon: "🏨", title: "צ'ק-אין ב-Imola Hotel Platán - Adults Only", hours: "אומת: צ'ק-אין מ-14:00, צ'ק-אאוט עד 10:00 (Booking/Hotels). מסרתם: מבוגרים בלבד 16+, חניה תת־קרקעית — לא אימתתי (באינטרנט מופיעה חניה בתשלום). טלפון לבירור: +36 36 513 888.", hl: "ok", desc: "ההזמנה אושרה. אפשר להיכנס כבר מ-14:00 — אם מגיעים מוקדם מהתוכנית, אפשר לבקש כניסה קדימה. כדאי לשמור כאן את מספר האישור.", book: true, status: "booked", bookLabel: "מלון אגר", maps: "Imola Hotel Platán Adults Only Eger" },
        { id: "d1-spa", hours: "שעות הספא של Imola Hotel Platán לא נמצאו אונליין. טלפון המלון לפי רישום: +36 36 513 888 — לברר שעות וכניסה (Adults Only).", hl: "unk", t: "17:00", time: "17:00–19:00", icon: "♨️", title: "ספא, בריכות חמות וסאונות", desc: "אגר ידועה במים תרמליים. כדאי לברר מראש במלון: שעות הספא, וציוד נדרש (כובע רחצה, כפכפים, מגבות). בבריכות שחייה בהונגריה לרוב נדרש כובע, בבריכות תרמליות פחות — לא אומת במלון הזה.", wiki: [] },
        { id: "d1-dinner", t: "20:00", time: "ערב", icon: "🍷", title: "ארוחת ערב במלון או במרכז אגר", desc: "אפשרויות בלשונית 'אוכל'. אם בוחרים מסעדה פופולרית — כדאי להזמין שולחן.", wiki: [] },
      ],
      slots: [{"id": "d1-lunch", "label": "צהריים · אגר העתיקה"}, {"id": "d1-dinner", "label": "ארוחת ערב"}],
      restaurants: [
        {"id": "r-d1-hbh", "slot": "d1-lunch", "name": "HBH Bavarian Beerhouse (HBH Sörház)", "kind": "🥩 צהריים · בירה ואוכל כבד", "desc": "ליד כיכר Dobó. לפי ביקורות: מנות ענק, מחירים נוחים, שניצל ומנות בשר ודגים; אווירת בית בירה חמימה לנובמבר.", "maps": "HBH Sörház Eger", "book": false, "status": "na", "suggested": true, "hours": "לא אומתו שעות פתיחה בנובמבר.", "hl": "unk", "info": "https://visiteger.com/en/wine-gastronomy/restaurants/hbh-bavarian-beerhouse"},
        {"id": "r-d1-palacsinta", "slot": "d1-lunch", "name": "Palacinta Ház", "kind": "צהריים קליל · קרפים", "desc": "בית קפה/ביסטרו שמתמחה בקרפים מלוחים ומתוקים. קליל, פחות 'בשרי'.", "maps": "Palacinta Ház Eger", "book": false, "status": "na", "suggested": true, "hours": "לא אומתו שעות פתיחה בנובמבר.", "hl": "unk"},
        {"id": "r-d1-kodmon", "slot": "d1-dinner", "name": "Ködmön Csárda", "kind": "🥩 ערב · הונגרי מסורתי + אווירה", "desc": "בניין בן כ-250 שנה בעמק Szépasszony, אוכל הונגרי ביתי (ביקורות מציינות מרק גולאש) ומוזיקה צוענית חיה. אווירה כפרית — הערה: זה גם מסעדת יין, אבל התפריט עיקרו אוכל.", "maps": "Ködmön Csárda Eger Szépasszony-völgy", "book": true, "status": "need", "suggested": true, "hours": "אתר התיירות מציין לפעמים 12:00–22:00 (נתון ישן). לאמת.", "hl": "warn", "site": "https://kodmoncsarda.hu", "phone": "+3636413172", "email": "info@kodmoncsarda.hu", "info": "https://visiteger.com/en/wine-gastronomy/restaurants/kodmon-csarda-and-wine-restaurant", "bk": "אין הזמנה אונליין שמצאתי — טלפון או מייל."},
        {"id": "r-d1-hotel", "slot": "d1-dinner", "name": "ארוחה במלון", "kind": "גיבוי נוח אחרי ספא", "desc": "בלי נסיעה. לברר אם יש ארוחת ערב ובאילו שעות (+36 36 513 888 לפי רישום).", "maps": "Imola Hotel Platán Adults Only Eger", "book": false, "status": "na", "suggested": true, "hours": "לא נמצא מידע אונליין.", "hl": "unk", "phone": "+3636513888", "info": "https://booking.com/hotel/hu/imola-plata-n.en-gb.html"},
      ],
    },
    {
      id: "d2", date: "2026-11-13", dow: "שישי", emoji: "🌲", title: "לילאפורד והרי Bükk",
      sunset: "~15:50",
      summary: "יום טבע: ארוחת בוקר ויציאה ב-09:45 ללילאפורד (כשעה וחצי נסיעה). אגם Hámori, מלון הארמון, הגנים התלויים ומפל Szinva, ואולי סיור במערת Anna. חוזרים לאגר עד ~16:30, לפני שמחשיך. יום גמיש — אפשר להחליף עם שבת לפי מזג האוויר.",
      note: "סיור מערת Anna עשוי להיות מוקדם יותר; יש לבדוק שעות ולהתאים את סדר היום (מערת Szent István לא בתוכנית).",
      items: [
        { id: "d2-bf", t: "09:00", time: "09:00", icon: "🥐", title: "ארוחת בוקר במלון" },
        { id: "d2-drive", t: "09:45", time: "09:45", icon: "🚗", title: "יציאה לכיוון לילאפורד", desc: "כביש הררי — בנובמבר ייתכנו ערפל, גשם או קרח בבוקר. נהיגה בזהירות.", maps: "Lillafüred" },
        { id: "d2-lake", hours: "אגם והליכה: שטח פתוח, אין שעות פתיחה.", hl: "ok", t: "11:00", time: "11:00–12:00", icon: "🌊", title: "אגם Hámori, תצפיות והליכה נינוחה", desc: "אגם ציורי בלב הרי Bükk, ממנו מתחילים השבילים. הליכה קלה לאורך המים עם הרבה צבעי סתיו.", wiki: ["Lillafüred", "Bükk_Mountains"], maps: "Hámori-tó Lillafüred" },
        { id: "d2-cave", hours: "לא אומת רשמית. מקור לא רשמי: בחורף יש סיור אחד ביום ב-12:00; מקור אחר: סיורים כל שעה עגולה. 12:00 מתאים לשני התרחישים, אבל כדאי להתקשר/לבדוק באתר פארק Bükk לפני.", hl: "warn", t: "12:00", time: "12:00 (לאמת)", icon: "🕳️", title: "מערת Anna (Anna-barlang), לילאפורד", desc: "המערה שבחרתם. שעות הסיורים בנובמבר מצומצמות ועשויות להיות בבוקר, ולכן כדאי לאמת מראש ולהתאים את סדר היום (אולי לפתוח בה את היום, לפני האגם). לא כוללת את מערת Szent István.", book: true, status: "need", bookLabel: "סיור במערת Anna", maps: "Anna-barlang Lillafüred", wiki: ["Anna_Cave"] },
        { id: "d2-lunch", t: "13:00", time: "13:00–13:45", icon: "☕", title: "ארוחת צהריים או קפה", desc: "אפשרויות בלשונית 'אוכל'.", wiki: [] },
        { id: "d2-palace", hours: "לא נמצאו שעות רשמיות לגנים התלויים והמפל (שטחים פתוחים ברגל). מסעדות המלון פתוחות לציבור, אך שעות לא אומתו. הספא של המלון בנפרד.", hl: "unk", t: "13:45", time: "13:45–14:45", icon: "🏛️", title: "מלון הארמון, הגנים התלויים ומפל Szinva", desc: "מלון הארמון של לילאפורד נבנה בשנות ה-20 בסגנון נאו-רנסנס ונחשב לאחד המבנים המרשימים בהונגריה. מתחתיו הגנים התלויים ומפל Szinva — מפל מלאכותי ידוע, אולי פחות מרשים בחורף.", wiki: ["Lillafüred", "Szinva"], maps: "Palace Hotel Lillafüred" },
        { id: "d2-back", t: "15:00", time: "15:00–16:15", icon: "🌅", title: "חזרה משוערת לאגר", desc: "החשכה סביב 16:00 — לא כדאי לנסוע בכבישי הרים בחושך." },
        { id: "d2-eve", t: "19:00", time: "ערב", icon: "🍷", title: "ספא במלון וארוחת ערב", desc: "אפשרויות בלשונית 'אוכל'." },
      ],
      slots: [{"id": "d2-lunch", "label": "צהריים · לילאפורד"}, {"id": "d2-dinner", "label": "ארוחת ערב · אגר"}],
      restaurants: [
        {"id": "r-d2-palota", "slot": "d2-lunch", "name": "מלון הארמון — מסעדת Hunyadi", "kind": "צהריים/קפה · אווירת ארמון", "desc": "המסעדה בארמון (נבנה 1927–30). ברשימות Hunyadi מצוינת לבוקר וערב — לא ברור שיש צהריים; אפשר רק קפה ועוגה בקומת הכניסה.", "maps": "Hotel Palota Lillafüred Erzsébet sétány 1", "book": true, "status": "need", "suggested": true, "hours": "לא אומת שיש שירות צהריים.", "hl": "warn", "phone": "+3646400126", "bk": "לא מצאתי אתר הזמנה. הטלפון לפי Kayak — לאמת. כתובת: Erzsébet sétány 1."},
        {"id": "r-d2-tokert", "slot": "d2-lunch", "name": "Hotel Tókert Szálloda és Étterem", "kind": "צהריים · על שפת האגם", "desc": "ליד אגם Hámori, נוף לאגם לפי ביקורות.", "maps": "Hotel Tókert Lillafüred", "book": true, "status": "need", "suggested": true, "hours": "לא אומתו שעות פתיחה.", "hl": "unk"},
        {"id": "r-d2-hbh", "slot": "d2-dinner", "name": "HBH Bavarian Beerhouse (HBH Sörház)", "kind": "🥩 ערב · מנות גדולות", "desc": "אחרי יום הרים: מנות ענק לפי ביקורות, אווירת בית בירה חמה.", "maps": "HBH Sörház Eger", "book": false, "status": "na", "suggested": true, "hours": "לא אומתו שעות פתיחה בנובמבר.", "hl": "unk", "info": "https://visiteger.com/en/wine-gastronomy/restaurants/hbh-bavarian-beerhouse"},
        {"id": "r-d2-hotel", "slot": "d2-dinner", "name": "ארוחה במלון", "kind": "גיבוי נוח אחרי ספא", "desc": "אם מתעייפים — בלי נסיעה. לברר אם יש ארוחת ערב.", "maps": "Imola Hotel Platán Adults Only Eger", "book": false, "status": "na", "suggested": true, "hours": "לא נמצא מידע אונליין.", "hl": "unk", "phone": "+3636513888"},
      ],
    },
    {
      id: "d3", date: "2026-11-14", dow: "שבת", emoji: "🍷", title: "Noszvaj, כפר המערות וספא",
      sunset: "~15:50",
      summary: "יום רגוע: ארוחת בוקר איטית, נסיעה קצרה לכפר Noszvaj ובתי המערות שלו, זמן חופשי וצהריים באזור, וחזרה למלון לספא ארוך. ערב באגר.",
      items: [
        { id: "d3-bf", t: "09:00", time: "09:00–10:00", icon: "🥐", title: "ארוחת בוקר רגועה במלון" },
        { id: "d3-drive", t: "10:00", time: "10:00", icon: "🚗", title: "נסיעה לכפר Noszvaj", desc: "כ-10–15 דקות מאגר.", maps: "Noszvaj" },
        { id: "d3-caves", hours: "פתוחים כל יום; בנובמבר כנראה עד 16:00 (מידע מכם + מקור אונליין שמציין 10:00–16:00 עונתי). תוכנית 10:30–11:30 נכנסת בחלון.", hl: "ok", t: "10:30", time: "10:30–11:30", icon: "🏘️", title: "בתי המערות של Noszvaj, אם פתוחים", desc: "כפר שבו חלק מהבתים חצובים בסלע טוף. בנובמבר חלק מהאתרים סגורים — כדאי לבדוק לפני הנסיעה.", wiki: ["Noszvaj"], maps: "Noszvaj cave dwellings" },
        { id: "d3-free", t: "11:30", time: "11:30–13:00", icon: "🚶", title: "זמן חופשי בכפר ובסביבה", desc: "במקום ביקור ביקב: הליכה בכפר, קפה, או חזרה לאגר לראות את טירת אגר/המינרט אם לא הספקתם. גמיש לפי מזג האוויר.", maps: "Noszvaj", wiki: [] },
        { id: "d3-lunch", t: "13:00", time: "13:00–14:00", icon: "🍽️", title: "ארוחת צהריים באזור", desc: "אפשרויות בלשונית 'אוכל'." },
        { id: "d3-back", t: "14:00", time: "14:00–14:30", icon: "🏨", title: "חזרה למלון" },
        { id: "d3-spa", t: "14:30", time: "14:30–18:30", icon: "♨️", title: "ספא, סאונות ומנוחה" },
        { id: "d3-dinner", t: "19:30", time: "ערב", icon: "🍷", title: "ארוחת ערב טובה באגר", desc: "הארוחה המשמעותית של הטיול באגר — כדאי להזמין מראש." },
      ],
      slots: [{"id": "d3-lunch", "label": "צהריים · Noszvaj"}, {"id": "d3-dinner", "label": "ארוחת ערב טובה · אגר"}],
      restaurants: [
        {"id": "r-d3-delamotte", "slot": "d3-lunch", "name": "De la Motte Étterem", "kind": "צהריים · מטבח ביתי", "desc": "מסעדה ב-Noszvaj, מטבח לפי מתכונים משפחתיים (Szomolyai út, Noszvaj).", "maps": "De la Motte Étterem Noszvaj Szomolyai út", "book": true, "status": "need", "suggested": true, "hours": "לא אומתו שעות בנובמבר.", "hl": "unk", "info": "https://www.programturizmus.hu/partner-de-la-motte-etterem-noszvaj.html", "bk": "לא מצאתי אתר/הזמנה. ייתכן שמתואם דרך המלון הצמוד (לא אומת)."},
        {"id": "r-d3-panorama", "slot": "d3-lunch", "name": "Panorama Hotel Noszvaj — מסעדה", "kind": "צהריים בכפר", "desc": "מסעדת מלון: מוגשות ארוחות בוקר, צהריים וערב לפי רישום.", "maps": "Panorama Hotel Noszvaj", "book": true, "status": "need", "suggested": true, "hours": "לא אומתו שעות.", "hl": "unk", "info": "https://www.programturizmus.hu/partner-panorama-hotel-noszvaj.html", "site": "https://booking.com/hotel/hu/panorama-noszvaj.en-gb.html"},
        {"id": "r-d3-feher", "slot": "d3-dinner", "name": "Fehér Szarvas Vadásztanya", "kind": "🥩 ערב · בית ציד, בשר ואווירה", "desc": "בית ציד ידוע באגר: מתמחה בבשרי ציד, ברווז ואווז; מרתף עם גביעי ציד (Lonely Planet). מתאים במיוחד לסתיו/חורף ולאוהבי בשר ואווירה.", "maps": "Fehér Szarvas Vadásztanya Eger Klapka", "book": true, "status": "need", "suggested": true, "hours": "לא אומתו שעות. שבת — להזמין.", "hl": "warn", "phone": "+3636411129", "info": "https://www.frommers.com/destinations/eger/restaurants", "bk": "לא מצאתי אתר או הזמנה אונליין. הטלפון מ-Frommer's (ייתכן ישן) — לאמת, וגם את הכתובת (Klapka u. 4 או 8)."},
        {"id": "r-d3-kodmon", "slot": "d3-dinner", "name": "Ködmön Csárda", "kind": "🥩 ערב · הונגרי מסורתי + מוזיקה", "desc": "אלטרנטיבה: בניין בן 250 שנה, אוכל ביתי ומוזיקה צוענית חיה.", "maps": "Ködmön Csárda Eger Szépasszony-völgy", "book": true, "status": "need", "suggested": true, "hours": "לאמת שעות. להזמין שולחן.", "hl": "warn", "site": "https://kodmoncsarda.hu", "phone": "+3636413172", "email": "info@kodmoncsarda.hu", "info": "https://visiteger.com/en/wine-gastronomy/restaurants/kodmon-csarda-and-wine-restaurant", "bk": "אין הזמנה אונליין שמצאתי — טלפון או מייל."},
      ],
    },
    {
      id: "d4", date: "2026-11-15", dow: "ראשון", emoji: "🎄", title: "בודפשט ושוק הכריסמס",
      sunset: "~15:50",
      summary: "צ'ק-אאוט מאגר ונסיעה של כשעה וחצי–שעתיים לבודפשט. צהריים, צ'ק-אין והליכה במרכז, בזיליקת אישטוון הקדוש, שוק הכריסמס Advent Bazilika עם מופע האורות על חזית הבזיליקה ואז שוק Vörösmarty ואחריו ארוחת ערב במרכז.",
      items: [
        { id: "d4-out", t: "08:30", time: "08:30–10:00", icon: "🧖", title: "ארוחת בוקר, ספא קצר וצ'ק-אאוט (עד 10:00)", desc: "הצ'ק-אאוט בבית המלון הוא עד 10:00, והיציאה לבודפשט ב-10:30. כדי שלא להילחץ: ספא קצר מאוד, או לשאול אם אפשר צ'ק-אאוט מאוחר/להשאיר מזוודות ברכב.", hours: "אומת: צ'ק-אאוט עד 10:00.", hl: "ok" },
        { id: "d4-drive", t: "10:30", time: "10:30", icon: "🚗", title: "יציאה לכיוון בודפשט", desc: "נסיעה כשעה וחצי–שעתיים ב-M3.", maps: "Budapest city center" },
        { id: "d4-arrive", t: "12:30", time: "12:30–13:00", icon: "📍", title: "הגעה משוערת לעיר" },
        { id: "d4-lunch", t: "13:00", time: "13:00–14:00", icon: "🍽️", title: "ארוחת צהריים", desc: "אפשרויות בלשונית 'אוכל'." },
        { id: "d4-hotel", t: "14:00", time: "14:00–15:00", icon: "🏨", title: "צ'ק-אין במלון וטיול רגלי במרכז", desc: "המלון עוד לא הוזמן! חניה במרכז יקרה — מומלץ מלון עם חניה, או חניון ציבורי.", book: true, status: "need", bookLabel: "מלון בודפשט", maps: "hotels Budapest center parking" },
        { id: "d4-basilica", hours: "לא אומת רשמית. כיפת הפנורמה בנפרד מהכנסייה; מקור לא רשמי: נובמבר–מרץ כ-10:00–16:30. הכנסייה ביום ראשון לפי מקור אחד פתוחה רק מ-13:00 (תפילות בבוקר). הקדמתי ל-15:00 כדי להספיק את הכיפה לפני הסגירה.", hl: "warn", t: "15:00", time: "15:00–16:30", icon: "⛪", title: "בזיליקת אישטוון הקדוש והרחובות הסמוכים", desc: "הכנסייה הגדולה בבודפשט, בניין נאו-קלאסי עם כיפה גבוהה. אפשר לעלות לכיפה לנוף על העיר (בדקו שעות).", wiki: ["St._Stephen's_Basilica"], maps: "St. Stephen's Basilica Budapest" },
        { id: "d4-advent", hours: "אומת (אתר הארגון + כמה מקורות): הפסטיבל נפתח 13.11.2026 ועד 1.1.2027, הצגת האורות על חזית הבזיליקה כל יום מ-17:30. שעות השוק: ראשון 11:00–22:00.", hl: "ok", t: "17:30", time: "17:30–19:00", icon: "✨", title: "שוק הכריסמס Advent Bazilika ומופע האורות", desc: "שוק כריסמס מול הבזיליקה עם מופע אורות על חזית הכנסייה. הפסטיבל נפתח ב-13.11, ולכן יהיה פתוח.", wiki: ["Christmas_market"], maps: "Advent Bazilika Budapest" },
        { id: "d4-vorosmarty", hours: "נפתח 13.11.2026 (רוב המקורות, ותואם למה שמסרתם). ראשון: 11:00–21:00. מומלץ בכל זאת לאמת באתר השוק לפני.", hl: "ok", t: "19:00", time: "19:00–20:00", icon: "🎄", title: "שוק הכריסמס בכיכר Vörösmarty", desc: "השוק הוותיק והמפורסם ביותר בבודפשט, ליד קפה Gerbeaud. לפי המקורות נפתח ב-13.11, ולכן סביר שפתוח.", wiki: ["Vörösmarty_Square"], maps: "Vörösmarty tér Budapest" },
        { id: "d4-dinner", t: "20:00", time: "20:00", icon: "🍷", title: "ארוחת ערב במרכז העיר", desc: "הזמנה מראש חשובה ללילה האחרון.", wiki: [] },
      ],
      slots: [{"id": "d4-lunch", "label": "צהריים · בודפשט"}, {"id": "d4-dinner", "label": "ארוחת ערב · בודפשט"}],
      restaurants: [
        {"id": "r-d4-hungarikum", "slot": "d4-lunch", "name": "Hungarikum Bisztro", "kind": "צהריים · קלאסיקות הונגריות", "desc": "חדר קטן בסגנון ישן, מנות הונגריות קלאסיות; הזמנות אונליין בלבד ומתמלא מהר.", "maps": "Hungarikum Bisztro Budapest", "book": true, "status": "need", "suggested": true, "hours": "לא אומת שפתוח ביום ראשון.", "hl": "warn"},
        {"id": "r-d4-karavan", "slot": "d4-lunch", "name": "Karavan Street Food (Kazinczy)", "kind": "צהריים מהיר", "desc": "מתחם דוכני אוכל רחוב ליד הרובע היהודי; לא דורש הזמנה.", "maps": "Karavan Street Food Budapest", "book": false, "status": "na", "suggested": true, "hours": "לא אומתו שעות פתיחה בנובמבר.", "hl": "unk"},
        {"id": "r-d4-pampas", "slot": "d4-dinner", "name": "Pampas Steakhouse", "kind": "🥩 ערב · סטייקים, אווירה דרום-אמריקאית", "desc": "מסעדת סטייקים ארגנטינאית מדורגת גבוה; מתוארת עם אווירה דרום-אמריקאית. הזמנה ב-OpenTable לפי הדירוג שמצאתי.", "maps": "Pampas Steakhouse Budapest", "book": true, "status": "need", "suggested": true, "hours": "לא אומת שפתוח ביום ראשון.", "hl": "warn", "info": "https://hungaryunlocked.com/best-steakhouse-budapest-pampas-local-review/"},
        {"id": "r-d4-baltazar", "slot": "d4-dinner", "name": "Baltazár Grill", "kind": "🥩 ערב · גריל Josper בבודה", "desc": "גריל Josper ברובע טירת בודה. האתר שלהם מציע הזמנה אונליין. יהיה צריך לבדוק מרחק מהמלון.", "maps": "Baltazár Grill Budapest", "book": true, "status": "need", "suggested": true, "hours": "לא אומת שפתוח ביום ראשון.", "hl": "warn"},
      ],
    },
    {
      id: "d5", date: "2026-11-16", dow: "שני", emoji: "🏠", title: "חזרה הביתה",
      sunset: "~15:50",
      summary: "טיסה LY2366 ממריאה ב-10:35 מטרמינל 2B, ולכן היום מתחיל מוקדם: יציאה מהמלון סביב 05:45, תדלוק, החזרת הרכב ועד ~07:35 בטרמינל. נוחתים בתל אביב ב-14:45. כדאי לתאם עם המלון ארוחת בוקר ארוזה או יציאה מוקדמת.",
      flight: true,
      items: [
        { id: "d5-out", t: "05:45", time: "05:45", icon: "🧳", title: "צ'ק-אאוט ויציאה מהמלון", desc: "לשאול את המלון מראש על ארוחת בוקר ארוזה (breakfast box) ועל תשלום/סגירת חשבון בערב הקודם. הנסיעה מהמרכז לשדה כ-35–45 דקות.", maps: "Budapest Liszt Ferenc Airport" },
        { id: "d5-fuel", t: "06:30", time: "06:30–06:45", icon: "⛽", title: "תדלוק לפי תנאי ההשכרה", desc: "מלאו מיכל ליד שדה התעופה אם דרוש. שימרו קבלה.", maps: "gas station near Budapest Airport" },
        { id: "d5-return", t: "07:00", time: "עד 07:05", icon: "🚗", title: "החזרת הרכב בשדה התעופה", desc: "צלמו את הרכב בעת ההחזרה והשאירו זמן לביקורת.", maps: "Budapest Airport car rental return" },
        { id: "d5-checkin", t: "07:35", time: "07:35 (3 שעות לפני)", icon: "🛂", title: "בטרמינל 2B — צ'ק-אין ובידוק", desc: "רשום כרגע 0PC: אין מזוודה כלולה. אם יש מזוודה — לשלם בצ'ק-אין או מראש (יקר יותר בשדה).", maps: "Budapest Airport Terminal 2B" },
        { id: "d5-fly", t: "10:35", time: "10:35 → 14:45", icon: "✈️", title: "טיסה הביתה — LY2366", desc: "המראה 10:35 מבודפשט, נחיתה בנתב״ג 14:45 (טרמינל 3).", maps: "Budapest Airport BUD" },
      ],
      restaurants: [],
    },
  ],

  // משימות פתוחות (מה-PDF + תוספות)
  flightTime: "10:35",
  tasks: [
    { id: "t-hotel-bud", text: "להזמין מלון במרכז בודפשט ללילה 15–16.11 (רצוי עם חניה)", day: "d4", pdf: true },
    { id: "t-caves", text: "לבדוק שעות פעילות וזמינות בסיור במערת Anna בלילאפורד ובבתי המערות ב-Noszvaj", day: "d2", pdf: true },
    { id: "t-restaurants", text: "להזמין מראש מסעדות רצויות ולבדוק פעילות חורף", day: "d1", pdf: true },
    { id: "t-swap", text: "לעקוב אחרי התחזית ולהחליט אם להחליף בין שישי לשבת", day: "d2", pdf: true },
    { id: "t-etias", text: "לוודא אם נדרש אישור כניסה (ETIAS / EES) לתאריכי הנסיעה ולבדוק תוקף דרכון", day: "d1" },
    { id: "t-vignette", text: "לוודא עם חברת ההשכרה שיש ויניטה (e-matrica) לכבישים מהירים", day: "d1" },
    { id: "t-license", text: "לשאול את חברת ההשכרה על רישיון בינלאומי ואמצעי תשלום/פיקדון", day: "d1" },
    { id: "t-insurance", text: "ביטוח נסיעות + כיסוי לרכב שכור", day: "d1" },
    { id: "t-bag", text: "מזוודה: הכרטיסים הם Economy Lite (0PC, בלי כבודה כלולה) — להוסיף מזוודה או לנסוע עם תיק קטן", day: "d1" },
    { id: "t-early", text: "לתאם עם מלון בודפשט יציאה מוקדמת ב-05:45 + ארוחת בוקר ארוזה ולסגור חשבון בערב", day: "d5" },
    { id: "t-esim", text: "eSIM / חבילת גלישה ומפות אופליין", day: "d1" },
    { id: "t-cash", text: "מזומן בפורינט (HUF) לחניה, שווקים וטיפים", day: "d1" },
    { id: "t-castle", text: "לבדוק שעות פתיחה של טירת אגר ומינרט", day: "d1" },
    { id: "t-basilica", text: "לבדוק שעות מופע האורות בבזיליקה ופתיחת שוק Advent", day: "d4" },
  ],

  packing: [
    "דרכונים", "כרטיסי טיסה / אישורי הזמנה", "רישיון נהיגה + כרטיס אשראי", "מטען + מטען נייד", "מתאם שקע (סוג C/F)",
    "בגדי חורף שכבות, כפפות וכובע", "נעלי הליכה אטומות למים", "בגד ים + כפכפים לספא", "מטרייה / מעיל גשם", "תרופות אישיות",
    "אוזניות לנסיעות", "כובע ים לבריכה (לפעמים נדרש)",
  ],

  phrases: [
    ["שלום (פורמלי)", "Jó napot", "יו נאפוט"],
    ["שלום (חברי)", "Szia", "סיאה"],
    ["תודה", "Köszönöm", "קסנום"],
    ["בבקשה", "Kérem", "קרם"],
    ["לחיים", "Egészségedre", "אגשגדרה"],
    ["החשבון, בבקשה", "A számlát kérem", "או סמלט קרם"],
    ["הזמנתי שולחן", "Foglaltam asztalt", "פוגלטם אסטלט"],
    ["טעים מאוד", "Nagyon finom", "נודיון פינום"],
    ["כן / לא", "Igen / Nem", "איגן / נם"],
    ["סליחה", "Elnézést", "אלנזשט"],
  ],

  info: [
    "חירום: 112 (אירופי), משטרה 107, אמבולנס 104.",
    "מטבע: פורינט הונגרי (HUF). קבלות ובתי קפה מקבלים בעיקר כרטיס, שווקים ודוכנים לפעמים מזומן.",
    "טיפ: 10–15% מקובל; בדקו אם 'service charge' כבר כלול בחשבון.",
    "נהיגה: אפס סובלנות לאלכוהול. אורות נמוכים דולקים בכל עת מחוץ לעיר. מהירות: 50 בעיר / 90 בין־עירוני / 130 בכביש מהיר.",
    "חניה: במרכז אגר ובודפשט משלמים באפליקציה/מכונה בימים ושעות מסוימים. בדקו שלטים.",
    "החשכה בנובמבר: סביב 16:00. מתכננים נסיעות הרים בשעות היום.",
  ],

  emailTemplate: "Hello,\nI would like to book a table for 2 on {DATE} at {TIME}.\nName: \nPhone: \nPlease confirm. Thank you!",
};
