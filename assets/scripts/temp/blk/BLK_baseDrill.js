/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");
  const INTF = require("lovec/temp/intf/INTF_BLK_payloadBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.drills;

    if(blk.noSandOutput) {
      if(blk.blockedItems == null) blk.blockedItems = new Seq();
      DB_item.db["group"]["sand"].forEachFast(nm => {
        let itm = MDL_content._ct(nm, "rs");
        if(itm != null) blk.blockedItems.add(itm);
      });
    };

    blk.itmWhitelist = blk.itmWhitelist.map(nmItm => MDL_content._ct(nmItm, "rs")).compact();

    blk.hasItmCons = blk.findConsumer(blkCons => instanceOfAny(blkCons, ConsumeItems, ConsumeItemFilter)) != null;
    if(blk.drillItmDur < 0.0) {
      blk.drillItmDur = blk.drillTime;
    };

    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        if(blk.consumers.some(blkCons => instanceOfAny(blkCons, ConsumeItems, ConsumeItemFilter, ConsumeItemDynamic))) {
          throw new Error("Do not add item consumers to drills, they are not supported!");
        };

        if(blk.shouldDropPay) {
          Vars.content.items().each(itm => {
            let oblk = MDL_content._ct(DB_HANDLER.read("itm-pay-blk", itm.name, null), "blk");
            if(oblk == null || !blk.ex_canMine(oblk, itm, 1.0)) return;
            MDL_recipeDict.addPayProdTerm(blk, oblk, Math.pow(blk.size, blk instanceof BeamDrill ? 1 : 2) * (blk instanceof BurstDrill ? 1.0 : blk.drillTime / blk.getDrillTime(itm)) / oblk.requirements[0].amount, {icon: "lovec-icon-mining"});
          });
        };
      });
    });
  };


  function comp_setStats(blk) {
    if(blk.overwriteVanillaStat) {
      blk.stats.remove(Stat.drillTier);
      blk.stats.remove(Stat.drillSpeed);

      let drillSpd = FRAG_faci._drillSpd(blk, false);
      blk.stats.add(fetchStat("lovec", "blk0min-basedrillspd"), drillSpd, StatUnit.itemsSecond);
      let drillSpdBoost = FRAG_faci._drillSpd(blk, true);
      if(!drillSpdBoost.fEqual(drillSpd)) blk.stats.add(fetchStat("lovec", "blk0min-boosteddrillspd"), drillSpdBoost, StatUnit.itemsSecond);
      blk.stats.add(fetchStat("lovec", "blk0min-drilltier"), blk.tier);
    };

    if(blk.blockedItems != null && blk.blockedItems.size > 0) {
      blk.stats.add(fetchStat("lovec", "blk0min-blockeditms"), newStatValue(tb => {
        tb.row();
        MDL_table._l_ctLi(tb, blk.blockedItems.toArray());
      }));
    } else if(blk.itmWhitelist.length > 0) {
      blk.stats.add(fetchStat("lovec", "blk0min-alloweditms"), newStatValue(tb => {
        tb.row();
        MDL_table._l_ctLi(tb, blk.itmWhitelist);
      }));
    };

    if(!blk.shouldDropPay) blk.stats.remove(fetchStat("lovec", "blk0fac-payroom"));
  };


  function comp_setBars(blk) {
    if(!blk.shouldDropPay) return;

    blk.addBar("lovec-pay-mine-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.delegee.payChargeFrac.perc(0))),
      prov(() => Pal.ammo),
      () => b.delegee.payChargeFrac,
    ));
  };


  function comp_ex_canMine(blk, oblk, itm, tierMtp) {
    if(blk.blockedItems != null && blk.blockedItems.size > 0) {
      if(blk.blockedItems.contains(itm)) return false;
    } else {
      if(blk.itmWhitelist.length > 0 && !blk.itmWhitelist.includes(itm)) return false;
    };

    if(blk.shouldDropPay) {
      let payBlk = MDL_content._ct(DB_HANDLER.read("itm-pay-blk", itm.name, null), "blk");
      if(payBlk == null || !payBlk.supportsEnv(Vars.state.rules.env)) return false;
    };

    return blk.ex_calcDropHardness(oblk, itm) <= blk.tier * tierMtp;
  };


  function comp_created(b) {
    if(b.block.delegee.shouldDropPay) b.hasPayOutput = true;
  };


  function comp_updateTile(b) {
    if(!b.block.delegee.hasItmCons) return;

    b.drillItmProg += b.edelta();
    if(b.drillItmProg >= b.block.delegee.drillItmDur) {
      b.consume();
      b.drillItmProg %= b.block.delegee.drillItmDur;
    };
  };


  function comp_offload(b, itm) {
    if(!b.block.delegee.shouldDropPay) {
      b.super$offload(itm);
      return;
    };

    let blkTg = MDL_content._ct(DB_HANDLER.read("itm-pay-blk", itm.name, null), "blk");
    if(blkTg == null) return;
    Object.mapIncre(b.payChargeObj, itm.name);
    if(b.payChargeObj[itm.name] >= blkTg.requirements[0].amount) {
      b.payChargeObj[itm.name] %= blkTg.requirements[0].amount;
      Object.mapIncre(b.payStockObj, blkTg.name);
    };
    b.payChargeFrac = b.payChargeObj[itm.name] / blkTg.requirements[0].amount;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent of ground drills and wall drills.
     * @class BLK_baseDrill
     * @extends BLK_baseMiner
     * @extends INTF_BLK_payloadBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseDrill").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: Multiplier on amount of items outputted each round.
       * @memberof BLK_baseDrill
       * @instance
       */
      drillAmtMtp: 1.0,
      /**
       * <PARAM>: Whether this drill cannot mine sand.
       * @memberof BLK_baseDrill
       * @instance
       */
      noSandOutput: true,
      /**
       * <PARAM>: The only items that this drill can mine. Works only when `blockedItems` is not used.
       * @memberof BLK_baseDrill
       * @instance
       */
      itmWhitelist: prov(() => []),
      /**
       * <PARAM>: Item duration, `drillTime` by default.
       * @memberof BLK_baseDrill
       * @instance
       */
      drillItmDur: -1.0,
      /**
       * <PARAM>: If true, this drill outputs payload instead of item. Only ores that have payload form can be mined.
       * @memberof BLK_baseDrill
       * @instance
       */
      shouldDropPay: false,
      /**
       * <PARAM>: By default, a payload drill can store 2 raw ore blocks.
       * @override
       * @memberof BLK_baseDrill
       * @instance
       */
      payAmtCap: 4,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_baseDrill
       * @instance
       */
      hasItmCons: false,


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


      /**
       * Gets final hardness of some item drop from some block.
       * @memberof BLK_baseDrill
       * @instance
       * @param {Block} oblk
       * @param {Item} itm
       * @return {number}
       */
      ex_calcDropHardness: function(oblk, itm) {
        return tryJsProp(oblk, "dropHardness", itm.hardness);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * Whether this drill can obtain `itm` from `oblk`.
       * <br> WTF why is there no `canMine` for `BeamDrill`???
       * @memberof BLK_baseDrill
       * @instance
       * @param {Block} oblk
       * @param {Item} itm
       * @param {number} tierMtp
       * @return {boolean}
       */
      ex_canMine: function(oblk, itm, tierMtp) {
        return comp_ex_canMine(this, oblk, itm, tierMtp);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * Calculates expected amount of items outputted each round when all tiles have valid ore.
       * @memberof BLK_baseDrill
       * @instance
       * @param {boolean} noAmtMtp
       * @return {number}
       */
      ex_getEachRoundOutputAmt: function(noAmtMtp) {
        let amt = this instanceof BurstDrill ?
          Math.pow(this.size, 2) :
          this instanceof BeamDrill ?
            this.size :
            1;
        return noAmtMtp ? Math.round(amt * this.drillAmtMtp) : amt;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof BLK_baseDrill
       * @instance
       * @return {number}
       */
      ex_getRcDictOutputScl: function() {
        return this.ex_getEachRoundOutputAmt(false) / this.ex_getEachRoundOutputAmt(true);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_baseDrill
     * @extends B_baseMiner
     * @extends INTF_B_payloadBlock
     */
    newClass().extendClass(PARENT[1], "B_baseDrill").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_baseDrill
       * @instance
       */
      drillItmProg: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_baseDrill
       * @instance
       */
      payChargeObj: prov(() => ({})),
      /**
       * <INTERNAL>
       * @memberof B_baseDrill
       * @instance
       */
      payChargeFrac: 0.0,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      offload: function(itm) {
        comp_offload(this, itm);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        wr.f(this.drillItmProg);
        MDL_io._wr_objStrNum(wr, this.payChargeObj);
      },


      read: function(rd, revi) {
        if(this.LCReviSub === 0) return;

        if(this.LCReviSub >= 2) {
          this.drillItmProg = rd.f();
        };
        MDL_io._rd_objStrNum(rd, this.payChargeObj);
      },


      /**
       * Called whenever this drill crafts.
       * <br> <LATER>
       * @memberof B_baseDrill
       * @instance
       * @return {void}
       */
      ex_onCraft: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof B_baseDrill
       * @instance
       * @return {number}
       */
      ex_subRevi: function() {
        return 2;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
