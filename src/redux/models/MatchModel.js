import axiosClient from "../../api/axiosClient";

const MatchModel = {
    state: { matchData: {}, dataFrom: '' },
    reducers: {
        setMatchDetail(state, payload) {
            return { matchData: { ...payload.data }, dataFrom: payload.from };
        },
    },
    effects: () => ({
        async getMatchDetail(data) {
            if (data.from === 'api') {
                let response = await axiosClient.post(`http://localhost:3000/cricket-score/match/getscore/${data.matchId}`,{});
                this.setMatchDetail({ data: response.data.data, from: data.from })
            }
            else {
                this.setMatchDetail({ data: data.data, from: data.from })
            }
        },
    }),
};

export default MatchModel;