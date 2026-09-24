# Adding A Saved Setting

A setting of your own — a switch, a slider, a cycle button, or a rebindable key
— that appears in the Settings menu, saves with the player, and comes back when
they rejoin.

**One step.** Declare it in `Config > CustomSettings`. Nothing else: not the
network schema, not the server, not the menu, not even the row.

## Declare It

`ReplicatedStorage > Shared > Config > CustomSettings`:

```luau
local CustomSettings: ConfigTypes.CustomSettings = {
    hideHealthBar = { kind = "toggle", default = false, category = "Visual" },
}
```

That is the whole thing. A row appears under Visual reading **Hide Health Bar**,
it saves when a player changes it, and it comes back when they rejoin.

The four kinds:

```luau
-- A switch.
hideHealthBar = { kind = "toggle", default = false, category = "Visual" },

-- A slider. `increment` is how far one step moves it, and defaults to 1.
zoomSpeed = { kind = "number", default = 1, min = 0.5, max = 4, increment = 0.5 },

-- A cycle button. `default` has to be one of `options`.
shadowQuality = { kind = "choice", default = "High", options = { "Low", "Medium", "High" } },

-- A key the player can rebind. `default` is a KeyCode name.
dashKey = { kind = "key", default = "Q", category = "Controls" },
```

| Field | Kinds | Meaning |
| :-- | :-- | :-- |
| `kind` | all | `"toggle"`, `"number"`, `"choice"` or `"key"`. |
| `default` | all | What a new player starts with, and what anyone who has never changed it reads as. |
| `min`, `max` | number | The ends of the slider. The server clamps to them. |
| `increment` | number | How far one step moves. Defaults to `1`. |
| `options` | choice | Every value the setting accepts. The server refuses anything else. |
| `default` | key | A `KeyCode` name as Studio spells it — `"Q"`, `"LeftShift"`, `"ButtonY"`. |
| `name` | all | What players read. Defaults to the key with its words split: `hideHealthBar` becomes `Hide Health Bar`. |
| `category` | all | Which tab: `"Gameplay"`, `"Visual"`, `"Audio"`, `"Controls"` or `"Misc"`. Defaults to `"Gameplay"`. |
| `order` | all | `LayoutOrder` within the tab. |
| `frame` | all | The name of a row you authored yourself. See below. |

`kind` is written out rather than guessed from the default, so a default of the
wrong type is a type error in Studio naming the setting, rather than a row that
quietly never saves.

The save holds three maps — toggles, numbers, and strings — with room for **64
entries in each** and names up to 64 characters. `choice` and `key` share the
string map, because both save a string and a setting you change from one kind to
the other would otherwise lose what players had picked.

That is far more than a fangame needs, and it is a cap on the saved data rather
than a suggestion: the 65th would fail to write.

::: warning The key on the left is saved with the player
`hideHealthBar` is what goes into their profile. Renaming it after release loses
what everyone had chosen. Everything else — the name shown, the range, the
options, the tab, even the kind — can change whenever you like.
:::

## Styling The Rows

The row is copied from a template you own, so it looks like the rest of your
menu without you doing anything. The templates live together:

```text
StarterGui
  MainMenu
    Main
      MenusContainer
        SettingsMenu
          CustomTemplates    <- invisible; never shown to players
            Toggle
            Choice
            Number
            Key
```

Restyle those and every custom setting follows. They started as copies of
`HideTimer`, `HideCosmetics`, `QuickResetDelay` and `QuickRestart`, so they
already match.

**To give one setting a row of its own**, author it anywhere in the menu, name
it after the key — or name it whatever you like and point `frame` at it — and it
is used exactly as it is, with nothing cloned. That is the way out when a
setting wants a layout the templates do not have.

A row of any kind must keep the control inside it:

| Kind | Needs |
| :-- | :-- |
| toggle | `ToggleButton`, with a `Circle` inside it |
| choice | `OptionsFrame` |
| number | `SliderFrame` with `Thumb` and `Fill`, and a `ValueLabel` |
| key | `KeybindButton`, with a `KeybindLabel` inside it |

::: tip If nothing appears
The Output window says which setting and what was missing — a template that is
not there, a tab that is not there, or a row missing the control inside it. The
kit never builds interface instances from nothing, so every row is one you can
open and edit.
:::

::: warning Audio and Misc
`GameplayFrame`, `VisualFrame` and `ControlsFrame` lay their rows out
automatically. `AudioFrame` positions its two by hand, and this place has no
`MiscFrame` at all — a row cloned into either needs positioning yourself.
:::

## Making It Do Something

Declaring a setting saves it. Acting on it is your script, and it is short.

There is one reader per kind, so each gives back a concrete type and you never
have to check what you got:

```luau
CustomSettings.toggle(settings, "hideHealthBar")  -- boolean
CustomSettings.number(settings, "zoomSpeed")      -- number
CustomSettings.choice(settings, "shadowQuality")  -- string
CustomSettings.key(settings, "dashKey")           -- string, a KeyCode name
```

A setting the player has never touched reads as its declared default, so there
is no "not set yet" case to handle, ever.

### On the client

