export interface MissionStatus {
  missionState: MissionState,
  missionId: number,
  batteries: number[],
  distances: number[],
  count: number
  startTimestamp: number
  elapsedTime: number,
}

export enum MissionState {
  ONGOING = "ongoing",
  ENDED = "ended",
  NOT_STARTED = "not-started",
}
