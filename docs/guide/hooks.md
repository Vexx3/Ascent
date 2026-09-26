# Hooking Into the Kit

Some things are not a setting: a sound when someone beats a tower, a badge of
your own for ten wins, a currency the kit knows nothing about, an admin command
for your own game. This page is how to add them **without editing the kit's
scripts**, so that [updating Ascent](./updating.md) never overwrites your work.

Everything on this page is the kit's stable surface. Its names and what they
pass stay the same for every 1.x release; anything that changes is listed under
**Breaking** in the [changelog](../changelog.md) first. The rest of the kit's
modules are free to change between releases.

| You want to | Use |
| :-- | :-- |
| React when a player wins, loads a tower, buys something | [Server events](#server-events) |
| Show something on the player's screen when that happens | [Client events](#client-events) |
| Save values of your own with each player | [CustomData](#saving-values-of-your-own) |
| Add admin commands | [CustomCommands](#admin-commands-of-your-own) |

## Server events

`ServerScriptService > Server > Events` announces what happens in the game. Put a
Script of your own in `ServerScriptService`, beside `Server` rather than inside
it, and connect to what you need:

```luau
local ServerScriptService = game:GetService("ServerScriptService")
local Events = require(ServerScriptService.Server.Events)

Events.towerWon:Connect(function(player, win)
	if win.firstWin and not win.boosted then
		print(`{player.Name} beat {win.tower} for the first time in {win.time} seconds`)
	end
end)
```

Each event fires **after** the kit has finished with what it describes — a win
is already saved when `towerWon` fires — and every listener runs on its own, so
one that waits or errors holds nothing up.

| Event | Passes | When |
| :-- | :-- | :-- |
| `towerWon` | `player, win` | A tower is beaten and saved, including each tower of a rush. |
| `rushWon` | `player, rush` | The last tower of a rush is beaten. |
| `towerLoaded` | `player, acronym, mode` | An attempt at a tower has loaded: entering it, restarting it, or reaching the next tower of a rush. |
| `towerLeft` | `player, acronym` | A player leaves a tower without winning: the exit button, dying in Normal mode with Restart on Death off, or leaving the game. |
| `shopPurchased` | `player, itemId, price` | A ticket shop purchase is saved. |
| `gamePassApplied` | `player, passName` | The kit applies what a game pass gives: joining with it, buying it, or being gifted it. `passName` is its key in `Config > GamePasses`. |
| `ticketsAwarded` | `player, amount, source` | Tickets are added. `source` is `"Tower"` or `"GamePass"`. |
| `playerDataReady` | `player` | A player's saved data has loaded. |

A `win` has these fields:

| Field | What it is |
| :-- | :-- |
| `tower` | The tower's acronym. |
| `ending` | The winpad's `EndingID`, which is the acronym itself for the main ending. |
| `time` | Seconds, the same number the save holds. |
| `mode` | `"Normal"` or `"AllJumps"`. Practice never wins. |
| `boosted` | Whether a boost item was used. |
| `firstWin` | Whether this was the first win of that tower in that mode. |
| `rush` | The rush it was part of, or `nil`. |

A `rush` has `rush` (its name), `time`, `mode` and `boosted`.

::: tip Waiting for the kit
Your Script may start before the kit's does. Connecting to an event needs no
wait, but before calling into the kit — reading a tower, checking data — call
`Events.waitForStartAsync()`, which returns once everything has started.
:::

A run that used a Studio test tool from `ServerStorage > StarterPackStudio` is
not a win and fires nothing.

## Client events

For what the player sees, `StarterPlayerScripts > Client > Events` fires on
their own client. Put a LocalScript in `StarterPlayerScripts`:

```luau
local Client = script.Parent:WaitForChild("Client")
local Events = require(Client:WaitForChild("Events"))

Events.towerWon:Connect(function()
	-- play a sound, show a screen of your own
end)
```

| Event | Passes | When |
| :-- | :-- | :-- |
| `towerLoaded` | `acronym` | A tower loads for this player, restarts included. |
| `towerLeft` | nothing | The tower they were in is put away: they left it, died out of it, or won it. |
| `towerWon` | nothing | They win, as the victory sound plays. |
| `dataReady` | nothing | Their saved data has arrived. |

::: warning Anything that counts goes on the server
A client can fire its own events whenever it likes. Rewards, saved values and
badges belong on the server's `Events`.
:::

## Saving values of your own

`ServerScriptService > Server > CustomData` keeps numbers, text and true/false
values with each player's save, under names you choose. There is nothing to
declare first.

```luau
local ServerScriptService = game:GetService("ServerScriptService")
local CustomData = require(ServerScriptService.Server.CustomData)
local Events = require(ServerScriptService.Server.Events)

Events.towerWon:Connect(function(player, win)
	local wins = CustomData.increment(player, "TotalWins", 1)
	if wins == 10 then
		-- award a badge of your own
	end
end)
```

| Function | What it does |
| :-- | :-- |
| `get(player, name)` | The value saved under `name`, or `nil`. |
| `set(player, name, value)` | Saves a number, string or boolean, replacing what was there. `nil` removes it. `false` if it could not be saved. |
| `increment(player, name, by)` | Adds to a number, starting from 0, and returns the new total. |

Everything returns `nil` or `false` while the player's data is still loading, so
read from `Events.playerDataReady` onward. A save holds up to 200 names of each
kind; a name is up to 64 characters and a string up to 1000.

The client can read these but never write them:

```luau
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)

AccountData.Client.custom.numbers.Observe(function(numbers)
	coinsLabel.Text = tostring(numbers.Coins or 0)
end)
```

::: danger A name is saved with every player
Like a tower acronym, a name you save under is written into player data. Keep it
once your game is out; renaming it starts everyone from nothing.
:::

## Admin commands of your own

Make a Folder named `CustomCommands` in `ServerScriptService` and put commands in
it the way the kit's own are written: a ModuleScript defining the command, and
one beside it with `Server` on the end of its name that runs it.

```luau
-- CustomCommands > Hello
return {
	Name = "hello",
	Aliases = {},
	Description = "Says hello back.",
	Group = "My Game",
	Args = {},
}
```

```luau
-- CustomCommands > HelloServer
return function(context)
	return `Hello, {context.Executor.Name}!`
end
```

They are checked against `Config > Admin` like every other command. An argument
type of your own goes in a Folder named `Types` inside `CustomCommands`. The
[Cmdr documentation](https://eryn.io/Cmdr/guide/Commands.html) covers what a
command can declare.

::: warning "Server" in a command's name
Cmdr treats any ModuleScript with `Server` anywhere in its name as the half that
runs a command. A command called `ServerTime` is taken for one and never
registers; name the file something else and keep `Name = "server-time"` inside.
:::
