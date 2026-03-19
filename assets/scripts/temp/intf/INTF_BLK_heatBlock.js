/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.heatBlkMeltTemp = MDL_flow._heatRes(blk);
  };


  function comp_load(blk) {
    blk.heatReg = fetchRegionOrNull(blk, "-heat");
  };


  function comp_setStats(blk) {
    if(isFinite(blk.heatBlkMeltTemp)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.heatBlkMeltTemp, fetchStatUnit("lovec", "heatunits"));
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
    if(!PARAM.updateSuppressed) {
      b.tempRiseTg = b.ex_calcTempTg();
      b.tempCur = Mathf.lerpDelta(b.tempCur, Math.max(b.tempRiseTg, PARAM.glbHeat), b.block.delegee.heatTransRate);
      if(TIMER.secHalf && b.tempCur > b.block.delegee.heatBlkMeltTemp) {
        FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.delegee.heatBlkMeltTemp) / 50.0, 0.0, "heat");
      };
    };

    // Occasionally supply abstract fluid, or output external heat
    if(TIMER.liq && !b.block.delegee.skipHeatSupply && b.heatSupplyTgs.length > 0) {
      b.heatSupplyIncre++;
      let b_t = b.heatSupplyTgs[b.heatSupplyIncre % b.heatSupplyTgs.length];
      if(b_t.added && !b_t.isPayload()) {
        b_t.ex_handleExtHeat != null ?
          b_t.ex_handleExtHeat(b.ex_getHeatSupplied()) :
          FRAG_fluid.addLiquid(b_t, null, VARGEN.auxHeat, b.ex_getHeatSupplied() * VAR.time_liqIntv / 6000.0, false, false, true);
      };
    };
  };


  function comp_draw(b) {
    if(PARAM.drawFurnaceHeat) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.7, b.block.delegee.heatReg, b.drawrot(), b.block.size);
    };

    MDL_draw._l_disk(b.x, b.y, b.ex_getHeatFrac(), b.block.size * Vars.tilesize * 0.7, b.block.size);
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
        && (ob.ex_handleExtHeat != null || ob.block.consumesLiquid(VARGEN.auxHeat)),
      ob => b.heatSupplyTgs.push(ob),
    );
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
         * <PARAM>: How fast this heat block warms up.
         * @memberof INTF_BLK_heatBlock
         * @instance
         */
        heatTransRate: 0.0008,
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
        maxHeaterProd: 0.0,
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
       * @memberof INTF_B_heatBlock
       * @instance
       * @return {number}
       */
      ex_getHeatFrac: function() {
        return Mathf.clamp(this.tempCur / this.block.delegee.heatBlkMeltTemp);
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
        return b.tempCur <= b.maxHeaterProd ?
          b.tempCur :
          (Math.sqrt(Math.pow(b.maxHeaterProd, 2) * 4.0 + b.tempCur * b.maxHeaterProd * 4.0) - b.maxHeaterProd * (Math.sqrt(2) * 2.0 - 1.0));
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
