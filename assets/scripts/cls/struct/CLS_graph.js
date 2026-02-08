/* ----------------------------------------
 * NOTE:
 *
 * Graph as a mathematical concept, undirected.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_graph = newClass().initClass();


CLS_graph.prototype.init = function() {
  this.stateRand = 0.0;
  this.nodes = [];
  this.edges = [];
  this.dataMap = new ObjectMap();
  this.neighborMap = new ObjectMap();
  this.weightArr = [];
  this.adjacencyList = [];
};


/* <---------- static method ----------> */


var cls = CLS_graph;


cls.TMP_A = new CLS_graph();
cls.TMP_B = new CLS_graph();
cls.TMP_C = new CLS_graph();


/* <---------- instance method ----------> */


var ptp = CLS_graph.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Returns a new copy of this graph.
 * ---------------------------------------- */
ptp.cpy = function(contGraph) {
  const graph = contGraph != null ? contGraph.clear() : new CLS_graph();

  this.nodes.forEachFast(id => {
    graph.addNode(id, this.dataMap.get(id));
  });
  this.edges.forEachFast(arr => {
    graph.addEdge(arr[0], arr[1]);
  });
  graph.notifyChange();

  return graph;
};


/* ----------------------------------------
 * NOTE:
 *
 * Merges {graph} into this graph.
 * ---------------------------------------- */
ptp.merge = function(graph) {
  graph.nodes.forEachFast(id => {
    this.addNode(id, graph.dataMap.get(id));
  });
  graph.edges.forEachFast(arr => {
    this.addEdge(arr[0], arr[1]);
  });
  this.notifyChange();

  return this;
};


/* ----------------------------------------
* NOTE:
*
* Gets amount of nodes in this graph.
* ---------------------------------------- */
ptp.getOrder = function() {
  return this.nodes.length;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets the adjacency list of this graph, which is a 2D array.
 * ---------------------------------------- */
ptp.getAdjacencyList = function() {
  this.adjacencyList.clear();
  let i = 0, iCap = this.node.iCap();
  while(i < iCap) {
    this.adjacencyList[i] = this.getNeighbors(this.nodes[i]);
    i++;
  };

  return this.adjacencyList;
}
.setCache(null, function() {
  return this.stateRand;
});


/* ----------------------------------------
 * NOTE:
 *
 * Gets a list of nodes connected to some node (one array in the adjacency list).
 * ---------------------------------------- */
ptp.getNeighbors = function(id) {
  return this.neighborMap.get(id, Array.air);
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets degree of some node.
 * ---------------------------------------- */
ptp.getDegree = function(id) {
  return this.neighborMap.get(id, Array.air).length;
};


/* ----------------------------------------
 * NOTE:
 *
 * Gets weight of some edge.
 * ---------------------------------------- */
ptp.getWeight = function(id1, id2) {
  return this.weightArr.read([id1, id2], 1.0, true);
};


/* ----------------------------------------
 * NOTE:
 *
 * Called to inform a change in structure.
 * ---------------------------------------- */
ptp.notifyChange = function() {
  this.stateRand = Math.random();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * @ARGS: id, data, oid1, oid2, oid3, ...
 * Adds a node (or vertex) to the graph.
 * If {oidx} is given, this will also add a edge between {id} and {oidx}.
 * ---------------------------------------- */
ptp.addNode = function(id, data) {
  if(this.hasNode(id)) return this;

  this.nodes.push(id);
  this.dataMap.put(id, tryVal(data, {}));

  if(arguments.length <= 2) return this;

  let i = 2, iCap = arguments.length;
  while(i < iCap) {
    this.addEdge(id, arguments[i]);
    i++;
  };
  this.notifyChange();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Adds an edge to the graph.
 * ---------------------------------------- */
ptp.addEdge = function(id1, id2, weight) {
  if(this.hasEdge(ind1, ind2)) return this;

  this.edges.push([id1, id2]);
  if(!this.neighborMap.containsKey(id1)) this.neighborMap.put(id1, []);
  if(!this.neighborMap.containsKey(id2)) this.neighborMap.put(id2, []);
  this.neighborMap.get(id1).push(id2);
  this.neighborMap.get(id2).push(id1);
  if(weight != null) {
    this.weightArr.write([id1, id2], weight, true);
  };
  this.notifyChange();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Removes some node from the graph.
 * This also removes unnecessary edges.
 * ---------------------------------------- */
ptp.removeNode = function thisFun(id) {
  thisFun.tmpArr.clear().pushAll(this.getNeighbors(id)).forEachFast(oid => {
    this.removeEdge(id, oid);
  });
  thisFun.nodes.remove(id);
  this.notifyChange();

  return this;
}
.setProp({
  tmpArr: [],
});


/* ----------------------------------------
 * NOTE:
 *
 * Removes some edge from the graph.
 * ---------------------------------------- */
ptp.removeEdge = function thisFun(id1, id2) {
  thisFun.tmpArr.clear();
  thisFun.tmpArr.push(id1, id2);

  this.edges.inSituFilter(arr => !arr.looseEquals(thisFun.tmpArr));
  this.neighborMap.get(id1).remove(id2);
  this.neighborMap.get(id2).remove(id1);
  this.notifyChange();

  return this;
}
.setProp({
  tmpArr: [],
});


/* ----------------------------------------
 * NOTE:
 *
 * Clears the entire graph.
 * ---------------------------------------- */
ptp.clear = function() {
  this.nodes.clear();
  this.edges.clear();
  this.dataMap.clear();
  this.notifyChange();

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this graph contains some node.
 * ---------------------------------------- */
ptp.hasNode = function(id) {
  return this.nodes.includes(id);
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this graph contains some edge.
 * ---------------------------------------- */
ptp.hasEdge = function thisFun(id1, id2) {
  thisFun.tmpArr.clear();
  thisFun.tmpArr.push(id1, id2);

  return this.edges.looseIncludes(thisFun.tmpArr);
}
.setProp({
  tmpArr: [],
});


/* ----------------------------------------
 * NOTE:
 *
 * Whether {graph} is part of this graph.
 * ---------------------------------------- */
ptp.hasGraph = function(graph) {
  return this.getOrder() < graph.getOrder() ?
    false :
    graph.nodes.every(oid => this.nodes.includes(oid)) && graph.edges.every(oedge => this.edges.looseIncludes(oedge));
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether this graph has any rings.
 * ---------------------------------------- */
ptp.hasRing = function() {
  let graph = this.cpy(CLS_graph.TMP_A);
  while(graph.nodes.length > 0) {
    thisFun.tmpArr.clear();
    graph.nodes.forEachCond(id => graph.getDegree(id) <= 1, id => thisFun.tmpArr.push(id));
    if(thisFun.tmpArr.length === 0) {
      return true;
    };
    thisFun.tmpArr.forEachFast(id => graph.removeNode(id));
  };
  return false;
}
.setProp({
  tmpArr: [],
})
.setCache(null, function() {
  return this.stateRand;
});


module.exports = CLS_graph;
