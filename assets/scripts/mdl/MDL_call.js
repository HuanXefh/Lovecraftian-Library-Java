/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods mostly related to spawning.
   * Well I don't know what this do either.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  const DB_status = require("lovec/db/DB_status");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Script called by this will be called only once in each round of update.
   * ---------------------------------------- */
  const callOnce = function thisFun(id, scr) {
    if(Vars.state.updateId !== thisFun.idCurMap.get(id, 0)) {
      thisFun.idCurMap.put(id, Vars.state.updateId);
      scr();
    };
  }
  .setProp({
    idCurMap: new ObjectMap(),
  })
  .setAnno("init", function() {
    MDL_event._c_onLoad(() => {
      TRIGGER.mapChange.addGlobalListener(nmMap => callOnce.idCurMap.clear());
    }, 10777892);
  });
  exports.callOnce = callOnce;


  /* <---------- unit ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Spawns a unit at (x, y).
   * Use {repeat} to spawn multiple times in radius of {rad}.
   * Set {ang} to apply a specific rotation.
   * Use {scr} to furthur modify those spawned units.
   * ---------------------------------------- */
  const spawnUnit_server = function(x, y, utp_gn, team, rad, ang, repeat, applyDefSta, scr) {
    let utp = MDL_content._ct(utp_gn, "utp");
    if(utp == null) return;
    if(team == null) team = Team.sharded;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = "rand";
    if(repeat == null) repeat = 1;

    let x_i, y_i, ang_i;
    for(let i = 0; i < repeat; i++) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      ang_i = ang === "rand" ? Mathf.random(360.0) : ang;

      let unit = scr == null ? utp.spawn(team, x_i, y_i, ang_i) : utp.spawn(team, x_i, y_i, ang_i, scr);
      if(applyDefSta) {
        unit.apply(StatusEffects.unmoving, 30.0);
        unit.apply(StatusEffects.invincible, 60.0);
      };
      Units.notifyUnitSpawn(unit);
    };
  }
  .setAnno("server");
  exports.spawnUnit_server = spawnUnit_server;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {spawnUnit} for sync.
   * ---------------------------------------- */
  const spawnUnit_client = function(x, y, utp_gn, team, rad, ang, repeat, applyDefSta) {
    let utp = MDL_content._ct(utp_gn, "utp");
    if(utp == null) return;
    if(team == null) team = Team.sharded;

    MDL_net.sendPacket(
      "client", "lovec-client-unit-spawn",
      packPayload([
        x, y, utp.name, team.id, rad, ang, repeat, applyDefSta,
      ]),
      true, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("client", "lovec-client-unit-spawn", payload => {
      let args = unpackPayload(payload);
      spawnUnit_server(args[0], args[1], args[2], Team.get(args[3]), args[4], args[5], args[6], args[7]);
    });
  })
  .setAnno("client")
  .setAnno("non-console");
  exports.spawnUnit_client = spawnUnit_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit despawn.
   * ---------------------------------------- */
  const despawnUnit = function(unit) {
    if(unit == null) return;

    Call.unitDespawn(unit);
  }
  .setAnno("server");
  exports.despawnUnit = despawnUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Rotates the unit by some angle.
   * ---------------------------------------- */
  const rotateUnit = function(unit, ang) {
    unit.rotation += ang;
    if(unit.baseRotation != null) unit.baseRotation += ang;
  };
  exports.rotateUnit = rotateUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Applys knockback for {unit} from a center of (x, y), with {pow} as the power.
   * {pow} can be negative to pull the target.
   * Set {rad} to apply range knockback, e.g. for splash damage.
   * Set {ang} to push/pull the target in a specific angle.
   * ---------------------------------------- */
  const knockback = function(x, y, unit, pow, rad, ang) {
    if(unit == null || MDL_cond._isHighAir(unit)) return;
    if(pow == null) pow = 0.0;
    if(Math.abs(pow) < 0.0001) return;

    var pow_fi = rad == null ? pow : (pow * (1.0 - Mathf.clamp(Mathf.dst(x, y, unit.x, unit.y) / rad)) * 4.0);
    if(unit.flying) pow_fi *= 2.5;

    let vec2 = Tmp.v1.set(unit).sub(x, y).nor().scl(pow_fi * 80.0);
    if(ang != null) vec.setAngle(ang + (pow_fi < 0.0 ? 180.0 : 0.0));

    unit.impulse(vec2);
  };
  exports.knockback = knockback;


  /* ----------------------------------------
   * NOTE:
   *
   * Spawns a loot unit.
   * It's item on the ground which can be picked up by player units.
   * ---------------------------------------- */
  const spawnLoot_server = function(x, y, itm_gn, amt, rad, repeat) {
    if(!PARAM.modded) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(rad == null) rad = VAR.rad_unitLootRad;
    if(repeat == null) repeat = 1;

    spawnUnit_server(x, y, Vars.content.unit("loveclab-unit0misc-loot"), Vars.player.team(), rad, null, repeat, false, unit => {
      unit.addItem(itm, amt);
      MDL_effect.showAt_global(unit.x, unit.y, EFF.circlePulseDynamic, 5.0, Pal.accent);
      MDL_effect.showBetween_line(x, y, null, unit, Pal.accent);
      Core.app.post(() => TRIGGER.lootSpawn.fire(unit));
    });
  }
  .setAnno("server");
  exports.spawnLoot_server = spawnLoot_server;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {spawnLoot} used on client side.
   * ---------------------------------------- */
  const spawnLoot_client = function(x, y, itm_gn, amt, rad, repeat) {
    if(!PARAM.modded) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;

    MDL_net.sendPacket(
      "client", "lovec-client-loot-spawn",
      packPayload([
        x, y, itm.name, amt, rad, repeat,
      ]),
      true, true,
    );
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("server", "lovec-client-loot-spawn", payload => {
      spawnLoot_server.apply(null, unpackPayload(payload));
    });
  })
  .setAnno("client")
  .setAnno("non-console");
  exports.spawnLoot_client = spawnLoot_client;


  /* ----------------------------------------
   * NOTE:
   *
   * Clears all loot units, only called on server side.
   * ---------------------------------------- */
  const clearLoot = function() {
    Groups.unit.each(unit => {
      if(MDL_cond._isLoot(unit)) unit.remove();
    });
  }
  .setAnno("server");
  exports.clearLoot = clearLoot;


  /* <---------- bullet ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Like {spawnUnit} but for bullets.
   * Set {se_gn} if a sound should be played.
   * ---------------------------------------- */
  const spawnBul = function(x, y, btp, se_gn, team, rad, ang, repeat, dmg_ow, scl, velScl) {
    if(btp == null) return;
    if(team == null) team = Team.derelict;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = "rand";
    if(repeat == null) repeat = 1;
    if(dmg_ow == null) dmg_ow = -1;
    if(scl == null) scl = 1.0;
    if(velScl == null) velScl = 1.0;

    var x_i;
    var y_i;
    for(let i = 0; i < repeat; i++) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      ang_i = ang === "rand" ? Mathf.random(360.0) : ang;

      Call.createBullet(btp, team, x_i, y_i, ang_i, dmg_ow, velScl, scl);
    };

    MDL_effect.playAt(x, y, se_gn);
  }
  .setAnno("server");
  exports.spawnBul = spawnBul;


  /* ----------------------------------------
   * NOTE:
   *
   * Applies damage to a bullet.
   * Destroys the bullet if bullet damage is reduced to below zero.
   * ---------------------------------------- */
  const damageBul = function(bul, dmg) {
    if(bul == null) return;
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;

    bul.damage > dmg ? (bul.damage -= dmg) : bul.remove();
  };
  exports.damageBul = damageBul;
