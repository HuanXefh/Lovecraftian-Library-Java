/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to read the bundle.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Base bundle reader method.
   * ---------------------------------------- */
  const _base = function(bundleStr) {
    return Vars.headless ? "" : Core.bundle.get(bundleStr.toLowerCase());
  };
  exports._base = _base;


  /* ----------------------------------------
   * NOTE:
   *
   * {info.*nmMod*-info-*bp*.name} or {info.*nmMod*-info-*bp*.description}.
   * ---------------------------------------- */
  const _info = function(nmMod, bp, isDes) {
    return Vars.headless ? "" : Core.bundle.get(("info." + nmMod + "-info-" + bp + (isDes ? ".description" : ".name")).toLowerCase());
  };
  exports._info = _info;


  /* ----------------------------------------
   * NOTE:
   *
   * {term.*nmMod*-term-*bp*.name} or {term.*nmMod*-term-*bp*.description}.
   * ---------------------------------------- */
  const _term = function(nmMod, bp, isDes) {
    return Vars.headless ? "" : Core.bundle.get(("term." + nmMod + "-term-" + bp + (isDes ? ".description" : ".name")).toLowerCase());
  };
  exports._term = _term;


  /* ----------------------------------------
   * NOTE:
   *
   * {stat.*nmMod*-stat-*bp*}.
   * ---------------------------------------- */
  const _stat = function(nmMod, bp) {
    return Vars.headless ? "" : Core.bundle.get(("stat." + nmMod + "-stat-" + bp).toLowerCase());
  };
  exports._stat = _stat;


  /* <---------- drama ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * {chara.*nmMod*-*nmChara*}.
   * ---------------------------------------- */
  const _chara = function(nmMod, nmChara) {
    return Vars.headless ? "" : Core.bundle.get(("chara." + nmMod + "-" + nmChara).toLowerCase());
  };
  exports._chara = _chara;


  /* ----------------------------------------
   * NOTE:
   *
   * {dial.*nmMod*-*nmDial*-*ind*}.
   * ---------------------------------------- */
  const _dialText = function(nmMod, nmDial, ind) {
    return Vars.headless ? "" : Core.bundle.get(("dial." + nmMod + "-" + nmDial + "-" + ind).toLowerCase());
  };
  exports._dialText = _dialText;


  /* ----------------------------------------
   * NOTE:
   *
   * {dial.*nmMod*-*nmDial*-s*ind*}.
   * ---------------------------------------- */
  const _dialSelText = function(nmMod, nmDial, selInd) {
    return Vars.headless ? "" : Core.bundle.get(("dial." + nmMod + "-" + nmDial + "-s" + selInd).toLowerCase());
  };
  exports._dialSelText = _dialSelText;
