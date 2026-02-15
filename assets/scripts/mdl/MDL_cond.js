/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods to check conditions.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const VAR = require("lovec/glb/GLB_var");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_entity = require("lovec/mdl/MDL_entity");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_fluid = require("lovec/db/DB_fluid");
  const DB_status = require("lovec/db/DB_status");
  const DB_unit = require("lovec/db/DB_unit");


  /* <---------- auxiliary ----------> */


  function matchTag(ct_gn, tag, mode, suppressWarning) {
    return MDL_content._hasTag(MDL_content._ct(ct_gn, mode, suppressWarning), tag);
  };


  /* <---------- pos ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the floor at given position supports shadow casting.
   * ---------------------------------------- */
  const _posCanShadow = function(x, y) {
    let flr = Vars.world.floorWorld(x, y);
    return flr != null && flr.canShadow && !(flr instanceof EmptyFloor);
  };
  exports._posCanShadow = _posCanShadow;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether something at given position is visible (in the screen).
   * ---------------------------------------- */
  const _posVisible = function(x, y, clipSize) {
    return Core.camera.bounds(Tmp.r1).overlaps(Tmp.r2.setCentered(x, y, tryVal(clipSize, 0.0001)));
  };
  exports._posVisible = _posVisible;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether mouse is in range with (x, y) as the center.
   * ---------------------------------------- */
  const _posHovered = function(x, y, rad) {
    return Mathf.dst(x, y, Core.input.mouseWorldX(), Core.input.mouseWorldY()) < tryVal(rad, 0.0001);
  };
  exports._posHovered = _posHovered;


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {_posHovered} where the range is a rectangle.
   * ---------------------------------------- */
  const _posHoveredRect = function(x, y, r, size) {
    let hw = (tryVal(r, 0) + tryVal(size, 0) * 0.5) * Vars.tilesize;
    return Math.abs(x - Core.input.mouseWorldX()) < hw && Math.abs(y - Core.input.mouseWorldY()) < hw;
  };
  exports._posHoveredRect = _posHoveredRect;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any loot unit at (x, y).
   * ---------------------------------------- */
  const _posHasLoot = function(x, y) {
    return Groups.unit.intersect(x - 3.0, y - 3.0, 12.0, 12.0).select(unit => _isLoot(unit)).size > 0;
  };
  exports._posHasLoot = _posHasLoot;


  /* <---------- resource ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this content is vanilla content.
   * ---------------------------------------- */
  const _isVanilla = function(ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    return ct != null && ct.minfo.mod == null;
  };
  exports._isVanilla = _isVanilla;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is now available (unlocked and not hidden).
   * ---------------------------------------- */
  const _isRsAvailable = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs != null && rs.unlockedNow() && rs.isOnPlanet(Vars.state.getPlanet()) && !rs.isHidden();
  };
  exports._isRsAvailable = _isRsAvailable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an intermediate.
   * ---------------------------------------- */
  const _isIntermediate = function(rs_gn) {
    return matchTag(rs_gn, "rs-intmd", "rs");
  };
  exports._isIntermediate = _isIntermediate;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is a waste.
   * ---------------------------------------- */
  const _isWaste = function(rs_gn) {
    return matchTag(rs_gn, "rs-was", "rs");
  };
  exports._isWaste = _isWaste;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an abstract fluid.
   * ---------------------------------------- */
  const _isAuxiliaryFluid = function(rs_gn) {
    return matchTag(rs_gn, "rs-aux", "rs");
  };
  exports._isAuxiliaryFluid = _isAuxiliaryFluid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is an abstract fluid that is not capped in buildings.
   * ---------------------------------------- */
  const _isNoCapAuxiliaryFluid = function(rs_gn) {
    return matchTag(rs_gn, "rs-nocap0aux", "rs");
  };
  exports._isNoCapAuxiliaryFluid = _isNoCapAuxiliaryFluid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is a link fluid (abstract fluid used for non-square building).
   * ---------------------------------------- */
  const _isLinkFluid = function(rs_gn) {
    return matchTag(rs_gn, "rs-link", "rs");
  };
  exports._isLinkFluid = _isLinkFluid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource contains water.
   * ---------------------------------------- */
  const _isAqueousLiquid = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs != null && DB_fluid.db["group"]["aqueous"].includes(rs.name);
  };
  exports._isAqueousLiquid = _isAqueousLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this resource is conductive and can cause short circuit.
   * ---------------------------------------- */
  const _isConductiveLiquid = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs != null && DB_fluid.db["group"]["conductive"].includes(rs.name);
  };
  exports._isConductiveLiquid = _isConductiveLiquid;


  /* <---------- block ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generic miner.
   * ---------------------------------------- */
  const _isMiner = function(blk_gn) {
    return matchTag(blk_gn, "blk-min", "blk");
  };
  exports._isMiner = _isMiner;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a drill.
   * ---------------------------------------- */
  const _isDrill = function(blk_gn) {
    return matchTag(blk_gn, "blk-drl", "blk");
  };
  exports._isDrill = _isDrill;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an attribute miner.
   * ---------------------------------------- */
  const _isHarvester = function(blk_gn) {
    return matchTag(blk_gn, "blk-harv", "blk");
  };
  exports._isHarvester = _isHarvester;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an ore scanner for depth ore detection.
   * ---------------------------------------- */
  const _isOreScanner = function(blk_gn) {
    return matchTag(blk_gn, "blk-scan", "blk");
  };
  exports._isOreScanner = _isOreScanner;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a crop that can be harvested.
   * ---------------------------------------- */
  const _isCrop = function(blk_gn) {
    return matchTag(blk_gn, "blk-crop", "blk");
  };
  exports._isCrop = _isCrop;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block transports items.
   * ---------------------------------------- */
  const _isItemDistributor = function(blk_gn) {
    return matchTag(blk_gn, "blk-dis", "blk");
  };
  exports._isItemDistributor = _isItemDistributor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block transports fluids.
   * ---------------------------------------- */
  const _isFluidDistributor = function(blk_gn) {
    return matchTag(blk_gn, "blk-liq", "blk");
  };
  exports._isFluidDistributor = _isFluidDistributor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block does not accept side inputs.
   * ---------------------------------------- */
  const _isNoSideBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && (
      blk instanceof ArmoredConveyor
        || blk instanceof ArmoredConduit
        || (blk instanceof Duct && blk.armored)
    );
  };
  exports._isNoSideBlock = _isNoSideBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a conveyor.
   * ---------------------------------------- */
  const _isConveyor = function(blk_gn) {
    return matchTag(blk_gn, "blk-conv", "blk");
  };
  exports._isConveyor = _isConveyor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a bridge (for item or fluid).
   * ---------------------------------------- */
  const _isBridge = function(blk_gn) {
    return matchTag(blk_gn, "blk-brd", "blk");
  };
  exports._isBridge = _isBridge;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a gate (for item or fluid).
   * ---------------------------------------- */
  const _isGate = function(blk_gn) {
    return matchTag(blk_gn, "blk-gate", "blk");
  };
  exports._isGate = _isGate;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is god.
   * ---------------------------------------- */
  const _isRouter = function(blk_gn) {
    return matchTag(blk_gn, "blk-router", "blk");
  };
  exports._isRouter = _isRouter;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is exposed to air (can trigger some reactions).
   * ---------------------------------------- */
  const _isExposedBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["exposed"].includes(blk.name);
  };
  exports._isExposedBlock = _isExposedBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an item container.
   * ---------------------------------------- */
  const _isContainer = function(blk_gn) {
    return matchTag(blk_gn, "blk-cont", "blk");
  };
  exports._isContainer = _isContainer;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a core.
   * ---------------------------------------- */
  const _isCoreBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk")
    return blk != null && (blk instanceof CoreBlock || MDL_content._hasTag(blk, "blk-core"));
  };
  exports._isCoreBlock = _isCoreBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a pump block.
   * ---------------------------------------- */
  const _isPump = function(blk_gn) {
    return matchTag(blk_gn, "blk-pump", "blk");
  };
  exports._isPump = _isPump;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a conduit.
   * ---------------------------------------- */
  const _isFluidConduit = function(blk_gn) {
    return matchTag(blk_gn, "blk-fcond", "blk");
  };
  exports._isFluidConduit = _isFluidConduit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a fluid container.
   * ---------------------------------------- */
  const _isFluidContainer = function(blk_gn) {
    return matchTag(blk_gn, "blk-fcont", "blk");
  };
  exports._isFluidContainer = _isFluidContainer;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this conduit will receive damage if the fluid in it is viscous.
   * ---------------------------------------- */
  const _isCloggableBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["cloggable"].includes(blk.name);
  };
  exports._isCloggableBlock = _isCloggableBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a heat conduit.
   * ---------------------------------------- */
  const _isHeatConduit = function(blk_gn) {
    return matchTag(blk_gn, "blk-hcond", "blk");
  };
  exports._isHeatConduit = _isHeatConduit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cogwheel.
   * ---------------------------------------- */
  const _isCogwheel = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog", "blk");
  };
  exports._isCogwheel = _isCogwheel;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cogwheel stack.
   * ---------------------------------------- */
  const _isCogwheelStack = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog0stack", "blk");
  };
  exports._isCogwheelStack = _isCogwheelStack;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a gear box.
   * ---------------------------------------- */
  const _isGearBox = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog0box", "blk");
  };
  exports._isGearBox = _isGearBox;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a transmission rod.
   * ---------------------------------------- */
  const _isTransmissionRod = function(blk_gn) {
    return matchTag(blk_gn, "blk-trans0rod", "blk");
  };
  exports._isTransmissionRod = _isTransmissionRod;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is related to power generation or transmission.
   * ---------------------------------------- */
  const _isPowerBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow", "blk");
  };
  exports._isPowerBlock = _isPowerBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generator.
   * ---------------------------------------- */
  const _isPowerGenerator = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow0gen", "blk");
  };
  exports._isPowerGenerator = _isPowerGenerator;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power transmitter.
   * ---------------------------------------- */
  const _isPowerTransmitter = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow0trans", "blk");
  };
  exports._isPowerTransmitter = _isPowerTransmitter;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a cable.
   * ---------------------------------------- */
  const _isCable = function(blk_gn) {
    return matchTag(blk_gn, "blk-cable", "blk");
  };
  exports._isCable = _isCable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an armored cable.
   * ---------------------------------------- */
  const _isArmoredCable = function(blk_gn) {
    return matchTag(blk_gn, "blk-arm0cable", "blk");
  };
  exports._isArmoredCable = _isArmoredCable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power relay.
   * ---------------------------------------- */
  const _isPowerRelay = function(blk_gn) {
    return matchTag(blk_gn, "blk-relay", "blk");
  };
  exports._isPowerRelay = _isPowerRelay;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a power node.
   * ---------------------------------------- */
  const _isPowerNode = function(blk_gn) {
    return matchTag(blk_gn, "blk-node", "blk");
  };
  exports._isPowerNode = _isPowerNode;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a factory.
   * ---------------------------------------- */
  const _isFactory = function(blk_gn) {
    return matchTag(blk_gn, "blk-fac", "blk");
  };
  exports._isFactory = _isFactory;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a furnace.
   * ---------------------------------------- */
  const _isFurnace = function(blk_gn) {
    return matchTag(blk_gn, "blk-furn", "blk");
  };
  exports._isFurnace = _isFurnace;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a chemical reactor.
   * ---------------------------------------- */
  const _isChemicalReactor = function(blk_gn) {
    return matchTag(blk_gn, "blk-chem0reac", "blk");
  };
  exports._isChemicalReactor = _isChemicalReactor;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a light.
   * ---------------------------------------- */
  const _isLight = function(blk_gn) {
    return matchTag(blk_gn, "blk-li", "blk");
  };
  exports._isLight = _isLight;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a wall for defense.
   * ---------------------------------------- */
  const _isDefenseWall = function(blk_gn) {
    return matchTag(blk_gn, "blk-wall", "blk");
  };
  exports._isDefenseWall = _isDefenseWall;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a generic projector.
   * ---------------------------------------- */
  const _isProjector = function(blk_gn) {
    return matchTag(blk_gn, "blk-proj", "blk");
  };
  exports._isProjector = _isProjector;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a repairer.
   * ---------------------------------------- */
  const _isRepairer = function(blk_gn) {
    return matchTag(blk_gn, "blk-mend", "blk");
  };
  exports._isRepairer = _isRepairer;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is related to logic.
   * ---------------------------------------- */
  const _isLogicBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-log", "blk");
  };
  exports._isLogicBlock = _isLogicBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a switch.
   * ---------------------------------------- */
  const _isSwitch = function(blk_gn) {
    return matchTag(blk_gn, "blk-switch", "blk");
  };
  exports._isSwitch = _isSwitch;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a turret.
   * ---------------------------------------- */
  const _isTurret = function(blk_gn) {
    return matchTag(blk_gn, "blk-tur", "blk");
  };
  exports._isTurret = _isTurret;


  /* <---------- env ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an environmental block.
   * ---------------------------------------- */
  const _isEnvBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-env", "blk");
  };
  exports._isEnvBlock = _isEnvBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a vent.
   * ---------------------------------------- */
  const _isVentBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-vent", "blk");
  };
  exports._isVentBlock = _isVentBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a deposit (tall block ore).
   * ---------------------------------------- */
  const _isOreDepo = function(blk_gn) {
    return matchTag(blk_gn, "blk-depo", "blk");
  };
  exports._isOreDepo = _isOreDepo;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is a large tree (or mushroom).
   * ---------------------------------------- */
  const _isTreeBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-tree", "blk");
  };
  exports._isTreeBlock = _isTreeBlock;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an underground ore.
   * ---------------------------------------- */
  const _isDepthOre = function(blk_gn) {
    return matchTag(blk_gn, "blk-dpore", "blk");
  };
  exports._isDepthOre = _isDepthOre;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is an underground fluid deposit.
   * ---------------------------------------- */
  const _isDepthLiquid = function(blk_gn) {
    return matchTag(blk_gn, "blk-dpliq", "blk");
  };
  exports._isDepthLiquid = _isDepthLiquid;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this block is affected by ore scanners.
   * ---------------------------------------- */
  const _isScannerTarget = function(blk_gn) {
    return _isDepthOre(blk_gn) || _isDepthLiquid(blk_gn)
  };
  exports._isScannerTarget = _isScannerTarget;


  /* <---------- unit type ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is related to core.
   * ---------------------------------------- */
  const _isCoreUnit = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");
    return utp != null && DB_unit.db["group"]["coreUnit"].includes(utp.name);
  };
  exports._isCoreUnit = _isCoreUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is a robot.
   * ---------------------------------------- */
  const _isNonRobot = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");
    return utp != null && DB_unit.db["group"]["nonRobot"].includes(utp.name);
  };
  exports._isNonRobot = _isNonRobot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit or building doesn't create remains upon death.
   * ---------------------------------------- */
  const _hasNoRemains = function(etp_gn) {
    let etp = MDL_content._ct(etp_gn, null, true);
    if(etp == null) return false;

    if(etp instanceof Block) {
      return DB_block.db["group"]["noRemainsMod"].includes(MDL_content._mod(etp))
        || DB_block.db["group"]["noRemains"].includes(etp.name)
        || _isCoreBlock(etp)
        || !etp.createRubble;
    } else {
      return DB_unit.db["group"]["noRemainsMod"].includes(MDL_content._mod(etp))
        || DB_unit.db["group"]["noRemains"].includes(etp.name)
        || _isNonRobot(etp)
        || etp instanceof MissileUnitType
        || !etp.createScorch;
    };
  };
  exports._hasNoRemains = _hasNoRemains;


  /* <---------- entity ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity is in the screen and not covered by fog.
   * ---------------------------------------- */
  const _isVisible = function(e) {
    return !e.inFogTo(Vars.player.team()) && _posVisible(e.x, e.y, MDL_entity._clipSize(e));
  };
  exports._isVisible = _isVisible;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity is seen as enemy to {team}.
   * ---------------------------------------- */
  const _isEnemy = function(e, team) {
    return e.team !== Team.derelict && e.team !== team;
  };
  exports._isEnemy = _isEnemy;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this entity can be healed.
   * ---------------------------------------- */
  const _canHeal = function(e, team) {
    return e.tean === team && e.damaged() && (e instanceof Building ? !e.isHealSuppressed() : true);
  };
  exports._canHeal = _canHeal;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this building is running.
   * ---------------------------------------- */
  const _isBuildingActive = function(b) {
    return b.team !== Team.derelict && b.efficiency > 0.0;
  };
  exports._isBuildingActive = _isBuildingActive;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is a loot unit.
   * ---------------------------------------- */
  const _isLoot = function(unit) {
    return unit.type.name.includes("unit0misc-loot");
  };
  exports._isLoot = _isLoot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this loot cannot be taken up now.
   * ---------------------------------------- */
  const _isLootProtected = function(loot) {
    return loot.fin() * 2.0 < VAR.time_lootProtection / loot.type.lifetime;
  };
  exports._isLootProtected = _isLootProtected;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit won't be used in regular iteration.
   * ---------------------------------------- */
  const _isIrregularUnit = function(unit) {
    return unit.internal || _isLoot(unit);
  };
  exports._isIrregularUnit = _isIrregularUnit;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can be covered by trees.
   * ---------------------------------------- */
  const _isCoverable = function(unit, includeSize) {
    return !unit.flying && unit.type.groundLayer < 76.0 && (!includeSize ? true : unit.hitSize <= VAR.rad_treeHideMaxRad);
  };
  exports._isCoverable = _isCoverable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is covered by trees.
   * ---------------------------------------- */
  const _isCovered = function(unit) {
    return global.lovec.varGen.staHiddenWell != null && unit.hasEffect(global.lovec.varGen.staHiddenWell);
  };
  exports._isCovered = _isCovered;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can be damaged by heat.
   * ---------------------------------------- */
  const _isHeatDamageable = function(unit) {
    return !unit.type.naval && _isOnFloor(unit)
  };
  exports._isHeatDamageable = _isHeatDamageable;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit can be affected by liquid floor.
   * ---------------------------------------- */
  const _isOnFloor = function(unit) {
    return !unit.flying && (!unit.hovering ? true : !(unit instanceof Legsc));
  };
  exports._isOnFloor = _isOnFloor;


  /* ----------------------------------------
   * NOTE:
   *
   * Still affected by explosion knockback.
   * ---------------------------------------- */
  const _isLowAir = function(unit) {
    return unit.flying && unit.type.lowAltitude;
  };
  exports._isLowAir = _isLowAir;


  /* ----------------------------------------
   * NOTE:
   *
   * It flies high.
   * ---------------------------------------- */
  const _isHighAir = function(unit) {
    return unit.flying && !unit.type.lowAltitude;
  };
  exports._isHighAir = _isHighAir;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is moving (not through collision).
   * ---------------------------------------- */
  const _isMoving = function(unit) {
    return unit.vel.len() > (unit.flying ? 0.1 : 0.01);
  };
  exports._isMoving = _isMoving;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is boosting up/down.
   * ---------------------------------------- */
  const _isBoosting = function(unit) {
    return unit.type.canBoost && unit.elevation > 0.73 && unit.elevation < 1.0;
  };
  exports._isBoosting = _isBoosting;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has injured status.
   * ---------------------------------------- */
  const _isInjured = function thisFun(unit) {
    return _hasEffectAny(unit, thisFun.injuredStas);
  }
  .setProp({
    injuredStas: [
      "loveclab-sta-slightly-injured",
      "loveclab-sta-injured",
      "loveclab-sta-heavily-injured",
    ],
  });
  exports._isInjured = _isInjured;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has damaged status.
   * ---------------------------------------- */
  const _isDamaged = function thisFun(unit) {
    return _hasEffectAny(unit, thisFun.damagedStas);
  }
  .setProp({
    damagedStas: [
      "loveclab-sta-damaged",
      "loveclab-sta-severely-damaged",
    ],
  });
  exports._isDamaged = _isDamaged;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has any of given status effects.
   * ---------------------------------------- */
  const _hasEffectAny = function(unit, stas_gn) {
    let sta;
    return stas_gn.some(sta_gn => {
      sta = MDL_content._ct(sta_gn, "sta", true);
      return sta != null && unit.hasEffect(sta);
    });
  };
  exports._hasEffectAny = _hasEffectAny;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit or tile on is HOT, {false} for buildings.
   * Used for remains.
   * ---------------------------------------- */
  const _isHot = function(e, t) {
    return e == null ?
      t != null && _isHotStatus(t.floor().status) :
      !(e instanceof Building) && (_hasEffectAny(e, DB_status.db["group"]["hot"]) || _isHot(null, e.tileOn()));
  };
  exports._isHot = _isHot;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has been soaked in aqueous liquids recently.
   * This may influence something like short circuit.
   * ---------------------------------------- */
  const _isWet = function(unit) {
    return _hasEffectAny(unit, DB_status.db["group"]["wet"]);
  };
  exports._isWet = _isWet;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit has at least one weapon active.
   * ---------------------------------------- */
  const _isAttacking = function(unit) {
    return unit.mounts.some(mt => mt.reload > 0.0);
  };
  exports._isAttacking = _isAttacking;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this unit is performing any actions.
   * ---------------------------------------- */
  const _isActing = function(unit) {
    return _isMoving(unit) || _isAttacking(unit) || unit.mining() || unit.isBuilding();
  };
  exports._isActing = _isActing;


  /* <---------- status effect ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is related to high temperature.
   * ---------------------------------------- */
  const _isHotStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["hot"].includes(sta.name);
  };
  exports._isHotStatus = _isHotStatus;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is related to water.
   * ---------------------------------------- */
  const _isWetStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["wet"].includes(sta.name);
  };
  exports._isWetStatus = _isWetStatus;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is a fading (or flickering) status.
   * ---------------------------------------- */
  const _isFadeStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-fade", "sta");
  };
  exports._isFadeStatus = _isFadeStatus;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is triggered upon unit death.
   * ---------------------------------------- */
  const _isDeathStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-death", "sta");
  };
  exports._isDeathStatus = _isDeathStatus;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether this status is a stackable status.
   * ---------------------------------------- */
  const _isStackStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && tryFun(sta.ex_isStackSta, sta, false);
  };
  exports._isStackStatus = _isStackStatus;
