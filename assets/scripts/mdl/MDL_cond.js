/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to check conditions.
   * @module lovec/mdl/MDL_cond
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- auxiliary ----------> */


  function matchTag(ct_gn, tag, mode, suppressWarning) {
    return MDL_content._hasTag(MDL_content._ct(ct_gn, mode, suppressWarning), tag);
  };


  /* <---------- position ----------> */


  /**
   * Whether there's any loot unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  const _posHasLoot = function(x, y) {
    let count = 0;
    Groups.unit.intersect(x - 3.0, y - 3.0, 12.0, 12.0).each(ounit => {
      if(_isLoot(ounit)) count++;
    });

    return count > 0;
  };
  exports._posHasLoot = _posHasLoot;


  /* <---------- content ----------> */


  /**
   * Whether this content is from vanilla game.
   * @param {ContentGn} ct_gn
   * @return {boolean}
   */
  const _isVanilla = function(ct_gn) {
    let ct = MDL_content._ct(ct_gn, null, true);
    return ct != null && ct.minfo.mod == null;
  };
  exports._isVanilla = _isVanilla;


/* <---------- resource ----------> */


  /**
   * Whether this resource is available now (unlocked and not hidden).
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const _isRsAvailable = function(rs_gn) {
    let rs = MDL_content._ct(rs_gn, "rs");
    return rs != null && rs.unlockedNow() && rs.isOnPlanet(Vars.state.getPlanet()) && !rs.isHidden();
  };
  exports._isRsAvailable = _isRsAvailable;


  /**
   * Whether this resource is an intermediate.
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const _isIntermediate = function(rs_gn) {
    return matchTag(rs_gn, "rs-intmd", "rs");
  };
  exports._isIntermediate = _isIntermediate;


  /**
   * Whether this resource is a waste.
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const _isWaste = function(rs_gn) {
    return matchTag(rs_gn, "rs-was", "rs");
  };
  exports._isWaste = _isWaste;


  /**
   * Whether this resource is an abstract fluid.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const _isAuxiliaryFluid = function(liq_gn) {
    return matchTag(liq_gn, "rs-aux", "rs");
  };
  exports._isAuxiliaryFluid = _isAuxiliaryFluid;


  /**
   * Whether this resource is an abstract fluid that is not capped in builings.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const _isNoCapAuxiliaryFluid = function(liq_gn) {
    return matchTag(liq_gn, "rs-nocap0aux", "rs");
  };
  exports._isNoCapAuxiliaryFluid = _isNoCapAuxiliaryFluid;


  /**
   * Whether this resource contains water.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const _isAqueousLiquid = function(liq_gn) {
    let liq = MDL_content._ct(liq_gn, "rs");
    return liq != null && DB_fluid.db["group"]["aqueous"].includes(liq.name);
  };
  exports._isAqueousLiquid = _isAqueousLiquid;


  /**
   * Whether this resource is a conductive liquid (can cause short circuit).
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const _isConductiveLiquid = function(liq_gn) {
    let liq = MDL_content._ct(liq_gn, "rs");
    return liq != null && DB_fluid.db["group"]["conductive"].includes(liq.name);
  };
  exports._isConductiveLiquid = _isConductiveLiquid;


  /* <---------- block ----------> */


  /**
   * Whether this block is a generic miner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isMiner = function(blk_gn) {
    return matchTag(blk_gn, "blk-min", "blk");
  };
  exports._isMiner = _isMiner;


  /**
   * Whether this block is a drill.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isDrill = function(blk_gn) {
    return matchTag(blk_gn, "blk-drl", "blk");
  };
  exports._isDrill = _isDrill;


  /**
   * Whether this block is an attribute miner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isHarvester = function(blk_gn) {
    return matchTag(blk_gn, "blk-harv", "blk");
  };
  exports._isHarvester = _isHarvester;


  /**
   * Whether this block is an ore scanner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isOreScanner = function(blk_gn) {
    return matchTag(blk_gn, "blk-scan", "blk");
  };
  exports._isOreScanner = _isOreScanner;


  /**
   * Whether this block is a crop.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCrop = function(blk_gn) {
    return matchTag(blk_gn, "blk-crop", "blk");
  };
  exports._isCrop = _isCrop;


  /**
   * Whether this block transports items.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isItemDistributor = function(blk_gn) {
    return matchTag(blk_gn, "blk-dis", "blk");
  };
  exports._isItemDistributor = _isItemDistributor;


  /**
   * Whether this block transports fluids.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isFluidDistributor = function(blk_gn) {
    return matchTag(blk_gn, "blk-liq", "blk");
  };
  exports._isFluidDistributor = _isFluidDistributor;


  /**
   * Whether this block does not accept side inputs.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isNoSideBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && (
      blk instanceof ArmoredConveyor
        || blk instanceof ArmoredConduit
        || (blk instanceof Duct && blk.armored)
    );
  };
  exports._isNoSideBlock = _isNoSideBlock;


  /**
   * Whether this block is a conveyor.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isConveyor = function(blk_gn) {
    return matchTag(blk_gn, "blk-conv", "blk");
  };
  exports._isConveyor = _isConveyor;


  /**
   * Whether this block is an item duct.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isDuct = function(blk_gn) {
    return matchTag(blk_gn, "blk-duct", "blk");
  };
  exports._isDuct = _isDuct;


  /**
   * Whether this block is an item or fluid bridge.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isBridge = function(blk_gn) {
    return matchTag(blk_gn, "blk-brd", "blk");
  };
  exports._isBridge = _isBridge;


  /**
   * Whether this block is an item or fluid gate.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isGate = function(blk_gn) {
    return matchTag(blk_gn, "blk-gate", "blk");
  };
  exports._isGate = _isGate;


  /**
   * Whether this block is a router.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isRouter = function(blk_gn) {
    return matchTag(blk_gn, "blk-router", "blk");
  };
  exports._isRouter = _isRouter;


  /**
   * Whether this block is exposed to air (can trigger some reactions).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isExposedBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["exposed"].includes(blk.name);
  };
  exports._isExposedBlock = _isExposedBlock;


  /**
   * Whether this block is an item container.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isContainer = function(blk_gn) {
    return matchTag(blk_gn, "blk-cont", "blk");
  };
  exports._isContainer = _isContainer;


  /**
   * Whether this block is a core.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCoreBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && (blk instanceof CoreBlock || MDL_content._hasTag(blk, "blk-core"));
  };
  exports._isCoreBlock = _isCoreBlock;


  /**
   * Whether this block is a pump.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPump = function(blk_gn) {
    return matchTag(blk_gn, "blk-pump", "blk");
  };
  exports._isPump = _isPump;


  /**
   * Whether this block is a fluid conduit.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isFluidConduit = function(blk_gn) {
    return matchTag(blk_gn, "blk-fcond", "blk");
  };
  exports._isFluidConduit = _isFluidConduit;


   /**
    * Whether this block is a fluid container.
    * @param {BlockGn} blk_gn
    * @return {boolean}
    */
  const _isFluidContainer = function(blk_gn) {
    return matchTag(blk_gn, "blk-fcont", "blk");
  };
  exports._isFluidContainer = _isFluidContainer;


  /**
   * Whether this block is a cloggable fluid block.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCloggableBlock = function(blk_gn) {
    let blk = MDL_content._ct(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["cloggable"].includes(blk.name);
  };
  exports._isCloggableBlock = _isCloggableBlock;


  /**
   * Whether this block is a heat conduit.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isHeatConduit = function(blk_gn) {
    return matchTag(blk_gn, "blk-hcond", "blk");
  };
  exports._isHeatConduit = _isHeatConduit;


  /**
   * Whether this block is a cogwheel.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCogwheel = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog", "blk");
  };
  exports._isCogwheel = _isCogwheel;


  /**
   * Whether this block is a cogwheel stack.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCogwheelStack = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog0stack", "blk");
  };
  exports._isCogwheelStack = _isCogwheelStack;


  /**
   * Whether this block is a gear box.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isGearBox = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog0box", "blk");
  };
  exports._isGearBox = _isGearBox;


  /**
   * Whether this block is a transmission rod.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isTransmissionRod = function(blk_gn) {
    return matchTag(blk_gn, "blk-trans0rod", "blk");
  };
  exports._isTransmissionRod = _isTransmissionRod;


  /**
   * Whether this block is related to power generation or transmission.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPowerBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow", "blk");
  };
  exports._isPowerBlock = _isPowerBlock;


  /**
   * Whether this block is a generator.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPowerGenerator = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow0gen", "blk");
  };
  exports._isPowerGenerator = _isPowerGenerator;


  /**
   * Whether this block is a power transmitter.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPowerTransmitter = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow0trans", "blk");
  };
  exports._isPowerTransmitter = _isPowerTransmitter;


  /**
   * Whether this block is a cable.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isCable = function(blk_gn) {
    return matchTag(blk_gn, "blk-cable", "blk");
  };
  exports._isCable = _isCable;


  /**
   * Whether this block is an armored cable.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isArmoredCable = function(blk_gn) {
    return matchTag(blk_gn, "blk-arm0cable", "blk");
  };
  exports._isArmoredCable = _isArmoredCable;


  /**
   * Whether this block is a power relay.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPowerRelay = function(blk_gn) {
    return matchTag(blk_gn, "blk-relay", "blk");
  };
  exports._isPowerRelay = _isPowerRelay;


  /**
   * Whether this block is a power node.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isPowerNode = function(blk_gn) {
    return matchTag(blk_gn, "blk-node", "blk");
  };
  exports._isPowerNode = _isPowerNode;


  /**
   * Whether this block is a factory.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isFactory = function(blk_gn) {
    return matchTag(blk_gn, "blk-fac", "blk");
  };
  exports._isFactory = _isFactory;


  /**
   * Whether this block is a recipe factory (multi-crafter).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isRecipeFactory = function(blk_gn) {
    return matchTag(blk_gn, "blk-rc0fac", "blk");
  };
  exports._isRecipeFactory = _isRecipeFactory;


  /**
   * Whether this block is a furnace.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isFurnace = function(blk_gn) {
    return matchTag(blk_gn, "blk-furn", "blk");
  };
  exports._isFurnace = _isFurnace;


  /**
   * Whether this block is a chemical reactor.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isChemicalReactor = function(blk_gn) {
    return matchTag(blk_gn, "blk-chem0reac", "blk");
  };
  exports._isChemicalReactor = _isChemicalReactor;


  /**
   * Whether this block is a light.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isLight = function(blk_gn) {
    return matchTag(blk_gn, "blk-li", "blk");
  };
  exports._isLight = _isLight;


  /**
   * Whether this block is a wall for defense.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isDefenseWall = function(blk_gn) {
    return matchTag(blk_gn, "blk-wall", "blk");
  };
  exports._isDefenseWall = _isDefenseWall;


  /**
   * Whether this block is a generic projector.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isProjector = function(blk_gn) {
    return matchTag(blk_gn, "blk-proj", "blk");
  };
  exports._isProjector = _isProjector;


  /**
   * Whether this block is a repairer.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isRepairer = function(blk_gn) {
    return matchTag(blk_gn, "blk-mend", "blk");
  };
  exports._isRepairer = _isRepairer;


  /**
   * Whether this block is related to logic.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isLogicBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-log", "blk");
  };
  exports._isLogicBlock = _isLogicBlock;


  /**
   * Whether this block is a switch.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isSwitch = function(blk_gn) {
    return matchTag(blk_gn, "blk-switch", "blk");
  };
  exports._isSwitch = _isSwitch;


  /**
   * Whether this block is a turret.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isTurret = function(blk_gn) {
    return matchTag(blk_gn, "blk-tur", "blk");
  };
  exports._isTurret = _isTurret;


  /* <---------- env ----------> */


  /**
   * Whether this block is an environmental block.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isEnvBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-env", "blk");
  };
  exports._isEnvBlock = _isEnvBlock;


  /**
   * Whether this block is a vent.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isVentBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-vent", "blk");
  };
  exports._isVentBlock = _isVentBlock;


  /**
   * Whether this block is a deposit (tall block ore).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isOreDepo = function(blk_gn) {
    return matchTag(blk_gn, "blk-depo", "blk");
  };
  exports._isOreDepo = _isOreDepo;


  /**
   * Whether this block is a large tree (or mushroom).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isTreeBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-tree", "blk");
  };
  exports._isTreeBlock = _isTreeBlock;


  /**
   * Whether this block is a tall grass.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isTallGrassBlock = function(blk_gn) {
    return matchTag(blk_gn, "blk-tall0grass", "blk");
  };
  exports._isTallGrassBlock = _isTallGrassBlock;


  /**
   * Whether this block is an underground ore.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isDepthOre = function(blk_gn) {
    return matchTag(blk_gn, "blk-dpore", "blk");
  };
  exports._isDepthOre = _isDepthOre;


  /**
   * Whether this block is an underground fluid deposit.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isDepthLiquid = function(blk_gn) {
    return matchTag(blk_gn, "blk-dpliq", "blk");
  };
  exports._isDepthLiquid = _isDepthLiquid;


  /**
   * Whether this block is affected by ore scanners.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _isScannerTarget = function(blk_gn) {
    return _isDepthOre(blk_gn) || _isDepthLiquid(blk_gn)
  };
  exports._isScannerTarget = _isScannerTarget;


  /* <---------- unit type ----------> */


  /**
   * Whether this unit type is related to core.
   * @param {UnitTypeGn} utp_gn
   * @return {boolean}
   */
  const _isCoreUnit = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");
    return utp != null && DB_unit.db["group"]["coreUnit"].includes(utp.name);
  };
  exports._isCoreUnit = _isCoreUnit;


  /**
   * Whether this unit type is not a robot.
   * @param {UnitTypeGn} utp_gn
   * @return {boolean}
   */
  const _isNonRobot = function(utp_gn) {
    let utp = MDL_content._ct(utp_gn, "utp");
    return utp != null && DB_unit.db["group"]["nonRobot"].includes(utp.name);
  };
  exports._isNonRobot = _isNonRobot;


  /**
   * Whether this unit type or block doesn't create remains upon death.
   * @param {string|Block|UnitType|null} etp_gn
   * @return {boolean}
   */
  const _hasNoRemains = function(etp_gn) {
    let etp = MDL_content._ct(etp_gn, null, true);
    if(etp == null) return false;

    if(etp instanceof Block) {
      return DB_block.db["group"]["noRemainsMod"].includes(MDL_content._mod(etp))
        || DB_block.db["group"]["noRemains"].includes(etp.name)
        || _isCoreBlock(etp)
        || !etp.createRubble;
    };
    return DB_unit.db["group"]["noRemainsMod"].includes(MDL_content._mod(etp))
      || DB_unit.db["group"]["noRemains"].includes(etp.name)
      || _isNonRobot(etp)
      || etp instanceof MissileUnitType
      || !etp.createScorch;
  };
  exports._hasNoRemains = _hasNoRemains;


  /* <---------- entity ----------> */


  /**
   * Whether this entity is seen as enemy to given team.
   * @param {TeamcGn} e
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const _isEnemy = function(e, team) {
    return LCCheck.checkHostile(e, tryVal(team, null));
  };
  exports._isEnemy = _isEnemy;


  /**
   * Whether this entity can be healed.
   * @param {HealthcGn} e
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const _canHeal = function(e, team) {
    return LCCheck.checkHealable(e, tryVal(team, null));
  };
  exports._canHeal = _canHeal;


  /**
   * Whether this building is running.
   * @param {Building} b
   * @return {boolean}
   */
  const _isBuildingActive = function(b) {
    return b.team !== Team.derelict && b.efficiency > 0.0;
  };
  exports._isBuildingActive = _isBuildingActive;


  /**
   * Whether this unit is a loot unit.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isLoot = function(unit) {
    return unit.type.name.includes("unit0misc-loot");
  };
  exports._isLoot = _isLoot;


  /**
   * Whether this loot cannot be taken up now.
   * @param {Unit} loot
   * @return {boolean}
   */
  const _isLootProtected = function(loot) {
    return loot.fin() * 2.0 < VAR.time.lootProtection / loot.type.lifetime;
  };
  exports._isLootProtected = _isLootProtected;


  /**
   * Whether this unit won't be used in regular iteration.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isIrregularUnit = function(unit) {
    return unit.internal || _isLoot(unit);
  };
  exports._isIrregularUnit = _isIrregularUnit;


  /**
   * Whether this unit can be covered by trees.
   * @param {Unit} unit
   * @param {boolean|unset} [includeSize]
   * @return {boolean}
   */
  const _isCoverable = function(unit, includeSize) {
    return !unit.flying && unit.type.groundLayer < 76.0 && (!includeSize ? true : unit.hitSize <= VAR.range.treeHideMaxRad);
  };
  exports._isCoverable = _isCoverable;


  /**
   * Whether this unit is covered by trees.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isCovered = function(unit) {
    return VARGEN.staHiddenWell != null && unit.hasEffect(VARGEN.staHiddenWell);
  };
  exports._isCovered = _isCovered;


  /**
   * Whether this unit can be damaged by heat.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isHeatDamageable = function(unit) {
    return !unit.type.naval && _isOnFloor(unit)
  };
  exports._isHeatDamageable = _isHeatDamageable;


  /**
   * Whether this unit can be affected by liquid floor.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isOnFloor = function(unit) {
    return !unit.flying && (!unit.hovering ? true : !(unit instanceof Legsc));
  };
  exports._isOnFloor = _isOnFloor;


  /**
   * Still affected by explosion knockback.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isLowAir = function(unit) {
    return unit.flying && unit.type.lowAltitude;
  };
  exports._isLowAir = _isLowAir;


  /**
   * It flies high.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isHighAir = function(unit) {
    return unit.flying && !unit.type.lowAltitude;
  };
  exports._isHighAir = _isHighAir;


  /**
   * Whether this unit is moving (not through collision).
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isMoving = function(unit) {
    return unit.vel.len() > (unit.flying ? 0.1 : 0.01);
  };
  exports._isMoving = _isMoving;


  /**
   * Whether this unit is boosting up/down.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isBoosting = function(unit) {
    return unit.type.canBoost && unit.elevation > 0.73 && unit.elevation < 1.0;
  };
  exports._isBoosting = _isBoosting;


  /**
   * Whether this unit has injured status.
   * @param {Unit} unit
   * @return {boolean}
   */
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


  /**
   * Whether this unit has damaged status.
   * @param {Unit} unit
   * @return {boolean}
   */
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


  /**
   * Whether this unit has any of given status effects.
   * @param {Unit} unit
   * @param {Array<StatusGn>} stas_gn
   * @return {boolean}
   */
  const _hasEffectAny = function(unit, stas_gn) {
    let sta;
    return stas_gn.some(sta_gn => {
      sta = MDL_content._ct(sta_gn, "sta", true);
      return sta != null && unit.hasEffect(sta);
    });
  };
  exports._hasEffectAny = _hasEffectAny;


  /**
   * Whether this unit or tile on is HOT, false for buildings.
   * Used for remains.
   * @param {Building|Unit} e
   * @param {Tile|unset} [t]
   * @return {boolean}
   */
  const _isHot = function(e, t) {
    return e == null ?
      t != null && _isHotStatus(t.floor().status) :
      !(e instanceof Building) && (_hasEffectAny(e, DB_status.db["group"]["hot"]) || _isHot(null, e.tileOn()));
  };
  exports._isHot = _isHot;


  /**
   * Whether this unit has been soaked in aqueous liquids recently.
   * This may influence something like short circuit.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isWet = function(unit) {
    return _hasEffectAny(unit, DB_status.db["group"]["wet"]);
  };
  exports._isWet = _isWet;


  /**
   * Whether this unit has at least one weapon active.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isAttacking = function(unit) {
    return unit.mounts.some(mt => mt.reload > 0.0);
  };
  exports._isAttacking = _isAttacking;


  /**
   * Whether this unit is performing any actions.
   * @param {Unit} unit
   * @return {boolean}
   */
  const _isActing = function(unit) {
    return _isMoving(unit) || _isAttacking(unit) || unit.mining() || unit.isBuilding();
  };
  exports._isActing = _isActing;


  /* <---------- status effect ----------> */


  /**
   * Whether this status is related to high temperature.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const _isHotStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["hot"].includes(sta.name);
  };
  exports._isHotStatus = _isHotStatus;


  /**
   * Whether this status is related to water.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const _isWetStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["wet"].includes(sta.name);
  };
  exports._isWetStatus = _isWetStatus;


  /**
   * Whether this status is a fading (or flickering) status.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const _isFadeStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-fade", "sta");
  };
  exports._isFadeStatus = _isFadeStatus;


  /**
   * Whether this status is triggered upon unit death.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const _isDeathStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-death", "sta");
  };
  exports._isDeathStatus = _isDeathStatus;


  /**
   * Whether this status is a stackable status.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const _isStackStatus = function(sta_gn) {
    let sta = MDL_content._ct(sta_gn, "sta");
    return sta != null && tryFun(sta.ex_isStackSta, sta, false);
  };
  exports._isStackStatus = _isStackStatus;
