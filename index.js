

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas")

    const createPadd = (x, y, speed, controls) => {
        return {
            x,y,speed, controls
        }
    }

    const createObject = (settings, ctx) => {
        const {width, height, x,y} = settings
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
    }
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
                x: 20,
                y :this.height / 2 -30,
                width: 10,
                height: 10,
                ballXSpeed: 0,
                ballYSpeed: 0,
            }
            this.paddle1Settings = createPadd(0, this.height / 2 - this.paddleSettings.height, 0, { left: 's', right: 'w' })
            this.paddle2Settings = createPadd(this.width - this.paddleSettings.width, this.height / 2 - this.paddleSettings.height, 0,
                { left: 'ArrowLeft', right: 'ArrowRight' })
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
            this.paddlesArr.forEach((obj) => {
                createObject({ x:obj.x, y:obj.y, ...this.paddleSettings }, this.ctx)
            })
        }

        drawBall() {
            createObject(this.ballSettings, this.ctx)
        }
        movePaddles() {
            const runPaddles = (paddle, side, speed) => {
                document.addEventListener('keydown', (e) => {
                    e.stopPropagation()
                    if (e.key === side) {
                        paddle.speed = speed
                    }
                }, { once: true })
                
                // document.addEventListener('keyup', (e) => {
                //     e.stopPropagation()
                //     if (e.key === side) {
                //         paddle.speed = 0
                //     }
                // }, { once: true })

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
                this.drawBall()
            },100)
        }
        
    }
    const game = new Board()
    game.runGame()
})

