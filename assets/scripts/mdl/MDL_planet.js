/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to planet and sector.
   * @module lovec/mdl/MDL_planet
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /**
   * Gets a planet tile.
   * @param {PlanetGn} pla_gn
   * @param {number} secId
   * @return {PlanetGrid.PTile|null}
   */
  const _pTile = function(pla_gn, secId) {
    let pla = MDL_content._ct(pla_gn, "pla", true);
    return pla == null ?
      null :
      tryVal(pla.grid.tiles[secId], null);
  };
  exports._pTile = _pTile;


  /**
   * Variant of {@link _pTile} using sector preset.
   * @param {SectorGn} sec_gn
   * @return {PlanetGrid.PTile|null}
   */
  const _pTileBySec = function(sec_gn) {
    let sec = MDL_content._ct(sec_gn, "sec", true);
    return sec == null ?
      null :
      sec.sector.tile;
  };
  exports._pTileBySec = _pTileBySec;


  /**
   * Gets distance between two sectors.
   * @param {PlanetGn} pla_gn
   * @param {number} secId1
   * @param {number} secId2
   * @return {number}
   */
  const _dstSec = function(pla_gn, secId1, secId2) {
    let pla = MDL_content._ct(pla_gn, "pla", true);
    if(pla == null) return Number.n12;
    let pTile1 = _pTile(pla, secId1), pTile2 = _pTile(pla, secId2);
    if(pTile1 == null || pTile2 == null) return Number.n12;

    return Tmp.v31.set(pTile1.v).dst(pTile2.v) * pla.radius * Math.PI * 0.5;
  };
  exports._dstSec = _dstSec;


  /**
   * Variant of {@link _dstSec} using sector presets.
   * @param {SectorGn} sec1_gn
   * @param {SectorGn} sec2_gn
   * @return {number}
   */
  const _dstSecBySec = function(sec1_gn, sec2_gn) {
    let sec1 = MDL_content._ct(sec1_gn, "sec", true), sec2 = MDL_content._ct(sec2_gn, "sec", true);
    if(sec1 == null || sec2 == null || sec1.planet !== sec2.planet) return Number.n12;

    return _dstSec(pla, sec1.sector.id, sec2.sector.id);
  };
  exports._dstSecBySec = _dstSecBySec;
