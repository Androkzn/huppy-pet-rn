import { useContext, createContext, useState } from "react";
import { UserContext } from '../contexts/user.context';
import { GRAPHQL_ENDPOINT } from '../realm/constants';
import request, { gql } from 'graphql-request';

// Creating a profile context to manage and access all the user profile  related functions
// across different component and pages.
export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState([]);

  // // Fetching user details from UserContext
  const { user } = useContext(UserContext);
  // // Get the user's ID
  const userId = user.id;

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
    }
  }
  `;

  // Filter only current user related data 
  const queryVariablesProfiles = {
    "userId": userId,
  };

  const headers = { Authorization: `Bearer ${user._accessToken}` }

  const loadUserProfiles = async () => {
    const resp = await request(GRAPHQL_ENDPOINT,
      getProfiles,
      queryVariablesProfiles,
      headers
    );

    setProfiles(_ => resp.profiles.map(profile => ({ ...profile, key: profile._id })));
    const currentProfileFetched = resp.profiles.filter(profile => profile.isCurrent === true);
    setCurrentProfile(currentProfileFetched)
    console.log(profiles)
    console.log(currentProfile)
  };

  return <ProfileContext.Provider value={{ profiles, currentProfile, loadUserProfiles}}>
    {children}
  </ProfileContext.Provider>;
}