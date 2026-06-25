/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * A wrapped number array used to calculate mean value.
   * @class
   * @param {number} cap - Max amount of numbers stored.
   */
  const CLS_meanArray = newClass().initClass();


  CLS_meanArray.prototype.init = function(cap) {
    if(typeof cap !== "number") ERROR_HANDLER.throw("typeMismatch", cap, "number");
    this.cap = cap;
    this.arr = [];
    this.mean = 0.0;
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
   * Gets mean value of stored numbers.
   * @return {number}
   */
  CLS_meanArray.prototype.getMean = function() {
    return this.mean;
  };


  /**
   * Gets the data array.
   * @return {Array<number>}
   */
  CLS_meanArray.prototype.getData = function() {
    return this.arr;
  };


  /* <------------------------------ modification ------------------------------ */


  /**
   * Adds a new number.
   * Returns array length.
   * @param {number} num
   * @return {number}
   */
  CLS_meanArray.prototype.push = function(num) {
    if(this.cap <= 0) return 0;
    while(this.arr.length >= this.cap) {
      this.arr.shift();
    };
    this.arr.push(num);
    this.mean = this.arr.mean();
    return this.arr.length;
  };


  /**
   * Clears all stored numbers.
   * @return {this}
   */
  CLS_meanArray.prototype.clear = function() {
    this.arr.clear();
    this.mean = 0.0;
    return this;
  };



module.exports = CLS_meanArray;
