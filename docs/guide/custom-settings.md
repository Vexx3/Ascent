# Adding a Saved Setting

You can add your own switch, slider, dropdown or rebindable key to the Settings
menu without touching the kit's code. Add it to `Config > CustomSettings`, and the
kit makes the row, saves the player's choice and loads it next time.

## 1. Add it to Config

```luau
local CustomSettings: ConfigTypes.CustomSettings = {
	-- A switch.
	hideHealthBar = { kind = "toggle", default = false, category = "Visual" },
	-- A slider.
	zoomSpeed = { kind = "number", default = 1, min = 0.5, max = 4, increment = 0.5 },
	-- A dropdown.
	shadowQuality = { kind = "choice", default = "High", options = { "Low", "Medium", "High" } },
	-- A rebindable key.
	dashKey = { kind = "key", default = "Q", category = "Controls" },
}
```

Press Play and the row is in the Settings menu. `hideHealthBar` shows up as
**Hide Health Bar**. Changes are saved, and they come back when the player rejoins.

| Setting | For | What it does |
| :-- | :-- | :-- |
| `kind` | All | `"toggle"`, `"number"`, `"choice"` or `"key"`. |
| `default` | All | What players start with. For a key, a `KeyCode` name such as `"Q"` or `"LeftShift"`. |
| `min`, `max` | `number` | The two ends of the slider. |
| `increment` | `number` | How much one step of the slider changes the value. Defaults to `1`. |
| `options` | `choice` | Every option in the dropdown. |
| `name` | All | The row's name. Defaults to the key split into words. |
| `category` | All | The tab it goes in: `"Gameplay"` (the default), `"Visual"`, `"Audio"`, `"Controls"` or `"Chat"`. |
| `order` | All | Its position in the tab (its `LayoutOrder`). |
| `frame` | All | The name of a row you built yourself. See [below](#styling-the-rows). |

The server checks every value a player sends against what you wrote here. Each
player can save up to 64 toggles, 64 numbers, and 64 choice and key settings
together.

::: warning The key is saved with every player
If you rename `hideHealthBar` after release, everyone loses what they chose.
Anything else can change freely, and adding or removing a setting later is safe.
:::

## 2. Make it do something

The kit saves the setting, but your own script decides what it does. Read the
player's choice with the function for its kind. A setting the player hasn't changed
returns its `default`.

```luau
CustomSettings.toggle(settings, "hideHealthBar")  -- a boolean
CustomSettings.number(settings, "zoomSpeed")      -- a number
CustomSettings.choice(settings, "shadowQuality")  -- a string
CustomSettings.key(settings, "dashKey")           -- a KeyCode name
```

### In a LocalScript

Put a LocalScript in `StarterPlayer > StarterPlayerScripts`, next to the kit's
`Client` folder (not inside it, so updates leave it alone):

```luau
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

AccountData.Client.settings.Observe(function(settings)
	local hidden = CustomSettings.toggle(settings, "hideHealthBar")
	local healthBar = Players.LocalPlayer.PlayerGui:FindFirstChild("HealthbarGui")
	if healthBar ~= nil then
		healthBar.Enabled = not hidden
	end
end)
```

`Observe` runs once when the player's data arrives, and again every time any of
their settings changes.

### In a server Script

```luau
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AccountData = require(ReplicatedStorage.Shared.Accounts.AccountData)
local CustomSettings = require(ReplicatedStorage.Shared.Settings.CustomSettings)

local Data = AccountData.Server

local function speedFor(player: Player): number
	if Data.GetState(player) ~= "Ready" then
		return 1 -- their data hasn't loaded yet
	end
	return CustomSettings.number(Data.Get(player).settings, "zoomSpeed")
end
```

### Listening for a rebindable key

In a LocalScript, with the same `require` lines as the first example:

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

Players can pick any keyboard key, and Escape cancels. The kit doesn't stop two
of your actions sharing a key.

## Styling the rows

New rows are copied from templates in the Settings menu:

```text
SettingsMenu
└─ CustomTemplates    -- hidden from players
   ├─ Toggle
   ├─ Choice
   ├─ Number
   └─ Key
```

Restyle these and every custom row follows. To give one setting a row of its own,
build it anywhere in the menu and name it after the setting's key (or set `frame`
to its name). The kit uses it as it is.

Each row needs its control inside it:

| Kind | The row needs |
| :-- | :-- |
| toggle | A `ToggleButton`, with a `Circle` inside. |
| choice | An `OptionsFrame` holding a `Current` button, with a `CurrentSelected` label inside. It opens `MenusContainer > DropdownList`, which every dropdown in the menu shares. |
| number | A `SliderFrame` with a `Thumb` and a `Fill`, and a `ValueLabel`. |
| key | A `KeybindButton` with a `KeybindLabel` inside. Optionally, a `ResetButton` (puts back the default) and a `ClearButton` (leaves no key, shown as `None`). |

The Gameplay, Visual, Controls and Chat tabs lay out rows on their own. In the
Audio tab, you position rows yourself.

## If it does not work

| Problem | What to check |
| :-- | :-- |
| There's no row in the menu | The Output names the setting and what's missing. Usually `CustomTemplates` was renamed or deleted. |
| The row does nothing | It's missing its control, such as `ToggleButton`. |
| It's in the wrong tab | Its `category`. |
| Your own row is ignored and a copy appears | Name your row after the key, or set `frame`. |
| It doesn't survive rejoining in Studio | `"Mock"` mode forgets everything when you stop, on purpose. Use `"Live"` with a test `dataStoreKeyStudio`. |
| A dropdown jumps back to another option | The value isn't in `options`. |
| Studio underlines your setting in red | `default` doesn't match `kind`. |
