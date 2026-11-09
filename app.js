(function () {
  "use strict";

  var data = window.ESCAPE_MODE_DEALS;
  if (!data || !data.active) return;

  var deal = data.active;
  var card = document.getElementById("active-deal");
  if (!card) return;

  var badge = document.createElement("div");
  badge.className = "deal-badge";
  badge.textContent = "🇨🇾 " + (deal.badge || "הדיל הפעיל");

  var title = document.createElement("h2");
  title.textContent = deal.title;

  var metaParts = [];
  if (deal.datesLabel) metaParts.push("\u2066" + deal.datesLabel + "\u2069");
  if (deal.meta) metaParts.push(deal.meta);
  if (deal.price) metaParts.push("מ־" + deal.price);

  var meta = document.createElement("p");
  meta.className = "deal-meta";
  meta.textContent = metaParts.join(" · ");

  var actions = document.createElement("div");
  actions.className = "deal-actions";

  (deal.links || []).forEach(function (link) {
    if (!link || !link.url) return;
    var a = document.createElement("a");
    a.className = "btn " + (link.className || "");
    a.href = link.url;
    a.rel = "noopener noreferrer sponsored";
    a.target = "_blank";
    a.textContent = link.label;
    actions.appendChild(a);
  });

  card.appendChild(badge);
  card.appendChild(title);
  if (metaParts.length) card.appendChild(meta);
  card.appendChild(actions);

  var cta = document.getElementById("cta-louz");
  if (cta && data.instagram) cta.href = data.instagram;

  var tools = data.tools || [];
  var toolsSection = document.getElementById("tools-section");
  var toolsList = document.getElementById("tools-list");
  if (toolsSection && toolsList && tools.length) {
    tools.forEach(function (tool) {
      if (!tool || !tool.url) return;
      var a = document.createElement("a");
      a.className = "btn btn-tool";
      a.href = tool.url;
      a.rel = "noopener noreferrer sponsored";
      a.target = "_blank";
      a.textContent = tool.label;
      toolsList.appendChild(a);
    });
    toolsSection.hidden = false;
  }
})();
