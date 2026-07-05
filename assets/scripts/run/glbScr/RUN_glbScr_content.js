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
        utp.weapons = getter(wps).compact().flatten().toSeq();
      } catch(err) {
        console.err("[LOVEC] Failed to set weapons for ${1}\n".format(utp.name.color(Pal.accent)) + err);
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
        utp.abilities = getter(abis).compact().flatten().toSeq();
        utp.abilities.each(abi => {
          if(!abis.includes(abi)) abi.init(utp);
        });
      } catch(err) {
        console.err("[LOVEC] Failed to set abilities for ${1}:\n".format(utp.name.color(Pal.accent)) + err);
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
        console.err("[LOVEC] Failed to set AI controller for ${1}:\n".format(utp.name.color(Pal.accent)) + err);
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
        console.warn("[LOVEC] Can't find field ${1} in ${2}!".format("drawer".color(Pal.accent), blk.name.color(Pal.accent)));
        return;
      };

      let drawer = blk.drawer != null ? blk.drawer : blk.delegee.drawer;
      let drawers = drawer instanceof DrawMulti ? drawer.drawers.cpy() : [drawer];
      try {
        let drawerNew = new DrawMulti(getter(drawers).compact().flatten().toSeq());
        blk.drawer != null ?
          blk.drawer = drawerNew :
          blk.delegee.drawer = drawerNew;
        if(!Vars.headless) {
          drawerNew.load(blk);
        };
      } catch(err) {
        console.err("[LOVEC] Failed to set drawers for ${1}:\n".format(blk.name.color(Pal.accent)) + err);
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
        conss = getter(blk.consumers).compact().flatten(),
        conssNew = conss.cpy().pullAll(blk.consumers),
        consPow = conss.find(blkCons => blkCons instanceof ConsumePower);

      blk.consumers = conss;
      blk.optionalConsumers = conss.filter(consX => consX.optional && !consX.ignore());
      blk.nonOptionalConsumers = conss.filter(consX => !consX.optional && !consX.ignore());
      blk.updateConsumers = conss.filter(consX => consX.update && !consX.ignore());
      blk.hasConsumers = conss.length > 0;
      blk.consPower = consPow == null ? null : consPow;

      conssNew.forEachFast(consX => consX.apply(blk));
    });
  };


  /* <---------- fetch ----------> */


  /**
   * Gets a mod by name.
   * @global
   * @param {string} nameMod
   * @param {boolean|unset} [ignoreEnabled]
   * @return {Mod|null}
   */
  fetchMod = function(nameMod, ignoreEnabled) {
    return nameMod === "vanilla" ?
      null :
      ignoreEnabled ?
        Vars.mods.getMod(nameMod) :
        Vars.mods.locateMod(nameMod);
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
    let name = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(suffixFallback == null) suffixFallback = "";

    return Vars.headless ?
      ARC_AIR.reg :
      Core.atlas.find(name + suffix, Core.atlas.find(name + suffixFallback));
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
    let name = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;

    if(suffix != null && Core.atlas.has(name + suffix)) return Core.atlas.find(name + suffix);
    if(suffixFallback != null && Core.atlas.has(name + suffixFallback)) return Core.atlas.find(name + suffixFallback);

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
    let name = ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn;
    if(suffix == null) suffix = "";
    if(len1 == null) return regs.pushAll(fetchRegion(name, suffix));

    if(len2 == null) {
      let i = 0;
      while(i < len1) {
        regs.push(Core.atlas.find(name + suffix + "-" + i));
        i++;
      };
    } else {
      if(len3 == null) {
        let i = 0, j;
        while(i < len1) {
          let tmpRegs = [];
          j = 0;
          while(j < len2) {
            tmpRegs.push(Core.atlas.find(name + suffix + "-" + i + "-" + j));
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
              tmpRegs1.push(Core.atlas.find(name + suffix + "-" + i + "-" + j + "-" + k));
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
   * Gets a texture region by name, returns empty region if on headless end.
   * @global
   * @param {string|TextureRegion} reg0regStr
   * @return {TextureRegion}
   */
  findRegion = function(reg0regStr) {
    return reg0regStr instanceof TextureRegion ?
      reg0regStr :
      Vars.headless ?
        ARC_AIR.reg :
        Core.atlas.find(reg0regStr);
  };


  /**
   * Variant of {@link findRegion} that returns a drawable instead.
   * @global
   * @param {string|TextureRegion} reg0regStr
   * @return {TextureRegionDrawable}
   */
  findRegionDrawable = function(reg0regStr) {
    return new TextureRegionDrawable(findRegion(reg0regStr));
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
   * @param {string} nameMod
   * @param {string} name
   * @return {Stat}
   */
  fetchStat = function(nameMod, name) {
    let stat = global.lovecUtil.db.stat[nameMod][name];
    if(stat == null) ERROR_HANDLER.throw("unregisteredContent", nameMod + "-" + name);
    return stat;
  };


  /**
   * Gets a stat unit by name.
   * @global
   * @param {string} nameMod
   * @param {string} name
   * @return {StatUnit}
   */
  fetchStatUnit = function(nameMod, name) {
    let statUnit = global.lovecUtil.db.statUnit[nameMod][name];
    if(statUnit == null) ERROR_HANDLER.throw("unregisteredContent", nameMod + "-" + name);
    return statUnit;
  };


  /**
   * Gets a stat category by name.
   * @global
   * @param {string} nameMod
   * @param {string} name
   * @return {StatCat}
   */
  fetchStatCategory = function(nameMod, name) {
    let statCateg = global.lovecUtil.db.statCategory[nameMod][name];
    if(statCateg == null) ERROR_HANDLER.throw("unregisteredContent", nameMod + "-" + name);
    return statCateg;
  };


  /**
   * Gets a shader by name.
   * This can return null if it fails to compile the shader.
   * @global
   * @param {string} name
   * @return {Shader|null}
   */
  fetchShader = function(name) {
    let shader = global.lovecUtil.db.shader[name];
    // Shader is nullable
    if(shader === undefined) ERROR_HANDLER.throw("unregisteredContent", name);
    return shader;
  };


  /**
   * Gets a cache layer by name.
   * @global
   * @param {string} name
   * @return {CacheLayer}
   */
  fetchCacheLayer = function(name) {
    let cacheLay = global.lovecUtil.db.cacheLayer[name];
    if(cacheLay == null) ERROR_HANDLER.throw("unregisteredContent", name);
    return cacheLay;
  };


  /**
   * Gets a weapon template by name and build it with `paramObj`.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {Weapon}
   */
  fetchWeapon = function(name, paramObj) {
    let temp = global.lovecUtil.db.weaponTemplate.read(name);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", name);
    return temp.build(paramObj);
  };


  /**
   * Gets a bullet type template by name and build it with `paramObj`.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {BulletType}
   */
  fetchBullet = function(name, paramObj) {
    let temp = global.lovecUtil.db.bulletTemplate.read(name);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", name);
    return temp.build(paramObj);
  };


  /**
   * Gets a part template by name and build it with `paramObj`.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {DrawPart}
   */
  fetchPart = function(name, paramObj) {
    let temp = global.lovecUtil.db.partTemplate.read(name);
    if(temp == null) ERROR_HANDLER.throw("noTemplateFound", name);
    return temp.build(paramObj);
  };


  /**
   * Gets an ability by name.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {Ability|null}
   */
  fetchAbility = function(name, paramObj) {
    return global.lovecUtil.db.ability.read(name, Function.airNull)(paramObj);
  };


  /**
   * Gets an AI controller by name.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {AIController|null}
   */
  fetchAi = function(name, paramObj) {
    return global.lovecUtil.db.ai.read(name, Function.airNull)(paramObj);
  };


  /**
   * Gets a shoot pattern by name.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {ShootPattern|null}
   */
  fetchShootPattern = function(name, paramObj) {
    return global.lovecUtil.db.shootPattern.read(name, Function.airNull)(paramObj);
  };


  /**
   * Gets a drawer by name.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {DrawBlock|null}
   */
  fetchDrawer = function(name, paramObj) {
    return global.lovecUtil.db.drawer.read(name, Function.airNull)(paramObj);
  };


  /**
   * Gets a consumer by name.
   * @global
   * @param {string} name
   * @param {Object|unset} [paramObj]
   * @return {Consume|null}
   */
  fetchConsumer = function(name, paramObj) {
    return global.lovecUtil.db.consumer.read(name, Function.airNull)(paramObj);
  };


  /**
   * Gets a dialog by name.
   * @global
   * @param {string} name
   * @return {Dialog}
   */
  fetchDialog = function(name) {
    return global.lovecUtil.db.dialog.read(name, global.lovecUtil.db.dialog.read("def"));
  };


  /**
   * Gets a dialog flow by name (as data array).
   * @global
   * @param {string} name
   * @return {Array}
   */
  fetchDialogFlow = function(name) {
    return global.lovecUtil.db.dialFlow.read(name, Array.air);
  };


  /**
   * Gets a setting value by name.
   * The setting must be registered through {@link CLS_settingTerm}.
   * @global
   * @param {string} name
   * @param {boolean|unset} [useScl] - If true, the result will be scaled.
   * @return {any}
   */
  fetchSetting = function(name, useScl) {
    let setting = global.lovecUtil.db.settingTerm.read(name);
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
   * @param {string} nameMod
   * @param {string} name
   * @param {StatCat|unset} [statCateg]
   * @return {void}
   */
  newStat = function(nameMod, name, statCateg) {
    if(global.lovecUtil.db.stat[nameMod] === undefined) global.lovecUtil.db.stat[nameMod] = {};
    global.lovecUtil.db.stat[nameMod][name] = new Stat(nameMod + "-stat-" + name, tryVal(statCateg, StatCat.function));
  };


  /**
   * Registers a new stat unit.
   * @global
   * @param {string} nameMod
   * @param {string} name
   * @param {any} param
   * @return {void}
   */
  newStatUnit = function(nameMod, name, param) {
    if(global.lovecUtil.db.statUnit[nameMod] === undefined) global.lovecUtil.db.statUnit[nameMod] = {};
    global.lovecUtil.db.statUnit[nameMod][name] = param == null ?
      new StatUnit(nameMod + "-stat0unit-" + name) :
      new StatUnit(nameMod + "-stat0unit-" + name, param);
  };


  /**
   * Registers a new stat category.
   * @global
   * @param {string} nameMod
   * @param {string} name
   * @return {void}
   */
  newStatCategory = function(nameMod, name) {
    if(global.lovecUtil.db.statCategory[nameMod] === undefined) global.lovecUtil.db.statCategory[nameMod] = {};
    global.lovecUtil.db.statCategory[nameMod][name] = extend(StatCat, nameMod + "-" + name, {
      compareTo(statCateg) {
        return statCateg === StatCat.function ? -1 : this.super$compareTo(statCateg);
      },
    });
  };


  (function() {


    function throwDebugError() {
      if(Core.settings.getBool("lovec-test0error-shader", false)) ERROR_HANDLER.throw("debug", "shader");
    };
    function warnShaderLoadFail(name, err) {
      console.warn("[LOVEC] Failed to load shader " + name.color(Pal.accent) + ":\n" + err);
    };


    /**
     * Registers a shader.
     * @global
     * @param {string} name
     * @param {function(): Shader} shaderGetter
     * @return {void}
     */
    newShader = function(name, shaderGetter) {
      let shader;
      try {
        throwDebugError();
        shader = shaderGetter();
      } catch(err) {
        shader = null;
        warnShaderLoadFail(name, err);
      };

      global.lovecUtil.db.shader[name] = shader;
    };


    /**
     * Registers a surface shader.
     * @global
     * @param {string} nameFrag
     * @return {void}
     */
    newSurfaceShader = function(nameFrag) {
      let shader;
      try {
        throwDebugError();
        shader = new Shaders.SurfaceShader(nameFrag);
      } catch(err) {
        shader = null;
        warnShaderLoadFail(nameFrag, err);
      };

      global.lovecUtil.db.shader[nameFrag] = shader;
    };


    /**
     * Registers a texture region shader.
     * @global
     * @param {string} nameFrag
     * @return {void}
     */
    newRegionShader = function(nameFrag) {
      let shader;
      try {
        throwDebugError();
        shader = extend(Shaders.LoadShader, nameFrag, "default", {


          region: new TextureRegion(),
          mulColor: new Color(),
          a: 1.0,
          off: 0.0,
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
        warnShaderLoadFail(nameFrag, err);
      };

      global.lovecUtil.db.shader[nameFrag] = shader;
    };


  })();


  /**
   * Registers a shader-based cache layer.
   * @global
   * @param {string} name
   * @param {Shader|null} shader
   * @param {CacheLayer|unset} [cacheLayFallback]
   * @return {void}
   */
  newCacheLayer = function(name, shader, cacheLayFallback) {
    let cacheLay = shader == null ? tryVal(cacheLayFallback, CacheLayer.normal) : new CacheLayer.ShaderLayer(shader);
    CacheLayer.add(cacheLay);
    global.lovecUtil.db.cacheLayer[name] = cacheLay;
  };


  /**
   * Registers a weapon template.
   * @global
   * @param {string} name
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newWeaponTemplate = function(name, tempGetter) {
    if(global.lovecUtil.db.weaponTemplate.includes(name)) return;
    global.lovecUtil.db.weaponTemplate.push(name, tempGetter());
  };


  /**
   * Registers a bullet template.
   * @global
   * @param {string} name
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newBulletTemplate = function(name, tempGetter) {
    if(global.lovecUtil.db.bulletTemplate.includes(name)) return;
    global.lovecUtil.db.bulletTemplate.push(name, tempGetter());
  };


  /**
   * Registers a part template.
   * @global
   * @param {string} name
   * @param {function(): Function} tempGetter
   * @return {void}
   */
  newPartTemplate = function(name, tempGetter) {
    if(global.lovecUtil.db.partTemplate.includes(name)) return;
    global.lovecUtil.db.partTemplate.push(name, tempGetter());
  };


  /**
   * Registers an ability.
   * @global
   * @param {string} name
   * @param {function(Object|unset): Ability} getter
   * @return {void}
   */
  newAbility = function(name, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.ability.includes(name)) return;
      global.lovecUtil.db.ability.push(name, getter);
    });
  };


  /**
   * Registers an AI controller.
   * @global
   * @param {string} name
   * @param {function(Object|unset): AIController} getter
   * @return {void}
   */
  newAi = function(name, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.ai.includes(name)) return;
      global.lovecUtil.db.ai.push(name, getter);
    });
  };


  /**
   * Registers a shoot pattern.
   * @global
   * @param {string} name
   * @param {function(Object|unset): ShootPattern} getter
   * @return {void}
   */
  newShootPattern = function(name, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.shootPattern.includes(name)) return;
      global.lovecUtil.db.shootPattern.push(name, getter);
    });
  };


  /**
   * Registers a target sorting function.
   * @global
   * @param {string} name
   * @param {function(Unit, number, number): number} costGetter
   * @return {void}
   */
  newSortF = function(name, costGetter) {
    global.lovecUtil.db.sortF[name] = extend(Units.Sortf, {cost(unit, x, y) {
      return costGetter(unit, x, y);
    }});
  };


  /**
   * Variant of {@link newSortF} that uses a property for cost calculation.
   * Larger value means less priority.
   * @global
   * @param {string} name
   * @param {function(Unit, number, number): number} propGetter
   * @return {void}
   */
  newPropSortF = function(name, propGetter) {
    newSortF(name, (unit, x, y) => propGetter(unit, x, y) + Mathf.dst2(unit.x, unit.y, x, y) / 6400.0);
  };


  /**
   * Variant of {@link newSortF} that mixes a series of sorting functions.
   * <br> <ARGS>: name, sortF1, sortF2, sortF3, ...
   * @global
   * @param {string} name
   * @return {void}
   */
  newMixSortF = function(name) {
    let sortFs = Array.from(arguments).splice(1);
    global.lovecUtil.db.sortF[name] = extend(Units.Sortf, {cost(unit, x, y) {
      return sortFs.sum(sortF => sortF.cost(unit, x, y));
    }});
  };


  /**
   * Registers a drawer.
   * @global
   * @param {string} name
   * @param {function(Object|unset): DrawBlock} getter
   * @return {void}
   */
  newDrawer = function(name, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.drawer.includes(name)) return;
      global.lovecUtil.db.drawer.push(name, getter);
    });
  };


  /**
   * Registers a consumer.
   * @global
   * @param {string} name
   * @param {function(Object|unset): Consume} getter
   * @return {void}
   */
  newConsumer = function(name, getter) {
    Events.on(ContentInitEvent, () => {
      if(global.lovecUtil.db.consumer.includes(name)) return;
      global.lovecUtil.db.consumer.push(name, getter);
    });
  };


  /**
   * Registers a dialog.
   * @global
   * @param {string} name
   * @param {function(): Dialog} getter
   * @return {void}
   */
  newDialog = function(name, getter) {
    Events.run(ClientLoadEvent, () => {
      if(global.lovecUtil.db.dialog.includes(name)) return;
      global.lovecUtil.db.dialog.push(name, getter());
    });
  };


  /**
   * Registers a key binding.
   * @global
   * @param {string} name
   * @param {KeyCode|unset} keyCodeDef
   * @param {string} categ
   * @param {function(Unit, Tile|null): void} scr - <ARGS>: unitPlayer, tMouse.
   * @return {void}
   */
  newKeyBind = function(name, keyCodeDef, categ, scr) {
    Events.run(ClientLoadEvent, () => {
      Core.app.post(() => {
        UTIL_keyBind.add(name, keyCodeDef, categ);
        let keyBind = UTIL_keyBind.get(name);
        if(global.lovecUtil.db.keyBindListener.includes(keyBind)) return;
        global.lovecUtil.db.keyBindListener.push(keyBind, scr);
      });
    });
  };


  /**
   * Registers a dialog flow.
   * @global
   * @param {string} name
   * @param {Array} dialFlowArr - See {@link CLS_dialogFlowBuilder}.
   * @return {void}
   */
  newDialogFlow = function(name, dialFlowArr) {
    Events.run(ContentInitEvent, () => {
      if(global.lovecUtil.db.dialFlow.includes(name)) return;
      global.lovecUtil.db.dialFlow.push(name, dialFlowArr);
    });
  };
