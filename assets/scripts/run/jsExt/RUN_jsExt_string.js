/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Extension for JavaScript string.
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


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns hash value that is unique to the string.
   * ---------------------------------------- */
  ptp.toHash = function() {
    let hash = 0;
    if(this.length === 0) return hash;
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      hash = ((hash << 5) - hash) + this.charCodeAt(i);
      hash = hash & hash;
      i++;
    };

    return hash;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Encodes this string to hexadecimal numbers.
   * ---------------------------------------- */
  ptp.encodeHex = function() {
    let str = "";
    let l, i = 0, iCap = this.iCap();
    while(i < iCap) {
      l = this[i];
      str += l.charCodeAt(0).toString(16);
      i++;
    };

    return str;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Decodes this string from hexadecimal numbers.
   * ---------------------------------------- */
  ptp.decodeHex = function() {
    let str = "";
    let l, i = 0, iCap = this.iCap();
    while(i < iCap) {
      l = this.substring(i, i + 2);
      str += String.fromCharCode(parseInt(l, 16));
      i += 2;
    };

    return str;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Encodes this string with Arc {Base64Coder}.
   * ---------------------------------------- */
  ptp.encode64 = function() {
    return Base64Coder.encodeString(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Decodes this string with Arc {Base64Coder}.
   * ---------------------------------------- */
  ptp.decode64 = function() {
    return Base64Coder.decodeString(this);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains any piece from {strs}.
   * ---------------------------------------- */
  ptp.includesAny = function(strs) {
    const thisStr = this;

    return strs instanceof Array ?
      strs.some(str => thisStr.includes(str)) :
      Array.from(arguments).some(str => thisStr.includes(str));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string contains all the pieces from {strs}.
   * ---------------------------------------- */
  ptp.includesAll = function(strs) {
    const thisStr = this;

    return strs instanceof Array ?
      strs.every(str => thisStr.includes(str)) :
      Array.from(arguments).every(str => thisStr.includes(str));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the string equals any string from {strs}.
   * No triple equality here!
   * ---------------------------------------- */
  ptp.equalsAny = function(strs) {
    const thisStr = this;

    return strs instanceof Array ?
      strs.some(str => thisStr == str) :
      Array.from(arguments).some(str => thisStr == str);
  };
