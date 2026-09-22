/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Block, ENV_baseTree>} ENVBaseTree
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ auxiliary ------------------------------ */


    /**
     * @private
     * @type {F2Array<string, TreeData>}
     */
    const TREE_PARAMS = DB_env.db["grpParam"]["tree"];


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.floating = true;
        blk.placeableLiquid = true;

        let treeGrp = blk.treeGrp;
        blk.drawTup = [
            Mathf.clamp(blk.layTree, 76.0, 80.0),
            readParam(TREE_PARAMS.read(treeGrp), "scl", 1.0),
            readParam(TREE_PARAMS.read(treeGrp), "mag", 1.0),
            readParam(TREE_PARAMS.read(treeGrp), "wob", 1.0),
        ];

        MDL_event.onLoad(() => {
            if(!Vars.headless && !blk.shadow.found()) LCLogHandler.log("noCustomShadowRegionFound", blk.name);
        });
    };


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @return {void}
     */
    function comp_setStats(blk) {
        let treeGrp = blk.treeGrp;
        if(treeGrp !== "none") {
            blk.stats.add(fetchStat("lovec", "blk0env-treetype"), MDL_bundle.getTerm("lovec", treeGrp));
        };
        let rsLvl = FRAG_faci.getTreeRsLvl(blk);
        if(rsLvl > 0.0) {
            blk.stats.add(fetchStat("lovec", "blk0env-rslvl"), rsLvl.perc());
        };
    };


    /**
     * @private
     * @param {ENVBaseTree} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        LCDrawf.tree(blk.region, blk.shadow, t, blk.treeRad, blk.shadowOffset, blk.drawTup[1], blk.drawTup[2], blk.drawTup[3], PARAM.TREE_ALPHA, blk.drawTup[0], PARAM.SHOULD_DRAW_WOBBLE, PARAM.SHOULD_CHECK_TREE_DISTANCE);
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
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseTree")
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
        /**
         * `PARAM`: Whether this tree can hide units.
         * @memberof ENV_baseTree
         * @instance
         * @type {boolean}
         */
        hidable: false,


        /* <------------------------------ internal ------------------------------ */


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
         * @type {[number, number, number, number]}
         */
        drawTup: null,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function() {
            comp_setStats(this);
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


    });
