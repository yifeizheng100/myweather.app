import React from "react";
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

import Button from "components/CustomButtons/Button.jsx";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Typography from "@material-ui/core/Typography";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import WeatherCard from "components/Weather/WeatherCard.jsx";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import mainStyle from "assets/jss/material-main-react/views/mainStyle.jsx";
const GroupedWeatherData = [];
const ChartSettings = {
  options: {
    axisX: {
      showGrid: false
    },
    low: 0,
    high: 30,
    chartPadding: {
      top: 0,
      right: 1,
      bottom: 0,
      left: 0
    }
  },
  responsiveOptions: [
    [
      "screen and (max-width: 640px)",
      {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function(value) {
            return value[0];
          }
        }
      }
    ]
  ],
  animation: {
    draw: function(data) {
      if (data.type === "bar") {
        data.element.animate({
          opacity: {
            begin: (data.index + 1) * 30,
            dur: 500,
            from: 0,
            to: 1,
            easing: "ease"
          }
        });
      }
    }
  },
  labels: [
    "00:00 AM",
    "03:00 AM",
    "06:00 AM",
    "09:00 AM",
    "12:00 AM",
    "03:00 PM",
    "06:00 PM",
    "09:00 PM"
  ]
};
const URI = "https://api.openweathermap.org/data/2.5/forecast";
class Main extends React.Component {
  state = {
    value: 0,
    didLoad: false,
    WeatherData: null,
    userShowIndex: 0,
    selectedId: 0,
    selectedData: {
      labels: [],
      series: [[]]
    },
    celsius: "c"
  };

