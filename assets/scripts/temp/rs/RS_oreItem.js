/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_oreItem>} RSOreItem
     */


    const PARENT = require("lovec/temp/rs/RS_baseItem");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSOreItem} item
     * @return {void}
     */
    function comp_init(item) {
        item.sintTemp = item.sintTemp >= 0.0 ? item.sintTemp : LCDBFileHandler.read("item-sintering-temperature", item, 100.0);
    };


    /**
     * @private
     * @param {RSOreItem} item
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(item, stats) {
        stats.add(fetchStat("lovec", "rs-isore"), true);
        if(item.sintTemp > 100.0) {
            stats.add(fetchStat("lovec", "rs-sinttemp"), item.sintTemp, fetchStatUnit("lovec", "heatunits"));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items that can be obtained through mining.
     * @class RS_oreItem
     * @extends RS_baseItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_oreItem")
    .initTemplate()
    .setParent(Item)
    .setTags("rs-ore")
    .setParam({


        /**
         * `PARAM`: Sintering temperature. Read from DB JSON file if negative.
         * <br> `DB`: `item-sintering-temperature`.
         * @memberof RS_oreItem
         * @instance
         * @type {number}
         */
        sintTemp: -1.0,


        /* <------------------------------ vanilla ------------------------------> */


        databaseTag: "lovec-ore",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
