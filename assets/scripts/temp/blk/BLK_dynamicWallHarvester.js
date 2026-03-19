/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
  const INTF = require("lovec/temp/intf/INTF_BLK_dynamicAttributeBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.attrRsArr == null) ERROR_HANDLER.throw("nullArgument", "attrRsArr");
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.output);
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.drillSpeed);
  };


  function comp_setBars(blk) {
    blk.removeBar("drillspeed");
    blk.addBar("drillspeed", b => new Bar(
      prov(() => Core.bundle.format("bar.drillspeed", Strings.fixed(b.efficiency * b.timeScale * b.block.ex_getDynaAttrProdSpd(b.delegee.dynaAttrRs), 2))),
      prov(() => Pal.ammo),
      () => b.warmup,
    ));
  };


  function comp_updateTile(b) {
    if(b.dynaAttrRs == null) return;

    b.warmup = Mathf.approachDelta(b.warmup, Number(b.efficiency > 0), 0.025);
    b.totalTime += b.edelta() * b.warmup;

    if(Mathf.chanceDelta(b.block.updateEffectChance * b.warmup * 2.0)) {
      b.dynaAttrTs.forEachFast(ot => {
        if(Mathf.chance(0.5)) b.block.updateEffect.at(
          ot.worldx() + Mathf.range(3.0),
          ot.worldy() + Mathf.range(3.0),
          ot.block().getColor(ot),
        );
      });
    };

    if(b.time += b.edelta() >= b.block.drillTime) {
      b.time %= b.block.drillTime;
      b.ex_dynaAttrCraft();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A wall crafter that outputs something based on highest attribute.
     * This one can output fluids.
     * @class BLK_dynamicWallHarvester
     * @extends BLK_baseHarvester
     * @extends INTF_BLK_dynamicAttributeBlock
     */
    newClass().extendClass(PARENT[0], "BLK_dynamicWallHarvester").implement(INTF[0]).initClass()
    .setParent(WallCrafter)
    .setTags("blk-min", "blk-harv")
    .setParam({


      /**
       * <PARAM>: Liquid production rate, used only if this block produces liquid.
       * @memberof BLK_dynamicWallHarvester
       * @instance
       */
      liqProdRate: 0.1,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>: This is a wall crafter, it should only check wall attributes.
       * @memberof BLK_dynamicWallHarvester
       * @instance
       */
      attrMode: "block",


    })
    .setParamAlias([
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @param {Array|unset} contArr
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {Array<Tile>}
       */
      ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
        return MDL_pos._tsRot(Vars.world.tile(tx, ty), rot, this.size, contArr);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 4,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {number}
       */
      ex_getCraftTime: function() {
        return this.drillTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {number}
       */
      ex_getAttrLimit: function() {
        return this.size;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {number}
       */
      ex_getDynaAttrBaseAmt_itm: function() {
        return this.size;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {number}
       */
      ex_getDynaAttrBaseAmt_liq: function() {
        return this.liqProdRate;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {string}
       */
      ex_getDynaAttrProdTypeStr: function() {
        return "collecting";
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof BLK_dynamicWallHarvester
       * @instance
       * @return {boolean}
       */
      ex_getDynaAttrProdIsWall: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_dynamicWallHarvester
     * @extends B_baseHarvester
     * @extends INTF_B_dynamicAttributeBlock
     */
    newClass().extendClass(PARENT[1], "B_dynamicWallHarvester").implement(INTF[1]).initClass()
    .setParent(WallCrafter.WallCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      shouldConsume: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


    }),


  ];
