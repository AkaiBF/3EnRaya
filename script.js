/**
* Variables del juego
*/
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let turn = true
let campo = [[0,0,0],
 						 [0,0,0],
 						 [0,0,0]]
let fin = false
let ia = true
let mentalMap
let audio = new Audio('audio.mp3')
let activeSound = true

/**
* Dibuja una linea desde el punto (ax, ay) al punto (bx, by)
**/
function drawLine(ax, ay, bx, by) {
	ctx.beginPath()
	ctx.moveTo(ax, ay)
	ctx.lineTo(bx, by)
	ctx.stroke()
}

/**
* Dibuja la base del tablero de juego
**/
function drawTabletop() {
	drawLine(301, 0, 301, 903)
	drawLine(602, 0, 602, 903)
	drawLine(0, 301, 903, 301)
	drawLine(0, 602, 903, 602)
}

/**
* Dibuja una cruz en la posición indicada
**/
function drawX(x, y) {
	drawLine((301*x)+20, (301*y)+20, (301*(x+1)-20), (301*(y+1)-20))
	drawLine((301*x)+20, (301*(y+1)-20), (301*(x+1)-20), (301*y)+20)
}

/**
* Dibuja un círculo en la posición indicada
**/
function drawO(x, y) {
	ctx.beginPath()
	ctx.arc(301*x+150, 301*y+150, 130, 0, 2*Math.PI, false)
	ctx.stroke()
}

/**
* Bucle fundamental del juego. Controla el turno de un jugador dado un click. En el caso de que el modo
* IA esté activado, ordena su juego.
**/
function set(event) {
	let x = (event.clientX - canvas.offsetLeft)/301 >> 0
	let y = (event.clientY - canvas.offsetTop)/301 >> 0
	if(campo[x][y] == 0 && !fin) {
		if(turn) {
			drawX(x, y)
			turn = false
			campo[x][y] = 1
			if(checkVictory() != 0) {
				fin = true
				if(checkVictory() == 3) {
					document.getElementById('result').innerHTML = 'Ha habido un empate'
				} else {
					document.getElementById('result').innerHTML = "Gana el Jugador" + checkVictory()
				}
				document.getElementById('menuOpen').click()
				if(activeSound) {
					audio.play()
				}
				return
			} else if(ia) {
				iaPlays(0, 0)
			}
		} else if(!ia) {
			drawO(x, y)
			turn = true
			campo[x][y] = 2
		}
	}
	if(checkVictory() != 0) {
		fin = true
		if(checkVictory() == 3) {
			document.getElementById('result').innerHTML = 'Ha habido un empate'
		} else {
			document.getElementById('result').innerHTML = 'Gana el Jugador' + checkVictory()
		}
		document.getElementById('menuOpen').click()
		if(activeSound) {
			audio.play()
		}
	}
}

/**
* Comprueba si se ha producido un fin de partida.
**/
function checkVictory() {
	for(let i = 0; i < 3; i++) {
		if((campo[0][i] == campo[1][i] && campo[1][i] == campo[2][i]) && campo[0][i] != 0) return campo[1][i]
		if((campo[i][0] == campo[i][1] && campo[i][1] == campo[i][2]) && campo[i][0] != 0) return campo[i][1]
	}
	if((campo[0][0] == campo[1][1] && campo[1][1] == campo[2][2]) || (campo[0][2] == campo[1][1] && campo[1][1] == campo[2][0]) && (campo[1][1] != 0)) return campo[1][1]
	for(let i = 0; i < 3; i++) {
		for(let j = 0; j < 3; j++) {
			if(campo[i][j] == 0) return 0
		}
	}
	return 3
}

/**
* Comprueba si, tras una jugada supuesta, se produciría un fin de partida
**/
function checkMentalVictory() {
	for(let i = 0; i < 3; i++) {
		if((mentalMap[0][i] == mentalMap[1][i] && mentalMap[1][i] == mentalMap[2][i]) && mentalMap[0][i] != 0) return mentalMap[1][i]
		if((mentalMap[i][0] == mentalMap[i][1] && mentalMap[i][1] == mentalMap[i][2]) && mentalMap[i][0] != 0) return mentalMap[i][1]
	}
	if(((mentalMap[0][0] == mentalMap[1][1] && mentalMap[1][1] == mentalMap[2][2]) || (mentalMap[0][2] == mentalMap[1][1] && mentalMap[1][1] == mentalMap[2][0])) && (mentalMap[1][1] != 0)) return mentalMap[1][1]
	return 0
}

/**
* Controla el turno de la IA
**/
function iaPlays(a, b) {
	mentalMap = JSON.parse(JSON.stringify(campo))
	if(mentalMap[a][b] == 0) {
		mentalMap[a][b] = 1
	} else if(a < 3 && (b < 2 || a != 2)) {
		return nextStep(a, b)
	}
	if(checkMentalVictory() > 0) {
		drawO(a, b)
		turn = true
		campo[a][b] = 2
		played = true
		return 0
	} else {
		if(a < 3 && (b < 2 || a != 2)) {
			return nextStep(a, b)
		} else {
			let played = false
			while(!played) {
				let x = Math.floor(Math.random()*3)
				let y = Math.floor(Math.random()*3)
				if(campo[x][y] == 0) {
					drawO(x,y)
					turn = true
					campo[x][y] = 2
					played = true
					return 0
				}
			}
		}
	}
}

/**
* Controla la iteración sobre el tablero de la IA
**/
function nextStep(a, b) {
	b++
	if(b > 2) {
		a++
		b = 0
	}
	return iaPlays(a, b)
}

/**
* Crea una nueva partida
**/
function reset() {
	fin = false
	campo = [[0,0,0],
					 [0,0,0],
					 [0,0,0]]
	turn = true
	ctx.clearRect(0,0,canvas.width,canvas.height)
	drawTabletop()
	document.getElementById('back').click()
}

/**
* Crea una nueva partida contra IA
**/
function resetWithIA() {
	ia = true
	document.getElementById('newGameIA').classList.add('nodisplay')
	document.getElementById('newGameNoIA').classList.remove('nodisplay')
	reset()
}

/**
* Crea una nueva partida contra jugador
**/
function resetWithoutIA() {
	ia = false
	document.getElementById('newGameIA').classList.remove('nodisplay')
	document.getElementById('newGameNoIA').classList.add('nodisplay')
	reset()
}

/**
* Activa el sonido de fin de juego
**/
function activateSound() {
	activeSound = true
	document.getElementById('soundOff').classList.remove('nodisplay')
	document.getElementById('soundOn').classList.add('nodisplay')
}

/**
* Desactiva el sonido de fin de juego
**/
function deactivateSound() {
	activeSound = false
	document.getElementById('soundOn').classList.remove('nodisplay')
	document.getElementById('soundOff').classList.add('nodisplay')
}

drawTabletop()
canvas.addEventListener('click', set)
document.getElementById('newGame').addEventListener('click', reset)
document.getElementById('newGameIA').addEventListener('click', resetWithIA)
document.getElementById('newGameNoIA').addEventListener('click', resetWithoutIA)
document.getElementById('soundOn').addEventListener('click', activateSound)
document.getElementById('soundOff').addEventListener('click', deactivateSound)