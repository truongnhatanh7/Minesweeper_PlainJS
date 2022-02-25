const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cells = $$(".board-game__cell")

let board = [...Array(18).keys()].map(i => Array(18).fill(0))
// for (let i = 0; i < 18; i++) {
//     for (let j = 0; j < 18; j++) {
//         console.log(board[i][j])
//     }
// }
main()

function main() {
    cellColoring()
    cellListener()
    generateBombs()
    calculateBoard()

    console.log(board)
    
}

function cellColoring() {
    let tempFlag = 0
    let row = 0
    let col = 0
    let count = 0
    for (cell of cells) {
        cell.setAttribute("id","cell_" + count)
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

function random(max = 20, col = 18 * 18) {
    const set = new Set()
    while (set.size < max) {
        let rand = Math.floor(Math.random() * Math.floor(col))
        set.add(rand)
    }
    return set
}

function generateBombs() {
    // Generate 10 random bombs
    let randomValues = random()

    for (value of randomValues) {
        let x = Math.floor(value / 18)
        let y = Math.floor(value % 18) - 1
        board[x][y] = -1
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
                    // console.log(i,j,y,x)
                    if (board[y][x] === -1) {
                        board[i][j] += 1
                        
                    }
                }
            }
        }
    }
}

function cellListener() {
    for (cell of cells) {
        cell.onclick = () => {
            cell.style.backgroundColor = "red"
        }
    }
}
