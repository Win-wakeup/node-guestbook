/*// I am a Comment. I do Nothing

// How to Declare variables:
let x = 5;
let y = 6; 
// y = 10; 會出現錯誤
// How to Compute values:
let z = x + y;

// How to Output values:
console.log(z);

function add(a, b) {
  return a + b;
}
console.log(add(3, 5)); // 8
function multiply(a, b) {
  return a * b;
}
console.log(multiply(3,5));
////////進階寫法
/*const multiply = (a, b) => { a * b; };
console.log(multiply(4, 6));*/

/*alert('hello world');
//建立自訂函式

function hello(){      
    alert('hello world');
}
function hello2(name){  
    let n = prompt("請輸入暱稱");
    alert('hello, '+name+'你的暱稱是'+n);
}
function sum(x,y){
    let s = x + y;
    return s;
}
console.log(sum(4,5));

const btn1 = document.getElementById("btn1");  //取得ID
const btn2 = document.getElementById("btn2");  //取得ID
const btn3 = document.getElementById("btn3");  //取得ID
const btn4 = document.getElementById("btn4");  //取得ID
const img = document.getElementById("img");  //取得ID
 x = 20;
 y = "block";

btn1.addEventListener("click",function(){  //監聽事件，點擊，執行函式
    document.getElementById("demo1").innerHTML = "Hello JavaScript";
})
btn2.addEventListener("click",function(){  //監聽事件，點擊，執行函式
x = x + 10;
document.getElementById("demo2").style.fontSize=x + "px";
})
btn3.addEventListener("click",function(){  //監聽事件，點擊，執行函式
    alert("沒事");
    this.innerText = "沒事";
    this.style.color = "red";
})
btn4.addEventListener("click",function(){  //監聽事件，點擊，執行函式
    y = (y=="none")? "block" : "none";
    document.getElementById("demo1").style.display = y;
    document.getElementById("demo2").style.display = y;
})
img.addEventListener("mouseover",function(){  //監聽事件，滑鼠懸浮上面
    this.src = ".jpg";
})

img.addEventListener("click",function(){  //監聽事件，滑鼠懸浮上面
    this.src = "cat2.jpg";
    setTimeout(() => {
        this.src = "cat1.jpg";  // 回到閉嘴的圖片
    }, 100);
})
img.addEventListener("mouseout",function(){  //監聽事件，滑鼠懸浮離開
    this.src = "Cat03.jpg";
})
*/

const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");
const result = document.querySelector(".result");
const count = document.querySelector(".count");
const restartBtn = document.querySelector(".restartBtn");
const guesses = document.querySelector(".guesses");

function setGameOver() {
    guessField.disabled = true; //停止輸入功能
    guessSubmit.disabled = true;    //停止按鈕功能
}

let randomNumber = Math.floor(Math.random()*100);
console.log("觀察隨機的數字：", randomNumber);

function initGame() {
    countNum = 0;
    count.textContent = "猜測次數：" + countNum;

    // 清空結果與背景色
    result.textContent = "猜測結果：";
    result.style.backgroundColor = "";

    // 清空所有猜測紀錄
    const guesses = document.querySelector(".guesses");
    guesses.textContent = "";

    // 清空輸入框
    guessField.value = "";
    guessField.disabled = false;

    // 啟用按鈕
    guessSubmit.disabled = false;

    // 讓輸入框重新取得焦點
    guessField.focus();

    randomNumber = Math.floor(Math.random()*100);
    console.log("觀察隨機的數字：", randomNumber);
}

let countNum =0;   //廣域變數
function checkGuess() {
    countNum++;
    count.textContent = "猜測次數："+countNum;
    const userGuess = Number(guessField.value);  //取得欄位值，並轉為數字
    guesses.textContent += userGuess + " ";
    if  (  userGuess ===  randomNumber) {
        result.textContent = "猜測結果：Congratulations!" ;
        if(countNum<=1){
            result.textContent += "---遊戲結束，你是鬼吧!";
            alert("遊戲結束");
            setGameOver();
        }
        else if(countNum<=5){
            result.textContent += "---遊戲結束，運氣不錯!";
            alert("遊戲結束");
            setGameOver();
        }
        else if(countNum<=8){
            result.textContent += "---遊戲結束，運氣還行!";
            alert("遊戲結束");
            setGameOver();
        }
        else if(countNum<=9){
            result.textContent += "---遊戲結束，狗運降臨!";
            alert("遊戲結束");
            setGameOver();
        }
        else{
            result.textContent += "---遊戲結束，海底撈月!";
            alert("遊戲結束");
            setGameOver();
        }
    }
    else if (userGuess < randomNumber ) {
        result.textContent = "猜測結果：數字太小!" ;
    }
    else if (userGuess  > randomNumber ) {
        result.textContent = "猜測結果：數字太大!";
    }
    //guessField.focus();       //游標焦點預設在輸入欄位裡
    if(countNum>=10){
        result.textContent += "---遊戲結束，你個菜狗!";
        result.style.backgroundColor="red";
        alert("遊戲結束");
        setGameOver();
    }
}

guessSubmit.addEventListener("click", checkGuess);   //當按鈕被點擊，執行函
restartBtn.addEventListener("click", initGame);
