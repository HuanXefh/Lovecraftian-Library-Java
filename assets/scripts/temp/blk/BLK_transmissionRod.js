/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_transmissionRod>} BLKTransmissionRod
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_transmissionRod>} BTransmissionRod
     * @prop {BLKTransmissionRod} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseTorqueBlock");
    const INTF_BLK_graphBlock = require("lovec/temp/intf/INTF_BLK_graphBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKTransmissionRod} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.transport;
        blk.rotate = true;
        blk.update = true;
        blk.drawDisabled = true;
        blk.drawCached = false;
        blk.drawDynamic = true;
    };


    /**
     * @private
     * @param {BLKTransmissionRod} blk
     * @return {void}
     */
    function comp_load(blk) {
        // noinspection JSValidateTypes
        blk.delegee.rodRegs = fetchRegions(blk, "-frame", 2, blk.delegee.rodFrameAmt);
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {BLKTransmissionRod} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(blk.delegee.maxRodAmt >= 0) {
            stats.add(Stat.range, blk.delegee.maxRodAmt, StatUnit.blocks);
        };
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_created(b) {
        MDL_event.onDelayRun(0.0, () => {
            BOX_trigger.torqueBlockLink.addListener(ob => b.delegee.rodProg = 0.0);
            BOX_trigger.torqueBlockConfigure.addListener(ob => b.delegee.rodProg = 0.0);
        });
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.delegee.isVerticalRod = Mathf.mod(b.rotation, 2) !== 0;
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_updateTile(b) {
        b.delegee.rodProg += b.block.delegee.rodFrameAmt * b.delegee.rpmCur.roundFixed(1) * Time.delta;

        if(GLB_timer.sec && b.block.delegee.maxRodAmt >= 0 && b.delegee.rpmCur > 1.0 && b.delegee.graphCur != null && b.delegee.graphCur.getSize() > b.block.delegee.maxRodAmt) {
            Core.app.post(() => {
                b.damagePierce(b.maxHealth * GLB_var.param.excessTorRodDmgFrac * 60.0 + (b.delegee.graphCur.getSize() - b.block.delegee.maxRodAmt) * GLB_var.param.excessTorRodDmg);
            });
        };
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_draw(b) {
        SLCDrawf.frame(
            b.x, b.y,
            b.block.delegee.rodRegs[b.delegee.isVerticalRod ? 1 : 0],
            b.delegee.rodProg, 240.0,
        );
        if(b.block.delegee.sideReg1.found() && b.block.delegee.sideReg2.found()) {
            Draw.rect(b.delegee.isVerticalRod ? b.block.delegee.sideReg2 : b.block.delegee.sideReg1, b.x, b.y);
        };
    };


    /**
     * @private
     * @param {BTransmissionRod} b
     * @return {void}
     */
    function comp_ex_updateTorTransTargets(b) {
        b.delegee.torTransTargets.clear();
        let ob = b.back();
        if(
            ob != null && ob.team === b.team
                && (
                    MDL_cond.isTransmissionRod(ob.block) ?
                        b.delegee.isVerticalRod === ob.delegee.isVerticalRod :
                        MDL_cond.isGearBox(ob.block)
                )
        ) {
            b.delegee.torTransTargets.push(ob);
        };
        ob = b.front();
        if(
            ob != null && ob.team === b.team
                && (
                    MDL_cond.isTransmissionRod(ob.block) ?
                        b.delegee.isVerticalRod === ob.delegee.isVerticalRod :
                        MDL_cond.isGearBox(ob.block)
                )
        ) {
            b.delegee.torTransTargets.push(ob);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * An axial torque transmitter.
         * Better than cogwheel for long-range torque transfer.
         * <br> `SINGLESIZE`
         * @class BLK_transmissionRod
         * @extends BLK_baseTorqueBlock
         * @extends INTF_BLK_graphBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_transmissionRod")
        .implement(INTF_BLK_graphBlock[0])
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-tor-rod", "blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Maximum rods allowed to link.
             * @memberof BLK_transmissionRod
             * @instance
             * @type {number}
             * @default 10
             */
            maxRodAmt: 10,
            /**
             * `PARAM`: Amount of frames for the rod sprite.
             * @memberof BLK_transmissionRod
             * @instance
             * @type {number}
             * @default 8
             */
            rodFrameAmt: 8,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_transmissionRod
             * @instance
             * @type {TDynamic<D2Array<TextureRegion>>}
             */
            rodRegs: null,
            /**
             * `INTERNAL`
             * @memberof BLK_transmissionRod
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_transmissionRod
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {string}
             */
            graphType: "torque-rod",
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {boolean}
             */
            isNoRotGraph: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {boolean}
             */
            skipTorFetch: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
             * @instance
             * @type {boolean}
             */
            skipTorSupply: true,


            /* <------------------------------ vanilla ------------------------------> */


            underBullets: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_transmissionRod
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
         * @class B_transmissionRod
         * @extends B_baseTorqueBlock
         * @extends INTF_B_graphBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_transmissionRod")
        .implement(INTF_BLK_graphBlock[1])
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_transmissionRod
             * @instance
             * @type {number}
             */
            rodProg: 0.0,
            /**
             * `INTERNAL`
             * @memberof B_transmissionRod
             * @instance
             * @type {boolean}
             */
            isVerticalRod: false,


        })
        .setMethod({


            created: function() {
                comp_created(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            }
            .setProp({
                insert: true,
            }),


            updateTile: function() {
                comp_updateTile(this);
            },


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_transmissionRod
             * @instance
             * @func
             * @return {void}
             */
            ex_updateTorTransTargets: function() {
                comp_ex_updateTorTransTargets(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @override
             * @memberof B_transmissionRod
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_isSameGraphType: function(ob) {
                return tryJsProp(ob, "isVerticalRod", null) === this.delegee.isVerticalRod && (this.front() === ob || this.back() === ob);
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
                argLen: 1,
            }),


        }),


    ];
