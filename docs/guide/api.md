# API Reference

For writing your own scripts on top of the kit. Most changes belong in `Config` instead.

::: tip Build on the stable part
[Hooking Into the Kit](./hooks.md) (`Server > Events`, `Client > Events`, `Server > CustomData`, the `CustomCommands` folder) keeps working across 1.x updates. Everything else on this page is the kit's own code: useful to call, but a release may change it, and the [changelog](../changelog.md) lists any change under **Breaking**.
:::

## Where the code lives

The file path is the Studio path, so an error in the Output names the file to open.

| Tree | Runs on | Studio location |
| :-- | :-- | :-- |
| `Server` | Server | `ServerScriptService > Server` |
| `Shared` | Both | `ReplicatedStorage > Shared` |
| `Client` | Client | `StarterPlayer > StarterPlayerScripts > Client` |

## Saved data

`Shared > Accounts > AccountData` is the kit's [Scribe](https://scribe.ericplane.dev/) bundle. **Don't add another datastore wrapper beside it.**

```luau
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local Data = AccountData.Server
```

| Call | Purpose |
| :-- | :-- |
| `Data.GetState(player)` | `"Ready"` once the save has loaded. |
| `AccountData.waitForDataAsync(player)` | Waits for the save, including a slow load. Use it on join. |
| `Data.Get(player)` | The save. `Data.Get(player).tickets.Get()` reads; `.Set(n)` writes. |
| `Data.Transaction(player, fn)` | Several writes that land together or not at all. |
| `Data.Purchase(...)` | A charge that bills once even if requested twice. |
| `Data.OwnsAsync(player, passName)` | Game pass ownership. |
| `Data.Flush(player)` | Saves now. `false` means not confirmed *yet*, not failed. |

On the client, observe the field you read:

```luau
AccountData.Client.tickets.Observe(function(amount)
	label.Text = tostring(amount)
end)
```

Show Robux prices with `Data.GetPrice` / `Data.GetProductInfo`, which include regional pricing. See [Player Data](./player-data.md) for the saved fields.

## Towers

`Server > Towers > TowerRegistry`:

| Function | Signature |
| :-- | :-- |
| `get` | `(acronym) -> TowerInfo?` |
| `forEach` | `(callback: (string, TowerInfo) -> ()) -> ()` |
| `loadForPlayerAsync` | `(player, acronym, request: LoadRequest?) -> boolean` |
| `resetClientObjectsAsync` | `(player) -> boolean`, rebuilds client objects without restarting the run |

`LoadRequest` fields, all optional:

| Field | Default | Meaning |
| :-- | :-- | :-- |
| `resetTimer` | `true` | Start the timer at zero and clear checkpoints. |
| `reuseCharacter` | `false` | Move the current character instead of respawning. |
| `keepClientObjects` | `false` | Keep the tower if it's already loaded. |
| `newAttempt` | `true` | Count an attempt. |

::: danger
`loadForPlayerAsync` doesn't check unlock requirements. Check them yourself first.
:::

## Progression and rewards

| Module | Functions |
| :-- | :-- |
| `Server > Accounts > Progress` | `incrementTowersAsync`, `incrementAllJumpsAsync`, `incrementTowerAttemptAsync`, `incrementRushAttemptAsync`, `addTowerTimeSpentAsync`, `recordTowerWinAsync`, `recordRushWinAsync` |
| `Server > Shop > Tickets` | `awardTickets(player, tower) -> number` |
| `Server > Towers > Badges` | `award(player, badgeId)`, `awardAsync(player, badgeId) -> boolean` |
| `Server > Shop > PermanentTools` | `grant(player, template, grantId, source) -> boolean`, `findToolTemplate(name) -> Tool?` |

`grantId` is saved, so never change it. Badge awards and webhook posts retry a failed request twice.

## Custom settings

`Shared > Settings > CustomSettings` reads a player's choice for a setting declared in `Config > CustomSettings`, on either side:

| Function | Returns |
| :-- | :-- |
| `toggle(settings, key)` | `boolean` |
| `number(settings, key)` | `number` |
| `choice(settings, key)` | `string` |
| `key(settings, key)` | a `KeyCode` name |

Each returns the declared default if the player hasn't chosen. See [Adding A Saved Setting](./custom-settings.md).

## Cosmetics

`Server > Cosmetics > CosmeticsService`:

| Function | Signature |
| :-- | :-- |
| `unlockPlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `revokePlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `setPlayerCosmetic` | `(player, category, cosmeticId?) -> CosmeticsResult` (`nil` unequips) |
| `applyEquipped` | `(player) -> ()` |

`category` is `"Trails"` or `"Auras"`.

## Announcements and webhooks

| Module | Functions |
| :-- | :-- |
| `Server > Announcements > AnnouncementsService` | `winAnnouncement(run, endingName, difficultyName, time?, towerCount?)`, `globalNotificationAsync(message, duration?)`, `antiCheatKick(player, reason) -> boolean` |
| `Server > Announcements > Webhook` | `postAsync(secretName, payload) -> boolean` |

```luau
Webhook.postAsync("NORMAL_WEBHOOK", { content = "Hello from my fangame" })
```

The URL comes from the named secret (**Creator Dashboard → Experience → Secrets**). Posts never ping anyone.

## Shutdown

`Server > Shutdown > ShutdownService` shows players a countdown before a server closes:

| Function | Signature |
| :-- | :-- |
| `announce` | `(closeAt: number, reason: string?) -> ()` |
| `cancel` | `(closeAt: number) -> ()` |
| `pending` | `() -> boolean` |

`closeAt` is an `os.time()`. It only announces; closing the server is up to you.

## Session state

`PlayerLifecycle.getSession(player)` returns a player's current run: tower, timer, mode, checkpoint, rush. Read it, but **don't write to it**. `Shared > PlayerAttributes` is the copy clients see.

## Packages

| Package | Used for |
| :-- | :-- |
| [Scribe](https://scribe.ericplane.dev/) | Saves, pass ownership, prices |
| [Trove](https://sleitnick.github.io/RbxUtil/api/Trove) | Cleaning up connections and instances |
| [Signal](https://sleitnick.github.io/RbxUtil/api/Signal) | The kit's events |
| [TopbarPlus](https://1foreverhd.github.io/TopbarPlus/) | Topbar buttons |
| [Cmdr](https://eryn.io/Cmdr/docs/intro/) | The admin console |
| [Purse](https://github.com/ryanlua/purse) | The backpack |

They ship inside the place.

## Networking

Every remote is generated by [Blink](https://github.com/1Axen/blink) from one schema, shipped as `ServerScriptService > Server > Network > NetworkSchema`. **Never create a RemoteEvent**; add a message to the schema and regenerate.

To regenerate in Studio, use Blink's Studio plugin: paste in `NetworkSchema`, edit, and **Generate**. Put the results at `ReplicatedStorage > Shared > Network > BlinkClient` and `ServerScriptService > Server > Network > BlinkServer`, where the kit looks for them.

::: warning Always regenerate both
A client and server generated from different schemas silently don't talk to each other.
:::
