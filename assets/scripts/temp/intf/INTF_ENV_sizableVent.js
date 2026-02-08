/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles dynamic vent size.
   * Copys some properties of the parent.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_texture = require("lovec/mdl/MDL_texture");


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
    blk.stats.add(fetchStat("lovec", "blk0env-ventsize"), "[$1]x[$1]".format(blk.ventSize));
  };


  function comp_drawBase(blk, t) {
    if(!blk.isCenterVent(t)) return;

    let ot;
    blk.offPon2s.forEachFast(pon2 => {
      ot = t.nearby(pon2);
      if(ot != null) blk.parent.drawBase(ot);
    });

    let z = Draw.z();
    Draw.z(VAR.lay_vent);
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


  module.exports = new CLS_interface({


    __PARAM_OBJ_SETTER__: () => ({
      // @PARAM: Size of the vent.
      ventSize: 3,

      offPon2s: null,
      offDraw: 0.0,
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


    /* ----------------------------------------
     * NOTE:
     *
     * @LATER
     * Called every frame for the vent (center tile only).
     * ---------------------------------------- */
    ex_onVentUpdate: function(t, isBlocked) {

    }
    .setProp({
      noSuper: true,
      argLen: 2,
    }),


  });
