/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.presRes = MDL_flow._presRes(blk);
    blk.vacRes = MDL_flow._vacRes(blk);
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


  function comp_remove(b) {
    if(b.liquids.currentAmount() < 0.01) {
      b.presBase = 0.0;
      b.presTmp = 0.0;
    };

    b.super$remove();
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePresFetchTgs();
    b.ex_updatePresSupplyTgs();
  };


  function comp_pickedUp(b) {
    b.presFetchTgs.clear();
    b.presSupplyTgs.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.UPDATE_SUPPRESSED) return;

    if(TIMER.secQuarter) {
      b.ex_updatePresTg();
      b.presTmp = (b.presTmp + b.presTg) * 0.5;
      if(Math.abs(b.presTmp) < 0.005) b.presTmp = 0.0;
    };
    if(Math.abs(b.presTmp) > 0.0) {
      b.noSleep();
      if(b.next != null && b.next() != null) b.next().noSleep();
    };

    if(TIMER.sec && Math.abs(b.presTmp) > 0.0) {
      b.ex_updatePresSupplyTgs();
    };

    // Apply damage if over limit
    if(
      !PARAM.UPDATE_DEEP_SUPPRESSED && TIMER.secQuarter && Mathf.chance(0.25)
        && (
          (b.presTmp + b.presExtra) > 0.0 ?
            ((b.presTmp + b.presExtra) > (b.block.delegee.presRes + 0.5)) :
            ((b.presTmp + b.presExtra) < (b.block.delegee.vacRes - 0.5))
        )
    ) {
      b.damagePierce((b.maxHealth * VAR.param.presDmgFrac + VAR.param.presDmgMin) * (
        b.presTmp > 0.0 ?
          (b.presTmp / Math.max(b.block.delegee.presRes, 0.0001)) :
          (-b.presTmp / Math.max(-b.block.delegee.vacRes, 0.0001))
      ));
    };

    // Pressure drop
    b.presBase -= b.presBase.fEqual(0.0, 0.005) ? b.presBase : b.presBase * 0.01666667 * Time.delta;

    // Occasionally supply abstract fluid
    if(TIMER.liq && !b.block.delegee.skipPresSupply && b.presSupplyTgs.length > 0 && Math.abs(b.presTmp) > 0.0) {
      b.presSupplyIncre++;
      let b_t = b.presSupplyTgs[b.presSupplyIncre % b.presSupplyTgs.length];
      if(b_t.added && b_t.enabled && !b_t.isPayload()) {
        let addAmt = Math.abs(b.presTmp.roundFixed(0)) / 60.0;
        let consAmt = MDL_recipeDict._consAmt(b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, b_t.block);
        FRAG_fluid.addLiquid(b_t, null, b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, addAmt * VAR.time.liqIntv, false, false, true);
        if(consAmt > 0.0 && addAmt > (consAmt + 5.5 / 60.0)) {
          b_t.damagePierce((b_t.maxHealth * VAR.param.presDmgFrac + VAR.param.presDmgMin) / 5.0);
        };
      };
    };
  };


  function comp_acceptItem(b, b_f, itm) {
    let presThr = b.block.delegee.presThr;
    if(presThr.fEqual(0.0)) return true;

    return presThr > 0.0 ?
      b.presTmp >= presThr - 0.15 :
      b.presTmp <= presThr + 0.15;
  };


  function comp_acceptLiquid(b, b_f, liq) {
    let presThr = b.block.delegee.presThr;
    if(presThr.fEqual(0.0)) return true;

    return presThr > 0.0 ?
      b.presTmp >= presThr - 0.15 :
      b.presTmp <= presThr + 0.15;
  };


  function comp_ex_updatePresFetchTgs(b) {
    b.presFetchTgs.clear();
    b.presTransCount = 0;
    // Find all possible pressure sources
    b.proximity.each(ob => {
      if(ob.ex_getPres != null && ob.ex_checkPresFetchValid(b)) {
        b.presTransCount++;
      };
      if(ob.ex_getPres == null || !b.ex_checkPresFetchValid(ob) || (ob.ex_checkPresSupplyValid != null && !ob.ex_checkPresSupplyValid(b))) return;
      b.presFetchTgs.push(ob);
    });
  };


  function comp_ex_updatePresSupplyTgs(b) {
    b.presSupplyTgs.clear();
    // Find all possible pressure consumers
    b.proximity.each(ob => {
      ob = ob.getLiquidDestination(b, VARGEN.auxPres);
      if((!ob.acceptLiquid(b, VARGEN.auxPres) && !ob.acceptLiquid(b, VARGEN.auxVac)) || !b.ex_checkPresSupplyValid(ob)) return;
      b.presSupplyTgs.push(ob);
    });
  };


  function comp_ex_updatePresTg(b) {
    b.presTg = b.presBase;
    b.presFetchTgs.forEachFast(ob => {
      if(!ob.added || !ob.enabled || ob.isPayload()) return;
      b.presTg += tryFun(ob.ex_getPres, ob, 0.0) * tryFun(ob.ex_getPresTransScl, ob, 1.0, b);
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


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Pressure required for this block to operate, negative for vacuum.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        presThr: 0.0,
        /**
         * <PARAM>: If true, this block does not supply pressure/vacuum for nearby consumers.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        skipPresSupply: false,
        /**
         * <PARAM>: If true, pressure will be transferred in three directions.
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        isPresRouter: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_pressureBlock
         * @instance
         */
        presRes: 0.0,
        /**
         * <INTERNAL>
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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL> Gained from other buildings that actively dump pressure. See {@link INTF_BLK_pressureProducer}.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presBase: 0.0,
        /**
         * <INTERNAL> Current real amount of pressure.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTmp: 0.0,
        /**
         * <INTERNAL> Target pressure, very volatile. Sum of base pressure and transferred pressure.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTg: 0.0,
        /**
         * <INTERNAL>: Will be added for bars and pressure damage check, has no effect on pressure transferred.
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presExtra: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presFetchTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presTransCount: 0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presSupplyTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_pressureBlock
         * @instance
         */
        presSupplyIncre: 0,


      }),


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      remove: function() {
        comp_remove(this);
      }
      .setProp({
        noSuper: true,
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


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "and",
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
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
        comp_ex_updatePresSupplyTgs(this);
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
        comp_ex_updatePresTg(this);
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
      ex_checkPresFetchValid: function(ob) {
        return GEOMETRY_HANDLER.accept(
          ob, this, ob.block.delegee.isPresRouter,
          this.block.delegee.isPresRouter ?
            false :
            !MDL_cond._isNoSideBlock(this.block) ?
              true :
              (MDL_cond._isFluidConduit(this.block) && MDL_cond._isFluidConduit(ob.block))
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
        return GEOMETRY_HANDLER.accept(this, ob, this.block.delegee.isPresRouter, true);
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
        return !this.block.delegee.isPresRouter || this.presTransCount === 0 ? 1.0 : (1.0 / this.presTransCount);
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
          wr0rd, this.LCRevi,

          (wr, revi) => {
            wr.f(this.presTmp);
          },

          (rd, revi) => {
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
