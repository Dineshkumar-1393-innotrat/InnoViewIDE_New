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


// //12-11-25

//13-11-25
const EUREKA_BASE_URL = 'https://eureka.innotrat.in/api/v1';
const DYTE_BASE_URL = 'https://api.dyte.io/v2';

// Dyte API Credentials
const DYTE_ORG_ID = '515405af-09c7-4735-87f8-33598a6768ca';
const DYTE_API_KEY = '9013fe7c3787ae5e06a9';

// Generate Base64 encoded authorization header for Dyte
const getDyteAuthHeader = () => {
  const credentials = `${DYTE_ORG_ID}:${DYTE_API_KEY}`;
  const base64Credentials = btoa(credentials);
  return `Basic ${base64Credentials}`;
};

// Response handler
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data = {};
  
  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => ({}));
  }
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || `API request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

/**
 * Get preset configuration based on type
 */
const getPresetConfig = (presetType = 'participant') => {
  const isHost = presetType === 'host';
  
  return {
    name: isHost ? 'group_call_host' : 'group_call_participant',
    config: {
      view_type: 'GROUP_CALL',
      max_video_streams: {
        mobile: 0,
        desktop: 0
      },
      max_screenshare_count: 2, // Allow both host and participants to view up to 2 screen shares
      media: {
        audio: {
          enable_stereo: false,
          enable_high_bitrate: false
        },
        video: {
          quality: 'hd',
          frame_rate: 30
        },
        screenshare: {
          quality: 'hd',
          frame_rate: 30 // Allow participants to view screen shares at 30fps
        }
      }
    },
    permissions: {
      accept_waiting_requests: isHost,
      can_accept_production_requests: isHost,
      can_edit_display_name: true,
      can_spotlight: isHost,
      is_recorder: false,
      recorder_type: 'NONE',
      disable_participant_audio: isHost,
      disable_participant_screensharing: isHost,
      disable_participant_video: isHost,
      kick_participant: isHost,
      pin_participant: isHost,
      can_record: isHost,
      can_livestream: isHost,
      waiting_room_type: isHost ? 'SKIP' : 'ON_ACCEPT',
      plugins: {
        can_close: isHost,
        can_start: isHost,
        can_edit_config: isHost,
        config: {}
      },
      connected_meetings: {
        can_alter_connected_meetings: isHost,
        can_switch_connected_meetings: isHost,
        can_switch_to_parent_meeting: true
      },
      polls: {
        can_create: isHost,
        can_vote: true,
        can_view: true
      },
      media: {
        video: {
          can_produce: 'ALLOWED'
        },
        audio: {
          can_produce: 'ALLOWED'
        },
        screenshare: {
          can_produce: isHost ? 'ALLOWED' : 'NOT_ALLOWED',
          can_consume: 'ALLOWED' // Allow all participants to view screen shares
        }
      },
      chat: {
        public: {
          can_send: true,
          text: true,
          files: true
        },
        private: {
          can_send: true,
          can_receive: true,
          text: true,
          files: true
        }
      },
      hidden_participant: false,
      show_participant_list: true,
      can_change_participant_permissions: isHost
    },
    ui: {
      design_tokens: {
        border_radius: 'rounded',
        border_width: 'thin',
        spacing_base: 4,
        theme: 'dark',
        colors: {
          brand: {
            300: '#844d1c',
            400: '#9d5b22',
            500: '#b56927',
            600: '#d37c30',
            700: '#d9904f'
          },
          background: {
            600: '#222222',
            700: '#1f1f1f',
            800: '#1b1b1b',
            900: '#181818',
            1000: '#141414'
          },
          danger: '#FF2D2D',
          text: '#EEEEEE',
          text_on_brand: '#EEEEEE',
          success: '#62A504',
          video_bg: '#191919',
          warning: '#FFCD07'
        },
        logo: 'https://innotrat.in.logo'
      },
      config_diff: {}
    }
  };
};

/**
 * Create Dyte preset
 */
export const createDytePreset = async (presetType = 'participant') => {
  try {
    const presetConfig = getPresetConfig(presetType);
    const presetName = presetConfig.name;
    
    console.log('🎨 Creating/checking Dyte preset:', presetName);

    const response = await fetch(`${DYTE_BASE_URL}/presets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getDyteAuthHeader()
      },
      body: JSON.stringify(presetConfig)
    }).then(handleResponse);

    console.log('✅ Preset created successfully:', response);
    return response;
  } catch (error) {
    const presetName = presetType === 'host' ? 'group_call_host' : 'group_call_participant';
    
    if (error.status === 409 || 
        error.message.includes('already exists') || 
        error.message.includes('duplicate')) {
      console.log('ℹ️ Preset already exists:', presetName);
      return { name: presetName, status: 'existing' };
    }
    
    console.error('❌ Preset creation failed:', error);
    throw new Error(`Failed to create preset "${presetName}": ${error.message}`);
  }
};

/**
 * Initialize presets (call once on app startup)
 */
export const initializePresets = async () => {
  const presetTypes = ['host', 'participant'];
  const results = { success: [], failed: [] };
  
  console.log('🔧 Initializing Dyte presets...');
  
  for (const presetType of presetTypes) {
    try {
      const result = await createDytePreset(presetType);
      results.success.push(result.name);
      console.log(`✅ Preset ready: ${result.name}`);
    } catch (error) {
      const presetName = presetType === 'host' ? 'group_call_host' : 'group_call_participant';
      results.failed.push({ preset: presetName, error: error.message });
      console.error(`❌ Failed to initialize preset ${presetName}:`, error.message);
    }
  }
  
  console.log('🎉 Preset initialization complete:', results);
  return results;
};

