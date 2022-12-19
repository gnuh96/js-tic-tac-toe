import { getCellElementAtIdx, getCurrentTurnElement, getCellElementList, getGameStatusElement, getReplayButtonElement } from "./selectors.js";
import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
    currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;
    const currentTurnElement = getCurrentTurnElement();

    // update DOM Element
    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(currentTurn);
    }
}
function updateGameStatus(status) {
    gameStatus = status;
    const gameStatusElement = getGameStatusElement();
    if (gameStatusElement) gameStatusElement.textContent = status;
}

function showReplayButton() {
    const replayButtonElement = getReplayButtonElement();
    if (replayButtonElement) replayButtonElement.classList.add("show");
}

function hideReplayButton() {
    const replayButtonElement = getReplayButtonElement();
    if (replayButtonElement) replayButtonElement.classList.remove("show");
}

function highlightWinCells(winCells) {
    if (!Array.isArray(winCells) || winCells.length !== 3) throw new Error('Invalid win cells');

    for (const position of winCells) {
        const cell = getCellElementAtIdx(position);
        if (cell) cell.classList.add("win");
    }
}

function handleCellClick(cell, index) {
    const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
    if (isClicked || gameStatus !== GAME_STATUS.PLAYING) return;

    // set selected cell
    cell.classList.add(currentTurn);

    // update cellValues
    cellValues[index] = currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

    toggleTurn();

    const game = checkGameStatus(cellValues);
    switch (game.status) {
        case GAME_STATUS.ENDED: {
            updateGameStatus(game.status);
            showReplayButton();
            break;
        }
        case GAME_STATUS.X_WIN:
        case GAME_STATUS.O_WIN: {
            updateGameStatus(game.status);
            showReplayButton();
            highlightWinCells(game.winPositions);
            break;
        }
        default: {
            break;
        }
    }
}

function initCellElementList() {
    const cellElementList = getCellElementList();
    cellElementList.forEach((cell, index) => {
        cell.addEventListener('click', () => handleCellClick(cell, index));
    })

    // // Event delegation
    // const liList = getCellElementList();
    // liList.forEach((cell, index) => {
    //     cell.dataset.idx = index;
    // })
    // const cellElementList = document.getElementById("cellList");
    // if (cellElementList) {
    //     cellElementList.addEventListener('click', (event) => {
    //         if (event.target.tagName !== 'LI') return;
    //         const index = Number.parseInt(event.target.dataset.idx);
    //         handleCellClick(event.target, index);
    //     })
    // }
}

function resetGame() {
    currentTurn = TURN.CROSS;
    gameStatus = GAME_STATUS.PLAYING;
    cellValues = cellValues.map(() => '');

    updateGameStatus(GAME_STATUS.PLAYING);
    const currentTurnElement = getCurrentTurnElement();

    if (currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
        currentTurnElement.classList.add(TURN.CROSS);
    }

    const cellElementList = getCellElementList();
    for (const cellElement of cellElementList) {
        cellElement.className = "";
    }

    hideReplayButton();
}

function initReplayButton() {
    const replayButton = getReplayButtonElement();
    if (replayButton) {
        replayButton.addEventListener("click", resetGame);
    }
}
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
    // bind click event for all li elements
    initCellElementList();

    // bind click event for replay button
    initReplayButton();
})()