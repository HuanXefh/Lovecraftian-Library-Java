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


    /** @type {Unit|null} */
    let unitPlayer = null;
    /** @type {Tile|null} */
    let tMouse = null;


    /**
     * @param {Unit|null} unitPlayer
     * @param {Tile|null} tMouse
     * @return {void}
     */
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




    if(!Vars.headless) {
        MDL_event.onUpdate(() => {

          unitPlayer = Vars.player.unit();
          tMouse = LCPos.getTileMouse();

          updateKeybind(unitPlayer, tMouse);

        });
    };
