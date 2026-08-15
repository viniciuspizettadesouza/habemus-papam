import {
  daysSinceElection,
  getAveragePontificateDuration,
  getCurrentPope,
  getLongestPontificate,
  getNextElectionAnniversary,
  getPopeAge,
  getPopeByDate,
  getPopeByName,
  getPontificateDuration,
  getPreviousPope,
  getShortestPontificate,
  isElectionDay,
  listPopes,
} from "habemus-papam";

const USAGE = `Usage: habemus-papam [command] [options]

Commands:
  current              Show the current pope
  previous             Show the previous pope
  history              List the bundled pope history
  pope <name>          Find a pope by papal name, ID, or birth name
  date <YYYY-MM-DD>    Find the pope serving on a date
  anniversary          Show the next election anniversary
  stats                Show completed-pontificate statistics
  help                 Show this help message

Options:
  --json               Output machine-readable JSON
  -h, --help           Show this help message`;

function success(output) {
  return { output, error: "", exitCode: 0 };
}

function failure(message, json) {
  const error = json
    ? JSON.stringify({ error: message })
    : `Error: ${message}\n\n${USAGE}`;
  return { output: "", error, exitCode: 1 };
}

function render(value, json) {
  return json ? JSON.stringify(value, null, 2) : value;
}

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function formatDuration(duration) {
  const parts = [
    [duration.years, "year"],
    [duration.months, "month"],
    [duration.days, "day"],
  ]
    .filter(([value]) => value > 0)
    .map(([value, unit]) => pluralize(value, unit));

  return parts.length > 0 ? parts.join(", ") : "0 days";
}

function formatPope(pope, duration) {
  const lines = [
    pope.name,
    `Birth name: ${pope.birthName}`,
    `Born: ${pope.birthDate}`,
    `Elected: ${pope.elected}`,
  ];

  if (pope.pontificateEnd !== null) {
    lines.push(`Pontificate ended: ${pope.pontificateEnd}`);
  }

  lines.push(`Pontificate: ${formatDuration(duration)}`);
  return lines.join("\n");
}

function currentPayload(pope, now) {
  return {
    ...pope,
    age: getPopeAge(pope, now),
    pontificateDuration: getPontificateDuration(pope, now),
    nextElectionAnniversary: getNextElectionAnniversary(pope, now),
    daysSinceElection: daysSinceElection(pope, now),
  };
}

function runDefault(json, now) {
  const pope = getCurrentPope();

  if (json) {
    return success(render(currentPayload(pope, now), true));
  }

  const lines = [
    "Habemus Papam!",
    `${pope.name} (${pope.birthName}) was elected on ${pope.elected}.`,
  ];

  if (isElectionDay(now)) {
    lines.push("Today is the election day of the current pope!");
  }

  return success(lines.join("\n"));
}

function runCurrent(json, now) {
  const pope = getCurrentPope();
  const payload = currentPayload(pope, now);
  return success(
    render(
      json
        ? payload
        : `${formatPope(pope, payload.pontificateDuration)}\nAge: ${pluralize(payload.age, "year")}`,
      json,
    ),
  );
}

function runPrevious(json, now) {
  const pope = getPreviousPope();
  const duration = getPontificateDuration(pope, now);
  return success(
    render(
      json
        ? { ...pope, pontificateDuration: duration }
        : formatPope(pope, duration),
      json,
    ),
  );
}

function runHistory(json) {
  const history = listPopes();

  if (json) {
    return success(render(history, true));
  }

  return success(
    history
      .map(
        (pope) =>
          `${pope.name} (${pope.elected} – ${pope.pontificateEnd ?? "present"})`,
      )
      .join("\n"),
  );
}

function runPope(nameParts, json, now) {
  if (nameParts.length === 0) {
    return failure("The pope command requires a name.", json);
  }

  const pope = getPopeByName(nameParts.join(" "));

  if (pope === null) {
    return failure(`No pope found for "${nameParts.join(" ")}".`, json);
  }

  const duration = getPontificateDuration(pope, now);
  return success(
    render(
      json
        ? { ...pope, pontificateDuration: duration }
        : formatPope(pope, duration),
      json,
    ),
  );
}

function runDate(dateParts, json) {
  if (dateParts.length !== 1) {
    return failure("The date command requires one YYYY-MM-DD date.", json);
  }

  const [date] = dateParts;
  const pope = getPopeByDate(date);

  if (pope === null) {
    return failure(`No pope found serving on ${date}.`, json);
  }

  const pontificateDuration = getPontificateDuration(pope, date);
  return success(
    render(
      json
        ? { date, pope: { ...pope, pontificateDuration } }
        : `Serving on ${date}:\n${formatPope(pope, pontificateDuration)}`,
      json,
    ),
  );
}

function runAnniversary(json, now) {
  const pope = getCurrentPope();
  const nextElectionAnniversary = getNextElectionAnniversary(pope, now);
  const payload = {
    name: pope.name,
    elected: pope.elected,
    nextElectionAnniversary,
  };

  return success(
    render(
      json
        ? payload
        : `${pope.name}\nNext election anniversary: ${nextElectionAnniversary}`,
      json,
    ),
  );
}

function runStats(json) {
  const payload = {
    longest: getLongestPontificate(),
    shortest: getShortestPontificate(),
    average: getAveragePontificateDuration(),
  };

  return success(
    render(
      json
        ? payload
        : [
            `Longest: ${payload.longest.pope.name} (${formatDuration(payload.longest.duration)})`,
            `Shortest: ${payload.shortest.pope.name} (${formatDuration(payload.shortest.duration)})`,
            `Average: ${pluralize(payload.average.averageDays, "day")} across ${payload.average.sampleSize} completed pontificates`,
          ].join("\n"),
      json,
    ),
  );
}

function rejectUnexpectedArguments(command, commandArgs, json) {
  return commandArgs.length > 0
    ? failure(`The ${command} command does not accept arguments.`, json)
    : null;
}

export function runCli(args = [], { now = new Date() } = {}) {
  const unknownOption = args.find(
    (argument) =>
      argument.startsWith("-") &&
      !["--json", "--help", "-h"].includes(argument),
  );
  const json = args.includes("--json");

  if (unknownOption) {
    return failure(`Unknown option: ${unknownOption}`, json);
  }

  if (args.includes("--help") || args.includes("-h")) {
    return success(USAGE);
  }

  const positional = args.filter((argument) => !argument.startsWith("-"));
  const [command, ...commandArgs] = positional;

  try {
    switch (command) {
      case undefined:
        return runDefault(json, now);
      case "current":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          runCurrent(json, now)
        );
      case "previous":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          runPrevious(json, now)
        );
      case "history":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          runHistory(json)
        );
      case "pope":
        return runPope(commandArgs, json, now);
      case "date":
        return runDate(commandArgs, json);
      case "anniversary":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          runAnniversary(json, now)
        );
      case "stats":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          runStats(json)
        );
      case "help":
        return (
          rejectUnexpectedArguments(command, commandArgs, json) ??
          success(USAGE)
        );
      default:
        return failure(`Unknown command: ${command}`, json);
    }
  } catch (error) {
    if (error instanceof TypeError || error instanceof RangeError) {
      return failure(error.message, json);
    }

    throw error;
  }
}
