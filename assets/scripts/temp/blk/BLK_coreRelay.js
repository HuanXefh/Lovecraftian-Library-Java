/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_container");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk-cd"), blk.coreSendCooldown / 60.0, StatUnit.seconds);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-cd", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-cd-amt", Strings.fixed(b.delegee.coreSendCd / 60.0, 1) + " " + StatUnit.seconds.localized())),
      prov(() => Pal.ammo),
      () => (blk.coreSendCooldown - b.delegee.coreSendCd) / blk.coreSendCooldown,
    ));
  };


  function comp_created(b) {
    b.coreSendCd = Mathf.random(b.block.delegee.coreSendCooldown);
  };


  function comp_updateTile(b) {
    if(b.coreCur == null || !b.coreCur.isAdded()) {
      if(TIMER.secTwo) b.coreCur = b.closestCore();
      return;
    };

    b.coreSendCd = Mathf.maxZero(b.coreSendCd - b.edelta());
    if(b.coreSendCd < 0.0001 && b.items.total() >= b.block.itemCapacity) {
      b.coreSendCd += b.block.delegee.coreSendCooldown;
      let amt;
      b.items.each(itm => {
        amt = b.coreCur.acceptStack(itm, b.items.get(itm), b);
        if(amt > 0) {
          b.coreCur.handleStack(itm, amt, b);
          MDL_effect._e_line(b.x, b.y, null, b.coreCur, itm.color, 1.5);
          MDL_effect._e_line(b.coreCur.x, b.coreCur.y, null, b, itm.color, 1.5);
          Fx.dynamicWave.at(b.x, b.y, b.block.size * Vars.tilesize * 0.75, itm.color);
          Fx.dynamicWave.at(b.coreCur.x, b.coreCur.y, b.coreCur.block.size * Vars.tilesize * 0.75, itm.color);
        };
        b.items.remove(itm, amt);
      });
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A container that actively puts items into nearest core.
     * @class BLK_coreRelay
     * @extends BLK_container
     */
    newClass().extendClass(PARENT[0], "BLK_coreRelay").initClass()
    .setParent(StorageBlock)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Cooldown between each round.
       * @memberof BLK_coreRelay
       * @instance
       */
      coreSendCooldown: 300.0,


      /* <------------------------------ vanilla ------------------------------ */


      separateItemCapacity: false,


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


    }),


    /**
     * @class B_coreRelay
     * @extends B_container
     */
    newClass().extendClass(PARENT[1], "B_coreRelay").initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_coreRelay
       * @instance
       */
      coreSendCd: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_coreRelay
       * @instance
       */
      coreCur: null,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
