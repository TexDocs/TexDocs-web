import { provideState, update } from "freactal";
import {logger} from "../../stateHelpers";

export const wrapWorkspaceWithState = provideState({
    initialState: () => ({
        wsapi: undefined,
        project: undefined,
        socket: undefined,
        connected: false,
        workspaceHeight: 600
    }),
    computed: {
        projectDetailsAvailable: ({project}) => typeof project === 'object',
    },
    effects: {
        setWorkspaceHeight: update((state, dimensions) => ({ workspaceHeight: dimensions.bounds.height })),
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