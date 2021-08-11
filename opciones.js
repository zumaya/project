// Seleccionar el elemento de inicio
const opciones = document.querySelector(".opciones");
// Seleccionar botones
const CompBtn = document.querySelector(".computadora");
const AmigBtn = document.querySelector(".amigo");
const xBtn = document.querySelector(".x");
const oBtn = document.querySelector(".o");
const InsBtn = document.querySelector(".inst");
const jugarBtn = document.querySelector(".jugar");

//Elementos de fin de juego
const gameOverElement = document.querySelector(".gameover");

//Guardamos el oponente
const jugador = new Object;
let OPONENTE;

oBtn.addEventListener("click",function() {
    jugador.man = "O";
    jugador.computadora = "X";
    jugador.amigo = "X";
    switchActive(xBtn,oBtn);
});

xBtn.addEventListener("click",function() {
    jugador.man = "X";
    jugador.computadora = "O";
    jugador.amigo = "O";
    switchActive(oBtn,xBtn);  
});

CompBtn.addEventListener("click",function(){
    OPONENTE = "computadora";
    switchActive (AmigBtn,CompBtn);
});

AmigBtn.addEventListener("click",function() {
    OPONENTE = "amigo";
    switchActive(CompBtn,AmigBtn);
});

InsBtn.addEventListener("click",function() {
    showins();
    opciones.classList.add("hide");
});

jugarBtn.addEventListener("click", function(){
    // Validamos si no seleccionamos a el oponente
    if( !OPONENTE){
        CompBtn.style.backgroundColor = "red";
        AmigBtn.style.backgroundColor = "red";
        return;
    }
    // Validamos si no seleccionamos el simbolo
    if(!jugador.man){
        oBtn.style.backgroundColor = "red";
        xBtn.style.backgroundColor = "red";
        return;
    }

    init(jugador, OPONENTE);
    opciones.classList.add("hide");
});

//Cambia de color el boton seleccionado al escoger la otra opcion
function switchActive(off,on){
    off.classList.remove("active");
    on.classList.add("active");
}