/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new settings (and setting categories).
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_settingTerm = require("lovec/cls/util/CLS_settingTerm");


  /* <---------- category ----------> */


  batchCall(CLS_settingTerm, function() {

    this.registerCategory("lovec", "debug", true);
    this.registerCategory("lovec", "visual");
    this.registerCategory("lovec", "misc");

  });


  /* <---------- term ----------> */


  /* internal */


  new CLS_settingTerm("draw0aux-scanner", useScl => Core.settings.getBool("lovec-draw0aux-scanner", true));
  new CLS_settingTerm("window-show", useScl => Core.settings.getBool("lovec-window-show", true));


  /* debug */


  new CLS_settingTerm("test-draw", useScl => Core.settings.getBool("lovec-test-draw", false)).setDialSetter("lovec", "debug", tb => tb.checkPref("lovec-test-draw", false));
  new CLS_settingTerm("test-memory", useScl => Core.settings.getBool("lovec-test-memory", false)).setDialSetter("lovec", "debug", tb => tb.checkPref("lovec-test-memory", false));
  new CLS_settingTerm("test0error-shader", useScl => Core.settings.getBool("lovec-test0error-shader", false)).setDialSetter("lovec", "debug", tb => tb.checkPref("lovec-test0error-shader", false));
  new CLS_settingTerm("load-ore-dict", useScl => Core.settings.getBool("lovec-load-ore-dict", false)).setDialSetter("lovec", "debug", tb => tb.checkPref("lovec-load-ore-dict", false));
  new CLS_settingTerm("load-ore-dict-def", useScl => Core.settings.getBool("lovec-load-ore-dict-def", true)).setDialSetter("lovec", "debug", tb => tb.checkPref("lovec-load-ore-dict-def", true));


  /* visual */


  new CLS_settingTerm("load-colored-name", useScl => Core.settings.getBool("lovec-load-colored-name", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-load-colored-name", true));
  new CLS_settingTerm("draw-wobble", useScl => Core.settings.getBool("lovec-draw-wobble", false)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw-wobble", false));
  new CLS_settingTerm("draw0loot-static", useScl => Core.settings.getBool("lovec-draw0loot-static", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0loot-static", true));
  new CLS_settingTerm("draw0loot-amount", useScl => Core.settings.getBool("lovec-draw0loot-amount", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0loot-amount", true));
  new CLS_settingTerm("draw0tree-alpha", useScl => Core.settings.getInt("lovec-draw0tree-alpha", 10) * (useScl ? 0.1 : 1.0)).setDialSetter("lovec", "visual", tb => tb.sliderPref("lovec-draw0tree-alpha", 10, 0, 10, val => Strings.fixed(val * 10.0, 0) + "%"));
  new CLS_settingTerm("draw0tree-player", useScl => Core.settings.getBool("lovec-draw0tree-player", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0tree-player", true));
  new CLS_settingTerm("draw0aux-bridge", useScl => Core.settings.getBool("lovec-draw0aux-bridge", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-bridge", true));
  new CLS_settingTerm("draw0aux-router", useScl => Core.settings.getBool("lovec-draw0aux-router", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-router", true));
  new CLS_settingTerm("draw0aux-fluid-heat", useScl => Core.settings.getBool("lovec-draw0aux-fluid-heat", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-fluid-heat", true));
  new CLS_settingTerm("draw0aux-furnace-heat", useScl => Core.settings.getBool("lovec-draw0aux-furnace-heat", true)).setDialSetter("lovec", "visual", tb => tb.checkPref("lovec-draw0aux-furnace-heat", true));


  /* misc */


  new CLS_settingTerm("load-vanilla-flyer", useScl => Core.settings.getBool("lovec-load-vanilla-flyer", false)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-load-vanilla-flyer", false));
  new CLS_settingTerm("load-force-modded", useScl => Core.settings.getBool("lovec-load-force-modded", false)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-load-force-modded", false));
  new CLS_settingTerm("load-gen-recolor", useScl => Core.settings.getBool("lovec-load-gen-recolor", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-load-gen-recolor", true));
  new CLS_settingTerm("interval-efficiency", useScl => Core.settings.getInt("lovec-interval-efficiency", 5) * (useScl ? 6.0 : 1.0)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-interval-efficiency", 5, 1, 15, val => Strings.fixed(val * 0.1, 2) + "s"));
  new CLS_settingTerm("draw0aux-extra-info", useScl => Core.settings.getBool("lovec-draw0aux-extra-info", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-draw0aux-extra-info", true));
  new CLS_settingTerm("icontag-flicker", useScl => Core.settings.getBool("lovec-icontag-flicker", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-icontag-flicker", true));
  new CLS_settingTerm("icontag-interval", useScl => Core.settings.getInt("lovec-icontag-interval", 4) * (useScl ? 10.0 : 1.0)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-icontag-interval", 4, 1, 12, val => Strings.fixed(val * 0.33333333, 2) + "s"));
  new CLS_settingTerm("damagedisplay-show", useScl => Core.settings.getBool("lovec-damagedisplay-show", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-damagedisplay-show", true));
  new CLS_settingTerm("damagedisplay-min", useScl => Core.settings.getInt("lovec-damagedisplay-min", 0) * (useScl ? 20.0 : 1.0)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-damagedisplay-min", 0, 0, 50, val => Strings.fixed(val * 20.0, 2)));
  new CLS_settingTerm("unit0stat-show", useScl => Core.settings.getBool("lovec-unit0stat-show", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-show", true));
  new CLS_settingTerm("unit0stat-range", useScl => Core.settings.getBool("lovec-unit0stat-range", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-range", true));
  new CLS_settingTerm("unit0stat-range-alpha", useScl => Core.settings.getInt("lovec-unit0stat-range-alpha", 7) * (useScl ? 0.05 : 1.0)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-unit0stat-range-alpha", 7, 1, 20, val => Strings.fixed(val * 5.0, 0) + "%"));
  new CLS_settingTerm("unit0stat-player", useScl => Core.settings.getBool("lovec-unit0stat-player", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-player", true));
  new CLS_settingTerm("unit0stat-reload", useScl => Core.settings.getBool("lovec-unit0stat-reload", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-reload", true));
  new CLS_settingTerm("unit0stat-missile", useScl => Core.settings.getBool("lovec-unit0stat-missile", false)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-missile", false));
  new CLS_settingTerm("unit0stat-build", useScl => Core.settings.getBool("lovec-unit0stat-build", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-build", true));
  new CLS_settingTerm("unit0stat-mouse", useScl => Core.settings.getBool("lovec-unit0stat-mouse", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0stat-mouse", true));
  new CLS_settingTerm("unit0stat-style", useScl => Core.settings.getInt("lovec-unit0stat-style", 1)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-unit0stat-style", 1, 1, 3, val => Strings.fixed(val, 0)));
  new CLS_settingTerm("unit0remains-lifetime", useScl => Core.settings.getInt("lovec-unit0remains-lifetime", 36) * (useScl ? 300.0 : 1.0)).setDialSetter("lovec", "misc", tb => tb.sliderPref("lovec-unit0remains-lifetime", 36, 0, 120, val => Strings.fixed(val * 5.0, 0) + "s"));
  new CLS_settingTerm("unit0remains-build", useScl => Core.settings.getBool("lovec-unit0remains-build", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-unit0remains-build", true));
  new CLS_settingTerm("misc-title-name", useScl => Core.settings.getString("lovec-misc-title-name", Vars.appName)).setDialSetter("lovec", "misc", tb => tb.textPref("lovec-misc-title-name", Vars.appName));
  new CLS_settingTerm("misc-title-map", useScl => Core.settings.getBool("lovec-misc-title-map", true)).setDialSetter("lovec", "misc", tb => tb.checkPref("lovec-misc-title-map", true));
  new CLS_settingTerm("misc-secret-code", useScl => Core.settings.getString("lovec-misc-secret-code", "")).setDialSetter("lovec", "misc", tb => tb.areaTextPref("lovec-misc-secret-code", ""));
