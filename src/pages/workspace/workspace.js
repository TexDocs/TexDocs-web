import React, { Component } from 'react';

/// Utils
import { injectState } from "freactal";
import { wrapWorkspaceWithState, requestProject } from "./state";
import ReconnectingWebSocket from "reconnecting-websocket";

/// External components
import Measure from "react-measure";
import SplitterLayout from 'react-splitter-layout';
import {AppBar, Icon, Paper, Toolbar, withStyles} from "material-ui";
import Style from 'react-style-tag';

/// Internal components
import Editor from "../../components/Editor/Editor";
import PDFView from "../../components/PDFView";
import Loader from "../../components/Loader/Loader";
import Menubar from "../../components/Menubar/Menubar";

const TOOLBAR_HEIGHT = 36;
const MENUBAR_HEIGHT = require("../../components/Menubar/Menubar").MENUBAR_HEIGHT;

const styles = theme => ({
    toolbar: {
        height: `${TOOLBAR_HEIGHT}pt`,
        minHeight: "auto",
        backgroundColor: "#f1f1f1"
    }
});

class Workspace extends Component {
    updateWebsocketHandler = (socket) => {
        const {state, effects} = this.props;
        socket.onmessage = (msg) => {
            const data = Array.from(new Uint8Array(msg.data));
            const parsed = state.wsapi.parseMessage(data);

            const type = parsed[0];
            const value = parsed[1];

            console.warn(`Received ${type}:`, value);

            switch (type) {
                case "HandshakeAcknowledgement":
                    effects.setSessionID(value.session_id);
                    requestProject(state.projectID, socket, state.wsapi);
                    break;
                case "HandshakeError":
                    console.error("Handshake failed!", value);
                    break;
                case "ProjectRequestError":
                    console.error("Failed to retrieve project", value);
                    effects.setProject(undefined);
                    break;
                case "Project":
                    effects.setProject(value);
                    break;
                default:
                    break;
            }
        };
    };

    componentDidMount() {
        const effects = this.props.effects;

        /// Set the project ID initially
        effects.setProjectID(this.props.match.params.id);

        /// Setup WSAPI
        const WSAPI = require("../../wasm/websocket-api/Cargo.toml");
        WSAPI.then(effects.wsapiLoaded);

        /// Setup Websocket
        const socket = new ReconnectingWebSocket('ws://localhost:1710');
        effects.setWebsocket(socket);

        socket.addEventListener('open', () => {
            socket.binaryType = 'arraybuffer';
            effects.setConnected(true);
        });
        socket.addEventListener('close', () => {
            effects.setConnected(false);
        });
        socket.addEventListener('error', console.error);

        this.updateWebsocketHandler(socket);
    }

    componentDidUpdate(prevProps) {
        const currentProjectID = this.props.match.params.id;
        const { state } = this.props;

        if (currentProjectID !== prevProps.match.params.id) {
            this.props.effects.setProjectID(currentProjectID);
            if (state.connected && state.wsapi)
                requestProject(currentProjectID, this.props.state.socket, this.props.state.wsapi);
        }

        if (this.props.state.socket) this.updateWebsocketHandler(this.props.state.socket);
    }

    render() {
        const { state, effects, classes } = this.props;

        const splitterProps = {
            primaryMinSize: 500,
            secondaryMinSize: 200,
            secondaryInitialSize: 400,
            customClassName: "workspace-splitter-layout"
        };

        let content = (
            <Measure bounds onResize={effects.setWorkspaceHeight}>
                {({measureRef}) =>
                    <div ref={measureRef} style={{height: `calc(100% - ${MENUBAR_HEIGHT + TOOLBAR_HEIGHT}pt)`}}>
                        <SplitterLayout {...splitterProps}>
                            <Editor/>
                            <PDFView/>
                        </SplitterLayout>
                    </div>
                }
            </Measure>
        );

        if (!state.wsapi) {
            content = <Loader text="Loading API" />;
        } else if (!state.connected) {
            content = <Loader text="Connecting to server" />;
        } else if (state.connected && !state.project) {
            content = <Loader text="Retrieving project details" />;
        }

        return (
            <div style={{height: '100%'}}>
                <Style>{`
                    .workspace-splitter-layout {
                        height: ${state.workspaceHeight}px;
                    }
                `}</Style>
                <Paper square>
                        <Menubar/>
                        <Toolbar className={classes.toolbar}>Toolbar</Toolbar>
                </Paper>
                {content}
            </div>
        );
    }
}

export default wrapWorkspaceWithState(injectState(withStyles(styles)(Workspace)));