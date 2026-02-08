/*
  ========================================
  Section: Definition
  ========================================
*/


  // Enable console
  Core.settings.put("console", true);


  // Log Lovec version in case that someone sends me a crash log from a very outdated version
  Log.info("[LOVEC] Loaded Lovec version: " + Vars.mods.locateMod("lovec").meta.version);


  // Load global scripts before everything
  (function() {
    let findGlbScr = mod => {
      let dir = mod.root.child("scripts");
      if(!dir.exists()) return null;
      let fiSeq = dir.findAll(fi => fi.name() === "globalScript.js");
      return fiSeq.size === 0 ? null : fiSeq.get(0);
    };
    let runGlbScr = mod => {
      let fi = findGlbScr(mod);
      if(fi == null) return;
      try {
        Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, fi.readString(), fi.name(), 0);
      } catch(err) {
        Log.err("[LOVEC] Error loading global script for " + mod.meta.name + ":\n" + err);
      };
    };

    // Lovec globalScript.js should always get loaded first
    runGlbScr(Vars.mods.locateMod("lovec"));
    Vars.mods.eachEnabled(mod => {
      if(mod.meta.name === "lovec") return;
      runGlbScr(mod);
    });

    // Initialize some global objects
    JAVA.init();
    MUSIC_HANDLER.init();
    POS_CONFIG_HANDLER.init();
  })();


  /* <---------- import ----------> */


  // Keep these at top! The order matters!
  const TP_error = require("lovec/tp/TP_error");
  const TP_log = require("lovec/tp/TP_log");
  const RUN_methodExt = require("lovec/run/RUN_methodExt");
  const TP_anno = require("lovec/tp/TP_anno");
  const RUN_methodPostExt = require("lovec/run/RUN_methodPostExt");
  const RUN_globalInternal = require("lovec/run/RUN_globalInternal");
  const TP_db = require("lovec/tp/TP_db");
  const TP_shader = require("lovec/tp/TP_shader");
  const TP_cacheLayer = require("lovec/tp/TP_cacheLayer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const PARAM = require("lovec/glb/GLB_param");
  const SAVE = require("lovec/glb/GLB_save");
  const VAR = require("lovec/glb/GLB_var");


  const RUN_event = require("lovec/run/RUN_event");
  const RUN_input = require("lovec/run/RUN_input");
  const RUN_memMonitor = require("lovec/run/RUN_memMonitor");
  const RUN_render = require("lovec/run/RUN_render");
  const RUN_rule = require("lovec/run/RUN_rule");


  const CLS_dragButton = require("lovec/cls/ui/CLS_dragButton");


  const MDL_backend = require("lovec/mdl/MDL_backend");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_file = require("lovec/mdl/MDL_file");
  const MDL_json = require("lovec/mdl/MDL_json");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_util = require("lovec/mdl/MDL_util");


  const TP_ability = require("lovec/tp/TP_ability");
  const TP_ai = require("lovec/tp/TP_ai");
  const TP_cons = require("lovec/tp/TP_cons");
  const TP_dial = require("lovec/tp/TP_dial");
  const TP_dialFlow = require("lovec/tp/TP_dialFlow");
  const TP_drawer = require("lovec/tp/TP_drawer");
  const TP_keyBind = require("lovec/tp/TP_keyBind");
  const TP_setting = require("lovec/tp/TP_setting");
  const TP_sortF = require("lovec/tp/TP_sortF");
  const TP_stat = require("lovec/tp/TP_stat");


  const DB_env = require("lovec/db/DB_env");
  const DB_misc = require("lovec/db/DB_misc");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  // Keep this at bottom!
  const RUN_global = require("lovec/run/RUN_global");


  /* <---------- load ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/




  MDL_util.localizeModMeta("lovec");




  MDL_event._c_onInit(() => {


    // Initialize game window title
    MDL_backend.setWinTitle(null, "[$1][$2]".format(fetchSetting("misc-title-name"), !fetchSetting("misc-title-map") ? "" : ": menu"));


    // Map reading fallback addition
    DB_misc.db["block"]["migration"].forEachRow(2, (nm_f, nm_t) => SaveVersion.fallback.put(nm_f, nm_t));


    // Set up ore dictionary, EXPERIMENTAL!
    if(PARAM.modded && fetchSetting("load-ore-dict")) (function() {
      Log.info("[LOVEC] " + "Ore dictionary".color(Pal.accent) + " is enabled.");
      if(!fetchSetting("load-ore-dict-def")) Log.info("[LOVEC] Skipped default lists for ore dictionary.");

      let dir = MDL_file.sharedData.child("ore-dict").child("default");
      let verCur = fetchMod("lovec").meta.version;
      let oreDict = global.lovecUtil.db.oreDict;
      // Create default files
      if(!dir.exists() || dir.list().length === 0 || (function() {
        let fi = dir.child("meta.json");
        if(!fi.exists()) return true;
        let jsonVal = MDL_json.parse(fi);

        return MDL_json.fetch(jsonVal, "version") !== verCur;
      })()) {
        DB_misc.db["recipe"]["oreDictDef"].forEachRow(2, (nmRs, arr) => {
          let fi = dir.child(nmRs + ".csv");
          MDL_file._w_csv(fi, arr, 1);
        });
        MDL_json.write(dir.child("meta.json"), {
          version: verCur,
        });
        MDL_file._w_txt(dir.child("README.txt"), "Do not put files here, which may get overwritten!\nCustomized lists should be in ./saves/mods/data/sharedData/ore-dict!");
      };

      let fiSeq = dir.parent().findAll(fi => fi.extension() === "csv" && (fetchSetting("load-ore-dict-def") ? true : fi.parent() !== dir));
      fiSeq.each(fi => {
        let ct = Vars.content.byName(fi.nameWithoutExtension());
        if(ct == null) return;
        let arr = MDL_file._r_csv(fi);
        arr.forEachFast(nmRs => {
          let rs = Vars.content.byName(nmRs);
          if(rs == null) return;
          oreDict.put(rs, ct);
        });
      });

      Vars.content.items().each(itm => {
        let itmRedir = oreDict.get(itm);
        if(itmRedir == null) return;
        itm.stats.add(fetchStat("lovec", "spec-oredict"), newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_ctRow(tb, itmRedir);
        }));
        itmRedir.shownPlanets.addAll(itm.shownPlanets);
        itmRedir.databaseTabs.addAll(itm.databaseTabs);
      });
      Vars.content.liquids().each(liq => {
        let liqRedir = oreDict.get(liq);
        if(liqRedir == null) return;
        liq.stats.add(fetchStat("lovec", "spec-oredict"), newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_ctRow(tb, liqRedir);
        }));
        liqRedir.shownPlanets.addAll(liq.shownPlanets);
        liqRedir.databaseTabs.addAll(liq.databaseTabs);
      });

      Vars.content.blocks().each(blk => {
        blk.requirements.forEachFast(itmStack => {
          itmStack.item = oreDict.get(itmStack.item, itmStack.item);
        });
        Vars.content.planets().each(pla => pla.accessible && pla.isLandable(), pla => {
          // No {every} here, or too many blocks hidden
          if(blk.requirements.some(itmStack => itmStack.item.isOnPlanet(pla))) blk.shownPlanets.add(pla);
        });
        blk.databaseTabs.addAll(blk.shownPlanets);

        if(blk.itemDrop != null) blk.itemDrop = oreDict.get(blk.itemDrop, blk.itemDrop);
        if(blk.liquidDrop != null) blk.liquidDrop = oreDict.get(blk.liquidDrop, blk.liquidDrop);

        blk.consumers.forEachFast(cons => {
          let arr = DB_misc.db["recipe"]["oreDictConsSetter"];
          let dictCaller = null;
          let i = 0, iCap = arr.iCap();
          while(i < iCap) {
            let cls = arr[i];
            if(cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) {
            dictCaller(blk, cons, oreDict);
            cons.apply(blk);
          };
        });

        (function() {
          let arr = DB_misc.db["recipe"]["oreDictProdSetter"];
          let dictCaller = null;
          let i = 0, iCap = arr.iCap();
          while(i < iCap) {
            let cls = arr[i];
            if(blk instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, oreDict);
        })();
      });
    })();


  }, 42110360);




  MDL_event._c_onLoad(() => {


    // Something
    if(!Vars.headless && PARAM.modded && !fetchSetting("load-vanilla-flyer")) {
      try {
        Reflect.set(MenuRenderer, Reflect.get(Vars.ui.menufrag, "renderer"), "flyerType", Vars.content.unit(DB_misc.db["mod"]["menuFlyer"].readRand()));
      } catch(err) {
        Log.err("[LOVEC] Failed to modify the menu scene:\n" + err);
      };
    };


    // Load extra sounds
    if(!Vars.headless) {
      DB_misc.db["mod"]["extraSound"].forEachFast(seStr => Vars.tree.loadSound(seStr));
      Time.run(3.0, () => {
        if(PARAM.secret_legacySound) {
          try {
            Vars.content.units().each(utp => {
              if(utp.deathSound === Sounds.unitExplode1 || utp.deathSound === Sounds.unitExplode2 || utp.deathSound === Sounds.unitExplode3) {
                utp.deathSound = fetchSound("legacy-bang");
              };
            });
            Vars.content.blocks().each(blk => {
              if(blk.placeSound === Sounds.blockPlace1 || blk.placeSound === Sounds.blockPlace2 || blk.placeSound === Sounds.blockPlace3) {
                blk.placeSound = fetchSound("legacy-place");
              };
              if(blk.breakSound === Sounds.blockBreak1 || blk.breakSound === Sounds.blockBreak2 || blk.breakSound === Sounds.blockBreak3) {
                blk.breakSound = fetchSound("legacy-break");
              };
              if(
                blk.destroySound === Sounds.blockExplode1 || blk.destroySound === Sounds.blockExplode1Alt || blk.destroySound === Sounds.blockExplode2 || blk.destroySound === Sounds.blockExplode2Alt || blk.destroySound === Sounds.blockExplode3
                  || blk.destroySound === Sounds.blockExplodeElectric || blk.destroySound === Sounds.blockExplodeElectricBig
                  || blk.destroySound === Sounds.blockExplodeExplosive || blk.destroySound === Sounds.blockExplodeExplosiveAlt
                  || blk.destroySound === Sounds.blockExplodeFlammable
                  || blk.destroySound === Sounds.blockExplodeWall
              ) {
                blk.destroySound = fetchSound("legacy-boom");
              };
            });
          } catch(err) {
            Log.err("[LOVEC] Failed to load legacy sounds:\n" + err);
          };
        };
        if(PARAM.secret_fireInTheHole) {
          let pitchBase;
          let fireInTheHole = wp => {
            wp.shootSound = fetchSound("se-meme-fith");
            pitchBase = Mathf.lerp(1.8, 0.5, Interp.pow2Out.apply(Mathf.clamp(wp.reload / 100.0)));
            wp.soundPitchMin = pitchBase - 0.1;
            wp.soundPitchMax = pitchBase + 0.1;
          };
          Vars.content.units().each(utp => {
            utp.deathSound = fetchSound("se-meme-fith");
            utp.weapons.each(wp => !wp.noAttack, wp => fireInTheHole(wp));
          });
          Vars.content.blocks().each(blk => {
            blk.destroySound = fetchSound("se-meme-fith");
            if(blk instanceof Turret) {
              fireInTheHole(blk);
            };
          });
        };
        Core.settings.put("lovec-misc-fire-in-the-hole", PARAM.secret_fireInTheHole);
      });
    };


    // Load sector icons
    if(!Vars.headless) {
      Vars.content.sectors().each(sec => {
        let reg = Core.atlas.find(sec.name + "-full", Core.atlas.find(sec.name + "-icon", Core.atlas.find(sec.name)));
        if(!reg.found()) return;
        sec.uiIcon = sec.fullIcon = reg;
      });
    };


    // Set up name colors
    if(!Vars.headless && fetchSetting("load-colored-name")) {
      Core.app.post(() => {
        let fetchColor = rs => {
          let tmp = (rs.color.r + rs.color.g + rs.color.b) / 3.0;
          return tmp < 0.1 ?
            Tmp.c1.set(Color.white) :
            Tmp.c1.set(rs.color).mul(tmp < 0.45 ? VAR.ct_colorMtpHigh : VAR.ct_colorMtp);
        };

        VARGEN.rss.forEachFast(rs => rs.localizedName = rs.localizedName.color(fetchColor(rs)));
        Object._it(VARGEN.factions, (faction, cts) => cts.forEachFast(ct => ct.localizedName = ct.localizedName.color(MDL_content._factionColor(faction))));
      });
    };


    // Set up recipe dictionary stat
    Time.run(5.0, () => {
      VARGEN.rss.concat(VARGEN.payMatBlks).concat(VARGEN.buildaleUtps).forEachFast(ct => {
        ct.stats.add(fetchStat("lovec", "spec-fromto"), newStatValue(tb => {
          tb.row();
          MDL_table.__btnSmall(tb, "?", () => fetchDialog("rcDict").ex_show(ct.localizedName, ct)).left().padLeft(28.0).row();
        }));
        VARGEN.rcDictCts.push(ct);
      });
    });


    // Set up node root names
    if(!Vars.headless) {
      TechTree.roots.each(rt => {
        let nmCt = DB_env.db["nodeRootNameMap"].read(rt.name);
        if(nmCt != null) {
          let ct = MDL_content._ct(nmCt, null, true);
          if(ct != null) rt.name = ct.localizedName;
        };
      });
    };


    // Set up status effects
    (function() {
      // Robot-only status
      DB_status.db["group"]["robotOnly"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEachCond(sta => sta != null, sta => {
        sta.stats.add(fetchStat("lovec", "sta-robotonly"), true);
        VARGEN.bioticUtps.forEachFast(utp => utp.immunities.add(sta));
      });
      // Oceanic status
      DB_status.db["group"]["oceanic"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).forEachCond(sta => sta != null, sta => {
        VARGEN.navalUtps.forEachFast(utp => utp.immunities.add(sta));
      });
      // Missile immunities
      DB_status.db["group"]["missileImmune"].map(nmSta => MDL_content._ct(nmSta, "sta", true)).concat(VARGEN.deathStas).forEachCond(sta => sta != null, sta => {
        VARGEN.missileUtps.forEachFast(utp => utp.immunities.add(sta));
      });
    })();


    // Set up faction
    (function() {
      let setFaction = ct => {
        if(MDL_content._faction(ct) !== "none") ct.stats.add(fetchStat("lovec", "spec-faction"), newStatValue(tb => {
          tb.row();
          MDL_table.setDisplay_faction(tb, ct);
        }));
      };
      Vars.content.blocks().each(blk => setFaction(blk));
      Vars.content.units().each(utp => setFaction(utp));
    })();


    // Set up planet rules
    DB_env.db["map"]["rule"]["campaignRule"].forEachRow(2, (nmPla, ruleSetter) => {
      let pla = MDL_content._ct(nmPla, "pla");
      if(pla == null) return;
      let campaignRules = new CampaignRules();
      ruleSetter(campaignRules);
      pla.campaignRules = campaignRules;
    });
    DB_env.db["map"]["rule"]["planetRule"].forEachRow(2, (nmPla, ruleSetter) => {
      let pla = MDL_content._ct(nmPla, "pla");
      if(pla == null) return;
      pla.ruleSetter = cons(ruleSetter);
    });


    // Initialize some settings
    (function() {
      Core.settings.put("lovec-window-show", true);
    })();


    // Add draggable button to the scene
    if(!Vars.headless) {
      new CLS_dragButton().add();
    };


    // Screw it
    if(!PARAM.modded && fetchMod("projreind") != null) {
      throw new Error("PARAM.modded is broken again, WTF D:");
    };


  }, 12563333);




  MDL_event._c_onWorldLoad(() => {


    Time.run(240.0, () => {
      if(Core.settings.getBool("lovec-misc-secret-code-crashed", false)) {
        global.lovec.trigger.secretCodeCrash.fire();
      };
    });


  }, 20119980);
