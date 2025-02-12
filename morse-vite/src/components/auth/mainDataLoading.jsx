import React from 'react';
import {Typography, Button, LinearProgress} from '@mui/material';

const MainDataLoading = ({error, errorDetails, reload}) => {
  let content = error.length > 0 ?
    <>
      <Typography color="error" variant="h6">
       Loading error
      </Typography>
      <Typography variant="body2">
       Error code: {error}
      </Typography>
      <Typography variant="body2">
      {errorDetails}
      </Typography>
      <Button onClick={reload} variant="outlined" color="error">
        retry
      </Button>
    </>
      :
    <>
      <Typography variant="body2">
      Loading account data
      </Typography>
      <LinearProgress color="secondary" />
    </>
    
  return (
  <div className="loading">
  <div className="message">
    {content}
  </div>
  </div>
  )
}

export default MainDataLoading
