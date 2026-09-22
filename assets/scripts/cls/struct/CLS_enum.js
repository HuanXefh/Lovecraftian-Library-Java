/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Used to store fixed values.
     * Very similar to {@link CLS_objectBox}.
     * @class
     * @template T
     * @param {T} obj
     * @return {CLS_enum&T}
     * @lovecTypeSensitive
     */
    const CLS_enum = newClass().initClass();


    /** @private */
    CLS_enum.prototype.init = function(obj) {


        if(obj == null) throw new LCError.NullArgumentError("obj");


        /** @type {Array<string>} */
        this.keys = [];
        /** @type {Array} */
        this.vals = [];
        /** @type {number} */
        this.size = 0;


        this.initEnum(obj);


    };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


    /* <------------------------------ property ------------------------------> */


    /**
     * Gets size of the enum.
     * @return {number}
     */
    CLS_enum.prototype.getSize = function() {
        return this.size;
    };


    /**
     * Gets available keys of the enum.
     * @return {Array<string>}
     */
    CLS_enum.prototype.getKeys = function() {
        return this.keys;
    };


    /* <------------------------------ condition ------------------------------> */


    /**
     * Whether this enum contains some key.
     * @param {string} key
     * @return {boolean}
     */
    CLS_enum.prototype.hasKey = function(key) {
        return this.keys.includes(key);
    };


    /**
     * Whether this enum contains some value.
     * @param {Object} val
     * @return {boolean}
     */
    CLS_enum.prototype.has = function(val) {
        return this.vals.includes(val);
    };


    /* <------------------------------ util ------------------------------> */


    /**
     * @param {Object} obj
     * @return {this}
     */
    CLS_enum.prototype.initEnum = function(obj) {
        let count = 0;
        Object.eachPair(obj, (key, val) => {
            if(typeof val !== "function") {
                this.setProps(true, key, val);
                this.keys.push(key);
                this.vals.pushUnique(val);
                count++;
            } else {
                this[key] = val;
            };
        });
        this.size = count;
        Object.freeze(this);
        return this;
    };




CLS_enum.setIterator({


    ind: -1,


    next() {
        this.ind++;
        return this.ind >= this.__parent__.vals.length ?
            {done: true} :
            {value: this.__parent__.vals[this.ind], done: false};
    },


});




module.exports = CLS_enum;
