/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Item, RS_intermediateItem>} RSIntermediateItem
     */


    const PARENT = require("lovec/temp/rs/RS_baseItem");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {RSIntermediateItem} item
     * @return {void}
     */
    function comp_init(item) {
        item.intmdParent = MDL_content.getCt(item.intmdParent, ContentGetModes.RS);
        item.extraIntmdParents.inSituMap(nameRs => MDL_content.getCt(nameRs, ContentGetModes.RS)).compact();

        item.ex_generateIntmdName();

        if(item.intmdParent != null && item.hardness === 0) {
            item.hardness = item.intmdParent.hardness;
        };
    };


    /**
     * @private
     * @param {RSIntermediateItem} item
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(item, stats) {
        stats.add(fetchStat("lovec", "rs-isintermediate"), true);
        if(item.intmdParent != null) {
            stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
                tb.row();
                MDL_table.setCtRow(tb, item.intmdParent);
            }));
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Items that are not final products.
     * Intermediate items can have parent items, and it's possible to create generated icons based on the parents.
     * @class RS_intermediateItem
     * @extends RS_baseItem
     */
    module.exports = newClass()
    .extendClass(PARENT, "RS_intermediateItem")
    .initTemplate()
    .setParent(Item)
    .setTags("ct-intmd")
    .setParam({


        /**
         * `PARAM`: Parent of this intermediate.
         * @override
         * @memberof RS_intermediateItem
         * @instance
         * @type {string|Resource|null}
         */
        intmdParent: null,
        /**
         * `PARAM`: Extra resources used for icon tag generation.
         * @override
         * @memberof RS_intermediateItem
         * @instance
         * @type {TDynamic<Array<string>>}
         */
        extraIntmdParents: tprov(() => []),
        /**
         * `PARAM`: Whether to generate icons based on the parent. Set this to false if you have sprite for this intermediate.
         * @override
         * @memberof RS_intermediateItem
         * @instance
         * @type {boolean}
         */
        useParentReg: true,
        /**
         * `PARAM`: Determines the pixmap used to generate recolored sprites. {@link RS_intermediateItem#intmdParent} is required in this case. If null, icon tag will be used instead.
         * @override
         * @memberof RS_intermediateItem
         * @instance
         * @type {string|null}
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
