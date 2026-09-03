/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Handles formatting of text used in damage display.
     * @class
     * @param {string} name
     * @param {FFunction<Team, Color>} colorF
     * @param {FFunction<string, string>} strF
     */
    const CLS_damageTextMode = newClass().initClass();


    CLS_damageTextMode.prototype.init = function(name, colorF, strF) {


        /** @type {string} */
        this.name = registerUniqueName(name, insNames, "damage text mode");
        /** @type {FFunction<Team, Color>} */
        this.colorF = tryVal(colorF, Function.airWhite);
        /** @type {FFunction<string, string>} */
        this.strF = tryVal(strF, Function.airSelf);


        nameModeMap.put(this.name, this);


    };


    /** @type {Array<string>} */
    const insNames = [];
    /** @type {ObjectMap<string, CLS_damageTextMode>} */
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
        return this.colorF(team);
    };


    /**
     * Gets final text of damage text.
     * @param {string} str
     * @return {string}
     */
    CLS_damageTextMode.prototype.getText = function(str) {
        return this.strF(str);
    };




module.exports = CLS_damageTextMode;
