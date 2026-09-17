/*
  ========================================
  Section: Definition
  ========================================
*/


    // Enable console
    Core.settings.put("console", true);


    // Log Lovec version in case that someone sends me a crash log from a very outdated version
    Log.info("[LOVEC] Current Lovec version: " + Vars.mods.locateMod("lovec").meta.version);


    // Load global scripts before everything
    (function() {
        function findGlbScr(mod) {
            let dir = mod.root.child("scripts");
            if(!dir.exists()) return null;
            let fiSeq = dir.findAll(fi => fi.name() === "globalScript.js");
            return fiSeq.size === 0 ? null : fiSeq.get(0);
        };
        function runGlbScr(mod) {
            let fi = findGlbScr(mod);
            if(fi == null) {
                Log.info("[LOVEC] No globalScript.js found for " + mod.meta.name.color(Pal.accent) + ".");
                return;
            };
            // Don't use `try` for loading global scripts, which makes debugging impossible
            Log.info("[LOVEC] Loading global script " + fi.path() + " for " + mod.meta.name + "...");
            Vars.mods.scripts.context.evaluateString(Vars.mods.scripts.scope, fi.readString(), fi.name(), 0);
        };

        // Lovec globalScript.js should always get loaded first
        runGlbScr(Vars.mods.locateMod("lovec"));
        Vars.mods.eachEnabled(mod => {
            if(mod.meta.name === "lovec") return;
            runGlbScr(mod);
        });

        // Initialize some global objects
        JAVA.init();
    })();


