let table = document.getElementById('ui');

// 폭탄 갯수 선택시
function boomber(button) {
    let booms = document.getElementsByClassName('booms');
    select = 1;
    for(let i=0; i<4; i++)
    {
        booms[i].style.backgroundColor = 'black';
        booms[i].style.color = 'crimson';
    }
    button.style.backgroundColor = '#a07b12';
    button.style.color = 'black';
    return button.textContent;
}

// 게임 시작 시 지뢰 타일 생성
function make() {
    for (let i = 0; i < 5; i++) {
        let tr = document.createElement('tr');
        table.append(tr);
        for (let j = 0; j < 5; j++) {
            let td = document.createElement('td');
            td.id = i * 5 + j + 1;
            td.addEventListener('click', () => {
                touch(td);
            });
            tr.append(td);
        }
    }
}

// 게임 끝날시
function gameOver() {
    ui.style.pointerEvents = 'none';
}

// 게임 시작시
function gameStart() {
    ui.style.pointerEvents = 'auto';
}

// 타일에 폭탄 갯수만큼 생성
function calc(num) {
    for(let i=1; i<26; i++)
    {
        let element = document.getElementById(i);
        arr.push(element);
    }
    for(let i=0; i<25; i++)
    {
        let rand = random.integer(0, arr.length-1);
        let temp = arr[rand];
        arr[rand] = arr[i];
        arr[i] = temp;
    }
    for(let i=num; i>0; i--)
    {
        booms.push(arr[i].id);
        console.log(arr[i].id);
    }
}

function cashOut() {
    cashout = document.createElement('button');
    cashout.textContent = 'CashOut!';
    cashout.addEventListener('click',()=>{
        if(time < 1)
            alert('한 개 이상의 타일을 열어야 합니다');
        else
        {
            yam += remain;
            yamUI.textContent = yam;
            gameOver();
            cashout.style.pointerEvents = 'none';
            cash = 1; // 새게임 가능
        }
    });
    accurate.append(cashout);
}