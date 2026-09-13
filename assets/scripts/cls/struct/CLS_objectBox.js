/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * A container formed from an object that is not expected to be modified afterward.
     * Object boxes are usually named like "BOX_xxx".
     * @class
     * @template T
     * @param {T} obj
     * @return {this&T}
     */
    const CLS_objectBox = newClass().initClass();


    /** @private */
    CLS_objectBox.prototype.init = function(obj) {


        if(obj == null) obj = {};
        let args = [this, true];
        Object.eachPair(obj, (key, val) => {
            args.push(key, val);
        });
        Object.setProps.apply(null, args);


        /** @type {Array<string>} */
        this.keys = Object.keys(obj);


        Object.freeze(this);


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


    /* <------------------------------ property ------------------------------ */


    /**
     * Gets available keys of the box.
     * @return {Array<string>}
     */
    CLS_objectBox.prototype.getKeys = function() {
        return this.keys;
    };




module.exports = CLS_objectBox;
