/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Used in calculation of bullet height. See {@link BUL_spriteBullet}.
     * @class
     * @param {string} name
     * @param {FFunction<Bullet, number>} fracF
     */
    const CLS_bulletFlyingMode = newClass().initClass();


    /** @private */
    CLS_bulletFlyingMode.prototype.init = function(name, fracF) {


        /** @type {string} */
        this.name = registerUniqueName(name, insNames, "bullet flying mode");
        /** @type {FFunction<Bullet, number>} */
        this.fracF = tryVal(fracF, Function.airOne);


        nameModeMap.put(this.name, this);
        modeArr.push(this);


    };


    /** @type {Array<string>} */
    const insNames = [];
    /** @type {ObjectMap<string, CLS_bulletFlyingMode>} */
    const nameModeMap = new ObjectMap();
    /** @type {Array<CLS_bulletFlyingMode>} */
    const modeArr = [];


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


    /* <------------------------------ util ------------------------------> */


    /**
     * Gets mode by name.
     * @param {string} name
     * @return {CLS_bulletFlyingMode|null}
     */
    CLS_bulletFlyingMode.get = function(name) {
        return nameModeMap.get(name);
    };


    /**
     * Gets mode by ID.
     * @param {number} id
     * @return {CLS_bulletFlyingMode}
     */
    CLS_bulletFlyingMode.getById = function(id) {
        return modeArr[Mathf.clamp(Math.round(id - 1), 0, modeArr.length - 1)];
    };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


    /* <------------------------------ property ------------------------------> */


    /**
     * @param {Bullet} bul
     * @return {number}
     */
    CLS_bulletFlyingMode.prototype.apply = function(bul) {
        return this.fracF(bul);
    };




module.exports = CLS_bulletFlyingMode;
