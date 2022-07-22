import React, { Component, createRef } from 'react'
import { BiTrash } from 'react-icons/bi'
import TaskList from './TaskList'
class List extends React.Component{
    constructor(props){
        super(props)
        this.ref = createRef()

        this.state = {
            goal: this.props.goal,
            headerBody: this.props.goal,
            tasks: this.props.tasks ? this.props.tasks : [],
        }
    }

    componentDidUpdate() {
        if(this.ref.current != null)
            this.ref.current.focus()
    }

    finishEdit = event => {
        this.setState({
            headerBody: this.state.goal ? this.state.goal : "Goal"
        })
        this.props.editGoal({goal: this.state.goal, tasks: this.state.tasks, key: this.props.id})
    }

    updateGoal = event => {
        this.setState({
            goal: event.target.value,
            headerBody: 
                <form onSubmit={this.finishEdit}>
                    <input placeholder={"Goal"} onBlur={this.finishEdit} ref={this.ref} value={event.target.value} onChange={this.updateGoal} key={this.props.id}/>
                </form>,
        })
    }

    startUpdate = event => {
        this.setState({
            headerBody:
                <form onSubmit={this.finishEdit}>
                    <input placeholder={"Goal"} onBlur={this.finishEdit} ref={this.ref} value={this.state.goal} onChange={this.updateGoal} key={this.props.id}/>
                </form>,
        })
    }

    removeGoal = event => {
        this.props.removeGoal(this.props.id)
    }

    updateTasks = newTasks => {
        this.setState({
            tasks: newTasks
        })
        this.props.updateTasks(this.props.id, newTasks)
    }

    render(){
        return (
            <div className="list-main">
                <div className="list-header">
                    <div onClick={this.startUpdate}>
                        <h1>{this.state.headerBody}</h1>
                    </div>
                    <div className='header-buttons' onClick={this.removeGoal}>
                        <BiTrash/>
                    </div>
                </div>
                <div className="list-body">
                    <TaskList tasks={this.state.tasks} removeTask={this.removeTask} editTask={this.editTask} updateTasks={this.updateTasks}/>
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

    removeGoal = (item) => {
        var newGoalsList = this.state.goals
        newGoalsList.splice(item, 1)
        for(var i = 0; i < newGoalsList.length; i++){
            newGoalsList[i].key = i
        }
        this.setState({
            goals: newGoalsList
        })
        window.localStorage.setItem("goals", JSON.stringify(newGoalsList))
    }

    editGoal = newGoal => {
        var newGoalsList = this.state.goals
        newGoalsList.splice(newGoal.key, 1, newGoal)
        this.setState({
            goals: newGoalsList
        })
        window.localStorage.setItem("goals", JSON.stringify(newGoalsList))
    }

    updateTasks = (cgoal, newTasks) => {
        var goal = this.state.goals.find(currentGoal => currentGoal.key === cgoal)
        goal.tasks = newTasks
        this.editGoal(goal)
        console.log(this.state.goals)
    }

    createList = list => {
        return <List key={list.key} id={list.key} goal={list.goal} tasks={list.tasks} editGoal={this.editGoal} updateTasks={this.updateTasks} removeGoal={this.removeGoal}/>
    }

    handleInput = input => {
        const item = input.target.value
        const pendingItem = {goal: item, key: this.state.goals.length}
        this.setState({
            pendingGoal: pendingItem,
        })
    }

    addList = item => {
        item.preventDefault()
        const newItem = this.state.pendingGoal
        if(newItem.goal !== ""){
            const newItems = [...this.state.goals, newItem]
            this.setState({
                goals: newItems
            })
            window.localStorage.setItem("goals", JSON.stringify(newItems))
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