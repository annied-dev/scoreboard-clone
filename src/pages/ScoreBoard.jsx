import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../redux/store";
import CustomProgressBar from "../components/CustomProgressBar";
import arrow_down from "../assets/images/arrow_down.png";
import arrow_up from "../assets/images/arrow_up.png";
import axiosClient from "../api/axiosClient";

const styleData = {
  main_body: {
    backgroundImage: `url('/img2.png')`,
    fontFamily: 'Barlow',
    backgroundSize: 'cover',
    backgroundColor: '#fff'
  },
  container: {
    paddingRight: 'calc(var(--bs-gutter-x) * .5)',
    paddingLeft: 'calc(var(--bs-gutter-x) * .5)',
    marginRight: '30px',
    marginLeft: '30px',
  },
  vs_box_span: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#334453',
    background: '#D9D9D9',
    padding: '10px',
    borderRadius: '50px',
  },
  dotbox: {
    fontWeight: 700,
    fontSize: '12px',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: '0px 10px',
    paddingTop: '10px',
    paddingBottom: '10px',
    // width: '100%',
    color: '#fff',
    background: '#D9D9D9',
    borderRadius: '20px',
    height: 'fit-content',
    overflow: 'auto'
  },
  four_line: {
    padding: '5px 20px',
    background: '#37495A',
    borderRadius: '15px',
    alignItems: 'center',
  },
  progress_color: 'linear-gradient(90deg, #60ED96 0%, #FF0505 100%)'
}

let data = {
  status: 'in-play',
  betting_team: {
    team_id: "",
    team_name: "",
    score: "00",
    wickets: 0,
    overs: "0.0",
  },
  bowling_team: {
    team_id: "",
    team_name: "",
    run_detail: [{ score: "00", wickets: 0, overs: "0.0" }],
  },
  toss: "",
  last_overs: [],
  run_rate: "0.0",
  required_run_rate: "0.0",
  required_runs: 0,
  required_balls: 0,
  batsmen: [],
  bowler: {},
};

