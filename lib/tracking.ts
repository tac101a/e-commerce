// Telemetry utility for E-commerce Data Lakehouse
// All events are logged with timestamps and can be sent to analytics backends

export type EventType =
  | 'page_view'
  | 'search'
  | 'category_filter'
  | 'product_click'
  | 'product_view'
  | 'add_to_cart'
  | 'login_click'
  | 'guest_click'
  | 'navbar_click'
  | 'back_click';

export interface EventPayload {
  eventId?: string;
  timestamp?: string;
  sessionId?: string;
  userId?: string;
  [key: string]: unknown;
}

// Generate unique event ID
const generateEventId = (): string => {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Get or create session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server_session';
  
  let sessionId = sessionStorage.getItem('lakehouse_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('lakehouse_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Log an event to the Data Lakehouse
 * In production, this would send data to your analytics backend
 */
export function logEvent(type: EventType, payload: EventPayload = {}): void {
  const enrichedPayload = {
    eventId: generateEventId(),
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    eventType: type,
    ...payload,
    // Add browser context
    context: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof window !== 'undefined' ? document.referrer : '',
    },
  };

  // Log to console in development (simulating lakehouse ingestion)
  console.log(`[DataLakehouse] Event: ${type}`, enrichedPayload);

  // In production, you would send this to your analytics endpoint:
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(enrichedPayload) });
}

/**
 * Track page views automatically
 */
export function logPageView(pageName: string, metadata?: Record<string, unknown>): void {
  logEvent('page_view', {
    pageName,
    ...metadata,
  });
}
