/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Utility global methods.
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


  TRIGGER_BACKGROUND = false;
  TRIGGER_MUSIC = false;


  /* <---------- dependency ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a version string to an array of integers.
   * This implies that the string should not contain letters.
   * ---------------------------------------- */
  verStrToInts = function(verStr) {
    const arr = [];

    let tmp = "", l, i, iCap;

    i = 0, iCap = verStr.length;
    while(i < iCap) {
      l = verStr[i];
      if(l === ".") {
        arr.push(String(tmp));
        tmp = "";
      } else {
        tmp += l;
      };
      i++;
    };
    arr.push(tmp);

    i = 0, iCap = arr.length;
    while(i < iCap) {
      arr[i] = parseInt(arr[i], 10);
      if(isNaN(arr[i])) {
        arr[i] = 0;
      };
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * 1. Whether {verStrCur} is newer or equal to {verStrReq}.
   * 2. Whether all version requirements defined in {minVerArr} are met.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Runs {scr} only when all required mods are found.
   * Used to optionally load something.
   * By default this will show error message about missing mods, set {suppressWarning} to {true} if you wish it skip quietly.
   * ---------------------------------------- */
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
      str += "\n\nThe mod may not have full contents.\n[]"
      Events.run(ClientLoadEvent, () => Vars.ui.showErrorMessage(str));
    };
  };


  /* <---------- format array ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Checks if the given name has been registered, and throw an error if it does.
   * ---------------------------------------- */
  registerUniqueName = function(nm, nms, tag) {
    if(nm == null || nms.includes(nm)) ERROR_HANDLER.throw("notUniqueName", nm, tryVal(tag, "unknown"));
    nms.push(nm);

    return nm;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to read any 2-array of classes and functions.
   * ---------------------------------------- */
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


  LOG_HANDLER = {


    __INFO_MAP__: new ObjectMap(),
    __WARN_MAP__: new ObjectMap(),
    __ERR_MAP__: new ObjectMap(),


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


  /* ----------------------------------------
   * NOTE:
   *
   * Collection of some errors that may frequently occur.
   * Errors are registered in {TP_error}.
   * ---------------------------------------- */
  ERROR_HANDLER = {


    __ERR_MAP__: new ObjectMap(),


    add(nm, str) {
      this.__ERR_MAP__.put(nm, str);
    },


    throw(nm) {
      let str = this.__ERR_MAP__.get(nm);
      if(str == null) return;

      if(arguments.length === 1) {
        throw new Error(str);
      } else {
        throw new Error(str.format(Array.from(arguments).splice(1)));
      };
    },


  };


  /* <---------- game ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to control some in-game HUD related things.
   * ---------------------------------------- */
  HUD_HANDLER = {


    placeFrag: {


      /* ----------------------------------------
       * NOTE:
       *
       * Used for blocks that can have different placement HUD layouts for buildings, e.g. multi-crafters.
       * ---------------------------------------- */
      forceUpdate() {
        Reflect.set(PlacementFragment, Vars.ui.hudfrag.blockfrag, "lastDisplayState", null);
      },


    },


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to mute vanilla sound control and play custom music.
   * ---------------------------------------- */
  MUSIC_HANDLER = {


    musCur: null,
    endGetter: null,
    isActive: false,


    init() {
      Events.run(Trigger.update, () => {
        this.update();
      });
    },


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


    setMusic(mus, endGetter, pauseGetter) {
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


    stop() {
      this.isActive = false;
      this.endGetter = null;
      this.pauseGetter = null;
    },


  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set position-related config for buildings.
   * ---------------------------------------- */
  POS_CONFIG_HANDLER = {


    isReady: false,
    __INT_QUEUE__: [],
    __PON2_QUEUE__: [],
    __VEC2_QUEUE__: [],


    init() {
      Events.run(ClientLoadEvent, () => {
        Core.app.post(() => {
          global.lovec.mdl_event._c_onTileTap(t => this.trigger(t), 12050505);
        });
      });
    },


    add(b, posType) {
      switch(posType) {
        case "int":
          this.__INT_QUEUE__.push(b);
          break;
        case "pon2":
          this.__PON2_QUEUE__.push(b);
          break;
        case "vec2":
          this.__VEC2_QUEUE__.push(b);
          break;
        default :
          throw new Error("Unknown position type: " + posType);
      };
      this.isReady = true;
    },


    remove(b) {
      this.__INT_QUEUE__.pull(b);
      this.__PON2_QUEUE__.pull(b);
      this.__VEC2_QUEUE__.pull(b);
      this.isReady = this.__INT_QUEUE__.length > 0 && this.__PON2_QUEUE__.length > 0 && this.__VEC2_QUEUE__.length > 0;
    },


    clear() {
      this.__INT_QUEUE__.clear();
      this.__PON2_QUEUE__.clear();
      this.__VEC2_QUEUE__.clear();
      this.isReady = false;
    },


    trigger(t) {
      if(!this.isReady) return;

      this.__INT_QUEUE__.forEachFast(b => b.configure(t.pos()));
      this.__PON2_QUEUE__.forEachFast(b => b.configure(Tmp.p1.set(t.x, t.y)));
      this.__VEC2_QUEUE__.forEachFast(b => b.configure(Tmp.v1.set(t.worldx(), t.worldy())));
      this.clear();
    },


  };
