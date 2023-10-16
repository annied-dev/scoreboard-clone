const DisplayModel = {
    state: {},
    reducers: {
        setDisplayMatch(state, payload) {
            return { ...payload };
        },
    },
    effects: () => ({
        async getDisplayMatch(data) {
            console.log('data**********', data)
            this.setDisplayMatch(data)
        },
    }),
};

export default DisplayModel;