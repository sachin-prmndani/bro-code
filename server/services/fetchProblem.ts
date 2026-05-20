async function isSolved(handle: string, contestId: number, index: string): Promise<boolean> {
  const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`;
  const res = await fetch(url);
  const result = await res.json();

  if (result.status !== 'OK') return false;

  // forEach cannot return — use find/some instead
  return result.result.some(
    (submission: any) =>
      submission.verdict === 'OK' &&
      submission.problem.contestId === contestId &&
      submission.problem.index === index
  );
}

async function getUsableProblem(
  tags: string[],
  ratingLeft: number,
  ratingRight: number,
  users: string[]
) {
  const tagParam = tags.length > 0 ? tags.join(';') : '';
  const url = `https://codeforces.com/api/problemset.problems${tagParam ? `?tags=${encodeURIComponent(tagParam)}` : ''}`;
  console.log('[CF] fetching:', url);  

  const response = await fetch(url);
  const data = await response.json();
  console.log('[CF] status:', data.status, 'problems count:', data.result?.problems?.length); // ← and this

  if (data.status !== 'OK') {
    throw new Error('Codeforces API is not working');
  }

  const problemset: any[] = data.result.problems;

  for (const problem of problemset) {
    if (!problem.rating) continue;
    if (problem.rating < ratingLeft || problem.rating > ratingRight) continue;

    const { contestId, index } = problem;

    const results = await Promise.all(
      users.map(user => isSolved(user, contestId, index))
    );

    if (results.every(solved => !solved)) {
      return problem;
    }
  }

  return null;
}

export { getUsableProblem, isSolved };