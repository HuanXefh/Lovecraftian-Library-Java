/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles visibility of depth ore.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_texture = require("lovec/mdl/MDL_texture");


  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.needsSurface = false;
      if(blk.overlayAlpha.fEqual(1.0)) blk.overlayAlpha = 0.5;
      blk.useColor = false;
    };

    MDL_event._c_onWorldLoadStart(() => {
      blk.drawnMap.clear();
    });

    MDL_event._c_onDraw(() => {
      if(!Vars.state.isGame() || (!Vars.state.isEditor() && !PARAM.drawScannerResult)) return;

      processZ(VAR.lay_dporeRevealed);

      Draw.alpha(0.65);
      blk.drawnMap.each((t, cond) => {
        if(!cond || !MDL_cond._posVisible(t.worldx(), t.worldy(), 8.0)) return;
        Draw.rect(MDL_texture._regVari(blk, t), t.worldx(), t.worldy());
      });
      Draw.color();

      processZ(VAR.lay_dporeRevealed);
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0env-depthlvl"), blk.depthLvl);
  };


  function comp_drawBase(blk, t) {
    if(!Vars.state.isGame() && t instanceof EditorTile) {
      blk.super$drawBase(t);
    } else {
      blk.ex_accRevealed(t, t instanceof EditorTile);
    };
  };


  function comp_getDisplayIcon(blk, t) {
    return blk.ex_accRevealed(t, "read") ?
      blk.super$getDisplayIcon(t) :
      VARGEN.iconRegs.questionMark;
  };


  function comp_getDisplayName(blk, t) {
    return blk.ex_accRevealed(t, "read") ?
      blk.super$getDisplayName(t) :
      MDL_bundle._term("lovec", "unknown");
  };


  function comp_ex_getDepthName(blk) {
    return MDL_bundle._term.apply(null, DB_misc.db["block"]["depthName"].read(blk.depthLvl, ["lovec", "unknown"]))
  };


  function comp_ex_accRevealed(blk, t, param) {
    return param === "read" ?
      blk.drawnMap.get(t, false) :
      blk.drawnMap.put(t, param);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = new CLS_interface({


    __PARAM_OBJ_SETTER__: () => ({
      // @PARAM: How deep the overlay is, related to scanner tier.
      depthLvl: 0,

      drawnMap: prov(() => new ObjectMap()),
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


    getDisplayIcon: function(t) {
      return comp_getDisplayIcon(this, t);
    }
    .setProp({
      noSuper: true,
    }),


    getDisplayName: function(t) {
      return comp_getDisplayName(this, t);
    }
    .setProp({
      noSuper: true,
    }),


    ex_getDepthName: function() {
      return comp_ex_getDepthName(this);
    }
    .setProp({
      noSuper: true,
    }),


    ex_accRevealed: function(t, param) {
      return comp_ex_accRevealed(this, t, param);
    }
    .setProp({
      noSuper: true,
    }),


  });
