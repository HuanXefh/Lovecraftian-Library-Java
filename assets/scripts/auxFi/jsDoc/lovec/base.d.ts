type D2Array<T> = Array<Array<T>>
type D3Array<T> = Array<Array<Array<T>>>
type D4Array<T> = Array<Array<Array<Array<T>>>>
type D5Array<T> = Array<Array<Array<Array<Array<T>>>>>
type D6Array<T> = Array<Array<Array<Array<Array<Array<T>>>>>>


declare class _F2Array<T1, T2> extends Array<T1&T2> {}
type F2Array<T1, T2> = _F2Array<T1, T2>|Array<T1|T2>
declare class _F3Array<T1, T2, T3> extends Array<T1&T2&T3> {}
type F3Array<T1, T2, T3> = _F3Array<T1, T2, T3>|Array<T1|T2|T3>
declare class _F4Array<T1, T2, T3, T4> extends Array<T1&T2&T3&T4> {}
type F4Array<T1, T2, T3, T4> = _F4Array<T1, T2, T3, T4>|Array<T1|T2|T3|T4>
declare class _F5Array<T1, T2, T3, T4, T5> extends Array<T1&T2&T3&T4&T5> {}
type F5Array<T1, T2, T3, T4, T5> = _F5Array<T1, T2, T3, T4, T5>|Array<T1|T2|T3|T4|T5>
declare class _F6Array<T1, T2, T3, T4, T5, T6> extends Array<T1&T2&T3&T4&T5&T6> {}
type F6Array<T1, T2, T3, T4, T5, T6> = _F6Array<T1, T2, T3, T4, T5, T6>|Array<T1|T2|T3|T4|T5|T6>
declare class _F7Array<T1, T2, T3, T4, T5, T6, T7> extends Array<T1&T2&T3&T4&T5&T6&T7> {}
type F7Array<T1, T2, T3, T4, T5, T6, T7> = _F7Array<T1, T2, T3, T4, T5, T6, T7>|Array<T1|T2|T3|T4|T5|T6|T7>
declare class _F8Array<T1, T2, T3, T4, T5, T6, T7, T8> extends Array<T1&T2&T3&T4&T5&T6&T7&T8> {}
type F8Array<T1, T2, T3, T4, T5, T6, T7, T8> = _F8Array<T1, T2, T3, T4, T5, T6, T7, T8>|Array<T1|T2|T3|T4|T5|T6|T7|T8>
declare class _F9Array<T1, T2, T3, T4, T5, T6, T7, T8, T9> extends Array<T1&T2&T3&T4&T5&T6&T7&T8&T9> {}
type F9Array<T1, T2, T3, T4, T5, T6, T7, T8, T9> = _F9Array<T1, T2, T3, T4, T5, T6, T7, T8, T9>|Array<T1|T2|T3|T4|T5|T6|T7|T8|T9>
declare class _F10Array<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> extends Array<T1&T2&T3&T4&T5&T6&T7&T8&T9&T10> {}
type F10Array<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = _F10Array<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>|Array<T1|T2|T3|T4|T5|T6|T7|T8|T9|T10>
type FArray = Array<Object>


type StringGn = string|java.lang.CharSequence
type Letter = string|java.lang.Character


/** Number used in enum. */
type ENumber = number;
/** Used to fetch localized text from `Core.bundle`. */
type BundlePiece = string;


type ContentTypeGn = Class<Object>|string|null;


/** `ROW`: item_gn, amt. */
type Item2Array = F2Array<ItemGn, number>
/** `ROW`: item_gn, amt, p. */
type Item3Array = F3Array<ItemGn, number, number>
/** `ROW`: liq_gn, amt. */
type Liquid2Array = F2Array<LiquidGn, number>


/** `ARGS`: unit, staEn, time. */
type StatusReactionInvoker = C3Function<Unit, StatusEntry, number>
/** `TUPLE`: osta_gn, staReacInvoker */
type StatusReactionTuple = [StatusGn, StatusReactionInvoker]
type StatusReactionArray = F2Array<StatusGn, StatusReactionTuple>
