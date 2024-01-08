/** @jsxImportSource @emotion/react */

import Spiner from '../components/Spinner.components';
import { Image } from '../components/Image.components';

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '10px',
};

const LoadingAndError = ({
  isLoading, 
  isError, 
  placeholder = "general_error.png"
}) => {
 
  if (isLoading) {
    return (
      <div style={placeholderStyle}>
        <Spiner />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={placeholderStyle}>
        <Image imageName={placeholder} width="200" height="250" />
      </div>
    );
  }
};

export default LoadingAndError;
