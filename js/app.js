const appBarrels = {
    name: 'barrels',
    description: 'Don King Kong 2D for Ironhack Project',
    version: '1.0.0',
    license: undefined,
    author: 'Adrian and Aldi',
    canvasTag: undefined,
    ctx: undefined,
    canvasSize: { w: 900, h: 700 },
    mario: undefined,
    don: undefined,
    framesCounter: 0,
    platforms: [],
    stairs: [],
    barrels: [],
    livesCounter: [],
    win: undefined,
    timer: 1,
    interval: undefined,
    textPx: undefined,

    init() {
        this.setContext()
        this.setDimensions()
        this.start()

    },
    setContext() {
        this.canvasTag = document.querySelector('canvas')
        this.ctx = this.canvasTag.getContext('2d')
    },

    setDimensions() {
        this.canvasTag.setAttribute('width', this.canvasSize.w)
        this.canvasTag.setAttribute('height', this.canvasSize.h)
    },


    reset() {
        this.platforms.push(
            new Platform(this.ctx, this.canvasSize, 1000, 10, 1, 90),
            new Platform(this.ctx, this.canvasSize, 500, 10, 330, 170),
            new Platform(this.ctx, this.canvasSize, 350, 10, 270, 260),
            new Platform(this.ctx, this.canvasSize, 420, 10, 220, 350),
            new Platform(this.ctx, this.canvasSize, 400, 10, 500, 450),
            new Platform(this.ctx, this.canvasSize, 1000, 10, 1, 550),
            new Platform(this.ctx, this.canvasSize, 1000, 30, 0, 670),
        ),

            this.stairs.push(
                new Stairs(this.ctx, this.canvasSize, 20, 380, 100, 170),
                new Stairs(this.ctx, this.canvasSize, 20, 80, 700, 90),
                new Stairs(this.ctx, this.canvasSize, 20, 89, 480, 170),
                new Stairs(this.ctx, this.canvasSize, 20, 90, 300, 260),
                new Stairs(this.ctx, this.canvasSize, 20, 100, 610, 350),
                new Stairs(this.ctx, this.canvasSize, 20, 100, 530, 450),
                new Stairs(this.ctx, this.canvasSize, 20, 120, 770, 550),
            ),

            this.livesCounter.push(
                new LiveCounter(this.ctx, this.canvasSize, 20, 20, 2, 5),
                new LiveCounter(this.ctx, this.canvasSize, 20, 20, 24, 5),
                new LiveCounter(this.ctx, this.canvasSize, 20, 20, 46, 5),
            )

        this.mario = new Mario(this.ctx, this.canvasSize, 15, 40, 10, 630, this.lives)

        this.don = new Don(this.ctx, this.canvasSize, 30, 50, 500, 40)

        this.barrels.push(new Barrel(this.ctx, this.canvasSize))
        this.barrels = []

        this.win = new Win(this.ctx, this.canvasSize, 40, 60, 340, 35)
    },

    start() {
        this.reset()
        this.interval = setInterval(() => {
            this.framesCounter > 300 ? this.framesCounter = 0 : this.framesCounter++
            this.clearAll()
            this.drawAll()
            this.generateBarrel()
            this.clearBarrel()
            this.isColissionWithBarrel()
            this.isColissionWithStructure()
            this.isCollissionWithWin()
            this.isCollissionWithDon()
            if (this.mario.canMoveLeft) this.mario.moveLeft()
            if (this.mario.canMoveRight) this.mario.moveRight()

        }, 100)
    },

    drawAll() {
        this.drawBackground()
        this.drawGameOver()
        this.drawWinGame()
        this.platforms.forEach(Platform => Platform.draw())
        this.stairs.forEach(Stairs => Stairs.draw())
        this.mario.draw()
        this.mario.move()
        this.don.draw()
        this.don.move()
        this.win.draw()
        this.barrels.forEach(Barrel => Barrel.draw())
        this.barrels.forEach(Barrel => Barrel.move())
        this.livesCounter.forEach(LiveCounter => LiveCounter.draw())
    },

    drawBackground() {
        // this.ctx.fillStyle = 'darkgrey'
        // this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h)
        this.imageInstance = new Image()
        this.imageInstance.src = './images/backgroundDonkey.png'
        this.ctx.drawImage(this.imageInstance, 0, 0, this.canvasSize.w, this.canvasSize.h)
    },

    drawGameOver() {
        this.imageInstance = new Image()
        this.imageInstance.src = './images/gameover.png'
    },

    drawWinGame() {
        this.imageInstance = new Image()
        this.imageInstance.src = './images/win.png'
    },

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h)
    },

    generateBarrel() {
        if (this.framesCounter % 10 === 0) {
            this.barrels.push(new Barrel(this.ctx, this.canvasSize))
        }
    },

    clearBarrel() {
        this.barrels = this.barrels.filter(Barrel => Barrel.barrelPos.x > 0)
    },

    isColissionWithBarrel() {

        this.barrels.forEach((barrel, index) => {
            if (
                this.mario.marioPos.x < barrel.barrelPos.x + barrel.barrelSize.w &&
                this.mario.marioPos.x + this.mario.marioSize.w > barrel.barrelPos.x &&
                this.mario.marioPos.y + this.mario.marioSize.h < barrel.barrelPos.y + barrel.barrelSize.h &&
                this.mario.marioSize.h + this.mario.marioPos.y > barrel.barrelPos.y
            ) {
                // borrrrrrrrrra
                this.barrels.splice(index, 1)
                this.mario.lives--
                // console.log("BORRA ESTA COSITA =====>", this.livesCounter.pop())
                this.livesCounter.pop()
                if (this.mario.lives === 0) this.gameOver()


            }
        })
    },

    isColissionWithStructure() {

        const hasCollisionedStairs = this.stairs.some(stair => {
            return (
                this.mario.marioPos.x < stair.stairsPos.x + stair.stairsSize.w &&
                this.mario.marioPos.x + this.mario.marioSize.w > stair.stairsPos.x &&
                this.mario.marioPos.y < stair.stairsPos.y + stair.stairsSize.h &&
                this.mario.marioSize.h + this.mario.marioPos.y > stair.stairsPos.y
            )
        })

        const collisionedPlatform = this.platforms.some(platform => {
            return (
                this.mario.marioPos.x < platform.platformPos.x + platform.platformSize.w &&
                this.mario.marioPos.x + this.mario.marioSize.w > platform.platformPos.x &&
                this.mario.marioPos.y + this.mario.marioSize.h / 1.25 < platform.platformPos.y + platform.platformSize.h &&
                this.mario.marioSize.h + this.mario.marioPos.y > platform.platformPos.y
            )
        })

        if (hasCollisionedStairs && collisionedPlatform) {
            this.mario.gravityActive = false
            this.mario.canMoveUpDown = true
        } else if (collisionedPlatform) {
            this.mario.gravityActive = false
            this.mario.canMoveUpDown = false
        } else if (hasCollisionedStairs) {
            this.mario.gravityActive = false
            this.mario.canMoveUpDown = true
        } else {
            this.mario.gravityActive = true
            this.mario.canMoveUpDown = false
        }
    },
    isCollissionWithWin() {
        if (
            this.mario.marioPos.x < this.win.winPos.x + this.win.winSize.w &&
            this.mario.marioPos.x + this.mario.marioSize.w > this.win.winPos.x &&
            this.mario.marioPos.y < this.win.winPos.y + this.win.winSize.h &&
            this.mario.marioSize.h + this.mario.marioPos.y > this.win.winPos.y
        ) {
            this.winGame()
        }
    },

    isCollissionWithDon() {
        if (
            this.mario.marioPos.x <= this.don.donPos.x + this.don.donSize.w &&
            this.mario.marioPos.x + this.mario.marioSize.w >= this.don.donPos.x &&
            this.mario.marioPos.y < this.don.donPos.y + this.don.donSize.h &&
            this.mario.marioSize.h + this.mario.marioPos.y > this.don.donPos.y
        )
            // this.livesCounter.splice(0, 3)
            this.gameOver()
    },

    gameOver() {

        clearInterval(this.interval)
        this.clearAll()
        this.ctx.drawImage(this.imageInstance, 0, 0, this.canvasSize.w, this.canvasSize.h)
        setTimeout(() => location.reload(), 2000)
    },


    winGame() {

        clearInterval(this.interval)
        // { return alert('YOU WIN') }
        this.clearAll()
        this.ctx.drawImage(this.imageInstance, 0, 0, this.canvasSize.w, this.canvasSize.h)
        setTimeout(() => location.reload(), 5000)
    },
}