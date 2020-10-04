const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

//Creamos una Unidad
const box = 38;

//Velocidad ms (milisegundos) de la pantalla
var vel = 130;

//Tamaño del canvas ancho alto
var pantalla = 1024
cvs.width = cvs.height = pantalla;


//Cargamos imagenes
//const fondo = new Image();
//fondo.src = "Fotos/back.jpg";
const imgfood = new Image();
imgfood.src = "Fotos/cuy.png";

//Cargamos Audio
const comidamp3 = new Audio();
const muerte = new Audio();
comidamp3.src = "Audio/CUY.mp3";
muerte.src = "Audio/MK_dead.mp3";

//Creamos la Serpiente
let snake = [];
snake[0] = {
    x: 13 * box,
    y: 12 * box
}

//Creamos el metodo Comida
function comida() {
    return {
        x: Math.floor(Math.random() * 26) * box,
        y: Math.floor(Math.random() * 26) * box
    };
}
//Creamos la variable comida para inicializarle
let food = comida();

//Creamos eL puntaje
let score = 0;

//Variable del fin del juego
var end = false;

//Controlar la serpiente
///Es el unico metodo q se repite porq se acciona cuando se detecta un evento del teclado
let d;
document.addEventListener("keydown", direccion);

function direccion(event) {
    let key = event.keyCode;
    //console.log(key);
    if (key == 65 && d != "RIGHT") {
        d = "LEFT";
    } else if (key == 87 && d != "DOWN") {
        d = "UP";
    } else if (key == 68 && d != "LEFT") {
        d = "RIGHT";
    } else if (key == 83 && d != "UP") {
        d = "DOWN";
    }
}

//Choque con la pared o el cuerpo
function choque(head, cuerpo) {
    for (let i = 0; i < cuerpo.length; i++) {
        if (head.x == cuerpo[i].x && head.y == cuerpo[i].y) {
            return true;
        }
    }
    return false;
}

function choque_wall(head) {
    if (head.x == box * 27 || head.x == -box || head.y == -box || head.y == box * 27) {
        return true;
    }
    return false;
}



//Funcion dibujar el canvas
function dibujar() {
    //Fondo
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, pantalla, pantalla);
    ctx.strokeStyle = "#7AFF33";
    ctx.strokeRect(0, 0, pantalla, pantalla);
    //Para dibujar una Imagen -> ctx.drawImage(fondo, 0, 0);
    //Dibuja la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#7AFF33" : "#131212";
        ctx.lineWidth = 6;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "#7AFF33";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    //Dibuja al cuy
    ctx.drawImage(imgfood, food.x, food.y, box * 1.3, box * 1.3);

    //Posicion antigua de la cabeza
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //Direcciones
    if (d == "LEFT") {
        snakeX -= box;
    }
    if (d == "UP") {
        snakeY -= box;
    }
    if (d == "RIGHT") {
        snakeX += box;
    }
    if (d == "DOWN") {
        snakeY += box;
    }

    //Comer
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = comida();
        comidamp3.play();
    } else {
        //Quitamos la cola solo si no come
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }
    console.log(newHead);

    //Game Over
    //Se pone aqui antes de remplazar la nueva cabeza
    if (choque(newHead, snake) || choque_wall(newHead)) {
        muerte.play();
        // para la forma 2 ->clearInterval(game);
        ctx.fillStyle = "Red";
        ctx.fillText("GAME OVER Press F5", 8 * box, 13 * box);
        end = true;
    }

    //Se agrega la nueva Cabeza 
    snake.unshift(newHead);


    //console.log(snake.length);
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, box, 1.6 * box);

}
//Forma 1 se crea una funcion q se vuelve a llamar cada 130milisegundos

function interval() {
    let intervaloT = vel;
    requestAnimationFrame(dibujar)
    if (score >= 5) {
        intervaloT = intervaloT - (score * 2);
    }
    if (intervaloT <= 60) {
        intervaloT = 60;
    }
    console.log(intervaloT);
    let game = setTimeout(interval, intervaloT)
    if (end) {
        clearTimeout(game);
    }
}

interval();
//Forma2
//Llamamos a la funcion dibujar cada 130 ms
//let game = setInterval(dibujar, vel);