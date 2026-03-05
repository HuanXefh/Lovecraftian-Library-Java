/* <---------- import ----------> */


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


let btnSize = 42.0;
let addedGrps = [];


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_dragButton.prototype;


/**
 * Loads data for the group.
 * @return {void}
 */
ptp.load = function() {
  if(Vars.headless || this.isLoaded) return;

  (function() {
    let obj = DB_misc.db["mod"]["dragButton"];
    return !PARAM.modded ?
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
ptp.rebuild = function() {
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
        btnCell = btns.button(tup[1], tup[2] ? Styles.clearTogglei : Styles.cleari, tup[3]).size(btnSize);
        if(tup[0] != null) btnCell.tooltip(tup[0], true);
        if(tup[4] != null) {
          let btn = btnCell.get();
          btnCell.update(() => tup[4].call(btn));
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
        if(Groups.player.size() === 1) Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0 * val);
        this.timeScl = val;
      }, 0.25, 3.0, 0.25, this.timeScl, this.prefW);
    }).left().row();
  };
};


/**
 * Updates the group.
 * @return {void}
 */
ptp.update = function() {
  // Forced to 1.0x when multi-player
  if(Groups.player.size() > 1) {
    Time.setDeltaProvider(() => Core.graphics.getDeltaTime() * 60.0);
  };
};


/**
 * Adds the group to scene.
 * @param {number|unset} [x]
 * @param {number|unset} [y]
 * @return {void}
 */
ptp.add = function(x, y) {
  if(Core.scene == null) return;
  if(x == null) x = MDL_ui._centerX() * 1.2;
  if(y == null) y = MDL_ui._centerY() * 0.4;

  this.rebuild();
  this.root.setPosition(x, y, Align.center);
  Core.scene.add(this.root);
  addedGrps.pushUnique(this);
};


module.exports = CLS_dragButton;
