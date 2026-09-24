/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Liquid, RS_morbidSolutionLiquid>} RSMorbidSolutionLiquid
     */


    const PARENT = require("lovec/temp/rs/RS_solutionLiquid");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Fluids with unwanted insolubles.
     * <br> `NAMEGEN`
     * @class RS_morbidSolutionLiquid
     * @extends RS_solutionLiquid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_morbidSolutionLiquid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-morbid")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_morbidSolutionLiquid
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-morbid-solution-liquid",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_morbidSolutionLiquid
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-morbid-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
