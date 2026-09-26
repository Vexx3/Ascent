# Chat

`Config > Chat` holds chat tags (`tags`) and the win messages players read (`messages`).

## Tags

A coloured prefix before a player's name, like `[Owner]`. Define each in `tags.styles`; the key is the name you hand it out by, `text` is what players see:

```luau
styles = {
	Owner = { text = "[Owner]", color = Color3.fromRGB(255, 215, 0) },
	VIP = { text = "[VIP]", color = Color3.fromRGB(255, 255, 0) },
},
```

### Gradients

Use `colors` instead of `color` and the tag fades across its letters:

```luau
Legend = {
	text = "[Legend]",
	colors = { Color3.fromRGB(255, 0, 128), Color3.fromRGB(255, 200, 0) },
},
```

Add as many colours as you like; they spread evenly from the first letter to the last. Only the tag is coloured; the name keeps its usual colour. Keep a gradient tag's text plain (no `<b>` or other rich text). Tags show in the chat window, not in bubbles.

### Hand them out

A player gets the **first** of these that applies:

1. **By user ID**, in `tags.byUser`:

   ```luau
   byUser = { [123456789] = "Owner" },
   ```

2. **By game pass**: a VIP pass's `chatTag` in `Config > GamePasses`. It appears as soon as the pass is bought.
3. **By group rank**, in `tags.byGroup`:

   ```luau
   byGroup = {
   	{ groupId = 123456, roles = { [255] = "Owner", [200] = "Moderator" } },
   },
   ```

A name that doesn't exist in `tags.styles` is reported in the Output.

## Win messages

In `messages`:

| Setting | Purpose |
| :-- | :-- |
| `winMessage` | A Normal win. |
| `allJumpsWinMessage` | An All Jumps win. |
| `boostsUsedMessage` | An extra line when boosts were used. `""` turns it off. |
| `channel` | The chat channel they appear in. Default `RBXSystem`. |
| `fontFace`, `fontSize` | Their font. |
| `fancyFontFace`, `fancyFontSize` | The font for difficulties with `fancyFont = true`. |

Placeholders: `{PlayerName}`, `{EndingName}`, `{Time}`, and `{BoostList}` in `boostsUsedMessage`.

Each message starts with `[SERVER]:`, or `[GLOBAL]:` for a win announced to every server. Those prefixes are in `Config > Messages` under `wins`. Which difficulties are announced to every server is set in `Config > Towers`; see [Announcements & Webhooks](./announcements-webhooks.md).
