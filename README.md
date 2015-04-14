# 99-SMG
SMG implementation for 99 card game

## sample state
```

<GameState> {
	game-action: <GameAction>
	game-info: <GameInfo>
}

<GameAction> {
	targetIdx: integer
	cardKey: string
	cardStr: string
	how: {
		drawIdx: integer
		sub: boolean
	}
}

<GameInfo> {
	players: list of <Player>
	order: boolean
	unusedCards: list of string
	usedCards: list of string
	points: integer
	getWinner: function() -> <Player> | null
	getNextTurnIndex: function(turnIdx: integer) -> integer
}

<Player> {
	idx: integer
	hand: list of string
	good: function() -> boolean
}

```