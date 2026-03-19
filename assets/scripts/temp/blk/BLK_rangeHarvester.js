/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
  const INTF = require("lovec/temp/intf/INTF_BLK_rangeAttributeBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_rangeDisplay");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_lootProducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);

    if(blk.overwriteVanillaProp) {
      blk.baseEfficiency = 0.0;
      blk.maxBoost = Number.n8;
    };

    blk.blkR = blk.attrR;

    blk.ex_addLogicGetter(LAccess.range, b => blk.blkR);
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.attrR, StatUnit.blocks);

    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);
    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table._d_attr(tb, blk.attribute);
    }));
  };


  const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    if(checkTupChange(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = MDL_pos._tsRect(t, blk.attrR, blk.size).filter(ot => MDL_attr._sumTs([ot], blk.attribute, blk.attrMode) > 0.0);
    };

    thisFun.tmpTup[3].forEachFast(ot => {
      MDL_draw._d_areaShrink(ot, blk.attrMode === "block" ? ot.block().size : 1, valid);
    });
  }
  .setProp({
    tmpTup: [],
  });


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Attribute crafter with a rectangular range.
     * @class BLK_rangeHarvester
     * @extends BLK_baseHarvester
     * @extends INTF_BLK_rangeAttributeBlock
     * @extends INTF_BLK_rangeDisplay
     * @extends INTF_BLK_lootProducer
     */
    newClass().extendClass(PARENT[0], "BLK_rangeHarvester").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-min", "blk-harv")
    .setParam({


      /**
       * <PARAM>: See {@link BLK_wallHarvester}.
       * @memberof BLK_rangeHarvester
       * @instance
       */
      shouldDropLoot: true,
      /**
       * <PARAM>: See {@link BLK_baseFactory}.
       * @memberof BLK_rangeHarvester
       * @instance
       */
      craftSe: Sounds.unset,


    })
    .setParamAlias([
      "craftEff", "craftEffect", Fx.none,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      /**
       * @override
       * @memberof BLK_rangeHarvester
       * @instance
       * @return {number}
       */
      ex_getCraftTime: function() {
        return this.craftTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_rangeHarvester
     * @extends B_baseHarvester
     * @extends INTF_B_rangeAttributeBlock
     * @extends INTF_B_rangeDisplay
     * @extends INTF_B_lootProducer
     */
    newClass().extendClass(PARENT[1], "B_rangeHarvester").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(AttributeCrafter.AttributeCrafterBuild)
    .setParam({})
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) {
          rd.s();
          this.lootCharge = rd.i();
        };
      },


      /**
       * @override
       * @memberof B_rangeHarvester
       * @instance
       * @return {boolean}
       */
      ex_shouldDropLoot: function() {
        return this.block.delegee.shouldDropLoot;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_rangeHarvester
       * @instance
       * @return {number}
       */
      ex_getCraftTimeCur: function() {
        return this.progress * this.block.craftTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
