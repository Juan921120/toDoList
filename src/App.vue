<template>
    <div class="todo-container">
        <h1 class="todo-title">周先生TO-DO LIST</h1>
        <div class="todo-input-group">
            <input type="text" placeholder="Add a task" class="todo-input" />
            <button class="todo-add-button">＋</button>
        </div>
        <ul class="todo-list">
            <li class="todo-item"><input type="checkbox" /> <span>Task 1 暴富</span></li>
            <li class="todo-item"><input type="checkbox" /> <span>Task 2 娶美女</span></li>
            <li class="todo-item"><input type="checkbox" /> <span>Task 3 生100胎</span></li>
        </ul>
        <footer>
            <div class="total">剩余任务：6</div>
            <div class="buttonGroup">
                <button class="toDoTask activeBtn">待完成</button>
                <button class="completed">已完成</button>
                <button class="allTask">全部</button>
            </div>
        </footer>
    </div>

</template>


<script setup lang="ts">

</script>

<style>
body {

    background-color: #FFEEE2;
    display: flex;
    justify-content: center;
    padding: 50px;
    font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif;

}

.todo-container {
    width: 380px;
    padding: 30px 20px;
    background: #fff8f0;
    border: 12px solid #ffccaa;
    border-radius:48px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.todo-title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.todo-input-group {
    display: flex;
    margin-bottom: 20px;
    border: 3px solid #FEDEB8;
    border-radius: 100px;
}

.todo-input {
    flex-grow: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 30px 0 0 30px;
    font-size: 16px;
    background-color: #fff;
    outline: none;

}

.todo-add-button {
    padding: 10px 24px;
    border: none;
    background-color: #ff9980;
    color: white;
    font-size: 20px;
    border-radius: 0 30px 30px 0;
    cursor: pointer;
    transition: background-color 0.3s;
}

.todo-add-button:hover {
    background-color: #ff7a5a;
}

.todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.todo-item {
    background-color: #fff;
    padding: 10px 15px;
    border-radius: 20px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #444;
    /* border: 1px solid #f0c0c0; */
}
footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #DCC5A2;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  position: relative;
}

/* 选中状态：背景和边框变色 */
input[type="checkbox"]:checked {
  background-color: #ee5628;
  border-color: #ee5628;
}

/* 对勾 ✔️ */
input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  box-sizing: content-box;
}

button{
    background-color: #FCCFB6;
    color: white;
    border-radius: 32px;
    margin-left: 10px;
    padding: 10px 20px; /* 上下10px，左右20px */
  font-size: 14px;    /* 文字大小也会影响视觉尺寸 */
}
.activeBtn{
    background-color: #E3663D;
}

</style>
