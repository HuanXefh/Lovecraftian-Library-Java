/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers new abilities.
     * @module lovec/tp/TP_ability
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @param {Ability} abi
     * @param {Table} tb
     * @param {CFunction<Table>} tableM
     * @return {void}
     */
    const addLovecStats = function(abi, tb, tableM) {
        tb.add("\n\n[gray]" + Core.bundle.get("ability.lovec-abi-" + abi.delegee.name + ".description") + "[]\n\n").wrap().width(350.0);
        tb.row();
        tableM(tb);
    };
    exports.addLovecStats = addLovecStats;


    /**
     * @param {Ability} abi
     * @param {string|unset} [nameMod]
     * @return {string}
     */
    const getLocalizedName = function(abi, nameMod) {
        return Vars.headless ? "" : Core.bundle.get("ability." + tryVal(nameMod, "lovec") + "-abi-" + abi.delegee.name + ".name");
    };
    exports.getLocalizedName = getLocalizedName;


    /* <------------------------------ attack ------------------------------> */


    /**
     * Creates explosion upon death.
     * @type {FFunction<Object, Ability>}
     */
    const explosion = paramObj => extend(Ability, {


        /** @type {string} */
        name: "explosion",
        /** @type {number} */
        dmg: readParam(paramObj, "dmg", 160.0),
        /** @type {number} */
        rad: readParam(paramObj, "rad", 40.0),
        /** @type {StatusEffect} */
        sta: readParam(paramObj, "sta", StatusEffects.blasted),
        /** @type {number} */
        staDur: readParam(paramObj, "staDur", 120.0),
        /** @type {Sound} */
        sound: fetchSound(readParam(paramObj, "se", "se-shot-explosion")),


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Stat.damage.localized(), Strings.autoFixed(this.delegee.dmg, 2)));
                tb.row();
                tb.add(MDL_text.getStat(Stat.range.localized(), Strings.autoFixed(this.delegee.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
                tb.row();
                if(this.delegee.sta !== StatusEffects.none) {
                    tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-status"), this.delegee.sta.localizedName));
                };
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            Damage.damage(unit.team, unit.x, unit.y, this.delegee.rad, this.delegee.dmg);
            SLCEntity.eachUnit(unit.x, unit.y, unit.team, this.delegee.rad, null, ounit => {
                ounit.apply(this.delegee.sta, this.delegee.staDur);
            });

            MDL_effect.showAt(unit.x, unit.y, this.delegee.rad < 16.0 ? GLB_eff.explosionSmall : GLB_eff.explosion, 0.0);
            MDL_effect.shake(unit.x, unit.y, this.delegee.dmg / 160.0);
            MDL_sound.playAt(unit.x, unit.y, this.delegee.sound, 1.0, 1.0, 0.1);
        },


        /**
         * @return {string}
         */
        localized() {
            return getLocalizedName(this);
        },


    });
    newAbility("explosion", explosion);
    exports.explosion = explosion;


    /* <------------------------------ support ------------------------------> */


    /**
     * Actively regenerates shield.
     * @type {FFunction<Object, Ability>}
     */
    const shieldCore = paramObj => extend(Ability, {


        /** @type {string} */
        name: "shield-core",
        /** @type {number} */
        maxShield: readParam(paramObj, "maxShield", 0.0),
        /** @type {number} */
        regenAmt: readParam(paramObj, "regenAmt", 0.0),
        /** @type {number} */
        regenIntv: readParam(paramObj, "regenIntv", 1.0),
        /** @type {IntMap<Interval>} */
        timerMap: new IntMap(),
        /** @type {Interval} */
        lastTimer: null,


        /**
         * @param {UnitType} utp
         * @return {void}
         */
        init(utp) {
            BOX_trigger.abilityDataInit.addGlobalListener(() => {
                this.delegee.timerMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Stat.shieldHealth.localized(), Strings.autoFixed(this.delegee.maxShield, 2)));
                tb.row();
                tb.add(MDL_text.getStat(Stat.repairSpeed.localized(), Strings.autoFixed(this.delegee.regenAmt / this.delegee.regenIntv * 60.0, 2), StatUnit.perSecond.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            this.delegee.timerMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            if(unit.shield >= this.delegee.maxShield) return;
            this.delegee.lastTimer = this.delegee.timerMap.get(unit.id);
            if(this.delegee.lastTimer == null) {
                this.delegee.lastTimer = new Interval(1);
                this.delegee.timerMap.put(unit.id, this.delegee.lastTimer);
            };
            if(!this.delegee.lastTimer.get(this.delegee.regenIntv)) return;

            unit.shield = Math.min(unit.shield + this.delegee.regenAmt, this.delegee.maxShield);
            unit.shieldAlpha = 1.0;
        },


        /**
         * @return {string}
         */
        localized() {
            return getLocalizedName(this);
        },


    });
    newAbility("shield-core", shieldCore);
    exports.shieldCore = shieldCore;


    /**
     * Targets and eliminates incoming bullets.
     * Can overheat if too many bullets are canceled.
     * @type {FFunction<Object, Ability>}
     */
    const laserDefense = paramObj => extend(Ability, {


        /** @type {string} */
        name: "laser-defense",
        /** @type {number} */
        dmg: readParam(paramObj, "dmg", 60.0),
        /** @type {number} */
        chargeCap: readParam(paramObj, "chargeCap", 180.0),
        /** @type {number} */
        chargeMtp: readParam(paramObj, "chargeMtp", 1.0),
        /** @type {number} */
        rad: readParam(paramObj, "rad", 80.0),
        /** @type {Sound} */
        sound: fetchSound(readParam(paramObj, "se", "se-shot-laser-defense")),
        /** @type {IntFloatMap} */
        progMap: new IntFloatMap(),
        /** @type {number} */
        lastProg: -1.0,
        /** @type {IntMap<boolean>} */
        inCdMap: new IntMap(),
        /** @type {boolean} */
        lastInCd: false,
        /** @type {Bullet|null} */
        lastBul: null,


        /**
         * @param {UnitType} utp
         * @return {void}
         */
        init(utp) {
            BOX_trigger.abilityDataInit.addGlobalListener(() => {
                this.delegee.progMap.clear();
                this.delegee.inCdMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Stat.damage.localized(), Strings.autoFixed(this.delegee.dmg, 2)));
                tb.row();
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-reloadtime"), Strings.autoFixed(this.delegee.chargeCap / 60.0 / this.delegee.chargeMtp, 2), StatUnit.seconds.localized()));
                tb.row();
                tb.add(MDL_text.getStat(Stat.range.localized(), Strings.autoFixed(this.delegee.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            this.delegee.progMap.remove(unit.id, -1.0);
            this.delegee.inCdMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            if(!syncChanceDelta("ability", 0.2)) return;
            this.delegee.lastProg = this.delegee.progMap.get(unit.id, -1.0);
            if(this.delegee.lastProg < 0.0) {
                this.delegee.lastProg = this.delegee.chargeCap;
                this.delegee.progMap.put(unit.id, this.delegee.chargeCap);
            };
            this.delegee.lastInCd = this.delegee.inCdMap.get(unit.id, false);

            this.delegee.lastProg = Math.min(this.delegee.lastProg + Time.delta * 5.0 * this.delegee.chargeMtp * SLCProp.getReloadMultiplier(unit), this.delegee.chargeCap);
            if(this.delegee.lastProg > 0.0 && !this.delegee.lastInCd) {
                this.delegee.lastBul = SLCEntity.getEnemyBullet(unit.x, unit.y, unit.team, this.delegee.rad);
                if(this.delegee.lastBul != null) {
                    this.delegee.lastProg = Mathf.maxZero(this.delegee.lastProg - Mathf.clamp((this.delegee.lastBul.damage + this.delegee.lastBul.type.splashDamage) / this.delegee.dmg, 0.25, 1.0) * this.delegee.dmg);
                    MDL_effect.pointLaser(unit.x, unit.y, unit, this.delegee.lastBul, GLB_color.remove, this.delegee.sound);
                    MDL_call.damageBul(this.delegee.lastBul, this.delegee.dmg);
                };
            };
            if(this.delegee.lastProg < 0.0001) {
                this.delegee.lastInCd = true;
                this.delegee.inCdMap.put(unit.id, this.delegee.lastInCd);
            };
            if(this.delegee.lastProg > this.delegee.chargeCap - 0.0001 && this.delegee.lastInCd) {
                this.delegee.lastInCd = false;
                this.delegee.inCdMap.put(unit.id, this.delegee.lastInCd);
            };
            this.delegee.progMap.put(unit.id, this.delegee.lastProg);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        draw(unit) {
            if(!GLB_param.SHOULD_DRAW_UNIT_RELOAD) return;

            MDL_draw.unitReload(
                unit, null,
                this.delegee.inCdMap.get(unit.id, false) ? Color.white : GLB_color.remove, 1.0, 0.0, 1,
                this.delegee.progMap.get(unit.id, 0.0) / this.delegee.chargeCap,
            );
        },


        /**
         * @return {string}
         */
        localized() {
            return getLocalizedName(this);
        },


    });
    newAbility("laser-defense", laserDefense);
    exports.laserDefense = laserDefense;


    /**
     * Actively repairs buildings in range.
     * @type {FFunction<Object, Ability>}
     */
    const buildingRepairerModule = paramObj => extend(Ability, {


        /** @type {string} */
        name: "building-repairer-module",
        /** @type {number} */
        healAmt: readParam(paramObj, "healAmt", 0.0),
        /** @type {number} */
        healPerc: readParam(paramObj, "healPerc", 0.0),
        /** @type {number} */
        intv: readParam(paramObj, "intv", 60.0),
        /** @type {number} */
        rad: readParam(paramObj, "rad", 40.0),
        /** @type {number} */
        strokeScl: readParam(paramObj, "strokeScl", 1.0),
        /** @type {IntMap<Interval>} */
        timerMap: new IntMap(),
        /** @type {Interval} */
        lastTimer: null,
        /** @type {Building|null} */
        lastB: null,


        /**
         * @param {UnitType} utp
         * @return {void}
         */
        init(utp) {
            BOX_trigger.abilityDataInit.addGlobalListener(() => {
                this.delegee.timerMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairamt"), MDL_text.getHealText(this.delegee.healAmt, this.delegee.healPerc)));
                tb.row();
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairintv"), Strings.autoFixed(this.delegee.intv / 60.0, 2), StatUnit.seconds.localized()));
                tb.row();
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairr"), Strings.autoFixed(this.delegee.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            this.delegee.timerMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            this.delegee.lastTimer = this.delegee.timerMap.get(unit.id);
            if(this.delegee.lastTimer == null) {
                this.delegee.lastTimer = new Interval(1);
                this.delegee.timerMap.put(unit.id, this.delegee.lastTimer);
            };
            if(!this.delegee.lastTimer.get(this.delegee.intv)) return;
            this.delegee.lastB = SLCEntity.getBuildBy(unit.x, unit.y, unit.team, this.delegee.rad, b => MDL_cond.canHeal(b));
            if(this.delegee.lastB == null) return;

            FRAG_attack.heal(this.delegee.lastB, this.delegee.lastB.maxHealth * this.delegee.healPerc + this.delegee.healAmt);
            MDL_effect.laser(unit.x, unit.y, unit, this.delegee.lastB, GLB_color.heal, this.delegee.strokeScl);
        },


        /**
         * @return {string}
         */
        localized() {
            return getLocalizedName(this);
        },


    });
    newAbility("building-repairer-module", buildingRepairerModule);
    exports.buildingRepairerModule = buildingRepairerModule;


    /* <------------------------------ internal ------------------------------> */


    /**
     * Displays unit durability.
     * @type {FFunction<Object, Ability>}
     */
    const unitDurability = param => extend(Ability, {


        /** @type {string} */
        name: "unit-durability",
        /** @type {number} */
        durabCap: readParam(paramObj, "durabCap", Number.n12),


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0fac-durabtime"), Strings.autoFixed(this.delegee.durabCap / 60.0, 2), StatUnit.seconds.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @param {Table} tb
         * @return {void}
         */
        displayBars(unit, tb) {
            tb.add(new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-durability-amt", (1.0 - Mathf.clamp(tryJsProp(unit, "unitDurabUsed", 0.0) / this.delegee.durabCap)).perc())),
                prov(() => GLB_color.sap),
                () => 1.0 - Mathf.clamp(tryJsProp(unit, "unitDurabUsed", 0.0) / this.delegee.durabCap),
            ));
        },


        /**
         * @return {string}
         */
        localized() {
            return getLocalizedName(this);
        },


    });
    newAbility("unit-durability", unitDurability);
    exports.unitDurability = unitDurability;
