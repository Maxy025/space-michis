var btnOpenPopup = document.getElementById('open-popup');
var popupMenu = document.getElementById('popup-menu');

var btnOpenControles = document.getElementById('open-controles');
var popupMenuControles = document.getElementById('popup-controles');


/* Menu de Scores */

// Función para abrir el menú emergente
async function abrirMenuScore() {
    popupMenu.style.display = 'block';
    const response = await fetch('http://localhost:3000/top-scores?top=5', {
      method: 'GET',
    });
        
    popupMenu.querySelectorAll('p').forEach(paragraph => {
      paragraph.remove();
    });

    if (response.ok) {
      const data = await response.json();
      data.scores.forEach(score => {
        const paragraph = document.createElement('p');
        paragraph.textContent = `Jugador: ${score.Jugador.user}, Puntaje: ${score.puntaje}`;
        popupMenu.appendChild(paragraph);
      });    
    }

    
  }
  
  // Función para cerrar el menú emergente
  function cerrarMenuScore() {
    popupMenu.style.display = 'none';
  }

  // Agregar evento de clic al botón para abrir el menú emergente
  btnOpenPopup.addEventListener('click', abrirMenuScore);


  
/* Menu de controles */

  // Función para abrir el menú emergente
function abrirMenuControles() {
  popupMenuControles.style.display = 'block';
}

// Función para cerrar el menú emergente
function cerrarMenuControles() {
  popupMenuControles.style.display = 'none';
}

// Agregar evento de clic al botón para abrir el menú emergente
btnOpenControles.addEventListener('click', abrirMenuControles);