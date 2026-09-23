# API Reference

Everything here is already wired up inside the place. You only need this page if
you are writing your own scripts on top of the kit.

::: tip Config first
Most changes belong in `ReplicatedStorage > Shared > Config`, not in code. Reach
for this page when a config value genuinely cannot express what you want.
:::

## Where the code lives

The file path *is* the Studio path — nothing is renamed on the way in, so an
error in the Output window names the file to open.

| Tree | Runs on | Studio location | Holds |
| :-- | :-- | :-- | :-- |
| `Server` | Server | `ServerScriptService > Server` | `Towers/TowerRegistry`, `Accounts/Progress`, the Cosmetics services, `Shop/PermanentTools`, `Announcements/AnnouncementsService`, `Announcements/Webhook`, `Shutdown/ShutdownService`, `Commands/Catalog` |
| `Shared` | Both | `ReplicatedStorage > Shared` | `Config/*`, `Accounts/AccountData`, `Towers/Difficulty`, `Towers/TowerTypes`, `PlayerAttributes`, `Authorization`, `ConfigTypes` |
| `Client` | Client | `StarterPlayer > StarterPlayerScripts > Client` | `Towers/RunController`, `Towers/Hud`, `Menu/MenuController`, Shop, Cosmetics, Settings, Teleport, `ClientObjects`, the Commands controller |

## Saved data

