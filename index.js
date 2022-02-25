'use strict'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cells = $$(".board-game__cell")
const currentRemainingFlag = $(".board-info__remaining-bombs")
const winMsg = $(".board__win-info")
const loseMsg = $(".board__lose-info")


let board = [...Array(18).keys()].map(i => Array(18).fill(0))
let isOpen = [...Array(18).keys()].map(i => Array(18).fill(false))
let prevColor = [...Array(18).keys()].map(i => Array(18).fill(""))
let randomValues = null
let endGame = false;
let currentPick = new Set()

main()

function main() {
    cellColoring()
    generateBombs()
    calculateBoard()
    // for (let i = 0; i < 18; i++) {
    //     for (let j = 0; j < 18; j++) {
    //         console.log(board[i][j] + " ")
    //     }
    //     console.log()
    // }
    board.forEach((element) => {
        console.log(element)
    })
}

function cellColoring() {
    let tempFlag = 0
    let col = 0
    let count = 0

    for (let cell of cells) {
        cell.setAttribute("id","cell_" + count)
        cell.addEventListener("click", cellListener)
        cell.addEventListener("contextmenu", function(e) {
            e.preventDefault()
            if (cell.classList.contains("enable-flag")) {
                cell.classList.remove("enable-flag")
                currentRemainingFlag.innerHTML = parseInt(currentRemainingFlag.innerHTML) + 1
            } else {
                cell.classList.add("enable-flag")
                currentRemainingFlag.innerHTML = parseInt(currentRemainingFlag.innerHTML) - 1
                currentPick.add(parseInt(cell.getAttribute("id").substring(5)))
                if (checkWinningCondition()) {
                    winMsg.classList.add("pop-msg")
                }
            }
            
        })
        if (tempFlag === 0) {
            cell.style.backgroundColor = "#32a852"
            tempFlag++
        } else {
            cell.style.backgroundColor = "#60ab74"
            tempFlag--
        }
        
        col++
        count++
        if (col === 18) {
            if (tempFlag === 0) {
                tempFlag = 1
            } else {
                tempFlag = 0
            }
            col = 0
        }

    }
}

function checkWinningCondition() {
    let count = 0
    for (let value of currentPick) {
        for (let valueRef of randomValues) {
            if (value == valueRef) {
                count++
            }
        }
    }
    return count == randomValues.size
}

function normalCoordtoYX(coord) {

}

function YXToNormalCoord(y, x) {

}

function random(max = 30, col = 18 * 18) {
    const set = new Set()
    while (set.size < max) {
        let rand = Math.floor(Math.random() * Math.floor(col))
        set.add(rand)
    }
    return set
}

function generateBombs() {
    // Generate 30 random bombs
    randomValues = random()

    for (let value of randomValues) {
        let y = Math.floor(value / 18)
        let x = Math.floor(value % 18)
        board[y][x] = -1
    }

}

function calculateBoard() {
    // Loop and check surroundings
    let dirX = [-1, 0, 1, -1, 1, -1, 0, 1]
    let dirY = [-1, -1, -1, 0, 0, 1, 1, 1]

    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
            if (board[i][j] === -1) {
                continue
            }
            for (let k = 0; k < 8; k++) {
                let x = j + dirX[k]
                let y = i + dirY[k]
                if (x >= 0 && y >=0 && x < 18 && y < 18) {
                    if (board[y][x] === -1) {
                        board[i][j] += 1
                        
                    }
                }
            }
        }
    }
}

function cellFlag() {
    // let stringId = this.getAttribute("id")
    // let numId = parseInt(stringId.substring(5))
    // let cellCoor = {y: Math.floor(numId / 18), x: Math.floor(numId % 18)}
    // if (this.style.backgroundColor === "red") {
    //     this.style.backgroundColor = "#ccc"
    // } else {
        this.style.backgroundColor = "red"
    // }
}

function cellListener() {
    let stringId = this.getAttribute("id")
    let numId = parseInt(stringId.substring(5))
    let cellCoor = {y: Math.floor(numId / 18), x: Math.floor(numId % 18)}
    // console.dir(cellCoor)
    this.innerHTML = `<p>${board[cellCoor.y][cellCoor.x]}</p>`
    this.style.backgroundColor = "#ccc"
    if (board[cellCoor.y][cellCoor.x] === -1) {
        loseMsg.classList.add("pop-msg")
    }
    exploreSurroundings(cellCoor.y, cellCoor.x)
}

function exploreSurroundings(y, x) {
    if (y < 0 || x < 0 || y == 18 || x == 18 || board[y][x] === -1 || isOpen[y][x]) {
        return
    }

    let tempCell = $("#cell_" + (18 * y + x))
    // console.log(tempCell.getAttribute("id"))
    isOpen[y][x] = true
    tempCell.innerHTML = `<p>${board[y][x]}</p>`
    tempCell.style.backgroundColor = "#ccc"
    
    if (board[y][x] !== 0) { // > 0 Values
        return
    } 

    // DFS
    exploreSurroundings(y - 1, x - 1)
    exploreSurroundings(y, x - 1)
    exploreSurroundings(y + 1, x - 1)
    exploreSurroundings(y - 1, x)
    exploreSurroundings(y + 1, x)
    exploreSurroundings(y - 1, x + 1)
    exploreSurroundings(y, x + 1)
    exploreSurroundings(y + 1, x + 1)

}
