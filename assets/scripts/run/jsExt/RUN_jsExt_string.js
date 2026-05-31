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
   * Whether `str` is an empty string.
   * Also works for string object.
   * @param {string} str
   * @return {boolean}
   */
  String.isEmpty = function(str) {
    return typeof str === "string" ?
      str === "" :
      typeof str === "object" ?
        String(str) === "" :
          false;
  };


  /**
   * Whether `str` contains empty string only.
   * @param {string} str
   * @return {boolean}
   */
  String.isBlank = function(str) {
    let str1 = String(str);
    if(str1 === "") return true;
    for(let l of str1) {
      if(l !== " ") return false;
    };
    return true;
  };


  /**
   * Whether the string starts with any piece from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.startsWithAny = function() {
    return arguments[0] instanceof Array ?
      arguments[0].some(str => this.startsWith(str)) :
      Array.from(arguments).some(str => this.startsWith(str));
  };


  /**
   * Whether the string ends with any piece from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.endsWithAny = function() {
    return arguments[0] instanceof Array ?
      arguments[0].some(str => this.endsWith(str)) :
      Array.from(arguments).some(str => this.endsWith(str));
  };


  /**
   * Whether the string contains any piece from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.includesAny = function() {
    return arguments[0] instanceof Array ?
      arguments[0].some(str => this.includes(str)) :
      Array.from(arguments).some(str => this.includes(str));
  };


  /**
   * Whether the string contains all the pieces from `strs`.
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.includesAll = function() {
    return arguments[0] instanceof Array ?
      arguments[0].every(str => this.includes(str)) :
      Array.from(arguments).every(str => this.includes(str));
  };


  /**
   * Whether the string equals any string from `strs`.
   * No triple equality here!
   * <br> <ARGS>: strs.
   * <br> <ARGS>: str1, str2, str3, ...
   * @return {boolean}
   */
  String.prototype.equalsAny = function() {
    return arguments[0] instanceof Array ?
      arguments[0].some(str => this == str) :
      Array.from(arguments).some(str => this == str);
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
