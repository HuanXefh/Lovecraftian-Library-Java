/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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
      if(!Vars.state.isGame() || (!Vars.state.isEditor() && !PARAM.SHOULD_DRAW_SCANNER_RESULT)) return;

      processZ(VAR.layer.deporeRevealed);

      Draw.alpha(0.65);
      blk.drawnMap.each((t, cond) => {
        if(!cond || !LCCheck.checkPosVisible(t.worldx(), t.worldy(), 8.0)) return;
        Draw.rect(MDL_texture._regVari(blk, t), t.worldx(), t.worldy());
      });
      Draw.color();

      processZ();
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


  /**
   * Handles visibility of depth ore.
   * @class INTF_ENV_depthOverlay
   */
  module.exports = new CLS_interface("INTF_ENV_depthOverlay", {


    __PARAM_OBJ_SETTER__: () => ({


      /**
       * <PARAM>: How deep the overlay is, related to scanner tier.
       * @memberof INTF_ENV_depthOverlay
       * @instance
       */
      depthLvl: 0,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof INTF_ENV_depthOverlay
       * @instance
       */
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


    /**
     * @memberof INTF_ENV_depthOverlay
     * @instance
     * @return {string}
     */
    ex_getDepthName: function() {
      return comp_ex_getDepthName(this);
    }
    .setProp({
      noSuper: true,
    }),


    /**
     * @memberof INTF_ENV_depthOverlay
     * @instance
     * @param {Tile} t
     * @param {string|boolean} param
     * @return {boolean}
     */
    ex_accRevealed: function(t, param) {
      return comp_ex_accRevealed(this, t, param);
    }
    .setProp({
      noSuper: true,
    }),


  });
