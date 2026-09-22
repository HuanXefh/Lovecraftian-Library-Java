/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<StatusEffect, DBCT_techNodeContent>} DBCTTechNodeContent
     */


    const PARENT = require("lovec/temp/sta/DBCT_databaseContent");


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @private
     * @param {Array<UnlockableContent>} cts
     * @param {TechTree.TechNode} node
     * @return {void}
     */
    function appendChildren(cts, node) {
        node.children.each(onode => {
            // Don't append contents under other nodes (including other nodes)
            if(checkSubInsOfTemp(onode.content, "DBCT_techNodeContent")) return;
            // Don't append hidden contents
            if(
                (instanceOfAny(onode.content, Item, Liquid, UnitType) && onode.content.hidden)
                    || (onode.content instanceof Block && DB_block.db["class"]["group"]["visibility"]["hidden"].includes(onode.content.buildVisibility))
            ) return;

            cts.pushUnique(onode.content);
            appendChildren(cts, onode);
        });
    };


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {DBCTTechNodeContent} sta
     * @return {void}
     */
    function comp_setStats(sta) {
        if(sta.techNode != null) {
            sta.stats.add(fetchStat("lovec", "spec-researchreq"), StatValues.items(false, sta.techNode.requirements));
        };
        if(sta.childCts.length > 0) {
            sta.stats.add(fetchStat("lovec", "spec-nodects"), newStatValue(tb => {
                tb.row();
                tb.table(Styles.none, tb1 => {
                    MDL_table.margin(tb1);
                    MDL_table.setCtLi(tb, sta.childCts, {size: 48.0, ctDial: VAR.dialog.ct1}, {colAmt: 7});
                }).growX();
            }));
        };
        if(sta.childRcs.length > 0) {
            sta.stats.add(fetchStat("lovec", "spec-nodercs"), newStatValue(tb => {
                tb.row();
                tb.table(Styles.none, tb1 => {
                    MDL_table.margin(tb1);
                    MDL_table.setIconLi(
                        tb1,
                        sta.childRcs.map(rc => rc.altIcon),
                        sta.childRcs.map(rc => [MDL_bundle.getTerm("lovec", "recipe-display"), tb => rc.displayTooltip(tb, true, rc.owner.localizedName)]),
                        sta.childRcs.map(rc => () => Vars.ui.content.show(rc.owner)),
                        {size: 64.0},
                        {colAmt: 7},
                    );
                });
            }));
        };
    };


    /**
     * @private
     * @param {DBCTTechNodeContent} sta
     * @return {void}
     */
    function comp_ex_init(sta) {
        MDL_event.onLoad(() => {
            if(sta.techNode == null) {
                console.warn("[LOVEC] Tech node ${1} has never been used in tech tree!".format(sta.name.color(Pal.accent)));
            } else {
                appendChildren(sta.childCts, sta.techNode);
                sta.childCts.sort((ct1, ct2) => ct2.id - ct1.id);
            };
            Time.run(VAR.delay.load.loadNodeRcs, () => {
                sta.childRcs.pushAll(CLS_recipe.getNodeRcsMap().get(sta, Array.air));
            });
        });
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Used to categorize tech nodes.
     * @class DBCT_techNodeContent
     * @extends DBCT_databaseContent
     */
    module.exports = newClass()
    .extendClass(PARENT, "DBCT_techNodeContent")
    .initTemplate()
    .setParent(StatusEffect)
    .setTags()
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: Contents that require this node in tech tree.
         * @memberof DBCT_techNodeContent
         * @instance
         * @type {TDynamic<Array<UnlockableContent>>}
         */
        childCts: tprov(() => []),
        /**
         * `INTERNAL`: Recipes that require this node in tech tree. See {@link CLS_recipe}.
         * @memberof DBCT_techNodeContent
         * @instance
         * @type {TDynamic<Array<CLS_recipe>>}
         */
        childRcs: tprov(() => []),


        /* <------------------------------ vanilla ------------------------------> */


        databaseCategory: "lovec-tech-node",
        databaseTag: "default",


    })
    .setMethod({


        setStats: function() {
            comp_setStats(this);
        },


        isHidden: function() {
            return false;
        }
        .setProp({
            noSuper: true,
            override: true,
        }),


        /**
         * @inheritdoc
         */
        ex_init: function() {
            comp_ex_init(this);
        }
        .setProp({
            noSuper: true,
        }),


    });
