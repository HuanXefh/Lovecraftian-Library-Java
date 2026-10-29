/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Pump, BLK_liquidPump>} BLKLiquidPump
     */


    /**
     * @typedef {TemplateInstance<Pump.PumpBuild, B_liquidPump>} BLiquidPump
     * @prop {BLKLiquidPump} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFluidBlock");
    const INTF_BLK_corrosionAcceptor = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
    const INTF_BLK_fluidHeatAcceptor = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");
    const INTF_BLK_pressureProducer = require("lovec/temp/intf/INTF_BLK_pressureProducer");
    const INTF_BLK_facilityBlock = require("lovec/temp/intf/INTF_BLK_facilityBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKLiquidPump} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.hasConsumers = true;
    };


    /**
     * @private
     * @param {BLiquidPump} b
     * @return {boolean}
     */
    function comp_shouldConsume(b) {
        return b.enabled
            && (!(b.block instanceof Pump) || b.self.ex_getRsTarget() != null)
            && (!b.block.delegee.presProd.fEqual(0.0) || b.liquids.get(b.self.ex_getRsTarget()) < (b.block.liquidCapacity - 0.01))
    };


    /**
     * @private
     * @param {BLiquidPump} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        SLCDraw.contentIcon(b.x, b.y, b.self.ex_getRsTarget(), b.block.size, 0.75);
    };


    /**
     * @private
     * @param {BLiquidPump} b
     * @return {void}
     */
    function comp_drawStatus(b) {
        if(!b.block.enableDrawStatus) return;
        SLCDrawf.blockStatus(b.x, b.y, b.block.size, b.status().color);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Lovec version of pump that is capable of producing pressure.
         * @class BLK_liquidPump
         * @extends BLK_baseFluidBlock
         * @extends INTF_BLK_corrosionAcceptor
         * @extends INTF_BLK_fluidHeatAcceptor
         * @extends INTF_BLK_pressureProducer
         * @extends INTF_BLK_facilityBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_liquidPump")
        .implement(INTF_BLK_corrosionAcceptor[0])
        .implement(INTF_BLK_fluidHeatAcceptor[0])
        .implement(INTF_BLK_pressureProducer[0])
        .implement(INTF_BLK_facilityBlock[0])
        .initTemplate()
        .setParent("Pump")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Pressure and vacuum are abstract fluids, this field must be true.
             * <br> `REALIZED`
             * @override
             * @memberof BLK_liquidPump
             * @instance
             * @type {boolean}
             */
            allowAux: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_liquidPump
         * @extends B_baseFluidBlock
         * @extends INTF_B_corrosionAcceptor
         * @extends INTF_B_fluidHeatAcceptor
         * @extends INTF_B_pressureProducer
         * @extends INTF_B_facilityBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_liquidPump")
        .implement(INTF_BLK_corrosionAcceptor[1])
        .implement(INTF_BLK_fluidHeatAcceptor[1])
        .implement(INTF_BLK_pressureProducer[1])
        .implement(INTF_BLK_facilityBlock[1])
        .initTemplate()
        .setParent("Pump.PumpBuild")
        .setParam({})
        .setMethod({


            shouldConsume: function() {
                return comp_shouldConsume(this);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                this.self.ex_drawRcIcon();
            },


            drawSelect: function() {
                comp_drawSelect(this);
            },


            drawStatus: function() {
                comp_drawStatus(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
            },


            /**
             * `REALIZED`
             * @memberof B_liquidPump
             * @instance
             * @func
             * @return {Liquid|null}
             * @lovecAttached
             */
            ex_getRsTarget: function() {
                return tryVal(this.liquidDrop, null);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_wallHarvester
             * @instance
             * @func
             * @return {TextureRegion|null}
             */
            ex_getRcIcon: function() {
                return this.liquidDrop == null ?
                    null :
                    this.liquidDrop.uiIcon;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
