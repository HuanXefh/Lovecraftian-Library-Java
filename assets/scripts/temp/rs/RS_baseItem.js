/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Item, RS_baseItem>} RSBaseItem
     */


    const PARENT = require("lovec/temp/rs/RS_baseResource");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSBaseItem} item
     * @return {void}
     */
    function comp_init(item) {
        if(item.setupVanillaProp) {
            let hardness = LCDBFileHandler.read("item-hardness", item, -1.0);
            if(hardness >= 0.0) {
                item.hardness = hardness;
            };
        };
    };


    /**
     * @private
     * @param {RSBaseItem} item
     * @return {void}
     */
    function comp_setStats(item, stats) {
        if(item.setupVanillaStat) {
            stats.remove(Stat.explosiveness);
            stats.remove(Stat.flammability);
            stats.remove(Stat.radioactivity);
            stats.remove(Stat.charge);
            if(item.explosiveness > 0.0) {
                stats.addPercent(Stat.explosiveness, item.explosiveness);
            };
            if(item.flammability > 0.0) {
                stats.addPercent(Stat.flammability, item.flammability);
            };
            if(item.radioactivity > 0.0) {
                stats.addPercent(Stat.radioactivity, item.radioactivity);
            };
            if(item.charge > 0.0) {
                stats.addPercent(Stat.charge, item.charge);
            };

            if(!VAR.isMindustryX && item.buildable) {
                stats.add(fetchStat("lovec", "rs-buildable"), true);
            };
            if(item.hardness > 0) {
                stats.add(fetchStat("lovec", "rs-hardness"), item.hardness);
            };
        };

        if(VARGEN.fuelItems.includes(item)) {
            stats.add(fetchStat("lovec", "rs0fuel-point"), MDL_fuel.getFuelPon(item));
            stats.add(fetchStat("lovec", "rs0fuel-level"), MDL_fuel.getFuelLvl(item));
        };

        // Called here because sometimes non-ore items can be mined in some way
        let oreBlks = MDL_content.getOreBlks(item);
        if(oreBlks.length > 0) {
            stats.add(fetchStat("lovec", "rs-blockrelated"), newStatValue(tb => {
                tb.row();
                MDL_table.setCtLi(tb, oreBlks, {size: 48.0});
            }));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * The most basic items with no features.
     * @class RS_baseItem
     * @extends RS_baseResource
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_baseItem")
    .initTemplate()
    .setParent(Item)
    .setTags()
    .setParam({


        /* <------------------------------ vanilla ------------------------------> */


        lowPriority: false,
        buildable: false,
        cost: 1.0,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
