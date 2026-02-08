/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Global net methods in Lovec.
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


  /* <---------- package ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts an array into Json string for packets.
   * The array should only contain primitive values.
   * ---------------------------------------- */
  packPayload = function(arr) {
    return JSON.stringify(Object.arrToObj(arr));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a Json string back into an array of primitive values.
   * ---------------------------------------- */
  unpackPayload = function(payload) {
    return Object.objToArr(JSON.parse(payload));
  };


  /* <---------- http ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Parses an HTTP response as Json object.
   * ---------------------------------------- */
  parseResponse = function(res) {
    return JSON.parse(res.getResultAsString());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an HTTP response into some file.
   * ---------------------------------------- */
  writeResponse = function(res, fi, shouldAppend) {
    fi.write(res.getResultAsStream(), tryVal(shouldAppend, false));

    return fi;
  };
