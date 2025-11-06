
export interface SensorDataPoint {
  time: string;
  timestamp: number;
  value: number;
}

export enum MessageRole {
  USER = "user",
  MODEL = "model",
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  sources?: GroundingSource[];
}

export enum BluetoothConnectionStatus {
  DISCONNECTED = "Disconnected",
  CONNECTING = "Connecting",
  CONNECTED = "Connected",
  CONNECTED_AWAITING_SELECTION = "Select Characteristic",
  ERROR = "Error",
}

export interface GroundingSource {
    uri: string;
    title: string;
}