/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseResource");


  /* <---------- component ----------> */


  function comp_init(item) {
    if(item.overwriteVanillaProp) {
      let hardness = DB_HANDLER.read("item-hardness", item, -1.0);
      if(hardness >= 0.0) {
        item.hardness = hardness;
      };
    };
  };


  function comp_setStats(item) {
    if(item.overwriteVanillaStat) {
      item.stats.remove(Stat.explosiveness);
      item.stats.remove(Stat.flammability);
      item.stats.remove(Stat.radioactivity);
      item.stats.remove(Stat.charge);
      if(item.explosiveness > 0.0) item.stats.addPercent(Stat.explosiveness, item.explosiveness);
      if(item.flammability > 0.0) item.stats.addPercent(Stat.flammability, item.flammability);
      if(item.radioactivity > 0.0) item.stats.addPercent(Stat.radioactivity, item.radioactivity);
      if(item.charge > 0.0) item.stats.addPercent(Stat.charge, item.charge);

      if(item.buildable) item.stats.add(fetchStat("lovec", "rs-buildable"), true);
      if(item.hardness > 0) item.stats.add(fetchStat("lovec", "rs-hardness"), item.hardness);
    };

    if(VARGEN.fuelItems.includes(item)) {
      item.stats.add(fetchStat("lovec", "rs0fuel-point"), MDL_fuel.getFuelPon(item));
      item.stats.add(fetchStat("lovec", "rs0fuel-level"), MDL_fuel.getFuelLvl(item));
    };

    // Sometimes non-ore items can be mined in some way
    let oreBlks = MDL_content.getOreBlks(item);
    if(oreBlks.length > 0) item.stats.add(fetchStat("lovec", "rs-blockrelated"), newStatValue(tb => {
      tb.row();
      MDL_table.setCtLi(tb, oreBlks, 48.0);
    }));
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
  module.exports = newClass().extendClass(PARENT, "RS_baseItem").initClass()
  .setParent(Item)
  .setTags()
  .setParam({


    /* <------------------------------ vanilla ------------------------------ */


    lowPriority: false,
    buildable: false,
    cost: 1.0,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
