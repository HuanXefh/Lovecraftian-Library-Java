/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Adds global methods that are used to modify contents.
   * Does not provide methods to create contents like block, unit type, etc. See {RUN_glbScr_extend} instead.
   *
   * {newXxx} is used to create and register some content.
   * {fetchXxx} is used to get the content created by {newXxx}.
   * {setXxx} is used to modify existing contents, where {fetchXxx} is frequently called.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- set ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used to overwrite block flags.
   * ---------------------------------------- */
  resetBlockFlag = function(blk, flags) {
    blk.flags = EnumSet.of.apply(null, flags != null ? flags : []);
    if(blk.fogRadius > 0) blk.flags.with(BlockFlag.hasFogRadius);
    if(blk.sync) blk.flags.with(BlockFlag.synced);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * This content will be only unlockable by calling {ct.unlock()}.
   * Mostly used for contents that has a tech tree node but cannot be researched.
   * Should be called on INIT.
   * ---------------------------------------- */
  lockTechNode = function(ct) {
    if(ct.techNode == null) return;
    ct.techNode.objectives.add(extend(Objectives.Objective, {
      complete() {
        return false;
      },
      display() {
        Core.bundle.get("info.lovec-info-no-unlock.name");
      },
    }));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set weapons for some unit in JS.
   * Format for {getter}: {wpsOld => wpsNew}.
   * ---------------------------------------- */
  setWeapon = function(utp, getter) {
    Events.run(ContentInitEvent, () => {
      let wps = utp.weapons.toArray();
      try{
        utp.weapons = getter(wps).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set weapons for [$1]\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set abilities of some unit in JS.
   * Format for {getter}: {abisOld => abisNew}.
   * ---------------------------------------- */
  setAbility = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      let abis = utp.abilities.toArray();
      try{
        utp.abilities = getter(abis).pullAll(null).flatten().toSeq();
      } catch(err) {
        Log.err("[LOVEC] Failed to set abilities for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set AI controller of some unit in JS.
   * Format for {getter}: {unit => ai}.
   * ---------------------------------------- */
  setAi = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      try{
        utp.controller = func(getter);
      } catch(err) {
        Log.err("[LOVEC] Failed to set AI controller for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set drawers of some block in JS.
   * Format for {getter}: {drawersOld => drawersNew}.
   * ---------------------------------------- */
  setDrawer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      if(blk.drawer == null && blk.delegee != null && blk.delegee.drawer == null) {
        Log.warn("[LOVEC] Can't find field [$1] in [$2]!".format("drawer".color(Pal.accent), blk.name.color(Pal.accent)));
        return;
      };

      let drawer = blk.drawer != null ? blk.drawer : blk.delegee.drawer;
      let drawers = drawer instanceof DrawMulti ? drawer.drawers.cpy() : [drawer];
      try {
        let drawerNew = new DrawMulti(getter(drawers).pullAll(null).flatten().toSeq());
        blk.drawer != null ?
          blk.drawer = drawerNew :
          blk.delegee.drawer = drawerNew;
        if(!Vars.headless) {
          drawerNew.load(blk);
        };
      } catch(err) {
        Log.err("[LOVEC] Failed to set drawers for [$1]:\n".format(blk.name.color(Pal.accent)) + err);
      };
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to set consumers of some block in JS, can be called in {blk.init}.
   * Format for {getter}: {conssOld => conssNew}.
   * ---------------------------------------- */
  setConsumer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      let
        conss = getter(blk.consumers).pullAll(null).flatten(),
        conssNew = conss.cpy().pullAll(blk.consumers);

      blk.consumers = conss;
      blk.optionalConsumers = conss.filter(consX => consX.optional && !consX.ignore());
      blk.nonOptionalConsumers = conss.filter(consX => !consX.optional && !consX.ignore());
      blk.updateConsumers = conss.filter(consX => consX.update && !consX.ignore());
      blk.hasConsumers = conss.length > 0;

      conssNew.forEachFast(consX => consX.apply(blk));
    });
  };


  /* <---------- fetch ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a mod by name, by default it should be a loaded one.
   * ---------------------------------------- */
  fetchMod = function(nmMod, ignoreEnabled) {
    return nmMod === "vanilla" ?
      null :
      ignoreEnabled ?
        Vars.mods.getMod(nmMod) :
        Vars.mods.locateMod(nmMod);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load texture region.
   * ---------------------------------------- */
  fetchRegion = function(ct_gn, suffix, suffixFallback) {
    let nm = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Vars.headless ?
      null :
      Core.atlas.find(nm + suffix, Core.atlas.find(nm + suffixFallback));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {fetchRegion} that returns {null} if texture region is not found.
   * ---------------------------------------- */
  fetchRegionOrNull = function(ct_gn, suffix, suffixFallback) {
    if(Vars.headless) return null;
    let nm = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;

    if(suffix != null && Core.atlas.has(nm + suffix)) return Core.atlas.find(nm + suffix);
    if(suffixFallback != null && Core.atlas.has(nm + suffixFallback)) return Core.atlas.find(nm + suffixFallback);

    return null;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {fetchRegion} that loads a series of texture regions as an array.
   * ---------------------------------------- */
  fetchRegions = function(ct_gn, suffix, len1, len2, len3) {
    const regs = [];

    if(Vars.headless) return regs;
    let nm = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(len1 == null) return regs.pushAll(fetchRegion(nm, suffix));

    if(len2 == null) {
      let i = 0;
      while(i < len1) {
        regs.push(Core.atlas.find(nm + suffix + "-" + i));
        i++;
      };
    } else {
      if(len3 == null) {
        let i = 0, j;
        while(i < len1) {
          let tmpRegs = [];
          j = 0;
          while(j < len2) {
            tmpRegs.push(Core.atlas.find(nm + suffix + "-" + i + "-" + j));
            j++;
          };
          regs.push(tmpRegs);
          i++;
        };
      } else {
        let i = 0, j, k;
        while(i < len1) {
          let tmpRegs = [];
          j = 0;
          while(j < len2) {
            let tmpRegs1 = [];
            k = 0;
            while(k < len3) {
              tmpRegs1.push(Core.atlas.find(nm + suffix + "-" + i + "-" + j + "-" + k));
              k++;
            };
            tmpRegs.push(tmpRegs1);
            j++;
          };
          regs.push(tmpRegs);
          i++;
        };
      };
    };

    return regs;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load sound.
   * ---------------------------------------- */
  fetchSound = function(se_gn, returnUnset) {
    return se_gn instanceof Sound ?
      se_gn :
      typeof se_gn === "string" ?
        Vars.tree.loadSound(se_gn) :
        returnUnset ?
          Sounds.unset :
          Sounds.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used to load music.
   * ---------------------------------------- */
  fetchMusic = function(mus_gn) {
    return mus_gn instanceof Music ?
      mus_gn :
      typeof mus_gn === "string" ?
        Vars.tree.loadMusic(mus_gn) :
        Musics.none;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a stat by name from registered ones.
   * ---------------------------------------- */
  fetchStat = function(nmMod, nm) {
    let stat = global.lovecUtil.db.stat[nmMod][nm];
    if(stat == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return stat;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a stat unit by name from registered ones.
   * ---------------------------------------- */
  fetchStatUnit = function(nmMod, nm) {
    let statUnit = global.lovecUtil.db.statUnit[nmMod][nm];
    if(statUnit == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return statUnit;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a stat category unit by name from registered ones.
   * ---------------------------------------- */
  fetchStatCategory = function(nmMod, nm) {
    let statCateg = global.lovecUtil.db.statCateg[nmMod][nm];
    if(statCateg == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return statCateg;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a shader by name from registered ones.
   * Note that this can return {null} if errored.
   * ---------------------------------------- */
  fetchShader = function(nm) {
    let shader = global.lovecUtil.db.shader[nm];
    if(shader == null) ERROR_HANDLER.throw("unregisteredContent", nm);
    return shader;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a cache layer by name from registered ones.
   * ---------------------------------------- */
  fetchCacheLayer = function(nm) {
    let cacheLay = global.lovecUtil.db.cacheLay[nm];
    if(cacheLay == null) ERROR_HANDLER.throw("unregisteredContent", nm);
    return cacheLay;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a weapon built from some registered weapon template.
   * ---------------------------------------- */
  fetchWeapon = function(nm, paramObj) {
    let temp = global.lovecUtil.db.weaponTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a bullet type built from some registered bullet template.
   * ---------------------------------------- */
  fetchBullet = function(nm, paramObj) {
    let temp = global.lovecUtil.db.bulletTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a part built from some registered part template.
   * ---------------------------------------- */
  fetchPart = function(nm, paramObj) {
    let temp = global.lovecUtil.db.partTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an ability from registered ability getter functions.
   * ---------------------------------------- */
  fetchAbility = function(nm, paramObj) {
    return global.lovecUtil.db.abilitySetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets an AI from registered AI getter functions.
   * ---------------------------------------- */
  fetchAi = function(nm, paramObj) {
    return global.lovecUtil.db.aiSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a drawer from registered drawer getter functions.
   * ---------------------------------------- */
  fetchDrawer = function(nm, paramObj) {
    return global.lovecUtil.db.drawerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a consumer from registered consumer getter functions.
   * ---------------------------------------- */
  fetchConsumer = function(nm, paramObj) {
    return global.lovecUtil.db.consumerSetter.read(nm, Function.airNull)(paramObj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog by name from registered ones.
   * ---------------------------------------- */
  fetchDialog = function(nm) {
    return global.lovecUtil.db.dialogGetter.read(nm, global.lovecUtil.db.dialogGetter.read("def"));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a dialog flow by name from registered ones.
   * ---------------------------------------- */
  fetchDialogFlow = function(nm) {
    return global.lovecUtil.db.dialFlow.read(nm, Array.air);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a setting value (must be registered through {CLS_settingTerm}).
   * ---------------------------------------- */
  fetchSetting = function(nm, useScl) {
    return global.lovecUtil.db.settingTerm.read(nm, Function.airNull)(useScl);
  };


  /* <---------- register ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for stat value, where JavaScript arrow functions won't work.
   * ---------------------------------------- */
  newStatValue = function(tableF) {
    return new StatValue() {display(tb) {
      tableF(tb);
    }};
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new stat.
   * ---------------------------------------- */
  newStat = function(nmMod, nm, statCateg) {
    if(global.lovecUtil.db.stat[nmMod] === undefined) global.lovecUtil.db.stat[nmMod] = {};
    global.lovecUtil.db.stat[nmMod][nm] = new Stat(nmMod + "-stat-" + nm, tryVal(statCateg, StatCat.function));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new stat unit.
   * ---------------------------------------- */
  newStatUnit = function(nmMod, nm, param) {
    if(global.lovecUtil.db.statUnit[nmMod] === undefined) global.lovecUtil.db.statUnit[nmMod] = {};
    global.lovecUtil.db.statUnit[nmMod][nm] = param == null ?
      new StatUnit(nmMod + "-stat0unit-" + nm) :
      new StatUnit(nmMod + "-stat0unit-" + nm, param);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new stat category.
   * ---------------------------------------- */
  newStatCateg = function(nmMod, nm) {
    if(global.lovecUtil.db.statCateg[nmMod] === undefined) global.lovecUtil.db.statCateg[nmMod] = {};
    global.lovecUtil.db.statCateg[nmMod][nm] = extend(StatCat, nmMod + "-" + nm, {
      compareTo(statCateg) {
        return statCateg === StatCat.function ? -1 : this.super$compareTo(statCateg);
      },
    });
  };


  (function() {


    function throwDebugError() {
      if(Core.settings.getBool("lovec-test0error-shader", false)) ERROR_HANDLER.throw("debug", "shader");
    };
    function warnShaderLoadFail(nm, err) {
      Log.warn("[LOVEC] Failed to load shader " + nm.color(Pal.accent) + ":\n" + err);
    };



    /* ----------------------------------------
     * NOTE:
     *
     * Registers a surface shader, mostly used for floor rendering as cache floor.
     * ---------------------------------------- */
    newSurfaceShader = function(nmFrag) {
      let shader;
      try {
        throwDebugError();
        shader = new Shaders.SurfaceShader(nmFrag);
      } catch(err) {
        shader = null;
        warnShaderLoadFail(nmFrag, err);
      };

      global.lovecUtil.db.shader[nmFrag] = shader;
    };


    /* ----------------------------------------
     * NOTE:
     *
     * Registers a region shader for texture region rendering.
     * ---------------------------------------- */
    newRegionShader = function(nmFrag) {
      let shader;
      try {
        throwDebugError();
        shader = extend(Shaders.LoadShader, nmFrag, "default", {


          // @PARAM: Texture region to draw.
          region: new TextureRegion(),
          // @PARAM: Color to multiply.
          mulColor: new Color(),
          // @PARAM: Alpha value.
          a: 1.0,
          // @PARAM: Offset of rendering.
          off: 0.0,
          // @PARAM: Affects scaling of randomness.
          offCap: 1.0,


          apply() {
            if(this.region.texture == null) {
              this.setUniformf("u_uv", 0.0, 0.0);
              this.setUniformf("u_uv2", 1.0, 1.0);
              this.setUniformf("u_texsize", 1, 1);
            } else {
              this.setUniformf("u_uv", this.region.u, this.region.v);
              this.setUniformf("u_uv2", this.region.u2, this.region.v2);
              this.setUniformf("u_texsize", this.region.texture.width, this.region.texture.height);
              this.setUniformf("u_mulColor", this.mulColor.r, this.mulColor.g, this.mulColor.b, this.mulColor.a);
              this.setUniformf("u_a", this.a);
              this.setUniformf("u_off", this.off);
              this.setUniformf("u_offCap", this.offCap);
            };
          },


        });
      } catch(err) {
        shader = null;
        warnShaderLoadFail(nmFrag, err);
      };

      global.lovecUtil.db.shader[nmFrag] = shader;
    };


  })();


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a shader-based cache layer.
   * ---------------------------------------- */
  newCacheLayer = function(nm, shader, cacheLayFallback) {
    if(shader == null) return tryVal(cacheLayFallback, CacheLayer.normal);
    let cacheLay = new CacheLayer.ShaderLayer(shader);
    CacheLayer.add(cacheLay);
    global.lovecUtil.db.cacheLay[nm] = cacheLay;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a weapon template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newWeaponTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.weaponTemplate.includes(nm)) return;
    global.lovecUtil.db.weaponTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a bullet template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newBulletTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.bulletTemplate.includes(nm)) return;
    global.lovecUtil.db.bulletTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a part template.
   * Format for {tempGetter}: {() => temp}.
   * ---------------------------------------- */
  newPartTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.partTemplate.includes(nm)) return;
    global.lovecUtil.db.partTemplate.push(nm, tempGetter());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an ability setter.
   * Format for {getter}: {paramObj => abi}.
   * ---------------------------------------- */
  newAbility = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.abilitySetter.includes(nm)) return;
      global.lovecUtil.db.abilitySetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers an AI controller setter.
   * Format for {getter}: {paramObj => ctrl}.
   * ---------------------------------------- */
  newAi = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.aiSetter.includes(nm)) return;
      global.lovecUtil.db.aiSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a new target sorting function.
   * Format for {costGetter}: {(unit, x, y) => cost}.
   * ---------------------------------------- */
  newSortF = function(nm, costGetter) {
    global.lovecUtil.db.sortF[nm] = extend(Units.Sortf, {cost(unit, x, y) {
      return costGetter(unit, x, y);
    }});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {newSortF} that uses a property for cost calculation.
   * Larger value means less priority.
   * ---------------------------------------- */
  newPropSortF = function(nm, propGetter) {
    newSortF(nm, (unit, x, y) => propGetter(unit, x, y) + Mathf.dst2(unit.x, unit.y, x, y) / 6400.0);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: nm, sortF1, sortF2, sortF3, ...
   * Variant of {newSortF} that mixes a series of sorting functions.
   * ---------------------------------------- */
  newMixSortF = function(nm) {
    let sortFs = Array.from(arguments).splice(1);
    global.lovecUtil.db.sortF[nm] = extend(Units.Sortf, {cost(unit, x, y) {
      return sortFs.sum(sortF => sortF.cost(unit, x, y));
    }});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a drawer.
   * Format for {getter}: {paramObj => drawer}.
   * ---------------------------------------- */
  newDrawer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.drawerSetter.includes(nm)) return;
      global.lovecUtil.db.drawerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a consumer.
   * Format for {getter}: {paramObj => cons}.
   * ---------------------------------------- */
  newConsumer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.consumerSetter.includes(nm)) return;
      global.lovecUtil.db.consumerSetter.push(nm, getter);
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog.
   * Format for {getter}: {() => dial}.
   * ---------------------------------------- */
  newDialog = function(nm, getter) {
    Events.run(ClientLoadEvent, () => {
      if(global.lovecUtil.db.dialogGetter.includes(nm)) return;
      global.lovecUtil.db.dialogGetter.push(nm, getter());
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a key binding.
   * Format for {scr}: {unit_pl => {...}}.
   * ---------------------------------------- */
  newKeyBind = function(nm, keyCodeDef, categ, scr) {
    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        global.lovec.varGen.addKeyBind(nm, keyCodeDef, categ);
        let keyBind = global.lovec.varGen.bindings[nm];
        if(global.lovecUtil.db.keyBindListener.includes(keyBind)) return;
        global.lovecUtil.db.keyBindListener.push(keyBind, scr);
      });
    });
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Registers a dialog flow.
   * ---------------------------------------- */
  newDialogFlow = function(nm, dialFlowArr) {
    Events.run(ContentInitEvent, () => {
      if(global.lovecUtil.db.dialFlow.includes(nm)) return;
      global.lovecUtil.db.dialFlow.push(nm, dialFlowArr);
    });
  };
