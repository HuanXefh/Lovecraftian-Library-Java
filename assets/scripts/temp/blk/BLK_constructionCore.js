/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_materialBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;

    blk.ex_parseConstructionData();
    if(blk.placeDataX == null) blk.placeDataX = blk.centerPon2.x;
    if(blk.placeDataY == null) blk.placeDataY = blk.centerPon2.y;

    blk.placeBlk = MDL_content._ct(blk.placeBlk, "blk");
    if(blk.placeBlk == null) ERROR_HANDLER.throw("nullArgument", "placeBlk");
    blk.ex_calcBlksReq(blk.constructionBlksReq);
    blk.ex_calcItmsReq(blk.constructionItmsReq, blk.constructionBlksReq);
    if(!blk.skipTargetSetup) {
      Core.app.post(() => {
        batchCall(blk.placeBlk, function() {
          this.buildVisibility = BuildVisibility.sandboxOnly;
          blk.techNodes.each(node => {
            node.children.add(TechTree.node(this, [], () => {}));
          });
          this.envRequired = blk.envRequired;
          this.envDisabled = blk.envDisabled;
          let itmStacks = [];
          Object._it(blk.constructionItmsReq, (nmItm, amt) => {
            itmStacks.push(new ItemStack(Vars.content.item(nmItm), amt));
          });
          this.requirements = itmStacks;

          MDL_event._c_onLoad(() => {
            // This completely prevents player from building it directly outside of sandbox (e.g. using a schematic)
            this.buildTime = Number.fMax;
          });
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
            EFF.placeFadePack[blk.planSize].at(ot.worldx() + (blk.planSize % 2 === 0 ? 4.0 : 0.0), ot.worldy() + (blk.planSize % 2 === 0 ? 4.0 : 0.0));
            blk.ex_removePlanBlks(b.delegee.constructionPlan);
          };
          break;
      };
    });

    MDL_content.rename(
      blk,
      blk.placeBlk.localizedName + "(" + MDL_bundle._term("lovec", "construction-core") + ")",
    );

    MOD_tmi._r_constructionCore(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-blktg"), newStatValue(tb => {
      tb.row();
      tb.table(Styles.none, tb1 => {
        MDL_table.__break(tb1, 1);
        tb1.table(Tex.whiteui, tb2 => {
          tb2.left().setColor(Pal.darkestGray);
          MDL_table.__margin(tb2);
          MDL_table.__ct(tb2, blk.placeBlk, 48.0);
          tb2.table(Styles.none, tb3 => {}).width(12.0);
          MDL_table.__barV(tb2, Color.darkGray);
          tb2.table(Styles.none, tb3 => {}).width(12.0);
          tb2.table(Styles.none, tb3 => {
            tb3.add(MDL_text._statText(MDL_bundle._term("lovec", "construction-time"), (blk.constructionTimeReq / 3600.0).roundFixed(2), StatUnit.minutes.localized())).left().row();
          }).growX();
        }).growX().row();
        MDL_table.__break(tb1, 1);
      }).growX();
    }));
    blk.stats.add(fetchStat("lovec", "blk0misc-struct"), newStatValue(tb => {
      tb.row();
      blk.ex_buildConstructionPlan(tb);
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
    if(checkTupChange(thisFun.tmpTup, true, blk, tx, ty, rot)) {
      blk.ex_findPlan(blk.constructionTmpPlan, tx, ty, rot);
    };

    blk.ex_drawPlan(Vars.player.team(), blk.constructionTmpPlan);
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_parseConstructionData(blk) {
    let i, iCap = blk.constructionData[0].iCap(), j = 0, jCap = blk.constructionData.iCap(), tup;
    while(j < jCap) {
      blk.constructionParsedData[j] = [];
      i = 0;
      while(i < iCap) {
        tup = blk.constructionData[j][i] instanceof Array ? blk.constructionData[j][i] : [blk.constructionData[j][i], -1];
        let blkTg = tup[0] === "SPEC: this" ? blk : tryVal(MDL_content._ct(tup[0], "blk"), Blocks.air);
        blk.constructionParsedData[j].push({
          blk: blkTg,
          rot: blkTg instanceof RotBlock ? -1 : tryVal(tup[1], -1),
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
      MDL_effect._e_textFade(ot.worldx() + blk.placeBlk.offset, ot.worldy() + blk.placeBlk.offset, MDL_bundle._info("lovec", "construction-complete"), Pal.accent, blk.placeBlk.size * 0.5);
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
          // Near map boundary? Just throw an empty array back
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
        if(obj[itmStack.item.name] === undefined) obj[itmStack.item.name] = 0;
        obj[itmStack.item.name] += itmStack.amount * count;
      });
    });

    return obj;
  };


  function comp_ex_getPlanT(blk, tx, ty, rot, dataX, dataY) {
    return MDL_pos._tCenterRot(
      Vars.world.tile(tx - blk.corePon2.x + dataX, ty + blk.corePon2.y - dataY),
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


  function comp_ex_buildConstructionPlan(blk, tb) {
    let i, iCap = blk.constructionParsedData[0].iCap(), j = 0, jCap = blk.constructionParsedData.iCap(), k, kCap, l, blkCur;
    let matArr = [].setVal(() => [], jCap);
    while(j < jCap) {
      i = 0;
      while(i < iCap) {
        blkCur = blk.constructionParsedData[j][i].blk;
        if(matArr[j][i] != null) {
          i++;
          continue;
        };
        if(blkCur !== Blocks.air && blkCur.size === 1) {
          matArr[j][i] = (function(blkCur) {
            return tb1 => tb1.button(new TextureRegionDrawable(MDL_texture._regBlk(blkCur)), Styles.clearNonei, 32.0, () => VAR.dial_ct3.show(blkCur)).tooltip(blkCur.localizedName, true);
          })(blkCur);
        } else if(blkCur === Blocks.air) {
          k = j;
          while(k < jCap) {
            blkCur = blk.constructionParsedData[k][i].blk;
            if(blkCur !== Blocks.air && blkCur.size !== 1 && blkCur.size === k - j + 1) {
              kCap = k - j;
              k = kCap;
              while(k >= 0) {
                l = kCap;
                while(l >= 0) {
                  matArr[j + k][i + l] = (function(blkCur, k, l) {
                    return tb1 => tb1.button(new TextureRegionDrawable(MDL_texture._regBlkTileCut(blkCur, l, k)), Styles.clearNonei, 32.0, () => VAR.dial_ct3.show(blkCur)).tooltip(blkCur.localizedName, true);
                  })(blkCur, k, l);
                  l--;
                };
                k--;
              };
              break;
            };
            k++;
          };
        };
        i++;
      };
      j++;
    };

    tb.table(Styles.none, tb1 => {
      MDL_table.__break(tb1, 1);
      j = 0;
      while(j < jCap) {
        i = 0;
        while(i < iCap) {
          if(matArr[j][i] != null) {
            matArr[j][i](tb1);
          } else {
            tb1.button(VARGEN.icons.dot, Styles.clearNonei, 32.0, () => {});
          };
          i++;
        };
        tb1.row();
        j++;
      };
      MDL_table.__break(tb1, 1);
    }).left().padLeft(28.0);
  };


  function comp_ex_drawPlan(blk, team, plan) {
    let i = 0, iCap = plan.iCap();
    while(i < iCap) {
      if(plan[i] !== blk && !blk.ex_checkPlanTileComplete(plan[i + 1], plan[i], plan[i + 2], team)) {
        MDL_draw._reg_planPlace(
          plan[i], plan[i + 1],
          plan[i + 2] < 0 ? 0.0 : (plan[i + 2] * 90.0),
          plan[i + 1].getLinkedTilesAs(plan[i], Reflect.get(Block, "tempTiles")).find(ot => ot.solid() || ot.build != null) == null ?
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
      let ot = b.block.ex_getPlanT(b.tileX(), b.tileY(), b.rotation, b.block.delegee.placeDataX, b.block.delegee.placeDataY);
      if(ot != null) {
        b.constructionPlanCx = ot.worldx() + b.block.delegee.placeBlk.offset;
        b.constructionPlanCy = ot.worldy() + b.block.delegee.placeBlk.offset;
      };
    };
  };


  function comp_updateTile(b) {
    if(!PARAM.updateSuppressed && b.underConstruction) {
      if(!Vars.net.client() && b.constructionTimeCur >= b.block.delegee.constructionTimeReq) {
        b.configure("SPEC: complete");
      };
      b.constructionTimeCur += !global.lovecUtil.fun._isSandBox() ? Time.delta : b.block.delegee.constructionTimeReq / 60.0;
      if(!Vars.headless) {
        Vars.control.sound.loop(Sounds.loopBuild, b, 1.3);
      };

      if(!Vars.net.client() && TIMER.secFive) {
        // Deconstruction during construction?
        if(!b.block.ex_checkPlanComplete(b.team, b.constructionPlan)) b.configure("SPEC: stop");
      };
    };
  };


  function comp_draw(b) {
    if(b.underConstruction) {
      MDL_draw._reg_construct(b.constructionPlanCx, b.constructionPlanCy, MDL_texture._regBlk(b.block.delegee.placeBlk), b.ex_getConstructionFrac(), b.drawrot());
    } else {
      if(b.shouldDrawConstructionPlan && Vars.player.team() === b.team) {
        b.block.ex_drawPlan(b.team, b.constructionPlan);
      };
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
    EFF.removeFadePack[b.block.size].at(b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Used to construct a larger building from existing buildings.
     * {@link BLK_constructionCore#constructionData} is where the plan is defined.
     * <br> <NAMEGEN>
     * @class BLK_constructionCore
     * @extends BLK_materialBlock
     * @example
     * // Blocks larger than 1 block unit are treated as 1-sized blocks, with tiles except the center taken by air (can be null)
     * // "SPEC: this" represents the core
     * // -1 for rotation means arbitrary rotation
     * let exampleData = [
     *   [["router", -1], ["router", -1], ["router", -1], ["router", -1]],
     *   [["router", -1], ["air", -1], ["air", -1], ["router", -1]],
     *   [["router", -1], ["distributor", -1], ["air", -1], ["router", -1]],
     *   [["SPEC: this", -1], ["router", -1], ["router", -1], ["router", -1]],
     * ];
     */
    newClass().extendClass(PARENT[0], "BLK_constructionCore").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Definition of structure.
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionData: prov(() => [[]]),
      /**
       * <PARAM>: Target block that is built upon structure completion.
       * @memberof BLK_constructionCore
       * @instance
       */
      placeBlk: null,
      /**
       * <PARAM>: X offset of the target block placement position.
       * @memberof BLK_constructionCore
       * @instance
       */
      placeDataX: null,
      /**
       * <PARAM>: Y offset of the target block placement position.
       * @memberof BLK_constructionCore
       * @instance
       */
      placeDataY: null,
      /**
       * <PARAM>: Rotation offset of the target block placement position.
       * @memberof BLK_constructionCore
       * @instance
       */
      placeOffRot: 0,
      /**
       * <PARAM>: Timer required to complete the construction.
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionTimeReq: 3600.0,
      /**
       * <PARAM>: If true, this block won't modify target block on INIT.
       * @memberof BLK_constructionCore
       * @instance
       */
      skipTargetSetup: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionParsedData: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      centerPon2: prov(() => new Point2()),
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      corePon2: prov(() => new Point2()),
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      planSize: 1,
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionTmpPlan: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionBlksReq: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof BLK_constructionCore
       * @instance
       */
      constructionItmsReq: prov(() => ({})),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @return {void}
       */
      ex_parseConstructionData: function() {
        comp_ex_parseConstructionData(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Places target block at (tx, ty) with given rotation.
       * @memberof BLK_constructionCore
       * @instance
       * @param {Team} team
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {void}
       */
      ex_placePlanTg: function(team, tx, ty, rot) {
        comp_ex_placePlanTg(this, team, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      /**
       * Removes all existing buildings for the plan.
       * @memberof BLK_constructionCore
       * @instance
       * @param {Array<Array>} plan
       * @return {void}
       */
      ex_removePlanBlks: function(plan) {
        comp_ex_removePlanBlks(this, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Gets transformed plan at (tx, ty) with given rotation.
       * @memberof BLK_constructionCore
       * @instance
       * @param {Array<Array>|unset} contPlan
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @return {Array<Array>}
       */
      ex_findPlan: function(contPlan, tx, ty, rot) {
        return comp_ex_findPlan(this, contPlan, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Array|unset} contArr
       * @return {Array} <ROWS>: blk, amt.
       */
      ex_calcBlksReq: function(contArr) {
        return comp_ex_calcBlksReq(this, contArr);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Object|unset} contObj
       * @param {Array} blksReq
       * @return {Object}
       */
      ex_calcItmsReq: function(contObj, blksReq) {
        return comp_ex_calcItmsReq(this, contObj, blksReq);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {number} rot
       * @param {number} dataX
       * @param {number} dataY
       * @return {Tile|null}
       */
      ex_getPlanT: function(tx, ty, rot, dataX, dataY) {
        return comp_ex_getPlanT(this, tx, ty, rot, dataX, dataY);
      }
      .setProp({
        noSuper: true,
        argLen: 5,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {number} rot
       * @param {number} dataX
       * @param {number} dataY
       * @return {number}
       */
      ex_getPlanRot: function(rot, dataX, dataY) {
        return comp_ex_getPlanRot(this, rot, dataX, dataY);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Team} team
       * @param {Array<Array>} plan
       * @return {boolean}
       */
      ex_checkPlanComplete: function(team, plan) {
        return comp_ex_checkPlanComplete(this, team, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Tile} t
       * @param {Block} oblk
       * @param {number} rot
       * @param {Team} team
       * @return {boolean}
       */
      ex_checkPlanTileComplete: function(t, oblk, rot, team) {
        return comp_ex_checkPlanTileComplete(this, t, oblk, rot, team);
      }
      .setProp({
        noSuper: true,
        argLen: 4,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Table} tb
       * @return {void}
       */
      ex_buildConstructionPlan: function(tb) {
        comp_ex_buildConstructionPlan(this, tb);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof BLK_constructionCore
       * @instance
       * @param {Team} team
       * @param {Array<Array>} plan
       * @return {void}
       */
      ex_drawPlan: function(team, plan) {
        comp_ex_drawPlan(this, team, plan);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    /**
     * @class B_constructionCore
     * @extends B_materialBlock
     */
    newClass().extendClass(PARENT[1], "B_constructionCore").initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      lastRot: -1,
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      constructionPlan: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      constructionPlanCx: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      constructionPlanCy: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      shouldDrawConstructionPlan: false,
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
      underConstruction: false,
      /**
       * <INTERNAL>
       * @memberof B_constructionCore
       * @instance
       */
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


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        wr.bool(this.underConstruction);
        wr.f(this.constructionTimeCur);
      },


      read: function(rd, revi) {
        this.underConstruction = rd.bool();
        this.constructionTimeCur = rd.f();
      },


      /**
       * @memberof B_constructionCore
       * @instance
       * @return {void}
       */
      ex_stopConstruction: function() {
        comp_ex_stopConstruction(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_constructionCore
       * @instance
       * @return {number}
       */
      ex_getConstructionFrac: function() {
        return Mathf.clamp(this.constructionTimeCur / this.block.delegee.constructionTimeReq);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
