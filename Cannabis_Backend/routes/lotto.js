const express = require('express');
const random = require('random');

let router = express.Router();

const redis = require('redis');
const client = redis.createClient('18078', 'redis-18078.c10.us-east-1-2.ec2.cloud.redislabs.com');

client.auth('Br34hJvfhfuBY32qWS9Z69mO02cKcRMS');
client.on('error', (err) => {
    console.log(err);
});

router.post('/set', async (req, res) => {
    if (req.body.secret != 'cannabis_secret')
        res.send('접근권한이 없습니다');

    await client.flushdb(function (err, succeeded) {
        console.log(succeeded);
    });

    let list = Array(45)
        .fill()
        .map((element, index) => {
            return index + 1;
        });

    for (let i = 0; i < list.length; i++) {
        let rand = random.integer(0, list.length - 1);
        let temp = list[rand];
        list[rand] = list[i];
        list [i] = temp;
    }

    list.join('');
    let select = list.splice(0, 7);
    console.log('새로운 로또 번호 : ', select);
    select.forEach(x => {
        client.lpush('lotto', x);
    });
    let check = client.lrange('lotto', 0, client.llen('lotto') - 1);
    res.json(check);
});

router.post('/check', async (req, res) => {
    let check;
    let count = 0;

    function getData(callback) {
        return new Promise((resolve, reject) => {
            client.lrange('lotto', 0, -1, (err, reply) => {
                resolve(reply);
            });
        })
    }

    await getData().then((reply) => {
        check = reply;
    });

    let user = req.body.lotto.split('-');

    for (let i = 0; i < user.length; i++) {
        for (let j = 0; j < check.length - 1; j++) {
            if (user[i] == check[j])
                count++;
        }
    }
    res.setHeader('Content-Type', 'application/json');
    switch (count) {
        case 6:
            res.json({rank: '1'});
            break;
        case 5:
            if(user[user.length-1] == check[check.length-1])
                res.json({rank: '2'});
            else
                res.json({rank: '3'});
        case 4:
            res.json({rank: '4'});
        case 3:
            res.json({rank: '5'});
        default:
            res.json({rank: '0'});
    }
});

module.exports = router;