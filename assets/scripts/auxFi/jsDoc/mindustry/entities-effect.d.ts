/** mindustry.entities.Effect */
declare class Effect {
    constructor()
    constructor(lifetime: number, eff: Cons<Effect.EffectContainer>)
    constructor(lifetime: number, clipsize: number, eff: Cons<Effect.EffectContainer>)
}
declare namespace Effect {
    class EffectContainer implements Scaled {
        id: number;
        x: number;
        y: number;
        time: number;
        lifetime: number;
        rotation: number;
        color: Color;
        data: Object;
    }
}


/** mindustry.entities.effect.MultiEffect */
declare class MultiEffect extends Effect {
    effects: Array<Effect>;

    constructor()
    constructor(...effs: Array<Effect>)
}
/** mindustry.entities.effect.ExplosionEffect */
declare class ExplosionEffect extends Effect {}
/** mindustry.entities.effect.ParticleEffect */
declare class ParticleEffect extends Effect {}
/** mindustry.entities.effect.RadialEffect */
declare class RadialEffect extends Effect {}
/** mindustry.entities.effect.SeqEffect */
declare class SeqEffect extends Effect {}
/** mindustry.entities.effect.SoundEffect */
declare class SoundEffect extends Effect {}
/** mindustry.entities.effect.WaveEffect */
declare class WaveEffect extends Effect {}
/** mindustry.entities.effect.WrapEffect */
declare class WrapEffect extends Effect {}
/** mindustry.entities.effect.NoiseEffect */
declare class NoiseEffect extends Effect {}
