/** mindustry.gen.Entityc */
interface Entityc {}
/** mindustry.gen.Timerc */
interface Timerc extends Entityc {}
/** mindustry.gen.Timedc */
interface Timedc extends Scaled, Entityc {}
/** mindustry.gen.Posc */
interface Posc extends Position, Entityc {}
/** mindustry.gen.Rotc */
interface Rotc extends Entityc {}
/** mindustry.gen.Drawc */
interface Drawc extends Entityc, Posc {}
/** mindustry.gen.Hitboxc */
interface Hitboxc extends QuadTree.QuadTreeObject, Sized, Entityc, Posc {}
/** mindustry.gen.Ownerc */
interface Ownerc extends Entityc {}
/** mindustry.gen.Childc */
interface Childc extends Entityc, Posc, Rotc {}
/** mindustry.gen.Syncc */
interface Syncc extends Entityc {}
/** mindustry.gen.Healthc */
interface Healthc extends Entityc, Posc {}
/** mindustry.gen.Damagec */
interface Damagec extends Entityc {}
/** mindustry.gen.Teamc */
interface Teamc extends Entityc, Posc {}
/** mindustry.gen.Velc */
interface Velc extends Entityc, Posc {}
/** mindustry.gen.Itemsc */
interface Itemsc extends Entityc, Posc {}
/** mindustry.gen.Statusc */
interface Statusc extends Entityc, Posc {}
/** mindustry.gen.Shieldc */
interface Shieldc extends Entityc, Healthc, Posc {}
/** mindustry.gen.Shielderc */
interface Shielderc extends Damagec, Entityc, Posc, Teamc {}
/** mindustry.gen.Physicsc */
interface Physicsc extends Entityc, Hitboxc, Posc, Velc {}
/** mindustry.gen.Weaponsc */
interface Weaponsc extends Entityc, Posc, Rotc, Statusc, Teamc, Velc {}
/** mindustry.gen.Builderc */
interface Builderc extends Entityc, Posc, Rotc, Statusc, Teamc {}
/** mindustry.gen.Minerc */
interface Minerc extends Drawc, Entityc, Itemsc, Posc, Rotc, Teamc {}
/** mindustry.gen.Buildingc */
interface Buildingc extends QuadTree.QuadTreeObject, AmbientSource, Sized, Entityc, Healthc, Posc, Teamc, Timerc, Controllable, Senseable, Settable, Displayable {}
/** mindustry.gen.Unitc */
interface Unitc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Velc, Weaponsc, Ranged, Senseable, Settable, Displayable {}
/** mindustry.gen.Bulletc */
interface Bulletc extends Damagec, Drawc, Entityc, Hitboxc, Ownerc, Posc, Shielderc, Teamc, Timedc, Timerc, Senseable, Settable {}
/** mindustry.gen.WeatherStatec */
interface WeatherStatec extends Drawc, Entityc, Posc, Syncc {}
/** mindustry.gen.Playerc */
interface Playerc extends UnitController, Drawc, Entityc, Posc, Syncc, Timerc {}
/** mindustry.gen.EffectStatec */
interface EffectStatec extends Childc, Drawc, Entityc, Posc, Rotc, Timedc {}
/** mindustry.gen.PowerGraphUpdaterc */
interface PowerGraphUpdaterc extends Entityc {}
/** mindustry.gen.Puddlec */
interface Puddlec extends Drawc, Entityc, Posc, Syncc {}
/** mindustry.gen.Firec */
interface Firec extends Drawc, Entityc, Posc, Syncc, Timedc {}
/** mindustry.gen.Decalc */
interface Decalc extends Drawc, Entityc, Posc, Rotc, Timedc {}


/** mindustry.gen.IndexableEntity__all */
interface IndexableEntity__all {}
/** mindustry.gen.IndexableEntity__build */
interface IndexableEntity__build {}
/** mindustry.gen.IndexableEntity__unit */
interface IndexableEntity__unit {}
/** mindustry.gen.IndexableEntity__bullet */
interface IndexableEntity__bullet {}
/** mindustry.gen.IndexableEntity__weather */
interface IndexableEntity__weather {}
/** mindustry.gen.IndexableEntity__player */
interface IndexableEntity__player {}
/** mindustry.gen.IndexableEntity__draw */
interface IndexableEntity__draw {}
/** mindustry.gen.IndexableEntity__effect */
interface IndexableEntity__effect {}
/** mindustry.gen.IndexableEntity__powerGraph */
interface IndexableEntity__powerGraph {}
/** mindustry.gen.IndexableEntity__sync */
interface IndexableEntity__sync {}


/** mindustry.gen.ElevationMovec */
interface ElevationMovec extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.WaterMovec */
interface WaterMovec extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.UnderwaterMovec */
interface UnderwaterMovec extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, WaterMovec, Weaponsc {}
/** mindustry.gen.Mechc */
interface Mechc extends Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Legsc */
interface Legsc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Payloadc */
interface Payloadc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Tankc */
interface Tankc extends Builderc, Drawc, ElevationMovec, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.TimedKillc */
interface TimedKillc extends Scaled, Entityc, Healthc, Posc {}
/** mindustry.gen.BuildingTetherc */
interface BuildingTetherc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.UnitTetherc */
interface UnitTetherc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Crawlc */
interface Crawlc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
/** mindustry.gen.Segmentc */
interface Segmentc extends Builderc, Drawc, Entityc, Healthc, Hitboxc, Itemsc, Minerc, Physicsc, Posc, Rotc, Shieldc, Statusc, Syncc, Teamc, Unitc, Velc, Weaponsc {}
