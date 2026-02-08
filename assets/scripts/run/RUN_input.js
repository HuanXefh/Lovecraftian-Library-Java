/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles player input.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- base ----------> */


  let
    unit_pl = null,
    t_pl = null;


  function evComp_update_keyBind(unit_pl) {
    if(Core.scene.hasField() || Core.scene.hasDialog()) return;

    let i = 0, iCap = global.lovecUtil.db.keyBindListener.iCap();
    while(i < iCap) {
      if(Core.input.keyTap(global.lovecUtil.db.keyBindListener[i])) {
        global.lovecUtil.db.keyBindListener[i + 1](unit_pl);
      };
      i += 2;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  if(!Vars.headless) MDL_event._c_onUpdate(() => {

    unit_pl = Vars.player.unit();
    t_pl = MDL_pos._tMouse();

    evComp_update_keyBind(unit_pl);

  }, 70216990);
