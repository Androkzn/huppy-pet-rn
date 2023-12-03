import { useContext, useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import { formatISO, subMonths, endOfToday, startOfDay, endOfDay } from "date-fns";
import { UserContext } from "../contexts/user.context";
import PageContainer from "../components/PageContainer.component";
import CustomDatePicker from "../components/CustomDatePicker.component";
import ModeAnalytics from "../components/ModeAnalytics.component";
import CategoryAnalytics from "../components/CategoryAnalytics.component";
import {ButtonText } from '../components/Buttons.components'

const Analytics = () => {
  // By default we would like to fetch the analytics for the last 1 month.
  // So we will take the fromDate as today minus 1 month and
  // the toDate as today.
  const today = endOfToday();
  const oneMonthAgo = subMonths(today, 1);
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(today);
  const { user } = useContext(UserContext);
  const [analyticsData, setAnalyticsData] = useState(null);

  const loadAnalytics = async () => {

  };

  useEffect(() => {
    loadAnalytics(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <div style={{ 
            
          }}> 
        <CustomDatePicker 
          label="From" 
          value={fromDate} 
          onChange={setFromDate} 
          style={{ 
            marginRight: "2rem",
            marginTop: "1rem",
          }} 
        />
        <CustomDatePicker 
          label="To" 
          value={toDate} 
          onChange={setToDate} 
          style={{ 
            marginRight: "2rem",
            marginTop: "1rem",
          }} 
        />
      </div>
      <ButtonText variant="login"  onClick={loadAnalytics} >GET STATISTIC</ButtonText>

      {analyticsData && <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ModeAnalytics data={analyticsData.modes} />
        </Grid>
        <Grid item xs={12} md={6}>
          <CategoryAnalytics data={analyticsData.categories} />
        </Grid>
      </Grid>}
    </PageContainer>
  );
}

export default Analytics;