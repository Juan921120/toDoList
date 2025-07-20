<template>
    <div class="user-container">
        <div class="user-info-bar">
            <img class="user-avatar" src="/images/default-user.png" alt="用户头像" />
            <span class="user-name">{{ username }}</span>
        </div>
    </div>

    <div class="header-title">
        TO-DO LIST
    </div>
    <div class="jagged-wrapper">
        <div class="todo-container ">

            <div class="todo-input-group">
                <input type="text" placeholder="Add a task" class="todo-input" v-model="inputText" />
                <button class="todo-add-button" @click="addTask">＋</button>
            </div>
            <div v-show="pendingCount >= 1 && filter === 'pending'" class="multipleChange">
                <label class="checkbox">
                    <input type="checkbox" @click="allCheck" :checked="allChecked" />
                    全选
                </label>
                <button class="multipleFinishTask" @click="multipleFinishTask">批量完成
                </button>
            </div>
            <!-- 空状态 -->
            <div class="emptyState" v-if="
                (filter === 'pending' && pendingCount === 0) ||
                (filter === 'completed' && finishCount === 0) ||
                (filter === 'all' && allCount === 0)">
                <img src="/images/empty-state.png" class="catImg" alt="暂无待办">
                <div> 没有任务哦～</div>
            </div>

            <div v-else>
                <ul class="todo-list">
                    <li class="todo-item" v-for="task in todoLists" :key="task.id">
                        <label class="checkbox">
                            <input v-show="filter === 'pending'" type="checkbox" v-model="selectedIds" :value="task.id">
                            {{ task.text }}
                        </label>

                        <button title="点击标记为完成" class="closeBtn" v-show="filter === 'pending'"
                            @click="finishTask(task.id)">X</button>
                    </li>
                </ul>
            </div>


            <footer>
                <div class="total">
                    <span v-if="filter === 'pending'">未完成任务：{{ pendingCount }} </span>
                    <span v-else-if="filter === 'completed'">已完成任务：{{ finishCount }} </span>
                    <span v-else>全部任务：{{ allCount }}</span>
                </div>
                <div class="buttonGroup">
                    <button class="bottomButton" @click="toDoTask"
                        :class="{ activeBtn: filter === 'pending' }">待完成</button>
                    <button class="bottomButton" @click="completedTask"
                        :class="{ activeBtn: filter === 'completed' }">已完成</button>
                    <button class="bottomButton" @click="AllTask" :class="{ activeBtn: filter === 'all' }">全部</button>
                </div>
            </footer>
        </div>
    </div>
    <div class="logOut-btn" @click="handleLogout">退出登录</div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';

const router = useRouter();
const username = ref(localStorage.getItem('username') || '未登录用户');

//渲染页面
const todoLists = ref<{
    id: number;
    text: string;
    status: boolean;
}[]>([]);

const loadList = async () => {
    let res;
    switch (filter.value) {
        case 'all':
            res = await api.get("/task/all")
            break
        case 'completed':
            res = await api.get("/task/completed")
            break
        case 'pending':
            res = await api.get("/task/pending")
            break
    }
    todoLists.value = res.data;
    console.log('API 返回：', res)      // ← 加这一行
}
//统计任务数
const pendingCount = ref(0)
const finishCount = ref(0)
const allCount = ref(0)
const total = async () => {
    try {
        const res = await api.get("/task/count")
        pendingCount.value = res.data.pending
        finishCount.value = res.data.completed
        allCount.value = res.data.total
    } catch (err) {
        console.log("失败")

    }
}
onMounted(() => {
    // 给 body 添加类名
    document.body.classList.add('current-page-body')

    loadList()
    total()
});

onUnmounted(() => {
    // 移除 body 类名
    document.body.classList.remove('current-page-body')
})


//加记录
const inputText = ref('');
const addTask = async () => {
    const text = inputText.value.trim();
    if (text) {
        await api.post('/task/add', {
            text,
            status: false
        })
        inputText.value = ''         // 清空输入框
        loadList()
        total()
    }
}


