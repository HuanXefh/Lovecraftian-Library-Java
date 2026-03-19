/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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
    if(PARAM.updateSuppressed) return;

    let liqCur = b.liquids == null ? null : b.liquids.current();

    // Handle auxiliary liquids
    if(b.liquids != null && TIMER.sec && b.block.delegee.canHandleAux) {
      b.liquids.each(liq => {
        if(!MDL_cond._isAuxiliaryFluid(liq)) return;
        if(b.efficiency < 0.0001 && b.block.delegee.shouldClearAuxOnStop) {
          b.liquids.set(liq, 0.0);
          return;
        };
        if(b.block.delegee.shouldCapAux && !MDL_cond._isNoCapAuxiliaryFluid(liq) && b.liquids.get(liq) > VAR.ct_auxCap) {
          b.liquids.set(liq, VAR.ct_auxCap);
        };
      });
    };

    if(b.block.delegee.skipFacilityMethod) return;

    // Explode if near fire
    if(Vars.state.rules.reactorExplosions && b.block.delegee.canFireExplode) {
      if(Mathf.chanceDelta(0.005)) {
        b.fireExplodeReady = !Vars.net.client()
          && (thisFun.checkExplosiveLiquid(b, liqCur) || thisFun.checkExplosiveItem(b))
          && MDL_pos._tsEdge(b.tile, b.block.size, false, thisFun.tmpTs).some(ot => Fires.get(ot.x, ot.y) != null);
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
    checkExplosiveLiquid: function(b, liqCur) {
      return b.liquids != null && VARGEN.exploFlds.includes(liqCur);
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
         * <PARAM>: Whether auxiliary fluids should not be stored in this block.
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        shouldClearAuxOnStop: true,
        /**
         * <PARAM>: Whether to skip facility block update.
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
         * <INTERNAL>
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        canHandleAux: false,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_facilityBlock
         * @instance
         */
        canFireExplode: false,


      }),


      init: function() {
        comp_init(this);
      },


      /**
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
