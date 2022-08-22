import React from 'react';
import BlackJack from '../../componenets/BlackJack/BlackJack';
import { useLocation } from 'react-router-dom';

const Game = () => {
  const location = useLocation();
  return (
    <BlackJack
      ids={location.state.joined}
      room={location.state.players}
      loby={location.state.room}
      User={location.state.user}
    />
  );
};

export default Game;
