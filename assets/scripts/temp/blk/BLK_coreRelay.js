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
    blk.stats.add(fetchStat("lovec", "blk-cd"), blk.itmSendCooldown / 60.0, StatUnit.seconds);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-cd", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-cd-amt", Strings.fixed(b.delegee.itmSendCd / 60.0, 1) + " " + StatUnit.seconds.localized())),
      prov(() => Pal.ammo),
      () => (blk.itmSendCooldown - b.delegee.itmSendCd) / blk.itmSendCooldown,
    ));
  };


  function comp_created(b) {
    b.itmSendCd = Mathf.random(b.block.delegee.itmSendCooldown);
  };


  function comp_updateTile(b) {
    if(TIMER.secTwo) b.sendBCur = b.ex_findSendB();
    if(b.sendBCur == null || !b.sendBCur.isAdded()) return

    b.itmSendCd = Mathf.maxZero(b.itmSendCd - b.edelta());
    if(b.itmSendCd < 0.0001 && b.items.total() >= b.block.itemCapacity) {
      b.itmSendCd += b.block.delegee.itmSendCooldown;
      let amt;
      b.items.each(itm => {
        amt = b.sendBCur.acceptStack(itm, b.items.get(itm), b);
        if(amt > 0) {
          b.sendBCur.handleStack(itm, amt, b);
          MDL_effect._e_line(b.x, b.y, null, b.sendBCur, itm.color, 1.5, true, false);
          MDL_effect._e_line(b.sendBCur.x, b.sendBCur.y, null, b, itm.color, 1.5, true, true);
          Fx.dynamicWave.at(b.x, b.y, b.block.size * Vars.tilesize * 0.75, itm.color);
          Fx.dynamicWave.at(b.sendBCur.x, b.sendBCur.y, b.sendBCur.block.size * Vars.tilesize * 0.75, itm.color);
          MDL_effect.playAt(b.x, b.y, b.block.delegee.shootSe);
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
       * `PARAM`: Cooldown between each round.
       * @memberof BLK_coreRelay
       * @instance
       */
      itmSendCooldown: 300.0,
      /**
       * `PARAM`: Sound played when items are sent.
       * @memberof BLK_coreRelay
       * @instance
       */
      shootSe: fetchSound("se-shot-core-relay"),


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


      /**
       * @override
       * @memberof BLK_coreRelay
       * @instance
       * @return {boolean}
       */
      ex_isSwitchDisableTg: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


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
       * `INTERNAL`
       * @memberof B_coreRelay
       * @instance
       */
      itmSendCd: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_coreRelay
       * @instance
       */
      sendBCur: null,


    })
    .setMethod({


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      /**
       * Gets target building.
       * @memberof B_coreRelay
       * @instance
       * @return {Building|null}
       */
      ex_findSendB: function() {
        return this.closestCore();
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
