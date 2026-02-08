/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new abilities.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- auxiliay ----------> */


  const comp_addStats = function(abi, tb, tableF) {
    tb.add("\n\n[gray]" + Core.bundle.get("ability.lovec-abi-" + abi.nm + ".description") + "[]\n\n").wrap().width(350.0);
    tb.row();
    tableF(tb);
  };
  exports.comp_addStats = comp_addStats;


  const comp_localized = function(abi) {
    return Core.bundle.get("ability.lovec-abi-" + abi.nm + ".name");
  };
  exports.comp_localized = comp_localized;


  /* <---------- attack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Creates explosion upon death.
   * ---------------------------------------- */
  newAbility(
    "explosion",
    (paramObj) => extend(Ability, {


      nm: "explosion",
      dmg: readParam(paramObj, "dmg", 160.0),
      rad: readParam(paramObj, "rad", 40.0),
      sta: readParam(paramObj, "sta", StatusEffects.blasted),
      staDur: readParam(paramObj, "staDur", 120.0),
      se: fetchSound(readParam(paramObj, "se", "se-shot-explosion")),


      addStats(tb) {
        comp_addStats(this, tb, tb => {
          tb.add(MDL_text._statText(Stat.damage.localized(), Strings.autoFixed(this.dmg, 2)));
          tb.row();
          tb.add(MDL_text._statText(Stat.range.localized(), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
          tb.row();
          if(this.sta !== StatusEffects.none) {
            tb.add(MDL_text._statText(Core.bundle.get("stat.lovec-stat-blk0misc-status"), this.sta.localizedName));
          };
        });
      },


      death(unit) {
        Damage.damage(unit.team, unit.x, unit.y, this.rad, this.dmg);
        MDL_pos._it_units(unit.x, unit.y, this.rad, unit.team, null, ounit => {
          ounit.apply(this.sta, this.staDur);
        });

        MDL_effect.showAt(unit.x, unit.y, this.rad < 16.0 ? EFF.explosionSmall : EFF.explosion, 0.0);
        MDL_effect.showAt_shake(unit.x, unit.y, this.dmg / 160.0);
        MDL_effect.playAt(unit.x, unit.y, this.se, 1.0, 1.0, 0.1);
      },


      localized() {
        return comp_localized(this);
      },


    }),
  );


  /* <---------- support ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Actively regenerates shield.
   * ---------------------------------------- */
  newAbility(
    "shield-core",
    (paramObj) => extend(Ability, {


      nm: "shield-core",
      maxShield: readParam(paramObj, "maxShield", 0.0),
      regenAmt: readParam(paramObj, "regenAmt", 0.0),
      regenIntv: readParam(paramObj, "regenIntv", 1.0),
      timerMap: new ObjectMap(),


      addStats(tb) {
        comp_addStats(this, tb, tb => {
          tb.add(MDL_text._statText(Stat.shieldHealth.localized(), Strings.autoFixed(this.maxShield, 2)));
          tb.row();
          tb.add(MDL_text._statText(Stat.repairSpeed.localized(), Strings.autoFixed(this.regenAmt / this.regenIntv * 60.0, 2), StatUnit.perSecond.localized()));
        });
      },


      update(unit) {
        if(!this.timerMap.containsKey(unit)) this.timerMap.put(unit, new Interval(1));
        if(unit.shield >= this.maxShield || !this.timerMap.get(unit).get(this.regenIntv)) return;

        unit.shield = Math.min(unit.shield + this.regenAmt, this.maxShield);
        unit.shieldAlpha = 1.0;
      },


      localized() {
        return comp_localized(this);
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Targets and eliminates incoming bullets.
   * Can overheat.
   * ---------------------------------------- */
  newAbility(
    "laser-defense",
    (paramObj) => extend(Ability, {


      nm: "laser-defense",
      dmg: readParam(paramObj, "dmg", 60.0),
      chargeCap: readParam(paramObj, "chargeCap", 180.0),
      chargeMtp: readParam(paramObj, "chargeMtp", 1.0),
      rad: readParam(paramObj, "rad", 80.0),
      se: fetchSound(readParam(paramObj, "se", "se-shot-laser-defense")),
      progMap: new ObjectMap(),
      inCdMap: new ObjectMap(),


      addStats(tb) {
        comp_addStats(this, tb, tb => {
          tb.add(MDL_text._statText(Stat.damage.localized(), Strings.autoFixed(this.dmg, 2)));
          tb.row();
          tb.add(MDL_text._statText(Core.bundle.get("stat.lovec-stat-blk0misc-reloadtime"), Strings.autoFixed(this.chargeCap / 60.0 / this.chargeMtp, 2), StatUnit.seconds.localized()));
          tb.row();
          tb.add(MDL_text._statText(Stat.range.localized(), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
        });
      },


      update(unit) {
        if(!Mathf.chance(0.2)) return;
        if(!this.progMap.containsKey(unit)) this.progMap.put(unit, this.chargeCap);
        if(!this.inCdMap.containsKey(unit)) this.inCdMap.put(unit, false);

        let prog = Math.min(this.progMap.get(unit, 0.0) + Time.delta * 5.0 * this.chargeMtp * MDL_entity._reloadMtp(unit), this.chargeCap);
        let inCd = this.inCdMap.get(unit, false);
        if(prog > 0.0 && !inCd) {
          let bul = MDL_pos._bulTg(unit.x, unit.y, unit.team, this.rad);
          if(bul != null) {
            prog = Mathf.maxZero(prog - Mathf.clamp((bul.damage + bul.type.splashDamage) / this.dmg, 0.25, 1.0) * this.dmg);
            MDL_effect.showBetween_pointLaser(unit.x, unit.y, bul, Pal.remove, this.se);
            MDL_call.damageBul(bul, this.dmg);
          };
        };
        if(prog < 0.0001) this.inCdMap.put(unit, true);
        if(prog > this.chargeCap - 0.0001 && inCd) this.inCdMap.put(unit, false);

        this.progMap.put(unit, prog);
      },


      draw(unit) {
        if(!PARAM.drawUnitReload) return;

        MDL_draw._d_reload(
          unit, null,
          this.inCdMap.get(unit, false) ? Color.white : Pal.remove, 1.0, 0.0, 1,
          this.progMap.get(unit, 0.0) / this.chargeCap,
        );
      },


      localized() {
        return comp_localized(this);
      },


    }),
  );


  /* ----------------------------------------
   * NOTE:
   *
   * Actively repairs buildings in range.
   * ---------------------------------------- */
  newAbility(
    "building-repairer-module",
    (paramObj) => extend(Ability, {


      nm: "building-repairer-module",
      healAmt: readParam(paramObj, "healAmt", 0.0),
      healPerc: readParam(paramObj, "healPerc", 0.0),
      intv: readParam(paramObj, "intv", 60.0),
      rad: readParam(paramObj, "rad", 40.0),
      strokeScl: readParam(paramObj, "strokeScl", 1.0),
      timerMap: new ObjectMap(),


      addStats(tb) {
        comp_addStats(this, tb, tb => {
          tb.add(MDL_text._statText(Core.bundle.get("stat.lovec-stat-blk0misc-repairamt"), MDL_text._healText(this.healAmt, this.healPerc)));
          tb.row();
          tb.add(MDL_text._statText(Core.bundle.get("stat.lovec-stat-blk0misc-repairintv"), Strings.autoFixed(this.intv / 60.0, 2), StatUnit.seconds.localized()));
          tb.row();
          tb.add(MDL_text._statText(Core.bundle.get("stat.lovec-stat-blk0misc-repairr"), Strings.autoFixed(this.rad / Vars.tilesize, 2), StatUnit.blocks.localized()));
        });
      },


      update(unit) {
        if(!this.timerMap.containsKey(unit)) this.timerMap.put(unit, new Interval(1));
        if(!this.timerMap.get(unit).get(this.intv)) return;
        let b = MDL_pos._b_base(unit.x, unit.y, unit.team, this.rad, b => MDL_cond._canHeal(b));
        if(b == null) return;

        FRAG_attack.heal(b, b.maxHealth * this.healPerc + this.healAmt);
        MDL_effect.showBetween_laser(unit.x, unit.y, unit, b, Pal.heal, this.strokeScl);
      },


      localized() {
        return comp_localized(this);
      },


    }),
  );
