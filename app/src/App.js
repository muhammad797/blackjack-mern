import { HashRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import Join from './pages/Join/Join';
import Lobby from './pages/lobby/lobby';
import Room from './componenets/room/Room';
import Game from './pages/game/game';
import SocketState from '../src/context/socketState';

function App() {
  return (
    <>
      <SocketState>
        <HashRouter>
          <Routes>
            <Route exact path='/' name='Join' element={<Join />} />
          </Routes>
          <Routes>
            <Route exact path='/room' name='Room' element={<Room />} />
          </Routes>
          <Routes>
            <Route exact path='/lobby' name='Lobby' element={<Lobby />} />
          </Routes>

          <Routes>
            <Route exact path='/game' name='Game' element={<Game />} />
          </Routes>
        </HashRouter>
      </SocketState>
    </>
  );
}

export default App;
