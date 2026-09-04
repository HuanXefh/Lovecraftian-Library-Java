/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Utility global methods.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ auxiliary ------------------------------ */


  /** @global */
  TRIGGER_BACKGROUND = false;
  /** @global */
  TRIGGER_MUSIC = false;


  /* <------------------------------ dependency ------------------------------ */


  /**
   * Converts a version string to an array of numbers.
   * No letter allowed.
   * @global
   * @param {string} verStr
   * @return {Array<number>}
   * @example
   * verStrToInts("1.12.1");                // Returns [1, 12, 1]
   */
  verStrToInts = function(verStr) {
    let i, iCap;
    let arr = verStr.split(".");

    i = 0;
    iCap = arr.length;
    while(i < iCap) {
      arr[i] = parseInt(arr[i], 10);
      if(isNaN(arr[i])) {
        arr[i] = 0;
      };
      i++;
    };

    return arr;
  };


  /**
   * 1. Checks whether a version string is newer or equal to given version string.
   * <br> 2. Whether all version requirements are met.
   * <br> `ARGS`: verStrReq, verStrCur.
   * <br> `ARGS`: nameMod, minVerArr
   * <br> <ROW-minVerArr>: nameMod, verStrReq
   * @return {boolean}
   * @example
   * // Check version requirement
   * checkVersion("154", "146");                // Returns false
   *
   * // Check dependency
   * checkVersion("test-mod", [
   *   "lovec", "101",
   * ]);
   */
  checkVersion = newMultiFunction(
    ["string", "string"], function(verStrReq, verStrCur) {
      let
        ints1 = verStrToInts(verStrReq),
        ints2 = verStrToInts(verStrCur),
        int1,
        int2,
        i = 0,
        iCap = Math.max(ints1.length, ints2.length);

      while(i < iCap) {
        int1 = tryVal(ints1[i], 0);
        int2 = tryVal(ints2[i], 0);
        if(int1 < int2) {
          return true;
        } else if(int1 > int2) {
          return false;
        };
        i++;
      };

      return true;
    },
    ["string", Array], function(nameMod, minVerArr) {
      let str = "[gray]Unmet dependency for [accent]" + nameMod + "[]!\n";
      let errored = false;

      let i = 0, iCap = minVerArr.length;
      let nameDepend, minVer, ver, mod;
      str += "\n----------------------------------------------------";
      while(i < iCap) {
        nameDepend = minVerArr[i];
        minVer = minVerArr[i + 1];
        ver = TmpStateTag.pending;
        mod = Vars.mods.locateMod(nameDepend);
        if(mod != null) {
          ver = String(mod.meta.version);
        };
        if(ver === TmpStateTag.pending || !checkVersion(minVer, ver)) {
          errored = true;
          str += "\n" + nameDepend + "        " + minVer + "        " + (ver === TmpStateTag.pending ? "(not found)" : "(outdated)");
        };
        i += 2;
      };
      str += "\n----------------------------------------------------";
      str += "\n[]";

      if(errored) {
        Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
      };

      return !errored;
    },
    // In case someone forgot version is a string
    ["number", "number"], function(num1, num2) {return checkVersion(String(num1), String(num2))},
    ["number", "string"], function(num, str) {return checkVersion(String(num), str)},
    ["string", "number"], function(str, num) {return checkVersion(str, String(num))},
  );


  /**
   * Runs `scr` only when all required mods are found.
   * Used mostly to load something optionally.
   * @global
   * @param {string} nameModCur
   * @param {Plural<string>} nameMods_p
   * @param {function(): void} scr
   * @param {boolean|unset} [suppressWarning] - If true, error message about missing mods won't be shown.
   * @return {void}
   */
  runWithDependency = function(nameModCur, nameMods_p, scr, suppressWarning) {
    let
      arr1 = (nameMods_p instanceof Array ? nameMods_p : [nameMods_p]),
      arr2 = arr1.map(nameMod => Vars.mods.locateMod(nameMod));
    if(!arr2.includes(null)) {
      scr();
    } else if(!suppressWarning) {
      let str = "[gray]Missing dependencies for [accent]" + nameModCur + "[]:\n";
      str += "\n----------------------------------------------------";
      for(let i = 0; i < arr1.length; i++) {
        if(arr2[i] != null) continue;
        str += "\n" + arr1[i];
      };
      str += "\n----------------------------------------------------";
      str += "\n\nThe mod may not have full contents.\n[]";
      Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
    };
  };


  /* <------------------------------ format array ------------------------------ */


  /**
   * Checks if the given name has already been registered in `names`.
   * @global
   * @param {string} name
   * @param {Array<string>} names
   * @param {string|unset} [tag]
   * @return {string}
   */
  registerUniqueName = function(name, names, tag) {
    if(name == null || names.includes(name)) LCErrorHandler.throw("notUniqueName", name, tryVal(tag, "unknown"));
    names.push(name);

    return name;
  };


  /**
   * Used to read 2-arrays that map classes (or template names) to functions.
   * @global
   * @param {Array} arr - `ROW`: cls0tempName, fun.
   * @param {Object} ins
   * @param {any} [def]
   * @return {Function}
   */
  readClassFunMap = function(arr, ins, def) {
    let fun = tryVal(def, Function.air);
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(checkInstance(ins, arr[i])) fun = arr[i + 1];
      i += 2;
    };

    return fun;
  };


  /* <------------------------------ object ------------------------------ */


  /**
   * Merges a series of objects.
   * Properties defined later will overwrite the ones defined before.
   * <br> `ARGS`: obj1, obj2, obj3, ...
   * @global
   * @return {Object}
   */
  mergeObj = function() {
    let obj0 = {};

    for(let obj of arguments) {
      if(typeof obj !== "object") continue;
      for(let key in obj) {
        obj0[key] = obj[key];
      };
    };

    return obj0;
  };


  /**
   * Variant of {@link mergeObj} that mixes methods.
   * `addSuper` is used to call `super$xxx` if `override` is true.
   * <br> `ARGS`: obj1, obj2, obj3, ...
   * @global
   * @return {Object}
   */
  mergeObjWithMixin = function() {
    let obj0 = {};

    let superFun, fun;
    for(let obj of arguments) {
      if(typeof obj !== "object") continue;
      for(let key in obj) {
        if(typeof obj[key] !== "function" || typeof obj0[key] !== "function") {
          obj0[key] = obj[key];
        } else {
          superFun = obj0[key];
          fun = obj[key];
          fun.argLen = Math.max(tryVal(superFun.argLen, -1), tryVal(fun.argLen, -1));
          obj0[key] = !fun.override ?
            mixTempMethods(superFun, fun, MethodMixModes.NORMAL).wrapLen(fun.argLen) :
            !fun.addSuper ?
              fun.wrapLen(fun.argLen) :
              mixTempMethods(null, fun, MethodMixModes.BUILD, key);
          initTempMethod(obj0[key]).setProp({
            override: false,
            funPrev: superFun,
            funCur: fun,
          });
        };
      };
    };

    return obj0;
  };


  /**
   * Merges all found DB files with the same name in "scripts/db" folder.
   * Cross-mod.
   * @global
   * @param {Object} dbObj
   * @param {string} nameFi
   * @param {string|unset} [nameModCur]
   * @return {void}
   */
  mergeDB = function(dbObj, nameFi, nameModCur) {
    if(nameModCur == null) nameModCur = "lovec";

    let i = 0;
    Vars.mods.eachEnabled(mod => {
      if(mod.name === nameModCur) return;

      let path = mod.name + "/db/" + nameFi;
      let dbMdl;
      try {
        dbMdl = require(path);
      } catch(err) {
        dbMdl = null;
        if(!err.message.startsWith("Module ")) {
          console.err("[LOVEC] Error loading DB file from ${1}:\n".format(mod.name.color(Pal.accent)) + err);
        };
      };

      if(dbMdl != null) {
        mergeDB.mergeDBObj(dbObj, dbMdl.db);
        i++;
      };
    });

    console.log("[LOVEC] Merged ${1} DB file(s) for ${2} in ${3} from other mods.".format(i, nameFi, nameModCur.color(Pal.accent)));
  };
  mergeDB.mergeDBObj = function(obj0, obj) {
    Object.eachPair(obj0, (key1, val1) => {
      // Depth: 0
      val1 instanceof Array ?
        mergeDB.applyMerge(key1, obj, val1) :
        Object.eachPair(obj0[key1], (key2, val2) => {
          // Depth: 1
          val2 instanceof Array ?
            mergeDB.applyMerge(key2, Object.searchByKeys(obj, [key1], Object.air), val2) :
            Object.eachPair(obj0[key1][key2], (key3, val3) => {
              // Depth: 2
              val3 instanceof Array ?
                mergeDB.applyMerge(key3, Object.searchByKeys(obj, [key1, key2], Object.air), val3) :
                Object.eachPair(obj0[key1][key2][key3], (key4, val4) => {
                  // Depth: 3
                  val4 instanceof Array ?
                    mergeDB.applyMerge(key4, Object.searchByKeys(obj, [key1, key2, key3], Object.air), val4) :
                    Object.eachPair(obj0[key1][key2][key3][key4], (key5, val5) => {
                      // Depth: 4
                      val5 instanceof Array ?
                        mergeDB.applyMerge(key5, Object.searchByKeys(obj, [key1, key2, key3, key4], Object.air), val5) :
                        console.err("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
                    });
                });
            });
        });
    });

    return obj0;
  };
  mergeDB.applyMerge = function(key, objTarget, arrTarget) {
    let tmp = objTarget[key];
    if(tmp == null || !(tmp instanceof Array)) return;

    arrTarget.pushAll(tmp);
  };


  /* <------------------------------ content template ------------------------------ */


  /**
   * Whether this content is created with {@link CLS_contentTemplate}.
   * @global
   * @param {UnlockableContent} ct
   * @return {boolean}
   */
  checkCreatedByTemp = function(ct) {
    return ct.ex_isSubInsOf != null;
  };


  /**
   * Whether this content is an instance of some content template.
   * @global
   * @param {UnlockableContent} ct
   * @param {string} tempName
   * @return {boolean}
   */
  checkSubInsOfTemp = function(ct, tempName) {
    return ct.ex_isSubInsOf != null && ct.ex_isSubInsOf(tempName);
  };


  /**
   * Whether 'ins' is an instance of a class or content template.
   * Returns false if `cls0tempName` is null.
   * Returns true if `cls0tempName` is exactly `ins`.
   * @global
   * @param {Object} ins
   * @param {string|Function|null} cls0tempName
   * @return {boolean}
   */
  checkInstance = function(ins, cls0tempName) {
    if(cls0tempName == null) {
      return false;
    } else if(ins === cls0tempName) {
      return true;
    } else if(typeof cls0tempName === "function") {
      return ins instanceof cls0tempName;
    } else if(typeof cls0tempName === "string") {
      return checkSubInsOfTemp(ins, cls0tempName);
    };

    return false;
  };


  /**
   * Whether `ct_gn` is created by content template, and has matching tag.
   * @global
   * @param {ContentGn} ct_gn
   * @param {string} tag
   * @return {boolean}
   */
  checkTempTag = function(ct_gn, tag) {
    let ct = MDL_content.getCt(ct_gn, null, true);
    return ct == null || !checkCreatedByTemp(ct) ?
      false :
      ct.delegee.tempTags.includes(tag);
  };


  /**
   * Gets method from some content template.
   * @global
   * @param {string} nameTemp
   * @param {string} nameFun
   * @param {any} [def]
   * @return {Function}
   */
  fetchTempMethod = function(nameTemp, nameFun, def) {
    if(def == null) def = Function.air;

    let temp = CLS_contentTemplate.get(nameTemp);
    return temp == null ?
      def :
      temp[nameFun] == null ?
        def :
        temp[nameFun];
  };


  /**
   * Gets all parent templates and implemented interfaces of some template as string.
   * @global
   * @param {Array|unset} contArr
   * @param {string} nameTemp
   * @return {Array<string>}
   */
  fetchTempParents = function(contArr, nameTemp) {
    let arr = contArr != null ? contArr.clear() : [];
    return CLS_contentTemplate.get(nameTemp) == null ?
      arr :
      arr.pushAll(CLS_contentTemplate.getTempParents(nameTemp));
  };


  /**
   * Sets up default values in a content template method.
   * @global
   * @param {Function} fun
   * @param {boolean|unset} [isFromIntf]
   * @return {Function}
   */
  initTempMethod = function(fun, isFromIntf) {
    return fun.setProp({
      noSuper: tryVal(fun.noSuper, false),
      override: tryVal(fun.override, false),
      final: tryVal(fun.final, false),
      boolMode: tryVal(fun.boolMode, null),
      superBoolMode: tryVal(fun.superBoolMode, fun.boolMode),
      mergeMode: tryVal(fun.mergeMode, null),
      argLen: tryVal(fun.argLen, -1),
      funPrev: !isFromIntf ? null : tryVal(fun.funPrev, null),
      funCur: !isFromIntf ? null : tryVal(fun.funCur, null),
    });
  };


  /**
   * Mixes methods, used mostly in content templates.
   * @global
   * @param {Function|null} superFun
   * @param {Function} fun
   * @param {number|unset} [mode] - See {@link MethodMixModes}.
   * @param {string|unset} [nameFun] - Required if used in mode BUILD.
   * @return {Function}
   */
  mixTempMethods = function(superFun, fun, mode, nameFun) {
    if(mode == null) mode = MethodMixModes.NORMAL;
    if(mode === MethodMixModes.BUILD) {
      if(fun.noSuper) return fun.wrapLen(fun.argLen);
      superFun = null;
    } else {
      if(superFun == null) return fun;
      if(superFun.final) return superFun;
    };

    let fun_fi;
    switch(mode) {

      case MethodMixModes.NORMAL :
        if(fun.boolMode != null) {
          if(fun.boolMode === "and") {
            fun_fi = function() {
              return superFun.apply(this, arguments) && fun.apply(this, arguments);
            };
          } else if(fun.boolMode === "or") {
            fun_fi = function() {
              return superFun.apply(this, arguments) || fun.apply(this, arguments);
            };
          };
        } else if(fun.mergeMode != null) {
          if(fun.mergeMode === "object") {
            fun_fi = function() {
              return mergeObj(superFun.apply(this, arguments), fun.apply(this, arguments));
            };
          } else if(fun.mergeMode === "array") {
            fun_fi = function() {
              return superFun.apply(this, arguments).pushAll(fun.apply(this, arguments));
            };
          } else if(fun.mergeMode === "add") {
            fun_fi = function() {
              return superFun.apply(this, arguments) + fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "sub") {
            fun_fi = function() {
              return superFun.apply(this, arguments) - fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "mul") {
            fun_fi = function() {
              return superFun.apply(this, arguments) * fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "div") {
            fun_fi = function() {
              return superFun.apply(this, arguments) / fun.apply(this, arguments);
            };
          } else if(typeof fun.mergeMode === "function") {
            fun_fi = function() {
              mixTempMethods.tmpArgs.with(superFun.apply(this, arguments), fun.apply(this, arguments));
              return fun.mergeMode.apply(this, mixTempMethods.tmpArgs);
            };
          };
        } else {
          fun_fi = function() {
            superFun.apply(this, arguments);
            return fun.apply(this, arguments);
          };
        };
        break;

      case MethodMixModes.BUILD :
        let nameSuperFun = "super$" + nameFun;
        if(fun.superBoolMode != null) {
          if(fun.superBoolMode === "and") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) && fun.apply(this, arguments);
            };
          } else if(fun.superBoolMode === "or") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) || fun.apply(this, arguments);
            };
          };
        } else if(fun.mergeMode != null) {
          if(fun.mergeMode === "object") {
            fun_fi = function() {
              return mergeObj(this[nameSuperFun].apply(this, arguments), fun.apply(this, arguments));
            };
          } else if(fun.mergeMode === "array") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments).pushAll(fun.apply(this, arguments));
            };
          } else if(fun.mergeMode === "add") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) + fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "sub") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) - fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "mul") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) * fun.apply(this, arguments);
            };
          } else if(fun.mergeMode === "div") {
            fun_fi = function() {
              return this[nameSuperFun].apply(this, arguments) / fun.apply(this, arguments);
            };
          } else if(typeof fun.mergeMode === "function") {
            fun_fi = function() {
              mixTempMethods.tmpArgs.with(this[nameSuperFun].apply(this, arguments), fun.apply(this, arguments));
              return fun.mergeMode.apply(this, mixTempMethods.tmpArgs);
            };
          };
        } else {
          fun_fi = function() {
            this[nameSuperFun].apply(this, arguments);
            return fun.apply(this, arguments);
          };
        };
        break;

    };

    if(typeof fun_fi !== "function") {
      printAll(superFun, fun, mode, fun_fi);
      throw new Error("Error mixing methods!");
    };
    if(mode === MethodMixModes.BUILD) {
      fun_fi = fun_fi.wrapLen(fun.argLen);
    };
    fun_fi.setProp({
      noSuper: fun.noSuper,
      override: false,
      final: fun.final,
      boolMode: fun.boolMode,
      superBoolMode: fun.superBoolMode,
      mergeMode: fun.mergeMode,
      argLen: superFun == null ? fun.argLen : Math.max(superFun.argLen, fun.argLen),
      funPrev: superFun == null ? "!JAVASUPER" : superFun,
      funCur: fun,
    });

    return fun_fi;
  };
  mixTempMethods.tmpArgs = [];


  /* <------------------------------ game ------------------------------ */


  /**
   * `Mathf.chance(float trueChance)` but using fixed rand.
   * @global
   * @param {string} name
   * @param {number} trueChance
   * @return {boolean}
   */
  syncChance = function(name, trueChance) {
    return LCRand.chance(UTIL_rand.get(name), trueChance);
  };


  /**
   * Variant of {@link syncChance} involving delta.
   * @global
   * @param {string} name
   * @param {number} trueChance
   * @return {boolean}
   */
  syncChanceDelta = function(name, trueChance) {
    return LCRand.chanceDelta(UTIL_rand.get(name), trueChance);
  };


  /**
   * Used for blocks with dynamic building info layout for their buildings, e.g. multi-crafters.
   * @global
   * @return {void}
   */
  forceUpdateBlockFrag = function() {
    Reflect.set(PlacementFragment, Vars.ui.hudfrag.blockfrag, "lastDisplayState", null);
  };


  /* <------------------------------ debug ------------------------------ */


  /**
   * Collection of log types.
   * @global
   */
  LOG_HANDLER = {


    __infoMap__: new ObjectMap(),
    __warnMap__: new ObjectMap(),
    __errMap__: new ObjectMap(),
    __debugMap__: new ObjectMap(),


    /**
     * Registers a new log type.
     * @param {number} mode - See {@link LogModes}.
     * @param {string} name
     * @param {function(): string} strF
     * @return {void}
     */
    add(mode, name, strF) {
      switch(mode) {
        case 0 :
          this.__infoMap__.put(name, strF);
          break;
        case 1 :
          this.__warnMap__.put(name, strF);
          break;
        case 2 :
          this.__errMap__.put(name, strF);
          break;
        case 3 :
          this.__debugMap__.put(name, strF);
          break;
        default :
          throw new Error("Unknown log type: " + mode);
      };
    },


    /**
     * Finds log type and string getter for given name.
     * @param {string} name
     * @return {[number, function(): string]|null}
     */
    find(name) {
      let strF;
      strF = this.__infoMap__.get(name);
      if(strF != null) return [LogModes.I, strF];
      strF = this.__warnMap__.get(name);
      if(strF != null) return [LogModes.W, strF];
      strF = this.__errMap__.get(name);
      if(strF != null) return [LogModes.E, strF];
      strF = this.__debugMap__.get(name);
      if(strF != null) return [LogModes.D, strF];

      return null;
    },


    /**
     * Prints something in the console.
     * <br> `ARGS`: name, arg1, arg2, arg3, ...
     * @param {string} name
     * @return {void}
     */
    log(name) {
      let tup = this.find(name);
      if(tup == null) console.err("[LOVEC] Unregistered log name: " + name);
      let text = tup[1].apply(null, Array.from(arguments).splice(1));
      if(text == null) return;

      console.log(text, tup[0]);
    },


  };


  /**
   * Collection of errors, see {@link TP_error}.
   * @global
   */
  LCErrorHandler = {


    __errMap__: new ObjectMap(),


    /**
     * Registers a new error.
     * @param {string} name
     * @param {string} str
     */
    add(name, str) {
      this.__errMap__.put(name, str);
    },


    /**
     * Throws some error found by name.
     * <br> `ARGS`: name, arg1, arg2, arg3, ...
     * @param {string} name
     * @return {void}
     */
    throw(name) {
      let str = this.__errMap__.get(name);
      if(str == null) return;

      if(arguments.length === 1) {
        throw new Error(str);
      };
      let args = Array.from(arguments).splice(1);
      args.forEachFast(arg => printObj(arg), true);
      throw new Error(str.format.apply(str, args));
    },


  };
