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


  Object.air = {};


  /* <---------- function ----------> */


  /** @type {function(): void} */
  Function.air = function() {};
  /**
   * @template T
   * @type {function(T): T}
   */
  Function.airSelf = function(val) {return val};
  /** @type {function(): number} */
  Function.airZero = function() {return 0.0};
  /** @type {function(): number} */
  Function.airOne = function() {return 1.0};
  /** @type {function(): number} */
  Function.airOneMinus = function() {return -1.0};
  /** @type {function(): number} */
  Function.airInfinity = function() {return Infinity};
  /** @type {function(): boolean} */
  Function.airFalse = function() {return false};
  /** @type {function(): boolean} */
  Function.airTrue = function() {return true};
  /** @type {function(boolean): boolean} */
  Function.airBoolInv = function(bool) {return !bool};
  /** @type {function(): string} */
  Function.airStrEmpty = function() {return ""};
  /** @type {function(): Array} */
  Function.airArr = function() {return Array.air};
  /** @type {function(): Object} */
  Function.airObj = function() {return Object.air};
  /** @type {function(): null} */
  Function.airNull = function() {return null};
  /** @type {function(): Color} */
  Function.airWhite = function() {return Color.white};
  /** @type {function(): Color} */
  Function.airBlack = function() {return Color.black};


  /* <---------- array ----------> */


  Array.air = [];
  Array.airZero = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
