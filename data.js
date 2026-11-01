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
    { id: "hotel-eger", name: "Imola Hotel Platán - Adults Only, אגר", dates: "12–15.11 (3 לילות)", status: "booked", maps: "Imola Hotel Platán Adults Only Eger", note: "ספא, בריכות חמות וסאונות במלון" },
    { id: "hotel-bud", name: "מלון במרכז בודפשט (טרם נבחר)", dates: "15–16.11 (לילה אחד)", status: "need", maps: "hotels near St. Stephen's Basilica Budapest", note: "רצוי עם חניה — יש רכב שכור עד הבוקר האחרון" },
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
        { id: "d1-lunch", t: "13:00", time: "13:00–15:00", icon: "🍽️", title: "ארוחת צהריים בעיר העתיקה", desc: "כמה אפשרויות מוצעות בלשונית 'אוכל' של היום. בנובמבר יש מסעדות שסגורות באמצע השבוע — כדאי לאמת.", wiki: [] },
        { id: "d1-dobo", t: "15:00", time: "15:00–16:00", icon: "🏰", title: "כיכר Dobó, סמטאות העיר וטירת אגר", desc: "הלב ההיסטורי של אגר: כיכר Dobó István עם הכנסייה והבארוק הצבעוני, והטירה שעל שמה נקשר המצור העות׳מאני של 1552, שבו כמה מאות מגינים הונגרים עצרו צבא עות׳מאני ענק. ליד העיר המינרט העות׳מאני הצפוני ביותר באירופה. האור נגמר מוקדם — כדאי לראות את הטירה לפני החשכה ולבדוק שעות פתיחה.", wiki: ["Eger_Castle", "Eger", "Minaret_of_Eger"], maps: "Eger Castle" },
        { id: "d1-checkin", t: "16:00", time: "16:00–16:30", icon: "🏨", title: "צ'ק-אין ב-Imola Hotel Platán - Adults Only", desc: "ההזמנה אושרה. כדאי לשמור כאן את מספר האישור.", book: true, status: "booked", bookLabel: "מלון אגר", maps: "Imola Hotel Platán Adults Only Eger" },
        { id: "d1-spa", t: "17:00", time: "17:00–19:00", icon: "♨️", title: "ספא, בריכות חמות וסאונות", desc: "אגר ידועה במים תרמליים. בדקו שעות ספא ופרוטוקול כניסה (כובע רחצה, כפכפים, מגבות).", wiki: [] },
        { id: "d1-dinner", t: "20:00", time: "ערב", icon: "🍷", title: "ארוחת ערב במלון או במרכז אגר", desc: "אפשרויות בלשונית 'אוכל'. אם בוחרים מסעדה פופולרית — כדאי להזמין שולחן.", wiki: [] },
      ],
      restaurants: [
        { id: "r-macok", name: "Macok Bisztró & Borbár", kind: "ארוחת ערב · יין", desc: "בית קפה/בר יין פופולרי באגר, מטבח הונגרי מודרני ובחירה רחבה של יינות מקומיים (Egri Bikavér). בסופי שבוע ובעונה בד״כ מלא.", maps: "Macok Bisztró Eger", book: true, status: "need", suggested: true },
        { id: "r-feherszarvas", name: "Fehér Szarvas Vendéglő", kind: "צהריים/ערב · הונגרי מסורתי", desc: "מסעדת בשרים ומטבח הונגרי כבד (בשר ציד, גולש). אווירה כפרית. לאמת שעות פתיחה בנובמבר.", maps: "Fehér Szarvas Vendéglő Eger", book: true, status: "need", suggested: true },
        { id: "r-hotel-eger", name: "מסעדת המלון / ארוחה במלון", kind: "גיבוי נוח", desc: "אם מתעייפים אחרי הספא — אפשרות בטוחה בלי נסיעה.", maps: "Imola Hotel Platán Adults Only Eger", book: false, status: "na", suggested: true },
      ],
    },
    {
      id: "d2", date: "2026-11-13", dow: "שישי", emoji: "🌲", title: "לילאפורד והרי Bükk",
      sunset: "~15:50",
      summary: "יום טבע: ארוחת בוקר ויציאה ב-09:45 ללילאפורד (כשעה וחצי נסיעה). אגם Hámori, מלון הארמון, הגנים התלויים ומפל Szinva, ואולי סיור במערה. חוזרים לאגר עד ~16:30, לפני שמחשיך. יום גמיש — אפשר להחליף עם שבת לפי מזג האוויר.",
      note: "סיור מערת Anna עשוי להיות מוקדם יותר; יש לבדוק שעות ולהתאים את סדר היום.",
      items: [
        { id: "d2-bf", t: "09:00", time: "09:00", icon: "🥐", title: "ארוחת בוקר במלון" },
        { id: "d2-drive", t: "09:45", time: "09:45", icon: "🚗", title: "יציאה לכיוון לילאפורד", desc: "כביש הררי — בנובמבר ייתכנו ערפל, גשם או קרח בבוקר. נהיגה בזהירות.", maps: "Lillafüred" },
        { id: "d2-lake", t: "11:00", time: "11:00–12:30", icon: "🌊", title: "אגם Hámori, תצפיות והליכה נינוחה", desc: "אגם ציורי בלב הרי Bükk, ממנו מתחילים השבילים. הליכה קלה לאורך המים עם הרבה צבעי סתיו.", wiki: ["Lillafüred", "Bükk_Mountains"], maps: "Hámori-tó Lillafüred" },
        { id: "d2-lunch", t: "12:30", time: "12:30–13:30", icon: "☕", title: "ארוחת צהריים או קפה", desc: "אפשרויות בלשונית 'אוכל'.", wiki: [] },
        { id: "d2-palace", t: "13:30", time: "13:30–14:30", icon: "🏛️", title: "מלון הארמון, הגנים התלויים ומפל Szinva", desc: "מלון הארמון של לילאפורד נבנה בשנות ה-20 בסגנון נאו-רנסנס ונחשב לאחד המבנים המרשימים בהונגריה. מתחתיו הגנים התלויים ומפל Szinva — מפל מלאכותי ידוע, אולי פחות מרשים בחורף.", wiki: ["Lillafüred", "Szinva"], maps: "Palace Hotel Lillafüred" },
        { id: "d2-cave", t: "14:00", time: "עד 14:00 (או מוקדם יותר)", icon: "🕳️", title: "אפשרות: מערת Szent István / Anna", desc: "שעות הסיורים בנובמבר מצומצמות ויכולות להיות מוקדמות. אם רוצים — להקדים בהתאם לשעת הסיור. אולי כדאי לפתוח את היום מהמערה.", book: true, status: "need", bookLabel: "סיור מערה", maps: "Szent István-barlang Lillafüred", wiki: ["Anna_Cave"] },
        { id: "d2-back", t: "15:15", time: "15:15–16:30", icon: "🌅", title: "חזרה משוערת לאגר", desc: "החשכה סביב 16:00 — לא כדאי לנסוע בכבישי הרים בחושך." },
        { id: "d2-eve", t: "19:00", time: "ערב", icon: "🍷", title: "ספא במלון וארוחת ערב", desc: "אפשרויות בלשונית 'אוכל'." },
      ],
      restaurants: [
        { id: "r-palace", name: "מסעדה/בית קפה במלון הארמון (Lillafüred)", kind: "צהריים · קפה וקינוח", desc: "הצעה לקפה בארמון — אולי עדיף רק קפה ועוגה ולא ארוחה מלאה. לאמת שעות.", maps: "Palace Hotel Lillafüred restaurant", book: true, status: "need", suggested: true },
        { id: "r-d2-dinner", name: "ארוחת ערב באגר (לבחירה)", kind: "ערב", desc: "אם אוכלים במלון — אפשר לסמן 'לא נדרש'.", maps: "restaurants Eger", book: true, status: "need", suggested: true },
      ],
    },
    {
      id: "d3", date: "2026-11-14", dow: "שבת", emoji: "🍷", title: "Noszvaj, יקב וספא",
      sunset: "~15:50",
      summary: "יום ארוך ורגוע ובו הטעימות: ארוחת בוקר איטית, נסיעה קצרה לכפר Noszvaj, בתי המערות, סיור וטעימות ביקב Thummerer (בתיאום מראש), צהריים באזור וחזרה למלון לספא ארוך. ערב באגר. אם שותים – חייבים נהג שלא שותה או הסעה.",
      note: "חשוב: אם שותים יין, יש לתאם הסעה או נהג שלא שותה. בהונגריה אפס סובלנות לאלכוהול בנהיגה.",
      items: [
        { id: "d3-bf", t: "09:00", time: "09:00–10:00", icon: "🥐", title: "ארוחת בוקר רגועה במלון" },
        { id: "d3-drive", t: "10:00", time: "10:00", icon: "🚗", title: "נסיעה לכפר Noszvaj", desc: "כ-10–15 דקות מאגר.", maps: "Noszvaj" },
        { id: "d3-caves", t: "10:30", time: "10:30–11:30", icon: "🏘️", title: "בתי המערות של Noszvaj, אם פתוחים", desc: "כפר שבו חלק מהבתים חצובים בסלע טוף. בנובמבר חלק מהאתרים סגורים — כדאי לבדוק לפני הנסיעה.", wiki: ["Noszvaj"], maps: "Noszvaj cave dwellings" },
        { id: "d3-winery", t: "11:30", time: "11:30–13:00", icon: "🍇", title: "סיור וטעימות ביקב Thummerer", desc: "יקב משפחתי מוביל באזור אגר, מפורסם ב-Egri Bikavér ('דם השור') ובקדרפרנק. ייתכן שנדרש תיאום מראש לביקור זוגי. הכינו מראש הסעה.", book: true, status: "need", bookLabel: "יקב Thummerer", maps: "Thummerer Pince Eger", wiki: ["Egri_Bikavér"] },
        { id: "d3-lunch", t: "13:00", time: "13:00–14:00", icon: "🍽️", title: "ארוחת צהריים באזור", desc: "אפשרויות בלשונית 'אוכל'." },
        { id: "d3-back", t: "14:00", time: "14:00–14:30", icon: "🏨", title: "חזרה למלון" },
        { id: "d3-spa", t: "14:30", time: "14:30–18:30", icon: "♨️", title: "ספא, סאונות ומנוחה" },
        { id: "d3-dinner", t: "19:30", time: "ערב", icon: "🍷", title: "ארוחת ערב טובה באגר", desc: "הארוחה המשמעותית של הטיול באגר — כדאי להזמין מראש." },
      ],
      restaurants: [
        { id: "r-d3-lunch", name: "מסעדה באזור Noszvaj / יקב", kind: "צהריים", desc: "ליד היקב/בכפר. ייתכן שאפשר לאכול גם ביקב עצמו או לבקש המלצה שם.", maps: "restaurant Noszvaj", book: true, status: "need", suggested: true },
        { id: "r-d3-dinner", name: "ארוחת ערב מיוחדת באגר", kind: "ערב · הבולטת של הטיול", desc: "אפשר Macok או Fehér Szarvas אם לא היו בחמישי. בשבת קשה למצוא מקום בלי הזמנה.", maps: "fine dining Eger", book: true, status: "need", suggested: true },
      ],
    },
    {
      id: "d4", date: "2026-11-15", dow: "ראשון", emoji: "🎄", title: "בודפשט ושוק הכריסמס",
      sunset: "~15:50",
      summary: "צ'ק-אאוט מאגר ונסיעה של כשעה וחצי–שעתיים לבודפשט. צהריים, צ'ק-אין והליכה במרכז, בזיליקת אישטוון הקדוש, שוק הכריסמס Advent Bazilika עם מופע האורות על חזית הבזיליקה ואז שוק Vörösmarty ואחריו ארוחת ערב במרכז.",
      items: [
        { id: "d4-out", t: "08:30", time: "08:30–10:00", icon: "🧖", title: "ארוחת בוקר, ספא קצר וצ'ק-אאוט" },
        { id: "d4-drive", t: "10:30", time: "10:30", icon: "🚗", title: "יציאה לכיוון בודפשט", desc: "נסיעה כשעה וחצי–שעתיים ב-M3.", maps: "Budapest city center" },
        { id: "d4-arrive", t: "12:30", time: "12:30–13:00", icon: "📍", title: "הגעה משוערת לעיר" },
        { id: "d4-lunch", t: "13:00", time: "13:00–14:00", icon: "🍽️", title: "ארוחת צהריים", desc: "אפשרויות בלשונית 'אוכל'." },
        { id: "d4-hotel", t: "14:00", time: "14:00–16:00", icon: "🏨", title: "צ'ק-אין במלון וטיול רגלי במרכז", desc: "המלון עוד לא הוזמן! חניה במרכז יקרה — מומלץ מלון עם חניה, או חניון ציבורי.", book: true, status: "need", bookLabel: "מלון בודפשט", maps: "hotels Budapest center parking" },
        { id: "d4-basilica", t: "16:00", time: "16:00–17:30", icon: "⛪", title: "בזיליקת אישטוון הקדוש והרחובות הסמוכים", desc: "הכנסייה הגדולה בבודפשט, בניין נאו-קלאסי עם כיפה גבוהה. אפשר לעלות לכיפה לנוף על העיר (בדקו שעות).", wiki: ["St._Stephen's_Basilica"], maps: "St. Stephen's Basilica Budapest" },
        { id: "d4-advent", t: "17:30", time: "17:30–19:00", icon: "✨", title: "שוק הכריסמס Advent Bazilika ומופע האורות", desc: "שוק כריסמס מול הבזיליקה עם מופע אורות על חזית הכנסייה. כדאי לבדוק מראש שעות הצגת המופע ואם פתוח כבר בתאריך זה.", wiki: ["Christmas_market"], maps: "Advent Bazilika Budapest" },
        { id: "d4-vorosmarty", t: "19:00", time: "19:00–20:00", icon: "🎄", title: "שוק הכריסמס בכיכר Vörösmarty, אם פתוח", desc: "השוק הוותיק והמפורסם ביותר בבודפשט, ליד קפה Gerbeaud. בנובמבר בד״כ נפתח בסוף החודש/באמצע — אם עוד לא פתוח, דלגו.", wiki: ["Vörösmarty_Square"], maps: "Vörösmarty tér Budapest" },
        { id: "d4-dinner", t: "20:00", time: "20:00", icon: "🍷", title: "ארוחת ערב במרכז העיר", desc: "הזמנה מראש חשובה ללילה האחרון.", wiki: [] },
      ],
      restaurants: [
        { id: "r-menza", name: "Menza", kind: "ערב · הונגרי מודרני", desc: "מסעדה בסגנון רטרו-סוציאליסטי בכיכר Liszt Ferenc. פופולרית — מומלץ להזמין.", maps: "Menza Budapest", book: true, status: "need", suggested: true },
        { id: "r-gerloczy", name: "Gerlóczy Café & Restaurant", kind: "צהריים/ערב · מטבח צרפתי-הונגרי", desc: "ממוקם במרכז, קרוב לבזיליקה ולשוק, אווירה אלגנטית.", maps: "Gerlóczy Café Budapest", book: true, status: "need", suggested: true },
        { id: "r-gerbeaud", name: "Café Gerbeaud", kind: "קפה ועוגה", desc: "בית קפה היסטורי בכיכר Vörösmarty. מתאים לאחרי השוק או כעצירת קינוח.", maps: "Café Gerbeaud Budapest", book: false, status: "na", suggested: true },
        { id: "r-karavan", name: "Karavan Street Food (Kazinczy)", kind: "צהריים מהיר", desc: "מתחם דוכני אוכל רחוב ליד הרובע היהודי. אפשר לבחור בקלות לפי ז'אנר.", maps: "Karavan Street Food Budapest", book: false, status: "na", suggested: true },
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
    { id: "t-thummerer", text: "לתאם ביקור זוגי ביקב Thummerer, וגם הסעה אם מתכננים טעימות", day: "d3", pdf: true },
    { id: "t-caves", text: "לבדוק שעות פעילות ומקומות בסיורי המערות בלילאפורד וב-Noszvaj", day: "d2", pdf: true },
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
