/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Base template for all unit entities.
   * Unlike blocks, the entity of a unit type is defined as a separate template for more flexibility.
   *
   * Entity templates don't support arguments on build.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- component ----------> */


  function comp_solidity(unit) {
    return extend(EntityCollisions.SolidPred, {
      solid(tx, ty) {
        return (unit.super$solidity() == null ? false : unit.super$solidity().solid(tx, ty)) || (PARAM.isCaveMap && EntityCollisions.legsSolid(tx, ty));
      },
    });
  };


  function comp_validMine(unit, t, checkDst) {
    return t != null
      && !MDL_content._hasTag(t.overlay(), "blk-dpore")
      && (
        !unit.isPlayer() ?
          true :
          !(t.overlay().itemDrop != null ? t.overlay() : (t.block() !== Blocks.air ? t.block() : t.floor())).playerUnmineable
      )
      && unit.super$validMine(t, tryVal(checkDst, true));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setParam({})
  .setMethod({


    solidity: function() {
      return comp_solidity(this);
    }
    .setProp({
      noSuper: true,
    }),


    validMine: function(t, checkDst) {
      return comp_validMine(this, t, checkDst);
    }
    .setProp({
      noSuper: true,
    }),


  });
