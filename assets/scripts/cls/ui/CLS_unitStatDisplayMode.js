/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Handles display of unit health bar.
   * @class
   * @param {string} name
   * @param {Function} drawF - <ARGS>: e, x, y, frac, color, a, w, offY, amtSeg, armor, shield, speedMtp, dpsMtp, z.
   */
  const CLS_unitStatDisplayMode = newClass().initClass();


  CLS_unitStatDisplayMode.prototype.init = function(name, drawF) {
    this.name = registerUniqueName(name, insNames, "unit stat display mode");
    this.drawF = tryVal(drawF, Function.air);

    nameModeMap.put(this.name, this);
    modeArr.push(this);
  };


  const insNames = [];
  const nameModeMap = new ObjectMap();
  const modeArr = [];


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets amount of registered styles.
   * @return {number}
   */
  CLS_unitStatDisplayMode.getSize = function() {
    return modeArr.length;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets mode by name.
   * @param {string} name
   * @return {CLS_unitStatDisplayMode}
   */
  CLS_unitStatDisplayMode.get = function(name) {
    return nameModeMap.get(name);
  };


  /**
   * Gets mode by ID.
   * @param {number} id
   * @return {CLS_unitStatDisplayMode}
   */
  CLS_unitStatDisplayMode.getById = function(id) {
    return modeArr[Mathf.clamp(Math.round(id - 1), 0, modeArr.length - 1)];
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * @param {Building|Unit} e
   * @param {number} x
   * @param {number} y
   * @param {number} frac
   * @param {Color} color
   * @param {number} a
   * @param {number} w
   * @param {number} offY
   * @param {number} amtSeg
   * @param {number|null} armor
   * @param {number|null} shield
   * @param {number|null} speedMtp
   * @param {number|null} dpsMtp
   * @param {number|null} z
   * @return {void}
   */
  CLS_unitStatDisplayMode.prototype.draw = function(
    e, x, y, frac,
    color, a, w, offY, amtSeg,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
    this.drawF.apply(this, arguments);
  };




module.exports = CLS_unitStatDisplayMode;
