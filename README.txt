Este tres en raya hace uso del Canvas, donde se dibujan cuatro líneas para el tablero de juego, las cruces de un jugador y los círculos del otro. Al reiniciar partida, se realiza una limpieza del canvas con la función clearRect.

También se utiliza la api de Audio para notificar el fin de partida, haciendo uso de audio.mp3, un fichero con el sonido de mensaje de Discord.

Por último empleamos los MouseEvent para detectar el click del jugador a la hora de marcar su selección. Sin embargo, no se tiene en cuenta en el canvas si se ha realizado scroll.