/*
  ========================================
  Section: Application
  ========================================
*/




    MDL_util.localizeModMeta("lovec");




    (function() {


        // Sync random number generator
        Object.eachPair(VAR.randInd, (name, ind) => {
            let rand = new Rand();
            TRIGGER.majorIter.start.addGlobalListener(() => {
                UTIL_rand.sync(ind, Number(rand.nextLong()));
            });
        });


        // Register global category for {@link UTIL_dragButtonInfoList}
        UTIL_dragButtonInfoList
        .add("achievement", () => fetchDialog("achievement").ex_show())
        .add("recipe-dictionary", () => fetchDialog("rcDictDatabase").ex_show());


        // Register custom fields for recipe dictionary
        DB_recipe.db["dict"]["customField"].forEachRow(2, (name, obj) => {
            MDL_recipeDict.newCustomField(name, obj);
        }, true);


    })();




    MDL_event.onInit(() => {


        // Initialize game window title
        if(!Vars.headless) {
            Core.graphics.setTitle("${1}${2}".format(fetchSetting("misc-title-name"), !fetchSetting("misc-title-map") ? "" : ": menu"));
        };


        // Map reading fallback addition
        DB_misc.db["block"]["migration"].forEachRow(2, (name_f, name_t) => SaveVersion.fallback.put(name_f, name_t), true);


        // Register custom W/R chunk
        SaveVersion.addCustomChunk("lovec-ext", extend(SaveFileReader.CustomChunk, {


            /** @type {number} */
            LCRevi: 0,
            /** @type {Array<Unit>} */
            tmpUnits: [],


            write(stream) {
                stream.writeShort(this.LCRevi);

                // Unit data
                stream.writeInt(UTIL_unitData.getUnitDataMap().size);
                UTIL_unitData.getUnitDataMap().each((unit, dataObj) => {
                    stream.writeFloat(unit.x);
                    stream.writeFloat(unit.y);
                    stream.writeUTF(unit.type.name);
                    stream.writeUTF(toJsonSafe(dataObj))
                });
                UTIL_unitData.getUnitDataMap().clear();
            },


            read(stream) {
                this.LCRevi = stream.readShort();

                let
                    i,
                    iCap,
                    unit;

                // Unit data
                i = 0;
                iCap = stream.readInt();
                while(i < iCap) {
                    let x = stream.readFloat();
                    let y = stream.readFloat();
                    let str = stream.readUTF();
                    let json = stream.readUTF();
                    i++;

                    Time.run(0.0, () => {
                        unit = LCEntity.getUnits(this.tmpUnits, x, y, 6.0).inSituFilter(ounit => ounit.type.name == str).first();
                        if(unit != null && unit.delegee != null && checkSubInsOfTemp(unit.type, "UNIT_baseUnit")) {
                            try {
                                unit.type.ex_readUnitData(unit, JSON.parse(json));
                            } catch(err) {
                                console.err("[LOVEC] Failed to parse unit data for ${1}, unexpected behavior can happen:\n".format(unit) + err);
                            };
                        };
                    });
                };

                console.log("[LOVEC] Loaded custom unit data.");
            },


        }));


        // Register graph methods
        DB_misc.db["block"]["graph"]["init"].forEachRow(2, (graphType, scr) => {
            UTIL_graph.setInit(graphType, scr);
        }, true);
        DB_misc.db["block"]["graph"]["update"].forEachRow(2, (graphType, scr) => {
            UTIL_graph.setUpdate(graphType, scr);
        }, true);


        // Set up major sync
        (function() {
            MDL_net.addPacketHandler(PacketModes.BOTH, "lovec-both-major-sync", payload => {
                TRIGGER.majorSync.fire();
            });
            let majorIterCount = 0;
            TRIGGER.majorIter.end.addGlobalListener(() => {
                if(!Vars.net.client() && Groups.player.size() > 1) {
                    majorIterCount++;
                    if(majorIterCount >= 6) {
                        majorIterCount = 0;
                        MDL_net.sendPacket(PacketModes.BOTH, "lovec-both-major-sync", "", true);
                    };
                };
            });
            MDL_event.onPlayerJoin(player => {
                Time.run(30.0, () => {
                    MDL_net.sendPacket(PacketModes.BOTH, "lovec-both-major-sync", "", true);
                });
            });
        })();


        // Set up ore dictionary, EXPERIMENTAL!
        if(PARAM.MODDED && fetchSetting("load-ore-dict")) {
            console.log("[LOVEC] Loading " + "ore dictionary".color(Pal.accent) + " settings...");
            if(!fetchSetting("load-ore-dict-def")) {
                console.log("[LOVEC] Skipped default lists for ore dictionary.");
            };

            let defaultDir = MDL_file.sharedData.child("ore-dict").child("default");
            let verCur = fetchMod("lovec").meta.version;
            let oreDict = global.lovecUtil.db.oreDict;

            // Create default files
            if(!defaultDir.exists() || defaultDir.list().length === 0 || (function() {
                let fi = defaultDir.child("meta.json");
                if(!fi.exists()) return true;
                let jsonVal = MDL_json.parse(fi);
                return MDL_json.fetch(jsonVal, "version") !== verCur;
            })()) {
                let fi;
                DB_recipe.db["oreDict"]["def"].forEachRow(2, (nameRs, arr) => {
                    fi = defaultDir.child(nameRs + ".csv");
                    MDL_file.writeCsv(fi, arr, 1);
                }, true);
                MDL_json.write(defaultDir.child("meta.json"), {
                    version: verCur,
                });
                MDL_file.writeTxt(defaultDir.child("README.txt"), "Do not put files here, which may get overwritten!\nCustomized lists should be in ./saves/mods/data/sharedData/ore-dict!");
            };

            // Set up ore dictionary
            let ct, rs;
            defaultDir
            .parent()
            .findAll(fi => fi.extension() === "csv" && (fetchSetting("load-ore-dict-def") || fi.parent() !== defaultDir))
            .each(fi => {
                ct = Vars.content.byName(fi.nameWithoutExtension());
                if(ct == null) return;
                MDL_file.readCsv(fi).forEachFast(nameRs => {
                    rs = Vars.content.byName(nameRs);
                    if(rs == null) return;
                    oreDict.put(rs, ct);
                }, true);
            });

            // Apply ore dictionary on items/liquids
            let rsRedir;
            Vars.content.items().each(item => {
                rsRedir = oreDict.get(item);
                if(rsRedir == null) return;
                item.stats.add(fetchStat("lovec", "spec-oredict"), newStatValue(tb => {
                    tb.row();
                    MDL_table.setCtRow(tb, rsRedir);
                }));
                rsRedir.shownPlanets.addAll(item.shownPlanets);
                rsRedir.databaseTabs.addAll(item.databaseTabs);
            });
            Vars.content.liquids().each(liq => {
                rsRedir = oreDict.get(liq);
                if(rsRedir == null) return;
                liq.stats.add(fetchStat("lovec", "spec-oredict"), newStatValue(tb => {
                    tb.row();
                    MDL_table.setCtRow(tb, rsRedir);
                }));
                rsRedir.shownPlanets.addAll(liq.shownPlanets);
                rsRedir.databaseTabs.addAll(liq.databaseTabs);
            });

            // Apply ore dictionary on blocks
            Vars.content.blocks().each(blk => {
                // Requirements
                blk.requirements.forEachFast(itemStack => {
                    itemStack.item = oreDict.get(itemStack.item, itemStack.item);
                }, true);
                Vars.content.planets().each(pla => pla.accessible && pla.isLandable(), pla => {
                    if(blk.requirements.some(itemStack => itemStack.item.isOnPlanet(pla))) {
                        blk.shownPlanets.add(pla);
                    };
                });
                blk.databaseTabs.addAll(blk.shownPlanets);

                // Drop
                if(blk.itemDrop != null) {
                    blk.itemDrop = oreDict.get(blk.itemDrop, blk.itemDrop);
                };
                if(blk.liquidDrop != null) {
                    blk.liquidDrop = oreDict.get(blk.liquidDrop, blk.liquidDrop);
                };

                // I/O
                let dictC;
                blk.consumers.forEachFast(blkCons => {
                    dictC = readTypeValArr(DB_recipe.db["oreDict"]["setter"]["consume"], blkCons);
                    if(dictC != null) {
                        dictC(blk, blkCons, oreDict);
                        blkCons.apply(blk);
                    };
                });
                dictC = readTypeValArr(DB_recipe.db["oreDict"]["setter"]["produce"], blk);
                if(dictC != null) {
                    dictC(blk, oreDict);
                };
            });

            // Apply ore dictionary on tech trees
            TechTree.all.each(node => {
                node.requirements.forEachFast(itemStack => {
                    itemStack.item = oreDict.get(itemStack.item, itemStack.item);
                });
            });
        };


    });




    MDL_event.onLoad(() => {


        // Menu flyer
        if(!Vars.headless && PARAM.MODDED && !fetchSetting("load-vanilla-flyer")) {
            try {
                Reflect.set(MenuRenderer, Reflect.get(Vars.ui.menufrag, "renderer"), "flyerType", MDL_content.getCt(DB_misc.db["mod"]["menuFlyer"].random(), ContentGetModes.UTP));
            } catch(err) {
                console.err("[LOVEC] Failed to modify the menu scene:\n" + err);
            };
        };


        // Load extra sounds
        if(!Vars.headless) {
            DB_misc.db["mod"]["extraSound"].forEachFast(seStr => Vars.tree.loadSound(seStr), true);

            Time.run(VAR.delay.load.loadExtraSound, () => {

                if(PARAM.SECRET_LEGACY_SOUND) {
                    try {
                        Vars.content.units().each(utp => {
                            if(utp.deathSound === Sounds.unitExplode1 || utp.deathSound === Sounds.unitExplode2 || utp.deathSound === Sounds.unitExplode3) {
                                utp.deathSound = fetchSound("legacy-bang");
                            };
                        });
                        Vars.content.blocks().each(blk => {
                            if(blk.placeSound === Sounds.blockPlace1 || blk.placeSound === Sounds.blockPlace2 || blk.placeSound === Sounds.blockPlace3) {
                                blk.placeSound = fetchSound("legacy-place");
                            };
                            if(blk.breakSound === Sounds.blockBreak1 || blk.breakSound === Sounds.blockBreak2 || blk.breakSound === Sounds.blockBreak3) {
                                blk.breakSound = fetchSound("legacy-break");
                            };
                            if(
                                blk.destroySound === Sounds.blockExplode1 || blk.destroySound === Sounds.blockExplode1Alt || blk.destroySound === Sounds.blockExplode2 || blk.destroySound === Sounds.blockExplode2Alt || blk.destroySound === Sounds.blockExplode3
                                    || blk.destroySound === Sounds.blockExplodeElectric || blk.destroySound === Sounds.blockExplodeElectricBig
                                    || blk.destroySound === Sounds.blockExplodeExplosive || blk.destroySound === Sounds.blockExplodeExplosiveAlt
                                    || blk.destroySound === Sounds.blockExplodeFlammable
                                    || blk.destroySound === Sounds.blockExplodeWall
                            ) {
                                blk.destroySound = fetchSound("legacy-boom");
                            };
                        });
                        Sounds.loopBuild = fetchSound("legacy-build");
                    } catch(err) {
                        console.err("[LOVEC] Failed to load legacy sounds:\n" + err);
                    };
                };

                if(PARAM.SECRET_FITH) {
                    let pitchBase;
                    function fireInTheHole(wp) {
                        wp.shootSound = fetchSound("se-meme-fith");
                        pitchBase = Mathf.lerp(1.8, 0.5, Interp.pow2Out.apply(Mathf.clamp(wp.reload / 100.0)));
                        wp.soundPitchMin = pitchBase - 0.1;
                        wp.soundPitchMax = pitchBase + 0.1;
                    };
                    Vars.content.units().each(utp => {
                        utp.deathSound = fetchSound("se-meme-fith");
                        utp.weapons.each(wp => !wp.noAttack, wp => fireInTheHole(wp));
                    });
                    Vars.content.blocks().each(blk => {
                        blk.destroySound = fetchSound("se-meme-fith");
                        if(blk instanceof Turret) {
                            fireInTheHole(blk);
                        };
                    });
                };

                if(PARAM.SECRET_METAL_PIPE) {
                    Vars.content.blocks().each(blk => {
                        if(blk.placeSound === fetchSound("se-place-metal-pipe")) blk.placeSound = fetchSound("se-meme-steel-pipe");
                    });
                };
                Core.settings.put("lovec-misc-fire-in-the-hole", PARAM.SECRET_FITH);

            });
        };


        // Load sector icons
        if(!Vars.headless) {
            let reg;
            Vars.content.sectors().each(sec => {
                reg = Core.atlas.find(sec.name + "-full", Core.atlas.find(sec.name + "-icon", Core.atlas.find(sec.name)));
                if(!reg.found()) return;
                sec.fullIcon = sec.uiIcon = reg;
            });
        };


        // Set up name colors
        if(!Vars.headless && fetchSetting("load-colored-name")) {
            Core.app.post(() => {
                function fetchColor(rs) {
                    let lightness = LCRgb.calcLightness(rs.color);
                    return lightness < 0.1 ?
                        Tmp.c1.set(Color.white) :
                        Tmp.c1.set(rs.color).mul(
                            lightness > 0.75 ?
                                1.0 :
                                lightness > 0.45 ?
                                    VAR.param.ctNameColorMtp :
                                    VAR.param.ctNameColorMtpHigh
                        );
                };

                VARGEN.allRss.forEachFast(rs => rs.localizedName = rs.localizedName.color(fetchColor(rs)), true);
                VARGEN.factionBlksMap.each((faction, cts) => cts.forEachFast(ct => ct.localizedName = ct.localizedName.color(MDL_content.getFactionColor(Tmp.c1, faction)), true));
            });
        };


        // Set up recipe dictionary stat
        Time.run(VAR.delay.load.addStat, () => {
            VARGEN.allRss
            .concat(VARGEN.payMatBlks)
            .concat(VARGEN.buildableUtps)
            .forEachFast(ct => {
                VARGEN.rcDictCts.push(ct);
                // Complete broken in 160 due to `computeStats`
                /*ct.stats.add(fetchStat("lovec", "spec-fromto"), newStatValue(tb => {
                  tb.row();
                  MDL_table.btnSmall(tb, "?", () => fetchDialog("rcDict").ex_show(ct.localizedName, ct, false)).left().padLeft(28.0).row();
                }));*/
            }, true);
        });


        // Set up node root names
        if(!Vars.headless) {
            let nameCt;
            TechTree.roots.each(rt => {
                nameCt = DB_env.db["nodeRootNameMap"].read(rt.name);
                if(nameCt != null) {
                    let ct = MDL_content.getCt(nameCt, null, true);
                    if(ct != null) {
                        rt.name = ct.localizedName;
                    };
                };
            });
        };


        // Set up status effects
        (function() {

            // Robot-only status
            DB_status.db["group"]["robotOnly"]
            .map(nameSta => MDL_content.getCt(nameSta, ContentGetModes.STA, true))
            .compact()
            .forEachFast(sta => {
                sta.stats.add(fetchStat("lovec", "sta-robotonly"), true);
                VARGEN.bioticUtps.forEachFast(utp => utp.immunities.add(sta), true);
            }, true);

            // Oceanic status
            DB_status.db["group"]["oceanic"]
            .map(nameSta => MDL_content.getCt(nameSta, ContentGetModes.STA, true))
            .compact()
            .forEachFast(sta => {
                VARGEN.navalUtps.forEachFast(utp => utp.immunities.add(sta), true);
            }, true);

            // Missile immunities
            DB_status.db["group"]["missileImmune"]
            .map(nameSta => MDL_content.getCt(nameSta, ContentGetModes.STA, true))
            .pushAll(VARGEN.deathStas)
            .compact()
            .forEachFast(sta => {
                VARGEN.missileUtps.forEachFast(utp => utp.immunities.add(sta), true);
            }, true);

        })();


        // Set up faction
        (function() {
            function setFaction(ct) {
                if(MDL_content.getFaction(ct) !== "none") ct.stats.add(fetchStat("lovec", "spec-faction"), newStatValue(tb => {
                    tb.row();
                    MDL_table.setFaction(tb, ct);
                }));
            };

            Vars.content.blocks().each(blk => setFaction(blk));
            Vars.content.units().each(utp => setFaction(utp));
        })();


        // Set up planet rules
        (function() {
            let pla;
            DB_env.db["map"]["rule"]["campaign"].forEachRow(2, (namePla, ruleM) => {
                pla = MDL_content.getCt(namePla, ContentGetModes.PLA);
                if(pla == null) return;
                let campaignRules = new CampaignRules();
                ruleM(campaignRules);
                pla.campaignRules = campaignRules;
            }, true);
            DB_env.db["map"]["rule"]["planet"].forEachRow(2, (namePla, ruleM) => {
                pla = MDL_content.getCt(namePla, ContentGetModes.PLA);
                if(pla == null) return;
                pla.ruleSetter = cons(ruleM);
            }, true);
        })();


        // Initialize miscellaneous things
        (function() {
            // Settings
            Core.settings.put("lovec-window-show", true);

            // Damage text modes
            new CLS_damageTextMode("health", team => team === Team.derelict ? Color.white : team.color);
            new CLS_damageTextMode("shield", team => Pal.techBlue, str => "<" + str + ">");
            new CLS_damageTextMode("heal", team => Pal.heal, str => "+" + str);
            new CLS_damageTextMode("heat", team => Color.orange, str => "^" + str);

            // Draggable button
            if(!Vars.headless) {
                new CLS_dragButton().add();
            };

            // Terrain types
            batchCall(MDL_terrain, function() {
                this.newTerF("dirt", ["dirt", "grass"]);
                this.newTerF("rock", ["gravel", "rock"]);
                this.newTerF("salt", ["salt"]);
                this.newTerF("sand", ["gravel", "sand"]);
                this.newTerF("snow", ["grass", "ice", "snow"]);
                this.newTerF("lava", ["lava"]);
                this.newTerF("puddle", ["puddle"]);
                this.newTerF("river", ["river"]);
                this.newTerF("sea", ["sea"]);

                this.newBankTerF("bank", "river");
                this.setBankTerMatGrps("bank", [
                    "dirt", "grass",
                    "sand", "gravel", "rock", "salt",
                    "ice", "snow",
                ]);
                this.newBankTerF("beach", "sea");
                this.setBankTerMatGrps("beach", [
                    "sand", "gravel", "rock", "salt",
                    "ice", "snow",
                ]);
            });
        })();


        // Set up debug stats
        if(global.lovecUtil.prop.debug) {
            PlanetDialog.debugSelect = true;
            PlanetDialog.debugShowNumbers = true;

            // Completely brocken in 160 due to `computeStats`
            /*[
                Vars.content.items(),
                Vars.content.liquids(),
                Vars.content.blocks(),
                Vars.content.units(),
                Vars.content.statusEffects(),
                Vars.content.weathers(),
                Vars.content.sectors(),
            ]
            .forEachFast(seq => {
                seq.each(ct => {
                    ct.stats.add(fetchStat("lovec", "debug-copyname"), newStatValue(tb => {
                        tb.row();
                        MDL_table.btnSmall(tb, "C", () => {
                            Core.app.setClipboardText(ct.name);
                            MDL_ui.showFadeInfo("lovec", "copy-name");
                        })
                        .left()
                        .padLeft(28.0);
                    }));
                });
            });*/
        };


        // Add database buttons
        MDL_util.addDatabaseButton(
            MDL_bundle.getInfo("lovec", "dial-rc-database"),
            () => fetchDialog("rcDatabase").ex_show(),
        );


        // Screw it
        if(!PARAM.MODDED && fetchMod("projreind") != null) {
            throw new Error("PARAM.MODDED is broken again, WTF D:");
        };


    });




    MDL_event.onWorldLoad(() => {


        Time.run(VAR.delay.worldLoad.triggerSecretCrash, () => {
            if(Core.settings.getBool("lovec-misc-secret-code-crashed", false)) {
                TRIGGER.secretCodeCrash.fire();
            };
        });


    });
