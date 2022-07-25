

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
    const initialSettings = (mainObj) => {
        const paddleSettings={
            width: 10,
            height: 50
        }
        return {
            paddleSettings,
            ballSpeed: 2.5,
            round: 1,
            scores: {
                padd1:0,
                padd2:0
            },
            maxSpeed: 3.5,
            interval: null,
            winner: null,
            running: true,
            paddle1: createPadd(0, mainObj.height / 2 - paddleSettings.height, 0, { left: 's', right: 'w' }),
            paddle2:createPadd(mainObj.width - paddleSettings.width, mainObj.height / 2 - paddleSettings.height, 0,
                { left: 'ArrowLeft', right: 'ArrowRight' }),
        }
    }
    class Board {
        constructor() {
            this.canvas = canvas
            this.ctx = canvas.getContext("2d")
            this.width = canvas.width
            this.height = canvas.height
            this.initialSettings = initialSettings(this)
            this.ballStart = 'player2'
            this.ballSettings ={
                x: 10,
                y :randomIntFromInterval(30,this.height-30),
                radius:8,
                xSpeed: 2.5,
                ySpeed: 2.5,
            }
            // Initial settings obj makes it easier to reset after every round
            this.maxSpeed = this.initialSettings.maxSpeed
            this.round = this.initialSettings.round
            this.paddleSettings = {...this.initialSettings.paddleSettings }
            this.ballSpeed = this.initialSettings.ballSpeed
            this.scores = {...this.initialSettings.scores}
            this.paddle1Settings = {...this.initialSettings.paddle1}
            this.paddle2Settings = {...this.initialSettings.paddle2}
            this.interval =this.initialSettings.interval
            this.running = this.initialSettings.running
            this.winner = this.initialSettings.winner

            // use to loop through eachh paddle and also figure out how to it interacts with ball
            this.paddlesArr = [this.paddle1Settings, this.paddle2Settings]
            this.paddleOnApproach = { ...this.paddle2Settings }
            this.paddleStart='right'
        }
        clearGame = () => {
            const { width, height } = this.canvas
            this.ctx.clearRect(0, 0, width, height)
        }
        checkBallStart() {
            if (this.ballStart === 'player1') {
                this.ballStart = 'player2'
            } else {
                this.ballStart = 'player1'
            }
        }

        handleSpeedStart() {
            
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

        drawPaddle=()=> {
            this.paddlesArr.forEach((obj) => {
                createObject({ x:obj.x, y:obj.y, ...this.paddleSettings }, this.ctx)
            })
        }

        movePaddles=()=> {
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

        runPaddles=()=> {
            this.drawPaddle()
            this.movePaddles()
        }

        drawBall = () => {
            createBall(this.ballSettings, this.ctx)
        }

        moveBall = () => {
            // REDO THIS SECTION
            const isPaddleSameHeight = this.ballSettings.y >= this.paddleOnApproach.y
                && this.ballSettings.y <= this.paddleOnApproach.y + this.paddleSettings.height
            // const isPaddleSameWidth = this.ballSettings.x >= this.paddleOnApproach.x + 10 && this.ballSettings.x <= this.paddleOnApproach.x
            const { x, xSpeed, ySpeed } = this.ballSettings
            this.ballSettings.x += xSpeed
            this.ballSettings.y += ySpeed

            if (this.ballSettings.y <= 10) {
                this.ballSettings.ySpeed = this.ballSpeed
            } else if (this.ballSettings.y >= this.height - 10) {
                this.ballSettings.ySpeed = -this.ballSpeed
            }
            if (this.ballSettings.x === this.paddleOnApproach.x + 10 && isPaddleSameHeight) {
                this.ballSettings.xSpeed = this.ballSpeed
            } else if (this.ballSettings.x === this.paddleOnApproach.x - 10 && isPaddleSameHeight) {
                this.ballSettings.xSpeed = -this.ballSpeed
            }
        }

        runBall() {
            this.drawBall()
            this.moveBall()
        }

        checkForScoreUpdate=()=> {
            if (Object.values(this.scores).reduce((acc, s) => acc + s, 0) === 7) {
                const winner = this.scores.padd1 > this.scores.padd2 ? 'Player 1' : 'Player 2'
                this.winner = winner
                this.running = false
            }
            if (this.ballSettings.x < 0) {
                this.scores.padd2 += 1
                this.round += 1
                this.gameReset()
            } else if (this.ballSettings.x > this.width) {
                this.scores.padd1 += 1 
                this.round += 1
                this.gameReset()
            }
   
        }
        updateGameScore=()=> {
            const { padd1, padd2 } = this.scores
            updateScores(padd1, padd2, this.round)
        }
        gameReset = () => {
            const startAtFirstPadd = this.ballStart === 'player1'
            this.ballSettings = {
                x: startAtFirstPadd ? 10 : this.width - this.paddleSettings.width -20,
                y :randomIntFromInterval(30,this.height-30),
                radius:8,
                xSpeed:startAtFirstPadd ? 2.5 :-2.5,
                ySpeed: startAtFirstPadd ? 2.5 :-2.5,
            }
            this.paddle1Settings = {...this.initialSettings.paddle1}
            this.paddle2Settings = {...this.initialSettings.paddle2}
            this.paddlesArr = [this.paddle1Settings, this.paddle2Settings]

            if (this.ballStart === 'player1') this.ballStart = 'player2'
            else this.ballStart = 'player1'
        }
        playGame = () => {
            this.clearGame()
            this.updateGameScore()
            this.drawLine(100)
            this.runPaddles()
            this.runBall()
            this.checkForScoreUpdate()
        }
        winnerModal = () => {
            const body = document.querySelector('body')
            const modal = document.createElement('div')
            const handleRestart = (e) => {
                e.preventDefault()
                location.reload()
            }
            body.appendChild(modal)
            body.classList.add('background-change')
            modal.classList.add('modal')
            modal.innerHTML = `
            <h1>Game Over</h1>
            <p>The winner is ${this.winner}</p>
            <button class='modal-btn'>Restart</button>
            `
            document.querySelector('.modal-btn').addEventListener('click', handleRestart)
        }
        gameInterval = () => {
            if (this.running) {
                this.playGame()
                this.interval = window.requestAnimationFrame(this.gameInterval)
            } else {
                // clearInterval(this.interval)
                this.winnerModal()
                window.cancelAnimationFrame(this.interval)
            }

        }
        runGame = () => {
            window.requestAnimationFrame(this.gameInterval)
        //  this.interval = setInterval(() => {
        //         this.gameInterval()
        //     }, 1000/13);
        }
        
    }
    const game = new Board()
    game.runGame()
})

