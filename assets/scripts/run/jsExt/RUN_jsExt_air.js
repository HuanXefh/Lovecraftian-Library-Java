/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Some kind of null objects on native JavaScript types.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- object ----------> */


  var cls = Object;


  cls.air = {};


  /* <---------- function ----------> */


  var cls = Function;


  cls.air = function() {};
  cls.airSelf = function(val) {return val};
  cls.airZero = function() {return 0.0};
  cls.airOne = function() {return 1.0};
  cls.airOneMinus = function() {return -1.0};
  cls.airInfinity = function() {return Infinity};
  cls.airFalse = function() {return false};
  cls.airTrue = function() {return true};
  cls.airBoolInv = function(bool) {return !bool};
  cls.airStrEmpty = function() {return ""};
  cls.airArr = function() {return Array.air};
  cls.airObj = function() {return Object.air};
  cls.airNull = function() {return null};
  cls.airWhite = function() {return Color.white};
  cls.airBlack = function() {return Color.black};


  /* <---------- array ----------> */


  var cls = Array;


  cls.air = [];
  cls.airZero = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
