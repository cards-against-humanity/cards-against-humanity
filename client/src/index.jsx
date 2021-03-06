import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/index.js';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Home from './pages/Home.jsx';
import Cardpacks from './pages/Cardpacks.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Game from './pages/Game.jsx';
import GameList from './pages/GameList.jsx';
import Settings from './pages/Settings.jsx';
import Navbar from './components/Navbar.jsx';
import StatusBar from './components/StatusBar.jsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import { Router, Route, browserHistory, Switch } from 'react-router';
import { DragDropContextProvider } from 'react-dnd/lib';
import DragDropHTML5Backend from 'react-dnd-html5-backend';

import { getGameState } from './gameServerInterface';
setInterval(getGameState, 500); // TODO - Find a way to remove this intermittent polling

render(
  <Provider store={store}>
    <BrowserRouter basename='/'>
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <DragDropContextProvider backend={DragDropHTML5Backend}>
          <div>
            <Navbar/>
            <StatusBar/>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route exact path='/cardpacks' component={Cardpacks}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/game' component={Game}/>
              <Route exact path='/gamelist' component={GameList}/>
              <Route exact path='/settings' component={Settings}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </DragDropContextProvider>
      </MuiThemeProvider>
    </BrowserRouter>
  </Provider>
  , document.getElementById('app'));