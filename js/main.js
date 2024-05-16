const result_b = document.getElementById('result_b');
const result_t = document.getElementById('result_t');

if(localStorage.getItem("dollars")){
  const s = localStorage.getItem("dollars");
  result_b.innerHTML = "ブラックジャック：" + s + " ドル";
}

if(localStorage.getItem("score")){
  const s = localStorage.getItem("score");
  result_t.innerHTML = "チーズ集め　　　：" + s + " コ";
}
