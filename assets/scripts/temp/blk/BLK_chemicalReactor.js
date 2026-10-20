/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_chemicalReactor>} BLKChemicalReactor
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_chemicalReactor>} BChemicalReactor
     * @prop {BLKChemicalReactor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_furnaceRecipeFactory");
    const INTF_BLK_corrosionAcceptor = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
    const INTF_BLK_fluidHeatAcceptor = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Essentially an externally heated furnace with fluid block mechanics.
         * @class BLK_chemicalReactor
         * @extends BLK_furnaceRecipeFactory
         * @extends INTF_BLK_corrosionAcceptor
         * @extends INTF_BLK_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_chemicalReactor")
        .implement(INTF_BLK_corrosionAcceptor[0])
        .implement(INTF_BLK_fluidHeatAcceptor[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags()
        .setParam({


            /**
             * @inheritdoc
             * @memberof BLK_chemicalReactor
             * @instance
             * @type {number}
             */
            furnHeatA: 0.3,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_chemicalReactor
             * @instance
             * @type {boolean}
             */
            noFuelInput: true,


        })
        .setMethod({}),


        /**
         * @class B_chemicalReactor
         * @extends B_furnaceRecipeFactory
         * @extends INTF_B_corrosionAcceptor
         * @extends INTF_B_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[1], "B_chemicalReactor")
        .implement(INTF_BLK_corrosionAcceptor[1])
        .implement(INTF_BLK_fluidHeatAcceptor[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
        .setParam({})
        .setMethod({


            updateTile: function() {

            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
