import faunadb from 'faunadb';
import { nanoid } from 'nanoid';

const q = faunadb.query;

const secret = process.env.FAUNADB_SERVER_KEY ? process.env.FAUNADB_SERVER_KEY : process.env.REACT_APP_FAUNADB_CLIENT_KEY;
const client = new faunadb.Client({ secret });

const getRoom = (roomID) => client.query(q.Get(q.Match(q.Index('room_by_id'), roomID)));

const checkIfRoomExists = (roomID) => {
	getRoom(roomID)
	.then((ret) => {
		return client.query(q.Exists(q.Ref(q.Collection('Rooms'), ret.ref.value.id)));
	});
};

const createRoom = (userID, profilePictureURL) => {
    const id = nanoid();
    const cells = JSON.stringify(Array(9).fill(null));

	return client.query(
		q.Create(q.Collection('Rooms'), {
			data: {
				id,
				cells,
				players: [{ id: userID, profilePictureURL }],
			},
		})
	);
};

const updateBoard = (roomID, cells) => {
	return getRoom(roomID)
	.then((ret) => {
		return client
			.query(
				q.Update(ret.ref, {
					data: {
						cells,
					},
				})
			)
			.then((ret) => ret.data.cells)
	})
};

const updateTeam = (roomID, team, userID) => {
	return getRoom(roomID)
	.then((ret) => {
		return client
			.query(
				q.Update(ret.ref, {
					data: {
						[team]: userID 
					},
				})
			)
			.then((ret) => ret.data)
	})
};

export { getRoom, checkIfRoomExists, createRoom, updateBoard, updateTeam };
