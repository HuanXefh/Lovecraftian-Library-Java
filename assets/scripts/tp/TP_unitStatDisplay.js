/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Registers health bar styles.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  new CLS_unitStatDisplayMode("default", function(
    e, x, y, frac,
    color, a, w, offY, amtSeg,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
    let a_fi = a * 0.7;

    let zPrev = Draw.z();
    Draw.z(z);

    Lines.stroke(10.0, Pal.gray);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5 + 2.5, y + offY + 2.5, x + w * 0.5 - 2.5, y + offY + 2.5);
    Lines.stroke(3.0, color);
    Draw.alpha(a_fi * 0.3);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y + offY);

    let segW = (w + 5.0) / (amtSeg + 1);
    Lines.stroke(1.0, Pal.gray);
    Draw.alpha(a_fi);
    let x_i, y1_i, y2_i;
    for(let i = 0; i < amtSeg; i++) {
      x_i = x - w * 0.5 - 2.5 + segW * (i + 1);
      y1_i = y + offY + 2.0;
      y2_i = y + offY - 2.0;

      Lines.line(x_i, y1_i, x_i, y2_i);
    };
    Draw.reset();

    if(armor != null) {
      LCDraw.text(
        x, y, Strings.autoFixed(armor, 0), Fonts.def,
        1.2, Color.gray, Align.right,
        -w * 0.5 - 4.0,
        offY + 4.5,
      );
    };
    if(shield != null && shield > 0.0) {
      LCDraw.text(
        x, y, Strings.autoFixed(shield, 0), Fonts.def,
        1.2, Pal.techBlue, Align.left,
        w * 0.5 + 4.0,
        offY + 4.5,
      );
    };
    LCDraw.text(
      x, y, Strings.autoFixed(e.maxHealth, 0), Fonts.def,
      0.8, color, Align.center,
      0.0, offY + 6.0,
    );
    if(speedMtp != null && w >= 32.0) {
      LCDraw.text(
        x, y, "S: " + Strings.fixed(speedMtp, 2), Fonts.def,
        0.6, Color.gray, Align.left,
        -w * 0.5 - 2.5,
        offY + 5.0,
      );
    };
    if(dpsMtp != null && w >= 32.0) {
      LCDraw.text(
        x, y, "D: " + Strings.fixed(dpsMtp, 2), Fonts.def,
        0.6, Color.gray, Align.right,
        w * 0.5 + 2.5,
        offY + 5.0,
      );
    };

    if(e instanceof Unit) MDL_draw._d_stackSta(e);

    Draw.z(zPrev);
  });


  new CLS_unitStatDisplayMode("simple", function(
    e, x, y, frac,
    color, a, w, offY, amtSeg,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
    let a_fi = a * 0.7;

    let zPrev = Draw.z();
    Draw.z(z);

    Lines.stroke(5.0, Pal.gray);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Lines.stroke(3.0, color);
    Draw.alpha(a_fi * 0.3);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y + offY);

    let segW = (w + 5.0) / (amtSeg + 1);
    Lines.stroke(1.0, Pal.gray);
    Draw.alpha(a_fi);
    let x_i, y1_i, y2_i;
    for(let i = 0; i < amtSeg; i++) {
      x_i = x - w * 0.5 - 2.5 + segW * (i + 1);
      y1_i = y + offY + 2.0;
      y2_i = y + offY - 2.0;

      Lines.line(x_i, y1_i, x_i, y2_i);
    };
    Draw.reset();

    if(armor != null) {
      LCDraw.text(
        x, y, Strings.autoFixed(armor, 0), Fonts.def,
        1.2, Color.gray, Align.right,
        -w * 0.5 - 4.0,
        offY + 2.5,
      );
    };
    if(shield != null && shield > 0.0) {
      LCDraw.text(
        x, y, Strings.autoFixed(shield, 0), Fonts.def,
        1.2, Pal.techBlue, Align.left,
        w * 0.5 + 4.0,
        offY + 2.75,
      );
    };

    if(e instanceof Unit) MDL_draw._d_stackSta(e);

    Draw.z(zPrev);
  });


  new CLS_unitStatDisplayMode("minimalistic", function(
    e, x, y, frac,
    color, a, w, offY, amtSeg,
    armor, shield, speedMtp, dpsMtp,
    z
  ) {
    let a_fi = a * 0.7;
    offY = offY - 4.0;

    let zPrev = Draw.z();
    Draw.z(z);

    Lines.stroke(3.5, Pal.gray);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Lines.stroke(2.5, color);
    Draw.alpha(a_fi * 0.3);
    Lines.line(x - w * 0.5, y + offY, x + w * 0.5, y + offY);
    Draw.alpha(a_fi);
    Lines.line(x - w * 0.5, y + offY, Mathf.lerp(x - w * 0.5, x + w * 0.5, frac), y + offY);

    if(e instanceof Unit) MDL_draw._d_stackSta(e);

    Draw.z(zPrev);
  });
