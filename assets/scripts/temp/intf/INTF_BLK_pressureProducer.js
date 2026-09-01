/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);

    if(!blk.presProd.fEqual(0.0)) {
      MDL_event.onLoadPost(() => {
        MDL_recipeDict.addFldProdTerm(blk, blk.presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, Math.abs(blk.presProd), null);
      });
    };
  };


  function comp_setStats(blk) {
    if(!blk.presProd.fEqual(0.0)) {
      blk.stats.add(blk.presProd > 0.0 ? fetchStat("lovec", "blk0liq-presoutput") : fetchStat("lovec", "blk0liq-vacoutput"), Math.abs(blk.presProd * 60.0), StatUnit.perSecond);
    };
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePresDumpTs();
    b.ex_updatePresDumpTargets();
  };


  function comp_pickedUp(b) {
    b.presDumpTargets.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.UPDATE_SUPPRESSED) return;
    let presProd = b.ex_calcPresDumpRate();
    if(presProd.fEqual(0.0)) return;
    let aux = presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac;

    LCCraftingHandler.addLiquid(b, b, aux, Math.abs(presProd) / b.timeScale, true);
    if(!b.ex_dumpPres(Math.abs(presProd), presProd < 0.0)) {
      b.dumpLiquid(aux, 2.0);
    };
  };


  function comp_ex_updatePresDumpTs(b) {
    b.presDumpTs.clear();
    b.block.delegee.presDumpPons.forEachFast(pon => {
      b.presDumpTs.push(LCPos.getTileRectRotCenter(Vars.world.tile(b.tileX() + pon.x, b.tileY() + pon.y), Vars.world.tile(b.tileX(), b.tileY()), b.rotation, 1, b.block.size));
    }, true);
  };


  function comp_ex_updatePresDumpTargets(b) {
    b.presDumpTargets.clear();
    let fldType1, fldType2;
    if(b.presDumpTs.length > 0) {
      let ob;
      b.presDumpTs.forEachFast(ot => {
        ob = ot.build;
        if(ob == null || ob.team !== b.team) return;
        if(ob.block instanceof MultiBlockLinkBlock) {
          ob = ob.linkedBuild;
        };
        if(tryJsProp(ob, "presBase") == null) return;
        if(ob.block.rotate && (!MDL_cond.isNoSideBlock(ob.block) ? ob.relativeTo(b) === ob.rotation : b.relativeTo(ob) !== ob.rotation)) return;
        fldType1 = b.block.delegee.presFldType;
        fldType2 = tryJsProp(ob.block, "fldType", "any");
        if(fldType1 !== "any" && fldType2 !== "any" && fldType1 !== fldType2) return;
        b.presDumpTargets.push(ob);
      }, true);
    } else {
      b.proximity.each(ob => {
        if(tryJsProp(ob, "presBase") == null) return;
        if(ob.block.rotate && (!MDL_cond.isNoSideBlock(ob.block) ? ob.relativeTo(b) === ob.rotation : b.relativeTo(ob) !== ob.rotation)) return;
        fldType1 = b.block.delegee.presFldType;
        fldType2 = tryJsProp(ob.block, "fldType", "any");
        if(fldType1 !== "any" && fldType2 !== "any" && fldType1 !== fldType2) return;
        b.presDumpTargets.push(ob);
      });
    };
  };


  function comp_ex_dumpPres(b, rate, isVac) {
    if(b.presDumpTargets.length === 0) return false;
    let b_t = b.presDumpTargets[b.presDumpIncre % b.presDumpTargets.length];
    b.presDumpIncre++;
    if(!b_t.isAdded() || b_t.isPayload()) return false;
    let amtTrans = LCCraftingHandler.addLiquid(b, b, !isVac ? VARGEN.auxPres : VARGEN.auxVac, -(rate - 0.0001));
    if(amtTrans < 0.0001) return false;

    b_t.delegee.presBase = b_t.delegee.presBase + amtTrans * (isVac ? -1.0 : 1.0);

    return true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles pressure production methods.
     * @class INTF_BLK_pressureProducer
     */
    new CLS_interface("INTF_BLK_pressureProducer", {


      __paramObjM__: () => ({


        /**
         * `PARAM`: Pressure produced by this block per frame, negative for vacuum.
         * @memberof INTF_BLK_pressureProducer
         * @instance
         */
        presProd: 0.0,
        /**
         * `PARAM`: Fluid type restriction for pressure dumping. See {@link INTF_BLK_fluidTypeFilter}.
         * @memberof INTF_BLK_pressureProducer
         * @instance
         */
        presFldType: "any",
        /**
         * `PARAM`: Dump positions (relative to tile center). Leave empty if not used.
         * @memberof INTF_BLK_pressureProducer
         * @instance
         */
        presDumpPons: tprov(() => []),


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class INTF_B_pressureProducer
     */
    new CLS_interface("INTF_B_pressureProducer", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureProducer
         * @instance
         */
        presDumpTs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureProducer
         * @instance
         */
        presDumpTargets: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureProducer
         * @instance
         */
        presDumpIncre: 0,


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


      /**
       * @memberof INTF_B_pressureProducer
       * @instance
       * @return {void}
       */
      ex_updatePresDumpTs: function() {
        comp_ex_updatePresDumpTs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureProducer
       * @instance
       * @return {void}
       */
      ex_updatePresDumpTargets: function() {
        comp_ex_updatePresDumpTargets(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureProducer
       * @instance
       * @param {number} rate
       * @param {boolean} isVac
       * @return {void}
       */
      ex_dumpPres: function(rate, isVac) {
        comp_ex_dumpPres(this, rate, isVac);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * Override this method for dynamic dump rate.
       * Efficiency should not be involved!
       * <br> `LATER`
       * @memberof INTF_B_pressureProducer
       * @instance
       * @return {number}
       */
      ex_calcPresDumpRate: function() {
        return this.block.delegee.presProd;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
