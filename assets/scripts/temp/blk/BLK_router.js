/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Router, BLK_router>} BLKRouter
     */


    /**
     * @typedef {TemplateInstance<Router.RouterBuild, B_router>} BRouter
     * @prop {BLKRouter} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BRouter} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.nextToRouter = b.proximity.find(ob => MDL_cond.isClassicRouter(ob.block)) != null;
    };


    /**
     * @private
     * @param {BRouter} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.nextToRouter = false;
    };


    /**
     * @private
     * @param {BRouter} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.rsCur) {
            b.delegee.lastRs = b.items.first();
        };
    };


    /**
     * @private
     * @param {BRouter} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        b.delegee.lastRs = item;
        return true;
    };


    /**
     * @private
     * @param {BRouter} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        LCDraw.contentIcon(b.x, b.y, b.delegee.lastRs, b.block.size, 0.75);
        if(GLB_param.SHOULD_DRAW_ROUTER_HERESY && b.delegee.nextToRouter) {
            b.proximity.each(ob => {
                if(MDL_cond.isClassicRouter(ob.block)) {
                    LCDrawf.areaShrink(ob.tile, ob.block.size, Pal.remove);
                };
            });
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Router.
         * @class BLK_router
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_router")
        .initTemplate()
        .setParent(Router)
        .setTags()
        .setParam({})
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_router
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return false;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_router
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_router")
        .initTemplate()
        .setParent(Router.RouterBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_router
             * @instance
             * @type {Resource|null}
             */
            lastRs: null,
            /**
             * `INTERNAL`
             * @memberof B_router
             * @instance
             * @type {boolean}
             */
            nextToRouter: false,


        })
        .setMethod({


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                boolMode: "and",
            }),


            drawSelect: function() {
                comp_drawSelect(this);
            },


        }),


    ];
