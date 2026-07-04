/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly `require` anything!
   * This is mostly intended for console and some generic methods.
   * For your own mod, simply create another globalScript.js in your "scripts" folder, it will be automatically loaded.
   * Beware of naming conflict!
   */


/*
  ========================================
  Section: Pre-load
  ========================================
*/


  /**
   * <IMPORTANT>: {@link RUN_methodExt} has not been run yet!
   */


  /* <---------- base ----------> */


  /** @global */
  CONTEXT = Packages.rhino.Context.getContext();
  /** @global */
  SCOPE = Vars.mods.scripts.scope;


  /**
   * Evaluates the given string in global scope.
   * @global
   * @param {string} scrStr
   * @param {string|unset} [nameFi]
   * @return {void}
   */
  globalEval = function(scrStr, nameFi) {
    if(typeof nameFi === "string") {
      Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, nameFi + ".js", 0);
    } else {
      Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, "globalEval_" + globalEval.ind + ".js", 0);
      globalEval.ind++;
    };
  };
  globalEval.ind = 0;


  /**
   * Requires a JS file (as {@link Fi}), which will be run in global scope.
   * @global
   * @param {string} nameMod
   * @param {function(Fi): Fi} fiGetter - <ARGS>: modRoot
   * @return {void}
   */
  globalRequire = function(nameMod, fiGetter) {
    let fi = fiGetter(Vars.mods.locateMod(nameMod).root);
    if(fi == null || !fi.exists() || fi.extension() !== "js") throw new Error("Failed to require a script in global script for ${1}! ${2} is not a valid .js file.".format(nameMod, fi));

    Vars.mods.scripts.context.evaluateString(SCOPE, fi.readString(), fi.name(), 0);
  };


  /* <---------- class & package ----------> */


  /**
   * Used to get Java classes by path, e.g. "aquarion.AquaItems" from Aquarion.
   * Will return null if not found.
   * Do not include this in main loops!
   * @global
   * @param {string} clsPath
   * @param {boolean|unset} [suppressWarning]
   * @return {Class}
   */
  fetchClass = function(clsPath, suppressWarning) {
    let cls;
    try {
      cls = Packages.rhino.NativeJavaClass(
        Vars.mods.scripts.scope,
        java.net.URLClassLoader(
          [Vars.mods.getMod("lovec").file.file().toURI().toURL()],
          Vars.mods.mainLoader(),
        ).loadClass(clsPath),
      );
    } catch(err) {
      cls = null;
      if(!suppressWarning) console.warn("[LOVEC] Failed to fetch class:\n" + err);
    };

    return cls;
  };


  // Common packages
  /** @global */
  com = Packages.com;
  /** @global */
  net = Packages.net;
  /** @global */
  org = Packages.org;
  /** @global */
  arc = Packages.arc;
  /** @global */
  mdt = Packages.mindustry;
  /** @global */
  rhino = Packages.rhino;


  // Java
  /** @global */
  Pattern = java.util.regex.Pattern;
  /** @global */
  Matcher = java.util.regex.Matcher;


  // LWJGL
  /** @global */
  SDLVideo = org.lwjgl.sdl.SDLVideo;


  // Arc
  /** @global */
  SDL = arc.backend.sdl.jni.SDL;


  /**
   * Container of commonly used Java classes.
   * @global
   */
  JAVA = {


    /**
     * More classes will be populated here later.
     * You can push more classes in your global script.
     * @return {void}
     */
    init() {
      function convertName(javaCls) {
        let str = javaCls.__javaObject__.getSimpleName();
        return str.charAt(0).toLowerCase() + str.slice(1) + "_arr";
      };
      function getArrayClass(javaCls) {
        return java.lang.reflect.Array.newInstance(javaCls, 1).getClass();
      };

      let arr = [];
      for(let key in JAVA) {
        if(key === "init" || key === "clsTgs") continue;
        arr.push(key);
      };
      arr.forEach(key => {
        JAVA[key + "_arr"] = getArrayClass(JAVA[key]);
      });

      JAVA.clsTgs.forEach(javaCls => {
        JAVA[convertName(javaCls)] = getArrayClass(javaCls);
      });
    },


    /**
     * `SomeClass[]` will be created for these classes as "someClass_arr".
     * For example, you can use `JAVA.point2_arr` to access `Point2[]`.
     * @type {Array<Class>}
     */
    clsTgs: [
      Boolc, Boolf, Boolf2, Boolf3, Boolp, Cons, Cons2, Cons3, Cons4, ConsT, FloatFloatf, Floatc, Floatc2, Floatc4, Floatf, Floatp, Func, Func2, Func3, IntIntf, Intc, Intc4, Intf, Intp, Longf, Prov,
      ArrayMap, BinaryHeap, Bits, BoolSeq, ByteSeq, ComparableTimSort, DelayedRemovalSeq, EnumSet, FloatSeq, GridBits, GridMap, IntFloatMap, IntIntMap, IntMap, IntQueue, IntSeq, IntSeq, LongMap, LongQueue, LongSeq, ObjectFloatMap, ObjectIntMap, ObjectMap, ObjectSet, OrderedMap, OrderedSet, PQueue, Queue, Seq, ShortSeq, SnapshotSeq, Sort, StringMap, TimSort,
      Color, Fi, ZipFi,
      Texture, Texture.TextureFilter, Texture.TextureWrap, TextureData, TextureRegion, PixmapRegion,
      Point2, Point3, Vec2, Vec3,
      Element, Group, Action,
      EditorSpriteCache,
      Mesh, FloorRenderer.ChunkMesh,
      Pathfinder.Flowfield, ControlPathfinder.Cluster,
      ItemSeq, PayloadSeq, ItemStack, LiquidStack, PayloadStack,
      Content, ContentType, MappableContent, UnlockableContent,
      Block, UnitType, Item, Liquid, StatusEffect, Planet, SectorPreset, Weather, Weapon,
      Building, Unit, StatusEntry, Sector, WeatherState, WeaponMount,
    ],


    int: java.lang.Integer,
    byte: java.lang.Byte,
    short: java.lang.Short,
    long: java.lang.Long,
    float: java.lang.Float,
    double: java.lang.Double,
    boolean: java.lang.Boolean,
    char: java.lang.Character,
    string: java.lang.String,
    object: java.lang.Object,
    class: java.lang.Class,
    classLoader: java.lang.ClassLoader,
    runnable: java.lang.Runnable,
    thread: java.lang.Thread,
    file: java.io.File,


  };


  /* <---------- load ----------> */


  // Lovec internal data
  /** @global */
  LCAnno = {};
  /** @global */
  LCTemp = {};
  /** @global */
  LCTempParentMap = ObjectMap.of(
    "CLS_contentTemplate", [],
  );


  /**
   * For other mods, push names here for new arrays in DB files.
   * @global
   */
  LCModDbRegister = {
    /** Target: {@link DB_item.db["map"]["attr"]}. */
    attrRsMap: [],
    /** Target: {@link DB_fluid.db["group"]["elementary"]}. */
    eleFldGrp: [],
    /** Target: {@link DB_fluid.db["group"]["fTag"]}. */
    fTag: [],
    /** Target: {@link DB_fluid.db["grpParam"]["matEleScl"]}. */
    matEleCorScl: [],
    /** Target: {@link DB_fluid.db["grpParam"]["matFTagScl"]}. */
    matFTagCorScl: [],
    /** Target: {@link DB_block.db["group"]["material"]}. */
    blkMat: [],
    /** Target: {@link DB_recipe.db["genData"]}. */
    rcGenData: [],
    /** Target: {@link DB_recipe.db["genData"]["assembly"]}. */
    rcGenAssemblyData: [],
    /** Target: {@link DB_reaction.db["solvationTarget"]}. */
    reacSolvTg: [],

    /**
     * Creates new arrays for an object in DB objects.
     * @param {string} name - Determines the name array to be used.
     * @param {Object} obj
     * @return {this}
     */
    apply(name, obj) {
      if(!(LCModDbRegister[name] instanceof Array)) throw new Error("Error registering DB list: ${1} cannot be extended!".format(name));
      LCModDbRegister[name].forEachFast(key => {
        obj[key] = [];
      });
      return LCModDbRegister;
    },
  };


  // Run other global script fragments
  [
    "RUN_glbScr_lovecJava",
    "RUN_glbScr_air",
    "RUN_glbScr_base",
    "RUN_glbScr_data",
    "RUN_glbScr_draw",
    "RUN_glbScr_content",
    "RUN_glbScr_extend",
    "RUN_glbScr_net",
    "RUN_glbScr_util",
    "RUN_glbScr_module",
  ]
  .forEach(name => {
    globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child(name + ".js"));
  });


  DEBUG = {

    skipFacilityUpdate: false,

    skipRcUpdate: false,
    skipRcEffcCalc: false,
    skipRcLiqCons: false,
    skipRcLiqProd: false,
    skipRcDump: false,

    bft(filter) {
      Vars.content.blocks().each(
        filter,
        oblk => print(oblk),
      );
    },

    lastHttpUrl: null,
    lastHttpRes: null,
    lastHttpExc: null,

  },


