/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent for all ground drills.
   * Ore scanner is required when a drill is mining depth ore.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseDrill");
  const INTF = require("lovec/temp/intf/INTF_BLK_depthOreHandler");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_oreScannerHandler");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.skipDepthOreMethod = !blk.canMineDepthOre;
  };


  function comp_setStats(blk) {
    if(blk.canMineDepthOre) {
      blk.stats.add(fetchStat("lovec", "blk0min-depthmtp"), blk.depthTierMtp.perc(2));
    };
  };


  function comp_canMine(blk, t) {
    if(t == null || t.block().isStatic()) return false;
    let itm = null, isFloorDrop = false;
    if(t.overlay().itemDrop != null) {
      itm = t.overlay().itemDrop;
    } else if(t.floor().itemDrop != null) {
      itm = t.floor().itemDrop;
      isFloorDrop = true;
    };
    if(itm == null) return false;

    if(blk.blockedItems != null && blk.blockedItems.size > 0) {
      if(blk.blockedItems.contains(itm)) return false;
    } else {
      if(blk.itmWhitelist.length > 0 && !blk.itmWhitelist.includes(itm)) return false;
    };

    let isDpore = isFloorDrop ? false : MDL_cond._isDepthOre(t.overlay());
    if(isDpore) {
      if(!blk.canMineDepthOre || blk.ex_calcDropHardness(t.overlay(), itm) > blk.tier * blk.depthTierMtp) return false;
    } else {
      if(blk.ex_calcDropHardness(isFloorDrop ? t.floor() : t.overlay(), itm) > blk.tier) return false;
    };

    return true;
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    MDL_draw.comp_drawPlace_baseBlock(blk, tx, ty, rot, valid);

    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    Reflect.invoke(Drill, blk, "countOre", [t], [Tile]);
    let returnItm = Reflect.get(Drill, blk, "returnItem");
    let returnAmt = Reflect.get(Drill, blk, "returnCount");
    if(returnItm != null) {
      let w = blk.drawPlaceText(Core.bundle.formatFloat("bar.drillspeed", 60.0 / blk.getDrillTime(returnItm) / blk.drillAmtMtp * returnAmt, 2), tx, ty, valid);
      let x = tx.toFCoord(blk.size) - w * 0.5 - 4.0;
      let y = ty.toFCoord(blk.size) + blk.size * Vars.tilesize * 0.5 + 5.0;
      let iconW = Vars.iconSmall * 0.25;

      Draw.mixcol(Color.darkGray, 1.0);
      Draw.rect(blk.ex_findPlaceRsIcon(tx, ty, returnItm), x, y - 1.0, iconW, iconW);
      Draw.reset();
      Draw.rect(blk.ex_findPlaceRsIcon(tx, ty, returnItm), x, y, iconW, iconW);
      if(blk.drawMineItem) {
        Draw.color(returnItm.color);
        Draw.rect(blk.itemRegion, tx.toFCoord(blk.size), ty.toFCoord(blk.size));
        Draw.color();
      };
    } else {
      let ot = t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles"))
      .find(ot1 => ot1.drop() != null && (
        ot1.drop().hardness > blk.tier * (blk.ex_isMiningDpore(tx, ty, ot1.drop()) ? blk.depthTierMtp : 1.0)
          || (blk.blockedItems != null && blk.blockedItems.contains(ot1.drop()))
          || ((blk.blockedItems == null || blk.blockedItems.size === 0) && blk.itmWhitelist.length > 0 && !blk.itmWhitelist.includes(ot1.drop()))
      ));
      let itm = ot == null ? null : ot.drop();
      if(itm != null) blk.drawPlaceText(MDL_bundle._info("lovec", "text-cannot-mine"), tx, ty, valid);
    };
  };


  function comp_onProximityUpdate(b) {
    b.dominantItems = Math.round(b.dominantItems * b.block.delegee.drillAmtMtp);
    b.requiresScanner = b.block.ex_isMiningDpore(b.tileX(), b.tileY(), b.dominantItem);
  };


  function comp_pickedUp(b) {
    b.requiresScanner = false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_baseGroundDrill").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(null)
    .setTags("blk-min", "blk-drl")
    .setParam({
      // @PARAM: Multiplier on how many items outputted each round.
      drillAmtMtp: 1.0,
      // @PARAM: Whether this drill can mine depth ore.
      canMineDepthOre: false,
      // @PARAM: Multiplier on drill tier when mining depth ore.
      depthTierMtp: 0.5,
    })
    .setParamAlias([
      "drillEff", "drillEffect", Fx.none,
      "drillEffP", "drillEffectChance", 1.0,
      "drillEffRad", "drillEffectRnd", 0.0,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      canMine: function(t) {
        return comp_canMine(this, t);
      }
      .setProp({
        noSuper: true,
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getRcDictOutputScl: function() {
        return this.drillAmtMtp;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_baseGroundDrill").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


    }),


  ];
