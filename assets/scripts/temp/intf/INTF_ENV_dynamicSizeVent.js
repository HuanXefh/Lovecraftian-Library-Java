/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_ENV_dynamicSizeVent>} INTFENVDynamicSizeVent
     */


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {number}
     */
    const DARK_LERP_A = 0.2;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.blendGroup = blk.parent;
        if(blk.setupVanillaProp) {
            blk.speedMultiplier = blk.parent.speedMultiplier;
        };

        blk.ventSize = Math.round(Mathf.clamp(blk.ventSize, 1, 6));
        blk.ventOffs = LCPos.sizeOffs[blk.ventSize];
        blk.ventOffDraw = blk.ventSize % 2 === 0 ? 4.0 : 0.0;

        if(blk.parent !== Blocks.air) {
            // Set vent color to darkened version of floor color
            blk.mapColor = blk.parent.mapColor.cpy().lerp(Color.black, DARK_LERP_A);
        };
    };


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0env-ventsize"), "${1}x${1}".format(blk.ventSize));
    };


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(!blk.isCenterVent(t)) return;

        let ot;
        blk.ventOffs.forEachFast(pon2 => {
            ot = t.nearby(pon2);
            if(ot != null) {
                blk.parent.drawBase(ot);
            };
        }, true);

        processZ(VAR.layer.vent);
        Draw.rect(MDL_texture.getRegVari(blk, t), t.worldx() + blk.ventOffDraw, t.worldy() + blk.ventOffDraw);
        processZ(null);
    };


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @param {Tile} t
     * @return {boolean}
     */
    function comp_isCenterVent(blk, t) {
        return t != null && blk.checkAdjacent(t);
    };


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @param {Floor.UpdateRenderState} renderState
     * @return {void}
     */
    function comp_renderUpdate(blk, renderState) {
        let t = renderState.tile;
        if(blk.isCenterVent(t)) {
            blk.ex_onVentUpdate(t, t.block() !== Blocks.air);
            if(t.block() === Blocks.air && (renderState.data += Time.delta) >= blk.effectSpacing) {
                blk.effect.at(t.worldx() + blk.ventOffDraw, t.worldy() + blk.ventOffDraw);
                renderState.data = 0.0;
            };
        };
    };


    /**
     * @private
     * @param {INTFENVDynamicSizeVent} blk
     * @param {Tile} t
     * @return {boolean}
     */
    function comp_checkAdjacent(blk, t) {
        let
            i = 0,
            iCap = blk.ventOffs.iCap(),
            ot;

        while(i < iCap) {
            ot = Vars.world.tile(t.x + blk.ventOffs[i].x, t.y + blk.ventOffs[i].y);
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
     * Will copy some properties from `parent`.
     * @class INTF_ENV_dynamicSizeVent
     */
    module.exports = new CLS_interface("INTF_ENV_dynamicSizeVent", {


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: Size of this vent block.
                 * @memberof INTF_ENV_dynamicSizeVent
                 * @instance
                 * @type {number}
                 */
                ventSize: 3,


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`: Offsets for checking vent center.
                 * @memberof INTF_ENV_dynamicSizeVent
                 * @instance
                 * @type {Array<Point2>}
                 */
                ventOffs: null,
                /**
                 * `INTERNAL`: Offset for drawing vent.
                 * @memberof INTF_ENV_dynamicSizeVent
                 * @instance
                 * @type {number}
                 */
                ventOffDraw: 0.0,
                /**
                 * `INTERNAL`: Vents use material group of the parent floor.
                 * <br> `REALIZED`
                 * @override
                 * @memberof INTF_ENV_dynamicSizeVent
                 * @instance
                 * @type {string}
                 */
                matGrp: "SPEC: use parent",


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
         * <br> `LATER`
         * @memberof INTF_ENV_dynamicSizeVent
         * @instance
         * @func
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
