/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up the structure of global object before definition.
   * {global.lovecUtil} is used internally.
   * {global.lovec} is used for testing in console, which is created in {RUN_global}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/




  global.lovecUtil = {




    prop: {


      locale: Core.settings.getString("locale"),
      useRecolorSpr: Core.settings.getBool("lovec-load-gen-recolor", true),


    },




    fun: {


      /* ----------------------------------------
       * NOTE:
       *
       * Gets current planet as string.
       * ---------------------------------------- */
      _plaCur() {
        let nm = "";
        if(!Vars.state.isMenu() && Vars.state.getPlanet() != null) {
          nm = Vars.state.getPlanet().name;
        };

        return nm;
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Gets current map as string.
       * ---------------------------------------- */
      _mapCur() {
        let nm = "";
        if(!Vars.state.isMenu()) {
          if(Vars.state.sector != null && Vars.state.sector.preset != null) {
            nm = Vars.state.sector.preset.name;
          } else if(Vars.state.map != null) {
            nm = Vars.state.map.plainName();
          };
        };

        return nm;
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Bypasses {MDL_content} to resolve module coupling.
       * This one is less stable and won't warn, do not abuse it! Use {global.lovec.mdl_content._ct} instead whenever possible.
       * ---------------------------------------- */
      _ct(ct_gn, ctTypeStr) {
        if(ct_gn == null) return null;
        if(ct_gn instanceof UnlockableContent) return ct_gn;

        return ctTypeStr == null ?
          Vars.content.byName(ct_gn) :
          Vars.content.getByName(ContentType[ctTypeStr], ct_gn);
      },


      /* ----------------------------------------
       * NOTE:
       *
       * Calculates global heat for current map.
       * ---------------------------------------- */
      _glbHeat() {
        let nmPla = global.lovecUtil.fun._plaCur();
        if(nmPla === "") return 26.0;
        let nmMap = Vars.state.map.plainName();

        return global.lovec.db_env.db["param"]["map"]["heat"].read(
          nmMap,
          global.lovec.db_env.db["param"]["pla"]["heat"].read(nmPla, 0.26)
        ) * 100.0;
      },


    },




    db: {


      oreDict: new ObjectMap(),
      rs: {
        hardness: readAuxJsonData({}, "hardness"),
        sintTemp: readAuxJsonData({}, "sintTemp"),
      },


      stat: {},
      statUnit: {},
      statCategory: {},
      shader: {},
      cacheLayer: {},


      keyBindListener: [],
      dialFlow: [],
      settingTerm: [],


      weaponTemplate: [],
      bulletTemplate: [],
      partTemplate: [],


      ability: [],
      ai: [],
      sortF: {},
      drawer: [],
      consumer: [],
      dialog: [],


    },




  };


  eval("NGU2YTYzMzI1OTdhNWE2ZDRlNmE0OTMyNGQ1NDVhNmE0ZTU3NDk3OTRkNmE1OTc5NGU0NDYzN2E0ZjU0NGQ3OTRlNTc0NTMxNGU3YTUyNmM0ZTU0NTkzMjRlNDQ1MTMzNGU2ZDRkMzM0ZDdhNDk3OTRkNmQ1NTMyNGU0NDU5MzE0ZTZhNGQzMjVhNmE1OTMwNGU2YTU1N2E0ZTZhNGQzMDRkNmE2Nzc5NGY1NDU2NmI0ZTU3NDk3OTRkNmE1OTdhNGU0NDY3MzA1OTU0NjMzMjRlNmE0ZDMwNGQ1NDRlNmI0ZDMyNTE3OTRkNmE0YTZjNGU2YTUxMzI0ZTU0NTk3YTRlNmQ1OTMyNGU0NDU5MzE0ZDdhNTk3YTRlNDQ0OTM0NGQ2YTZiMzE1YTQ0NTY2OTRkNmE0OTMxNTk1NDUxMzM0ZTU0NTkzMjRmNTQ1OTMwNGU1NDYzMzI0ZDdhNGU2YjRkNmE0OTc5NWE1NDU5MzA0ZTZhNTUzMjRkN2E1YTZkNGU2YTUxMzI0ZTU0NGQzMjRkN2E1MTc5NGY0NDQ5MzU0ZTU3NTE3YTVhNDQ0OTM0NGU2YTU5MzM0ZTU0NWE2YzRlNmE0ZDMzNGU0NDU5MzU0ZTZkNTkzMjVhNTQ0OTM0NGQ2YTZiMzM1OTZhNTkzNTRlNmE1OTc5NGY0NDUxN2E0ZTZkNTkzMzRkNmE1OTMxNGU1NzQ5Nzk0ZDZhNTk3YTRkN2E0OTMxNGU2YTRkNzc0ZTZhNTEzMDRlN2E1YTZhNGU3YTU1MzE1OTU0NGQ3YTRlNDc1MTdhNWE0NDQ5Nzk0ZDZkNTUzMjRlNDQ1OTMxNGU2YTRkMzI1YTZhNTkzMDRlNmE1NTdhNGU2YTRkMzA0ZDZhNjc3OTRmNTQ1NjZiNGU1NzQ5Nzk0ZDZhNTY2ODRkN2E0OTMxNGU2YTRkNzc0ZTU0NTU3YTRkN2E1NTc5NGU3YTZiMzI0ZDU0NTUzMzRkN2E1NTMyNWE1NDQ5Nzk0ZDZkNTUzMjRlNDQ1OTMxNGU2YTRkMzI1YTZhNTkzMDRlNmE1NTdhNGU2YTRkMzA0ZDZhNjc3OTRmNTQ1NjZiNGQ2YTY3Nzk0ZDZhNTk3OTRlNDQ2MzdhNGY1NDRkNzk0ZTU3NDUzMTRlN2E1MjZiNGU3YTUxMzI0ZDZhNTUzMzRlNmQ0ZDMzNTk1NDU1MzU0ZTdhNmI3YTRkNTQ2NDY4NGU1NzQ1MzE0ZTdhNTI2YzRlN2E2YjMxNTk1NDU1MzQ0ZTU0NDUzMzRlNDQ1NTM1NGQ3YTQ5N2E0ZjU0NWE2OTRlNTc0NTMxNGQ1NDRlNmI0ZDMyNTE3OTRkNmE0YTZjNGU2YTUxMzI0ZTU0NTk3YTRlNmQ1OTMyNGU0NDU5MzE0ZDdhNTk3YTRlNDQ0OTM0NGQ2YTZiNzk1OTdhNDk3NzRkNmE0OTc5NGQ2YTQ5MzU0ZTU3NDk3OTRkNmE1OTc4NGU1NDYzN2E0ZTU0NWE2ODRlNmE0OTMwNGY0NDU1MzI0ZTZkNDkzMTU5NTQ1NTM0NGU0NzUxN2E1YTQ0NDk3OTRkNmQ1NTMyNGU0NDU5MzE0ZTZhNGQzMjVhNmE1OTMwNGU2YTU1N2E0ZTZhNGQzMDRkNmE2Nzc5NGY1NDU2NmI0ZDZhNjc3OTRkNmE1NTc3NGU0NDYzMzA0ZTZhNjMzMTRlNmE1MTMxNGU3YTYzMzA0ZTZkNGQzMDU5N2E1NTMzNGQ3YTQ1MzM0ZTZhNTY2ODRlNDQ2MzMxNGU1NDRhNjk0ZDZhNDk3OTVhNTQ1OTMwNGU2YTU1MzI0ZDdhNWE2ZDRlNmE1MTMyNGU1NDRkMzI0ZDdhNTE3OTRmNDQ0OTM1NGQ2YTZiNzk0ZjU0NjQ2OTRlNDc0ZDMyNWE2YTU5MzM0ZDZkNTUzMjRmNTQ1YTZjNGU2YTU5MzI1YTZhNDkzNDRkNmE0OTMxNTk2YTUyNmE0ZTQ3NTkzMTRlNmE1MTMxNGU0NDRkMzE1YTQ0NDk3NzRlNTc0OTc5NGU0NDRkNzg0ZTU3NTE3OTRkNDQ1OTM1NGU3YTRkNzk0ZDQ0NTkzMTRlNmQ1NTMyNGQ1NDU5Nzk0ZTZkNGQzMjRlNTQ1OTMwNGQ2ZDU1Nzk0ZDZhNGE2YzRlNmE1OTMyNWE2YTYzNzk0ZTZkNTEzMjRkNTQ2MzMwNGQ2YTY3Nzk0ZDZhNTEzMDRlNmE1NTMyNGQ2YTYzMzE0ZTZhNjM3OTRkNDQ1YTZiNGU2ZDU5MzI0ZTQ0NTkzMTRkNmE0OTc5NWE1NDU5N2E0ZTZkNTkzMjU5N2E1YTZkNGU3YTQ5Nzk0ZjQ0NTU3NzRlNmE0NTMyNTk3YTRhNmM0ZTZhNDUzMjRkN2E1OTdhNGU2YTU1MzI1YTU0NjMzMDRkNmE2Yjc5NGY1NDQ5MzU0ZDMyNDkzMzRkNmE1OTMxNGU3YTUxMzM0ZTU0NjM3OTRlNmQ1NTc5NGQ0NDYzMzA0ZTdhNDkzMzRlNTQ1OTMxNGUzMjUxMzI0ZTU0NWE2YTRlN2E0ZDMyNGU1NDY0Njk0ZTdhNDkzMjRlNTQ2MzMwNGU3YTU1MzM0ZDZhNWE2YzRkNmE0MTMyNGU2YTU5Nzg0ZTZkNGQzMzRkN2E1OTMxNGUzMjUxMzM1YTQ0NDkzNTRkNmE2Nzc5NGY1MTNkM2Q=".decode64().decodeHex().decode64().decodeHex());
