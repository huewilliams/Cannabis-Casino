let host = '18.220.117.207';

// 베팅 금액 설정 버튼 로직
let betting = document.getElementById('bet_money');
let thousand = document.getElementById('thousand');
let ten_thousand = document.getElementById('ten_thousand');
let reset = document.getElementById('reset');
let input = 0;
thousand.addEventListener('click', ()=>{
    input+= 1;
    betting.textContent = input;
});
ten_thousand.addEventListener('click', ()=>{
    input-= 1;
    betting.textContent = input;
});
reset.addEventListener('click', ()=>{
   input = 0;
   betting.textContent = '0';
});

// 게임 생성 로직
let createBtn = document.getElementById('create_btn');
createBtn.addEventListener('click', async ()=>{
    if(input == 0) {
        alert("베팅 금액을 입력해주세요!");
        return;
    }
   let room_name = document.getElementById('room_name').value;
    if(room_name == false) {
        alert("방 이름을 입력해주세요");
        return;
    }
    let dup = 0;
    await axios({
        method: 'get',
        url: `http://${host}:5000/poker/check/${room_name}`
    })
        .then((res)=>{
            if(res.data == 'duplicate') {
                alert("이름이 중복된 게임방이 있습니다");
                dup = 1;
                return;
            } return;
        });
    if(dup == 1) {
        dup = 0;
        return;
    }
   console.log('room name :', room_name);
   console.log('betting : ', input);
   let data = {
     title: room_name,
       bet: input,
   };
    await axios({
        method: 'post',
        url: `http://${host}:5000/poker/`,
        data: data,
        headers: {
            token: document.cookie,
        }
    })
        .then((response) => {
            console.log(response.data);
            window.location.href=`http://${host}:5000/poker/${response.data}`
        })
});

// axios 로 game room 정보 가져오는 로직
let rooms = document.getElementById('rooms');
axios.get(`http://${host}:5000/poker/list`)
    .then((res)=> {
        let index = 0;
        while(res.data[index]) {
            let tr = document.createElement('tr');
            let title = document.createElement('th');
            title.textContent = res.data[index].title;
            let owner = document.createElement('th');
            owner.textContent = res.data[index].owner;
            let people = document.createElement('th');
            people.textContent = res.data[index].people + "/2";
            let bet = document.createElement('th');
            bet.textContent = res.data[index].bet;
            let enter = document.createElement('button');
            enter.addEventListener('click', ()=>{
                console.log(title.textContent);
                if(Number(people.textContent.split('/')[0]) >= 2) {
                    alert("게임 인원 수가 꽉 차 입장할 수 없습니다");
                } else {
                    window.location.href=`http://${host}:5000/poker/${title.textContent}`;
                }
            });
            enter.textContent = '게임 입장';
            rooms.append(tr);
            rooms.append(title);
            rooms.append(owner);
            rooms.append(people);
            rooms.append(bet);
            rooms.append(enter);
            index ++;
        }
    })
    .catch((error)=>{
        console.error(error);
});