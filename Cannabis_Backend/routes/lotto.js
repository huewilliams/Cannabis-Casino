const express = require('express');
const random = require('random');

let router = express.Router();

const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);

client.auth(process.env.REDIS_PASSWORD);
client.on('error', (err)=>{
    console.log(err);
});

router.post('/set', (req, res)=>{
    if(req.body.secret != process.env.REDIS_SECRET)
        res.send('접근권한이 없습니다');
    let list = Array(45)
        .fill()
        .map((element, index)=>{
            return index + 1;
        });

    for (let i = 0; i < list.length; i++) {
        let rand = random.integer(0, list.length - 1);
        let temp = list[rand];
        list[rand] = list[i];
        list [i] = temp;
    }

    list.join('');
    let select = list.splice(0,7);
    console.log('새로운 로또 번호 : ',select);
    select.forEach(x => {
        client.lpush('lotto', x);
    });
    let check = client.lrange('lotto',0,client.llen('lotto')-1);
    res.json(check);
});

module.exports = router;