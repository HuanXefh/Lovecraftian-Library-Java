/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Loads all Java classes in Lovec.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ lovec.graphics ------------------------------ */


  /** @global lovec.graphics.LCDraw */
  LCDraw = fetchClass("lovec.graphics.LCDraw");
  /** @global lovec.graphics.LCDrawf */
  LCDrawf = fetchClass("lovec.graphics.LCDrawf");
  /** @global lovec.graphics.LCDrawP3D */
  LCDrawP3D = fetchClass("lovec.graphics.LCDrawP3D");
  /** @global lovec.graphics.LCRgb */
  LCRgb = fetchClass("lovec.graphics.LCRgb");
  /** @global lovec.graphics.LCTexture */
  LCTexture = fetchClass("lovec.graphics.LCTexture");
  /** @global lovec.graphics.StackDrawable */
  StackDrawable = fetchClass("lovec.graphics.StackDrawable");


  /* <------------------------------ lovec.math ------------------------------ */


  /** @global lovec.math.LCLerp */
  LCLerp = fetchClass("lovec.math.LCLerp");
  /** @global lovec.math.LCMathFunc */
  LCMathFunc = fetchClass("lovec.math.LCMathFunc");
  /** @global lovec.math.LCRaycast */
  LCRaycast = fetchClass("lovec.math.LCRaycast");
  /** @global lovec.math.MathGraph */
  MathGraph = fetchClass("lovec.math.MathGraph");
  /** @global lovec.math.MathMatrix */
  MathMatrix = fetchClass("lovec.math.MathMatrix");


  /* <------------------------------ lovec.utils ------------------------------ */


  /** @global lovec.utils.LCCheck */
  LCCheck = fetchClass("lovec.utils.LCCheck");
  /** @global lovec.utils.LCGeneralizer */
  LCGeneralizer = fetchClass("lovec.utils.LCGeneralizer");
  /** @global lovec.utils.LCGeometry */
  LCGeometry = fetchClass("lovec.utils.LCGeometry");
  /** @global lovec.utils.LCPos */
  LCPos = fetchClass("lovec.utils.LCPos");
  /** @global lovec.utils.LCRand */
  LCRand = fetchClass("lovec.utils.LCRand");
  /** @global lovec.utils.LCScript */
  LCScript = fetchClass("lovec.utils.LCScript");
  /** @global lovec.utils.extend.LCNativeArray */
  LCNativeArray = fetchClass("lovec.utils.extend.LCNativeArray");
  /** @global lovec.utils.extend.LCNumber */
  LCNumber = fetchClass("lovec.utils.extend.LCNumber");
  /** @global lovec.utils.pooling.PoolableNativeArray */
  PoolableNativeArray = fetchClass("lovec.utils.pooling.PoolableNativeArray");
  /** @global lovec.utils.pooling.PoolableVec2 */
  PoolableVec2 = fetchClass("lovec.utils.pooling.PoolableVec2");
  /** @global lovec.utils.pooling.PoolableVec3 */
  PoolableVec3 = fetchClass("lovec.utils.pooling.PoolableVec3");


  /* <------------------------------ lovec.content.frag ------------------------------ */


  /** @global */
  BLKFragArmoredCable = new (fetchClass("lovec.content.frag.BLKFragArmoredCable"));
  /** @global */
  BLKFragCable = new (fetchClass("lovec.content.frag.BLKFragCable"));
  /** @global */
  BLKFragCogwheel = new (fetchClass("lovec.content.frag.BLKFragCogwheel"));
  /** @global */
  BFragCogwheel = new (fetchClass("lovec.content.frag.BLKFragCogwheel").BFragCogwheel);
  /** @global */
  BLKFragFluidPipe = new (fetchClass("lovec.content.frag.BLKFragFluidPipe"));
