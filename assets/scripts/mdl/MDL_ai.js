/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles unit AI.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARAM = require("lovec/glb/GLB_param");


  const FRAG_item = require("lovec/frag/FRAG_faci");


  const MDL_entity = require("lovec/mdl/MDL_entity");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the {target} field of the AI controller.
   * It's private and no class allowed in JS, I have to do this.
   * ---------------------------------------- */
  const _tg = function(ctrl) {
    return ctrl == null ?
      null :
      Reflect.get(AIController, ctrl, "target");
  };
  exports._tg = _tg;


  /* <---------- action ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit move to some position straightly.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit move to some position by pathfinding.
   * ---------------------------------------- */
  const pathfindTo = function(unit, vecDest, vecOut, blockedTup, dst, smooth, keepDst) {
    if(unit.isPlayer()) return;
    if(unit.isFlying() && !PARAM.isCaveMap) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit circle some position.
   * ---------------------------------------- */
  const circle = function(unit, posIns, dst) {
    if(unit.isPlayer()) return;

    MDL_entity._ctrl(unit).circle(posIns, tryVal(dst, unit.type.range / 1.8));
  };
  exports.circle = circle;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit look at some position.
   * ---------------------------------------- */
  const lookAt = function(unit, x, y, noAim) {
    if(unit.isPlayer()) return;

    noAim || _tg(MDL_entity._ctrl(unit)) != null ?
      unit.lookAt(x, y) :
      unit.aimLook(x, y);
  };
  exports.lookAt = lookAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit shoot at some position.
   * ---------------------------------------- */
  const shootAt = function(unit, x, y, bool) {
    if(unit.isPlayer()) return;

    if(!bool) {
      unit.controlWeapons(false);
    } else {
      unit.type.faceTarget ?
        unit.aimLook(x, y) :
        unit.aim(x, y);
    };
  };
  exports.shootAt = shootAt;


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a unit approach some position, and shoot if in range.
   * ---------------------------------------- */
  const moveShoot = function(unit, tg, keepDst) {
    if(unit.isPlayer()) return;
    if(tg == null || (tg.added != null && !tg.added)) {
      unit.controlWeapons(false);
      return;
    };

    moveTo(unit, tg, unit.range() * 0.8, null, keepDst);
    shootAt(unit, tg.x, tg.y, tg.within(unit, unit.range()));
  };
  exports.moveShoot = moveShoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Like {moveShoot} but using pathfinding.
   * ---------------------------------------- */
  const pathfindShoot = function thisFun(unit, tg, vecOut, blockedTup, keepDst) {
    if(unit.isPlayer()) return;
    if(tg == null || (tg.added != null && !tg.added)) {
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


  /* <---------- component ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * {updateMovement} here may return boolean, which means whether the movement is active.
   * Used for decision.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Moves to the current target if armed.
   * If a center position is given, the unit won't go far from it.
   * ---------------------------------------- */
  const comp_updateMovement_attack = function thisFun(ctrl, unit, cx, cy, maxDst) {
    if(!unit.hasWeapons()) return false;
    let tg = _tg(ctrl);
    if(tg == null) return false;
    if(maxDst == null) maxDst = -1.0;
    if(cx != null && cy != null && maxDst > 0.0 && Mathf.dst(unit.x, unit.y, cx, cy) > maxDst) return false;

    lookAt(unit, tg.x, tg.y);
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
  exports.comp_updateMovement_attack = comp_updateMovement_attack;


  /* ----------------------------------------
   * NOTE:
   *
   * Follows an assigned target.
   * ---------------------------------------- */
  const comp_updateMovement_follow = function thisFun(ctrl, unit, followTg) {
    if(followTg == null || (followTg.added != null && !followTg.added)) return false;

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
  exports.comp_updateMovement_follow = comp_updateMovement_follow;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD:
   *   ctrl.timerUnload
   * Unloads items into some building.
   * ---------------------------------------- */
  const comp_updateMovement_unload = function thisFun(ctrl, unit, b) {
    if(!unit.hasItem() || b == null || !b.added || !b.acceptItem(unit.item()) || b.isPayload()) return false;

    thisFun.blockedTup[0] = false;
    pathfindTo(unit, thisFun.tmpVec.set(b), thisFun.tmpVec1, thisFun.blockedTup, Vars.logicItemTransferRange * 0.8);
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
  exports.comp_updateMovement_unload = comp_updateMovement_unload;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD:
   *   ctrl.timerOreFind
   *   ctrl.isMining
   *   ctrl.oreT
   * Miner AI where {b} is the building bound to.
   * This works for ground units too.
   * ---------------------------------------- */
  const comp_updateMovement_mine = function thisFun(ctrl, unit, b, itm, rad) {
    if(!unit.canMine()) return false;
    if(rad == null) rad = Infinity;

    if(!unit.validMine(unit.mineTile)) unit.mineTile = null;

    this.blockedTup[0] = false;
    if(!ctrl.isMining) {
      unit.mineTile = null;
      // Ready to mine or not
      if(!unit.hasItem()) {
        ctrl.isMining = true;
        return true;
      };
      // Drop item to {b}
      if(unit.within(b, Vars.logicItemTransferRange)) {
        if(b.acceptStack(unit.item(), unit.stack.amount, unit) > 0) FRAG_item.dropBuildItem(unit, b);
        unit.clearItem();
        ctrl.isMining = true;
      };
      // Move to {b}
      !unit.within(b, Vars.logicItemTransferRange * 0.8) ?
        pathfindTo(unit, thisFun.tmpVec.set(b), thisFun.tmpVec1, this.blockedTup, Vars.logicItemTransferRange * 0.6) :
        circle(unit, b, Vars.logicItemTransferRange * 0.6);
    } else {
      // Do nothing if {b} is full
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
          if(Mathf.dst(b.x, b.y, ctrl.oreT.worldx(), ctrl.oreT.worldy()) > rad) ctrl.oreT = null;
        };
        // Move to ore
        if(ctrl.oreT != null) {
          if(!unit.within(ctrl.oreT, unit.type.mineRange)) {
            pathfindTo(unit, thisFun.tmpVec.set(ctrl.oreT), thisFun.tmpVec1, thisFun.blockedTup, unit.type.mineRange * 0.5);
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
  exports.comp_updateMovement_mine = comp_updateMovement_mine;


  /* ----------------------------------------
   * NOTE:
   *
   * @FIELD:
   *   ctrl.timerRepairFind
   *   ctrl.repairTg
   * Repair AI.
   * No pathfinding for this one, cauz that it easily gets stuck.
   * ---------------------------------------- */
  const comp_updateMovement_repair = function(ctrl, unit, b) {
    if(!unit.type.canHeal) return false;

    if(ctrl.timerRepairFind.get(15.0)) {
      let repairTg = Units.findDamagedTile(unit.team, unit.x, unit.y);
      if(repairTg instanceof ConstructBlock.ConstructBuild) repairTg = null;
      ctrl.repairTg = null;
    };

    if(ctrl.repairTg == null) {
      let bTg = (b != null && !b.added) ? b : unit.closestCore();
      if(bTg != null && !unit.within(bTg, 48.0)) {
        moveTo(unit, bTg, 48.0);
      } else return false;
    } else {
      moveShoot(unit, ctrl.repairTg, true);
    };

    return true;
  };
  exports.comp_updateMovement_repair = comp_updateMovement_repair;
