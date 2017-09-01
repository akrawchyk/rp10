import * as moment from 'moment'

// TODO use lookaheads to avoid matching 99:22.00
const GOAL_DURATION_RE = /^(\d{0,2}:)?([0-5]?\d?:)?[0-5]?\d(\.\d{0,2})?$/
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

export function formatDurationDisplay(input: number): string {
  const duration = moment.duration(input, 'seconds')  // TODO use milliseconds
  let durationDisplayH = duration.hours()
  let durationDisplayM = duration.minutes()
  let durationDisplayS = duration.seconds()
  let durationDisplayMs = duration.milliseconds()
  let durationDisplay = `${durationDisplayS}`

  // add leading 0 to seconds
  if (durationDisplay.length === 1) {
    durationDisplay = `0${durationDisplayS}`
  }

  // add leading colon to seconds
  durationDisplay = `:${durationDisplay}`

  if (durationDisplayM) {
    // add leading 0 to minutes for hours
    if (durationDisplayH && durationDisplayM.length === 1) {
      durationDisplayM = `0${durationDisplayM}`
    }

    // add minutes
    durationDisplay = `${durationDisplayM}${durationDisplay}`
  } else if (durationDisplayH) {
    // add empty minutes for hours
    durationDisplay = `00${durationDisplay}`
  }

  // add hours
  if (durationDisplayH) {
    durationDisplay = `${durationDisplayH}:${durationDisplay}`
  }

  // round up to nearest 100th and add 10th's place
  const tenths = (Math.ceil(duration.milliseconds() / 100) *
    100).toString()[0]
  if (durationDisplayMs) {
    durationDisplay = `${durationDisplay}.${tenths}`
  }

  return durationDisplay
}

export class GoalTime {
  duration: number

  displayDuration: string|number

  constructor(
    input: number|string,
    public distance: number,
    public name?: string
  ) {
    if (typeof input === 'number') {
      this.duration = input
    } else if (typeof input === 'string') {
      const duration = GoalTime.getDurationFromString(input)

      if (!duration) {
        throw new TypeError(
          `GoalTime constructor unexpected duration, got \`${input}\``
        )
      }

      this.duration = duration
      this.displayDuration = input
    }
  }

  private static getDurationFromString(duration: string) {
    if (duration.search(GOAL_DURATION_RE) === -1) {
      throw new TypeError(
        `GoalTime.getDurationFromString expected duration format to be \`hh:mm:ss.msms\`, got \`${duration}\``
      )
    }

    let split = duration.trim().split(':')

    if (!split.length) {
      throw new TypeError(
        `GoalTime.getDurationFromString expected duration, got \`${duration}\``
      )
    }

    // format for moment
    while (split.length < 3) {
      // transform to hh:mm:ss.msms format
      split = ['00', ...split]
    }

    return moment.duration(split.join(':'), 'seconds').asSeconds() // TODO use milliseconds
  }

  public static fromString(goalTimeString: string): GoalTime {
    // expects format: <duration:string> <distance:number> <name:string>...
    const read = goalTimeString.split(' ').filter(present => present)

    if (read.length < 2) {
      throw new TypeError(
        `GoalTime.fromString expected input format to be \`<duration> <distance>\`, got \`${goalTimeString}\``
      )
    }

    const duration = GoalTime.getDurationFromString(read[0])

    if (!duration) {
      throw new TypeError(
        `GoalTime.fromString unexpected duration, got \`${read[0]}\``
      )
    }

    const distance = +read[1].trim()

    if (!distance || isNaN(distance)) {
      throw new TypeError(
        `GoalTime.fromString expected distance to be coerable to number, got \`${read[1]}\``
      )
    } else if (!GOAL_DISTANCES_LIST.includes(distance)) {
      throw new TypeError(
        `GoalTime.fromString expected distance to be one of ${GOAL_DISTANCES_LIST}, got \`${read[1]}\``
      )
    }

    let readName = read.slice(2)
    let name = ''

    if (readName.length) {
      name = readName.map(n => n.trim()).join(' ')
    } else {
      name = null
    }

    return new GoalTime(read[0], distance, name)
  }

  toString(): string {
    return [this.displayDuration, this.distance, this.name].join(' ')
  }
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
    public restPerRepeat: number,
    public goalTimes: GoalTime[],
    public sameInterval?: number
  ) {}

  // TODO getter/setter for percentage units

  getIntervalForGoalTime(goalTime: GoalTime): number {
    let intervalToTrainToday

    if (this.sameInterval) {
      intervalToTrainToday = this.sameInterval
    } else {
      intervalToTrainToday = moment
        .duration(this.getTargetForGoalTime(goalTime) + this.restPerRepeat, 'seconds')
        .asSeconds()
    }

    return Math.ceil(intervalToTrainToday)
  }

  getTargetForGoalTime(goalTime: GoalTime): number {
    const m = moment.duration(goalTime.duration, 'seconds')
    const percentGoalPace =
      m.asSeconds() * (1 / (this.percentGoalPaceToTrainToday / 100))
    return (
      percentGoalPace /
        goalTime.distance *
        this.todaysRepeats *
        poolType(this.todayMyTrainingPoolIs).to(this.myGoalTimeIsFor) +
      this.goalPlusMinus
    )
  }

  toSecondsProFormat(): SecondsProFormat[] {
    return this.goalTimes.map((goalTime, idx) => {
      const interval = this.getIntervalForGoalTime(goalTime)
      const target = this.getTargetForGoalTime(goalTime)
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
            .todaysRepeats} target: ${formatDurationDisplay(target)}`
          return new SecondsProIntervalFormat(iname, interval)
        })
      )
    })
  }
}
