# API Reference

This page is for writing your own scripts on top of the kit. If you just want to
change how something works, check `Config` first.

::: tip Build on the hooks where you can
[Hooking Into the Kit](./hooks.md) is kept the same from one version to the next.
Everything else on this page is the kit's own code. You can call it, but a new version might
change it. When that happens, the [changelog](../changelog.md) marks it as
**Breaking**.
:::

## Where the code is

Each script's path in the code is its place in the Explorer, so when the Output
names a file, you know where to find it.

| Folder | Runs on | Explorer path |
| :-- | :-- | :-- |
| `Server` | The server | `ServerScriptService > Server` |
| `Shared` | Both | `ReplicatedStorage > Shared` |
| `Client` | The client | `StarterPlayer > StarterPlayerScripts > Client` |

## Saved data

`Shared > Accounts > AccountData` saves and loads player data, using
[Scribe](https://scribe.ericplane.dev/). **Don't add another DataStore library
next to it.**

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local Data = AccountData.Server
```

| Call | What it does |
| :-- | :-- |
| `Data.GetState(player)` | Returns `"Ready"` once the player's save has loaded. |
| `AccountData.waitForDataAsync(player)` | Waits until the save has loaded, even if it's slow. Use it when a player joins. |
| `Data.Get(player)` | The player's save. `Data.Get(player).tickets.Get()` reads a value, and `.Set(n)` changes it. |
| `AccountData.read(player)` | The whole save as a plain table you can read, or `nil` if it hasn't loaded yet. |
| `Data.Transaction(player, fn)` | Makes several changes that all save together, or not at all. |
| `Data.Purchase(...)` | Charges a player only once, even if the request arrives twice. |
| `Data.OwnsAsync(player, passName)` | Whether the player owns a game pass. |
| `Data.Flush(player)` | Saves now. `false` means it isn't confirmed *yet*, not that it failed. |

On the client, watch just the part of the save you need:

```luau
AccountData.Client.tickets.Observe(function(amount)
	label.Text = tostring(amount)
end)
```

To show Robux prices, use `Data.GetPrice` or `Data.GetProductInfo`, which include
regional pricing. Every saved field is listed on [Player Data](./player-data.md).

## Towers

`Server > Towers > TowerRegistry`:

| Function | Signature |
| :-- | :-- |
| `get` | `(acronym) -> TowerInfo?` |
| `forEach` | `(callback: (string, TowerInfo) -> ()) -> ()` |
| `loadForPlayerAsync` | `(player, acronym, request: LoadRequest?) -> boolean` |
| `resetClientObjectsAsync` | `(player) -> boolean`. Rebuilds the tower's client objects without restarting the run. |

A `LoadRequest` can have these fields, all optional:

| Field | Default | What it does |
| :-- | :-- | :-- |
| `resetTimer` | `true` | Starts the timer from zero and clears checkpoints. |
| `reuseCharacter` | `false` | Moves the current character instead of respawning it. |
| `keepClientObjects` | `false` | Keeps the tower's objects if they're already loaded. |
| `newAttempt` | `true` | Counts as a new attempt. |

::: danger
`loadForPlayerAsync` doesn't check whether the player has unlocked the tower's Area.
Check that yourself first.
:::

## Progress and rewards

| Module | Functions |
| :-- | :-- |
| `Server > Accounts > Progress` | `incrementTowersAsync`, `incrementAllJumpsAsync`, `incrementTowerAttemptAsync`, `incrementRushAttemptAsync`, `addTowerTimeSpentAsync`, `recordTowerWinAsync`, `recordRushWinAsync` |
| `Server > Shop > Tickets` | `awardTickets(player, tower) -> number` |
| `Server > Towers > Badges` | `award(player, badgeId)`, `awardAsync(player, badgeId) -> boolean` |
| `Server > Shop > PermanentTools` | `grant(player, template, grantId, source) -> boolean`, `findToolTemplate(name) -> Tool?` |

`grantId` is saved, so never change it once players have the tool. Badge awards and
webhook posts try again twice if a request fails.

## Custom settings

`Shared > Settings > CustomSettings` reads a player's choice for a setting from
`Config > CustomSettings`. It works on the server and the client:

| Function | Returns |
| :-- | :-- |
| `toggle(settings, key)` | `boolean` |
| `number(settings, key)` | `number` |
| `choice(settings, key)` | `string` |
| `key(settings, key)` | A `KeyCode` name |

If the player hasn't changed the setting, each returns its default. See
[Adding a Saved Setting](./custom-settings.md).

## Cosmetics

`Server > Cosmetics > CosmeticsService`:

| Function | Signature |
| :-- | :-- |
| `unlockPlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `revokePlayerCosmetic` | `(player, category, cosmeticId) -> boolean` |
| `setPlayerCosmetic` | `(player, category, cosmeticId?) -> CosmeticsResult`. Pass `nil` to take it off. |
| `applyEquipped` | `(player) -> ()` |

`category` is `"Trails"` or `"Auras"`.

## Announcements and webhooks

| Module | Functions |
| :-- | :-- |
| `Server > Announcements > AnnouncementsService` | `winAnnouncement(run, endingName, difficultyName, time?, towerCount?)`, `globalNotificationAsync(message, duration?)`, `antiCheatKick(player, reason) -> boolean` |
| `Server > Announcements > Webhook` | `postAsync(secretName, payload) -> boolean` |

```luau
Webhook.postAsync("NORMAL_WEBHOOK", { content = "Hello from my game" })
```

The URL comes from the secret with that name, on your experience's **Secrets** page
in the Creator Dashboard. Posts never ping anyone.

## Shutdowns

`Server > Shutdown > ShutdownService` shows players a countdown before the server
closes:

| Function | Signature |
| :-- | :-- |
| `announce` | `(closeAt: number, reason: string?) -> ()` |
| `cancel` | `(closeAt: number) -> ()` |
| `pending` | `() -> boolean` |

`closeAt` is an `os.time()`. This only shows the countdown. Closing the server is up
to you.

## A player's current run

`Server > Accounts > PlayerLifecycle` has `getSession(player)`, which returns the
player's current run: their tower, timer, mode, checkpoint and rush. You can read it, but **don't change it**. The
client sees a copy of it through the attributes in `Shared > PlayerAttributes`.

## Packages

| Package | What the kit uses it for |
| :-- | :-- |
| [Scribe](https://scribe.ericplane.dev/) | Saving, game pass ownership and prices |
| [Trove](https://sleitnick.github.io/RbxUtil/api/Trove) | Cleaning up connections and instances |
| [Signal](https://sleitnick.github.io/RbxUtil/api/Signal) | The kit's events |
| [TopbarPlus](https://1foreverhd.github.io/TopbarPlus/) | Buttons in the top bar |
| [Cmdr](https://eryn.io/Cmdr/docs/intro/) | The admin console |
| [Purse](https://github.com/ryanlua/purse) | The backpack |

They're all already in the place.

## Networking

The kit's network messages are all made by [Blink](https://github.com/1Axen/blink)
from one schema, which is in the place at
`ServerScriptService > Server > Network > NetworkSchema`. **Don't make your own
RemoteEvents for the kit.** Add a message to the schema and generate it again.

To do that in Studio, use Blink's Studio plugin:

1. Paste in the contents of `NetworkSchema`.
2. Add your message, and press **Generate**.
3. Put the results at `ReplicatedStorage > Shared > Network > BlinkClient` and
   `ServerScriptService > Server > Network > BlinkServer`.

::: warning Always replace both
If the client and server are generated from different schemas, they stop
understanding each other, and nothing tells you why.
:::
