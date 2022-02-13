saveData = {
	worlds: [
	]
}

items = {
	limes: {
		maxStackSize: 1
	}
}

tileGrid = 17
tileSize = Math.floor(window.innerHeight / (tileGrid - 2))
isInAWorld = false


if (JSON.parse(localStorage.getItem('sublimegridsave')) != null)
	saveData = JSON.parse(localStorage.getItem('sublimegridsave'))

refreshWorldsList()



dimensions ('tileDiv', tileSize * (tileGrid + 2), tileSize * (tileGrid + 2))
dimensions ('frame', tileSize * tileGrid, tileSize * tileGrid)


document.getElementById('frame').style.left = tileSize + 'px'
document.getElementById('frame').style.top = tileSize + 'px'

document.getElementById('tileDiv').style.top = (tileSize * -2) + 'px'


dimensions ('frameLeft', tileSize * 2, tileSize * (tileGrid + 2))
dimensions ('frameBottom', tileSize * (tileGrid + 2), tileSize * 2)

dimensions ('guiRight', (window.innerWidth - tileSize * (tileGrid - 2)) / 2 - 8, window.innerHeight)


function dimensions (id, width, height) {
	document.getElementById(id).style.height = height + 'px'
	document.getElementById(id).style.width = width + 'px'
}

function gameLoop1000 () {
	localStorage.setItem('sublimegridsave', JSON.stringify(saveData))
	setTimeout(gameLoop1000, 1000)
}

function loadTileAesthetic () {
	for (x = 1; x <= tileGrid; x++) {
		for (y = 1; y <= tileGrid; y++) {
			whichTile = 'x' + (x + gameData.playerCoords.x - Math.ceil(tileGrid / 2)) + 'y' + (y + gameData.playerCoords.y - Math.ceil(tileGrid / 2))
			
			if (gameData.tiles[whichTile] == undefined)
				gameData.tiles[whichTile] = {}
			
			if (gameData.tiles[whichTile].layer0 == undefined)
				gameData.tiles[whichTile].layer0 = 'grass'
			
			
			if (gameData.tiles[whichTile].layer1 == undefined) {
				if (randomNumber(5) == 1)
					gameData.tiles[whichTile].layer1 = 'limetree'
				else
					gameData.tiles[whichTile].layer1 = 'empty'
			}
			
			setImage ('layer0tile-x' + x + '-y' + y, 'tiles/' + gameData.tiles[whichTile].layer0)
			setImage ('layer1tile-x' + x + '-y' + y, 'tiles/' + gameData.tiles[whichTile].layer1)
			
			
			if (gameData.tiles[whichTile].layer1 == 'player')
				document.getElementById('layer1tile-x' + x + '-y' + y).style.transform = 'rotate(' + gameData.playerRotation + 'deg)'

		}
	}
}

function setImage (id, content) {
	document.getElementById(id).src = 'assets/' + content + '.png'
}

function createNewWorld () {
	saveData.worlds.push({
		name: document.getElementById('newWorldNameInput').value,
		playerCoords: {
			x: 0,
			y: 0
		},
		tiles: {
		},
		inventory:  {}
	})
	
	thisWorldCreate = saveData.worlds.length - 1
	
	saveData.worlds[thisWorldCreate].tiles['x0y-2'] = {}
	saveData.worlds[thisWorldCreate].tiles['x0y-2'].layer1 = 'well'
	
	saveData.worlds[thisWorldCreate].tiles['x0y0'] = {}
	saveData.worlds[thisWorldCreate].tiles['x0y0'].layer1 = 'player'
	
	for (i = 1; i <= 5; i++) {
		saveData.worlds[thisWorldCreate].inventory['slot' + i] = {}
		saveData.worlds[thisWorldCreate].inventory['slot' + i].id = 'empty'
		saveData.worlds[thisWorldCreate].inventory['slot' + i].amount = 0
	}
	
	refreshWorldsList()
}

function loadWorld (id) {
	setDate = Date.now()
	for (i = 0; i < saveData.worlds.length; i++) {
		if (saveData.worlds[i].name == id)
			where = i
	}
	
	
	gameData = saveData.worlds[where]
	
	document.getElementById('startMenu').style.display = 'none'
	document.getElementById('gameBody').style.display = 'inline-block'


	for (layer = 0; layer <= 1; layer++) {
		toAdd = ''
		
		for (y = tileGrid; y >= 1; y--) {
			for (x = 1; x <= tileGrid; x++) {
				toAdd += `<img id="layer` + layer + `tile-x` + x + `-y` + y + `" style="height:` + tileSize + `px;width:` + tileSize + `px;image-rendering: pixelated;"/>`
			}
		}
		
		document.getElementById('layer' + layer + 'Div').innerHTML += toAdd
		
	}
	
	isInAWorld = true
	console.log(setDate - Date.now())
	loadTileAesthetic()
}

