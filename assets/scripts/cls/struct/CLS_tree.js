/* ----------------------------------------
 * NOTE:
 *
 * Lovec version of tree structure.
 * ---------------------------------------- */


/* <---------- import ----------> */


const CLS_graph = require("lovec/cls/struct/CLS_graph");


/* <---------- meta ----------> */


const CLS_tree = newClass().extendClass(CLS_graph).initClass();


CLS_tree.prototype.init = function(rootId, rootData) {
  this.super("init");
  this.root = null;
  this.parentMap = new ObjectMap();

  this.addNode(rootId, rootData, null);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_tree.prototype;


ptp.hasGraph = undefined;
ptp.hasRing = undefined;


/* ----------------------------------------
 * NOTE:
 *
 * @INHERITED
 * Returns a new copy of this tree.
 * ---------------------------------------- */
ptp.cpy = function(contTree) {
  const tree = contTree != null ? contTree.clear() : new CLS_tree();

  tree.addNode(this.root, this.dataMap.get(this.root), null);
  this.nodes.forEachCond(
    id => id !== this.root,
    id => tree.addNode(id, this.dataMap.get(id), this.parentMap.get(id)),
  );
  tree.notifyChange();

  return tree;
};


/* ----------------------------------------
 * NOTE:
 *
 * @INHERITED
 * Merges {tree} into this tree, just like what's done in {CLS_graph}.
 * ---------------------------------------- */
ptp.merge = function(tree, parentId) {
  this.addNode(tree.root, tree.dataMap.get(tree.root), parentId);
  tree.nodes.forEachCond(
    id => id !== tree.root,
    id => this.addNode(id, tree.dataMap.get(id), tree.parentMap.get(id)),
  );
  this.notifyChange();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * @INHERITED
 * Adds a node to the tree, which must be linked to a parent node.
 * If {parentId} is {null}, this node will be treated as root node.
 * ---------------------------------------- */
ptp.addNode = function(id, data, parentId) {
  if(parentId == null) {
    if(this.root == null) {
      this.root = id;
      this.super("addNode", id, data);
    } else {
      ERROR_HANDLER.throw("duplicateRootNode");
    };
  } else {
    if(this.root == null) ERROR_HANDLER.throw("noRootNode");
    if(!this.hasNode(parentId)) ERROR_HANDLER.throw("noParentNode", parentId);
    this.super("addNode", id, data, parentId);
    this.parentMap.put(id, parentId);
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * @INHERITED
 * Clears the entire tree including its root.
 * ---------------------------------------- */
ptp.clear = function() {
  this.super("clear");
  this.root = null;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether {tree} is part of this graph.
 * Note that {hasGraph} has been deleted for this class.
 * ---------------------------------------- */
ptp.hasTree = function(tree) {
  return this.super("hasGraph", tree);
};


module.exports = CLS_tree;
