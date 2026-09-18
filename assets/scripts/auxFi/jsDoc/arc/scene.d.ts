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
declare namespace Label {
    class LabelStyle extends Style {
        font: Font;
        fontColor: Color;
        background: Drawable;

        constructor()
        constructor(style: LabelStyle)
        constructor(font: Font, color: Color)
    }
}


/** arc.scene.ui.TextField */
declare class TextField extends Element implements Disposable {}
declare namespace TextField {
    interface TextFieldListener {
        keyTyped(textField: TextField, l: java.lang.Character): void
    }
    interface TextFieldFilter {
        acceptChar(textField: TextField, l: java.lang.Character): boolean
    }
    interface TextFieldValidator {
        valid(test: string): boolean
    }
    class TextFieldClickListener extends ClickListener {}
    class TextFieldStyle extends Style {
        font: Font;
        fontColor: Color;
        focusedFontColor: Color;
        disabledFontColor: Color;
        background: Drawable;
        focusedBackground: Drawable;
        disabledBackground: Drawable;
        invalidBackground: Drawable;
        cursor: Drawable;
        selection: Drawable;
        messageFont: Font;
        messageFontColor: Color;

        constructor()
        constructor(style: TextFieldStyle)
    }
}
/** arc.scene.ui.TextArea */
declare class TextArea extends TextField {}


/** arc.scene.ui.Button */
declare class Button extends Table {}
declare namespace Button {
    class ButtonStyle extends Style {
        up: Drawable;
        down: Drawable;
        over: Drawable;
        checked: Drawable;
        checkedOver: Drawable;
        disabled: Drawable;
        pressedOffsetX: number;
        pressedOffsetY: number;
        unpressedOffsetX: number;
        unpressedOffsetY: number;
        checkedOffsetX: number;
        checkedOffsetY: number;

        constructor()
        constructor(style: ButtonStyle)
        constructor(up: Drawable, down: Drawable, checked: Drawable)
    }
}
/** arc.scene.ui.TextButton */
declare class TextButton extends Button {}
declare namespace TextButton {
    class TextButtonStyle extends Button.ButtonStyle {
        font: Font;
        fontColor: Color;
        downFontColor: Color;
        overFontColor: Color;
        checkedFontColor: Color;
        checkedOverFontColor: Color;
        disabledFontColor: Color;

        constructor()
        constructor(style: TextButtonStyle)
        constructor(up: Drawable, down: Drawable, checked: Drawable, font: Font)
    }
}
/** arc.scene.ui.ImageButton */
declare class ImageButton extends Button {}
declare namespace ImageButton {
    class ImageButtonStyle extends Button.ButtonStyle {
        imageUp: Drawable;
        imageDown: Drawable;
        imageOver: Drawable;
        imageChecked: Drawable;
        imageCheckedOver: Drawable;
        imageCheckedDisabled: Drawable;
        imageUpColor: Color;
        imageCheckedColor: Color;
        imageDownColor: Color;
        imageOverColor: Color;
        imageDisabledColor: Color;

        constructor()
        constructor(style: ImageButtonStyle)
        constructor(up: Drawable, down: Drawable, checked: Drawable, imgUp: Drawable, imgDown: Drawable, imgChecked: Drawable)
    }
}
/** arc.scene.ui.ButtonGroup */
declare class ButtonGroup extends Button {}
/** arc.scene.ui.CheckBox */
declare class CheckBox extends TextButton {}
declare namespace CheckBox {
    class CheckBoxStyle extends TextButton.TextButtonStyle {
        checkboxOn: Drawable;
        checkboxOff: Drawable;
        checkboxOver: Drawable;
        checkboxOnDisabled: Drawable;
        checkboxOffDisabled: Drawable;
        checkboxOnOver: Drawable;
    }
}


/** arc.scene.ui.Slider */
declare class Slider extends ProgressBar {}
declare namespace Slider {
    class SliderStyle extends ProgressBar.ProgressBarStyle {
        knobOver: Drawable;
        knobDown: Drawable;
    }
}


/** arc.scene.ui.Touchpad */
declare class Touchpad extends Element {}


/** arc.scene.ui.Image */
declare class Image extends Element {}
/** arc.scene.ui.ColorImage */
declare class ColorImage extends Image {}


/** arc.scene.ui.ProgressBar */
declare class ProgressBar extends Element {}
declare namespace ProgressBar {
    class ProgressBarStyle extends Style {
        background: Drawable;
        disabledBackground: Drawable;
        knob: Drawable;
        disabledKnob: Drawable;
        knobBefore: Drawable;
        knobAfter: Drawable;
        disabledKnobBefore: Drawable;
        disabledKnobAfter: Drawable;

        constructor()
        constructor(style: ProgressBarStyle)
        constructor(bg: Drawable, knob: Drawable)
    }
}


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
declare namespace ScrollPane {
    class ScrollPaneStyle extends Style {
        background: Drawable;
        corner: Drawable;
        hScroll: Drawable;
        hScrollKnob: Drawable;
        vScroll: Drawable;
        vScrollKnob: Drawable;

        constructor()
        constructor(style: ScrollPaneStyle)
    }
}
/** arc.scene.ui.layout.Collapser */
declare class Collapser extends WidgetGroup {}
/** arc.scene.ui.layout.TreeElement */
declare class TreeElement extends WidgetGroup {}
declare namespace TreeElement {
    class TreeStyle {
        plus: Drawable;
        minus: Drawable;
        over: Drawable;
        selection: Drawable;
        background: Drawable;

        constructor()
        constructor(style: TreeStyle)
        constructor(plus: Drawable, minus: Drawable, selection: Drawable)
    }
}


/** arc.scene.ui.Tooltip */
declare class Tooltip extends InputListener {}
declare namespace Tooltip {
    class Tooltips {}
}
type TooltipArgument = string|CFunction<Table>|[string, CFunction<Table>]


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
declare namespace Dialog {
    class DialogStyle extends Style {
        background: Drawable;
        titleFont: Font;
        titleFontColor: Color;
        stageBackground: Drawable;
    }
}


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
