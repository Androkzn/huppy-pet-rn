import { createContext, useState, useEffect } from "react";
import { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";
import request, { gql } from 'graphql-request';
import { GRAPHQL_ENDPOINT } from '../realm/constants';

// Creating a Realm App Instance
const app = new App(APP_ID);

// Creating a user context to manage and access all the user related functions
// across different component and pages.
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  let userId = ""
  let accessToken = ""

  // Function to login user into our Realm using their email & password
  const emailPasswordLogin = async (email, password) => {
    const credentials = Credentials.emailPassword(email, password);
    const authedUser = await app.logIn(credentials);
    setUser(authedUser);
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
    if (!app.currentUser) return false;
    try {
      await app.currentUser.refreshCustomData();
      // Now if we have a user we are setting it to our user context
      // so that we can use it in our app across different components.
      setUser(app.currentUser);
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
      loadUserProfiles();
  }, [user]);


  // GraphQL query to fetch all the meals for specific time interval
  const getProfiles = gql`
  query getProfiles($userId: String!) {
    profiles(query: { userId: $userId }) {
      _id
      avatar
      breed
      categories {
        _id
        color
        index
        name
        profileId
        percentage
        type
        userId
        weight
      }
      dailyPortion
      dailyRatio
      dob
      isCurrent
      name
      preset
      size
      userId
      weight
      activityType
      deductCalories 
    }
  }
  `;

  const loadUserProfiles = async () => {
    if (user) {
      userId = user.id
      accessToken = user._accessToken
      const headers = { Authorization: `Bearer ${accessToken}` }
      // Filter only current user related data 
      const queryVariablesProfiles = {
        "userId": userId,
      };
      
      try {
        const resp = await request(GRAPHQL_ENDPOINT, getProfiles, queryVariablesProfiles, headers);
        setProfiles(_ => resp.profiles.map(profile => ({ ...profile, key: profile._id })));
        const currentProfileFetched = resp.profiles.filter(profile => profile.isCurrent === true);
        setCurrentProfile(currentProfileFetched[0]);
      } catch (error) {
        console.error('Error loading profiles:', error);
      }
    }
  };



  return <UserContext.Provider value={{ user, currentProfile, profiles, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser}}>
    {children}
  </UserContext.Provider>;
}