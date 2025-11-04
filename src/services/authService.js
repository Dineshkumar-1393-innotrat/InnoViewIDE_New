const API_BASE_URL = 'https://eureka.innotrat.in/api/v1/auth';

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: userData.name,
      countryCode: userData.countryCode || '+91',
      mobileNumber: userData.mobileNumber,
      password: userData.password
    })
  });
  
  return response.json();
};

export const signin = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      countryCode: credentials.countryCode || '+91',
      mobileNumber: credentials.mobileNumber,
      password: credentials.password
    })
  });

  return response.json();
};
