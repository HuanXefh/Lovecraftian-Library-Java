/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Item, RS_wasteItem>} RSWasteItem
     */


    const PARENT = require("lovec/temp/rs/RS_baseItem");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSWasteItem} item
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(item, stats) {
        stats.add(fetchStat("lovec", "rs-iswaste"), true);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Unwanted items.
     * Unlike fluids, waste items have no relation to intermediates.
     * @class RS_wasteItem
     * @extends RS_baseItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_wasteItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-was")
    .setParam({})
    .setMethod({


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
