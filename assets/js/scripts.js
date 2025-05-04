// Initialisation
darkMode = false;
$(document).ready(function () {
  initTheme();
  fillSkillBars();
  initSkillBars();
  printBtnSetup();
  initPatternAnimation();
});

// Initialisation du thème
function initTheme() {
  var theme = localStorage.getItem("theme");

  if (theme === "dark") {
    $("body").addClass("dark-mode");
    darkMode = true;
  } else {
    $("body").addClass("light-mode");
    darkMode = false;
  }

  $("#theme-toggle-btn").click(function () {
    $("body").toggleClass("dark-mode");
    darkMode = !darkMode;
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  });
}

// Remplir tout de suite les barres de compétences (pour l'impression)
function fillSkillBars() {
  var bars = $(".skill-item");

  for (var i = 0; i < bars.length; i++) {
    var value = $(bars[i]).data("value");
    var bar = $(bars[i]).find(".skill-bar");
    bar.css("width", value * 100 + "%");
  }
}

// Animation des barres de compétences
function initSkillBars() {
  // Eviter de réinitialiser en mode impression
  if (window.matchMedia && window.matchMedia("print").matches) {
    return;
  }

  var bars = $(".skill-item");

  // Réinitialiser d'abord pour l'animation
  for (var i = 0; i < bars.length; i++) {
    $(bars[i]).find(".skill-bar").css("width", "0");
  }

  // Animer après un court délai
  for (var i = 0; i < bars.length; i++) {
    var value = $(bars[i]).data("value");
    var bar = $(bars[i]).find(".skill-bar");

    setTimeout(
      (function (bar, value) {
        return function () {
          bar.css("width", value * 100 + "%");
        };
      })(bar, value),
      50 + i * 30,
    );
  }
}

// Bouton pour imprimer le CV
function printBtnSetup() {
  $("#print-btn").click(function () {
    // Remplir les barres de compétences
    fillSkillBars();

    // Attente pour rendu fini
    setTimeout(function () {
      window.print();
    }, 100);
  });

  // Réinitialiser après impression
  window.onafterprint = function () {
    // remettre l'animation si pas en mode impression
    if (!window.matchMedia("print").matches) {
      initSkillBars();
    }
  };
}

// Animation en fond avec pattern (quelle misère quelle soufrance)
function initPatternAnimation() {
  // Récupérer le canvas
  const canvas = document.getElementById("background-canvas");

  // Initialiser le contexte de dessin
  const ctx = canvas.getContext("2d");
  const symbols = ["</>"];

  // Tableau pour stocker lese patterns animés
  let elements = [];

  // Redimensionner le canvas pour qu'il corresponde à la taille de la fenêtre
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Initialiser avec la bonne taille
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Fonction pour créer une pattern à ajouter
  function createElement() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const size = 10 + Math.random() * 20;
    const opacity = 0.03 + Math.random();

    const speedX = (Math.random() - 0.5) * 0.5;
    const speedY = (Math.random() - 0.5) * 0.5;

    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const lifespan = 150 + Math.random() * 200;

    return {
      x,
      y,
      size,
      opacity,
      speedX,
      speedY,
      symbol,
      life: 0,
      lifespan,
      fadeIn: 50,
      fadeOut: 50,
    };
  }

  // Créer lese patterns initiaux
  for (let i = 0; i < 30; i++) {
    elements.push(createElement());
    // Etaler la durée de vie pour eviter le surchargement
    elements[i].life = Math.random() * elements[i].lifespan;
  }

  // Ajouter lese patterns
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDarkMode = document.body.classList.contains("dark-mode");
    const r = 44,
      g = 82,
      b = 130;

    // Mettre à jour et dessiner chaque pattern
    elements.forEach((el, index) => {
      el.life++;

      // Calculer l'opacité en fonction du cycle de vie
      let currentOpacity = el.opacity;
      if (el.life < el.fadeIn) {
        currentOpacity = (el.life / el.fadeIn) * el.opacity;
      } else if (el.life > el.lifespan - el.fadeOut) {
        currentOpacity = ((el.lifespan - el.life) / el.fadeOut) * el.opacity;
      }

      // Déplacer le pattern
      el.x += el.speedX;
      el.y += el.speedY;

      // Dessiner le pattern
      ctx.font = `${el.size}px monospace`;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
      ctx.fillText(el.symbol, el.x, el.y);

      // Remplacer le pattern s'il est arrivé à la fin de sa vie
      if (el.life >= el.lifespan) {
        elements[index] = createElement();
      }
    });

    // Continuer l'animation
    requestAnimationFrame(update);
  }

  // Démarrer l'animation
  update();
}
