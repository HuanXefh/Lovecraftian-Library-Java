/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.clipSize += 140.0;
    blk.heatBlkMeltTemp = MDL_flow._heatRes(blk);
    blk.heatLightTempReq = Math.max(blk.heatLightTempReq, 60.01);
    if(blk.heatLightRad < 0.0) blk.heatLightRad = blk.size * Vars.tilesize * 0.7;

    blk.ex_addLogicGetter(LAccess.heat, b => b.delegee.tempCur / 100.0);
  };


  function comp_load(blk) {
    blk.heatReg = fetchRegionOrNull(blk, "-heat");
  };


  function comp_setStats(blk) {
    if(isFinite(blk.heatBlkMeltTemp)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.heatBlkMeltTemp, fetchStatUnit("lovec", "heatunits"));
    if(!blk.tempExtMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-extheatmtp"), blk.tempExtMtp.perc());
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.delegee.tempCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized(), b.ex_getHeatFrac().roundFixed(2) * 100.0)),
      prov(() => Pal.lightOrange),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_created(b) {
    b.tempCur = PARAM.glbHeat;
  };


  function comp_onProximityUpdate(b) {
    b.ex_updateHeatFetchTgs();
    b.ex_updateHeatTransTgs();
    b.ex_updateHeatSupplyTgs();
  };


  function comp_pickedUp(b) {
    b.heatFetchTgs.clear();
    b.heatTransTgs.clear();
    b.heatSupplyTgs.clear();
  };


  function comp_updateTile(b) {
    // Update temperature and apply damage if overheated
    if(!PARAM.updateSuppressed && TIMER.secHalf) {
      b.tempRiseTg = b.ex_calcTempTg();
      b.tempCur = Mathf.lerp(b.tempCur, Mathf.lerp(PARAM.glbHeat, b.tempRiseTg, !b.ex_checkHeatingValid() ? 0.0 : b.ex_calcTempTgFrac()), b.block.delegee.heatWarmupRate * 30.0);
      if(b.tempCur > b.block.delegee.heatBlkMeltTemp) {
        FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.delegee.heatBlkMeltTemp) / 50.0, 0.0, "heat");
      };
    };

    // External heat control
    if(b.block.delegee.tempExtMtp > 0.0) {
      if(b.extHeatCd > 0.0) {
        b.extHeatCd -= Time.delta;
      } else {
        b.tempExt = 0.0;
      };
    };

    // Update heat fraction
    if(TIMER.secQuarter) {
      b.heatFrac = Mathf.clamp(b.tempCur / Math.max(b.ex_getHeatTg(), 100.0));
    };

    // Occasionally supply abstract fluid, or output external heat
    if(!b.block.delegee.skipHeatSupply && b.heatSupplyTgs.length > 0) {
      b.heatSupplyIncre++;
      let b_t = b.heatSupplyTgs[b.heatSupplyIncre % b.heatSupplyTgs.length];
      if(b_t.added && !b_t.isPayload()) {
        b_t.ex_handleExtHeat != null ?
          b_t.ex_handleExtHeat(b.ex_getHeatSupplied()) :
          FRAG_fluid.addLiquid(b_t, null, VARGEN.auxHeat, b.ex_getHeatSupplied() / 6000.0, false, false, true);
      };
    };
  };


  function comp_draw(b) {
    if(b.isPayload()) return;

    if(PARAM.drawFurnaceHeat && b.block.delegee.heatA > 0.0) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.5 * b.block.delegee.heatA, b.block.delegee.heatReg, b.drawrot(), b.block.size);
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.35 * b.block.delegee.heatA, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    };

    if(b.block.delegee.shouldDrawHeatLight) {
      MDL_draw._l_disk(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / (b.block.delegee.heatLightTempReq - 60.0)), b.block.delegee.heatLightRad, b.block.size);
    };
  };


  function comp_ex_updateHeatFetchTgs(b) {
    if(b.block.delegee.skipHeatFetch) return;

    b.heatFetchTgs.clear();
    b.proximity.each(
      ob => ob.ex_getHeatProd != null || MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) > 0.0,
      ob => b.heatFetchTgs.push(ob, MDL_pos._sideFrac(ob, b)),
    );
  };


  function comp_ex_updateHeatTransTgs(b) {
    if(b.block.delegee.skipHeatTrans) return;

    b.heatTransTgs.clear();
    b.proximity.each(
      ob => ob.ex_getHeatTransferred != null && (
        !ob.block.rotate ?
          true :
          ob.relativeTo(b) === ob.rotation && (
            !b.block.rotate ?
              true :
              (function(b_f) {
                return b_f == null || b_f.ex_getHeatTransferred == null;
              })(b.nearby(Mathf.mod(b.rotation + 2, 4)))
          )
      ) && (
        !b.block.rotate ?
          true :
          b.relativeTo(ob) !== b.rotation
      ),
      ob => b.heatTransTgs.push(ob),
    );
  };


  function comp_ex_updateHeatSupplyTgs(b) {
    if(b.block.delegee.skipHeatSupply) return;

    b.heatSupplyTgs.clear();
    b.proximity.each(
      ob => (!b.block.rotate ? true : b.relativeTo(ob) === b.rotation)
        && !tryJsProp(ob.block, "skipHeatFetch", false)
        && (ob.ex_handleExtHeat != null || ob.block.consumesLiquid(VARGEN.auxHeat)),
      ob => b.heatSupplyTgs.push(ob),
    );
  };


  function comp_ex_handleExtHeat(b, amt) {
    if(b.block.delegee.tempExtMtp.fEqual(0.0)) return;

    b.tempExt = (b.tempExt + amt * b.block.delegee.tempExtMtp) * 0.5;
    b.extHeatCd = 300.0;
  };


  function comp_ex_calcTempTg(b) {
    let heat, heatTg = 0.0;
    b.maxHeaterProd = 0.0;

    if(!b.block.delegee.skipHeatFetch) {
      b.heatFetchTgs.forEachRow(2, (ob, sideFrac) => {
        if(!ob.added || !ob.enabled || ob.isPayload()) return;
        heat = ob.ex_getHeatProd != null ?
          (ob.ex_getHeatProd() * sideFrac) :
          (FRAG_fluid.addLiquid(ob, ob, VARGEN.auxHeat, -MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) * sideFrac, true, true) * MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) * sideFrac);
        b.maxHeaterProd = Math.max(heat, b.maxHeaterProd);
        heatTg += heat;
      });
    };

    if(!b.block.delegee.skipHeatTrans) {
      b.heatTransTgs.forEachFast(ob => {
        if(!ob.added || !ob.enabled || ob.isPayload()) return;
        heatTg += ob.ex_getHeatTransferred();
        b.maxHeaterProd = Math.max(tryFun(ob.ex_getMaxHeaterProd, ob, 0.0), b.maxHeaterProd);
      });
    };

    if(b.ex_getHeatProd != null) {
      b.maxHeaterProd = Math.max(b.ex_getHeatProd(), b.maxHeaterProd);
    };

    if(b.tempExt > heatTg) heatTg = b.tempExt;

    return heatTg;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Blocks that handle Lovec heat, not Erekir one.
     * @class INTF_BLK_heatBlock
     */
    new CLS_interface("INTF_BLK_heatBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: How fast this heat block warms up by heat transfer.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatWarmupRate: 0.0008,
        /**
         * <PARAM>: Multiplier on external heat accepted.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        tempExtMtp: 1.0,
        /**
         * <PARAM>: If true, this block cannot gain heat from producers.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        skipHeatFetch: false,
        /**
         * <PARAM>: If true, this block cannot gain heat from other heat blocks.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        skipHeatTrans: false,
        /**
         * <PARAM>: If true, this block cannot supply heat for consumers.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        skipHeatSupply: false,
        /**
         * <PARAM>: Heat region alpha.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatA: 1.0,
        /**
        * <PARAM>: Whether this heat block emits light.
        * @memberof INTF_BLK_heatBlock
        * @instance
        */
        shouldDrawHeatLight: true,
        /**
         * <PARAM>: Temperature required to emit heat light.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatLightTempReq: 1000.0,
        /**
         * <PARAM>: Maximum heat light radius.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatLightRad: -1.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatBlkMeltTemp: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatReg: null,


      }),


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_heatBlock
     */
    new CLS_interface("INTF_B_heatBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        tempCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        tempRiseTg: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        tempExt: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        extHeatCd: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        maxHeaterProd: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        heatFrac: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        heatFetchTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        heatTransTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        heatSupplyTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_heatBlock
         * @instance
         */
        heatSupplyIncre: 0,


      }),


      created: function() {
        comp_created(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      draw: function() {
        comp_draw(this);
      },


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {void}
       */
      ex_updateHeatFetchTgs: function() {
        comp_ex_updateHeatFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {void}
       */
      ex_updateHeatTransTgs: function() {
        comp_ex_updateHeatTransTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {void}
       */
      ex_updateHeatSupplyTgs: function() {
        comp_ex_updateHeatSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Call this method to input external heat.
       * Should be called in `updateTile`.
       * @memberof INTF_B_heatBlock
       * @instance
       * @param {number} amt
       * @return {void}
       */
      ex_handleExtHeat: function(amt) {
        comp_ex_handleExtHeat(this, amt);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTg: function() {
        return comp_ex_calcTempTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Target temperature will be multiplied with this before use.
       * <br> <LATER>
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTgFrac: function() {
        return 1.0;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeat: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Expected target heat.
       * <br> <LATER>
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.block.delegee.heatBlkMeltTemp;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeatFrac: function() {
        return this.heatFrac;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeatTransferred: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeatSupplied: function() {
        // Single heater with larger output rate => more efficient heat transfer
        return this.tempCur <= this.maxHeaterProd ?
          this.tempCur :
          (Math.sqrt(Math.pow(this.maxHeaterProd, 2) * 4.0 + this.tempCur * this.maxHeaterProd * 4.0) - this.maxHeaterProd * (Math.sqrt(2) * 2.0 - 1.0));
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * <br> <LATER>
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {boolean}
       */
      ex_checkHeatingValid: function() {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_heatBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
          },

          (rd, revi) => {
            let temp = rd.f();
            this.tempCur = temp;
            this.tempRiseTg = temp;
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
