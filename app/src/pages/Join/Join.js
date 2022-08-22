import './join.scss';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { SignIn } from '../../features/authSlice';

const Join = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [name, setName] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    dispatch(SignIn(name));
    navigate(`/lobby`);
  };

  return (
    <div className='welcome'>
      <h1>Welcome to Black Jack</h1>
      <div className='Loginform'>
        <input
          type='text'
          placeholder='Enter your username'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type='submit' onClick={submitHandler}>
          <p>Join now</p>
        </button>
      </div>
    </div>
  );
};

export default Join;