function refreshWorldsList () {
	document.getElementById('worldsList').innerHTML = ''
	for (i = 0; i < saveData.worlds.length; i++) {
		document.getElementById('worldsList').innerHTML += `
		<div style="background-color:#3C3C3C;width:300px;padding:5px;border: #000000 solid 10px;">
			<p style="background-color:#BBBBBB;padding:5px">` + saveData.worlds[i].name + `</p>
			<button style="background-color:#BBBBBB;" onClick="loadWorld('` + saveData.worlds[i].name + `')">Load This World</button>
			<button style="background-color:#BBBBBB;" onClick="deleteWorld('` + saveData.worlds[i].name + `')">Delete This World</button>
		</div>
		`
	}
}

function deleteWorld(id) {
	for (i = 0; i < saveData.worlds.length; i++) {
		if (saveData.worlds[i].name == id)
			where = i
	}
	
	saveData.worlds.splice(where,1)
	refreshWorldsList()
}

canMove = true

function movePlayer (id) {
		
	if (canMove) {
		canMove = false
		doMove = false
		
		gameData.tiles['x' + gameData.playerCoords.x + 'y' + gameData.playerCoords.y].layer1 = 'empty'
		
		playerCoords = gameData.playerCoords
		
		if (id == 'a') {
			if (gameData.tiles['x' + (gameData.playerCoords.x - 1) + 'y' + gameData.playerCoords.y].layer1 == 'empty') {
				playerCoords.x -= 1
				doMove = true
			}
			gameData.playerRotation = '180'
			axis = 'x'
			amount = -1
		}
		else if (id == 'd') {
			if (gameData.tiles['x' + (gameData.playerCoords.x + 1) + 'y' + gameData.playerCoords.y].layer1 == 'empty') {
				playerCoords.x += 1
				doMove = true
			}
			gameData.playerRotation = '0'
			axis = 'x'
			amount = 1
		}
		else if (id == 'w') {
			if ((gameData.tiles['x' + gameData.playerCoords.x + 'y' + (gameData.playerCoords.y + 1)].layer1 == 'empty')) {
				playerCoords.y += 1
				doMove = true
			}
			gameData.playerRotation = '270'
			axis = 'y'
			amount = 1
		}
		else if (id == 's') {
			if (gameData.tiles['x' + gameData.playerCoords.x + 'y' + (gameData.playerCoords.y - 1)].layer1 == 'empty') {
				playerCoords.y -= 1
				doMove = true
			}
			gameData.playerRotation = '90'
			axis = 'y'
			amount = -1
		}
		
		gameData.tiles['x' + gameData.playerCoords.x + 'y' + gameData.playerCoords.y].layer1 = 'player'
		
		if (axis == 'y')
			gameData.playerCoordsLooking = 'x' + gameData.playerCoords.x + 'y' + (gameData.playerCoords.y + amount)
		else if (axis == 'x')
			gameData.playerCoordsLooking = 'x' + (gameData.playerCoords.x + amount) + 'y' + gameData.playerCoords.y

		moveFrame(0, amount, axis)
	}
}


function moveFrame (displacement, amountMove, axisMove) {
	if (displacement <= tileSize && doMove) {
		if (axisMove == 'x') {
			if (amountMove == -1)
				document.getElementById('frame').style.left = (tileSize + displacement) + 'px'
			else
				document.getElementById('frame').style.left = (tileSize - displacement) + 'px'
		}
		else {
			if (amountMove == 1)
				document.getElementById('frame').style.top = (tileSize + displacement) + 'px'
			else
				document.getElementById('frame').style.top = (tileSize - displacement) + 'px'
		}


		displacement += 1
		setTimeout(moveFrame, 0, displacement, amount, axisMove)
	}
	else {
		loadTileAesthetic()
		document.getElementById('frame').style.left = tileSize + 'px'
		document.getElementById('frame').style.top = tileSize + 'px'
		canMove = true
	}
}

function myKeyPress(e) {
	keyPressed = (String.fromCharCode(e.which))
 
	if (isInAWorld) {
		if (keyPressed == 'w' || keyPressed == 'a' || keyPressed == 's' || keyPressed == 'd')
			movePlayer (keyPressed)
		else if (e.which == 13) //Enter key
			interact()
		
	}

}

function randomNumber (max) {
	return Math.floor(Math.random() * max) + 1
}

function interact () {
	if (gameData.tiles[gameData.playerCoordsLooking].layer1 == 'well')
		update('textBox', 'Welcome to the Lime Forest!')
	else if (gameData.tiles[gameData.playerCoordsLooking].layer1 == 'limetree') {
		gameData.tiles[gameData.playerCoordsLooking].layer1 = 'emptylimetree'
		addItem('limes')
	}
}

hasUpdatedObj = {}

function update(id, content) {
	objContent = id.replace(/[()-]/g, 'uwu')
	
	if (hasUpdatedObj[objContent] != content) {
		document.getElementById(id).innerHTML = content
		hasUpdatedObj[objContent] = content
	}
}

function addItem (id) {
	for (i = 1; i <= 5; i++) {
		if (gameData.inventory['slot' + i].id == 'empty')
			gameData.inventory['slot' + i].id = id
	}
}