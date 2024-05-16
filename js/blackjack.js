function hand() {
    //二次元配列でトランプのデッキを作る
    let arr = [];

    for (let i = 1; i <= 4; i++) {
        arr[i] = [];
        for (let j = 1; j <= 13; j++) {
            arr[i][j] = i * 100 + j;
        }
    }

    // 乱数でシャッフルした一連のデッキを作る
    let deck = [];
    for (let k = 0; k <= 51; k++) {
        let P = Math.ceil(Math.random() * 4);
        let Q = Math.ceil(Math.random() * 13);
        W = arr[P][Q];
        if (!deck.includes(W)) {
            deck.push(W);
        } else {
            k--;
            // 上の既存条件で弾いた場合のループ回数補正
        }
    }
    return deck.pop();
}

// カードの数を返す関数
function suuchi(num) {
    let str = String(num);
    if ((str[1] == 1) && (str[2] == 0)) {
        return "A";
    } else {
        let kaz = str[1] + str[2];
        return Number(kaz);
    }
}

// 初回の配布（2枚ずつ）
let pl = 0, pn = 0;
let px;
let pcon = 0;
let dl = 0, dn = 0;
let dx;
let dcon = 0;
let l = 0;
let calling, betmsg;
let d_zero;
let win = 0, lose = 0, even = 0;
let money = 1000;
let money1;
let betbox, bet;
let wallet;

// 開始ボタン
calling = document.querySelector("#call");
calling.style.display = "none";
wallet = document.querySelector("#wallet");
wallet.value = money;
betbox = document.querySelector("#betbox");
betmsg = document.querySelector("#betmsg");
//bet = betbox.value;
let hit = document.querySelector("#hit");
hit.style.display = "none";
let stand = document.querySelector("#stand");
stand.style.display = "none";
let replay = document.querySelector("#replay");
replay.style.display = "none";
let start = document.querySelector("#start");

//初回STARTボタン処理
start.addEventListener('click', function (e) {
    bet = Number(betbox.value);
    money1 = money;
    money -= bet;
    // 初回掛け金が持ち金を上回ってないかチェック
    if (money < 0) {
        betmsg.innerHTML = "Bet only what you have.";
        bet = money1;
        betbox.value = bet;
        money = 0;
    }
    wallet.value = money;
    game_play();
    let target = e.currentTarget;
    target.removeEventListener('mouseup', arguments.callee, false);
});

function game_play() {
    pcon = 0; dcon = 0;
    pl = 0; pn = 0;
    dl = 0; dn = 0;
    // ボタン表示
    start.style.display = "none";
    replay.style.display = "none";
    hit.style.display = "block";
    stand.style.display = "block";
    // 初回配札

    for (l = 0; l <= 1; l++) {
        // プレイヤー
        pl = hand();
        px = document.querySelector("#p" + l);
        $(px).html('<img src="img/deck/' + pl + '.png" class="card">');
        pn = suuchi(pl);
        if (pn != "A") {
            pcon += pn;
            console.log("player", pn, pcon);
        } else if (pcon <= 10) {
            pcon += 11;
            console.log("player", pn, pcon);
        } else {
            pcon += 1;
            console.log("player", pn, pcon);
        }
        if (pcon > 21) {
            //負け処理
            calling.innerHTML = 'You lose.';
            //money -= bet;
            wallet.value = money;
            lose++;
            //break;//この後処理が必要
            return;
        }

        // ディーラー
        dl = hand();
        let dx = document.querySelector("#d" + l);
        if (l == 0) {
            $(dx).html('<img src="img/deck/back.png" class="card">');
            d_zero = dl;
        } else {
            $(dx).html('<img src="img/deck/' + dl + '.png" class="card">');
        }
        dn = suuchi(dl);
        if (dn != "A") {
            dcon += dn; console.log("dealer", dn, dcon);
        } else if (dcon <= 10) {
            dcon += 11; console.log("dealer", dn, dcon);
        } else {
            dcon += 1; console.log("dealer", dn, dcon);
        }
    }
}
//game_playここまで

