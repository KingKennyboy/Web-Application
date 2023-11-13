import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import './DisplayProfile.css'
import { useNavigate } from "react-router-dom";
import { useProfilesContext } from '../../hooks/useProfileContext'
import avatar from '../../assets/profile.png'
import convertToBase64 from "../../helper/convert";
import { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';

const DisplayProfile = () => {
  const { user } = useAuthContext();
  const [backendData, setbackendData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {dispatch} = useProfilesContext()
  const navigate = useNavigate();
  const [file, setFile]  = useState();

  const formik = useFormik({
    onSubmit: async values => {
      values = await Object.assign(values, { profile : file || ''})
      console.log(values)
    }
  })

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


  let userid = '';
  if (backendData.length > 0)
  (
    backendData.map((item) => 
    userid = item.user_id
    )
  )
  else
  (
    userid = user
  )

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    const localStorageKey = `profileImage_${userid}`;
    localStorage.setItem(localStorageKey, base64);
    setFile(base64);
  };
  
  useEffect(() => {
    const localStorageKey = `profileImage_${userid}`;
    const storedImage = localStorage.getItem(localStorageKey);
    if (storedImage) {
      setFile(storedImage);
    }
  }, [userid]);
  

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
            <div>   
              <div className='dProfile' key={item.user_id}>
              <img  src={file || avatar} className="profile-pic"alt="avatar"/>
              <input onChange={onUpload} type="file" id="profile" name="profile" accept="image/jpeg, image/png, image/jpg"/>
              <h6> <strong>Full Name: </strong>{item.fullName}</h6>
              <h6> <strong>Address 1:</strong> {item.address1}</h6>
              <h6> <strong>Address 2:</strong> {item.address2}</h6>
              <h6> <strong>City:</strong> {item.city}</h6>
              <h6> <strong>State:</strong> {item.state}</h6>
              <h6> <strong>Zipcode:</strong> {item.zipCode}</h6>
            </div>
          </div>
          ))
        )
      )}
    </div>
    
  );
};


export default DisplayProfile;