/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Steam vents with varied size.
   * Will load parameters from {blk.parent}.
   * Vents should always be loaded after the parent floors!
   *
   * Special values for {blk.ventRs}:
   * "none" - This vent is only for decoration.
   * "fire" - Turns the vent into a fire vent.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/env/ENV_materialFloor");
  const INTF = require("lovec/temp/intf/INTF_ENV_dynamicSizeVent");
  const EFF = require("lovec/glb/GLB_eff");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_text = require("lovec/mdl/MDL_text");


  const TP_effect = require("lovec/tp/TP_effect");


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


  module.exports = newClass().extendClass(PARENT, "ENV_vent").implement(INTF).initClass()
  .setParent(SteamVent)
  .setTags("blk-env", "blk-vent")
  .setParam({
    // @PARAM: Resource of the vent, usually a gas. Has special values.
    ventRs: "none",

    rsDrop: null,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_onVentUpdate: function(t, isBlocked) {
      comp_onVentUpdate(this, t, isBlocked);
    }
    .setProp({
      noSuper: true,
    }),


    ex_getRsDrop: function() {
      return this.rsDrop;
    }
    .setProp({
      noSuper: true,
    }),


  });