//HIT
hit.addEventListener('mouseup', function () {
    pl = hand();
    px = document.querySelector("#p" + l);
    $(px).html('<img src="img/deck/' + pl + '.png" class="card">');
    pcon += suuchi(pl);
    if (pcon > 21) {
        dy = document.querySelector("#d0");
        $(dy).html('<img src="img/deck/' + d_zero + '.png" class="card">');
        hit.style.display = "none";
        //負け処理
        calling.style.display = "block";
        calling.innerHTML = "You lose.";
        wallet.value = money;
        lose++;
        // 勝敗数表示
        setTimeout(function () {
            calling.innerHTML = 'You won ' + win + ' times, lost ' + lose + ' times.';
        }, 2000);
        // 勝敗数表示ここまで
        stand.style.display = "none";
        if (money > 0) {
            //Replayボタンの処理
            replay.style.display = "block";
            replay.addEventListener('mouseup', function (e) {
                calling.style.display = "none";
                //画像消去
                for (let r = 0; r <= 5; r++) {
                    px = document.querySelector("#p" + r);
                    $(px).html('');
                    dx = document.querySelector("#d" + r);
                    $(dx).html('');
                }
                //画像消去ここまで
                kakekinshori();
                game_play();
                let target = e.currentTarget;
                target.removeEventListener('mouseup', arguments.callee, false);
                //Replayボタンのイベントリスナーを解除
            });
        } else {
            calling.style.display = "block";
            calling.innerHTML = '<a href="index.html">You are broke. See ya!<a/>';
        }
    }
    l++;
});

//STAND
stand.addEventListener('mouseup', function () {
    dy = document.querySelector("#d0");
    $(dy).html('<img src="img/deck/' + d_zero + '.png" class="card">');
    if (dcon <= 16) {
        dl = hand();
        dcon += suuchi(dl);
        let dx = document.querySelector("#d2");
        $(dx).html('<img src="img/deck/' + dl + '.png" class="card">');
    }
    bet = Number(betbox.value);
    if (pcon > 21 || (pcon < dcon && dcon < 22)) {
        calling.innerHTML = 'You lose.';
        wallet.value = money;
        lose++;
    } else if (pcon == dcon) {
        calling.innerHTML = 'Push. Neither Wins.';
        money += bet;
        wallet.value = money;
        even++;
    } else {
        calling.innerHTML = 'You win!';
        money += bet * 2;
        wallet.value = money;
        win++;
    }
    hit.style.display = "none";
    calling.style.display = "block";
    // 勝敗表示
    setTimeout(function () {
        if (money > 0) {
            calling.innerHTML = 'You won ' + win + ' times, lost ' + lose + ' times. Even for ' + even + ' times.';
        } else { calling.innerHTML = '<a href="index.html">You are broke. See ya!<a/>'; }
    }, 1000);
    // 勝敗表示ここまで
    stand.style.display = "none";
    if (money > 0) {
        replay.style.display = "block";
        replay.addEventListener('mouseup', function (e) {
            calling.style.display = "none";
            //画像消去
            for (let r = 0; r <= 5; r++) {
                px = document.querySelector("#p" + r);
                $(px).html('');
                dx = document.querySelector("#d" + r);
                $(dx).html('');
            }
            //画像消去
            kakekinshori();
            game_play();
            let target = e.currentTarget;
            target.removeEventListener('mouseup', arguments.callee, false);
        });
    }
});


function kakekinshori() {
    let counter = 0;
    bet = Number(betbox.value);
    money1 = money;
    money = money - bet;
    if (money < 0) {
        betmsg.innerHTML = "Bet only what you have.";
        bet = money1;
        betbox.value = bet;
        money = 0;
    }
    wallet.value = money;
    pcon = 0, dcon = 0;
    counter++;
}
