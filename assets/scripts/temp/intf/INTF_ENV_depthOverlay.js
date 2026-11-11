/*
  ================================================================================
  Section: Definition
  ================================================================================
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

        BOX_trigger.mapExit.addGlobalListener(() => {
            blk.delegee.depthDrawnMap.clear();
        });

        MDL_event.onDraw(() => {
            if(!Vars.state.isGame() || (!Vars.state.isEditor() && !GLB_param.SHOULD_DRAW_SCANNER_RESULT)) return;
            SLCDrawf.depthOverlay(blk.delegee.depthDrawnMap, blk);
        });
        MDL_event.onOverlayChange((t, ovPrev, ov) => {
            if(ovPrev === blk && ov !== blk) {
                blk.delegee.depthDrawnMap.put(t, false);
            };
        });
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0env-depthlvl"), blk.delegee.depthLvl);
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(checkSubInsOfTemp(blk, "INTF_ENV_largeBlock")) {
            if(!blk.self.ex_drawLarge(t.x, t.y)) {
                blk.self.ex_drawDepth(t);
            };
            return;
        };
        blk.self.ex_drawDepth(t);
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {TextureRegion}
     */
    function comp_getDisplayIcon(blk, t) {
        return blk.self.ex_accRevealed(t, "SPEC: read") ?
            blk.super$getDisplayIcon(t) :
            GLB_varGen.iconRegs.questionMark;
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {string}
     */
    function comp_getDisplayName(blk, t) {
        return blk.self.ex_accRevealed(t, "SPEC: read") ?
            blk.super$getDisplayName(t) :
            MDL_bundle.getTerm("lovec", "unknown");
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @return {string}
     */
    function comp_ex_getDepthName(blk) {
        return MDL_bundle.getTerm.apply(null, DB_misc.db["block"]["depthName"].read(blk.delegee.depthLvl, ["lovec", "unknown"]))
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @param {boolean|string} param
     * @return {boolean}
     */
    function comp_ex_accRevealed(blk, t, param) {
        return param === "SPEC: read" ?
            blk.delegee.depthDrawnMap.get(t, false) :
            blk.delegee.depthDrawnMap.put(t, param);
    };


    /**
     * @private
     * @param {INTFENVDepthOverlay} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_ex_drawDepth(blk, t) {
        if(!Vars.state.isGame() && t instanceof EditorTile) {
            blk.super$drawBase(t);
        } else {
            blk.self.ex_accRevealed(t, t instanceof EditorTile);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
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
                 * @default 0
                 */
                depthLvl: 0,


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`
                 * @memberof INTF_ENV_depthOverlay
                 * @instance
                 * @type {TDynamic<ObjectMap<Tile, boolean>>}
                 */
                depthDrawnMap: tprov(() => new ObjectMap()),


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


        /**
         * @memberof INTF_ENV_depthOverlay
         * @instance
         * @func
         * @param {Tile} t
         * @return {void}
         */
        ex_drawDepth: function(t) {
            comp_ex_drawDepth(this, t);
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
