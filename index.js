

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas")

  
    class Board {
        constructor() {
            this.canvas = canvas
            this.ctx = canvas.getContext("2d")
            this.width = canvas.width
            this.height = canvas.height
            this.maxSpeed = 15
            this.paddleSettings = {
                width: 10,
                height: 50
            }
            this.ballSettings = {
                ballXSpeed: 0,
                ballYSpeed: 0,
            }
            this.paddle1Settings = {
                x: 0,
                y: this.height / 2 - this.paddleSettings.height,
                speed: 0,
                controls: {left:'s',right:'w'}
            }
            this.paddle2Settings = {
                x: this.width - this.paddleSettings.width,
                y: this.height / 2 - this.paddleSettings.height,
                speed: 0,
                controls: {left:'ArrowLeft',right:'ArrowRight'}
            }
            this.paddlesArr = [this.paddle1Settings, this.paddle2Settings]
        }
        clearGame() {
            const { width, height } = this.canvas
            this.ctx.clearRect(0, 0, width, height)
        }
        drawLine(length) {
            let inc = 0
            let color;
            for (let i = 0; i <= length; i++) {
                inc += 5
                const x = this.width / 2
                const y = inc
                this.ctx.beginPath()
                this.ctx.rect(x, y, 10, 20, 20)
                if (inc % 2 !== 0) {
                    color = "white"
                } else {
                    color = "rgb(42, 42, 72)"
                }
                this.ctx.fillStyle = color
                this.ctx.fill()
                this.ctx.closePath()
            }
        }
        drawPaddle() {
            const createPaddle = (x, y) => {
                const { width, height } = this.paddleSettings
                this.ctx.beginPath()
                this.ctx.rect(x, y, width, height)
                this.ctx.fillStyle = "white"
                this.ctx.fill()
                this.ctx.closePath()
            }
            this.paddlesArr.forEach((obj) => {
                createPaddle(obj.x, obj.y)
            })
        }
  
        movePaddles() {
            const runPaddles = (paddle, side, speed) => {
                document.addEventListener('keydown', (e) => {
                    e.stopPropagation()
                    if (e.key === side) {
                        paddle.speed = speed
                    }
                },{once:true})
            }
            this.paddlesArr.forEach(paddle => {
                const {left, right} = paddle.controls
                paddle.y += paddle.speed
                if (paddle.y >= 0) {
                    // MOVE LEFT PADDLE 
                    runPaddles(paddle, left, this.maxSpeed)
                } else {
                    paddle.y =2
                    paddle.speed =0
                    return 
                }
                if (paddle.y <= this.height - this.paddleSettings.height) {
                    // MOVE RIGHT PADDLE
                    runPaddles(paddle, right, -this.maxSpeed)
                } else {
                    paddle.y = this.height - this.paddleSettings.height
                    paddle.speed =0
                   return
                }
            })
        }
        runPaddles() {
            this.drawPaddle()
            this.movePaddles()
        }
        runGame() {
            setInterval(() => {
                this.clearGame()
                this.drawLine(100)
                this.runPaddles()
            },100)
        }
        
    }
    const game = new Board()
    game.runGame()
})

