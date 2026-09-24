/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<OverlayFloor, INTF_ENV_depthOverlay>} INTFENVDepthOverlay
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.useColor = false;

        TRIGGER.mapExit.addGlobalListener(() => {
            blk.drawnMap.clear();
        });

        MDL_event.onDraw(() => {
            if(!Vars.state.isGame() || (!Vars.state.isEditor() && !PARAM.SHOULD_DRAW_SCANNER_RESULT)) return;

            processZ(VAR.layer.dporeRevealed, 4);
            Draw.alpha(0.65);
            blk.drawnMap.each((t, cond) => {
                if(!cond || !LCCheck.checkPosVisible(t.worldx(), t.worldy(), 8.0)) return;
                Draw.rect(MDL_texture.getRegVari(blk, t), t.worldx(), t.worldy());
            });
            Draw.color();
            processZ(null, 4);
        });
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0env-depthlvl"), blk.depthLvl);
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(!Vars.state.isGame() && t instanceof EditorTile) {
            blk.super$drawBase(t);
        } else {
            blk.ex_accRevealed(t, t instanceof EditorTile);
        };
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {TextureRegion}
     */
    function comp_getDisplayIcon(blk, t) {
        return blk.ex_accRevealed(t, "read") ?
            blk.super$getDisplayIcon(t) :
            VARGEN.iconRegs.questionMark;
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {string}
     */
    function comp_getDisplayName(blk, t) {
        return blk.ex_accRevealed(t, "read") ?
            blk.super$getDisplayName(t) :
            MDL_bundle.getTerm("lovec", "unknown");
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @return {string}
     */
    function comp_ex_getDepthName(blk) {
        return MDL_bundle.getTerm.apply(null, DB_misc.db["block"]["depthName"].read(blk.depthLvl, ["lovec", "unknown"]))
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @param {boolean|string} param
     * @return {boolean}
     */
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


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: How deep the overlay is, related to scanner tier.
                 * @memberof INTF_ENV_depthOverlay
                 * @instance
                 * @type {number}
                 */
                depthLvl: 0,


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`
                 * @memberof INTF_ENV_depthOverlay
                 * @instance
                 * @type {TDynamic<ObjectMap<Tile, boolean>>}
                 */
                drawnMap: tprov(() => new ObjectMap()),


                /* <------------------------------ vanilla ------------------------------> */


                needsSurface: false,
                overlayAlpha: 0.5,


            };
        },


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
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
         * @func
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
         * @func
         * @param {Tile} t
         * @param {string|boolean} param
         * @return {boolean}
         */
        ex_accRevealed: function(t, param) {
            return comp_ex_accRevealed(this, t, param);
        }
        .setProp({
            noSuper: true,
            argLen: 2,
        }),


    });
