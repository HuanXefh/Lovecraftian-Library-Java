/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;
  const INTF = require("lovec/temp/intf/INTF_ENTITY_unitDurabilityHandler");
  const INTF_A = require("lovec/temp/intf/INTF_ENTITY_tetheredEntity");


  /* <---------- component ----------> */


  function comp_solidity(unit) {
    return extend(EntityCollisions.SolidPred, {
      solid(tx, ty) {
        return (unit.super$solidity() == null ? false : unit.super$solidity().solid(tx, ty)) || (PARAM.IS_CAVE_MAP && EntityCollisions.legsSolid(tx, ty));
      },
    });
  };


  function comp_acceptsItem(unit, itm) {
    return !unit.type.delegee.itmBlacklist.includes(itm.name);
  };


  function comp_validMine(unit, t, checkDst) {
    return t != null
      && !checkTempTag(t.overlay(), "env-dpore")
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
   * @extends INTF_ENTITY_unitDurabilityHandler
   * @extends INTF_ENTITY_tetheredEntity
   */
  module.exports = newClass().extendClass(PARENT, "ENTITY_baseUnitEntity").implement(INTF).implement(INTF_A).initClass()
  .setParent(null)
  .setParam({})
  .setMethod({


    solidity: function() {
      return comp_solidity(this);
    }
    .setProp({
      noSuper: true,
    }),


    acceptsItem: function(itm) {
      return comp_acceptsItem(this, itm);
    }
    .setProp({
      boolMode: "and",
    }),


    validMine: function(t, checkDst) {
      return comp_validMine(this, t, checkDst);
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * @memberof ENTITY_baseUnitEntity
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_writeUnitData: function(dataObj) {

    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * @memberof ENTITY_baseUnitEntity
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_readUnitData: function(dataObj) {

    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


  });
