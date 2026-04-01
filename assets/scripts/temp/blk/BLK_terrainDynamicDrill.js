/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_groundDrill");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        blk.terItmMapMap.each((nmItm, terItmMap) => {
          terItmMap.each((ter, nmRs) => {
            let rs = MDL_content._ct(nmRs, "rs");
            if(rs == null) return;
            MDL_recipeDict.addItmProdTerm(blk, rs, Math.pow(blk.size, 2) * blk.drillTime / blk.getDrillTime(rs), 1.0, {icon: "lovec-icon-mining"});
          });
        });
      });
    });
  };


  function comp_setStats(blk) {
    if(blk.terItmMapMap.size > 0) {
      blk.stats.add(Stat.output, newStatValue(tb => {
        tb.row();
        blk.ex_buildTerrainDynamicOutput(tb);
      }));
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_terrain.comp_drawPlace_ter(blk, tx, ty, rot, valid, 1);
  };


  const comp_ex_findPlaceRsIcon = function thisFun(blk, tx, ty, itm) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return VARGEN.iconRegs.ohno;

    if(checkTupChange(thisFun.tmpTup, true, blk, t, itm)) {
      if(blk.ex_isMiningDpore(tx, ty, itm) && !blk.ex_anyDporeRevealed(tx, ty, itm)) {
        thisFun.tmpTup[3] = VARGEN.iconRegs.questionMark;
      } else {
        let ter = MDL_terrain._ter(t, blk.size);
        let terItmMap = blk.terItmMapMap.get(itm == null ? "null" : itm.name);
        if(terItmMap == null) {
          thisFun.tmpTup[3] = itm.uiIcon;
        } else {
          let rs = MDL_content._ct(terItmMap.get(tryVal(ter, "transition")), "rs");
          thisFun.tmpTup[3] = rs == null ?
            itm.uiIcon :
            rs.uiIcon;
        };
      };
    };

    return thisFun.tmpTup[3];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_buildTerrainDynamicOutput(blk, tb) {
    const contCell = tb.table(Styles.none, tb1 => {}).growX();
    const cont = contCell.get();

    blk.terItmMapMap.each((nmItm, terItmMap) => {
      let itm = MDL_content._ct(nmItm, "rs");
      if(itm == null) return;

      let itmCell = cont.table(Styles.none, tb1 => {}).growX();
      let itmTb = itmCell.get();
      itmCell.row();

      itmTb.add(itm.localizedName).row();
      itmTb.table(Styles.none, tb1 => {
        let matArr = [
          [
            "",
            MDL_bundle._term("lovec", "resource"),
            fetchStat("lovec", "blk-terreq").localized(),
          ],
          [
            itm,
            itm.localizedName,
            "-",
          ],
        ];
        terItmMap.each((ter, nmRs) => {
          let rs = MDL_content._ct(nmRs, "rs");
          if(rs == null) return;
          matArr.push([rs, rs.localizedName, MDL_terrain._terB(ter)]);
        });

        MDL_table._l_table(tb1, matArr);
      }).growX().row();
    });
  };


  function comp_onProximityUpdate(b) {
    b.terCur = MDL_terrain._ter(b.tile, b.block.size);

    let terItmMap = b.block.delegee.terItmMapMap.get(b.dominantItem == null ? "null" : b.dominantItem.name);
    if(terItmMap == null) return;
    let itm = MDL_content._ct(terItmMap.get(tryVal(b.terCur, "transition")), "rs");
    if(itm == null) return;

    b.dominantItem = itm;
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
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: Maps some item (as string) to an object map that maps terrain type to final output.
       * @memberof BLK_terrainDynamicDrill
       * @instance
       */
      terItmMapMap: prov(() => new ObjectMap()),


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
       * @param {Item} itm
       * @return {TextureRegion}
       */
      ex_findPlaceRsIcon: function(tx, ty, itm) {
        return comp_ex_findPlaceRsIcon(this, tx, ty, itm);
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
       * <INTERNAL>
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
