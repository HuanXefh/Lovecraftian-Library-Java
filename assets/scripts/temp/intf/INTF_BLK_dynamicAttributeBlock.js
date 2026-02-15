/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Used for blocks that outputs resource dynamically based on attribute.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk instanceof AttributeCrafter) {
      blk.displayEfficiency = false;
    };

    let cond1 = false, cond2 = false;
    blk.attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
      if(cond1 && cond2) return;
      let rs = MDL_content._ct(nmRs, "rs");
      if(rs == null) return;
      if(!cond1) cond1 = rs instanceof Item;
      if(!cond2) cond2 = rs instanceof Liquid;
    });
    if(cond1) {
      blk.hasDynaAttrItm = true;
    };
    if(cond2) {
      blk.hasDynaAttrLiq = true;
      blk.outputsLiquid = true;
    };

    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        blk.attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
          let rs = MDL_content._ct(nmRs, "rs");
          if(rs == null) return;

          rs instanceof Item ?
            MDL_recipeDict.addItmProdTerm(blk, rs, blk.ex_getDynaAttrProdAmt(rs), 1.0, {time: blk.ex_getCraftTime() / blk.dynaAttrRsEffcMap.get(rs.name, 1.0)}) :
            MDL_recipeDict.addFldProdTerm(blk, rs, blk.ex_getDynaAttrProdAmt(rs) * blk.dynaAttrRsEffcMap.get(rs.name, 1.0));
        });
      });
    });

    MOD_tmi._r_dynaAttr(blk, blk.attrRsMap, blk.ex_getDynaAttrProdTypeStr(), blk.ex_getDynaAttrProdIsWall());
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);

    if(blk.hasDynaAttrItm && !blk.ex_getDynaAttrBaseAmt_itm().fEqual(0.0)) {
      blk.stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.ex_getDynaAttrBaseAmt_itm() / blk.ex_getCraftTime(), StatUnit.itemsSecond);
    };
    if(blk.hasDynaAttrLiq && !blk.ex_getDynaAttrBaseAmt_liq().fEqual(0.0)) {
      blk.stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.ex_getDynaAttrBaseAmt_liq() * 60.0, StatUnit.liquidSecond);
    };

    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_attr(tb, MDL_attr._attrs_attrRsMap(blk.attrRsMap));
    }));
    blk.stats.add(fetchStat("lovec", "blk-attroutput"), newStatValue(tb => {
      tb.row();
      MDL_table.setTable_base(tb, (function() {
        let matArr = [[
          "",
          MDL_bundle._term("lovec", "resource"),
          fetchStat("lovec", "blk-attrreq").localized(),
          MDL_bundle._term("lovec", "efficiency-multiplier"),
        ]];
        blk.attrRsMap.forEachRow(2, (nmAttr, nmRs) => {
          let rs = MDL_content._ct(nmRs, "rs");
          if(rs == null) return;
          matArr.push([rs, rs.localizedName, MDL_attr._attrB(nmAttr), blk.dynaAttrRsEffcMap.get(rs.name, 1.0).percColor(0)]);
        });

        return matArr;
      })());
    }));
  };


  function comp_setBars(blk) {
    blk.removeBar("efficiency");
    blk.addBar("efficiency", b => new Bar(
      prov(() => Core.bundle.format("bar.efficiency", Math.round(b.delegee.dynaAttrEffc * 100.0))),
      prov(() => Pal.lightOrange),
      () => Mathf.clamp(b.delegee.dynaAttrEffc),
    ));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return t != null && blk.ex_getAttrSum(t.x, t.y, rot) > 0.0;
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(!blk.shouldDrawDynaAttrText) return;

    MDL_draw._d_textPlace(
      blk, tx, ty,
      Core.bundle.format("bar.efficiency", Math.round(blk.ex_getAttrSum(tx, ty, rot) / blk.ex_getAttrLimit() * 100.0)),
      valid, blk.dynaAttrTextOffTy,
    );
  };


  const comp_ex_getAttrSum = function thisFun(blk, tx, ty, rot) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return 0.0;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, rot)) {
      let tup = MDL_attr._dynaAttrTup(blk.attrRsMap, blk.ex_findDynaAttrTs(blk.dynaAttrTmpTs, tx, ty, rot), blk.attrMode);
      thisFun.tmpTup[3] = tup == null ? 0.0 : tup[1];
    };

    return thisFun.tmpTup[3];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_onProximityUpdate(b) {
    b.dynaAttrTs = b.block.ex_findDynaAttrTs(b.dynaAttrTs, b.tileX(), b.tileY(), b.rotation);

    let tup = MDL_attr._dynaAttrTup(b.block.delegee.attrRsMap, b.dynaAttrTs, b.block.delegee.attrMode);
    if(tup == null) {
      b.dynaAttrSum = 0.0;
      b.dynaAttrRs = null;
    } else {
      b.dynaAttrSum = tup[1];
      b.dynaAttrRs = tup[2];
      tup.clear();
    };

    b.dynaAttrEffc = b.dynaAttrSum / b.block.ex_getAttrLimit();
  };


  function comp_pickedUp(b) {
    b.dynaAttrSum = 0.0;
    b.dynaAttrRs = null;
    b.dynaAttrEffc = 0.0;
  };


  function comp_updateTile(b) {
    if(b.dynaAttrRs == null) return;

    if(b.dynaAttrRs instanceof Liquid && b.liquids != null) {
      if(b.liquids.get(b.dynaAttrRs) < b.block.liquidCapacity) {
        b.handleLiquid(b, b.dynaAttrRs, b.block.ex_getDynaAttrProdAmt(b.dynaAttrRs) * b.getProgressIncrease(1.0));
      };
      b.dumpLiquid(b.dynaAttrRs, 2.0);
    };

    if(b.dynaAttrRs instanceof Item && b.items != null && b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      b.dump(b.dynaAttrRs);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.dynaAttrEffc;
    if(b.dynaAttrRs != null) {
      b.efficiency *= b.block.delegee.dynaAttrRsEffcMap.get(b.dynaAttrRs.name, 1.0);
    };
  };


  function comp_shouldConsume(b) {
    return b.dynaAttrRs instanceof Liquid ?
      (b.liquids != null && b.liquids.get(b.dynaAttrRs) < b.block.liquidCapacity) :
      b.dynaAttrRs instanceof Item ?
        (b.items != null && b.items.get(b.dynaAttrRs) <= b.getMaximumAccepted(b.dynaAttrRs) - b.block.ex_getDynaAttrProdAmt(b.dynaAttrRs)) :
        true;
  };


  function comp_getProgressIncrease(b, time) {
    return 1.0 / time * b.edelta();
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_dynaAttrCraft(b) {
    if(!(b.dynaAttrRs instanceof Item) || b.items == null) return;

    FRAG_item.produceItem(b, b.dynaAttrRs, b.block.ex_getDynaAttrProdAmt(b.dynaAttrRs));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: See {MDL_attr._sum_ts}.
        attrMode: "floor",
        // @PARAM: The attribute-resource map used for this block. See {DB_item.db["map"]["attr"]}.
        attrRsMap: null,
        // @PARAM: Used to add efficiency multipliers on specific resources.
        dynaAttrRsEffcMap: prov(() => new ObjectMap()),
        // @PARAM: Whether the efficiency should be drawn in {blk.drawPlace}.
        shouldDrawDynaAttrText: true,
        // @PARAM: Text offset in {blk.drawPlace} for efficiency.
        dynaAttrTextOffTy: 0,

        hasDynaAttrItm: false,
        hasDynaAttrLiq: false,
        dynaAttrTmpTs: prov(() => []),
      }),


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
        noSuper: true,
        boolMode: "and",
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns a list of tiles for attribute calculation.
       * ---------------------------------------- */
      ex_findDynaAttrTs: function(contArr, tx, ty, rot) {
        return contArr.clear();
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns time required for the recipe.
       * ---------------------------------------- */
      ex_getCraftTime: function() {
        return Number.n8;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getAttrSum: function(tx, ty, rot) {
        return comp_ex_getAttrSum(this, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Total attribute value at which the efficiency is 1.0.
       * ---------------------------------------- */
      ex_getAttrLimit: function() {
        return MDL_attr._limit(this.size, 1.0);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getDynaAttrProdAmt: function(rs) {
        return rs == null ?
          0.0 :
          rs instanceof Item ?
            this.ex_getDynaAttrBaseAmt_itm() :
            this.ex_getDynaAttrBaseAmt_liq();
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_getDynaAttrProdSpd: function(rs) {
        return rs == null ?
          0.0 :
          (
            rs instanceof Item ?
              this.ex_getDynaAttrBaseAmt_itm() / this.ex_getCraftTime() :
              this.ex_getDynaAttrBaseAmt_liq() * 60.0
          ) * this.dynaAttrRsEffcMap.get(rs.name, 1.0);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Base production amount for items.
       * ---------------------------------------- */
      ex_getDynaAttrBaseAmt_itm: function() {
        return 0;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Base production rate for liquids.
       * ---------------------------------------- */
      ex_getDynaAttrBaseAmt_liq: function() {
        return 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_getDynaAttrProdTypeStr: function() {
        return null;
      }
      .setProp({
        noSuper: true,
      }),


      // @LATER
      ex_getDynaAttrProdIsWall: function() {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        dynaAttrRs: null,
        dynaAttrSum: 0.0,
        dynaAttrEffc: 0.0,
        dynaAttrTs: prov(() => []),
      }),


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


      shouldConsume: function() {
        return comp_shouldConsume(this);
      }
      .setProp({
        boolMode: "and",
      }),


      getProgressIncrease: function(time) {
        return comp_getProgressIncrease(this, time);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      efficiencyScale: function() {
        return 1.0;
      }
      .setProp({
        noSuper: true,
      }),


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Call this if the block crafts.
       * ---------------------------------------- */
      ex_dynaAttrCraft: function() {
        comp_ex_dynaAttrCraft(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,
          (wr, revi) => {
            // Do nothing
          },

          (rd, revi) => {
            if(revi < 1) {
              // I know this is weird
              if(!MDL_cond._isPump(this.block)) {
                rd.s();
                rd.f();
              };
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
