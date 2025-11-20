export type EventBusCallback = (event: Event) => void;

export class EventBus {
  public static on(type: string, callback: EventBusCallback) {
    document.addEventListener(type, callback);
  }

  public static dispatch(type: string, data: any) {
    document.dispatchEvent(new CustomEvent(type, {detail: data}));
  }

  public static remove(type: string, callback: EventBusCallback) {
    document.removeEventListener(type, callback);
  }
}
