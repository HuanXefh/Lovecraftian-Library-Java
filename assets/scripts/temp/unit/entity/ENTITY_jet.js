/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Unit, ENTITY_jet>} ENTITYJet
     */


    const PARENT = require("lovec/temp/unit/entity/ENTITY_airUnit");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENTITYJet} unit
     * @return {void}
     */
    function comp_updateUnit(unit) {
        unit.updateBoosting(true);
    };


    /**
     * @private
     * @param {ENTITYJet} unit
     * @param {boolean} shouldBoost
     * @return {void}
     */
    function comp_updateBoosting(unit, shouldBoost) {
        if(!unit.type.canBoost || unit.dead) return;
        unit.elevation = Mathf.approachDelta(
            unit.elevation,
            Math.max(
                Mathf.num(unit.onSolid() || (unit.isFlying() && !unit.canLand())),
                unit.speed() / unit.type.speed,
                unit.type.riseSpeed,
            ),
        );
    };


    /**
     * @private
     * @param {ENTITYJet} unit
     * @return {void}
     */
    function comp_canShoot(unit) {
        // Jet units can attack only when moving
        return !unit.disarmed && unit.type.canBoost && unit.isFlying();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * An air unit that only flies when moving.
     * @class ENTITY_jet
     * @extends ENTITY_airUnit
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENTITY_jet")
    .initTemplate()
    .setParent(Unit)
    .setParam({})
    .setMethod({


        updateUnit: function() {
            comp_updateUnit(this);
        },


        updateBoosting: function(shouldBoost) {
            comp_updateBoosting(this, shouldBoost);
        }
        .setProp({
            noSuper: true,
        }),


        canShoot: function() {
            return comp_canShoot(this);
        }
        .setProp({
            noSuper: true,
        }),


    });
