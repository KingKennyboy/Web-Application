import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import './DisplayProfile.css'
import { useNavigate } from "react-router-dom";
import { useProfilesContext } from '../../hooks/useProfileContext'

const DisplayProfile = () => {
  const { user } = useAuthContext();
  const [backendData, setbackendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {dispatch} = useProfilesContext()
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('http://localhost:3001/profile', {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()
      console.log(json)
      setbackendData(json)
      setIsLoading(false);

      if (response.ok) {
        dispatch({type: 'SET_PROFILES', payload: json})
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [dispatch, user])

  return (
    <div className="container">
      <h2>Profile</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        Array.isArray(backendData) && backendData.length === 0 ? (
          navigate('/profileForm')
        ) : (
          backendData.map((item) => (
            <div className='dProfile' key={item.user_id}>
            <h6>Full Name: {item.fullName}</h6>
            <h6>address1: {item.address1}</h6>
            <h6>address2: {item.address2}</h6>
            <h6>city: {item.city}</h6>
            <h6>state: {item.state}</h6>
            <h6>zipCode: {item.zipCode}</h6>
          </div>
          ))
        )
      )}
    </div>
  );
};


export default DisplayProfile;