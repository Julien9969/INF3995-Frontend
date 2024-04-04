export enum MissionState {
  ONGOING = "ongoing",
  ENDED = "ended",
  NOT_STARTED = "not-started",
}

export interface MissionStatus {
  missionState: MissionState,
  missionId: number,
  robotCount: number
  startTimestamp: number
  elapsedTime: number,
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
  MAP_DATA = "map-data",
  MISSION_MAP = "mission-map",
  ABORT_MISSION = "abort-mission",
  ROBOT_STATUS = "robot-status",
  IDENTIFY_FEEDBACK = "identify-feedback",
  IDENTIFY_REQUEST = "identify-request",
  HEADBACKBASE_FEEDBACK = "headbackbase-feedback",
  HEADBACKBASE_REQUEST = "headbackbase-request",
}

export interface RobotInformation {
  id: number,
  name: string,
  battery: number,
  state: string,
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

export interface EmitFeedback {
  timestamp: number,
  message: string,
  robotId: number
}
