import React, { useState } from "react";
import Chart from "react-google-charts";
import * as colors from './styles/Colors';
import { ButtonText } from "./Buttons.components"
import {TitleAndToggle} from "./Form.components"
import { centerCrop } from "react-image-crop";
const StatisticBarChart = ({ data, title, goal }) => {
  const [showAverage, setShowAverage] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const average = data[0].average

  const chartData = [["", "", { role: 'annotation' }, "", ""]];
  let ticks = []
  let index = 1
  chartData.push([0, null, "", average, goal]);
  
  data.forEach(({ name, amount, average}) => {
    chartData.push([index, amount, amount, average, goal]);
    ticks.push({ v: index, f: name });
    index += 1
  });

  chartData.push([index, null, "", average, goal]);
  console.log("chartData", chartData)
  const options = {
    annotations: {
      textStyle: {
        fontSize: 11,
        fontName: "Balsamiq Sans", 
        bold: true, 
        color: colors.green, 
      },
    },
    titlePosition: 'none',
    title:title,
    titleTextStyle: {
      color: colors.green,
      fontName: "Balsamiq Sans",
      fontSize: 15,
      bold: true, 
    },
    legend: { position: "none" },
    colors: [colors.lightOrange],
    hAxis: {
      ticks: ticks,
      viewWindow: {
        min: 0.5,
        max: index - 0.5
      },
      textStyle: {
        color: colors.green,
        fontSize: 12, 
        fontName: "Balsamiq Sans", 
        bold: false,      
      },
    },
    vAxis: {
        textStyle: {
        color: colors.green,
        fontSize: 12, 
        fontName: "Balsamiq Sans", 
        bold: false,      
      },
    },
    animation: {
      startup: true,
      duration: 200,
      easing: 'in',
    },
    chartArea: {'width': '80%', 'height': '90%'},
    series: {
      0: { type: "bars" },
      1: { 
        type: showAverage ? "line" : "none", 
        color: showAverage ? colors.blue : "transparent", 
      }, // Show/hide average line based on state
      2: { 
        type: showGoal && goal!== 0 ? "line" : "none", 
        color: showGoal && goal!== 0 ? colors.lightGreen2 : "transparent", 
      },   // Show/hide goal line based on state
    },
    width:"100%",
    height:"100%",
    bar: {groupWidth: "65%"}
  };

  const Circle = ({ color }) => (
    <div
      style={{
        width: '30px',
        height: '15px',
        borderRadius: '5px',
        backgroundColor: color,
        marginRight: '10px', // Adjust the margin as needed
      }}
    />
  );

  const renderAverageToggle = () => {
    if (average !== 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Circle color={colors.blue} />
          <TitleAndToggle
            name={"average"}
            title={"Average"}
            onChange={() => setShowAverage(!showAverage)}
            initialValue={showAverage}
            containerStyle={containerToggleStyle}
            titleStyle={titleStyle}
          />
        </div>
      );
    }
    return null;
  };

 
  const renderGoalToggle = () => {
    if (goal !== 0) {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Circle color={colors.lightGreen2} />
          <TitleAndToggle
            name={"goal"}
            title={"Goal"}
            onChange={() => setShowGoal(!showGoal)}
            initialValue={showGoal}
            containerStyle={containerToggleStyle}
            titleStyle={titleStyle}
          />
        </div>
      );
    }
    return null;
  };


  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  };

  const chartTitleStyle = {
    color: colors.green, 
    fontWeight: "regular", 
    margin: "10px 0px 0px 0px",
    fontSize: "17px",
    fontFamily: "'Balsamiq Sans', sans-serif",
    fontWeight: "bold", 
  }

  const titleStyle = {
    color: colors.grayDark, 
    fontWeight: "regular", 
    margin: "0px 0px",
    fontSize: "15px",
    fontFamily: "'Balsamiq Sans', sans-serif",
  }
  const containerToggleStyle = {
    borderRadius: null,
    background: 'none', 
    margin: "0px",
    padding: "0px",
  }

  return (
    <>
      <div style={chartTitleStyle}>
        {title}
      </div>
      <Chart chartType="ComboChart" data={chartData} height={"350px"} options={options} />
      <div style={buttonContainerStyle}>
        {renderAverageToggle()}
        {renderGoalToggle()}
      </div>
    </>
  );
};

export default StatisticBarChart;
