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
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- number ----------> */


  var ptp = Number.prototype;


  /**
   * Converts this number to Java integer.
   * @return {java.lang.Integer}
   */
  ptp.toInt = function() {
    return new java.lang.Integer(this);
  };


  /**
   * Converts this number to Java byte.
   * @return {java.lang.Byte}
   */
  ptp.toByte = function() {
    return new java.lang.Byte(this);
  };


  /**
   * Converts this number to Java short.
   * @return {java.lang.Short}
   */
  ptp.toShort = function() {
    return new java.lang.Short(this);
  };


  /**
   * Converts this number to Java long.
   * @return {java.lang.Long}
   */
  ptp.toLong = function() {
    return new java.lang.Long(this);
  };


  /**
   * Converts this number to Java float.
   * @return {java.lang.Float}
   */
  ptp.toF = function() {
    return new java.lang.Float(this);
  };


  /**
   * Converts this number to Java double.
   * @return {java.lang.Double}
   */
  ptp.toDouble = function() {
    return new java.lang.Double(this);
  };


  /**
   * Converts this number to integer bits (as string).
   * @return {string}
   */
  ptp.toIntBits = function() {
    let arrBuffer = new ArrayBuffer(4);
    (new Float32Array(arrBuffer))[0] = this;
    let uint32Arr = new Uint32Array(arrBuffer);

    return uint32Arr[0].toString(2).padStart(32, "0");
  };


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /**
   * Converts this string bits to Arc bits.
   * @return {Bits}
   */
  ptp.toBitset = function() {
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


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /**
   * Converts this array to Java array.
   * @template T
   * @param {Class<T>} javaCls
   * @return {JavaArray<T>}
   */
  ptp.toJavaArr = function(javaCls) {
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
  ptp.toSeq = function() {
    return new Seq(this);
  };


  /**
   * Converts this array to Arc object set.
   * @return {ObjectSet}
   */
  ptp.toObjSet = function() {
    return ObjectSet.with(this);
  };


  /**
   * Converts this 2-array to Arc object map.
   * @return {ObjectMap}
   */
  ptp.toObjMap = function() {
    let objMap = new ObjectMap();
    this.forEachRow(2, (key, val) => objMap.put(key, val));

    return objMap;
  };