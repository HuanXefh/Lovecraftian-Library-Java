/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * A draggable group of buttons.
   * New buttons are registered in {@link DB_misc}.
   * @class
   */
  const CLS_dragButton = newClass().initClass();


  CLS_dragButton.prototype.init = function() {
    this.isHidden = false;
    this.isLoaded = false;
    /**
     * <TUP>: nm, icon, isToggle, clickScr, updateScr
     * @type {Array<Array<[string|null, BaseDrawable, boolean, Function, Function]>>}
     */
    this.btnData = [
      [], [], [], [], [],
      [], [], [], [], [],
      [], [], [], [], [],
    ];
    this.colCounts = [
      0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
    ];

    this.prefW = 0.0;
    this.timeScl = 1.0;

    this.root = (function() {
      let tb = new Table();
      tb.visibility = () => Vars.ui.hudfrag.shown;
      return tb;
    })();

    this.load();

    TRIGGER.mapChange.addGlobalListener(nmMap => {
      this.timeScl = 1.0;
      Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
      this.rebuild();
    });
  };


  let mouseMoveX = 0.0, mouseMoveY = 0.0, mouseMoveStartX = 0.0, mouseMoveStartY = 0.0;
  MDL_event._c_onDrag((dx, dy, x_f, y_f) => {
    mouseMoveX = dx;
    mouseMoveY = dy;
    mouseMoveStartX = x_f;
    mouseMoveStartY = y_f;
  }, 24998751);
  MDL_event._c_onUpdate(() => {
    addedGrps.forEachFast(grp => grp.update());
  }, 64221902);


  const btnSize = 42.0;
  const addedGrps = [];


  function checkCanControlTime() {
    return Vars.state.isGame() && Groups.player.size() === 1 && !Vars.state.getPlanet().campaignRules.pauseDisabled;
  };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Loads data for the group.
   * @return {void}
   */
  CLS_dragButton.prototype.load = function() {
    if(Vars.headless || this.isLoaded) return;

    (function() {
      let obj = DB_misc.db["mod"]["dragButton"];
      return !PARAM.MODDED ?
        obj["base"] :
        obj["base"].concat(obj["modded"]);
    })()
    .forEachRow(2, (nm, paramObj) => {
      let rowInd = readParam(paramObj, "rowInd", 0);
      if(rowInd >= this.btnData.length) ERROR_HANDLER.throw("indexOutOfBound", rowInd, this.btnData.length);

      this.btnData[rowInd].push([
        !Core.bundle.has("drag." + nm) ? null : Core.bundle.get("drag." + nm),
        (function() {let icon, iconStr = readParam(paramObj, "icon", "error"); try {icon = Icon[iconStr]} catch(err) {icon = new TextureRegionDrawable(Core.atlas.find(iconStr))}; return icon})(),
        readParam(paramObj, "isToggle", false),
        readParam(paramObj, "clickScr", Function.air),
        readParam(paramObj, "updateScr", null),
      ]);
    });
    this.isLoaded = true;
  };


  /**
   * Rebuilds the group.
   * @return {void}
   */
  CLS_dragButton.prototype.rebuild = function() {
    this.root.clearChildren();
    const btns = this.root.table(Styles.black3, tb => tb.left()).left().get();
    this.root.left().top().row();

    this.colCounts.setVal(0);

    // Drag button
    this.colCounts[0]++;
    btns.button(Icon.move, Styles.cleari, () => {}).size(btnSize).get().dragged((dx, dy) => {
      this.root.translation.x += mouseMoveX;
      this.root.translation.y += mouseMoveY;
    });

    // Collapser button
    this.colCounts[0]++;
    btns.button(this.isHidden ? Icon.downOpen : Icon.upOpen, Styles.cleari, () => {
      this.isHidden = !this.isHidden;
      this.rebuild();
    }).size(btnSize);

    // Loaded buttons
    btns.row();
    if(!this.isHidden) {
      let i = 0, iCap = this.btnData.iCap(), btnCell;
      while(i < iCap) {
        this.btnData[i].forEachFast(tup => {
          this.colCounts[i + 1]++;
          let nm = tup[0];
          let icon = tup[1];
          let isToggle = tup[2];
          let clickScr = tup[3];
          let updateScr = tup[4];

          btnCell = btns.button(icon, isToggle ? Styles.clearTogglei : Styles.cleari, clickScr).size(btnSize);
          if(nm != null) btnCell.tooltip(nm, true);
          if(updateScr != null) {
            let btn = btnCell.get();
            btnCell.update(() => updateScr.call(btn));
          };
        });
        btns.row();
        i++;
      };
    };

    this.prefW = Math.max.apply(null, this.colCounts) * btnSize;

    // Time control
    if(!this.isHidden) {
      this.root.table(Tex.whiteui, tb => {
        tb.left().setColor(Pal.darkestGray);
        tb.add("").get().setText(prov(() => Strings.fixed(this.timeScl, 2) + "x"));
        tb.row();
        MDL_table.__slider(tb, val => {
          val = checkCanControlTime() ? val : 1.0;
          Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * val);
          this.timeScl = val;
        }, 0.25, 3.0, 0.25, this.timeScl, this.prefW);
      }).left().row();
    };
  };


  /**
   * Updates the group.
   * @return {void}
   */
  CLS_dragButton.prototype.update = function() {
    if(!checkCanControlTime()) {
      Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
    };
  };


  /**
   * Adds the group to scene.
   * @param {number|unset} [x]
   * @param {number|unset} [y]
   * @return {void}
   */
  CLS_dragButton.prototype.add = function(x, y) {
    if(Core.scene == null) return;
    if(x == null) x = MDL_ui._centerX() * 1.2;
    if(y == null) y = MDL_ui._centerY() * 0.4;

    this.rebuild();
    this.root.setPosition(x, y, Align.center);
    Core.scene.add(this.root);
    addedGrps.pushUnique(this);
  };




module.exports = CLS_dragButton;