`ReplicatedStorage > Shared > Accounts > AccountData` returns the kit's
[Scribe](https://scribe.ericplane.dev/) bundle. It is the only datastore wrapper
in the kit — **do not add another beside it.**

```luau
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local Data = AccountData.Server
```

| Call | Purpose |
| :-- | :-- |
| `Data.GetState(player)` | `"Ready"` when the profile has loaded. Check before touching anything else. |
| `Data.WaitForData(player)` | Yields until the profile is ready. |
| `Data.Get(player)` | The accessor tree. `Data.Get(player).tickets.Get()` reads; `.Set(n)` writes. |
| `Data.Transaction(player, fn)` | Several writes that must land together, or not at all. |
| `Data.Purchase(...)` | A charge with an idempotency key, so a doubled request bills once. |
| `Data.OwnsAsync(player, passName)` | Game-pass ownership, cached. |
| `Data.Flush(player)` | Saves now and yields until confirmed. `false` means *not confirmed yet*, not failed -- the save may still land, so never grant something again because of it. |

On the client, observe the **field** you read rather than the root:

```luau
local Data = AccountData.Client
Data.tickets.Observe(function(amount)
    label.Text = tostring(amount)
end)
```

::: warning Robux prices
Use `Data.GetProductInfo`, `Data.GetPrice` and `Data.ObserveProductInfo` to show
a price. They answer what *this* player is charged after regional pricing;
`MarketplaceService:GetProductInfoAsync` answers the base catalogue price, which
is not always the same number.
:::

See [Player Data](./player-data.md) for the full saved shape.

## Towers

`ServerScriptService > Server > Towers > TowerRegistry`.

| Function | Signature |
| :-- | :-- |
| `get` | `(acronym: string) -> TowerInfo?` |
| `forEach` | `(callback: (string, TowerInfo) -> ()) -> ()` |
| `loadForPlayerAsync` | `(player: Player, acronym: string, request: LoadRequest?) -> boolean` |
| `resetClientObjectsAsync` | `(player: Player) -> boolean` |

`LoadRequest` is optional. Leaving a field out gives the default below, so a
plain `loadForPlayerAsync(player, "ETV5")` is a fresh attempt with a new character:

| Field | Default | Meaning |
| :-- | :-- | :-- |
| `resetTimer` | `true` | Start the timer at zero and clear checkpoints. |
| `reuseCharacter` | `false` | Move the character already standing there instead of respawning it. |
| `keepClientObjects` | `false` | Leave the tower standing if it is the one already loaded. |
| `newAttempt` | `true` | Count an attempt and drop godmode. |

```luau
local TowerRegistry = require(ServerScriptService.Server.Towers.TowerRegistry)

TowerRegistry.loadForPlayerAsync(player, "ETV5", {
    resetTimer = true,
    reuseCharacter = true,
})
```

`resetClientObjectsAsync` rebuilds a tower's client objects and returns the player to
the spawn **without** counting an attempt or resetting the timer — it repairs a
run in progress rather than restarting it.

::: danger Still server-authoritative
`loadForPlayerAsync` does not ask whether the player is allowed in. Check your own
requirements before you call it.
:::

## Progression and rewards

| Module | Function |
| :-- | :-- |
| `Server > Accounts > Progress` | `incrementTowersAsync`, `incrementAllJumpsAsync`, `incrementTowerAttemptAsync`, `incrementRushAttemptAsync`, `addTowerTimeSpentAsync` |
| `Server > Shop > Tickets` | `awardTickets(player, tower) -> number` |
| `Server > Towers > Badges` | `award(player, badgeId)` fire-and-forget, `awardAsync(player, badgeId) -> boolean` yields |
| `Server > Shop > PermanentTools` | `grant(player, template, grantId, source) -> boolean`, `findToolTemplate(name) -> Tool?` |

`grantId` is written into the player's save, so it must stay stable forever —
renaming one hands every existing owner their item a second time.

A badge award and a webhook post are both web calls, so both are tried three
times — immediately, then after two seconds, then after four — before being
given up on. `award` does that on its own thread; `awardAsync` makes you wait
for the answer. Only a *failed request* is retried: a plain `false` is Roblox
saying the badge was not awardable, usually because the player already has it,
and asking again cannot change that.

## Custom settings

`ReplicatedStorage > Shared > Settings > CustomSettings` reads whatever a player
chose for the settings you declared in `Config > CustomSettings`. It works the
same on both sides — the server reads Scribe accessors and the client reads a
plain table, and these see through both.

| Function | Returns |
| :-- | :-- |
| `toggle(settings, key)` | `boolean` |
| `number(settings, key)` | `number` |
| `choice(settings, key)` | `string` |
| `key(settings, key)` | `string`, a `KeyCode` name |

Each falls back to the declared default, so there is never a "not set yet" case.
A key that is not declared, or is declared as another kind, warns once by name
and returns the empty value. [Adding A Saved Setting](./custom-settings.md) has
the worked examples for both sides.

## Cosmetics

`ServerScriptService > Server > Cosmetics > CosmeticsService`.

| Function | Signature |
| :-- | :-- |
| `unlockPlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `revokePlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `setPlayerCosmetic` | `(player, category, cosmeticId: string?) -> CosmeticsResult` |
| `applyEquipped` | `(player) -> ()` |

`category` is `"Trails"` or `"Auras"`. Passing `nil` as the id to
`setPlayerCosmetic` unequips. Read-only lookups live beside it in
`CosmeticUnlocks`.

## Announcements and webhooks

| Module | Function |
| :-- | :-- |
| `Server > Announcements > AnnouncementsService` | `globalNotificationAsync(message, duration?)`, `antiCheatKick(player, reason)` |
| `Server > Announcements > Webhook` | `postAsync(secretName, payload) -> boolean` |

`Webhook.postAsync` posts JSON to the Discord webhook stored in the named
secret. Secrets are set under **Creator Dashboard › Experience › Secrets**; the
kit reads `NORMAL_WEBHOOK`, `ALL_JUMPS_WEBHOOK` and `ANTICHEAT_WEBHOOK`, plus
whatever a difficulty band names in `Config > Towers`.

```luau
local Webhook = require(ServerScriptService.Server.Announcements.Webhook)

Webhook.postAsync("NORMAL_WEBHOOK", { content = "Hello from my fangame" })
```

A missing secret is a warning and nothing else, so a place with no webhooks set
up loses the posts and nothing more.

## Shutdown

`ServerScriptService > Server > Shutdown > ShutdownService` gives every kind of close the same
countdown — a Roblox restart, an admin closing the server, and a personal server
whose owner left.

| Function | Signature |
| :-- | :-- |
| `announce` | `(closeAt: number, reason: string?) -> ()` |
| `pending` | `() -> boolean` |

`closeAt` is an `os.time` stamp. Players are told immediately and again at 5m,
2m, 1m, 30s and 15s, and anyone who joins after is told on arrival. A later
close never replaces a nearer one; a sooner one does.

```luau
local ShutdownService = require(ServerScriptService.Server.Shutdown.ShutdownService)

ShutdownService.announce(os.time() + 300, "Updating to a new version")
```

It only announces. What actually closes the server is yours to do.

## Session state

`Server > Accounts > SessionStore` holds each player's live run — current tower,
timer, mode, checkpoint, rush position. `PlayerLifecycle.getSession(player)`
returns it, or `nil` when they have none.

Read it freely. **Do not write to it directly**: the fields are kept in step by
the modules that own them, and a stray write shows up as a run that cannot be
finished.

`Shared > PlayerAttributes` is the read-only mirror the client sees —
`CurrentTower`, `TowerTimer`, `RunMode` and a few more. The server's session is
the truth; attributes are a copy for the UI.

## Packages

Shared packages are under `ReplicatedStorage > Packages`; server-only ones under
`ServerScriptService > ServerPackages`.

| Package | What the kit uses it for |
| :-- | :-- |
| [Scribe 2.4](https://scribe.ericplane.dev/) | Saved data, transactions, replication, pass ownership, Robux prices |
| [Trove](https://sleitnick.github.io/RbxUtil/api/Trove) | Cleanup for connections, tasks and instances with a real owner |
| [Signal](https://sleitnick.github.io/RbxUtil/api/Signal) | The kit's own events, where a BindableEvent would lose its types |
| [TopbarPlus](https://1foreverhd.github.io/TopbarPlus/) | The backpack icon, the FPS readout and the mobile console button |
| [Cmdr](https://eryn.io/Cmdr/docs/intro/) | The admin console. Server-only |
| [Purse](https://github.com/ryanlua/purse) | The backpack. Vendored at `Client > Backpack` |

Installed with [Wally](https://wally.run/). If you run `wally install` on its
own, follow it with `npm run setup:package-types` — Wally's link files re-export
no types, so without it Studio stops autocompleting anything from a package.
`npm run setup` does both.

## Networking

Every remote is generated by [Blink](https://github.com/1Axen/blink) from
`game.blink` at the repo root. Add a message by editing that schema and
rebuilding — **never by creating a RemoteEvent.**

```luau
-- server
local BlinkServer = require(ServerScriptService.Server.Network.BlinkServer)
-- client
local BlinkClient = require(ReplicatedStorage.Shared.Network.BlinkClient)
```

### Regenerating them without the command line

`npm run generate:network` runs the Blink CLI, which is the route if you cloned
the repository. If you are working inside Studio and nowhere else, Blink ships a
**Studio plugin** that does the same job: it gives you an editor for the schema,
with intellisense and error checking, and a **Generate** button that writes the
modules into a location you pick in the Explorer.

Two things to get right, because the kit does not find these by searching:

- **Generate somewhere both sides can reach**, which the plugin asks you to
  confirm.
- **Put the result where the kit already looks.** The client module has to end
  up at `ReplicatedStorage > Shared > Network > BlinkClient` and the server one
  at `ServerScriptService > Server > Network > BlinkServer`. Those two paths are
  named by 16 and 23 files respectively, so moving the generated modules to
  match is a great deal less work than re-pointing everything at them.

The schema itself ships with the place, as a ModuleScript at
`ServerScriptService > Server > Network > NetworkSchema`. Nothing requires it and
nothing reads it at run time — it is there because the two modules beside it are
generated buffer code, and without it there is no way to see what they were built
from. Copy it into the plugin's editor, or keep editing `game.blink` if you have
the repository; they are the same text, and `npm run generate:network` rewrites
the module from the file.

::: warning The two must be generated together
A client and a server module from different versions of the schema do not talk
to each other, and the failure is a remote that silently does nothing rather
than an error. Regenerate both, every time.
:::

## See Also

- [Extending the Kit](./extending-gameplay.md) — adding a feature the kit way
- [Player Data](./player-data.md) — the saved shape and how to add to it
- [Commands](./commands.md) — the admin console
