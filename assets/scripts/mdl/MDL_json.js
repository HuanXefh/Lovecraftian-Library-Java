/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles JSON read/write.
   * @module lovec/mdl/MDL_json
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Returns JSON value of a .json or .hjson file.
   * @param {Fi|string|null} fi0str
   * @return {JsonValue|null}
   */
  const parse = function(fi0str) {
    if(fi0str == null) return null;
    if(fi0str instanceof Fi && !fi0str.exists()) return null;

    let jsonStr = fi0str instanceof Fi ? fi0str.readString("UTF-8") : fi0str;
    if(fi0str instanceof Fi && fi0str.extension() === "json") jsonStr = jsonStr.replace("#", "\\#");

    return LOVEC_JSON_PARSER.fromJson(null, Jval.read(jsonStr).toString(Jval.Jformat.plain));
  };
  exports.parse = parse;


  /**
   * Writes JSON string/object to `fi`.
   * Only primitive values are allowed.
   * @param {Fi|null} fi
   * @param {string|Object|null} str0obj
   * @return {void}
   */
  const write = function(fi, str0obj) {
    if(fi == null || str0obj == null) return;

    fi.writeString(typeof str0obj === "string" ? str0obj : JSON.stringify(str0obj));
  };
  exports.write = write;


  /**
   * Reads value from a JSON value, null if not found.
   * @param {JsonValue|null} jsonVal
   * @param {string|Array<string>} keys_p - Object keys in order.
   * @param {boolean|unset} [noConvert] - If true, this method will return JSON value even if it's a final value.
   * @param {string|unset} [arrMode] - When final value is an array, this determines type of the result array.
   * @return {any}
   */
  const fetch = function(jsonVal, keys_p, noConvert, arrMode) {
    if(jsonVal == null) return null;
    let tmpJsonVal;
    if(!(keys_p instanceof Array)) {
      tmpJsonVal = jsonVal.get(keys_p);
    } else {
      tmpJsonVal = jsonVal;
      for(let key of keys_p) {
        if(tmpJsonVal != null) tmpJsonVal = tmpJsonVal.get(key);
      };
    };
    if(noConvert) return tmpJsonVal;

    let tmpVal;
    if(tmpJsonVal == null) {
      tmpVal = tmpJsonVal
    } else {
      switch(tmpJsonVal.type().toString()) {
        case "doubleValue" :
          tmpVal = tmpJsonVal.asDouble();
          break;
        case "longValue" :
          tmpVal = tmpJsonVal.asLong();
          break;
        case "booleanValue" :
          tmpVal = tmpJsonVal.asBoolean();
          break;
        case "stringValue" :
          tmpVal = tmpJsonVal.asString();
          break;
        case "array" :
          // I have to convert it to js array, or the game somehow converts it to object after saving 3 times, WTF
          if(arrMode === "number") {
            tmpVal = tmpJsonVal.asDoubleArray().cpy();
          } else if(arrMode === "string") {
            tmpVal = tmpJsonVal.asStringArray().cpy();
          } else {
            tmpVal = tmpJsonVal;
          };
          break;
        default :
          tmpVal = tmpJsonVal;
      };
    };

    return tmpVal;
  };
  exports.fetch = fetch;


  /**
   * Gets JSON value of .json/.hjson file of some content.
   * @param {ContentGn} ct_gn
   * @return {JsonValue|null}
   */
  const _jsonVal_ct = function(ct_gn) {
    let fi = MDL_file._json_ct(ct_gn);
    return fi == null ? null : parse(fi);
  };
  exports._jsonVal_ct = _jsonVal_ct;
