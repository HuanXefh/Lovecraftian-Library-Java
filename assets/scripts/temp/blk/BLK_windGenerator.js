/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_consumeGenerator");
  const INTF = require("lovec/temp/intf/INTF_BLK_sameBlockRestrictionHandler");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_rangeDisplay");


  /* <---------- auxiliary ----------> */


  const POW_PROD_SCL = 1.35;


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.powerProduction *= POW_PROD_SCL;
    blk.blkR = blk.placeRestrictR;
  };


  function comp_load(blk) {
    blk.bladeHitSe = fetchSound(blk.bladeHitSe);
  };


  function comp_setStats(blk) {
    blk.stats.remove(blk.generationType);
    blk.stats.add(blk.generationType, blk.powerProduction / POW_PROD_SCL * 60.0, StatUnit.powerSecond);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-wind-effc", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-wind-effc-amt", b.delegee.windEffc.perc(0))),
      prov(() => Tmp.c1.set(Pal.accent).lerp(Pal.heal, b.delegee.windEffc)),
      () => Mathf.clamp(b.delegee.windEffc, 0.0, 1.0),
    ));
  };


  function comp_created(b) {
    b.totalTime += Mathf.random(300.0);
  };


  function comp_updateTile(b) {
    if(TIMER.secHalf) {
      b.windEffc = MDL_attr.calcSumWind(b.tile, b.block.delegee.windScl, b.block.delegee.minProdEffc, b.block.delegee.posVari);
    };

    if(TIMER.secQuarter && b.block.delegee.bladeTouchRad > 0.0) {
      let hasHit = false;
      LCEntity.eachUnit(b.x, b.y, null, b.block.delegee.bladeTouchRad, ounit => MDL_cond.isUnitInLowAir(ounit) || MDL_cond.isUnitBoosting(ounit), ounit => {
        FRAG_attack.damage(ounit, b.block.delegee.bladeTouchDmg);
        hasHit = true;
      });
      if(hasHit) {
        FRAG_attack.damage(b, b.block.delegee.bladeTouchSelfDmg);
        MDL_sound.playAt(b.x, b.y, b.block.delegee.bladeHitSe);
      };
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_windGenerator
     * @extends BLK_consumeGenerator
     * @extends INTF_BLK_sameBlockRestrictionHandler
     * @extends INTF_BLK_rangeDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_windGenerator").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(ConsumeGenerator)
    .setTags()
    .setParam({


      /**
       * `PARAM`: Scaling on efficiency oscillation.
       * @memberof BLK_windGenerator
       * @instance
       */
      windScl: 1.0,
      /**
       * `PARAM`: Minimum power production efficiency due to oscillation at 100% wind attribute.
       * @memberof BLK_windGenerator
       * @instance
       */
      minProdEffc: 0.3,
      /**
       * `PARAM`: Power production oscillation due to position.
       * @memberof BLK_windGenerator
       * @instance
       */
      posVari: 0.15,
      /**
       * `PARAM`: Radius used for flying unit touch damage. Use a negative number to disable.
       * @memberof BLK_windGenerator
       * @instance
       */
      bladeTouchRad: -1.0,
      /**
       * `PARAM`: Damage dealt to flying units hit by blade.
       * @memberof BLK_windGenerator
       * @instance
       */
      bladeTouchDmg: 120.0,
      /**
       * `PARAM`: Like {@link BLK_windGenerator#bladeTouchDmg} but dealt to the building itself.
       * @memberof BLK_windGenerator
       * @instance
       */
      bladeTouchSelfDmg: 40.0,
      /**
       * `PARAM`: Sound played when a unit is hit by blade.
       * @memberof BLK_windGenerator
       * @instance
       */
      bladeHitSe: Sounds.blockExplode2Alt,
      /**
       * `PARAM`
       * @override
       * @memberof BLK_windGenerator
       * @instance
       */
      overwriteExploParam: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof BLK_windGenerator
       * @instance
       */
      sameTypeFilter: tprov(() => boolf2(function(blk, oblk) {return checkCreatedByTemp(oblk) && oblk.ex_isSubInsOf("BLK_windGenerator")})),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class B_windGenerator
     * @extends B_consumeGenerator
     * @extends INTF_B_sameBlockRestrictionHandler
     * @extends INTF_B_rangeDisplay
     */
    newClass().extendClass(PARENT[1], "B_windGenerator").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(ConsumeGenerator.ConsumeGeneratorBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_windGenerator
       * @instance
       */
      windEffc: 0.0,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      getPowerProduction: function() {
        return this.windEffc;
      }
      .setProp({
        noSuper: true,
        mergeMode: function(valPrev, val) {
          return valPrev * val;
        },
      }),


    }),


  ];
