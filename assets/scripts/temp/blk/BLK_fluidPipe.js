/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Conduit, BLK_fluidPipe>} BLKFluidPipe
     */


    /**
     * @typedef {TemplateInstance<Conduit.ConduitBuild, B_fluidPipe>} BFluidPipe
     * @prop {BLKFluidPipe} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");
    const INTF_BLK_pressureBlock = require("lovec/temp/intf/INTF_BLK_pressureBlock");
    const INTF_BLK_transportBlockSideDisplay = require("lovec/temp/intf/INTF_BLK_transportBlockSideDisplay");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidPipe} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.fluidPipeUpdater = new BLKFluidPipeUpdater(blk);

        if(blk.delegee.isShortCircuitPipe) {
            blk.conductivePower = false;
            blk.connectedPower = false;
            blk.enableDrawStatus = false;
            setConsumer(blk, conss => [
                conss,
                fetchConsumer("ConsumePowerShortCircuitPipe", {
                    amt: 0.5,
                }),
            ]);
        };

        MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-flammable-gas-emission", payload => {
            let args = unpackSplitterPayload(payload);
            let b = GLB_var.world.build(args[0]);
            if(b == null || b.ex_onFlamEmission == null) return;

            b.self.ex_onFlamEmission(args[1], args[2]);
        }, true);

        MDL_event.onLoadDelay(GLB_var.delay.load.loadExtraSound, () => {
            if(!Vars.headless && GLB_param.SECRET_METAL_PIPE && String(blk.delegee.matGrp).equalsAny(
                "iron", "steel", "galvanized-steel", "stainless-steel",
            )) {
                blk.placeSound = fetchSound("se-meme-steel-pipe");
            };
        });
    };


    /**
     * @private
     * @param {BFluidPipe} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        let ot = b.tile.nearby(b.rotation);
        b.delegee.isLeak = b.block.leaks && (ot == null || (ot.build == null && !ot.solid()));
    };


    /**
     * @private
     * @param {BFluidPipe} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.delegee.isLeak = false;
    };


    /**
     * @private
     * @param {BFluidPipe} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.block.delegee.isShortCircuitPipe && syncChanceDelta("pipeShortCircuit", 0.008)) {
            b.block.consPower.trigger(b);
        };

        if(GLB_timer.sec && b.delegee.isLeak) {
            let amt = b.liquids.currentAmount();
            if(amt > 0.001) {
                let liq = b.liquids.current();
                MDL_pollution.addDynaPol(MDL_pollution.getRsPol(liq) / 60.0);
                if(!Vars.net.client() && liq.gas && liq.flammability > 0.0 && Mathf.chance(0.03 * liq.flammability)) {
                    MDL_net.sendPacket(
                        PacketModes.BOTH, "lovec-both-flammable-gas-emission",
                        packSplitterPayload(
                            b.pos(),
                            liq.flammability * amt * 5.0,
                            liq.explosiveness * amt * 5.0,
                        ),
                        true,
                    );
                };
            };
        };
    };


    /**
     * @private
     * @param {BFluidPipe} b
     * @param {BLKFluidPipe} blk
     * @param {Team} team
     * @return {void}
     */
    function comp_ex_justCreated(b, blk, team) {
        b.delegee.fluidPipeBuildUpdater = new BFluidPipeUpdater(blk.delegee.fluidPipeUpdater, b);
    };


    /**
     * @private
     * @param {BFluidPipe} b
     * @param {number} flam
     * @param {number} explo
     * @return {void}
     */
    function comp_ex_onFlamEmission(b, flam, explo) {
        if(!b.delegee.isLeak || flam < 0.0001) return;
        fetchSound("se-shot-explosion").at(b);
        Damage.dynamicExplosion(b.x, b.y, flam, explo, 0.0, FRAG_attack.getPresExploRad(b.block.size) / Vars.tilesize, true);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Equivalent of vanilla liquid conduit but with more mechanics.
         * @class BLK_fluidPipe
         * @extends BLK_baseFluidDistributor
         * @extends INTF_BLK_pressureBlock
         * @extends INTF_BLK_transportBlockSideDisplay
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidPipe")
        .implement(INTF_BLK_pressureBlock[0])
        .implement(INTF_BLK_transportBlockSideDisplay[0])
        .initTemplate()
        .setParent("Conduit")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this pipe short-circuits if powered and containing conductive fluid. Used mostly for metallic pipes.
             * @memberof BLK_fluidPipe
             * @instance
             * @type {boolean}
             */
            isShortCircuitPipe: false,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidPipe
             * @instance
             * @type {LCContentUpdater<Conduit>}
             */
            fluidPipeUpdater: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            blends: function thisFun() {
                return this.delegee.fluidPipeUpdater.blends.apply(this.delegee.fluidPipeUpdater, arguments);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidPipe
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


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidPipe
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendBackSide: function(ob) {
                return ob.block.outputsLiquid;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidPipe
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFlankSide: function(ob) {
                return ob.block.outputsLiquid;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_fluidPipe
             * @instance
             * @func
             * @param {Building} ob
             * @return {boolean}
             */
            ex_shouldBlendFrontSide: function(ob) {
                return ob.liquids != null;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_fluidPipe
         * @extends B_baseFluidDistributor
         * @extends INTF_B_pressureBlock
         * @extends INTF_B_transportBlockSideDisplay
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidPipe")
        .implement(INTF_BLK_pressureBlock[1])
        .implement(INTF_BLK_transportBlockSideDisplay[1])
        .initTemplate()
        .setParent("Conduit.ConduitBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidPipe
             * @instance
             * @type {LCBuildUpdater<Conduit.ConduitBuild, Conduit>}
             */
            fluidPipeBuildUpdater: null,
            /**
             * `INTERNAL`
             * @memberof B_fluidPipe
             * @instance
             * @type {boolean}
             */
            isLeak: false,


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


            moveLiquid: function(b_t, liq) {
                return this.delegee.fluidPipeBuildUpdater.moveLiquid(b_t, liq);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_fluidPipe
             * @instance
             * @func
             * @param {BLKFluidPipe} blk
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
             * @memberof B_fluidPipe
             * @instance
             * @func
             * @param {number} flam
             * @param {number} explo
             * @return {void}
             */
            ex_onFlamEmission: function(flam, explo) {
                comp_ex_onFlamEmission(this, flam, explo);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


        }),


    ];
