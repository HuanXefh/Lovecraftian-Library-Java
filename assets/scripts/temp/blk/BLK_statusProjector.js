/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseProjector");
  const INTF = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.suppressable = false;

    blk.blkRad = blk.range;
    blk.staTg = MDL_content._ct(blk.staTg, "sta");
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.repairTime);
    blk.stats.remove(Stat.booster);

    if(blk.staTg != null) blk.stats.add(fetchStat("lovec", "blk0misc-status"), StatValues.content([blk.staTg].toSeq()));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);
    MDL_draw._d_diskExpand(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.range, 1.5, blk.baseColor, 0.3);
  };


  function comp_updateTile(b) {
    if(b.block.delegee.staTg == null) return;

    b.heat = Mathf.lerpDelta(b.heat, b.efficiency > 0.0 ? 1.0 : 0.0, 0.01);
    if(b.heat < 0.01) b.heat = 0.0;
    b.charge += b.heat * b.delta();

    if(b.efficiency > 0.0 && b.timer.get(b.block.timerUse, b.block.useTime)) b.consume();

    if(b.charge > b.block.reload - 0.0001) {
      b.charge = 0.0;

      let rad = b.block.range * b.heat;
      if(rad > 1.0) MDL_pos._it_units(
        b.x, b.y, rad, null,
        ounit => b.block.delegee.filterScrTup[0](b, ounit),
        ounit => ounit.apply(b.block.delegee.staTg, b.block.delegee.staDur),
      );
    };
  };


  function comp_drawSelect(b) {
    MDL_draw._d_diskExpand(b.x, b.y, b.block.range * b.heat, 1.5, b.block.baseColor, 0.3);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A block that periodically applies some status effect on units in range.
     * No optional item input!
     * @class BLK_statusProjector
     * @extends BLK_baseProjector
     * @extends INTF_BLK_radiusDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_statusProjector").implement(INTF[0]).initClass()
    .setParent(MendProjector)
    .setTags("blk-proj", "blk-mend")
    .setParam({


      /**
       * <PARAM>: Status effect to apply.
       * @memberof BLK_statusProjector
       * @instance
       */
      staTg: StatusEffects.none,
      /**
       * <PARAM>: Duration of the applied status effect.
       * @memberof BLK_statusProjector
       * @instance
       */
      staDur: 0.0,
      /**
       * <PARAM>: Filter for target units. You can create effects here.
       * <ARGS>: b, ounit.
       * @memberof BLK_statusProjector
       * @instance
       */
      filterScrTup: prov(() => [Function.airTrue]),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_statusProjector
       * @instance
       * @param {boolean} valid
       * @return {Color}
       */
      ex_getBlkRadColor: function(valid) {
        return this.baseColor;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_statusProjector
     * @extends B_baseProjector
     * @extends INTF_B_radiusDisplay
     */
    newClass().extendClass(PARENT[1], "B_statusProjector").implement(INTF[1]).initClass()
    .setParent(MendProjector.MendBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
