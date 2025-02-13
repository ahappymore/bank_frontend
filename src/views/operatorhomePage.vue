<template>
  <div class="container">
    <h1>欢迎来到管理员主页</h1>
  <!-- 修改密码按钮 -->
    <h4>提示：首次登录请修改自己的密码，提高安全性：<button class="btn-primary" @click="openChangePasswordModal">修改密码</button></h4>

    <h2>展示管理用户信息</h2>
    <!-- 用户信息表格 -->
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户姓名</th>
          <th>身份证</th>
          <th>邮箱</th>
          <th>电话</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.UserID">
          <td>{{ user.UserID }}</td>
          <td>{{ user.UserName }}</td>
          <td>{{ user.IDCard }}</td>
          <td>{{ user.Email }}</td>
          <td>{{ user.Phone }}</td>
          <td>
            <button class="btn-edit" @click="editUser(user)">编辑</button>
            <button class="btn-delete" @click="deleteUser(user.UserID)">删除</button>
            <button class="btn-add-card" @click="openAddCardModal(user)">添加银行卡</button>
          </td>
        </tr>
      </tbody>
    </table>

  

    <!-- 编辑用户信息弹窗 -->
    <div v-if="isEditModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>编辑用户信息</h2>
        <form @submit.prevent="submitEdit">
          <div class="form-group">
            <label for="UserID">ID</label>
            <input type="text" id="UserID" v-model="editingUser.UserID" disabled />
          </div>
          <div class="form-group">
            <label for="UserName">用户姓名</label>
            <input type="text" id="UserName" v-model="editingUser.UserName" />
          </div>
          <div class="form-group">
            <label for="IDCard">身份证号</label>
            <input type="text" id="IDCard" v-model="editingUser.IDCard" />
          </div>
          <div class="form-group">
            <label for="Email">邮箱</label>
            <input type="email" id="Email" v-model="editingUser.Email" />
          </div>
          <div class="form-group">
            <label for="Phone">电话</label>
            <input type="text" id="Phone" v-model="editingUser.Phone" />
          </div>
          <div class="form-actions">
            <button class="btn-primary" type="submit">提交</button>
            <button class="btn-secondary" type="button" @click="closeEditModal">取消</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="isChangePasswordModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>修改密码</h2>
        <form @submit.prevent="submitChangePassword">
          <div class="form-group">
            <label for="oldPassword">原始密码</label>
            <input type="password" id="oldPassword" v-model="oldPassword" />
          </div>
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input type="password" id="newPassword" v-model="newPassword" />
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <input type="password" id="confirmPassword" v-model="confirmPassword" />
          </div>
          <div class="form-actions">
            <button class="btn-primary" type="submit">修改</button>
            <button class="btn-secondary" type="button" @click="closeChangePasswordModal">取消</button>
          </div>
        </form>
      </div>
    </div>



 <!-- 添加银行卡弹窗 -->
    <div v-if="isAddCardModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>添加银行卡</h2>
        <form @submit.prevent="submitAddCard">
          <div class="form-group">
            <label for="cardID">银行卡ID</label>
            <input type="text" id="cardID" v-model="newCardID" />
          </div>
          <div class="form-actions">
            <button class="btn-primary" type="submit">添加</button>
            <button class="btn-secondary" type="button" @click="closeAddCardModal">取消</button>
          </div>
        </form>
      </div>
    </div>



  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'operatorhomePage',
  data() {
    return {
      users: [],  // 存储所有用户信息
      isEditModalVisible: false,  // 控制弹窗显示
      isChangePasswordModalVisible:false,
      isAddCardModalVisible: false, // 控制添加银行卡弹窗显示
      editingUser: {  // 当前正在编辑的用户信息
        UserID: '',
        UserName: '',
        IDCard: '',
        Email: '',
        Phone: ''
      },
    oldPassword: '',  // 原始密码
    newPassword: '',  // 新密码
    confirmPassword: '',  // 确认新密码
    newCardID: '', // 新银行卡ID
    currentUserID: null, // 当前正在添加银行卡的用户 ID
    };
  },
  created() {
    // 页面加载时获取所有用户信息
    this.fetchUsers();
  },
  methods: {
    // 获取用户信息
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:5000/api/getusers');
        this.users = response.data;
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },

    // 删除用户
    async deleteUser(UserID) {
       const confirmed = window.confirm('确定要删除这个用户吗？');
  if (!confirmed) {
    return; // 用户点击取消，不进行删除
  }
       try {
    // 使用 POST 请求，传递 userId 在请求体中
    await axios.post('http://localhost:5000/api/deleteuser', { UserID});
    this.fetchUsers();  // 删除后重新获取用户信息
  } catch (error) {
    console.error('删除用户失败', error);
  }
},

    // 编辑用户
    editUser(user) {
      this.editingUser = { ...user };  // 填充用户信息
      this.isEditModalVisible = true;  // 显示编辑弹窗
    },

    // 提交编辑的用户信息
  async submitEdit() {
  try {
    // 使用 POST 请求，传递用户信息在请求体中
    await axios.post('http://localhost:5000/api/edituser', {
      UserID: this.editingUser.UserID,  // 传递 UserID 在请求体中
      UserName: this.editingUser.UserName,
      IDCard: this.editingUser.IDCard,
      Email: this.editingUser.Email,
      Phone: this.editingUser.Phone
    });
    this.fetchUsers();  // 提交后重新获取用户信息
    this.closeEditModal();  // 关闭弹窗
  } catch (error) {
    console.error('编辑用户失败', error);
  }
},


    // 关闭编辑弹窗
    closeEditModal() {
      this.isEditModalVisible = false;
    },

