(function () {
  "use strict";

  function allowedHttpUrl(value) {
    if (typeof value !== "string") return "";
    try {
      var parsed = new URL(value.trim());
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
      return parsed.href;
    } catch (err) {
      return "";
    }
  }

  var data = window.ESCAPE_MODE_DEALS;
  if (!data || !data.active) return;

  var deal = data.active;
  var card = document.getElementById("active-deal");
  if (!card) return;

  var badge = document.createElement("div");
  badge.className = "deal-badge";
  var badgeLabel = deal.badge || "הדיל הפעיל";
  badge.textContent = deal.flag ? deal.flag + " " + badgeLabel : badgeLabel;

  var title = document.createElement("h2");
  title.textContent = deal.title;

  var metaParts = [];
  if (deal.datesLabel) metaParts.push("\u2066" + deal.datesLabel + "\u2069");
  if (deal.meta) metaParts.push(deal.meta);
  if (deal.price) metaParts.push("מ־\u2066" + deal.price + "\u2069");

  var meta = document.createElement("p");
  meta.className = "deal-meta";
  meta.textContent = metaParts.join(" · ");

  var actions = document.createElement("div");
  actions.className = "deal-actions";

  (deal.links || []).forEach(function (link) {
    if (!link) return;
    var href = allowedHttpUrl(link.url);
    if (!href) return;
    var a = document.createElement("a");
    a.className = "btn " + (link.className || "");
    a.href = href;
    a.rel = "noopener noreferrer sponsored nofollow";
    a.target = "_blank";
    a.textContent = link.label;
    actions.appendChild(a);
  });

  card.appendChild(badge);
  card.appendChild(title);
  if (metaParts.length) card.appendChild(meta);
  card.appendChild(actions);

  var cta = document.getElementById("cta-louz");
  var instagram = allowedHttpUrl(data.instagram);
  if (cta && instagram) cta.href = instagram;

  var tools = data.tools || [];
  var toolsSection = document.getElementById("tools-section");
  var toolsList = document.getElementById("tools-list");
  if (toolsSection && toolsList && tools.length) {
    tools.forEach(function (tool) {
      if (!tool) return;
      var href = allowedHttpUrl(tool.url);
      if (!href) return;
      var a = document.createElement("a");
      a.className = "btn btn-tool";
      a.href = href;
      a.rel = "noopener noreferrer sponsored nofollow";
      a.target = "_blank";
      a.textContent = tool.label;
      toolsList.appendChild(a);
    });
    if (toolsList.children.length) toolsSection.hidden = false;
  }
})();
