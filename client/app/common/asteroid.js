import { createClass } from 'asteroid';
import { setLoggedUser, unsetLoggedUser, editProfileUser, addUser } from '../actions/UserActions';
import store from '../components/store';
import { createBoard, removeBoard, editBoard } from '../actions/BoardActions';
import { addTeam } from '../actions/TeamActions';

const Asteroid = createClass();
// Connect to a Meteor backend
const asteroid = new Asteroid({
  endpoint: 'ws://localhost:9000/websocket',
});

// if you want realitme updates in all connected clients
// subscribe to the publication
asteroid.subscribe('boards');
asteroid.subscribe('users');
asteroid.subscribe('user');
asteroid.subscribe('teams');

asteroid.ddp.on('added', (doc) => {
  // we need proper document object format here
  if (doc.collection === 'users') {
    if(doc.fields.emails) store.dispatch(setLoggedUser(doc.fields));
    else store.dispatch(addUser(doc.fields));
  }
  if(doc.collection === 'boards'){
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    store.dispatch(createBoard(docObj));
  }
  if(doc.collection === 'teams'){
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    store.dispatch(addTeam(docObj));
  }

});

asteroid.ddp.on('removed', (removedDoc) => {
  if (removedDoc.collection === 'users') {
    console.log(removedDoc)
    store.dispatch(unsetLoggedUser());
  }
  if (removedDoc.collection === 'boards') {
    store.dispatch(removeBoard(removedDoc.id));
  }
  if (removedDoc.collection === 'teams') {
    store.dispatch(removeBoard(removedDoc.id));
  }
});

asteroid.ddp.on('changed', (updatedDoc) => {
  if (updatedDoc.collection === 'users') {
    store.dispatch(editProfileUser(updatedDoc.fields));
  }

  if (updatedDoc.collection === 'boards') {
      store.dispatch(editBoard(updatedDoc.id, updatedDoc.fields));
  }
  if (updatedDoc.collection === 'teams') {
    store.dispatch(editBoard(updatedDoc.id, updatedDoc.fields));
}
});

export default asteroid;
