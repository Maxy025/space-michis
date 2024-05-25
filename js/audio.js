Howler.volume(0.5)

const audio = {
    backgroundMusic : new Howl({
        src: './audio/Partida.mp3',
        loop: true
    }),
    shoot : new Howl({
        src: './audio/Shoot.mp3',
        volume: 0.3
    }),
    enemyShoot : new Howl({
        src: './audio/Enemy_shoot.wav',
        volume: 0.2
        
    }),
    explosion : new Howl({
        src: './audio/explode.wav'
    }),
    gameover : new Howl({
        src: './audio/GameOver.mp3'
    }),
    gameover_alt : new Howl({
        src: './audio/gameoverarcade.wav'
    }),
    seleccion : new Howl({
        src: './audio/select.mp3'
    }),
    seleccionOpcion : new Howl({
        src: './audio/select_option.wav'
    })
}
