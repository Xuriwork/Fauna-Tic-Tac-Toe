import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { checkIfRoomExists } from '../utils/faunaDB';

const JoinGame = () => {
    const history = useHistory();
    const [roomID, setRoomID] = useState('');

    const handleOnChangeRoomID = (e) => setRoomID(e.target.value);

    const handleJoinGame = (e) => {
        if (roomID.trim() === '') return;
        e.preventDefault();

        checkIfRoomExists(roomID)
        .then((ret) => {
            if (ret) history.push(`/room/${roomID}`);
            else alert('Room does not exist');
        });
    };

    return (
        <div className='join-game-page'>
            <div className='form-container'>
                <form>
                    <label htmlFor='roomID'>Room ID</label>
                    <input type='text' name='roomID' id='roomID' value={roomID} onChange={handleOnChangeRoomID} />
                    <button className='button-primary' style={{ marginTop: 10 }} onClick={handleJoinGame}>Join Game</button>
                </form>
            </div>
        </div>
    )
}

export default JoinGame;
