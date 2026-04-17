/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.blendGroup = blk.parent;
      blk.speedMultiplier = blk.parent.speedMultiplier;
    };

    blk.ventSize = Math.round(Mathf.clamp(blk.ventSize, 1, 6));
    blk.offPon2s = MDL_pos.sizeOffsetPon2s[blk.ventSize];
    blk.offDraw = blk.ventSize % 2 === 0 ? 4.0 : 0.0;
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0env-ventsize"), "${1}x${1}".format(blk.ventSize));
  };


  function comp_drawBase(blk, t) {
    if(!blk.isCenterVent(t)) return;

    let ot;
    blk.offPon2s.forEachFast(pon2 => {
      ot = t.nearby(pon2);
      if(ot != null) blk.parent.drawBase(ot);
    });

    let z = Draw.z();
    Draw.z(VAR.layer.vent);
    Draw.rect(MDL_texture._regVari(blk, t), t.worldx() + blk.offDraw, t.worldy() + blk.offDraw);
    Draw.z(z);
  };


  function comp_isCenterVent(blk, t) {
    return t != null && blk.checkAdjacent(t);
  };


  function comp_renderUpdate(blk, renderState) {
    let t = renderState.tile;
    if(blk.isCenterVent(t)) {
      blk.ex_onVentUpdate(t, t.block() !== Blocks.air);
      if(t.block() === Blocks.air && (renderState.data += Time.delta) >= blk.effectSpacing) {
        blk.effect.at(t.worldx() + blk.offDraw, t.worldy() + blk.offDraw);
        renderState.data = 0.0;
      };
    };
  };


  function comp_checkAdjacent(blk, t) {
    let ot;
    let i = 0, iCap = blk.offPon2s.iCap();
    while(i < iCap) {
      ot = Vars.world.tile(t.x + blk.offPon2s[i].x, t.y + blk.offPon2s[i].y);
      if(ot == null || ot.floor() !== blk) return false;
      i++;
    };

    return true;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Handles dynamic vent size.
   * This will copy some properties from `parent`.
   * @class INTF_ENV_dynamicSizeVent
   */
  module.exports = new CLS_interface("INTF_ENV_dynamicSizeVent", {


    __PARAM_OBJ_SETTER__: () => ({


      /**
       * <PARAM>: Size of this vent block.
       * @memberof INTF_ENV_dynamicSizeVent
       * @instance
       */
      ventSize: 3,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof INTF_ENV_dynamicSizeVent
       * @instance
       */
      offPon2s: null,
      /**
       * <INTERNAL>
       * @memberof INTF_ENV_dynamicSizeVent
       * @instance
       */
      offDraw: 0.0,
      /**
       * <INTERNAL>
       * @memberof INTF_ENV_dynamicSizeVent
       * @instance
       */
      matGrp: "SPEC: use parent",


    }),


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


    drawBase: function(t) {
      comp_drawBase(this, t);
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


    isCenterVent: function(t) {
      return comp_isCenterVent(this, t);
    }
    .setProp({
      noSuper: true,
    }),


    renderUpdate: function(renderState) {
      comp_renderUpdate(this, renderState);
    }
    .setProp({
      noSuper: true,
    }),


    checkAdjacent: function(t) {
      return comp_checkAdjacent(this, t);
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * Called every frame (vent center only).
     * <br> <LATER>
     * @memberof INTF_ENV_dynamicSizeVent
     * @instance
     * @param {Tile} t
     * @param {boolean} isBlocked - Whether this vent is blocked by some block over it.
     * @return {void}
     */
    ex_onVentUpdate: function(t, isBlocked) {

    }
    .setProp({
      noSuper: true,
      argLen: 2,
    }),


  });
