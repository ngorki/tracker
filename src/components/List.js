import React, { Component } from 'react'
import TaskList from './TaskList'

class List extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            tasks: [],
            pendingItem: {text: ""}
        }
    }

    handleInput = event => {
        const item = event.target.value
        const pendingItem = {text: item, key: this.state.tasks.length}
        this.setState({
            pendingItem: pendingItem,
        })
    }

    addItem = item => {
        item.preventDefault()
        const newItem = this.state.pendingItem
        console.log(newItem.key)
        if(newItem.text !== ""){
            const newItems = [...this.state.tasks, newItem]
            this.setState({
                tasks: newItems,
                pendingItem: {text: ""}
            })
        }
    }

    removeTask = (item) => {
        this.setState({
            tasks: this.state.tasks.filter(task => task.key !== item)
        })
    }

    editTask = (item) => {
        var newTasks = this.state.tasks
        newTasks.splice(this.state.tasks.indexOf(task => task.key === item.key) - 1, 1, item)
        this.setState({
            tasks: newTasks
        })
    }

    render(){
        return (
            <div className="list-main">
                <div className="list header">
                    <h1>{this.props.goal != null ? this.props.goal : 'Goal'}</h1>
                </div>
                <div className="list body">
                    <TaskList entries={this.state.tasks} removeTask={this.removeTask} editTask={this.editTask}/>
                </div>
                <div className="list-footer">
                    <form onSubmit={this.addItem}>
                        <input placeholder="Task" onChange={this.handleInput} value={this.state.pendingItem.text}/>
                        <button type="submit"> Add Task </button>
                    </form>
                </div>
            </div>
        );
    }
}

class ListGrid extends Component {
    constructor(props){
        super(props)

        this.state = {
            goals: this.props.goals,
            pendingGoal: {goal: ""}
        }
    }

    createList(list){
        return <List key={list.goal} goal={list.goal}/>
    }

    handleInput = input => {
        const item = input.target.value
        const pendingItem = {goal: item, key: new Date().getTime()}
        this.setState({
            pendingGoal: pendingItem,
        })
    }

    addList = item => {
        item.preventDefault()
        const newItem = this.state.pendingGoal
        if(newItem.text !== ""){
            const newItems = [...this.state.goals, newItem]
            this.setState({
                goals: newItems
            })
        }
        this.setState({
            pendingGoal: {goal: ""}
        })
    }

    render(){
        const entries = this.state.goals
        const list = entries.map(this.createList)

        return(
            <div>
                <form onSubmit={this.addList}>
                    <input placeholder="New List" onChange={this.handleInput} value={this.state.pendingGoal.goal}/>
                    <button type="submit"> Add List </button>
                </form>
                <ul className="list-grid">{list}</ul>
            </div>
        )
    }
}

export default ListGrid;