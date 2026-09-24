/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Liquid, RS_solutionLiquid>} RSSolutionLiquid
     */


    const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {RSSolutionLiquid} liq
     * @return {void}
     */
    function comp_init(liq) {
        let liqSolv = MDL_content.getCt(LCDBFileHandler.read("liquid-solvent", liq.solvent, null), ContentGetModes.RS, true);

        if(liqSolv != null && liq.setupVanillaProp) {
            liq.flammability = liqSolv.flammability;
            liq.explosiveness = liqSolv.explosiveness;
            liq.viscosity = liqSolv.viscosity;
            if(liq.coolant) {
                liq.heatCapacity = liqSolv.heatCapacity;
            };
        };

        if(!liq.skipReactionAssign && liq.intmdParent != null) {
            MDL_event.onLoad(() => {
                if(liq.intmdParent instanceof Item) {
                    // Make the parent item soluble in puddles of the solvent, which yields this liquid
                    let obj = DB_reaction.db["solvationTarget"];
                    if(obj[liq.solvent] === undefined) {
                        obj[liq.solvent] = [];
                    };
                    obj[liq.solvent].push(liq.intmdParent.name, liq.name);
                };
            });
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Fluids with solubles.
     * <br> `NAMEGEN`
     * @class RS_solutionLiquid
     * @extends RS_intermediateFluid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_solutionLiquid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd", "rs-sol")
    .setParam({


        /**
         * `PARAM`: Solvent used for this solution.
         * <br> `DB`: `liquid-solvent`.
         * @memberof RS_solutionLiquid
         * @instance
         * @type {string}
         */
        solvent: "water",


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof RS_solutionLiquid
         * @instance
         * @type {string}
         */
        recolorRegStr: "lovec-gen-solution-liquid",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `REALIZED`
         * @override
         * @memberof RS_solutionLiquid
         * @instance
         * @func
         * @return {string}
         */
        ex_getLocalizedMainName: function() {
            return MDL_bundle.getTerm("common", "intmd-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


    });