A **LocalScript in `StarterPlayer > StarterPlayerScripts`**, beside the kit's
`Client` script rather than inside it — everything in there is kit code, and
keeping yours out of it means an update to the kit cannot take your script with
it.

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

local function applyHealthBar(hidden: boolean)
    local player = game:GetService("Players").LocalPlayer
    local healthBar = player.PlayerGui:FindFirstChild("HealthbarGui")
    if healthBar ~= nil then
        healthBar.Enabled = not hidden
    end
end

AccountData.Client.settings.Observe(function(settings)
    applyHealthBar(CustomSettings.toggle(settings, "hideHealthBar"))
end)
```

`Observe` is the whole trick. It fires **once when the player's saved data
arrives**, and **again every time a setting changes** — so the same two lines
handle a player joining and a player flicking the switch, and you never have to
wait for data yourself.

It fires for any settings change, not only yours, so keep the work inside cheap
or compare against the last value you used.

### On the server

Read it off the player's profile. The same readers work here — a server
reads through Scribe accessors and a client reads a plain table, and the readers
understand both:

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

local Data = AccountData.Server

local function speedFor(player: Player): number
    if Data.GetState(player) ~= "Ready" then
        return 1  -- their profile has not loaded yet
    end
    return CustomSettings.number(Data.Get(player).settings, "zoomSpeed")
end
```

The `GetState` guard matters: a player can be in the game before their save has
arrived, and reading then gives you the declared default rather than what they
actually chose.

### Listening for a key

A `key` setting saves the binding and draws the row that changes it. Pressing it
is yours — read the key and watch for it:

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

local dashKey = Enum.KeyCode.Q

AccountData.Client.settings.Observe(function(settings)
    dashKey = Enum.KeyCode[CustomSettings.key(settings, "dashKey")]
end)

UserInputService.InputBegan:Connect(function(input, typing)
    if not typing and input.KeyCode == dashKey then
        -- dash
    end
end)
```

The `typing` argument matters: without it the key fires while somebody is typing
in the chat. `Observe` keeps `dashKey` current, so rebinding it in the menu takes
effect immediately rather than on the next join.

The kit refuses anything that is not a real `KeyCode` name, so what you read is
always safe to look up.

The row listens for keyboard keys only, and Escape cancels. A controller button
such as `"ButtonY"` works as a `default`, but it is not something a player can
rebind to from the menu.

::: tip It will not clash with the kit's own binds
The row shares the kit's capture lock, so two rows cannot listen for the same
press. Nothing stops a player binding your key to the same one as Quick Restart,
though — the kit does not reserve keys, and neither does Roblox.
:::

### Beside the kit's own effects

If what you are doing is the same shape as the kit's built-in visual settings —
hiding a GUI, toggling an effect — `Client > Settings > Menu > SettingsEffects`
is where those live, and putting yours there keeps them together. The trade is
that it is kit code, so you are editing a file an update would replace; a
LocalScript of your own is yours.

## What The Server Does

Everything a client sends is checked before it is stored, against the
declaration and nothing else:

- a **toggle** takes a boolean, and refuses the word `"true"`;
- a **number** is clamped into `min`–`max`, and NaN and both infinities are
  refused outright — NaN passes every range comparison, so a clamp alone would
  let it through;
- a **choice** must be one of `options`;
- a **key** must be a real `KeyCode` name;
- a key you never declared is **never stored**, however many a message carries.

That last one is why the server walks your declarations rather than the message.
You do not write any of it, and there is no list to remember to add your setting
to.

## Adding One Later Is Free

A value a player has never changed is not stored at all — only what they have
actually set goes into their profile. So a setting added after release costs
existing players nothing, needs no [migration](./player-data.md), and reads as
its default until they change it.

Removing one is the same in reverse: delete the declaration and the row goes
with it, since it was only ever a copy. What is already in a profile is ignored
and stops being written.

## When You Need More Than This

A custom setting is a value that saves and a row that changes it. Reach past it
when you need something the four kinds cannot express — a setting that is a
list, one whose options depend on the player, or one the server has to act on
the moment it changes. Those are ordinary features: add a message to the network
schema and a field to the account, the way the kit's own settings do. The
[API Reference](./api.md#networking) covers the schema.

## If It Does Not Work

| Symptom | Check |
| :-- | :-- |
| No row in the menu | The Output window names the setting and what was missing. Most often `CustomTemplates` has been renamed or deleted. |
| The row is there and does nothing | It is missing the control inside it — `ToggleButton`, `OptionsFrame`, `SliderFrame`, or `KeybindButton`. |
| The row lands in the wrong tab | `category`, which defaults to `"Gameplay"`. |
| A row you authored is ignored and a copy appears instead | Its name has to match the key, or `frame` has to name it. |
| It changes but does not survive a rejoin | Studio Mock mode forgets the profile on purpose. Test persistence with a `"Live"` `dataStoreStudioMode` and a dedicated `dataStoreKeyStudio`. |
| A choice snaps back to the default | The value is not in `options`, so the server refused it. |
| A slider saves the wrong number | `min`, `max` and `increment` in the declaration are the units the value is saved in. |
| A type check rejects the declaration | The `default` does not match the `kind`, which is exactly what that check is for. |
