import Chart from "react-google-charts";
import * as colors from '../components/styles/Colors';

const CategoryChart = ({ data, title }) => {
  const chartData = [["", ""]];
  data.forEach(({ category, amount }) => {
    chartData.push([category, amount]);
  });

  const targetValue = 1000
  const averageValue = 1500

  const options = {
    legend: { position: "none" },
    colors: [colors.lightOrange],
    trendlines: {
      0: {
        type: 'exponential',
        pointSize: 20,
        opacity: 0.6,
        pointsVisible: false
      },
      1: {
        type: 'linear',
        pointSize: 10,
        pointsVisible: true
      }
    }
  };

  
  return <>
    <h3>{title}</h3>
    <Chart
      chartType="Bar"
      data={chartData}
      width={"100%"}
      height={"300px"}
      options={options}
    />
  </>
}

export default CategoryChart;