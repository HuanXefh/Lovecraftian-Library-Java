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
  const getBase = function(bundleStr) {
    return Vars.headless ? "" : Core.bundle.get(bundleStr.toLowerCase());
  };
  exports.getBase = getBase;


  /**
   * `BUNDLE`: "info.<nameMod>-info-<bp>.name" or "info.<nameMod>-info-<bp>.description".
   * @param {string} nameMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return {string}
   */
  const getInfo = function(nameMod, bp, isDes) {
    return getBase("info." + nameMod + "-info-" + bp + (isDes ? ".description" : ".name"));
  };
  exports.getInfo = getInfo;


  /**
   * `BUNDLE`: "info.<nameMod>-term-<bp>.name" or "info.<nameMod>-term-<bp>.description".
   * @param {string} nameMod
   * @param {string} bp
   * @param {boolean|unset} [isDes]
   * @return {string}
   */
  const getTerm = function(nameMod, bp, isDes) {
    return getBase("term." + nameMod + "-term-" + bp + (isDes ? ".description" : ".name"));
  };
  exports.getTerm = getTerm;


  /**
   * `BUNDLE`: "stat.<nameMod>-stat-<bp>".
   * @param {string} nameMod
   * @param {string} bp
   * @return {string}
   */
  const getStat = function(nameMod, bp) {
    return getBase("stat." + nameMod + "-stat-" + bp);
  };
  exports.getStat = getStat;


  /* <------------------------------ drama ------------------------------ */


  /**
   * `BUNDLE`: "chara.<nameMod>-<nameChara>".
   * @param {string} nameMod
   * @param {string} nameChara
   * @return {string}
   */
  const getChara = function(nameMod, nameChara) {
    return getBase("chara." + nameMod + "-" + nameChara);
  };
  exports.getChara = getChara;


  /**
   * `BUNDLE`: "dial.<nameMod>-<nameDial>-<ind>".
   * @param {string} nameMod
   * @param {string} nameDial
   * @param {number} ind
   * @return {string}
   */
  const getDialText = function(nameMod, nameDial, ind) {
    return getBase("dial." + nameMod + "-" + nameDial + "-" + ind);
  };
  exports.getDialText = getDialText;
