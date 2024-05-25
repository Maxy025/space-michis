var btnOpenPopup = document.getElementById('open-popup');
var popupMenu = document.getElementById('popup-menu');

var btnOpenControles = document.getElementById('open-controles');
var popupMenuControles = document.getElementById('popup-controles');


/* Menu de Scores */

// Función para abrir el menú emergente
async function abrirMenuScore() {
    popupMenu.style.display = 'block';
    btnOpenControles.style.display = 'none';
    audio.seleccionOpcion.play()
    const response = await fetch('http://localhost:3000/top-scores?top=10', {
      method: 'GET',
    });
        
    popupMenu.querySelectorAll('p').forEach(paragraph => {
      paragraph.remove();
    });

    if (response.ok) {
      const data = await response.json();
      data.scores.forEach((score, index) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `${index + 1}. ${score.Jugador.user} ------------------ ${score.puntaje}`;
        paragraph.classList.add('score-entry');
        popupMenu.appendChild(paragraph);
      });    
    }

    
  }
  
  // Función para cerrar el menú emergente
  function cerrarMenuScore() {
    popupMenu.style.display = 'none';
    btnOpenControles.style.display = 'flex';
    audio.seleccionOpcion.play()

  }

  // Agregar evento de clic al botón para abrir el menú emergente
  btnOpenPopup.addEventListener('click', abrirMenuScore);


  
/* Menu de controles */

  // Función para abrir el menú emergente
function abrirMenuControles() {
  popupMenuControles.style.display = 'flex';
  audio.seleccionOpcion.play()
}

// Función para cerrar el menú emergente
function cerrarMenuControles() {
  popupMenuControles.style.display = 'none';
  audio.seleccionOpcion.play()

}

// Agregar evento de clic al botón para abrir el menú emergente
btnOpenControles.addEventListener('click', abrirMenuControles);

