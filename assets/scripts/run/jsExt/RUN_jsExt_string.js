/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Extension for JavaScript string.
   */


/*
  ========================================
  Section: Definition (String)
  ========================================
*/


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether the string contains any piece from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.includesAny = function() {
    const thisStr = this;

    return arguments[0] instanceof Array ?
      arguments[0].some(str => thisStr.includes(str)) :
      Array.from(arguments).some(str => thisStr.includes(str));
  };


  /**
   * Whether the string contains all the pieces from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.includesAll = function() {
    const thisStr = this;

    return arguments[0] instanceof Array ?
      arguments[0].every(str => thisStr.includes(str)) :
      Array.from(arguments).every(str => thisStr.includes(str));
  };


  /**
   * Whether the string equals any string from `strs`.
   * No triple equality here!
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.equalsAny = function() {
    const thisStr = this;

    return arguments[0] instanceof Array ?
      arguments[0].some(str => thisStr == str) :
      Array.from(arguments).some(str => thisStr == str);
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets hash value that is unique to this string.
   * @return {number}
   */
  String.prototype.toHash = function() {
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


  /**
   * Encodes this string to hexadecimal numbers.
   * @return {string}
   */
  String.prototype.encodeHex = function() {
    let str = "";
    let l, i = 0, iCap = this.iCap();
    while(i < iCap) {
      l = this[i];
      str += l.charCodeAt(0).toString(16);
      i++;
    };

    return str;
  };


  /**
   * Decodes this string from hexadecimal numbers.
   * @return {string}
   */
  String.prototype.decodeHex = function() {
    let str = "";
    let l, i = 0, iCap = this.iCap();
    while(i < iCap) {
      l = this.substring(i, i + 2);
      str += String.fromCharCode(parseInt(l, 16));
      i += 2;
    };

    return str;
  };


  /**
   * Encodes this string with {@link Base64Coder}.
   * @return {string}
   */
  String.prototype.encode64 = function() {
    return Base64Coder.encodeString(this);
  };


  /**
   * Decodes this string with {@link Base64Coder}.
   * @return {string}
   */
  String.prototype.decode64 = function() {
    return Base64Coder.decodeString(this);
  };
