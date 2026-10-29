/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor, BLK_cable>} BLKCable
     */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor.ArmoredConveyorBuild, B_cable>} BCable
     * @prop {BLKCable} block
     */


    const PARENT = require("lovec/temp/blk/BLK_basePowerTransmitter");
    const INTF_BLK_graphBlock = require("lovec/temp/intf/INTF_BLK_graphBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKCable} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.cableUpdater = new BLKCableUpdater(blk);

        blk.conductivePower = true;
        blk.connectedPower = false;
        blk.pushUnits = false;
        blk.junctionReplacement = null;
        blk.bridgeReplacement = null;
    };


    /**
     * @private
     * @param {BLKCable} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.itemsMoved);
    };


    /**
     * @private
     * @param {BLKCable} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.addBar("power", PowerNode.makePowerBalance());
        blk.addBar("batteries", PowerNode.makeBatteryBalance());
    };


    /**
     * @private
     * @param {BCable} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.self.ex_updateGraph();
    };


    /**
     * @private
     * @param {BCable} b
     * @param {Unit} unit
     * @return {void}
     */
    function comp_unitOn(b, unit) {
        if(
            !Vars.net.client()
                && b.power != null && b.power.status > 0.1
                && b.block.delegee.canShortCircuit && Mathf.chanceDelta(0.03) && MDL_cond.isUnitWet(unit)
        ) {
            FRAG_attack.lightning_global(b.x, b.y, null, null, null, 6, 4, null, "ground");
            BOX_trigger.wetStepOnCable.fire();
        };
    };


    /**
     * @private
     * @param {BCable} b
     * @param {BLKCable} blk
     * @param {Team} team
     * @return {void}
     */
    function comp_ex_justCreated(b, blk, team) {
        b.delegee.cableBuildUpdater = new BCableUpdater(blk.delegee.cableUpdater, b);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * A block that conducts power.
         * Cables with equivalent safe power levels will be grouped in the same graph, thus updating only once per frame.
         * <br> `SINGLESIZE`
         * <br> `DEDICATION`: Inspired by Asthosus.
         * @class BLK_cable
         * @extends BLK_basePowerTransmitter
         * @extends INTF_BLK_graphBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_cable")
        .implement(INTF_BLK_graphBlock[0])
        .initTemplate()
        .setParent("ArmoredConveyor")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_cable
             * @instance
             * @type {LCContentUpdater<ArmoredConveyor>}
             */
            cableUpdater: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_cable
             * @instance
             * @type {string}
             */
            graphType: "cable",
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_cable
             * @instance
             * @type {boolean}
             */
            isNoRotGraph: true,


            /* <------------------------------ vanilla ------------------------------> */


            enableDrawStatus: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            outputsItems: function() {
                return true;
            }
            .setProp({
                noSuper: true,
            }),


            blends: function() {
                return this.delegee.cableUpdater.blends.apply(this.delegee.cableUpdater, arguments);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_cable
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
         * @class B_cable
         * @extends B_basePowerTransmitter
         * @extends INTF_B_graphBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_cable")
        .implement(INTF_BLK_graphBlock[1])
        .initTemplate()
        .setParent("ArmoredConveyor.ArmoredConveyorBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_cable
             * @instance
             * @type {LCBuildUpdater<ArmoredConveyor.ArmoredConveyorBuild, ArmoredConveyor>}
             */
            cableBuildUpdater: null,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
                override: true,
                final: true,
            }),


            unitOn: function(unit) {
                comp_unitOn(this, unit);
            },


            acceptItem: function(b_f, item) {
                return false;
            }
            .setProp({
                noSuper: true,
                override: true,
                final: true,
            }),


            acceptStack: function(item, amt, e_f) {
                return 0;
            }
            .setProp({
                noSuper: true,
                override: true,
                final: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_cable
             * @instance
             * @func
             * @param {BLKCable} blk
             * @param {Team} team
             * @return {void}
             */
            ex_justCreated: function(blk, team) {
                comp_ex_justCreated(this, blk, team);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * @override
             * @memberof B_cable
             * @instance
             * @func
             * @return {number}
             */
            ex_getTransmitterOverloadFrac: function() {
                return Vars.state.isEditor() ? 0.0 : this.self.ex_getGraphProp("overloadFrac", 0.0);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @memberof B_cable
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_isSameGraphType: function(ob) {
                return ob.ex_getMaxPowProdAllowed != null && this.self.ex_getMaxPowProdAllowed().fEqual(ob.self.ex_getMaxPowProdAllowed());
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
                argLen: 1,
            }),


            /**
             * @override
             * @memberof B_cable
             * @instance
             * @func
             * @return {boolean}
             */
            ex_isExpiredVert: function() {
                return this.delegee.graphCur.graphData != null && !this.self.ex_getMaxPowProdAllowed().fEqual(this.delegee.graphCur.graphData.maxPowProdAllowed);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


        }),


    ];
