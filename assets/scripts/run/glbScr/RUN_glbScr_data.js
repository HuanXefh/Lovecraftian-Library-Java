/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Read/write methods.
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


  /* <---------- internal ----------> */


  LOVEC_REVISION = 5;
  MOD_REVISION = {};                // For other mods if you don't define another global variable
  LOVEC_JSON_PARSER = new Json();
  LOVEC_JSON_READER = new JsonReader();


  /* <---------- read & write ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for read & write.
   * ---------------------------------------- */
  processRevision = function(wr0rd, nmMod) {
    if(wr0rd instanceof Writes) {
      let revi = nmMod == null ?
        LOVEC_REVISION :
        MOD_REVISION[nmMod];
      wr0rd.s(revi);
      return revi;
    } else {
      return require("lovec/glb/GLB_param").secret_revisionFix ?
        0 :
        wr0rd.s();
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * For quick definition of {ex_processData}.
   * ---------------------------------------- */
  processData = function(wr0rd, revi, wrArrowFun, rdArrowFun) {
    wr0rd instanceof Writes ?
      wrArrowFun(wr0rd, revi) :
      rdArrowFun(wr0rd, revi);
  };


  /* <---------- config ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a config object into string.
   * ---------------------------------------- */
  packConfig = function(obj) {
    return "CONFIG: " + JSON.stringify(obj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a config object string back into object.
   * ---------------------------------------- */
  unpackConfig = function(cfgObjStr) {
    return JSON.parse(cfgObjStr.replace("CONFIG: ", ""));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Handles a config object or its string, based on given {keyCallerArr}.
   * ---------------------------------------- */
  processConfig = function(b, cfgObjStr, keyCallerArr) {
    let obj = isNativeObject(cfgObjStr) ? cfgObjStr : unpackConfig(cfgObjStr);

    Object._it(obj, (key, val) => {
      keyCallerArr.read(key, Function.air)(b, val);
    });
  };


  /* <---------- database ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Reads "{modName}/scripts/auxFi/data/{nmFi}.json" of every mod that is enabled, and writes the values into {contObj}.
   * Supports .hjson files.
   * ---------------------------------------- */
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


  DB_HANDLER = {


    __KEY_TUP_MAP__: new ObjectMap(),
    __TMP_ARGS__: [],


    addReader(key, fun) {
      DB_HANDLER.__KEY_TUP_MAP__.put(key, [readAuxJsonData({}, key), fun]);
    },


    addContentReader(key) {
      DB_HANDLER.addReader(key, (obj, ct_gn, def) => tryVal(obj[typeof ct_gn === "string" ? ct_gn : ct_gn.name], def));
    },


    read(key) {
      let tup = DB_HANDLER.__KEY_TUP_MAP__.get(key);
      if(tup == null) throw new Error("Database key [$1] is not registered!".format(key));

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