// 打开修改密码弹窗
  openChangePasswordModal() {
    this.isChangePasswordModalVisible = true;
  },

  // 提交修改密码
  async submitChangePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }

    // 从 localStorage 获取管理员的 UserID
    const OperatorID = localStorage.getItem('OperatorID');
    try {
      await axios.post('http://localhost:5000/api/changePassword', {
        OperatorID: OperatorID,  // 直接从 localStorage 获取管理员的 ID
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      });
      alert('密码修改成功');
      this.closeChangePasswordModal();
    } catch (error) {
      console.error('修改密码失败', error);
      alert('密码修改失败');
    }
  },

  // 关闭修改密码弹窗
  closeChangePasswordModal() {
    this.isChangePasswordModalVisible = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  },


// 打开添加银行卡弹窗
    openAddCardModal(user) {
      this.currentUserID = user.UserID;
      this.isAddCardModalVisible = true;
    },

    // 提交添加银行卡信息
    async submitAddCard() {
      if (!this.newCardID) {
        alert('请输入银行卡ID');
        return;
      }

      try {
        await axios.post('http://localhost:5000/api/addCard', {
          userID: this.currentUserID,
          cardID: this.newCardID
        });
        alert('银行卡添加成功');
        this.closeAddCardModal();
      } catch (error) {
        console.error('添加银行卡失败', error);
        alert('银行卡添加失败');
      }
    },

    // 关闭添加银行卡弹窗
    closeAddCardModal() {
      this.isAddCardModalVisible = false;
      this.newCardNumber = '';
    }

  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

h1 {
  color: #409eff;
  text-align: center;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.user-table th, .user-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

button {
  margin: 5px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #409eff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #66b1ff;
}

.btn-secondary {
  background-color: #ccc;
  border: none;
}

.btn-secondary:hover {
  background-color: #aaa;
  border: none;
}

.btn-edit {
  background-color: #ffad31;
  border: none;
  color: white;
}

.btn-edit:hover {
  background-color: #ff9d15;
  border: none;
}


.btn-add-card{
  background-color: #218919;
  border: none;
  color: white;
}

.btn-add-card:hover {
  background-color: #1e660e;
  border: none;
}


.btn-delete {
  background-color: #ff4d4f;
  color: white;
  border: none;
}

.btn-delete:hover {
  background-color: #d9363e;
  border: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>