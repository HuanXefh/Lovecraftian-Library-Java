/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles unit AI.
   * @module lovec/mdl/MDL_ai
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Gets the "target" field of an AI controller by reflection.
   * In JS this field cannot be directly accessed.
   * @param {AIController} ctrl
   * @return {TeamcGn|null}
   */
  const _tg = function(ctrl) {
    return ctrl == null ?
      null :
      Reflect.get(AIController, ctrl, "target");
  };
  exports._tg = _tg;


  /* <---------- condition ----------> */


  /**
   * Whether this unit should hold its position.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _c_holdPos = function(unit) {
    return unit.isPlayer() || MDL_entity._ctrl(unit).hasStance(UnitStance.holdPosition);
  };
  exports._c_holdPos = _c_holdPos;


  /* <---------- action ----------> */


  /**
   * Lets a unit move to some position straightly.
   * @param {Unit} unit
   * @param {PosGn} posIns
   * @param {number|unset} [dst] - Distance to stop moving.
   * @param {number|unset} [smooth] - Extra distance to slow down.
   * @param {boolean|unset} [keepDst] - Whether to move outwards to keep distance.
   * @return {void}
   */
  const moveTo = function(unit, posIns, dst, smooth, keepDst) {
    if(unit.isPlayer()) return;

    MDL_entity._ctrl(unit).moveTo(
      posIns,
      tryVal(dst, 4.0),
      tryVal(smooth, unit.flying ? 30.0 : 2.0),
      tryVal(keepDst, true),
      null,
    );
  };
  exports.moveTo = moveTo;


  /**
   * Similar to {@link moveTo} but uses pathfinding.
   * @param {Unit} unit
   * @param {Vec2} vecDest - Destination position as a vector.
   * @param {Vec2} vecOut - Container vector for next position to move to.
   * @param {Array<boolean>|unset} [blockedTup] - Container of a boolean that whether path is blocked.
   * @param {number|unset} [dst]
   * @param {number|unset} [smooth]
   * @param {boolean|unset} [keepDst]
   * @return {void}
   */
  const pathfindTo = function(unit, vecDest, vecOut, blockedTup, dst, smooth, keepDst) {
    if(unit.isPlayer()) return;
    if(unit.isFlying() && !PARAM.IS_CAVE_MAP) {
      moveTo(unit, vecDest, dst, smooth, keepDst);
      return;
    };
    if(!Vars.controlPath.getPathPosition(unit, vecDest, vecOut, tryVal(blockedTup, null))) return;

    !vecOut.epsilonEquals(vecDest, 4.0) ?
      moveTo(unit, vecOut, 0.0, null, false) :
      moveTo(unit, vecOut, dst, smooth, keepDst);
    lookAt(unit, vecOut.x, vecOut.y);
  };
  exports.pathfindTo = pathfindTo;


  /**
   * Lets a unit circle (move around) some position.
   * @param {Unit} unit
   * @param {PosGn} posIns
   * @param {number|unset} [dst] - Radius of the circle, leave empty to calculate based on range.
   * @return {void}
   */
  const circle = function(unit, posIns, dst) {
    if(unit.isPlayer()) return;

    MDL_entity._ctrl(unit).circle(posIns, tryVal(dst, unit.type.range / 1.8));
  };
  exports.circle = circle;


  /**
   * Lets a unit look at some position, no movement.
   * @param {Unit} unit
   * @param {number} x
   * @param {number} y
   * @param {boolean|unset} [noAim] - Whether weapon mounts of the unit should not rotate to the position.
   * @return {void}
   */
  const lookAt = function(unit, x, y, noAim) {
    if(unit.isPlayer()) return;

    noAim || _tg(MDL_entity._ctrl(unit)) != null ?
      unit.lookAt(x, y) :
      unit.aimLook(x, y);
  };
  exports.lookAt = lookAt;


  /**
   * Lets a unit shoot at some position.
   * @param {Unit} unit
   * @param {number} x
   * @param {number} y
   * @param {boolean|unset} [shouldFire] - Used to control weapon status.
   * @return {void}
   */
  const shootAt = function(unit, x, y, shouldFire) {
    if(unit.isPlayer()) return;

    if(!shouldFire) {
      unit.controlWeapons(false);
    } else {
      unit.type.faceTarget ?
        unit.aimLook(x, y) :
        unit.aim(x, y);
      unit.controlWeapons(true);
    };
  };
  exports.shootAt = shootAt;


  /**
   * Lets a unit approach some position and shoot if in range.
   * @param {Unit} unit
   * @param {PoscGn} tg
   * @param {boolean|unset} [keepDst]
   * @return {void}
   */
  const moveShoot = function(unit, tg, keepDst) {
    if(unit.isPlayer()) return;
    if(tg == null || !tg.added) {
      unit.controlWeapons(false);
      return;
    };

    moveTo(unit, tg, unit.range() * 0.8, null, keepDst);
    shootAt(unit, tg.x, tg.y, tg.within(unit, unit.range()));
  };
  exports.moveShoot = moveShoot;


  /**
   * Similar to {@link moveShoot} but uses pathfinding.
   * @param {Unit} unit
   * @param {PoscGn} tg
   * @param {Vec2} vecOut
   * @param {Array<boolean>|unset} [blockedTup]
   * @param {boolean|unset} [keepDst]
   * @return {void}
   */
  const pathfindShoot = function thisFun(unit, tg, vecOut, blockedTup, keepDst) {
    if(unit.isPlayer()) return;
    if(tg == null || !tg.added) {
      unit.controlWeapons(false);
      return;
    };

    pathfindTo(unit, thisFun.tmpVec.set(tg), vecOut, blockedTup, unit.range() * 0.8, null, keepDst);
    shootAt(unit, tg.x, tg.y, tg.within(unit, unit.range()));
  }
  .setProp({
    tmpVec: new Vec2(),
  });
  exports.pathfindShoot = pathfindShoot;


  /* <---------- decision ----------> */


  /**
   * Methods here may return boolean, which means whether the movement is active.
   * It's meant for decision-making.
   */


  /**
   * Moves to target if armed.
   * If given a position, the unit won't leave too far.
   * @param {AIController} ctrl
   * @param {Unit} unit
   * @param {number} cx
   * @param {number} cy
   * @param {number|unset} [maxDst]
   * @return {boolean}
   */
  const _d_attack = function thisFun(ctrl, unit, cx, cy, maxDst) {
    if(!unit.hasWeapons()) return false;
    let tg = _tg(ctrl);
    if(tg == null) return false;
    if(maxDst == null) maxDst = -1.0;
    if(cx != null && cy != null && maxDst > 0.0 && Mathf.dst(unit.x, unit.y, cx, cy) > maxDst) return false;

    lookAt(unit, tg.x, tg.y);
    if(_c_holdPos(unit)) return true;
    if(!tg.within(unit, unit.range() * 0.8)) {
      pathfindTo(unit, thisFun.tmpVec.set(tg), thisFun.tmpVec1(), null, unit.range() * 0.8);
    } else {
      if(unit.type.circleTarget) ctrl.circleAttack(110.0 + unit.hitSize * 0.5);
    };

    return true;
  }
  .setProp({
    tmpVec: new Vec2(),
    tmpVec1: new Vec2(),
  });
  exports._d_attack = _d_attack;


  /**
   * Follows a given target.
   * @param {AIController} ctrl
   * @param {Unit} unit
   * @param {PoscGn|unset} [followTg]
   * @return {boolean}
   */
  const _d_follow = function thisFun(ctrl, unit, followTg) {
    if(followTg == null || !followTg.added) return false;
    if(_c_holdPos(unit)) return false;

    thisFun.blockedTup[0] = false;
    pathfindTo(
      unit, thisFun.tmpVec.set(followTg), thisFun.tmpVec1, thisFun.blockedTup,
      (followTg instanceof Sized ? tryProp(followTg.hitSize, followTg) * 0.55 : 0.0) + unit.hitSize * 0.5 + 15.0,
    );

    return !thisFun.blockedTup[0];
  }
  .setProp({
    tmpVec: new Vec2(),
    tmpVec1: new Vec2(),
    blockedTup: [],
  });
  exports._d_follow = _d_follow;


  /**
   * Unloads items into some building.
   * @param {AIController} ctrl
   * @param {Interval} ctrl.timerUnload - Timer for item unloading.
   * @param {Unit} unit
   * @param {Building|unset} [b]
   * @return {boolean}
   */
  const _d_unload = function thisFun(ctrl, unit, b) {
    if(!unit.hasItem() || b == null || !b.added || !b.acceptItem(unit.item()) || b.isPayload()) return false;

    thisFun.blockedTup[0] = false;
    if(!_c_holdPos(unit)) {
      pathfindTo(unit, thisFun.tmpVec.set(b), thisFun.tmpVec1, thisFun.blockedTup, Vars.logicItemTransferRange * 0.8);
    };
    if(unit.within(b, Vars.logicItemTransferRange) && ctrl.timerUnload.get(90.0)) {
      FRAG_item.dropBuildItem(unit, b);
    };

    return !thisFun.blockedTup[0];
  }
  .setProp({
    tmpVec: new Vec2(),
    tmpVec1: new Vec2(),
    blockedTup: [],
  });
  exports._d_unload = _d_unload;


  /**
   * Similar to {@link MinerAI} but the unit is bound to an arbitrary building.
   * This also works for ground units with pathfinding.
   * @param {AIController} ctrl
   * @param {Interval} ctrl.timerOreFind - Timer for ore tile update.
   * @param {boolean} ctrl.isMining - Whether the unit is mining something.
   * @param {Tile} ctrl.oreT - Tile to mine.
   * @param {Unit} unit
   * @param {Building} b
   * @param {Item} itm - Item to mine.
   * @param {number|unset} [rad] - Maximum distance to go.
   * @return {boolean}
   */
  const _d_mine = function thisFun(ctrl, unit, b, itm, rad) {
    if(!unit.canMine()) return false;
    if(rad == null) rad = Infinity;

    if(!unit.validMine(unit.mineTile)) unit.mineTile = null;

    thisFun.blockedTup[0] = false;
    if(!ctrl.isMining) {
      unit.mineTile = null;
      // Ready to mine or not
      if(!unit.hasItem()) {
        ctrl.isMining = true;
        return true;
      };
      // Drop item to `b`
      if(unit.within(b, Vars.logicItemTransferRange)) {
        if(b.acceptStack(unit.item(), unit.stack.amount, unit) > 0) FRAG_item.dropBuildItem(unit, b);
        unit.clearItem();
        ctrl.isMining = true;
      };
      // Move to `b`
      if(!_c_holdPos(unit)) {
        !unit.within(b, Vars.logicItemTransferRange * 0.8) ?
          pathfindTo(unit, thisFun.tmpVec.set(b), thisFun.tmpVec1, thisFun.blockedTup, Vars.logicItemTransferRange * 0.6) :
          circle(unit, b, Vars.logicItemTransferRange * 0.6);
      };
    } else {
      // Do nothing if `b` is full
      if(b.acceptStack(itm, 1, unit) === 0) {
        unit.clearItem();
        unit.mineTile = null;
        return false;
      };
      if(unit.stack.amount >= unit.type.itemCapacity || !unit.acceptsItem(itm)) {
        // Full, end mining
        ctrl.isMining = false;
      } else {
        // Update ore tile
        if(ctrl.timerOreFind.get(120.0)) {
          ctrl.oreT = null;
          if(unit.type.mineFloor) ctrl.oreT = Vars.indexer.findClosestOre(b.x, b.y, itm);
          if(ctrl.oreT == null && unit.type.mineWalls) ctrl.oreT = Vars.indexer.findClosestWallOre(b.x, b.y, itm);
          if(ctrl.oreT != null && Mathf.dst(b.x, b.y, ctrl.oreT.worldx(), ctrl.oreT.worldy()) > rad) ctrl.oreT = null;
        };
        // Move to ore
        if(ctrl.oreT != null) {
          if(!unit.within(ctrl.oreT, unit.type.mineRange)) {
            if(!_c_holdPos(unit)) {
              pathfindTo(unit, thisFun.tmpVec.set(ctrl.oreT), thisFun.tmpVec1, thisFun.blockedTup, unit.type.mineRange * 0.5);
            };
          } else {
            if(unit.validMine(ctrl.oreT)) unit.mineTile = ctrl.oreT;
          };
        };
      };
    };

    return !thisFun.blockedTup[0];
  }
  .setProp({
    tmpVec: new Vec2(),
    tmpVec1: new Vec2(),
    blockedTup: [],
  });
  exports._d_mine = _d_mine;


  /**
   * Similar to {@link RepairAI} but the unit will return to a building when idle.
   * This one does not have pathfinding, cauz it will easily get stuck.
   * @param {AIController} ctrl
   * @param {Interval} ctrl.timerRepairFind - Timer for repair target update.
   * @param {HealthcGn} ctrl.repairTg - Repair target.
   * @param {Unit} unit
   * @param {Building|unset} [b] - Building to return to when idle, leave empty for closest core.
   * @return {boolean}
   */
  const _d_repair = function(ctrl, unit, b) {
    if(!unit.type.canHeal) return false;

    if(ctrl.timerRepairFind.get(15.0)) {
      let repairTg = Units.findDamagedTile(unit.team, unit.x, unit.y);
      if(repairTg instanceof ConstructBlock.ConstructBuild) repairTg = null;
      ctrl.repairTg = null;
    };

    if(ctrl.repairTg == null) {
      let bTg = (b != null && !b.added) ? b : unit.closestCore();
      if(bTg != null && !unit.within(bTg, 48.0) && !_c_holdPos(unit)) {
        moveTo(unit, bTg, 48.0);
      } else return false;
    } else {
      moveShoot(unit, ctrl.repairTg, true);
    };

    return true;
  };
  exports._d_repair = _d_repair;
