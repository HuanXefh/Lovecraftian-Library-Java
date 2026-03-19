/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_materialFloor");
  const INTF = require("lovec/temp/intf/INTF_ENV_dynamicSizeVent");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      if(blk.itemDrop == null) {
        blk.itemDrop = blk.parent.itemDrop;
        blk.playerUnmineable = blk.parent.playerUnmineable;
      };
    };

    switch(blk.ventRs) {
      case "none" :
        // Do nothing
        break;

      case "fire" :
        blk.effect = EFF.fireExplodeSmog;
        blk.effectSpacing = 4.0;
        MDL_content.rename(
          blk,
          MDL_bundle._term("lovec", "fire") + MDL_text._space() + MDL_bundle._term("lovec", "vent") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
        );
        break;

      default :
        blk.rsDrop = MDL_content._ct(blk.ventRs, "rs");
        if(blk.rsDrop != null) {
          blk.effect = TP_effect._ventSmog({color: blk.rsDrop.color});
          blk.effectSpacing = 20.0;
          MDL_content.rename(
            blk,
            blk.rsDrop.localizedName + MDL_text._space() + MDL_bundle._term("lovec", "vent") + MDL_text._space() + "(" + blk.parent.localizedName + ")",
          );
        };
    };
  };


  function comp_onVentUpdate(blk, t, isBlocked) {
    if(blk.ventRs === "fire" && Mathf.chance(0.003)) Damage.createIncend(t.worldx() + blk.offDraw, t.worldy() + blk.offDraw, blk.ventSize * Vars.tilesize * 0.65, 1);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Steam vents with varied size, will load parameters from `blk.parent`.
   * Vents should always be loaded after the parent floors!
   * <br> Special values for {@link ENV_vent#ventRs}:
   * <br> "none" - This vent is only for decoration.
   * <br> "fire" - Turns the vent into a fire vent.
   * <br> <NAMEGEN>
   * @class ENV_vent
   * @extends ENV_materialFloor
   * @extends INTF_ENV_dynamicSizeVent
   */
  module.exports = newClass().extendClass(PARENT, "ENV_vent").implement(INTF).initClass()
  .setParent(SteamVent)
  .setTags("blk-env", "blk-vent")
  .setParam({


    /**
     * <PARAM>: Resource (?) produced from the vent, usually a gas. Has special values.
     * @memberof ENV_vent
     * @instance
     */
    ventRs: "none",


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENV_vent
     * @instance
     */
    rsDrop: null,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @memberof ENV_vent
     * @instance
     * @param {Tile} t
     * @param {boolean} isBlocked
     * @return {void}
     */
    ex_onVentUpdate: function(t, isBlocked) {
      comp_onVentUpdate(this, t, isBlocked);
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * @memberof ENV_vent
     * @instance
     * @return {Liquid|null}
     */
    ex_getRsDrop: function() {
      return this.rsDrop;
    }
    .setProp({
      noSuper: true,
    }),


  });
