// const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';
// const DYTE_BASE_URL = 'https://api.dyte.io/v2';

// // Your Dyte organization credentials
// const DYTE_ORG_ID = '515405af-09c7-4735-87f8-33598a6768ca';
// const DYTE_API_KEY = '9013fe7c3787ae5e06a9';

// // Base64 encode the org_id:api_key
// const DYTE_AUTH_TOKEN = btoa(`${DYTE_ORG_ID}:${DYTE_API_KEY}`);

// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'API request failed');
//   }
//   return response.json();
// };

// export const requestDyteSession = async ({
//   title,
//   participantName,
//   meetingPreset = 'group_call_participant',
//   clientId = `user_${Date.now()}`,
// }) => {
//   try {
//     // Step 1: Create a meeting
//     const createMeetingResponse = await fetch(`${EUREKA_BASE_URL}/create-meeting`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title: title || `Meeting_${Date.now()}` }),
//     }).then(handleResponse);

//     if (!createMeetingResponse?.meeting_id) {
//       throw new Error('Failed to get meeting ID from response');
//     }

//     const meetingId = createMeetingResponse.meeting_id;

//     // Step 2: Get participant token with corrected payload structure
//     const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({
//         meetingId: meetingId,
//         name: participantName || 'Anonymous',
//         preset_name: meetingPreset,
//         client_specific_id: clientId
//       }),
//     });

//     // Specific error handling for participant token
//     if (!participantResponse.ok) {
//       const errorData = await participantResponse.json().catch(() => ({}));
//       throw new Error(errorData.message || `Participant token request failed: ${participantResponse.status}`);
//     }

//     const tokenData = await participantResponse.json();

//     if (!tokenData?.token) {
//       throw new Error('No token received from participant token endpoint');
//     }

//     return {
//       meetingId,
//       meetingTitle: title,
//       authToken: tokenData.token,
//     };
//   } catch (error) {
//     console.error('Dyte session request failed:', error);
//     throw new Error(`Failed to setup Dyte session: ${error.message}`);
//   }
// };

// export const createDytePreset = async (presetName, config) => {
//   const response = await fetch(`${DYTE_BASE_URL}/presets`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Basic ${DYTE_AUTH_TOKEN}`,
//     },
//     body: JSON.stringify({
//       name: presetName,
//       ...config,
//     }),
//   }).then(handleResponse);

//   return response;
// };

// // Default preset configuration
// export const DEFAULT_PRESET_CONFIG = {
//   view_type: 'GROUP_CALL',
//   max_video_streams: {
//     mobile: 4,
//     desktop: 9,
//   },
//   media: {
//     video: { quality: 'hd', frame_rate: 30 },
//     audio: { enable_stereo: false },
//   },
//   permissions: {
//     // Add your permissions configuration here
//     chat: { public: { can_send: true }, private: { can_send: true } },
//     media: {
//       video: { can_produce: 'ALLOWED' },
//       audio: { can_produce: 'ALLOWED' },
//     },
//   },
// };


// ===============================
// Dyte Service Integration
// ===============================
//https://eureka.innotrat.in/api/v1//
// // ---- API BASE URLs ----
// const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';
// const DYTE_BASE_URL = 'https://api.dyte.io/v2';

// // ---- Dyte Organization Credentials ----
// const DYTE_ORG_ID = '515405af-09c7-4735-87f8-33598a6768ca';
// const DYTE_API_KEY = '9013fe7c3787ae5e06a9';

// // ---- Generate Dyte Auth Token ----
// const DYTE_AUTH_TOKEN = btoa(`${DYTE_ORG_ID}:${DYTE_API_KEY}`);

// // ---- Common Response Handler ----
// const handleResponse = async (response) => {
//   const data = await response.json().catch(() => ({}));
//   if (!response.ok) {
//     throw new Error(
//       data.message || `API request failed with status ${response.status}`
//     );
//   }
//   return data;
// };