const ScoreBoard = ({ matchId }) => {
  const { matchData, dataFrom } = useSelector((state) => state.MatchModel);
  const [displayData, setDisplayData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const { dispatch } = store;

  useEffect(async () => {
    dispatch.MatchModel.getMatchDetail({ from: "api", matchId });
    const token = await axiosClient.post('http://localhost:3000/api/get_access_token', {
      "agent_code": "charles",
      "secret_key": "10fe82adb964fa73c3c60be251181c421193f56ae01ba671974d82365a08a410"
    })
    console.log('token', token);
    let res = await axiosClient.post(`http://localhost:3000/cricket-score/match/${matchId}/ball-by-ball`, {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudGlkIjoic3MyNDciLCJkYXRldGltZSI6MTY5NzExMzQyMzExOSwiaWF0IjoxNjk3MTEzNDIzfQ.PeNXBiNNil9ajXx_cnZOTDtHdBGC5VhoAKHBNtx6KrU"
    });
    let response = await axiosClient.post(`http://localhost:3000/cricket-score/match/${matchId}/over-summary`,{});
    console.log('response', response)


    // let resp = await axiosClient.post(`http://localhost:3000/cricket-score/match/getscore/${matchId}`,{});
    // console.log('resp', resp)
  }, []);

  useEffect(() => {
    if (dataFrom === "api") {
      setTeams([{ ...matchData.team1 }, { ...matchData.team2 }]);
      const bet_inn = matchData.innings?.[0]; //matchData.innings?.[matchData.innings?.length-1];
      const bet_con = bet_inn?.team_id === matchData.team1?.team_id;
      const bowl_inns = matchData.innings?.slice(1);

      data = {
        betting_team: {
          team_id: bet_inn?.team_id,
          team_name: bet_con
            ? matchData.team1?.team_key?.length > 4 ? matchData.team1?.name : matchData.team1?.team_key
            : matchData.team2?.team_key?.length > 4 ? matchData.team2?.name : matchData.team2?.team_key,
          score: bet_inn?.score || "00",
          wickets: bet_inn?.wickets || 0,
          overs: bet_inn?.overs || "0.0",
        },
        bowling_team: {
          team_id: !bet_con
            ? matchData.team1?.team_key
            : matchData.team2?.team_key,
          team_name: !bet_con
            ? matchData.team1?.team_key?.length > 4 ? matchData.team1?.name : matchData.team1?.team_key
            : matchData.team2?.team_key?.length > 4 ? matchData.team2?.name : matchData.team2?.team_key,
          run_detail: bowl_inns,
        },
        toss: matchData.toss,
        run_rate: matchData.innings?.[0]?.run_rate,
        batsmen: [
          { ...matchData.partnership?.player_1 },
          { ...matchData.partnership?.player_2 },
        ],
        bowler: matchData.bowler,
      };
    } else if (dataFrom === "socket") {
      const bat_con = matchData?.batting_team === matchData?.team_a?.name;

      let striker = {
        balls: matchData?.striker?.score?.balls,
        dismissed: matchData?.striker?.score?.dismissed,
        fours: matchData?.striker?.score?.fours,
        is_striker: true,
        player_name: matchData?.striker?.name,
        runs: matchData?.striker?.score?.runs,
        sixes: matchData?.striker?.score?.sixes,
        strike_rate: matchData?.striker?.score?.strike_rate,
      };

      let non_striker = {
        balls: matchData?.nonstriker?.score?.balls,
        dismissed: matchData?.nonstriker?.score?.dismissed,
        fours: matchData?.nonstriker?.score?.fours,
        is_striker: false,
        player_name: matchData?.nonstriker?.name,
        runs: matchData?.nonstriker?.score?.runs,
        sixes: matchData?.nonstriker?.score?.sixes,
        strike_rate: matchData?.nonstriker?.score?.strike_rate,
      };

      data = {
        status: matchData.status,
        betting_team: {
          team_id: teams.find((_) => _.name === matchData.batting_team)?.team_id,
          team_name: teams.find((_) => _.name === matchData.batting_team)?.team_key?.length > 4 ? teams.find((_) => _.name === matchData.batting_team)?.name : teams.find((_) => _.name === matchData.batting_team)?.team_key,
          score: bat_con
            ? matchData?.team_a?.innings_1?.runs
            : matchData?.team_b?.innings_1?.runs || "00",
          wickets: bat_con
            ? matchData?.team_a?.innings_1?.wickets
            : matchData?.team_b?.innings_1?.wickets || 0,
          overs: bat_con
            ? matchData?.team_a?.innings_1?.overs
            : matchData?.team_b?.innings_1?.overs || "0.0",
        },
        bowling_team: {
          team_id: teams.find((_) => _.name === matchData.bowling_team)?.team_id,
          team_name: teams.find((_) => _.name === matchData.bowling_team)?.team_key?.length > 4 ? teams.find((_) => _.name === matchData.bowling_team)?.name : teams.find((_) => _.name === matchData.bowling_team)?.team_key,
          run_detail: !bat_con
            ? matchData?.team_a?.innings_1
              ? [matchData?.team_a?.innings_1]
              : []
            : matchData?.team_b?.innings_1
              ? [matchData?.team_b?.innings_1]
              : [],
        },
        toss: matchData?.toss,
        last_overs: matchData?.last_overs?.[0]?.[1],
        run_rate: matchData?.run_rate,
        batsmen: [{ ...striker }, { ...non_striker }],
        bowler: matchData?.bowler?.name
          ? {
            player_name: matchData?.bowler?.name,
            economy: matchData?.bowler?.score?.economy,
            maiden_overs: matchData?.bowler?.score?.maiden_overs,
            overs: matchData?.bowler?.score?.overs,
            runs: matchData?.bowler?.score?.runs,
            wickets: matchData?.bowler?.score?.wickets,
          }
          : {
            player_name: displayData?.bowler?.name,
            economy: displayData?.bowler?.score?.economy,
            maiden_overs: displayData?.bowler?.score?.maiden_overs,
            overs: displayData?.bowler?.score?.overs,
            runs: displayData?.bowler?.score?.runs,
            wickets: displayData?.bowler?.score?.wickets,
          },
        required_run_rate: matchData.required_run_rate,
        required_runs: matchData.required_runs,
        required_balls: matchData.required_balls
      };
    }
    setDisplayData({ ...data });
  }, [matchData]);

  const handleSocreBoard = () => {
    setIsOpen(() => !isOpen);
  };

  return (
    <div style={styleData.main_body} className='main_body'>
      <div className="container" style={styleData.container}>
        {displayData?.bowling_team?.run_detail?.[0]?.overs === '0.0'
          ? <div className="row first_line">
            <div className="left_img">
              <div className="bet_logo"></div>
            </div>
            <div className="left_team_name">
              <span style={{ textTransform: displayData?.betting_team?.team_name?.length > 4 ? 'capitalize' : 'uppercase' }}>{displayData?.betting_team?.team_name || ""}</span>
            </div>
            <div className="center_score">
              <h2>
                {displayData.betting_team?.score}-
                {displayData.betting_team?.wickets}{" "}
                <span>({displayData.betting_team?.overs} ov)</span>
              </h2>
            </div>
            <div className="right_team_name">
              <span style={{ textTransform: displayData?.betting_team?.team_name?.length > 4 ? 'capitalize' : 'uppercase' }}>{displayData?.bowling_team?.team_name || ""}</span>
            </div>
            <div className="right_img">
              <div className="ball_logo"></div>
            </div>
          </div>
          : <div className="row first_line">
            <div className="left_img">
              <div className="bet_logo"></div>
            </div>
            <div className="left_team">
              <div className="left_team_name">
                <span style={{ textTransform: displayData?.betting_team?.team_name?.length > 4 ? 'capitalize' : 'uppercase' }}>{displayData?.betting_team?.team_name || ""}</span>
              </div>
              <div className="team_score center_score">
                <h2>
                  {displayData.betting_team?.score}-
                  {displayData.betting_team?.wickets}{" "}
                  <span>({displayData.betting_team?.overs} ov)</span>
                </h2>
              </div>
            </div>
            <div className="vs_box">
              <span style={styleData.vs_box_span}>VS</span>
            </div>
            <div className="right_team">
              <div className="right_team_name">
                <span style={{ textTransform: displayData?.betting_team?.team_name?.length > 4 ? 'capitalize' : 'uppercase' }}>{displayData?.bowling_team?.team_name || ""}</span>
              </div>
              <div className="team_score center_score">
                {/* {displayData?.bowling_team?.run_detail?.map((ele, i) =>
                <>
                  <h2>{ele.score || ele.runs}-{ele.wickets} <span>({ele.overs} ov)</span></h2>
                  <span>{i !== displayData?.bowling_team?.run_detail?.length - 1 ? '&' : ''}</span>
                </>
              )} */}
                {
                  <>
                    <h2>
                      {displayData?.bowling_team?.run_detail?.[0]?.score || displayData?.bowling_team?.run_detail?.[0]?.runs}-
                      {displayData?.bowling_team?.run_detail?.[0]?.wickets}{" "}
                      <span>({displayData?.bowling_team?.run_detail?.[0]?.overs} ov)</span>
                    </h2>
                    {/* <span>{i !== displayData?.bowling_team?.run_detail?.length - 1 ? '&' : ''}</span> */}
                  </>
                }
              </div>
            </div>
            <div className="right_img">
              <div className="ball_logo"></div>
            </div>
          </div>
        }


        {/* <div className="row sec_line">
          <div className="left_team_name">
            <span>{displayData?.betting_team?.team_name || ""}</span>
          </div>
          <div className="bor_der"></div>
          <div className="vs_box">
            <span style={styleData.vs_box_span}>VS</span>
          </div>
          <div className="bor_der"></div>
          <div className="right_team_name">
            <span>{displayData?.bowling_team?.team_name || ""}</span>
          </div>
        </div> */}

        <div className="row third_line">
          <div className="leftteam">
            <table>
              {displayData.batsmen?.map((_) => (
                <tr className={`${_.is_striker ? "bold_team" : ""}`}>
                  <td>
                    {_.player_name}
                    {_.is_striker && _.player_name ? "*" : ""}
                  </td>
                  <td>{_.runs}</td>
                </tr>
              ))}
            </table>
          </div>
          <div className="run_board">
            <div className=" dotbox" style={styleData.dotbox}>
              {displayData.last_overs?.map((_) => (
                <span className="dot_box1">{_}</span>
              ))}
              {/* <span className="dot_box2">1LB</span>
                <span className="dot_box3">1</span>
                <span className="dot_box3">1</span>
                <span className="dot_box4"> </span>
                <span className="dot_box4"> </span> */}
            </div>
            {displayData.required_balls && displayData.required_runs
              ? <div className="required_run"><span>{`${displayData?.betting_team?.team_name} required ${displayData.required_runs} runs in ${displayData.required_balls} balls`}</span></div>
              : ''}
          </div>

          <div className="rightteam">
            <table>
              {displayData?.bowler?.player_name ? <tr>
                <td>
                  {displayData?.bowler?.player_name}
                </td>
                <td>
                  {`${displayData?.bowler?.overs} OV`}
                </td>
              </tr> : ''}
            </table>
          </div>
        </div>
        {/* <br></br> */}
        <div className="row four_line" style={styleData.four_line}>
          <div className="crr_text">
            <span>
              {displayData.toss} | {displayData.run_rate}
            </span>
          </div>
          <div className="scoreboard_text">
            <span>
              {/* Scorecard{" "} */}
              {!isOpen ? (
                <img
                  src={arrow_down}
                  onClick={handleSocreBoard}
                  alt="game_logo"
                  className="arrow"
                />
              ) : (
                <img
                  src={arrow_up}
                  onClick={handleSocreBoard}
                  alt="game_logo"
                  className="arrow"
                />
              )}
            </span>
          </div>
        </div>

        {isOpen ? (
          <div className="last_line">
            {/* <div className="live_prog">
              <span>
                {displayData.toss} | {displayData.run_rate}
              </span>
              <div></div>
            </div> */}
            {displayData?.required_run_rate || displayData?.status === 'result' ?
              <div className=" pro_box">
                <div className="live_circle" style={{ right: displayData?.status === 'result' ? '0%' : '49.5%' }}></div>
                <div className="live_tag" style={{ right: displayData?.status === 'result' ? '-0.5%' : '49%' }}>live</div>
                <CustomProgressBar
                  completed={displayData?.status === 'result' ? 100 : 50}
                  bgColor={styleData.progress_color}
                  baseBgColor="transparent"
                  height="1px"
                  labelColor="#e80909" />
              </div>
              : ''}
            <div className="table_box">
              <div className="bor_rig">
                <table className="table table-responsive bat_tab">
                  <tr>
                    <th>Batsman</th>
                    <th>R</th>
                    <th>B</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>SR</th>
                  </tr>
                  {displayData.batsmen?.map((_) => (
                    <tr>
                      <td>
                        {_.player_name}
                        {_.is_striker && _.player_name ? "*" : ""}
                      </td>
                      <td>{_.runs}</td>
                      <td>{_.balls}</td>
                      <td>{_.fours}</td>
                      <td>{_.sixes}</td>
                      <td>{_.strike_rate}</td>
                    </tr>
                  ))}
                </table>
              </div>
              <div className="separator"></div>
              <div className="bor_rig">
                <table className="table table-responsive ball_tab">
                  <tr>
                    <th>Bowler</th>
                    <th>O</th>
                    <th>M</th>
                    <th>R</th>
                    <th>W</th>
                    <th>ECO</th>
                  </tr>
                  <tr>
                    <td>
                      {displayData?.bowler?.player_name}
                      {/* {displayData?.bowler?.player_name} */}
                    </td>
                    <td>{displayData?.bowler?.overs}</td>
                    <td>{displayData?.bowler?.maiden_overs}</td>
                    <td>{displayData?.bowler?.runs}</td>
                    <td>{displayData?.bowler?.wickets}</td>
                    <td>{displayData?.bowler?.economy}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ScoreBoard;
