import * as moment from 'moment'

const GOAL_DURATION_RE = /^(\d{0,2}:)?\d{2}(\.\d{0,2})?$/
const GOAL_DISTANCES_LIST = [1650, 1500, 800, 500, 400, 200, 100, 50]

const POOLS = {
  SCY: 0,
  SCM: 1,
  LCM: 2
}

const TIMES = {
  [POOLS.SCY]: moment.duration('00:3:33.42').asSeconds(),
  [POOLS.SCM]: moment.duration('00:3:55.50').asSeconds(),
  [POOLS.LCM]: moment.duration('00:4:03.84').asSeconds()
}

const POOL_LENGTH_FACTORS = [POOLS.SCY, POOLS.SCM, POOLS.LCM].map(poolType => {
  return [
    TIMES[poolType] / TIMES[POOLS.SCY],
    TIMES[poolType] / TIMES[POOLS.SCM] ,
    TIMES[poolType] / TIMES[POOLS.LCM]
  ]
})

function poolType(fromLength) {
  const _fromLength = fromLength

  return {
    to: (toLength) => {
      return POOL_LENGTH_FACTORS[POOLS[_fromLength]][POOLS[toLength]]
    }
  }
}

export class GoalTime {
  // TODO convert duration to a moment duration object?, see http://momentjs.com/docs/#/durations/

  constructor(public duration: string, public distance: number, public name?: string) {}

  public static fromString(goalTimeString: string): GoalTime {
    const read = goalTimeString.split(' ').filter(present => present)

    if (read.length < 2) {
      throw new TypeError(
        `GoalTime.fromString expected input format to be \`<duration> <distance>\`, got \`${goalTimeString}\``
      )
    }

    const duration = read[0].trim()
    const distance = +read[1].trim()
    let name = ''
    let readName = read.slice(2)

    if (readName.length) {
      name = readName.map(n => n.trim()).join(' ')
    } else {
      name = null
    }

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

    return new GoalTime(duration, distance, name)
  }

  public static fromStringList(
    goalTimeStringList: string,
    separator: string = '\n'
  ): GoalTime[] {
    return goalTimeStringList.split(separator).map(GoalTime.fromString)
  }

  toString(): string {
    return [this.duration, this.distance, this.name].join(' ')
  }
}

export class PracticePace {
  constructor(public targetS: number, public intervalS: number) {}
}

export class PracticeGroup {
  // data for outputs
  constructor(public goalTime: GoalTime, public practicePace: PracticePace) {}
}

export class Rp10 {
  // form data inputs
  constructor(
    public todaysRepeats: number,
    public repCount: number,
    public goalPlusMinus: number,
    public myGoalTimeIsFor: string,
    public todayMyTrainingPoolIs: string,
    public percentGoalPaceToTrainToday: number,
    public restPerRepeatS: number,
    public goalTimes: GoalTime[]
  ) {}

  // TODO getter/setter for percentage units

  getSheetPracticePace(goalTime: GoalTime): PracticePace {
    const paceToTrainTodayS = this.getPaceToTrainTodayS(goalTime)
    const interval = moment.duration(paceToTrainTodayS + this.restPerRepeatS, 'seconds')
    return new PracticePace(paceToTrainTodayS, +Math.ceil(interval.asSeconds()))
  }

  getPaceToTrainTodayS(goalTime: GoalTime): number {
    const split = goalTime.duration.split(':')
    while (split.length < 3) {
      split.unshift('00') // to 00:00:00.000 format, https://momentjs.com/docs/#/durations/creating/
    }
    const m = moment.duration(split.join(':'))
    const percentGoalPaceS =
      m.asSeconds() * (1 / (this.percentGoalPaceToTrainToday / 100))
    return (
      percentGoalPaceS /
        goalTime.distance *
        this.todaysRepeats *
        poolType(this.todayMyTrainingPoolIs).to(this.myGoalTimeIsFor) +
      this.goalPlusMinus
    )
  }
}
