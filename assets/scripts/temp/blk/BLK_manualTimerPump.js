/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Pump, BLK_manualTimerPump>} BLKManualTimerPump
     */


    /**
     * @typedef {TemplateInstance<Pump.PumpBuild, B_manualTimerPump>} BManualTimerPump
     * @prop {BLKManualTimerPump} block
     */


    const PARENT = require("lovec/temp/blk/BLK_liquidPump");
    const INTF_BLK_manualTimerBlock = require("lovec/temp/intf/INTF_BLK_manualTimerBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * A pump that charges when you click it.
         * @class BLK_manualTimerPump
         * @extends BLK_liquidPump
         * @extends INTF_BLK_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_manualTimerPump")
        .implement(INTF_BLK_manualTimerBlock[0])
        .initTemplate()
        .setParent(Pump)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_manualTimerPump
             * @instance
             * @type {string}
             */
            manualTimerCfgType: "string",


        })
        .setMethod({}),


        /**
         * @class B_manualTimerPump
         * @extends B_liquidPump
         * @extends INTF_B_manualTimerBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_manualTimerPump")
        .implement(INTF_BLK_manualTimerBlock[1])
        .initTemplate()
        .setParent(Pump.PumpBuild)
        .setParam({})
        .setMethod({


            shouldConsume: function thisFun() {
                return thisFun.funPrev.call(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
