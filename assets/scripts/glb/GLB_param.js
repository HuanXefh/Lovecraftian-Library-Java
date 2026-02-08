/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Some universal parameters (for settings mostly), only updated every several seconds.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_env = require("lovec/db/DB_env");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  let
    updateSuppressCd = 0, updateSuppressCooldown = 300,
    unit_pl = null,
    secretCode = "",
    shouldLoadParam = true;


  /* ----------------------------------------
   * NOTE:
   *
   * Forces all parameters to get immediately updated.
   * ---------------------------------------- */
  const forceLoadParam = function() {
    shouldLoadParam = true;
  };
  exports.forceLoadParam = forceLoadParam;


/*
  ========================================
  Section: Application
  ========================================
*/




  // Parameters populated on load
  exports.debug = global.lovecUtil.prop.debug;
  exports.modded = (function() {
    let cond1 = Core.settings.getBool("load-force-modded", false);
    let cond2 = DB_misc.db["mod"]["lovecMod"].some(nmMod => fetchMod(nmMod) != null);
    if(cond1 && !cond2) LOG_HANDLER.log("forceModded");

    return cond1 || cond2;
  })();




  // Settings that cannot be {undefined} when loading
  exports.unitRemainsLifetime = 0.0;




  MDL_event._c_onWorldLoad(() => {

    Time.run(5.0, () => forceLoadParam());

  }, 44492271);




  MDL_event._c_onUpdate(() => {


    updateSuppressCd--;
    exports.updateSuppressed = updateSuppressCd > 0;
    exports.updateDeepSuppressed = updateSuppressCd > -updateSuppressCooldown;


    if(TIMER.paramGlobal || shouldLoadParam) {


      // Param load
      unit_pl = Vars.player.unit();
      secretCode = fetchSetting("misc-secret-code");
      shouldLoadParam = false;


      /* <---------- param ----------> */


      exports.plaCur = global.lovecUtil.fun._plaCur();
      exports.mapCur = global.lovecUtil.fun._mapCur();
      exports.isCaveMap = DB_env.db["group"]["map"]["cave"].includes(module.exports.mapCur);
      exports.glbHeat = global.lovecUtil.fun._glbHeat();


      /* <---------- setting ----------> */


      exports.testDraw = fetchSetting("test-draw");
      exports.enableMemoryMonitor = fetchSetting("test-memory");


      exports.drawWobble = fetchSetting("draw-wobble");
      exports.drawStaticLoot = fetchSetting("draw0loot-static");
      exports.drawLootAmount = fetchSetting("draw0loot-amount");
      exports.treeAlpha = (Groups.player.size() > 1) ? 1.0 : fetchSetting("draw0tree-alpha", true);
      exports.checkTreeDst = fetchSetting("draw0tree-player") && unit_pl != null && MDL_cond._isCoverable(unit_pl);
      exports.showExtraInfo = fetchSetting("draw0aux-extra-info");
      exports.drawBridgeTransportLine = fetchSetting("draw0aux-bridge");
      exports.drawRouterHeresy = fetchSetting("draw0aux-router");
      exports.drawScannerResult = fetchSetting("draw0aux-scanner");
      exports.drawFluidHeat = fetchSetting("draw0aux-fluid-heat");
      exports.drawFurnaceHeat = fetchSetting("draw0aux-furnace-heat");


      exports.flickerIconTag = fetchSetting("icontag-flicker");
      exports.iconTagIntv = fetchSetting("icontag-interval", true);


      exports.drawUnitStat = fetchSetting("unit0stat-show");
      exports.drawUnitRange = fetchSetting("unit0stat-range");
      exports.unitRangeAlpha = fetchSetting("unit0stat-range-alpha", true);
      exports.drawPlayerStat = fetchSetting("unit0stat-player");
      exports.drawUnitReload = fetchSetting("unit0stat-reload");
      exports.drawMissileStat = fetchSetting("unit0stat-missile");
      exports.drawBuildStat = fetchSetting("unit0stat-build");
      exports.drawUnitNearMouse = fetchSetting("unit0stat-mouse");
      exports.unitStatStyle = fetchSetting("unit0stat-style");
      exports.unitRemainsLifetime = fetchSetting("unit0remains-lifetime", true);
      exports.createBuildingRemains = fetchSetting("unit0remains-build");


      exports.displayDamage = fetchSetting("damagedisplay-show");
      exports.damageDisplayThreshold = fetchSetting("damagedisplay-min", true);


      exports.showWindow = fetchSetting("window-show");


      if(secretCode.includes("<crash>")) {
        Core.settings.put("lovec-misc-secret-code", secretCode.replace("<crash>", ""));
        Core.settings.put("lovec-misc-secret-code-crashed", true);
        throw new Error("You definitely know what <crash> means don't you?");
      };
      exports.secret_legacySound = secretCode.includesAny("<legacy>");
      exports.secret_fireInTheHole = secretCode.includesAny("<fire-in-the-hole>", "<fire-in-da-hole>", "<fith>");
      exports.secret_steelPipe = secretCode.includes("<steel-pipe>", "<metal-pipe>");
      exports.secret_revisionFix = secretCode.includes("<revision-fix>");


    };


  }, 12976533);




  MDL_event._c_onWorldLoad(() => {


    updateSuppressCd = updateSuppressCooldown;


  }, 52647992);
