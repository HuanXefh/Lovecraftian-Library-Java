/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fake fluids that cannot be transfered and stored by regular pipes, like heat.
   * These fluids are abbreviated as "AUX" (auxiliary fluid).
   * You have to put {gas: true} in the Json file by the way.
   *
   * The basic auxiliary fluid are named "aux0aux-xxx" instead of "aux-xxx", since "aux" is not allowed for folder name on Windows.
   * Holy fuk.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseResource");


  /* <---------- component ----------> */


  function comp_init(aux) {
    if(!aux.gas) ERROR_HANDLER.throw("auxNotGas", aux.name);

    aux.databaseCategory = "lovec-aux";

    if(aux.overwriteVanillaProp) {
      aux.incinerable = false;
      aux.coolant = false;
      aux.capPuddles = true;

      aux.lightColor = aux.gasColor = Color.black;
      aux.vaporEffect = Fx.none;
    };
  };


  function comp_setStats(liq) {
    if(liq.overwriteVanillaStat) {
      liq.stats.remove(Stat.explosiveness);
      liq.stats.remove(Stat.flammability);
      liq.stats.remove(Stat.temperature);
      liq.stats.remove(Stat.heatCapacity);
      liq.stats.remove(Stat.viscosity);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_abstractFluid").initClass()
  .setParent(Liquid)
  .setTags("rs-aux")
  .setParam({
    gas: true,
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
