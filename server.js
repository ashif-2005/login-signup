const express = require('express')
const parser = require('body-parser')
const fs = require('fs')
const cors = require('cors')

const port = process.env.PORT || 8000

const app = express()
app.use(parser.json())
app.use(cors())

//get request...
app.get('/',(req,res)=>{
    res.status(200).json({
        "status":"request recieved"
    })
})

function sample(){
    return new Promise((resolve,reject)=>{
        fs.readFile('./data.json',(error,data)=>{
            let Data = JSON.parse(data)
            resolve(Data)
        })
    })
}

sample().then((data)=>{
    let count = 0
    app.post('/login',(req,res)=>{
        console.log(data)
        for(i of data){
            if(req.body.Name === i.Name && req.body.Password === i.Password){
                count++
            }
        }
        if(count>0){
            res.status(200).json({
                "status":"Successfully loged in"
            })
            count = 0
        }
        else{
            res.status(401).json({
                "status":"Invalid user name or password"
            })
        }   
    })
})

sample().then((data)=>{
    let count = 0
    app.post('/register',(req,res)=>{
        console.log(req.body)
        for(i of data){
            if(req.body.Name === i.Name){
                count++
            }
        }
        if(count>0){
            res.status(200).json({
                "status":"user already exixt"
            })
            count = 0
        }
        else{
            data.push(req.body)
            fs.writeFile('./data.json',JSON.stringify(data),()=>{
                console.log('Data Updated Successfull')
            })
            res.status(201).json({
                "status":"user created successfully"
            })
        }
    })
})

app.listen(port,()=>{
    console.log(`Listening on port ${port}....`)
})