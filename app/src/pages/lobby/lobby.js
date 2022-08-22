import './lobby.scss';
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../../context/socketContext';
import { generateHand, generateLeftHand } from '../../actions/generateHand';

const Lobby = () => {
  const socket = useContext(SocketContext);

  useEffect(() => {}, []);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [player, setPlayer] = useState({
    name: 'player',
    score: 0,
    deck: []
  });
  const [leftPlayer, setleftPlayer] = useState({
    name: 'LeftPlayer',
    score: 0,
    deck: []
  });
  const [pc, setPc] = useState({
    name: 'dealer',
    score: 0,
    deck: []
  });
  const allPlayers = [];
  generateHand(player);
  generateLeftHand(leftPlayer);

  generateHand(pc);
  allPlayers.push(player);
  allPlayers.push(leftPlayer);
  allPlayers.push(pc);

  const [rooms, setRooms] = useState([]);

  const submitHandler = async (event) => {
    socket.emit('createGame', user);
    navigate(`/room`);
  };

  const inRoom = async (roomId) => {
    socket.emit('joinGame', { roomId, user });
    socket.emit('sendPlayers', allPlayers);
  };

  useEffect(() => {
    socket.emit('getAllRooms');
    socket.on('startGame', function ({ clients, decks, roomId, User }) {
      navigate(`/game`, {
        state: { joined: clients, players: decks, room: roomId, user: User }
      });
    });
    socket.on('getAllRooms', (allrooms) => {
      for (let i = 0; i < allrooms.length; i++) {
        if (allrooms[i] == user) {
          allrooms.splice(i, 1);
        }
      }
      setRooms(allrooms);
    });
  }, []);

  useEffect(() => {
    socket.on('updatedLobby', (allrooms) => {
      setRooms(allrooms);
    });
  }, [rooms]);

  return (
    <>
      <div className='join'>
        <button type='submit' onClick={submitHandler}>
          <p>New Game</p>
        </button>
        <div className='joinList'>
          {rooms?.map((e, index) => {
            return (
              <div
                className='JoinGame'
                onClick={() => {
                  inRoom(e);
                }}
              >
                <p>ID :</p>
                <p>{e}</p>
              </div>
            );
          })}
        </div>
        <h6 onClick={() => navigate(`/`)}>Exit</h6>
      </div>
    </>
  );
};

export default Lobby;
