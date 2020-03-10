

window.onload = () => {
  let myBonus = [];
  let myObstacles = [];
  let lastObstacles = [];
  let requestedID = null;
  let count = 0;
  let animation = 0;
  
  
  // function startGame() {
  //     myGameArea.start();
  // }

  // ==============> IMAGENS <=============
  
  let img = new Image();
  img.src = './Images/bg.jpg'
  let sprite = new Image();
  sprite.src = './Images/sprite-op1.png';
  let sprite2 = new Image();
  sprite2.src = './Images/sprite-op2.png'
  let points = new Image();
  points.src = './Images/bonus.png';
  let obst = new Image();
  obst.src = './Images/box--v1.png';
  let lastObs = new Image();
  lastObs.src = './Images/119505.png';
  

  
  // ==============> GAME AREA <=============
  
  const myGameArea = {
      canvas: document.createElement("canvas"), 
      frames: 0,
      img: img,
      x: 0,
      y: 0,
      speed: -2,
      start: function() {
        this.canvas.width = 1410;
        this.canvas.height = 620;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        updateGameArea();
      },
      
      clear: function() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.context.drawImage(img, this.x, this.y, this.canvas.width, this.canvas.height);
        
        },
      stop: function() {
          // clearInterval(this.interval);
          window.cancelAnimationFrame(requestedId);
        },
        score: function() {
          this.context.font = "18px serif";
          this.context.fillStyle = "black";
          this.context.fillText("Score: " + count, 350, 50);
        },
  
        move: function() {
              this.x += this.speed;
              this.x %= this.canvas.width;
            },
              
        draw: function() {
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
        ctx.drawImage(image, this.x, this.y, this.width, this.height)
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x, this.y, this.width, this.height);
      }

      newPos() {
          this.x += this.speedX;
          this.y += this.speedY;
        }
  
        left() {
          return this.x;
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
      return  !(this.bottom() === bonus.top() ||
      this.top() === bonus.bottom() ||
      this.right() === bonus.left() ||
      this.left() === bonus.right()
    );
      }
       
      crashWith(obstacles) {
        return  !(this.bottom() < obstacles.top() ||
        this.top() > obstacles.bottom() ||
        this.right() < obstacles.left() ||
        this.left() > obstacles.right()
      );
        }
        draw () {
          var ctx = myGameArea.context;
          if (animation <= 10) {
          ctx.drawImage(sprite, player.x, player.y, 70, 150);
          animation += 1
          }
        else if (animation <= 19) {
          ctx.drawImage(sprite2, player.x, player.y, 70, 150);
          animation += 1
        }
   else if (animation > 17) { 
  animation = 0; 
  }
    } 
  }

     // ==============> PLAYER <=============
     let player = new Component(70, 150, "#FFC300", 0, 300);
    
  
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
      checkMenusPoint();
    requestedId = window.requestAnimationFrame(updateGameArea);
    checkGameOver();
    }
  
    //inicia o jogo
    myGameArea.start();
  
    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 38: // up arrow
        if(player.y < 180) {
          player.y = 180;
          player.speedY = 0;
        } else if (player.y > 180) {
        player.speedY -= 2;
        }
        break;
        case 40: // down arrow
        if(player.y > 500) {
          player.y = 500;
          player.speedY = 0;
        } else if (player.y < 500) {
        player.speedY += 2;
        }
        break;
        case 37: // left arrow
        if(player.x < 0) {
          player.x = 0;
          player.speedX = 0;
        } else if (player.x > 0){
        player.speedX -= 2;
        }
          break;
        case 39: // right arrow
        if(player.x > 1300) {
          player.x = 1300;
          player.speedX = 0;
        } else if (player.x < 1300) {
          player.speedX += 2;
        }
          break;
      }
    };
  
    document.onkeyup = function(e) {
      player.speedX = 0;
      player.speedY = 0;
    };
  
  // ==============> BONUS <=============
     function updateBonus() {

      for (i = 0; i < myBonus.length; i++) {
        myBonus[i].x += -2;
        myBonus[i].update(points);
      }
    myGameArea.frames += 1;
    if (myGameArea.frames % 200 === 0) {
      let minHeight =200;
      let x = myGameArea.canvas.width;
      let maxHeight = 550;
      let height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight);
        myBonus.push(new Component(40, 40, "green", 1400, Math.floor(
          Math.random() * (myGameArea.canvas.height - 400)+ 400)))        
       
    }
  }

  //verifica se houve colisão e remove o quadrado
  function checkCrash() {
    console.log(myBonus);
    myBonus.some(function(bonus) {
     let crash = player.crashWith(bonus);
     if (crash) {
      bonus.width = 0;
      bonus.height = 0;
     }
    });
   }
  
   //adiciona um ponto se houve colisão
   function checkPoint() {
    myBonus.forEach((obs, idx) => {
       if(obs.width === 0 && obs.height === 0) {
        myBonus.splice(idx, 1); 
        count += 1;
       }
     })
   }
  


  // ==============> OBSTACULOS <=============
  function updateObstacles() {
  
  
    for (i = 0; i < myObstacles.length; i++) {
      myObstacles[i].x += -2;
      myObstacles[i].update(obs);
    }
  // myGameArea.frames += 2;
  if (myGameArea.frames % 80 === 0) {
    let minHeight = 220;
    let x = myGameArea.canvas.width;
    let maxHeight = 550;
    let height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight);
      myObstacles.push(new Component(100, 100, "red", x, height));
   }
  }
  //verifica se houve colisão e remove o quadrado
  function checkCrashObs() {
    myObstacles.some(function(obstacles) {
     let crash = player.crashWith(obstacles);
     if (crash) {
      obstacles.width = 0;
      obstacles.height = 0;
     }
    });
   }
  
  //  remove um ponto se houve colisão
   function checkMenusPoint() {
    myObstacles.forEach((obs, idx) => { 
      if(obs.width === 0 && obs.height === 0) {
        myObstacles.splice(idx, 1); 
        count -= 1;
       }
     })
   }

  
// ==============> OBSTACULOS GAME OVER <=============
function updateObstacles() {
  
  for (i = 0; i < lastObstacles.length; i++) {
    lastObstacles[i].x += -2;
    lastObstacles[i].update(lastObs);
  }
if (myGameArea.frames % 150 === 0) {
  let minHeight = 220;
  let x = myGameArea.canvas.width;
  let maxHeight = 550;
  let height = Math.floor(
    Math.random() * (maxHeight - minHeight + 1) + minHeight);
    lastObstacles.push(new Component(80, 80, "red", x, height));
 }
}
// ------ perda de pontos -------
//verifica se houve colisão e remove o quadrado
function checkCrashObs() {
  lastObstacles.some(function(obstacles) {
   let crash = player.crashWith(obstacles);
   if (crash) {
    obstacles.width = 0;
    obstacles.height = 0;
   }
  });
 }

//  remove um ponto se houve colisão
 function checkMenusPoint() {
  lastObstacles.forEach((obs, idx) => { 
    if(obs.width === 0 && obs.height === 0) {
      lastObstacles.splice(idx, 1); 
      count -= 1;
     }
   })
 }

  
  // ==============> GAME OVER <=============
  
   function checkGameOver() {
  if (count < 0) {
    myGameArea.stop();
  }
    }
  

  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  


