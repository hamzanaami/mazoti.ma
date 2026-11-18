/* JavaScript copy of the model, for the interactive parts of the page.
   Mirrors src/mazoti/pricing.py and src/mazoti/inventory.py. Arguments are positional in the
   same order as the Python functions, so selfCheck() can replay the reference cases that
   scripts/build_site_data.py exports. Money is MAD per litre. */
(function (M) {
  "use strict";

  function quoteToMadPerL(quoteUsdPerT, usdmad, densityKgPerL) {
    return quoteUsdPerT * usdmad * densityKgPerL / 1000;
  }

  function structure(cif, approach, tic, grossMargin, stationMargin, vat, pump) {
    var purchaseCost = cif + approach + tic;
    return {
      cif: cif, approach: approach, tic: tic, gross_margin: grossMargin,
      station_margin: stationMargin, vat: vat, pump: pump,
      purchase_cost: purchaseCost,
      cession_price: purchaseCost + grossMargin,
      tax_share: (tic + vat) / pump
    };
  }

  /* pump = (cif + approach + tic + gross_margin + station_margin) * (1 + vat_rate) */
  function buildUp(cif, tic, approach, grossMargin, stationMargin, vatRate) {
    if (vatRate === undefined) vatRate = 0.10;
    var exVat = cif + approach + tic + grossMargin + stationMargin;
    var vat = exVat * vatRate;
    return structure(cif, approach, tic, grossMargin, stationMargin, vat, exVat + vat);
  }

  function decompose(cif, purchaseCost, cessionPrice, pump, tic, vatRate) {
    if (vatRate === undefined) vatRate = 0.10;
    var exVat = pump / (1 + vatRate);
    return structure(cif, purchaseCost - cif - tic, tic, cessionPrice - purchaseCost,
      exVat - cessionPrice, pump - exVat, pump);
  }

  function fullPassThrough(deltaExTaxCost, vatRate) {
    if (vatRate === undefined) vatRate = 0.10;
    return deltaExTaxCost * (1 + vatRate);
  }

  function passThroughRate(deltaPump, deltaCif, vatRate, vatAdjusted) {
    if (vatRate === undefined) vatRate = 0.10;
    if (vatAdjusted === undefined) vatAdjusted = true;
    var benchmark = vatAdjusted ? fullPassThrough(deltaCif, vatRate) : deltaCif;
    return deltaPump / benchmark;
  }

  function wacWeight(stockDays, periodDays) {
    if (periodDays === undefined) periodDays = 15;
    if (stockDays < 0 || periodDays <= 0) throw new RangeError("bad stock or period days");
    return periodDays / (stockDays + periodDays);
  }

  function weightedAverageCost(replacementCost, weight, openingCost) {
    if (!(weight > 0 && weight <= 1)) throw new RangeError("weight must be in (0, 1]");
    if (!replacementCost.length) return [];
    var book = (openingCost === undefined || openingCost === null) ? replacementCost[0] : openingCost;
    return replacementCost.map(function (k) {
      book = (1 - weight) * book + weight * k;
      return book;
    });
  }

  var FUNCTIONS = {
    quote_to_mad_per_l: quoteToMadPerL,
    build_up: buildUp,
    decompose: decompose,
    pass_through_rate: passThroughRate,
    full_pass_through: fullPassThrough,
    wac_weight: wacWeight,
    weighted_average_cost: weightedAverageCost
  };

  function close(a, b) {
    if (typeof b === "number") return typeof a === "number" && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
    if (Array.isArray(b)) return Array.isArray(a) && a.length === b.length && b.every(function (v, i) { return close(a[i], v); });
    if (b && typeof b === "object") return Object.keys(b).every(function (k) { return close(a && a[k], b[k]); });
    return a === b;
  }

  /* Replay the Python reference cases. Returns {total, failed: [names]}. */
  function selfCheck(cases) {
    var total = 0, failed = [];
    Object.keys(cases || {}).forEach(function (name) {
      var fn = FUNCTIONS[name];
      cases[name].forEach(function (c, i) {
        total += 1;
        var ok = false;
        try { ok = !!fn && close(fn.apply(null, c.args), c.result); } catch (e) { ok = false; }
        if (!ok) failed.push(name + "#" + i);
      });
    });
    return { total: total, failed: failed };
  }

  M.quoteToMadPerL = quoteToMadPerL;
  M.buildUp = buildUp;
  M.decompose = decompose;
  M.fullPassThrough = fullPassThrough;
  M.passThroughRate = passThroughRate;
  M.wacWeight = wacWeight;
  M.weightedAverageCost = weightedAverageCost;
  M.selfCheck = selfCheck;
})(window.MazotiModel = {});
