import { provideState, update } from "freactal";
import {logger} from "../../stateHelpers";

const sendHandshake = (socket, wsapi) => {
    const handshake = new Uint8Array(wsapi.createHandshake());
    console.log("Sending handshake", handshake);
    socket.send(handshake.buffer);
};

export const requestProject = (id, socket, wsapi) => {
    const request = new Uint8Array(wsapi.requestProject(id, true));
    console.log(`Requesting project ${id}`, request);
    socket.send(request.buffer);
};

export const wrapWorkspaceWithState = provideState({
    initialState: () => ({
        wsapi: undefined,
        projectID: undefined,
        project: undefined,
        socket: undefined,
        connected: false,
        workspaceHeight: 600,
        sessionID: undefined
    }),
    effects: {
        setWorkspaceHeight: update((state, dimensions) => ({ workspaceHeight: dimensions.bounds.height })),
        setWebsocket: update((state, socket) => ({ socket })),
        setConnected:  update((state, connected) => {
            if (connected && state.wsapi) sendHandshake(state.socket, state.wsapi);
            return ({ connected });
        }),
        setProjectID: update((state, projectID) => ({ projectID })),
        setSessionID: update((state, sessionID) => ({ sessionID })),
        setProject: update((state, project) => ({ project })),
        wsapiLoaded: update((state, wsapi) => {
            if (state.connected) sendHandshake(state.socket, wsapi);
            return ({ wsapi });
        }),
    },
    middleware: [logger("workspace")]
});