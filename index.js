

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
        movePaddle() {
            this.paddlesArr.forEach((paddSettings)=>{
                const { left, right } = paddSettings.controls
                const paddleCantMove = paddSettings.y >= this.height - this.paddleSettings.height || paddSettings.y <= 4
                const cantMoveRight = paddSettings.y <= 4
                const cantMoveLeft = paddSettings.y >= this.height - this.paddleSettings.height
                const runMove = () => {     
                    paddSettings.y += paddSettings.speed
                    document.addEventListener("keydown", (e) => {
                        switch (e.key) {
                            case left:
                                if (paddSettings.speed <= 0) {
                                    paddSettings.speed = this.maxSpeed
                                } 
                                break
                            case right:
                                if (paddSettings.speed >= 0 ) {
                                    paddSettings.speed = -this.maxSpeed
                                }
                                break
                        }
                    }, { once: true })
                    // document.addEventListener("keyup", (e) => {
                    //     switch (e.key) {
                    //         case right:
                    //            paddSettings.speed = 0
                    //             break
                    //         case left:
                    //             paddSettings.speed =0
                    //             break
                    //     }
                    // },{once:true})
                }
                if (!paddleCantMove) runMove()
                else paddSettings.speed =0
            })
   
        }
        // canpaddleMove() {
        //     this.paddlesArr.forEach(paddle => {
        //         if (paddle.y <=0 )
        //     })
        // }
        runPaddles() {
            this.drawPaddle()
            this.movePaddle()
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