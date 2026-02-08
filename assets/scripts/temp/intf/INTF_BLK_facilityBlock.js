/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods that most factories and generators should have.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


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
    if(PARAM.updateSuppressed || b.block.delegee.skipFacilityMethod) return;

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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Whether auxiliary fluids in this block should be capped.
        shouldCapAux: true,
        // @PARAM: Whether auxiliary fluid should not be stored.
        shouldClearAuxOnStop: true,
        // @PARAM: Whether to skip facility block update.
        skipFacilityMethod: false,
        // @PARAM: Time before the building explodes due to nearby fire.
        fireExplodeCooldown: 360.0,

        canHandleAux: false,
        canFireExplode: false,
      }),


      init: function() {
        comp_init(this);
      },


      ex_checkHandleAuxPossible: function() {
        return MDL_recipeDict._hasAnyIo(VARGEN.auxs, this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_checkFireExplodePossible: function() {
        return MDL_recipeDict._hasAnyIo(VARGEN.exploItms, this) || MDL_recipeDict._hasAnyIo(VARGEN.exploFlds, this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        fireExplodeReady: false,
        fireExplodeCd: 0.0,
      }),


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
