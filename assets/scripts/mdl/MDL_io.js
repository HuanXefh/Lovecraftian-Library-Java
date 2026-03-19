/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Handles read/write for some objects.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Writes a string-number object.
   * @param {Writes} wr
   * @param {Object<string, number>} obj
   * @return {void}
   */
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


  /**
   * Reads a string-number object.
   * @param {Reads} rd
   * @param {Object} obj
   * @return {Object<string, number>}
   */
  const _rd_objStrNum = function(rd, obj) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      obj[rd.str()] = rd.f();
      i++;
    };

    return obj;
  };
  exports._rd_objStrNum = _rd_objStrNum;


  /**
   * Writes a string-string object.
   * @param {Writes} wr
   * @param {Object<string, string>} obj
   * @return {void}
   */
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


  /**
   * Reads a string-string object.
   * @param {Reads} rd
   * @param {Object} obj
   * @return {Object<string, string>}
   */
  const _rd_objStrStr = function(rd, obj) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      obj[rd.str()] = rd.str();
      i++;
    };

    return obj;
  };
  exports._rd_objStrStr = _rd_objStrStr;


  /**
   * Writes an array of integers.
   * @param {Writes} wr
   * @param {Array<number>} ints
   * @return {void}
   */
  const _wr_ints = function(wr, ints) {
    let i = 0, iCap = ints.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.i(ints[i]);
      i++;
    };
  };
  exports._wr_ints = _wr_ints;


  /**
   * Reads an array of integers.
   * @param {Reads} rd
   * @param {Array} ints
   * @return {Array<number>}
   */
  const _rd_ints = function(rd, ints) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      ints[i] = rd.i();
      i++;
    };

    return ints;
  };
  exports._rd_ints = _rd_ints;


  /**
   * Writes an array of floats.
   * @param {Writes} wr
   * @param {Array<number>} fs
   * @return {void}
   */
  const _wr_fs = function(wr, fs) {
    let i = 0, iCap = fs.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.i(fs[i]);
      i++;
    };
  };
  exports._wr_fs = _wr_fs;


  /**
   * Reads an array of floats.
   * @param {Reads} rd
   * @param {Array<number>} fs
   * @return {Array<number>}
   */
  const _rd_fs = function(rd, fs) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      fs[i] = rd.f();
      i++;
    };

    return fs;
  };
  exports._rd_fs = _rd_fs;


  /* <---------- Arc ----------> */


  /**
   * Writes an Arc color.
   * @param {Writes} wr
   * @param {Color} color
   * @return {void}
   */
  const _wr_color = function(wr, color) {
    wr.i(color.rgba8888());
  };
  exports._wr_color = _wr_color;


  /**
   * Reads an Arc color.
   * @param {Reads} rd
   * @return {Color}
   */
  const _rd_color = function(rd) {
    return new Color(rd.i());
  };
  exports._rd_color = _rd_color;


  /**
   * Writes an Arc 2D point.
   * @param {Writes} wr
   * @param {Point2} pon2
   * @return {void}
   */
  const _wr_pon2 = function(wr, pon2) {
    wr.i(pon2.pack());
  };
  exports._wr_pon2 = _wr_pon2;


  /**
   * Reads an Arc 2D point.
   * @param {Reads} rd
   * @return {Point2}
   */
  const _rd_pon2 = function(rd) {
    return Point2.unpack(rd.i());
  };
  exports._rd_pon2 = _rd_pon2;


  /**
   * Writes an array of Arc 2D points.
   * @param {Writes} wr
   * @param {Array<Point2>} pon2s
   * @return {void}
   */
  const _wr_pon2s = function(wr, pon2s) {
    let i = 0, iCap = pon2s.iCap();
    wr.i(iCap);
    while(i < iCap) {
      _wr_pon2(wr, pon2s[i]);
      i++;
    };
  };
  exports._wr_pon2s = _wr_pon2s;


  /**
   * Reads an array of Arc 2D points.
   * @param {Reads} rd
   * @param {Array} pon2s
   * @return {Array<Point2>}
   */
  const _rd_pon2s = function(rd, pon2s) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      pon2s.push(_rd_pon2(rd));
      i++;
    };

    return pon2s;
  };
  exports._rd_pon2s = _rd_pon2s;


  /**
   * Writes an Arc 2D vector.
   * @param {Writes} wr
   * @param {Vec2} vec2
   * @return {void}
   */
  const _wr_vec2 = function(wr, vec2) {
    wr.f(vec2.x);
    wr.f(vec2.y);
  };
  exports._wr_vec2 = _wr_vec2;


  /**
   * Reads an Arc 2D vector.
   * @param {Reads} rd
   * @return {Vec2}
   */
  const _rd_vec2 = function(rd) {
    return new Vec2(rd.f(), rd.f());
  };
  exports._rd_vec2 = _rd_vec2;


  /**
   * Writes an Arc 3D vector.
   * @param {Writes} wr
   * @param {Vec3} vec3
   * @return {void}
   */
  const _wr_vec3 = function(wr, vec3) {
    wr.f(vec3.x);
    wr.f(vec3.y);
    wr.f(vec3.z);
  };
  exports._wr_vec3 = _wr_vec3;


  /**
   * Reads an Arc 3D vector.
   * @param {Reads} rd
   * @return {Vec3}
   */
  const _rd_vec3 = function(rd) {
    return new Vec3(rd.f(), rd.f(), rd.f());
  };
  exports._rd_vec3 = _rd_vec3;


  /* <---------- content ----------> */


  /**
   * Writes a content.
   * @param {Writes} wr
   * @param {UnlockableContent|null} ct
   * @return {void}
   */
  const _wr_ct = function(wr, ct) {
    wr.str(ct == null ? "null" : ct.name);
  };
  exports._wr_ct = _wr_ct;


  /**
   * Reads a content.
   * @param {Reads} rd
   * @return {UnlockableContent|null}
   */
  const _rd_ct = function(rd) {
    return MDL_content._ct(rd.str(), null, true);
  };
  exports._rd_ct = _rd_ct;


  /**
   * Writes an array of contents.
   * @param {Writes} wr
   * @param {Array<UnlockableContent|null>} cts
   * @return {void}
   */
  const _wr_cts = function(wr, cts) {
    let i = 0, iCap = cts.iCap();
    wr.i(iCap);
    while(i < iCap) {
      wr.str(cts[i] == null ? "null" : cts[i].name);
      i++;
    };
  };
  exports._wr_cts = _wr_cts;


  /**
   * Reads an array of contents.
   * @param {Reads} rd
   * @param {Array} cts
   * @return {Array<UnlockableContent>}
   */
  const _rd_cts = function(rd, cts) {
    let i = 0, iCap = rd.i();
    while(i < iCap) {
      let ct = MDL_content._ct(rd.str(), null, true);
      if(ct != null) cts.pushUnique(ct);
      i++;
    };

    return cts;
  };
  exports._rd_cts = _rd_cts;


  /* <---------- Lovec ----------> */


  /**
   * Writes a Lovec math matrix.
   * @param {Writes} wr
   * @param {MathMatrix} mat
   * @return {void}
   */
  const _wr_mat = function(wr, mat) {
    let fs = mat.toArray().slice();
    fs.unshift(mat.getColAmt());
    _wr_fs(wr, fs);
  };
  exports._wr_mat = _wr_mat;


  /**
   * Reads a Lovec math matrix.
   * @param {Reads} rd
   * @return {MathMatrix}
   */
  const _rd_mat = function(rd) {
    let fs = _rd_fs(rd, []);
    return new MathMatrix(fs.chunk(fs.shift(), 0));
  };
  exports._rd_mat = _rd_mat;
