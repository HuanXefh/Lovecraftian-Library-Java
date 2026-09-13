/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Extension for JavaScript number.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /** @type {java.lang.Integer} */
    Number.intMax = java.lang.Integer.MAX_VALUE;
    /** @type {java.lang.Integer} */
    Number.intMin = java.lang.Integer.MIN_VALUE;
    /** @type {java.lang.Float} */
    Number.fMax = java.lang.Float.MAX_VALUE;
    /** @type {java.lang.Float} */
    Number.fMin = java.lang.Float.MIN_VALUE;
    /** @type {number} */
    Number.n4 = 9999.0;
    /** @type {number} */
    Number.n6 = 999999.0;
    /** @type {number} */
    Number.n8 = 99999999.0;
    /** @type {number} */
    Number.n12 = 999999999999.0;


    /**
     * Integer equality.
     * @param {number} num
     * @return {boolean}
     */
    Number.prototype.intEqual = function(num) {
        return Math.floor(this) === Math.floor(num);
    };


    /**
     * Float equality.
     * @param {number} num
     * @param {number|unset} [tol]
     * @return {boolean}
     */
    Number.prototype.fEqual = function(num, tol) {
        return Mathf.equal(this, num, tryVal(tol, 0.0001));
    };
