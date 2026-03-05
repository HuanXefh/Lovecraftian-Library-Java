/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods mostly related to spawning.
   * Well I don't know what this is for.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  /**
   * Scripts called by this will only get called once in each update.
   * @param {number|string} id
   * @param {function(): void} scr
   * @return {void}
   */
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


  /**
   * Spawns a unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} utp_gn
   * @param {Team|unset} [team]
   * @param {number|unset} [rad] - Radius of spead.
   * @param {number|unset} [ang] - Rotation of spawned units, random by default.
   * @param {number|unset} [repeat] - Use this to spawn multiple times quickly.
   * @param {boolean|unset} [applyDefSta] - If true, default status effects will be applied like what wave spawners do.
   * @param {(function(unit): void)|unset} [scr] - Script called on each spawned unit.
   * @return {void}
   */
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


  /**
   * Variant of {@link spawnUnit_server} for client side.
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} [utp_gn]
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {number|unset} [ang]
   * @param {number|unset} [repeat]
   * @param {boolean|unset} [applyDefSta]
   * @return {void}
   */
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


  /**
   * Lets a unit despawn.
   * @param {Unit|null} unit
   * @return {void}
   */
  const despawnUnit = function(unit) {
    if(unit == null) return;

    Call.unitDespawn(unit);
  }
  .setAnno("server");
  exports.despawnUnit = despawnUnit;


  /**
   * Rotates a unit by some angle.
   * @param {Unit} unit
   * @param {number} ang
   * @return {void}
   */
  const rotateUnit = function(unit, ang) {
    unit.rotation += ang;
    if(unit.baseRotation != null) unit.baseRotation += ang;
  };
  exports.rotateUnit = rotateUnit;


  /**
   * Applies knockback on some unit from a center.
   * @param {number} x
   * @param {number} y
   * @param {Unit|null} unit
   * @param {number|unset} [pow] - Knockback power, can be negative to pull units.
   * @param {number|unset} [rad] - Knockback radius, the power decreases when target gets farther.
   * @param {number|unset} [ang] - Angle to knockback, leave empty to push units back from the center.
   * @return {void}
   */
  const knockback = function(x, y, unit, pow, rad, ang) {
    if(unit == null || MDL_cond._isHighAir(unit)) return;
    if(pow == null) pow = 0.0;
    if(Math.abs(pow) < 0.0001) return;

    let pow_fi = rad == null ? pow : (pow * (1.0 - Mathf.clamp(Mathf.dst(x, y, unit.x, unit.y) / rad)) * 4.0);
    if(unit.flying) pow_fi *= 2.5;

    let vec2 = Tmp.v1.set(unit).sub(x, y).nor().scl(pow_fi * 80.0);
    if(ang != null) vec.setAngle(ang + (pow_fi < 0.0 ? 180.0 : 0.0));

    unit.impulse(vec2);
  };
  exports.knockback = knockback;


  /**
   * Spawns a loot unit (dropped item) at (x, y), see {@link spawnUnit_server}.
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @param {number|unset} [amt]
   * @param {number|unset} [rad]
   * @param {number|unset} [repeat]
   * @return {void}
   */
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
      MDL_effect._e_line(x, y, null, unit, Pal.accent);
      Core.app.post(() => TRIGGER.lootSpawn.fire(unit));
    });
  }
  .setAnno("server");
  exports.spawnLoot_server = spawnLoot_server;


  /**
   * Variant of {@link spawnLoot_server} for client side.
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @param {number|unset} [amt]
   * @param {number|unset} [rad]
   * @param {number|unset} [repeat]
   * @return {void}
   */
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


  /**
   * Removes all existing loot units.
   * @return {void}
   */
  const clearLoot = function() {
    Groups.unit.each(unit => {
      if(MDL_cond._isLoot(unit)) unit.remove();
    });
  }
  .setAnno("server");
  exports.clearLoot = clearLoot;


  /* <---------- bullet ----------> */


  /**
   * Spawns a bullet at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {BulletType|null} btp
   * @param {SoundGn} se_gn
   * @param {Team|unset} [team]
   * @param {number|unset} [rad]
   * @param {number|unset} [ang]
   * @param {number|unset} [repeat]
   * @param {number|unset} [dmg_ow]
   * @param {number|unset} [scl] - Multiplier on lifetime.
   * @param {number|unset} [velScl] - Multiplier on velocity.
   * @return {void}
   */
  const spawnBul = function(x, y, btp, se_gn, team, rad, ang, repeat, dmg_ow, scl, velScl) {
    if(btp == null) return;
    if(team == null) team = Team.derelict;
    if(rad == null) rad = 0.0;
    if(ang == null) ang = "rand";
    if(repeat == null) repeat = 1;
    if(dmg_ow == null) dmg_ow = -1;
    if(scl == null) scl = 1.0;
    if(velScl == null) velScl = 1.0;

    let x_i, y_i, ang_i;
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


  /**
   * Applies damage on a bullet, will destroy it if bullet damage is reduced to zero.
   * @param {Bullet|null} bul
   * @param {number|unset} [dmg]
   * @return {void}
   */
  const damageBul = function(bul, dmg) {
    if(bul == null) return;
    if(dmg == null) dmg = 0.0;
    if(dmg < 0.0001) return;

    bul.damage > dmg ? (bul.damage -= dmg) : bul.remove();
  };
  exports.damageBul = damageBul;
