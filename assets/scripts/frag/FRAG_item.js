/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for item module, unit item stack and loot units.
   * @module lovec/frag/FRAG_item
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ item module ------------------------------ */


  /**
   * More generic `offload`.
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {boolean|unset} [checkAccept]
   * @return {boolean}
   */
  const offload = function(b, b_f, item, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    let cond = false;
    for(let i = 0; i < amt; i++) {
      if(checkAccept && !b.acceptItem(b_f, item)) break;
      b.offload(item);
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
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {boolean|unset} [checkAccept]
   * @return {boolean}
   */
  const offload_server = function(b, b_f, item, amt, checkAccept) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;

    MDL_net.sendPacket(
      PacketModes.CLIENT, "lovec-server-item-offload",
      packPayload([
        b.pos(),
        b_f == null ? -1 : b_f.pos(),
        item.name, amt, checkAccept,
      ]),
      true,
    );

    return offload(b, b_f, item, amt, checkAccept);
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.CLIENT, "lovec-server-item-offload", payload => {
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
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
  const addItem = function(b, b_f, item, amt, p, isForced) {
    if(b.items == null || (!isForced && !b.acceptItem(b_f, item))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b_f, item, amtTrans, !isForced);
  };
  exports.addItem = addItem;


  /**
   * Transfers item from `b` to `b_t`.
   * @param {Building} b
   * @param {Building} b_t
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
  const transItem = function(b, b_t, item, amt, p, isForced) {
    if(b_t == null) return false;
    if(b.items == null || b_t.items == null || (!isForced && !b_t.acceptItem(b, item))) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtCur = b.items.get(item);
    let amtCur_t = b_t.items.get(item);
    let amtTrans = Mathf.maxZero(Math.min(amt.randFreq(p), amtCur, b_t.getMaximumAccepted(item) - amtCur_t));
    if(amtTrans < 1) return false;

    Call.setItem(b, item, amtCur - amtTrans);
    Call.setItem(b_t, item, amtCur_t + amtTrans);

    return true;
  };
  exports.transItem = transItem;


  /**
   * Lets a building consume item.
   * @param {Building} b
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
  const consumeItem = function(b, item, amt, p) {
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1 || b.items.get(item) < amt) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans < 1) return false;

    b.items.remove(item, amtTrans);
    Call.setItem(b, item, b.items.get(item));

    return true;
  };
  exports.consumeItem = consumeItem;


  /**
   * Lets a building produce item.
   * @param {Building} b
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
  const produceItem = function(b, item, amt, p) {
    if(b.items == null) return false;
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans > 0) {
      TRIGGER.itemProduce.fire(b, item, amtTrans);
    };

    return Vars.net.client() ?
      amtTrans > 0 :
      offload_server(b, b, item, amtTrans, false);
  };
  exports.produceItem = produceItem;


  /**
   * Sets amount of item in `b`.
   * @param {Building} b
   * @param {Item} item
   * @param {number|unset} [amt]
   * @return {boolean}
   */
  const setItem = function(b, item, amt) {
    if(b.items == null) return false;

    Call.setItem(b, item, amt);

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
   * Whether a building can accept a list of items from `b_f`.
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item2Array} item2Arr - `ROW`: item_gn, amt.
   * @return {boolean}
   */
  const acceptItem2Arr = function(b, b_f, item2Arr) {
    let i = 0, iCap = item2Arr.iCap(), item;
    while(i < iCap) {
      item = MDL_content.getCt(item2Arr[i], "rs");
      if(item != null && b.acceptStack(item, item2Arr[i + 1], b_f) < item2Arr[i + 1]) return false;
      i += 2;
    };

    return true;
  };
  exports.acceptItem2Arr = acceptItem2Arr;


  /**
   * Adds a list of items to some building from `b_f`.
   * @param {Building} b
   * @param {Building} b_f
   * @param {Item2Array} item2Arr - `ROW`: item_gn, amt.
   * @return {boolean}
   */
  const addItem2Arr = function(b, b_f, item2Arr) {
    let i = 0, iCap = item2Arr.iCap(), item, cond = false;
    while(i < iCap) {
      item = MDL_content.getCt(item2Arr[i], "rs");
      if(item != null) {
        b.handleStack(item, item2Arr[i + 1], b_f);
        cond = true;
      };
      i += 2;
    };

    return true;
  };
  exports.addItem2Arr = addItem2Arr;


  /**
   * Lets a building take a loot.
   * @param {Building} b
   * @param {Unit} loot
   * @param {number|unset} [max]
   * @param {boolean|unset} [isForced]
   * @return {boolean}
   */
  const takeLoot = function(b, loot, max, isForced) {
    if(!MDL_cond.isLoot(loot) || b.items == null) return false;
    let item = loot.item();
    if(item == null || (!isForced && !b.acceptItem(b, item))) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;
    let amtTrans = Mathf.maxZero(Math.min(amt, b.getMaximumAccepted(item) - b.items.get(item), max));
    if(amtTrans < 1) return false;

    addItem(b, b, item, amtTrans, 1.0, true);
    setUnitItem(loot, loot.item(), Mathf.maxZero(loot.stack.amount - amtTrans));

    return true;
  };
  exports.takeLoot = takeLoot;


  /**
   * Lets a building drop its item and spawn a loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Building} b
   * @param {Item} item
   * @param {number|unset} [max]
   * @param {boolean|unset} [ignoreLoot]
   * @return {boolean}
   */
  const dropLootAt = function(x, y, b, item, max, ignoreLoot) {
    if(b.items == null) return false;
    if(max == null) max = Infinity;
    let amtCur = b.items.get(item);
    let amtTrans = Math.min(amtCur, max);
    if(amtTrans < 1) return false;

    if(!ignoreLoot && MDL_cond.posHasLoot(x, y)) return false;
    setItem(b, item, amtCur - amtTrans);
    MDL_call.spawnLoots_server(b.x, b.y, item, amtTrans, b.block.size * Vars.tilesize * 0.7);

    return true;
  };
  exports.dropLootAt = dropLootAt;


  /**
   * Lets a building produce a loot at (x, y).
   * @param {number} x
   * @param {number} y
   * @param {Building} b
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {boolean|unset} [ignoreLoot]
   * @return {boolean}
   */
  const produceLootAt = function(x, y, b, item, amt, ignoreLoot) {
    if(b.items == null) return false;
    if(amt == null) amt = 0;
    if(amt < 1) return false;

    if(!ignoreLoot && MDL_cond.posHasLoot(x, y)) return false;
    TRIGGER.itemProduce.fire(b, item, amt);
    b.produced(item, amt);
    MDL_call.spawnLoot_server(x, y, item, amt);

    return true;
  };
  exports.produceLootAt = produceLootAt;


  /**
   * Lets a building convert the content of a loot.
   * This resets lifetime by default.
   * @param {Building} b
   * @param {Unit} loot
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {boolean|unset} [noReset]
   * @return {boolean}
   */
  const convertLoot = function(b, loot, item, amt, noReset) {
    if(!MDL_cond.isLoot(loot)) return false;
    if(amt == null) amt = 0;
    if(amt < 1 || item == null) {
      if(!Vars.net.client()) {
        removeLoot_global(loot);
      };
    } else {
      if(!Vars.net.client()) {
        if(!noReset) {
          MDL_call.spawnLoot_server(loot.x, loot.y, item, amt);
          removeLoot_global(loot);
        } else {
          setUnitItem_global(loot, item, amt);
        };
      };
      TRIGGER.itemProduce.fire(b, item, amt);
      b.produced(item, amt);
    };

    return true;
  };
  exports.convertLoot = convertLoot;



  /**
   * Removes a loot unit.
   * @param {Unit} loot
   * @return {boolean}
   */
  const removeLoot = function(loot) {
    if(!MDL_cond.isLoot(loot)) return false;

    loot.remove();

    return true;
  };
  exports.removeLoot = removeLoot;


  /**
   * Variant of {@link removeLoot} for sync.
   * @param {Unit} loot
   * @return {void}
   */
  const removeLoot_global = function(loot) {
    if(!MDL_cond.isLoot(loot)) return false;

    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-remove-loot",
      packPayload([loot.id]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-remove-loot", payload => {
      let args = unpackPayload(payload);
      let loot = Groups.unit.getByID(args[0]);
      if(loot == null) return;

      removeLoot(loot);
    });
  });
  exports.removeLoot_global = removeLoot_global;


  /**
   * Destroys a loot unit.
   * @param {Unit} loot
   * @return {boolean}
   */
  const destroyLoot = function(loot) {
    if(!MDL_cond.isLoot(loot)) return false;

    TRIGGER.lootDestroy.fire(loot);
    loot.remove();

    return true;
  };
  exports.destroyLoot = destroyLoot;


  /**
   * Variant of {@link destroyLoot} for sync.
   * @param {Unit} loot
   * @return {void}
   */
  const destroyLoot_global = function(loot) {
    if(!MDL_cond.isLoot(loot)) return false;

    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-destroy-loot",
      packPayload([loot.id]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-destroy-loot", payload => {
      let args = unpackPayload(payload);
      let loot = Groups.unit.getByID(args[0]);
      if(loot == null) return;

      destroyLoot(loot);
    });
  });
  exports.destroyLoot_global = destroyLoot_global;


  /* <------------------------------ unit item stack ------------------------------ */


  /**
   * Adds item to some unit. Will overwrite previous item.
   * @param {Unit} unit
   * @param {Item} item
   * @param {number|unset} [amt]
   * @param {number|unset} [p]
   * @return {boolean}
   */
  const addUnitItem = function(unit, item, amt, p) {
    if(amt == null) amt = 1;
    if(amt < 1) return false;
    if(p == null) p = 1.0;
    let amtTrans = amt.randFreq(p);
    if(amtTrans < 1) return false;

    unit.addItem(item, amtTrans);

    return true;
  };
  exports.addUnitItem = addUnitItem;


  /**
   * Adds item to some unit by item mining.
   * @param {Unit} unit
   * @param {number} x
   * @param {number} y
   * @param {Item} item
   * @return {boolean}
   */
  const addUnitItem_mine = function(unit, x, y, item) {
    if(!unit.acceptsItem(item)) return false;

    Call.transferItemToUnit(item, x, y, unit);

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
   * Sets item and amount in a unit.
   * @param {Unit} unit
   * @param {Item} item
   * @param {number} amt
   * @return {void}
   */
  const setUnitItem = function(unit, item, amt) {
    unit.stack.item = item;
    unit.stack.amount = amt;
  };
  exports.setUnitItem = setUnitItem;


  /**
   * Variant of {@link setUnitItem} for sync.
   * @param {Unit} unit
   * @param {Item} item
   * @param {number} amt
   * @return {void}
   */
  const setUnitItem_global = function(unit, item, amt) {
    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-unit-set-item",
      packPayload([
        unit.id, item.name, amt,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-unit-set-item", payload => {
      let args = unpackPayload(payload);
      let unit = Groups.unit.getByID(args[0]);
      let item = MDL_content.getCt(args[1], "rs");
      if(unit == null || item == null) return;

      setUnitItem(unit, item, args[2]);
    });
  });
  exports.setUnitItem_global = setUnitItem_global;


  /**
   * Lets a unit take item from a building, the first item by default.
   * @param {Unit} unit
   * @param {Building} b
   * @param {Item|unset} [item]
   * @param {number|unset} [max]
   * @return {boolean}
   */
  const takeBuildItem = function(unit, b, item, max) {
    if(b.items == null) return false;
    if(item == null) item = b.items.first();
    if(item == null || !unit.acceptsItem(item)) return false;
    if(max == null) max = Infinity;

    Call.takeItems(b, item, max, unit);

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
    let amtTrans = Mathf.maxZero(Math.min(unit.stack.amount, b.getMaximumAccepted(unit.item()) - b.items.get(unit.item()), max));
    if(amtTrans < 1) return false;

    Call.transferItemTo(unit, unit.item(), amtTrans, unit.x, unit.y, b);
    if(alwaysClearStack) {
      setUnitItem_global(unit, unit.item(), 0);
    };

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
    if(!MDL_cond.isLoot(loot)) return false;
    let item = loot.item();
    if(!unit.acceptsItem(item)) return false;
    let amt = loot.stack.amount;
    if(amt < 1) return false;
    if(max == null) max = Infinity;
    let amtTrans = Mathf.maxZero(Math.min(amt, unit.itemCapacity() - unit.stack.amount, max));
    if(amtTrans < 1) return false;

    Core.app.post(() => TRIGGER.lootTake.fire(unit, item, amtTrans));
    addUnitItem(unit, item, amtTrans);
    setUnitItem(loot, loot.item(), Mathf.maxZero(loot.stack.amount - amtTrans));

    return true;
  };
  exports.takeUnitLoot = takeUnitLoot;


  /**
   * Variant of {@link takeUnitLoot} for sync.
   * @param {Unit} unit
   * @param {Unit} loot
   * @param {number|unset} [max]
   * @return {void}
   */
  const takeUnitLoot_global = function(unit, loot, max) {
    if(!MDL_cond.isLoot(loot)) return false;

    MDL_net.sendPacket(
      PacketModes.BOTH, "lovec-both-unit-take-loot",
      packPayload([
        unit.id, loot.id, max,
      ]),
      true,
    );
  }
  .setAnno("init", function() {
    MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-unit-take-loot", payload => {
      let args = unpackPayload(payload);
      let unit = Groups.unit.getByID(args[0]);
      let loot = Groups.unit.getByID(args[1]);
      if(unit == null || loot == null) return;

      takeUnitLoot(unit, loot, args[2]);
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
    let item = unit.item();
    let amtTrans = Math.min(unit.stack.amount, max);
    if(amtTrans < 1) return false;

    unit.stack.amount -= amtTrans;
    MDL_call.spawnLoots_server(unit.x, unit.y, item, amtTrans);

    return true;
  };
  exports.dropUnitLoot = dropUnitLoot;
