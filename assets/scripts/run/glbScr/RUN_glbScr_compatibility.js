/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Handles compatibility issues between different Mindustry versions.
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /** @global */
    LCVersionResolver = fetchClass("lovec.utils.LCVersionResolver");


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


    if(LCVersionResolver.isV8) {
        PlayerJoinEvent = eval(EventType.PlayerJoin);
        PlayerConnectEvent = eval(EventType.PlayerConnect);
        PlayerLeaveEvent = eval(EventType.PlayerLeave);

        LoadShader = eval("Shaders.LoadShader");
        DarknessShader = eval("Shaders.DarknessShader");
        LightShader = eval("Shaders.LightShader");
        FogShader = eval("Shaders.FogShader");
        DepthScreenspaceShader = null;
        MeshShader = eval("Shaders.MeshShader");
        PlanetShader = eval("Shaders.PlanetShader");
        AtmosphereShader = eval("Shaders.AtmosphereShader");
        CloudShader = eval("Shaders.CloudShader");
        PlanetGridShader = eval("Shaders.PlanetGridShader");
        SpaceShader = eval("Shaders.SpaceShader");
        SurfaceShader = eval("Shaders.SurfaceShader");
        BlockBuildShader = eval("Shaders.BlockBuildShader");
        UnitBuildShader = eval("Shaders.UnitBuildShader");
        BuildBeamShader = eval("Shaders.BuildBeamShader");
        ShieldShader = eval("Shaders.ShieldShader");
        UnitArmorShader = eval("Shaders.UnitArmorShader");
        ShockwaveShader = eval("Shaders.ShockwaveShader");

        UnlockCondition = eval("Objectives.Objective");
        Research = eval("Objectives.Research");
        Produce = eval("Objectives.Research");
        OnPlanet = eval("Objectives.OnPlanet");
        OnSector = eval("Objectives.OnSector");
        SectorComplete = eval("Objectives.SectorComplete");

        MapObjective = eval("MapObjectives.MapObjective");
        ResearchObjective = eval("MapObjectives.ResearchObjective");
        ProduceObjective = eval("MapObjectives.ProduceObjective");
        ItemObjective = eval("MapObjectives.ItemObjective");
        CoreItemObjective = eval("MapObjectives.CoreItemObjective");
        BuildCountObjective = eval("MapObjectives.BuildCountObjective");
        UnitCountObjective = eval("MapObjectives.UnitCountObjective");
        DestroyUnitsObjective = eval("MapObjectives.DestroyUnitsObjective");
        TimerObjective = eval("MapObjectives.TimerObjective");
        DestroyBlockObjective = eval("MapObjectives.DestroyBlockObjective");
        DestroyBlocksObjective = eval("MapObjectives.DestroyBlocksObjective");
        CommandModeObjective = eval("MapObjectives.CommandModeObjective");
        FlagObjective = eval("MapObjectives.FlagObjective");
        DestroyCoreObjective = eval("MapObjectives.DestroyCoreObjective");
        ObjectiveMarker = eval("MapObjectives.ObjectiveMarker");
        PosMarker = eval("MapObjectives.PosMarker");
        ShapeTextMarker = eval("MapObjectives.ShapeTextMarker");
        PointMarker = eval("MapObjectives.PointMarker");
        ShapeMarker = eval("MapObjectives.ShapeMarker");
        TextMarker = eval("MapObjectives.TextMarker");
        LineMarker = eval("MapObjectives.LineMarker");
        TextureMarker = eval("MapObjectives.TextureMarker");
        QuadMarker = eval("MapObjectives.QuadMarker");
        LightMarker = eval("MapObjectives.LightMarker");
        TextureHolder = eval("MapObjectives.TextureHolder");

        LogicSenseable = eval("Senseable");
        LogicSettable = eval("Settable");
        LogicControllable = eval("Controllable");
        LogicProp = eval("LAccess");
        LogicCategory = eval("LCategory");
        LogicUnitControl = eval("LUnitControl");
        LogicLocate = eval("LLocate");
        LogicDrawable = eval("LDrawable");
        LogicCanvas = eval("LCanvas");
        LogicPrintable = eval("LPrintable");
        LogicReadable = eval("LReadable");
        LogicWritable = eval("LWritable");
        LogicVar = eval("LVar");
        LogicParser = eval("LParser");
        LogicStatement = eval("LStatement");
        LogicAssembler = eval("LAssembler");
        LogicExecutor = eval("LExecutor");
        LogicMarkerControl = eval("LMarkerControl");
    };
