window.onload = () => {

  let score = 0;
  let highscore = 0;
  localStorage.setItem("highscore", 0);
  if (score > parseInt(localStorage.getItem("highscore"))) {
    localStorage.setItem("highscore", score);
    console.log(highscore)
  }

  document.getElementById('button').onclick = () => {
    myGameArea.start();
    startScreen.style.display = 'none';
  }

  let startScreen = document.getElementById('content');
  let myBonus = [];
  let myObstacles = [];
  let lastObstacles = [];
  let requestedID = null;
  let count = 0;
  let animation = 0;
  let sourceX = 0


  // function startGame() {
  //     myGameArea.start();
  // }

  // ==============> IMAGENS <=============

  let img = new Image();
  img.src = './Images/bg2.png'
  let sprite = new Image();
  sprite.src = './Images/dribbble.png';
  let sprite2 = new Image();
  sprite2.src = './Images/dribble2.png'
  let sprite3 = new Image();
  sprite3.src = './Images/dribble3.png'
  let points = new Image();
  points.src = './Images/pancake.png';
  let lastObs = new Image();
  lastObs.src = './Images/ice-king.png';
  let gameOver = new Image();
  gameOver.src = './Images/game-ver.png';
  let character = new Image();
  character.src = './Images/sprite-adventure.png';

  let getCoinSound = new Audio();
  getCoinSound.src = './sounds/CLK3PART.mp3';

  let gameOverSound = new Audio();
  gameOverSound.src = './sounds/game-over-sound-effect.mp3';

  let gameMusic = new Audio();
  gameMusic.src = './sounds/MainTheme.wav';



  // ==============> GAME AREA <=============

  const myGameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    img: img,
    x: 0,
    y: 0,
    speed: -2,
    start: function () {
      this.canvas.width = 800;
      this.canvas.height = 400;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      updateGameArea();
      // gameMusic.play();
    },

    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(img, this.x, this.y, this.canvas.width, this.canvas.height);

    },
    stop: function () {
      // clearInterval(this.interval);
      window.cancelAnimationFrame(requestedId);
      setInterval(() => {
        this.context.drawImage(gameOver, 300, 70, 250, 297)();
      }, 700)

      setInterval(() => {
        window.location.reload();
      }, 1600)

    },
    score: function () {
      this.context.font = "18px serif";
      this.context.fillStyle = "black";
      this.context.fillText("Score: " + count, 350, 50);
    },

    move: function () {
      this.x += this.speed;
      this.x %= this.canvas.width;
    },

    draw: function () {
      this.context.drawImage(img, this.x, this.y, this.canvas.width, this.canvas.height);
      if (this.speed < 0) {
        this.context.drawImage(img, this.x + this.canvas.width, this.y, this.canvas.width, this.canvas.height);
      } else {
        this.context.drawImage(img, this.x - this.canvas.width, this.y, this.canvas.width, this.canvas.height);
      }
    }


  }



  // ==============> CONSTRUTOR <=============
  class Component {
    constructor(width, height, color, x, y) {
      this.width = width;
      this.height = height;
      this.color = color;
      this.x = x;
      this.y = y;
      this.speedX = 0;
      this.speedY = 0;
    }

    update(image) {
      var ctx = myGameArea.context;
      // ctx.fillRect(this.x, this.y, 40, 40);
      ctx.drawImage(image, this.x, this.y, this.width, this.height)
      // ctx.fillStyle = this.color;
      // ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    newPos() {
      this.x += this.speedX;
      if(this.y > 140) {
      this.y += this.speedY;
      } else {
        this.y = 141;
      }
    }

    left() {
      return this.x + 20;
    }
    right() {
      return this.x + this.width;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + this.height;
    }

    crashWith(bonus) {
      return !(this.bottom() === bonus.top() ||
        this.top() === bonus.bottom() ||
        this.right() === bonus.left() ||
        this.left() === bonus.right()
      );
    }

    crashWith(obstacles) {
      return !(this.bottom() < obstacles.top() ||
        this.top() > obstacles.bottom() ||
        this.right() < obstacles.left() ||
        this.left() > obstacles.right()
      );
    }

    draw() {
      var ctx = myGameArea.context;
        animation += 1
        if(animation > 13) {
          animation = 0
        }
  
        sourceX = animation * 64
        // ctx.drawImage(sprite, posição x de corte + 1, pos y de corte, tamanho total / personagem, altura do personagem, player.x, player.y, 90, 90);
        // ctx.fillRect(player.x + 25, player.y, 90, 70);
        ctx.drawImage(character, sourceX + 1, 6, 50, 47, player.x, player.y, 90, 70);
      }

  }

  class Obstacles extends Component {
    constructor(width, height, color, x, y) {
      super(width, height, color, x, y)
    }
    
    left() {
      return this.x;
    }
    right() {
      return this.x + 30;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + 60;
    }
  }


  class Bonus extends Component {
    constructor(width, height, color, x, y) {
      super(width, height, color, x, y)
    }
    
    left() {
      return this.x;
    }
    right() {
      return this.x + 60;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + 60;
    }
  }

  // ==============> PLAYER <=============
  let player = new Component(50, 50, "#FFC300", 0, 300);


  // ==============> ATUALIZAÇÃO DA TELA DO JOGO <=============
  function updateGameArea() {
    myGameArea.clear();
    myGameArea.draw();
    myGameArea.move();
    player.newPos();
    player.draw();
    // player.update(sprite);
    myGameArea.score();
    updateBonus();
    checkCrash();
    checkPoint();
    updateObstacles();
    checkCrashObs();
    // checkMenusPoint();
    requestedId = window.requestAnimationFrame(updateGameArea);
    checkGameOver();
  }

  //inicia o jogo
  // myGameArea.start();

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 38: // up arrow
        if (player.y < 140) {
          player.y = 140;
          player.speedY = 0;
        } else if (player.y > 140) {
          player.speedY = -3;
        }
        break;
      case 40: // down arrow
        if (player.y > 320) {
          player.y = 320;
          player.speedY= 0;
        } else if (player.y < 330) {
          player.speedY = +3;
        }
        break;
      case 37: // left arrow
        if (player.x < 0) {
          player.x = 0;
          player.speedX = 0;
        } else if (player.x > 0) {
          player.speedX = -3;
        }
        break;
      case 39: // right arrow
        if (player.x > 1300) {
          player.x = 1300;
          player.speedX = 0;
        } else if (player.x < 1300) {
          player.speedX = +3;
        }
        break;
    }
  };

  document.onkeyup = function (e) {
    player.speedX = 0;
    player.speedY = 0;
  };


  // ==============> BONUS <=============
  function updateBonus() {

    for (i = 0; i < myBonus.length; i++) {
      myBonus[i].x += -3;
      if (count >= 4 && count <= 10) {
        myBonus[i].x += -1;
      } else if (count >= 11 && count <= 16) {
        myBonus[i].x += -2;
      } else if (count >= 17 && count <= 22) {
        myBonus[i].x += -4;
      } else if (count >= 23 && count <= 28) {
        myBonus[i].x += -5;
      } else if (count >= 29 && count <= 34) {
        myBonus[i].x += -6;
      } else if (count >= 35 && count <= 40) {
        myBonus[i].x += -7;
      } else if (count >= 41 && count <= 46) {
        myBonus[i].x += -8;
      } else if (count >= 47 && count <= 52) {
        myBonus[i].x += -9;
      }
      myBonus[i].update(points);
    }
    myGameArea.frames += 1;
    if (myGameArea.frames % 100 === 0) {
      let minHeight = 180;
      let x = myGameArea.canvas.width;
      let maxHeight = 350;
      let height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight);
      myBonus.push(new Bonus(40, 40, "green", x, height));
      
      

    }

  }

  //verifica se houve colisão e remove o quadrado
  function checkCrash() {
    myBonus.some(function (bonus) {
      let crash = player.crashWith(bonus);
      if (crash) {
        bonus.width = 0;
        bonus.height = 0;
        getCoinSound.play();
      }
    });
  }

  //adiciona um ponto se houve colisão
  function checkPoint() {
    myBonus.forEach((obs, idx) => {
      if (obs.width === 0 && obs.height === 0) {
        myBonus.splice(idx, 1);
        count += 1;
      }
    })
  }



  // ==============> OBSTACULOS GAME OVER <=============
  function updateObstacles() {

    for (i = 0; i < lastObstacles.length; i++) {
      lastObstacles[i].x += -3;
      if (count >= 4 && count <= 10) {
        lastObstacles[i].x += -1;
      } else if (count >= 11 && count <= 16) {
        lastObstacles[i].x += -2;
      } else if (count >= 16 && count <= 22) {
        lastObstacles[i].x += -4;
      } else if (count >= 16 && count <= 28) {
        lastObstacles[i].x += -5;
      } else if (count >= 16 && count <= 34) {
        lastObstacles[i].x += -6;
      } else if (count >= 16 && count <= 40) {
        lastObstacles[i].x += -7;
      } else if (count >= 16 && count <= 46) {
        lastObstacles[i].x += -8;
      } else if (count >= 47 && count <= 52) {
        lastObstacles[i].x += -9;
      }
      lastObstacles[i].update(lastObs);
    }
    if (myGameArea.frames % 80 === 0) {
      let minHeight = 180;
      let x = myGameArea.canvas.width;
      let maxHeight = 330;
      let height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight);
      lastObstacles.push(new Obstacles(60, 60, "red", x, height));
      
    }
  }
  // ------ perda de pontos -------
  //verifica se houve colisão e remove o quadrado
  function checkCrashObs() {
    lastObstacles.some(function (obstacles) {
      let crash = player.crashWith(obstacles);
      if (crash) {
        obstacles.width = 0;
        obstacles.height = 0;
      }
    });
  }

  //  acaba o jogo se houver colisão
  function checkGameOver() {
    lastObstacles.forEach(obs => {
      if (obs.width === 0 && obs.height === 0) {
        gameOverSound.play();
        myGameArea.stop();
      }

       // //  remove um ponto se houve colisão
  //  function checkMenusPoint() {
  //   myObstacles.forEach((obs, idx) => { 
  //     if(obs.width === 0 && obs.height === 0) {
  //       myObstacles.splice(idx, 1); 
  //       count -= 1;
  //      }
  //    })
  //  }

    })

  }


}