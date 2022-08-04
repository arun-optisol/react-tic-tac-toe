import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'

class Board extends React.Component{

    renderSquare(i, pos){
       return (
        <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i, pos)}/>
       )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, {row: 0, col:0})}
                    {this.renderSquare(1, {row: 0, col:1})}
                    {this.renderSquare(2, {row: 0, col:2})}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, {row: 1, col:0})}
                    {this.renderSquare(4, {row: 1, col:1})}
                    {this.renderSquare(5, {row: 1, col:2})}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, {row: 2, col:0})}
                    {this.renderSquare(7, {row: 2, col:1})}
                    {this.renderSquare(8, {row: 2, col:2})}
                </div>
            </div>
        )
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Game extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    currentPos: {
                        row: null,
                        col: null
                    }
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            currentMove: null
        }
    }

    handleClick(i, pos){
        const history = this.state.history.slice(0, this.state.stepNumber+1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        const currentPos = pos
        if(calculateWinner(squares) || squares[i]){
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{squares: squares, currentPos: currentPos}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            currentMove: null
        })
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            currentMove: step
        })
    }

    render(){
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #'+move+`(${history[move].currentPos.row},${history[move].currentPos.col})` : 'Go to game start!'
            return(
                <li key={move} style={{'fontWeight': this.state.currentMove === move ? 'bold' : ''}}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        let status
        if(winner){
            status = `Winner: ${winner}`
        }else{
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i, pos) => this.handleClick(i, pos)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Game></Game>)

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}