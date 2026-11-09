# Extending the Kit

Before you edit the kit's own scripts, check whether you need to:

1. **Config.** Most changes are just a setting in `ReplicatedStorage > Config`.
2. **Hooks.** Reacting to wins, saving your own values and adding admin commands
   all work from your own scripts. See [Hooking Into the Kit](./hooks.md). Code
   written this way keeps working after [updates](./updating.md).
3. **Editing the kit.** This page. The next update replaces the kit's scripts, so
   keep a list of what you changed.

## Where code goes

The kit's code is grouped by feature, and each feature has the same name on the
server and the client:

| Feature | Where it is |
| :-- | :-- |
| Towers, winpads, Practice and All Jumps | `Server > Towers`, `Client > Towers` |
| The ticket shop and game passes | `Server > Shop`, `Client > Shop` |
| Cosmetics | `Server > Cosmetics`, `Client > Cosmetics` |
| Teleports and personal servers | `Server > Teleport`, `Client > Teleport` |
| Settings | `Server > Settings`, `Client > Settings` |
| Saving | `Server > Accounts` |
| The admin console | `Server > Commands`, `Client > Commands` |

`Server` is `ServerScriptService > Server`, `Client` is
`StarterPlayer > StarterPlayerScripts > Client`, and `Shared` is
`ReplicatedStorage > Shared`.

In each feature folder, start with the module named `<Feature>Service` on the
server, or `<Feature>Controller` on the client. When something errors, the Output
names the script, and its name is the same as its place in the Explorer.

## Requiring modules

The kit uses Roblox's require-by-string:

```luau
local Difficulty = require("@game/ReplicatedStorage/Shared/Towers/Difficulty")
local TowerHud = require("./TowerHud")
```

| Path | Finds |
| :-- | :-- |
| `@self/Child` | A module inside this one. |
| `./Sibling` | A module next to this one. |
| `../Up/And/Over` | A module up one level, then back down. |
| `@game/Service/...` | Anything, starting from the service. |

::: warning Use relative paths inside the client
Use `@game` to reach `Shared`, but reach one client module from another with `./`
or `../`, **never** with `@game/StarterPlayer/...`. Client scripts run from a copy
in `PlayerScripts`, so the `@game` path finds the copy that isn't running, and you
end up with two of everything.
:::

Server code can require `Server` and `Shared`. Client code can require `Client` and
`Shared`. Shared code can only require `Shared`.

## Adding a server feature

If your feature only reacts to things the kit does, write a Script of your own that
listens to [the kit's events](./hooks.md#server-events). If it has to start with the
kit:

1. Make a folder `Server > <Feature>`, with a ModuleScript named
   `<Feature>Service` that returns a table with a `start()` function.
2. Inside `start()`, check a `started` flag so it can only run once.
3. Add a line that calls it to the `Server` script, in the right spot in the
   startup order.

## Keeping it safe

- Give rewards, handle purchases, count wins, teleport and save on the server only.
- Use the kit's existing network messages where you can. Only add one when the
  client really needs it. See [Networking](./api.md#networking).
- Save through the kit's Scribe setup. Don't add a second DataStore.
- Build UI in Studio and hook it up from code, rather than making UI in code.

Found a bug in the kit? Send a [bug report](https://github.com/Vexx3/Ascent/issues/new?template=bug_report.yml).
