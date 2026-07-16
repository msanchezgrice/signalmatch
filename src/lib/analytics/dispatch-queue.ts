export type AnalyticsDispatch<Event> = (event: Event) => boolean;

export type AnalyticsDispatchQueue<Event> = {
  clear: () => void;
  dispatchOrQueue: (
    event: Event,
    dispatch: AnalyticsDispatch<Event>,
  ) => boolean;
  flush: (dispatch: AnalyticsDispatch<Event>) => void;
  size: () => number;
};

export function createDispatchQueue<Event>(): AnalyticsDispatchQueue<Event> {
  let pending: Event[] = [];

  return {
    clear() {
      pending = [];
    },
    dispatchOrQueue(event, dispatch) {
      if (dispatch(event)) {
        return true;
      }
      pending.push(event);
      return false;
    },
    flush(dispatch) {
      const queued = pending;
      pending = [];
      for (const event of queued) {
        if (!dispatch(event)) {
          pending.push(event);
        }
      }
    },
    size() {
      return pending.length;
    },
  };
}