//切换按钮改状态
const filter = ref<'all' | 'pending' | 'completed'>('pending');
const toDoTask = () => {
    filter.value = "pending"
    loadList();
    total()

}
const completedTask = () => {
    filter.value = "completed"
    loadList();
    total()
}
const AllTask = () => {
    filter.value = "all"
    loadList();
    total()
}


//在待办删除转移到完成
const finishTask = async (id: number) => {
    const response = await api.put(`/task/complete/${id}`)

    loadList()
    total()

}


//多选完成
const selectedIds = ref<number[]>([]);
const multipleFinishTask = async () => {
    if (selectedIds.value.length > 0) {
        const response = await api.put('/task/complete/batch', selectedIds.value)
        loadList()
        total()
    } else {
        alert("你玩呢f")
    }

    // 可选：清空选中项
    selectedIds.value = []
}
//全选
const allChecked = ref(false);//默认不选
const allCheck = () => {
    allChecked.value = !allChecked.value;
    if (
        allChecked.value//选了
    ) {
        selectedIds.value = todoLists
            .value.filter(t => t.status === false)
            .map(t => t.id)
        console.log(selectedIds.value)
    } else {
        selectedIds.value = []  //清空
    }
}

// 退出登录
const handleLogout = () => {
    // 这里可以调用后端退出登录接口
    // 清除本地存储的登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // 跳转到登录页面
    router.push('/login');
}
</script>


<style scoped>


.header-title {
    padding: 10px;
    text-align: center;
    font-family: Comic Sans MS, Arial Rounded MT Bold, sans-serif;
    font-size: 26px;
    color: #ff9980;

}

/* 包装器样式 - 负责边框抖动 */
.jagged-wrapper {
    margin: 0 auto;
    /* 顶部30px间距 */
    position: relative;
    display: block;
    border-radius: 12px;
    overflow: visible;
    width: 90%;
}

/* 伪元素创建抖动边框 */
.jagged-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 12px solid #ffccaa;
    border-radius: 48px;
    filter: url(#jagged);
    pointer-events: none;
    z-index: 1;
}

.todo-container {

    padding: 50px 40px;
    background: #fff8f0;
    border-radius: 48px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 0;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.todo-title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin: 0;
}

.logOut-btn{
    padding-top: 20px;
    text-align: center;
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
    text-align: left;
}

.multipleChange {
    display: flex;
    justify-content: space-between;
}

.multipleChange .checkbox {
    margin-left: 15px;
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
    margin-top: 30px;
    flex-wrap: wrap;
    /* ← 新增 */
    gap: 10px;
    /* ← 新增 */
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
    width: 20px;
    height: 20px;
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
    width: 120px;
    margin-bottom: 10px;
    text-align: center;
    display: block;
    border: 1px solid #ff9980;
    border-radius: 50px;
    background-color: #ffedeb;
    font-size: 14px;
    color: #ff9980;
}

.catImg {
    width: 20%;
    display: block;
    margin: 0 auto;

}

/* 移除重复的样式，已经在上面定义了 */

@media screen and (max-width: 600px) {
    .emptyState {
        text-align: center;
    }

    .todo-container {
        font-size: 14px;
        margin: 0 auto;
        padding: 40px 30px;
    }

    .todo-title {
        font-size: 18px;
        text-align: center;
    }

    .todo-input {
        font-size: 14px;
        padding: 8px;
    }

    .checkbox {
        text-align: left;
        width: 70%;
    }

    footer {
        flex-direction: column;
        /* 垂直排列 */
        align-items: center;
        /* 居中对齐 */
        gap: 16px;
        /* 间距更大一点 */
    }

    .total {
        text-align: center;
        /* 统计居中 */
        width: 100%;
    }

    .buttonGroup {
        /* 底部留白 */
        display: flex;
        flex-direction: column;
        /* 按钮垂直排列 */
        align-items: center;
        /* 居中 */
        gap: 10px;
        width: 100%;
    }

    .bottomButton {
        margin-left: 0;
        /* 去掉左边距 */
        width: 80%;
        /* 按钮宽度更适合手机 */
    }


}
</style>

<style>
/* 全局样式，只在有这个类名时生效 */
:global(body.current-page-body) {
    padding-top: 30px;
}
</style>
