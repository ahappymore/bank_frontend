


<template>
  <div class="login-container">
     <Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" :options="options" />

    <div class="login-box" >
      <h1>{{ loginType === 'user' ? '用户登录' : '管理员登录' }}</h1>
      
      <div class="login-switch">
        <div 
          class="circle" 
          :class="{ active: loginType === 'user' }"
          @click="loginType = 'user'"
        >
          用户
        </div>
        <div 
          class="circle" 
          :class="{ active: loginType === 'Operator' }"
          @click="loginType = 'Operator'"
        >
          管理员
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="loginType === 'user'">
          <div class="form-group">
            <label for="UserID">用户账号:</label>
            <input v-model="UserID" type="text" id="UserID" required />
          </div>
          <div class="form-group">
            <label for="UserName">用户姓名:</label>
            <input v-model="UserName" type="text" id="UserName" required />
          </div>
          <div class="form-group">
            <label for="Password">密码:</label>
            <input v-model="Password" type="password" id="Password" required />
          </div>
        </div>

        <div v-if="loginType === 'Operator'">
          <div class="form-group">
            <label for="OperatorID">管理员账号:</label>
            <input v-model="OperatorID" type="text" id="OperatorID" required />
          </div>
          <div class="form-group">
            <label for="OperatorName">姓名:</label>
            <input v-model="OperatorName" type="text" id="OperatorName" required />
          </div>
          <div class="form-group">
            <label for="Password">密码:</label>
            <input v-model="Password" type="password" id="Password" required />
          </div>
        </div>

        <button type="submit">登录</button>
      </form>

      <div class="register-btn" @click="showRegisterModal = true">注册</div>
    </div>
  </div>

  <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
    <div class="modal" @click.stop>
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegisterSubmit">
        <div class="form-group">
          <label for="newUserID">用户账号:</label>
          <input v-model="newUserID" type="text" id="newUserID" required />
        </div>
        <div class="form-group">
          <label for="newUserName">用户名:</label>
          <input v-model="newUserName" type="text" id="newUserName" required />
        </div>
        <div class="form-group">
          <label for="idCard">身份证:</label>
          <input v-model="idCard" type="text" id="idCard" required />
        </div>
        <div class="form-group">
          <label for="newUserPassword">密码:</label>
          <input v-model="newUserPassword" type="password" id="newUserPassword" required />
        </div>
        <div class="form-group">
          <label for="email">邮箱:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="phone">电话:</label>
          <input v-model="phone" type="text" id="phone" required />
        </div>

        <button type="submit">确认注册</button>
        <button type="button" @click="showRegisterModal = false">取消</button>
      </form>
    </div>
  </div>
</template>

<script setup>

import { loadFull } from "tsparticles";

const options = {
    background: {
        color: {
            value: '#2d3a4b'
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: '#ffffff'
        },
        links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        collisions: {
            enable: true
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 6,
            straight: false
        },
        number: {
            density: {
                enable: true,
                area: 800
            },
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'
        },
        size: {
            value: { min: 1, max: 5 },
        }
    },
    detectRetina: true
 
}
const particlesInit = async engine => {
    await loadFull(engine);
};
 
const particlesLoaded = async container => {
    console.log("Particles container loaded", container);
};


</script>



<script >
import axios from 'axios';


export default {
  data() {
    return {
      loginType: 'user', // 默认登录类型为用户
      UserID: '', // 用户账号
      UserName: '',
      OperatorID: '', // 管理员账号
      OperatorName: '', // 管理员姓名
      Password: '', // 密码（通用）
      
      // 注册表单
      newUserID: '',
      newUserName: '',
      idCard: '',
      newUserPassword: '',
      email: '',
      phone: '',
      // 控制弹窗的显示
      showRegisterModal: false,

    };
  },


  methods: {
    async handleSubmit() {
      try {
        const url =
          this.loginType === 'user'
            ? 'http://localhost:5000/api/userlogin'
            : 'http://localhost:5000/api/operatorlogin';
        const payload =
          this.loginType === 'user'
            ? { UserID: this.UserID, UserName: this.UserName, Password: this.Password }
            : {
                OperatorID: this.OperatorID,
                OperatorName: this.OperatorName,
                Password: this.Password
              };

        const response = await axios.post(url, payload);
        const { OperatorID, OperatorName, quan } = response.data.data;

        // 你可以进一步打印出这些具体的值
        console.log('OperatorID:', OperatorID);
        console.log('OperatorName:', OperatorName);
        console.log('quan:', quan);

        console.log('登录成功:', response.data);
        this.$message.success('登录成功！');

        // 保存登录信息（仅保存 ID）
        if (this.loginType === 'user') {
          localStorage.setItem('UserID', this.UserID); // 保存用户 ID
        } else {
          localStorage.setItem('OperatorID', this.OperatorID); // 保存管理员 ID
        }

        if (this.loginType === 'user') {
          this.$router.push('/userhome');
        } else {
          if(quan===0)
          this.$router.push('/operatorhome');
          if(quan===1)
          this.$router.push('/superoperatorhome')
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.$message.error('登录失败！请检查账号和密码。');
      }
    },

    async handleRegisterSubmit() {
      try {
        const registerPayload = {
          UserID: this.newUserID,
          UserName: this.newUserName,
          IDCard: this.idCard,
          Password: this.newUserPassword,
          Email: this.email,
          Phone: this.phone
        };
        await axios.post('http://localhost:5000/api/register', registerPayload);
        console.log('注册成功:');
        this.$message.success('注册成功！');

        this.showRegisterModal = false; // 关闭弹窗
      } catch (error) {
        console.error('注册失败:', error);
        this.$message.error('注册失败！请检查信息。');
      }
    }
  }
};



</script>

<style scoped>
/* 通用样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;

}


.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin: 0;
  background-image: url('/src/assets/background.png'); /* 替换为你的背景图片路径*/ 
  width: 100%;

}


.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #307ac6;
}

/* 登录切换样式 */
.login-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.circle {
  width: 40px;
  height: 40px;
  margin: 0 10px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  cursor: pointer;
  font-size: 14px;
  color: white;
  transition: background-color 0.3s;
}

.circle.active {
  background-color: #409eff;
}

/* 注册按钮样式 */
.register-btn {
  margin-top: 15px;
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 10px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 380px;
}


button[type="submit"] {
  background-color: #28a745;
}

button[type="button"] {
  background-color: #dc3545;
}
</style>
