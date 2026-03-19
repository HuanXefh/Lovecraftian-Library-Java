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
  Section: Definition (Object)
  ========================================
*/


  /**
   * Prints accessible keys of some object.
   * @param {Object} obj
   * @return {void}
   */
  Object.printKeys = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") return;
    Object.keys(obj).printEach();
  };


  /**
   * Prints all key-value pairs in an object.
   * @param {Object} obj
   * @return {void}
   */
  Object.printObj = function(obj) {
    if(typeof obj !== "object" && typeof obj !== "function") {
      print(obj);
      return;
    };
    if(typeof obj === "function") {
      print(obj);
    };
    Object._it(obj, (key, val) => {
      print([key, val]);
    });
  };


/*
  ========================================
  Section: Definition (Function)
  ========================================
*/


  /**
   * Variant of {@link print} called on a function.
   * @return {void}
   */
  Function.prototype.print = function() {
    print(this);
  };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /**
   * Variant of {@link print} called on an array.
   * @return {void}
   */
  Array.prototype.print = function() {
    print(this);
  };


  /**
   * Multiline version of {@link Array#print}.
   * @return {void}
   */
  Array.prototype.printEach = function() {
    this.forEachFast(i => print(i));
  };


  /**
   * Variant of {@link Array#print} used for formatted arrays.
   * @param {number|unset} [ord]
   * @return {void}
   */
  Array.prototype.printFormat = function(ord) {
    this.forEachRow(tryVal(ord, 1), () => {
      print(Array.from(arguments));
    });
  };
