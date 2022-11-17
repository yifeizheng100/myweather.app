import React from "react";
import { shallow, mount } from "enzyme";
import WeatherCard from "./components/Weather/WeatherCard.jsx";

const mock =  {
  dt: 1560643200,
  dt_txt: "2019-06-16 00:00:00",
  main: {
     temp: 14.72, temp_min: 14.72, temp_max: 15.93, pressure: 1018.52, sea_level: 1018.52, humidity: 92
   },
   weather: [ {description: "scattered clouds", icon: "03n",id: 802,main: "Clouds"} ]
};

describe("Weather Card ", () => {
  it("renders without crashing", () => {
    shallow(<WeatherCard
      WeatherData={ [mock,mock]}
      DateText={"2019-06-16"}
      Unit="c" />);
  });
  it("translates the correct day", () => {
  const wrapper = mount(shallow(<WeatherCard
      WeatherData={ [mock]}
      DateText={"2019-06-16"}
      Unit={"c"} />).get(0));
  expect(wrapper.state("wDay")).toEqual("Sunday");
  });
  it("shows the correct tempature conversion", () => {
  const wrapper = mount(shallow(<WeatherCard
      WeatherData={ [mock]}
      DateText={"2019-06-16"}
      Unit={"f"} />).get(0));
  expect(wrapper.state("wDegree")).toEqual(57);
  });
  it("gets the correct humidity level", () => {
  const wrapper = mount(shallow(<WeatherCard
      WeatherData={ [mock]}
      DateText={"2019-06-16"}
      Unit={"f"} />).get(0));
  expect(wrapper.state("wHumidity")).toEqual(92);
  });
  it("displays the correct data", () => {
  const wrapper = mount(shallow(<WeatherCard
      WeatherData={ [mock]}
      DateText={"2019-06-16"}
      Unit={"c"} />).get(0));
  expect(wrapper.text()).toEqual("2019-06-16Sunday, 14 °CClouds 92% Humidity");
  });
});
