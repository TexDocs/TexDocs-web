import React, { Component } from 'react';

/// Utils
import { injectState } from "freactal";
import {wrapWorkspaceWithState} from "./state";
import ReconnectingWebSocket from "reconnecting-websocket";

/// External components
import Measure from "react-measure";
import SplitterLayout from 'react-splitter-layout';
// import {AppBar, Toolbar, Typography} from "material-ui";
import Style from 'react-style-tag';

/// Internal components
import Editor from "../../components/Editor/Editor";
import PDFView from "../../components/PDFView";
import Loader from "../../components/Loader/Loader";

class Workspace extends Component {
    componentDidMount() {
        const effects = this.props.effects;

        const WSAPI = require("../../wasm/websocket-api/Cargo.toml");
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

        const splitterProps = {
            primaryMinSize: 500,
            secondaryMinSize: 200,
            secondaryInitialSize: 400,
            customClassName: "workspace-splitter-layout"
        };

        let content = (
            <Measure bounds onResize={effects.setWorkspaceHeight} style={{height: "100%"}}>
                {({measureRef}) =>
                    <div ref={measureRef} style={{height: '100%'}}>
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
        } else if (state.connected && !state.projectDetailsAvailable) {
            content = <Loader text="Retrieving project details" />;
        }

        return (
            <div style={{height: '100%'}}>
                <Style>{`
                    .workspace-splitter-layout {
                        height: ${state.workspaceHeight}px;
                    }
                `}</Style>
                {/*<AppBar color="primary">*/}
                    {/*<Toolbar>*/}
                        {/*<Typography type="title" color="inherit">*/}
                            {/*{state.projectDetailsAvailable ? state.project.name : "Untitled"}*/}
                        {/*</Typography>*/}
                    {/*</Toolbar>*/}
                {/*</AppBar>*/}
                {content}
            </div>
        );
    }
}

export default wrapWorkspaceWithState(injectState(Workspace));