import { init } from "@rematch/core";
import MatchModel from "../models/MatchModel";
import SocketModel from "../models/SocketModel";

const store = init({
  models: { MatchModel, SocketModel },
});

export default store;
