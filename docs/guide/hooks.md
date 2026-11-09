# Hooking Into the Kit

You can add your own features **without editing the kit's scripts**. Write them in
your own scripts using the hooks on this page, and [updating Ascent](./updating.md)
will never overwrite them.

These hooks are kept the same from one version to the next. If one ever changes,
the [changelog](../changelog.md) marks it as **Breaking**.

| You want to | Use |
| :-- | :-- |
| Do something when a player wins, loads a tower or buys something | [Server events](#server-events) |
| Show something on the player's screen when that happens | [Client events](#client-events) |
| Save values of your own for each player | [CustomData](#saving-values-of-your-own) |
| Add admin commands | [CustomCommands](#admin-commands-of-your-own) |

## Server events

`ServerScriptService > Server > Events` fires an event when something happens in
the game. Make a Script in `ServerScriptService`, next to the `Server` folder (not
inside it), and connect to the events you need:

```luau
local ServerScriptService = game:GetService("ServerScriptService")
local Events = require(ServerScriptService.Server.Events)

Events.towerWon:Connect(function(player, win)
	if win.firstWin and not win.boosted then
		print(`{player.Name} beat {win.tower} for the first time in {win.time} seconds`)
	end
end)
```

Each event fires **after** the kit has finished with it. For example, a win is
already saved by the time `towerWon` fires. If your code waits or errors, it doesn't
hold the kit up.

| Event | Gives you | Fires when |
| :-- | :-- | :-- |
| `towerWon` | `player, win` | A tower is beaten and saved. Also fires for each tower in a rush. |
| `rushWon` | `player, rush` | The last tower of a rush is beaten. |
| `towerLoaded` | `player, acronym, mode` | A tower loads for a player: entering it, restarting it, or reaching the next tower of a rush. |
| `towerLeft` | `player, acronym` | A player leaves a tower without winning: Exit Tower, dying in Normal mode with Restart on Death off, or leaving the game. |
| `runEnded` | `player, run` | A run ends without a win, for any reason, including restarts and mode switches. |
| `shopPurchased` | `player, itemId, price` | A ticket shop purchase is saved. |
| `gamePassApplied` | `player, passName` | The kit gives a player what a game pass gives: when they join with it, buy it or are gifted it. `passName` is its key in `Config > GamePasses`. |
| `ticketsAwarded` | `player, amount, source` | A player is given tickets. `source` is `"Tower"` or `"GamePass"`. |
| `playerDataReady` | `player` | A player's saved data has loaded. |

A `win` has these fields:

| Field | What it is |
| :-- | :-- |
| `tower` | The tower's acronym. |
| `ending` | The winpad's `EndingID`. For the main ending, that's the acronym. |
| `time` | The time in seconds, the same number that's saved. |
| `mode` | `"Normal"` or `"AllJumps"`. Practice never wins. |
| `boosted` | Whether a boost item was used. |
| `firstWin` | Whether this is the player's first win of this tower in this mode. |
| `personalBest` | Whether this time is now the player's best for this tower in this mode. |
| `rush` | The rush it was part of, or `nil`. |
| `modifiers` | The keys of the [modifiers](./modifiers.md) used. Empty if there were none. |

A `rush` has `rush` (its name), `time`, `mode`, `boosted`, `personalBest` and
`modifiers`.

A `run` has these fields:

| Field | What it is |
| :-- | :-- |
| `tower` | The tower's acronym. |
| `reason` | Why the run ended: `"died"`, `"restarted"`, `"exited"` (Exit Tower, or starting a run from the Modifiers menu), `"quit"`, `"practice"`, `"allJumps"` or `"normal"` (switching to that mode), or `"savedRun"` (loading a [saved run](./saved-runs.md)). |
| `time` | Seconds spent in the tower. |
| `mode` | `"Normal"`, `"AllJumps"` or `"Practice"`. |
| `checkpoints` | How many of the tower's checkpoints the player had passed. |
| `checkpointCount` | How many checkpoints the tower has. |
| `boosted` | Whether a boost item was used. |
| `rush` | The rush it was part of, or `nil`. |
| `modifiers` | The keys of the modifiers used. |

The kit's own [far messages](./announcements-webhooks.md#far-messages) are built on
`runEnded`.

::: tip Waiting for the kit to start
Your Script might start before the kit does. Connecting to an event is always fine,
but before you call anything else in the kit, such as reading a tower or a player's
data, call `Events.waitForStartAsync()`. It returns once the kit has started.
:::

Runs that used a Studio test tool from `ServerStorage > StarterPackStudio` aren't
wins and don't fire anything. Neither do wins with a modifier that doesn't count.

## Client events

For things the player sees, `StarterPlayerScripts > Client > Events` fires events on
that player's own client. Make a LocalScript in `StarterPlayer > StarterPlayerScripts`:

```luau
local Client = script.Parent:WaitForChild("Client")
local Events = require(Client:WaitForChild("Events"))

Events.towerWon:Connect(function()
	-- play a sound, or show a screen of your own
end)
```

| Event | Gives you | Fires when |
| :-- | :-- | :-- |
| `towerLoaded` | `acronym` | A tower loads for this player, including restarts. |
| `towerLeft` | nothing | The player is out of the tower they were in: they left, died out of it, or won. |
| `towerWon` | nothing | The player wins, as the victory sound plays. |
| `dataReady` | nothing | The player's saved data has arrived. |
| `modifierStarted` | `key, modifier` | One of the run's [modifiers](./modifiers.md#a-modifier-of-your-own) starts: each time an attempt starts, including restarts, and when the player stops spectating. `modifier` is its entry in Config. |
| `modifierEnded` | `key` | A modifier stops: the attempt ended, or the player started spectating. Undo whatever `modifierStarted` changed. |

::: warning Rewards belong on the server
Exploiters can fire client events whenever they like. Give rewards, save values and
award badges from the server's `Events`, never the client's.
:::

## Saving values of your own

`ServerScriptService > Server > CustomData` saves numbers, text and true/false values
with each player, under any names you choose. You don't need to set anything up
first.

```luau
local ServerScriptService = game:GetService("ServerScriptService")
local CustomData = require(ServerScriptService.Server.CustomData)
local Events = require(ServerScriptService.Server.Events)

Events.towerWon:Connect(function(player, win)
	local wins = CustomData.increment(player, "TotalWins", 1)
	if wins == 10 then
		-- give a badge of your own
	end
end)
```

| Function | What it does |
| :-- | :-- |
| `get(player, name)` | Returns the value saved under `name`, or `nil`. |
| `set(player, name, value)` | Saves a number, string or boolean, replacing what was there. `nil` deletes it. Returns `false` if it couldn't be saved. |
| `increment(player, name, by)` | Adds to a number, starting from 0, and returns the new total. |

Every function returns `nil` or `false` while the player's data is still loading, so
start reading from `Events.playerDataReady`. Each player can have up to 200 names of
each type. A name can be up to 64 characters, and a string up to 1000.

The client can read these values, but never change them:

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)

AccountData.Client.custom.numbers.Observe(function(numbers)
	coinsLabel.Text = tostring(numbers.Coins or 0)
end)
```

::: danger Names are saved with every player
Like a tower acronym, a name you save under is written into player data. Once your
game is out, keep it. Renaming it starts everyone from nothing.
:::

## Admin commands of your own

Make a Folder named `CustomCommands` in `ServerScriptService`. Each command in it is
two ModuleScripts: one that describes the command, and one with `Server` at the end
of its name that runs it.

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

Your commands use the same roles as the kit's. Add their `Group` to `permissions` in
`Config > Admin`, with the lowest role that may use them, such as
`["My Game"] = "Moderator"`. Until you do, only the top role can use them.

To add an argument type of your own, put it in a Folder named `Types` inside
`CustomCommands`. The [Cmdr documentation](https://eryn.io/Cmdr/guide/Commands.html)
explains everything a command can have.

::: warning Don't put "Server" in a command's file name
Cmdr treats any ModuleScript with `Server` anywhere in its name as the half that
runs a command. A command file called `ServerTime` is mistaken for one and never
loads. Name the file something else and set `Name = "server-time"` inside it.
:::
