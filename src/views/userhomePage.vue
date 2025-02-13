<template>
  <div class="user-home-page">
    <div class="user-info">
      <h2>用户信息</h2>
      <div v-for="(value, key) in userInfo" :key="key" class="user-info-item">
        <div class="info-row">
          <label>{{ getLabel(key) }}:</label>
          <!-- 只允许修改密码、邮箱和电话，其他字段不可修改 -->
          <span v-if="!isEditable(key)">{{ value }}</span>
          <input
            v-else
            v-model="editedInfo[key]"
            :type="getInputType(key)"
            :placeholder="`请输入${getLabel(key)}`"
          />
        </div>

 <!-- 新增确认密码输入框 -->
        <div v-if="key === 'Password'" class="info-row">
          <label>确认密码:</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          />
        </div>



        <div class="button-group">
          <!-- 只对可编辑字段显示修改、保存和取消按钮 -->
          <button v-if="isEditable(key)" @click="saveInfo(key)">修改</button>
          <button v-if="isEditable(key)" @click="cancelEdit(key)">取消</button>
        </div>
      </div>
  


 <!-- 银行卡信息 -->
    <div class="user-cards">
  <h2>银行卡信息</h2>
  <div v-for="card in cards" :key="card.cardID" class="card-item">
    <div class="info-row">
      <label>卡号:</label>
      <span>{{ card.cardID }}</span>
    </div>
  </div>
</div>
 
 </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userInfo: {
        UserID: '', // 用户ID
        UserName: '', // 用户名
        IDCard: '', // 身份证
        Password: '', // 用户密码
        Email: '', // 用户邮箱
        Phone: '', // 用户电话
      },
      editedInfo: { // 编辑后的用户信息
        UserName: '',
        IDCard: '',
        Password: '',
        Email: '',
        Phone: '',
      },
      confirmPassword: "", // 确认密码字段
      isEditing: {
        Password: false,
        Email: false,
        Phone: false,
      },
      cards: [], // 银行卡信息
    };
  },
  created() {
    this.fetchUserInfo(); // 页面加载时获取用户信息
    this.fetchcard(); // 页面加载时获取用户信息
  },
  methods: {
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const UserID = localStorage.getItem('UserID'); // 假设用户 ID 存储在本地存储中
        if (UserID) {
          const response = await axios.get(`http://localhost:5000/api/getUserInfo`, {
            params: { UserID } // 将 UserID 作为查询参数传递
          });
          this.userInfo = response.data;
          this.editedInfo = { ...this.userInfo }; // 初始化编辑数据
        } else {
          this.$message.error('未找到用户ID');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.$message.error('获取用户信息失败!');
      }
    },

async fetchcard() {
      try {
        const UserID = localStorage.getItem('UserID'); // 假设用户 ID 存储在本地存储中
        if (UserID) {
          const response2 = await axios.get(`http://localhost:5000/api/getcard`, {
            params: { UserID } // 将 UserID 作为查询参数传递
          });
          this.cards = response2.data;
        } else {
          this.$message.error('未找到用户银行卡');
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.$message.error('获取用户信息失败!');
      }
    },

    // 获取字段标签
    getLabel(field) {
      const labels = {
        UserID:'用户ID',
        UserName: '用户名',
        IDCard: '身份证',
        Password: '密码',
        Email: '邮箱',
        Phone: '电话',
      };
      return labels[field];
    },
    // 获取输入框类型
    getInputType(field) {
       return field === "Password" ? "password" : "text";
    },

    // 判断字段是否可编辑（只有密码、邮箱和电话可以修改）
    isEditable(field) {
      return field === 'Password' || field === 'Email' || field === 'Phone';
    },
    // 开始编辑
    editInfo(field) {
      this.isEditing[field] = true;
    },
    // 取消编辑
    cancelEdit(field) {
      this.isEditing[field] = false;
      this.editedInfo[field] = this.userInfo[field]; // 恢复原始值
      if (field === "Password") this.confirmPassword = ""; // 清空确认密码
    },
    // 保存修改
    async saveInfo(field) {
      try {
        if (field === "Password") {
          // 验证密码和确认密码是否一致
          if (this.editedInfo.Password !== this.confirmPassword) {
            this.$message.error("两次输入的密码不一致!");
            return;
          }
        }

        const UserID = localStorage.getItem('UserID');
        if (UserID) {
          const payload = {
            UserID: UserID, // 使用保存的 UserID
            [field]: this.editedInfo[field]
          };

          const response = await axios.post('http://localhost:5000/api/updateUserInfo', payload);
          console.log('修改成功:', response.data);

          this.userInfo[field] = this.editedInfo[field]; // 更新本地的用户信息
          this.isEditing[field] = false;
          this.$message.success('修改成功!');
        } else {
          this.$message.error('未找到用户ID');
        }
      } catch (error) {
        console.error('修改失败:', error);
        this.$message.error('修改失败!');
      }
    },
  },
};
</script>

<style scoped>
.user-home-page {
  width: 80%;
  margin: 20px auto;
}

.user-info {
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.user-info-item {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row label {
  font-weight: bold;
}

.info-row span {
  flex: 1;
  text-align: left;
}

input {
  width: 60%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #409eff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  background-color: #307ac6;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 10px;
}


.user-cards {
  margin-top: 30px;
}

.card-item {
  margin-bottom: 15px;
}

.card-item .info-row {
  display: flex;
  justify-content: space-between;
}

.card-item .info-row label {
  font-weight: bold;
}

.card-item .info-row span {
  font-size: 14px;
  color: #333;
  word-wrap: break-word;
}
</style>
