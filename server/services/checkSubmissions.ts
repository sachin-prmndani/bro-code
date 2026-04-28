import express from 'express';
const app = express();
import {isSolved,getUsableProblem} from "../services/fetchProblem.js";

let users:string[] = [];
let problemIdx:string = "";
let contestId:number = 0;
app.post('problem',(req,res)=>{
    users = req.body;
})
async function findWinner() {
    for(const user in users){
    if(await isSolved(user,contestId,problemIdx)){
        return user;
       
    }
}
return "";
}




