/**
 * Escape Mode – Bucharest itinerary map data
 *
 * Itinerary source (verbatim, read-only GET on 2026-11-10):
 *   - Zernio לוז DM workflow 6aec8ad09cfad7e3c9db49d3 + Bucharest comment automation 6af1afc4331cf75def7a03c1
 *   - Zernio maps workflow 6af1afab9510051b54c8745b (Google Maps search queries per stop)
 * Coordinates: OpenStreetMap Nominatim, 2026-11-10 (see _src/nominatim.json). Data © OpenStreetMap contributors (ODbL).
 * Deal links: copied verbatim from linkpage_update/deals.js → active (bucharest-christmas-2026).
 * Google Maps place links, ratings and hours: Gemini Maps grounding, 2026-11-10
 *   (raw responses in _src/gemini-maps/). Only fields present in groundingChunks; nothing invented.
 * Hours in this file are Hebrew 24h (see _src/hours_he.py). English originals stay in stops-enriched.json.
 * Airport hours from Maps were omitted here (they looked like a facility timetable, not terminal hours).
 * Booking buttons (book[]): Travelpayouts partner links for marker 620113, only for
 *   programs already connected. sub_id is applied in map.js as map_bucharest_<stop>.
 * Hotels: public Booking.com guest ratings opened 2026-11-10 (Asia/Jerusalem);
 *   coordinates from OSM Nominatim the same day. No hotel affiliate links —
 *   Booking.com (84), Hotellook (101) and Agoda (104) are not subscribed on this project.
 * Never invent stops, links, or ratings here.
 */
