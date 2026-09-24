/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Liquid, RS_crudeGas>} RSCrudeGas
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSCrudeGas} liq
     * @return {void}
     */
    function comp_init(liq) {
        if(liq.intmdParent.gas) {
            liq.dens = liq.intmdParent.dens;
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Impure gaseous chemicals.
     * <br> `NAMEGEN`
     * @class RS_crudeGas
     * @extends RS_intermediateFluid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_crudeGas")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-crdg")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_crudeGas
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-crude-gas",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof RS_crudeGas
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-crude-gas");
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
