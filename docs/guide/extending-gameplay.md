# Extending the Kit

Try these first, in order:

1. **Config**: most changes are a value in `Shared > Config`.
2. **Hooks**: reacting to wins, saving your own values, and adding admin commands need no edit to the kit. See [Hooking Into the Kit](./hooks.md). Code written that way survives [updates](./updating.md).
3. **Editing the kit**: this page. Edits inside the kit's scripts are overwritten by the next update, so keep a note of them.

## Where code goes

Code is grouped by feature, and each feature has the same name in every tree:

| Feature | Studio location |
| :-- | :-- |
| Towers, winpads, Practice, All Jumps | `Server > Towers`, `Client > Towers` |
| Ticket shop, game passes | `Server > Shop`, `Client > Shop` |
| Cosmetics | `Server > Cosmetics`, `Client > Cosmetics` |
| Teleports and personal servers | `Server > Teleport`, `Client > Teleport` |
| Settings | `Server > Settings`, `Client > Settings` |
| Saved progress | `Server > Accounts` |
| Admin console | `Server > Commands`, `Client > Commands` |

`Server` is `ServerScriptService > Server`, `Client` is `StarterPlayer > StarterPlayerScripts > Client`, `Shared` is `ReplicatedStorage > Shared`. An error in the Output names the script to open.

A feature's first module to open is `<Feature>Service` on the server and `<Feature>Controller` on the client.

## Requires

Use Roblox's require-by-string:

```luau
local Difficulty = require("@game/ReplicatedStorage/Shared/Towers/Difficulty")
local TowerHud = require("./TowerHud")
```

| Form | Reaches |
| :-- | :-- |
| `@self/Child` | a module inside this one |
| `./Sibling` | a module beside it |
| `../Up/And/Over` | out of the parent and back down |
| `@game/Service/...` | anything, from the top |

::: warning Stay relative inside your own tree
Reach `Shared` with `@game`, but reach one client module from another with `./` or `../`, **never** `@game/StarterPlayer/...`. Client scripts run from a copy in `PlayerScripts`, so the `@game` path finds the copy that isn't running, and its state exists twice.
:::

Server code can require `Server` and `Shared`, client code `Client` and `Shared`, shared code only `Shared`.

## Adding a server feature

If it only reacts to the kit, use a Script of your own listening to [`Events`](./hooks.md#server-events). If it has to start with the kit:

1. Create `Server > <Feature>` with a ModuleScript `<Feature>Service` returning a table with a `start()` function.
2. Guard `start()` with a `started` flag.
3. Add one line calling it to the `Server` script, where the order says what must run first.

## Keep it safe

- Rewards, purchases, wins, teleports and saves happen on the server.
- Use the existing network messages; add one only when the client needs it. See [Networking](./api.md#networking).
- Use the Scribe bundle for saving; never add a second datastore.
- Reuse the Studio UI rather than building UI in code.

Found a bug in the kit? Send it as a [bug report](https://github.com/Vexx3/Ascent/issues/new?template=bug_report.yml).
