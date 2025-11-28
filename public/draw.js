var canvas = document.getElementById('canvas'); // 取得畫布元素
var ctx = canvas.getContext('2d'); // 使用2D繪圖

/*
ctx.fillRect(300,100,500,500); //畫了一個座標為(300,100)的500px * 500px的矩形
ctx.clearRect(400,150,100,100); //再清除一個座標為(350,150)的100px * 100px的矩形形狀
ctx.strokeRect(425,175,50,50); //最後畫一個座標為(425,175)的50px * 50px的矩形邊框
ctx.clearRect(500,400,100,100); //再清除一個座標為(500,300)的100px * 100px的矩形形狀
ctx.clearRect(600,150,100,100); //再清除一個座標為(600,150)的100px * 100px的矩形形狀
ctx.strokeRect(625,175,50,50); //最後畫一個座標為(642,175)的50px * 50px的矩形邊框

//畫三角形
ctx.beginPath(); //開始路徑
ctx.moveTo(150,50); //將起始點移到座標(150,50)
ctx.lineTo(250,200); //畫一條直線到(250,200)
ctx.lineTo(50,200); //再畫一條直線到(50,200)
ctx.closePath();
ctx.fillStyle='black'; //設定填充顏色為黑色
ctx.fill(); //最後填滿路徑，形成三角形

//畫圓形
ctx.beginPath(); //開始路徑
ctx.moveTo(50,50); //將起始點移到座標(150,50)
ctx.arc(150,150,50,0,2*Math.PI,true); //畫圓
ctx.closePath();
ctx.fillStyle='blue'; //設定填充顏色為藍色
ctx.fill(); //最後填滿路徑，形成藍色圓形

//畫愛心
ctx.beginPath(); //開始路徑
ctx.moveTo(75,40); //將起始點移到座標(75,40)
ctx.bezierCurveTo(75,37,70,25,50,25);
ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
ctx.bezierCurveTo(20,80,40,102,75,120);
ctx.bezierCurveTo(110,102,130,80,130,62.5);
ctx.bezierCurveTo(130,62.5,130,25,100,25);
ctx.bezierCurveTo(85,25,75,37,75,40);
ctx.closePath();
ctx.fillStyle='red'; //設定填充顏色為紅色
ctx.fill(); //最後填滿路徑，形成紅色愛心


ctx.font = "20px sans-serif"; //設定文字字型 大小
ctx.fillStyle="#00A0E9"; //設定文字填滿顏色
ctx.strokeStyle="#D50A17"; //設定文字邊框
ctx.fillText("第一行文字Hello world", 10, 300);  //填滿文字
ctx.strokeText("第二行框框文字Hello text", 10, 350); //邊框文字
ctx.fillText("第三行被壓縮的文字", 10, 400, 100);  //壓縮文字
*/

var toshow = document.getElementById('toshow'); // 按鈕產生圖
var show = document.getElementById('show'); 	// 顯示圖
var clear = document.getElementById('clear'); // 按鈕清除
var drawing = false;	//判斷是否正在繪圖
var queue = [];		//佇列結構依序產生筆畫
//自訂繪圖函式，x,y起始、x1,y1結束
function drawLine(ctx,x,y,x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();
}


//滑鼠左鍵按下
canvas.addEventListener('mousedown', function(e) {
    if(!drawing) { 		//預設為false，加!變相反
        drawing = true;	//繪圖狀態啟動true
	  // e為事件者(游標)的當下位置，偏移位置讓落點好看
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,x,y,x,y);	//起始位置繪圖
        queue.push([x,y]);	//依序將經過的路徑放入佇列
    }
});
//滑鼠移動
canvas.addEventListener('mousemove', function(e) {
    if(drawing) {	//按著滑鼠時為true
        var old = queue.shift();	//依序移除佇列，取得剛剛路徑
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0],old[1],x,y);	//持續繪圖(舊>新)
        queue.push([x,y]);	//持續更新新位置
    }
});

//滑鼠左鍵起來
canvas.addEventListener('mouseup', function(e) {
    if(drawing) {
        var old = queue.shift();		//依序移除佇列
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0], old[1], x, y);	//最後位置繪圖
        drawing = false;	//結束繪圖狀態
    }
});

const color = document.getElementById("color");		//顏色
const lineWidth = document.getElementById("lineWidth");	//拉桿
const value = document.getElementById("value");	//顯示拉桿值欄位
value.textContent = lineWidth.value;			//取得拉桿值
ctx.strokeStyle = color.value;			//預設顏色
// 設定顏色
color.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
  }); 
// 設定粗細
lineWidth.addEventListener("input", (e) => {
    value.textContent = e.target.value;
    ctx.lineWidth = e.target.value;
});

//生成圖片按鈕
toshow.addEventListener('click', function() {
    //把canvas轉成DataURL
    let url = canvas.toDataURL();
    show.src =url;
});
//清除畫布按鈕
clear.addEventListener('click', function() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
});

let erasing = false; // 是否在使用橡皮擦

// 例如加個按鈕：
document.getElementById("eraser").addEventListener("click", () => {
  erasing = !erasing;
  if (erasing) {
    ctx.globalCompositeOperation = "destination-out"; // 擦除模式
  } else {
    ctx.globalCompositeOperation = "source-over"; // 回復正常畫筆
  }
});

let history = [];
let redoStack = [];

function saveState() {
  redoStack = [];
  history.push(canvas.toDataURL());
  if (history.length > 30) history.shift();
}

function undo() {
  if (history.length === 0) return;
  redoStack.push(history.pop());
  restore(history[history.length - 1]);
}

function redo() {
  if (redoStack.length === 0) return;
  const data = redoStack.pop();
  history.push(data);
  restore(data);
}

function restore(dataURL) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
}

// 滑鼠放開時儲存狀態
canvas.addEventListener("mouseup", saveState);

// HTML 加上兩個按鈕
// <button id="undo">復原</button>
// <button id="redo">取消復原</button>

document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

lineWidth.addEventListener("input", (e) => {
  const size = e.target.value;
  value.textContent = size;
  ctx.lineWidth = size;
});
