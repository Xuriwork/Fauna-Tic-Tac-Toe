import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { PublicRoute, PrivateRoute } from './components/Routes';

import Navbar from './components/Navbar';
import GameRoom from './pages/GameRoom';
import PublicHome from './pages/PublicHome';
import PrivateHome from './pages/PrivateHome';
import JoinGame from './pages/JoinGame';
import CreateGame from './pages/CreateGame';

import './App.scss';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className='app-component'>
            <PublicRoute exact path='/' component={PublicHome} restricted={true} />
            <PrivateRoute path='/home' component={PrivateHome} />
            <PrivateRoute path='/create-game' component={CreateGame} />
            <PrivateRoute path='/join-game' component={JoinGame} />
            <PrivateRoute path='/room/:roomID' component={GameRoom} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;