window.ESCAPE_MAP_BUCHAREST = {
  slug: "bucharest",
  subId: "map_bucharest",
  title: "מפת לוז · בוקרשט",
  datesLabel: "17–21.12.2026",
  meta: "5 ימים · Wizz ישירה · בלי טרולי",
  price: "558\u00a0₪",

  days: [
    { n: 1, date: "17.12", weekday: "חמישי", color: "#ff6b4a", title: "נחיתה ושוק הכריסמס", mode: "driving",
      stops: ["airport", "market"] },
    { n: 2, date: "18.12", weekday: "שישי", color: "#0f9b8e", title: "העיר העתיקה", mode: "walking",
      stops: ["lipscani", "carturesti", "stavropoleos", "carucubere"] },
    { n: 3, date: "19.12", weekday: "שבת", color: "#3d8bfd", title: "הפרלמנט ותרמה", mode: "driving",
      stops: ["parliament", "therme"] },
    { n: 4, date: "20.12", weekday: "ראשון", color: "#8134af", title: "אתנאום, קליה ויקטוריי, הרסטראו", mode: "walking",
      stops: ["athenaeum", "victoriei", "herastrau"], alt: ["bran"],
      altNote: "או במקום זה: יום לטירת בראן" },
    { n: 5, date: "21.12", weekday: "שני", color: "#f0a202", title: "בוקר חופשי ← שדה התעופה", mode: "driving",
      stops: ["airport2"] }
  ],

  stops: {
    airport: {
      name: "נמל התעופה הנרי קואנדה", latin: "Henri Coandă (OTP)",
      line: "נחיתה בסביבות 18:30", lat: 44.5703108, lng: 26.0776011, deal: "transfer", outside: true,
      book: [
        { program: "Yesim", label: "📶 eSIM לרומניה · Yesim", className: "btn-tool", url: "https://yesim.tpk.lu/JykjOpT6" },
        { program: "AirHelp", label: "פיצוי על עיכוב טיסה · AirHelp", className: "btn-tool", url: "https://airhelp.tpk.lu/eHiF6Xx3" }
      ],
      maps: { title: "Bucharest Henri Coandă International Airport", uri: "https://maps.google.com/maps?cid=1247037147080132478", placeId: "ChIJd49YtoEcskARfodtna1dThE", rating: 3.7, reviewCount: 43413 }
    },
    market: {
      name: "שוק הכריסמס · כיכר החוקה", latin: "Piața Constituției",
      line: "שוק הכריסמס, כניסה חינם", lat: 44.4272779, lng: 26.0917417,
      maps: { title: "Piața Constituției", uri: "https://maps.google.com/maps?cid=7692494474574475929", placeId: "ChIJAdNDfGv_sUARmbKq0fc6wWo" }
    },
    lipscani: {
      name: "ליפסקני", latin: "Strada Lipscani",
      line: "רחוב מרכזי בעיר העתיקה", lat: 44.4328555, lng: 26.0968943,
      maps: { title: "Strada Lipscani", uri: "https://maps.google.com/maps?cid=15464344912079704994", placeId: "ChIJOS2agj__sUARolOhkMNjnNY" }
    },
    carturesti: {
      name: "קרטורשטי קרוסל", latin: "Cărturești Carusel",
      line: "חנות ספרים ברחוב ליפסקני", lat: 44.4318945, lng: 26.1015779,
      maps: { title: "Cărturești Carusel", uri: "https://maps.google.com/maps?cid=9279824186385889317", placeId: "ChIJhXfcoD__sUARJfibT-6OyIA", rating: 4.8, reviewCount: 25589, hoursNote: "כל יום 10:00–22:00" }
    },
    stavropoleos: {
      name: "מנזר סטאברופוליאוס", latin: "Stavropoleos",
      line: "מנזר בלב העיר העתיקה", lat: 44.4318030, lng: 26.0987087,
      maps: { title: "The Church of the \"Stavropoleos\" Monastery", uri: "https://maps.google.com/maps?cid=10915586233752676659", placeId: "ChIJEZe8dkD_sUARM-n4qdjze5c", rating: 4.8, reviewCount: 6592, hoursNote: "ב׳–ש׳ 08:00–19:00 · א׳ 12:00–19:00" }
    },
    carucubere: {
      name: "קארו קו בירה", latin: "Caru' cu Bere",
      line: "ערב במסעדה", lat: 44.4320009, lng: 26.0981059,
      maps: { title: "Caru' cu bere", uri: "https://maps.google.com/maps?cid=14593284683301693268", placeId: "ChIJwXfea0D_sUARVKdY1hnDhco", rating: 4.6, reviewCount: 103271, hoursNote: "כל יום 10:00–00:00" }
    },
    parliament: {
      name: "ארמון הפרלמנט", latin: "Palatul Parlamentului",
      line: "סיור – להזמין מראש", lat: 44.4275103, lng: 26.0872481,
      book: [
        { program: "Tiqets", label: "כרטיס לפרלמנט · Tiqets", className: "btn-tour", url: "https://tiqets.tpk.lu/LFQlmZND" }
      ],
      maps: { title: "Palace of Parliament", uri: "https://maps.google.com/maps?cid=3103131841547972060", placeId: "ChIJwSjue0L_sUAR3K2rAviJECs", rating: 4.4, reviewCount: 8555, hoursNote: "כל יום 09:00–17:00" }
    },
    therme: {
      name: "תרמה בוקרשט", latin: "Therme București",
      line: "מחוץ לעיר (Balotești), כ-20 ק״מ צפונה, ליד שדה התעופה", lat: 44.6054241, lng: 26.0853550, deal: "therme", outside: true,
      book: [
        { program: "Klook", label: "כרטיס לתרמה · Klook", className: "btn-tour", url: "https://klook.tpk.lu/87GTfKXQ" }
      ],
      maps: { title: "Therme Bucharest", uri: "https://maps.google.com/maps?cid=17874926002267440966", placeId: "ChIJC1ABONsbskARRkeLX35-EPg", rating: 4.4, reviewCount: 48495, hoursNote: "ב׳–ה׳ 10:00–23:00 · ו׳–ש׳ 09:00–00:00 · א׳ 09:00–23:00" }
    },
    athenaeum: {
      name: "האתנאום הרומני", latin: "Ateneul Român",
      line: "אולם הקונצרטים המפורסם של העיר", lat: 44.4413572, lng: 26.0973610,
      maps: { title: "The Romanian Athenaeum", uri: "https://maps.google.com/maps?cid=6517745912057984754", placeId: "ChIJl3ltbk__sUAR8nZ44F-vc1o", rating: 4.8, reviewCount: 19845 }
    },
    victoriei: {
      name: "קליה ויקטוריי", latin: "Calea Victoriei",
      line: "רחוב ארוך – הנקודה מסמנת את הקטע ליד האתנאום", lat: 44.4382023, lng: 26.0972351,
      maps: { title: "Calea Victoriei", uri: "https://maps.google.com/maps?cid=12694933563906411019", placeId: "ChIJcQLYs1r_sUARC0rT09B2LbA" }
    },
    herastrau: {
      name: "פארק הרסטראו", latin: "Parcul Regele Mihai I (Herăstrău)",
      line: "פארק גדול עם אגם בצפון העיר", lat: 44.4704925, lng: 26.0818904,
      maps: { title: "King Mihai I Park", uri: "https://maps.google.com/maps?cid=6338269642951316774", placeId: "ChIJkZAHuxMCskARJlXBnqgO9lc", rating: 4.6, reviewCount: 66275, hoursNote: "פתוח 24 שעות" }
    },
    bran: {
      name: "טירת בראן", latin: "Bran Castle",
      line: "אופציה ליום 4 · כ-134 ק״מ בקו אווירי מבוקרשט", lat: 45.5150774, lng: 25.3672373, deal: "bran", optional: true,
      book: [
        { program: "Tiqets", label: "כרטיסים לטירת בראן · Tiqets", className: "btn-tour", url: "https://tiqets.tpk.lu/FESbKi7S" },
        { program: "Localrent", label: "השכרת רכב ליום בראן · Localrent", className: "btn-car", url: "https://localrent.tpk.lu/7BROXCqS" }
      ],
      maps: { title: "Bran Castle", uri: "https://maps.google.com/maps?cid=14957060824112409471", placeId: "ChIJMd4VpOVHs0ARf6sh2ZInks8", rating: 4.3, reviewCount: 115130, hoursNote: "ב׳ 12:00–18:00 · ג׳–א׳ 09:00–18:00" }
    },
    airport2: {
      name: "נמל התעופה הנרי קואנדה", latin: "Henri Coandă (OTP)",
      line: "אחרי בוקר חופשי – לטיסה הביתה", lat: 44.5703108, lng: 26.0776011, deal: "transfer", outside: true,
      book: [
        { program: "Yesim", label: "📶 eSIM לרומניה · Yesim", className: "btn-tool", url: "https://yesim.tpk.lu/JykjOpT6" },
        { program: "AirHelp", label: "פיצוי על עיכוב טיסה · AirHelp", className: "btn-tool", url: "https://airhelp.tpk.lu/eHiF6Xx3" }
      ],
      maps: { title: "Bucharest Henri Coandă International Airport", uri: "https://maps.google.com/maps?cid=1247037147080132478", placeId: "ChIJd49YtoEcskARfodtna1dThE", rating: 3.7, reviewCount: 43413 }
    }
  },


  /* Central hotels. Ratings: Booking.com guest score, opened 2026-11-10 (Asia/Jerusalem).
     Coordinates: OSM Nominatim, 2026-11-10. No affiliate URL — no hotel program is connected. */
  hotels: [
    {
      id: "marmorosch",
      slug: "marmorosch",
      name: "מארמורוש בוקרשט",
      latin: "The Marmorosch Bucharest, Autograph Collection",
      area: "העיר העתיקה",
      lat: 44.4337450, lng: 26.0990952,
      rating: 9.2, reviewCount: 3995, ratingScale: 10,
      ratingSource: "Booking.com",
      ratingDate: "2026-11-10",
      sourceUrl: "https://www.booking.com/hotel/ro/the-marmorosch-bucharest-autograph-collection.html",
      coordSource: "OpenStreetMap Nominatim, 2026-11-10",
      osm: "node/9117139108"
    },
    {
      id: "athenee-palace",
      slug: "athenee-palace",
      name: "אינטרקונטיננטל אתנה פאלאס",
      latin: "InterContinental Athénée Palace Bucharest by IHG",
      area: "פיאצה רומנה",
      lat: 44.4414277, lng: 26.0957572,
      rating: 9.3, reviewCount: 2140, ratingScale: 10,
      ratingSource: "Booking.com",
      ratingDate: "2026-11-10",
      sourceUrl: "https://www.booking.com/hotel/ro/intercontinental-athenee-palace-bucharest.html",
      coordSource: "OpenStreetMap Nominatim, 2026-11-10",
      osm: "way/232347742"
    },
    {
      id: "grand-continental",
      slug: "grand-continental",
      name: "גרנד הוטל קונטיננטל",
      latin: "Grand Hotel Continental Bucuresti",
      area: "קליה ויקטוריי",
      lat: 44.4370264, lng: 26.0979703,
      rating: 9.1, reviewCount: 1903, ratingScale: 10,
      ratingSource: "Booking.com",
      ratingDate: "2026-11-10",
      sourceUrl: "https://www.booking.com/hotel/ro/grand-continental.html",
      coordSource: "OpenStreetMap Nominatim, 2026-11-10",
      osm: "way/164369116"
    },
    {
      id: "hilton-old-town",
      slug: "hilton-old-town",
      name: "הילטון גארדן אין · העיר העתיקה",
      latin: "Hilton Garden Inn Bucharest Old Town",
      area: "העיר העתיקה",
      lat: 44.4329513, lng: 26.1008092,
      rating: 9.1, reviewCount: 4151, ratingScale: 10,
      ratingSource: "Booking.com",
      ratingDate: "2026-11-10",
      sourceUrl: "https://www.booking.com/hotel/ro/hilton-garden-inn-bucharest-romania.html",
      coordSource: "OpenStreetMap Nominatim, 2026-11-10",
      osm: "node/6162234562"
    }
  ],

  /* Verbatim from linkpage_update/deals.js (active.links). */
  deals: [
    { id: "flight", label: "✈️ טיסה מתל אביב", className: "btn-flight", url: "https://aviasales.tpk.lu/nS3JHocz" },
    { id: "therme", label: "♨️ תרמה בוקרשט", className: "btn-tour", url: "https://klook.tpk.lu/87GTfKXQ" },
    { id: "bran", label: "🏰 טירת בראן (אופציונלי)", className: "btn-car", url: "https://tiqets.tpk.lu/FESbKi7S" },
    { id: "esim", label: "📶 eSIM לרומניה · Yesim", className: "btn-tool", url: "https://yesim.tpk.lu/JykjOpT6" },
    { id: "transfer", label: "🚕 העברה משדה התעופה", className: "btn-tool", url: "https://tpk.lu/LsjV6srf" }
  ],

  instagram: "https://www.instagram.com/escape.mode.go/"
};
