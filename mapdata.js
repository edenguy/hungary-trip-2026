// מפות יומיות. הקואורדינטות משוערות (±כמה מאות מטרים) — לניווט מדויק משתמשים בכפתור "נווט"/"מפה" שפותח חיפוש בגוגל מפות לפי השם.
// route = נקודות הנסיעה לפי הסדר. walk = סיור הליכה (stops עם story=היסטוריה, fun=פיקנטריה/אגדה).
window.TRIP_MAP = {
  d1: {
    route: [
      { n: "שדה התעופה בודפשט (BUD)", ll: [47.4369, 19.2556], q: "Budapest Airport BUD" },
      { n: "אגר — העיר העתיקה (חניה)", ll: [47.9027, 20.3768], q: "Dobó István tér Eger" },
      { n: "Imola Hotel Platán", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
    ],
    walk: {
      title: "סיור הליכה באגר", intro: "כ-1.5 שעות, 5 נקודות. החשיכה בסביבות 16:00 — מתחילים בטירה ובכיכר ומשאירים את הכנסיות לסוף.",
      stops: [
        { id: "w1-dobo", n: "כיכר Dobó István", ll: [47.9027, 20.3768], q: "Dobó István tér Eger", time: "10 דק׳",
          story: "הלב של אגר, על שם István Dobó, מפקד הטירה במצור העות׳מאני של 1552. סביב הכיכר בתים בארוקיים צבעוניים וכנסיית המינוריטים מהמאה ה-18.",
          fun: "אגדה מקומית (לא מתועדת): במצור המגינים שתו יין אדום ונראו לתורכים כמי ש'שותים דם שוורים' — ומכאן שם היין Egri Bikavér, 'דם השור'." },
        { id: "w1-castle", n: "טירת אגר", ll: [47.9056, 20.3788], q: "Eger Castle Egri vár", time: "45–60 דק׳",
          story: "ב-1552 כמה אלפי מגינים הונגרים החזיקו מעמד כמה שבועות מול כוח עות׳מאני גדול בהרבה, ואגר נשארה בידי ההונגרים (עד 1596). בטירה קזמטות ומנהרות, חומות ותצפית על העיר.",
          fun: "הרומן 'כוכבי אגר' (Egri csillagok) של Géza Gárdonyi על המצור הוא ספר חובה בבתי הספר בהונגריה, וגם סרט. לפי מסורת, Gárdonyi נקבר בשטח הטירה. מסופר גם על נשים שעלו לחומה ושפכו שמן ומים רותחים על הצבא העות׳מאני." },
        { id: "w1-minaret", n: "המינרט של אגר", ll: [47.9033, 20.3750], q: "Eger Minaret", time: "15 דק׳",
          story: "מגדל מצפון הכי צפוני של שלטון עות׳מאני באירופה, גובהו כ-40 מטר. המסגד שעמד לידו נהרס במאה ה-19 והמינרט נשאר.",
          fun: "מי שמטפס פנימה מקבל כ-97 מדרגות סליל צרות מאוד (לפי מקורות; הכניסה עונתית — לאמת).", deep: [{"t": "המינרט — מה נשאר ממסגד", "p": ["האימפריה העות׳מאנית כבשה את אגר ב-1596 ושלטה בה עד 1687. המינרט מתוארך כנראה לראשית המאה ה-17 ונבנה כחלק ממסגד Kethüda; הנוסע העות׳מאני Evliya Çelebi מזכיר אותו אחרי שביקר בעיר ב-1664. המסגד עצמו נהרס ב-1841 (לפי מקור אחד), ונשאר רק המגדל. יש גם סיפור על ניסיון להרוס אותו אחרי גירוש העות׳מאנים.", "גובה ומדרגות: המקורות לא מסכימים. הנתון הנפוץ הוא כ-40 מטר ו-97 מדרגות סליל (מקור אחר: 98). אל תסתמכו על המספר המדויק; יש גם גרסאות של 26 מטר עד המרפסת."]}] },
        { id: "w1-lyceum", n: "הליציאום (Líceum)", ll: [47.9011, 20.3737], q: "Eszterházy Károly Egyetem Líceum Eger", time: "10 דק׳ (מבחוץ)",
          story: "מבנה בארוק גדול מהמאה ה-18 שהיה מרכז לימוד. בפנים ספרייה היסטורית עם תקרה מצוירת, ומגדל התצפית Specula ידוע בחדר האפל שלו.",
          fun: "אם רוצים לראות בפנים — לבדוק שעות פתיחה מראש (לא אומתו לנובמבר)." },
        { id: "w1-basilica", n: "הבזיליקה של אגר", ll: [47.9020, 20.3715], q: "Eger Basilica Cathedral", time: "10 דק׳",
          story: "קתדרלה ניאו-קלאסית מהמאה ה-19, מהגדולות בהונגריה. מדרגות רחבות ופסלים בחזית.",
          fun: "בחושך החזית מוארת ויפה גם מבחוץ — אפשר להסתפק במבט מהכיכר." },
      ],
    },
  },
  d2: {
    route: [
      { n: "Imola Hotel Platán", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
      { n: "Tesco Hipermarket, אגר (קניות)", ll: [47.9110, 20.3900], q: "Tesco Hipermarket Eger Rákóczi Ferenc utca 100" },
      { n: "בתי המערות של Noszvaj", ll: [47.9430, 20.4350], q: "Noszvaji Barlanglakások" },
      { n: "טירת De la Motte", ll: [47.9460, 20.4400], q: "De la Motte Castle Noszvaj" },
      { n: "Trakta by Nomád (אופציונלי)", ll: [47.9600, 20.4400], q: "Trakta by Nomád Noszvaj" },
      { n: "Zsenge Konyha és Kávé", ll: [47.9455, 20.4285], q: "Zsenge Gourmet Bolt és Kávézó Noszvaj" },
      { n: "נסיעה נופית Síkfőkút", ll: [47.9640, 20.4450], q: "Síkfőkút Noszvaj" },
      { n: "חזרה לאגר", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
    ],
    walk: {
      title: "יום כפרי בגשם · Noszvaj", intro: "הסדר גמיש: אם יורד גשם חזק, מתחילים בטירה ובקפה ומשאירים את בתי המערות לרגע שהגשם פוסק. קואורדינטות משוערות — הניווט לפי שם.",
      stops: [
        { id: "w3-shop", n: "Tesco Hipermarket, אגר (קניות)", ll: [47.9110, 20.3900], q: "Tesco Hipermarket Eger Rákóczi Ferenc utca 100", time: "30–35 דק׳",
          story: "סופר גדול לקניית מטריות, מוצרי שיער וטיפוח. כתובת לא מאומתת.", fun: "קואורדינטות משוערות; הניווט לפי שם." },
        { id: "w3-caves", n: "בתי המערות של Noszvaj (תלוי מזג אוויר)", ll: [47.9430, 20.4350], q: "Noszvaji Barlanglakások", time: "45–60 דק׳",
          story: "בתים חצובים בסלע טוף ('barlanglakás'), חלק ממשק החקלאי המסורתי של האזור. שעות צפויות 10:00–16:00 — לא אומת.",
          fun: "הטוף רך וקל לחציבה, ובתוך הבתים הטמפרטורה יציבה — כמעט חמימה בחורף." },
        { id: "w3-castle", n: "טירת De la Motte (מקורה)", ll: [47.9460, 20.4400], q: "De la Motte Castle Noszvaj", time: "45 דק׳",
          story: "טירה ברוקית בכפר Noszvaj עם חללים מעוטרים, שמזוהה עם משפחת De la Motte.",
          fun: "שעות סותרות במקורות — לבדוק ב-Google Maps; אם סגור, מבט מבחוץ ועוברים לקפה." },
        { id: "w3-trakta", n: "Trakta by Nomád (צהריים אופציונלי)", ll: [47.9600, 20.4400], q: "Trakta by Nomád Noszvaj", time: "90 דק׳",
          story: "מסעדה כפרית ב-Síkfőkút. לא מוזמן; מחליטים במקום.", fun: "אפשר לדלג ולהישאר בקפה." },
        { id: "w3-zsenge", n: "Zsenge Konyha és Kávé", ll: [47.9455, 20.4285], q: "Zsenge Gourmet Bolt és Kávézó Noszvaj", time: "45 דק׳",
          story: "קפה, מאפים וחנות מוצרים מקומיים במרכז הכפר.", fun: "שעות לא נמצאו — לבדוק ביום." },
        { id: "w3-sikfokut", n: "נסיעה נופית ב-Síkfőkút", ll: [47.9640, 20.4450], q: "Síkfőkút Noszvaj", time: "45 דק׳",
          story: "כבישים ביער סביב Noszvaj ואגמים קטנים; עצירות צילום בלבד.", fun: "החשכה בסביבות 15:50." },
        { id: "w3-gazsi", n: "אופציונלי: Gazsi Pince", ll: [47.9450, 20.4270], q: "Gazsi Pince Noszvaj", time: "גמיש",
          story: "מרתף יין מקומי קטן ליד כיכר Mátyás — כוס יין, לא סיור.", fun: "לא אומתו שעות וכתובת." },
      ],
    },
  },
  d3: {
    route: [
      { n: "Imola Hotel Platán", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
      { n: "לילאפורד — אגם ומלון הארמון", ll: [48.0850, 20.6165], q: "Hotel Palota Lillafüred" },
      { n: "חזרה לאגר", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
    ],
    walk: {
      title: "סיור הליכה בלילאפורד", intro: "הליכה קצרה סביב האגם והארמון (~1.5 שעות). חוזרים לרכב לפני החשכה.",
      stops: [
        { id: "w2-lake", n: "אגם Hámori", ll: [48.0885, 20.6110], q: "Hámori-tó Lillafüred", time: "30 דק׳",
          story: "אגם בלב הרי Bükk. שמו מ'hámor' — בית חרושת לברזל; האזור היה מרכז תעשיית ברזל ואגם נוצר ככל הנראה לצורך זה.",
          fun: "בחורף אגמים כאן לפעמים קופאים (יש גלויות ישנות של הארמון עם אגם קפוא); בסתיו — צבעים." },
        { id: "w2-palace", n: "מלון הארמון (Palotaszálló)", ll: [48.0850, 20.6165], q: "Hotel Palota Lillafüred Erzsébet sétány 1", time: "20 דק׳",
          story: "בנוי בשנים 1927–1930 בסגנון נאו-רנסנס לפי תכנון של Kálmán Lux, אחד המבנים המרשימים באזור.",
          fun: "כדי לבנות את המלון ואת המפל ממש לצידו, נתיב פלג Szinva הוסט." },
        { id: "w2-gardens", n: "הגנים התלויים והמפל", ll: [48.0845, 20.6150], q: "Függőkertek Lillafüred Szinva vízesés", time: "20 דק׳",
          story: "טרסות גן מתחת למלון עם מפל של כ-20 מטר — ממפלי ההונגרים המפורסמים, ומלאכותי למחצה.",
          fun: "בחורף המים עשויים להיות מעטים; המדרגות חלקות אחרי גשם." },
      ],
    },
  },
  d4: {
    route: [
      { n: "Imola Hotel Platán", ll: [47.9005, 20.3750], q: "Imola Hotel Platán Adults Only Eger" },
      { n: "Budapest Marriott Hotel", ll: [47.4960, 19.0490], q: "Budapest Marriott Hotel Apáczai Csere János u. 4" },
    ],
    walk: {
      title: "סיור הליכה בבודפשט (פסט)", intro: "כ-2.5 שעות עם עצירות. הבזיליקה מוקדם בגלל הכיפה, אחר כך ירידה לדנובה, שוק הכריסמס ומופע האורות ב-17:30.",
      stops: [
        { id: "w4-basilica", n: "בזיליקת אישטוון הקדוש", ll: [47.5008, 19.0539], q: "St. Stephen's Basilica Budapest", time: "45–60 דק׳",
          story: "הושלמה ב-1905, גובה הכיפה כ-96 מטר — כמו הפרלמנט, סמל לשוויון בין הכנסייה למדינה. נקראת על שם המלך הראשון, István.",
          fun: "בבזיליקה נשמרת הזרוע הימנית המומיה של המלך István (ה'Holy Right'). הכיפה קרסה במהלך הבנייה ב-1868 ונבנתה מחדש." },
        { id: "w4-bridge", n: "גשר השלשלאות והטיילת", ll: [47.4990, 19.0434], q: "Széchenyi Chain Bridge Budapest", time: "30 דק׳",
          story: "הגשר הקבוע הראשון על הדנובה בבודפשט, נפתח ב-1849, ותוכנן על-ידי האנגלי William Tierney Clark. ממנו תצפית על טירת בודה והדנובה בשעת דמדומים.",
          fun: "אגדה: הפסל שיצר את האריות 'שכח' לעשות להם לשון, ומרוב בושה קפץ לדנובה. האריות כן יש להם לשון — רק שלא רואים אותה מלמטה." },
        { id: "w4-vorosmarty", n: "כיכר Vörösmarty ושוק הכריסמס", ll: [47.4965, 19.0502], q: "Vörösmarty tér Budapest", time: "40 דק׳",
          story: "הכיכר המרכזית של פסט, על שם המשורר Mihály Vörösmarty, ובה בית הקפה ההיסטורי Gerbeaud (נוסד ב-1858). שוק הכריסמס נפתח 13.11.",
          fun: "ממתק חג הולדת הונגרי מסורתי: szaloncukor — סוכריות עטופות שתולים על העץ." },
        { id: "w4-advent", n: "מופע האורות — Advent Bazilika (17:30)", ll: [47.5009, 19.0541], q: "Advent Bazilika Budapest", time: "17:30–19:00",
          story: "חוזרים לכיכר הבזיליקה: מופע אורות על חזית הכנסייה כל יום מ-17:30, ושוק הכריסמס סביבה, פתוח ביום ראשון עד 22:00.",
          fun: "אם קר — קחו vin chaud ('forralt bor') ממתחם השוק, ואז לשבת למנה ראשונה." },
        { id: "w4-synagogue", n: "בית הכנסת ברחוב Dohány (אופציונלי)", ll: [47.4958, 19.0604], q: "Dohány Street Synagogue Budapest", time: "לבדוק שעות",
          story: "אחד מבתי הכנסת הגדולים באירופה, נבנה ב-1859 בסגנון מורי. בחצר גן הזיכרון ו'עץ החיים' של קורבנות השואה.",
          fun: "מסופר שליסט וסן-סאנס ניגנו על העוגב שלו. לא להסתמך על שעות — לאמת מראש, וסגור בשבתות/חגים." },
      ],
    },
  },
  d5: {
    route: [
      { n: "Budapest Marriott Hotel", ll: [47.4960, 19.0490], q: "Budapest Marriott Hotel Apáczai Csere János u. 4" },
      { n: "שדה התעופה — החזרת רכב", ll: [47.4369, 19.2556], q: "Budapest Airport car rental return" },
    ],
  },
};

// ---------- our own photos (from the trip album) ----------
window.TRIP_PHOTOS = {
  d1: { hero: 'https://lh3.googleusercontent.com/pw/AP1GczOHzGbFXIaKg2B8yGGXZoRhX8IgS62dxUglJQQNyb-6KktQPAz0QacSEPJ1nhSGB94lURTJSaeJVNY208lyd9J8OMtlyQUX3tGudtF7IaUrNFeCFz3X', pos: '50% 20%', items: [
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczPHiIs9e1X3fdG0UG_hOwVtqdxE-Sqvdt4UvH5rts7hZbLzGSeHjxOllx8ltteoQWowtcJVfsYfdnlW803Fqd2gKl0-GCgtbLqnap2Y-Yw961xHmeGC', c: 'בדרך לטירת אגר' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczOncCv5DeYkbiTSToE8vsu0p43eZNRs8oZPJOWaynQb7N7AkhZoiCb-khhDKMW3jDMDyrHH3oqoKFicSyTwxN3-rZAo5iYa3ztAPeGuIn6a3xGkQhvf', c: 'ענת בשער הטירה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOJVXN5pg-o8oMv84wCnc9Nf2ds0eCPkS3AyNOVPG3yyBNcJTcAaTEAq-AKR5OHGzl9y3Xf3pWGi_3GhVPJtvYHaVDTlTMQ9ScT4nB19vfs-u3aFXSJ', c: 'גיא ליד הצלב בטירה' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczM3daJG8IpjC7aHLYsnLX4sw3HAYdjGWoZxVrhmI8r2PxUwnlmp4PTI_C-hHY-vA65QX7DoCKt3Viv1ZTHReQLWeJTRf24MLIOSjhZDF1e1joKmIosx', c: 'כניסה מקושטת לחג בעיר העתיקה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOHzGbFXIaKg2B8yGGXZoRhX8IgS62dxUglJQQNyb-6KktQPAz0QacSEPJ1nhSGB94lURTJSaeJVNY208lyd9J8OMtlyQUX3tGudtF7IaUrNFeCFz3X', c: 'הכנסייה ליד הגשר' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczP-WEk7oRsbVF0I2bXMKdn5MT2vSgh__yOSZ8pzq1jq59MHeIeaJV97mBbnlGAH1F7UeFBg5YrVPP7N4giH7SPrNE2HotKcR7CyqZp3FV3qmM-o2uIi', c: 'בתוך הכנסייה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOJsyzk5EdgN9wpIzsR0YzmxAlXGdjVdOktCFQgW60fDj7ChjrXAw-4-FC4DpqWK-bhAXWNAmBvcCL-tUD9Znv1gs7tGNvDGxXRLwO7b6QhQvHcrcJ5', c: 'חזית הכנסייה' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczN1HpFb_yfsAJ7lOqQJT4pu8E2E7Z2EvDX4x7ZUD7YAyao9eyTE4M_TFQsyeOCBspa7fIt4H0kwbxajcikJoVlM2AE_K_rH0QI8dA6laFxHGXAjYvRY', c: 'רחוב הולכי רגל אחרי גשם' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOWaFVF-U7xH67ILfBYK5WHfuZVog5q5R-5w5ldcil4HhSo6IfuY80GkrcsvUoXiXSXJUQLnx22Ohd7bR38mj_oYyV61AHmuBKWoz2DoAA9K6ngJhQB', c: 'עלי גינקו על המדרכה' } ] },
  d2: { hero: 'https://lh3.googleusercontent.com/pw/AP1GczMnGHF-giV9CuoczbhqJH7QuKouuf61pLleVRsnyG3BYD6a8iL7LWG4B-jpswFO9qxxXBXjIxoTPOnbQnjH7ABULGwbrA0qHp2IB7qy2ESpAIcL-7Pn', pos: '50% 60%', items: [
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczPmwPNPyYBPhZpFzHqQvXp__aoQThX52QGn-AfROMFgsI6KkT3N4gYS1fTzTQHc85ND1NbbUv65ALuYXx0tLLusHia9RjXta3bvjEG9OXrnP30qM0k2', c: 'ענת וגיא בלובי המלון' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczNryrd7aLVOMPUBJQwO7z_f74dEI8FvF_U3F45569ilmlyiNgWmQ-JsALaV47ydQUlMfUD1j2nG_oC8md_J6evo-egqo2C0RQA2NlTRYNhYUce4Xi_p', c: 'ענת בטירת De la Motte' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczNkZMTywmFY6Zfx3oIXIz9vPXzQElxqQXGh7d-7DGmzu6XSoot2Cq5C9tSfWi-ou3VeqhdN8JcsrVK_LVtVt3x6Brk6dPmEZizzTm6bdBGPV85of2mT', c: 'שמלת נשפים בתערוכה בטירה' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczOMkTOxH6SYqJYH_NzDDq7QYdl38SdvsVgfouAaFQXCtK-TYg67aI1K5gTQn8pJzrIJ21NoDRe4EtdQgmX8E1NbdxzgddP96qbjeNmzrCXWWGUfd_mZ', c: 'גרם המדרגות בטירה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczNmsmcddmwkdQl1pwEUVQ8KvISEZ15fwGTaXMwPtJHLgO836AE984D6fU4DaNQcSZuFno5VoEJm-QbMzFfPCZTOfr2PgR5STnpafwYMrwj8KoieeWuB', c: 'בפארק הטירה' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczMnGHF-giV9CuoczbhqJH7QuKouuf61pLleVRsnyG3BYD6a8iL7LWG4B-jpswFO9qxxXBXjIxoTPOnbQnjH7ABULGwbrA0qHp2IB7qy2ESpAIcL-7Pn', c: 'שטיח עלים צהוב' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczPTyD7OP91Rc6MZN5Jqd1RjeB29efcZYAFyQSFKf9HNHybGg0-X33CLeOTCNTDHeACUTl8tic3KwNE23N3eMSOkL2x1cl8p-EZ9mENpRtJg7J7JHtP9', c: 'גיא בשיחים האדומים' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczPFmrbBvjpa9KLIADKYL7rEvcWbUXHYnW82U0MBiDV88Tjn5AWisdZyRvYXO5i__rXBZBaeFV3bjFaY2vIbE32RjnhfEHrVUSGxzZlJc5us_cnrrB7-', c: 'ענת עם מטרייה בבתי המערות' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOuX1-arNGMjBBz1MZqn-uGEsAJ-9PER5ZTlFMKiXUf5-HYHH17rrWOU1FoGjfq6MZlZ48v05b9tixC9zNv2adWyl8KB5EVzCzTP7gRzEEFrQPgw5E7', c: 'מנהרה חצובה בטוף' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczOzivX7W0cITT6lMDlDKWpqIfWi_IIIBz6kempN5ziR3dx-tAUpcC1RC214hZVgpyph9qTd-B0SLMeq-JjS4HY5iz_dH4R51MqjZQWLaj7Pk1qu1phA', c: 'בתוך בית מערה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczObe7yLGLctoKMIzCghcy82NgVf73CZ0wggsxR5qp3xUDusESLTJmdBlPun5L75zi1yBk_4j7OY1mbCX_75GI_Xa9ph3lFXs8gDRP-FCuJ1nf1V_fmE', c: 'קפה וצלחת גבינות ונקניקים' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczP1x7CqbmU7PeRnZK8HiyZ4IAaYsT8lE6hzFwy9M91U3Y4nIPiRNfHB6lrtM1GEkQmsWCBgxlxb8_mab8ONqlEuxNDQ3UOE1xfJf5PjZj7I7DhHSDEo', c: 'גיא על המזח, אגם קטן' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczNAQDpu9ToZgKVoqhJ_1XPJ9VKaEujgYjJezSQe3C9PI_mqevFsCU5ZN5wj-ir1p5nUWggWatrJH9Tj5z_PohuJ_itBxEtVzaniViPzBSaCoiVcWxXq', c: 'ערבה בוכייה על האגם' } ] },
  d3: { hero: 'https://lh3.googleusercontent.com/pw/AP1GczPKdAHXQCvyD42kjS6KaKGSbPS3UmjjuOm0HtXPmn2_2oaaOm1B81HgndlVT5hsd_LiMuYblUCSkZzkFXIy-fJuYf024L0C4Ya7gsP4_0kuBbfw3n2k', pos: '50% 26%', items: [
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczO5ROIvUJWIO26Ly1m7J4EpKaqyZEzjA5ZWa6R5arTOzBK7ZVR6SDQUjOw26d5vVGfmmKu-y1USz8DBffEW9fVs_W4l4tHcSJ8cjGUZqk-9ty3CIwh_', c: 'מלון הארמון של לילאפורד' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczMtEc8dIHdGdOLb-iBu8AhzuaHGuXZcqSMxhbmlGWa4Do9PhYKy5i-KuSKqVfxlETKeNTPQekWPj5ld-uSWv-nBrHekBe5PSZMyyfqqe2_K9qRrjRLi', c: 'שער אבן ומגדל בדרך לאגם' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczOZu0R1B7OwnyEXIeS3G8-TA-l3DlMQJNdGdPg6u1cmo1N4Ci91HWzyI2t6RCc-TcUZb_5hEbr5sVTgfWyruH-qSKYeoB09O4JhS6eQZJ2e2eeJvFFO', c: 'ענת בכניסה לרציף הסירות' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczMzogiW67URUHIcD9274PPEWpNWVb_nuJC4FXq8mXNQG3a3vQluTfeCoQ_bQlPYNmXq2Q2oOh3a3R439l_DssMqJTtNIzebz8qoEjJj1eUHGPrUTKp-', c: 'ענת ליד חומת האגם' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczMO6EGgzQjgEXpk8wRZ-4O0cs3TYSPkmQqNCWT3xBWophwvW4lAkSEKyWlp2VVPIcQtvlYoeKTbk2bX0wUhtX7Zq49_yUGhW6Awp5Ezpzor9kzbgg3n', c: 'ענת וגיא על שביל האגם' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczOUGBe-XJb1yHNe5a7_QI9XDKG3XGMhU4EszqA_ICuWk1ygO91w6YHgKn1x9VPw5WqTrSMk8NfhT54AcXe_aFEPsDhTr8nA9Bmd6FiZ2XUV8bhcmcXs', c: 'סלפי בהליכה' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczO5xgTN0Y6VUk-beerBKDAAc9DhraCYf2pi1keaXfchFWK_Ezb1kqJnQHALD89uv3WUOnJlxkiuEpw9Zo9RWXZuMS_LYN2rlvnb_F8PBD6KA9iOuEn6', c: 'גיא מרים ידיים' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczO9a4oCOVuiC8t_TM1VwcYlZGi8vbNDAJP5b5TUbhWI0DlrSdv3W_JIX61mQTK8dGul5VcW39xHkKmJYgEahHkdrSNKmgRKrgQcmCnHFc5HBWToXW7N', c: 'השתקפות הצוק במים' },
    { f: 'https://lh3.googleusercontent.com/pw/AP1GczPKdAHXQCvyD42kjS6KaKGSbPS3UmjjuOm0HtXPmn2_2oaaOm1B81HgndlVT5hsd_LiMuYblUCSkZzkFXIy-fJuYf024L0C4Ya7gsP4_0kuBbfw3n2k', c: 'הארמון מעבר לאגם' }, { f: 'https://lh3.googleusercontent.com/pw/AP1GczMbOeWKEGBOA0OpafISe73JljvQAzgFIw2m5bdD5hMrJke7_dJ_M_XLU9083qg6H6lWS_TcWERq4UWUZu7mir6hYAT__Ln3sGuXa102X4h9mIPO5PH2', c: 'ענת וגיא' } ] },
};
