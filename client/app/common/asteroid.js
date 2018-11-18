import { createClass } from 'asteroid';
import { setLoggedUser, unsetLoggedUser, editProfileUser, addUser } from '../actions/UserActions';
import store from '../components/store';
import { createBoard, removeBoard, editBoard } from '../actions/BoardActions';
import { addTeam, removeTeam, editTeam } from '../actions/TeamActions';
import { addLabel, removeLabel, editLabel } from '../actions/LabelActions';
import { addChecklist, editChecklist, removeChecklist } from '../actions/ChecklistActions';

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
asteroid.subscribe('checklists');

asteroid.ddp.on('added', (doc) => {
  // we need proper document object format here
  const docObj = Object.assign({}, doc.fields, { _id: doc.id });
  
  switch(doc.collection){
    case "users":
      if(docObj.services) store.dispatch(setLoggedUser(docObj));
      else store.dispatch(addUser(docObj));
      break;
    case 'boards':
      store.dispatch(createBoard(docObj));
      break;
    case 'teams':
      store.dispatch(addTeam(docObj));
      break;
    case 'labels':
      store.dispatch(addLabel(docObj));
      break;
    case 'checklists':
      store.dispatch(addChecklist(docObj));
      break;  
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
  if(removedDoc.collection === 'checklists'){
    store.dispatch(removeChecklist(removedDoc.id));
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
  if (updatedDoc.collection === 'checklists') {
    store.dispatch(editChecklist(updatedDoc.id, updatedDoc.fields));
  }
});

export default asteroid;
