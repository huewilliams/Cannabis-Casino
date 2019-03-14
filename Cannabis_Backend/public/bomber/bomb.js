let accurate = document.getElementById('accurate');
let yamUI = document.getElementById('yam');
let random = new Random(), bomb, next, stake, cashout;

let yam = 100000; // 보유 yam 수치
yamUI.textContent = yam;
let select = 0; // 폭탄 선택 여부
let list = [1,3,5,24]; // 폭탄 개수 유형
let booms = []; // 선정된 폭탄의 인덱스

let bomber = 0; // 폭탄 개수
let boom = document.getElementById('boom');

list.forEach(function (value, index) {
   let button = document.createElement('button');
   button.textContent = value;
   button.className = 'booms';
   button.addEventListener('click',()=>{
       bomber = boomber(button);
   });
   boom.append(button);
});

// 타일 클릭 시
function touch(event) {
    time++;
    let flag = 0;
    booms.forEach((value, index)=>{
        if(value === event.id)
            flag = 1
    });
    if(flag)
    {
        event.style.backgroundColor = 'red';
        remain = 0;
        stake.textContent = 'stake : ' + String(remain);
        gameOver();
        alert('게임 오버 되었습니다');
    }
    else
    {
        event.style.backgroundColor = 'forestgreen';
        event.textContent = value;
        value = Math.floor(Number(input.value) / 25 * bomber + (time * 3 * bomber * 0.001 * input.value));
        remain = Number(remain) + value;
        next.textContent = 'next : ' + String(value);
        stake.textContent = 'stake : ' + String(remain);
        event.style.textAlign = 'center';
        // 클릭 후 재클릭 방지
        event.style.pointerEvents = 'none';
    }
}

form = document.getElementById('bet');
input = document.getElementById('text');

let time = 0; // 횟수
let value; // next 값
let remain =0; // stake 값
let cash  = 1;
let arr = []; // 선택된 폭탄 인덱스

// 배팅 금액 입력 또는 게임시작 시
form.addEventListener('submit', (event)=>{
    if(select < 1)
    {
        alert('폭탄 갯수를 선택해주세요!');
    }
    else
    {
        event.preventDefault();
        if(cash)
        {
            arr = [];
            booms = [];
            while(table.firstChild) {
                table.removeChild(table.firstChild);
            }
            while(accurate.firstChild) {
                accurate.removeChild(accurate.firstChild);
            }
            gameStart();
            make();

            next = document.createElement('p');
            next.textContent = 'next :';
            accurate.append(next);

            stake = document.createElement('p');
            stake.textContent = 'stake :';
            accurate.append(stake);

            cashOut();

            calc(bomber);
            bomb = random.integer(1,25);
            value = Math.floor(Number(input.value) / 25 * bomber + (time * 3 * bomber * 0.001 * input.value));
            next.textContent += String(value);
            stake.textContent += input.value;
            remain = Number(input.value);
            yam-= input.value;
            yamUI.textContent = yam;
            cash = 0;
        }
        else
        {
            alert('새 게임을 시작하기 전에 먼저 cashout 을 해야 합니다.');
        }
    }
});