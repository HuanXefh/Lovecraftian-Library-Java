/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new key bindings.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxiliary ----------> */


  function toggleSetting(nmCfg) {
    Core.settings.put("lovec-" + nmCfg, !fetchSetting(nmCfg));
    PARAM.forceLoadParam();
  };


  /* <---------- base ----------> */


  newKeyBind(
    "lovec-setting-toggle-win", KeyCode.semicolon, "lovec",
    (unitPlayer, tMouse) => toggleSetting("window-show"),
  );


  newKeyBind(
    "lovec-setting-toggle-unit-stat", KeyCode.unset, "lovec",
    (unitPlayer, tMouse) => toggleSetting("unit0stat-show"),
  );


  newKeyBind(
    "lovec-setting-toggle-damage-display", KeyCode.unset, "lovec",
    (unitPlayer, tMouse) => toggleSetting("damagedisplay-show"),
  );


  /* <---------- modded ----------> */


  if(PARAM.modded) {


    newKeyBind(
      "lovec-player-drop-loot", KeyCode.l, "lovec",
      (unitPlayer, tMouse) => DB_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-drop-loot").clickScr(),
    );


    newKeyBind(
      "lovec-player-take-loot", KeyCode.k, "lovec",
      (unitPlayer, tMouse) => DB_misc.db["mod"]["dragButton"]["modded"].read("lovec-player-take-loot").clickScr(),
    );


  };
