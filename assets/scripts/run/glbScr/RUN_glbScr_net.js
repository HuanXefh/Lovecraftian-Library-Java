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
     * @param {Array|unset} [arr]
     * @return {JSONString}
     */
    packPayload = function(arr) {
        return toJsonSafe(Object.fromArr(tryVal(arr, Array.air)));
    };


    /**
     * Converts given JSON string back into an array of primitive values.
     * @global
     * @param {JSONString} payload
     * @return {Array}
     */
    unpackPayload = function(payload) {
        return Object.toArr(JSON.parse(String(payload)));
    };


    /**
     * Converts arguments into splitor payload string for packets.
     * Shoulds only be used for primitive values. Does not support array and JSON object.
     * <br> Faster than {@link packPayload}.
     * <br> `ARGS`: arg1, arg2, arg3, ...
     * @return {string}
     */
    packSplitorPayload = function() {
        return LCScriptUtil.packSplitorPayload(arguments);
    };


    /**
     * Converts a splitor payload string back into an array of strings.
     * Result array is reused!
     * <br> Faster than {@link unpackPayload}.
     * @param {string} payload
     * @param {number|unset} [ind]
     * @return {Array}
     */
    unpackSplitorPayload = function(payload, ind) {
        return ind == null ?
            LCScriptUtil.unpackSplitorPayload(payload) :
            LCScriptUtil.unpackSplitorPayload(payload, ind);
    };


    /* <------------------------------ HTTP ------------------------------ */


    /**
     * Parses an HTTP response to JSON object.
     * @global
     * @param {Http.HttpResponse|Fi|string} res
     * @return {Object}
     * @lovecTypeSensitive
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
     * @param {boolean|unset} [append]
     * @return {Fi}
     */
    writeResponse = function(res, fi, append) {
        fi.write(res.getResultAsStream(), tryVal(append, false));
        return fi;
    };
