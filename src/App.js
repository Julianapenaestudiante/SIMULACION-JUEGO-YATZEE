import React, { useState } from 'react';
import './App.css';

// Función para lanzar dados
const lanzarDados = (numDados = 5) => {
  const dados = [];
  for (let i = 0; i < numDados; i++) {
    dados.push(Math.floor(Math.random() * 6) + 1);
  }
  return dados;
};

// Función para calcular la puntuación
const calcularPuntuacion = (dados) => {
  const contador = {};
  dados.forEach(dado => {
    contador[dado] = (contador[dado] || 0) + 1;
  });

  const valores = Object.values(contador);
  if (valores.includes(5)) return 50;  // Yatzee
  if (valores.includes(4)) return 25;  // Poker
  if (valores.includes(3) && valores.includes(2)) return 40;  // Full House
  if (new Set(dados).size === 5 && Math.max(...dados) - Math.min(...dados) === 4) return 30;  // Escalera
  if (valores.includes(3)) return 15;  // Trío
  return dados.reduce((acc, val) => acc + val, 0);  // Suma de valores
};

// Función de Montecarlo para decidir qué dados mantener
const decidirDados = (dados, numSimulaciones = 1000) => {
  let mejorPuntuacion = 0;
  let mejorCombinacion = dados;

  for (let i = 0; i < numSimulaciones; i++) {
    const simulacion = lanzarDados(5 - dados.length);
    const nuevaCombinacion = simulacion.concat(dados);
    const puntuacion = calcularPuntuacion(nuevaCombinacion);

    if (puntuacion > mejorPuntuacion) {
      mejorPuntuacion = puntuacion;
      mejorCombinacion = nuevaCombinacion;
    }
  }

  return mejorCombinacion;
};

// Componente para representar un dado
const Dado = ({ valor }) => {
  const dots = {
    1: ['dot-1'],
    2: ['dot-2', 'dot-5'],
    3: ['dot-2', 'dot-1', 'dot-5'],
    4: ['dot-2', 'dot-3', 'dot-4', 'dot-5'],
    5: ['dot-2', 'dot-3', 'dot-1', 'dot-4', 'dot-5'],
    6: ['dot-2', 'dot-3', 'dot-4', 'dot-5', 'dot-6', 'dot-7'],
  };

  return (
    <div className="dado">
      {dots[valor].map((dot, index) => (
        <div key={index} className={`dot ${dot}`}></div>
      ))}
    </div>
  );
};

const JuegoYatzee = () => {
  const [turno, setTurno] = useState(1);
  const [jugadorActual, setJugadorActual] = useState(0);
  const [dados, setDados] = useState(lanzarDados());
  const [puntuaciones, setPuntuaciones] = useState([0, 0]);

  const siguienteTurno = () => {
    const nuevaPuntuacion = calcularPuntuacion(dados);
    const nuevasPuntuaciones = [...puntuaciones];
    nuevasPuntuaciones[jugadorActual] += nuevaPuntuacion;
    setPuntuaciones(nuevasPuntuaciones);

    if (turno >= 10 && jugadorActual === 1) {
      alert(`Puntuaciones finales: Jugador 1: ${puntuaciones[0]}, Jugador 2: ${puntuaciones[1]}`);
      const ganador = puntuaciones[0] > puntuaciones[1] ? 1 : 2;
      alert(`El ganador es el Jugador ${ganador}`);
    } else {
      setDados(lanzarDados());
      setJugadorActual((jugadorActual + 1) % 2);
      setTurno(jugadorActual === 1 ? turno + 1 : turno);
    }
  };

  const mantenerDados = () => {
    const nuevosDados = decidirDados(dados);
    setDados(nuevosDados);
  };

  return (
    <div className="App">
      <h1>Juego de Yatzee</h1>
      <h2>Turno {turno} - Jugador {jugadorActual + 1}</h2>
      <div className="dados">
        {dados.map((dado, index) => (
          <Dado key={index} valor={dado} />
        ))}
      </div>
      <button onClick={mantenerDados}>Mantener Dados</button>
      <button onClick={siguienteTurno}>Siguiente Turno</button>
      <h3>Puntuaciones</h3>
      <div className="scoreboard">
        <p>Jugador 1: {puntuaciones[0]}</p>
        <p>Jugador 2: {puntuaciones[1]}</p>
      </div>
    </div>
  );
};

export default JuegoYatzee;




