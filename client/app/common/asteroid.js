import { createClass } from 'asteroid';
import { setLoggedUser, unsetLoggedUser } from '../actions/UserActions';
import store from '../components/store';

const Asteroid = createClass();
// Connect to a Meteor backend
const asteroid = new Asteroid({
  endpoint: 'ws://localhost:9000/websocket',
});

// if you want realitme updates in all connected clients
// subscribe to the publication
asteroid.subscribe('user');

asteroid.ddp.on('added', (doc) => {
  // we need proper document object format here
  if (doc.collection === 'users') {
    store.dispatch(setLoggedUser(doc.fields));
  }
});

asteroid.ddp.on('removed', (removedDoc) => {
  if (removedDoc.collection === 'users') {
    store.dispatch(unsetLoggedUser());
  }
});

asteroid.ddp.on('changed', (updatedDoc) => {
  /*if (updatedDoc.collection === 'todo') {
    store.dispatch(editTodo(updatedDoc.id, updatedDoc.fields.finished));
  }*/
});

export default asteroid;
