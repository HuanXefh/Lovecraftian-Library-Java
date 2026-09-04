/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_groundDrill");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event.onLoadPost(() => {
      blk.terItemMapMap.each((nameItem, terItemMap) => {
        terItemMap.each((ter, nameRs) => {
          let rs = MDL_content.getCt(nameRs, "rs");
          if(rs == null) return;
          MDL_recipeDict.addItemProdTerm(blk, rs, Math.pow(blk.size, 2) * blk.drillTime / blk.getDrillTime(rs), 1.0, {icon: "lovec-icon-mining"});
        });
      });
    });

    MOD_tmi.regisRc_terrainDynamicDrill(blk, blk.terItemMapMap);
  };


  function comp_setStats(blk) {
    if(blk.terItemMapMap.size > 0) {
      blk.stats.add(Stat.output, newStatValue(tb => {
        tb.row();
        blk.ex_buildTerrainDynamicOutput(tb);
      }));
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_terrain.comp_drawPlace_ter(blk, tx, ty, rot, valid, 1);
  };


  const comp_ex_findPlaceRsIcon = function thisFun(blk, tx, ty, item) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return VARGEN.iconRegs.ohno;

    if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, item)) {
      if(blk.ex_isMiningDpore(tx, ty, item) && !blk.ex_anyDporeRevealed(tx, ty, item)) {
        thisFun.tmpIcon = VARGEN.iconRegs.questionMark;
      } else {
        let ter = MDL_terrain.getTer(t, blk.size);
        let terItemMap = blk.terItemMapMap.get(item == null ? "null" : item.name);
        if(terItemMap == null) {
          thisFun.tmpIcon = item.fullIcon;
        } else {
          let rs = MDL_content.getCt(terItemMap.get(tryVal(ter, "transition")), "rs");
          thisFun.tmpIcon = rs == null ?
            item.fullIcon :
            rs.fullIcon;
        };
      };
    };

    return thisFun.tmpIcon;
  }
  .setProp({
    tmpTup: [],
    tmpIcon: null,
  });


  function comp_ex_buildTerrainDynamicOutput(blk, tb) {
    const contCell = tb.table(Styles.none, tb1 => {}).growX();
    const cont = contCell.get();

    blk.terItemMapMap.each((nameItem, terItemMap) => {
      let item = MDL_content.getCt(nameItem, "rs");
      if(item == null) return;

      let itemCell = cont.table(Styles.none, tb1 => {}).growX();
      let itemTb = itemCell.get();
      itemCell.row();

      itemTb.add(item.localizedName).row();
      itemTb.table(Styles.none, tb1 => {
        let matArr = [
          [
            "",
            MDL_bundle.getTerm("lovec", "resource"),
            fetchStat("lovec", "blk-terreq").localized(),
          ],
          [
            item,
            item.localizedName,
            "-",
          ],
        ];
        terItemMap.each((ter, nameRs) => {
          let rs = MDL_content.getCt(nameRs, "rs");
          if(rs == null) return;
          matArr.push([rs, rs.localizedName, MDL_terrain.getTerB(ter)]);
        });

        MDL_table.setTable(tb1, matArr);
      }).growX().row();
    });
  };


  function comp_onProximityUpdate(b) {
    b.terCur = MDL_terrain.getTer(b.tile, b.block.size);

    let terItemMap = b.block.delegee.terItemMapMap.get(b.dominantItem == null ? "null" : b.dominantItem.name);
    if(terItemMap == null) return;
    let item = MDL_content.getCt(terItemMap.get(tryVal(b.terCur, "transition")), "rs");
    if(item == null) return;

    b.dominantItem = item;
  };


  function comp_pickedUp(b) {
    b.terCur = null;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Drill that outputs variants of some item based on current terrain type.
     * @class BLK_terrainDynamicDrill
     * @extends BLK_groundDrill
     */
    newClass().extendClass(PARENT[0], "BLK_terrainDynamicDrill").initClass()
    .setParent(Drill)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Maps some item (as string) to an object map that maps terrain type to final output.
       * @memberof BLK_terrainDynamicDrill
       * @instance
       * @example
       * ObjectMap.of(
       *   "sand", ObjectMap.of(
       *     "dirt", "copper",
       *     "rock", "lead",
       *   ),
       * );
       */
      terItemMapMap: tprov(() => new ObjectMap()),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_terrainDynamicDrill
       * @instance
       * @param {number} tx
       * @param {number} ty
       * @param {Item} item
       * @return {TextureRegion}
       */
      ex_findPlaceRsIcon: function(tx, ty, item) {
        return comp_ex_findPlaceRsIcon(this, tx, ty, item);
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 3,
      }),


      /**
       * @memberof BLK_terrainDynamicDrill
       * @instance
       * @param {Table} tb
       * @return {void}
       */
      ex_buildTerrainDynamicOutput: function(tb) {
        comp_ex_buildTerrainDynamicOutput(this, tb);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_terrainDynamicDrill
     * @extends B_groundDrill
     */
    newClass().extendClass(PARENT[1], "B_terrainDynamicDrill").initClass()
    .setParent(Drill.DrillBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_terrainDynamicDrill
       * @instance
       */
      terCur: null,


    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


    }),


  ];
