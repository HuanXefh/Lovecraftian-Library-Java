/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles player input.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  let
    unitPlayer = null,
    tMouse = null;


  function updateKeybind(unitPlayer, tMouse) {
    if(Core.scene.hasField() || Core.scene.hasDialog()) return;

    let i = 0, iCap = global.lovecUtil.db.keyBindListener.iCap();
    while(i < iCap) {
      if(Core.input.keyTap(global.lovecUtil.db.keyBindListener[i])) {
        global.lovecUtil.db.keyBindListener[i + 1](unitPlayer, tMouse);
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

    unitPlayer = Vars.player.unit();
    tMouse = MDL_pos._tMouse();

    updateKeybind(unitPlayer, tMouse);

  }, 70216990);
