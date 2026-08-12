/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods mostly related to spawning.
   * Well I don't know what this is for.
   * @module lovec/mdl/MDL_call
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


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
    MDL_event.onLoad(() => {
      TRIGGER.mapChange.addGlobalListener(nameMap => callOnce.idCurMap.clear());
    });
  });
  exports.callOnce = callOnce;


  /* <------------------------------ unit ------------------------------ */


  /**
   * Spawns a unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} utp_gn
   * @param {Team} team
   * @param {number|unset} [ang]
   * @param {function(unit): void|unset} [scr]
   * @return {Unit}
   */
  const spawnUnit_server = function(x, y, utp_gn, team, ang, scr) {
    let utp = MDL_content.getCt(utp_gn, "utp");
    if(utp == null) return;
    if(ang == null) ang = Mathf.random(360.0);

    let unit = scr == null ?
      utp.spawn(team, x, y, ang) :
      utp.spawn(team, x, y, ang, scr);
    Units.notifyUnitSpawn(unit);

    return unit;
  }
  .setAnno("server");
  exports.spawnUnit_server = spawnUnit_server;


  /**
   * Spawns units around (x, y).
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} utp_gn
   * @param {Team} team
   * @param {number|unset} [ang]
   * @param {number|unset} [rad]
   * @param {number|unset} [amt]
   * @param {(function(unit): void)|unset} [scr]
   * @return {void}
   */
  const spawnUnits_server = function(x, y, utp_gn, team, ang, rad, amt, scr) {
    let utp = MDL_content.getCt(utp_gn, "utp");
    if(utp == null) return;
    if(rad == null) rad = 0.0;
    if(amt == null) amt = 1;

    let
      i = 0,
      x_i,
      y_i,
      ang_i;

    while(i < amt) {
      x_i = x + Mathf.range(rad);
      y_i = y + Mathf.range(rad);
      ang_i = ang != null ? ang : Mathf.random(360.0);
      spawnUnit_server(x_i, y_i, utp, team, ang_i, scr);
      i++;
    };
  }
  .setAnno("server");
  exports.spawnUnits_server = spawnUnits_server;


  /**
   * Variant of {@link spawnUnit_server} for client side.
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} utp_gn
   * @param {Team} team
   * @param {number|unset} [ang]
   * @return {void}
   */
  const spawnUnit_client = function(x, y, utp_gn, team, ang) {
    let utp = MDL_content.getCt(utp_gn, "utp");
    if(utp == null) return;

    MDL_net.sendPacket(
      PacketModes.SERVER, "lovec-client-unit-spawn",
      packPayload([
        x, y, utp.name, team.id, ang,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.SERVER, "lovec-client-unit-spawn", payload => {
      let args = unpackPayload(payload);
      spawnUnit_server(args[0], args[1], args[2], Team.get(args[3], args[4]));
    });
  })
  .setAnno("client");
  exports.spawnUnit_client = spawnUnit_client;




  /**
   * Variant of {@link spawnUnits_server} for client side.
   * @param {number} x
   * @param {number} y
   * @param {UnitTypeGn} utp_gn
   * @param {Team} team
   * @param {number|unset} [ang]
   * @param {number|unset} [rad]
   * @param {number|unset} [amt]
   * @return {void}
   */
  const spawnUnits_client = function(x, y, utp_gn, team, ang, rad, amt) {
    let utp = MDL_content.getCt(utp_gn, "utp");
    if(utp == null) return;

    MDL_net.sendPacket(
      PacketModes.SERVER, "lovec-client-units-spawn",
      packPayload([
        x, y, utp.name, team.id, ang, rad, amt,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.SERVER, "lovec-client-units-spawn", payload => {
      let args = unpackPayload(payload);
      spawnUnits_server(args[0], args[1], args[2], Team.get(args[3]), args[4], args[5], args[6]);
    });
  })
  .setAnno("client");
  exports.spawnUnits_client = spawnUnits_client;


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
   * @param {Unit} unit
   * @param {number} pow - Can be negative to pull units.
   * @param {number|unset} [rad]
   * @param {number|unset} [ang] - Leave empty to push units back from the center.
   * @return {void}
   */
  const knockback = function(x, y, unit, pow, rad, ang) {
    if(MDL_cond._isHighAir(unit)) return;
    if(Math.abs(pow) < 0.0001) return;

    let pow_fi = rad == null ?
      pow :
      (pow * (1.0 - Mathf.clamp(Mathf.dst(x, y, unit.x, unit.y) / rad)) * 4.0);
    if(unit.flying) pow_fi *= 2.5;

    let vec = Tmp.v1.set(unit).sub(x, y).nor().scl(pow_fi * 80.0);
    if(ang != null) {
      vec.setAngle(ang + (pow_fi < 0.0 ? 180.0 : 0.0));
    };
    unit.impulse(vec);
  };
  exports.knockback = knockback;


  /* <------------------------------ loot unit ------------------------------ */


  /**
   * Spawns a loot unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @param {number} itmAmt
   * @return {Unit}
   */
  const spawnLoot_server = function(x, y, itm_gn, itmAmt) {
    if(!PARAM.MODDED || itmAmt < 1) return;
    let itm = MDL_content.getCt(itm_gn, "rs");
    if(itm == null) return;

    return spawnUnit_server(
      x, y, VARGEN.utpLoot, Vars.player.team(), null,
      unit => {
        unit.addItem(itm, itmAmt);
        Core.app.post(() => TRIGGER.lootSpawn.fire());
      },
    );
  }
  .setAnno("server");
  exports.spawnLoot_server = spawnLoot_server;


  /**
   * Spawns loot units around (x, y).
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @param {number} itmAmt
   * @param {number|unset} [rad]
   * @param {number|unset} [amt]
   * @return {void}
   */
  const spawnLoots_server = function(x, y, itm_gn, itmAmt, rad, amt) {
    if(!PARAM.MODDED || itmAmt < 1) return;
    let itm = MDL_content.getCt(itm_gn, "rs");
    if(itm == null) return;
    if(rad == null) rad = VAR.range.unitLootRad;
    if(amt == null) amt = 1;

    spawnUnits_server(
      x, y, VARGEN.utpLoot, Vars.player.team(), null, rad, amt,
      unit => {
        unit.addItem(itm, itmAmt);
        Core.app.post(() => TRIGGER.lootSpawn.fire());
      },
    );
  }
  .setAnno("server");
  exports.spawnLoots_server = spawnLoots_server;


  /**
   * Variant of {@link spawnLoot_server} for client side.
   */
  const spawnLoot_client = function(x, y, itm_gn, itmAmt) {
    if(!PARAM.MODDED || itmAmt < 1) return;
    let itm = MDL_content.getCt(itm_gn, "rs");
    if(itm == null) return;

    MDL_net.sendPacket(
      PacketModes.SERVER, "lovec-client-loot-spawn",
      packPayload([
        x, y, itm.name, itmAmt,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.SERVER, "lovec-client-loot-spawn", payload => {
      spawnLoot_server.apply(null, unpackPayload(payload));
    });
  })
  .setAnno("client");
  exports.spawnLoot_client = spawnLoot_client;


  /**
   * Variant of {@link spawnLoots_server} for client side.
   * @param {number} x
   * @param {number} y
   * @param {ItemGn} itm_gn
   * @param {number} itmAmt
   * @param {number|unset} [rad]
   * @param {number|unset} [amt]
   * @return {void}
   */
  const spawnLoots_client = function(x, y, itm_gn, itmAmt, rad, amt) {
    if(!PARAM.MODDED || itmAmt < 1) return;
    let itm = MDL_content.getCt(itm_gn, "rs");
    if(itm == null) return;

    MDL_net.sendPacket(
      PacketModes.SERVER, "lovec-client-loots-spawn",
      packPayload([
        x, y, itm.name, itmAmt, rad, amt,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.SERVER, "lovec-client-loots-spawn", payload => {
      spawnLoots_server.apply(null, unpackPayload(payload));
    });
  })
  .setAnno("client");
  exports.spawnLoots_client = spawnLoots_client;


  /**
   * Removes all existing loot units.
   * @return {void}
   */
  const clearLoot = function thisFun() {
    thisFun.tmpUnits.clear();
    Groups.unit.each(unit => {
      if(MDL_cond._isLoot(unit)) {
        thisFun.tmpUnits.push(unit);
      };
    });
    console.log("[LOVEC] Removed ${1} loot units.".format(thisFun.tmpUnits.length.color(Pal.accent)));
    thisFun.tmpUnits.forEachFast(loot => {
      FRAG_item.removeLoot_global(loot);
    });
    thisFun.tmpUnits.clear();
  }
  .setAnno("server")
  .setProp({
    tmpUnits: [],
  });
  exports.clearLoot = clearLoot;


  /* <------------------------------ bullet ------------------------------ */


  /**
   * Applies damage on a bullet, will destroy it if bullet damage is reduced to zero.
   * @param {Bullet} bul
   * @param {number} dmg
   * @return {void}
   */
  const damageBul = function(bul, dmg) {
    if(dmg < 0.0001) return;

    bul.damage > dmg ? (bul.damage -= dmg) : bul.remove();
  };
  exports.damageBul = damageBul;
