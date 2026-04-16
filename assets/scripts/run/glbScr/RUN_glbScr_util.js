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
    let tmp = "", l, i, iCap;
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
   * <br> <ARGS>: nmMod, minVerArr
   * <br> <ROW-minVerArr>: nmMod, verStrReq
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
    ["string", Array], function(nmMod, minVerArr) {
      let str = "[gray]Unmet dependency for [accent]" + nmMod + "[]!\n";
      let errored = false;

      let i = 0, iCap = minVerArr.length;
      let nmDepend, minVer, ver, mod;
      str += "\n----------------------------------------------------";
      while(i < iCap) {
        nmDepend = minVerArr[i];
        minVer = minVerArr[i + 1];
        ver = "!PENDING";
        mod = Vars.mods.locateMod(nmDepend);
        if(mod != null) {
          ver = String(mod.meta.version);
        };
        if(ver === "!PENDING" || !checkVersion(minVer, ver)) {
          errored = true;
          str += "\n" + nmDepend + "        " + minVer + "        " + (ver === "!PENDING" ? "!NOTFOUND" : "!OUTDATED");
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
   * @param {string} nmModCur
   * @param {string|Array<string>} nmMods_p
   * @param {function(): void} scr
   * @param {boolean|unset} [suppressWarning] - If true, error message about missing mods won't be shown.
   * @return {void}
   */
  runWithDependency = function(nmModCur, nmMods_p, scr, suppressWarning) {
    let
      arr1 = (nmMods_p instanceof Array ? nmMods_p : [nmMods_p]),
      arr2 = arr1.map(nmMod => Vars.mods.locateMod(nmMod));
    if(!arr2.includes(null)) {
      scr();
    } else if(!suppressWarning) {
      let str = "[gray]Missing dependencies for [accent]" + nmModCur + "[]:\n";
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
   * Checks if the given name has already been registered in `nms`.
   * @global
   * @param {string} nm
   * @param {Array<string>} nms
   * @param {string|unset} [tag]
   * @return {string}
   */
  registerUniqueName = function(nm, nms, tag) {
    if(nm == null || nms.includes(nm)) ERROR_HANDLER.throw("notUniqueName", nm, tryVal(tag, "unknown"));
    nms.push(nm);

    return nm;
  };


  /**
   * Used to read 2-arrays that map classes to functions.
   * @global
   * @param {Array} arr - <ROW>: cls, fun.
   * @param {Object} ins
   * @param {any} [def]
   * @return {Function}
   */
  readClassFunMap = function(arr, ins, def) {
    let fun = tryVal(def, Function.air);
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(ins instanceof arr[i]) fun = arr[i + 1];
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


    /**
     * Registers a new log type.
     * @param {string} type - <VALS>: "i", "w", "e".
     * @param {string} nm
     * @param {function(): string} strGetter
     * @return {void}
     */
    add(type, nm, strGetter) {
      switch(type) {
        case "i" :
          this.__INFO_MAP__.put(nm, strGetter);
          break;
        case "w" :
          this.__WARN_MAP__.put(nm, strGetter);
          break;
        case "e" :
          this.__ERR_MAP__.put(nm, strGetter);
          break;
        default :
          throw new Error("Unknown log type: " + type);
      };
    },


    /**
     * Finds log type and string getter for given name.
     * @param {string} nm
     * @return {[string, function(): string]}
     */
    find(nm) {
      let strGetter;
      strGetter = this.__INFO_MAP__.get(nm);
      if(strGetter != null) return ["i", strGetter];
      strGetter = this.__WARN_MAP__.get(nm);
      if(strGetter != null) return ["w", strGetter];
      strGetter = this.__ERR_MAP__.get(nm);
      if(strGetter != null) return ["e", strGetter];

      return strGetter;
    },


    /**
     * Prints something in the console.
     * <br> <ARGS>: nm, arg1, arg2, arg3, ...
     * @param {string} nm
     * @return {void}
     */
    log(nm) {
      let tup = this.find(nm);
      if(tup == null) throw new Error("Unregistered log name: " + nm);
      let str = tup[1].apply(null, Array.from(arguments).splice(1));
      if(str == null) return;

      switch(tup[0]) {
        case "i" :
          Log.info(str);
          break;
        case "w" :
          Log.warn(str);
          break;
        case "e" :
          Log.err(str);
          break;
      };
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
     * @param {string} nm
     * @param {string} str
     */
    add(nm, str) {
      this.__ERR_MAP__.put(nm, str);
    },


    /**
     * Throws some error found by name.
     * <br> <ARGS>: nm, arg1, arg2, arg3, ...
     * @param {string} nm
     * @return {void}
     */
    throw(nm) {
      let str = this.__ERR_MAP__.get(nm);
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
   * Gets method from some content template.
   * @param {string} nmTemp
   * @param {string} nmFun
   * @param {any} [def]
   * @return {Function}
   */
  fetchTempMethod = function(nmTemp, nmFun, def) {
    if(def == null) def = Function.air;

    let temp = LCTemp[nmTemp];
    return temp == null ?
      def :
      temp[nmFun] == null ?
        def :
        temp[nmFun];
  };


  /**
   * Gets all parent templates and implemented inferfaces of some template as string.
   * @param {string} nmTemp
   * @return {Array<string>}
   */
  fetchTempParents = function(nmTemp) {
    return LCTemp[nmTemp] == null ?
      [] :
      LCTempParentMap.get(nmTemp).slice();
  };


  /* <---------- game ----------> */


  /**
   * Whether given elements don't match the ones found in given tuple.
   * <br> <ARGS>: tup, shouldUpdateTup, ele1, ele2, ele3, ...
   * @global
   * @return {boolean}
   */
  checkTupChange = function() {
    const tup = arguments[0];

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
