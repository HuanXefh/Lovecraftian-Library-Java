/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  /* <---------- component ----------> */


  function comp_init(item) {
    item.sintTemp = item.sintTemp >= 0.0 ? item.sintTemp : DB_HANDLER.read("item-sintering-temperature", item, 100.0);
  };


  function comp_setStats(item) {
    item.stats.add(fetchStat("lovec", "rs-isore"), true);
    if(item.sintTemp > 100.0) item.stats.add(fetchStat("lovec", "rs-sinttemp"), item.sintTemp, fetchStatUnit("lovec", "heatunits"));
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
  module.exports = newClass().extendClass(PARENT, "RS_oreItem").initClass()
  .setParent(Item)
  .setTags("rs-ore")
  .setParam({


    /**
     * `PARAM`: Sintering temperature.
     * <br> `DB`: item-sintering-temperature.
     * @memberof RS_oreItem
     * @instance
     */
    sintTemp: -1.0,


    /* <------------------------------ vanilla ------------------------------ */


    databaseTag: "lovec-ore",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
