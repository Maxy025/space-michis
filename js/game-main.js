const scoreEl = document.querySelector('#scoreEl')
const gameoverText = document.querySelector('#gameover_text')



const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //Regresa el contexto del canvas, en este caso sera un contexto en 2d o en dos dimensiones
canvas.width = 1000;
canvas.height = 500;

class Jugador { //Clase que contendra todos los atributos del jugador
    constructor() {
        this.velocidad = {
            x: 0,
            y: 0
        }

        this.rotacion = 0
        this.opacidad = 1

        const img = new Image() //
        img.src = './img/quatro.png'
        img.onload = () => { //Cuando la imagen termina de cargar, cargara las propiedades de la imagen
            const escala = 0.03
            this.img = img
            this.width = img.width * escala
            this.height = img.height * escala
            this.posicion = { //Posicion en donde estara ubicado en el canvas
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height
            }
        }
    }

    draw() {

        //c.fillStyle = 'red' //Rellena el color del cuadrado
        //c.fillRect(this.posicion.x, this.posicion.y, this.width, this.height) //Metodo para dibujar el cuadrado en el canvas
        c.save()
        c.globalAlpha = this.opacidad
        c.translate(
            jugador.posicion.x + jugador.width / 2,
            jugador.posicion.y + jugador.height / 2)
        c.rotate(this.rotacion)
        c.translate(
            -jugador.posicion.x - jugador.width / 2,
            -jugador.posicion.y - jugador.height / 2)
        c.drawImage(
            this.img,
            this.posicion.x,
            this.posicion.y,
            this.width,
            this.height) //Dibujamos la imagen en la posicion del jugador
        c.restore()
    }

    update() {
        if (this.img) {
            this.draw()
            this.posicion.x += this.velocidad.x
        }
    }
}

class Proyectil {
    constructor({ posicion, velocidad }) {
        this.posicion = posicion
        this.velocidad = velocidad
        this.radius = 4


    }
    draw() {
        c.beginPath()
        c.arc(this.posicion.x, this.posicion.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'blue'
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.posicion.x += this.velocidad.x
        this.posicion.y += this.velocidad.y
    }
}

class Particulas {
    constructor({ posicion, velocidad, radio, color, desvanecido }) {
        this.posicion = posicion
        this.velocidad = velocidad
        this.radio = radio
        this.color = color
        this.opacidad = 1
        this.desvanecido = desvanecido
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.posicion.x, this.posicion.y, this.radio, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
        this.draw()
        this.posicion.x += this.velocidad.x
        this.posicion.y += this.velocidad.y
        if (this.desvanecido) this.opacidad -= 0.01
    }
}

class ProyectilEnemigo {
    constructor({ posicion, velocidad }) {
        this.posicion = posicion
        this.velocidad = velocidad
        this.width = 3
        this.height = 10
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.posicion.x, this.posicion.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.posicion.x += this.velocidad.x
        this.posicion.y += this.velocidad.y
    }
}

class Enemigo {
    constructor({ posicion }) {
        this.velocidad = {
            x: 0,
            y: 0
        }
        const img = new Image()
        img.src = 'img/badmouse.png'
        img.onload = () => {
            const scale = .03
            this.img = img
            this.width = img.width * scale
            this.height = img.height * scale
            this.posicion = {
                x: posicion.x,
                y: posicion.y
            }
        }
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(
            this.img,
            this.posicion.x,
            this.posicion.y,
            this.width,
            this.height
        )

    }

    update({ velocidad }) {
        if (this.img) {
            this.draw()
            this.posicion.x += velocidad.x
            this.posicion.y += velocidad.y
        }
    }



