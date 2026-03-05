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
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- object ----------> */


  var cls = Object;


  cls.air = {};


  /* <---------- function ----------> */


  var cls = Function;


  /** @type {function(): void} */
  cls.air = function() {};
  /**
   * @template T
   * @type {function(T): T}
   */
  cls.airSelf = function(val) {return val};
  /** @type {function(): number} */
  cls.airZero = function() {return 0.0};
  /** @type {function(): number} */
  cls.airOne = function() {return 1.0};
  /** @type {function(): number} */
  cls.airOneMinus = function() {return -1.0};
  /** @type {function(): number} */
  cls.airInfinity = function() {return Infinity};
  /** @type {function(): boolean} */
  cls.airFalse = function() {return false};
  /** @type {function(): boolean} */
  cls.airTrue = function() {return true};
  /** @type {function(boolean): boolean} */
  cls.airBoolInv = function(bool) {return !bool};
  /** @type {function(): string} */
  cls.airStrEmpty = function() {return ""};
  /** @type {function(): Array} */
  cls.airArr = function() {return Array.air};
  /** @type {function(): Object} */
  cls.airObj = function() {return Object.air};
  /** @type {function(): null} */
  cls.airNull = function() {return null};
  /** @type {function(): Color} */
  cls.airWhite = function() {return Color.white};
  /** @type {function(): Color} */
  cls.airBlack = function() {return Color.black};


  /* <---------- array ----------> */


  var cls = Array;


  cls.air = [];
  cls.airZero = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
