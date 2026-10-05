/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Liquid, RS_intermediateFluid>} RSIntermediateFluid
     */


    const PARENT = require("lovec/temp/rs/RS_baseFluid");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSIntermediateFluid} liq
     * @return {void}
     */
    function comp_init(liq) {
        // noinspection JSValidateTypes
        liq.delegee.intmdParent = MDL_content.getCt(liq.delegee.intmdParent, ContentGetModes.RS);
        liq.delegee.extraIntmdParents.inSituMap(nameRs => MDL_content.getCt(nameRs, ContentGetModes.RS));

        liq.self.ex_generateIntmdName();
    };


    /**
     * @private
     * @param {RSIntermediateFluid} liq
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(liq, stats) {
        stats.add(fetchStat("lovec", "rs-isintermediate"), true);
        if(liq.delegee.intmdParent != null) {
            stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
                tb.row();
                MDL_table.setCtRow(tb, liq.delegee.intmdParent);
            }));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Fluids as intermediates.
     * @class RS_intermediateFluid
     * @extends RS_baseFluid
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_intermediateFluid")
    .initTemplate()
    .setParent(Liquid)
    .setTags("ct-intmd")
    .setParam({


        /**
         * `PARAM`: See {@link RS_intermediateItem#intmdParent}.
         * @override
         * @memberof RS_intermediateFluid
         * @instance
         * @type {string|Resource|null}
         */
        intmdParent: null,
        /**
         * `PARAM`: See {@link RS_intermediateItem#extraIntmdParents}.
         * @override
         * @memberof RS_intermediateFluid
         * @instance
         * @type {TDynamic<Array<string>>}
         */
        extraIntmdParents: tprov(() => []),
        /**
         * `PARAM`: See {@link RS_intermediateItem#useParentReg}.
         * @override
         * @memberof RS_intermediateFluid
         * @instance
         * @type {boolean}
         */
        useParentReg: true,
        /**
         * `PARAM`: See {@link RS_intermediateItem#recolorRegStr}.
         * @override
         * @memberof RS_intermediateFluid
         * @instance
         * @type {String|null}
         */
        recolorRegStr: null,


        /* <------------------------------ vanilla ------------------------------> */


        databaseTag: "lovec-intermediate",


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


    });
