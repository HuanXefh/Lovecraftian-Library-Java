/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Liquid, RS_dilutedSlurryLiquid>} RSDilutedSlurryLiquid
     */


    const PARENT = require("lovec/temp/rs/RS_slurryLiquid");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Slurry that should be thickened before being further processed.
     * <br> `NAMEGEN`
     * @class RS_dilutedSlurryLiquid
     * @extends RS_slurryLiquid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_dilutedSlurryLiquid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-slur0dil")
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
        recolorRegStr: "lovec-gen-diluted-slurry-liquid",


    })
    .setMethod({


        /**
         * `REALIZED`
         * @override
         * @memberof RS_dilutedSlurryLiquid
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-diluted-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
