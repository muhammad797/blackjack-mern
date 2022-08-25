import React from 'react';
import SocketContext from './socketContext';

import io from 'socket.io-client';
const socket = io('https://node-blackjack.herokuapp.com/');

function SocketState(props) {
  const connection = socket;
  return (
    <>
      <SocketContext.Provider value={connection}>
        {props.children}
      </SocketContext.Provider>
    </>
  );
}

export default SocketState;
