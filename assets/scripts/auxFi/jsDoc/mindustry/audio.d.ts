/** mindustry.audio.AmbientSource */
interface AmbientSource extends Position {}


/** mindustry.audio.SoundLoop */
declare class SoundLoop {
    constructor(sound: Sound, baseVol: number)

    update(x: number, y: number, shouldPlay: boolean, volScl?: number): void
    stop(): void
}


/** mindustry.audio.SoundPriority */
declare class SoundPriority {
    static max(maxConcurrent: number, ...sounds: Array<Sound>): void
    static sameGroup(...sounds: Array<Sound>): void
    static set(priority: number, ...sounds: Array<Sound>): void
}
