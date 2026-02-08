/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Used to construct a larger building from existing buildings.
   *
   * {constructionData} is where the plan is defined.
   * Example data:
   * [
   *   [["router", -1], ["router", -1], ["router", -1], ["router", -1]],
   *   [["router", -1], ["air", -1], ["air", -1], ["router", -1]],
   *   [["router", -1], ["distributor", -1], ["air", -1], ["router", -1]],
   *   [["router-core", -1], ["router", -1], ["router", -1], ["router", -1]],
   * ]
   * As seen above, blocks with size larger than 1 are treated as 1-sized block with tiles except the center taken by air.
   * The -1 is for rotation, where -1 means arbitrary rotation. For {RotBlock} the value is forced to be -1!
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  // TODO: Test.


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_materialBlock");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_text = require("lovec/mdl/MDL_text");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_parseConstructionData();
    if(blk.placeDataX < 0) blk.placeDataX = blk.centerPon2.x;
    if(blk.placeDataY < 0) blk.placeDataY = blk.centerPon2.y;

    blk.placeBlk = MDL_content._ct(blk.placeBlk, "blk");
    if(blk.placeBlk == null) ERROR_HANDLER.throw("nullArgument", "placeBlk");
    blk.ex_calcBlksReq(blk.constructionBlksReq);
    blk.ex_calcItmsReq(blk.constructionItmsReq, blk.constructionBlksReq);
    if(!blk.skipTargetSetup) {
      Core.app.post(() => {
        batchCall(blk.placeBlk, function() {
          this.buildVisibility = BuildVisibility.sandboxOnly;
          let itmStacks = [];
          Object._it(blk.constructionItmsReq, (itm, amt) => {
            itmStacks.push(new ItemStack(itm, amt));
          });
          this.requirements = itmStacks;
          // This completely prevents you from building it directly outside of sandbox (e.g. using a schematic)
          this.buildTime = Number.fMax;
        });
      });
    };

    blk.configurable = true;
    blk.group = BlockGroup.none;

    blk.config(JAVA.boolean, (b, bool) => {
      b.delegee.shouldDrawConstructionPlan = bool;
    });
    blk.config(JAVA.string, (b, str) => {
      switch(str) {
        case "SPEC: click" :
          b.delegee.underConstruction ?
            b.configure("SPEC: stop") :
            b.configure("SPEC: start");
          break;
        case "SPEC: start" :
          b.delegee.underConstruction = true;
          break;
        case "SPEC: stop" :
          b.ex_stopConstruction();
          break;
        case "SPEC: complete" :
          if(!b.block.ex_checkPlanComplete(b.team, b.delegee.constructionPlan)) {
            b.ex_stopConstruction();
          } else {
            Time.run(1.0, () => {
              blk.ex_placePlanTg(b.team, b.tileX(), b.tileY(), b.rotation);
            });
            let ot = blk.ex_getPlanT(b.tileX(), b.tileY(), b.rotation, blk.centerPon2.x, blk.centerPon2.y);
            EFF.squareFadePack[blk.planSize].at(ot.worldx() + blk.planSize % 2 === 0 ? 4.0 : 0.0, ot.worldy() + blk.planSize % 2 === 0 ? 4.0 : 0.0);
            blk.ex_removePlanBlks(b.delegee.constructionPlan);
          };
          break;
      };
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-blktg"), newStatValue(tb => {
      tb.row();
      tb.table(Tex.whiteui, tb1 => {
        tb1.left().setColor(Pal.darkestGray);
        MDL_table.__margin(tb1);
        MDL_table.__ct(tb1, blk.placeBlk, 48.0);
        tb1.table(Styles.none, tb2 => {}).width(12.0);
        MDL_table.__barV(tb1, Color.darkGray);
        tb1.table(Styles.none, tb2 => {}).width(12.0);
        tb1.table(Styles.none, tb2 => {
          tb2.add(MDL_text._statText(MDL_bundle._term("lovec", "construction-time"), (blk.constructionTimeReq / 3600.0).roundFixed(2), StatUnit.minutes.localized())).left().row();
        }).growX();
      }).growX();
    }));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-prog", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-prog-amt", b.ex_getConstructionFrac().perc(0))),
      prov(() => Pal.ammo),
      () => b.ex_getConstructionFrac(),
    ));
  };


  const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
    if(Array.someMismatch(thisFun.tmpTup, true, blk, tx, ty, rot)) {
      blk.ex_findPlan(blk.constructionTmpPlan, tx, ty, rot);
    };

    blk.ex_drawPlan(Vars.player.team(), blk.constructionTmpPlan);
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_parseConstructionData(blk) {
    let i, icap = blk.constructionData[0].iCap(), j = 0, jCap = blk.constructionData.iCap();
    while(j < jCap) {
      blk.constructionParsedData[j] = [];
      i = 0;
      while(i < iCap) {
        let blkTg = tryVal(MDL_content._ct(blk.constructionData[j][i][0], "blk"), Blocks.air);
        blk.constructionParsedData[j].push({
          blk: blkTg,
          rot: blkTg instanceof RotBlock ? -1 : tryVal(blk.constructionData[j][i][1], -1),
        });
        if(blkTg === blk) blk.corePon2.set(i, j);
        i++;
      };
      j++;
    };

    blk.centerPon2.set(
      iCap % 2 === 0 ? (iCap / 2 - 1) : ((iCap - 1) / 2),
      jCap % 2 === 0 ? (jCap / 2) : ((jCap - 1) / 2),
    );
    blk.planSize = Math.max(iCap, jCap);
  };


  function comp_ex_placePlanTg(blk, team, tx, ty, rot) {
    let ot = blk.ex_getPlanT(tx, ty, rot, blk.placeDataX, blk.placeDataY);
    if(ot != null) {
      ot.setBlock(blk.placeBlk, team, Mathf.mod(rot + blk.placeOffRot, 4));
    };
  };


  function comp_ex_removePlanBlks(blk, plan) {
    let i = 0, iCap = plan.iCap();
    while(i < iCap) {
      plan[i + 1].setBlock(Blocks.air);
      i += 3;
    };
  };


  function comp_ex_findPlan(blk, contPlan, tx, ty, rot) {
    const arr = contPlan != null ? contPlan.clear() : [];

    let i, iCap = blk.constructionParsedData[0].iCap(), j = 0, jCap = blk.constructionParsedData.iCap();
    while(j < jCap) {
      i = 0;
      while(i < iCap) {
        let ot = blk.ex_getPlanT(tx, ty, rot, i, j);
        if(ot == null) {
          // Near map boundry? Just throw an empty array back
          arr.clear();
          return arr;
        } else if(blk.constructionParsedData[j][i].blk !== Blocks.air) {
          // Air is filtered out for faster calculation
          arr.push(blk.constructionParsedData[j][i].blk, ot, blk.ex_getPlanRot(rot, i, j));
        };
        i++;
      };
      j++;
    };

    return arr;
  };


  const comp_ex_calcBlksReq = function thisFun(blk, contArr) {
    const arr = contArr != null ? contArr.clear() : [];

    thisFun.tmpArr.clear();
    let i, iCap = blk.constructionParsedData[0].iCap(), j = 0, jCap = blk.constructionParsedData.iCap();
    while(j < jCap) {
      i = 0;
      while(i < iCap) {
        thisFun.tmpArr.pushUnique(blk.constructionParsedData[j][i].blk);
        i++;
      };
      j++;
    };
    thisFun.tmpArr.inSituFilter(oblk => oblk !== Blocks.air).forEachFast(oblk => {
      let count = 0;
      j = 0;
      while(j < jCap) {
        i = 0;
        while(i < iCap) {
          if(blk.constructionParsedData[j][i].blk === oblk) count++;
          i++;
        };
        j++;
      };
      arr.push(oblk, count);
    });

    return arr;
  }
  .setProp({
    tmpArr: [],
  });


  function comp_ex_calcItmsReq(blk, contObj, blksReq) {
    // I'm using an object cauz adding numbers is torturous when using a formatted array
    const obj = contObj != null ? Object.clear(contObj) : {};

    blksReq = tryVal(blksReq, blk.ex_calcBlksReq(null));
    blksReq.forEachRow(2, (oblk, count) => {
      oblk.requirements.forEachFast(itmStack => {
        if(obj[itmStack.item] === undefined) obj[itmStack.item] = 0;
        obj[itmStack.item] += itmStack.amount * count;
      });
    });

    return obj;
  };


  function comp_ex_getPlanT(blk, tx, ty, rot, dataX, dataY) {
    thisFun.tmpTup.clear();

    MDL_pos._tCenterRot(
      Vars.world.tile(tx - corePon2.x + dataX, ty + corePon2.y - dataY),
      Vars.world.tile(tx, ty),
      rot,
      blk.constructionParsedData[dataY][dataX].blk.size,
      blk.size,
    );
  };


  function comp_ex_getPlanRot(blk, rot, dataX, dataY) {
    let orot = blk.constructionParsedData[dataY][dataX].rot;
    return orot < 0 ?
      orot :
      Mathf.mod(orot + rot, 4);
  };


  function comp_ex_checkPlanComplete(blk, team, plan) {
    let i = 0, iCap = plan.iCap();
    if(iCap === 0) return false;
    while(i < iCap) {
      if(!blk.ex_checkPlanTileComplete(plan[i + 1], plan[i], plan[i + 2], team)) return false;
      i += 3;
    };

    return true;
  };


  function comp_ex_checkPlanTileComplete(blk, t, oblk, rot, team) {
    return t.build != null && t.build.block === oblk && t.build.team === team && (
      rot < 0 ?
        true :
        t.build.rotation === rot
    );
  };


  function comp_ex_drawPlan(blk, team, plan) {
    let i = 0, iCap = plan.iCap();
    while(i < iCap) {
      if(plan[i] !== blk && !blk.ex_checkPlanTileComplete(plan[i + 1], plan[i], plan[i + 2], tean)) {
        MDL_draw._reg_planPlace(
          plan[i], plan[i + 1],
          plan[i].getLinkedTilesAs(plan[i], Reflect.get(Block, "tempTiles")).find(ot => ot.solid() || ot.build != null) == null ?
            Color.white :
            Pal.remove,
        );
      };
      i += 3;
    };
  };


  function comp_onProximityUpdate(b) {
    if(b.lastRot !== b.rotation) {
      b.lastRot = b.rotation;
      b.block.ex_findPlan(b.constructionPlan, b.tileX(), b.tileY(), b.rotation);
    };
  };


  function comp_updateTile(b) {
    if(!PARAM.updateSuppressed && b.underConstruction) {
      if(!Vars.net.client() && b.constructionTimeCur >= b.block.delegee.constructionTimeReq) {
        b.configure("SPEC: complete");
      };
      b.constructionTimeCur += Time.delta;

      if(!Vars.net.client() && TIMER.secFive) {
        // Destruction during construction?
        if(!b.block.ex_checkPlanComplete(b.team, b.constructionPlan)) b.configure("stop");
      };
    };
  };


  function comp_draw(b) {
    if(b.shouldDrawConstructionPlan && Vars.player.team() === b.team) {
      b.block.ex_drawPlan(b.team, b.constructionPlan);
    };
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    MDL_table.__btnCfgToggle(tb, b, Icon.eyeOffSmall, Icon.eyeSmall, b.shouldDrawConstructionPlan).tooltip(MDL_bundle._term("lovec", "toggle-display"), true);
    b.underConstruction ?
       MDL_table.__btnCfg(tb, b, () => {
         b.configure("SPEC: stop");
         b.deselect();
       }, VARGEN.icons.cross).tooltip(MDL_bundle._term("lovec", "construction-stop"), true) :
       MDL_table.__btnCfg(tb, b, () => {
         if(!b.block.ex_checkPlanComplete(b.team, b.constructionPlan)) {
           MDL_ui.show_fadeInfo("lovec", "structure-incomplete");
           return;
         };
         b.configure("SPEC: start");
         b.deselect();
       }, VARGEN.icons.check).tooltip(MDL_bundle._term("lovec", "construction-start"), true);
  };


  function comp_ex_stopConstruction(b) {
    b.underConstruction = false;
    b.constructionTimeCur = 0.0;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({
      // @PARAM: Used to define the buildings required and their position.
      constructionData: prov(() => [[]]),
      // @PARAM: The target block built upon completion.
      placeBlk: null,
      // @PARAM: Determines where the target block is placed upon completion. Use negative values for automatic calculation.
      placeDataX: -1, placeDataY: -1,
      // @PARAM: Offset on the rotation of target block placed upon completion.
      placeOffRot: 0,
      // @PARAM: Time required to complete the construction.
      constructionTimeReq: 3600.0,
      // @PARAM: If {true}, this block won't modify target block in {init}.
      skipTargetSetup: false,

      constructionParsedData: prov(() => []),
      centerPon2: prov(() => new Point2()),
      corePon2: prov(() => new Point2()),
      planSize: 1,
      constructionTmpPlan: prov(() => []),
      constructionBlksReq: prov(() => []),
      constructionItmsReq: prov(() => ({})),
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      ex_parseConstructionData: function() {
        comp_ex_parseConstructionData(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_placePlanTg: function(team, tx, ty, rot) {
        comp_ex_placePlanTg(this, team, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      ex_removePlanBlks: function(plan) {
        comp_ex_removePlanBlks(this, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_findPlan: function(contPlan, tx, ty, rot) {
        return comp_ex_findPlan(this, contPlan, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      ex_calcBlksReq: function(contArr) {
        return comp_ex_calcBlksReq(this, contArr);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcItmsReq: function(contObj, blksReq) {
        return comp_ex_calcItmsReq(this, contObj, blksReq);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      ex_getPlanT: function(tx, ty, rot, dataX, dataY) {
        return comp_ex_getPlanT(this, tx, ty, rot, dataX, dataY);
      }
      .setProp({
        noSuper: true,
        argLen: 5,
      }),


      ex_getPlanRot: function(rot, dataX, dataY) {
        return comp_ex_getPlanRot(this, rot, dataX, dataY);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      ex_checkPlanComplete: function(team, plan) {
        return comp_ex_checkPlanComplete(this, team, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_checkPlanTileComplete: function(t, oblk, rot, team) {
        return comp_ex_checkPlanTileComplete(this, t, oblk, rot, team);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      ex_drawPlan: function(team, plan) {
        comp_ex_drawPlan(this, team, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Wall.WallBuild)
    .setParam({
      lastRot: -1,
      constructionPlan: prov(() => []),
      shouldDrawConstructionPlan: false,
      underConstruction: false,
      constructionTimeCur: 0.0,
    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      status: function() {
        return !this.enabled ?
          BlockStatus.logicDisable :
          this.underConstruction ?
            BlockStatus.active :
            BlockStatus.noInput;
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        wr.bool(this.underConstruction);
        wr.f(this.constructionTimeCur);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.underConstruction = rd.bool();
        this.constructionTimeCur = rd.f();
      },


      ex_stopConstruction: function() {
        comp_ex_stopConstruction(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getConstructionFrac: function() {
        return Mathf.clamp(this.constructionTimeCur / this.block.delegee.constructionTimeReq);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
