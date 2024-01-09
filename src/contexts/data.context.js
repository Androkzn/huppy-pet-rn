import { createContext, useState, useEffect } from 'react';
import { App, Credentials } from 'realm-web';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from '../helpers/Constants.helper';
import { useGetProfiles, useGetCurrentProfile } from '../hooks/query.hooks';

// Creating a Realm App Instance
const app = new App(process.env.REACT_APP_APP_ID);

// Creating a data context to manage and access data across different component and pages.
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState('home');
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const isMediumlScreen = useMediaQuery(Constants.mediumlScreen);
  const isLargeScreen = useMediaQuery(Constants.largeScreen);

  const {
    data: profiles,
    isLoading: isLoadingProfiles,
    isError: isErrorProfiles,
  } = useGetProfiles(user);

  const {
    data: currentProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useGetCurrentProfile(user);

  // Function to login user into our Realm using their email & password
  const emailPasswordLogin = async (email, password) => {
    const credentials = Credentials.emailPassword(email, password);
    try {
      const authedUser = await app.logIn(credentials);
      if (authedUser) {
        console.log('Set Login User', authedUser);
        setUser(authedUser);
        localStorage.removeItem('loginCredentials');
      }
      return authedUser;
    } catch (error) {
      setUser(null);
      // Check the error code to provide custom error messages
      if (error.statusCode === 401 && error.errorCode === 'InvalidPassword') {
        throw new Error(
          'Username or password is not correct. Please enter valid credentials.'
        );
      } else {
        // For other errors, you can provide a generic error message
        throw new Error('An error occurred during login. Please try again.');
      }
    }
  };

  // Function to signup user into our Realm using their email & password
  const emailPasswordSignup = async (email, password) => {
    try {
      await app.emailPasswordAuth.registerUser(email, password);
      // Since we are automatically confirming our users we are going to login
      // the user using the same credentials once the signup is complete.
      return emailPasswordLogin(email, password);
    } catch (error) {
      await logOutUser();
      // Check the error code to provide custom error messages
      if (error.statusCode === 409 && error.errorCode === 'AccountNameInUse') {
        throw new Error(
          'This username is alredy in use. Try another one or login with the credentials'
        );
      } else {
        // For other errors, you can provide a generic error message
        throw new Error('An error occurred during sign up. Please try again.');
      }
    }
  };

  // Function to fetch-user(if the user is already logged in) from local storage
  const fetchUser = async () => {
    if (!app.currentUser) return null;
    try {
      await app.currentUser.refreshCustomData();
      // Now if we have a user we are setting it to our user context
      // so that we can use it in our app across different components.
      if (app.currentUser) {
        setUser(app.currentUser);
      }
      return app.currentUser;
    } catch (error) {
      console.error('Error fetch user', error);
      throw error;
    }
  };

  // Function to logout user from our Realm
  const logOutUser = async () => {
    if (!app.currentUser) return false;
    localStorage.removeItem('loginCredentials');
    try {
      await app.currentUser.logOut();
      // Setting the user to null once loggedOut.
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error logout user', error);
      throw error;
    }
  };

  const deleteUserAccount = async () => {
    if (!app.currentUser) return false;
    try {
      await app.deleteUser(app.currentUser);
      // Setting the user to null once loggedOut.
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error logout user', error);
      throw error;
    }
  };

  // Fetch profiles when user is fetched
  useEffect(() => {
    loadUserProfiles(user);
  }, [user]);

  // Fetch profiles when user is fetched
  useEffect(() => {
    if (user?._accessToken === undefined || user?._accessToken === null) {
      console.log('User accessToken:', user?._accessToken);
      setUser(null);
    }
  }, [user?._accessToken]);

  const loadUserProfiles = async (user) => {
    return user && currentProfile && profiles;
  };

  return (
    <DataContext.Provider
      value={{
        user,
        currentProfile,
        profiles,
        currentDate,
        setCurrentDate,
        isSmallScreen,
        isMediumlScreen,
        isLargeScreen,
        currentPage,
        setCurrentPage,
        setUser,
        fetchUser,
        emailPasswordLogin,
        emailPasswordSignup,
        logOutUser,
        loadUserProfiles,
        deleteUserAccount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
