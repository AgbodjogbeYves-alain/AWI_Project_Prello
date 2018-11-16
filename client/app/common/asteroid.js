import { createClass } from 'asteroid';
import { setLoggedUser, unsetLoggedUser, editProfileUser, addUser } from '../actions/UserActions';
import store from '../components/store';
import { createBoard, removeBoard, editBoard } from '../actions/BoardActions';
import { addTeam, removeTeam, editTeam } from '../actions/TeamActions';
import { addLabel, removeLabel, editLabel } from '../actions/LabelActions';
import { setRefreshed } from '../actions/RefreshActions';

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
asteroid.subscribe('labels');

asteroid.ddp.on('added', (doc) => {
  // we need proper document object format here
  if (doc.collection === 'users') {
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    if(docObj.services) store.dispatch(setLoggedUser(docObj));
    else {
      
      store.dispatch(addUser(docObj));
    }
    
  }
  if(doc.collection === 'boards'){
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    store.dispatch(createBoard(docObj));
  }
  if(doc.collection === 'teams'){
    const docObj = Object.assign({}, doc.fields, { _id: doc.id });
    store.dispatch(addTeam(docObj));
  }
  if(doc.collection === 'labels'){
      const docObj = Object.assign({}, doc.fields, { _id: doc.id });
      store.dispatch(addLabel(docObj));
  }

});

asteroid.ddp.on('removed', (removedDoc) => {
  if (removedDoc.collection === 'users') {
    store.dispatch(unsetLoggedUser());
  }
  if (removedDoc.collection === 'boards') {
    store.dispatch(removeBoard(removedDoc.id));
  }
  if (removedDoc.collection === 'teams') {
    store.dispatch(removeTeam(removedDoc.id));
  }
  if(removedDoc.collection === 'labels'){
      store.dispatch(removeLabel(removedDoc.id));
  }

});

asteroid.ddp.on('changed', (updatedDoc) => {
  if (updatedDoc.collection === 'users') {
      store.dispatch(editProfileUser(updatedDoc.id, updatedDoc.fields));
  }
  if (updatedDoc.collection === 'boards') {
      store.dispatch(editBoard(updatedDoc.id, updatedDoc.fields));
  }
  if (updatedDoc.collection === 'teams') {
    store.dispatch(editTeam(updatedDoc.id, updatedDoc.fields));
  }
  if (updatedDoc.collection === 'labels') {
      store.dispatch(editLabel(updatedDoc.id, updatedDoc.fields));
  }
});

export default asteroid;
