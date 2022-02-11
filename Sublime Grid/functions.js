gameData = {
	worlds: [
	]
}

tileSize = 64
isInAWorld = false
worldNum = 0

if (JSON.parse(localStorage.getItem('sublimegridsave')) != null)
	gameData = JSON.parse(localStorage.getItem('sublimegridsave'))

refreshWorldsList()


document.getElementById('tileDiv').style.width = tileSize * 9 + 'px'

function onLoad () {
	gameLoop1000()
}

function gameLoop1000 () {
	if (isInAWorld) {
		loadTileAesthetic()
	}
	
	localStorage.setItem('sublimegridsave', JSON.stringify(gameData))

	setTimeout(gameLoop1000, 1000)
}

function loadTileAesthetic () {
	for (x = 1; x <= 9; x++) {
		for (y = 1; y <= 9; y++) {
			
			whichTile = 'x' + (x + gameData.worlds[worldNum].playerCoords.x - 5) + 'y' + (y + gameData.worlds[worldNum].playerCoords.y - 5)
							
			if (gameData.worlds[worldNum].tiles[whichTile] == undefined)
				gameData.worlds[worldNum].tiles[whichTile] = {}
			
			if (gameData.worlds[worldNum].tiles[whichTile].id == undefined)
				gameData.worlds[worldNum].tiles[whichTile].id = 'grass'
			
			if (gameData.worlds[worldNum].tiles[whichTile].layer1 == undefined)
				gameData.worlds[worldNum].tiles[whichTile].layer1 = 'empty'
			
			document.getElementById('layer0tile-x' + x + '-y' + y).src = 'assets/tiles/' + gameData.worlds[worldNum].tiles[whichTile].id + '.png'
			document.getElementById('layer1tile-x' + x + '-y' + y).src = 'assets/tiles/' + gameData.worlds[worldNum].tiles[whichTile].layer1 + '.png'

		}
	}
}

function createNewWorld () {
	gameData.worlds.push({
		name: document.getElementById('newWorldNameInput').value,
		playerCoords: {
			x: 0,
			y: 0
		},
		tiles: {
		}
	})
	
	gameData.worlds[gameData.worlds.length - 1].tiles['x0y-2'] = {}
	gameData.worlds[gameData.worlds.length - 1].tiles['x0y-2'].id = 'well'
	
	gameData.worlds[gameData.worlds.length - 1].tiles['x0y0'] = {}
	gameData.worlds[gameData.worlds.length - 1].tiles['x0y0'].layer1 = 'player'
	
	refreshWorldsList()
}

function loadWorld (id) {
	for (i = 0; i < gameData.worlds.length; i++) {
		if (gameData.worlds[i].name == id)
			where = i
	}
	worldNum = where
	document.getElementById('startMenu').style.display = 'none'
	document.getElementById('gameBody').style.display = 'inline-block'

	for (y = 9; y >= 1; y--) {	
		for (x = 1; x <= 9; x++) {
			for (layer = 0; layer <= 1; layer++) {
				document.getElementById('layer' + layer + 'Div').innerHTML += `
					<img id="layer` + layer + `tile-x` + x + `-y` + y + `" style="height:` + tileSize + `px;width:` + tileSize + `px;image-rendering: pixelated;"/>
				`
			}
		}
	}
	
	isInAWorld = true
	loadTileAesthetic()
}

function refreshWorldsList () {
	document.getElementById('worldsList').innerHTML = ''
	for (i = 0; i < gameData.worlds.length; i++) {
		document.getElementById('worldsList').innerHTML += `
		<div style="background-color:#3C3C3C;width:300px;padding:5px;border: #000000 solid 10px;">
			<p style="background-color:#BBBBBB;padding:5px">` + gameData.worlds[i].name + `</p>
			<button style="background-color:#BBBBBB;" onClick="loadWorld('` + gameData.worlds[i].name + `')">Load This World</button>
			<button style="background-color:#BBBBBB;" onClick="deleteWorld('` + gameData.worlds[i].name + `')">Delete This World</button>
		</div>
		`
	}
}

function deleteWorld(id) {
	for (i = 0; i < gameData.worlds.length; i++) {
		if (gameData.worlds[i].name == id)
			where = i
	}
	
	gameData.worlds.splice(where,1)
	refreshWorldsList()
}

function reset () {
	localStorage.removeItem('sublimegridsave')
	location.reload()
}

function movePlayer (id) {
	gameData.worlds[worldNum].tiles['x' + gameData.worlds[worldNum].playerCoords.x + 'y' + gameData.worlds[worldNum].playerCoords.y].layer1 = 'empty'

	
	if (id == 'a')
		gameData.worlds[worldNum].playerCoords.x -= 1
	else if (id == 'd')
		gameData.worlds[worldNum].playerCoords.x += 1
	else if (id == 'w')
		gameData.worlds[worldNum].playerCoords.y += 1
	else if (id == 's')
		gameData.worlds[worldNum].playerCoords.y -= 1
	
	gameData.worlds[worldNum].tiles['x' + gameData.worlds[worldNum].playerCoords.x + 'y' + gameData.worlds[worldNum].playerCoords.y].layer1 = 'player'
	
	
	loadTileAesthetic()
}

function myKeyPress(e){

  if (window.event) // IE                  
    keynum = e.keyCode
  else if (e.which) // Netscape/Firefox/Opera                 
    keynum = e.which
	
	keyPressed = (String.fromCharCode(keynum))
 
	if ((keyPressed == 'w' || keyPressed == 'a' || keyPressed == 's' || keyPressed == 'd') && isInAWorld)
		movePlayer (keyPressed)
}