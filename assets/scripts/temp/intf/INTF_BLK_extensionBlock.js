/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.blkTgs.inSituMap(nmBlk => MDL_content._ct(nmBlk, "blk")).pullAll(null);
    if(blk.blkTgs.length === 0) {
      Vars.content.blocks().each(oblk => blk.filterScrTup[0](blk, oblk), oblk => blk.extensionTmpBlks.push(oblk));
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-blktg"), newStatValue(tb => {
      tb.row();
      MDL_table._l_ctLi(tb, blk.blkTgs.length > 0 ? blk.blkTgs : blk.extensionTmpBlks);
    }));
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(checkTupChange(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = blk.ex_checkValidExtension(t, team, rot);
    };

    return thisFun.tmpTup[4];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_findExtensionTs(blk, contArr, tx, ty, rot) {
    contArr.clear();
    !blk.rotate ?
      MDL_pos._tsEdge(Vars.world.tile(tx, ty), blk.size, false, contArr) :
      MDL_pos._tsRot(Vars.world.tile(tx, ty), rot, blk.size, contArr);

    return contArr;
  };


  function comp_ex_checkValidExtension(blk, t, team, rot) {
    return t == null ? false : blk.ex_findExtensionTs(blk, blk.extensionTmpTs, t.x, t.y, rot).some(ot => ot.build != null && ot.build.team === team && blk.filterScrTup[0](blk, ot.build.block));
  };


  function comp_updateTile(b) {
    if(TIMER.secTwo) {
      b.extensionValid = b.block.ex_checkValidExtension(b.tile, b.team, b.rotation);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(!b.extensionValid) b.efficiency = 0.0;
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * This block can only be placed adjacent to some blocks.
     * @class INTF_BLK_extensionBlock
     */
    new CLS_interface("INTF_BLK_extensionBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Used to filter out valid extension. By default, this checks if a block is found in {@link INTF_BLK_extensionBlock#blkTgs}.
         * <br> <ARGS>: blk, oblk.
         * @memberof INTF_BLK_extensionBlock
         * @instance
         */
        filterScrTup: prov(() => [(blk, oblk) => blk.delegee.blkTgs.includes(oblk)]),
        /**
         * <PARAM>: Extension targets.
         * @memberof INTF_BLK_extensionBlock
         * @instance
         */
        blkTgs: prov(() => []),


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_extensionBlock
         * @instance
         */
        extensionTmpBlks: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_extensionBlock
         * @instance
         */
        extensionTmpTs: prov(() => []),


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "true",
      }),


      /**
       * @memberof INTF_BLK_extensionBlock
       * @instance
       * @param {Array|unset} contArr
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {Array<Tile>}
       */
      ex_findExtensionTs: function(contArr, tx, ty, rot) {
        return comp_ex_findExtensionTs(this, contArr, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_BLK_extensionBlock
       * @instance
       * @param {Tile|null} t
       * @param {Team} team
       * @param {number} rot
       * @return {boolean}
       */
      ex_checkValidExtension: function(t, team, rot) {
        return comp_ex_checkValidExtension(this, t, team, rot);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_extensionBlock
     */
    new CLS_interface("INTF_B_extensionBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_extensionBlock
         * @instance
         */
        extensionValid: false,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      /**
       * @memberof INTF_B_extensionBlock
       * @instance
       * @return {void}
       */
      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
