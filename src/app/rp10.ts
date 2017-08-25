import * as moment from 'moment'

const GOAL_DURATION_RE = /^(\d{0,2}:)?\d{2}(\.\d{0,2})?$/
const GOAL_DISTANCES_LIST = [1650, 1500, 800, 500, 400, 200, 100, 50]

export class GoalTime {
  // TODO convert duration to a moment duration object?, see http://momentjs.com/docs/#/durations/

  constructor(public duration: string, public distance: number) {}

  public static fromString(goalTimeString: string): GoalTime {
    const read = goalTimeString.split(' ')

    if (read.length !== 2) {
      throw new TypeError(
        `GoalTime.fromString expected input format to be \`<duration> <distance>\`, got \`${goalTimeString}\``
      )
    }

    const duration = read[0].trim()
    const distance = +read[1].trim()

    if (!duration || duration.search(GOAL_DURATION_RE) === -1) {
      throw new TypeError(
        `GoalTime.fromString expected duration format to be \`mm:ss.msms\`, got \`${read[0]}\``
      )
    }

    if (!distance || isNaN(distance)) {
      throw new TypeError(
        `GoalTime.fromString expected distance to be coerable to number, got \`${read[1]}\``
      )
    } else if (!GOAL_DISTANCES_LIST.includes(distance)) {
      throw new TypeError(
        `GoalTime.fromString expected distance to be one of ${GOAL_DISTANCES_LIST}, got \`${read[1]}\``
      )
    }

    return new GoalTime(duration, distance)
  }

  public static fromStringList(
    goalTimeStringList: string,
    separator: string = '\n'
  ): GoalTime[] {
    return goalTimeStringList.split(separator).map(GoalTime.fromString)
  }

  toString(): string {
    return `${this.duration} ${this.distance}`
  }
}

export class PracticePace {
  constructor(public target: string, public interval: string) {}
}

export class PracticeGroup {
  // data for outputs
  constructor(public goalTime: GoalTime, public practicePace: PracticePace) {}
}

export class Rp10 {
  // form data inputs
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
    public ofGoalPace?: number
  ) {}

  // TODO getter/setter for percentage units

  // XXX this implementation matches the google sheet
  getSheetPaceToTrainToday(goalTime: GoalTime): number {
    const split = goalTime.duration.split(':')
    while (split.length < 3) {
      split.unshift('00') // to 00:00:00.000 format, https://momentjs.com/docs/#/durations/creating/
    }
    const m = moment.duration(split.join(':'))
    const ofGoalPaceM = m.minutes() * (1 / (this.ofGoalPaceToTrainToday / 100))
    const ofGoalPaceS = moment
      .duration(`00:${ofGoalPaceM}:${m.seconds()}.${m.milliseconds()}`)
      .asSeconds()
    return (
      ofGoalPaceS /
        goalTime.distance *
        this.todaysRepeats *
        1.10345797 /* distanceFactor */ +
      this.goalPlusMinus
    )
  }

  // XXX think i found a bug in the sheet where % of goal pace is only accounted for if the goal time duration is >=1:00.0
  // XXX because goal +/- is only factored into the goal duration minutes place
  getPaceToTrainToday(goalTime: GoalTime): number {
    // TODO factor in distance conversion value
    const split = goalTime.duration.split(':')
    while (split.length < 3) {
      split.unshift('00') // to 00:00:00.000 format, https://momentjs.com/docs/#/durations/creating/
    }
    const m = moment.duration(split.join(':'))
    const ofGoalPaceS =
      m.asSeconds() * (1 / (this.ofGoalPaceToTrainToday / 100))
    return (
      ofGoalPaceS /
        goalTime.distance *
        this.todaysRepeats *
        1.10345797 /* distanceFactor */ +
      this.goalPlusMinus
    )
  }
}
