import React from "react";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Opacity from "@material-ui/icons/Opacity";
import Card from "../Card/Card.jsx";
import CardHeader from "../Card/CardHeader.jsx";
import CardIcon from "../Card/CardIcon.jsx";
import CardFooter from "../Card/CardFooter.jsx";


import mainStyle from "assets/jss/material-main-react/views/mainStyle.jsx";

const TEMP_LIMIT_CELC = 15;

class WeatherCard extends React.Component {
  state = {
    wColor: "danger",
    wIcon: "1",
    wDate: "00.00.1984",
    wDay: "Friyay",
    wDegree: 1000,
    wMetric: "c",
    wHumidity: "1000",
    wDetail: "Brainstorm",
    chunkData: [],
    IsVisible: true
  };

  constructor(props){
    super();
    //console.log(props);
    if (props) {
      this.state = { ...this.state, chunkData: props.WeatherData, wDate: props.DateText, wMetric: props.Unit };
      this.SetupCard(false);
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.DateText !== this.props.DateText || prevProps.Unit !== this.props.Unit) {
      let tempTotal = 0;
      let humTotal = 0;
      let data = this.props.WeatherData;
      if(typeof data === "undefined") {
        this.setState({ ...this.state, IsVisible: false });
        return;
      }

      let day = new Date(this.props.DateText).getDay();
      day = this.getDay(day);

      data.forEach( (elem) => {
        if(elem.main.temp) {
          let add = parseInt(elem.main.temp);
          if(this.props.Unit === "f"){ add = (add * 1.8) + 32; }
          tempTotal += add;
        }
        if(elem.main.humidity) humTotal += parseInt(elem.main.humidity);
       });
      let weatherID = parseInt(data[0].weather[0].id);
      let weatherIcon = this.getIcon(weatherID);

      let avgTemp = parseInt(tempTotal/data.length);
      let avgHum = parseInt(humTotal/data.length);
      let weatherColor = this.getColor(avgTemp , !(this.props.Unit === "f") );
      this.setState({ wDegree: avgTemp, wDay: day, wDetail: data[0].weather[0].main, wIcon: weatherIcon, wColor: weatherColor, wHumidity: avgHum,wDate: this.props.DateText, IsVisible: true, wMetric:this.props.Unit  });
    }
 }
  getColor(avgTemp,celc){
    let avgAdjust = TEMP_LIMIT_CELC;
    if(!celc){
      avgAdjust = (avgAdjust*1.8) + 32;
    }

    if (avgTemp>avgAdjust){
      return "warning";
    } else if (avgTemp<0){
      return "primary";
    } else {
      return "info";
    }
  }
  getIcon(weatherID){
    if (weatherID === 800) {  //Clear
      return "B";
    } else if (weatherID === 802) {
      return "H";
    } else if (weatherID > 802) {
      return "Y";
    } else if (weatherID > 800) {
      return "N";
    } else if (weatherID === 701) {
      return "J";
    } else if (weatherID > 700) {
      return "M";
    } else if (weatherID > 600) {
      return "W";
    } else if (weatherID > 502) {
      return "Z";
    } else if (weatherID >= 500) {
      return "R";
    } else {
      return "N";
    }
  }
  getDay(day){
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        break;
    }
  }
  SetupCard(){
    let tempTotal = 0;
    let humTotal = 0;
    let data = this.state.chunkData;
    let day = new Date(this.state.wDate).getDay();
    day = this.getDay(day);
    if(!data)  return;
    data.forEach( (elem) => {
      if(elem.main.temp) {
        let add = parseInt(elem.main.temp);
        if(this.state.wMetric === "f"){ add = (add * 1.8) + 32; }
        tempTotal += add;
      }
      if(elem.main.humidity) humTotal += parseInt(elem.main.humidity);
     });
    let weatherID = parseInt(data[0].weather[0].id);
    let weatherIcon = this.getIcon(weatherID);

    let avgTemp = parseInt(tempTotal/data.length);
    let avgHum = parseInt(humTotal/data.length);
    let weatherColor = this.getColor(avgTemp , !(this.state.wMetric === "f") );
    this.state = { ...this.state, wDegree: avgTemp, wDay: day, wDetail: data[0].weather[0].main, wIcon: weatherIcon, wColor: weatherColor, wHumidity: avgHum };
  }
  render() {
    const { classes } = this.props;

    if (!this.state.IsVisible) {
      return ( <div/>);
    }

    return (
      <div className="weatherFancy">
        <Card>
          <CardHeader color={this.state.wColor} stats icon>
            <CardIcon color={this.state.wColor} className="weather-icon-holder">
              <a href="#" className="weather-icon" data-icon={this.state.wIcon}></a>
            </CardIcon>
            <p className={classes.cardCategory}>{this.state.wDate}</p>
            <h3 className={classes.cardTitle}>
            {this.state.wDay}, {this.state.wDegree} &#176;{typeof (this.state.wMetric) !== "undefined"? (this.state.wMetric).toUpperCase():""}
            </h3>
          </CardHeader>
          <CardFooter stats>
          <h4 className={classes.cardTitle}>{this.state.wDetail}</h4>
          <p className={classes.cardCategory}>
            <span className="humidityText">
              <Opacity className={classes.subIconCategory} /> {this.state.wHumidity}%
            </span>{" "}
            Humidity
          </p>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default withStyles(mainStyle)(WeatherCard);
