type SDGEventType = "meetup";

export type SDGEvent = {
  title: string;
  type: SDGEventType;
  location?: string;
  mapLink?: string;
};
