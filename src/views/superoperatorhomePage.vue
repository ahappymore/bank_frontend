<template>
  <div class="admin-management">
    <h1>管理员管理</h1>

    <!-- 展示管理员信息 -->
    <table v-if="operators.length > 0" class="operators-table">
      <thead>
        <tr>
          <th>管理员ID</th>
          <th>管理员名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="operator in operators" :key="operator.OperatorID">
          <td>{{ operator.OperatorID }}</td>
          <td>{{ operator.OperatorName }}</td>
          <td>
            <button @click="deleteOperator(operator.OperatorID)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>没有找到管理员信息。</p>

    <!-- 注册管理员表单 -->
    <div class="register-form">
      <h2>注册新管理员</h2>
      <form @submit.prevent="registerOperator">
        <div class="form-group">
          <label for="OperatorID">管理员ID：</label>
          <input v-model="newOperator.OperatorID" type="text" id="OperatorID" required />
        </div>
        <div class="form-group">
          <label for="OperatorName">管理员名称：</label>
          <input v-model="newOperator.OperatorName" type="text" id="OperatorName" required />
        </div>
        <button type="submit" class="submit-btn">注册</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      operators: [], // 存储管理员信息
      newOperator: { // 新管理员注册信息
        OperatorID: '',
        OperatorName: ''
      }
    };
  },
  methods: {
    // 获取所有管理员信息
    fetchOperators() {
      axios.get('http://localhost:5000/api/getops')
        .then(response => {
          this.operators = response.data;
        })
        .catch(error => {
          console.error('获取管理员信息失败:', error);
        });
    },
    
    // 删除管理员
    deleteOperator(OperatorID) {
  if (confirm('确定要删除该管理员吗？')) {
   axios.post('http://localhost:5000/api/deleteop', { OperatorID })
  .then(response => {
    this.fetchOperators(); // 删除成功后刷新列表
    alert(response.data.message);
  })
  .catch(error => {
    console.error('删除管理员失败:', error);
    alert('删除失败');
  });
  }
},
    
    // 注册新管理员
    registerOperator() {
      axios.post('http://localhost:5000/api/registerop', this.newOperator)
        .then(response => {
          console.log(this.newOperator);
          alert(response.data.message);
          this.newOperator.OperatorID = '';
          this.newOperator.OperatorName = '';
          this.fetchOperators(); // 注册成功后刷新列表
        })
        .catch(error => {
          console.error('注册失败:', error);
          alert('注册失败');
        });
    }
  },
  created() {
    this.fetchOperators(); // 页面加载时获取管理员信息
  }
};
</script>

<style scoped>
.admin-management {
  width: 80%;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.operators-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

td {
  background-color: #fff;
}

button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

button:hover {
  background-color: #d32f2f;
}

button:focus {
  outline: none;
}

.register-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  display: block;
}

.form-group input {
  width: 30%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:focus {
  outline: none;
}
</style>