// // ===============================
// // Create Dyte Session
// // ===============================
// export const requestDyteSession = async ({
//   title = `Meeting_${Date.now()}`,
//   participantName = 'John Doe',
//   meetingPreset = 'group_call_host',
//   clientId = `user_${Date.now()}`,
// }) => {
//   try {
//     // --- Step 1: Create a Meeting ---
//     const meetingPayload = { title };
//     const createMeetingResponse = await fetch(`${EUREKA_BASE_URL}/create-meeting`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(meetingPayload),
//     }).then(handleResponse);

//     console.log('🧾 Create meeting API response:', createMeetingResponse);

//     // ✅ Extract meetingId correctly (from your actual response)
//     const meetingId = createMeetingResponse?.data?.id;

//     if (!meetingId) {
//       throw new Error('No meeting_id returned from create-meeting API');
//     }

//     console.log('✅ Meeting created successfully:', meetingId);

//     // --- Step 2: Get Participant Token ---
//     const tokenPayload = {
//       meetingId,
//       name: participantName,
//       preset_name: meetingPreset,
//       client_specific_id: clientId,
//     };

//     const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(tokenPayload),
//     }).then(handleResponse);

//     const token = participantResponse?.data?.token;
//     if (!token) throw new Error('No token received from get-participant-token API');

//     console.log('✅ Participant token received successfully');

//     return {
//       meetingId,
//       meetingTitle: title,
//       participantName,
//       authToken: token,
//       presetUsed: meetingPreset,
//     };
//   } catch (error) {
//     if (error.message.includes('Failed to fetch')) {
//       console.error('🌐 Network Error: Backend unreachable.');
//       throw new Error(
//         'Failed to create Dyte session: Unable to reach backend server. Please check your internet or VPN connection.'
//       );
//     }

//     console.error('❌ Dyte session setup failed:', error);
//     throw new Error(`Failed to create Dyte session: ${error.message}`);
//   }
// };


// // ===============================
// // Create Dyte Preset (optional)
// // ===============================
// export const createDytePreset = async (presetName, config = {}) => {
//   try {
//     const response = await fetch(`${DYTE_BASE_URL}/presets`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Basic ${DYTE_AUTH_TOKEN}`,
//       },
//       body: JSON.stringify({
//         name: presetName,
//         ...config,
//       }),
//     }).then(handleResponse);

//     console.log('✅ Preset created successfully:', response);
//     return response;
//   } catch (error) {
//     console.error('❌ Failed to create Dyte preset:', error);
//     throw new Error(`Failed to create Dyte preset: ${error.message}`);
//   }
// };

// // ===============================
// // Default Preset Config
// // ===============================
// export const DEFAULT_PRESET_CONFIG = {
//   view_type: 'GROUP_CALL',
//   max_video_streams: {
//     mobile: 4,
//     desktop: 9,
//   },
//   media: {
//     video: { quality: 'hd', frame_rate: 30 },
//     audio: { enable_stereo: false },
//   },
//   permissions: {
//     chat: {
//       public: { can_send: true },
//       private: { can_send: true },
//     },
//     media: {
//       video: { can_produce: 'ALLOWED' },
//       audio: { can_produce: 'ALLOWED' },
//     },
//   },
// };

// // ===============================
// // Example Usage (Test Function)
// // ===============================
// // You can remove this before production
// export const testDyteSession = async () => {
//   try {
//     const session = await requestDyteSession({
//       title: 'MeetingTesting2509',
//       participantName: 'John Doe',
//       meetingPreset: 'group_call_participant',
//     });
//     console.log('🎥 Dyte Session Ready:', session);
//   } catch (err) {
//     console.error('⚠️ Test session failed:', err.message);
//   }
// };


//10-11-25


// const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';

// // Response handler
// const handleResponse = async (response) => {
//   const data = await response.json().catch(() => ({}));
//   if (!response.ok) {
//     throw new Error(
//       data.message || `API request failed with status ${response.status}`
//     );
//   }
//   return data;
// };

