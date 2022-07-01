

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector("canvas")
    const scoreTitle = document.querySelector('.score__title')
    const score1 = document.querySelector('.score__player1')
    const score2 = document.querySelector('.score__player2')

    const createPadd = (x, y, speed, controls) => {
        return {
            x,y,speed, controls
        }
    }

    const randomIntFromInterval=(min, max) => { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
      
    const createObject = (settings, ctx) => {
        const {width, height, x,y} = settings
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
    }
    const updateScores = (scoreOne, scoreTwo, round) => {
        scoreTitle.textContent = `Round ${round}`
        score1.textContent = scoreOne
        score2.textContent = scoreTwo
    }
    const createBall = (settings, ctx) => {
        const { radius, x, y } = settings
        ctx.beginPath()
        ctx.arc(x, y,radius, 0, 2 * Math.PI)
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
            this.round = 1
            this.paddleSettings = {
                width: 10,
                height: 50
            }
            this.ballSpeed = 15
            this.ballSettings = {
                x: 20,
                y :randomIntFromInterval(30,this.height-30),
                radius:8,
                xSpeed: 10,
                ySpeed: 10,
            }
            this.scores = {
                padd1:0,
                padd2:0
            }
            this.paddle1Settings = createPadd(0, this.height / 2 - this.paddleSettings.height, 0, { left: 's', right: 'w' })
            this.paddle2Settings = createPadd(this.width - this.paddleSettings.width, this.height / 2 - this.paddleSettings.height, 0,
                { left: 'ArrowLeft', right: 'ArrowRight' })
            this.paddlesArr = [this.paddle1Settings, this.paddle2Settings]
            this.paddleOnApproach = {...this.paddle2Settings}
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
            if (this.ballSettings.x > this.width / 2) {
                this.paddleOnApproach = {...this.paddle2Settings}
            } else {
                this.paddleOnApproach = {...this.paddle1Settings}
            }
        }
        drawPaddle() {
            this.paddlesArr.forEach((obj) => {
                createObject({ x:obj.x, y:obj.y, ...this.paddleSettings }, this.ctx)
            })
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
        drawBall() {
            // createObject(this.ballSettings, this.ctx)
            createBall(this.ballSettings, this.ctx)
        }
        moveBall() {
            const isPaddleSameHeight = this.ballSettings.y >= this.paddleOnApproach.y
            && this.ballSettings.y <= this.paddleOnApproach.y + this.paddleSettings.height
            const {x, xSpeed, ySpeed} = this.ballSettings
            this.ballSettings.x += xSpeed
            this.ballSettings.y += ySpeed

            if (this.ballSettings.x === this.paddleOnApproach.x +10 && isPaddleSameHeight) {
                this.ballSettings.xSpeed = this.ballSpeed 
            } else if (this.ballSettings.x === this.paddleOnApproach.x - 10 && isPaddleSameHeight) {
                this.ballSettings.xSpeed = -this.ballSpeed
            }

            if (this.ballSettings.y <= 10) {
                this.ballSettings.ySpeed = this.ballSpeed
            } else if (this.ballSettings.y >= this.height-10) {
                this.ballSettings.ySpeed = -this.ballSpeed
            }

    
        }
        runBall() {
            this.drawBall()
            this.moveBall()
        }
        checkForScoreUpdate() {
            if (this.ballSettings.x < 0) {
                this.scores.padd2 += 1
                this.round+=1
                this.gameReset()
            } else if (this.ballSettings.x > this.width) {
                this.scores.padd1 += 1 
                this.round+=1
                this.gameReset()
            }
        }
        updateGameScore() {
            const { padd1, padd2 } = this.scores
            updateScores(padd1, padd2, this.round)
        }
        gameReset() {
            this.paddle1Settings = createPadd(0, this.height / 2 - this.paddleSettings.height, 0, { left: 's', right: 'w' })
            this.paddle2Settings = createPadd(this.width - this.paddleSettings.width, this.height / 2 - this.paddleSettings.height, 0,
                { left: 'ArrowLeft', right: 'ArrowRight' })
            this.ballSettings = {
                x: 20,
                y :this.height / 2 -30,
                radius:8,
                xSpeed: 10,
                ySpeed: 10,
            }
            this.paddlesArr =[this.paddle1Settings, this.paddle2Settings]
        }
        runGame() {
            setInterval(() => {
                this.updateGameScore()
                this.clearGame()
                this.drawLine(100)
                this.runPaddles()
                this.runBall()
                this.checkForScoreUpdate()
            },100)
        }
        
    }
    const game = new Board()
    game.runGame()
})

