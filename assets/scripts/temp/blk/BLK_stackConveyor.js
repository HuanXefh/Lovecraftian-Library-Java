/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<StackConveyor, BLK_stackConveyor>} BLKStackConveyor
     */


    /**
     * @typedef {TemplateInstance<StackConveyor.StackConveyorBuild, B_stackConveyor>} BStackConveyor
     * @prop {BLKStackConveyor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKStackConveyor} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(blk.delegee.setupVanillaProp) {
            if(blk.hasPower) {
                blk.conductivePower = true;
                blk.connectedPower = false;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla stack conveyor I guess.
         * <br> `SINGLESIZE`
         * @class BLK_stackConveyor
         * @extends BLK_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_stackConveyor")
        .initTemplate()
        .setParent(StackConveyor)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether this conveyor only accepts inputs from certain buildings. See {@link INTF_BLK_mainBusInputSite}.
             * @memberof BLK_stackConveyor
             * @instance
             * @type {boolean}
             */
            isMainBus: true,


            /* <------------------------------ vanilla ------------------------------> */


            unloadable: true,
            enableDrawStatus: false,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `loadEffect`.
             * @memberof BLK_baseFactory
             * @instance
             * @name loadEff
             * @type {Effect}
             */
            "loadEff", "loadEffect", Fx.conveyorPoof,
            /**
             * `ALIAS`: `unloadEffect`.
             * @memberof BLK_baseFactory
             * @instance
             * @name unloadEff
             * @type {Effect}
             */
            "unloadEff", "unloadEffect", Fx.conveyorPoof,
        ])
        .setMethod({


            init: function() {
                comp_init(this);
            },


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_stackConveyor
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
         * @class B_stackConveyor
         * @extends B_baseItemDistributor
         */
        newClass()
        .extendClass(PARENT[1], "B_stackConveyor")
        .initTemplate()
        .setParent(StackConveyor.StackConveyorBuild)
        .setParam({})
        .setMethod({


            acceptItem: function(b_f, item) {
                return !this.block.delegee.isMainBus || this.self.ex_checkMainBusInputSite(b_f);
            }
            .setProp({
                boolMode: "and",
            }),


            /**
             * Whether a building can be input site for the main bus.
             * @memberof B_stackConveyor
             * @instance
             * @func
             * @param {Building} b_f
             * @return {boolean}
             */
            ex_checkMainBusInputSite: function(b_f) {
                return b_f.block instanceof ItemSource
                    || (checkSubInsOfTemp(b_f, "INTF_B_mainBusInputSite") && b_f.self.ex_checkMainBusInputValid(this));
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
