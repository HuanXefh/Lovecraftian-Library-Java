/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Liquid, RS_suspensionLiquid>} RSSuspensionLiquid
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
     * Similar to {@link RS_slurryLiquid} though, these are usually processed in different separators like centrifugal separator.
     * <br> `NAMEGEN`
     * @class RS_suspensionLiquid
     * @extends RS_solutionLiquid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_suspensionLiquid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-susp")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_suspensionLiquid
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-suspension-liquid",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_suspensionLiquid
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-suspension" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
