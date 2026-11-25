/** lovec.graphics.SLCDraw */
declare class SLCDraw {
    static readonly NORMAL_REGION_Z_IND: number;
    static readonly SHADOW_REGION_Z_IND: number;
    static readonly GLOW_REGION_Z_IND: number;
    static readonly ICON_REGION_Z_IND: number;
    static readonly BULLET_REGION_Z_IND: number;
    static readonly UI_REGION_Z_IND: number;
    static readonly SHAPE_Z_IND: number;
    static readonly DEBUG_Z_IND: number;

    static processZ(z: number, ind: number): void
    static processZ(z: number): void
    static processScl(xscl: number, yscl: number, ind: number): void
    static processScl(xscl: number, yscl: number): void
    static processScl(scl: number, ind: number): void
    static processScl(scl: number): void
    static line(x1: number, y1: number, x2: number, y2: number, isDashed: boolean): void
    static line(x1: number, y1: number, x2: number, y2: number): void
    static segLine(segReg: TextureRegion, x1: number, y1: number, x2: number, y2: number, segScl: number, strokeScl: number): void
    static segLine(segReg: TextureRegion, x1: number, y1: number, x2: number, y2: number, segScl: number): void
    static segLine(segReg: TextureRegion, x1: number, y1: number, x2: number, y2: number): void
    static radialLine(x: number, y: number, ang: number, clipRad: number): void
    static radialLine(x: number, y: number, ang: number): void
    static roundLine(x1: number, y1: number, x2: number, y2: number, inv: boolean, a: number, segAmt: number): void
    static roundLine(x1: number, y1: number, x2: number, y2: number, inv: boolean, a: number): void
    static roundLine(x1: number, y1: number, x2: number, y2: number, inv: boolean): void
    static roundLine(x1: number, y1: number, x2: number, y2: number): void
    static sLine(x1: number, y1: number, x2: number, y2: number, inv: boolean, a: number, segAmt: number): void
    static sLine(x1: number, y1: number, x2: number, y2: number, inv: boolean, a: number): void
    static sLine(x1: number, y1: number, x2: number, y2: number, inv: boolean): void
    static sLine(x1: number, y1: number, x2: number, y2: number): void
    static vecOffLine(x1: number, y1: number, x2: number, y2: number, vec: Vec2, segAmt: number): void
    static vecOffLine(x1: number, y1: number, x2: number, y2: number, vec: Vec2): void
    static rect(x: number, y: number, r: number, size: number, isDashed: boolean): void
    static rect(x: number, y: number, r: number, size: number): void
    static area(x: number, y: number, size: number): void
    static circle(x: number, y: number, rad: number, isDashed: boolean): void
    static circle(x: number, y: number, rad: number): void
    static ring(x: number, y: number, radIn: number, radOut: number, ang: number, frac: number, rev: boolean): void
    static ring(x: number, y: number, radIn: number, radOut: number, ang: number, frac: number): void
    static ring(x: number, y: number, radIn: number, radOut: number, ang: number): void
    static ring(x: number, y: number, radIn: number, radOut: number): void
    static disk(x: number, y: number, rad: number): void
    static shieldCircle(x: number, y: number, rad: number, color: Color, a: number): void
    static shieldCircle(x: number, y: number, rad: number, color: Color): void
    static region(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number, z: number): void
    static region(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number): void
    static region(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color): void
    static region(x: number, y: number, reg: TextureRegion, ang: number, regScl: number): void
    static region(x: number, y: number, reg: TextureRegion, ang: number): void
    static region(x: number, y: number, reg: TextureRegion): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number, mixcolA: number, z: number): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number, mixcolA: number): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number, regScl: number): void
    static regionMixcol(x: number, y: number, reg: TextureRegion, ang: number): void
    static regionMixcol(x: number, y: number, reg: TextureRegion): void
    static regionIcon(x: number, y: number, reg: TextureRegion, size: number, wScl: number, z: number): void
    static regionIcon(x: number, y: number, reg: TextureRegion, size: number, wScl: number): void
    static regionIcon(x: number, y: number, reg: TextureRegion, size: number): void
    static regionIcon(x: number, y: number, reg: TextureRegion): void
    static content(x: number, y: number, ct: Object, size: number, ang: number, z: number): void
    static content(x: number, y: number, ct: Object, size: number, ang: number): void
    static content(x: number, y: number, ct: Object, size: number): void
    static content(x: number, y: number, ct: Object): void
    static contentIcon(x: number, y: number, ct: Object, size: number, wScl: number): void
    static contentIcon(x: number, y: number, ct: Object, size: number): void
    static contentIcon(x: number, y: number, ct: Object): void
}
/** lovec.graphics.SLCDrawf */
declare class SLCDrawf {
    static readonly wireSegScl: number;
    static arrowReg: TextureRegion;
    static heatRegs: Array<TextureRegion>;
    static lightConeReg: TextureRegion;
    static wireGlowReg: TextureRegion;
    static wireShaReg: TextureRegion;
    static shapeLay: number;
    static mineBeamLay: number;
    static bulFlameLay: number;
    static randOvLay: number;
    static dporeLay: number;
    static wireMatRegMap: ObjectMap<string, TextureRegion>;
    static wireMatEndRegMap: ObjectMap<string, TextureRegion>;

