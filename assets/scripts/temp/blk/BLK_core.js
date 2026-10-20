/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<CoreBlock, BLK_core>} BLKCore
     */


    /**
     * @typedef {TemplateInstance<CoreBlock.CoreBuild, B_core>} BCore
     * @prop {BLKCore} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseStorageBlock");
    const INTF_BLK_powerProducer = require("lovec/temp/intf/INTF_BLK_powerProducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BCore} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(GLB_timer.secHalf) {
            b.delegee.powProdEffc = Mathf.clamp(1.0 - FRAG_faci.getCepFracCur(b.team))
        };
        if(b.delegee.powProdEffc < 0.0001 && Mathf.chanceDelta(b.block.delegee.cepOutageEffP)) {
            b.block.delegee.cepOutageEff.at(b);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla core block with core energy mechanics.
         * Capable of producing power.
         * @class BLK_core
         * @extends BLK_baseStorageBlock
         * @extends INTF_BLK_powerProducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_core")
        .implement(INTF_BLK_powerProducer[0])
        .initTemplate()
        .setParent("CoreBlock")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Effect created when out of CEP.
             * @memberof BLK_core
             * @instance
             * @type {Effect}
             */
            cepOutageEff: GLB_eff.sparkPower,
            /**
             * `PARAM`: Effect chance for {@link BLK_core#cepOutageEff}.
             * @memberof BLK_core
             * @instance
             * @type {number}
             */
            cepOutageEffP: 0.04,


        })
        .setMethod({}),


        /**
         * @class B_core
         * @extends B_baseStorageBlock
         * @extends INTF_B_powerProducer
         */
        newClass()
        .extendClass(PARENT[1], "B_core")
        .implement(INTF_BLK_powerProducer[1])
        .initTemplate()
        .setParent("CoreBlock.CoreBuild")
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


        }),


    ];
