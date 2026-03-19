/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to read the bundle.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Most basic bundle reader method.
   * Will return empty string on headless ends.
   * @param {string} bundleStr
   * @return {string}
   */
  const _base = function(bundleStr) {
    return Vars.headless ? "" : Core.bundle.get(bundleStr.toLowerCase());
  };
  exports._base = _base;


  /**
   * <BUNDLE>: "info.<nmMod>-info-<bp>.name" or "info.<nmMod>-info-<bp>.description".
   * @param {string} nmMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return string
   */
  const _info = function(nmMod, bp, isDes) {
    return _base("info." + nmMod + "-info-" + bp + (isDes ? ".description" : ".name"));
  };
  exports._info = _info;


  /**
   * <BUNDLE>: "info.<nmMod>-term-<bp>.name" or "info.<nmMod>-term-<bp>.description".
   * @param {string} nmMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return string
   */
  const _term = function(nmMod, bp, isDes) {
    return _base("term." + nmMod + "-term-" + bp + (isDes ? ".description" : ".name"));
  };
  exports._term = _term;


  /**
   * <BUNDLE>: "stat.<nmMod>-stat-<bp>".
   * @param {string} nmMod
   * @param {string} bp
   * @return string
   */
  const _stat = function(nmMod, bp) {
    return _base("stat." + nmMod + "-stat-" + bp);
  };
  exports._stat = _stat;


  /* <---------- drama ----------> */


  /**
   * <BUNDLE>: "chara.<nmMod>-<nmChara>".
   * @param {string} nmMod
   * @param {string} nmChara
   * @return string
   */
  const _chara = function(nmMod, nmChara) {
    return _base("chara." + nmMod + "-" + nmChara);
  };
  exports._chara = _chara;


  /**
   * <BUNDLE>: "dial.<nmMod>-<nmDial>-<ind>".
   * @param {string} nmMod
   * @param {string} nmDial
   * @param {number} ind
   * @return string
   */
  const _dialText = function(nmMod, nmDial, ind) {
    return _base("dial." + nmMod + "-" + nmDial + "-" + ind);
  };
  exports._dialText = _dialText;


  /**
   * <BUNDLE>: "dial.<nmMod>-<nmDial>-s<ind>".
   * @param {string} nmMod
   * @param {string} nmDial
   * @param {number} selInd
   * @return string
   */
  const _dialSelText = function(nmMod, nmDial, selInd) {
    return _base("dial." + nmMod + "-" + nmDial + "-s" + selInd);
  };
  exports._dialSelText = _dialSelText;
