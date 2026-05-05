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
// TODO: create room id

const problemToDisplay = getUsableProblem(tags,ratingLeft,ratingRight,users);
app.post(`/Modes+1v1+Arena}`,(req,res)=>{
    res.send(problemToDisplay);
})

