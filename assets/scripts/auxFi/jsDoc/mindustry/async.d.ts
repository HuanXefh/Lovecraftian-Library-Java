/** mindustry.async.AsyncCore */
declare class AsyncCore {}


/** mindustry.async.AsyncProcess */
interface AsyncProcess {}
/** mindustry.async.PhysicsProcess */
declare class PhysicsProcess implements AsyncProcess {
    static readonly layers: number;
    static readonly layerGround: number;
    static readonly layerLegs: number;
    static readonly layerFlying: number;
    static readonly layerUnderwater: number;
}
interface PhysicsProcess extends AsyncProcess {}
declare namespace PhysicsProcess {
    class PhysicRef {
        entity: Unit;
        body: PhysicsBody;
        startX: number;
        startY: number;
        lastLater: number;
    }
    class PhysicsWorld {}
    class PhysicsBody implements QuadTree.QuadTreeObject {
        x: number;
        y: number;
        radius: number;
        mass: number;
        collided: boolean;
        local: boolean;
    }
    interface PhysicsBody extends QuadTree.QuadTreeObject {}
}


/** mindustry.async.AvoidanceProcess */
declare class AvoidanceProcess implements AsyncProcess {}
interface AvoidanceProcess extends AsyncProcess {}
