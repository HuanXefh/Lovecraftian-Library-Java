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
        tb.add("\n\n[gray]" + Core.bundle.get("ability.lovec-abi-" + abi.name + ".description") + "[]\n\n").wrap().width(350.0);
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
        return Vars.headless ? "" : Core.bundle.get("ability." + tryVal(nameMod, "lovec") + "-abi-" + abi.name + ".name");
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
                tb.add(MDL_text.getStat(Stat.damage.localized(), Strings.autoFixed(this.dmg, 2)));
                tb.row();
                tb.add(MDL_text.getStat(Stat.range.localized(), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
                tb.row();
                if(this.sta !== StatusEffects.none) {
                    tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-status"), this.sta.localizedName));
                };
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            Damage.damage(unit.team, unit.x, unit.y, this.rad, this.dmg);
            LCEntity.eachUnit(unit.x, unit.y, unit.team, this.rad, null, ounit => {
                ounit.apply(this.sta, this.staDur);
            });

            MDL_effect.showAt(unit.x, unit.y, this.rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
            MDL_effect.shake(unit.x, unit.y, this.dmg / 160.0);
            MDL_sound.playAt(unit.x, unit.y, this.sound, 1.0, 1.0, 0.1);
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
            TRIGGER.abilityDataInit.addGlobalListener(() => {
                this.timerMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Stat.shieldHealth.localized(), Strings.autoFixed(this.maxShield, 2)));
                tb.row();
                tb.add(MDL_text.getStat(Stat.repairSpeed.localized(), Strings.autoFixed(this.regenAmt / this.regenIntv * 60.0, 2), StatUnit.perSecond.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            this.timerMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            if(unit.shield >= this.maxShield) return;
            this.lastTimer = this.timerMap.get(unit.id);
            if(this.lastTimer == null) {
                this.lastTimer = new Interval(1);
                this.timerMap.put(unit.id, this.lastTimer);
            };
            if(!this.lastTimer.get(this.regenIntv)) return;

            unit.shield = Math.min(unit.shield + this.regenAmt, this.maxShield);
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
            TRIGGER.abilityDataInit.addGlobalListener(() => {
                this.progMap.clear();
                this.inCdMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
          addLovecStats(this, tb, tb => {
            tb.add(MDL_text.getStat(Stat.damage.localized(), Strings.autoFixed(this.dmg, 2)));
            tb.row();
            tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-reloadtime"), Strings.autoFixed(this.chargeCap / 60.0 / this.chargeMtp, 2), StatUnit.seconds.localized()));
            tb.row();
            tb.add(MDL_text.getStat(Stat.range.localized(), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
          });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
          this.progMap.remove(unit.id, -1.0);
          this.inCdMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            if(!syncChanceDelta("ability", 0.2)) return;
            this.lastProg = this.progMap.get(unit.id, -1.0);
            if(this.lastProg < 0.0) {
                this.lastProg = this.chargeCap;
                this.progMap.put(unit.id, this.chargeCap);
            };
            this.lastInCd = this.inCdMap.get(unit.id, false);

            this.lastProg = Math.min(this.lastProg + Time.delta * 5.0 * this.chargeMtp * LCProp.getReloadMultiplier(unit), this.chargeCap);
            if(this.lastProg > 0.0 && !this.lastInCd) {
                this.lastBul = LCEntity.getEnemyBullet(unit.x, unit.y, unit.team, this.rad);
                if(this.lastBul != null) {
                    this.lastProg = Mathf.maxZero(this.lastProg - Mathf.clamp((bul.damage + bul.type.splashDamage) / this.dmg, 0.25, 1.0) * this.dmg);
                    MDL_effect.pointLaser(unit.x, unit.y, this.lastBul, Pal.remove, this.sound);
                    MDL_call.damageBul(this.lastBul, this.dmg);
                };
            };
            if(this.lastProg < 0.0001) {
                this.lastInCd = true;
                this.inCdMap.put(unit.id, this.lastInCd);
            };
            if(this.lastProg > this.chargeCap - 0.0001 && this.lastInCd) {
                this.lastInCd = false;
                this.inCdMap.put(unit.id, this.lastInCd);
            };
            this.progMap.put(unit.id, this.lastProg);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        draw(unit) {
            if(!PARAM.SHOULD_DRAW_UNIT_RELOAD) return;

            MDL_draw.unitReload(
                unit, null,
                this.inCdMap.get(unit.id, false) ? Color.white : Pal.remove, 1.0, 0.0, 1,
                this.progMap.get(unit.id, 0.0) / this.chargeCap,
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
            TRIGGER.abilityDataInit.addGlobalListener(() => {
                this.timerMap.clear();
            });
        },


        /**
         * @param {Table} tb
         * @return {void}
         */
        addStats(tb) {
            addLovecStats(this, tb, tb => {
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairamt"), MDL_text.getHealText(this.healAmt, this.healPerc)));
                tb.row();
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairintv"), Strings.autoFixed(this.intv / 60.0, 2), StatUnit.seconds.localized()));
                tb.row();
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0misc-repairr"), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        death(unit) {
            this.timerMap.remove(unit.id);
        },


        /**
         * @param {Unit} unit
         * @return {void}
         */
        update(unit) {
            this.lastTimer = this.timerMap.get(unit.id);
            if(this.lastTimer == null) {
                this.lastTimer = new Interval(1);
                this.timerMap.put(unit.id, this.lastTimer);
            };
            if(!this.lastTimer.get(this.intv)) return;
            this.lastB = LCEntity.getBuildBy(unit.x, unit.y, unit.team, this.rad, b => MDL_cond.canHeal(b));
            if(this.lastB == null) return;

            FRAG_attack.heal(this.lastB, this.lastB.maxHealth * this.healPerc + this.healAmt);
            MDL_effect.laser(unit.x, unit.y, unit, this.lastB, Pal.heal, this.strokeScl);
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
                tb.add(MDL_text.getStat(Core.bundle.get("stat.lovec-stat-blk0fac-durabtime"), Strings.autoFixed(this.durabCap / 60.0, 2), StatUnit.seconds.localized()));
            });
        },


        /**
         * @param {Unit} unit
         * @param {Table} tb
         * @return {void}
         */
        displayBars(unit, tb) {
            tb.add(new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-durability-amt", (1.0 - Mathf.clamp(tryJsProp(unit, "unitDurabUsed", 0.0) / this.durabCap)).perc())),
                prov(() => Pal.sap),
                () => 1.0 - Mathf.clamp(tryJsProp(unit, "unitDurabUsed", 0.0) / this.durabCap),
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
