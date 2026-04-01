/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


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


  /**
   * Base template for all unit entities.
   * Unlike blocks, the entity of a unit type is defined as a separate template for more flexibility.
   * @class ENTITY_baseUnitEntity
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_baseUnitEntity").initClass()
  .setParent(null)
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @memberof ENTITY_baseUnitEntity
     * @instance
     */
    unitDurabUsed: 0.0,


  })
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
