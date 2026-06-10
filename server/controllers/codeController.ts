import ENV from '../ENV.js';

const piston_api = ENV.PISTON_URL;

const getExtension = (language: string): string => {
  const ext: Record<string, string> = {
    cpp: 'cpp',
    c: 'c',
    python3: 'py',
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

  try {
    const pistonPayload = {
      language,
      version: version || '*',
      files: [{ name: `solution.${getExtension(language)}`, content: code }],
      stdin: stdin || '',
      
      // --- EXECUTION LIMITS ---
      compile_timeout: 10000,       // 10 seconds
      run_timeout: 3000,            // 3 seconds
      compile_memory_limit: -1,     // -1 means unlimited
      run_memory_limit: 256000000   // 256 MB (in bytes)
    };

    const pistonResponse = await fetch(piston_api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pistonPayload)
    });

    const data = await pistonResponse.json();

    // 1. Check for compile errors ONLY if the language actually compiles
    if (data.compile && data.compile.code !== 0) {
      return res.status(400).json({ 
        error: 'Compilation failed', 
        message: data.compile.stderr || data.compile.output 
      });
    }

    // 2. Check for runtime crashes (exit code is not 0)
    if (data.run && data.run.code !== 0) {
      return res.status(400).json({ 
        error: 'Runtime error', 
        message: data.run.stderr || data.run.output 
      });
    }

    // 3. Return successful output
    res.status(200).json({
      // We use data.run.output here because it combines stdout and stderr
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

export default executeCode;