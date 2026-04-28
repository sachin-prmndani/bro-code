import express from "express";
const app = express();
import ENV from "../ENV.js";




async function isSolved(handle:string,contestId:number,index:string) {
    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`;
    const res = await fetch(url);
    const result = await res.json();
    result.forEach((submission:any)=>{
        if(submission.verdict==="OK" && submission.problem.contestId===contestId && submission.problem.index===index){
            return true;
        }
    })
    return false;

    
}

async function getUsableProblem(tags:string[],ratingLeft:number,ratingRight:number,users: string[]) {
  let apiToFetchProblems:string = `https://codeforces.com/api/problemset.problems?tags=`;
  const response = await fetch(apiToFetchProblems);
const data = await response.json();
if(data.status!=="OK"){
    throw new Error("Codeforces API is not working");
}
const problemset = data.problems;

  for (const problem of problemset) {
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

export  {getUsableProblem,isSolved};

 

 


 







