import React from 'react';
import './room.scss';
import { SpinnerDotted } from 'spinners-react';
import { useNavigate } from 'react-router-dom';

function Room() {
  const navigate = useNavigate();
  return (
    <div className='waiting'>
      <SpinnerDotted color='white' />
      <h6>
        Waiting for someone to
        <br />
        join Black Jack.
      </h6>
      <button onClick={() => navigate(`/lobby`)}>
        <p>Exit</p>
      </button>
    </div>
  );
}

export default Room;
