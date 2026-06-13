import ENV from '../ENV.js';

const piston_api = ENV.PISTON_URL;

const getExtension = (language: string): string => {
  const ext: Record<string, string> = {
    cpp: 'cpp',
    c: 'c',
    python3: 'py',
    python: 'py',
    typescript: 'ts',
    javascript: 'js',
    java: 'java',
    rust: 'rs'
  };
  return ext[language] || 'txt';
};

const executeCode = async (req: any, res: any) => {
  const { language, version, code, stdin } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required." });
  }

  if (!piston_api) {
    return res.status(500).json({ error: 'Piston API URL is not configured.' });
  }

  try {
    const pistonPayload = {
      language,
      version: version || '*',
      files: [{ name: `solution.${getExtension(language)}`, content: code }],
      stdin: stdin || '',

      compile_timeout: 10000,
      run_timeout: 3000,
      compile_memory_limit: -1,
      run_memory_limit: 256000000
    };

    const pistonResponse = await fetch(piston_api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pistonPayload)
    });

    const data = await pistonResponse.json();

    if (data.compile && data.compile.code !== 0) {
      return res.status(400).json({
        error: 'Compilation failed',
        message: data.compile.stderr || data.compile.output
      });
    }

    if (data.run && data.run.code !== 0) {
      return res.status(400).json({
        error: 'Runtime error',
        message: data.run.stderr || data.run.output
      });
    }

    res.status(200).json({
      output: data.run?.output || '',
      stats: {
        cpuTime: data.run?.cpu_time,
        wallTime: data.run?.wall_time,
        memory: data.run?.memory
      }
    });

  } catch (error) {
    console.error("Piston API Error:", error);
    res.status(500).json({ error: 'Internal server error while executing code' });
  }
};

// Checks each player's most recent CF submission to see if they solved `problem`
const checkLastSubmission = async (req: any, res: any) => {
  const { players, problem } = req.body;

  if (!players || !Array.isArray(players) || !problem) {
    return res.status(400).json({ error: 'players (array) and problem are required.' });
  }

  try {
    for (const handle of players) {
      const codeForcesApi = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`;

      const response = await fetch(codeForcesApi);
      const data: any = await response.json();

      if (data.status === 'OK') {
        for (const sub of data.result) {
          const isCorrectProblem =
            sub.problem.contestId === problem.contestId &&
            sub.problem.index === problem.index;

          if (isCorrectProblem && sub.verdict === 'OK') {
            return res.status(200).json({ winner: handle });
          }
        }
      }
    }

    // No winner found yet
    return res.status(200).json({ winner: null });

  } catch (error) {
    console.error('checkLastSubmission Error:', error);
    res.status(500).json({ error: 'Internal server error while checking submissions' });
  }
};

export { executeCode, checkLastSubmission };
export default { executeCode, checkLastSubmission };
