import { createContext, useState, useEffect } from "react";
import { App, Credentials } from "realm-web";
import { getUserProfiles  } from "../graphql/graphqlUtils";
import useMediaQuery from '@mui/material/useMediaQuery';
import * as Constants from "../helpers/Constants.helper"
import { useGetProfiles, useGetCurrentProfile } from "../hooks/query.hooks";

// Creating a Realm App Instance
 const app = new App(process.env.REACT_APP_APP_ID);
 
// Creating a user context to manage and access all the user related functions
// across different component and pages.
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState("home");
  const isSmallScreen = useMediaQuery(Constants.smallScreen);
  const isMediumlScreen = useMediaQuery(Constants.mediumlScreen);
  const isLargeScreen = useMediaQuery(Constants.largeScreen);

 
  const { data: profiles, isLoading: isLoadingProfiles, isError: isErrorProfiles} = useGetProfiles(user);
  const { data: currentProfile, isLoading: isLoadingProfile, isError: isErrorProfile} = useGetCurrentProfile(user);

    // Function to login user into our Realm using their email & password
  const emailPasswordLogin = async (email, password) => {
    const credentials = Credentials.emailPassword(email, password);
    const authedUser = await app.logIn(credentials);
    if (authedUser) {
      console.log("Set Login User", authedUser)
      setUser(authedUser);
    }  
    return authedUser;
  };


  // Function to signup user into our Realm using their email & password
  const emailPasswordSignup = async (email, password) => {
    try {
      await app.emailPasswordAuth.registerUser(email, password);
      // Since we are automatically confirming our users we are going to login
      // the user using the same credentials once the signup is complete.
      return emailPasswordLogin(email, password);
    } catch (error) {
      throw error;
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
      throw error;
    }
  }

  // Function to logout user from our Realm
  const logOutUser = async () => {
    if (!app.currentUser) return false;
    try {
      await app.currentUser.logOut();
      // Setting the user to null once loggedOut.
      setUser(null);
      return true;
    } catch (error) {
      throw error
    }
  }

  // Fetch profiles when user is fetched
  useEffect(() => {
      loadUserProfiles(user);
  }, [user]);

  const loadUserProfiles = async (user) => {
    return (user && currentProfile && profiles)
  };

  return <UserContext.Provider value={{ user, currentProfile, profiles, currentDate, setCurrentDate, isSmallScreen, isMediumlScreen, isLargeScreen, currentPage, setCurrentPage, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser, loadUserProfiles}}>
    {children}
  </UserContext.Provider>;
}