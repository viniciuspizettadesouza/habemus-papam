import {
  daysSinceElection,
  getCurrentPope,
  getNextElectionAnniversary,
  getPopeAge,
  getPopeByName,
  getPontificateDuration,
  getPreviousPope,
  isElectionDay,
  listPopes,
} from "habemus-papam";

const USAGE = `Usage: habemus-papam [command] [options]

Commands:
  current              Show the current pope
  previous             Show the previous pope
  history              List the bundled pope history
  pope <name>          Find a pope by papal name, ID, or birth name
  anniversary          Show the next election anniversary
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

  switch (command) {
    case undefined:
      return runDefault(json, now);
    case "current":
      return runCurrent(json, now);
    case "previous":
      return runPrevious(json, now);
    case "history":
      return runHistory(json);
    case "pope":
      return runPope(commandArgs, json, now);
    case "anniversary":
      return runAnniversary(json, now);
    case "help":
      return success(USAGE);
    default:
      return failure(`Unknown command: ${command}`, json);
  }
}
