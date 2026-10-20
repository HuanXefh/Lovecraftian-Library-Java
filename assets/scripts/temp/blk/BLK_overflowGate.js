/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ import ------------------------------> */


  /**
   * @typedef {TemplateInstance<OverflowGate, BLK_overflowGate>} BLKOverflowGate
   */


  /**
   * @typedef {TemplateInstance<OverflowGate.OverflowGateBuild, B_overflowGate>} BOverflowGate
   * @prop {BLKOverflowGate} block
   */


  const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


  /* <------------------------------ component ------------------------------> */


  /**
   * @private
   * @param {BLKOverflowGate} blk
   * @return {void}
   */
  function comp_init(blk) {
      blk.configurable = true;
      blk.saveConfig = true;
      blk.clearOnDoubleTap = false;

      blk.config(JAVA.boolean, (b, bool) => {
          if(bool !== b.delegee.isInv) {
              b.delegee.isInv = bool;
              GLB_eff.fadePlacePack[b.block.size].at(b);
              b.recache();
              BOX_trigger.invertSelection.fire();
          };
      });
  };


  /**
   * @private
   * @param {BLKOverflowGate} blk
   * @return {void}
   */
  function comp_load(blk) {
      blk.delegee.invReg = fetchRegion(blk, "-inv");
  };


  /**
   * @private
   * @param {BOverflowGate} b
   * @param {Item} item
   * @param {Building} b_f
   * @param {boolean} isFlip
   * @return {Building|null}
   */
  function comp_getTileTarget(b, item, b_f, isFlip) {
      let
          rot = b_f.relativeTo(b),
          b_t = b.nearby(rot),
          target = b_t,
          cond0 = b_t != null && b_t.team === b.team && !(b_t.block.instantTransfer && b_f.block.instantTransfer) && b_t.acceptItem(b, item);

      if(!cond0 || b.delegee.isInv === b.enabled) {
          let
              b_s1 = b.nearby(Mathf.mod(rot - 1, 4)),
              b_s2 = b.nearby(Mathf.mod(rot + 1, 4)),
              cond1 = b_s1 != null && b_s1.team === b.team && !(b_s1.block.instantTransfer && b_f.block.instantTransfer) && b_s1.acceptItem(b, item),
              cond2 = b_s2 != null && b_s2.team === b.team && !(b_s2.block.instantTransfer && b_f.block.instantTransfer) && b_s2.acceptItem(b, item);

          if(!cond1 && !cond2) {
              return b.delegee.isInv === b.enabled && cond0 ? b_t : null;
          };
          if(cond1 && !cond2) {
              target = b_s1;
          } else if(!cond1 && cond2) {
              target = b_s2;
          } else {
              target = (b.rotation & (1 << rot)) === 0 ? b_s1 : b_s2;
              if(isFlip) {
                  b.rotation ^= (1 << rot)
              };
          };
      };

      return target;
  };


  /**
   * @private
   * @param {BOverflowGate} b
   * @param {Table} tb
   * @return {void}
   */
  function comp_buildConfiguration(b, tb) {
      MDL_table.btnCfgToggle(tb, b, GLB_varGen.icons.swap, GLB_varGen.icons.swap, b.delegee.isInv)
      .tooltip(MDL_bundle.getInfo("lovec", "tt-invert-selection"), true);
  };


  /**
   * @private
   * @param {BOverflowGate} b
   * @return {void}
   */
  function comp_draw(b) {
      if(b.delegee.isInv) {
          Draw.rect(b.block.delegee.invReg, b.x, b.y);
      };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Overflow gate with `blk.invert` being useless.
         * <br> `SINGLESIZE`
         * @class BLK_overflowGate
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_overflowGate")
        .initTemplate()
        .setParent(OverflowGate)
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_overflowGate
             * @instance
             * @type {TextureRegion}
             */
            invReg: null,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_overflowGate
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_overflowGate")
        .initTemplate()
        .setParent(OverflowGate.OverflowGateBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_overflowGate
             * @instance
             * @type {boolean}
             */
            isInv: false,


        })
        .setMethod({


            getTileTarget: function(item, b_f, isFlip) {
                return comp_getTileTarget(this, item, b_f, isFlip);
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


            config: function() {
                return this.delegee.isInv;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            write: function(wr) {
                wr.bool(this.delegee.isInv);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                  rd.s();
                };
                this.delegee.isInv = rd.bool();
            },


        }),


    ];
