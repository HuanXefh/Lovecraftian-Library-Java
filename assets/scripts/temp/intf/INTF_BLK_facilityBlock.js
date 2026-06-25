/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxiliary ----------> */


  let
    cond;


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      Time.run(20.0, () => {
        blk.canHandleAux = blk.ex_checkHandleAuxPossible();
        blk.canFireExplode = blk.ex_checkFireExplodePossible();
      });
    });
  };


  const comp_updateTile = function thisFun(b) {
    if(PARAM.UPDATE_SUPPRESSED || DEBUG.skipFacilityUpdate) return;

    // Handle auxiliary liquids
    if(b.liquids != null && TIMER.secTwo && b.block.delegee.canHandleAux) {
      b.liquids.each(liq => {
        if(!MDL_cond._isAuxiliaryFluid(liq)) return;
        if(b.efficiency < 0.0001 && b.block.delegee.shouldClearAuxOnStop) {
          b.liquids.set(liq, 0.0);
          return;
        };
        if(b.block.delegee.shouldCapAux && !MDL_cond._isNoCapAuxiliaryFluid(liq) && b.liquids.get(liq) > VAR.param.auxCap) {
          b.liquids.set(liq, VAR.param.auxCap);
        };
      });
    };

    if(b.block.delegee.skipFacilityMethod) return;

    // Explode if near fire
    if(!Vars.net.client() && Vars.state.rules.reactorExplosions && b.block.delegee.canFireExplode) {
      if(Mathf.chanceDelta(0.005)) {
        // Fire group is not spatial, I can't enhance this
        b.fireExplodeReady = !Vars.net.client()
          && Groups.fire.size() > 0 && MDL_pos._tsEdge(thisFun.tmpTs, b.tile, b.block.size, false).some(ot => Fires.get(ot) != null)
          && (thisFun.checkExplosiveLiquid(b) || thisFun.checkExplosiveItem(b));
      };
      if(b.fireExplodeReady) {
        b.fireExplodeCd += Time.delta;
        if(Mathf.chanceDelta(0.4)) EFF.fireExplodeSmog.at(b);
      } else {
        b.fireExplodeCd = Mathf.maxZero(b.fireExplodeCd - Time.delta);
      };
      if(b.fireExplodeCd >= b.block.delegee.fireExplodeCooldown) {
        TRIGGER.buildingFireExplosion.fire(b);
        FRAG_attack._a_explosion_global(
          b.x, b.y,
          FRAG_attack._presExploDmg(b.block.size),
          FRAG_attack._presExploRad(b.block.size),
          8.0,
        );
      };
    };
  }
  .setProp({
    tmpTs: [],
    checkExplosiveLiquid: function(b) {
      if(b.liquids == null) return false;
      cond = false;
      b.liquids.each(liq => {
        if(cond) return;
        cond = VARGEN.exploFlds.includes(liq);
      });
      return cond;
    },
    checkExplosiveItem: function(b) {
      return b.items == null ? false : VARGEN.exploItms.some(itm => b.items.has(itm));
    },
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods that most factories and generators should have.
     * @class INTF_BLK_facilityBlock
     */
    new CLS_interface("INTF_BLK_facilityBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Whether auxiliary fluids in this block should be capped.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        shouldCapAux: true,
        /**
         * <PARAM>: Whether auxiliary fluids should not be stored in this block when it's inactive.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        shouldClearAuxOnStop: true,
        /**
         * <PARAM>: Whether to skip facility block update entirely.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        skipFacilityMethod: false,
        /**
         * <PARAM>: Time before explosion due to nearby fire.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        fireExplodeCooldown: 360.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Whether this block is possible to obtain auxiliary fluids.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        canHandleAux: false,
        /**
         * <INTERNAL>: Whether this block is possible to obtain flammable/explosive fluids.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        canFireExplode: false,


      }),


      init: function() {
        comp_init(this);
      },


      /**
       * Sets up {@link INTF_BLK_facilityBlock#canHandleAux}.
       * @memberof INTF_BLK_facilityBlock
       * @instance
       * @return {boolean}
       */
      ex_checkHandleAuxPossible: function() {
        return MDL_recipeDict._hasAnyIo(VARGEN.auxs, this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Sets up {@link INTF_BLK_facilityBlock#canFireExplode}.
       * @memberof INTF_BLK_facilityBlock
       * @instance
       * @return {boolean}
       */
      ex_checkFireExplodePossible: function() {
        return MDL_recipeDict._hasAnyIo(VARGEN.exploItms, this) || MDL_recipeDict._hasAnyIo(VARGEN.exploFlds, this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_facilityBlock
     */
    new CLS_interface("INTF_B_facilityBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_facilityBlock
         * @instance
         */
        fireExplodeReady: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_facilityBlock
         * @instance
         */
        fireExplodeCd: 0.0,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
