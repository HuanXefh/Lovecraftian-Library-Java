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


  /* <------------------------------ auxiliary ------------------------------ */


  function matchTag(ct_gn, tag, mode, suppressWarning) {
    return checkTempTag(MDL_content.getCt(ct_gn, mode, suppressWarning), tag);
  };


  function matchCond(ct_gn, key, mode, suppressWarning) {
    let ct = MDL_content.getCt(ct_gn, mode, suppressWarning);
    return ct == null ? false : DB_block.db["class"]["group"]["condition"][key].hasIns(ct);
  };


  /* <------------------------------ position ------------------------------ */


  /**
   * Whether there's any loot unit at (x, y).
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  const posHasLoot = function(x, y) {
    let count = 0;
    Groups.unit.intersect(x - 3.0, y - 3.0, 12.0, 12.0).each(ounit => {
      if(isLoot(ounit)) count++;
    });

    return count > 0;
  };
  exports.posHasLoot = posHasLoot;


  /* <------------------------------ content ------------------------------ */


  /**
   * Whether this content is from vanilla game.
   * @param {ContentGn} ct_gn
   * @return {boolean}
   */
  const isVanilla = function(ct_gn) {
    let ct = MDL_content.getCt(ct_gn, null, true);
    return ct != null && ct.minfo.mod == null;
  }
  .setCache();
  exports.isVanilla = isVanilla;


