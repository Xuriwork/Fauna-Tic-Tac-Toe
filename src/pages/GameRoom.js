import Board from '../components/Board';
import { Component } from 'react';
import io from 'socket.io-client';
import { getRoom } from '../utils/faunaDB';
import Loading from '../components/Loading';
export class GameRoom extends Component {
	state = {
		loading: false,
		cells: Array(9).fill(null),
		players: [],
		player: 'X',
		team: null,
	};

	componentDidMount() {
		const {
			history,
			match: {
				params: { roomID },
			},
		} = this.props;

		getRoom(roomID)
			.then(() => this.onReady())
			.catch((error) => {
				if (error.name === 'NotFound') {
					history.push('/');
				}
			});
	}

	componentWillUnmount() {
		if (this.state.socket) {
			this.state.socket.removeAllListeners();
		}
	}

	onSocketMethods = (socket) => {
		const {
			match: {
				params: { roomID },
			},
		} = this.props;

		socket.on('connect', () => {
			socket.emit('JOIN', roomID);
		});

		socket.on('MAKE_MOVE', ({ newCells, newPlayer }) => {
			this.setState({ cells: newCells });
			this.setState({ player: newPlayer });
		});

		socket.on('CHOOSE_TEAM', (newPlayers) => {
			this.setState({ players: newPlayers });
		});

		socket.on('SET_TEAM', (team) => {
			this.setState({ team });
		});

		socket.on('REQUEST_RESTART_GAME', (player) => {
			if (window.confirm(`${player} would like to restart the game`)) { 
				socket.emit('RESTART_GAME', roomID);
			};
		});

		socket.on('RESTART_GAME', () => {
			this.setState({ players: [] });
		});
	};

	onReady = () => {
		const socket = io('localhost:8000', { transports: ['websocket'] });
		this.setState({ socket });
		this.onSocketMethods(socket);
		this.setState({ loading: false });
	};

	calculateWinner = (cells) => {
		const lines = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c] = lines[i];
			if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
				return cells[a];
			}
		};
		
		return null;
	};

	handleClick = (id) => {
		const {
			team,
			player,
			players,
			cells,
			socket,
		} = this.state;
		const {
			match: {
				params: { roomID },
			},
		} = this.props;

		if (players.length !== 2) return;
		if (player !== team) return;

		if (this.calculateWinner(cells) || cells[id]) {
			return;
		}

		socket.emit('MAKE_MOVE', { roomID, cells, id, player });
	};

	chooseTeam = (newTeam) => {
		const { team, players, socket } = this.state;
		const {
			match: {
				params: { roomID },
			},
		} = this.props;
		
		if (team !== null) return;

		socket.emit('CHOOSE_TEAM', {
			roomID,
			team: newTeam,
			userID: this.props.userID,
			players,
		});
	};

	restartGame = () => {
		const { socket, team } = this.state;
		const {
			match: {
				params: { roomID },
			},
		} = this.props;

		socket.emit('REQUEST_RESTART_GAME', { roomID, player: team });
	};

	render() {
		const {
			loading,
			cells,
			player,
			team,
			players,
		} = this.state;
		if (loading) return <Loading />;

		const winner = this.calculateWinner(cells);

		let status;
		if (winner) status = 'Winner: ' + winner;
		else status = team === player ? `Turn: ${player} (You)` : `Turn: ${player}`;

		return (
			<div className='game-room'>
				<div>
					<h3 className='status'>{players.length === 2 && status}</h3>
					<Board
						cells={cells}
						isActive={!winner && team === player}
						onClick={(id) => this.handleClick(id)}
					/>
					<div className='buttons-container'>
						{winner ? (
							<button onClick={this.restartGame} className='restart-game-button'>Restart Game</button>
						) : players.length === 2 ? null : (
							<>
								<button onClick={() => this.chooseTeam('X')}>
									Join Team X
								</button>
								<button onClick={() => this.chooseTeam('O')}>
									Join Team O
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default GameRoom;
