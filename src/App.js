import React from 'react';
import './App.scss';
import TheLayout from "./Containers/TheLayout";
// redux
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from "redux-saga";
import allReducers from "./Redux/Reducers";
import RootSaga from "./Sagas";
import { BrowserRouter as Router } from "react-router-dom";


const sagaMiddleware = createSagaMiddleware();
const store = createStore(allReducers, applyMiddleware(sagaMiddleware));
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
        <TheLayout/>
        </Router>
      </div>
    </Provider>
  );
}
sagaMiddleware.run(RootSaga);
export default App;
