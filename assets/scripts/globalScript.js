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
   * @return {void}
   */
  globalEval = function(scrStr) {
    Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, "globalEval_" + globalEval.ind + ".js", 0);
    globalEval.ind++;
  };
  globalEval.ind = 0;


  /**
   * Requires a JS file (as {@link Fi}), which will be run in global scope.
   * @global
   * @param {string} nmMod
   * @param {function(Fi): Fi} fiGetter - <ARGS>: modRoot
   * @return {void}
   */
  globalRequire = function(nmMod, fiGetter) {
    let fi = fiGetter(Vars.mods.locateMod(nmMod).root);
    if(fi == null || !fi.exists() || fi.extension() !== "js") throw new Error("Failed to require a script in global script for [$1]! [$2] is not a valid .js file.".format(nmMod, fi));

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
      if(!suppressWarning) Log.warn("[LOVEC] Failed to fetch class:\n" + err);
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


    // `SomeClass[]` will be created for these classes as "someClass_arr"
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


  // Lovec Java
  /** @global */
  LCDraw = fetchClass("lovec.graphics.LCDraw");
  /** @global */
  LCDrawP3D = fetchClass("lovec.graphics.LCDrawP3D");
  /** @global */
  LCRgb = fetchClass("lovec.graphics.LCRgb");
  /** @global */
  LCLerp = fetchClass("lovec.math.LCLerp");
  /** @global */
  LCMathFunc = fetchClass("lovec.math.LCMathFunc");
  /** @global */
  LCRaycast = fetchClass("lovec.math.LCRaycast");
  /** @global */
  LCCheck = fetchClass("lovec.utils.LCCheck");
  /** @global */
  LCFormat = fetchClass("lovec.utils.LCFormat");
  /** @global */
  LCGeneralizer = fetchClass("lovec.utils.LCGeneralizer");


  // Lovec internal
  /** @global */
  LCAnno = {};
  /** @global */
  LCTemp = {};


  [
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
  .forEach(nm => {
    globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child(nm + ".js"));
  });


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
      enabled: false, safe: false,
      xGetter: Function.airZero, yGetter: Function.airZero, radGetter: Function.airZero, colorGetter: Function.airWhite,
      drawF: Function.air,
      reset() {
        DRAW_TEST.enabled = false;
        DRAW_TEST.safe = false;
        DRAW_TEST.xGetter = Function.airZero;
        DRAW_TEST.yGetter = Function.airZero;
        DRAW_TEST.radGetter = Function.airZero;
        DRAW_TEST.colorGetter = Function.airWhite;
        DRAW_TEST.drawF = Function.air;
      },
      toggle(bool) {
        if(bool == null) {
          DRAW_TEST.enabled = !DRAW_TEST.enabled;
        } else {
          DRAW_TEST.enabled = Boolean(bool);
        };
      },
      setGetter(xGetter, yGetter, radGetter, colorGetter) {
        DRAW_TEST.safe = false;
        if(xGetter != null && typeof xGetter === "function") DRAW_TEST.xGetter = xGetter;
        if(yGetter != null && typeof yGetter === "function") DRAW_TEST.yGetter = yGetter;
        if(radGetter != null && typeof radGetter === "function") DRAW_TEST.radGetter = radGetter;
        if(colorGetter != null && typeof colorGetter === "function") DRAW_TEST.colorGetter = colorGetter;
      },
      setGetter_playerPos(radGetter, colorGetter) {
        DRAW_TEST.setGetter(
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().x,
          () => Vars.player.unit() == null ? -9999.0 : Vars.player.unit().y,
          radGetter,
          colorGetter,
        );
      },
      setDrawF(drawF) {
        if(drawF == null || typeof drawF !== "function") return;
        DRAW_TEST.safe = false;
        DRAW_TEST.drawF = drawF;
      },
      draw() {
        if(DRAW_TEST.safe) {
          DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
        } else {
          // Try only once to save memory used
          try {
            DRAW_TEST.drawF(DRAW_TEST.xGetter(), DRAW_TEST.yGetter(), DRAW_TEST.radGetter(), DRAW_TEST.colorGetter());
          } catch(err) {
            DRAW_TEST.reset();
            Log.err("[LOVEC] Failed to implement the draw function: \n" + err);
            return;
          };
          DRAW_TEST.safe = true;
        };
      },
    };


    /* <---------- cheat ----------> */


    /**
     * @global
     */
    CHEAT = {


      /**
       * Whether cheat is allowed now.
       * I won't ban these for single player, you decide how to play.
       * @return {boolean}
       */
      checkCheatState: function() {
        return Groups.player.size() === 1 && !Vars.net.client();
      },


      /**
       * Kills your unit or someone's instead.
       * @param {string|unset} [nm]
       * @return {void}
       */
      kill: function(nm) {
        if(!CHEAT.checkCheatState()) return;
        let unit = lovec.mdl_pos._unitPlNm(nm);
        if(unit == null) {
          Log.info("[LOVEC] No player found with name [$1].".format(nm));
          return;
        };

        Call.unitDestroy(unit.id);
      },


      /**
       * Infinite resources for factories and so on.
       * @return {void}
       */
      toggleCheatProduce: function() {
        if(!CHEAT.checkCheatState()) return;
        let unit = Vars.player.unit();
        if(unit == null) return;

        Vars.state.rules.teams.get(unit.team).cheat = !Vars.state.rules.teams.get(unit.team).cheat;
        Time.run(2.0, () => {
          Log.info("[LOVEC] Cheat production: " + (Vars.state.rules.teams.get(unit.team).cheat ? "ON" : "OFF").color(Pal.accent));
        });
      },


      /**
       * Toggles invincibility of your unit.
       * @return {void}
       */
      toggleInvincible: function() {
        if(!CHEAT.checkCheatState()) return;
        let unit = Vars.player.unit();
        if(unit == null) return;

        unit.hasEffect(StatusEffects.invincible) ?
          unit.unapply(StatusEffects.invincible) :
          unit.apply(StatusEffects.invincible, Number.fMax);
        Time.run(2.0, () => {
          Log.info("[LOVEC] Player invincibility: " + (unit.hasEffect(StatusEffects.invincible) ? "ON" : "OFF").color(Pal.accent));
        });
      },


      /**
       * Toggles invincibility of cores.
       * @return {void}
       */
      toggleCoreInvincible: function thisFun() {
        if(!CHEAT.checkCheatState()) return;

        thisFun.isOn = !thisFun.isOn;
        Time.run(2.0, () => {
          Log.info("[LOVEC] Core invincibility: " + (thisFun.isOn ? "ON" : "OFF").color(Pal.accent));
        });
      }
      .setProp({
        isOn: (function() {
          Events.run(Trigger.update, () => {
            if(CHEAT.toggleCoreInvincible.isOn) Vars.player.team().data().cores.each(ob => ob.iframes = Math.max(ob.iframes, 60.0));
          });
          return false;
        })(),
      }),


      /**
       * Changes your team.
       * @param {string|Team} team
       * @return {void}
       */
      changeTeam: function(team) {
        if(!CHEAT.checkCheatState()) return;
        if(typeof team === "string") {
          try {
            team = Team[team];
          } catch(err) {
            team = null;
          };
        };
        if(!(team instanceof Team)) return;

        Vars.player.team(team);
      },


      /**
       * Spawns some unit at your unit.
       * Internal units are banned, which may lead to crash.
       * @param {UnitTypeGn} utp_gn
       * @return {void}
       */
      spawnUnit: function thisFun(utp_gn) {
        if(!CHEAT.checkCheatState()) return;
        let unit = Vars.player.unit();
        if(unit == null) return;
        if(typeof utp_gn === "string" && utp_gn.equalsAny(thisFun.blacklist)) return;
        let utp = lovec.mdl_content._ct(utp_gn, "utp");

        lovec.mdl_call.spawnUnit_server(unit.x, unit.y, utp, unit.team);
      }
      .setProp({
        blacklist: [],
      }),


    };


  }));