    static init(): void
    static debug(x: number, y: number, color: Color): void
    static debug(x: number, y: number): void
    static debug(x1: number, y1: number, x2: number, y2: number, color: Color): void
    static debug(x1: number, y1: number, x2: number, y2: number): void
    static line(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, color: Color, a: number, z: number): void
    static line(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, color: Color, a: number): void
    static line(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, color: Color): void
    static line(x1: number, y1: number, x2: number, y2: number, isDashed: boolean): void
    static line(x1: number, y1: number, x2: number, y2: number): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, stroke: number, scl: number, color: Color, z: number): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, stroke: number, scl: number, color: Color): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, stroke: number, scl: number): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number, isDashed: boolean, stroke: number): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number, isDashed: boolean): void
    static lineFlick(x1: number, y1: number, x2: number, y2: number): void
    static getLaserA(strokeScl: number, useLaserA: boolean, useUnitLaserA: boolean, useLod: boolean): number
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean, z: number): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color1: Color, color2: Color, a: number): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color1: Color, color2: Color): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color: Color, a: number, hasLight: boolean, z: number): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color: Color, a: number, hasLight: boolean): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color: Color, a: number): void
    static laser(x1: number, y1: number, x2: number, y2: number, strokeScl: number, color: Color): void
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean, z: number): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number, hasLight: boolean, z: number): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number, hasLight: boolean): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number): Vec2
    static laserRandWalk(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean, z: number): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number, hasLight: boolean): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color, a: number): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color1: Color, color2: Color): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number, hasLight: boolean, z: number): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number, hasLight: boolean): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color, a: number): Vec2
    static laserRandMine(x: number, y: number, cx: number, cy: number, rad: number, offTime: number, rot: number, strokeScl: number, color: Color): Vec2
    static arrowLine(x1: number, y1: number, x2: number, y2: number, strokeScl: number, scl: number, color: Color, a: number, z: number): void
    static arrowLine(x1: number, y1: number, x2: number, y2: number, strokeScl: number, scl: number, color: Color, a: number): void
    static arrowLine(x1: number, y1: number, x2: number, y2: number, strokeScl: number, scl: number, color: Color): void
    static arrowLine(x1: number, y1: number, x2: number, y2: number, strokeScl: number, scl: number): void
    static wire(x1: number, y1: number, x2: number, y2: number, wireMat: string, strokeScl: number, glowA: number, z: number): void
    static wire(x1: number, y1: number, x2: number, y2: number, wireMat: string, strokeScl: number, glowA: number): void
    static wire(x1: number, y1: number, x2: number, y2: number, wireMat: string, strokeScl: number): void
    static wire(x1: number, y1: number, x2: number, y2: number, wireMat: string): void
    static rect(x: number, y: number, r: number, size: number, isDashed: boolean, color: Color, a: number, z: number): void
    static rect(x: number, y: number, r: number, size: number, isDashed: boolean, color: Color, a: number): void
    static rect(x: number, y: number, r: number, size: number, isDashed: boolean, color: Color): void
    static rect(x: number, y: number, r: number, size: number, isDashed: boolean): void
    static rect(x: number, y: number, r: number, size: number): void
    static rectPlace(blk: Block, tx: number, ty: number, r: number, isDashed: boolean, color: Color): void
    static rectPlaceRot(blk: Block, tx: number, ty: number, r: number, rot: number, isDashed: boolean, color: Color): void
    static rectSelect(b: Building, r: number, isDashed: boolean, color: Color): void
    static rectSelectRot(b: Building, r: number, rot: number, isDashed: boolean, color: Color): void
    static area(x: number, y: number, size: number, color: Color, a: number, z: number): void
    static area(x: number, y: number, size: number, color: Color, a: number): void
    static area(x: number, y: number, size: number, color: Color): void
    static area(x: number, y: number, size: number): void
    static area(x: number, y: number): void
    static areaShrink(t: Tile|null, size: number, color: Color, a: number, z: number): void
    static areaShrink(t: Tile|null, size: number, color: Color, a: number): void
    static areaShrink(t: Tile|null, size: number, color: Color): void
    static areaShrink(t: Tile|null, size: number): void
    static areaShrink(t: Tile|null): void
    static areaBuild(b: Building, pad: number, color: Color, a: number, z: number): void
    static areaBuild(b: Building, pad: number, color: Color, a: number): void
    static areaBuild(b: Building, pad: number, color: Color): void
    static areaBuild(b: Building, pad: number): void
    static areaBuild(b: Building): void
    static pulseRect(x: number, y: number, rad: number, scl: number, color: Color, a: number, z: number): void
    static pulseRect(x: number, y: number, rad: number, scl: number, color: Color, a: number): void
    static pulseRect(x: number, y: number, rad: number, scl: number, color: Color): void
    static pulseRect(x: number, y: number, rad: number, scl: number): void
    static pulseRect(x: number, y: number, rad: number): void
    static circle(x: number, y: number, rad: number, isDashed: boolean, color: Color, a: number, z: number): void
    static circle(x: number, y: number, rad: number, isDashed: boolean, color: Color, a: number): void
    static circle(x: number, y: number, rad: number, isDashed: boolean, color: Color): void
    static circle(x: number, y: number, rad: number, isDashed: boolean): void
    static circle(x: number, y: number, rad: number): void
    static circlePlace(blk: Block, tx: number, ty: number, rad: number, isDashed: boolean, color: Color): void
    static circleSelect(b: Building, rad: number, isDashed: boolean, color: Color): void
    static diskExpand(x: number, y: number, rad: number, scl: number, color: Color, a: number, z: number): void
    static diskExpand(x: number, y: number, rad: number, scl: number, color: Color, a: number): void
    static diskExpand(x: number, y: number, rad: number, scl: number, color: Color): void
    static diskExpand(x: number, y: number, rad: number, scl: number): void
    static diskExpand(x: number, y: number, rad: number): void
    static diskWarning(x: number, y: number, rad: number, scl: number, color: Color, a: number, z: number): void
    static diskWarning(x: number, y: number, rad: number, scl: number, color: Color, a: number): void
    static diskWarning(x: number, y: number, rad: number, scl: number, color: Color): void
    static diskWarning(x: number, y: number, rad: number, scl: number): void
    static diskWarning(x: number, y: number, rad: number): void
    static pulseCircle(x: number, y: number, rad: number, scl: number, color: Color, a: number, z: number): void
    static pulseCircle(x: number, y: number, rad: number, scl: number, color: Color, a: number): void
    static pulseCircle(x: number, y: number, rad: number, scl: number, color: Color): void
    static pulseCircle(x: number, y: number, rad: number, scl: number): void
    static pulseCircle(x: number, y: number, rad: number): void
    static connectorRect(b: Building|null, ob: Building): void
    static connectorArea(b: Building|null, ob: Building): void
    static connectorCircleArrow(b: Building|null, b_f: Building, b_t: Building, bs_f: Array<Building>, bs_t: Array<Building>): void
    static connectorCircleArrow(b: Building|null, b_f: Building, b_t: Building): void
    static side(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, rot: number, color: Color, a: number, z: number): void
    static side(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, rot: number, color: Color, a: number): void
    static side(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, rot: number, color: Color): void
    static side(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, rot: number): void
    static side(x: number, y: number, reg: TextureRegion, rot: number, color: Color, a: number, z: number): void
    static side(x: number, y: number, reg: TextureRegion, rot: number, color: Color, a: number): void
    static side(x: number, y: number, reg: TextureRegion, rot: number, color: Color): void
    static side(x: number, y: number, reg: TextureRegion, rot: number): void
    static edge(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, color: Color, a: number, z: number): void
    static edge(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, color: Color, a: number): void
    static edge(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion, color: Color): void
    static edge(x: number, y: number, reg1: TextureRegion, reg2: TextureRegion): void
    static edge(x: number, y: number, reg: TextureRegion, color: Color, a: number, z: number): void
    static edge(x: number, y: number, reg: TextureRegion, color: Color, a: number): void
    static edge(x: number, y: number, reg: TextureRegion, color: Color): void
    static edge(x: number, y: number, reg: TextureRegion): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number, regScl: number, sideAmt: number, color: Color, a: number, z: number): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number, regScl: number, sideAmt: number, color: Color, a: number): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number, regScl: number, sideAmt: number, color: Color): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number, regScl: number, sideAmt: number): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number, regScl: number): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number, ang: number): void
    static spin(x: number, y: number, reg: TextureRegion, prog: number, spd: number): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number, ang: number, regScl: number, color: Color, a: number, z: number): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number, ang: number, regScl: number, color: Color, a: number): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number, ang: number, regScl: number, color: Color): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number, ang: number, regScl: number): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number, ang: number): void
    static fade(x: number, y: number, reg: TextureRegion, fadeScl: number): void
    static fade(x: number, y: number, reg: TextureRegion): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number, ang: number, regScl: number, color: Color, a: number, z: number): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number, ang: number, regScl: number, color: Color, a: number): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number, ang: number, regScl: number, color: Color): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number, ang: number, regScl: number): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number, ang: number): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number, fadeScl: number): void
    static fadeProg(x: number, y: number, reg: TextureRegion, prog: number): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number, ang: number, regScl: number, color: Color, a: number, z: number): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number, ang: number, regScl: number, color: Color, a: number): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number, ang: number, regScl: number, color: Color): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number, ang: number, regScl: number): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number, ang: number): void
    static fadeAlert(x: number, y: number, reg: TextureRegion, frac: number): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number, color: Color, a: number, pulse: number, pulseScl: number, z: number): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number, color: Color, a: number, pulse: number, pulseScl: number): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number, color: Color, a: number, z: number): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number, color: Color, a: number): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number, color: Color): void
    static glow(x: number, y: number, reg: TextureRegion, ang: number): void
    static glow(x: number, y: number, reg: TextureRegion): void
    static heat(x: number, y: number, reg: TextureRegion, frac: number, size: number, ang: number, color: Color, z: number): void
    static heat(x: number, y: number, reg: TextureRegion, frac: number, size: number, ang: number, color: Color): void
    static heat(x: number, y: number, reg: TextureRegion, frac: number, size: number, ang: number): void
    static heat(x: number, y: number, reg: TextureRegion, frac: number, size: number): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number, ang: number, offInd: number, color: Color, a: number, z: number): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number, ang: number, offInd: number, color: Color, a: number): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number, ang: number, offInd: number, color: Color): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number, ang: number, offInd: number): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number, ang: number): void
    static frame(x: number, y: number, regs: Array<TextureRegion>, prog: number, intv: number): void
    static scan(x: number, y: number, prog: number, warmup: number, size: number, color: Color, a: number, z: number): void
    static scan(x: number, y: number, prog: number, warmup: number, size: number, color: Color, a: number): void
    static scan(x: number, y: number, prog: number, warmup: number, size: number, color: Color): void
    static scan(x: number, y: number, prog: number, warmup: number, size: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radIn: number, radScl: number, radMag: number, radInMag: number, color: Color, a: number, z: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radIn: number, radScl: number, radMag: number, radInMag: number, color: Color, a: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radIn: number, radScl: number, radMag: number, radInMag: number, color: Color): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radIn: number, radScl: number, radMag: number, radInMag: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radScl: number, color: Color, a: number, z: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radScl: number, color: Color, a: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radScl: number, color: Color): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, radScl: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, color: Color, a: number, z: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, color: Color, a: number): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number, color: Color): void
    static flame(x: number, y: number, reg: TextureRegion, warmup: number, rad: number): void
    static torch(x: number, y: number, warmup: number, len: number, w: number, size: number, color: Color, colorIn: Color, ang: number, a: number, z: number): void
    static torch(x: number, y: number, warmup: number, len: number, w: number, size: number, color: Color, colorIn: Color, ang: number, a: number): void
    static torch(x: number, y: number, warmup: number, len: number, w: number, size: number, color: Color, colorIn: Color, ang: number): void
    static torch(x: number, y: number, warmup: number, len: number, w: number, size: number, color: Color, colorIn: Color): void
    static light(x: number, y: number, warmup: number, rad: number, size: number, color: Color, a: number, sinScl: number, sinMag: number): void
    static light(x: number, y: number, warmup: number, rad: number, size: number, color: Color, a: number): void
    static light(x: number, y: number, warmup: number, rad: number, size: number, color: Color): void
    static light(x: number, y: number, warmup: number, rad: number, size: number): void
    static light(x: number, y: number, warmup: number, rad: number): void
    static lightArc(x: number, y: number, warmup: number, rad: number, coneScl: number, ang: number, color: Color, a: number): void
    static lightArc(x: number, y: number, warmup: number, rad: number, coneScl: number, ang: number, color: Color): void
    static lightArc(x: number, y: number, warmup: number, rad: number, coneScl: number, ang: number): void
    static progressBar(x: number, y: number, frac: number, size: number, color: Color, a: number, offW: number, offTy: number, z: number): void
    static progressBar(x: number, y: number, frac: number, size: number, color: Color, a: number, offW: number, offTy: number): void
    static progressBar(x: number, y: number, frac: number, size: number, color: Color, a: number, offW: number): void
    static progressBar(x: number, y: number, frac: number, size: number, color: Color, a: number): void
    static progressBar(x: number, y: number, frac: number, size: number, color: Color): void
    static progressBar(x: number, y: number, frac: number, size: number): void
    static progressBar(x: number, y: number, frac: number): void
    static progressRing(x: number, y: number, frac: number, rev: boolean, stroke: number, rad: number, ang: number, color: Color, a: number, z: number): void
    static progressRing(x: number, y: number, frac: number, rev: boolean, stroke: number, rad: number, ang: number, color: Color, a: number): void
    static progressRing(x: number, y: number, frac: number, rev: boolean, stroke: number, rad: number, ang: number, color: Color): void
    static progressRing(x: number, y: number, frac: number, rev: boolean, stroke: number, rad: number, ang: number): void
    static progressRing(x: number, y: number, frac: number, rev: boolean, stroke: number, rad: number): void
    static textPlace(blk: Block, tx: number, ty: number, str: string, valid: boolean, offTy: number): void
    static textPlace(blk: Block, tx: number, ty: number, str: string, valid: boolean): void
    static textPlace(blk: Block, tx: number, ty: number, str: string): void
    static textSelect(b: Building, str: string, valid: boolean, offTy: number): void
    static textSelect(b: Building, str: string, valid: boolean): void
    static textSelect(b: Building, str: string): void
    static blockStatus(x: number, y: number, size: number, color: Color, z: number): void
    static blockStatus(x: number, y: number, size: number, color: Color): void
    static stackStatus(unit: Unit): void
    static getRandWalkVec(out: Vec2, time: number): Vec2
    static randomOverlay(t: Tile, regs: Array<TextureRegion>, denom: number, off1: number, off2: number): boolean
    static depthOverlay(drawnMap: ObjectMap<Tile, boolean>, blk: Block): void
    static construct(x: number, y: number, reg: TextureRegion, frac: number, ang: number, color: Color, z: number): void
    static construct(x: number, y: number, reg: TextureRegion, frac: number, ang: number, color: Color): void
    static construct(x: number, y: number, reg: TextureRegion, frac: number, ang: number): void
    static construct(x: number, y: number, reg: TextureRegion, frac: number): void
    static plan(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number, z: number): void
    static plan(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color, a: number): void
    static plan(x: number, y: number, reg: TextureRegion, ang: number, regScl: number, color: Color): void
    static plan(x: number, y: number, reg: TextureRegion, ang: number, regScl: number): void
    static plan(x: number, y: number, reg: TextureRegion, ang: number): void
    static plan(x: number, y: number, reg: TextureRegion): void
    static planPlace(blk: Block, t: Tile, ang: number): void
    static planPlace(blk: Block, t: Tile): void
    static tree(reg: TextureRegion, shaReg: TextureRegion, t: Tile, rad: number, offSha: number, scl: number, mag: number, wob: number, a: number, z: number, shouldDrawWobble: boolean, shouldCheckDst: boolean): void
    static tree(reg: TextureRegion, shaReg: TextureRegion, t: Tile, rad: number, offSha: number, scl: number, mag: number, wob: number, a: number, z: number, shouldDrawWobble: boolean): void
    static tree(reg: TextureRegion, shaReg: TextureRegion, t: Tile, rad: number, offSha: number, scl: number, mag: number, wob: number, a: number, z: number): void
    static baseBlockDrawPlace(blk: Block, tx: number, ty: number, rot: number, valid: boolean): void
    static baseBuildingDraw(b: Building): void
}
/** lovec.graphics.SLCDrawP3d */
declare class SLCDrawP3d {
    static readonly camOffY: number;
    static readonly camOffScl: number;

