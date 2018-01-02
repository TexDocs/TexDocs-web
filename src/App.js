import React, { Component } from 'react';
import './App.css';
import {Route} from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import { deepOrange, teal } from 'material-ui/colors';

import Workspace from "./pages/workspace/workspace";
import Dashboard from "./pages/dashboard";

const theme = createMuiTheme({
    palette: {
        // type: 'dark', // Switching the dark mode on is a single property value change.
        primary: deepOrange,
        secondary: teal,
    },
});

class App extends Component {
    render() {
        return (
        <div className="App">
            <MuiThemeProvider theme={theme}>
                <Route path="/project/:id" component={Workspace} />
                <Route exact path="/" component={Dashboard} />
            </MuiThemeProvider>
        </div>
        );
    }
}

export default App;
