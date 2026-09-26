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


    /* <------------------------------ base ------------------------------> */


    let
        updateSuppressCd = 0,
        updateSuppressCooldown = 300,
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




    /**
     * @namespace global.lovecUtil.prop
     * @prop {boolean} debug - Whether debug mode is enabled.
     */




    /** @type {boolean} */
    exports.MODDED = (function() {
        let cond1 = Core.settings.getBool("load-force-modded", false);
        let cond2 = DB_misc.db["mod"]["lovecMod"].some(nameMod => fetchMod(nameMod) != null);
        if(cond1 && !cond2) LCLogHandler.log("forceModded");

        return cond1 || cond2;
    })();
    /** @type {boolean} */
    exports.IS_TELEPORTING = false;
    /** @type {number} */
    exports.UNIT_REMAINS_LIFETIME = 0.0;
    /** @type {boolean} */
    exports.SECRET_APRIL = (function() {
        if(Core.settings.getString("lovec-misc-secret-code", "").includes("<april>")) return true;
        let date = new Date();
        return date.getMonth() === 3 && date.getDate() === 1;
    })();




    MDL_event.onWorldLoad(() => {

        Time.run(VAR.delay.worldLoad.loadParam, () => forceLoadParam());

    });




    MDL_event.onUpdate(() => {


        updateSuppressCd--;
        exports.UPDATE_SUPPRESSED = updateSuppressCd > 0;
        exports.UPDATE_DEEP_SUPPRESSED = updateSuppressCd > -updateSuppressCooldown;


        if(TIMER.paramGlobal || shouldLoadParam) {


            // Param load
            unitPlayer = Vars.player.unit();
            secretCode = fetchSetting("misc-secret-code");
            shouldLoadParam = false;


            /* <------------------------------ param ------------------------------> */


            /** @type {string|null} */
            exports.PLANET_CURRENT = global.lovecUtil.fun.getPlaCur();
            /** @type {string|null} */
            exports.MAP_CURRENT = global.lovecUtil.fun.getMapCur();
            /** @type {boolean} */
            exports.IS_SPACE_MAP = (Vars.state.rules.env & Env.space) !== 0;
            /** @type {boolean} */
            exports.IS_CAVE_MAP = DB_env.db["group"]["map"]["cave"].includes(module.exports.MAP_CURRENT);
            /** @type {boolean} */
            exports.IS_NO_BUILD_MAP = DB_env.db["group"]["map"]["noBuild"].includes(module.exports.MAP_CURRENT);
            /** @type {number} */
            exports.GLOBAL_HEAT = global.lovecUtil.fun.calcGlbHeat();


            /* <------------------------------ setting ------------------------------> */


            /** @type {boolean} */
            exports.ENABLE_TEST_DRAW = fetchSetting("test-draw");


            /** @type {boolean} */
            exports.SHOULD_DRAW_WOBBLE = fetchSetting("draw-wobble");
            /** @type {boolean} */
            exports.SHOULD_DRAW_STATIC_LOOT = fetchSetting("draw0loot-static");
            /** @type {boolean} */
            exports.SHOULD_DRAW_LOOT_AMOUNT = fetchSetting("draw0loot-amount");
            /** @type {number} */
            exports.TREE_ALPHA = (Groups.player.size() > 1) ? 1.0 : fetchSetting("draw0tree-alpha", true);
            /** @type {boolean} */
            exports.SHOULD_CHECK_TREE_DISTANCE = fetchSetting("draw0tree-player") && unitPlayer != null && MDL_cond.isUnitCoverable(unitPlayer);
            /** @type {boolean} */
            exports.SHOULD_SHOW_EXTRA_INFO = fetchSetting("draw0aux-extra-info");
            /** @type {boolean} */
            exports.SHOULD_DRAW_BRIDGE_LINE = fetchSetting("draw0aux-bridge");
            /** @type {boolean} */
            exports.SHOULD_DRAW_ROUTER_HERESY = fetchSetting("draw0aux-router");
            /** @type {boolean} */
            exports.SHOULD_DRAW_SCANNER_RESULT = fetchSetting("draw0aux-scanner");
            /** @type {boolean} */
            exports.SHOULD_DRAW_RECIPE_ICON = fetchSetting("draw0aux-recipe-icon");
            /** @type {boolean} */
            exports.SHOULD_DRAW_FLUID_HEAT = fetchSetting("draw0aux-fluid-heat");
            /** @type {boolean} */
            exports.SHOULD_DRAW_FURNACE_HEAT = fetchSetting("draw0aux-furnace-heat");


            /** @type {boolean} */
            exports.SHOULD_SHOW_FLIKERING_ICON_TAG = fetchSetting("icontag-flicker");
            /** @type {number} */
            exports.ICON_TAG_FLICKERING_INTERVAL = fetchSetting("icontag-interval", true);


            /** @type {boolean} */
            exports.SHOULD_DRAW_UNIT_STAT = fetchSetting("unit0stat-show");
            /** @type {boolean} */
            exports.SHOULD_DRAW_UNIT_RANGE = fetchSetting("unit0stat-range");
            /** @type {number} */
            exports.UNIT_RANGE_ALPHA = fetchSetting("unit0stat-range-alpha", true);
            /** @type {boolean} */
            exports.SHOULD_DRAW_PLAYER_STAT = fetchSetting("unit0stat-player");
            /** @type {boolean} */
            exports.SHOULD_DRAW_UNIT_RELOAD = fetchSetting("unit0stat-reload");
            /** @type {boolean} */
            exports.SHOULD_DRAW_MISSILE_STAT = fetchSetting("unit0stat-missile");
            /** @type {boolean} */
            exports.SHOULD_DRAW_BUILD_STAT = fetchSetting("unit0stat-build");
            /** @type {boolean} */
            exports.SHOULD_DRAW_UNIT_STAT_NEAR_MOUSE = fetchSetting("unit0stat-mouse");
            /** @type {number} */
            exports.UNIT_STAT_STYLE = fetchSetting("unit0stat-style");
            /** @type {number} */
            exports.UNIT_REMAINS_LIFETIME = fetchSetting("unit0remains-lifetime", true);
            /** @type {boolean} */
            exports.SHOULD_CREATE_BUILD_REMAINS = fetchSetting("unit0remains-build");


            /** @type {boolean} */
            exports.ENABLE_DAMAGE_DISPLAY = fetchSetting("damagedisplay-show");
            /** @type {number} */
            exports.DAMAGE_DISPLAY_THRESHOLD = fetchSetting("damagedisplay-min", true);


            /** @type {boolean} */
            exports.SHOULD_SHOW_WINDOW = fetchSetting("window-show");


            if(secretCode.includes("<crash>")) {
                Core.settings.put("lovec-misc-secret-code", secretCode.replace("<crash>", ""));
                Core.settings.put("lovec-misc-secret-code-crashed", true);
                throw new Error("You definitely know what <crash> means don't you?");
            };
            /** @type {boolean} */
            exports.SECRET_LEGACY_SOUND = secretCode.includesAny("<legacy>");
            /** @type {boolean} */
            exports.SECRET_FITH = secretCode.includesAny("<fire-in-the-hole>", "<fire-in-da-hole>", "<fith>");
            /** @type {boolean} */
            exports.SECRET_METAL_PIPE = module.exports.SECRET_APRIL || secretCode.includesAny("<steel-pipe>", "<metal-pipe>");


        };


    });




    MDL_event.onWorldLoad(() => {

        updateSuppressCd = updateSuppressCooldown;

    });
