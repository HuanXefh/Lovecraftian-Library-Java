/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_setBars(blk) {
    blk.addBar("lovec-rpm", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-rpm-amt", Strings.fixed(b.delegee.rpmCur, 1))),
      prov(() => Pal.powerBar),
      () => Mathf.clamp(b.delegee.rpmCur / 10.0),
    ));
    blk.addBar("lovec-tor", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-tor-amt", Strings.fixed(b.delegee.torCur, 1))),
      prov(() => Pal.metalGrayDark),
      () => Mathf.clamp(b.delegee.torCur / blk.size / Math.max(b.delegee.rpmCur, 0.1)),
    ));
  };


  function comp_created(b) {
    // Just in case
    Time.run(5.0, () => {
      if(isNaN(b.torCur)) b.torCur = 0.0;
      if(isNaN(b.rpmCur)) b.rpmCur = 0.0;
    });
  };


  function comp_onProximityUpdate(b) {
    b.ex_updateTorFetchTgs();
    b.ex_updateTorSupplyTgs();
    b.ex_updateTorTransTgs();
  };


  function comp_pickedUp(b) {
    b.torFetchTgs.clear();
    b.torSupplyTgs.clear();
    b.torTransTgs.clear();

    b.torCur = 0.0;
    b.rpmCur = 0.0;
  };


  function comp_updateTile(b) {
    // Reset progress occasionally so that the animation syncs
    if(TIMER.minTwo) b.torProg = 0.0;

    b.torProg += b.rpmCur / 6.0 * Time.delta;
    b.ex_updateTor();
    if(!b.block.delegee.skipTorSupply) {
      b.ex_supplyTor();
    };

    // RPM spontaneously drops
    b.rpmCur = Mathf.maxZero(b.rpmCur - b.rpmCur * 0.002 * Time.delta / b.block.size);
    // Infinite RPM kill
    if(b.rpmCur > Number.n8) {
      b.kill();
    };
  };


  function comp_ex_updateTor(b) {
    // Update current torque, which is capped by transported RPM
    let ob, rateAddNet = 0.0, amtTransTg, i, iCap;
    if(!b.block.delegee.skipTorFetch) {
      i = 0;
      iCap = b.torFetchTgs.iCap();
      while(i < iCap) {
        rateAddNet += b.torFetchTgs[i].efficiency * b.torFetchTgs[i + 1];
        i += 2;
      };
    };
    if(!b.block.delegee.skipTorSupply) {
      i = 0;
      iCap = b.torSupplyTgs.iCap();
      while(i < iCap) {
        rateAddNet -= b.torSupplyTgs[i].efficiency * b.torSupplyTgs[i + 1];
        i += 2;
      };
    };
    b.torCur = Mathf.clamp(b.torCur + rateAddNet * Time.delta, 0.0, b.ex_calcRpmTrans(b));

    // Transport torque
    i = 0;
    iCap = b.torTransTgs.iCap();
    while(i < iCap) {
      ob = b.torTransTgs[i];
      if(b.ex_checkTorTransValid(ob)) {
        amtTransTg = (ob.delegee.torCur + b.torCur) * 0.5;
        ob.delegee.torCur = amtTransTg;
        b.torCur = amtTransTg;
      };
      i++;
    };

    // Update current RPM
    if(TIMER.secQuarter) {
      b.rpmCur = b.ex_calcRpmTg();
      if(b.rpmCur < 0.25) b.rpmCur = 0.0;
    };
  };


  function comp_ex_supplyTor(b) {
    let ob, rate1, rate2;
    let i = 0, iCap = b.torSupplyTgs.iCap();
    while(i < iCap) {
      ob = b.torSupplyTgs[i];
      rate1 = Math.min(b.torSupplyTgs[i + 1], b.torCur);
      rate2 = b.rpmCur / 60.0;

      if(ob.acceptLiquid(b, VARGEN.auxTor)) {
        ob.handleLiquid(b, VARGEN.auxTor, rate1 * b.edelta());
      };
      if(ob.acceptLiquid(b, VARGEN.auxRpm)) {
        ob.handleLiquid(b, VARGEN.auxRpm, rate2 * b.edelta());
      };
      if(TIMER.secFive && ob.block.consumesLiquid(VARGEN.auxRpm)) {
        b.ex_updateRpmDmg(ob, rate2, MDL_recipeDict._consAmt(VARGEN.auxRpm, ob.block));
      };

      i += 2;
    };
  };


  function comp_ex_updateRpmDmg(b, ob, rateAdd, rateCons) {
    if(rateCons < 0.0001 || rateAdd <= rateCons * 3.0) return;

    Core.app.post(() => {
      // I have to delay this or crash happens somehow, idk why
      ob.damagePierce(ob.maxHealth * (VAR.blk_rpmDmgFrac + (rateAdd - rateCons * 3.0) / rateCons));
    });
    MDL_effect._e_textFade(ob.x, ob.y, MDL_bundle._info("lovec", "rpm-overdrive"), Pal.remove, ob.block.size * 0.5);
  };


  function comp_ex_updateTorFetchTgs(b) {
    if(b.block.delegee.skipTorFetch) return;

    b.torFetchTgs.clear();
    b.proximity.each(ob => {
      if(ob.block instanceof LiquidSource) {
        b.torFetchTgs.push(ob, 100.0 / 60.0);
      } else {
        let rateProd = MDL_recipeDict._prodAmt(VARGEN.auxTor, ob.block);
        if(rateProd < 0.0001) return;
        b.torFetchTgs.push(ob, rateProd);
      };
    });
  };


  function comp_ex_updateTorSupplyTgs(b) {
    if(b.block.delegee.skipTorSupply) return;

    b.torSupplyTgs.clear();
    b.proximity.each(ob => {
      if(ob.block instanceof LiquidVoid) {
        b.torSupplyTgs.push(ob, 100.0 / 60.0);
      } else if(ob.block.consumesLiquid(VARGEN.auxTor) || ob.block.consumesLiquid(VARGEN.auxRpm)) {
        b.torSupplyTgs.push(ob, MDL_recipeDict._consAmt(VARGEN.auxTor, ob.block));
      };
    });
  };


  function comp_ex_calcRpmTg(b) {
    let val = 0.0;
    let ob, amt, i, iCap;

    if(!b.block.delegee.skipTorFetch) {
      i = 0;
      iCap = b.torFetchTgs.iCap();
      while(i < iCap) {
        ob = b.torFetchTgs[i];
        if(ob.added && ob.enabled && !ob.isPayload()) {
          amt = b.torFetchTgs[i + 1];
          if(ob.block instanceof LiquidSource && ob.source === VARGEN.auxTor) {
            // Liquid source gives 100.0 RPM, for test
            val += 100.0;
          } else {
            val += FRAG_fluid.addLiquid(ob, ob, VARGEN.auxTor, -amt, true, true) * amt * 60.0;
          };
        };
        i += 2;
      };
    };

    if(val < 0.0001) {
      i = 0;
      iCap = b.torTransTgs.iCap();
      while(i < iCap) {
        ob = b.torTransTgs[i];
        if(ob.added && ob.enabled && !ob.isPayload() && ob.ex_calcRpmTrans != null && b.ex_checkTorTransValid(ob)) {
          val = Math.max(val, ob.ex_calcRpmTrans(b) * b.ex_calcRpmTransScl(ob));
        };
        i++;
      };
    };

    return val;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods related to torque and RPM.
     * @class INTF_BLK_torqueBlock
     */
    new CLS_interface("INTF_BLK_torqueBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: If true, this block cannot gain torque and RPM from producers.
         * @memberof INTF_BLK_torqueBlock
         * @instance
         */
        skipTorFetch: false,
        /**
         * <PARAM>: If true, this block cannot supply torque and RPM for consumers.
         * @memberof INTF_BLK_torqueBlock
         * @instance
         */
        skipTorSupply: false,


      }),


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_torqueBlock
     */
    new CLS_interface("INTF_B_torqueBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torProg: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        rpmCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torFetchTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torSupplyTgs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torTransTgs: prov(() => []),


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


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {void}
       */
      ex_updateTor: function() {
        comp_ex_updateTor(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {void}
       */
      ex_supplyTor: function() {
        comp_ex_supplyTor(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @param {Building} ob
       * @param {number} rateAdd
       * @param {number} rateCons
       * @return {void}
       */
      ex_updateRpmDmg: function(ob, rateAdd, rateCons) {
        comp_ex_updateRpmDmg(this, ob, rateAdd, rateCons);
      }.setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {void}
       */
      ex_updateTorFetchTgs: function() {
        comp_ex_updateTorFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {void}
       */
      ex_updateTorSupplyTgs: function() {
        comp_ex_updateTorSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * <LATER>
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {void}
       */
      ex_updateTorTransTgs: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {number}
       */
      ex_calcRpmTg: function() {
        return comp_ex_calcRpmTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * A cogwheel's transported RPM should be affected by block size, so this value should be dynamic.
       * <br> <LATER>
       * @memberof INTF_B_torqueBlock
       * @instance
       * @param {Building} b_t
       * @return {number}
       */
      ex_calcRpmTrans: function(b_t) {
        return this.rpmCur;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Extra multiplier on torque transported to this building.
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {Building} b_f
       * @return {number}
       */
      ex_calcRpmTransScl: function(b_f) {
        return 1.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * <LATER>
       * @memberof INTF_B_torqueBlock
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_checkTorTransValid: function(ob) {
        return true;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_torqueBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,
          (wr, revi) => {
            wr.f(this.rpmCur);
            wr.f(this.torCur);
          },

          (rd, revi) => {
            this.rpmCur = rd.f();
            this.torCur = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
