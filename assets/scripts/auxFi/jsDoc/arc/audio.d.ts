/** arc.Audio */
// @ts-ignore
declare class Audio implements Disposable {}


/** arc.audio.AudioSource */
declare class AudioSource implements Disposable {}
/** arc.audio.AudioFilter */
declare class AudioFilter {}
/** arc.audio.AudioBus */
declare class AudioBus extends AudioSource {}


/** arc.audio.Sound */
declare class Sound extends AudioSource {}
/** arc.audio.RandomSound */
declare class RandomSound extends Sound {}
/** arc.audio.Music */
declare class Music extends AudioSource {}
/** arc.audio.Filters */
declare class Filters {}
declare namespace Filters {
    class BiquadFilter extends AudioFilter {
        set(type: number, freq: number, resonance: number): void
    }
    class EchoFilter extends AudioFilter {
        set(delay: number, decay: number, filter: number): void
    }
    class LofiFilter extends AudioFilter {
        set(sampleRate: number, depth: number): void
    }
    class FlangerFilter extends AudioFilter {
        set(delay: number, freq: number): void
    }
    class WaveShaperFilter extends AudioFilter {
        set(amt: number): void
    }
    class BassBoostFilter extends AudioFilter {
        set(amt: number): void
    }
    class RobotizeFilter extends AudioFilter {
        set(freq: number, waveform: number): void
    }
    class FreeverbFilter extends AudioFilter {
        set(mode: number, roomSize: number, damp: number, w: number): void
    }
}
