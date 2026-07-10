/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * For rendering.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ auxiliary ------------------------------ */


  let
    i,
    iCap,
    x,
    y,
    z,
    vec,
    rot,
    cond,
    t,
    ot,
    b,
    bPlayer,
    unitPlayer,
    pay,
    wp,
    mtIds,
    noiseArgs = null,
    tex;


  /* <------------------------------ base ------------------------------ */


  function showFadeIn() {
    if(Vars.headless) return;

    MDL_ui._d_fade(0.0, Color.black, 0.0, 2.0, 0.5);
  };


  const drawDebug = function thisFun() {
    if(!PARAM.ENABLE_TEST_DRAW) return;

    unitPlayer = Vars.player.unit();

    if(unitPlayer != null) {
      // Draw surrounding range
      MDL_pos._tsDstManh(thisFun.tmpTs, unitPlayer.tileOn(), VAR.range.unitSurR).forEachFast(ot => MDL_draw._d_areaShrink(ot, 1, Pal.accent, 0.5, VAR.layer.debugFlr));
    };
  }
  .setProp({
    tmpTs: [],
  });


  /* <------------------------------ info ------------------------------ */


  function drawInfo() {
    if(!Vars.ui.hudfrag.shown) return;

    drawUnitStat();
    drawBuildStat();
    drawExtraInfo();
  };


  function drawUnitStat() {
    Groups.unit.each(
      unit => !(
        (!LCCheck.checkEntityVisible(unit) || MDL_cond._isIrregularUnit(unit))
          || ((!unit.isPlayer() || !PARAM.SHOULD_DRAW_PLAYER_STAT) && !unit.isMissile() && PARAM.SHOULD_DRAW_UNIT_STAT_NEAR_MOUSE && Mathf.dst(Core.input.mouseWorldX(), Core.input.mouseWorldY(), unit.x, unit.y) > VAR.range.mouseRad + unit.hitSize * 0.5)
          || (unit.isMissile() && !PARAM.SHOULD_DRAW_MISSILE_STAT)
          || (!unit.type.logicControllable && !unit.type.playerControllable && unit.type.hidden && !unit.type.drawCell && !unit.isMissile())
      ),
      unit => {
        // Unit range display
        if(PARAM.SHOULD_DRAW_UNIT_RANGE && (VARGEN.staHiddenWell == null || !unit.hasEffect(VARGEN.staHiddenWell))) {
          z = Draw.z();
          Draw.z(VAR.layer.unitRange);

          rot = unit.rotation - 90.0;
          cond = false;
          unit.mounts.forEachFast(mt => {
            wp = mt.weapon;
            // Probably not a weapon
            if(wp.alwaysShooting) return;
            if(wp.shootCone > 0.0 && wp.shootCone < 179.99) {
              // Regular weapon
              cond = true;
              x = unit.x + Angles.trnsx(rot, wp.x, wp.y);
              y = unit.y + Angles.trnsy(rot, wp.x, wp.y);
              Draw.color(
                wp instanceof RepairBeamWeapon ?
                  Pal.heal :
                  wp instanceof PointDefenseWeapon || wp instanceof PointDefenseBulletWeapon ?
                    Pal.techBlue :
                    wp.noAttack ?
                      Color.white :
                      unit.team.color,
                PARAM.UNIT_RANGE_ALPHA,
              );
              Fill.arc(x, y, wp.range(), wp.shootCone / 180.0, rot + mt.rotation + 90.0 - wp.shootCone);
            } else if(
              wp.bullet instanceof BombBulletType
                || (wp.bullet.speed < 2.0 && !wp.bullet.collides && wp.bullet.splashDamage > 0.0)
            ) {
              // Bomb weapon
              cond = true;
              Draw.color(unit.team.color, 0.1);
              Fill.arc(unit.x, unit.y, wp.bullet.splashDamageRadius, 0.25, Time.globalTime * 3.0);
              Fill.arc(unit.x, unit.y, wp.bullet.splashDamageRadius, 0.25, Time.globalTime * 3.0 + 180.0);
              Lines.stroke(1.0);
              Draw.color(Pal.accent, PARAM.UNIT_RANGE_ALPHA);
              LCDraw.circle(unit.x, unit.y, wp.bullet.splashDamageRadius, false);
            };
          });
          if(!cond) {
            Lines.stroke(1.0);
            Draw.color(Pal.accent, PARAM.UNIT_RANGE_ALPHA);
            LCDraw.circle(unit.x, unit.y, unit.range(), false);
          };
          Draw.reset();

          Draw.z(z);
        };

        if(!PARAM.SHOULD_DRAW_UNIT_STAT) return;

        // Unit stat display
        MDL_draw._d_unitStat(
          unit, MDL_entity._healthFrac(unit), unit.type.hitSize / Vars.tilesize, unit.team.color,
          1.0, 0.0, 0, 1.0,
          MDL_entity._armor(unit), unit.shield, unit.speedMultiplier, unit.damageMultiplier * unit.reloadMultiplier,
        );

        // Unit reload display
        if(PARAM.SHOULD_DRAW_UNIT_RELOAD) {
          for(let i = 0; i < 3; i++) {
            mtIds = DB_HANDLER.read("utp-reload-ind-" + i, unit.type.name, null);
            if(mtIds == null) continue;
            MDL_draw._d_reload(unit, mtIds, Pal.techBlue, 1.0, 0.0, i, null);
          };
        };

        // Payload placement display
        if(PARAM.SHOULD_DRAW_UNIT_RANGE && unit.payloads != null) {
          pay = unit.payloads.size === 0 ? null : unit.payloads.peek();
          if(pay != null && pay instanceof BuildPayload) {
            ot = Vars.world.tileWorld(unit.x - pay.block().offset, unit.y - pay.block().offset);
            if(ot != null) {
              z = Draw.z();
              Draw.z(VAR.layer.effHigh + 1.5);

              Draw.color(
                Build.validPlace(pay.block(), unit.team, ot.x, ot.y, pay.build.rotation, false) ?
                  Pal.items :
                  ot.build != null && ot.build.acceptPayload(ot.build, pay) ?
                    Pal.techBlue :
                    Pal.remove,
                0.5,
              );
              Fill.rect(ot.worldx() + pay.block().offset, ot.worldy() + pay.block().offset, pay.block().size * Vars.tilesize, pay.block().size * Vars.tilesize);
              Draw.color();

              Draw.z(z);
            };
          };
        };
      },
    );
  };


  const drawBuildStat = function thisFun() {
    t = MDL_pos._tMouse();
    b = t == null ? null : t.build;
    unitPlayer = Vars.player.unit();
    bPlayer = (unitPlayer == null || !(unitPlayer instanceof BlockUnitc)) ? null : unitPlayer.tile();

    // Draw player building
    if(bPlayer != null && PARAM.SHOULD_DRAW_PLAYER_STAT) {
      thisFun.drawBaseBuildStats(bPlayer);
    };

    // Draw mouse building if not player
    if(b != null && !b.block.privileged && b.team !== Team.derelict && (!PARAM.SHOULD_DRAW_PLAYER_STAT || b !== bPlayer)) {
      thisFun.drawBaseBuildStats(b);

      if(b.team !== Vars.player.team()) return;

      z = Draw.z();
      Draw.z(Layer.overlayUI);

      // Draw bridge transportation
      if(b.block instanceof ItemBridge || b.block instanceof DirectionBridge) {
        MDL_draw.drawBridgeLine(b);
      };

      Draw.z(z);
    };
  }
  .setProp({
    drawBaseBuildStats: b => {
      if(PARAM.SHOULD_DRAW_UNIT_RANGE && b.block instanceof Turret && b.block.shootCone > 0.0 && b.block.shootCone < 179.99) {
        z = Draw.z();
        Draw.z(VAR.layer.unitRange);
        Draw.color(b.team.color, PARAM.UNIT_RANGE_ALPHA);
        Fill.arc(b.x, b.y, b.range() + b.block.shootY, b.block.shootCone / 180.0, b.rotation - b.block.shootCone);
        Draw.reset();
        Draw.z(z);
      };

      if(!PARAM.SHOULD_DRAW_UNIT_STAT || !PARAM.SHOULD_DRAW_BUILD_STAT) return;

      MDL_draw._d_unitStat(
        b, b.health / b.maxHealth, b.block.size, b.team.color,
        1.0, 0.0, -1 + VAR.range.offBuildStatR, 1.0, b.block.armor,
        MDL_entity._bShield(b), MDL_entity._bSpd(b), null,
      );
      if(PARAM.SHOULD_DRAW_UNIT_RELOAD) {
        cond = b.ex_getReloadFrac != null || DB_block.db["class"]["group"]["reload"]["class"].hasIns(b.block) || DB_HANDLER.read("blk-reload", b.block.name, false);
        if(cond) {
          MDL_draw._d_reload(b, null, Pal.techBlue, 1.0, -16.0, -1.25 + VAR.range.offBuildStatR, MDL_entity._reloadFrac(b));
        };
        MDL_draw._d_reload(b, null, Pal.accent, 1.0, -16.0, (cond ? -0.25 : -1.25) + VAR.range.offBuildStatR, MDL_entity._warmupFrac(b, true));
      };
      processZ(VAR.layer.debugTop - 0.02, 2);
      Lines.stroke(1.0);
      Draw.color(Pal.accent, 0.3);
      LCDraw.rect(b.x, b.y, VAR.range.offBuildStatR, b.block.size, false);
      Draw.reset();
      processZ(null, 2);
    },
  });


  function drawExtraInfo() {
    if(!PARAM.SHOULD_SHOW_EXTRA_INFO) return;

    MDL_draw.drawExtraInfo(MDL_pos._tMouse());
  };


  function drawUi() {
    processZ(Layer.max - 0.1, 2);

    unitPlayer = Vars.player.unit();
    vec = Core.input.mouseWorld();

    if(PARAM.IS_TELEPORTING && unitPlayer != null) {
      Drawf.target(vec.x, vec.y, 6.0, 1.0, unitPlayer.canPass(vec.x.toIntCoord(), vec.y.toIntCoord()) ? Pal.accent : Pal.remove);
    };

    processZ(null, 2);
  };


  /* <------------------------------ noise ------------------------------ */


  function updateNoiseArgs() {
    if(Vars.headless) return;

    noiseArgs = DB_env.db["param"]["map"]["noise"].read(PARAM.MAP_CURRENT, null);
  };


  function drawNoise() {
    if(Vars.state.isMenu() || Vars.state.isEditor() || noiseArgs == null || !Core.settings.getBool("showweather", true)) return;
    tex = VARGEN.noiseTexs[noiseArgs[0]];
    if(tex == null) return;

    processZ(Layer.weather - 0.9, 3);

    i = 0;
    iCap = noiseArgs.iCap();
    while(i < iCap) {
      Weather.drawNoise(tex, noiseArgs[i + 1], noiseArgs[i + 2], noiseArgs[i + 3], noiseArgs[i + 4], noiseArgs[i + 5], noiseArgs[i + 6], noiseArgs[i + 7], noiseArgs[i + 8]);
      i += 9;
    };
    Draw.reset();

    processZ(null, 3);
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  TRIGGER.gameLoad.addGlobalListener(() => {

    showFadeIn();

    Time.run(VAR.delay.gameLoad.setNoise, () => {
      updateNoiseArgs();
    });

  });




  MDL_event._c_onDraw(() => {

    drawDebug();
    drawInfo();
    drawNoise();

    if(DRAW_TEST != null && DRAW_TEST.enabled) {
      DRAW_TEST.draw();
    };

    drawUi();

  });
