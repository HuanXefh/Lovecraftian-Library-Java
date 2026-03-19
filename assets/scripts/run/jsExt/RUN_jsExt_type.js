/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for type conversion.
   */


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


  /**
   * Converts this number to Java integer.
   * @return {java.lang.Integer}
   */
  Number.prototype.toInt = function() {
    return new java.lang.Integer(this);
  };


  /**
   * Converts this number to Java byte.
   * @return {java.lang.Byte}
   */
  Number.prototype.toByte = function() {
    return new java.lang.Byte(this);
  };


  /**
   * Converts this number to Java short.
   * @return {java.lang.Short}
   */
  Number.prototype.toShort = function() {
    return new java.lang.Short(this);
  };


  /**
   * Converts this number to Java long.
   * @return {java.lang.Long}
   */
  Number.prototype.toLong = function() {
    return new java.lang.Long(this);
  };


  /**
   * Converts this number to Java float.
   * @return {java.lang.Float}
   */
  Number.prototype.toF = function() {
    return new java.lang.Float(this);
  };


  /**
   * Converts this number to Java double.
   * @return {java.lang.Double}
   */
  Number.prototype.toDouble = function() {
    return new java.lang.Double(this);
  };


  /**
   * Converts this number to integer bits (as string).
   * @return {string}
   */
  Number.prototype.toIntBits = function() {
    let arrBuffer = new ArrayBuffer(4);
    (new Float32Array(arrBuffer))[0] = this;
    let uint32Arr = new Uint32Array(arrBuffer);

    return uint32Arr[0].toString(2).padStart(32, "0");
  };


/*
  ========================================
  Section: Definition (String)
  ========================================
*/


  /**
   * Converts this string bits to Arc bits.
   * @return {Bits}
   */
  String.prototype.toBitset = function() {
    const bitset = new Bits();
    let i = 0;
    for(let l of this) {
      if(l === "0") {
        bitset.set(i++, false);
      } else if(l === "1") {
        bitset.set(i++, true);
      };
    };

    return bitset;
  };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /**
   * Creates a new Java array with given capacity.
   * @template T
   * @param {Class<T>} javaCls
   * @param {number|unset} [cap]
   * @return {JavaArray<T>}
   */
  Array.newJavaArr = function(javaCls, cap) {
    return java.lang.reflect.Array.newInstance(javaCls, tryVal(cap, 0));
  };


  /**
   * Creates a integer array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Integer>}
   */
  Array.newIntArr = function(cap) {
    return Array.newJavaArr(JAVA.int, cap);
  };


  /**
   * Creates a byte array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Byte>}
   */
  Array.newByteArr = function(cap) {
    return Array.newJavaArr(JAVA.byte, cap);
  };


  /**
   * Creates a short array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Short>}
   */
  Array.newShortArr = function(cap) {
    return Array.newJavaArr(JAVA.short, cap);
  };


  /**
   * Creates a long array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Long>}
   */
  Array.newLongArr = function(cap) {
    return Array.newJavaArr(JAVA.long, cap);
  };


  /**
   * Creates a float array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Float>}
   */
  Array.newFArr = function(cap) {
    return Array.newJavaArr(JAVA.float, cap);
  };


  /**
   * Creates a double array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Double>}
   */
  Array.newDoubleArr = function(cap) {
    return Array.newJavaArr(JAVA.double, cap);
  };


  /**
   * Creates a boolean array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Boolean>}
   */
  Array.newBoolArr = function(cap) {
    return Array.newJavaArr(JAVA.boolean, cap);
  };


  /**
   * Creates a string array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.String>}
   */
  Array.newStrArr = function(cap) {
    return Array.newJavaArr(JAVA.string, cap);
  };


  /**
   * Creates a object array.
   * @param {number|unset} [cap]
   * @return {JavaArray<java.lang.Object>}
   */
  Array.newObjArr = function(cap) {
    return Array.newJavaArr(JAVA.Object, cap);
  };


  /**
   * Converts this array to Java array.
   * @template T
   * @param {Class<T>} javaCls
   * @return {JavaArray<T>}
   */
  Array.prototype.toJavaArr = function(javaCls) {
    let iCap = this.iCap();
    const javaArr = java.lang.reflect.Array.newInstance(javaCls, iCap);
    if(iCap === 0) return javaArr;

    for(let i = 0; i < iCap; i++) {
      javaArr[i] = this[i];
    };

    return javaArr;
  };


  /**
   * Converts this array to Arc seq.
   * @return {Seq}
   */
  Array.prototype.toSeq = function() {
    return new Seq(this);
  };


  /**
   * Converts this array to Arc object set.
   * @return {ObjectSet}
   */
  Array.prototype.toObjSet = function() {
    return ObjectSet.with(this);
  };


  /**
   * Converts this 2-array to Arc object map.
   * @return {ObjectMap}
   */
  Array.prototype.toObjMap = function() {
    let objMap = new ObjectMap();
    this.forEachRow(2, (key, val) => objMap.put(key, val));

    return objMap;
  };
