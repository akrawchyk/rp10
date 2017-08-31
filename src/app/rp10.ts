import * as moment from 'moment'

// hh:mm:ss.msms, see http://refiddle.com/nl56
const GOAL_DURATION_RE = /^(\d{0,2}:)?([0-5]?\d?:)?[0-5]?\d?(\.\d{0,2})?$/
const GOAL_DISTANCES_LIST = [
  25000,
  10000,
  1650,
  1500,
  1000,
  800,
  500,
  400,
  300,
  200,
  100,
  50,
  25,
]

// TODO use typescript enums for these
const POOLS = {
  SCY: 0,
  SCM: 1,
  LCM: 2,
}

const TIMES = {
  // TODO expose these base times in admin access
  [POOLS.SCY]: moment.duration('00:03:33.42').asSeconds(),
  [POOLS.SCM]: moment.duration('00:03:55.50').asSeconds(),
  [POOLS.LCM]: moment.duration('00:04:03.84').asSeconds(),
}

const POOL_LENGTH_FACTORS = [POOLS.SCY, POOLS.SCM, POOLS.LCM].map(poolType => {
  return [
    TIMES[poolType] / TIMES[POOLS.SCY],
    TIMES[poolType] / TIMES[POOLS.SCM],
    TIMES[poolType] / TIMES[POOLS.LCM],
  ]
})

function poolType(fromLength) {
  const _fromLength = fromLength

  return {
    to: toLength => {
      return POOL_LENGTH_FACTORS[POOLS[_fromLength]][POOLS[toLength]]
    },
  }
}

export function formatTimeDisplay(timeS: number): string {
  const timeDuration = moment.duration(timeS, 'seconds')
  let timeDisplayH = timeDuration.hours()
  let timeDisplayM = timeDuration.minutes()
  let timeDisplayS = timeDuration.seconds()
  let timeDisplayMs = timeDuration.milliseconds()
  let timeDisplay = `${timeDisplayS}`

  // add leading 0 to seconds
  if (timeDisplay.length === 1) {
    timeDisplay = `0${timeDisplayS}`
  }

  // add leading colon to seconds
  timeDisplay = `:${timeDisplay}`

  if (timeDisplayM) {
    // add minutes
    timeDisplay = `${timeDisplayM}${timeDisplay}`
  } else if (timeDisplayH) {
    // add empty minutes for hours
    timeDisplay = `00${timeDisplay}`
  }

  // add hours
  if (timeDisplayH) {
    timeDisplay = `${timeDisplayH}:${timeDisplay}`
  }

  // round up to nearest 100th and add 10th's place
  const tenths = (Math.ceil(timeDuration.milliseconds() / 100) *
    100).toString()[0]
  if (timeDisplayMs) {
    timeDisplay = `${timeDisplay}.${tenths}`
  }

  return timeDisplay
}

export class GoalTime {
  constructor(
    public duration: string,
    public distance: number,
    public name?: string
  ) {}

  public static fromString(goalTimeString: string): GoalTime {
    const read = goalTimeString.split(' ').filter(present => present)

    if (read.length < 2) {
      throw new TypeError(
        `GoalTime.fromString expected input format to be \`<duration> <distance>\`, got \`${goalTimeString}\``
      )
    }

    // format: duration distance name...
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
        `GoalTime.fromString expected duration format to be \`hh:mm:ss.msms\`, got \`${read[0]}\``
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

class SecondsProIntervalFormat {
  constructor(
    public name: string,
    public duration: number,
    public color: number = 3
  ) {}
}

class SecondsProFormat {
  constructor(
    public name: string,
    public intervals: SecondsProIntervalFormat[],
    public numberOfSets: number = 1,
    public type: number = 0,
    public soundScheme: number = 8,
    public via: string = 'web'
  ) {}
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
    public goalTimes: GoalTime[],
    public sameIntervalS?: number
  ) {}

  // TODO getter/setter for percentage units

  getPracticePaceForGoalTime(goalTime: GoalTime): PracticePace {
    const targetToTrainTodayS = this.getTargetToTrainTodayS(goalTime)
    let intervalToTrainTodayS

    if (this.sameIntervalS) {
      intervalToTrainTodayS = this.sameIntervalS
    } else {
      intervalToTrainTodayS = moment
        .duration(targetToTrainTodayS + this.restPerRepeatS, 'seconds')
        .asSeconds()
    }

    return new PracticePace(
      targetToTrainTodayS,
      Math.ceil(intervalToTrainTodayS)
    )
  }

  getTargetToTrainTodayS(goalTime: GoalTime): number {
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

  toSecondsProFormat(): SecondsProFormat[] {
    return this.goalTimes.map((goalTime, idx) => {
      const practicePace = this.getPracticePaceForGoalTime(goalTime)
      const name = goalTime.name || `Group ${idx + 1}`
      const intervals = []
      while (intervals.length !== this.repCount) {
        intervals.push(this.repCount)
      }
      // XXX why doesnt this work? always get array of undefined
      // intervals.length = this.repCount
      // intervals.map...

      return new SecondsProFormat(
        name,
        intervals.map((repCount, jdx) => {
          const iname = `rep ${jdx + 1} -> ${repCount}x${this
            .todaysRepeats} target: ${formatTimeDisplay(practicePace.targetS)}`
          return new SecondsProIntervalFormat(iname, practicePace.intervalS)
        })
      )
    })
  }
}
