const DURATION_RE = /^(\d{0,2}:)?\d{2}(\.\d{0,2})?$/

export class GoalTime {
  constructor(
    public duration: string,
    public distance: number
  ) {}

  public static fromString(goalTimeString: string) {
    const read = goalTimeString.split(' ')

    if (read.length !== 2) {
      throw new TypeError(`GoalTime.fromString expected input format to be \`<duration> <distance>\`, got \`${goalTimeString}\``)
    }

    const duration = read[0].trim()
    const distance = +(read[1].trim())

    if (!duration || duration.search(DURATION_RE) === -1) {
      throw new TypeError(`GoalTime.fromString expected duration format to be \`mm:ss.msms\`, got \`${read[0]}\``)
    }

    if (!distance || isNaN(distance)) {
      throw new TypeError(`GoalTime.fromString expected distance to be coerable to number, got \`${read[1]}\``)
    }

    return new GoalTime(duration, distance)
  }

  toString() {
    return `${this.duration} ${this.distance}`
  }
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
