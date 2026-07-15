/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to read the bundle.
   * @module lovec/mdl/MDL_bundle
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


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
   * `BUNDLE`: "info.<nameMod>-info-<bp>.name" or "info.<nameMod>-info-<bp>.description".
   * @param {string} nameMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return string
   */
  const _info = function(nameMod, bp, isDes) {
    return _base("info." + nameMod + "-info-" + bp + (isDes ? ".description" : ".name"));
  };
  exports._info = _info;


  /**
   * `BUNDLE`: "info.<nameMod>-term-<bp>.name" or "info.<nameMod>-term-<bp>.description".
   * @param {string} nameMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return string
   */
  const _term = function(nameMod, bp, isDes) {
    return _base("term." + nameMod + "-term-" + bp + (isDes ? ".description" : ".name"));
  };
  exports._term = _term;


  /**
   * `BUNDLE`: "stat.<nameMod>-stat-<bp>".
   * @param {string} nameMod
   * @param {string} bp
   * @return string
   */
  const _stat = function(nameMod, bp) {
    return _base("stat." + nameMod + "-stat-" + bp);
  };
  exports._stat = _stat;


  /* <------------------------------ drama ------------------------------ */


  /**
   * `BUNDLE`: "chara.<nameMod>-<nameChara>".
   * @param {string} nameMod
   * @param {string} nameChara
   * @return string
   */
  const _chara = function(nameMod, nameChara) {
    return _base("chara." + nameMod + "-" + nameChara);
  };
  exports._chara = _chara;


  /**
   * `BUNDLE`: "dial.<nameMod>-<nameDial>-<ind>".
   * @param {string} nameMod
   * @param {string} nameDial
   * @param {number} ind
   * @return string
   */
  const _dialText = function(nameMod, nameDial, ind) {
    return _base("dial." + nameMod + "-" + nameDial + "-" + ind);
  };
  exports._dialText = _dialText;
