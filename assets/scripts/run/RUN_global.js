/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Sets up the structure of global object before definition.
   */


/*
  ========================================
  Section: Application
  ========================================
*/




  global.lovecUtil = {




    /**
     * Some global static properties.
     */
    prop: {


      locale: Core.settings.getString("locale"),
      useRecolorSpr: Core.settings.getBool("lovec-load-gen-recolor", true),
      hasHoldStance: (function() {
        let stance;
        try {stance = UnitStance.holdPosition} catch(err) {stance = null};
        return stance != null;
      })(),


    },




    /**
     * Internal functions, do not abuse.
     */
    fun: {


      /**
       * Gets current planet as string.
       * @return {string}
       */
      _plaCur() {
        let nm = "";
        if(!Vars.state.isMenu() && Vars.state.getPlanet() != null) {
          nm = Vars.state.getPlanet().name;
        };

        return nm;
      },


      /**
       * Gets current map as string.
       * @return {string}
       */
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


      /**
       * Calculates global heat for current map.
       * @return {number}
       */
      _glbHeat() {
        let nmPla = global.lovecUtil.fun._plaCur();
        if(nmPla === "") return 26.0;
        let nmMap = Vars.state.map.plainName();

        return DB_env.db["param"]["map"]["heat"].read(
          nmMap,
          DB_env.db["param"]["pla"]["heat"].read(nmPla, 0.26)
        ) * 100.0;
      },


    },




    /**
     * Stores various contents.
     */
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


  eval("NGU2YTYzMzI1OTdhNWE2ZDRlNmE0OTMyNGQ1NDVhNmE0ZTU3NDk3OTRkNmE1OTc5NGU0NDYzN2E0ZjU0NGQ3OTRlNTc0NTMxNGU3YTUyNmM0ZTU0NTkzMjRlNDQ1MTMzNGU2ZDRkMzM0ZDdhNDk3OTRkNmQ1NTMyNGU0NDU5MzE0ZTZhNGQzMjVhNmE1OTMwNGU2YTU1N2E0ZTZhNGQzMDRkNmE2Nzc5NGY1NDU2NmI0ZTU3NDk3OTRkNmE1OTdhNGU0NDY3MzA1OTU0NjMzMjRlNmE0ZDMwNGQ1NDRlNmI0ZDMyNTE3OTRkNmE0YTZjNGU2YTUxMzI0ZTU0NTk3YTRlNmQ1OTMyNGU0NDU5MzE0ZDdhNTk3YTRlNDQ0OTM0NGQ2YTZiMzE1YTQ0NTY2OTRkNmE0OTMxNTk1NDUxMzM0ZTU0NTkzMjRmNTQ1OTMwNGU1NDYzMzI0ZDdhNGU2YjRkNmE0OTc5NWE1NDU5MzA0ZTZhNTUzMjRkN2E1YTZkNGU2YTUxMzI0ZTU0NGQzMjRkN2E1MTc5NGY0NDQ5MzU0ZTU3NTE3YTVhNDQ0OTM0NGU2YTU5MzM0ZTU0NWE2YzRlNmE0ZDMzNGU0NDU5MzU0ZTZkNTkzMjVhNTQ0OTM0NGQ2YTZiMzM1OTZhNTkzNTRlNmE1OTc5NGY0NDUxN2E0ZTZkNTkzMzRkNmE1OTMxNGU1NzQ5Nzk0ZDZhNTk3YTRkN2E0OTMxNGU2YTRkNzc0ZTZhNTEzMDRlN2E1YTZhNGU3YTU1MzE1OTU0NGQ3YTRlNDc1MTdhNWE0NDQ5Nzk0ZDZkNTUzMjRlNDQ1OTMxNGU2YTRkMzI1YTZhNTkzMDRlNmE1NTdhNGU2YTRkMzA0ZDZhNjc3OTRmNTQ1NjZiNGU1NzQ5Nzk0ZDZhNTY2ODRkN2E0OTMxNGU2YTRkNzc0ZTU0NTU3YTRkN2E1NTc5NGU3YTZiMzI0ZDU0NTUzMzRkN2E1NTMyNWE1NDQ5Nzk0ZDZkNTUzMjRlNDQ1OTMxNGU2YTRkMzI1YTZhNTkzMDRlNmE1NTdhNGU2YTRkMzA0ZDZhNjc3OTRmNTQ1NjZiNGQ2YTY3Nzk0ZDZhNTk3OTRlNDQ2MzdhNGY1NDRkNzk0ZTU3NDUzMTRlN2E1MjZiNGU3YTUxMzI0ZDZhNTUzMzRlNmQ0ZDMzNTk1NDU1MzU0ZTdhNmI3YTRkNTQ2NDY4NGU1NzQ1MzE0ZTdhNTI2YzRlN2E2YjMxNTk1NDU1MzQ0ZTU0NDUzMzRlNDQ1NTM1NGQ3YTQ5N2E0ZjU0NWE2OTRlNTc0NTMxNGQ1NDRlNmI0ZDMyNTE3OTRkNmE0YTZjNGU2YTUxMzI0ZTU0NTk3YTRlNmQ1OTMyNGU0NDU5MzE0ZDdhNTk3YTRlNDQ0OTM0NGQ2YTZiNzk1OTdhNDk3NzRkNmE0OTc5NGQ2YTQ5MzU0ZTU3NDk3OTRkNmE1OTc4NGU1NDYzN2E0ZTU0NWE2ODRlNmE0OTMwNGY0NDU1MzI0ZTZkNDkzMTU5NTQ1NTM0NGU0NzUxN2E1YTQ0NDk3OTRkNmQ1NTMyNGU0NDU5MzE0ZTZhNGQzMjVhNmE1OTMwNGU2YTU1N2E0ZTZhNGQzMDRkNmE2Nzc5NGY1NDU2NmI0ZDZhNjc3OTRkNmE1NTc3NGU0NDYzMzA0ZTZhNjMzMTRlNmE1MTMxNGU3YTYzMzA0ZTZkNGQzMDU5N2E1NTMzNGQ3YTQ1MzM0ZTZhNTY2ODRlNDQ2MzMxNGU1NDRhNjk0ZDZhNDk3OTVhNTQ1OTMwNGU2YTU1MzI0ZDdhNWE2ZDRlNmE1MTMyNGU1NDRkMzI0ZDdhNTE3OTRmNDQ0OTM1NGQ2YTZiNzk0ZjU0NjQ2OTRlNDc0ZDMyNWE2YTU5MzM0ZDZkNTUzMjRmNTQ1YTZjNGU2YTU5MzI1YTZhNDkzNDRkNmE0OTMxNTk2YTUyNmE0ZTQ3NTkzMTRlNmE1MTMxNGU0NDRkMzE1YTQ0NDk3NzRkNmE1MTMzNTk2YTRkNzg0ZDMyNDUzMTRmNTQ1MjZkNGU1NDU1Nzk0ZDQ0NTU3YTRlNDQ2NzMwNGQ1NDUyNmE0ZTQ3NGQ3OTRkNDQ1MjZjNGU0NzU5MzE0ZTQ0NDk3NzRlNTQ0MTMwNGQ1NDU1N2E0ZTU0NGQzMzVhNDQ0OTc3NGU2YTZiMzM0ZDdhNDk3NzRlNmE1NTMyNWE1NDU5Nzg0ZTZhNDkzMjU5N2E1OTMxNGU2YTUxNzk1YTU0NDk3OTRkNmQ1NTMyNGU2YTVhNmQ0ZTdhNDkzMjVhNDQ1OTc4NGU3YTUxNzk0ZjQ0NDk3OTRlNDQ1MTMyNGU1NDU5Nzk0ZTdhNTUzMjRlN2E0OTc3NGU2ZDUxMzI1YTZhNTkzMDRlNmE1NTc5NGQ2YTRhNmM0ZTZhNGQzMjVhNmE1YTZhNGU2ZDU5MzM0ZDZhNDkzNDRlNTQ0MTMyNGQ1NDVhNmE0ZDZkNTUzMjRkNTQ1OTdhNGU2YTRkMzI0ZTU0NWE2YzRlN2E1MTc5NGY1NDQ5MzU0ZDZhNmI3YTU5NmE2Mzc5NGU2YTU1MzM0ZTQ0NjMzMTRlN2E0OTMyNWE1NDQ5Nzc0ZTdhNTEzMzRkNmE2MzMxNGU2YTU1MzM1YTQ0NTkzMTRlNmQ0ZDMzNGQ3YTU5MzE0ZTMyNDkzMzRkNmE1OTMxNGU3YTUxMzM0ZTU0NjM3OTRlNmQ1NTc5NGQ0NDU5MzI0ZTZhNDUzMjU5N2E2MzdhNGU2YTU1MzM1YTQ0NjQ2YjRkNmE2Yjc5NGY0NDQ5MzU=".decode64().decodeHex().decode64().decodeHex());


  MDL_event._c_onLoad(() => {

    // The object should not be modified later by anyone
    Object.seal(global.lovecUtil);
    Object.seal(global.lovecUtil.prop);
    Object.seal(global.lovecUtil.fun);
    Object.seal(global.lovecUtil.db);

  }, 49225812);
