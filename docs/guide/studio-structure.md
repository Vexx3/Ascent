# Studio Structure

The kit uses ordinary Roblox services and groups its code by the name a player
would give the thing on screen. Finding the code behind something means opening
the folder with its name on it.

## What Fangame Owners Edit

Start here. Almost every change a fangame makes belongs in one of these.

| Explorer location | Use it for |
| :-- | :-- |
| `ReplicatedStorage > Shared > Config` | Normal kit settings. Start here. |
| `Workspace > Towers` | Tower models used by the current place. |
| `Workspace > Portals` | Portal parts and destination values. |
| `Workspace > Markers` | Named teleport and winroom positions. |
| `Workspace > Rig` | The character the shop previews a trail or an aura on. |
| `ServerStorage > TowerCheckpoints` | Per-tower checkpoint folders. |
| `ServerStorage > TicketShopItems > Tools` | Permanent shop and game-pass Tool templates. |
| `ServerStorage > Cosmetics` | Trail and aura templates. |
| `ServerStorage > CompletionTools` | Tools awarded for configured completions. |

`Workspace > Lobby` is optional and is only used by the `Unload All`
tower-visibility setting, which moves it out of Workspace while the player is
inside a tower and puts it back when they leave.

## Where The Code Is

A feature carries one name in every tree it appears in, so the same word finds
all of it.

| The thing on screen | Where its code is |
| :-- | :-- |
| The Teleport menu, Areas, personal servers | `Client > Teleport`, `Server > Teleport`, `Shared > Teleport` |
| The shop, the tickets counter, game-pass rows | `Client > Shop`, `Server > Shop`, `Shared > Shop` |
| Cosmetics and their previews | `Client > Cosmetics`, `Server > Cosmetics` |
| The tower timer, quick restart, Practice and All Jumps | `Client > Towers`, `Server > Towers` |
| The completions chart | `Client > Towers > Completions` |
| Spectating | `Client > Towers > Spectate`, `Server > Towers > Spectate` |
| Edit UI Layout | `Client > EditUILayout`, `Server > EditUILayout` |
| The settings menu | `Client > Settings`, `Server > Settings`, `Shared > Settings` |
| The backpack | `Client > Backpack` is the vendored Purse; the kit's own four sit beside it as `BackpackFilters`, `BackpackIcon`, `BackpackIdentity` and `BackpackLayout` |
| Saved progression and Elo | `Server > Accounts`, `Shared > Accounts` |
| The administrator console | `Server > Commands`, `Client > Commands` |

**A feature folder says which file to open first.** Its entry module is
`<Feature>Service` on the server and `<Feature>Controller` on the client — so
`Server > Shop > ShopService` is where the shop's server half begins. Two
folders keep an `init.luau` instead, because each has to be the parent of its
own children: `Server > Commands`, which Cmdr walks to find the commands, and
`Client > ClientObjects`.

## The Tree

One row per folder, with the modules inside it named beside it. The icons are
the real classes: `Server` is a Script and `Client` a LocalScript, because
each is the entry point that starts everything under it.

