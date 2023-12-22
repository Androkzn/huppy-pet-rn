import React, { useState } from "react";
import Chart from "react-google-charts";
import * as colors from './styles/Colors';
import {TitleAndToggle} from "./Form.components"

const StatisticBarChart = ({ data, title, goal }) => {
  const [showAverage, setShowAverage] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const average = data[0].average

  // Helper function that provides formated Date based on value of data entries
  const getFormatedDate= (date) => {
    if (data.length  < 9 ) {
      return date
    } 
    // Use a regular expression to capture the day part
    const match = date.match(/(\d+)/);
    // Check if a match is found and extract the day
    const day = match ? match[1] : null;
    console.log("day", day)
    return day
  }
 
  const chartData = [["", "", { role: 'annotation' }, "", ""]];
  let ticks = []
  let index = 1
  chartData.push([0, null, "", average, goal]);
  
  data.forEach(({ name, amount, average}) => {
    const anotation = amount === 0  || data.length > 10 ? null : amount
    chartData.push([index, amount, anotation, average, goal]);
    const date = getFormatedDate(name)
    console.log("date", date)
    ticks.push({ v: index, f: date });
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
      gridlines: {
        count: 0,
      },
    },
    animation: {
      startup: true,
      duration: 200,
      easing: 'in',
    },
    chartArea: {'width': '75%', 'height': '80%'},
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
    margin: "10x 0px 0px 0px",
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
      <Chart chartType="ComboChart" data={chartData} height={"320px"} options={options} />
      <div style={buttonContainerStyle}>
        {renderAverageToggle()}
        {renderGoalToggle()}
      </div>
    </>
  );
};

export default StatisticBarChart;
