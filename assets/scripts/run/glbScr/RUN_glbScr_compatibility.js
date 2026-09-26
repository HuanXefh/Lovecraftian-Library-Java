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
    LCCompatibilityHandler = fetchClass("lovec.utils.LCCompatibilityHandler");


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


    if(LCCompatibilityHandler.isV8) {
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

        Objective = eval("Objectives.Objective");
        Research = eval("Objectives.Research");
        Produce = eval("Objectives.Research");
        OnPlanet = eval("Objectives.OnPlanet");
        OnSector = eval("Objectives.OnSector");
        SectorComplete = eval("Objectives.SectorComplete");
    } else {
        Objective = eval("UnlockCondition");
    };
