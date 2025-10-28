const EUREKA_BASE_URL = import.meta.env.VITE_EUREKA_API_BASE || 'https://eureka.innotrat.in/api/v1';

const handleResponse = async (response) => {
  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : {};
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    const detail =
      payload?.message ||
      payload?.error ||
      payload?.detail ||
      payload?.errors?.[0] ||
      text ||
      'Unknown error';
    throw new Error(`Dyte API error (${response.status}): ${detail}`);
  }

  return payload;
};

const withBase = (path) => {
  if (!path) return EUREKA_BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${EUREKA_BASE_URL}${path}`;
  }
  return `${EUREKA_BASE_URL}/${path}`;
};

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(withBase(path), {
    ...options,
    headers,
  });

  return handleResponse(response);
};

const createMeeting = async ({ title, endpoint }) => {
  return request(endpoint || '/create-meeting', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
};

const fetchParticipantToken = async ({
  meetingId,
  name,
  presetName,
  clientSpecificId,
  endpoint,
}) => {
  return request(endpoint || '/get-participant-token', {
    method: 'POST',
    body: JSON.stringify({
      meetingId,
      name,
      preset_name: presetName,
      client_specific_id: clientSpecificId,
    }),
  });
};

const toMeetingId = (payload) => {
  if (payload?.meeting_id) return payload.meeting_id;
  if (payload?.meetingId) return payload.meetingId;
  if (payload?.data?.meeting_id) return payload.data.meeting_id;
  if (payload?.data?.meetingId) return payload.data.meetingId;
  if (payload?.data?.meeting?.meeting_id) return payload.data.meeting.meeting_id;
  if (payload?.data?.meeting?.id) return payload.data.meeting.id;
  if (payload?.data?.data?.meeting_id) return payload.data.data.meeting_id;
  if (payload?.data?.data?.meetingId) return payload.data.data.meetingId;
  return payload?.id || payload?._id;
};

const toAuthToken = (payload) => {
  if (payload?.authToken) return payload.authToken;
  if (payload?.auth_token) return payload.auth_token;
  if (payload?.token) return payload.token;
  if (payload?.data?.authToken) return payload.data.authToken;
  if (payload?.data?.auth_token) return payload.data.auth_token;
  if (payload?.authResponse?.authToken) return payload.authResponse.authToken;
  if (payload?.data?.authResponse?.authToken) return payload.data.authResponse.authToken;
  return null;
};

export const requestDyteSession = async ({
  title,
  participantName,
  participantPreset = 'group_call_host',
  meetingPreset,
  createMeetingEndpoint,
  participantTokenEndpoint,
} = {}) => {
  const meetingTitle = title || `InnoIDE Session • ${new Date().toLocaleString()}`;

  const meetingPayload = await createMeeting({
    title: meetingTitle,
    presetName: meetingPreset,
    endpoint: createMeetingEndpoint,
  });
  const meetingId = toMeetingId(meetingPayload);

  if (!meetingId) {
    throw new Error('Meeting created but no meetingId returned from backend.');
  }

  const participantPayload = await fetchParticipantToken({
    meetingId,
    name: participantName,
    presetName: participantPreset,
    clientSpecificId:
      (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
      `innoide-${Date.now()}`,
    endpoint: participantTokenEndpoint,
  });

  const authToken = toAuthToken(participantPayload);

  if (!authToken) {
    throw new Error('Participant token response missing auth token.');
  }

  return {
    meetingId,
    meetingTitle,
    authToken,
  };
};

export default {
  requestDyteSession,
};
