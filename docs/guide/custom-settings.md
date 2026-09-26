# Adding A Saved Setting

A setting of your own (a switch, a slider, a cycle button or a rebindable key) that appears in the Settings menu and saves with the player takes **one step**: declare it in `Config > CustomSettings`.

## Declare It

```luau
local CustomSettings: ConfigTypes.CustomSettings = {
	-- A switch.
	hideHealthBar = { kind = "toggle", default = false, category = "Visual" },
	-- A slider.
	zoomSpeed = { kind = "number", default = 1, min = 0.5, max = 4, increment = 0.5 },
	-- A cycle button.
	shadowQuality = { kind = "choice", default = "High", options = { "Low", "Medium", "High" } },
	-- A rebindable key.
	dashKey = { kind = "key", default = "Q", category = "Controls" },
}
```

The row appears in the menu (`hideHealthBar` reads **Hide Health Bar**), saves when changed, and comes back on rejoin.

| Field | Kinds | Meaning |
| :-- | :-- | :-- |
| `kind` | all | `"toggle"`, `"number"`, `"choice"` or `"key"`. |
| `default` | all | What players start with. For a key, a `KeyCode` name like `"Q"` or `"LeftShift"`. |
| `min`, `max` | number | The slider's ends. |
| `increment` | number | One step of the slider. Defaults to `1`. |
| `options` | choice | Every value it accepts. |
| `name` | all | What players read. Defaults to the key split into words. |
| `category` | all | The tab: `"Gameplay"` (default), `"Visual"`, `"Audio"`, `"Controls"` or `"Misc"`. |
| `order` | all | Its `LayoutOrder` in the tab. |
| `frame` | all | A row you built yourself; see below. |

The server checks every value against the declaration: numbers are clamped, choices must be in `options`, keys must be real `KeyCode`s, and undeclared settings are never saved. A save holds up to 64 toggles, 64 numbers, and 64 choice and key settings **together**, since those two share one store.

::: warning The key is saved with the player
Renaming `hideHealthBar` after release loses what everyone chose. Everything else can change freely. Adding or removing a setting later needs no migration.
:::

## Styling The Rows

Rows are copied from templates in the menu:

```text
SettingsMenu
  CustomTemplates    <- hidden from players
    Toggle
    Choice
    Number
    Key
```

Restyle those and every custom row follows. To give one setting its own layout, build the row anywhere in the menu and name it after the key (or set `frame` to its name); it's used as it is.

A row needs its control inside it:

| Kind | Needs |
| :-- | :-- |
| toggle | `ToggleButton`, with a `Circle` inside |
| choice | `OptionsFrame` |
| number | `SliderFrame` with `Thumb` and `Fill`, and a `ValueLabel` |
| key | `KeybindButton`, with a `KeybindLabel` inside |

`GameplayFrame`, `VisualFrame` and `ControlsFrame` lay rows out automatically. In `AudioFrame` you position them yourself, and there is no `MiscFrame` until you add one.

## Making It Do Something

Read a setting with the reader for its kind. A setting nobody has changed reads as its default.

```luau
CustomSettings.toggle(settings, "hideHealthBar")  -- boolean
CustomSettings.number(settings, "zoomSpeed")      -- number
CustomSettings.choice(settings, "shadowQuality")  -- string
CustomSettings.key(settings, "dashKey")           -- a KeyCode name
```

### On the client

A LocalScript in `StarterPlayer > StarterPlayerScripts`, beside the kit's `Client` script (not inside it, so updates leave it alone):

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

AccountData.Client.settings.Observe(function(settings)
	local hidden = CustomSettings.toggle(settings, "hideHealthBar")
	local healthBar = game:GetService("Players").LocalPlayer.PlayerGui:FindFirstChild("HealthbarGui")
	if healthBar ~= nil then
		healthBar.Enabled = not hidden
	end
end)
```

`Observe` runs when the player's data arrives and again whenever any setting changes.

### On the server

```luau
local Data = AccountData.Server

local function speedFor(player: Player): number
	if Data.GetState(player) ~= "Ready" then
		return 1 -- not loaded yet
	end
	return CustomSettings.number(Data.Get(player).settings, "zoomSpeed")
end
```

### Listening for a key

```luau
local UserInputService = game:GetService("UserInputService")
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

Players rebind with keyboard keys; Escape cancels. The kit doesn't stop two actions sharing a key.

## If It Does Not Work

| Symptom | Check |
| :-- | :-- |
| No row in the menu | The Output names the setting and what's missing. Usually `CustomTemplates` was renamed or deleted. |
| The row does nothing | It's missing its control, such as `ToggleButton`. |
| It's in the wrong tab | `category`. |
| Your own row is ignored and a copy appears | Name it after the key, or set `frame`. |
| It doesn't survive a rejoin in Studio | `Mock` mode forgets on purpose. Use `"Live"` with a test `dataStoreKeyStudio`. |
| A choice snaps back | The value isn't in `options`. |
| Studio underlines the declaration | `default` doesn't match `kind`. |
