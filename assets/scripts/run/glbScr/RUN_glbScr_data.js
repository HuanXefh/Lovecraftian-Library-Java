/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles data processing.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ read & write ------------------------------ */


  /**
   * For quick definition of `ex_processData`.
   * @global
   * @param {Writes|Reads} wr0rd
   * @param {function(Writes, number): void} wrFun - `ARGS`: wr, revi.
   * @param {function(Reads, number): any} rdFun - `ARGS`: rd, revi.
   * @return {any}
   */
  processData = function(wr0rd, wrFun, rdFun) {
    return wr0rd instanceof Writes ?
      wrFun(wr0rd) :
      rdFun(wr0rd);
  };


  /* <------------------------------ config ------------------------------ */


  /**
   * Converts config object into JSON string.
   * @global
   * @param {Object} obj
   * @return {string}
   */
  packConfig = function(obj) {
    return "CONFIG: " + JSON.stringify(obj);
  };


  /**
   * Converts config JSON string into object.
   * @global
   * @param {string} cfgStr
   * @return {Object}
   */
  unpackConfig = function(cfgStr) {
    return JSON.parse(cfgStr.replace("CONFIG: ", ""));
  };


  /* <------------------------------ DB file ------------------------------ */


  /**
   * Convert JSON into JavaScript object using Arc JSON parser, which supports comment and HJSON.
   * @global
   * @param {Fi|string} fi0str
   * @return {Object}
   */
  jsonToJsObj = function(fi0str) {
    let str;
    if(typeof fi0str === "string") {
      str = fi0str;
    } else {
      str = fi0str.readString("UTF-8");
      if(fi0str.extension() === "json") {
        str = str.replace("#", "\\#");
      };
    };

    // Dealing with Jval? No way
    return JSON.parse(VAR.jsonParser.fromJson(null, Jval.read(str).toString(Jval.Jformat.plain)).toJson(JsonWriter.OutputType.json));
  };


  /**
   * Reads "<nameMod>/scripts/auxFi/data/<nameFi>.json" of every enabled mod and writes values into `contObj`.
   * Also supports .hjson files.
   * @global
   * @param {Object} contObj
   * @param {string} nameFi
   * @return {Object}
   */
  readAuxJsonData = function(contObj, nameFi) {
    let dir, fi, obj;
    Vars.mods.eachEnabled(mod => {
      dir = mod.root.child("scripts").child("auxFi").child("json").child("data");
      fi = dir.child(nameFi + ".json");
      if(!fi.exists()) {
        fi = dir.child(nameFi + ".hjson");
      };
      if(!fi.exists()) return;

      obj = jsonToJsObj(fi);
      for(let key in obj) {
        contObj[key] = obj[key];
      };
    });

    return contObj;
  };


  /**
   * Handles DB file objects.
   * @global
   */
  DB_HANDLER = {


    __keyTupMap__: new ObjectMap(),
    __tmpArgs__: [],


    /**
     * Gets the data object built from all "<key>.json".
     * Do not modify this object!
     * @param {string} key
     * @return {Object}
     */
    getDataObj(key) {
      let tup = DB_HANDLER.__keyTupMap__.get(key);
      return tup == null ?
        Object.air :
        tup[0];
    },


    /**
     * Adds a reader for "<key>.json", see {@link readAuxJsonData}.
     * @param {string} key
     * @param {Function} fun - Arguments of this function will be passed down from {@link DB_HANDLER.read}.
     * @return {void}
     */
    addReader(key, fun) {
      DB_HANDLER.__keyTupMap__.put(key, [readAuxJsonData({}, key), fun]);
    },


    /**
     * Adds a reader specifically meant for reading properties for contents.
     * @param {string} key
     * @return {void}
     */
    addContentReader(key) {
      DB_HANDLER.addReader(key, (obj, ct_gn, def) => tryVal(obj[typeof ct_gn === "string" ? ct_gn : ct_gn.name], def));
    },


    /**
     * Reads a registered DB object.
     * <br> `ARGS`: key, arg1, arg2, arg3, ...
     * @param {string} key
     * @return {any}
     */
    read(key) {
      let tup = DB_HANDLER.__keyTupMap__.get(key);
      if(tup == null) throw new Error("Database key ${1} is not registered!".format(key));

      let args = DB_HANDLER.__tmpArgs__.clear();
      args.push(tup[0]);
      if(arguments.length > 1) {
        let i = 1, iCap = arguments.length;
        while(i < iCap) {
          args.push(arguments[i]);
          i++;
        };
      };
      return tup[1].apply(null, args);
    },


  };
