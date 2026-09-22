/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<StatusEffect, DBCT_databaseContent>} DBCTDatabaseContent
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {DBCTDatabaseContent} sta
     * @return {void}
     */
    function comp_init(sta) {
        if(!sta.exInitCalled) {
            sta.ex_init();
            sta.exInitCalled = true;
        };
    };


    /**
     * @private
     * @param {DBCTDatabaseContent} sta
     * @return {void}
     */
    function comp_setStats(sta) {
        sta.stats.remove(Stat.damageMultiplier);
        sta.stats.remove(Stat.healthMultiplier);
        sta.stats.remove(Stat.speedMultiplier);
        sta.stats.remove(Stat.reloadMultiplier);
        sta.stats.remove(Stat.buildSpeedMultiplier);
        sta.stats.remove(Stat.damage);
        sta.stats.remove(Stat.frequency);
        sta.stats.remove(Stat.healing);
        sta.stats.remove(Stat.affinities);
        sta.stats.remove(Stat.opposites);
        sta.stats.remove(Stat.reactive);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * A special type of content that is only displayed in database.
     * Technically a status effect (which is a common approach in most mods), do not apply it on units!
     * @class DBCT_databaseContent
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "DBCT_databaseContent")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: See {@link STA_baseStatus#exInitCalled}
         * @memberof DBCT_databaseContent
         * @instance
         * @type {boolean}
         */
        exInitCalled: false,


        /* <------------------------------ vanilla ------------------------------> */


        allDatabaseTabs: false,
        outline: false,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        setStats: function() {
            comp_setStats(this);
        },


        showUnlock: function() {
            return true;
        }
        .setProp({
            noSuper: true,
        }),


        isHidden: function() {
            return !this.show;
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * See {@link STA_baseStatus}.
         * @memberof DBCT_databaseContent
         * @instance
         * @func
         * @return {void}
         */
        ex_init: function() {

        }
        .setProp({
            noSuper: true,
        }),


        /**
         * Whether this content should be seen as unlocked (player can interact with this content).
         * @memberof DBCT_databaseContent
         * @instance
         * @func
         * @return {boolean}
         */
        ex_checkDbctUnlocked: function() {
            return this.unlocked || global.lovecUtil.prop.debug;
        }
        .setProp({
            noSuper: true,
        }),


    });
