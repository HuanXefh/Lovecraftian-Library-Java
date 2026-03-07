/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * This file is only used for JSDoc.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * @global
   * @param {any} arg
   * @return {void}
   */
  function print(arg) {};
  /**
   * @global
   * @param {function(): void} fun
   * @return {java.lang.Runnable}
   */
  function run(fun) {};
  /**
   * @global
   * @param {function(any): boolean} fun
   * @return {Boolf}
   */
  function boolf(fun) {};
  /**
   * @global
   * @param {function(): boolean} fun
   * @return {Boolp}
   */
  function boolp(fun) {};
  /**
   * @global
   * @param {function(any): number} fun
   * @return {Floatf}
   */
  function floatf(fun) {};
  /**
   * @global
   * @param {function(): number} fun
   * @return {Floatp}
   */
  function floatp(fun) {};
  /**
   * @global
   * @param {function(any): void} fun
   * @return {Cons}
   */
  function cons(fun) {};
  /**
   * @global
   * @param {function(): any} fun
   * @return {Prov}
   */
  function prov(fun) {};
  /**
   * @global
   * @param {function(any): any} fun
   * @return {Func}
   */
  function func(fun) {};
  /**
   * @global
   * @template T
   * @param {Class<T>} javaCls
   * @param {...any} args
   * @return {T}
   */
  function extend(javaCls, ...args) {};


  /**
   * @global
   * @typedef {null|undefined} unset
   */
  /**
   * @global
   * @typedef {Array|IArguments} Arguments
   */
  /**
   * @global
   * @typedef {string|Function|null} ArgumentType
   */
  /**
   * @global
   * @typedef {Function<any>} TemplateFunction
   * @prop {boolean|unset} [noSuper] - If true, `this.super$xxx` won't be called.
   * @prop {boolean|unset} [override] - If true, the previous method will be ignored.
   * @prop {boolean|unset} [final] - If true, this method is fixed and won't be mixed later.
   * @prop {string|unset} [boolMode] - For boolean operation with the previous method. <br> <VALS>: "none", "and", "or".
   * @prop {string|unset} [superBoolMode] - Like `boolMode` but for `this.super$xxx`.
   * @prop {string|unset} [mergeMode] - Handles mixing of returned values. <br> <VALS>: "object", "array", any function.
   * @prop {number|unset} [argLen] - Expected argument length in final Java method, required if there's any argument.
   * @prop {Function|unset} [funPrev] - Previous method before mixing. Do not set.
   * @prop {Function|unset} [funCur] - Current method before mixing. Do not set.
   */
  /**
   * An ordered array of coordinates of n-dimensional points (flattened).
   * @global
   * @typedef {Array<number>} PathData
   * @example
   * // A path of four 3D-points
   * let pathData = [
   *   0, 0, 0,
   *   0, 0, 1,
   *   0, 1, 1,
   *   1, 1, 1,
   * ];
   */
  /**
   * A number array filled with randomly distributed values.
   * @global
   * @typedef {Array<number>} DistributionArray
   */
  /**
   * <TUP>: nmMod, nmDial, ind.
   * @global
   * @typedef {[string, string, number]} DialogTuple
   */
  /**
   * <TUP>: nmMod, nmChara.
   * @global
   * @typedef {[string, string]} CharacterTuple
   */
  /**
   * <ROW>: dialTup, charaTup, paramObj, charaArgs.
   * <br> <ROW-charaArgs>: delay, nmMod, nmChara, fracX, isDark0color, anim, animParamObj, customActs.
   * @global
   * @typedef {Array} DialogFlowData
   */
  /**
   * @global
   * @typedef {Object|null} RecipeModule
   */
  /**
   * @global
   * @typedef {Object} RecipeBase
   * @prop {string|unset} [baseAttr]
   * @prop {number|unset} [baseAttrMin]
   * @prop {number|unset} [baseAttrMax]
   * @prop {number|unset} [baseAttrBoostScl]
   * @prop {number|unset} [baseAttrBoostCap]
   * @prop {Array|unset} [baseCi]
   * @prop {Array|unset} [baseBi]
   * @prop {Array|unset} [baseAux]
   * @prop {Array|unset} [baseOpt]
   * @prop {Array|unset} [basePayi]
   * @prop {Array|unset} [baseCo]
   * @prop {Array|unset} [baseBo]
   * @prop {Array|unset} [baseFo]
   * @prop {Array|unset} [basePayo]
   * @prop {(function(Building): void)|unset} [baseUpdateScr]
   * @prop {(function(Building): void)|unset} [baseRunScr]
   * @prop {(function(Building): void)|unset} [baseCraftScr]
   * @prop {(function(Building): void)|unset} [baseStopScr]
   */
  /**
   * @global
   * @typedef {Object} RecipeObject
   * @prop {string|unset} [icon] - Content icon used for this recipe, should be unique.
   * @prop {string|unset} [categ] - Category this recipe is in.
   * @prop {boolean|unset} [isGenerated] - Whether this recipe is created by recipe generators. Do not set this manually!
   * @prop {(function(): boolean)|unset} [validGetter] - A function to check whether recipe is allowed now.
   * @prop {Array<string>|unset} [lockedBy] - Recipe will be unavailable until all these contents are unlocked.
   * @prop {number|unset} [timeScl] - Scaling on crafting time.
   * @prop {number|unset} [pollution] - Overwrites block pollution.
   * @prop {boolean|unset} [ignoreItemFullness] - If true, the crafter consumes even when full of output items.
   * @prop {string|unset} [attr] - Attribute required for this recipe.
   * @prop {number|unset} [attrMin] - Attribute value for 0.0 efficiency (no block size included).
   * @prop {number|unset} [attrMax] - Attribute value for 1.0 efficiency (no block size included).
   * @prop {number|unset} [attrBoostScl] - Scaling on attribute boost.
   * @prop {number|unset} [attrBoostCap] - Maximum efficiency can be reached with attribute boost.
   * @prop {string|unset} [tooltip] - Bundle piece used for recipe tooltip.
   * @prop {number|unset} [powProdMtp] - Multiplier on power produced. For {@link BLK_generatorRecipeFactory}.
   * @prop {number|unset} [tempReq] - Temperature required. For {@link BLK_furnaceRecipeFactory}.
   * @prop {number|unset} [tempAllowed] - Temperature allowed. For {@link BLK_furnaceRecipeFactory}.
   * @prop {number|unset} [durabDecMtp] - Multiplier on durability decrease rate. For {@link BLK_durabilityRecipeFactory}.
   * @prop {Array|unset} [ci] - Continuous input.
   * @prop {Array|unset} [bi] - Batch input.
   * @prop {Array|unset} [aux] - Auxiliary input.
   * @prop {boolean|unset} [reqOpt] - Whether at least one optional input should be met.
   * @prop {Array|unset} [opt] - Optional input.
   * @prop {Array|unset} [payi] - Payload input.
   * @prop {Array|unset} [co] - Continuous output.
   * @prop {Array|unset} [bo] - Batch output.
   * @prop {number|unset} [failP] - Chance to fail this recipe.
   * @prop {Array|unset} [fo] - Failed output.
   * @prop {Array|unset} [payo] - Payload output.
   * @prop {(function(Building): void)|unset} [updateScr] - Called whenever the building updates.
   * @prop {(function(Building): void)|unset} [runScr] - Called when the building is active.
   * @prop {(function(Building): void)|unset} [craftScr] - Called when the building crafts.
   * @prop {(function(Building): void)|unset} [stopScr] - Called when the building is no longer active.
   */
  /**
   * @global
   * @typedef {Object} RecipeDictionaryData
   * @prop {string|unset} [icon] - Texture region used.
   * @prop {string|unset} [ct] - Content icon button used.
   * @prop {number|unset} [time] - Overwrites crafting time.
   */


  /* <---------- Java ----------> */


  /** @global */
  java = {};
  java.lang = {};
  /** java.lang.Integer */
  java.lang.Integer = class {};
  /** java.lang.Byte */
  java.lang.Byte = class {};
  /** java.lang.Short */
  java.lang.Short = class {};
  /** java.lang.Long */
  java.lang.Long = class {};
  /** java.lang.Float */
  java.lang.Float = class {};
  /** java.lang.Double */
  java.lang.Double = class {};
  /** java.lang.Boolean */
  java.lang.Boolean = class {};
  /** java.lang.Char */
  java.lang.Char = class {};
  /** java.lang.String */
  java.lang.String = class {};
  /** java.lang.Object */
  java.lang.Object = class {};
  /** java.lang.Class */
  java.lang.Class = class {};
  /** java.lang.ClassLoader */
  java.lang.ClassLoader = class {};
  /** java.lang.Runnable */
  java.lang.Runnable = class {};
  /** java.lang.Thread */
  java.lang.Thread = class extends java.lang.Runnable {};
  /** java.lang.File */
  java.lang.File = class {};


  /**
   * @global
   * @template T
   * @typedef {Array<T>} JavaArray<T>
   */


  /* <---------- Arc ----------> */


  /** @global arc.Core */
  class Core {};
  /** @global arc.Events */
  class Events {};


  /** @global arc.audio.Sound */
  class Sound {};
  /** @global arc.audio.RandomSound */
  class RandomSound extends Sound {};
  /** @global arc.audio.Music */
  class Music {};


  /** @global arc.files.Fi */
  class Fi {};
  /** @global arc.files.ZipFi */
  class ZipFi extends Fi {};


  /** @global arc.func.Boolc */
  class Boolc {};
  /** @global arc.func.Boolf */
  class Boolf {};
  /** @global arc.func.Boolf2 */
  class Boolf2 {};
  /** @global arc.func.Boolf3 */
  class Boolf3 {};
  /** @global arc.func.Boolp */
  class Boolp {};
  /** @global arc.func.Cons */
  class Cons {};
  /** @global arc.func.Cons2 */
  class Cons2 {};
  /** @global arc.func.Cons3 */
  class Cons3 {};
  /** @global arc.func.Cons4 */
  class Cons4 {};
  /** @global arc.func.ConsT */
  class ConsT {};
  /** @global arc.func.Floatc */
  class Floatc {};
  /** @global arc.func.Floatc2 */
  class Floatc2 {};
  /** @global arc.func.Floatc4 */
  class Floatc4 {};
  /** @global arc.func.Floatf */
  class Floatf {};
  /** @global arc.func.FloatFloatf */
  class FloatFloatf {};
  /** @global arc.func.Floatp */
  class Floatp {};
  /** @global arc.func.Func */
  class Func {};
  /** @global arc.func.Func2 */
  class Func2 {};
  /** @global arc.func.Func3 */
  class Func3 {};
  /** @global arc.func.Intc */
  class Intc {};
  /** @global arc.func.Intc2 */
  class Intc2 {};
  /** @global arc.func.Intc4 */
  class Intc4 {};
  /** @global arc.func.Intf */
  class Intf {};
  /** @global arc.func.IntIntf */
  class IntIntf {};
  /** @global arc.func.Intp */
  class Intp {};
  /** @global arc.func.Longf */
  class Longf {};
  /** @global arc.func.Prov */
  class Prov {};


  /** @global arc.graphics.Blending */
  class Blending {};
  /** @global arc.graphics.Color */
  class Color {};
  /** @global arc.graphics.Mesh */
  class Mesh {};
  /** @global arc.graphics.Texture */
  class Texture {};
  /** @global arc.graphics.g2d.TextureRegion */
  class TextureRegion {};
  /** @global arc.graphics.Pixmap */
  class Pixmap {};
  /** @global arc.graphics.g2d.PixmapRegion */
  class PixmapRegion {};
  /** @global arc.graphics.Pixmaps */
  class Pixmaps {};
  /** @global arc.graphics.PixmapIO */
  class PixmapIO {};
  /** @global arc.graphics.g2d.PixmapPacker */
  class PixmapPacker {};
  /** @global arc.graphics.g2d.Font */
  class Font {};
  /** @global arc.graphics.g2d.GlyphLayout */
  class GlyphLayout {};
  /** @global arc.graphics.g2d.Draw */
  class Draw {};
  /** @global arc.graphics.g2d.Fill */
  class Fill {};
  /** @global arg.graphics.g2d.Lines */
  class Lines {};
  /** @global arc.graphics.g2d.Animation */
  class Animation {};
  /** @global arc.graphics.gl.Shader */
  class Shader {};


  /** @global arc.input.KeyCode */
  class KeyCode {};
  /** @global arc.input.KeyBind */
  class KeyBind {};


  /** @global arc.math.Mathf */
  class Mathf {};
  /** @global arc.math.Angles */
  class Angles {};
  /** @global arc.math.Rand */
  class Rand {};
  /** @global arc.math.Interp */
  class Interp {};
  /** @global arc.math.LinearRegression */
  class LinearRegression {};
  /** @global arc.math.WindowedMean */
  class WindowedMean {};
  /** @global arc.math.FloatCounter */
  class FloatCounter {};
  /** @global arc.math.geom.Position */
  class Position {};
  /** @global arc.math.geom.Point2 */
  class Point2 extends Position {};
  /** @global arc.math.geom.Point3 */
  class Point3 extends Position {};
  /** @global arc.math.geom.Vec2 */
  class Vec2 extends Position {};
  /** @global arc.math.geom.Vec3 */
  class Vec3 extends Position {};
  /** @global arc.math.Mat */
  class Mat {};
  /** @global arc.math.Affine2 */
  class Affine2 {};
  /** @global arc.math.geom.Rect */
  class Rect {};
  /** @global arc.math.geom.Circle */
  class Circle {};
  /** @global arc.math.geom.Ellipse */
  class Ellipse {};
  /** @global arc.math.geom.Polyline */
  class Polyline {};
  /** @global arc.math.geom.Polygon */
  class Polygon {};
  /** @global arc.math.geom.Geometry */
  class Geometry {};
  /** @global arc.math.geom.Spring1D */
  class Spring1D {};
  /** @global arc.math.geom.Spring2D */
  class Spring2D {};
  /** @global arc.math.geom.Bezier */
  class Bezier {};


  /** @global arc.scene.Element*/
  class Element {};
  /** @global arc.scene.Action*/
  class Action {};
  /** @global arc.scene.ui.layout.Cell */
  class Cell extends Element {};
  /** @global arc.scene.ui.Label */
  class Label extends Element {};
  /** @global arc.scene.ui.TextField */
  class TextField extends Element {};
  /** @global arc.scene.ui.TextArea */
  class TextArea extends TextField {};
  /** @global arc.scene.ui.Button */
  class Button extends Table {};
  /** @global arc.scene.ui.TextButton */
  class TextButton extends Button {};
  /** @global arc.scene.ui.ImageButton */
  class ImageButton extends Button {};
  /** @global arc.scene.ui.ButtonGroup */
  class ButtonGroup extends Button {};
  /** @global arc.scene.ui.CheckBox */
  class CheckBox extends TextButton {};
  /** @global arc.scene.ui.Slider */
  class Slider extends ProgressBar {};
  /** @global arc.scene.ui.Touchpad */
  class Touchpad extends Element {};
  /** @global arc.scene.ui.Image */
  class Image extends Element {};
  /** @global arc.scene.ui.ColorImage */
  class ColorImage extends Image {};
  /** @global arc.scene.ui.ProgressBar */
  class ProgressBar extends Element {};
  /** @global arc.scene.Group */
  class Group extends Element {};
  /** @global arc.scene.ui.layout.WidgetGroup */
  class WidgetGroup extends Group {};
  /** @global arc.scene.ui.layout.Table */
  class Table extends WidgetGroup {};
  /** @global arc.scene.ui.layout.Stack */
  class Stack extends WidgetGroup {};
  /** @global arc.scene.ui.ScrollPane */
  class ScrollPane extends WidgetGroup {};
  /** @global arc.scene.ui.layout.Collapser */
  class Collapser extends WidgetGroup {};
  /** @global arc.scene.ui.TreeElement */
  class TreeElement extends WidgetGroup {};
  /** @global arc.scene.ui.layout.Scl */
  class Scl {};
  /** @global arc.scene.style.BaseDrawable */
  class BaseDrawable {};
  /** @global arc.scene.style.TextureRegionDrawable */
  class TextureRegionDrawable extends BaseDrawable {};
  /** @global arc.scene.style.TiledDrawable */
  class TiledDrawable extends TextureRegionDrawable {};
  /** @global arc.scene.style.NinePatchDrawable */
  class NinePatchDrawable extends BaseDrawable {};
  /** @global arc.scene.style.ScaledNinePatchDrawable */
  class ScaledNinePatchDrawable extends NinePatchDrawable {};
  /** @global arc.scene.actions.Actions */
  class Actions {};
  /** @global arc.scene.ui.Dialog */
  class Dialog extends Table {};
  /** @global arc.scene.event.Touchable */
  class Touchable {};

  /** @global arc.struct.Bits */
  class Bits {};
  /** @global arc.struct.GridBits */
  class GridBits {};
  /** @global arc.struct.ObjectSet */
  class ObjectSet {};
  /** @global arc.struct.IntSet */
  class IntSet {};
  /** @global arc.struct.OrderedSet */
  class OrderedSet {};
  /** @global arc.struct.Queue */
  class Queue {};
  /** @global arc.struct.IntQueue */
  class IntQueue {};
  /** @global arc.struct.LongQueue */
  class LongQueue {};
  /** @global arc.struct.PQueue */
  class PQueue {};
  /** @global arc.struct.Seq */
  class Seq {};
  /** @global arc.struct.IntSeq */
  class IntSeq {};
  /** @global arc.struct.ByteSeq */
  class ByteSeq {};
  /** @global arc.struct.FloatSeq */
  class FloatSeq {};
  /** @global arc.struct.ShortSeq */
  class ShortSeq {};
  /** @global arc.struct.LongSeq */
  class LongSeq {};
  /** @global arc.struct.BoolSeq */
  class BoolSeq {};
  /** @global arc.struct.ObjectMap */
  class ObjectMap {};
  /** @global arc.struct.ObjectIntMap */
  class ObjectIntMap {};
  /** @global arc.struct.ObjectFloatMap */
  class ObjectFloatMap {};
  /** @global arc.struct.IntMap */
  class IntMap {};
  /** @global arc.struct.IntIntMap */
  class IntIntMap {};
  /** @global arc.struct.IntFloatMap */
  class IntFloatMap {};
  /** @global arc.struct.LongMap */
  class LongMap {};
  /** @global arc.struct.StringMap */
  class StringMap {};
  /** @global arc.struct.ArrayMap */
  class ArrayMap {};
  /** @global arc.struct.GridMap */
  class GridMap {};
  /** @global arc.struct.OrderedMap */
  class OrderedMap {};
  /** @global arc.struct.EnumSet */
  class EnumSet {};


  /** @global arc.util.Log */
  class Log {};
  /** @global arc.util.Time */
  class Time {};
  /** @global arc.util.pooling.Pools */
  class Pools {};
  /** @global arc.util.Tmp */
  class Tmp {};
  /** @global arc.util.Reflect */
  class Reflect {};
  /** @global arc.util.OS */
  class OS {};
  /** @global arc.util.Interval */
  class Interval {};
  /** @global arc.util.Http */
  class Http {};
  Http.HttpResponse = class {};
  Http.HttpRequest = class {};
  Http.HttpMethod = class {};
  Http.HttpStatus = class {};
  /** @global arc.util.Structs */
  class Structs {};
  /** @global arc.util.Strings */
  class Strings {};
  /** @global arc.util.Align */
  class Align {};
  /** @global arc.util.noise.Ridged */
  class Ridged {};
  /** @global arc.util.noise.Simplex */
  class Simplex {};
  /** @global arc.util.noise.VoronoiNoise */
  class VoronoiNoise {};
  /** @global arc.util.io.Writes */
  class Writes {};
  /** @global arc.util.io.Reads */
  class Reads {};
  /** @global arc.util.serialization.Base64Coder */
  class Base64Coder {};
  /** @global arc.util.serialization.Json */
  class Json {};
  /** @global arc.util.serialization.JsonValue */
  class JsonValue {};
  /** @global arc.util.serialization.Jval */
  class Jval {};


  /* <---------- Rhino ----------> */


  /** @global */
  class JavaAdapter {};


  /* <---------- Mindustry ----------> */


  /** @global mindustry.Vars */
  class Vars {};


  /** @global mindustry.entities.units.AIController */
  class AIController {};
  /** @global mindustry.ai.types.AssemblerAI */
  class AssemblerAI extends AIController {};
  /** @global mindustry.ai.types.BoostAI */
  class BoostAI extends AIController {};
  /** @global mindustry.ai.types.BuilderAI */
  class BuilderAI extends AIController {};
  /** @global mindustry.ai.types.Cargo */
  class CargoAI extends AIController {};
  /** @global mindustry.ai.types.CommandAI */
  class CommandAI extends AIController {};
  /** @global mindustry.ai.types.DefenderAI */
  class DefenderAI extends AIController {};
  /** @global mindustry.ai.types.FlyingAI */
  class FlyingAI extends AIController {};
  /** @global mindustry.ai.types.FlyingFollowAI */
  class FlyingFollowAI extends AIController {};
  /** @global mindustry.ai.types.GroundAI */
  class GroundAI extends AIController {};
  /** @global mindustry.ai.types.HugAI */
  class HugAI extends AIController {};
  /** @global mindustry.ai.types.LogicAI */
  class LogicAI extends AIController {};
  /** @global mindustry.ai.types.MinerAI */
  class MinerAI extends AIController {};
  /** @global mindustry.ai.types.MissileAI */
  class MissileAI extends AIController {};
  /** @global mindustry.ai.types.PrebuildAI */
  class PrebuildAI extends AIController {};
  /** @global mindustry.ai.types.RepairAI */
  class RepairAI extends AIController {};
  /** @global mindustry.ai.types.SuicideAI */
  class SuicideAI extends AIController {};


  /** @global mindustry.content.Blocks */
  class Blocks {};
  /** @global mindustry.content.Items */
  class Items {};
  /** @global mindustry.content.Liquids */
  class Liquids {};
  /** @global mindustry.content.UnitTypes */
  class UnitTypes {};
  /** @global mindustry.content.StatusEffects */
  class StatusEffects {};
  /** @global mindustry.content.Planets */
  class Planets {};
  /** @global mindustry.content.SectorPresets */
  class SectorPresets {};
  /** @global mindustry.content.Weathers */
  class Weathers {};
  /** @global mindustry.content.TeamEntries */
  class TeamEntries {};
  /** @global mindustry.content.Bullets */
  class Bullets {};
  /** @global mindustry.content.Fx */
  class Fx {};
  /** @global mindustry.content.TechTree */
  class TechTree {};
  TechTree.TechNode = class {};


  /** @global mindustry.core.UI */
  class UI {};


  /** @global mindustry.ctype.Content */
  class Content {};
  /** @global mindustry.type.ErrorContent */
  class ErrorContent extends Content {};
  /** @global mindustry.ctype.ContentType */
  class ContentType {};
  /** @global mindustry.ctype.MappableContent */
  class MappableContent extends Content {};
  /** @global mindustry.ctype.UnlockableContent */
  class UnlockableContent extends MappableContent {};


  /** @global mindustry.entities.Sized */
  class Sized extends Position {};
  /** @global mindustry.entities.Damage */
  class Damage {};
  /** @global mindustry.entities.Lightning */
  class Lightning {};
  /** @global mindustry.entities.Puddles */
  class Puddles {};
  /** @global mindustry.entities.Fires */
  class Fires {};
  /** @global mindustry.entities.TargetPriority */
  class TargetPriority {};
  /** @global mindustry.entities.UnitSorts */
  class UnitSorts {};
  /** @global mindustry.entities.Units */
  class Units {};
  Units.Sortf = class {};
  /** @global mindustry.entities.EntityCollisions */
  class EntityCollisions {};
  /** @global mindustry.entities.Effect */
  class Effect {};
  /** @global mindustry.entities.effect.MultiEffect */
  class MultiEffect extends Effect {};
  /** @global mindustry.entities.effect.ExplosionEffect */
  class ExplosionEffect extends Effect {};
  /** @global mindustry.entities.effect.ParticleEffect */
  class ParticleEffect extends Effect {};
  /** @global mindustry.entities.effect.RadialEffect */
  class RadialEffect extends Effect {};
  /** @global mindustry.entities.effect.SeqEffect */
  class SeqEffect extends Effect {};
  /** @global mindustry.entities.effect.SoundEffect */
  class SoundEffect extends Effect {};
  /** @global mindustry.entities.effect.WaveEffect */
  class WaveEffect extends Effect {};
  /** @global mindustry.entities.effect.WrapEffect */
  class WrapEffect extends Effect {};
  /** @global mindustry.entities.Mover */
  class Mover {};
  /** @global mindustry.entities.units.BuildPlan */
  class BuildPlan {};
  /** @global mindustry.entities.units.WeaponMount */
  class WeaponMount {};
  /** @global mindustry.entities.units.StatusEntry */
  class StatusEntry {};
  /** @global mindustry.entities.abilities.Ability */
  class Ability {};
  /** @global mindustry.entities.bullet.BulletType */
  class BulletType {};
  /** @global mindustry.entities.bullet.MultiBulletType */
  class MultiBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.EmptyBulletType */
  class EmptyBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.ExplosionBulletType */
  class ExplosionBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.FireBulletType */
  class FireBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.BasicBulletType */
  class BasicBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.LaserBulletType */
  class LaserBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.LightningBulletType */
  class LightningBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.LiquidBulletType */
  class LiquidBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.SpaceLiquidBulletType */
  class SpaceLiquidBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.PointBulletType */
  class PointBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.PointLaserBulletType */
  class PointLaserBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.RailBulletType */
  class RailBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.SapBulletType */
  class SapBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.ShrapnelBulletType */
  class ShrapnelBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.ArtilleryBulletType */
  class ArtilleryBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.BombBulletType */
  class BombBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.EmpBulletType */
  class EmpBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.FlakBulletType */
  class FlakBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.InterceptorBulletType */
  class InterceptorBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.LaserBoltBulletType */
  class LaserBoltBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.MissileBulletType */
  class MissileBulletType extends BasicBulletType {};
  /** @global mindustry.entities.bullet.ContinuousBulletType */
  class ContinuousBulletType extends BulletType {};
  /** @global mindustry.entities.bullet.ContinuousFlameBulletType */
  class ContinuousFlameBulletType extends ContinuousBulletType {};
  /** @global mindustry.entities.bullet.ContinuousLaserBulletType */
  class ContinuousLaserBulletType extends ContinuousBulletType {};
  /** @global mindustry.entities.bullet.MassDriverBolt */
  class MassDriverBolt extends BasicBulletType {};
  /** @global mindustry.entities.part.DrawPart */
  class DrawPart {};
  /** @global mindustry.entities.part.EffectSpawnerPart */
  class EffectSpawnerPart extends DrawPart {};
  /** @global mindustry.entities.part.FlarePart */
  class FlarePart extends DrawPart {};
  /** @global mindustry.entities.part.HaloPart */
  class HaloPart extends DrawPart {};
  /** @global mindustry.entities.part.HoverPart */
  class HoverPart extends DrawPart {};
  /** @global mindustry.entities.part.RegionPart */
  class RegionPart extends DrawPart {};
  /** @global mindustry.entities.part.ShapePart */
  class ShapePart extends DrawPart {};
  /** @global mindustry.entities.part.ShootPattern */
  class ShootPattern {};
  /** @global mindustry.entities.part.ShootAlternate */
  class ShootAlternate extends ShootPattern {};
  /** @global mindustry.entities.part.ShootBarrel */
  class ShootBarrel extends ShootPattern {};
  /** @global mindustry.entities.part.ShootHelix */
  class ShootHelix extends ShootPattern {};
  /** @global mindustry.entities.part.ShootMulti */
  class ShootMulti extends ShootPattern {};
  /** @global mindustry.entities.part.ShootSine */
  class ShootSine extends ShootPattern {};
  /** @global mindustry.entities.part.ShootSpread */
  class ShootSpread extends ShootPattern {};
  /** @global mindustry.entities.part.ShootSummon */
  class ShootSummon extends ShootPattern {};


  /** @global mindustry.game.EventType */
  class EventType {};
  EventType.Trigger = class {};
  /** @global mindustry.game.EventType#Trigger */
  Trigger = EventType.Trigger;
  /** @global mindustry.game.Team */
  class Team {};
  /** @global mindustry.game.Teams */
  class Teams {};
  /** @global mindustry.game.Rules */
  class Rules {};
  /** @global mindustry.game.CampaignRules */
  class CampaignRules {};
  /** @global mindustry.game.Difficulty */
  class Difficulty {};
  /** @global mindustry.game.GameMode */
  class GameMode {};
  /** @global mindustry.game.Schematic */
  class Schematic {};
  /** @global mindustry.game.Schematics */
  class Schematics {};


  /** @global mindustry.gen.Building */
  class Building {};
  /** @global mindustry.gen.Unit */
  class Unit {};
  /** @global mindustry.gen.Bullet */
  class Bullet {};
  /** @global mindustry.gen.Puddle */
  class Puddle {};
  /** @global mindustry.gen.Decal */
  class Decal {};
  /** @global mindustry.gen.EffectState */
  class EffectState {};
  /** @global mindustry.gen.Groups */
  class Groups {};
  /** @global mindustry.gen.Posc */
  class Posc {};
  /** @global mindustry.gen.Rotc */
  class Rotc {};
  /** @global mindustry.gen.Healthc */
  class Healthc {};
  /** @global mindustry.gen.Teamc */
  class Teamc {};
  /** @global mindustry.gen.Itemc */
  class Itemc {};
  /** @global mindustry.gen.Statusc */
  class Statusc {};
  /** @global mindustry.gen.Weaponsc */
  class Weaponsc {};
  /** @global mindustry.gen.Physicsc */
  class Physicsc {};
  /** @global mindustry.gen.Velc */
  class Velc {};
  /** @global mindustry.gen.Syncc */
  class Syncc {};
  /** @global mindustry.gen.BlockUnitc */
  class BlockUnitc {};
  /** @global mindustry.gen.Builderc */
  class Builderc {};
  /** @global mindustry.gen.Minerc */
  class Minerc {};
  /** @global mindustry.gen.Shieldc */
  class Shieldc {};
  /** @global mindustry.gen.Payloadc */
  class Payloadc {};
  /** @global mindustry.gen.BuildingTetherc */
  class BuildingTetherc {};
  /** @global mindustry.gen.UnitTetherc */
  class UnitTetherc {};
  /** @global mindustry.gen.Timedc */
  class Timedc {};
  /** @global mindustry.gen.TimedKillc */
  class TimedKillc {};
  /** @global mindustry.gen.Mechc */
  class Mechc {};
  /** @global mindustry.gen.Legsc */
  class Legsc {};
  /** @global mindustry.gen.Crawlc */
  class Crawlc {};
  /** @global mindustry.gen.Segmentc */
  class Segmentc {};
  /** @global mindustry.gen.Tankc */
  class Tankc {};
  /** @global mindustry.gen.WaterMovec */
  class WaterMovec {};
  /** @global mindustry.gen.WaterCrawlc */
  class WaterCrawlc {};
  /** @global mindustry.gen.ElevationMovec */
  class ElevationMovec {};
  /** @global mindustry.gen.UnitEntity */
  class UnitEntity {};
  /** @global mindustry.gen.MechUnit */
  class MechUnit {};
  /** @global mindustry.gen.LegsUnit */
  class LegsUnit {};
  /** @global mindustry.gen.CrawlUnit */
  class CrawlUnit {};
  /** @global mindustry.gen.TankUnit */
  class TankUnit {};
  /** @global mindustry.gen.UnitWaterMove */
  class UnitWaterMove {};
  /** @global mindustry.gen.ElevationMoveUnit */
  class ElevationMoveUnit {};
  /** @global mindustry.gen.PayloadUnit */
  class PayloadUnit {};
  /** @global mindustry.gen.BuildingTetherPayloadUnit */
  class BuildingTetherPayloadUnit {};
  /** @global mindustry.gen.TimedKillUnit */
  class TimedKillUnit {};
  /** @global mindustry.gen.Call */
  class Call {};
  /** @global mindustry.gen.Tex */
  class Tex {};
  /** @global mindustry.gen.Icon */
  class Icon {};
  /** @global mindustry.gen.Sounds */
  class Sounds {};
  /** @global mindustry.gen.Musics */
  class Musics {};


  /** @global mindustry.graphics.Drawf */
  class Drawf {};
  /** @global mindustry.graphics.Pal */
  class Pal {};
  /** @global mindustry.graphics.Layer */
  class Layer {};
  /** @global mindustry.graphics.Shaders */
  class Shaders {};
  /** @global mindustry.graphics.CacheLayer */
  class CacheLayer {};
  /** @global mindustry.graphics.MultiPacker */
  class MultiPacker {};
  MultiPacker.PageType = class {};
  /** @global mindustry.graphics.g3d.GenericMesh */
  class GenericMesh {};
  /** @global mindustry.graphics.g3d.MultiMesh */
  class MultiMesh extends GenericMesh {};
  /** @global mindustry.graphics.g3d.MatMesh */
  class MatMesh extends GenericMesh {};
  /** @global mindustry.graphics.g3d.PlanetMesh */
  class PlanetMesh extends GenericMesh {};
  /** @global mindustry.graphics.g3d.ShaderSphereMesh */
  class ShaderSphereMesh extends PlanetMesh {};
  /** @global mindustry.graphics.g3d.HexMesh */
  class HexMesh extends PlanetMesh {};
  /** @global mindustry.graphics.g3d.SunMesh */
  class SunMesh extends HexMesh {};
  /** @global mindustry.graphics.g3d.NoiseMesh */
  class NoiseMesh extends HexMesh {};
  /** @global mindustry.graphics.g3d.HexSkyMesh */
  class HexSkyMesh extends PlanetMesh {};
  /** @global mindustry.graphics.g3d.PlanetGrid */
  class PlanetGrid {};
  /** @global mindustry.graphics.g3d.MeshBuilder */
  class MeshBuilder {};


  /** @global mindustry.input.Binding */
  class Binding {};
  /** @global mindustry.input.PlaceMode */
  class PlaceMode {};


  /** @global mindustry.io.TypeIO */
  class TypeIO {};


  /** @global mindustry.logic.LAccess */
  class LAccess {};
  /** @global mindustry.logic.LLocate */
  class LLocate {};
  /** @global mindustry.logic.RadarTarget */
  class RadarTarget {};


  /** @global mindustry.mod.Mod */
  class Mod {};
  /** @global mindustry.mod.Mods */
  class Mods {};
  Mods.ModState = class {};
  /** @global mindustry.mod.ClassMap */
  class ClassMap {};
  /** @global mindustry.mod.ContentParser */
  class ContentParser {};


  /** @global mindustry.type.Category */
  class Category {};
  /** @global mindustry.world.Block */
  class Block extends UnlockableContent {};
  /** @global mindustry.type.Item */
  class Item extends UnlockableContent {};
  /** @global mindustry.type.Liquid */
  class Liquid extends UnlockableContent {};
  /** @global mindustry.type.cellLiquid */
  class CellLiquid extends Liquid {};
  /** @global mindustry.type.UnitType */
  class UnitType extends UnlockableContent {};
  /** @global mindustry.type.ErekirUnitType */
  class ErekirUnitType extends UnitType {};
  /** @global mindustry.type.MissileUnitType */
  class MissileUnitType extends UnitType {};
  /** @global mindustry.type.NeoplasmUnitType */
  class NeoplasmUnitType extends UnitType {};
  /** @global mindustry.type.TankUnitType */
  class TankUnitType extends UnitType {};
  /** @global mindustry.type.StatusEffect */
  class StatusEffect extends UnlockableContent {};
  /** @global mindustry.type.Planet */
  class Planet extends UnlockableContent {};
  /** @global mindustry.type.SectorPreset */
  class SectorPreset extends UnlockableContent {};
  /** @global mindustry.type.Weather */
  class Weather extends UnlockableContent {};
  /** @global mindustry.type.weather.MagneticStorm */
  class MagneticStorm extends Weather {};
  /** @global mindustry.type.weather.ParticleWeather */
  class ParticleWeather extends Weather {};
  /** @global mindustry.type.weather.RainWeather */
  class RainWeather extends Weather {};
  /** @global mindustry.type.weather.SolarFlare */
  class SolarFlare extends Weather {};
  /** @global mindustry.type.TeamEntry */
  class TeamEntry extends UnlockableContent {};
  /** @global mindustry.type.Weapon */
  class Weapon {};
  /** @global mindustry.type.weapons.BuildWeapon */
  class BuildWeapon extends Weapon {};
  /** @global mindustry.type.weapons.MineWeapon */
  class MineWeapon extends Weapon {};
  /** @global mindustry.type.weapons.PointDefenseBulletWeapon */
  class PointDefenseBulletWeapon extends Weapon {};
  /** @global mindustry.type.weapons.PointDefenseWeapon */
  class PointDefenseWeapon extends Weapon {};
  /** @global mindustry.type.weapons.RepairBeamWeapon */
  class RepairBeamWeapon extends Weapon {};
  /** @global mindustry.type.AmmoType */
  class AmmoType {};
  /** @global mindustry.type.ammo.ItemAmmoType */
  class ItemAmmoType extends AmmoType {};
  /** @global mindustry.type.ammo.PowerAmmoType */
  class PowerAmmoType extends AmmoType {};
  /** @global mindustry.type.Sector */
  class Sector {};
  /** @global mindustry.type.MapLocales */
  class MapLocales {};
  /** @global mindustry.type.ItemStack */
  class ItemStack {};
  /** @global mindustry.type.LiquidStack */
  class LiquidStack {};
  /** @global mindustry.type.PayloadStack */
  class PayloadStack {};
  /** @global mindustry.type.ItemSeq */
  class ItemSeq {};
  /** @global mindustry.type.PayloadSeq */
  class PayloadSeq {};


  /** @global mindustry.ui.Bar */
  class Bar extends Element {};
  /** @global mindustry.ui.ReqImage */
  class ReqImage extends Stack {};
  /** @global mindustry.ui.MultiReqImage */
  class MultiReqImage extends Stack {};
  /** @global mindustry.ui.Fonts */
  class Fonts {};
  /** @global mindustry.ui.Styles */
  class Styles {};
  /** @global mindustry.ui.dialogs.BaseDialog */
  class BaseDialog extends Dialog {};
  /** @global mindustry.ui.dialogs.ContentInfoDialog */
  class ContentInfoDialog extends BaseDialog {};
  /** @global mindustry.ui.fragments.HudFragment */
  class HudFragment {};


  /** @global mindustry.world.Tile */
  class Tile {};
  /** @global mindustry.editor.EditorTile */
  class EditorTile extends Tile {};
  /** @global mindustry.world.Edges */
  class Edges {};
  /** @global mindustry.world.Build */
  class Build {};
  /** @global mindustry.world.meta.Attribute */
  class Attribute {};
  /** @global mindustry.world.meta.Env */
  class Env {};
  /** @global mindustry.world.meta.BlockFlag */
  class BlockFlag {};
  /** @global mindustry.world.meta.BlockGroup */
  class BlockGroup {};
  /** @global mindustry.world.meta.BlockStatus */
  class BlockStatus {};
  /** @global mindustry.world.meta.BuildVisibility */
  class BuildVisibility {};
  /** @global mindustry.world.meta.Stat */
  class Stat {};
  /** @global mindustry.world.meta.Stats */
  class Stats {};
  /** @global mindustry.world.meta.StatCat */
  class StatCat {};
  /** @global mindustry.world.meta.StatUnit */
  class StatUnit {};
  /** @global mindustry.world.meta.StatValue */
  class StatValue {};
  /** @global mindustry.world.meta.StatValues */
  class StatValues {};
  /** @global mindustry.world.draw.DrawBlock */
  class DrawBlock {};
  /** @global mindustry.world.draw.DrawDefault */
  class DrawDefault extends DrawBlock {};
  /** @global mindustry.world.draw.DrawRegion */
  class DrawRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawSideRegion */
  class DrawSideRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawWarmupRegion */
  class DrawWarmupRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawMulti */
  class DrawMulti extends DrawBlock {};
  /** @global mindustry.world.draw.DrawTurret */
  class DrawTurret extends DrawBlock {};
  /** @global mindustry.world.draw.DrawBlurSpin */
  class DrawBlurSpin extends DrawBlock {};
  /** @global mindustry.world.draw.DrawFade */
  class DrawFade extends DrawBlock {};
  /** @global mindustry.world.draw.DrawFrames */
  class DrawFrames extends DrawBlock {};
  /** @global mindustry.world.draw.DrawGlowRegion */
  class DrawGlowRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawHeatRegion */
  class DrawHeatRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawHeatInput */
  class DrawHeatInput extends DrawBlock {};
  /** @global mindustry.world.draw.DrawHeatOutput */
  class DrawHeatOutput extends DrawBlock {};
  /** @global mindustry.world.draw.DrawLiquidRegion */
  class DrawLiquidRegion extends DrawBlock {};
  /** @global mindustry.world.draw.DrawLiquidTile */
  class DrawLiquidTile extends DrawBlock {};
  /** @global mindustry.world.draw.DrawLiquidOutputs */
  class DrawLiquidOutputs extends DrawBlock {};
  /** @global mindustry.world.draw.DrawArcSmelt */
  class DrawArcSmelt extends DrawBlock {};
  /** @global mindustry.world.draw.DrawFlame */
  class DrawFlame extends DrawBlock {};
  /** @global mindustry.world.draw.DrawCrucibleFlame */
  class DrawCrucibleFlame extends DrawBlock {};
  /** @global mindustry.world.draw.DrawPlasma */
  class DrawPlasma extends DrawFlame {};
  /** @global mindustry.world.draw.DrawCultivator */
  class DrawCultivator extends DrawBlock {};
  /** @global mindustry.world.draw.DrawPumpLiquid */
  class DrawPumpLiquid extends DrawBlock {};
  /** @global mindustry.world.draw.DrawPower */
  class DrawPower extends DrawBlock {};
  /** @global mindustry.world.draw.DrawWeave */
  class DrawWeave extends DrawBlock {};
  /** @global mindustry.world.draw.DrawMultiWeave */
  class DrawMultiWeave extends DrawBlock {};
  /** @global mindustry.world.draw.DrawPistons */
  class DrawPistons extends DrawBlock {};
  /** @global mindustry.world.draw.DrawBubbles */
  class DrawBubbles extends DrawBlock {};
  /** @global mindustry.world.draw.DrawCells */
  class DrawCells extends DrawBlock {};
  /** @global mindustry.world.draw.DrawCircles */
  class DrawCircles extends DrawBlock {};
  /** @global mindustry.world.draw.DrawShape */
  class DrawShape extends DrawBlock {};
  /** @global mindustry.world.draw.DrawPulseShape */
  class DrawPulseShape extends DrawBlock {};
  /** @global mindustry.world.draw.DrawParticles */
  class DrawParticles extends DrawBlock {};
  /** @global mindustry.world.draw.DrawSoftParticles */
  class DrawSoftParticles extends DrawBlock {};
  /** @global mindustry.world.draw.DrawSpikes */
  class DrawSpikes extends DrawBlock {};
  /** @global mindustry.world.Consume */
  class Consume {};
  /** @global mindustry.world.ConsumeItems */
  class ConsumeItems extends Consume {};
  /** @global mindustry.world.ConsumeItemFilter */
  class ConsumeItemFilter extends Consume {};
  /** @global mindustry.world.ConsumeItemDynamic */
  class ConsumeItemDynamic extends Consume {};
  /** @global mindustry.world.ConsumeItemList */
  class ConsumeItemList extends ConsumeItemFilter {};
  /** @global mindustry.world.ConsumeItemEfficiency */
  class ConsumeItemEfficiency extends ConsumeItemFilter {};
  /** @global mindustry.world.ConsumeItemFlammable */
  class ConsumeItemFlammable extends ConsumeItemEfficiency {};
  /** @global mindustry.world.ConsumeItemExplosive */
  class ConsumeItemExplosive extends ConsumeItemEfficiency {};
  /** @global mindustry.world.ConsumeItemRadioactive */
  class ConsumeItemRadioactive extends ConsumeItemEfficiency {};
  /** @global mindustry.world.ConsumeItemCharged */
  class ConsumeItemCharged extends ConsumeItemEfficiency {};
  /** @global mindustry.world.ConsumeLiquidBase */
  class ConsumeLiquidBase extends Consume {};
  /** @global mindustry.world.ConsumeLiquid */
  class ConsumeLiquid extends ConsumeLiquidBase {};
  /** @global mindustry.world.ConsumeLiquids */
  class ConsumeLiquids extends Consume {};
  /** @global mindustry.world.ConsumeLiquidDynamic */
  class ConsumeLiquidDynamic extends Consume {};
  /** @global mindustry.world.ConsumeLiquidFilter */
  class ConsumeLiquidFilter extends ConsumeLiquidBase {};
  /** @global mindustry.world.ConsumeLiquidFlammable */
  class ConsumeLiquidFlammable extends ConsumeLiquidFilter {};
  /** @global mindustry.world.ConsumePower */
  class ConsumePower extends Consume {};
  /** @global mindustry.world.ConsumePowerDynamic */
  class ConsumePowerDynamic extends ConsumePower {};
  /** @global mindustry.world.ConsumePowerCondition */
  class ConsumePowerCondition extends ConsumePower {};
  /** @global mindustry.world.ConsumePayloads */
  class ConsumePayloads extends Consume {};
  /** @global mindustry.world.ConsumePayloadDynamic */
  class ConsumePayloadDynamic extends Consume {};
  /** @global mindustry.world.ConsumePayloadFilter */
  class ConsumePayloadFilter extends Consume {};
  /** @global mindustry.world.modules.BlockModule */
  class BlockModule {};
  /** @global mindustry.world.modules.ItemModule */
  class ItemModule extends BlockModule {};
  /** @global mindustry.world.modules.LiquidModule */
  class LiquidModule extends BlockModule {};
  /** @global mindustry.world.modules.PowerModule */
  class PowerModule extends BlockModule {};
  /** @global mindustry.world.blocks.AutoTiler */
  class AutoTiler {};
  AutoTiler.SliceMode = class {};
  /** @global mindustry.world.blocks.payloads.Payload */
  class Payload {};
  /** @global mindustry.world.blocks.payloads.BuildPayload */
  class BuildPayload extends Payload {};
  /** @global mindustry.world.blocks.payloads.UnitPayload */
  class UnitPayload extends Payload {};


  /**
   * @global
   * @typedef {string|UnlockableContent|null} ContentGn
   */
  /**
   * @global
   * @typedef {string|Block|null} BlockGn
   */
  /**
   * @global
   * @typedef {string|Item|null} ItemGn
   */
  /**
   * @global
   * @typedef {string|Liquid|null} LiquidGn
   */
  /**
   * @global
   * @typedef {Item|Liquid} Resource
   */
  /**
   * @global
   * @typedef {string|Item|Liquid|null} ResourceGn
   */
  /**
   * @global
   * @typedef {string|UnitType|null} UnitTypeGn
   */
  /**
   * @global
   * @typedef {string|StatusEffect|null} StatusGn
   */
  /**
   * @global
   * @typedef {string|Planet|null} PlanetGn
   */
  /**
   * @global
   * @typedef {string|SectorPreset|null} SectorGn
   */
  /**
   * @global
   * @typedef {string|Attribute} AttrGn
   */
  /**
   * @global
   * @typedef {number|boolean|string|Color|Item|Liquid|Tile|Team|null} ColorGn
   */
  /**
   * @global
   * @typedef {string|Sound|null} SoundGn
   */
  /**
   * @global
   * @typedef {string|Music|null} MusicGn
   */
  /**
   * @global
   * @typedef {Pixmap|PixmapRegion} PixmapGn
   */
  /**
   * @global
   * @typedef {Building|Unit|Bullet|Puddle|EffectState|Decal|Tile|Vec2} PosGn
   */
  /**
   * @global
   * @typedef {Building|Unit|Bullet} PoscGn
   */
  /**
   * @global
   * @typedef {Building|Unit} HealthcGn
   */
  /**
   * @global
   * @typedef {Building|Unit|Bullet} TeamcGn
   */


  /* <---------- TMI ----------> */


  /** @global tmi.recipe.Recipe */
  class Recipe {};
  /** @global tmi.recipe.RecipeType */
  class RecipeType {};
  /** @global tmi.recipe.types.RecipeItem */
  class RecipeItem {};
  /** @global tmi.recipe.types.RecipeItemType */
  class RecipeItemType {};
