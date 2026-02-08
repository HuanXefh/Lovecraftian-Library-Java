/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for debugging.
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


  cls.printKeys = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object.keys(obj).printEach();
  };


  cls.printObj = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object._it(obj, (key, val) => {
      print([key, val]);
    });
  };


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print} but at the end.
   * ---------------------------------------- */
  ptp.print = function() {
    print(this);
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Simply {print} but at the end.
   * ---------------------------------------- */
  ptp.print = function() {
    print(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Multiline version of {print}.
   * ---------------------------------------- */
  ptp.printEach = function() {
    this.forEachFast(i => print(i));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {print} used for formatted arrays.
   * ---------------------------------------- */
  ptp.printFormat = function(ord) {
    this.forEachRow(tryVal(ord, 1), () => {
      print(Array.from(arguments));
    });
  };