  groupByDay(value, index, array) {
    let Splitted = value["dt_txt"].split(" ");
    GroupedWeatherData[Splitted[0]] = GroupedWeatherData[Splitted[0]] || [];
    GroupedWeatherData[Splitted[0]].push(value);
  }
  constructor(props) {
    super(props);
    this.handleShiftRight = this.handleShiftRight.bind(this);
    this.handleShiftLeft = this.handleShiftLeft.bind(this);
  }
  handleShiftRight() {
    let currentValue = parseInt(this.state.userShowIndex) + 1;
    this.setState({ userShowIndex: currentValue, selectedId: 0 });
  }
  handleShiftLeft() {
    let currentValue = parseInt(this.state.userShowIndex) - 1;
    this.setState({ userShowIndex: currentValue, selectedId: 0 });
  }
  handleCardClick(id) {
    // Local id
    if (this.state.selectedId !== id) {
      this.setState({ selectedId: id });
    }
  }
  handleMetricClick(event) {
    if (event.target.value === "f" && this.state.celsius === "c") {
      this.setState({ celsius: "f" });
    } else if (event.target.value === "c" && this.state.celsius === "f") {
      this.setState({ celsius: "c" });
    }
  }
  giveChartData(data) {
    if (!data) return null;

    let mainLabels = [...ChartSettings.labels];
    let mainData = [];
    let highest = 0,
      lowest = 0;
    if (data.length < 8) {
      let dateStr = data[0].dt_txt;
      let index = parseInt(dateStr.split(" ")[1].split(":")[0]) % 3;
      if (index !== 0) index--;
      mainLabels = mainLabels.slice(index, index + data.length);
    }
    data.forEach(elem => {
      let add = parseInt(elem.main.temp);
      if (this.state.celsius === "f") {
        add = add * 1.8 + 32;
      }
      if (add > highest) highest = add;
      if (lowest > add) lowest = add;
      mainData.push(add);
    });
    return {
      data: { labels: mainLabels, series: [mainData] },
      options: {
        axisX: {
          showGrid: false
        },
        low: lowest,
        high: highest,
        chartPadding: {
          top: 0,
          right: 1,
          bottom: 0,
          left: 0
        }
      }
    };
  }
  componentDidMount() {
    fetch(
      URI+"?q=Munich,de&units=metric&APPID=75f972b80e26f14fe6c920aa6a85ad57&cnt=40"
    )
      .then(response => response.json())
      .then(data => {
        data.list.map(this.groupByDay);
        this.setState({ didLoad: true, WeatherData: GroupedWeatherData });
      });
  }
  render() {
    const { classes } = this.props;

    // If nothing loaded, simply show the loading screen
    if (!this.state.didLoad) {
      return (
        <div className="loading-back" id="loadingPanel">
          <GridContainer>
            <div className="loading-indicator"></div>
            <h2 className="loading-text">Loading</h2>
          </GridContainer>
        </div>
      );
    }

    // Get data array and date array
    let WeatherDataArray = Object.values(this.state.WeatherData);
    let WeatherDateArray = Object.keys(this.state.WeatherData);
    let chartData = this.giveChartData(
      WeatherDataArray[this.state.selectedId + this.state.userShowIndex]
    );
    // Set disabled or enabled
    let leftDisabled = this.state.userShowIndex === 0 ? true : false;
    let rightDisabled = this.state.userShowIndex === 4 ? true : false;
    let chartObject = <div />;
    if (chartData) {
      chartObject = (
        <ChartistGraph
          className="ct-chart"
          data={chartData.data}
          type="Bar"
          options={chartData.options}
          responsiveOptions={ChartSettings.responsiveOptions}
          listener={ChartSettings.animation}
        />
      );
    }

    return (
      <div>
        <GridContainer align="center">
          <Typography variant="h3" align="center" style={{ marginTop: "20px" }} id="mainTitle">
            Weather in Munich
          </Typography>
        </GridContainer>
        <GridContainer>
          <FormControlLabel
            control={
              <Radio
                checked={this.state.celsius === "c"}
                onChange={this.handleMetricClick.bind(this)}
                value="c"
                color="primary"
                label="test"
                name="radio-button-demo"
                inputProps={{ "aria-label": "C" }}
              />
            }
            label="Celsius"
            className="formArea"
          />

          <FormControlLabel
            control={
              <Radio
                checked={this.state.celsius !== "c"}
                onChange={this.handleMetricClick.bind(this)}
                value="f"
                color="primary"
                name="radio-button-demo"
                inputProps={{ "aria-label": "F" }}
              />
            }
            label="Fahrenheit"
          />
        </GridContainer>

        <GridContainer>
          <GridItem xs={2} sm={1} md={1}>
            <Button
              color="primary"
              className="arrowClass"
              disabled={leftDisabled}
              justIcon
              onClick={this.handleShiftLeft}
            >
              <KeyboardArrowLeft className={classes.arrowCategory} />
            </Button>
          </GridItem>
          <GridItem xs={8} sm={10} md={10}>
            <GridContainer>
              <GridItem
                xs={12}
                sm={4}
                md={4}
                onClick={() => this.handleCardClick(0)}
              >
                <WeatherCard
                  WeatherData={WeatherDataArray[this.state.userShowIndex]}
                  DateText={WeatherDateArray[this.state.userShowIndex]}
                  Unit={this.state.celsius}
                />
              </GridItem>
              <GridItem
                xs={12}
                sm={4}
                md={4}
                onClick={() => this.handleCardClick(1)}
              >
                <WeatherCard
                  WeatherData={WeatherDataArray[this.state.userShowIndex + 1]}
                  DateText={WeatherDateArray[this.state.userShowIndex + 1]}
                  Unit={this.state.celsius}
                />
              </GridItem>
              <GridItem
                xs={12}
                sm={4}
                md={4}
                onClick={() => this.handleCardClick(2)}
              >
                <WeatherCard
                  WeatherData={WeatherDataArray[this.state.userShowIndex + 2]}
                  DateText={WeatherDateArray[this.state.userShowIndex + 2]}
                  Unit={this.state.celsius}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={2} sm={1} md={1}>
            <Button
              color="primary"
              className="arrowClass"
              justIcon
              disabled={rightDisabled}
              onClick={this.handleShiftRight}
            >
              <KeyboardArrowRight className={classes.arrowCategory} />
            </Button>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={2} />
          <GridItem xs={12} sm={12} md={8}>
            <Card chart>
              <CardHeader color="rose">{chartObject}</CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Hourly Details</h4>
                <p className={classes.cardCategory}>
                  You can find more information about the weather of that day, separated into hourly forecast
                </p>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={2} />
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(mainStyle)(Main);
