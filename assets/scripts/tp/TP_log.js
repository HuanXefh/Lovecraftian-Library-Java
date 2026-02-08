/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Registers new logs to {LOG_HANDLER}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- base ----------> */


  batchCall(LOG_HANDLER, function() {

    this.add("w", "invalidArguments", () => "[LOVEC] [$1]".format("Invalid arguments!".color(Pal.remove)));
    this.add("w", "notInGame", () => "[LOVEC] [$1]".format("Method is unavailable outside of game!".color(Pal.remove)));
    this.add("w", "noBuildingFound", (tx, ty) => "[LOVEC] [$1]".format("No building found at ([$1], [$2])!".format(tx, ty).color(Pal.remove)));

    this.add("w", "forceModded", () => "[LOVEC] Lovec has been force to [$1], but no mod requires Lovec to load.".format("MODDED MODE".color(Pal.remove)));
    this.add("w", "noContentFound", nmCt => "[LOVEC] Content [$1] is not found!".format(nmCt.color(Pal.accent)));
    this.add("w", "costyContentSearch", nmCt => "[LOVEC] Performing costy search for [$1]!".format(nmCt.color(Pal.accent)));
    this.add("w", "noCustomShadowRegionFound", nmCt => "[LOVEC] Cannot find custom shadow region for [$1]!".format(nmCt.color(Pal.accent)));


    /* <------------------------------ debug info ------------------------------ */


    this.add("i", "liquidInfo", (tx, ty) => {
      if(!Vars.state.isGame()) {
        LOG_HANDLER.log("notInGame");
        return;
      };
      let b = Vars.world.build(tx, ty);
      if(b == null) {
        LOG_HANDLER.log("noBuildingFound", tx, ty);
        return;
      };
      return String.multiline(
        "[LOVEC] Liquid info for [$1] at ([$2], [$3]):".format(b.block.localizedName.plain().color(b.team.color), tx, ty),
        (function() {
          const arr = [];
          if(b.liquids == null) {
            arr.push("- No liquid module!");
            return arr;
          };
          arr.push("- Liquid capacity: " + Strings.fixed(b.block.liquidCapacity, 2));
          if(b.liquids.currentAmount() > 0.0) {
            arr.push("- Current liquid: " + b.liquids.current().localizedName);
            arr.push("- Liquids:");
            let amt;
            b.liquids.each(liq => {
              amt = b.liquids.get(liq);
              arr.push("  > [$1]: [$2] ([$3])".format(liq.localizedName, Strings.fixed(amt, 4), (amt / b.block.liquidCapacity).perc()));
            });
          };
          return arr;
        })(),
      );
    });


    this.add("i", "cepInfo", team => {
      if(!Vars.state.isGame()) {
        LOG_HANDLER.log("notInGame");
        return;
      };
      if(team == null) team = Vars.player.team();
      return String.multiline(
        "[LOVEC] CEP stats for [$1]".format(team.toString().color(team.color)),
        "- Provided: [$1]".format(Strings.fixed(global.lovec.frag_faci._cepCapCur(team), 2)),
        "- Used: [$1]".format(Strings.fixed(global.lovec.frag_faci._cepUseCur(team), 2)),
        "- Fraction: [$1]".format(global.lovec.frag_faci._cepFracCur(team).perc()),
        "- Efficiency: [$1]".format(global.lovec.frag_faci._cepEffcCur(team).perc()),
      );
    });

  });
