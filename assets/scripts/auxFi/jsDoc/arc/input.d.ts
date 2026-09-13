/** arc.input.InputProcessor */
interface InputProcessor {}


/** arc.input.KeyCode */
declare class KeyCode implements KeyBind.KeybindValue {
    static controllerA: KeyCode;
    static controllerB: KeyCode;
    static controllerX: KeyCode;
    static controllerY: KeyCode;
    static controllerGuide: KeyCode;
    static controllerLBumper: KeyCode;
    static controllerRBumper: KeyCode;
    static controllerBack: KeyCode;
    static controllerStart: KeyCode;
    static controllerLStick: KeyCode;
    static controllerRStick: KeyCode;
    static controllerPadUp: KeyCode;
    static controllerPadDown: KeyCode;
    static controllerPadLeft: KeyCode;
    static controllerPadRight: KeyCode;
    static controllerLTrigger: KeyCode;
    static controllerRTrigger: KeyCode;
    static controllerLStickYAxis: KeyCode;
    static controllerLStickXAxis: KeyCode;
    static controllerRStickYAxis: KeyCode;
    static controllerRStickXAxis: KeyCode;

    static mouseLeft: KeyCode;
    static mouseRight: KeyCode;
    static mouseMiddle: KeyCode;
    static mouseBack: KeyCode;
    static mouseForward: KeyCode;
    static scroll: KeyCode;

    static anyKey: KeyCode;
    static num0: KeyCode;
    static num1: KeyCode;
    static num2: KeyCode;
    static num3: KeyCode;
    static num4: KeyCode;
    static num5: KeyCode;
    static num6: KeyCode;
    static num7: KeyCode;
    static num8: KeyCode;
    static num9: KeyCode;
    static a: KeyCode;
    static altLeft: KeyCode;
    static altRight: KeyCode;
    static apostrophe: KeyCode;
    static at: KeyCode;
    static b: KeyCode;
    static back: KeyCode;
    static backslash: KeyCode;
    static c: KeyCode;
    static call: KeyCode;
    static camera: KeyCode;
    static clear: KeyCode;
    static comma: KeyCode;
    static d: KeyCode;
    static del: KeyCode;
    static backspace: KeyCode;
    static forwardDel: KeyCode;
    static dpadCenter: KeyCode;
    static dpadDown: KeyCode;
    static dpadLeft: KeyCode;
    static dpadRight: KeyCode;
    static dpadUp: KeyCode;
    static center: KeyCode;
    static down: KeyCode;
    static left: KeyCode;
    static right: KeyCode;
    static up: KeyCode;
    static e: KeyCode;
    static endCall: KeyCode;
    static enter: KeyCode;
    static envelope: KeyCode;
    static equals: KeyCode;
    static explorer: KeyCode;
    static f: KeyCode;
    static focus: KeyCode;
    static g: KeyCode;
    static backtick: KeyCode;
    static h: KeyCode;
    static headsetHook: KeyCode;
    static home: KeyCode;
    static i: KeyCode;
    static j: KeyCode;
    static k: KeyCode;
    static l: KeyCode;
    static leftBracket: KeyCode;
    static m: KeyCode;
    static mediaFastForward: KeyCode;
    static mediaNext: KeyCode;
    static mediaPlayPause: KeyCode;
    static mediaPrevious: KeyCode;
    static mediaRewind: KeyCode;
    static mediaStop: KeyCode;
    static menu: KeyCode;
    static minus: KeyCode;
    static mute: KeyCode;
    static n: KeyCode;
    static notification: KeyCode;
    static num: KeyCode;
    static o: KeyCode;
    static p: KeyCode;
    static period: KeyCode;
    static plus: KeyCode;
    static pound: KeyCode;
    static power: KeyCode;
    static q: KeyCode;
    static r: KeyCode;
    static rightBracket: KeyCode;
    static s: KeyCode;
    static search: KeyCode;
    static semicolon: KeyCode;
    static shiftLeft: KeyCode;
    static shiftRight: KeyCode;
    static slash: KeyCode;
    static softLeft: KeyCode;
    static softRight: KeyCode;
    static space: KeyCode;
    static star: KeyCode;
    static sym: KeyCode;
    static t: KeyCode;
    static tab: KeyCode;
    static u: KeyCode;
    static unknown: KeyCode;
    static v: KeyCode;
    static volumeDown: KeyCode;
    static volumeUp: KeyCode;
    static w: KeyCode;
    static x: KeyCode;
    static y: KeyCode;
    static z: KeyCode;
    static metaAltLeftOn: KeyCode;
    static metaAltOn: KeyCode;
    static metaAltRightOn: KeyCode;
    static metaShiftLeftOn: KeyCode;
    static metaShiftOn: KeyCode;
    static metaShiftRightOn: KeyCode;
    static metaSymOn: KeyCode;
    static controlLeft: KeyCode;
    static controlRight: KeyCode;
    static escape: KeyCode;
    static end: KeyCode;
    static insert: KeyCode;
    static pageUp: KeyCode;
    static pageDown: KeyCode;
    static pictSymbols: KeyCode;
    static switchCharset: KeyCode;
    static buttonCircle: KeyCode;
    static buttonA: KeyCode;
    static buttonB: KeyCode;
    static buttonC: KeyCode;
    static buttonX: KeyCode;
    static buttonY: KeyCode;
    static buttonZ: KeyCode;
    static buttonL1: KeyCode;
    static buttonR1: KeyCode;
    static buttonL2: KeyCode;
    static buttonR2: KeyCode;
    static buttonThumbL: KeyCode;
    static buttonThumbR: KeyCode;
    static buttonStart: KeyCode;
    static buttonSelect: KeyCode;
    static buttonMode: KeyCode;
    static numpad0: KeyCode;
    static numpad1: KeyCode;
    static numpad2: KeyCode;
    static numpad3: KeyCode;
    static numpad4: KeyCode;
    static numpad5: KeyCode;
    static numpad6: KeyCode;
    static numpad7: KeyCode;
    static numpad8: KeyCode;
    static numpad9: KeyCode;
    static colon: KeyCode;
    static f1: KeyCode;
    static f2: KeyCode;
    static f3: KeyCode;
    static f4: KeyCode;
    static f5: KeyCode;
    static f6: KeyCode;
    static f7: KeyCode;
    static f8: KeyCode;
    static f9: KeyCode;
    static f10: KeyCode;
    static f11: KeyCode;
    static f12: KeyCode;
    static unset: KeyCode;
    static application: KeyCode;
    static asterisk: KeyCode;
    static capsLock: KeyCode;
    static pause: KeyCode;
    static printScreen: KeyCode;
    static scrollLock: KeyCode;

    type: KeyCode.KeyType;
    value: string;
    axis: boolean;
}
declare namespace KeyCode {
    class KeyType {
        static key: KeyType;
        static mouse: KeyType;
        static controller: KeyType;
        static scroll: KeyType;
    }
}


/** arc.input.KeyBind */
declare class KeyBind {
    readonly name: string;
    readonly defaultValue: KeyBind.KeybindValue;
    readonly category: string|null;
    value: KeyBind.Axis;

    static add(name: string, defVal: KeyBind.KeybindValue, categ?: string): KeyBind

    isDefault(): boolean
    isUnset(): boolean
}
declare namespace KeyBind {
    interface KeybindValue {}
    class Axis implements KeybindValue {
        min: KeyCode|null;
        max: KeyCode|null;
        key: KeyCode|null;
    }
}
