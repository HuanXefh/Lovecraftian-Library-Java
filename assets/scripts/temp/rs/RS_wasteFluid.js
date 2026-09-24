/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Liquid, RS_wasteFluid>} RSWasteFluid
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSWasteFluid} liq
     * @return {void}
     */
    function comp_setStats(liq, stats) {
        stats.remove(fetchStat("lovec", "rs-isintermediate"));
        stats.add(fetchStat("lovec", "rs-iswaste"), true);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Unwanted fluids.
     * Technically intermediates, but categorized as waste.
     * @class RS_wasteFluid
     * @extends RS_intermediateFluid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_wasteFluid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-was")
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_wasteFluid
         * @instance
         * @type {boolean}
         */
        useParentReg: false,


        /* <------------------------------ vanilla ------------------------------> */


        databaseTag: null,


    })
    .setMethod({


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
