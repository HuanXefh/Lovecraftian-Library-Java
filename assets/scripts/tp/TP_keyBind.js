/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new key bindings.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");


  /* <---------- auxiliary ----------> */


  function toggleSetting(nmCfg) {
    Core.settings.put("lovec-" + nmCfg, !fetchSetting(nmCfg));
    global.lovec.param.forceLoadParam();
  };


  /* <---------- base ----------> */


  newKeyBind(
    "lovec-setting-toggle-win", KeyCode.semicolon, "lovec",
    unit_pl => toggleSetting("window-show"),
  );


  newKeyBind(
    "lovec-setting-toggle-unit-stat", KeyCode.unset, "lovec",
    unit_pl => toggleSetting("unit0stat-show"),
  );


  newKeyBind(
    "lovec-setting-toggle-damage-display", KeyCode.unset, "lovec",
    unit_pl => toggleSetting("damagedisplay-show"),
  );


  /* <---------- modded ----------> */


  if(PARAM.modded) {


    newKeyBind(
      "lovec-player-drop-loot", KeyCode.l, "lovec",
      unit_pl => global.lovec.db_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-drop-loot").clickScr(),
    );


    newKeyBind(
      "lovec-player-take-loot", KeyCode.k, "lovec",
      unit_pl => {global.lovec.db_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-take-loot").clickScr()},
    );


  };
