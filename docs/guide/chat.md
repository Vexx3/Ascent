# Chat

Everything chat-related is in `ReplicatedStorage > Shared > Config > Chat`:
coloured name tags in `tags`, and the win messages players read in `messages`.

Rewards and saved data stay server-owned — nothing on this page changes what a
player earns, only what they see.

## Tags

Coloured prefixes shown before a player's name, such as `[Owner]` or `[VIP]`.
One colour or a gradient.

### Define them

The key is the internal name; `text` is what players see.

```luau
styles = {
	Owner = {
		text = "[Owner]",
		color = Color3.fromRGB(255, 215, 0),
	},
	VIP = {
		text = "[VIP]",
		color = Color3.fromRGB(255, 255, 0),
	},
}
```

### Gradients

Swap `color` for `colors` and the tag fades between them instead:

```luau
styles = {
	Legend = {
		text = "[Legend]",
		colors = {
			Color3.fromRGB(255, 0, 128),
			Color3.fromRGB(255, 200, 0),
		},
	},
}
```

Any number of stops, spread evenly, with the first at the start and the last
at the end. Three stops put the middle colour exactly halfway.

This is Roblox's own `UIGradient`, applied to the chat window's prefix through
[`OnChatWindowAdded`](https://create.roblox.com/docs/reference/engine/classes/TextChatService).
Rich text has no gradient markup, so that built-in is the only way to fade chat
text -- and being a true gradient, it is smooth rather than stepped.

Gradient tags are drawn by the chat window, so they appear there and not in
bubble chat, which draws no prefix at all.

A UIGradient covers a whole label, and the chat prefix normally holds the tag
and the player's name together. So the kit does what Roblox's own example
does: it makes the prefix the tag on its own and moves the name to the front
of the message. The fade lands on the tag and nothing else.

That leaves the name sitting in the message body, where it takes the message's
colour rather than the one the chat gives a name. Set `nameColor` to give it
one of your own:

```luau
tags = {
	styles = { --[[ ... ]] },
	nameColor = Color3.fromRGB(245, 205, 48),
}
```

It applies only to players wearing a gradient tag; everyone else's name is
untouched. Flat tags do not move the name at all.

`colors` wins when a tag has both, and a single entry in `colors` is just a
flat tag -- one colour has nothing to fade to. A tag with neither is reported
in the Output at startup and shows uncoloured.

::: tip Markup inside a gradient tag
Ordinary rich text in the tag's own `text`, like `<b>`, works fine. A **colour**
does not: the gradient multiplies with it rather than replacing it, so you get
neither. The startup check says so by name if you leave one in.
:::

### Hand them out

Three ways, checked in this order. **The first match wins** — a player who
qualifies for several gets one tag, not a stack.

1. **User ID** — `tags.byUser`, keyed by Roblox user ID.
2. **Game pass** — a VIP pass's own `chatTag` in `Config > GamePasses`.
3. **Group rank** — `tags.byGroup`, a group ID and the ranks that earn a tag.

**By user ID**

```luau
byUser = {
	[123456789] = "Owner",
}
```

**By game pass** — the pass names the tag in `Config > GamePasses`:

```luau
VIP = {
	id = 1234567890,
	kind = "VIP",
	ticketMultiplier = 1.25,
	trail = "VIPTrail",
	chatTag = "VIP",
	tickets = 200,
},
```

The name must exist in `tags.styles`, and the server says so in the Output at
startup if it does not — for `byUser` and `byGroup` too. Ownership is checked
server-side and replicated, so the tag appears the moment a pass is bought,
without rejoining.

A player who owns **two** tagged passes gets one of them, and which one is not
defined. Give tags to passes that cannot sensibly be held together, or accept
that the one shown is arbitrary.

**By group rank**

```luau
byGroup = {
	{
		groupId = 123456,
		roles = {
			[255] = "Owner",
			[200] = "Moderator",
		},
	},
}
```

## Win messages

In the `messages` section.

| Setting | Purpose |
| :-- | :-- |
| `winMessage` | Local message for a Normal-mode win. |
| `allJumpsWinMessage` | Local message for an All Jumps win. |
| `boostsUsedMessage` | Extra line when boosts were used. Empty string turns it off. |

| Placeholder | Fills in with |
| :-- | :-- |
| `{PlayerName}` | The player's displayed name. |
| `{EndingName}` | Tower or ending name. |
| `{Time}` | Formatted completion time. |
| `{BoostList}` | Comma-separated boost names. `boostsUsedMessage` only. |

Each message is shown after `[SERVER]:`, or `[GLOBAL]:` for a win announced
across servers. Those two prefixes are `wins.serverPrefix` and
`wins.globalPrefix` in `Config > Messages`.

## Appearance

| Setting | Purpose |
| :-- | :-- |
| `channel` | Roblox text channel for system messages. Default `RBXSystem`. |
| `fontFace` / `fontSize` | Normal difficulty messages. |
| `fancyFontFace` / `fancyFontSize` | Difficulties with `fancyFont = true`. |

`fancyFont` is set per difficulty in `Config > Towers`.

## See Also

- [Announcements & Webhooks](./announcements-webhooks.md) — server-wide and cross-server messages
- [Configuration Reference: Chat](./configuration.md#chat)
