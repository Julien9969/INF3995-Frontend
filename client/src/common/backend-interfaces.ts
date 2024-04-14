export enum MissionState {
  ONGOING = "ongoing",
  ENDED = "ended",
  NOT_STARTED = "not-started",
}

export enum RobotState {
  IDLE = "idle",
  MOVING = "moving",
  DISCONNECTED = "disconnected",
  HEAD_BACK_BASE = "head-back-base",
}

export interface MissionStatus {
  missionState: MissionState,
  missionId: number,
  robotCount: number
  startTimestamp: number
  elapsedTime: number,
  isSimulation: boolean,
  distance: number,
}

export interface Logs {
  message: string;
  timestamp: number;
  robotId: number;
  eventType: string;
  missionId: number;
}

export enum WebsocketsEvents {
  MISSION_START = "mission-start",
  MISSION_END = "mission-end",
  MISSION_STATUS = "mission-status",
  LOG_DATA = "log-data",
  MISSION_MAP = "mission-map",
  ABORT_MISSION = "abort-mission",
  ROBOT_STATUS = "robot-status",
  HEADBACKBASE_FEEDBACK = "headbackbase-feedback",
  HEADBACKBASE_REQUEST = "headbackbase-request",
  PING = "ping",
  PONG = "pong",
}

export interface RobotInformation {
  id: number,
  name: string,
  battery: number,
  state: RobotState,
  lastUpdate: number,
  distance: number,
  position: {
    x: number,
    y: number
  },
  initialPosition: {
    x: number,
    y: number
  }
}

export interface ReceivedRobotInformation {
  id: number,
  name: string,
  battery: number,
  state: RobotState,
  lastUpdate: number,
  distance: number,
  // When received by backend, format of positions is: "{'x': 0, 'y': 0}",
  position: string,
  initialPosition: string
}

export interface EmitFeedback {
  timestamp: number,
  message: string,
  robotId: number
}

export enum HealthState {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  UNKNOWN = "unknown",
}
