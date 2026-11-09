# Chat

`Config > Chat` holds chat tags (`tags`) and the win messages players see in chat
(`messages`).

## Chat tags

A chat tag is a coloured label in front of a player's name, like `[Owner]`.

### 1. Make the tag

Add it to `tags.styles`. The key is the tag's ID, and `text` is what players see:

```luau
styles = {
	Owner = { text = "[Owner]", color = Color3.fromRGB(255, 215, 0) },
	VIP = { text = "[VIP]", color = Color3.fromRGB(255, 255, 0) },
},
```

For a gradient, use `colors` instead of `color`:

```luau
Legend = {
	text = "[Legend]",
	colors = { Color3.fromRGB(255, 0, 128), Color3.fromRGB(255, 200, 0) },
},
```

You can list as many colours as you like. They're spread evenly from the first
letter to the last. Only the tag is coloured. The player's name keeps its normal
colour. Don't put rich text such as `<b>` in a gradient tag.

Tags show in the chat window, not in chat bubbles.

::: warning Roblox's new chat
From February 2027, Roblox turns on its own platform chat in every game, and
games can't add their own tags to it any more. Your tags stop showing then, and
Roblox's role badges take their place.
:::

### 2. Give it to players

A player gets the **first** of these that applies to them:

1. **By user ID**, in `tags.byUser`:

   ```luau
   byUser = { [123456789] = "Owner" },
   ```

2. **By game pass**: the VIP pass's `chatTag` in `Config > GamePasses`. The tag
   appears as soon as the pass is bought.
3. **By group rank**, in `tags.byGroup`:

   ```luau
   byGroup = {
   	{ groupId = 123456, roles = { [255] = "Owner", [200] = "Moderator" } },
   },
   ```

If you give out a tag that isn't in `tags.styles`, the Output says so.

## Win messages

When a player beats a tower, a message is posted in chat. The messages are in
`messages`:

| Setting | What it does |
| :-- | :-- |
| `winMessage` | The message for a Normal win. |
| `allJumpsWinMessage` | The message for an All Jumps win. |
| `boostsUsedMessage` | An extra line listing the boosts used. `""` turns it off. |
| `modifiersMessage` | An extra line listing the run's [modifiers](./modifiers.md). `""` turns it off. |
| `channel` | The chat channel the messages go in. Defaults to `RBXSystem`. |
| `fontFace`, `fontSize` | The messages' font. |
| `fancyFontFace`, `fancyFontSize` | The font used for difficulties with `fancyFont = true`. |

You can use these in the messages, and the game fills them in: `{PlayerName}`,
`{EndingName}` and `{Time}`, plus `{BoostList}` in `boostsUsedMessage` and
`{ModifierList}` in `modifiersMessage`.

Each message starts with `[SERVER]:`, or `[GLOBAL]:` when the win is announced to
every server. You can change those in the `wins` group of `Config > Messages`.
Which difficulties are announced to every server is set in `Config > Towers`. See
[Announcements & Webhooks](./announcements-webhooks.md).

[Far messages](./announcements-webhooks.md#far-messages) use the same channel and
`[SERVER]:` tag, so changing those changes them too. They always use `fontFace` and
`fontSize`, never the fancy font.
