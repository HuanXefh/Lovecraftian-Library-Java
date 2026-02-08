/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles Json read/write.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_file = require("lovec/mdl/MDL_file");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns Json value of a .json or .hjson file.
   * ---------------------------------------- */
  const parse = function(fi0str) {
    if(fi0str == null) return null;
    if(fi0str instanceof Fi && !fi0str.exists()) return null;

    let jsonStr = fi0str instanceof Fi ? fi0str.readString("UTF-8") : fi0str;
    if(fi0str instanceof Fi && fi0str.extension() === "json") jsonStr = jsonStr.replace("#", "\\#");

    return VAR.json.fromJson(null, Jval.read(jsonStr).toString(Jval.Jformat.plain));
  };
  exports.parse = parse;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes Json string/object to {fi}.
   * Note that there should be primitive values only.
   * ---------------------------------------- */
  const write = function(fi, json_gn) {
    if(fi == null || json_gn == null) return;

    var str = (typeof json_gn === "string") ? json_gn : JSON.stringify(json_gn);
    fi.writeString(str);
  };
  exports.write = write;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a sub-Json value.
   * ---------------------------------------- */
  const fetch = function(jsonVal, keys_p, noConvert, arrMode) {
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


  /* ----------------------------------------
  * NOTE:
  *
  * Returns Json value of .json file of the content.
  *
  * Don't do extra Json fields.
  * It's possible to write extra fields in the .json file but the game's gonna warn you a lot in the console.
  * ---------------------------------------- */
  const _jsonVal_ct = function(ct_gn) {
    return parse(MDL_file._json_ct(ct_gn));
  };
  exports._jsonVal_ct = _jsonVal_ct;
