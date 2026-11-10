/* Escape Mode – Bucharest itinerary map (DRAFT). Google Maps JS API. */
(function () {
  "use strict";

  var D = window.ESCAPE_MAP_BUCHAREST;
  if (!D) {
    var fb0 = document.getElementById("map-fallback");
    if (fb0) fb0.hidden = false;
    return;
  }

  var LRI = "\u2066", PDI = "\u2069";
  var CFG = window.ESCAPE_MAP_CONFIG || {};
  var map = null;
  var infoWindow = null;
  var markers = {};
  var lines = {};
  var listItems = {};
  var activeDay = "all";
  var mapReady = false;
  var PinOverlay = null;
  var hotelMarkers = {};
  var hotelsOn = true;
  var HOTEL_COLOR = "#9a3412";

  /* ---- same helpers as linkpage subid.patch ---- */
  function allowedHttpUrl(value) {
    if (typeof value !== "string") return "";
    try {
      var u = new URL(value, window.location.href);
      return u.protocol === "https:" || u.protocol === "http:" ? u.href : "";
    } catch (e) { return ""; }
  }
  function isTravelpayoutsHost(hostname) {
    return hostname === "tpk.lu" || hostname.endsWith(".tpk.lu");
  }
  function withSubId(href, subId) {
    if (!href || !subId) return href;
    try {
      var p = new URL(href);
      if (!isTravelpayoutsHost(p.hostname)) return href;
      p.searchParams.set("sub_id", subId);
      return allowedHttpUrl(p.href) || href;
    } catch (e) { return href; }
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function track(a, name) { a.setAttribute("data-goatcounter-click", "map-" + D.slug + "-" + name); }
  function rebindGoat() {
    if (window.goatcounter && typeof window.goatcounter.bind_events === "function") {
      try { window.goatcounter.bind_events(); } catch (e) { /* analytics optional */ }
    }
  }
  function ll(s) { return s.lat.toFixed(6) + "," + s.lng.toFixed(6); }
  function gmapsPoint(s) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ll(s));
  }
  function gmapsDay(day) {
    var pts = day.stops.map(function (id) { return D.stops[id]; });
    if (pts.length < 2) return gmapsPoint(pts[0]);
    var u = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(ll(pts[0])) +
      "&destination=" + encodeURIComponent(ll(pts[pts.length - 1]));
    if (pts.length > 2) {
      u += "&waypoints=" + encodeURIComponent(pts.slice(1, -1).map(ll).join("|"));
    }
    return u + "&travelmode=" + (day.mode || "walking");
  }
  function dealById(id) {
    for (var i = 0; i < D.deals.length; i++) if (D.deals[i].id === id) return D.deals[i];
    return null;
  }
  function dealLink(deal, extraCls) {
    var href = allowedHttpUrl(deal.url);
    if (!href) return null;
    var a = el("a", "btn " + (deal.className || "") + (extraCls ? " " + extraCls : ""), deal.label);
    a.href = withSubId(href, D.subId);
    a.rel = "noopener noreferrer sponsored nofollow";
    a.target = "_blank";
    track(a, deal.id);
    return a;
  }
  function bookLink(stopId, book) {
    var href = allowedHttpUrl(book.url);
    if (!href) return null;
    var a = el("a", "btn btn-sm " + (book.className || "btn-tour"), book.label);
    a.href = withSubId(href, "map_bucharest_" + stopId);
    a.rel = "sponsored noopener noreferrer";
    a.target = "_blank";
    track(a, "book-" + stopId);
    return a;
  }
  function hrefKey(href) {
    try {
      var u = new URL(href);
      u.search = "";
      u.hash = "";
      return u.href.replace(/\/$/, "");
    } catch (e) { return href; }
  }
  function dayLabel(day) { return "יום " + day.n + " · " + LRI + day.date + PDI; }

  function hasRealKey() {
    var k = CFG.apiKey;
    return typeof k === "string" && k.length > 10 && k.indexOf("__GOOGLE_MAPS_API_KEY__") === -1;
  }

  /* ---- header meta ---- */
  var meta = document.getElementById("trip-meta");
  if (meta) {
    meta.textContent = [LRI + D.datesLabel + PDI, D.meta, "מ־" + D.price].join(" · ");
  }

  function mapsHref(s) {
    return (s.maps && allowedHttpUrl(s.maps.uri)) || gmapsPoint(s);
  }
  function formatRating(maps) {
    if (!maps || maps.rating == null) return "";
    var t = String(maps.rating);
    if (maps.reviewCount != null) t += " (" + Number(maps.reviewCount).toLocaleString("he-IL") + ")";
    return t;
  }
  function hoursValNode(note) {
    /* RTL phrase; each "day + time" group is nowrap; 24h ranges are LTR isolates. */
    var wrap = el("span", "em-popup-hours-val");
    wrap.dir = "rtl";
    var chunks = note.split(" · ");
    chunks.forEach(function (chunk, i) {
      if (i) wrap.appendChild(document.createTextNode(" · "));
      var group = el("span", "em-hours-chunk");
      var re = /(\d{1,2}:\d{2}–\d{2}:\d{2})/g;
      var last = 0, m;
      while ((m = re.exec(chunk))) {
        if (m.index > last) group.appendChild(document.createTextNode(chunk.slice(last, m.index)));
        var t = el("bdi", "em-hours-time");
        t.dir = "ltr";
        t.textContent = m[1];
        group.appendChild(t);
        last = m.index + m[1].length;
      }
      if (last < chunk.length) group.appendChild(document.createTextNode(chunk.slice(last)));
      wrap.appendChild(group);
    });
    return wrap;
  }
  function appendMapsFacts(parent, s) {
    var maps = s.maps;
    if (!maps) return;
    if (maps.rating != null) {
      var row = el("p", "em-popup-rating");
      row.dir = "ltr";
      row.appendChild(el("span", "em-star", "★"));
      row.appendChild(document.createTextNode(" " + formatRating(maps)));
      parent.appendChild(row);
    }
    if (maps.hoursNote) {
      var hrs = el("p", "em-popup-hours");
      hrs.appendChild(el("span", "em-popup-hours-label", "שעות"));
      hrs.appendChild(hoursValNode(maps.hoursNote));
      parent.appendChild(hrs);
    }
  }
  function appendMapsAttribution(parent, s) {
    if (!s.maps || !allowedHttpUrl(s.maps.uri)) return;
    var attr = el("p", "em-popup-attr");
    var gm = el("span", "em-gmaps-attr");
    gm.setAttribute("translate", "no");
    gm.textContent = "Google Maps";
    attr.appendChild(gm);
    parent.appendChild(attr);
  }
  function popupNode(id, s, day, num) {
    var w = el("div", "em-popup");
    w.dir = "rtl";
    var h = el("div", "em-popup-day", dayLabel(day) + (s.optional ? " · אופציה" : " · תחנה " + num));
    h.style.color = day.color;
    w.appendChild(h);
    w.appendChild(el("strong", "em-popup-name", s.name));
    var lat = el("bdi", "em-popup-latin", s.latin);
    lat.dir = "ltr";
    w.appendChild(lat);
    w.appendChild(el("p", "em-popup-line", s.line));
    appendMapsFacts(w, s);
    var g = el("a", "em-popup-link", "פתח בגוגל מפות");
    g.href = mapsHref(s); g.target = "_blank"; g.rel = "noopener noreferrer";
    track(g, id.replace(/\d+$/, "") + "-gmaps");
    w.appendChild(g);
    appendMapsAttribution(w, s);
    var seen = {};
    var books = s.book || [];
    if (books.length) {
      var box = el("div", "em-popup-book");
      books.forEach(function (bk) {
        var a = bookLink(id, bk);
        if (!a) return;
        seen[hrefKey(a.href)] = true;
        box.appendChild(a);
      });
      if (box.childNodes.length) w.appendChild(box);
    }
    if (s.deal) {
      var dl = dealById(s.deal);
      var a = dl && dealLink(dl, "btn-sm");
      if (a && !seen[hrefKey(a.href)]) w.appendChild(a);
    }
    return w;
  }

  function formatHotelRating(h) {
    if (h.rating == null) return "";
    var t = String(h.rating);
    if (h.ratingScale) t += " / " + h.ratingScale;
    if (h.reviewCount != null) t += " · " + Number(h.reviewCount).toLocaleString("he-IL") + " ביקורות";
    return t;
  }
  function formatHotelDate(iso) {
    if (!iso) return "";
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return p[2] + "." + p[1] + "." + p[0];
  }
  function hotelPopupNode(h) {
    var w = el("div", "em-popup em-popup--hotel");
    w.dir = "rtl";
    w.appendChild(el("div", "em-popup-day", "לינה · " + h.area));
    w.appendChild(el("strong", "em-popup-name", h.name));
    var lat = el("bdi", "em-popup-latin", h.latin);
    lat.dir = "ltr";
    w.appendChild(lat);
    if (h.rating != null) {
      var row = el("p", "em-popup-rating");
      row.dir = "ltr";
      row.appendChild(el("span", "em-star", "★"));
      row.appendChild(document.createTextNode(" " + formatHotelRating(h)));
      w.appendChild(row);
    }
    var src = el("p", "em-popup-source");
    src.textContent = "מקור: " + (h.ratingSource || "") + (h.ratingDate ? ", " + formatHotelDate(h.ratingDate) : "");
    w.appendChild(src);
    /* No affiliate hotel link: no hotel program is connected on this Travelpayouts project. */
    return w;
  }

  function closePopup() {
    if (infoWindow) infoWindow.close();
  }

  function openPopup(it) {
    if (!mapReady || !infoWindow || !it) return;
    infoWindow.setContent(popupNode(it.id, it.stop, it.dayObj, it.num));
    infoWindow.setPosition(it.position);
    infoWindow.open({ map: map });
    highlight(it.day + ":" + it.id);
    google.maps.event.addListenerOnce(infoWindow, "domready", function () { rebindGoat(); });
  }

  function definePinOverlay() {
    PinOverlay = function (opts) {
      this.position_ = opts.position;
      this.color_ = opts.color;
      this.label_ = opts.label;
      this.optional_ = !!opts.optional;
      this.kind_ = opts.kind || "stop";
      this.title_ = opts.title || "";
      this.onClick_ = opts.onClick;
      this.div_ = null;
    };
    PinOverlay.prototype = new google.maps.OverlayView();
    PinOverlay.prototype.onAdd = function () {
      var wrap = document.createElement("div");
      wrap.className = "em-pin-wrap";
      wrap.style.position = "absolute";
      wrap.style.width = "32px";
      wrap.style.height = "32px";
      wrap.style.cursor = "pointer";
      if (this.title_) wrap.title = this.title_;
      var pin = document.createElement("span");
      pin.className = "em-pin" + (this.optional_ ? " em-pin--alt" : "") + (this.kind_ === "hotel" ? " em-pin--hotel" : "");
      pin.style.setProperty("--c", this.color_);
      if (this.kind_ === "hotel") {
        pin.setAttribute("aria-hidden", "true");
        pin.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" focusable="false"><path fill="currentColor" d="M4 11V9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2h3a2 2 0 0 1 2 2v5h-2v-2H4v2H2v-7a2 2 0 0 1 2-2zm3-3a1 1 0 0 0-1 1v2h6V9a1 1 0 0 0-1-1H7z"/></svg>';
      } else {
        pin.textContent = this.optional_ ? "★" : String(this.label_);
      }
      wrap.appendChild(pin);
      var self = this;
      wrap.addEventListener("click", function (e) {
        e.stopPropagation();
        if (self.onClick_) self.onClick_();
      });
      this.div_ = wrap;
      this.getPanes().overlayMouseTarget.appendChild(wrap);
    };
    PinOverlay.prototype.draw = function () {
      if (!this.div_) return;
      var p = this.getProjection().fromLatLngToDivPixel(this.position_);
      if (!p) return;
      this.div_.style.left = (p.x - 16) + "px";
      this.div_.style.top = (p.y - 16) + "px";
    };
    PinOverlay.prototype.onRemove = function () {
      if (this.div_ && this.div_.parentNode) this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    };
    PinOverlay.prototype.getPosition = function () { return this.position_; };
  }

  function fitTo(positions) {
    if (!mapReady || !positions.length) return;
    if (positions.length === 1) {
      map.setCenter(positions[0]);
      map.setZoom(14);
      return;
    }
    var b = new google.maps.LatLngBounds();
    positions.forEach(function (p) { b.extend(p); });
    map.fitBounds(b, 36);
    google.maps.event.addListenerOnce(map, "idle", function () {
      if (map.getZoom() > 16) map.setZoom(16);
    });
  }

  function show(dayKey) {
    activeDay = dayKey;
    closePopup();
    var bounds = [];
    Object.keys(markers).forEach(function (k) {
      var it = markers[k];
      var on = dayKey === "all" ? !it.alt : it.day === dayKey;
      if (mapReady) {
        it.overlay.setMap(on ? map : null);
        if (on && !it.alt && !(dayKey === "all" && it.outside)) bounds.push(it.position);
      }
    });
    Object.keys(lines).forEach(function (n) {
      var on = dayKey === "all" || Number(n) === dayKey;
      if (mapReady) lines[n].setMap(on ? map : null);
    });
    if (mapReady) fitTo(bounds);

    Array.prototype.forEach.call(document.querySelectorAll(".day-tab"), function (b) {
      var sel = b.getAttribute("data-day") === String(dayKey);
      b.setAttribute("aria-selected", sel ? "true" : "false");
      b.tabIndex = sel ? 0 : -1;
    });
    Array.prototype.forEach.call(document.querySelectorAll(".day-block"), function (blk) {
      blk.hidden = !(dayKey === "all" || blk.getAttribute("data-day") === String(dayKey));
    });
    var note = document.getElementById("alt-note");
    if (note) note.hidden = dayKey !== "all";
    var note2 = document.getElementById("outside-note");
    if (note2) note2.hidden = dayKey !== "all";
  }

  function highlight(key) {
    Object.keys(listItems).forEach(function (k) { listItems[k].classList.toggle("is-active", k === key); });
  }

  function openHotelPopup(h) {
    if (!mapReady || !infoWindow || !h) return;
    var rec = hotelMarkers[h.id];
    if (!rec) return;
    infoWindow.setContent(hotelPopupNode(h));
    infoWindow.setPosition(rec.position);
    infoWindow.open({ map: map });
    highlight("hotel:" + h.id);
    google.maps.event.addListenerOnce(infoWindow, "domready", function () { rebindGoat(); });
  }
  function focusHotel(id) {
    var h = (D.hotels || []).filter(function (x) { return x.id === id; })[0];
    if (!h) return;
    highlight("hotel:" + id);
    var rec = hotelMarkers[id];
    if (mapReady && rec) {
      map.panTo(rec.position);
      openHotelPopup(h);
    }
  }
  function setHotelsVisible(on) {
    hotelsOn = !!on;
    var btn = document.getElementById("hotels-toggle");
    if (btn) btn.setAttribute("aria-pressed", hotelsOn ? "true" : "false");
    var blk = document.getElementById("hotel-block");
    if (blk) blk.hidden = !hotelsOn;
    Object.keys(hotelMarkers).forEach(function (id) {
      var rec = hotelMarkers[id];
      if (rec && rec.overlay) rec.overlay.setMap(hotelsOn && mapReady ? map : null);
    });
    if (!hotelsOn) {
      var act = document.querySelector(".stop.stop--hotel.is-active");
      if (act) closePopup();
    }
  }
  function focusStop(key) {
    var it = markers[key];
    if (it) {
      if (activeDay !== "all" && activeDay !== it.day) show(it.day);
      if (it.alt && activeDay === "all") show(it.day);
      if (mapReady) {
        map.panTo(it.position);
        if (map.getZoom() < 15) map.setZoom(15);
        openPopup(it);
      }
    }
    highlight(key);
    var mapEl = document.getElementById("map");
    if (mapEl && mapEl.getBoundingClientRect().top < 0) mapEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---- tabs ---- */
  var tabs = document.getElementById("day-tabs");
  function addTab(key, label, color) {
    var b = el("button", "day-tab", label);
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("data-day", String(key));
    b.setAttribute("aria-controls", "map");
    b.style.setProperty("--c", color);
    b.addEventListener("click", function () { show(key); });
    tabs.appendChild(b);
  }
  addTab("all", "כל הימים", "#1c2430");
  D.days.forEach(function (day) { addTab(day.n, dayLabel(day), day.color); });
  var hotelsToggle = el("button", "layer-toggle");
  hotelsToggle.type = "button";
  hotelsToggle.id = "hotels-toggle";
  hotelsToggle.setAttribute("aria-pressed", hotelsOn ? "true" : "false");
  hotelsToggle.textContent = "איפה לישון";
  hotelsToggle.addEventListener("click", function () { setHotelsVisible(!hotelsOn); });
  var layerBar = document.getElementById("layer-bar") || tabs.parentNode;
  layerBar.appendChild(hotelsToggle);
  tabs.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var all = Array.prototype.slice.call(tabs.querySelectorAll(".day-tab"));
    var i = all.indexOf(document.activeElement);
    if (i < 0) return;
    /* RTL: ArrowLeft = next */
    var j = e.key === "ArrowLeft" ? (i + 1) % all.length : (i - 1 + all.length) % all.length;
    all[j].focus(); all[j].click(); e.preventDefault();
  });

  /* ---- stop list ---- */
  var list = document.getElementById("stop-list");
  D.days.forEach(function (day) {
    var blk = el("section", "day-block");
    blk.setAttribute("data-day", String(day.n));
    blk.style.setProperty("--c", day.color);
    var head = el("div", "day-head");
    var badge = el("span", "day-badge", "יום " + day.n);
    var htxt = el("div", "day-head-text");
    htxt.appendChild(el("strong", null, day.title));
    htxt.appendChild(el("span", "day-date", day.weekday + " · " + LRI + day.date + PDI));
    head.appendChild(badge); head.appendChild(htxt);
    blk.appendChild(head);

    var ol = el("ol", "stops");
    function addItem(id, num, optional) {
      var s = D.stops[id];
      var key = day.n + ":" + id;
      var li = el("li", "stop" + (optional ? " stop--alt" : ""));
      var btn = el("button", "stop-btn");
      btn.type = "button";
      var n = el("span", "stop-num", optional ? "★" : String(num));
      var t = el("span", "stop-text");
      t.appendChild(el("span", "stop-name", s.name));
      var latn = el("bdi", "stop-latin", s.latin); latn.dir = "ltr";
      t.appendChild(latn);
      t.appendChild(el("span", "stop-line", s.line));
      if (s.maps && s.maps.rating != null) {
        var sr = el("span", "stop-rating");
        sr.dir = "ltr";
        sr.appendChild(el("span", "em-star", "★"));
        sr.appendChild(document.createTextNode(" " + formatRating(s.maps)));
        t.appendChild(sr);
      }
      btn.appendChild(n); btn.appendChild(t);
      btn.addEventListener("click", function () { focusStop(key); });
      li.appendChild(btn);
      listItems[key] = li;
      ol.appendChild(li);
    }
    day.stops.forEach(function (id, i) { addItem(id, i + 1, false); });
    if (day.alt && day.alt.length) {
      var or = el("li", "stop-or", day.altNote || "או");
      ol.appendChild(or);
      day.alt.forEach(function (id) { addItem(id, 0, true); });
    }
    blk.appendChild(ol);

    var route = el("a", "day-route");
    route.appendChild(document.createTextNode(day.stops.length > 1 ? "🧭 מסלול היום ב-" : "📍 פתח ב-"));
    var gm = el("span", "ltr");
    gm.setAttribute("translate", "no");
    gm.textContent = "Google Maps";
    route.appendChild(gm);
    route.href = gmapsDay(day); route.target = "_blank"; route.rel = "noopener noreferrer";
    track(route, "day" + day.n + "-route");
    blk.appendChild(route);
    list.appendChild(blk);
  });

  /* ---- hotels list ---- */
  var hotelListHost = document.getElementById("stop-list");
  if (hotelListHost && D.hotels && D.hotels.length) {
    var hBlk = el("section", "day-block hotel-block");
    hBlk.id = "hotel-block";
    hBlk.style.setProperty("--c", HOTEL_COLOR);
    hBlk.hidden = !hotelsOn;
    var hHead = el("div", "day-head");
    hHead.appendChild(el("span", "day-badge hotel-badge", "לינה"));
    var hTxt = el("div", "day-head-text");
    hTxt.appendChild(el("strong", "", "איפה לישון"));
    hTxt.appendChild(el("span", "day-date", "מרכז העיר · דירוגי Booking.com"));
    hHead.appendChild(hTxt);
    hBlk.appendChild(hHead);
    var hul = el("ul", "stops");
    D.hotels.forEach(function (h) {
      var key = "hotel:" + h.id;
      var li = el("li", "stop stop--hotel");
      var btn = el("button", "stop-btn");
      btn.type = "button";
      var num = el("span", "stop-num hotel-num");
      num.setAttribute("aria-hidden", "true");
      num.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" focusable="false"><path fill="currentColor" d="M4 11V9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2h3a2 2 0 0 1 2 2v5h-2v-2H4v2H2v-7a2 2 0 0 1 2-2zm3-3a1 1 0 0 0-1 1v2h6V9a1 1 0 0 0-1-1H7z"/></svg>';
      btn.appendChild(num);
      var tx = el("div", "stop-text");
      tx.appendChild(el("div", "stop-name", h.name));
      var latin = el("bdi", "stop-latin", h.latin);
      latin.dir = "ltr";
      tx.appendChild(latin);
      tx.appendChild(el("div", "stop-line", h.area));
      if (h.rating != null) tx.appendChild(el("div", "stop-rating", "★ " + formatHotelRating(h)));
      btn.appendChild(tx);
      btn.addEventListener("click", function () { focusHotel(h.id); });
      li.appendChild(btn);
      hul.appendChild(li);
      listItems[key] = li;
    });
    hBlk.appendChild(hul);
    var note = el("p", "hotel-source-note", "הדירוגים מאתר Booking.com, נבדקו ב-10.11.2026. אין קישור הזמנה שותפים — תוכנית מלונות לא מחוברת.");
    hBlk.appendChild(note);
    hotelListHost.appendChild(hBlk);
  }

  /* ---- deals ---- */
  var dealsWrap = document.getElementById("deal-actions");
  D.deals.forEach(function (d) { var a = dealLink(d); if (a) dealsWrap.appendChild(a); });

  var ig = document.getElementById("cta-ig");
  if (ig && allowedHttpUrl(D.instagram)) ig.href = D.instagram;


  window.__emBuildHoursVal = hoursValNode;
  window.__emBuildPopup = popupNode;
  window.__emBuildHotelPopup = hotelPopupNode;
  window.__emBookLink = bookLink;
  show("all");
  rebindGoat();

  function showFallback() {
    var fb = document.getElementById("map-fallback");
    if (fb) fb.hidden = false;
  }

  function buildOverlays() {
    definePinOverlay();
    infoWindow = new google.maps.InfoWindow({ maxWidth: 280 });
    google.maps.event.addListener(infoWindow, "domready", function () { rebindGoat(); });
    google.maps.event.addListener(map, "click", function () { closePopup(); });

    D.days.forEach(function (day) {
      var path = [];
      day.stops.forEach(function (id, i) {
        var s = D.stops[id];
        var pos = new google.maps.LatLng(s.lat, s.lng);
        var key = day.n + ":" + id;
        var rec = {
          id: id, stop: s, day: day.n, dayObj: day, num: i + 1,
          position: pos, outside: !!s.outside, alt: false
        };
        rec.overlay = new PinOverlay({
          position: pos, color: day.color, label: i + 1, title: s.name,
          onClick: function () { focusStop(key); }
        });
        markers[key] = rec;
        path.push(pos);
      });
      (day.alt || []).forEach(function (id) {
        var s = D.stops[id];
        var pos = new google.maps.LatLng(s.lat, s.lng);
        var key = day.n + ":" + id;
        var rec = {
          id: id, stop: s, day: day.n, dayObj: day, num: 0,
          position: pos, alt: true
        };
        rec.overlay = new PinOverlay({
          position: pos, color: day.color, label: 0, optional: true, title: s.name,
          onClick: function () { focusStop(key); }
        });
        markers[key] = rec;
      });
      if (path.length > 1) {
        var opts = {
          path: path,
          geodesic: false,
          strokeColor: day.color,
          strokeWeight: 4,
          strokeOpacity: day.mode === "driving" ? 0 : 0.85,
          map: null,
          clickable: false
        };
        if (day.mode === "driving") {
          opts.icons = [{
            icon: { path: "M 0,-1 0,1", strokeOpacity: 0.85, strokeColor: day.color, scale: 4, strokeWeight: 4 },
            offset: "0",
            repeat: "16px"
          }];
        }
        lines[day.n] = new google.maps.Polyline(opts);
      }
    });
    mapReady = true;
    show(activeDay);
  
    (D.hotels || []).forEach(function (h) {
      var position = { lat: h.lat, lng: h.lng };
      var rec = { id: h.id, hotel: h, position: position, overlay: null };
      rec.overlay = new PinOverlay({
        position: position,
        color: HOTEL_COLOR,
        label: "",
        kind: "hotel",
        title: h.name,
        onClick: function () { focusHotel(h.id); }
      });
      hotelMarkers[h.id] = rec;
      if (hotelsOn) rec.overlay.setMap(map);
    });
}

  function initGoogleMap() {
    var elMap = document.getElementById("map");
    if (!elMap || !window.google || !google.maps) {
      showFallback();
      return;
    }
    map = new google.maps.Map(elMap, {
      center: { lat: 44.436, lng: 26.097 },
      zoom: 13,
      mapTypeId: "roadmap",
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: true,
      scaleControl: false,
      rotateControl: false,
      scrollwheel: false,
      gestureHandling: "cooperative",
      keyboardShortcuts: false,
      clickableIcons: false,
      disableDoubleClickZoom: false
    });
    buildOverlays();
    var fb = document.getElementById("map-fallback");
    if (fb) fb.hidden = true;
    window.addEventListener("resize", function () {
      if (!map) return;
      google.maps.event.trigger(map, "resize");
    });
  }

  /* Load the Maps JS API only when a real (injected) key is present.
     The working-tree placeholder never triggers a network call. */
  if (!hasRealKey()) {
    showFallback();
    return;
  }

  window.gm_authFailure = function () {
    window.__EM_MAPS_AUTH_FAILURE = true;
    showFallback();
  };

  var mapsCbName = "__emMapsReady";
  window[mapsCbName] = function () {
    try { initGoogleMap(); }
    catch (e) { showFallback(); }
  };

  var params = new URLSearchParams({
    key: CFG.apiKey,
    language: CFG.language || "iw",
    region: CFG.region || "IL",
    v: "weekly",
    callback: mapsCbName
    /* no libraries= — Map, OverlayView, Polyline, InfoWindow are in the core */
  });
  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?" + params.toString();
  script.async = true;
  script.defer = true;
  script.onerror = function () { showFallback(); };
  document.head.appendChild(script);
})();
