/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Global net methods in Lovec.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ packet ------------------------------ */


  /**
   * Converts an array into JSON string for packets.
   * This array should only contain primitive values.
   * @global
   * @param {Array} arr
   * @return {string}
   */
  packPayload = function(arr) {
    return JSON.stringify(Object.fromArr(arr));
  };


  /**
   * Converts given JSON string back into an array of primitive values.
   * @global
   * @param {string} payload
   * @return {Array}
   */
  unpackPayload = function(payload) {
    return Object.toArr(JSON.parse(payload));
  };


  /* <------------------------------ HTTP ------------------------------ */


  /**
   * Parses an HTTP response to JSON object.
   * @global
   * @param {Http.HttpResponse|Fi|string} res
   * @return {Object}
   */
  parseResponse = function(res) {
    return typeof res === "string" ?
      JSON.parse(res) :
      res instanceof Fi ?
        JSON.parse(res.readString()) :
        res instanceof Http.HttpResponse ?
          JSON.parse(res.getResultAsString()) :
          {};
  };


  /**
   * Writes an HTTP response into some file.
   * @global
   * @param {Http.HttpResponse} res
   * @param {Fi} fi
   * @param {boolean|unset} [shouldAppend]
   * @return {Fi}
   */
  writeResponse = function(res, fi, shouldAppend) {
    fi.write(res.getResultAsStream(), tryVal(shouldAppend, false));

    return fi;
  };
