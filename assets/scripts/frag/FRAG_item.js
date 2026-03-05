/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for item module, unit item stack and loot units.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- item module ----------> */


  /**
   * More generic `offLoad`.
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {boolean|unset} [checkAccept]
   * @return {boolean}
   */
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


  /**
   * Variant of {@link offload} for server side.
   * Use this method when random amount is involved!
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {boolean|unset} [checkAccept]
   * @return {boolean}
   */
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


  /**
   * Adds item to some building from `b_f`.
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
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


  /**
   * Transfers item from `b` to `b_t`.
   * @param {Building} b
   * @param {Building} b_t
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
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


  /**
   * Lets a building consume item.
   * @param {Building} b
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
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


  /**
   * Lets a building produce item.
   * @param {Building} b
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
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


  /**
   * Sets amount of item in `b`.
   * @param {Building} b
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @return {boolean}
   */
  const setItem = function(b, itm, amt) {
    if(b.items == null) return false;

    Call.setItem(b, itm, amt);

    return true;
  };
  exports.setItem = setItem;


  /**
   * Removes all items in `b`.
   * @param {Building} b
   * @return {boolean}
   */
  const clearItem = function(b) {
    Call.clearItems(b);

    return true;
  };
  exports.clearItem = clearItem;


  /**
   * Lets a building take a loot.
   * @param {Building} b
   * @param {Unit} loot
   * @param {number|unset} [max]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
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


  /**
   * Lets a building drop its item and spawn a loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Building} b
   * @param {Item} itm
   * @param {number|unset} [max]
   * @param {boolean|unset} [ignoreLoot]
   * @return {boolean}
   */
  const dropLootAt = function(x, y, b, itm, max, ignoreLoot) {
    if(b.items == null) return false;
    if(max == null) max = Infinity;
    let amtCur = b.items.get(itm);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    if(!ignoreLoot && MDL_cond._posHasLoot(x, y)) return false;
    setItem(b, itm, amtCur - amtTrans);
    MDL_call.spawnLoot_server(b.x, b.y, itm, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLootAt = dropLootAt;


  /**
   * Lets a building produce a loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Building} b
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {boolean|unset} [ignoreLoot]
   * @return {boolean}
   */
  const produceLootAt = function(x, y, b, itm, amt, ignoreLoot) {
    if(b.items == null) return false;
    if(amt == null) amt = 0;
    if(amt < 1) return false;

    if(!ignoreLoot && MDL_cond._posHasLoot(x, y)) return false;
    TRIGGER.itemProduce.fire(b, itm, amt);
    b.produced(itm, amt);
    MDL_call.spawnLoot_server(x, y, itm, amt, 0.0);

    return true;
  };
  exports.produceLootAt = produceLootAt;


  /**
   * Lets a building convert the content of a loot.
   * This resets lifetime by default.
   * @param {Building} b
   * @param {Unit} loot
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {boolean|unset} [noReset]
   * @return {boolean}
   */
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


  /**
   * Destroys a loot unit.
   * @param {Unit} loot
   * @return {boolean}
   */
  const destroyLoot = function(loot) {
    if(!MDL_cond._isLoot(loot)) return false;

    TRIGGER.lootDestroy.fire(loot);
    loot.remove();

    return true;
  };
  exports.destroyLoot = destroyLoot;


  /**
   * Variant of {@link destroyLoot} for sync.
   * @param {Unit} loot
   * @return {boolean}
   */
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


  /**
   * Adds item to some unit. Will overwrite previous item.
   * @param {Unit} unit
   * @param {Item} itm
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
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


  /**
   * Adds item to some unit by item mining.
   * @param {Unit} unit
   * @param {number} x
   * @param {number} y
   * @param {Item} itm
   * @return {boolean}
   */
  const addUnitItem_mine = function(unit, x, y, itm) {
    if(!unit.acceptsItem(itm)) return false;

    Call.transferItemToUnit(itm, x, y, unit);

    return true;
  };
  exports.addUnitItem_mine = addUnitItem_mine;


  /**
   * Transfers item from `unit` to `unit_t`.
   * @param {Unit} unit
   * @param {Unit} unit_t
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
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


  /**
   * Lets a unit take item from a building, the first item by default.
   * @param {Unit} unit
   * @param {Building} b
   * @param {Item|unset} [itm]
   * @param {number|unset} [max]
   * @return {boolean}
   */
  const takeBuildItem = function(unit, b, itm, max) {
    if(b.items == null) return false;
    if(itm == null) itm = b.items.first();
    if(itm == null || !unit.acceptsItem(itm)) return false;
    if(max == null) max = Infinity;

    Call.takeItems(b, itm, max, unit);

    return true;
  };
  exports.takeBuildItem = takeBuildItem;


  /**
   * Lets a unit drop its item to a building.
   * @param {Unit} unit
   * @param {Building} b
   * @param {number|unset} [max]
   * @param {boolean|unset} [alwaysClearStack] - If true, the excess will be emptied.
   * @return {boolean}
   */
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


  /**
   * Lets a unit take item from a loot.
   * @param {Unit} unit
   * @param {Unit} loot
   * @param {number|unset} [max]
   * @return {boolean}
   */
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


  /**
   * Variant of {@link takeUnitLoot} for sync.
   * @param {Unit} unit
   * @param {Unit} loot
   * @param {number|unset} [max]
   * @return {boolean}
   */
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


  /**
   * Lets a unit drop its item to spawn a loot.
   * @param {Unit} unit
   * @param {number|unset} [max]
   * @return {boolean}
   */
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
