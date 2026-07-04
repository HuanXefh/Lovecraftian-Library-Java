/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Handles formatting of text used in damage display.
   * @class
   * @param {string} name
   * @param {function(Team): Color} colorGetter
   * @param {function(string): string} strGetter
   */
  const CLS_damageTextMode = newClass().initClass();


  CLS_damageTextMode.prototype.init = function(name, colorGetter, strGetter) {
    this.name = registerUniqueName(name, insNames, "damage text mode");
    this.colorGetter = tryVal(colorGetter, Function.airWhite);
    this.strGetter = tryVal(strGetter, Function.airSelf);

    nameModeMap.put(this.name, this);
  };


  const insNames = [];
  const nameModeMap = new ObjectMap();


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets mode by name.
   * @param {string} name
   * @return {CLS_damageTextMode}
   */
  CLS_damageTextMode.get = function(name) {
    return nameModeMap.get(name);
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets color of damage text.
   * @param {Team} team
   * @return {Color}
   */
  CLS_damageTextMode.prototype.getColor = function(team) {
    return this.colorGetter(team);
  };


  /**
   * Gets final text of damage text.
   * @param {string} str
   * @return {string}
   */
  CLS_damageTextMode.prototype.getText = function(str) {
    return this.strGetter(str);
  };




module.exports = CLS_damageTextMode;
