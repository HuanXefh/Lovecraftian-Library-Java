/* ----------------------------------------
 * NOTE:
 *
 * A tree with two children at maximum.
 * Still a tree in concept, but very different in structure.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_binaryTree = newClass().initClass();


CLS_binaryTree.prototype.init = function(rootId, rootData) {
  this.root = null;
  this.treeArr = [];
  this.dataMap = new ObjectMap();

  this.addNode(rootId, rootData, null);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_binaryTree.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Returns the index of some node, -1 if not found.
 * ---------------------------------------- */
ptp.indexOf = function(id) {
  return this.treeArr.indexOf(id);
};


/* ----------------------------------------
 * NOTE:
 *
 * 1. Returns depth of the binary tree.
 * 2. Returns depth of some node in the binary tree.
 * ---------------------------------------- */
ptp.getDepth = newMultiFunction(
  function() {
    return this.treeArr.length === 0 ?
      -1 :
      Math.floor(Mathf.log2(this.treeArr.length));
  },
  function(id) {
    let ind = this.indexOf(id);
    return ind < 0 ?
      -1 :
      Math.floor(Mathf.log2(ind));
  },
);


/* ----------------------------------------
 * NOTE:
 *
 * Gets index of the left child.
 * ---------------------------------------- */
ptp.getLeftInd = function(ind) {
  return ind < 0 ? -1 : (ind * 2 + 1);
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets index of the right child.
 * ---------------------------------------- */
ptp.getRightInd = function(ind) {
  return ind < 0 ? -1 : (ind * 2 + 2);
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the left child.
 * ---------------------------------------- */
ptp.getLeft = function(id) {
  return this.treeArr[this.getLeftInd(this.indexOf(id))];
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the right child.
 * ---------------------------------------- */
ptp.getRight = function(id) {
  return this.treeArr[this.getRightInd(this.indexOf(id))];
};


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites the left child.
 * ---------------------------------------- */
ptp.setLeft = function(idTg, id, data) {
  return this.setByInd(
    this.getLeftInd(this.indexOf(idTg)),
    id, data,
  );
};


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites the right child.
 * ---------------------------------------- */
ptp.setRight = function(idTg, id, data) {
  return this.setByInd(
    this.getRightInd(this.indexOf(idTg)),
    id, data,
  );
};


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites a node with matching index.
 * ---------------------------------------- */
ptp.setByInd = function(ind, id, data) {
  if(ind < 0) return this;

  if(this.treeArr[ind] != null) {
    this.dataMap.remove(this.treeArr[ind]);
  };
  this.treeArr[ind] = id;
  this.dataMap.put(id, data != null ? data : {});

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds a node to the binary tree, just like in a regular tree.
 * ---------------------------------------- */
ptp.addNode = function(id, data, parentId) {
  if(parentId == null) {
    if(this.root == null) {
      this.root = parentId;
      this.treeArr[0] = id;
      this.dataMap.put(id, data != null ? data : {});
    } else {
      ERROR_HANDLER.throw("duplicateRootNode");
    };
  } else {
    if(this.root == null) ERROR_HANDLER.throw("noRootNode");
    if(!this.hasNode(parentId)) ERROR_HANDLER.throw("noParentNode", parentId);
    if(this.getLeft(parentId) == null) {
      this.setLeft(parentId, id, data);
    } else {
      if(this.getRight(parentId) == null) {
        this.setRight(parentId, id, data);
      } else {
        ERROR_HANDLER.throw("tooManyNodes", 2);
      };
    };
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds a node to the first available position in the binary tree.
 * ---------------------------------------- */
ptp.insertNode = function(id, data) {
  if(this.root == null) this.addNode(id, data, null);

  let i = 1, iCap = this.treeArr.iCap() + 1;
  while(i < iCap) {
    if(this.treeArr[i] == null) {
      this.setByInd(i, id, data);
      return this;
    };
    i++;
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Deletes a node, whose position will be taken by the bottom-rightmost node.
 * ---------------------------------------- */
ptp.deleteNode = function(id) {
  let ind = this.indexOf(id);
  if(ind < 0) return this;
  this.treeArr.swapByInd(ind, this.treeArr.lastInd());
  this.treeArr.pop();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Clears the entire binary tree.
 * ---------------------------------------- */
ptp.clear = function() {
  this.root = null;
  this.treeArr.clear();
  this.dataMap.clear();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether a node is found in the binary tree.
 * ---------------------------------------- */
ptp.hasNode = function(id) {
  return this.treeArr.includes(id);
};


module.exports = CLS_binaryTree;
