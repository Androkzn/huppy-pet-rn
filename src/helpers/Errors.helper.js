import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';
import { Image } from '../components/Image.components';
import { ButtonText } from '../components/Buttons.components';

const placeholderStyle = {
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  alignItems: 'center',
};

const containerStyle = {
  marginTop: 100,
};

const buttonContainerrStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: 15,
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.error(error); // Log the error to the console

  return (
    <div style={containerStyle}>
      <div style={placeholderStyle}>
        <h2>Something went wrong!</h2>
        <Image imageName={'general_error.png'} width="270" height="170" />
        <div style={buttonContainerrStyle}>
          <ButtonText variant="login" onClick={resetErrorBoundary} width={100}>
            Try again
          </ButtonText>
        </div>
      </div>
    </div>
  );
};

const LocalErrorBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
);

class GlobalErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: { message: '', stack: '' },
    info: { componentStack: '' },
  };

  static getDerivedStateFromError = (error) => {
    return { hasError: true };
  };

  componentDidCatch = (error, info) => {
    this.setState({ error, info });
  };

  render() {
    const { hasError, error, info } = this.state;
    const { children } = this.props;

    return hasError ? <ErrorFallback /> : children;
  }
}

export { GlobalErrorBoundary, LocalErrorBoundary };
