/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to units.
     * @module lovec/frag/FRAG_unit
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ base ------------------------------> */


    /**
     * Whether `e` is `caller` or part of it.
     * Used to avoid damage to the caller itself on some occasions like impact wave.
     * @param {Entityc} e
     * @param {Entityc|unset} [caller]
     * @return {boolean}
     */
    const checkCaller = function(e, caller) {
        if(caller == null) return false;

        if(e instanceof Bullet && caller instanceof Bullet) {
            if(e.id === caller.id) return true;
        } else if(e instanceof Building && caller instanceof Building) {
            if(e.id === caller.id) return true;
            if(e.block instanceof MultiBlockLinkBlock && e.linkedBuild != null && e.linkedBuild.id === caller.id) return true;
        } else if(e instanceof Unit && caller instanceof Unit) {
            if(e.id === caller.id) return true;
            if(e instanceof Segmentc && e.headSegment === caller) return true;
        };

        return false;
    };
    exports.checkCaller = checkCaller;


    /* <------------------------------ component (unit type) ------------------------------> */


    /**
     * Makes a unit gain status effects based on current health.
     * Called only by Lovec units for obvious reason.
     * @param {UnitType} utp
     * @param {Unit} unit
     * @return {void}
     */
    const updateDamagedSta = function(utp, unit) {
        if(!GLB_timer.unit || !syncChance("unit", GLB_var.chance.unitUpdateP)) return;

        let healthFrac = Mathf.clamp(unit.health / unit.maxHealth);

        if(MDL_cond.isNonRobot(utp)) {
            if(healthFrac < 0.25) {
                unit.apply(GLB_varGen.staHeavilyInjured, GLB_var.time.unitStaDef);
                unit.unapply(GLB_varGen.staSlightlyInjured);
                unit.unapply(GLB_varGen.staInjured);
            } else if(healthFrac < 0.5) {
                unit.apply(GLB_varGen.staInjured, GLB_var.time.unitStaDef);
                unit.unapply(GLB_varGen.staSlightlyInjured);
                unit.unapply(GLB_varGen.staHeavilyInjured);
            } else if(healthFrac < 0.75) {
                unit.apply(GLB_varGen.staSlightlyInjured, GLB_var.time.unitStaDef);
                unit.unapply(GLB_varGen.staInjured);
                unit.unapply(GLB_varGen.staHeavilyInjured);
            } else {
                unit.unapply(sta1);
                unit.unapply(sta2);
                unit.unapply(sta3);
            };
        } else {
            if(healthFrac < 0.25) {
                unit.apply(GLB_varGen.staSeverelyDamaged, GLB_var.time.unitStaDef);
                unit.unapply(GLB_varGen.staDamaged)
            } else if(healthFrac < 0.5) {
                unit.apply(GLB_varGen.staDamaged, GLB_var.time.unitStaDef);
                unit.unapply(GLB_varGen.staSeverelyDamaged)
            } else {
                unit.unapply(GLB_varGen.staDamaged);
                unit.unapply(GLB_varGen.staSeverelyDamaged)
            };
        };
    };
    exports.updateDamagedSta = updateDamagedSta;


    /**
     * Generic update that handles surroundings of a unit.
     * Called for every unit.
     * @param {UnitType} utp
     * @param {Unit} unit
     * @return {void}
     */
    const updateSurrounding = function thisFun(utp, unit) {
        if(!GLB_timer.unit || !syncChance("unit", GLB_var.chance.unitUpdateP)) return;

        let t = unit.tileOn();
        if(t == null) return;
        let ts = LCPos.getTilesDstManhattan(thisFun.tmpTs, t, GLB_var.range.unitSurR);

        // Floor
        if(MDL_cond.isUnitOnFloor(unit)) {

        };

        // Range
        let dst, oblk, ob;
        ts.forEachFast(ot => {
            // Param
            dst = Mathf.dst(ot.worldx(), ot.worldy(), unit.x, unit.y);
            oblk = ot.block();
            ob = ot.build;

            // Tree
            if(!(oblk instanceof AirBlock) && MDL_cond.isUnitCoverable(unit, true)) {
                if(
                    (MDL_cond.isTreeBlock(oblk) && oblk.delegee.hidable && dst < oblk.delegee.treeRad)
                        || (MDL_cond.isTallGrassBlock(oblk) && oblk.delegee.hidable && dst < oblk.size * Vars.tilesize * 0.5)
                        || (MDL_cond.isCrop(oblk) && ob.delegee.stageHidable && dst < ob.delegee.stageCropRad)
                ) {
                    if(GLB_varGen.staHiddenWell != null && !unit.hasEffect(GLB_varGen.staHiddenWell)) {
                        BOX_trigger.treeHide.fire(unit);
                    };
                    unit.apply(GLB_varGen.staHiddenWell, GLB_var.time.unitStaDef);
                };
            };
        }, true);
    }
    .setProp({
        /**
         * @memberof updateSurrounding
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });
    exports.updateSurrounding = updateSurrounding;


    /**
     * Handles heat damage, called for every unit.
     * @param {UnitType} utp
     * @param {Unit} unit
     * @return {void}
     */
    const updateHeat = function(utp, unit) {
        if(!GLB_timer.unit || !syncChance("unit", GLB_var.chance.unitUpdateP * 0.3)) return;
        if(!MDL_cond.isHeatDamageable(unit)) return;

        let rHeat = MDL_flow.calcRHeat(unit.tileOn());
        let rHeatRes = MDL_flow.getRHeatRes(utp);
        let dmg = Mathf.maxZero(rHeat - rHeatRes) * 0.65;
        if(dmg < 0.0001) return;
        let dmg_fi = Math.min(dmg, GLB_var.param.heatDmgMax);
        let staStackAmt = Math.round((dmg - dmg_fi) / GLB_var.param.overheatedConversionDmg);

        FRAG_attack.damage(unit, dmg_fi, 0.0, "heat");
        let i = 0;
        while(i < staStackAmt) {
            unit.apply(GLB_varGen.staOverheated);
            i++;
        };
        if(Mathf.chance(0.5)) {
            GLB_eff.smogHeat.at(unit);
        };
    };
    exports.updateHeat = updateHeat;
