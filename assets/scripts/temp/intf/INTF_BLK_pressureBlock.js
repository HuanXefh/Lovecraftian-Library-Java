/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.presRes = MDL_flow.getPresRes(blk);
    blk.vacRes = MDL_flow.getVacRes(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0liq-presres"), blk.presRes);
    blk.stats.add(fetchStat("lovec", "blk0liq-vacres"), -blk.vacRes);
    if(!blk.presThr.fEqual(0.0)) blk.stats.add(blk.presThr > 0.0 ? fetchStat("lovec", "blk0liq-presreq") : fetchStat("lovec", "blk0liq-vacreq"), Math.abs(blk.presThr));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-pressure", b => new Bar(
      prov(() => Core.bundle.format(b.delegee.presTmp >= 0.0 ? "bar.lovec-bar-pressure-amt" : "bar.lovec-bar-vacuum-amt", Strings.fixed(Math.abs(b.delegee.presTmp), 2))),
      prov(() => b.delegee.presTmp >= 0.0 ? Color.valueOf(Tmp.c1, "cce5ff") : Color.valueOf(Tmp.c1, "e1d5e5")),
      () => Mathf.clamp(Math.abs(b.delegee.presTmp + b.delegee.presExtra) / Math.max(b.delegee.presTmp >= 0.0 ? blk.presRes : -blk.vacRes, 0.0001)),
    ));
  };


  function comp_onDestroyed(b) {
    if(Math.abs(b.presTmp) > 0.5) {
      Damage.damage(b.x, b.y, b.block.size * Vars.tilesize * 2.5, b.maxHealth * Math.abs(b.presTmp) * 0.2);
      Fx.explosion.at(b.x, b.y, b.block.size * Vars.tilesize * 2.5);
    };
  };


  function comp_onProximityUpdate(b) {
    b.presTransCount = 0;
    b.presTransCountTmpBs.clear();
    Time.run(60.0, () => {
      b.ex_updatePresFetchTgs();
      b.ex_updatePresSupplyTgs();
    });
  };


  function comp_pickedUp(b) {
    b.presFetchTgs.clear();
    b.presSupplyTgs.clear();
  };


  function comp_ex_updatePresFetchTgs(b) {
    b.presFetchTgs.clear();
    // Find all possible pressure sources
    b.proximity.each(ob => {
      if(ob.block instanceof MultiBlockLinkBlock) {
        ob = ob.linkedBuild;
      };
      if(ob.ex_getPres != null && ob.ex_checkPresFetchValid(b) && !b.presTransCountTmpBs.includes(ob)) {
        b.presTransCount++;
        b.presTransCountTmpBs.push(ob);
      };
      if(ob.ex_getPres != null && b.ex_checkPresFetchValid(ob) && (ob.ex_checkPresSupplyValid == null || ob.ex_checkPresSupplyValid(b))) {
        b.presFetchTgs.push(ob);
      };
    });
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods for pressure.
     * Only used for rotatable blocks for now, due to how pressure is transferred.
     * @class INTF_BLK_pressureBlock
     */
    new CLS_interface("INTF_BLK_pressureBlock", {


      __paramObjM__: () => ({


        /**
         * `PARAM`: Pressure required for this block to operate, negative for vacuum.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        presThr: 0.0,
        /**
         * `PARAM`: If true, this block does not supply pressure/vacuum for nearby consumers.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        skipPresSupply: false,
        /**
         * `PARAM`: If true, pressure will be transferred in three directions.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        isPresRouter: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        presRes: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        vacRes: 0.0,


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


    }),


    /**
     * @class INTF_B_pressureBlock
     */
    new CLS_interface("INTF_B_pressureBlock", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL` Gained from other buildings that actively dump pressure. See {@link INTF_BLK_pressureProducer}.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presBase: 0.0,
        /**
         * `INTERNAL` Current real amount of pressure.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTmp: 0.0,
        /**
         * `INTERNAL` Target pressure, very volatile. Sum of base pressure and transferred pressure.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTg: 0.0,
        /**
         * `INTERNAL`: Will be added for bars and pressure damage check, has no effect on pressure transferred.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presExtra: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presFetchTgs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTransCount: 0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTransCountTmpBs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presSupplyTgs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presSupplyIncre: 0,


      }),


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        INTFBFragPressureBlock.setThis(this).updateTile.call(INTFBFragPressureBlock);
      },


      acceptItem: function(b_f, itm) {
        return INTFBFragPressureBlock.setThis(this).acceptItem.apply(INTFBFragPressureBlock, arguments);
      }
      .setProp({
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return INTFBFragPressureBlock.setThis(this).acceptLiquid.apply(INTFBFragPressureBlock, arguments);
      }
      .setProp({
        boolMode: "and",
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @return {void}
       */
      ex_updatePresFetchTgs: function() {
        comp_ex_updatePresFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @return {void}
       */
      ex_updatePresSupplyTgs: function() {
        INTFBFragPressureBlock.setThis(this).ex_updatePresSupplyTgs.call(INTFBFragPressureBlock);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @return {void}
       */
      ex_updatePresTg: function() {
        INTFBFragPressureBlock.setThis(this).ex_updatePresTg.call(INTFBFragPressureBlock);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @return {boolean}
       */
      ex_checkIsPresRouter: function() {
        return this.block.delegee.isPresRouter;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkPresFetchSideValid: function(ob) {
        return this.ex_checkIsPresRouter() ?
          false :
          !MDL_cond.isNoSideBlock(this.block) ?
            true :
            (MDL_cond.isFluidConduit(this.block) && MDL_cond.isFluidConduit(ob.block));
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkPresFetchValid: function(ob) {
        return LCGeometry.accept(
          ob, this, ob.ex_checkIsPresRouter(),
          this.ex_checkPresFetchSideValid(ob),
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkPresSupplyValid: function(ob) {
        return LCGeometry.accept(this, ob, this.ex_checkIsPresRouter(), true);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_pressureBlock
       * @instance
       * @return {number}
       */
      ex_getPres: function() {
        return this.presTmp;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Extra multiplier on pressure transferred to another pressure block.
       * @memberof INTF_B_pressureBlock
       * @instance
       * @param {Building} b_t
       * @return {number}
       */
      ex_getPresTransScl: function(b_t) {
        return !this.ex_checkIsPresRouter() || this.presTransCount === 0 ? 1.0 : (1.0 / this.presTransCount);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_BLK_pressureBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd,

          wr => {
            wr.f(this.presTmp);
          },

          rd => {
            let pres = rd.f();
            this.presTmp = pres;
            this.presTg = pres;
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
