/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Some universal parameters (for settings mostly), only updated every several seconds.
   * @module lovec/glb/GLB_param
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  let
    updateSuppressCd = 0, updateSuppressCooldown = 300,
    unitPlayer = null,
    secretCode = "",
    shouldLoadParam = true;


  /**
   * Forces all parameters to get immediately updated.
   * @return {void}
   */
  const forceLoadParam = function() {
    shouldLoadParam = true;
  };
  exports.forceLoadParam = forceLoadParam;


/*
  ========================================
  Section: Application
  ========================================
*/




  exports.MODDED = (function() {
    let cond1 = Core.settings.getBool("load-force-modded", false);
    let cond2 = DB_misc.db["mod"]["lovecMod"].some(nmMod => fetchMod(nmMod) != null);
    if(cond1 && !cond2) LOG_HANDLER.log("forceModded");

    return cond1 || cond2;
  })();
  exports.UNIT_REMAINS_LIFETIME = 0.0;




  MDL_event._c_onWorldLoad(() => {

    Time.run(5.0, () => forceLoadParam());

  }, 44492271);




  MDL_event._c_onUpdate(() => {


    updateSuppressCd--;
    exports.UPDATE_SUPPRESSED = updateSuppressCd > 0;
    exports.UPDATE_DEEP_SUPPRESSED = updateSuppressCd > -updateSuppressCooldown;


    if(TIMER.paramGlobal || shouldLoadParam) {


      // Param load
      unitPlayer = Vars.player.unit();
      secretCode = fetchSetting("misc-secret-code");
      shouldLoadParam = false;


      /* <---------- param ----------> */


      exports.PLANET_CURRENT = global.lovecUtil.fun._plaCur();
      exports.MAP_CURRENT = global.lovecUtil.fun._mapCur();
      exports.IS_CAVE_MAP = DB_env.db["group"]["map"]["cave"].includes(module.exports.mapCur);
      exports.GLOBAL_HEAT = global.lovecUtil.fun._glbHeat();


      /* <---------- setting ----------> */


      exports.ENABLE_TEST_DRAW = fetchSetting("test-draw");


      exports.SHOULD_DRAW_WOBBLE = fetchSetting("draw-wobble");
      exports.SHOULD_DRAW_STATIC_LOOT = fetchSetting("draw0loot-static");
      exports.SHOULD_DRAW_LOOT_AMOUNT = fetchSetting("draw0loot-amount");
      exports.TREE_ALPHA = (Groups.player.size() > 1) ? 1.0 : fetchSetting("draw0tree-alpha", true);
      exports.SHOULD_CHECK_TREE_DISTANCE = fetchSetting("draw0tree-player") && unitPlayer != null && MDL_cond._isCoverable(unitPlayer);
      exports.SHOULD_SHOW_EXTRA_INFO = fetchSetting("draw0aux-extra-info");
      exports.SHOULD_DRAW_BRIDGE_LINE = fetchSetting("draw0aux-bridge");
      exports.SHOULD_DRAW_ROUTER_HERESY = fetchSetting("draw0aux-router");
      exports.SHOULD_DRAW_SCANNER_RESULT = fetchSetting("draw0aux-scanner");
      exports.SHOULD_DRAW_FLUID_HEAT = fetchSetting("draw0aux-fluid-heat");
      exports.SHOULD_DRAW_FURNACE_HEAT = fetchSetting("draw0aux-furnace-heat");


      exports.SHOULD_SHOW_FLIKERING_ICON_TAG = fetchSetting("icontag-flicker");
      exports.ICON_TAG_FLICKERING_INTERVAL = fetchSetting("icontag-interval", true);


      exports.SHOULD_DRAW_UNIT_STAT = fetchSetting("unit0stat-show");
      exports.SHOULD_DRAW_UNIT_RANGE = fetchSetting("unit0stat-range");
      exports.UNIT_RANGE_ALPHA = fetchSetting("unit0stat-range-alpha", true);
      exports.SHOULD_DRAW_PLAYER_STAT = fetchSetting("unit0stat-player");
      exports.SHOULD_DRAW_UNIT_RELOAD = fetchSetting("unit0stat-reload");
      exports.SHOULD_DRAW_MISSILE_STAT = fetchSetting("unit0stat-missile");
      exports.SHOULD_DRAW_BUILD_STAT = fetchSetting("unit0stat-build");
      exports.SHOULD_DRAW_UNIT_STAT_NEAR_MOUSE = fetchSetting("unit0stat-mouse");
      exports.UNIT_STAT_STYLE = fetchSetting("unit0stat-style");
      exports.UNIT_REMAINS_LIFETIME = fetchSetting("unit0remains-lifetime", true);
      exports.SHOULD_CREATE_BUILD_REMAINS = fetchSetting("unit0remains-build");


      exports.ENABLE_DAMAGE_DISPLAY = fetchSetting("damagedisplay-show");
      exports.DAMAGE_DISPLAY_THRESHOLD = fetchSetting("damagedisplay-min", true);


      exports.SHOULD_SHOW_WINDOW = fetchSetting("window-show");


      if(secretCode.includes("<crash>")) {
        Core.settings.put("lovec-misc-secret-code", secretCode.replace("<crash>", ""));
        Core.settings.put("lovec-misc-secret-code-crashed", true);
        throw new Error("You definitely know what <crash> means don't you?");
      };
      exports.SECRET_LEGACY_SOUND = secretCode.includesAny("<legacy>");
      exports.SECRET_FITH = secretCode.includesAny("<fire-in-the-hole>", "<fire-in-da-hole>", "<fith>");
      exports.SECRET_METAL_PIPE = secretCode.includesAny("<steel-pipe>", "<metal-pipe>");


    };


  }, 12976533);




  MDL_event._c_onWorldLoad(() => {

    updateSuppressCd = updateSuppressCooldown;

  }, 52647992);
