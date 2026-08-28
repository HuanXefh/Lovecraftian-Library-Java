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
    TRIGGER.torqueBlockPlace.fire(b);
    Time.run(0.0, () => {
      TRIGGER.torqueBlockPlace.addListener(ob => b.torProg = 0.0);
      TRIGGER.torqueBlockConfigure.addListener(ob => b.torProg = 0.0);
    });

    // Just in case
    Time.run(5.0, () => {
      if(isNaN(b.torCur)) b.torCur = 0.0;
      if(isNaN(b.rpmCur)) b.rpmCur = 0.0;
    });
  };


  function comp_onProximityUpdate(b) {
    Time.run(60.0, () => {
      b.ex_updateTorFetchTgs();
      b.ex_updateTorSupplyTgs();
      b.ex_updateTorTransTgs();
    });
  };


  function comp_pickedUp(b) {
    b.torFetchTgs.clear();
    b.torSupplyTgs.clear();
    b.torTransTgs.clear();

    b.torCur = 0.0;
    b.rpmCur = 0.0;
  };


  function comp_updateTile(b) {
    if(PARAM.UPDATE_SUPPRESSED || DEBUG.skipTorUpdate) return;

    b.torProg += b.rpmCur / 6.0 * Time.delta;
    b.ex_updateTor();
    if(!b.block.delegee.skipTorSupply) {
      b.ex_supplyTor();
    };

    // RPM spontaneously drops
    b.rpmCur = Mathf.maxZero(b.rpmCur - b.rpmCur * b.block.delegee.rpmDropRate * Time.delta / b.block.size);
    // Infinite RPM kill
    if(b.rpmCur > Number.n8) {
      b.kill();
    };
  };


  function comp_ex_updateRpmDmg(b, ob, rateAdd, rateCons) {
    if(rateCons < 0.0001 || rateAdd <= rateCons * 3.0) return;

    Core.app.post(() => {
      // I have to delay this or crash happens somehow, idk why
      ob.damagePierce(ob.maxHealth * (VAR.param.rpmDmgFrac + (rateAdd - rateCons * 3.0) / rateCons));
    });
    MDL_effect.fadeText(ob.x, ob.y, MDL_bundle.getInfo("lovec", "rpm-overload"), Pal.remove, ob.block.size * 0.5);
  };


  function comp_ex_updateTorFetchTgs(b) {
    if(b.block.delegee.skipTorFetch) return;

    b.torFetchTgs.clear();
    b.proximity.each(ob => {
      if(ob.block instanceof LiquidSource) {
        b.torFetchTgs.push(ob, 100.0 / 60.0);
      } else {
        if(ob.block instanceof MultiBlockLinkBlock) {
          ob = ob.linkedBuild;
        };
        let rateProd = MDL_recipeDict.getProdAmt(VARGEN.auxTor, ob.block);
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
      } else {
        if(ob.block instanceof MultiBlockLinkBlock) {
          ob = ob.linkedBuild;
        };
        if(ob.block.consumesLiquid(VARGEN.auxTor) || ob.block.consumesLiquid(VARGEN.auxRpm)) {
          b.torSupplyTgs.push(ob, MDL_recipeDict.getConsAmt(VARGEN.auxTor, ob.block));
        };
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
     * Handles methods related to torque and RPM.
     * @class INTF_BLK_torqueBlock
     */
    new CLS_interface("INTF_BLK_torqueBlock", {


      __paramObjM__: () => ({


        /**
         * `PARAM`: If true, this block cannot gain torque and RPM from producers.
         * @memberof INTF_BLK_torqueBlock
         * @instance
         */
        skipTorFetch: false,
        /**
         * `PARAM`: If true, this block cannot supply torque and RPM for consumers.
         * @memberof INTF_BLK_torqueBlock
         * @instance
         */
        skipTorSupply: false,
        /**
         * `PARAM`: How fast RPM drops to zero spontaneously.
         * @memberof INTF_BLK_torqueBlock
         * @instance
         */
        rpmDropRate: 0.002,


      }),


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_torqueBlock
     */
    new CLS_interface("INTF_B_torqueBlock", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torProg: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torCur: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torCap: -1.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        rpmCur: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torFetchTgs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torSupplyTgs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_torqueBlock
         * @instance
         */
        torTransTgs: tprov(() => []),


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
        INTFBFragTorqueBlock.setThis(this).ex_updateTor.call(INTFBFragTorqueBlock);
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
        INTFBFragTorqueBlock.setThis(this).ex_supplyTor.call(INTFBFragTorqueBlock);
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
       * `LATER`
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
        return INTFBFragTorqueBlock.setThis(this).ex_calcRpmTg.call(INTFBFragTorqueBlock);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * A cogwheel's transported RPM should be affected by block size, so this value should be dynamic.
       * <br> `LATER`
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
       * Extra multiplier on RPM transported to this building.
       * @memberof INTF_B_torqueBlock
       * @instance
       * @return {Building} b_f
       * @return {number}
       */
      ex_calcRpmAcceptScl: function(b_f) {
        return 1.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * `LATER`
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
          wr0rd,

          wr => {
            wr.f(this.rpmCur);
            wr.f(this.torCur);
          },

          rd => {
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
