# Updating Ascent

A new release of Ascent is a new set of the same three files. Updating means
taking the kit's code from the new place file and keeping everything that is
yours: your Config, your towers, your menus and your assets.

It takes a few minutes per place, and nothing a player has saved is touched.

## Before you start

1. **Read the release's Updating section** in the [changelog](../changelog.md),
   and the one for every release between yours and the new one. It says what, if
   anything, has to change by hand — usually a line or two of Config.
2. **Save a copy of each place** with **File → Save to File As**, so there is a
   way back.
3. Check which version you are on: run `kit-info` in the admin console, or look
   at the Tower Setup window's Setup tab.

## What to replace and what to keep

Open the new `Ascent Area.rbxlx` in a second Studio window beside your place.

**Replace** these in your place with the new file's copy. Delete yours first,
then copy the new one across and paste it into the same service:

| Replace | What it is |
| :-- | :-- |
| `ServerScriptService > Server` | The kit's server code |
| `ServerScriptService > ServerPackages` | The admin console library |
| `StarterPlayer > StarterPlayerScripts > Client` | The kit's client code |
| `ReplicatedStorage > Shared`, **except `Config`** | Code both sides run — see below |
| `ReplicatedStorage > Packages` | Libraries the kit uses |
| `ReplicatedStorage > Framework`, `AscentInputs`, `ChangeLighting`, `DamageEvent`, `ResetEffectGui` | The tower framework and what it talks through |

**Keep** yours:

| Keep | Why |
| :-- | :-- |
| `ReplicatedStorage > Shared > Config` | Your game's settings |
| `Workspace` | Your towers, portals, markers and lobby |
| `StarterGui` | Your menus, which may be restyled |
| `ServerStorage` | Your checkpoints, tools, cosmetics and client objects |
| `Teams` | Your teams |
| `ServerScriptService > CustomCommands`, and your own Scripts | Your code, written against [the hooks](./hooks.md) |

### Keeping Config while replacing Shared

`Config` lives inside `Shared`, so it has to step out while `Shared` is
replaced:

1. Drag your `Config` out of `Shared` into `ReplicatedStorage`.
2. Delete your `Shared`, and paste in the new file's `Shared`.
3. Delete the `Config` inside the new `Shared`.
4. Drag your `Config` back into `Shared`.

This works the same when `Config` is a
[Roblox package](./configuration.md#sharing-config-between-your-places): the
package link travels inside it.

## Config

Make the edits the release's Updating section lists, then set `configVersion`
in `Config > Project` to the number it gives. If `Config` is a package, publish
it once and every other place picks the change up.

When a server starts, it compares Config with what the kit expects and prints
anything that does not fit under **Ascent Config**, with place IDs in a second
block a moment later. After an update those blocks are the list of what is
left to do.

## Menus

The kit finds its menus by name, so a restyled menu keeps working across
updates. A release that adds something to a menu says so under Updating, with
the ScreenGui to copy across from the new file. The Setup tab of the
[Tower Setup window](./tower-setup-plugin.md) lists every name the client
looks for and marks the ones your place is missing.

## The hub

Do the same with the new `Ascent Hub.rbxlx` in your hub: replace `Server`,
`Client`, `Shared` (keeping `Config`) and `Packages`, and keep the rest.

## The Tower Setup window

Replace `Tower Setup.rbxm` in your plugins folder — **Plugins → Plugins
Folder** in Studio — and restart Studio. Its Setup tab says whether it matches
the version the place runs; one from another release checks the place against
the wrong rules.

## Check it worked

1. Press **Play** and read the Output. An **Ascent Config** or **Ascent setup**
   block lists anything still to fix.
2. Run `kit-info` in the console. It answers with the new version.
3. Publish every place. Players on an old server are told it is outdated in
   the settings menu, and move over as those servers close.

::: warning Changes you made to the kit's own scripts are replaced
Anything edited inside `Server`, `Client` or `Shared` (other than `Config`) is
overwritten by an update. Move it into a Script of your own using
[Hooking Into the Kit](./hooks.md) first, and it survives every update after.
:::
