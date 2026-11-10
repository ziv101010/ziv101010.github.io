/**
 * Escape Mode – easy-to-edit deals data
 * Add a new object to ACTIVE_DEALS (or replace the current one) when a destination goes live.
 * Only include affiliate URLs that already exist in Travelpayouts (tpk.lu). Never invent links.
 * Leave `price` empty / null if the price was not verified this session.
 *
 * Featured: Bucharest Christmas market 17–21.12.2026 (verified ₪558).
 * Second: Larnaca Hanukkah 10–14.12.2026.
 * Affiliate shortlinks from /workspace/affiliate_links_out.csv (post2_* / post1_*).
 */
window.ESCAPE_MODE_DEALS = {
  /* tools shown under "כלים שאני משתמש בהם" – omit any without a real affiliate URL */
  tools: [
    {
      id: "yesim",
      label: "eSIM לחו״ל · Yesim",
      url: "https://yesim.tpk.lu/jKSTo7V6",
      note: "post1_esim_yesim / affiliate_links_out.csv (Cyprus default; Romania also on Bucharest card)"
    },
    {
      id: "airhelp",
      label: "פיצוי על עיכוב טיסה · AirHelp",
      url: "https://airhelp.tpk.lu/eHiF6Xx3",
      note: "all_airhelp / affiliate_links_out.csv"
    }
  ],

  instagram: "https://www.instagram.com/escape.mode.go/",
  ctaLabel: "רוצים לוז מלא? תגיבו לוז באינסטגרם",

  /* The currently promoted destination (first / featured). */
  active: {
    id: "bucharest-christmas-2026",
    flag: "🇷🇴",
    badge: "הדיל הפעיל",
    title: "בוקרשט · רומניה",
    meta: "4 ימים · Wizz ישירה · בלי טרולי · שוק כריסמס",
    price: "558 ₪",
    datesLabel: "17–21.12.2026",
    image: "images/bucharest-card.jpg",
    imageAlt: "שוק כריסמס בבוקרשט",
    links: [
      {
        id: "flight",
        label: "✈️ טיסה מתל אביב",
        className: "btn-flight",
        url: "https://aviasales.tpk.lu/nS3JHocz"
      },
      {
        id: "therme",
        label: "♨️ תרמה בוקרשט",
        className: "btn-tour",
        url: "https://klook.tpk.lu/87GTfKXQ"
      },
      {
        id: "bran",
        label: "🏰 טירת בראן (אופציונלי)",
        className: "btn-car",
        url: "https://tiqets.tpk.lu/FESbKi7S"
      },
      {
        id: "esim",
        label: "📶 eSIM לרומניה · Yesim",
        className: "btn-tool",
        url: "https://yesim.tpk.lu/JykjOpT6"
      },
      {
        id: "transfer",
        label: "🚕 העברה משדה התעופה",
        className: "btn-tool",
        url: "https://tpk.lu/LsjV6srf"
      }
    ],
    /* Same-site itinerary page. Not an affiliate URL, so it never gets a sub_id. */
    mapLink: {
      label: "🗺️ מפת לו״ז בוקרשט",
      url: "/bucharest-map/",
      click: "linkpage-bucharest-map"
    }
  },

  /* Older / secondary deals kept on the page under the featured card. */
  more: [
    {
      id: "larnaca-hanukkah-2026",
      flag: "🇨🇾",
      badge: "עוד דיל",
      title: "לרנקה · קפריסין",
      meta: "4 ימים · טיסה ישירה · חנוכה",
      price: null,
      datesLabel: "10–14.12.2026",
      links: [
        {
          id: "flight",
          label: "✈️ טיסה מתל אביב",
          className: "btn-flight",
          url: "https://aviasales.tpk.lu/jG6rqHWZ"
        },
        {
          id: "car",
          label: "🚗 השכרת רכב בלרנקה",
          className: "btn-car",
          url: "https://localrent.tpk.lu/LOFhsXU6"
        },
        {
          id: "tour",
          label: "🚶 סיור בעיר העתיקה",
          className: "btn-tour",
          url: "https://wegotrip.tpk.lu/rvUvUHxw"
        }
      ]
    }
  ]
};
