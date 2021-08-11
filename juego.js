function init(jugador, OPONENTE){
    //Seleccionar Canvas
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext("2d");

    //Variables de tablero
    let tablero = [];
    const COLUMNA = 3;
    const FILA = 3;
    const ESPACIO = 150;

    //Guardar los movimientos del jugador
    let gameData = new Array(9);

    //Por defecto definimos que el primer jugador en jugar es el humano (en caso de jugar con el asistente)
    let currentPlayer = jugador.man;

    //Cargamos las imagenes de de X y O
    const xImage = new Image();
    xImage.src= "img/x.png";

    const oImage = new Image();
    oImage.src="img/o.png";

    // Combinaciones ganadoras
    const COMBOS = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]

    ];

    // Para el control del juego
    let GAME_OVER = false;

    //Dibujo del tablero
    function drawBoard() {
        //Damos a cada espacio una identificacion unica
        let id = 0;
        for (let i=0; i< FILA; i++){
            tablero[i] = [];
            for (let j=0; j<COLUMNA; j++){
                tablero[i][j] = id;
                id++;
                // Dibujamos los espacios
                ctx.strokeStyle = "#000";
                ctx.strokeRect(j * ESPACIO, i * ESPACIO, ESPACIO ,ESPACIO); 
            }
        }
    }
    drawBoard();
    //Clic del jugador 
    canvas.addEventListener("click",function (event) {

        //Si es un juego terminado? Salir
        if(GAME_OVER) return;

        //Posicion X y Y del clic del mouse en relacion con el trazo
        let X = event.clientX - canvas.getBoundingClientRect().x;
        let Y = event.clientY - canvas.getBoundingClientRect().y;
        
        //calculamos el valor de i y j del espacio cliqueado
        let i = Math.floor(Y/ESPACIO);
        let j = Math.floor(X/ESPACIO);

        //Obtenemos la id del espacio en el que el jugador hizo clic
        let id = tablero[i][j];

        //Evitamos que el jugador juegue el mismo espacio dos veces
        if (gameData[id]) return;

        //Almacenamos el movimiento del jugador en gameData
        gameData[id] = currentPlayer;

        //Dibuja el movimiento en el tablero
        drawOnBoard(currentPlayer, i, j);

        //Comprueba si gana
        if(esGanador(gameData,currentPlayer)){
            showGameOver(currentPlayer);
            GAME_OVER = true;
            return;
        }

        //Comprueba si es un empate
        if (esEmpate(gameData)) {
            showGameOver("Empate");
            GAME_OVER = true;
            return;   
        }
        if (OPONENTE == "computadora"){
            //obtenemos el ID del espacio mediante el algoritmo minimax
            let id = minimax (gameData, jugador.computadora).id;
            
            //almacenamos el movimiento del jugador en gameData
            gameData[id] = jugador.computadora;

            //obtenemos i y j del espacio
            let space = getIJ(id);

            //dibujar el movimiento en el tablero
            drawOnBoard(jugador.computadora, space.i, space.j);

            //Comprobar si gana
            if(esGanador(gameData,jugador.computadora)){
                showGameOver(jugador.computadora);
                GAME_OVER = true;
                return;
            }
            // comprobar si es un empate
            if(esEmpate(gameData)){
                showGameOver("Empate");
                GAME_OVER = true;
                return;
            }
        }else{
            //Damos el turno al otro jugador
            currentPlayer = currentPlayer == jugador.man ? jugador.amigo : jugador.man; 
        }
    });

    //MINIMAX
        function minimax(gameData,JUGADOR) {
            //Base
            if( esGanador(gameData, jugador.computadora)) return {evaluation: +10};
            if( esGanador(gameData, jugador.man)) return {evaluation: -10};
            if( esEmpate(gameData)) return{evaluation: 0};
            //Busca espacios vacios
            let Espacio_Vacio = getEmptySpaces(gameData);
            //Guarda todos los movimientos y sus evaluaciones
            let movimientos = [];
            //Hacemos un bucle para los espacios vacios para evaluarlos
            for(let i=0;i<Espacio_Vacio.length;i++){
                //Obtenemos el Id del espacio vacio
                let id = Espacio_Vacio[i];
                //Respalda el espacio
                let backup = gameData[id];
                //Hace el movimiento para el jugador
                gameData[id]= JUGADOR;
                //Guarda el Id y la evaluacion del movimiento
                let movimiento = {};
                movimiento.id=id;
                // La evaluacion del movimiento
                if(JUGADOR == jugador.computadora){
                    movimiento.evaluation = minimax(gameData, jugador.man).evaluation;
                }else{
                    movimiento.evaluation = minimax(gameData, jugador.computadora).evaluation;
                }
                //Restaurar espacio
                gameData[id] = backup;
                //Guardar el movimiento en la matriz de movimientos
                movimientos.push(movimiento);
            }
            //Algoritmo MINIMAX
            let mejorMov;
            if(JUGADOR == jugador.computadora){
                //Maximizar
                let mejorEvaluacion = -Infinity;
                for(let i=0;i<movimientos.length;i++){
                    if(movimientos[i].evaluation>mejorEvaluacion){
                        mejorEvaluacion = movimientos[i].evaluation;
                        mejorMov = movimientos[i];
                    }
                }
            }else{
                //minimizar
                let mejorEvaluacion= +Infinity;
                for(let i=0;i<movimientos.length;i++){
                    if(movimientos[i].evaluation<mejorEvaluacion){
                        mejorEvaluacion = movimientos[i].evaluation;
                        mejorMov = movimientos[i];
                    }
                }
            }
            return mejorMov;
    }
     //Conseguir los espcacios vacios 
    function getEmptySpaces (gameData){
        let vacio = [];

        for (let id=0;id<gameData.length; id++){
            if(!gameData[id]) vacio.push(id);
        }
        return vacio;
    }

    //Obtener i y j de un espacio
    function getIJ(id) {
        for(let i=0; i< tablero.length;i++){
            for(let j = 0; j<tablero[i].length; j++){
                if (tablero[i][j] == id) return{i : i, j:j} 
            }
        }
    }

    //Comprobar si hay un ganador
    function esGanador(gameData, jugador) {
        // revisa la matriz que el jugador ha seleccionado
        for(let i=0; i< COMBOS.length; i++){
            let Gano = true;
            //Revisa los elementos dentro de la matriz en base a la lista de combos de victoria
            for (let j=0; j<COMBOS[i].length; j++){
                let id = COMBOS[i][j];
                Gano = gameData[id] == jugador && Gano;
            }
            if(Gano){
                return true;
            }
        }
        return false;
    }

    //Comprobar si es un empate
    function esEmpate(gameData) {
        let isBoardFill = true;
        //Lo comprueba por medio del tablero si hay mas opciones
        for(let i=0; i<gameData.length; i++){
            isBoardFill = gameData[i] && isBoardFill;
        }
        if(isBoardFill){
            return true;
        } 
        return false;
    }

    //Mostrar fin del juego
    function showGameOver(jugador){
        let message = jugador == "Empate" ? "No hay ganador" : "El ganador es:";
        let imgSrc = `img/${jugador}.png`;

        gameOverElement.innerHTML = `
            <h1>${message}</h1>
            <img class="winner-img" src=${imgSrc} </img>
            <div class="jugar" onclick="location.reload()">Reintentar</div>
        `;
        gameOverElement.classList.remove("hide");
    }

    //dibujar en el tablero
    function drawOnBoard(jugador, i , j){
        let img = jugador == "X" ? xImage : oImage;

        //La posicion x,y de a imagen son las x, y seleccionado
        ctx.drawImage(img, j*ESPACIO, i *ESPACIO);
    }
}
function showins(){

    let m0 = "1. Selecciona primero con quien te quieras enfrentar, ya sea contra el asistente o con un amigo en la misma computadora.";
    let m1 = "2. Selecciona el simbolo que quieras.";
    let m2 = "3. Oprime el botón jugar para empezar.";
    let m3 = "Elaborado por:";
    let m4 = "Jorge Javier Del Angel Viveros";
    let m5 = "César Bladimir González Martínez";
    let m6 = "Celida Yurlen Ramírez Fosado";
    let m7 = "Jessica Rodríguez González";
    let m8 = "Juan Antonio Zumaya López";
    
    gameOverElement.innerHTML = `
        <h3>${m0}</h3>
        <h3>${m1}</h3>
        <h3>${m2}</h3>
        <h4>${m3}</h4>
        <h4>${m4}</h4>
        <h4>${m5}</h4>
        <h4>${m6}</h4>
        <h4>${m7}</h4>
        <h4>${m8}</h4> 
        <div class="jugar" onclick="location.reload()">Regresar</div>
    `;

    gameOverElement.classList.remove("hide");
}