// /**
//  * Create Dyte Session
//  * @param {Object} params
//  * @param {string} params.title - Meeting title
//  * @param {string} params.participantName - Participant display name
//  * @param {string} params.meetingPreset - Preset type (group_call_host | group_call_participant)
//  * @param {string} params.clientId - Unique client identifier
//  */
// export const requestDyteSession = async ({
//   title = `Meeting_${Date.now()}`,
//   participantName = 'John Doe',
//   meetingPreset = 'group_call_host',
//   clientId = `user_${Date.now()}`,
// }) => {
//   try {
//     // Step 1: Create a Meeting
//     console.log('📝 Creating meeting:', title);
//     const createMeetingResponse = await fetch(`${EUREKA_BASE_URL}/create-meeting`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ title }),
//     }).then(handleResponse);

//     const meetingId = createMeetingResponse?.data?.id;

//     if (!meetingId) {
//       throw new Error('No meeting_id returned from create-meeting API');
//     }

//     console.log('✅ Meeting created:', meetingId);

//     // Step 2: Get Participant Token
//     console.log('🎫 Requesting participant token...');
//     const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify({
//         meetingId,
//         name: participantName,
//         preset: meetingPreset,
//       }),
//     }).then(handleResponse);

//     const token = participantResponse?.data?.token;
//     if (!token) throw new Error('No token received from get-participant-token API');

//     console.log('✅ Token received successfully');

//     return {
//       meetingId,
//       meetingTitle: title,
//       participantName,
//       authToken: token,
//       presetUsed: meetingPreset,
//     };
//   } catch (error) {
//     if (error.message.includes('Failed to fetch')) {
//       console.error('🌐 Network Error: Backend unreachable');
//       throw new Error(
//         'Failed to create Dyte session: Unable to reach backend server. Please check your network connection.'
//       );
//     }

//     console.error('❌ Dyte session setup failed:', error);
//     throw new Error(`Failed to create Dyte session: ${error.message}`);
//   }
// };


const EUREKA_BASE_URL = 'http://192.168.68.112:5004/api/v1';
// const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';

// Response handler
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.message || `API request failed with status ${response.status}`
    );
  }
  return data;
};

/**
 * Create Dyte Session (FOR HOST)
 * This creates a meeting and returns a HOST token
 * @param {Object} params
 * @param {string} params.title - Meeting title
 * @param {string} params.participantName - Host display name
 * @param {string} params.meetingPreset - Preset type (default: group_call_host)
 * @param {string} params.clientId - Unique client identifier
 */
export const requestDyteSession = async ({
  title = `Meeting_${Date.now()}`,
  participantName = 'Host',
  meetingPreset = 'group_call_host', // ✅ HOST preset by default
  clientId = `user_${Date.now()}`,
}) => {
  try {
    // Step 1: Create a Meeting
    console.log('📝 Creating meeting:', title);
    const createMeetingResponse = await fetch(`${EUREKA_BASE_URL}/create-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }).then(handleResponse);

    const meetingId = createMeetingResponse?.data?.id;

    if (!meetingId) {
      throw new Error('No meeting_id returned from create-meeting API');
    }

    console.log('✅ Meeting created:', meetingId);

    // Step 2: Get HOST Token
    console.log('🎫 Requesting HOST token...');
    const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        meetingId,
        name: participantName,
        preset_name: meetingPreset, // ✅ Will be 'group_call_host'
      }),
    }).then(handleResponse);

    const token = participantResponse?.data?.token;
    if (!token) throw new Error('No token received from get-participant-token API');

    console.log('✅ HOST token received successfully');

    return {
      meetingId,
      meetingTitle: title,
      participantName,
      authToken: token,
      presetUsed: meetingPreset,
    };
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.error('🌐 Network Error: Backend unreachable');
      throw new Error(
        'Failed to create Dyte session: Unable to reach backend server. Please check your network connection.'
      );
    }

    console.error('❌ Dyte session setup failed:', error);
    throw new Error(`Failed to create Dyte session: ${error.message}`);
  }


  
};

