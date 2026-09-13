/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Some kind of null objects for native JavaScript types.
     */


/*
  ========================================
  Section: Definition (Object)
  ========================================
*/


    /** @type {Object} */
    Object.air = {};


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


    /** @type {(...args: Array<Object>) => void} */
    Function.air = function() {};
    /**
     * @template T
     * @type {FFunction<T>}
     */
    Function.airSelf = function(val) {return val};
    /** @type {(...args: Array<Object>) => number} */
    Function.airZero = function() {return 0.0};
    /** @type {(...args: Array<Object>) => number} */
    Function.airOne = function() {return 1.0};
    /** @type {(...args: Array<Object>) => number} */
    Function.airOneMinus = function() {return -1.0};
    /** @type {(...args: Array<Object>) => number} */
    Function.airInfinity = function() {return Infinity};
    /** @type {(...args: Array<Object>) => boolean} */
    Function.airFalse = function() {return false};
    /** @type {(...args: Array<Object>) => boolean} */
    Function.airTrue = function() {return true};
    /** @type {FFunction<boolean, boolean>} */
    Function.airBoolInv = function(bool) {return !bool};
    /** @type {(...args: Array<Object>) => string} */
    Function.airStrEmpty = function() {return ""};
    /** @type {(...args: Array<Object>) => Array} */
    Function.airArr = function() {return Array.air};
    /** @type {(...args: Array<Object>) => Object} */
    Function.airObj = function() {return Object.air};
    /** @type {(...args: Array<Object>) => null} */
    Function.airNull = function() {return null};
    /** @type {(...args: Array<Object>) => Color} */
    Function.airWhite = function() {return Color.white};
    /** @type {(...args: Array<Object>) => Color} */
    Function.airBlack = function() {return Color.black};
    /** @type {(...args: Array<Object>) => Color} */
    Function.airClear = function() {return Color.clear};


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


    /** @type {Array} */
    Array.air = [];
    /** @type {Array<number>} */
    Array.airZero = [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ];
    /** @type {Array<number>} */
    Array.airOne = [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ];
    /** @type {Array<number>} */
    Array.airOneMinus = [
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0,
    ];