/**
 * Create Dyte Session
 * @param {Object} params
 * @param {string} params.title - Meeting title
 * @param {string} params.participantName - Participant display name
 * @param {string} params.presetName - 'group_call_host' or 'group_call_participant'
 * @param {string} params.clientId - Unique client identifier
 * @param {boolean} params.isHost - Whether joining as host (default: false)
 */
export const requestDyteSession = async ({
  title = `Meeting_${Date.now()}`,
  participantName = 'John Doe',
  presetName = 'group_call_participant',
  clientId = `user_${Date.now()}`,
  isHost = false
}) => {
  try {
    // Override presetName if isHost is specified
    if (isHost) {
      presetName = 'group_call_host';
      clientId = `host_${Date.now()}`;
    }

    // Step 1: Create Meeting
    console.log('📝 Creating meeting:', title);
    const createMeetingResponse = await fetch(`${EUREKA_BASE_URL}/create-meeting`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ title })
    }).then(handleResponse);

    const meetingId = createMeetingResponse?.data?.id;

    if (!meetingId) {
      throw new Error('No meeting_id returned from create-meeting API');
    }

    console.log('✅ Meeting created with ID:', meetingId);

    // Step 2: Get Participant Token
    console.log(`🎫 Requesting ${isHost ? 'HOST' : 'participant'} token...`);
    const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        meetingId: meetingId,
        name: participantName,
        preset_name: presetName,
        client_specific_id: clientId
      })
    }).then(handleResponse);

    const token = participantResponse?.data?.token;
    if (!token) {
      throw new Error('No token received from get-participant-token API');
    }

    console.log(`✅ ${isHost ? 'HOST' : 'Participant'} token received successfully`);

    return {
      success: true,
      meetingId,
      meetingTitle: title,
      participantName,
      authToken: token,
      presetUsed: presetName,
      clientSpecificId: clientId,
      isHost: isHost
    };
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('🌐 Network Error: Backend unreachable');
      throw new Error('Unable to reach backend server. Please check your network connection.');
    }

    if (error.status === 401 || error.status === 403) {
      console.error('🔒 Authorization Error');
      throw new Error('Authentication failed. Please check your API credentials.');
    }

    if (error.status === 404) {
      console.error('🔍 Resource Not Found');
      throw new Error('API endpoint not found. Please verify the API URL.');
    }

    if (error.status >= 500) {
      console.error('⚠️ Server Error');
      throw new Error('Server error occurred. Please try again later.');
    }

    console.error('❌ Dyte session setup failed:', error);
    throw new Error(`Failed to create Dyte session: ${error.message}`);
  }
};

/**
 * Create meeting as HOST - USE THIS FOR HOSTING
 */
export const createMeetingAsHost = async (meetingTitle, hostName) => {
  // Ensure presets are initialized with latest config
  console.log('🔧 Ensuring presets are up to date...');
  await initializePresets();
  
  return await requestDyteSession({
    title: meetingTitle,
    participantName: hostName,
    presetName: 'group_call_host',
    clientId: `host_${Date.now()}`,
    isHost: true  // ⭐ THIS IS THE KEY FLAG
  });
};

/**
 * Join meeting as participant
 */
export const joinMeetingAsParticipant = async (meetingTitle, participantName) => {
  return await requestDyteSession({
    title: meetingTitle,
    participantName: participantName,
    presetName: 'group_call_participant',
    clientId: `participant_${Date.now()}`,
    isHost: false
  });
};

/**
 * Join existing meeting by ID
 */
export const joinExistingMeeting = async (existingMeetingId, participantName, asHost = false) => {
  try {
    // Ensure presets are initialized with latest config
    console.log('🔧 Ensuring presets are up to date for participant...');
    await initializePresets();
    
    const presetName = asHost ? 'group_call_host' : 'group_call_participant';
    const clientId = asHost ? `host_${Date.now()}` : `participant_${Date.now()}`;
    
    console.log(`🎫 Joining existing meeting as ${asHost ? 'HOST' : 'participant'}:`, existingMeetingId);
    
    const participantResponse = await fetch(`${EUREKA_BASE_URL}/get-participant-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        meetingId: existingMeetingId,
        name: participantName,
        preset_name: presetName,
        client_specific_id: clientId
      })
    }).then(handleResponse);

    const token = participantResponse?.data?.token;
    if (!token) {
      throw new Error('No token received from get-participant-token API');
    }

    console.log(`✅ ${asHost ? 'HOST' : 'Participant'} token received for existing meeting`);

    return {
      success: true,
      meetingId: existingMeetingId,
      participantName,
      authToken: token,
      presetUsed: presetName,
      isHost: asHost
    };
  } catch (error) {
    console.error('❌ Failed to join existing meeting:', error);
    throw new Error(`Failed to join meeting: ${error.message}`);
  }
};

// Export
export default {
  initializePresets,
  createDytePreset,
  requestDyteSession,
  createMeetingAsHost,
  joinMeetingAsParticipant,
  joinExistingMeeting,
  getDyteAuthHeader
};

