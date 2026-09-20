/** mindustry.graphics.g3d.GenericMesh */
interface GenericMesh extends Disposable {}


/** mindustry.graphics.g3d.MultiMesh */
declare class MultiMesh implements GenericMesh {
    constructor(...meshes: Array<GenericMesh>)
}
interface MultiMesh extends GenericMesh {}
/** mindustry.graphics.g3d.MatMesh */
declare class MatMesh implements GenericMesh {
    constructor(mesh: GenericMesh, mat: Mat3D)
}
interface MatMesh extends GenericMesh {}
/** mindustry.graphics.g3d.PlanetMesh */
declare class PlanetMesh implements GenericMesh {}
interface PlanetMesh extends GenericMesh {}
/** mindustry.graphics.g3d.ShaderSphereMesh */
declare class ShaderSphereMesh extends PlanetMesh {
    constructor(pla: Planet, shader: Shader, div: number)
}
/** mindustry.graphics.g3d.HexMesher */
interface HexMesher {}
/** mindustry.graphics.g3d.HexMesh */
declare class HexMesh extends PlanetMesh {
    constructor()
    constructor(pla: Planet, div: number)
    constructor(pla: Planet, mesher: HexMesher, div: number, shader: Shader)
}
/** mindustry.graphics.g3d.SunMesh */
declare class SunMesh extends HexMesh {
    constructor(pla: Planet, div: number, oct: number, persis: number, scl: number, pow: number, mag: number, colorScl: number, ...colors: Array<Color>)
}
/** mindustry.graphics.g3d.NoiseMesh */
declare class NoiseMesh extends HexMesh {
    constructor(pla: Planet, seed: number, div: number, color: Color, rad: number, oct: number, persis: number, scl: number, mag: number)
    constructor(pla: Planet, seed: number, div: number, rad: number, oct: number, persis: number, scl: number, mag: number, color1: Color, color2: Color, coct: number, cpersis: number, cscl: number, cthr: number)
}
/** mindustry.graphics.g3d.HexSkyMesh */
declare class HexSkyMesh extends PlanetMesh {
    speed: number;

    constructor()
    constructor(pla: Planet, seed: number, speed: number, rad: number, div: number, color: Color, oct: number, persis: number, scl: number, thr: number)
}


/** mindustry.graphics.g3d.MeshBuilder */
declare class MeshBuilder {
    static buildIcosphere(div: number, rad: number): Mesh
    static buildPlanetGrid(grid: PlanetGrid, color: Color, scl: number): Mesh
    static buildHex(color: Color, div: number, rad: number): Mesh
    static buildHex(mesher: HexMesher, div: number, rad: number, intens: number): Mesh
}


/** mindustry.graphics.g3d.PlanetParams */
declare class PlanetParams {
    camPos: Vec3;
    otherCamPos: Vec3|null;
    oterhCamAlpha: number;
    camUp: Vec3;
    camDir: Vec3;
    planet: Planet;
    zoom: number;
    uiAlpha: number;
    drawUi: boolean;
    drawSkybox: boolean;
    renderer: PlanetRenderer.PlanetInterfaceRenderer|null;
    viewW: number;
    viewH: number;
    alwaysDrawAtmosphere: boolean;
}
/** mindustry.graphics.g3d.PlanetRenderer */
declare class PlanetRenderer implements Disposable {
    static readonly outlineRad: number;
    static readonly camLength: number;
    static readonly outlineColor: Color;
    static readonly hoverColor: Color;
    static readonly borderColor: Color;
    static readonly shadowColor: Color;
    readonly cam: Camera3D;
    readonly batch: VertexBatch3D;
    readonly projector: PlaneBatch3D;
    readonly mat: Mat3D;
    readonly bloom: Bloom;
    readonly atmosphere: Mesh;
    readonly skybox: CubemapMesh;
}
interface PlanetRenderer extends Disposable {}
declare namespace PlanetRenderer {
    interface PlanetInterfaceRenderer {}
}


/** mindustry.graphics.g3d.PlanetGrid */
declare class PlanetGrid {
    size: number;
    tiles: Array<PlanetGrid.Ptile>;
    corners: Array<PlanetGrid.Corner>;
    edges: Array<PlanetGrid.Edge>;

    static create(size: number): PlanetGrid
    static initialGrid(): PlanetGrid
    static subdividedGrid(gridPrev: PlanetGrid): PlanetGrid
}
declare namespace PlanetGrid {
    class Ptile {
        static readonly empty: Ptile;
        id: number;
        edgeCount: number;
        tiles: Array<Ptile>;
        corners: Array<Corner>;
        edges: Array<Edge>;
        v: Vec3;

        constructor(id: number, edgeCount: number)
    }
    class Corner {
        id: number;
        tiles: Array<Ptile>;
        corners: Array<Corner>;
        edges: Array<Edge>;
        v: Vec3;

        constructor(id: number)
    }
    class Edge {
        id: number;
        tiles: Array<Ptile>;
        corners: Array<Corner>;

        constructor(id: number)
    }
}
