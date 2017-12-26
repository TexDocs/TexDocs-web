import React, { Component } from "react";
import { provideState, injectState, update } from "freactal";
import ReconnectingWebSocket from "reconnecting-websocket";

import {Link} from '../routes';
import Loader from "./Loader";

import {Controlled as CodeMirror} from 'react-codemirror2';

if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
    require('codemirror/mode/stex/stex');
}

const wrapComponentWithState = provideState({
    initialState: () => ({
        wsapi: undefined,
        project: undefined,
        socket: undefined,
        connected: false,
        editorContent: "someInterestingString"
    }),
    computed: {
        projectDetailsAvailable: ({project}) => typeof project !== 'string',
    },
    effects: {
        setConnected:  update((state, connected) => ({ connected })),
        setProjectID: update((state, project) => ({ project })),
        wsapiLoaded: update((state, wsapi) => ({ wsapi })),
        setWebsocket: update((state, socket) => ({ socket })),
        setEditorContent: update((state, editorContent) => ({ editorContent })),
        requestProjectDetails: update((state) => {
            // TODO Run async request (write wrapper)
            state.socket.send(
                new Uint16Array(
                    state.wsapi.requestProject(state.project)
                ).buffer
            );

            // TODO Replace fake response
            const response = [  146,  217,  36,  57,  51,  54,  100,  97,  48,  49,  102,  45,  57,  97,  98,  100,  45,  52,  100,  57,  100,  45,  56,  48,  99,  55,  45,  48,  50,  97,  102,  56,  53,  99,  56,  50,  50,  97,  56,  168,  83,  111,  109,  101,  78,  97,  109,  101,  1];
            console.log("Response", response, state.wsapi.parseMessage(response));
            return { project: state.wsapi.parseMessage(response) };
        })
    },
    middleware: [
        freactalCxt => Object.assign({}, freactalCxt, {
            effects: Object.keys(freactalCxt.effects).reduce((memo, key) => {
                memo[key] = (...args) => {
                    console.log("Effect", key, args);
                    return freactalCxt.effects[key](...args);
                };
                return memo;
            }, {})
        })
    ]
});

class StoryList extends Component {
    componentDidMount() {
        const effects = this.props.effects;

        const WSAPI = require('../static/wasm/websocket_api_web');
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
        const { projectID, state, effects } = this.props;

        if (!state.project && projectID) {
            effects.setProjectID(projectID);
        } else if (state.wsapi && !state.projectDetailsAvailable && state.connected) {
            // TODO Replace this with API call wrapper
            effects.requestProjectDetails();
        }

        if (!state.wsapi) {
            return <Loader text="Loading API" />;
        } else if (!state.connected) {
            return <Loader text="Connecting to server" />;
        } else if (state.connected && !state.projectDetailsAvailable) {
            return <Loader text="Retrieving project details" />;
        }

        return <div>
            <CodeMirror
                value={this.props.state.editorContent}
                onBeforeChange={(editor, data, value) => {
                    effects.setEditorContent(value);
                }}
                options={{
                    mode: "stex",
                    theme: "material",
                    lineNumbers: true
                }}
                onChange={(editor, data, value) => {
                }}
            />
        </div>
    }
}

export default wrapComponentWithState(injectState(StoryList));