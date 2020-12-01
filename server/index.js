const express = require('express');
const http = require('http');
const cors = require('cors');
const socket = require('socket.io');
const { updateBoard, updateTeam } = require('../src/utils/faunaDB');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = socket(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	console.log('New client connected');
	socket.leaveAll();
	
	socket.on('JOIN', (roomID) => {
		socket.leaveAll();
		socket.join(roomID);
		socket.roomID = roomID;
	});

	socket.on('CHOOSE_TEAM', ({ roomID, team, userID, players }) => {
		updateTeam(roomID, team, userID)
		.then((ret) => {
			const newPlayers = [...players, {[team]: ret[team]}];
			socket.emit('SET_TEAM', team);
			io.in(roomID).emit('CHOOSE_TEAM', newPlayers);
		})
		.catch((error) => console.log(error));
	});

	socket.on('MAKE_MOVE', ({ roomID, cells, id, player }) => {
		const _cells = cells;
		_cells[id] = player;
		_cells.concat(_cells);

		updateBoard(roomID, JSON.stringify(_cells))
		.then((newCells) => {
			if (player === 'X') player = 'O';
			else player = 'X';
			io.in(roomID).emit('MAKE_MOVE', { newCells: JSON.parse(newCells), newPlayer: player });
		})
		.catch((error) => console.log(error));
	});

	socket.on('REQUEST_RESTART_GAME', ({ roomID, player }) => {
		socket.to(roomID).emit('REQUEST_RESTART_GAME', player);
	});

	socket.on('RESTART_GAME', (roomID) => {
		const newCells = Array(9).fill(null);
		updateBoard(roomID, JSON.stringify(newCells))
		.then(() => io.in(roomID).emit('RESTART_GAME', { newCells }))
		.catch((error) => console.log(error));
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
