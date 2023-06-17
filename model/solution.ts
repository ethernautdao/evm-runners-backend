export interface SolutionFeedback {
  fuzz: TestResult;
  sanity: TestResult;
  gas: TestResult;
  size: TestResult;
}

export interface TestResult {
  success: boolean;
  reason: string;
  decoded_logs: any[];
}

export const convertToSolutionFeedback = (output: any) => {
  let solutionFeedback: SolutionFeedback = {
    fuzz: {
      success: false,
      reason: "",
      decoded_logs: [],
    },
    sanity: {
      success: false,
      reason: "",
      decoded_logs: [],
    },
    gas: {
      success: false,
      reason: "",
      decoded_logs: [],
    },
    size: {
      success: false,
      reason: "",
      decoded_logs: [],
    },
  };

  let formattedStdout = '{"test/' + output.stdout.split('{"test/').splice(1);
  let jsonResult = JSON.parse(formattedStdout);
  Object.entries(jsonResult).forEach(([_, value]: any) => {
    Object.entries(value["test_results"]).forEach(([k, v]: any) => {
      if (k.includes("fuzz")) {
        solutionFeedback.fuzz = {
          success: v.success,
          reason: v.reason,
          decoded_logs: v.decoded_logs,
        };
        return;
      }

      if (k.includes("sanity")) {
        solutionFeedback.sanity = {
          success: v.success,
          reason: v.reason,
          decoded_logs: v.decoded_logs,
        };
        return;
      }

      if (k.includes("gas")) {
        solutionFeedback.gas = {
          success: v.success,
          reason: v.reason,
          decoded_logs: [Number(v.kind.Fuzz.mean_gas)],
        };
        return;
      }

      if (k.includes("size")) {
        solutionFeedback.size = {
          success: v.success,
          reason: v.reason,
          decoded_logs: [Number.parseInt(v.decoded_logs[0].split(":")[1])],
        };
        return;
      }
    });
  });

  return solutionFeedback;
};