    shoot(enemigoProyectil) {
        enemigoProyectil.push(new ProyectilEnemigo({
            posicion: {
                x: this.posicion.x + this.width / 2,
                y: this.posicion.y + this.height
            },
            velocidad: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.posicion = {
            x: 0,
            y: 0
        }
        this.velocidad = {
            x: .8,
            y: 0
        }
        this.enemigos = []
        const columnas = Math.floor(Math.random() * 10 + 5)
        const filas = Math.floor(Math.random() * 5 + 2)
        this.width = columnas * 30

        for (let x = 0; x < columnas; x++) {
            for (let y = 0; y < filas; y++) {
                this.enemigos.push(
                    new Enemigo({
                        posicion: {
                            x: x * 30,
                            y: y * 30
                        }
                    }))
            }
        }
    }

    update() {
        this.posicion.x += this.velocidad.x
        this.posicion.y += this.velocidad.y
        this.velocidad.y = 0
        if (this.posicion.x + this.width >= canvas.width || this.
            posicion.x <= 0) {
            this.velocidad.x = -this.velocidad.x * 1.25
            this.velocidad.y = 30
        }
    }
}

let jugador = new Jugador() //Instanciamos al jugador
let proyectiles = []
let grids = []
let proyectilesEnemigo = []
let particulas = []
let inputElement = null
let inputValue = null

let keys = {
    a: {
        presionado: false
    },
    d: {
        presionado: false
    },
    space: {
        presionado: false
    }
}

let frames = 0
let intervalos = Math.floor(Math.random() * 800 + 800)
let partida = {
    fin: false,
    activo: true
}
let puntuacion = 0

function inicializar(){
    jugador = new Jugador() //Instanciamos al jugador
    proyectiles = []
    grids = []
    proyectilesEnemigo = []
    particulas = []
    inputElement = null
    
    keys = {
        a: {
            presionado: false
        },
        d: {
            presionado: false
        },
        space: {
            presionado: false
        }
    }
    
    frames = 0
    intervalos = Math.floor(Math.random() * 800 + 800)
    partida = {
        fin: false,
        activo: true
    }
    puntuacion = 0

    document.querySelector('#finalScore').innerHTML = puntuacion
    document.querySelector('#scoreEl').innerHTML = puntuacion


    for (let i = 0; i < 100; i++) {
        particulas.push(new Particulas({
            posicion: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocidad: {
                x: 0,
                y: 0.3
            },
            radio: Math.random() * 2,
            color: 'white',
        }))
    }
    
}



function creacionParticulas({ object, color, desvanecido }) {
    for (let i = 0; i < 15; i++) {
        particulas.push(new Particulas({
            posicion: {
                x: object.posicion.x + object.width / 2,
                y: object.posicion.y + object.height / 2
            },
            velocidad: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radio: Math.random() * 3,
            color: color || '#48CAE4',
            desvanecido
        }))
    }
}

function colisionRectangular({rectangulo1, rectangulo2}) {
    return (
        rectangulo1.posicion.y + rectangulo1.height >=
        rectangulo2.posicion.y && rectangulo1.posicion.x + rectangulo1.width >=
        rectangulo2.posicion.x && rectangulo1.posicion.x <= rectangulo2.posicion.x +
        rectangulo2.width
    )
}

async function guardarDatosPartida(user, score) {
    console.log(JSON.stringify({user, score}))
  

    const response = await fetch('http://localhost:3000/match', {
      method: 'POST',   
      headers: {    
      'Accept': 'application/json',
      'Content-Type': 'application/json'                  
      },
      body: JSON.stringify({user, score})
    });

    return response
}

async function terminarJuego() {
    console.log("You lose")

    //Cuando el jugador desaparece
    setTimeout(() => {
        jugador.opacidad = 0
        partida.fin = true
    }, 0)

    //El juego se detiene
    setTimeout(() => {
        partida.activo = false
        document.querySelector('#pantallaRestart').style.display = 'flex'
        document.querySelector('#finalScore').innerHTML = puntuacion
        document.querySelector('#nomUsuario').innerHTML = inputValue
        
    }, 2000)

    creacionParticulas({
        object: jugador,
        color: 'white',
        desvanecido: true
    })

    const response = await guardarDatosPartida(inputValue, puntuacion)

    console.log("hola mundo")

    console.log(response)
}

let timerSpawn = 500

function animate() {
    if (!partida.activo) return
    requestAnimationFrame(animate) //Este metodo nos permite dibujar continuamente el sprite del jugador
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    jugador.update()//Lo dibujamos en el canvas

    particulas.forEach((particula, i) => {
        if (particula.posicion.y - particula.radio >= canvas.height) {
            particula.posicion.x = Math.random() * canvas.width
            particula.posicion.y = particula.radio
        }
        if (particula.opacidad <= 0) {
            setTimeout(() => {
                particulas.splice(i, 1)
            }, 0)
        } else {
            particula.update()
        }
    })

    proyectilesEnemigo.forEach((proyectilEnemigo, index) => {
        if (proyectilEnemigo.posicion.y + proyectilEnemigo.height >=
            canvas.height) {
            setTimeout(() => {

                proyectilesEnemigo.splice(index, 1)

            }, 0)
        } else proyectilEnemigo.update()

        //El proyectil enemigo golpea al jugador
        if (
            colisionRectangular({
                rectangulo1: proyectilEnemigo,
                rectangulo2: jugador
            })
        ) {

            proyectilesEnemigo.splice(index, 1)
            terminarJuego()


        }
    })


    proyectiles.forEach((proyectil, index) => {
        if (proyectil.posicion.x + proyectil.radius <= 0) {
            setTimeout(() => {
                proyectiles.splice(index, 1)
            }, 0)
        } else {
            proyectil.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

        //Spawn proyectiles enemigos
        if (frames % 100 === 0 && grid.enemigos.length > 0) {
            grid.enemigos[Math.floor(Math.random() * grid.enemigos.length)].shoot(proyectilesEnemigo)
        }

        grid.enemigos.forEach((enemigo, i) => {
            enemigo.update({ velocidad: grid.velocidad })
            //Projectil impacta enemigo
            proyectiles.forEach((proyectil, j) => {
                if (
                    proyectil.posicion.y - proyectil.radius <=
                    enemigo.posicion.y + enemigo.height &&
                    proyectil.posicion.x + proyectil.radius >=
                    enemigo.posicion.x &&
                    proyectil.posicion.x - proyectil.radius <=
                    enemigo.posicion.x + enemigo.width &&
                    proyectil.posicion.y + proyectil.radius >=
                    enemigo.posicion.y

                ) {
                    setTimeout(() => {
                        const enemigoEncontrado = grid.enemigos.find(enemigo2 =>
                            enemigo2 === enemigo
                        )
                        const proyectilEncontrado = proyectiles.find(projectil2 =>
                            projectil2 === proyectil
                        )

                        //Remover enemigos y proyectiles
                        if (enemigoEncontrado && proyectilEncontrado) {
                            puntuacion += 100
                            scoreEl.innerHTML = puntuacion
                            creacionParticulas({
                                object: enemigo,
                                desvanecido: true
                            })
                            grid.enemigos.splice(i, 1)
                            proyectiles.splice(j, 1)
                            if (grid.enemigos.length > 0) {
                                const primerEnemigo = grid.enemigos[0]
                                const ultimoEnemigo = grid.enemigos[grid.
                                    enemigos.length - 1]
                                grid.width = ultimoEnemigo.posicion.x -
                                    primerEnemigo.posicion.x + ultimoEnemigo.width
                                grid.posicion.x = primerEnemigo.posicion.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
            //Elimina al jugador si un enemigo toca al jugador
            if (
                    colisionRectangular({
                        rectangulo1: enemigo,
                        rectangulo2: jugador
                    }) && !partida.fin
            ) 
                terminarJuego()

        })// termina el loop del grid.enemigo
    })

    if (keys.a.presionado && jugador.posicion.x >= 0) {
        jugador.velocidad.x = -3
        jugador.rotacion = -0.15
    } else if (keys.d.presionado &&
        jugador.posicion.x + jugador.width <= canvas.width) {
        jugador.velocidad.x = 3
        jugador.rotacion = 0.15
    } else {
        jugador.velocidad.x = 0
        jugador.rotacion = 0
    }





    //Spawn enemigos
    if (frames % intervalos === 0) {
        timerSpawn = timerSpawn < 0 ? 100 : timerSpawn
        grids.push(new Grid())
        intervalos = Math.floor(Math.random() * 500 + timerSpawn)
        frames = 0
        timerSpawn -= 100
    }
    frames++
}
function obtenerUsuario() {
    // Obtiene el elemento de input por su ID
    inputElement = document.getElementById("inputUsuario");
    // Obtiene el valor del input
    inputValue = inputElement.value;
    // Muestra el valor en la consola
    console.log("El valor del input es: " + inputValue);

}

document.querySelector('#botonStart').addEventListener('click', () => {
    document.querySelector('#pantallaInicio').style.display = 'none'
    document.querySelector('#cuadroUsuario').style.display = 'block'
    inicializar()
})


document.querySelector('#botonUsuario').addEventListener('click', () => {
    document.querySelector('#cuadroUsuario').style.display = 'none'
    document.querySelector('#contenedorScore').style.display = 'block'
    animate()
})


document.querySelector('#botonRestart').addEventListener('click', () => {
    document.querySelector('#pantallaRestart').style.display = 'none'
    inicializar()
    animate()
})

document.querySelector('#botonSalir').addEventListener('click', () => {
    document.querySelector('#pantallaInicio').style.display = 'flex'
    document.querySelector('#contenedorScore').style.display = 'none'
    document.querySelector('#pantallaRestart').style.display = 'none'
})






addEventListener('keydown', ({ key }) => {
    if (partida.fin) return

    switch (key) {
        case 'a':
            keys.a.presionado = true
            break
        case 'd':
            keys.d.presionado = true
            break
        case ' ':
            if (keys.space.presionado) return
            proyectiles.push(new Proyectil({
                posicion: {
                    x: jugador.posicion.x + jugador.width / 2,
                    y: jugador.posicion.y
                },
                velocidad: {
                    x: 0,
                    y: -5
                }
            }))
            break
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.presionado = false
            break
        case 'd':
            keys.d.presionado = false
            break
        case ' ':
            break
    }
})