    static toP3dCoord(coord: number, z3d: number, isY: boolean): number
    static toP3dX(x: number, z3d: number): number
    static toP3dY(y: number, z3d: number): number
    static calcOffZ(zInd: number, x: number, y: number): number
    static wall(x1: number, y1: number, x2: number, y2: number, z3d: number, colorIn: Color, colorOut: Color): void
    static wall(x1: number, y1: number, x2: number, y2: number, z3d: number, color: Color): void
    static room(x: number, y: number, z3d: number, w: number, h: number, colorIn: Color, colorOut: Color): void
    static room(x: number, y: number, z3d: number, w: number, h: number, color: Color): void
    static room(x: number, y: number, z3d: number, w: number, colorIn: Color, colorOut: Color): void
    static room(x: number, y: number, z3d: number, w: number, color: Color): void
    static roomFade(x: number, y: number, z3d: number, w: number, h: number, color: Color): void
    static roomFade(x: number, y: number, z3d: number, w: number, color: Color): void
    static cylinder(x: number, y: number, z3d: number, rad: number, colorIn: Color, colorOut: Color): void
    static cylinder(x: number, y: number, z3d: number, rad: number, color: Color): void
    static cylinderFade(x: number, y: number, z3d: number, rad: number, color: Color): void
    static reg(x: number, y: number, z3d: number, reg: TextureRegion, regScl: number, colorMix: Color): void
}


/** lovec.graphics.SLCPal */
declare class SLCPal {
    static accent: Color;
    static techBlue: Color;
    static gray: Color;
    static place: Color;
    static remove: Color;
    static heal: Color;
    static lightDef: Color;
    static heatDef: Color;
}
/** lovec.graphics.SLCRgb */
declare class SLCRgb {
    static calcLuminance(r: number, g: number, b: number, a: number): number
    static calcLuminance(r: number, g: number, b: number): number
    static calcLuminance(color: Color): number
    static calcLightness(r: number, g: number, b: number, a: number): number
    static calcLightness(r: number, g: number, b: number): number
    static calcLightness(color: Color): number
    static grayscale(r: number, g: number, b: number, a: number): Color
    static grayscale(r: number, g: number, b: number): Color
    static grayscale(color: Color): Color
    static negative(r: number, g: number, b: number, a: number): Color
    static negative(r: number, g: number, b: number): Color
    static negative(color: Color): Color
}


/** lovec.graphics.SLCTexture */
declare class SLCTexture {
    static getBlockRegion(nameBlk: string): TextureRegion
    static getBlockRegion(blk: Block): TextureRegion
    static getBlockRegionString(nameBlk: string): string
    static getBlockRegionString(blk: Block): string
}
