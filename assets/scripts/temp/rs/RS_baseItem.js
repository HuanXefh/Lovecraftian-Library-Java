/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most basic items that have no features.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseResource");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(itm) {
    if(itm.overwriteVanillaProp) {
      let hardness = DB_HANDLER.read("itm-hardness", itm, -1.0);
      if(hardness >= 0.0) {
        itm.hardness = hardness;
      };
    };
  };


  function comp_setStats(itm) {
    if(itm.overwriteVanillaStat) {
      itm.stats.remove(Stat.explosiveness);
      itm.stats.remove(Stat.flammability);
      itm.stats.remove(Stat.radioactivity);
      itm.stats.remove(Stat.charge);
      if(itm.explosiveness > 0.0) itm.stats.addPercent(Stat.explosiveness, itm.explosiveness);
      if(itm.flammability > 0.0) itm.stats.addPercent(Stat.flammability, itm.flammability);
      if(itm.radioactivity > 0.0) itm.stats.addPercent(Stat.radioactivity, itm.radioactivity);
      if(itm.charge > 0.0) itm.stats.addPercent(Stat.charge, itm.charge);

      if(itm.buildable) itm.stats.add(fetchStat("lovec", "rs-buildable"), true);
      if(itm.hardness > 0) itm.stats.add(fetchStat("lovec", "rs-hardness"), itm.hardness);
    };

    if(VARGEN.fuelItms.includes(itm)) {
      itm.stats.add(fetchStat("lovec", "rs0fuel-point"), MDL_fuel._fuelPon(itm));
      itm.stats.add(fetchStat("lovec", "rs0fuel-level"), MDL_fuel._fuelLvl(itm));
    };

    // Sometimes non-ore items can be mined in some way
    let oreBlks = MDL_content._oreBlks(itm);
    if(oreBlks.length > 0) itm.stats.add(fetchStat("lovec", "rs-blockrelated"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, oreBlks, 48.0);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_baseItem").initClass()
  .setParent(Item)
  .setTags()
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
