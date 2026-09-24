/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Liquid, RS_abstractFluid>} RSAbstractFluid
     */


    const PARENT = require("lovec/temp/rs/RS_baseResource");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSAbstractFluid} aux
     * @return {void}
     */
    function comp_init(aux) {
        if(!aux.gas) throw new Error("Abstract fluid must be gas: " + aux.name);

        aux.databaseCategory = "lovec-aux";
    };


    /**
     * @private
     * @param {RSAbstractFluid} aux
     * @return {void}
     */
    function comp_setStats(liq, stats) {
        if(liq.setupVanillaStat) {
            stats.remove(Stat.explosiveness);
            stats.remove(Stat.flammability);
            stats.remove(Stat.temperature);
            stats.remove(Stat.heatCapacity);
            stats.remove(Stat.viscosity);
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
     * <br> These fluids are named like "aux0aux-xxx" instead of "aux-xxx", because "aux" is not allowed for folder name.
     * @class RS_abstractFluid
     * @extends RS_baseResource
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_abstractFluid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("rs-aux")
    .setParam({


        /* <------------------------------ vanilla ------------------------------> */


        gas: true,
        lightColor: tprov(() => Color.black.cpy()),
        gasColor: tprov(() => Color.black.cpy()),
        vaporEffect: Fx.none,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
