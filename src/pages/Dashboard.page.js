import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import CategoryChart from "../components/CategoryChart.component";
import {ButtonText } from '../components/Buttons.components'
import * as styles  from '../components/styles/Dashboard.css'
import LoadingAndError from "../components/LoadingAndError.components"
import {useGetFoodForPeriod} from "../hooks/query.hooks"
import {Image} from '../components/Image.components'

const Analytics = () => {
  const [fromDate, setFromDate] = useState(Date());
  const [toDate, setToDate] = useState(Date());
  const {user, currentProfile, currentDate, setCurrentDate, isSmallScreen, isMediumlScreen} = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);

  const { data: food, isLoading: isLoadingFood, isError: isErrorFood} = useGetFoodForPeriod(user, currentProfile, fromDate, toDate);

 
  const loadAnalytics = async () => {

  };

  useEffect(() => {
    loadAnalytics(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step 1: Group data by date and calculate total calories
  const getChartData = () => {
    console.log("getChartData", food)
    if (!food || food.length === 0 ) return []

    // Step 1: Group data by date and calculate total calories
    const groupedData = food.reduce((result, currentItem) => {
      console.log("currentItem", currentItem)
      const date = new Date(currentItem.date).toLocaleDateString();
      console.log("date", date)
      const existingItem = result.find(item => item.category === date);
      console.log("existingItem", existingItem)
      if (existingItem) {
        existingItem.amount += currentItem.calories;
      } else {
        result.push({
          category: date,
          amount: currentItem.calories,
        });
      }
      console.log("result", result)
      return result;
    }, []);

    // Step 2: Sort the grouped data by date
    const sortedGroupedData = groupedData.sort((a, b) => new Date(a.category) - new Date(b.category));
  
    console.log("sortedGroupedData", sortedGroupedData)

    return sortedGroupedData
  }
 
  console.log("getChartData", getChartData())




  return (
    <PageContainer>
      <styles.SelectDateContainer>
        <div style={styles.rowStyle}> 
          <div style={styles.datePickerStyle}> 
          <CustomDatePicker 
            label="From" 
            value={fromDate} 
            onChange={setFromDate} 
          />
          </div>
          <div style={styles.datePickerStyle}> 
          <CustomDatePicker 
            label="To" 
            value={toDate} 
            onChange={setToDate} 
          />
        </div>
        </div>
        <div style={styles.rowStyle}> 
          <ButtonText 
              variant="login"  
              onClick={loadAnalytics} 
            >
              Get Statistic
          </ButtonText>
        </div>
        </styles.SelectDateContainer>
        {/* Chart section   */}
         {(isLoadingFood) || (isErrorFood)? 
          (
          <div>
            <div>
              <LoadingAndError isLoading = {isLoadingFood} isError = {isErrorFood}/>
            </div>
          </div>
          ) : 
          (
            <div style={styles.columnStyle}>
            { (!food || food.length === 0 )? 
              (
              <div>
                <div>
                  <Image 
                    imageName= {"no_data_placeholder.png"}
                    width={ "200"}
                    height={"170"}
                  />
                </div>
              </div>
              ) : 
              (
                <CategoryChart
                  data={getChartData()}
                  title = {"Calories"}
                />
              )}
              </div>
          )}
      
      
    </PageContainer>
  );
}

export default Analytics;