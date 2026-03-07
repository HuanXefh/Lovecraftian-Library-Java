/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Adds global methods that are used to modify contents.
   * Does not provide methods to create blocks, items, liquids, etc. See {@link RUN_glbScr_extend} instead.
   * `newXxx` is used to add and register new contents.
   * `fetchXxx` is used to get registered contents.
   * `setXxx` is used to modify existing contents.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- set ----------> */


  /**
   * Resets block flag.
   * @global
   * @param {Block} blk
   * @param {Array<BlockFlag>|unset} [flags]
   * @return {void}
   */
  resetBlockFlag = function(blk, flags) {
    blk.flags = EnumSet.of.apply(null, flags != null ? flags : []);
    if(blk.fogRadius > 0) blk.flags.with(BlockFlag.hasFogRadius);
    if(blk.sync) blk.flags.with(BlockFlag.synced);
  };


  /**
   * Makes a tech node unable to be researched, only unlockable by calling `ct.unlock()`.
   * Used for contents that should be unlocked in a special way.
   * @global
   * @param {UnlockableContent} ct
   * @return {void}
   */
  lockTechNode = function(ct) {
    if(ct.techNode == null) return;
    ct.techNode.objectives.add(extend(Objectives.Objective, {
      complete() {
        return false;
      },
      display() {
        return Core.bundle.get("info.lovec-info-no-unlock.name");
      },
    }));
  };


  /**
   * Sets weapons for some unit type.
   * @global
   * @param {UnitType} utp
   * @param {function(Array<Weapon>): Array<Weapon>} getter
   * @return {void}
   */
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


  /**
   * Sets abilities of some unit type.
   * @global
   * @param {UnitType} utp
   * @param {function(Array<Ability>): Array<Ability>} getter
   * @return {void}
   */
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


  /**
   * Sets AI controller of some unit type.
   * @global
   * @param {UnitType} utp
   * @param {function(Unit): AIController} getter
   * @return {void}
   */
  setAi = function(utp, getter) {
    Events.run(ClientLoadEvent, () => {
      try{
        utp.controller = func(getter);
      } catch(err) {
        Log.err("[LOVEC] Failed to set AI controller for [$1]:\n".format(utp.name.color(Pal.accent)) + err);
      };
    });
  };


  /**
   * Sets drawer of some block.
   * @global
   * @param {Block} blk
   * @param {function(Array<DrawBlock>): Array<DrawBlock>} getter
   * @return {void}
   */
  setDrawer = function(blk, getter) {
    Events.run(ClientLoadEvent, () => {
      if(blk.drawer == null && (blk.delegee != null ? blk.delegee.drawer == null : true)) {
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


  /**
   * Sets consumer of some block.
   * @global
   * @param {Block} blk
   * @param {function(Array<Consume>): Array<Consume>} getter
   * @return {void}
   */
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


  /**
   * Gets a mod by name.
   * @global
   * @param {string} nmMod
   * @param {boolean|unset} [ignoreEnabled]
   * @return {Mod|null}
   */
  fetchMod = function(nmMod, ignoreEnabled) {
    return nmMod === "vanilla" ?
      null :
      ignoreEnabled ?
        Vars.mods.getMod(nmMod) :
        Vars.mods.locateMod(nmMod);
  };


  /**
   * Used to load texture region.
   * @global
   * @param {ContentGn} ct_gn
   * @param {string|unset} [suffix]
   * @param {string|unset} [suffixFallback]
   * @return {TextureRegion}
   */
  fetchRegion = function(ct_gn, suffix, suffixFallback) {
    let nm = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Vars.headless ?
      ARC_AIR.reg :
      Core.atlas.find(nm + suffix, Core.atlas.find(nm + suffixFallback));
  };


  /**
   * Variant of {@link fetchRegion} that returns null if texture region is not found.
   * @global
   * @param {ContentGn} ct_gn
   * @param {string|unset} [suffix]
   * @param {string|unset} [suffixFallback]
   * @return {TextureRegion|null}
   */
  fetchRegionOrNull = function(ct_gn, suffix, suffixFallback) {
    if(Vars.headless) return null;
    let nm = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;

    if(suffix != null && Core.atlas.has(nm + suffix)) return Core.atlas.find(nm + suffix);
    if(suffixFallback != null && Core.atlas.has(nm + suffixFallback)) return Core.atlas.find(nm + suffixFallback);

    return null;
  };


  /**
   * Variant of {@link fetchRegion} that loads a series of texture regions.
   * @global
   * @param {ContentGn} ct_gn
   * @param {string|unset} [suffix]
   * @param {number|unset} [len1]
   * @param {number|unset} [len2]
   * @param {number|unset} [len3]
   * @return {TextureRegion[]}
   */
  fetchRegions = function(ct_gn, suffix, len1, len2, len3) {
    const regs = [];
    if(Vars.headless || ct_gn == null || ct_gn === "null") return regs;
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


  /**
   * Used to load sound.
   * It's also possible to use "SOUNDS: xxx" for `Sounds.xxx`.
   * @global
   * @param {SoundGn} se_gn
   * @param {boolean|unset} [returnUnset] - If true, returns `Sounds.unset` instead when sound not found.
   * @return {Sound}
   */
  fetchSound = function(se_gn, returnUnset) {
    return se_gn instanceof Sound ?
      se_gn :
      typeof se_gn === "string" ?
        (
          !se_gn.startsWith("SOUND: ") ?
            Vars.tree.loadSound(se_gn) :
            Sounds[se_gn.replace(/"SOUNDS: "/g, "")]
        ) :
        returnUnset ?
          Sounds.unset :
          Sounds.none;
  };


  /**
   * Used to load music.
   * @global
   * @param {MusicGn} mus_gn
   * @return {Music}
   */
  fetchMusic = function(mus_gn) {
    return mus_gn instanceof Music ?
      mus_gn :
      typeof mus_gn === "string" ?
        Vars.tree.loadMusic(mus_gn) :
        Musics.none;
  };


  /**
   * Gets a stat by name.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @return {Stat}
   */
  fetchStat = function(nmMod, nm) {
    let stat = global.lovecUtil.db.stat[nmMod][nm];
    if(stat == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return stat;
  };


  /**
   * Gets a stat unit by name.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @return {StatUnit}
   */
  fetchStatUnit = function(nmMod, nm) {
    let statUnit = global.lovecUtil.db.statUnit[nmMod][nm];
    if(statUnit == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return statUnit;
  };


  /**
   * Gets a stat category by name.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @return {StatCat}
   */
  fetchStatCategory = function(nmMod, nm) {
    let statCateg = global.lovecUtil.db.statCategory[nmMod][nm];
    if(statCateg == null) ERROR_HANDLER.throw("unregisteredContent", nmMod + "-" + nm);
    return statCateg;
  };


  /**
   * Gets a shader by name.
   * This can return null if it fails to compile the shader.
   * @global
   * @param {string} nm
   * @return {Shader|null}
   */
  fetchShader = function(nm) {
    let shader = global.lovecUtil.db.shader[nm];
    // Shader is nullable
    if(shader === undefined) ERROR_HANDLER.throw("unregisteredContent", nm);
    return shader;
  };


  /**
   * Gets a cache layer by name.
   * @global
   * @param {string} nm
   * @return {CacheLayer}
   */
  fetchCacheLayer = function(nm) {
    let cacheLay = global.lovecUtil.db.cacheLayer[nm];
    if(cacheLay == null) ERROR_HANDLER.throw("unregisteredContent", nm);
    return cacheLay;
  };


  /**
   * Gets a weapon template by name and build it with `paramObj`.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {Weapon}
   */
  fetchWeapon = function(nm, paramObj) {
    let temp = global.lovecUtil.db.weaponTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /**
   * Gets a bullet type template by name and build it with `paramObj`.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {BulletType}
   */
  fetchBullet = function(nm, paramObj) {
    let temp = global.lovecUtil.db.bulletTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /**
   * Gets a part template by name and build it with `paramObj`.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {DrawPart}
   */
  fetchPart = function(nm, paramObj) {
    let temp = global.lovecUtil.db.partTemplate.read(nm);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", nm);
    return temp.build(paramObj);
  };


  /**
   * Gets an ability by name.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {Ability|null}
   */
  fetchAbility = function(nm, paramObj) {
    return global.lovecUtil.db.ability.read(nm, Function.airNull)(paramObj);
  };


  /**
   * Gets an AI controller by name.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {AIController|null}
   */
  fetchAi = function(nm, paramObj) {
    return global.lovecUtil.db.ai.read(nm, Function.airNull)(paramObj);
  };


  /**
   * Gets a drawer by name.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {DrawBlock|null}
   */
  fetchDrawer = function(nm, paramObj) {
    return global.lovecUtil.db.drawer.read(nm, Function.airNull)(paramObj);
  };


  /**
   * Gets a consumer by name.
   * @global
   * @param {string} nm
   * @param {Object|unset} [paramObj]
   * @return {Consume|null}
   */
  fetchConsumer = function(nm, paramObj) {
    return global.lovecUtil.db.consumer.read(nm, Function.airNull)(paramObj);
  };


  /**
   * Gets a dialog by name.
   * @global
   * @param {string} nm
   * @return {Dialog}
   */
  fetchDialog = function(nm) {
    return global.lovecUtil.db.dialog.read(nm, global.lovecUtil.db.dialog.read("def"));
  };


  /**
   * Gets a dialog flow by name (as data array).
   * @global
   * @param {string} nm
   * @return {Array}
   */
  fetchDialogFlow = function(nm) {
    return global.lovecUtil.db.dialFlow.read(nm, Array.air);
  };


  /**
   * Gets a setting value by name.
   * The setting must be registered through {@link CLS_settingTerm}.
   * @global
   * @param {string} nm
   * @param {boolean|unset} [useScl] - If true, the result will be scaled.
   * @return {any}
   */
  fetchSetting = function(nm, useScl) {
    let setting = global.lovecUtil.db.settingTerm.read(nm);
    if(setting == null) return null;

    return setting.get(useScl);
  };


  /* <---------- register ----------> */


  /**
   * Used for stat value, where arrow function doesn't work.
   * @global
   * @param {function(Table): void} tableF
   * @return {StatValue}
   */
  newStatValue = function(tableF) {
    return extend(StatValue, {display(tb) {
      tableF(tb);
    }});
  };


  /**
   * Registers a new stat.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @param {StatCat|unset} [statCateg]
   * @return {void}
   */
  newStat = function(nmMod, nm, statCateg) {
    if(global.lovecUtil.db.stat[nmMod] === undefined) global.lovecUtil.db.stat[nmMod] = {};
    global.lovecUtil.db.stat[nmMod][nm] = new Stat(nmMod + "-stat-" + nm, tryVal(statCateg, StatCat.function));
  };


  /**
   * Registers a new stat unit.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @param {any} param
   * @return {void}
   */
  newStatUnit = function(nmMod, nm, param) {
    if(global.lovecUtil.db.statUnit[nmMod] === undefined) global.lovecUtil.db.statUnit[nmMod] = {};
    global.lovecUtil.db.statUnit[nmMod][nm] = param == null ?
      new StatUnit(nmMod + "-stat0unit-" + nm) :
      new StatUnit(nmMod + "-stat0unit-" + nm, param);
  };


  /**
   * Registers a new stat category.
   * @global
   * @param {string} nmMod
   * @param {string} nm
   * @return {void}
   */
  newStatCategory = function(nmMod, nm) {
    if(global.lovecUtil.db.statCategory[nmMod] === undefined) global.lovecUtil.db.statCategory[nmMod] = {};
    global.lovecUtil.db.statCategory[nmMod][nm] = extend(StatCat, nmMod + "-" + nm, {
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


    /**
     * Registers a shader.
     * @global
     * @param {string} nm
     * @param {function(): Shader} shaderGetter
     * @return {void}
     */
    newShader = function(nm, shaderGetter) {
      let shader;
      try {
        throwDebugError();
        shader = shaderGetter();
      } catch(err) {
        shader = null;
        warnShaderLoadFail(nm, err);
      };

      global.lovecUtil.db.shader[nm] = shader;
    };


    /**
     * Registers a surface shader.
     * @global
     * @param {string} nmFrag
     * @return {void}
     */
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


    /**
     * Registers a texture region shader.
     * @global
     * @param {string} nmFrag
     * @return {void}
     */
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


  /**
   * Registers a shader-based cache layer.
   * @global
   * @param {string} nm
   * @param {Shader|null} shader
   * @param {CacheLayer|unset} [cacheLayFallback]
   * @return {void}
   */
  newCacheLayer = function(nm, shader, cacheLayFallback) {
    let cacheLay = shader == null ? tryVal(cacheLayFallback, CacheLayer.normal) : new CacheLayer.ShaderLayer(shader);
    CacheLayer.add(cacheLay);
    global.lovecUtil.db.cacheLayer[nm] = cacheLay;
  };


  /**
   * Registers a weapon template.
   * @global
   * @param {string} nm
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newWeaponTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.weaponTemplate.includes(nm)) return;
    global.lovecUtil.db.weaponTemplate.push(nm, tempGetter());
  };


  /**
   * Registers a bullet template.
   * @global
   * @param {string} nm
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newBulletTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.bulletTemplate.includes(nm)) return;
    global.lovecUtil.db.bulletTemplate.push(nm, tempGetter());
  };


  /**
   * Registers a part template.
   * @global
   * @param {string} nm
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newPartTemplate = function(nm, tempGetter) {
    if(global.lovecUtil.db.partTemplate.includes(nm)) return;
    global.lovecUtil.db.partTemplate.push(nm, tempGetter());
  };


  /**
   * Registers an ability.
   * @global
   * @param {string} nm
   * @param {function(Object|unset): Ability} getter
   * @return {void}
   */
  newAbility = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.ability.includes(nm)) return;
      global.lovecUtil.db.ability.push(nm, getter);
    });
  };


  /**
   * Registers an AI controller.
   * @global
   * @param {string} nm
   * @param {function(Object|unset): AIController} getter
   * @return {void}
   */
  newAi = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.ai.includes(nm)) return;
      global.lovecUtil.db.ai.push(nm, getter);
    });
  };


  /**
   * Registers a target sorting function.
   * @global
   * @param {string} nm
   * @param {function(Unit, number, number): number} costGetter
   * @return {void}
   */
  newSortF = function(nm, costGetter) {
    global.lovecUtil.db.sortF[nm] = extend(Units.Sortf, {cost(unit, x, y) {
      return costGetter(unit, x, y);
    }});
  };


  /**
   * Variant of {@link newSortF} that uses a property for cost calculation.
   * Larger value means less priority.
   * @global
   * @param {string} nm
   * @param {function(Unit, number, number): number} propGetter
   * @return {void}
   */
  newPropSortF = function(nm, propGetter) {
    newSortF(nm, (unit, x, y) => propGetter(unit, x, y) + Mathf.dst2(unit.x, unit.y, x, y) / 6400.0);
  };


  /**
   * Variant of {@link newSortF} that mixes a series of sorting functions.
   * <br> <ARGS>: nm, sortF1, sortF2, sortF3, ...
   * @global
   * @param {string} nm
   * @return {void}
   */
  newMixSortF = function(nm) {
    let sortFs = Array.from(arguments).splice(1);
    global.lovecUtil.db.sortF[nm] = extend(Units.Sortf, {cost(unit, x, y) {
      return sortFs.sum(sortF => sortF.cost(unit, x, y));
    }});
  };


  /**
   * Registers a drawer.
   * @global
   * @param {string} nm
   * @param {function(Object|unset): DrawBlock} getter
   * @return {void}
   */
  newDrawer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.drawer.includes(nm)) return;
      global.lovecUtil.db.drawer.push(nm, getter);
    });
  };


  /**
   * Registers a consumer.
   * @global
   * @param {string} nm
   * @param {function(Object|unset): Consume} getter
   * @return {void}
   */
  newConsumer = function(nm, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.consumer.includes(nm)) return;
      global.lovecUtil.db.consumer.push(nm, getter);
    });
  };


  /**
   * Registers a dialog.
   * @global
   * @param {string} nm
   * @param {function(): Dialog} getter
   * @return {void}
   */
  newDialog = function(nm, getter) {
    Events.run(ClientLoadEvent, () => {
      if(global.lovecUtil.db.dialog.includes(nm)) return;
      global.lovecUtil.db.dialog.push(nm, getter());
    });
  };


  /**
   * Registers a key binding.
   * @global
   * @param {string} nm
   * @param {KeyCode} keyCodeDef - The default key.
   * @param {string} categ
   * @param {function(Unit, Tile|null): void} scr - <ARGS>: unitPlayer, tMouse.
   * @return {void}
   */
  newKeyBind = function(nm, keyCodeDef, categ, scr) {
    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        VARGEN.addKeyBind(nm, keyCodeDef, categ);
        let keyBind = VARGEN.bindings[nm];
        if(global.lovecUtil.db.keyBindListener.includes(keyBind)) return;
        global.lovecUtil.db.keyBindListener.push(keyBind, scr);
      });
    });
  };


  /**
   * Registers a dialog flow.
   * @global
   * @param {string} nm
   * @param {Array} dialFlowArr - See {@link CLS_dialogFlowBuilder}.
   * @return {void}
   */
  newDialogFlow = function(nm, dialFlowArr) {
    Events.run(ContentInitEvent, () => {
      if(global.lovecUtil.db.dialFlow.includes(nm)) return;
      global.lovecUtil.db.dialFlow.push(nm, dialFlowArr);
    });
  };
