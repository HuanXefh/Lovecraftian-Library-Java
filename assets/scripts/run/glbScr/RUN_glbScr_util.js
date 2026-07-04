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


  /* <---------- internal ----------> */


  /** @global */
  TRIGGER_BACKGROUND = false;
  /** @global */
  TRIGGER_MUSIC = false;
  /** @global */
  TRIGGERS_IMAGE = [
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false,
  ];


  /* <---------- dependency ----------> */


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
   * <br> <ARGS>: verStrReq, verStrCur.
   * <br> <ARGS>: nameMod, minVerArr
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
        i = 0,
        iCap = Math.max(ints1.length, ints2.length);

      while(i < iCap) {
        if(ints1[i] == null && ints2[i] != null) return true;
        if(ints1[i] > ints2[i]) return false;
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
        ver = "!PENDING";
        mod = Vars.mods.locateMod(nameDepend);
        if(mod != null) {
          ver = String(mod.meta.version);
        };
        if(ver === "!PENDING" || !checkVersion(minVer, ver)) {
          errored = true;
          str += "\n" + nameDepend + "        " + minVer + "        " + (ver === "!PENDING" ? "!NOTFOUND" : "!OUTDATED");
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
   * @param {string|Array<string>} nameMods_p
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


  /* <---------- format array ----------> */


  /**
   * Checks if the given name has already been registered in `names`.
   * @global
   * @param {string} name
   * @param {Array<string>} names
   * @param {string|unset} [tag]
   * @return {string}
   */
  registerUniqueName = function(name, names, tag) {
    if(name == null || names.includes(name)) ERROR_HANDLER.throw("notUniqueName", name, tryVal(tag, "unknown"));
    names.push(name);

    return name;
  };


  /**
   * Used to read 2-arrays that map classes (or template names) to functions.
   * @global
   * @param {Array} arr - <ROW>: cls0tempName, fun.
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


  /* <---------- debug ----------> */


  /**
   * Collection of log types.
   * @global
   */
  LOG_HANDLER = {


    __INFO_MAP__: new ObjectMap(),
    __WARN_MAP__: new ObjectMap(),
    __ERR_MAP__: new ObjectMap(),
    __DEBUG_MAP__: new ObjectMap(),


    /**
     * Registers a new log type.
     * @param {numbers} mode - See {@link LogModes}.
     * @param {string} name
     * @param {function(): string} strGetter
     * @return {void}
     */
    add(mode, name, strGetter) {
      switch(mode) {
        case 0 :
          this.__INFO_MAP__.put(name, strGetter);
          break;
        case 1 :
          this.__WARN_MAP__.put(name, strGetter);
          break;
        case 2 :
          this.__ERR_MAP__.put(name, strGetter);
          break;
        case 3 :
          this.__DEBUG_MAP__.put(name, strGetter);
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
      let strGetter;
      strGetter = this.__INFO_MAP__.get(name);
      if(strGetter != null) return [LogModes.I, strGetter];
      strGetter = this.__WARN_MAP__.get(name);
      if(strGetter != null) return [LogModes.W, strGetter];
      strGetter = this.__ERR_MAP__.get(name);
      if(strGetter != null) return [LogModes.E, strGetter];
      strGetter = this.__DEBUG_MAP__.get(name);
      if(strGetter != null) return [LogModes.D, strGetter];

      return null;
    },


    /**
     * Prints something in the console.
     * <br> <ARGS>: name, arg1, arg2, arg3, ...
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
  ERROR_HANDLER = {


    __ERR_MAP__: new ObjectMap(),


    /**
     * Registers a new error.
     * @param {string} name
     * @param {string} str
     */
    add(name, str) {
      this.__ERR_MAP__.put(name, str);
    },


    /**
     * Throws some error found by name.
     * <br> <ARGS>: name, arg1, arg2, arg3, ...
     * @param {string} name
     * @return {void}
     */
    throw(name) {
      let str = this.__ERR_MAP__.get(name);
      if(str == null) return;

      if(arguments.length === 1) {
        throw new Error(str);
      };
      let args = Array.from(arguments).splice(1);
      args.forEachFast(arg => printObj(arg));
      throw new Error(str.format.apply(str, args));
    },


  };


  /* <---------- content template ----------> */


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
      return checkCreatedByTemp(ins) && ins.ex_isSubInsOf(cls0tempName);
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
    let ct = MDL_content._ct(ct_gn, null, true);
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

    let temp = LCTemp[nameTemp];
    return temp == null ?
      def :
      temp[nameFun] == null ?
        def :
        temp[nameFun];
  };


  /**
   * Gets all parent templates and implemented interfaces of some template as string.
   * @global
   * @param {string} nameTemp
   * @return {Array<string>}
   */
  fetchTempParents = function(nameTemp) {
    return LCTemp[nameTemp] == null ?
      [] :
      LCTempParentMap.get(nameTemp).slice();
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
              return Object.mergeObj(superFun.apply(this, arguments), fun.apply(this, arguments));
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
              return Object.mergeObj(this[nameSuperFun].apply(this, arguments), fun.apply(this, arguments));
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


  /* <---------- game ----------> */


  /**
   * Whether given elements don't match the ones found in given tuple.
   * <br> <ARGS>: tup, shouldUpdateTup, ele1, ele2, ele3, ...
   * @global
   * @return {boolean}
   */
  checkTupChange = function() {
    let tup = arguments[0];

    let cond = false;
    if(tup.length === 0) cond = true;
    let i = 2, iCap = arguments.length;
    while(i < iCap) {
      if(arguments[i] !== tup[i - 2]) {
        cond = true;
        break;
      };
      i++;
    };

    if(cond && arguments[1]) {
      i = 0;
      while(i < iCap) {
        tup[i - 2] = arguments[i];
        i++;
      };
    };

    return cond;
  };


  /**
   * Used to check relative rotation for buildings.
   * @global
   */
  GEOMETRY_HANDLER = {


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @return {boolean}
     */
    acceptLine(b_f, b_t) {
      return b_f.relativeTo(b_t) === b_f.rotation && (!b_t.block.rotate ? true : b_t.relativeTo(b_f) !== b_t.rotation);
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @param {boolean} canSideBlend
     * @return {boolean}
     */
    acceptLineNoSide(b_f, b_t, canSideBlend) {
      return canSideBlend ?
        GEOMETRY_HANDLER.acceptLine(b_f, b_t) :
        b_f.relativeTo(b_t) === b_f.rotation && (!b_t.block.rotate ? true : b_f.relativeTo(b_t) === b_t.rotation);
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @return {boolean}
     */
    acceptRouter(b_f, b_t) {
      return b_f.relativeTo(b_t) !== Mathf.mod(b_f.rotation + 2, 4) && (!b_t.block.rotate ? true : b_t.relativeTo(b_f) !== b_t.rotation);
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @param {boolean} canSideBlend
     * @return {boolean}
     */
    acceptRouterNoSide(b_f, b_t, canSideBlend) {
      return canSideBlend ?
        GEOMETRY_HANDLER.acceptRouter(b_f, b_t) :
        b_f.relativeTo(b_t) !== Mathf.mod(b_f.rotation + 2, 4) && (!b_t.block.rotate ? true : b_f.relativeTo(b_t) === b_t.rotation);
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @return {boolean}
     */
    acceptBlock(b_f, b_t) {
      return !b_t.block.rotate ? true : b_t.relativeTo(b_f) !== b_t.rotation;
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @param {boolean} canSideBlend
     * @return {boolean}
     */
    acceptBlockNoSide(b_f, b_t, canSideBlend) {
      return canSideBlend ?
        GEOMETRY_HANDLER.acceptBlock(b_f, b_t) :
        !b_t.block.rotate ? true : b_f.relativeTo(b_t) === b_t.rotation;
    },


    /**
     * @param {Building} b_f
     * @param {Building} b_t
     * @param {boolean} isFromRouter
     * @param {boolean} canSideBlend
     * @return {boolean}
     */
    accept(b_f, b_t, isFromRouter, canSideBlend) {
      return !b_f.block.rotate ?
        GEOMETRY_HANDLER.acceptBlockNoSide(b_f, b_t, canSideBlend) :
        !isFromRouter ?
          GEOMETRY_HANDLER.acceptLineNoSide(b_f, b_t, canSideBlend) :
          GEOMETRY_HANDLER.acceptRouterNoSide(b_f, b_t, canSideBlend);
    },


  };


  /**
   * Collection of methods that control in-game HUD.
   * @global
   */
  HUD_HANDLER = {


    /**
     * Used for blocks with dynamic building info layout for their buildings, e.g. multi-crafters.
     * @return {void}
     */
    forceUpdateBlockFrag() {
      Reflect.set(PlacementFragment, Vars.ui.hudfrag.blockfrag, "lastDisplayState", null);
    },


  };


  /**
   * Used to mute vanilla sound control and play custom music.
   * @global
   */
  MUSIC_HANDLER = {


    musCur: null,
    endGetter: null,
    isActive: false,


    /**
     * @return {void}
     */
    init() {
      Events.run(Trigger.update, () => {
        this.update();
      });
    },


    /**
     * @return {void}
     */
    update() {
      if(this.isActive) {
        Vars.control.sound.stop();
      } else {
        if(this.musCur != null) {
          this.musCur.stop();
          this.musCur = null;
        };
      };

      if(this.endGetter != null && this.endGetter()) {
        this.stop();
      };
      if(this.musCur != null && this.pauseGetter != null) {
        this.musCur.pause(this.pauseGetter());
      };
    },


    /**
     * Sets current music and temporarily disables vanilla sound control.
     * @param {MusicGn} mus_gn
     * @param {(function(): boolean)|unset} endGetter - The music will stop as soon as this function returns true.
     * @param {(function(): boolean)|unset} pauseGetter - The music will be paused when this function returns true.
     */
    setMusic(mus_gn, endGetter, pauseGetter) {
      let mus = fetchMusic(mus_gn);
      if(mus == null) {
        this.stop();
        return;
      };

      if(this.musCur != null) this.musCur.stop();
      this.musCur = mus;
      this.musCur.play();
      this.isActive = true;
      this.musCur.setVolume(Core.settings.getInt("musicvol") / 100.0);
      this.musCur.setLooping(true);

      if(endGetter != null) this.endGetter = endGetter;
      if(pauseGetter != null) this.pauseGetter = pauseGetter;
    },


    /**
     * Stops custom music and lets vanilla sound control take over.
     * @return {void}
     */
    stop() {
      this.isActive = false;
      this.endGetter = null;
      this.pauseGetter = null;
    },


  };
