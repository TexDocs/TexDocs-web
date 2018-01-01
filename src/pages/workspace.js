import React, { Component } from 'react';

/// Utils
import { provideState, injectState, update } from "freactal";
import ReconnectingWebSocket from "reconnecting-websocket";
import {logger} from "../stateHelpers";

/// External components
import SplitterLayout from 'react-splitter-layout';
import {AppBar, Toolbar, Typography} from "material-ui";

/// Internal components
import Editor from "../components/Editor/Editor";
import PDFView from "../components/PDFView";
import Loader from "../components/Loader/Loader";

const wrapComponentWithState = provideState({
    initialState: () => ({
        wsapi: undefined,
        project: undefined,
        socket: undefined,
        connected: false,
    }),
    computed: {
        projectDetailsAvailable: ({project}) => typeof project === 'object',
    },
    effects: {
        setConnected:  update((state, connected) => ({ connected })),
        setProjectID: update((state, project) => ({ project })),
        wsapiLoaded: update((state, wsapi) => ({ wsapi })),
        setWebsocket: update((state, socket) => ({ socket })),
        requestProjectDetails: update((state) => {
            // TODO Run async request (write wrapper)
            state.socket.send(
                new Uint16Array(
                    state.wsapi.requestProject(state.project)
                ).buffer
            );

            // TODO Replace fake response
            const response = [  146,  217,  36,  57,  51,  54,  100,  97,  48,  49,  102,  45,  57,  97,  98,  100,  45,  52,  100,  57,  100,  45,  56,  48,  99,  55,  45,  48,  50,  97,  102,  56,  53,  99,  56,  50,  50,  97,  56,  168,  83,  111,  109,  101,  78,  97,  109,  101,  1];
            console.log("Fake Response", response, state.wsapi.parseMessage(response));

            return { project: state.wsapi.parseMessage(response) };
        })
    },
    middleware: [logger("workspace")]
});

class Workspace extends Component {
    componentDidMount() {
        const effects = this.props.effects;

        const WSAPI = require("../wasm/websocket-api/Cargo.toml");
        WSAPI.then(effects.wsapiLoaded);

        const socket = new ReconnectingWebSocket('ws://localhost:1710', ['texdocs-collaboration']);

        effects.setWebsocket(socket);

        socket.addEventListener('open', () => {
            socket.binaryType = 'arraybuffer';
            effects.setConnected(true);
        });
        socket.addEventListener('close', effects.setConnected.bind(false));
    }

    render() {
        const { state, effects } = this.props;
        const projectID = this.props.match.params.id;

        // TODO Move into componentDidUpdate function
        if (!state.project && projectID) {
            effects.setProjectID(projectID);
        } else if (state.wsapi && !state.projectDetailsAvailable && state.connected) {
            // TODO Replace this with API call wrapper
            effects.requestProjectDetails();
        }

        let content = (
            <SplitterLayout>
                <Editor/>
                <PDFView/>
            </SplitterLayout>
        );

        if (!state.wsapi) {
            content = <Loader text="Loading API" />;
        } else if (!state.connected) {
            content = <Loader text="Connecting to server" />;
        } else if (state.connected && !state.projectDetailsAvailable) {
            content = <Loader text="Retrieving project details" />;
        }

        return (
            <div>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography type="title" color="inherit">
                            {state.projectDetailsAvailable ? state.project.name : "Untitled"}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {content}
            </div>
        );
    }
}

export default wrapComponentWithState(injectState(Workspace));