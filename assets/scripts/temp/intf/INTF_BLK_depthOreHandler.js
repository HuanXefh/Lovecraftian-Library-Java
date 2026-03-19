/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_ex_findPlaceRsIcon(blk, tx, ty, rs) {
    return blk.ex_isMiningDpore(tx, ty, rs) && !blk.ex_anyDporeRevealed(tx, ty, rs) ?
      VARGEN.iconRegs.questionMark :
      rs.uiIcon;
  };


  function comp_ex_findDporesInLinkedTiles(blk, tx, ty, rs) {
    if(blk.skipDepthOreMethod) return Reflect.get(Block, "tempTiles").clear();
    let t = Vars.world.tile(tx, ty);
    if(t == null) return Reflect.get(Block, "tempTiles").clear();

    return t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles")).removeAll(
      ot => (rs instanceof Item || rs === "item") ?
        ((rs !== "item" && ot.overlay().itemDrop !== rs) || !MDL_cond._isDepthOre(ot.overlay())) :
        (!MDL_cond._isDepthLiquid(ot.overlay()) || (rs !== "liquid" && ot.overlay().ex_getRsDrop() !== rs))
    );
  };


  function comp_ex_calcDpLvlReq(blk, tx, ty, rs) {
    let val = 0, tmpVal = 0;
    blk.ex_findDporesInLinkedTiles(tx, ty, rs).each(ot => {
      tmpVal = ot.overlay().delegee.depthLvl;
      if(tmpVal > val) {
        val = tmpVal;
      };
    });
    return val;
  };


  function comp_ex_isMiningDpore(blk, tx, ty, rs) {
    return blk.ex_findDporesInLinkedTiles(tx, ty, rs).size > 0;
  };


  function comp_ex_anyDporeRevealed(blk, tx, ty, rs) {
    return blk.ex_findDporesInLinkedTiles(tx, ty, rs).find(ot => tryFun(ot.overlay().ex_accRevealed, ot.overlay(), true, ot, "read")) != null;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles utility methods related to depth ore.
     * @class INTF_BLK_depthOreHandler
     */
    new CLS_interface("INTF_BLK_depthOreHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Whether to skip methods here.
         * @memberof INTF_BLK_depthOreHandler
         * @instance
         */
        skipDepthOreMethod: false,


      }),


      /**
       * @memberof INTF_BLK_depthOreHandler
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Resource} rs
       * @return {TextureRegion}
       */
      ex_findPlaceRsIcon: function(tx, ty, rs) {
        return comp_ex_findPlaceRsIcon(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof INTF_BLK_depthOreHandler
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Resource} rs
       * @return {Array<Tile>}
       */
      ex_findDporesInLinkedTiles: function(tx, ty, rs) {
        return comp_ex_findDporesInLinkedTiles(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof INTF_BLK_depthOreHandler
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Resource} rs
       * @return {number}
       */
      ex_calcDpLvlReq: function(tx, ty, rs) {
        return comp_ex_calcDpLvlReq(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof INTF_BLK_depthOreHandler
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Resource} rs
       * @return {boolean}
       */
      ex_isMiningDpore: function(tx, ty, rs) {
        return comp_ex_isMiningDpore(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof INTF_BLK_depthOreHandler
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Resource} rs
       * @return {boolean}
       */
      ex_anyDporeRevealed: function(tx, ty, rs) {
        return comp_ex_anyDporeRevealed(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


    }),


    /**
     * @class INTF_B_depthOreHandler
     */
    new CLS_interface("INTF_B_depthOreHandler", {}),


  ];
