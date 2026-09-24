/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<StatusEffect, INTF_STA_burstStatus>} INTFSTABurstStatus
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFSTABurstStatus} sta
     * @return {void}
     */
    function comp_setStats(sta, stats) {
        if(sta.burstTime > 0.0) {
            stats.add(fetchStat("lovec", "sta-bursttime"), sta.burstTime / 60.0, StatUnit.seconds);
        };
        if(sta.burstDamage > 0.0) {
            stats.add(fetchStat("lovec", "sta-burstdmg"), MDL_text.getDmgText(sta.burstDamage, sta.burstDamagePerc));
        };
    };


    /**
     * @private
     * @param {INTFSTABurstStatus} sta
     * @param {Unit} unit
     * @param {StatusEntry} staEn
     * @return {void}
     */
    function comp_update(sta, unit, staEn) {
        if(sta.burstTime < 0.0001 || staEn.time <= sta.burstTime) return;

        let dmg = sta.burstDamage + unit.maxHealth * sta.burstDamagePerc;
        FRAG_attack.damage(unit, dmg, 0.0, MDL_cond.isHotStatus(sta) ? "heat" : null, sta.burstDamageIgnoreShield);
        if(sta.burstScr != null) {
            sta.burstScr.get(unit);
        };
        sta.burstEff.at(unit.x, unit.y, unit.hitSize * 1.1, sta.burstEffColor);
        staEn.time = 15.0;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Handles burst of stackable status effects.
     * Does not handle how duration is extended, which should be done in templates.
     * @class INTF_STA_burstStatus
     */
    module.exports = new CLS_interface("INTF_STA_burstStatus", {


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: Duration above which this status effect bursts.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {number}
                 */
                burstTime: 0.0,
                /**
                 * `PARAM`: Damage dealt when this status effect bursts.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {number}
                 */
                burstDamage: 0.0,
                /**
                 * `PARAM`: Damage dealt as fraction of maximum health.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {number}
                 */
                burstDamagePerc: 0.0,
                /**
                 * `PARAM`: If true, damage from this status will ignore unit's shield.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {boolean}
                 */
                burstDamageIgnoreShield: true,
                /**
                 * `PARAM`: Effect shown when this status effect bursts.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {Effect}
                 */
                burstEff: Fx.none,
                /**
                 * `PARAM`: Color of burst effect.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {Color}
                 */
                burstEffColor: Color.white,
                /**
                 * `PARAM`: Called when this status effect bursts.
                 * @memberof INTF_STA_burstStatus
                 * @instance
                 * @type {CFunction<Unit>|null}
                 */
                burstScr: null,


            };
        },


        setStats: function(stats) {
            comp_setStats(this, getCtStats(this, stats));
        },


        update: function(unit, staEn) {
            comp_update(this, unit, staEn);
        },


        /**
         * Whether this status effect is actually a burst status effect.
         * @memberof INTF_STA_burstStatus
         * @instance
         * @func
         * @return {boolean}
         */
        ex_isStackSta: function() {
            return this.burstTime > 0.0;
        }
        .setProp({
            noSuper: true,
        }),


    });