/* <------------------------------ resource ------------------------------ */


  /**
   * Whether this resource is available now (unlocked and not hidden).
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const isRsAvailable = function(rs_gn) {
    let rs = MDL_content.getCt(rs_gn, "rs");
    return rs != null && rs.unlockedNow() && rs.isOnPlanet(Vars.state.getPlanet()) && !rs.isHidden();
  };
  exports.isRsAvailable = isRsAvailable;


  /**
   * Whether this resource is an intermediate.
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const isIntermediate = function(rs_gn) {
    return matchTag(rs_gn, "rs-intmd", "rs");
  }
  .setCache();
  exports.isIntermediate = isIntermediate;


  /**
   * Whether this resource is a waste.
   * @param {ResourceGn} rs_gn
   * @return {boolean}
   */
  const isWaste = function(rs_gn) {
    return matchTag(rs_gn, "rs-was", "rs");
  }
  .setCache();
  exports.isWaste = isWaste;


  /**
   * Whether this resource is an abstract fluid.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const isAuxiliaryFluid = function(liq_gn) {
    return matchTag(liq_gn, "rs-aux", "rs");
  }
  .setCache();
  exports.isAuxiliaryFluid = isAuxiliaryFluid;


  /**
   * Whether this resource is an abstract fluid that is not capped in buildings.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const isNoCapAuxiliaryFluid = function(liq_gn) {
    return matchTag(liq_gn, "rs-aux-nocap", "rs");
  }
  .setCache();
  exports.isNoCapAuxiliaryFluid = isNoCapAuxiliaryFluid;


  /**
   * Whether this resource contains water.
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const isAqueousLiquid = function(liq_gn) {
    let liq = MDL_content.getCt(liq_gn, "rs");
    return liq != null && DB_fluid.db["group"]["aqueous"].includes(liq.name);
  }
  .setCache();
  exports.isAqueousLiquid = isAqueousLiquid;


  /**
   * Whether this resource is a conductive liquid (can cause short circuit).
   * @param {LiquidGn} liq_gn
   * @return {boolean}
   */
  const isConductiveLiquid = function(liq_gn) {
    let liq = MDL_content.getCt(liq_gn, "rs");
    return liq != null && DB_fluid.db["group"]["conductive"].includes(liq.name);
  }
  .setCache();
  exports.isConductiveLiquid = isConductiveLiquid;


  /* <------------------------------ block ------------------------------ */


  /**
   * Whether this block is a generic miner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isMinerBlock = function(blk_gn) {
    return isDrill(blk_gn) || isHarvester(blk_gn);
  }
  .setCache();
  exports.isMinerBlock = isMinerBlock;


  /**
   * Whether this block is a drill.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isDrill = function(blk_gn) {
    return matchCond(blk_gn, "drill", "blk");
  }
  .setCache();
  exports.isDrill = isDrill;


  /**
   * Whether this block is an attribute miner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isHarvester = function(blk_gn) {
    return matchCond(blk_gn, "harvester", "blk");
  }
  .setCache();
  exports.isHarvester = isHarvester;


  /**
   * Whether this block is an ore scanner.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isOreScanner = function(blk_gn) {
    return matchTag(blk_gn, "blk-scan", "blk");
  }
  .setCache();
  exports.isOreScanner = isOreScanner;


  /**
   * Whether this block is a crop.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isCrop = function(blk_gn) {
    return matchTag(blk_gn, "blk-crop", "blk");
  }
  .setCache();
  exports.isCrop = isCrop;


  /**
   * Whether this block does not accept side inputs.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isNoSideBlock = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && DB_block.db["class"]["group"]["condition"]["noSide"].some(tup => checkInstance(blk, tup[0]) && tup[1](blk));
  }
  .setCache();
  exports.isNoSideBlock = isNoSideBlock;


  /**
   * Whether two blocks belong to the same type of no-side block.
   * @param {BlockGn} blk1_gn
   * @param {BlockGn} blk2_gn
   * @return {boolean}
   */
  const isSamePairNoSideBlock = function(blk1_gn, blk2_gn) {
    let blk1 = MDL_content.getCt(blk1_gn, "blk");
    let blk2 = MDL_content.getCt(blk2_gn, "blk");
    return blk1 != null && blk2 != null && DB_block.db["class"]["group"]["condition"]["noSide"].some(tup => checkInstance(blk1, tup[0]) && checkInstance(blk2, tup[0]) && tup[1](blk1) && tup[1](blk2));
  }
  .setCache();
  exports.isSamePairNoSideBlock = isSamePairNoSideBlock;


  /**
   * Whether this block is a conveyor.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isConveyor = function(blk_gn) {
    return (matchCond(blk_gn, "conveyor", "blk") && !isCable(blk_gn)) || isStackConveyor(blk_gn);
  }
  .setCache();
  exports.isConveyor = isConveyor;


  /**
   * Whether this block is a regular conveyor.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isNonStackConveyor = function(blk_gn) {
    return isConveyor(blk_gn) && !isStackConveyor(blk_gn);
  }
  .setCache();
  exports.isNonStackConveyor = isNonStackConveyor;


  /**
   * Whether this block is a stack conveyor.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isStackConveyor = function(blk_gn) {
    return matchCond(blk_gn, "stackConveyor", "blk");
  }
  .setCache();
  exports.isStackConveyor = isStackConveyor;


  /**
   * Whether this block is an item duct.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isDuct = function(blk_gn) {
    return matchCond(blk_gn, "duct", "blk");
  }
  .setCache();
  exports.isDuct = isDuct;


  /**
   * Whether this block is an item or fluid bridge.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isBridge = function(blk_gn) {
    return matchCond(blk_gn, "bridge", "blk");
  }
  .setCache();
  exports.isBridge = isBridge;


  /**
   * Whether this block is an item or fluid gate.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isGate = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && (matchCond(blk_gn, "gate", "blk") && tryFun(blk.ex_isGateBlk, blk, false));
  }
  .setCache();
  exports.isGate = isGate;


  /**
   * Whether this block is a classic item router.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isClassicRouter = function(blk_gn) {
    return matchCond(blk_gn, "router", "blk");
  }
  .setCache();
  exports.isClassicRouter = isClassicRouter;


  /**
   * Whether this block is a rotatable router.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isGenericRouter = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && (blk.rotate && isGate(blk_gn) && !tryFun(blk.ex_noSideOutput, blk, false)) || isFluidRouter(blk_gn);
  }
  .setCache();
  exports.isGenericRouter = isGenericRouter;


  /**
   * Whether this block is a rotatable router that outputs in 4 directions.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isFullRouter = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && blk.rotate && (
      isDrill(blk)
        || isPowerGenerator(blk)
        || isFactory(blk)
        || blk instanceof MultiBlockLiquidRouter
    ) && !tryFun(blk.ex_noAllSideOutput, blk, false);
  }
  .setCache();
  exports.isFullRouter = isFullRouter;


  /**
   * Whether this block is a mass driver.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isMassDriver = function(blk_gn) {
    return matchCond(blk_gn, "massDriver", "blk");
  }
  .setCache();
  exports.isMassDriver = isMassDriver;


  /**
   * Whether this block is exposed to air (can trigger some reactions).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isExposedBlock = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["exposed"].includes(blk.name);
  }
  .setCache();
  exports.isExposedBlock = isExposedBlock;


  /**
   * Whether this block is an item container.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isContainer = function(blk_gn) {
    return matchCond(blk_gn, "container", "blk") && !isCoreBlock(blk_gn) && !matchTag(blk_gn, "blk-non-cont", "blk");
  }
  .setCache();
  exports.isContainer = isContainer;


  /**
   * Whether this block is a core.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isCoreBlock = function(blk_gn) {
    return matchCond(blk_gn, "core", "blk");
  }
  .setCache();
  exports.isCoreBlock = isCoreBlock;


  /**
   * Whether this block is a pump that outputs liquid.
   * Not pressure pump!
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPump = function(blk_gn) {
    return matchCond(blk_gn, "pump", "blk");
  }
  .setCache();
  exports.isPump = isPump;


  /**
   * Whether this block is a pressure pump.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPressurePump = function(blk_gn) {
    return matchCond(blk_gn, "pressurePump", "blk");
  }
  .setCache();
  exports.isPressurePump = isPressurePump;


  /**
   * Whether this block is a fluid conduit.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isFluidConduit = function(blk_gn) {
    return matchCond(blk_gn, "conduit", "blk");
  }
  .setCache();
  exports.isFluidConduit = isFluidConduit;


   /**
    * Whether this block is a fluid container.
    * @param {BlockGn} blk_gn
    * @return {boolean}
    */
  const isFluidContainer = function(blk_gn) {
    return matchCond(blk_gn, "fluidContainer", "blk") && !isFluidRouter(blk_gn);
  }
  .setCache();
  exports.isFluidContainer = isFluidContainer;


   /**
    * Whether this block is a fluid router (directional container).
    * I know the name is a bit puzzling.
    * @param {BlockGn} blk_gn
    * @return {boolean}
    */
  const isFluidRouter = function(blk_gn) {
    return matchCond(blk_gn, "fluidRouter", "blk");
  }
  .setCache();
  exports.isFluidRouter = isFluidRouter;


  /**
   * Whether this block is a cloggable fluid block.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isCloggableBlock = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && DB_block.db["group"]["cloggable"].includes(blk.name);
  }
  .setCache();
  exports.isCloggableBlock = isCloggableBlock;


  /**
   * Whether this block is a cogwheel.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isCogwheel = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog", "blk");
  }
  .setCache();
  exports.isCogwheel = isCogwheel;


  /**
   * Whether this block is a gear box.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isGearBox = function(blk_gn) {
    return matchTag(blk_gn, "blk-cog-box", "blk");
  }
  .setCache();
  exports.isGearBox = isGearBox;


  /**
   * Whether this block is a transmission rod.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isTransmissionRod = function(blk_gn) {
    return matchTag(blk_gn, "blk-tor-rod", "blk");
  }
  .setCache();
  exports.isTransmissionRod = isTransmissionRod;


  /**
   * Whether this block is related to power generation or transmission.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPowerBlock = function(blk_gn) {
    return isPowerGenerator(blk_gn) || isPowerTransmitter(blk_gn);
  }
  .setCache();
  exports.isPowerBlock = isPowerBlock;


  /**
   * Whether this block is a generator.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPowerGenerator = function(blk_gn) {
    return matchCond(blk_gn, "generator", "blk");
  }
  .setCache();
  exports.isPowerGenerator = isPowerGenerator;


  /**
   * Whether this block is not a reactor-type generator.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isNonReactorPowerGenerator = function(blk_gn) {
    return isPowerGenerator(blk_gn) && !isReactorPowerGenerator(blk_gn);
  }
  .setCache();
  exports.isNonReactorPowerGenerator = isNonReactorPowerGenerator;


  /**
   * Whether this block is a reactor-type generator.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isReactorPowerGenerator = function(blk_gn) {
    let blk = MDL_content.getCt(blk_gn, "blk");
    return blk != null && DB_block.db["class"]["group"]["condition"]["powerReactor"].some(tup => checkInstance(blk, tup[0]) && tup[1](blk));
  }
  .setCache();
  exports.isReactorPowerGenerator = isReactorPowerGenerator;


  /**
   * Whether this block is a power transmitter.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPowerTransmitter = function(blk_gn) {
    return matchCond(blk_gn, "transmitter", "blk") || isCable(blk_gn);
  }
  .setCache();
  exports.isPowerTransmitter = isPowerTransmitter;


  /**
   * Whether this block is a cable.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isCable = function(blk_gn) {
    return matchCond(blk_gn, "cable", "blk");
  }
  .setCache();
  exports.isCable = isCable;


  /**
   * Whether this block is an armored cable.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isArmoredCable = function(blk_gn) {
    return matchCond(blk_gn, "armoredCable", "blk");
  }
  .setCache();
  exports.isArmoredCable = isArmoredCable;


  /**
   * Whether this block is a power relay.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPowerRelay = function(blk_gn) {
    return matchTag(blk_gn, "blk-pow-relay", "blk");
  }
  .setCache();
  exports.isPowerRelay = isPowerRelay;


  /**
   * Whether this block is a power node.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isPowerNode = function(blk_gn) {
    return matchCond(blk_gn, "transmitter", "blk") && !isPowerRelay(blk_gn) && !isCable(blk_gn);
  }
  .setCache();
  exports.isPowerNode = isPowerNode;


  /**
   * Whether this block is a factory.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isFactory = function(blk_gn) {
    return (matchCond(blk_gn, "factory", "blk") || isMultiCrafter(blk_gn)) && !matchTag(blk_gn, "blk-non-fac", "blk");
  }
  .setCache();
  exports.isFactory = isFactory;


  /**
   * Whether this block is a multi-crafter.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isMultiCrafter = function(blk_gn) {
    return matchCond(blk_gn, "multiCrafter", "blk");
  }
  .setCache();
  exports.isMultiCrafter = isMultiCrafter;


  /**
   * Whether this block is a light.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isLightBlock = function(blk_gn) {
    return matchCond(blk_gn, "light", "blk");
  }
  .setCache();
  exports.isLightBlock = isLightBlock;


  /**
   * Whether this block is an assistance block.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isAssistanceBlock = function(blk_gn) {
    return isProjector(blk_gn) || isRepairer(blk_gn) || isShield(blk_gn);
  }
  .setCache();
  exports.isAssistanceBlock = isAssistanceBlock;


  /**
   * Whether is block is a projector (not mender).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isProjector = function(blk_gn) {
    return matchCond(blk_gn, "projector", "blk");
  }
  .setCache();
  exports.isProjector = isProjector;


  /**
   * Whether this block is a repairer.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isRepairer = function(blk_gn) {
    return matchCond(blk_gn, "repairer", "blk") && !matchTag(blk_gn, "blk-non-mend", "blk");
  }
  .setCache();
  exports.isRepairer = isRepairer;


  /**
   * Whether this block is a shield block.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isShield = function(blk_gn) {
    return matchCond(blk_gn, "shield", "blk");
  }
  .setCache();
  exports.isShield = isShield;


  /**
   * Whether this block is a defense wall.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isDefenseWall = function(blk_gn) {
    return matchCond(blk_gn, "wall", "blk") && !matchTag(blk_gn, "blk-non-wall", "blk");
  }
  .setCache();
  exports.isDefenseWall = isDefenseWall;


  /**
   * Whether this block is a turret.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isTurret = function(blk_gn) {
    return matchCond(blk_gn, "turret", "blk");
  }
  .setCache();
  exports.isTurret = isTurret;


  /* <------------------------------ env ------------------------------ */


  /**
   * Whether this block is a large tree (or mushroom).
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isTreeBlock = function(blk_gn) {
    return matchTag(blk_gn, "env-tree", "blk");
  }
  .setCache();
  exports.isTreeBlock = isTreeBlock;


  /**
   * Whether this block is a tall grass.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isTallGrassBlock = function(blk_gn) {
    return matchTag(blk_gn, "env-grass-tall", "blk");
  }
  .setCache();
  exports.isTallGrassBlock = isTallGrassBlock;


  /**
   * Whether this block is an underground ore.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isDepthOre = function(blk_gn) {
    return matchTag(blk_gn, "env-dpore", "blk");
  }
  .setCache();
  exports.isDepthOre = isDepthOre;


  /**
   * Whether this block is an underground fluid deposit.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isDepthLiquid = function(blk_gn) {
    return matchTag(blk_gn, "env-dpliq", "blk");
  }
  .setCache();
  exports.isDepthLiquid = isDepthLiquid;


  /**
   * Whether this block can be revealed by ore scanners.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const isScannerTarget = function(blk_gn) {
    return isDepthOre(blk_gn) || isDepthLiquid(blk_gn)
  }
  .setCache();
  exports.isScannerTarget = isScannerTarget;


  /* <------------------------------ unit type ------------------------------ */


  /**
   * Whether this unit type is not a robot.
   * @param {UnitTypeGn} utp_gn
   * @return {boolean}
   */
  const isNonRobot = function(utp_gn) {
    let utp = MDL_content.getCt(utp_gn, "utp");
    return utp != null && DB_unit.db["group"]["nonRobot"].includes(utp.name);
  }
  .setCache();
  exports.isNonRobot = isNonRobot;


  /**
   * Whether this unit type or block doesn't create remains upon death.
   * @param {string|Block|UnitType|null} etp_gn
   * @return {boolean}
   */
  const hasNoRemains = function(etp_gn) {
    let etp = MDL_content.getCt(etp_gn, null, true);
    if(etp == null) return false;

    if(etp instanceof Block) {
      return !etp.createRubble
        || etp.instantDeconstruct
        || isCoreBlock(etp)
        || DB_block.db["group"]["noRemainsMod"].includes(MDL_content.getMod(etp))
        || DB_block.db["group"]["noRemains"].includes(etp.name);
    };
    return !etp.createScorch
      || etp instanceof MissileUnitType
      || DB_unit.db["group"]["noRemainsMod"].includes(MDL_content.getMod(etp))
      || DB_unit.db["group"]["noRemains"].includes(etp.name);
  }
  .setCache();
  exports.hasNoRemains = hasNoRemains;


  /* <------------------------------ entity ------------------------------ */


  /**
   * Whether this entity is seen as enemy to given team.
   * @param {TeamcGn} e
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const isEnemy = function(e, team) {
    return LCCheck.checkHostile(e, tryVal(team, null));
  };
  exports.isEnemy = isEnemy;


  /**
   * Whether this entity can be healed.
   * @param {HealthcGn} e
   * @param {Team|unset} [team]
   * @return {boolean}
   */
  const canHeal = function(e, team) {
    return LCCheck.checkHealable(e, tryVal(team, null));
  };
  exports.canHeal = canHeal;


  /**
   * Whether this building is running.
   * @param {Building} b
   * @return {boolean}
   */
  const isBuildingActive = function(b) {
    return b.team !== Team.derelict && b.efficiency > 0.0;
  };
  exports.isBuildingActive = isBuildingActive;


  /**
   * Whether this unit is a loot unit.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isLoot = function(unit) {
    return checkCreatedByTemp(unit.type) && unit.type.ex_isSubInsOf("UNIT_lootUnit");
  };
  exports.isLoot = isLoot;


  /**
   * Whether this loot cannot be taken up now.
   * @param {Unit} loot
   * @return {boolean}
   */
  const isLootProtected = function(loot) {
    return loot.fin() * 2.0 < VAR.time.lootProtection / loot.type.lifetime;
  };
  exports.isLootProtected = isLootProtected;


  /**
   * Whether this unit won't be used in regular iteration.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isIrregularUnit = function(unit) {
    return unit.internal || isLoot(unit);
  };
  exports.isIrregularUnit = isIrregularUnit;


  /**
   * Whether this unit can be covered by trees.
   * @param {Unit} unit
   * @param {boolean|unset} [includeSize]
   * @return {boolean}
   */
  const isUnitCoverable = function(unit, includeSize) {
    return !unit.flying && unit.type.groundLayer < 76.0 && (!includeSize ? true : unit.hitSize <= VAR.range.treeHideMaxRad);
  };
  exports.isUnitCoverable = isUnitCoverable;


  /**
   * Whether this unit is covered by trees.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitCovered = function(unit) {
    return VARGEN.staHiddenWell != null && unit.hasEffect(VARGEN.staHiddenWell);
  };
  exports.isUnitCovered = isUnitCovered;


  /**
   * Whether this unit can be damaged by heat.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isHeatDamageable = function(unit) {
    return !unit.type.naval && isUnitOnFloor(unit)
  };
  exports.isHeatDamageable = isHeatDamageable;


  /**
   * Whether this unit can be affected by liquid floor.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitOnFloor = function(unit) {
    return !unit.flying && (!unit.hovering ? true : !(unit instanceof Legsc));
  };
  exports.isUnitOnFloor = isUnitOnFloor;


  /**
   * Still affected by explosion knockback.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitInLowAir = function(unit) {
    return unit.flying && unit.type.lowAltitude;
  };
  exports.isUnitInLowAir = isUnitInLowAir;


  /**
   * It flies high enough.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitInHighAir = function(unit) {
    return unit.flying && unit.elevation >= VAR.param.highAirElev;
  };
  exports.isUnitInHighAir = isUnitInHighAir;


  /**
   * Whether this unit is moving (not through collision).
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitMoving = function(unit) {
    return unit.vel.len() > (unit.flying ? 0.1 : 0.01);
  };
  exports.isUnitMoving = isUnitMoving;


  /**
   * Whether this unit is boosting up/down.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitBoosting = function(unit) {
    return unit.type.canBoost && unit.elevation > 0.73 && unit.elevation < 1.0;
  };
  exports.isUnitBoosting = isUnitBoosting;


  /**
   * Whether this unit has injured status.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitInjured = function thisFun(unit) {
    return hasAnyEffect(unit, thisFun.injuredStas);
  }
  .setProp({
    injuredStas: [
      "loveclab-sta-slightly-injured",
      "loveclab-sta-injured",
      "loveclab-sta-heavily-injured",
    ],
  });
  exports.isUnitInjured = isUnitInjured;


  /**
   * Whether this unit has damaged status.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitDamaged = function thisFun(unit) {
    return hasAnyEffect(unit, thisFun.damagedStas);
  }
  .setProp({
    damagedStas: [
      "loveclab-sta-damaged",
      "loveclab-sta-severely-damaged",
    ],
  });
  exports.isUnitDamaged = isUnitDamaged;


  /**
   * Whether this unit has any of given status effects.
   * @param {Unit} unit
   * @param {Array<StatusGn>} stas_gn
   * @return {boolean}
   */
  const hasAnyEffect = function(unit, stas_gn) {
    let sta;
    return stas_gn.some(sta_gn => {
      sta = MDL_content.getCt(sta_gn, "sta", true);
      return sta != null && unit.hasEffect(sta);
    });
  };
  exports.hasAnyEffect = hasAnyEffect;


  /**
   * Whether this unit or tile on is HOT, false for buildings.
   * Used for remains.
   * @param {Building|Unit} e
   * @param {Tile|unset} [t]
   * @return {boolean}
   */
  const isHot = function(e, t) {
    return e == null ?
      t != null && isHotStatus(t.floor().status) :
      !(e instanceof Building) && (hasAnyEffect(e, DB_status.db["group"]["hot"]) || isHot(null, e.tileOn()));
  };
  exports.isHot = isHot;


  /**
   * Whether this unit has been soaked in aqueous liquids recently.
   * This may influence something like short circuit.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitWet = function(unit) {
    return hasAnyEffect(unit, DB_status.db["group"]["wet"]);
  };
  exports.isUnitWet = isUnitWet;


  /**
   * Whether this unit has at least one weapon active.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitAttacking = function(unit) {
    return unit.mounts.some(mt => mt.reload > 0.0);
  };
  exports.isUnitAttacking = isUnitAttacking;


  /**
   * Whether this unit is performing any actions.
   * @param {Unit} unit
   * @return {boolean}
   */
  const isUnitActing = function(unit) {
    return isUnitMoving(unit) || isUnitAttacking(unit) || unit.mining() || unit.isBuilding();
  };
  exports.isUnitActing = isUnitActing;


  /* <------------------------------ status effect ------------------------------ */


  /**
   * Whether this status is not a regular status effect.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isNonStatus = function(sta_gn) {
    let sta = MDL_content.getCt(sta_gn, "sta");
    return sta != null && (
      (checkCreatedByTemp(sta) && sta.ex_isSubInsOf("DBCT_databaseContent"))
        || DB_status.db["group"]["nonStatus"].includes(sta.name)
    );
  }
  .setCache();
  exports.isNonStatus = isNonStatus;


  /**
   * Whether this status is related to high temperature.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isHotStatus = function(sta_gn) {
    let sta = MDL_content.getCt(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["hot"].includes(sta.name);
  }
  .setCache();
  exports.isHotStatus = isHotStatus;


  /**
   * Whether this status is related to water.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isWetStatus = function(sta_gn) {
    let sta = MDL_content.getCt(sta_gn, "sta");
    return sta != null && DB_status.db["group"]["wet"].includes(sta.name);
  }
  .setCache();
  exports.isWetStatus = isWetStatus;


  /**
   * Whether this status is a fading (or flickering) status.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isFadeStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-fade", "sta");
  }
  .setCache();
  exports.isFadeStatus = isFadeStatus;


  /**
   * Whether this status is triggered upon unit death.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isDeathStatus = function(sta_gn) {
    return matchTag(sta_gn, "sta-death", "sta");
  }
  .setCache();
  exports.isDeathStatus = isDeathStatus;


  /**
   * Whether this status is a stackable status.
   * @param {StatusGn} sta_gn
   * @return {boolean}
   */
  const isStackStatus = function(sta_gn) {
    let sta = MDL_content.getCt(sta_gn, "sta");
    return sta != null && tryFun(sta.ex_isStackSta, sta, false);
  }
  .setCache();
  exports.isStackStatus = isStackStatus;
