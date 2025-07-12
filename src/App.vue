<template>
    <div class="todo-container">
        <h1 class="todo-title">TO-DO LIST</h1>
        <div class="todo-input-group">
            <input type="text" placeholder="Add a task" class="todo-input" v-model="inputText" />
            <button class="todo-add-button" @click="addTask">＋</button>
        </div>
        <button v-show="pendingCount >= 1 && filter === 'pending'" class="multipleFinishTask"
            @click="multipleFinishTask">批量完成</button>
        <ul class="todo-list" v-for="task in filteredTodos" :key="task.id">
            <li class="todo-item">
                <label class="checkbox">
                    <input v-show="filter === 'pending'" type="checkbox" v-model="selectedIds" :value="task.id">
                    {{ task.text }}
                </label>

                <button title="点击标记为完成" class="closeBtn" v-show="filter === 'pending'" @click="finishTask(task.id)">X</button>
            </li>
        </ul>
        <footer v-show="pendingCount >= 1">
            <div class="total">
                <span v-if="filter === 'pending'">未完成任务：{{ pendingCount }} </span>
                <span v-else-if="filter === 'completed'">已完成任务：{{ finishCount }} </span>
                <span v-else="filter==='all'">全部任务：{{ AllCount }}</span>
            </div>
            <div class="buttonGroup">
                <button class="bottomButton" @click="toDoTask" :class="{ activeBtn: filter === 'pending' }">待完成</button>
                <button class="bottomButton" @click="completedTask"
                    :class="{ activeBtn: filter === 'completed' }">已完成</button>
                <button class="bottomButton" @click="AllTask" :class="{ activeBtn: filter === 'all' }">全部</button>
            </div>
        </footer>
    </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';
const inputText = ref('');
const todoLists = ref<{
    id: number;
    text: string;
    status: boolean
}[]>([]);

const addTask = () => {
    const text = inputText.value.trim();
    if (text) {
        todoLists.value.push(
            {
                id: Date.now(),
                text,
                status: false
            }
        );
        inputText.value = ''         // 清空输入框
    }
}
//在待办删除转移到完成
const finishTask = (id: number) => {
    const task = todoLists.value.find(t => t.id === id)
    if (task) {
        task.status = true
    }

}
//切换按钮改状态
const filter = ref<'all' | 'pending' | 'completed'>('pending');
const toDoTask = () => {
    filter.value = "pending"

}
const completedTask = () => {
    filter.value = "completed"
}
const AllTask = () => {
    filter.value = "all"
}
//根据状态切换视图
const filteredTodos = computed(() => {
    if (filter.value === 'pending') {
        return todoLists.value.filter(task => task.status === false)
    } else if (filter.value === 'completed') {
        return todoLists.value.filter(task => task.status === true)
    } else {
        return todoLists.value
    }
})
//统计没有完成的
const pendingCount = computed(() => {
    return todoLists.value.filter(task => task.status === false).length
}
)
//全部
const AllCount = computed(() =>
    todoLists.value.length

)
//完成的
const finishCount = computed(() => {
    return todoLists.value.filter(task => task.status === true).length
}
)
//多选完成
const selectedIds = ref<number[]>([]);
const multipleFinishTask = () => {
    if (selectedIds.value.length > 0) {
        todoLists.value.forEach(task => {
            if (selectedIds.value.includes(task.id)) {
                task.status = true
            }
        })
    }else{
        alert("你玩呢")
    }

    // 可选：清空选中项
    selectedIds.value = []
}
</script>

<style>
body {

    background-color: #FFEEE2;
    display: flex;
    justify-content: center;
    padding: 20px;
    font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', sans-serif;

}

.todo-container {
    width: 440px;
    padding: 30px 20px;
    background: #fff8f0;
    border: 12px solid #ffccaa;
    border-radius: 48px;
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
    background-color: #fff;
}

.todo-input {
    flex-grow: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 30px 0 0 30px;
    font-size: 16px;
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
    justify-content: space-between;

}

.checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
}

.closeBtn {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 20px;
    background-color: #f0e6df;
    color: #ffffff;
    padding: 2px;
}

footer {
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

.bottomButton {
    background-color: #FCCFB6;
    color: white;
    border-radius: 32px;
    margin-left: 10px;
    padding: 10px 20px;
    /* 上下10px，左右20px */
    font-size: 14px;
    /* 文字大小也会影响视觉尺寸 */
}

.activeBtn {
    background-color: #E3663D;
}

.multipleFinishTask {
    margin-bottom: 10px;
    text-align: left;
    display: block;
    border: 1px solid #ff9980;
    border-radius: 50px;
    background-color: #ffedeb;
    font-size: 14px;
    color: #ff9980;
}
</style>
