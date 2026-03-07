/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Handles formatting of text used in damage display.
 * @class
 * @param {string} nm
 * @param {function(Team): Color} colorGetter
 * @param {function(string): string} strGetter
 */
const CLS_damageTextMode = newClass().initClass();


CLS_damageTextMode.prototype.init = function(nm, colorGetter, strGetter) {
  this.name = registerUniqueName(nm, insNms, "damage text mode");
  this.colorGetter = tryVal(colorGetter, Function.airWhite);
  this.strGetter = tryVal(strGetter, Function.airSelf);

  nameModeMap.put(this.name, this);
};


const insNms = [];
const nameModeMap = new ObjectMap();


/* <---------- static method ----------> */


/**
 * Gets mode by name.
 * @param {string} nm
 * @return {CLS_damageTextMode}
 */
CLS_damageTextMode.get = function(nm) {
  return nameModeMap.get(nm);
};


/* <---------- instance method ----------> */


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
