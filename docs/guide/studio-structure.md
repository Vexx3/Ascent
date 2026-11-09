# Studio Structure

This page shows where everything lives in the Explorer, so you know where to look
when another page names a folder.

## What you edit

Almost every change you make to your game happens in one of these. Their folders
have an orange icon in the Explorer, so you can tell them from the kit's own.

| Explorer path | What's in it |
| :-- | :-- |
| `ReplicatedStorage > Config` | All of the kit's settings. Start here. |
| `Workspace > Towers` | Your towers. |
| `Workspace > Portals` | The parts players touch to enter a tower. See [Markers & Portals](./markers-portals.md). |
| `Workspace > Markers` | Named spots players get sent to, such as `SpawnLocation` and `WinroomSpawn`. |
| `Workspace > Rig` | The character the shop shows cosmetics on. |
| `Workspace > Lobby` | Optional. Your lobby, which players can hide while they climb with the **Unload All** setting. |
| `ServerStorage > TowerCheckpoints` | Each tower's checkpoints. |
| `ServerStorage > TowerClientObjects` | Each tower's client objects. See [Client-Sided Objects](./client-objects.md). |
| `ServerStorage > TicketShopItems > Tools` | Tools sold in the shop or given by game passes. |
| `ServerStorage > Cosmetics` | Trails and auras. |
| `ServerStorage > CompletionTools` | Tools given for beating a tower. |
| `StarterGui` | The menus and HUD. See [The menus](#the-menus) below. |
| `ReplicatedStorage > Design` | The menus' colours, fonts and sizes. See [Styling the Menu & HUD](./styling.md). |
| `SoundService > Menu` | The menus' sounds. See [Menu sounds](./ui-and-hud.md#menu-sounds). |
| `ServerScriptService > CustomCommands` | Your own admin commands. |

Your own scripts go in `ServerScriptService` and `StarterPlayer > StarterPlayerScripts`,
next to the kit's folders rather than inside them. See
[Hooking Into the Kit](./hooks.md).

The kit's own code is in `ServerScriptService > Server`,
`StarterPlayer > StarterPlayerScripts > Client` and `ReplicatedStorage > Shared`.
You don't need to open these to make a game. If you want to, see
[Extending the Kit](./extending-gameplay.md#where-code-goes).

## The menus

The menus are ScreenGuis in `StarterGui` you can redesign in Studio. The kit finds
each part by its **name**, so you can move, resize and restyle anything as long as
you keep the names. The [Ascent Setup plugin](./tower-setup-plugin.md#the-check-window)'s
Check window lists any name that's missing.

The hub has its own screen, `RingSelect`, instead of these. In the hub, the orange
folders are `Config`, `Design`, `Workspace > Rings`, `SoundService > RingSelect` and
`SoundService > Menu`.
See [Ring Select](./ring-select.md).

## Names that matter

- Tower acronyms, shop item IDs and cosmetic IDs are case-sensitive, and they're
  saved with players. Don't rename them after release.
- A Tool or model that Config names must match it exactly, spaces and capitals
  included, such as `Gravity Coil`.
- Leave template names such as `Template` and `Place` as they are. The kit copies
  them to build lists.
