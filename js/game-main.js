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

        c.fillStyle = 'red'

        c.fill()

        c.closePath()

    }

    update() {

        this.draw()

        this.posicion.x += this.velocidad.x

        this.posicion.y += this.velocidad.y

    }

}





class ProyectilEnemigo {

    constructor({posicion, velocidad}){

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

    constructor({posicion}) {

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

    update({velocidad}) {

        if (this.img) {

            this.draw()

            this.posicion.x += velocidad.x

            this.posicion.y += velocidad.y

        }

    }



    shoot(enemigoProyectil){

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

            this.velocidad.x = -this.velocidad.x

            this.velocidad.y = 30

        }

    }

}

const jugador = new Jugador() //Instanciamos al jugador

const proyectiles = []

const grids = []

const proyectilesEnemigo = []



const keys = {

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





function animate() {

    requestAnimationFrame(animate) //Este metodo nos permite dibujar continuamente el sprite del jugador

    c.fillStyle = 'black'

    c.fillRect(0, 0, canvas.width, canvas.height)

    jugador.update()//Lo dibujamos en el canvas



    proyectilesEnemigo.forEach(proyectilEnemigo => {

        proyectilEnemigo.update()

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

        })

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

        grids.push(new Grid())

        intervalos = Math.floor(Math.random() * 800 + 800)

        frames = 0

        console.log(intervalos)

    }



    frames++



}

animate()



addEventListener('keydown', ({ key }) => {

    console.log(key)

    switch (key) {

        case 'a':

            keys.a.presionado = true

            break

        case 'd':

            keys.d.presionado = true

            break

        case ' ':

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

    console.log(key)

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