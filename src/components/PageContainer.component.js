/** @jsxImportSource @emotion/react */

import { Box, Paper, useTheme } from '@mui/material';
import React from 'react'

const PageContainer = (props) => {
  const theme = useTheme();

  // return (<Box sx={{ backgroundColor: theme.palette.grey[200] }}>
  //   <Paper sx={{ minWidth: "50rem", marginX: "auto", minHeight: "90vh", paddingX: "20px", paddingY: "10px" }}>
  //     {props.children}
  //   </Paper>
  // </Box>
  // )
  return (
    <div style={{margin: "0 20px" }}>
      {props.children}
  </div>
  )
}

export default PageContainer;
