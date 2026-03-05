/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for debugging.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- object ----------> */


  var cls = Object;


  /**
   * Prints accessible keys of some object.
   * @param {Object} obj
   * @return {void}
   */
  cls.printKeys = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object.keys(obj).printEach();
  };


  /**
   * Prints all key-value pairs in an object.
   * @param {Object} obj
   * @return {void}
   */
  cls.printObj = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object._it(obj, (key, val) => {
      print([key, val]);
    });
  };


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  /**
   * Variant of {@link print} called on a function.
   * @return {void}
   */
  ptp.print = function() {
    print(this);
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /**
   * Variant of {@link print} called on an array.
   * @return {void}
   */
  ptp.print = function() {
    print(this);
  };


  /**
   * Multiline version of {@link Array#print}.
   * @return {void}
   */
  ptp.printEach = function() {
    this.forEachFast(i => print(i));
  };


  /**
   * Variant of {@link Array#print} used for formatted arrays.
   * @param {number|unset} [ord]
   * @return {void}
   */
  ptp.printFormat = function(ord) {
    this.forEachRow(tryVal(ord, 1), () => {
      print(Array.from(arguments));
    });
  };
