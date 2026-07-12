/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers new consumers.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ item ------------------------------ */


  newConsumer(
    "ConsumeItemEfficiencyMap",
    paramObj => extend(
      ConsumeItemFilter,
      (function() {
        let arr = readParam(paramObj, "itmEffcArr", Array.air).readCol(2, 0);
        return itm => arr.includes(itm.name);
      })(),
      {


        effcMap: readParam(paramObj, "itmEffcArr", Array.air).toObjMap(),


        display(stats) {
          stats.add(this.booster ? Stat.booster : Stat.input, newStatValue(tb => {
            tb.row();
            tb.table(Styles.none, tb1 => {
              let matArr = [
                [
                  "",
                  MDL_bundle._term("lovec", "resource"),
                  MDL_bundle._term("lovec", "efficiency-multiplier"),
                ],
              ];

              this.effcMap.each((nameItm, effc) => {
                let itm = Vars.content.item(nameItm);
                if(itm == null) return;
                matArr.push([
                  itm,
                  itm.localizedName,
                  effc.perc(0),
                ]);
              });

              MDL_table._l_table(tb, matArr).padLeft(48.0);
            }).growX();
          }));
        },


        efficiency(b) {
          let itm = this.getConsumed(b);
          return !b.consumeTriggerValid() || itm == null ?
            0.0 :
            (this.super$efficiency(b) * this.effcMap.get(itm.name, 0.0));
        },


        ex_setRcDict(blk, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) {
          let itm;
          this.effcMap.each((nameItm, effc) => {
            itm = Vars.content.item(nameItm);
            if(itm == null) return;
            dictConsItm[itm.id].push(blk, 1, {});
          });
        },


        ex_setTmiRc(blk, rawRc, boostEffc) {
          let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();
          this.effcMap.each((nameItm, effc) => {
            MOD_tmi.addOpt(rawRc, rcGrp, nameItm, 1, effc, false, true);
          });
        },


      },
    ),
  );


  /* <------------------------------ liquid ------------------------------ */


  /**
   * Consumes one liquid among a list of liquids, where each liquid has an efficiency multiplier.
   */
  newConsumer(
    "ConsumeLiquidEfficiencyMap",
    paramObj => extend(
      ConsumeLiquidFilter,
      (function() {
        let arr = readParam(paramObj, "liqEffcArr", Array.air).readCol(2, 0);
        return boolf(liq => arr.includes(liq.name));
      })(),
      readParam(paramObj, "amt", 0.0),
      {


        effcMap: readParam(paramObj, "liqEffcArr", Array.air).toObjMap(),


        display(stats) {
          stats.add(this.booster ? Stat.booster : Stat.input, newStatValue(tb => {
            tb.row();
            tb.table(Styles.none, tb1 => {
              let matArr = [
                [
                  "",
                  MDL_bundle._term("lovec", "resource"),
                  MDL_bundle._term("lovec", "efficiency-multiplier"),
                ],
              ];

              this.effcMap.each((nameLiq, effc) => {
                let liq = Vars.content.liquid(nameLiq);
                if(liq == null) return;
                matArr.push([
                  tb2 => MDL_table.__rcCt(tb2, liq, this.amount),
                  liq.localizedName,
                  effc.perc(0),
                ]);
              });

              MDL_table._l_table(tb, matArr).padLeft(48.0);
            }).growX();
          }));
        },


        update(b) {
          try {
            let liq = this.getConsumed(b);
            if(liq != null) {
              b.liquids.remove(liq, this.amount * b.edelta() * this.multiplier.get(b) / this.effcMap.get(liq.name, 0.0001));
            };
          } catch(err) {
            console.err(err);
          };
        },


        efficiency(b) {
          let liq = this.getConsumed(b);
          return liq == null ?
            0.0 :
            (this.super$efficiency(b) * this.effcMap.get(liq.name, 0.0));
        },


        ex_setRcDict(blk, dictConsItm, dictConsFld, dictConsBlk, dictConsUtp) {
          let liq;
          this.effcMap.each((nameLiq, effc) => {
            liq = Vars.content.liquid(nameLiq);
            if(liq == null) return;
            dictConsFld[liq.id].push(blk, this.amount, {});
          });
        },


        ex_setTmiRc(blk, rawRc, boostEffc) {
          let rcGrp = new MOD_tmi.CLASSES.RecipeItemGroup();
          this.effcMap.each((nameLiq, effc) => {
            MOD_tmi.addOpt(rawRc, rcGrp, nameLiq, this.amount, effc, true, true);
          });
        },


    }),
  );


  /* <------------------------------ power ------------------------------ */


  /* <------------------------------ special ------------------------------ */


  /**
   * A power consumer that releases lightning arcs, used by some metallic conduits.
   * Triggered manually.
   */
  newConsumer(
    "ConsumePowerShortCircuitPipe",
    paramObj => extend(ConsumePower, {


      usage: readParam(paramObj, "amt", 0.0),
      dmgMtp: readParam(paramObj, "dmgMtp", 1.0),


      display(stats) {},


      trigger(b) {
        if(b.liquids == null || !tryJsProp(b.liquids.current(), "isConductive", false)) return;
        if(b.power == null || b.power.status < 0.0001) return;

        TRIGGER.poweredMetalPipe.fire();
        FRAG_attack._a_lightning(b.x, b.y, null, VAR.param.lightningDmg * b.power.status * this.dmgMtp, null, 6, 4, null, "ground");
      },


      efficiency(b) {
        return 1.0;
      },


    }),
  );
