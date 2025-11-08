
export interface SensorDataPoint {
  time: string;
  timestamp: number;
  value: number;
}

export enum ConnectionStatus {
  DISCONNECTED = "Disconnected",
  CONNECTING = "Connecting",
  CONNECTED = "Connected",
  ERROR = "Error",
}