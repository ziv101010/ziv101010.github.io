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

  /* Latin dest slug from deal/tool id, e.g. bucharest-christmas-2026 → bucharest */
  function latinSlug(id) {
    if (typeof id !== "string") return "";
    var match = id.toLowerCase().match(/^[a-z]+/);
    return match ? match[0] : "";
  }

  /* Travelpayouts short links live on tpk.lu and *.tpk.lu */
  function isTravelpayoutsHost(hostname) {
    return hostname === "tpk.lu" || hostname.endsWith(".tpk.lu");
  }

  function withTravelpayoutsSubId(href, destSlug) {
    if (!href || !destSlug) return href;
    try {
      var parsed = new URL(href);
      if (!isTravelpayoutsHost(parsed.hostname)) return href;
      parsed.searchParams.set("sub_id", "linkpage_" + destSlug);
      /* Re-validate so the whitelist still accepts the tagged URL */
      return allowedHttpUrl(parsed.href) || href;
    } catch (err) {
      return href;
    }
  }

  function renderDeal(deal, card) {
    if (!deal || !card) return;

    var destSlug = latinSlug(deal.id);

    if (deal.image) {
      var img = document.createElement("img");
      img.className = "deal-image";
      img.src = deal.image;
      img.alt = deal.imageAlt || deal.title || "";
      img.width = deal.imageWidth || 640;
      img.height = deal.imageHeight || 427;
      img.loading = card.id === "active-deal" ? "eager" : "lazy";
      card.appendChild(img);
    }

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
      href = withTravelpayoutsSubId(href, destSlug);
      var a = document.createElement("a");
      a.className = "btn " + (link.className || "");
      a.href = href;
      a.rel = "noopener noreferrer sponsored nofollow";
      a.target = "_blank";
      a.textContent = link.label;
      if (destSlug && link.id) {
        a.setAttribute("data-goatcounter-click", "out-" + destSlug + "-" + link.id);
      }
      actions.appendChild(a);
    });

    card.appendChild(badge);
    card.appendChild(title);
    if (metaParts.length) card.appendChild(meta);
    card.appendChild(actions);
  }

  var data = window.ESCAPE_MODE_DEALS;
  if (!data || !data.active) return;

  renderDeal(data.active, document.getElementById("active-deal"));

  var more = data.more || [];
  var moreWrap = document.getElementById("more-deals");
  var moreLabel = document.getElementById("more-label");
  if (moreWrap && more.length) {
    more.forEach(function (deal, idx) {
      var section = document.createElement("section");
      section.className = "deal-card deal-card--secondary";
      section.id = "deal-" + (deal.id || idx);
      if (moreLabel) {
        section.setAttribute("aria-labelledby", "more-label");
      }
      renderDeal(deal, section);
      moreWrap.appendChild(section);
    });
    moreWrap.hidden = false;
    if (moreLabel) moreLabel.hidden = false;
  }

  var cta = document.getElementById("cta-louz");
  var instagram = allowedHttpUrl(data.instagram);
  if (cta && instagram) {
    cta.href = instagram;
    if (data.ctaLabel) cta.textContent = data.ctaLabel;
  }

  var tools = data.tools || [];
  var toolsSection = document.getElementById("tools-section");
  var toolsList = document.getElementById("tools-list");
  if (toolsSection && toolsList && tools.length) {
    tools.forEach(function (tool) {
      if (!tool) return;
      var href = allowedHttpUrl(tool.url);
      if (!href) return;
      var toolSlug = latinSlug(tool.id);
      href = withTravelpayoutsSubId(href, toolSlug);
      var a = document.createElement("a");
      a.className = "btn btn-tool";
      a.href = href;
      a.rel = "noopener noreferrer sponsored nofollow";
      a.target = "_blank";
      a.textContent = tool.label;
      if (toolSlug) {
        a.setAttribute("data-goatcounter-click", "out-" + toolSlug);
      }
      toolsList.appendChild(a);
    });
    if (toolsList.children.length) toolsSection.hidden = false;
  }
})();
