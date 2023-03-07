import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";

import { GlobalContex } from "./globalContext";

import "./App.scss";

import NavBar from "./components/NavBar";
import Planets from "./components/Planets";
import Vehicles from "./components/Vehicles";

function App() {
  //States & Refs Declaration

  const wrapperRef = useRef();
  const [planets, setPlanets] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const [totalTime, setTotalTime] = useState(0);
  const [result, setResult] = useState(null);

  const [showRides, setShowRides] = useState(false);
  const [pair, setpair] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState();

  //Custom Hook

  function useOutsideClickListener(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowRides(false);
          setSelectedPlanet(null);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideClickListener(wrapperRef);

  // useEffects

  useEffect(() => {
    axios.get(`https://findfalcone.herokuapp.com/planets`).then((res) => {
      setPlanets(res.data);
    });
    axios.get(`https://findfalcone.herokuapp.com/vehicles`).then((res) => {
      setVehicles(res.data);
    });
  }, []);

  useEffect(() => {
    pair.map((item) => {
      updateTime(item.distance, item.speed);
    });
    if (pair.length === 4) {
      setShowRides(false);
      setSelectedPlanet(null);
    }
  }, [pair]);

  // Functions

  const updateUnit = (item) => {
    const found = vehicles.find((obj) => obj.name == item.name || item.planet);
    if (found) {
      found.total_no = found.total_no - 1;
      setVehicles([...vehicles]);
    }
  };

  useEffect(() => {
    if (selectedPlanet !== null) {
      var tempResource = 4;
      vehicles.map((item) => {
        if (
          item.max_distance < selectedPlanet.distance ||
          item.total_no === 0
        ) {
          tempResource = tempResource - 1;
        }
      });
      setResources(tempResource);
    }
  }, [selectedPlanet]);

  const updateTime = (distance, speed) => {
    const time = Number(distance) / Number(speed);
    setTotalTime(totalTime + time);
  };

  const getToken = () => {
    setLoading(true);
    axios
      .post(
        `https://findfalcone.herokuapp.com/token`,
        {},
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data.token);
        // setToken(res.data.token)
        if (res.data.token) {
          handleSearch(res.data.token);
        }
      });
  };

  const handleSearch = (token) => {
    axios
      .post(
        `https://findfalcone.herokuapp.com/find`,
        {
          token: token,
          planet_names: pair.map((item) => {
            return item.planet;
          }),

          vehicle_names: pair.map((item) => {
            return item.vehicle;
          }),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data, "showresult");
        setResult(res.data);
        setLoading(false);
      });
  };

  //Conditional UI Renders

  const conditionalSelectedRide = (item) => {
    const found = pair.find((o) => o.planet === item.name);
    if (found) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            // className="App-logo"
            src={require(`./assets/images/vehicles/${found.vehicleMax}.jpeg`)}
            alt=""
            style={{ width: "50px", height: "150px" }}
          />
          <div
            style={{ fontWeight: 700, fontSize: "20px", paddingTop: "10px" }}
          >
            {found.vehicle}
          </div>
          <div>Speed: {found.speed}</div>
        </div>
      );
    }
  };

  const conditionalDiv = () => {
    if (result?.status !== "false" && result !== null) {
      return (
        <div className="resultSection">
          <img
            className="App-logo-final"
            src={require(`./assets/images/planets/${result?.planet_name?.toLowerCase()}.png`)}
            alt=""
          />

          <br />
          <div style={{ fontWeight: 600, textAlign: "center" }}>
            Success! Congratulations on Finding Falcone.
            <br />
            King Shan is mightly pleased.
          </div>
          <br />
          <div style={{ fontSize: "20px" }}>
            Time Taken: <b>{totalTime}</b> Days
          </div>
          <div style={{ fontSize: "20px" }}>
            Planet Found: <b>{result.planet_name}</b>
          </div>
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="submitButton"
              onClick={(e) => window.location.reload()}
            >
              Start Again
            </div>
          </div>
        </div>
      );
    } else if (result?.status === "false" && result !== null) {
      return (
        <div className="resultSection">
          <img
            className="App-logo-failed"
            src={require(`./assets/images/loading.jpeg`)}
            alt=""
          />

          <br />
          <div style={{ fontWeight: 600, textAlign: "center" }}>
            Mission Failed! Falcone is yet to be found.
            <br />
            You have lost {totalTime} days
            <br />
            King Shan is waiting.
          </div>

          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              className="submitButton"
              onClick={(e) => window.location.reload()}
            >
              Start Again
            </div>
          </div>
        </div>
      );
    } else {
      return !loading ? (
        <>
          <Planets />
          <Vehicles />
          <div
            style={{
              position: "absolute",
              bottom: "60px",
              left: window.innerWidth / 2 - 80,
            }}
          >
            {pair.length === 4 && !showRides ? (
              <div className="submitButton" onClick={getToken}>
                <div>Find Falcone!</div>
              </div>
            ) : (
              ""
            )}
          </div>
        </>
      ) : (
        <div
          className="loading"
          style={{
            height: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={require("./assets/images/loading.jpeg")}
            alt=""
            width="200px"
          />
          <div
            style={{ fontSize: "20px", fontWeight: "700", paddingTop: "20px" }}
          >
            Finding Falcone ...
          </div>
        </div>
      );
    }
  };

  // context values

  const value = {
    planets,
    setPlanets,
    vehicles,
    setVehicles,
    totalTime,
    selectedPlanet,
    pair,
    setpair,
    showRides,
    setShowRides,
    setSelectedPlanet,
    conditionalSelectedRide,
    wrapperRef,
    updateUnit,
    resources,
    setResources,
  };

  return (
    <GlobalContex.Provider value={value}>
      <div className="App">
        <div className="nav">
          <NavBar />
        </div>
        {conditionalDiv()}
      </div>
    </GlobalContex.Provider>
  );
}

export default App;
