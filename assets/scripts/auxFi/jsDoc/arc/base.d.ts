/** arc.Core */
declare class Core {
    static app: Application;
    static graphics: Graphics;
    // @ts-ignore
    static audio: Audio;
    static input: Input;
    static files: Files;
    static settings: Settings;

    static bundle: I18NBundle;
    static camera: Camera;
    static batch: Batch;
    static scene: Scene;
    static assets: AssetManager;
    static atlas: TextureAtlas;
    static executor: java.util.concurrent.ExecutorService;

    static gl: GL20;
    static gl20: GL20;
    static gl30: GL30;
}


/** arc.Events */
declare class Events {
    static on<T>(type: Class<T>, cons: Cons<T>): void
    static run(type: Object, run: java.lang.Runnable): void
    static remove<T>(type: Class<T>, cons: Cons<T>): boolean
    static fire<T>(type: Class<T>, ev: T): void
    static fire(type: Object): void
}


/** arc.ApplicationListener */
interface ApplicationListener {}
/** arc.Application */
interface Application extends Disposable {}


/** arc.Graphics */
declare class Graphics implements Disposable {}


/** arc.Input */
declare class Input {
    mouseWorld(): Vec2
    mouseWorld(x: number, y: number): Vec2
    mouseWorldX(): number
    mouseWorldY(): number
    mouse(): Vec2
    mouseScreen(x: number, y: number): Vec2

    shift(): boolean
    ctrl(): boolean
    alt(): boolean
    keyDown(key: KeyCode): boolean
    keyDown(key: KeyBind): boolean
    keyTap(key: KeyCode): boolean
    keyTap(key: KeyBind): boolean
    keyRelease(key: KeyCode): boolean
    keyRelease(key: KeyBind): boolean
    axis(key: KeyCode): number
    axis(key: KeyBind): number
    axisTap(key: KeyBind): number
}


/** arc.Files */
interface Files {}


/** arc.Settings */
declare class Settings {}
