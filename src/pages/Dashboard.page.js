import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import ModeAnalytics from "../components/ModeAnalytics.component";
import CategoryAnalytics from "../components/CategoryAnalytics.component";
import {ButtonText } from '../components/Buttons.components'
import * as Styles  from '../components/styles/Dashboard.css'

const Analytics = () => {
  const [fromDate, setFromDate] = useState(Date());
  const [toDate, setToDate] = useState(Date());
  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadAnalytics = async () => {

  };

  useEffect(() => {
    loadAnalytics(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Styles.SelectDateContainer>
        <div style={Styles.rowStyle}> 
          <div style={Styles.datePickerStyle}> 
          <CustomDatePicker 
            label="From" 
            value={fromDate} 
            onChange={setFromDate} 
          />
          </div>
          <div style={Styles.datePickerStyle}> 
          <CustomDatePicker 
            label="To" 
            value={toDate} 
            onChange={setToDate} 
          />
        </div>
       </div>
       <div style={Styles.rowStyle}> 
      <ButtonText 
          variant="login"  
          onClick={loadAnalytics} 
        >
          GET STATISTIC
      </ButtonText>
      </div>
      </Styles.SelectDateContainer>
      
    </PageContainer>
  );
}

export default Analytics;