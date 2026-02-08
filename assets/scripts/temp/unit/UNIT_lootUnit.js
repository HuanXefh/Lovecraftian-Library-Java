/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Dropped item as a special unit.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/UNIT_technicalUnit");
  const PARAM = require("lovec/glb/GLB_param");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");


  const DB_status = require("lovec/db/DB_status");


  /* <---------- component ----------> */


  function comp_init(utp) {
    DB_status.db["group"]["lootImmune"].forEachFast(sta_gn => {
      let sta = MDL_content._ct(sta_gn, "sta", true);
      if(sta == null) return;
      utp.immunities.add(sta);
    });
    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        VARGEN.deathStas.forEachFast(sta => utp.immunities.add(sta));
      });
      if(!Vars.headless) utp.fullIcon = utp.uiIcon = Core.atlas.find("lovec-icon-drop-loot");
    });
  };


  function comp_update(utp, unit) {
    if(unit.fin() > 0.5 || unit.stack.amount < 1) unit.remove();
    if(MDL_cond._isLootProtected(unit)) return;

    // If damaged somehow, create explosion
    if(unit.health < 10.0 && unit.stack.amount > 0) {
      Damage.dynamicExplosion(
        unit.x, unit.y,
        unit.item().flammability * unit.stack.amount / 1.9,
        unit.item().explosiveness * unit.stack.amount * 1.53,
        unit.item().charge * Mathf.pow(unit.stack.amount, 1.11) * 160.0,
        28.0,
        Vars.state.rules.damageExplosions,
        unit.item().flammability > 0.9,
        null, Fx.none, 0.0,
      );
      unit.remove();
    };

    // Don't drown this to death
    if(unit.drownTime > 0.98) unit.remove();

    // Merge loot units randomly
    if(!Vars.net.client() && Mathf.chanceDelta(0.005)) {
      let ounit = MDL_pos._loot(unit.x, unit.y, VAR.rad_lootMergeRad, unit);
      if(ounit != null && ounit.item() === unit.item()) {
        unit.stack.amount += ounit.stack.amount;
        ounit.remove();
      };
    };

    // Apply reaction if possible
    if(!Vars.net.client() && Mathf.chance(0.05)) {
      let
        t = unit.tileOn(),
        puddle = t == null ? null : Puddles.get(unit.tileOn());

      if(puddle != null) {
        MDL_reaction.handleReaction(unit.item(), puddle.liquid, 20.0, unit);
      };
    };
  };


  function comp_draw(utp, unit) {
    if(unit.stack.amount === 0) return;

    let regScl = PARAM.drawStaticLoot ? 1.0 : (1.0 + Math.sin(Time.globalTime * 0.065) * 0.15);
    let sizeScl = Math.log(unit.stack.amount + 1.0) * 0.4;
    let shaW = regScl * sizeScl * 10.0;
    let regW = shaW * 0.5;
    let z = VAR.lay_unitRemains + 0.2 + sizeScl / 100.0;

    processZ(z);

    // Soft shadow
    Draw.color(
      Color.black,
      0.4 * (1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - (
        unit.lastDrownFloor == null ?
          0.0 :
          Interp.pow3In.apply(unit.drownTime)
      )),
    );
    Draw.rect(utp.softShadowRegion, unit.x, unit.y, shaW, shaW, 0.0);
    // Cicle, if used
    if(!PARAM.drawStaticLoot) {
      unit.lastDrownFloor == null ?
        Draw.color(Pal.accent) :
        Draw.color(Pal.accent, Tmp.c2.set(unit.lastDrownFloor.mapColor).mul(0.83), unit.drownTime * 0.9);
      Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - (unit.lastDrownFloor == null ? 0.0 : Interp.pow2In.apply(unit.drownTime)));
      Lines.stroke(1.0);
      Lines.circle(unit.x, unit.y, regScl * sizeScl * 4.5);
    };
    // Item icon
    unit.lastDrownFloor == null ?
      Draw.color(Color.white) :
      Draw.color(Color.white, Tmp.c3.set(unit.lastDrownFloor.mapColor).mul(0.83), unit.drownTime * 0.9);
    Draw.alpha(1.0 - Interp.pow10In.apply(unit.fin() * 2.0) - (unit.lastDrownFloor == null ? 0.0 : Interp.pow2In.apply(unit.drownTime)));
    Draw.rect(unit.item().uiIcon, unit.x, unit.y, regW, regW, unit.rotation);
    // Heat
    if(MDL_cond._isHot(unit)) {
      Draw.blend(Blending.additive);
      Draw.mixcol(Color.valueOf(Tmp.c2, "ff3838"), 1.0);
      Draw.alpha((0.5 + Mathf.absin(10.0, 0.5)) * 0.75);
      Draw.rect(unit.item().uiIcon, unit.x, unit.y, regW, regW, unit.rotation);
      Draw.blend();
    };
    Draw.reset();

    processZ(z);

    // Amount text
    if(PARAM.drawLootAmount && MDL_cond._posHovered(unit.x, unit.y, Math.max(sizeScl * 8.0, 6.0))) {
      MDL_draw._d_text(unit.x, unit.y - 4.0, String(unit.stack.amount), 0.85, unit.team.color);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(UnitType)
  .setTags()
  .setParam({
    entityName: "missile",

    itemCapacity: 99999,
    lifetime: VAR.time_lootLifetime * 2.0,                // Doubled to avoid killing the unit somehow, which shakes the screen
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    update: function(unit) {
      comp_update(this, unit);
    }
    .setProp({
      noSuper: true,
    }),


    draw: function(unit) {
      comp_draw(this, unit);
    }
    .setProp({
      noSuper: true,
    }),


    ex_resetLifetime: function(unit) {
      unit.time = 0.0;
    }
    .setProp({
      noSuper: true,
    }),


  });
