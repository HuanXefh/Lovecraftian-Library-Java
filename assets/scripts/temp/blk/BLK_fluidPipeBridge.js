/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidBridge, BLK_fluidPipeBridge>} BLKFluidPipeBridge
     */


    /**
     * @typedef {TemplateInstance<LiquidBridge.LiquidBridgeBuild, B_fluidPipeBridge>} BFluidPipeBridge
     * @prop {BLKFluidPipeBridge} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
    const INTF_BLK_pressureBlock = require("lovec/temp/intf/INTF_BLK_pressureBlock");


    /* <------------------------------ auxiliary ------------------------------> */


    let
        /**
         * @private
         * @type {number}
         */
        i,
        /**
         * @private
         * @type {number}
         */
        iCap,
        /**
         * @private
         * @type {Tile|null}
         */
        ot,
        /**
         * @private
         * @type {Building|null}
         */
        ob,
        /**
         * @private
         * @type {number}
         */
        rot_f;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BFluidPipeBridge} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secFive) {
            b.onProximityUpdate();
        };
    };


    /**
     * @private
     * @param {BFluidPipeBridge} b
     * @return {void}
     */
    function comp_ex_updatePresFetchTargets(b) {
        b.delegee.presFetchTargets.clear();

        ot = GLB_var.world.tile(b.link);
        if(b.block.linkValid(b.tile, ot)) {
            // Find pressure sources only if bridge is connected
            rot_f = ot.build.relativeTo(b);
            i = 0;
            iCap = 4;
            while(i < iCap) {
                // Do not accept pressure from the facing side
                if(i === 2) {
                    i++;
                    continue;
                };

                ob = b.nearby((rot_f + i) % 4);
                if(
                    ob != null
                        && ob.team === b.team
                        && ob.ex_getPres != null
                        && b.self.ex_checkPresFetchValid(ob)
                ) {
                    b.delegee.presFetchTargets.push(ob);
                };
                i++;
            };
        } else {
            b.proximity.each(ob => {
                if(ob.ex_checkPresFetchValid != null && ob.self.ex_checkPresFetchValid(b)) {
                    b.delegee.presTransCount++;
                };
            });
        };

        // Treat other bridges as pressure sources
        b.incoming.each(posInt => {
            ob = GLB_var.world.build(posInt);
            if(
                ob != null
                    && ob.team === b.team
                    && ob.ex_getPres != null
            ) {
                b.delegee.presFetchTargets.push(ob);
            };
        });
    };


    /**
     * @private
     * @param {BFluidPipeBridge} b
     * @return {void}
     */
    function comp_ex_updatePresSupplyTargets(b) {
        if(b.block.linkValid(b.tile, GLB_var.world.tile(b.link))) {
            // Don't supply pressure if connected to another bridge
            b.delegee.presSupplyTargets.clear();
            return;
        };

        b.incoming.each(posInt => {
            ot = GLB_var.world.tile(posInt);
            if(ot == null) return;
            ob = b.nearby(SLCPos.getRotation(b.tile, ot));
            if(ob == null) return;
            b.delegee.presSupplyTargets.pull(ob);
        });
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Serpulo liquid bridge.
         * <br> `SINGLESIZE`
         * @class BLK_fluidPipeBridge
         * @extends BLK_baseFluidDistributor
         * @extends INTF_BLK_pressureBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidPipeBridge")
        .implement(INTF_BLK_pressureBlock[0])
        .initTemplate()
        .setParent("LiquidBridge")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
            * `INTERNAL`
            * <br> `REALIZED`
            * @override
            * @memberof BLK_fluidPipeBridge
            * @instance
            * @func
            */
            isPresRouter: true,


        })
        .setMethod({


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidPipeBridge
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isSingleSized: function() {
                return true;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


        /**
         * @class B_fluidPipeBridge
         * @extends B_baseFluidDistributor
         * @extends INTF_B_pressureBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidPipeBridge")
        .implement(INTF_BLK_pressureBlock[1])
        .initTemplate()
        .setParent("LiquidBridge.LiquidBridgeBuild")
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * @override
             * @memberof B_fluidPipeBridge
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresFetchTargets: function() {
                comp_ex_updatePresFetchTargets(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @override
             * @memberof B_fluidPipeBridge
             * @instance
             * @func
             * @return {void}
             */
            ex_updatePresSupplyTargets: function() {
                comp_ex_updatePresSupplyTargets(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof B_fluidPipeBridge
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkIsPresRouter: function() {
                return !this.block.linkValid(this.tile, GLB_var.world.tile(this.link));
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
