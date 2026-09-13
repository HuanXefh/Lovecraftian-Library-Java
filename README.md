# Lovecraftian Library

A **JavaScript** library mostly made for my other mods, containing various utility methods and all the content templates. The library does not add any new contents.

Despite being a Java mod, the majority of the mod is based on JavaScript (and TypeScript for IDE). See the [scripts](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/assets/scripts) folder if you are interested in code.

Library features:

- Method extension for convenience in JS modding.

- Prototype-based JavaScript class structure and methods.

- Content templates that inherits properties and methods for adding contents, which also supports JSON/HJSON.

- Code for multi-crafters and more.

Lovec is based on my previous mod [Reindustrialization](https://github.com/HuanXefh/Reindustrialization), which has been archived and separated into several mods now. Also see [LovecLab](https://github.com/HuanXefh/Lovecraftian-Laboratory) and [ProjReind](https://github.com/HuanXefh/Project-Reindustrialization) where actual contents are created.

Mod forum on Discord [here](https://discord.com/channels/391020510269669376/1346118807734845440).

<br>

## Mod compatibility

This lib is compatible with most mods.

However, due to heavy modification of JavaScript environment, this lib is unlikely to be compatible with other JS lib mods that also make major changes. If that happens, let me know.

<br>

## For JavaScript modding learners

It's not a good start to learn JavaScript modding by looking up codes here. Lovec brings major changes in code structure and common methods, thus the difficulty to understand what's going on. For beginners, I personally recommend [Sapphirium](https://github.com/3Snake3/Sapphirium) and [More Defences](https://github.com/coaldeficit/MoreDefences).

A lot of methods in Lovec are defined globally (and used everywhere). See [globalScript.js](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/assets/scripts/globalScript.js), [glbScr](https://github.com/HuanXefh/Lovecraftian-Library-Java/tree/master/assets/scripts/run/glbScr) and [jsExt](https://github.com/HuanXefh/Lovecraftian-Library-Java/tree/master/assets/scripts/run/jsExt) for more info.

<br>

## Tutorial

Here's a list of tutorials to help understanding structure and function of the lib.

---

- [File Structure](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/document/tutorial/file-structure.md)

- [Custom Tags](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/document/tutorial/custom-tags.md)

- [Global Script (WIP)]()

- [DB Object (WIP)]()

- [Extended JS Methods (WIP)]()

- [Function Decorator (WIP)]()

- [Lovec Class](https://github.com/HuanXefh/Lovecraftian-Library-Java/blob/master/document/tutorial/lovec-class.md)

- [Content Template (WIP)]()

- [Content Template Using JSON/HJSON (WIP)]()

- [Java Bridging (WIP)]()

---
