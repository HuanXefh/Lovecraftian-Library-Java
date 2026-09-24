/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Liquid, RS_slurryLiquid>} RSSlurryLiquid
     */


    const PARENT = require("lovec/temp/rs/RS_solutionLiquid");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Fluids with insolubles as the products.
     * <br> `NAMEGEN`
     * @class RS_slurryLiquid
     * @extends RS_solutionLiquid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_slurryLiquid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-slur")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_slurryLiquid
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-slurry-liquid",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_slurryLiquid
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
