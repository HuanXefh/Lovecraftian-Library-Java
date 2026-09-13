/** arc.scene.Scene */
declare class Scene implements InputProcessor {}


/** arc.scene.Element */
declare class Element {}


/** arc.scene.Action */
declare class Action {}


/** arc.scene.ui.layout.Cell */
declare class Cell extends Element {}


/** arc.scene.ui.Label */
declare class Label extends Element {}


/** arc.scene.ui.TextField */
declare class TextField extends Element {}
/** arc.scene.ui.TextArea */
declare class TextArea extends TextField {}


/** arc.scene.ui.Button */
declare class Button extends Table {}
declare namespace Button {
    class ButtonStyle extends Style {}
}
/** arc.scene.ui.TextButton */
declare class TextButton extends Button {}
/** arc.scene.ui.ImageButton */
declare class ImageButton extends Button {}
/** arc.scene.ui.ButtonGroup */
declare class ButtonGroup extends Button {}
/** arc.scene.ui.CheckBox */
declare class CheckBox extends TextButton {}


/** arc.scene.ui.Slider */
declare class Slider extends ProgressBar {}


/** arc.scene.ui.Touchpad */
declare class Touchpad extends Element {}


/** arc.scene.ui.Image */
declare class Image extends Element {}
/** arc.scene.ui.ColorImage */
declare class ColorImage extends Image {}


/** arc.scene.ui.ProgressBar */
declare class ProgressBar extends Element {}


/** arc.scene.Group */
declare class Group extends Element {}
/** arc.scene.ui.layout.WidgetGroup */
declare class WidgetGroup extends Group {}
/** arc.scene.ui.layout.Table */
declare class Table extends WidgetGroup {}
/** arc.scene.ui.layout.Stack */
declare class Stack extends WidgetGroup {}
/** arc.scene.ui.layout.ScrollPane */
declare class ScrollPane extends WidgetGroup {}
/** arc.scene.ui.layout.Collapser */
declare class Collapser extends WidgetGroup {}
/** arc.scene.ui.layout.TreeElement */
declare class TreeElement extends WidgetGroup {}


/** arc.scene.ui.Tooltip */
declare class Tooltip extends InputListener {}
declare namespace Tooltip {
    class Tooltips {}
}
type TooltipArgument = string|CFunction<Table>


/** arc.scene.ui.layout.Scl */
declare class Scl {}


/** arc.scene.style.Style */
declare class Style {}


/** arc.scene.style.Drawable */
interface Drawable {}
/** arc.scene.style.BaseDrawable */
declare class BaseDrawable implements Drawable {}
/** arc.scene.style.TransformDrawable */
interface TransformDrawable extends Drawable {}
/** arc.scene.style.TextureRegionDrawable */
declare class TextureRegionDrawable extends BaseDrawable implements TransformDrawable {}
/** arc.scene.style.TiledDrawable */
declare class TiledDrawable extends TextureRegionDrawable {}
/** arc.scene.style.NinePatchDrawable */
declare class NinePatchDrawable extends BaseDrawable implements TransformDrawable {}
/** arc.scene.style.ScaledNinePatchDrawable */
declare class ScaledNinePatchDrawable extends NinePatchDrawable {}


/** arc.scene.actions.Actions */
declare class Actions {}


/** arc.scene.ui.Dialog */
declare class Dialog extends Table {}


/** arc.scene.event.Touchable */
declare class Touchable {}


/** arc.scene.event.SceneEvent */
declare class SceneEvent implements Pool.Poolable {}
/** arc.scene.event.InputEvent */
declare class InputEvent extends SceneEvent {}
/** arc.scene.event.SceneResizeEvent */
declare class SceneResizeEvent extends SceneEvent {}
/** arc.scene.event.VisibilityEvent */
declare class VisibilityEvent extends SceneEvent {}


/** arc.scene.event.EventListener */
interface EventListener {}
/** arc.scene.event.ChangeListener */
declare class ChangeListener implements EventListener {}
/** arc.scene.event.ElementGestureListener */
declare class ElementGestureListener implements EventListener {}
/** arc.scene.event.FocusListener */
declare class FocusListener implements EventListener {}
/** arc.scene.event.ResizeListener */
declare class ResizeListener implements EventListener {}
/** arc.scene.event.VisibilityListener */
declare class VisibilityListener implements EventListener {}
/** arc.scene.event.InputListener */
declare class InputListener implements EventListener {}
/** arc.scene.event.ClickListener */
declare class ClickListener extends InputListener {}
/** arc.scene.event.IbeamCursorListener */
declare class IbeamCursorListener extends ClickListener {}
/** arc.scene.event.DragListener */
declare class DragListener extends InputListener {}
/** arc.scene.event.DragScrollListener */
declare class DragScrollListener extends DragListener {}
/** arc.scene.event.HandCursorListener */
declare class HandCursorListener extends ClickListener {}
