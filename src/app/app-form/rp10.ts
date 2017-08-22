export class GoalTime {
  constructor(
    public time: string,
    public distance: number
  ) {}
}

export class RP10 {
  constructor(
    public todaysRepeats: number,
    public ofReps: number,
    public goalPlusMinus: number,
    public myGoalTimeIsFor: string,
    public todayMyTrainingPoolIs: string,
    public ofGoalPaceToTrainToday: number,
    public secondsRestPerRepeat: number,
    public goalTimes: GoalTime[],
    public eventGoalTime?: number,
    public goalEventDistance?: number,
    public ofGoalPace?: number,
  ) {}
}
