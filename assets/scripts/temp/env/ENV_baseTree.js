/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, ENV_baseTree>} ENVBaseTree
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");
    const INTF_ENV_unitHider = require("lovec/temp/intf/INTF_ENV_unitHider");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @type {F2Array<string, TreeData>}
     */
    const TREE_PARAMS = DB_env.db["grpParam"]["tree"];


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.floating = true;
        blk.placeableLiquid = true;

        let treeGrp = blk.delegee.treeGrp;
        blk.delegee.drawTup = [
            Mathf.clamp(blk.delegee.layTree, 76.0, 80.0),
            readParam(TREE_PARAMS.read(treeGrp), "scl", 1.0),
            readParam(TREE_PARAMS.read(treeGrp), "mag", 1.0),
            readParam(TREE_PARAMS.read(treeGrp), "wob", 1.0),
        ];

        MDL_event.onLoad(() => {
            if(!Vars.headless && !blk.shadow.found()) {
                LCLogHandler.log("noCustomShadowRegionFound", blk.name);
            };
        });
    };


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        let treeGrp = blk.delegee.treeGrp;
        if(treeGrp !== "none") {
            stats.add(fetchStat("lovec", "blk0env-treetype"), MDL_bundle.getTerm("lovec", treeGrp));
        };
        let rsLvl = FRAG_faci.getTreeRsLvl(blk);
        if(rsLvl > 0.0) {
            stats.add(fetchStat("lovec", "blk0env-rslvl"), rsLvl.perc());
        };
    };


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        LCDrawf.tree(blk.region, blk.shadow, t, blk.delegee.treeRad, blk.shadowOffset, blk.delegee.drawTup[1], blk.delegee.drawTup[2], blk.delegee.drawTup[3], GLB_param.TREE_ALPHA, blk.delegee.drawTup[0], GLB_param.SHOULD_DRAW_WOBBLE, GLB_param.SHOULD_CHECK_TREE_DISTANCE);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Base template for most tall vegetation.
     * No variants!
     * @class ENV_baseTree
     * @extends ENV_baseProp
     * @extends INTF_ENV_unitHider
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseTree")
    .implement(INTF_ENV_unitHider)
    .initTemplate()
    .setParent(null)
    .setTags("env-tree")
    .setParam({


        /**
         * `PARAM`: Layer of the tree.
         * @memberof ENV_baseTree
         * @instance
         * @type {number}
         */
        layTree: 76.0,
        /**
         * `PARAM`: Visual radius of the tree.
         * @memberof ENV_baseTree
         * @instance
         * @type {number}
         */
        treeRad: 0.0,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * @memberof ENV_baseTree
         * @instance
         * @type {string}
         */
        treeGrp: "none",
        /**
         * `INTERNAL`
         * <br> `TUP`: z, scl, mag, wob.
         * @memberof ENV_baseTree
         * @instance
         * @type {Tup4<number, number, number, number>}
         */
        drawTup: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


        canReplace: function(oblk) {
            if(oblk.alwaysReplace) return true;
            if(oblk.privileged) return false;

            return oblk.size === this.size && (
                oblk instanceof StaticWall
                    || oblk instanceof TallBlock
                    || checkSubInsOfTemp(oblk, "ENV_baseTree")
            );
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


        drawBase: function(t) {
            comp_drawBase(this, t);
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


        /**
         * `REALIZED`
         * @override
         * @memberof ENV_baseTree
         * @instance
         * @func
         * @param {number} tx
         * @param {number} ty
         * @return {number}
         */
        ex_getHideRad: function(tx, ty) {
            return this.delegee.treeRad;
        }
        .setProp({
            noSuper: true,
            override: true,
            argLen: 2,
        }),


    });
