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


  /**
   * Fake fluids that cannot be transferred and stored by regular pipes, like heat.
   * Also known as auxiliary fluid (abbr. aux).
   * <br> These fluids are named like "aux0aux-xxx" instead of "aux-xxx", because "aux" is not allowed for folder name, WTF.
   * @class RS_abstractFluid
   * @extends RS_baseResource
   */
  module.exports = newClass().extendClass(PARENT, "RS_abstractFluid").initClass()
  .setParent(Liquid)
  .setTags("rs-aux")
  .setParam({


    /* <------------------------------ vanilla ------------------------------ */


    gas: true,
    incinerable: false,
    coolant: false,
    capPuddles: true,
    lightColor: prov(() => Color.black.cpy()),
    gasColor: prov(() => Color.black.cpy()),
    vaporEffect: Fx.none,


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
