import React, { useContext } from "react";
import { GlobalContex } from "../globalContext";

const Planets = () => {
  const {
    wrapperRef,
    planets,
    selectedPlanet,
    pair,
    setShowRides,
    setSelectedPlanet,
    showRides,
    conditionalSelectedRide,
  } = useContext(GlobalContex);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 10vh",
          paddingTop: "5vh",
        }}
      >
        {planets.map((item, index) => {
          return (
            <div
              key={index}
              onMouseDown={(e) => e.stopPropagation()}
              className={
                selectedPlanet === item
                  ? "selectedPlanets"
                  : "notselectedPlanets"
              }
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                // opacity: pair?.length < 4  ? 1 : 0.3,
              }}
            >
              <img
                onClick={(e) => {
                  if (
                    pair.length < 4 &&
                    !pair.find((o) => o.planet === item.name)
                  ) {
                    setShowRides(true);
                    setSelectedPlanet(item);
                  }
                }}
                className={
                  pair.find((o) => o.planet === item.name)
                    ? "App-logo-selected"
                    : "App-logo"
                }
                src={require(`../assets/images/planets/${item?.name.toLowerCase()}.png`)}
                alt=""
              />

              <div
                style={{
                  fontWeight: 700,
                  fontSize: "20px",
                  paddingTop: "10px",
                }}
              >
                {item.name}
              </div>
              <div>Distance: {item.distance}</div>
              <div style={{ paddingTop: "20px" }}>
                {!showRides ? conditionalSelectedRide(item) : ""}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Planets;
