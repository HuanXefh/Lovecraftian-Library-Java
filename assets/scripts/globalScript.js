/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * globalScript.js is run BEFORE Lovec is loaded, and NOT in STRICT MODE. Don't explicitly {require} anything!
   * This is mostly intended for console and some generic methods.
   * For your own mod, simply create another globalScript.js in your "scripts" folder, it will be automatically loaded.
   * Beware of naming conflict!
   * ---------------------------------------- */


/*
  ========================================
  Section: Pre-load
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods defined here can be used anywhere, like {extend} and {prov}.
   * You can define more global methods likewise in your own globalScript.js.
   * Better use a prefix for compatibility.
   *
   * If you need temporary variables here, don't define them directly with something like {let a = 0.0}.
   * Any variables defined here are in the global scope, and will make its way to the console.
   * You should use {(function() {...})()} and define them inside the immediate function call.
   * ----------------------------------------
   * IMPORTANT:
   *
   * {RUN_methodExt} is not run yet, call native methods only!
   * Well seems that I'm the only one possible to screw it...
   * ---------------------------------------- */


  /* <---------- base ----------> */


  CONTEXT = Packages.rhino.Context.getContext();
  SCOPE = Vars.mods.scripts.scope;


  /* ----------------------------------------
   * NOTE:
   *
   * Evaluates the given string in global scope.
   * ---------------------------------------- */
  globalEval = function(scrStr) {
    Vars.mods.scripts.context.evaluateString(SCOPE, scrStr, "globalEval_" + globalEval.ind + ".js", 0);
    globalEval.ind++;
  };
  globalEval.ind = 0;


  /* ----------------------------------------
   * NOTE:
   *
   * Requires a JS file (as Arc Fi instance), which will be run in global scope.
   * ---------------------------------------- */
  globalRequire = function(nmMod, fiGetter) {
    let fi = fiGetter(Vars.mods.locateMod(nmMod).root);
    if(fi == null || !fi.exists() || fi.extension() !== "js") throw new Error("Failed to require a script in global script for [$1]! [$2] is not a valid .js file.".format(nmMod, fi));

    Vars.mods.scripts.context.evaluateString(SCOPE, fi.readString(), fi.name(), 0);
  };


  /* <---------- class & package ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to get Java classes by path, e.g. "aquarion.AquaItems" from Aquarion.
   * Will return {null} if not found.
   * Do not include this in main loops!
   * ---------------------------------------- */
  fetchClass = function(nmCls, suppressWarning) {
    let cls;
    try {
      cls = Packages.rhino.NativeJavaClass(
        Vars.mods.scripts.scope,
        java.net.URLClassLoader(
          [Vars.mods.getMod("lovec").file.file().toURI().toURL()],
          Vars.mods.mainLoader(),
        ).loadClass(nmCls),
      );
    } catch(err) {
      cls = null;
      if(!suppressWarning) Log.warn("[LOVEC] Failed to fetch class:\n" + err);
    };

    return cls;
  };


  // Common packages
  com = Packages.com;
  net = Packages.net;
  org = Packages.org;
  arc = Packages.arc;
  mdt = Packages.mindustry;
  rhino = Packages.rhino;


  // Java
  Pattern = java.util.regex.Pattern;
  Matcher = java.util.regex.Matcher;


  // LWJGL
  SDLVideo = org.lwjgl.sdl.SDLVideo;


  // Java class storage
  JAVA = {


    // Will be called in main.js of Lovec later, you can push more classes in your global script
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


    // {SomeClass[]} will be created for these classes as "someClass_arr"
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
    runnable: java.lang.Runnable,
    file: java.io.File,


  };


  /* <---------- load ----------> */


  // Lovec Java
  LCDraw = fetchClass("lovec.graphics.LCDraw");
  LCDrawP3D = fetchClass("lovec.graphics.LCDrawP3D");


  // Lovec internal
  LCAnno = {};
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
  ]
  .forEach(nm => {
    globalRequire("lovec", dir => dir.child("scripts").child("run").child("glbScr").child(nm + ".js"));
  });


/*
  ========================================
  Section: Client Load
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods defined here are only intended for console.
   * DO NOT use these in regular coding!
   * ---------------------------------------- */


  Events.run(ClientLoadEvent, () => Core.app.post(() => {


    lovec = global.lovec;
    lovecUtil = global.lovecUtil;


    /* <---------- debug ----------> */


    /* ----------------------------------------
     * NOTE:
     *
     * Used to test some draw function in game quickly.
     * ---------------------------------------- */
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


    CHEAT = {


      /* ----------------------------------------
       * NOTE:
       *
       * Whether cheat is allowed now.
       * I won't ban these for single player, you decide how to play.
       * ---------------------------------------- */
      checkCheatState: function() {
        return Groups.player.size() === 1 && !Vars.net.client();
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Kills your unit or someone's instead.
       * ---------------------------------------- */
      kill: function(nm) {
        if(!CHEAT.checkCheatState()) return;
        let unit = lovec.mdl_pos._unitPlNm(nm);
        if(unit == null) {
          Log.info("[LOVEC] No player found with name [$1].".format(nm));
          return;
        };

        Call.unitDestroy(unit.id);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Infinite resources for factories and so on.
       * ---------------------------------------- */
      toggleCheatProduce: function() {
        if(!CHEAT.checkCheatState()) return;
        let unit = Vars.player.unit();
        if(unit == null) return;

        Vars.state.rules.teams.get(unit.team).cheat = !Vars.state.rules.teams.get(unit.team).cheat;
        Time.run(2.0, () => {
          Log.info("[LOVEC] Cheat production: " + (Vars.state.rules.teams.get(unit.team).cheat ? "ON" : "OFF").color(Pal.accent));
        });
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Literally toggles invincibility.
       * ---------------------------------------- */
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


      /* ----------------------------------------
       * NOTE:
       *
       * Toggles invincibility of cores.
       * ---------------------------------------- */
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


      /* ----------------------------------------
       * NOTE:
       *
       * Changes your team.
       * ---------------------------------------- */
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


      /* ----------------------------------------
       * NOTE:
       *
       * Spawns some unit at your unit.
       * Internal units are banned, which may lead to crash.
       * ---------------------------------------- */
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
