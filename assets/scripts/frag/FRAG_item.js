/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods for item module, unit item stack and loot units.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TRIGGER = require("lovec/glb/BOX_trigger");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_net = require("lovec/mdl/MDL_net");
  const MDL_reaction = require("lovec/mdl/MDL_reaction");


  /* <---------- item module ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Generic {offload}.
   * ---------------------------------------- */
  const offload = function(b, b_f, itm, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    let cond = false;
    for(let i = 0; i < amt; i++) {
      if(checkAccept && !b.acceptItem(b_f, itm)) break;
      b.offload(itm);
      cond = true;
    };

    return cond;
  };
  exports.offload = offload;


  /* ----------------------------------------
   * NOTE:
   *
   * {offload} called on server side only for sync.
   * ---------------------------------------- */
  const offload_server = function(b, b_f, itm, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    MDL_net.sendPacket(
      "server", "lovec-server-item-offload",
      packPayload([
        b.pos(),
        b_f == null ? -1 : b_f.pos(),
        itm.name, amt, checkAccept,
      ]),
    );

    return offload(b, b_f, itm, amt, checkAccept);
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("client", "lovec-server-item-offload", payload => {
      let args = unpackPayload(payload);
      offload(Vars.world.build(args[0]), Vars.world.build(args[1]), Vars.content.item(args[2]), args[3], args[4]);
    });
  })
  .setAnno("server", null, false);
  exports.offload_server = offload_server;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds item to some building from {b_f}.
   * ---------------------------------------- */
  const addItem = function(b, b_f, itm, amt, p, isForced) {
    if(b.items == null || (!isForced && !b.acceptItem(b_f, itm))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b_f, itm, amtTrans, !isForced);
  };
  exports.addItem = addItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building transfer items to {b_t}.
   * ---------------------------------------- */
  const transItem = function(b, b_t, itm, amt, p, isForced) {
    if(b_t == null) return false;
    if(b.items == null || b_t.items == null || (!isForced && !b_t.acceptItem(b, itm))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtCur = b.items.get(itm);
    let amtCur_t = b_t.items.get(itm);
    let amtTrans = Mathf.maxZero(Math.min(amt.randFreq(p), amtCur, b_t.block.itemCapacity - amtCur_t));
    if(amtTrans < 1) return false;

    Call.setItem(b, itm, amtCur - amtTrans);
    Call.setItem(b_t, itm, amtCur_t + amtTrans);

    return true;
  };
  exports.transItem = transItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building consume some items.
   * ---------------------------------------- */
  const consumeItem = function(b, itm, amt, p) {
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1 || b.items.get(itm) < amt) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans < 1) return false;

    b.items.remove(itm, amtTrans);
    Call.setItem(b, itm, b.items.get(itm));

    return true;
  };
  exports.consumeItem = consumeItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building produce some items.
   * ---------------------------------------- */
  const produceItem = function(b, itm, amt, p) {
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans > 0) {
      TRIGGER.itemProduce.fire(b, itm, amtTrans);
    };

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b, itm, amtTrans, false);
  };
  exports.produceItem = produceItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Set the amount of item in {b}.
   * ---------------------------------------- */
  const setItem = function(b, itm, amt) {
    if(b.items == null) return false;

    Call.setItem(b, itm, amt);

    return true;
  };
  exports.setItem = setItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Removes all items in {b}.
   * ---------------------------------------- */
  const clearItem = function(b) {
    Call.clearItems(b);

    return true;
  };
  exports.clearItem = clearItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building take items from a loot unit.
   * ---------------------------------------- */
  const takeLoot = function(b, loot, max, isForced) {
    if(!MDL_cond._isLoot(loot) || b.items == null) return false;
    let itm = loot.item();
    if(itm == null || (!isForced && !b.acceptItem(b, itm))) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;
    let amtTrans = Mathf.maxZero(Math.min(amt, b.block.itemCapacity - b.items.get(itm), max));
    if(amtTrans < 1) return false;

    addItem(b, b, itm, amtTrans, 1.0, true);
    loot.stack.amount = Mathf.maxZero(loot.stack.amount - amtTrans);

    return true;
  };
  exports.takeLoot = takeLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building drop its item to spawn a loot.
   * ---------------------------------------- */
  const dropLoot = function(b, itm, max) {
    if(b.items == null) return false;
    if(max == null) max = Infinity;
    let amtCur = b.items.get(itm);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    setItem(b, itm, amtCur - amtTrans);
    MDL_call.spawnLoot_server(b.x, b.y, itm, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLoot = dropLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building drop its item at (x, y) and spawn a loot there.
   * ---------------------------------------- */
  const dropLootAt = function(x, y, b, itm, max, ignoreLoot) {
    if(b.items == null) return false;
    if(max == null) max = Infinity;
    let amtCur = b.items.get(itm);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    if(MDL_cond._posHasLoot(x, y) && !ignoreLoot) return false;
    setItem(b, itm, amtCur - amtTrans);
    MDL_call.spawnLoot_server(b.x, b.y, itm, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLootAt = dropLootAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building technically produce a loot.
   * ---------------------------------------- */
  const produceLoot = function(b, itm, amt) {
    if(b.items == null) return false;
    if(amt == null) amt = 0;
    if(amt < 1) return false;

    TRIGGER.itemProduce.fire(b, itm, amt);
    b.produced(itm, amt);
    MDL_call.spawnLoot_server(b.x, b.y, itm, amt, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.produceLoot = produceLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building produce a loot at (x, y).
   * ---------------------------------------- */
  const produceLootAt = function(x, y, b, itm, amt, ignoreLoot) {
    if(b.items == null) return false;
    if(amt == null) amt = 0;
    if(amt < 1) return false;

    if(MDL_cond._posHasLoot(x, y) && !ignoreLoot) return false;
    TRIGGER.itemProduce.fire(b, itm, amt);
    b.produced(itm, amt);
    MDL_call.spawnLoot_server(x, y, itm, amt, 0.0);

    return true;
  };
  exports.produceLootAt = produceLootAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a building convert the content of a loot.
   * This resets lifetime by default.
   * ---------------------------------------- */
  const convertLoot = function(b, loot, itm, amt, noReset) {
    if(!MDL_cond._isLoot(loot)) return false;
    if(amt == null) amt = 0;
    if(amt < 1 || itm == null) {
      loot.remove()
    } else {
      if(!noReset) {
        MDL_call.spawnLoot_server(loot.x, loot.y, itm, amt, 0.0);
        loot.remove();
      } else {
        loot.stack.item = itm;
        loot.stack.amount = amt;
      };
      TRIGGER.itemProduce.fire(b, itm, amt);
      b.produced(itm, amt);
    };

    return true;
  };
  exports.convertLoot = convertLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Destroys a loot unit.
   * ---------------------------------------- */
  const destroyLoot = function(loot) {
    if(!MDL_cond._isLoot(loot)) return false;

    TRIGGER.lootDestroy.fire(loot);
    loot.remove();

    return true;
  };
  exports.destroyLoot = destroyLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {destroyLoot} for sync.
   * ---------------------------------------- */
  const destroyLoot_global = function(loot) {
    if(!MDL_cond._isLoot(loot)) return false;

    MDL_net.sendPacket(
      "both", "lovec-both-destroy-loot",
      packPayload([loot.id]),
      true, true,
    );

    return destroyLoot(loot);
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("both", "lovec-both-destroy-loot", payload => {
      let args = unpackPayload(payload);
      destroyLoot(Groups.unit.getById(args[0]));
    });
  })
  .setAnno("non-console", null, false);
  exports.destroyLoot_global = destroyLoot_global;


  /* <---------- unit item stack ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds items to some unit. Will overwrite previous items the unit carries.
   * ---------------------------------------- */
  const addUnitItem = function(unit, itm, amt, p) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans < 1) return false;

    unit.addItem(itm, amtTrans);

    return true;
  };
  exports.addUnitItem = addUnitItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Used for unit mining.
   * ---------------------------------------- */
  const addUnitItem_mine = function(unit, x, y, itm) {
    Call.transferItemToUnit(itm, x, y, unit);

    return true;
  };
  exports.addUnitItem_mine = addUnitItem_mine;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit transfer its items to another unit.
   * ---------------------------------------- */
  const transUnitItem = function(unit, unit_t, amt, p) {
    if(!unit_t.acceptsItem(unit.item())) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = Math.min(amt.randFreq(p), unit.stack.amount);
    if(amtTrans < 1) return false;

    unit.stack.amount -= amtTrans;
    addUnitItem(unit_t, unit.item(), amtTrans);

    return true;
  };
  exports.transUnitItem = transUnitItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit take items from a building, the first item by default.
   * No need for effect.
   * ---------------------------------------- */
  const takeBuildItem = function(unit, b, itm, max) {
    if(b.items == null) return false;
    if(itm == null) itm = b.items.first();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    if(max == null) max = Infinity;

    Call.takeItems(b, itm, max, unit);

    return true;
  };
  exports.takeBuildItem = takeBuildItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit drop its items to a building.
   * No need for effect.
   * ---------------------------------------- */
  const dropBuildItem = function(unit, b, max, alwaysClearStack) {
    if(b.items == null || !b.acceptItem(b, unit.item())) return false;
    if(max == null) max = Infinity;
    let amtTrans = Mathf.maxZero(Math.min(unit.stack.amount, b.block.itemCapacity - b.items.get(unit.item()), max));
    if(amtTrans < 1) return false;

    Call.transferItemTo(unit, unit.item(), amtTrans, unit.x, unit.y, b);
    if(alwaysClearStack) unit.clearItem();

    return true;
  };
  exports.dropBuildItem = dropBuildItem;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit take items from a loot unit.
   * ---------------------------------------- */
  const takeUnitLoot = function(unit, loot, max) {
    if(!MDL_cond._isLoot(loot)) return false;
    let itm = loot.item();
    if(!unit.acceptsItem(itm)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;
    let amtTrans = Mathf.maxZero(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max));
    if(amtTrans < 1) return false;

    Core.app.post(() => TRIGGER.lootTake.fire(unit, itm, amtTrans));
    addUnitItem(unit, itm, amtTrans);
    loot.stack.amount = Mathf.maxZero(loot.stack.amount - amtTrans);

    return true;
  };
  exports.takeUnitLoot = takeUnitLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {takeUnitLoot} for sync.
   * ---------------------------------------- */
  const takeUnitLoot_global = function(unit, loot, max) {
    if(!MDL_cond._isLoot(loot)) return false;

    MDL_net.sendPacket(
      "both", "lovec-both-unit-take-loot",
      packPayload([
        unit.id, loot.id, max,
      ]),
      true, true,
    );

    return takeUnitLoot(unit, loot, max);
  }
  .setAnno("init", function() {
    MDL_net.__packetHandler("both", "lovec-both-unit-take-loot", payload => {
      let args = unpackPayload(payload);
      takeUnitLoot(Groups.unit.getById(args[0]), Groups.unit.getById(args[1]), args[2]);
    });
  })
  .setAnno("non-console", null, false);
  exports.takeUnitLoot_global = takeUnitLoot_global;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit drop its item to spawn a loot.
   * ---------------------------------------- */
  const dropUnitLoot = function(unit, max) {
    if(max == null) max = Infinity;
    let itm = unit.item();
    let amtTrans = Math.min(unit.stack.amount, max);
    if(amtTrans < 1) return false;

    unit.stack.amount -= amtTrans;
    MDL_call.spawnLoot_server(unit.x, unit.y, itm, amtTrans);

    return true;
  };
  exports.dropUnitLoot = dropUnitLoot;
