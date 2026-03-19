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


  /* <---------- internal ----------> */


  /** @global */
  LOVEC_REVISION = 6;
  /**
   * For other mods, if you don't define another global variable.
   * @global
   * @example
   * MOD_REVISION["test-mod"] = 1;
   */
  MOD_REVISION = {};
  /** @global */
  LOVEC_JSON_PARSER = new Json();


  /* <---------- read & write ----------> */


  /**
   * Used for read & write.
   * @global
   * @param {Writes|Reads} wr0rd
   * @param {string|unset} [nmMod]
   * @return {number}
   */
  processRevision = function(wr0rd, nmMod) {
    if(wr0rd instanceof Reads) return wr0rd.s();

    let revi = nmMod == null ? LOVEC_REVISION : MOD_REVISION[nmMod];
    wr0rd.s(revi);

    return revi;
  };


  /**
   * For quick definition of `ex_processData`.
   * @global
   * @param {Writes|Reads} wr0rd
   * @param {number} revi
   * @param {function(Writes, number): void} wrFun - <ARGS>: wr, revi.
   * @param {function(Reads, number): void} rdFun - <ARGS>: rd, revi.
   * @return {void}
   */
  processData = function(wr0rd, revi, wrFun, rdFun) {
    wr0rd instanceof Writes ?
      wrFun(wr0rd, revi) :
      rdFun(wr0rd, revi);
  };


  /* <---------- config ----------> */


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


  /**
   * Handles a config object or its JSON string, see {@link BLK_baseBlock}.
   * @global
   * @param {Building} b
   * @param {string|Object} cfgObj0cfgStr
   * @param {Array} keyCallerArr - <ROW>: key, cfgCaller.
   * @return {void}
   */
  processConfig = function(b, cfgObj0cfgStr, keyCallerArr) {
    let obj = isNativeObject(cfgObj0cfgStr) ? cfgObj0cfgStr : unpackConfig(cfgObj0cfgStr);

    Object._it(obj, (key, val) => {
      keyCallerArr.read(key, Function.air)(b, val);
    });
  };


  /* <---------- database ----------> */


  /**
   * Reads "<nmMod>/scripts/auxFi/data/<nmFi>.json" of every enabled mod and writes values into `contObj`.
   * Also supports .hjson files.
   * @global
   * @param {Object} contObj
   * @param {string} nmFi
   * @return {Object}
   */
  readAuxJsonData = function(contObj, nmFi) {
    let dir, fi, str, obj;
    Vars.mods.eachEnabled(mod => {
      dir = mod.root.child("scripts").child("auxFi").child("json").child("data");
      fi = dir.child(nmFi + ".json");
      if(!fi.exists()) {
        fi = dir.child(nmFi + ".hjson");
      };
      if(!fi.exists()) return;

      str = fi.readString("UTF-8");
      if(fi.extension() === "json") {
        str = str.replace("#", "\\#");
      };
      // Dealing with Jval? No way
      obj = JSON.parse(LOVEC_JSON_PARSER.fromJson(null, Jval.read(str).toString(Jval.Jformat.plain)).toJson(JsonWriter.OutputType.json));
      for(let key in obj) {
        contObj[key] = obj[key];
      };
    });

    return contObj;
  };


  /**
   * Handles DB objects.
   * @global
   */
  DB_HANDLER = {


    __KEY_TUP_MAP__: new ObjectMap(),
    __TMP_ARGS__: [],


    /**
     * Adds a reader for "<key>.json", see {@link readAuxJsonData}.
     * @param {string} key
     * @param {Function} fun - Arguments of this function will be passed down from {@link DB_HANDLER.read}.
     * @return {void}
     */
    addReader(key, fun) {
      DB_HANDLER.__KEY_TUP_MAP__.put(key, [readAuxJsonData({}, key), fun]);
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
     * <br> <ARGS>: key, arg1, arg2, arg3, ...
     * @param {string} key
     * @return {any}
     */
    read(key) {
      let tup = DB_HANDLER.__KEY_TUP_MAP__.get(key);
      if(tup == null) throw new Error("Database key ${1} is not registered!".format(key));

      let args = DB_HANDLER.__TMP_ARGS__.clear();
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
