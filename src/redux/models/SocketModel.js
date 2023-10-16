
const SocketModel = {
    state: { socket: {} },
    reducers: {
        // handle state changes with pure functions
        setSocket(state, payload) {
            return { ...state, socket: payload };
        },

    },
    effects: (dispatch) => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        async setSocketData(payload) {
            this.setSocket(payload);
        }
    }),
};

export default SocketModel;