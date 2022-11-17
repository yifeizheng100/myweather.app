import React from "react";
import { shallow, mount } from "enzyme";
import MainPage from "views/Main/Main.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";

  jest.setTimeout(30000);

describe("Main Page testing, ", () => {
  it("renders without crashing", () => {
    shallow(<MainPage />);
  });

  it('checks if loading works',()=>{
      const wrapper = mount(shallow(<MainPage />).get(0));
      expect(wrapper.state("didLoad")).toEqual(false);
  });

  it('checks data fetch ',  (done) => {
    const wrapper = mount(shallow(<MainPage />).get(0));
    jest.setTimeout(21000);
    setTimeout(() => {
       expect(wrapper.state("didLoad")).toEqual(true);
       expect(wrapper.state("WeatherData")).not.toEqual(null);
       done();
     }, 20000);
  });
});