/*
  ========================================
  Section: Client Load
  ========================================
*/


  /**
   * Methods defined here are only intended for console.
   * DO NOT use these in regular codes!
   */


  Events.run(ClientLoadEvent, () => Core.app.post(() => {


    /* <---------- debug ----------> */


    /**
     * Used to test some draw function in game quickly.
     * @global
     */
    DRAW_TEST = {


      enabled: false,
      safe: false,
      xGetter: Function.airZero,
      yGetter: Function.airZero,
      radGetter: Function.airZero,
      colorGetter: Function.airWhite,
      drawF: Function.air,


      /**
       * @return {void}
       */
      reset() {
        DRAW_TEST.enabled = false;
        DRAW_TEST.safe = false;
        DRAW_TEST.xGetter = Function.airZero;
        DRAW_TEST.yGetter = Function.airZero;
        DRAW_TEST.radGetter = Function.airZero;
        DRAW_TEST.colorGetter = Function.airWhite;
        DRAW_TEST.drawF = Function.air;
      },


      /**
       * @param {boolean|unset} [bool]
       * @return {void}
       */
      toggle(bool) {
        if(bool == null) {
          DRAW_TEST.enabled = !DRAW_TEST.enabled;
        } else {
          DRAW_TEST.enabled = Boolean(bool);
        };
      },


      /**
       * @param {(function(): number)|unset} [xGetter]
       * @param {(function(): number)|unset} [yGetter]
       * @param {(function(): number)|unset} [radGetter]
       * @param {(function(): Color)|unset} [colorGetter]
       * @return {void}
       */
      setGetter(xGetter, yGetter, radGetter, colorGetter) {
        DRAW_TEST.safe = false;
        if(xGetter != null && typeof xGetter === "function") DRAW_TEST.xGetter = xGetter;
        if(yGetter != null && typeof yGetter === "function") DRAW_TEST.yGetter = yGetter;
        if(radGetter != null && typeof radGetter === "function") DRAW_TEST.radGetter = radGetter;
        if(colorGetter != null && typeof colorGetter === "function") DRAW_TEST.colorGetter = colorGetter;
      },


      /**
       * @param {(function(): number)|unset} [radGetter]
       * @param {(function(): Color)|unset} [colorGetter]
       * @return {void}
       */
      setGetter_player(radGetter, colorGetter) {
        DRAW_TEST.setGetter(
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
          radGetter,
          colorGetter,
        );
      },


      /**
       * @param {(function(number, number, number, color): void)|unset} [drawF] - <ARGS>: x, y, rad, color.
       * @return {void}
       */
      setDrawF(drawF) {
        if(drawF == null || typeof drawF !== "function") return;
        DRAW_TEST.safe = false;
        DRAW_TEST.drawF = drawF;
      },


      /**
       * @return {void}
       */
      draw() {
        if(DRAW_TEST.safe) {
          DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
        } else {
          // Try only once to save memory
          try {
            DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
          } catch(err) {
            DRAW_TEST.reset();
            console.err("[LOVEC] Failed to implement the draw function: \n" + err);
            return;
          };
          DRAW_TEST.safe = true;
        };
      },


    };


    /**
     * Gets a building.
     * <br> <ARGS>: .
     * <br> <ARGS>: tx, ty.
     * @global
     * @return {Building|null}
     */
    _b = newMultiFunction(
      function() {
        let t = MDL_pos._tMouse();
        return t == null ? null : t.build;
      },
      function(tx, ty) {
        return Vars.world.build(tx, ty);
      },
    )
    .setAnno("console");


    /**
     * Gets a unit.
     * <br> <ARGS>: .
     * <br> <ARGS>: tx, ty.
     * @global
     * @return {Unit|null}
     */
    _unit = newMultiFunction(
      function() {
        return Vars.player.unit();
      },
      function(tx, ty) {
        return MDL_pos._unit(tx * Vars.tilesize, ty * Vars.tilesize);
      },
    )
    .setAnno("console");


    /* <---------- cheat ----------> */


    /**
     * @global
     * @return {boolean}
     */
    __CHECK_CHEAT_STATE__ = function() {
      return Vars.player.admin || (Groups.player.size() === 1 && !Vars.net.client());
    };


    /**
     * Kills some unit.
     * <br> <ARGS>: .
     * <br> <ARGS>: name.
     * @global
     * @return {void}
     */
    __k = newMultiFunction(
      function() {
        if(!__CHECK_CHEAT_STATE__()) return;
        if(Vars.player.unit() != null) Call.unitDestroy(Vars.player.unit().id);
      },
      function(name) {
        if(!__CHECK_CHEAT_STATE__()) return;
        let unit = MDL_pos._unitPlayerByName(name);
        if(unit == null) {
          console.err("[LOVEC] No player found with name ${1}!".format(String(name).color(Pal.accent)));
          return;
        };
        Call.unitDestroy(unit.id);
      },
    )
    .setAnno("console");


    /**
     * Changes player team.
     * @global
     * @param {string|Team} team
     * @return {void}
     */
    __team = function(team) {
      if(!__CHECK_CHEAT_STATE__()) return;
      if(typeof team === "string") {
        try {
          team = Team[team];
        } catch(err) {
          team = null;
        };
      };
      if(!(team instanceof Team)) return;
      Vars.player.team(team);
    }
    .setAnno("console");


    /**
     * Sets item amount in some building.
     * @global
     * @param {number} tx
     * @param {number} ty
     * @param {ItemGn} itm_gn
     * @param {number} amt
     * @return {void}
     */
    __itm = function(tx, ty, itm_gn, amt) {
      if(!__CHECK_CHEAT_STATE__()) return;
      let b = Vars.world.build(tx, ty);
      if(b == null) {
        console.err("[LOVEC] No building found at (${1}, ${2})!".format(tx, ty));
        return;
      };
      let itm = MDL_content._ct(itm_gn, "rs");
      if(itm == null) return;
      FRAG_item.setItem(b, itm, amt);
    }
    .setAnno("console");


    /**
     * Toggles cheat production.
     * @global
     * @return {void}
     */
    __inf = function() {
      if(!__CHECK_CHEAT_STATE__()) return;
      let unit = Vars.player.unit();
      if(unit == null) return;
      Vars.state.rules.teams.get(unit.team).cheat = !Vars.state.rules.teams.get(unit.team).cheat;
      Time.run(2.0, () => {
        console.log("[LOVEC] Cheat production: " + (Vars.state.rules.teams.get(unit.team).cheat ? "ON" : "OFF").color(Pal.accent));
      });
    }
    .setAnno("console");


    /**
     * Toggles player invincibility.
     * @global
     * @return {void}
     */
    __pinv = function() {
      if(!__CHECK_CHEAT_STATE__()) return;
      let unit = Vars.player.unit();
      if(unit == null) return;
      unit.hasEffect(StatusEffects.invincible) ?
        unit.unapply(StatusEffects.invincible) :
        unit.apply(StatusEffects.invincible, Number.fMax);
      Time.run(2.0, () => {
        console.log("[LOVEC] Player invincibility: " + (unit.hasEffect(StatusEffects.invincible) ? "ON" : "OFF").color(Pal.accent));
      });
    }
    .setAnno("console");


    /**
     * Toggles core invincibility.
     * @global
     * @return {void}
     */
    __cinv = function thisFun() {
      if(!__CHECK_CHEAT_STATE__()) return;
      thisFun.isOn = !thisFun.isOn;
      Time.run(2.0, () => {
        console.log("[LOVEC] Core invincibility: " + (thisFun.isOn ? "ON" : "OFF").color(Pal.accent));
      });
    }
    .setProp({
      isOn: (function() {
        Events.run(Trigger.update, () => {
          if(__cinv.isOn) Vars.player.team().data().cores.each(ob => ob.iframes = Math.max(ob.iframes, 60.0));
        });
        return false;
      })(),
    })
    .setAnno("console");


  }));
