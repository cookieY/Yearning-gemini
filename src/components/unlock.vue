<style lang="less">
  @import '../styles/unlock.less';
</style>

<template>
  <transition name="show-unlock">
    <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
      <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
        <img class="unlock-avator-img" src="../assets/logo_s.png">
        <div class="unlock-avator-cover">
          <span><Icon type="md-unlock" :size="30"></Icon></span>
          <p>解锁</p>
        </div>
      </div>
      <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div class="unlock-overflow-body" :style="{right: inputLeft}">
            <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码"/>
            <button ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock"
                    class="unlock-btn">
              <Icon color="white" type="md-key" :size="14"></Icon>
            </button>
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con"><Checkbox v-model="single">LDAP登录</Checkbox>    已锁定</div>
    </div>
  </transition>
</template>

<script>
    // ;
    import axios from 'axios'

    export default {
        name: 'Unlock',
        data() {
            return {
                avatorLeft: '0px',
                inputLeft: '400px',
                password: '',
                single: false
            }
        },
        props: {
            showUnlock: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClickAvator() {
                this.avatorLeft = '-180px'
                this.inputLeft = '0px'
                this.$refs.inputEle.focus()
            },
            handleUnlock() {
                let url = this.$config.auth;
                if (this.single === true) {
                    url = `${this.$config.gen}/ldap`
                }
                axios.post(url, {
                    'username': sessionStorage.getItem('user'),
                    'password': this.password
                })
                    .then(() => {
                        this.avatorLeft = '0px'
                        this.inputLeft = '400px'
                        this.password = ''
                        this.$store.commit('unlock')
                        this.$emit('on-unlock')
                    })
                    .catch(err => this.$config.auth_notice(err))
            },
            unlockMousedown() {
                this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
            },
            unlockMouseup() {
                this.$refs.unlockBtn.className = 'unlock-btn'
            }
        }
    }
</script>
