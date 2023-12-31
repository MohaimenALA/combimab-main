import React, { useEffect, useState } from 'react';
// import { useSearchParams, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';



const HCPRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    specialty: '',
  });
  const [userData, setUserData] = useState({});/** */
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Check if there is a token in local storage
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  console.log('Token:', token);

  useEffect(() => {
    console.log('Fetching user data...');
    
    const fetchUserData = async () => {
      if (!token) {
        console.log('No token found in URL parameters. Aborting fetch.');
        return;
      } 
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const response = await fetch('/api/userinfo', requestOptions);
        if (!response.ok) {
          let code = response.status.toString();
          throw new Error(`${code} ${response.statusText}`);
        }
        const userData = await response.json();
        
        console.log('User Data Received:', userData);
        console.log('Render - userData:', userData);


        setUserData(userData);
        setUserExists(true);
      } catch (e) {
        console.log('Error fetching user data:', e.message);
        localStorage.clear();
        //direct to login
      }
    };


    fetchUserData();
  }, [token]);

  useEffect(() => {
    console.log('formDataall:', formData);
  }, [formData]);

  useEffect(() => {
    // Update the form data when user data is available
    if (userExists) {
      setFormData((prevData) => ({
        ...prevData,
        name: userData.name || '',
        email: userData.email || '',
      }));
    }
  }, [userExists, userData]);

const isFormValid = () => {
  return (
    formData.phoneNumber.trim() !== '' &&
    !isNaN(formData.phoneNumber) && // Check if phone number contains only numbers
    formData.address.trim() !== '' &&
    formData.specialty.trim() !== ''
    );
  };

        
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all fields correctly before submitting.');
      return;
    }

    try {
      const {name,email, ...formDataWithoutName } = formData;
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithoutName),
      });

      if (response.ok) {
        setRegistrationSuccess(true);
      } else {
        console.error('Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  return (
    <div >
      {registrationSuccess ? (
        <div>
          <h2>Welcome, {formData.name}! </h2>
          <p>Your registration was successful. What would you like to do next?</p>
          <Link to="/InfusionSpecification">
            <button className="GUIDANCE">Infusion Information</button>
          </Link>
          <Link to="/TreatmentCalender">
            <button className="CALENDAR">Treatment Calendar</button>
          </Link>
          <Link to="/PreparationGuidance">
           <button className="GUIDANCE">Preperation Steps</button>
          </Link>
        </div>
      ) : (
        <div>
        {userExists && (
       
          <>
            <div>
              <label>Name:</label>
              <p>{formData?.name || 'Loading...'}</p>
              
            </div>
            <div>
              <label>Email:</label>
              <p>{formData?.email || 'Loading...'}</p>
            </div>
          </>
        )}
        <form onSubmit={handleSubmit}>
          <h2>Welcome to Combimab! Please fill in the details:</h2>
          <table className="dose-table">
            <tbody>
              <tr>
                <td>
                  <label>Phone Number:</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number (numbers only)"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Specialty:</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="Enter your specialty"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button type="submit" className="CALENDAR">
                    Register
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    )}
  </div>
);
};

export default HCPRegistration;