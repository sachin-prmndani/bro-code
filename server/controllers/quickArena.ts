import express from 'express';
const app = express();
import mongoose from 'mongoose';
import arenaRoom from '../schemas/arenaModel.js';
import ENV from '../ENV.js';
import { isSolved,getUsableProblem } from '../services/fetchProblem.js';

let users:string[] = [];
let ratingLeft:number = 0;
let ratingRight:number = 0;
let tags:string[] = [];

app.post('/quickArena',(req,res)=>{
    const data = req.body;
    ratingLeft = data.ratingLeft;
    ratingRight = data.ratingRight;
    users = data.users;
    tags = data.tags;
})
function createRoomId(){
    let characters  = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];    
    let nums = ['0','1','2','3','4','5','6','7','8','9'];
    let roomId = '';
    for(let i = 0 ; i<5;i++){
        if(i&1){
            roomId+=characters[Math.floor(Math.random()*characters.length)];
        }else{
            roomId+=nums[Math.floor(Math.random()*nums.length)];
        }
    }
    return roomId;
    
}

const problemToDisplay = getUsableProblem(tags,ratingLeft,ratingRight,users);
app.post(`/Modes+1v1+Arena}`,(req,res)=>{
    res.send(problemToDisplay);
})

