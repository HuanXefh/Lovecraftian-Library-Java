/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_multiBlockFactory");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = false;
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table.setAttr(tb, blk.attribute);
    }));
  };


  function comp_setBars(blk) {
    blk.addBar("efficiency", b => new Bar(
      prov(() => Core.bundle.format("bar.efficiency", Math.round(b.delegee.attrEffc * 100.0))),
      prov(() => Pal.lightOrange),
      () => Mathf.clamp(b.delegee.attrEffc),
    ));
    blk.addBar("lovec-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.progress.perc(0))),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.progress, 0.0, 1.0),
    ));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return t != null && blk.ex_getAttrSum(t.x, t.y) > 0.0;
  };


  const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
    let t = Vars.world.tile(tx + blk.holeOffPon.x, ty + blk.holeOffPon.y);
    if(t != null) {
      if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t)) {
        LCPos.getTilesRect(thisFun.tmpTs, t, 5, blk.size);
      };

      thisFun.tmpTs.forEachFast(ot => {
        if(ot.block().attributes.get(blk.attribute) > 0.0) {
          LCDrawf.areaShrink(ot, 1, valid ? Pal.accent : Pal.remove);
        };
      }, true);
    };

    if(blk.shouldDrawAttrText) {
      LCDrawf.textPlace(
        blk, tx + blk.holeOffPon.x, ty + blk.holeOffPon.y + blk.size,
        Core.bundle.format("bar.efficiency", Math.round(blk.ex_getAttrEffc(tx, ty) * 100.0)),
        valid, blk.attrTextOffTy,
      );
    };
  }
  .setProp({
    tmpTup: [],
    tmpTs: [],
  });


  function comp_ex_getAttrSum(blk, tx, ty) {
    let ot = Vars.world.tile(tx + blk.holeOffPon.x, ty + blk.holeOffPon.y);
    if(ot == null) return 0.0;

    return MDL_attr.calcSumRect(ot, 0, blk.holeSize, blk.attribute, blk.attrMode);
  };


  function comp_ex_getAttrEffc(blk, tx, ty) {
    return MDL_attr.calcAttrEffc(
      blk.ex_getAttrSum(tx, ty) + blk.attribute.env(),
      blk.attrMin,
      blk.attrMax,
      blk.attrBoostScl,
      blk.attrBoostCap,
    );
  };


  function comp_onProximityUpdate(b) {
    b.attrSum = b.block.ex_getAttrSum(b.tileX(), b.tileY());
    let off = b.block.delegee.holeSize % 2 === 0 ? 4.0 : 0.0;
    b.holeVec.set(b).add(
      off + b.block.delegee.holeOffPon.x * Vars.tilesize,
      off + b.block.delegee.holeOffPon.y * Vars.tilesize,
    );
  };


  function comp_pickedUp(b) {
    b.attrSum = 0.0;
    b.attrEffc = 0.0;
  };


  function comp_updateTile(b) {
    if(TIMER.effc) {
      b.attrEffc = b.block.ex_getAttrEffc(b.tileX(), b.tileY());
    };

    if(Mathf.chanceDelta(b.block.delegee.holeUpdateEffP * b.efficiency)) {
      let ot = Vars.world.tileWorld(b.holeVec.x, b.holeVec.y);
      let color = ot == null ?
        Color.white :
        (b.block.delegee.attrMode & AttrModes.BLOCK) !== 0 ?
          ot.block().mapColor :
          ot.getFloorColor();

      MDL_effect.showAt(b.holeVec.x, b.holeVec.y, b.block.delegee.holeUpdateEff, 0.0, color);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.attrEffc;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A special attribute crafter that has a square hole as detection range.
     * Rotation not supported!
     * @class BLK_holeAttributeFactory
     * @extends BLK_multiBlockFactory
     */
    newClass().extendClass(PARENT[0], "BLK_holeAttributeFactory").initClass()
    .setParent(MultiBlockCrafter)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Offset for hole center.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      holeOffPon: tprov(() => new Point2(1, 1)),
      /**
       * `PARAM`: Block size of the hole.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      holeSize: 1,
      /**
       * `PARAM`: Target attribute.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attribute: null,
      /**
       * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock}.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrMode: AttrModes.BLOCK,
      /**
       * `PARAM`: See {@link INTF_BLK_dynamicAttributeBlock}.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrRcType: AttrRcTypes.WALL,
      /**
       * `PARAM`
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrMin: 0.0,
      /**
       * `PARAM`
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrMax: 1.0,
      /**
       * `PARAM`
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrBoostScl: 1.0,
      /**
       * `PARAM`
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrBoostCap: Number.n8,
      /**
       * `PARAM`: Whether efficiency text should be shown in `drawPlace`.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      shouldDrawAttrText: true,
      /**
       * `PARAM`: Integer offset of the efficiency text in `blk.drawPlace`.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      attrTextOffTy: 0,
      /**
       * `PARAM`: Effect shown at hole center.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      holeUpdateEff: Fx.none,
      /**
       * `PARAM`: Chance of hole update effect.
       * @memberof BLK_holeAttributeFactory
       * @instance
       */
      holeUpdateEffP: 0.02,


    })
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


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      /**
       * @memberof BLK_holeAttributeFactory
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @return {number}
       */
      ex_getAttrSum: function(tx, ty) {
        return comp_ex_getAttrSum(this, tx, ty);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof BLK_holeAttributeFactory
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @return {number}
       */
      ex_getAttrEffc: function(tx, ty) {
        return comp_ex_getAttrEffc(this, tx, ty);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Expected production type used in TMI.
       * <br> `LATER`
       * @memberof BLK_holeAttributeFactory
       * @instance
       * @return {string|null}
       */
      ex_getHoleAttrProdTypeStr: function() {
        return null;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_holeAttributeFactory
     * @extends B_multiBlockFactory
     */
    newClass().extendClass(PARENT[1], "B_holeAttributeFactory").initClass()
    .setParent(MultiBlockCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_holeAttributeFactory
       * @instance
       */
      holeVec: tprov(() => new Vec2()),
      /**
       * `INTERNAL`
       * @memberof B_holeAttributeFactory
       * @instance
       */
      attrSum: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_holeAttributeFactory
       * @instance
       */
      attrEffc: 0.0,


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


    }),


  ];
