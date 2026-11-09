/**
 * Escape Mode – easy-to-edit deals data
 * Add a new object to ACTIVE_DEALS (or replace the current one) when a destination goes live.
 * Only include affiliate URLs that already exist in Travelpayouts (tpk.lu). Never invent links.
 * Leave `price` empty / null if the price was not verified this session.
 *
 * Larnaca affiliate links (Travelpayouts).
 * (same URLs used in the live Instagram DM automations).
 */
window.ESCAPE_MODE_DEALS = {
  /* tools shown under "כלים שאני משתמש בהם" – omit any without a real affiliate URL */
  tools: [
    {
      id: "yesim",
      label: "eSIM לחו״ל · Yesim",
      url: "https://yesim.tpk.lu/jKSTo7V6",
      note: "post1_esim_yesim / affiliate_links_out.csv"
    },
    {
      id: "airhelp",
      label: "פיצוי על עיכוב טיסה · AirHelp",
      url: "https://airhelp.tpk.lu/eHiF6Xx3",
      note: "all_airhelp / affiliate_links_out.csv"
    }
    /* Missing affiliate links (no tpk.lu URL on the box) — skipped on purpose:
       - Saily (target URL exists, no affiliate shortlink generated)
       - Airalo (no affiliate shortlink on the box)
    */
  ],

  instagram: "https://www.instagram.com/escape.mode.go/",

  /* The currently promoted destination. Swap this block for the next deal. */
  active: {
    id: "larnaca-hanukkah-2026",
    flag: "🇨🇾",
    badge: "הדיל הפעיל",
    title: "לרנקה · קפריסין",
    meta: "4 ימים · טיסה ישירה · חנוכה",
    /* price intentionally omitted — not re-verified this session */
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
};