```text
Workspace
├─ Towers
├─ Portals
├─ Markers
└─ Rig
ReplicatedStorage
├─ Shared                 -- code both sides run
│  ├─ Config              -- Admin, Chat, CustomSettings, Economy, Elo, GamePasses, Messages, Project, RingSelect, Settings, Towers, Visuals, Worlds
│  ├─ Accounts            -- AccountData, AccountTypes, Template, Migrations, Elo, EloProfile, ProfileWatch, PlayerCharacter
│  ├─ Commands            -- Authorization
│  ├─ Cosmetics           -- CosmeticTypes
│  ├─ RingSelect          -- RingLayout
│  ├─ Settings            -- Schema, CustomSettings
│  ├─ Shop                -- EconomyFeatures, Featured, ShopTypes
│  ├─ Teleport            -- Areas, TeleportRequirements
│  ├─ Towers              -- Difficulty, Time, Touch, Attributes, TowerTypes
│  ├─ Network             -- BlinkClient
│  └─ ConfigTypes         -- and ClientInput, Formatting, InstanceDelivery, Instances, Licenses, PlayerAttributes, Rarities, Tags
├─ Packages
├─ Framework              -- the legacy EToH framework, protected
└─ AscentInputs           -- the input actions keybinds use
ServerScriptService
├─ Server                 -- the server entry point; starts everything below in order
│  ├─ Accounts            -- PlayerLifecycle, AccountLifecycle, SessionStore, PlayerState, PlayerTeams, CharacterSpawns, Progress, EloAwards, DataIntegrity
│  ├─ Announcements       -- AnnouncementsService, Webhook
│  ├─ Commands            -- Cmdr walks it, so it is a module with children
│  │  ├─ ArgumentTypes
│  │  └─ Catalog
│  ├─ Cosmetics           -- CosmeticsService, CosmeticAssets, CosmeticUnlocks, PreviewRig
│  ├─ EditUILayout        -- EditUILayoutService
│  ├─ RingSelect          -- RingSelectService, started only in the hub
│  ├─ Settings            -- SettingsService
│  ├─ Shop                -- ShopService, GamePasses, Gifting, PermanentTools, Tickets
│  ├─ Shutdown            -- ShutdownService, PlaceVersion
│  ├─ Teleport            -- TeleportService, Friends, PersonalServers, AreaBadges
│  ├─ Towers              -- TowerRegistry, Timer, Winpads, AllJumps, TowerRush, TowerRemotes, AntiCheatLog, Spectate, Godmode, Navigation, …
│  ├─ ClientObjects
│  ├─ Network             -- BlinkServer, NetworkSchema
│  └─ AssetChecks         -- and Backpack, Cooldown, Retry
└─ ServerPackages
StarterPlayer
└─ StarterPlayerScripts
   └─ Client              -- the client entry point
      ├─ Backpack         -- the vendored Purse
      ├─ ClientObjects    -- Framework, EverpresentLoader, LegacyObjects, PlaceLighting, ClientObjectThread
      ├─ Commands         -- CommandsController
      ├─ Cosmetics        -- CosmeticsMenu, CosmeticPreview, TrailPreview, CosmeticsVisibility
      ├─ EditUILayout     -- EditUILayoutController, Elements, Handle, Snap
      ├─ Menu             -- MenuController
      ├─ RingSelect       -- RingSelectController and the ring screen, started only in the hub
      ├─ Settings         -- Menu, InputActions, MobileDPad, FpsCap, FpsDisplay, ConsoleButton, InvisiblePlayers, CameraTransparency
      ├─ Shop             -- ShopController, ShopCatalog, ShopItemView, ShopModal, FeaturedRotation, GamePassList, Gifting, TicketsDisplay
      ├─ Teleport         -- TeleportController
      ├─ Towers           -- RunController, Hud, Completions, Spectate, TowerDisplay, TowerVisibility, AllJumpsController, ResetButton
      ├─ UI               -- Screens, WarnOnce, Components
      ├─ ScriptRepo       -- the bundled client-object scripts
      └─ BackpackFilters  -- and BackpackIcon, BackpackIdentity, BackpackLayout, Chat
ServerStorage
├─ TowerCheckpoints
├─ TowerClientObjects
├─ CompletionTools
├─ PracticeTools
├─ EverpresentCOs
├─ WinpadParticles
├─ StarterPackStudio
├─ TicketShopItems
│  └─ Tools
└─ Cosmetics
   ├─ Trails
   └─ Auras
```

`Workspace > ClientParts` and `Workspace > EverpresentCOs` are created at run
time by the client-object loader and are not authored.

## The Menus

**StarterGui is yours.** The menus are ordinary ScreenGuis laid out in Studio
rather than built by code, and the client finds them by name. Rename one and the
code looking for it does not find it.

```text
StarterGui
├─ MainMenu                     -- the menu and the on-screen controls
│  ├─ ButtonsHolder             -- the buttons on screen while playing
│  └─ Main
│     ├─ ButtonsContainer       -- the row of menu buttons
│     └─ MenusContainer
│        ├─ SettingsMenu
│        │  ├─ SettingsSidebar  -- the tab buttons
│        │  ├─ GameplayFrame    -- one frame per tab
│        │  ├─ VisualFrame
│        │  ├─ AudioFrame
│        │  ├─ ControlsFrame
│        │  ├─ MiscFrame
│        │  ├─ PSFrame          -- personal server settings
│        │  └─ CustomTemplates  -- rows copied for your own settings
│        ├─ TeleportMenu
│        │  ├─ OptionsHolder    -- World1Button, copied once per World
│        │  └─ World1Menu       -- copied once per World; holds the Place and SubPlace cards
│        ├─ ShopMenu
│        ├─ CosmeticsMenu       -- optional
│        └─ CompletionsMenu
├─ TowerGUI                     -- the run timer and tower name
└─ EffectGUI                    -- readouts a v5 tower drives
```

The hub is the exception: it runs [Ring Select](./ring-select.md), has one
screen of its own, `RingSelect`, and none of the above.

That is the shape, not the whole list — the Setup tab of the
[Tower Setup window](./tower-setup-plugin.md) carries every name the client
looks for, says what each costs to be missing, and checks your place against
them. Use it rather than this page when something in the menu is not working.

::: warning A missing name is not always a visible failure
What a missing name costs depends on where it is. One of the four frames the
menu cannot do without — `ButtonsHolder`, `Main`, `ButtonsContainer`,
`MenusContainer` — stops the menu being set up at all, and the loading screen
never lifts. A name inside any one menu switches that menu off for the session,
with a warning naming it in **Output**; inside the spectate panel it first
waits ten seconds for the name to appear. The Tower Setup plugin's Setup tab
lists every one before you press Play.
:::

## Naming Rules

- Roblox services and public config modules use clear PascalCase names.
- Tower acronyms and saved item IDs are case-sensitive; keep them stable after
  release.
- Asset names must match their config values exactly, such as `Gravity Coil` or
  `VIPTrail`.
- Keep a UI template's documented name, such as `Template` or `Place`, and leave
  it visible only when its guide says to.

## See Also

- [Configuration Reference](./configuration.md)
- [Extending the Kit](./extending-gameplay.md)
