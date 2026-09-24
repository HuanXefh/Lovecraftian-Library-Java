/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers new settings (and setting categories).
     * @module lovec/tp/TP_setting
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ category ------------------------------> */


    batchCall(CLS_settingTerm, function() {

        this.registerCategory("lovec", "debug", true);
        this.registerCategory("lovec", "visual");
        this.registerCategory("lovec", "misc");

    });


    /* <------------------------------ term ------------------------------> */


    /* internal */


    exports.drawAuxScanner = new CLS_settingTerm("draw0aux-scanner", useScl => Core.settings.getBool("lovec-draw0aux-scanner", true));
    exports.drawAuxRecipeIcon = new CLS_settingTerm("draw0aux-recipe-icon", useScl => Core.settings.getBool("lovec-draw0aux-recipe-icon", false));
    exports.windowShow = new CLS_settingTerm("window-show", useScl => Core.settings.getBool("lovec-window-show", true));


    /* debug */


    exports.testDraw = new CLS_settingTerm("test-draw", useScl => Core.settings.getBool("lovec-test-draw", false)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-test-draw", false));
    exports.testIntfNosuperWarning = new CLS_settingTerm("test-intf-nosuper-warning", useScl => Core.settings.getBool("lovec-test-intf-nosuper-warning", false)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-test-intf-nosuper-warning", false));
    exports.testShowErrorChara = new CLS_settingTerm("test-show-error-chara", useScl => Core.settings.getBool("lovec-test-show-error-chara", false)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-test-show-error-chara", false));
    exports.testErrorShader = new CLS_settingTerm("test0error-shader", useScl => Core.settings.getBool("lovec-test0error-shader", false)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-test0error-shader", false));
    exports.loadOreDict = new CLS_settingTerm("load-ore-dict", useScl => Core.settings.getBool("lovec-load-ore-dict", false)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-load-ore-dict", false));
    exports.loadOreDictDef = new CLS_settingTerm("load-ore-dict-def", useScl => Core.settings.getBool("lovec-load-ore-dict-def", true)).setDialM("lovec", "debug", tb => tb.checkPref("lovec-load-ore-dict-def", true));


    /* visual */


    exports.loadColoredName = new CLS_settingTerm("load-colored-name", useScl => Core.settings.getBool("lovec-load-colored-name", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-load-colored-name", true));
    exports.drawWobble = new CLS_settingTerm("draw-wobble", useScl => Core.settings.getBool("lovec-draw-wobble", false)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw-wobble", false));
    exports.drawLootStatic = new CLS_settingTerm("draw0loot-static", useScl => Core.settings.getBool("lovec-draw0loot-static", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0loot-static", true));
    exports.drawLootAmount = new CLS_settingTerm("draw0loot-amount", useScl => Core.settings.getBool("lovec-draw0loot-amount", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0loot-amount", true));
    exports.drawTreeAlpha = new CLS_settingTerm("draw0tree-alpha", useScl => Core.settings.getInt("lovec-draw0tree-alpha", 10) * (useScl ? 0.1 : 1.0)).setDialM("lovec", "visual", tb => tb.sliderPref("lovec-draw0tree-alpha", 10, 0, 10, val => Strings.fixed(val * 10.0, 0) + "%"));
    exports.drawTreePlayer = new CLS_settingTerm("draw0tree-player", useScl => Core.settings.getBool("lovec-draw0tree-player", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0tree-player", true));
    exports.drawAuxBridge = new CLS_settingTerm("draw0aux-bridge", useScl => Core.settings.getBool("lovec-draw0aux-bridge", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-bridge", true));
    exports.drawAuxRouter = new CLS_settingTerm("draw0aux-router", useScl => Core.settings.getBool("lovec-draw0aux-router", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-router", true));
    exports.drawAuxFluidHeat = new CLS_settingTerm("draw0aux-fluid-heat", useScl => Core.settings.getBool("lovec-draw0aux-fluid-heat", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-fluid-heat", true));
    exports.drawAuxFurnaceHeat = new CLS_settingTerm("draw0aux-furnace-heat", useScl => Core.settings.getBool("lovec-draw0aux-furnace-heat", true)).setDialM("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-furnace-heat", true));


    /* misc */


    exports.loadVanillaFlyer = new CLS_settingTerm("load-vanilla-flyer", useScl => Core.settings.getBool("lovec-load-vanilla-flyer", false)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-load-vanilla-flyer", false));
    exports.loadForceModded = new CLS_settingTerm("load-force-modded", useScl => Core.settings.getBool("lovec-load-force-modded", false)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-load-force-modded", false));
    exports.loadGenRecolor = new CLS_settingTerm("load-gen-recolor", useScl => Core.settings.getBool("lovec-load-gen-recolor", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-load-gen-recolor", true));
    exports.intervalEfficiency = new CLS_settingTerm("interval-efficiency", useScl => Core.settings.getInt("lovec-interval-efficiency", 5) * (useScl ? 6.0 : 1.0)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-interval-efficiency", 5, 1, 15, val => Strings.fixed(val * 0.1, 2) + "s"));
    exports.drawAuxExtraInfo = new CLS_settingTerm("draw0aux-extra-info", useScl => Core.settings.getBool("lovec-draw0aux-extra-info", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-draw0aux-extra-info", true));
    exports.icontagFlicker = new CLS_settingTerm("icontag-flicker", useScl => Core.settings.getBool("lovec-icontag-flicker", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-icontag-flicker", true));
    exports.icontagInterval = new CLS_settingTerm("icontag-interval", useScl => Core.settings.getInt("lovec-icontag-interval", 4) * (useScl ? 10.0 : 1.0)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-icontag-interval", 4, 1, 12, val => Strings.fixed(val * 0.33333333, 2) + "s"));
    exports.damagedisplayShow = new CLS_settingTerm("damagedisplay-show", useScl => Core.settings.getBool("lovec-damagedisplay-show", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-damagedisplay-show", true));
    exports.damagedisplayMin = new CLS_settingTerm("damagedisplay-min", useScl => Core.settings.getInt("lovec-damagedisplay-min", 0) * (useScl ? 20.0 : 1.0)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-damagedisplay-min", 0, 0, 50, val => Strings.fixed(val * 20.0, 2)));
    exports.unitStatShow = new CLS_settingTerm("unit0stat-show", useScl => Core.settings.getBool("lovec-unit0stat-show", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-show", true));
    exports.unitStatRange = new CLS_settingTerm("unit0stat-range", useScl => Core.settings.getBool("lovec-unit0stat-range", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-range", true));
    exports.unitStatRangeAlpha = new CLS_settingTerm("unit0stat-range-alpha", useScl => Core.settings.getInt("lovec-unit0stat-range-alpha", 7) * (useScl ? 0.05 : 1.0)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-unit0stat-range-alpha", 7, 1, 20, val => Strings.fixed(val * 5.0, 0) + "%"));
    exports.unitStatPlayer = new CLS_settingTerm("unit0stat-player", useScl => Core.settings.getBool("lovec-unit0stat-player", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-player", true));
    exports.unitStatReload = new CLS_settingTerm("unit0stat-reload", useScl => Core.settings.getBool("lovec-unit0stat-reload", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-reload", true));
    exports.unitStatMissile = new CLS_settingTerm("unit0stat-missile", useScl => Core.settings.getBool("lovec-unit0stat-missile", false)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-missile", false));
    exports.unitStatBuild = new CLS_settingTerm("unit0stat-build", useScl => Core.settings.getBool("lovec-unit0stat-build", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-build", true));
    exports.unitStatMouse = new CLS_settingTerm("unit0stat-mouse", useScl => Core.settings.getBool("lovec-unit0stat-mouse", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-mouse", true));
    exports.unitStatStyle = new CLS_settingTerm("unit0stat-style", useScl => Core.settings.getInt("lovec-unit0stat-style", 1)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-unit0stat-style", 1, 1, CLS_unitStatDisplayMode.getSize(), val => Strings.fixed(val, 0)));
    exports.unitRemainsLifetime = new CLS_settingTerm("unit0remains-lifetime", useScl => Core.settings.getInt("lovec-unit0remains-lifetime", 36) * (useScl ? 300.0 : 1.0)).setDialM("lovec", "misc", tb => tb.sliderPref("lovec-unit0remains-lifetime", 36, 0, 120, val => Strings.fixed(val * 5.0, 0) + "s"));
    exports.unitRemainsBuild = new CLS_settingTerm("unit0remains-build", useScl => Core.settings.getBool("lovec-unit0remains-build", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-unit0remains-build", true));
    exports.miscEnableWindow = new CLS_settingTerm("misc-enable-window", useScl => Core.settings.getBool("lovec-misc-enable-window", !Core.app.isMobile())).setDialM("lovec", "misc", tb => tb.checkPref("lovec-misc-enable-window", !Core.app.isMobile()));
    exports.miscTitleName = new CLS_settingTerm("misc-title-name", useScl => Core.settings.getString("lovec-misc-title-name", Vars.appName)).setDialM("lovec", "misc", tb => tb.textPref("lovec-misc-title-name", Vars.appName));
    exports.miscTitleMap = new CLS_settingTerm("misc-title-map", useScl => Core.settings.getBool("lovec-misc-title-map", true)).setDialM("lovec", "misc", tb => tb.checkPref("lovec-misc-title-map", true));
    exports.miscSecretCode = new CLS_settingTerm("misc-secret-code", useScl => Core.settings.getString("lovec-misc-secret-code", "")).setDialM("lovec", "misc", tb => tb.areaTextPref("lovec-misc-secret-code", ""));
