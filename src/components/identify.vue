<template>
  <div class="s-canvas">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>
<script>
    export default {
        name: 'SIdentify',
        props: {
            fontSizeMin: {
                type: Number,
                default: 16
            },
            fontSizeMax: {
                type: Number,
                default: 32
            },
            backgroundColorMin: {
                type: Number,
                default: 180
            },
            backgroundColorMax: {
                type: Number,
                default: 240
            },
            colorMin: {
                type: Number,
                default: 0
            },
            colorMax: {
                type: Number,
                default: 80
            },
            lineColorMin: {
                type: Number,
                default: 40
            },
            lineColorMax: {
                type: Number,
                default: 180
            },
            dotColorMin: {
                type: Number,
                default: 0
            },
            dotColorMax: {
                type: Number,
                default: 255
            },
            contentWidth: {
                type: Number,
                default: 150
            },
            contentHeight: {
                type: Number,
                default: 38
            }
        },
        data() {
            return {
                checkCode: ''
            }
        },
        methods: {
            createCode() {
                let code = "";
                const codeLength = 5; //验证码的长度
                const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
                for (let i = 0; i < codeLength; i++) { //循环操作
                    let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
                    code += random[index]; //根据索引取得随机数加到code上
                }
                this.identifyCode = code; //把code值赋给验证码
                this.$emit("identifyCode",code)
            },
            // 生成一个随机数
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min)
            },
            // 生成一个随机的颜色
            randomColor(min, max) {
                let r = this.randomNum(min, max)
                let g = this.randomNum(min, max)
                let b = this.randomNum(min, max)
                return 'rgb(' + r + ',' + g + ',' + b + ')'
            },
            drawPic(canvas) {
                this.createCode();
                let ctx = canvas.getContext('2d')
                ctx.textBaseline = 'bottom'
                // 绘制背景
                ctx.fillStyle = '#8f7979'
                ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
                // 绘制文字
                for (let i = 0; i < this.identifyCode.length; i++) {
                    this.drawText(ctx, this.identifyCode[i], i)
                }
                this.drawLine(ctx)
                this.drawDot(ctx)
            },
            drawText(ctx, txt, i) {
                ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
                ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei'
                let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
                let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
                var deg = this.randomNum(-45, 45)
                // 修改坐标原点和旋转角度
                ctx.translate(x, y)
                ctx.rotate(deg * Math.PI / 180)
                ctx.fillText(txt, 0, 0)
                // 恢复坐标原点和旋转角度
                ctx.rotate(-deg * Math.PI / 180)
                ctx.translate(-x, -y)
            },
            drawLine(ctx) {
                // 绘制干扰线
                for (let i = 0; i < 0; i++) {
                    ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
                    ctx.beginPath()
                    ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
                    ctx.stroke()
                }
            },
            drawDot(ctx) {
                // 绘制干扰点
                for (let i = 0; i < 0; i++) {
                    ctx.fillStyle = this.randomColor(0, 255)
                    ctx.beginPath()
                    ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
                    ctx.fill()
                }
            }
        },
        watch: {
            identifyCode() {
                this.drawPic()
            }
        },
        mounted() {
            let canvas = document.getElementById('s-canvas');
            this.drawPic(canvas);
            canvas.addEventListener("mousedown", () => {
                this.drawPic(canvas)
            });
        }
    }
</script>
