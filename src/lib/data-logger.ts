/**
 * @file Centralized data logging service for capturing participant interactions.
 */

interface ParticipantData {
  participantId: string;
  condition: string | null;
  startTime: string;
  events: EventLog[];
  summary: Record<string, any>;
}

interface EventLog {
  timestamp: string;
  eventType: string;
  details: Record<string, any>;
}

const DATA_KEY = 'participantData';

/**
 * Initializes the data structure for a new participant in localStorage.
 * @param {string} participantId The unique identifier for the participant.
 */
export function initializeParticipant(participantId: string) {
  try {
    if (localStorage.getItem(DATA_KEY)) {
      console.warn('Data logger already initialized. Clearing previous data.');
    }
    const initialData: ParticipantData = {
      participantId: participantId,
      condition: null,
      startTime: new Date().toISOString(),
      events: [],
      summary: {},
    };
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
  } catch (error) {
    console.error('Error initializing data logger:', error);
  }
}

/**
 * Sets the experimental condition for the participant.
 * @param {string} condition The condition string (e.g., 'sympathetic-high').
 */
export function setCondition(condition: string) {
    try {
        const data = getData();
        if (data) {
            data.condition = condition;
            data.events.push({
                timestamp: new Date().toISOString(),
                eventType: 'condition_assigned',
                details: { condition },
            });
            saveData(data);
        }
    } catch (error) {
        console.error('Error setting condition:', error);
    }
}


/**
 * Logs an event and recalculates summaries.
 * @param {string} eventType The type of event (e.g., 'like', 'survey_response').
 * @param {Record<string, any>} details The specific details of the event.
 */
export function logEvent(eventType: string, details: Record<string, any>) {
  try {
    const data = getData();
    if (data) {
      data.events.push({
        timestamp: new Date().toISOString(),
        eventType,
        details,
      });
      data.summary = calculateSummaries(data.events);
      saveData(data);
    }
  } catch (error) {
    console.error(`Error logging event ${eventType}:`, error);
  }
}

/**
 * Retrieves the current participant data object from localStorage.
 * @returns {ParticipantData | null} The participant data object or null if not found.
 */
function getData(): ParticipantData | null {
  try {
    const rawData = localStorage.getItem(DATA_KEY);
    return rawData ? JSON.parse(rawData) : null;
  } catch (error) {
    console.error('Error getting data from localStorage:', error);
    return null;
  }
}

/**
 * Saves the participant data object to localStorage.
 * @param {ParticipantData} data The participant data object to save.
 */
function saveData(data: ParticipantData) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

/**
 * Calculates summary metrics from a list of events.
 * @param {EventLog[]} events The array of event logs.
 * @returns {Record<string, any>} An object containing summary statistics.
 */
function calculateSummaries(events: EventLog[]): Record<string, any> {
  const summary: Record<string, any> = {
    totalLikes: 0,
    totalComments: 0,
    totalReplies: 0,
    totalShares: 0,
    totalTimeSpentOnFocalPosts: 0,
    totalTimeSpentOnNonFocalPosts: 0,
    focalInteractions: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    nonFocalInteractions: {
      likes: 0,
      comments: 0,
      shares: 0,
    },
    valenceInteractions: {
        sympathetic: { likes: 0, comments: 0, shares: 0 },
        condemning: { likes: 0, comments: 0, shares: 0 },
        neutral: { likes: 0, comments: 0, shares: 0 },
    }
  };

  for (const event of events) {
    const { eventType, details } = event;
    if (!details) continue; // Skip if details is null or undefined
    const { isFocal, valence } = details;

    switch (eventType) {
      case 'like':
        summary.totalLikes++;
        if (isFocal) summary.focalInteractions.likes++;
        else summary.nonFocalInteractions.likes++;
        if (valence && summary.valenceInteractions[valence]) summary.valenceInteractions[valence].likes++;
        break;
      case 'comment_added':
        summary.totalComments++;
        if (isFocal) summary.focalInteractions.comments++;
        else summary.nonFocalInteractions.comments++;
        if (valence && summary.valenceInteractions[valence]) summary.valenceInteractions[valence].comments++;
        break;
      case 'reply_added':
        summary.totalReplies++;
        break;
      case 'share':
        summary.totalShares++;
        if (isFocal) summary.focalInteractions.shares++;
        else summary.nonFocalInteractions.shares++;
        if (valence && summary.valenceInteractions[valence]) summary.valenceInteractions[valence].shares++;
        break;
      case 'focus_post':
        if (isFocal) summary.totalTimeSpentOnFocalPosts += details.durationMs;
        else summary.totalTimeSpentOnNonFocalPosts += details.durationMs;
        break;
    }
  }

  return summary;
}

/**
 * Returns the final data object.
 * @returns {ParticipantData | null} The participant data object.
 */
export function exportData(): ParticipantData | null {
  try {
    return getData();
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}
