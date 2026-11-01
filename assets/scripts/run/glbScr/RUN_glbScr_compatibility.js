/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Handles compatibility issues between different Mindustry versions.
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /** @global */
    SLCVersionResolver = fetchClass("lovec.utils.SLCVersionResolver");


    /**
     * Handles `setStats` method for v8 compatibility.
     * <br> `setStats()` is replaced by `setStats(stats)` in v9, which sucks tbh.
     * @global
     * @param {UnlockableContent} ct
     * @param {Stats|unset} [stats]
     * @return {Stats}
     */
    getCtStats = function(ct, stats) {
        return stats == null ?
            ct.stats :
            stats;
    };


    /**
     * Handles `Env` for v8 compatibility.
     * <br> `ARGS`: envName1, envName2, envName3, ...
     * @global
     * @return {number|Environments}
     */
    getEnvSet = function() {
        if(SLCVersionResolver.isV8) {
            if(String(arguments[0]) === "any") {
                return -1;
            } else if(String(arguments[0]) === "none") {
                return 0;
            };

            let
                envInt = 0,
                i = 0,
                iCap = arguments.length,
                envName;
            while(i < iCap) {
                envName = String(arguments[i]);
                if(envName.equalsAny(
                    "terrestrial",
                    "space",
                    "underwater",
                    "spores",
                    "scorching",
                    "groundOil",
                    "groundWater",
                    "oxygen",
                )) {
                    envInt |= Env[envName];
                };
                i++;
            };
            return envInt;
        };

        if(String(arguments[0]) === "any") {
            return Environments.any;
        } else if(String(arguments[0] === "none")) {
            return Environments.none;
        };

        let envs = Array.from(arguments).inSituMap(arg => Env.get(String(arg))).compact();
        return Environments.of.apply(Environments, envs);
    };


    /**
     * Whether some `Env` is present.
     * @global
     * @param {number|Environments} envSet
     * @param {number|Env} env
     * @return {boolean}
     */
    includesEnv = function(envSet, env) {
        return SLCVersionResolver.isV8 ?
            (envSet & env) !== 0 :
            envSet.has(env);
    };


    if(SLCVersionResolver.isV8) {
        PlayerJoinEvent = EventType.PlayerJoin;
        PlayerConnectEvent = EventType.PlayerConnect;
        PlayerLeaveEvent = EventType.PlayerLeave;

        PackContext = null;

        LoadShader = Shaders.LoadShader;
        DarknessShader = Shaders.DarknessShader;
        LightShader = Shaders.LightShader;
        FogShader = Shaders.FogShader;
        DepthScreenspaceShader = null;
        MeshShader = Shaders.MeshShader;
        PlanetShader = Shaders.PlanetShader;
        AtmosphereShader = Shaders.AtmosphereShader;
        CloudShader = Shaders.CloudShader;
        PlanetGridShader = Shaders.PlanetGridShader;
        SpaceShader = Shaders.SpaceShader;
        SurfaceShader = Shaders.SurfaceShader;
        BlockBuildShader = Shaders.BlockBuildShader;
        UnitBuildShader = Shaders.UnitBuildShader;
        BuildBeamShader = Shaders.BuildBeamShader;
        ShieldShader = Shaders.ShieldShader;
        UnitArmorShader = Shaders.UnitArmorShader;
        ShockwaveShader = Shaders.ShockwaveShader;

        UnlockCondition = Objectives.Objective;
        Research = Objectives.Research;
        Produce = Objectives.Research;
        OnPlanet = Objectives.OnPlanet;
        OnSector = Objectives.OnSector;
        SectorComplete = Objectives.SectorComplete;

        MapObjective = MapObjectives.MapObjective;
        ResearchObjective = MapObjectives.ResearchObjective;
        ProduceObjective = MapObjectives.ProduceObjective;
        ItemObjective = MapObjectives.ItemObjective;
        CoreItemObjective = MapObjectives.CoreItemObjective;
        BuildCountObjective = MapObjectives.BuildCountObjective;
        UnitCountObjective = MapObjectives.UnitCountObjective;
        DestroyUnitsObjective = MapObjectives.DestroyUnitsObjective;
        TimerObjective = MapObjectives.TimerObjective;
        DestroyBlockObjective = MapObjectives.DestroyBlockObjective;
        DestroyBlocksObjective = MapObjectives.DestroyBlocksObjective;
        CommandModeObjective = MapObjectives.CommandModeObjective;
        FlagObjective = MapObjectives.FlagObjective;
        DestroyCoreObjective = MapObjectives.DestroyCoreObjective;
        ObjectiveMarker = MapObjectives.ObjectiveMarker;
        PosMarker = MapObjectives.PosMarker;
        ShapeTextMarker = MapObjectives.ShapeTextMarker;
        PointMarker = MapObjectives.PointMarker;
        ShapeMarker = MapObjectives.ShapeMarker;
        TextMarker = MapObjectives.TextMarker;
        LineMarker = MapObjectives.LineMarker;
        TextureMarker = MapObjectives.TextureMarker;
        QuadMarker = MapObjectives.QuadMarker;
        LightMarker = MapObjectives.LightMarker;
        TextureHolder = MapObjectives.TextureHolder;

        LogicSenseable = Senseable;
        LogicSettable = Settable;
        LogicControllable = Controllable;
        LogicProp = LAccess;
        LogicCategory = LCategory;
        LogicUnitControl = LUnitControl;
        LogicLocate = LLocate;
        LogicDrawable = LDrawable;
        LogicCanvas = LCanvas;
        LogicPrintable = LPrintable;
        LogicReadable = LReadable;
        LogicWritable = LWritable;
        LogicVar = LVar;
        LogicParser = LParser;
        LogicStatement = LStatement;
        LogicAssembler = LAssembler;
        LogicExecutor = LExecutor;
        LogicMarkerControl = LMarkerControl;

        Environments = null;

        ConsumeHeat = null;
    } else {
        JsonValue = null;

        MultiPacker = null;

        Objectives = null;

        Groups = null;

        HeatBlock = null;
        HeatConsumer = null;
        HeatProducer = null;
        HeatCrafter = null;
        HeaterGenerator = null;

        ArmoredConveyor = null;
        ArmoredConduit = null;
        AttributeCrafter = null;
        Fracker = null;
        SolidPump = null;
    };
