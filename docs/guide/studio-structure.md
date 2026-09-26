# Studio Structure

## What You Edit

Almost every change a fangame makes is in one of these:

| Explorer location | For |
| :-- | :-- |
| `ReplicatedStorage > Shared > Config` | Settings. Start here. |
| `Workspace > Towers` | Your towers. |
| `Workspace > Portals` | Portals into towers. See [Markers & Portals](./markers-portals.md). |
| `Workspace > Markers` | Named spots players are sent to, like `SpawnLocation` and `WinroomSpawn`. |
| `Workspace > Rig` | The character the shop previews cosmetics on. |
| `Workspace > Lobby` | Optional. Hidden while a player is in a tower, with the **Unload All** setting. |
| `ServerStorage > TowerCheckpoints` | Each tower's checkpoints. |
| `ServerStorage > TicketShopItems > Tools` | Tools sold in the shop or given by passes. |
| `ServerStorage > Cosmetics` | Trails and auras. |
| `ServerStorage > CompletionTools` | Tools given for beating towers. |
| `StarterGui` | The menus. See below. |
| `ServerScriptService > CustomCommands` | Your own admin commands. |
| Your own Scripts in `ServerScriptService` and `StarterPlayerScripts` | Your own code, using [the hooks](./hooks.md). |

The kit's code is in `ServerScriptService > Server`, `StarterPlayer > StarterPlayerScripts > Client` and `ReplicatedStorage > Shared`. See [Extending the Kit](./extending-gameplay.md#where-code-goes) for which folder does what.

## The Menus

The menus are ScreenGuis you lay out in Studio, and the kit finds their parts **by name**. Restyle and move them freely, but keep the names.

```text
StarterGui
├─ MainMenu
│  ├─ ButtonsHolder             -- buttons on screen while playing
│  └─ Main
│     ├─ ButtonsContainer       -- the row of menu buttons
│     └─ MenusContainer
│        ├─ SettingsMenu
│        ├─ TeleportMenu
│        ├─ ShopMenu
│        ├─ CosmeticsMenu       -- optional
│        └─ CompletionsMenu
├─ TowerGUI                     -- the timer and tower name
└─ EffectGUI
```

The hub has only its own `RingSelect` screen. See [Ring Select](./ring-select.md).

`ButtonsHolder`, `Main`, `ButtonsContainer` and `MenusContainer` are required: without one, the loading screen never goes away. A missing name inside a menu turns that menu off, with a warning in the Output. The [Tower Setup window](./tower-setup-plugin.md#setup)'s Setup tab checks every name before you press Play.

## Names

- Tower acronyms and saved IDs (shop items, cosmetics) are case-sensitive and permanent.
- Asset names must match Config exactly, such as `Gravity Coil`.
- Keep template names like `Template` and `Place` as they are.
