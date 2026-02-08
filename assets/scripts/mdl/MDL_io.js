/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles read/write for some objects.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_content = require("lovec/mdl/MDL_content");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an object that maps string to number.
   * ---------------------------------------- */
  const _wr_objStrNum = function(wr, obj) {
    let keys = Object.keys(obj);
    let i = 0, iCap = keys.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.str(String(keys[i]));
      wr.f(Number(obj[keys[i]]));
      i++;
    };
  };
  exports._wr_objStrNum = _wr_objStrNum;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an object that maps string to number.
   * ---------------------------------------- */
  const _rd_objStrNum = function(rd, obj) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      obj[rd.str()] = rd.f();
      i++;
    };
  };
  exports._rd_objStrNum = _rd_objStrNum;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an object with string only.
   * ---------------------------------------- */
  const _wr_objStrStr = function(wr, obj) {
    let keys = Object.keys(obj);
    let i = 0, iCap = keys.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.str(String(keys[i]));
      wr.str(String(obj[keys[i]]));
      i++;
    };
  };
  exports._wr_objStrStr = _wr_objStrStr;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an object with string only.
   * ---------------------------------------- */
  const _rd_objStrStr = function(rd, obj) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      obj[rd.str()] = rd.str();
      i++;
    };
  };
  exports._rd_objStrStr = _rd_objStrStr;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an array of integers.
   * ---------------------------------------- */
  const _wr_ints = function(wr, ints) {
    let i = 0, iCap = ints.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.i(ints[i]);
      i++;
    };
  };
  exports._wr_ints = _wr_ints;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an array of integers.
   * ---------------------------------------- */
  const _rd_ints = function(rd, ints) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      ints[i] = rd.i();
      i++;
    };
  };
  exports._rd_ints = _rd_ints;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an array of floats.
   * ---------------------------------------- */
  const _wr_fs = function(wr, fs) {
    let i = 0, iCap = fs.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.i(fs[i]);
      i++;
    };
  };
  exports._wr_fs = _wr_fs;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an array of floats.
   * ---------------------------------------- */
  const _rd_fs = function(rd, fs) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      fs[i] = rd.f();
      i++;
    };
  };
  exports._rd_fs = _rd_fs;


  /* <---------- arc ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an Arc color.
   * ---------------------------------------- */
  const _wr_color = function(wr, color) {
    wr.i(color.rgba8888());
  };
  exports._wr_color = _wr_color;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an Arc color.
   * ---------------------------------------- */
  const _rd_color = function(rd) {
    return new Color(rd.i());
  };
  exports._rd_color = _rd_color;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an Arc 2D point.
   * ---------------------------------------- */
  const _wr_pon2 = function(wr, pon2) {
    wr.i(pon2.pack());
  };
  exports._wr_pon2 = _wr_pon2;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an Arc 2D point.
   * ---------------------------------------- */
  const _rd_pon2 = function(rd) {
    return Point2.unpack(rd.i());
  };
  exports._rd_pon2 = _rd_pon2;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes a list of Arc 2D points.
   * ---------------------------------------- */
  const _wr_pon2s = function(wr, pon2s) {
    let i = 0, iCap = pon2s.iCap();
    wr.i(iCap);
    while(i < iCap) {
      _wr_pon2(wr, pon2s[i]);
      i++;
    };
  };
  exports._wr_pon2s = _wr_pon2s;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads a list of Arc 2D points.
   * ---------------------------------------- */
  const _rd_pon2s = function(rd, pon2s) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      pon2s.push(_rd_pon2(rd));
      i++;
    };
  };
  exports._rd_pon2s = _rd_pon2s;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an Arc 2D vector.
   * ---------------------------------------- */
  const _wr_vec2 = function(wr, vec2) {
    wr.f(vec2.x);
    wr.f(vec2.y);
  };
  exports._wr_vec2 = _wr_vec2;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an Arc 2D vector.
   * ---------------------------------------- */
  const _rd_vec2 = function(rd) {
    return new Vec2(rd.f(), rd.f());
  };
  exports._rd_vec2 = _rd_vec2;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an Arc 3D vector.
   * ---------------------------------------- */
  const _wr_vec3 = function(wr, vec3) {
    wr.f(vec2.x);
    wr.f(vec2.y);
    wr.f(vec2.z);
  };
  exports._wr_vec3 = _wr_vec3;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an Arc 3D vector.
   * ---------------------------------------- */
  const _rd_vec3 = function(rd) {
    return new Vec3(rd.f(), rd.f(), rd.f());
  };
  exports._rd_vec3 = _rd_vec3;


  /* <---------- content ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Writes a content.
   * ---------------------------------------- */
  const _wr_ct = function(wr, ct) {
    wr.str(ct == null ? "null" : ct.name);
  };
  exports._wr_ct = _wr_ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads a content.
   * ---------------------------------------- */
  const _rd_ct = function(rd) {
    return MDL_content._ct(rd.str(), null, true);
  };
  exports._rd_ct = _rd_ct;


  /* ----------------------------------------
   * NOTE:
   *
   * Writes an array of contents.
   * ---------------------------------------- */
  const _wr_cts = function(wr, cts) {
    let i = 0, iCap = cts.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.str(cts[i] == null ? "null" : cts[i].name);
      i++;
    };
  };
  exports._wr_cts = _wr_cts;


  /* ----------------------------------------
   * NOTE:
   *
   * Reads an array of contents.
   * ---------------------------------------- */
  const _rd_cts = function(rd, cts) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      let ct = MDL_content._ct(rd.str(), null, true);
      if(ct != null) cts.pushUnique(ct);
      i++;
    };
  };
  exports._rd_cts = _rd_cts;
