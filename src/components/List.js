import React, { Component, createRef } from 'react'
import { BiTrash } from 'react-icons/bi'
import { v4 } from 'uuid'
import TaskList from './TaskList'
class List extends React.Component{
    constructor(props){
        super(props)
        this.ref = createRef()

        this.state = {
            goal: this.props.goal,
            headerBody: this.props.goal,
            tasks: this.props.tasks ? this.props.tasks : [],
            dragged: false,
            draggedOver: false,
            dragTask: false,
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
        this.props.editGoal({goal: this.state.goal, tasks: this.state.tasks, key: this.props.id, index: this.props.index})
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
        this.props.updateTasks(this.props.index, newTasks)
    }

    dragTask = event => {
        this.setState({
            dragTask: true,
        })
    }

    endDragTask = event => {
        this.setState({
            dragTask: false,
        })
    }

    onDragStart = event => {
        if(!this.state.dragTask){
            this.props.onDragStart(this.props.index)
            event.dataTransfer.setData("text/html", "")
        }
    }

    onDragOver = event => {
        if(!this.state.dragTask){
            this.setState({
                draggedOver: true,
            })
            this.props.onDragOver(this.props.index)
            event.preventDefault()
        }
    }

    onDragLeave = (event) => {
        this.setState({
            draggedOver: false,
        })
    }

    onDrop = (event) => {
        if(!this.state.dragTask){
            this.setState({
                draggedOver: false,
            })
            this.props.onDrop()
        }
    }

    render(){
        return (
            <div className={"list-main" + (this.state.draggedOver ? " dragArea" : "")} id={"list" + this.props.id} draggable={true} onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDragLeave={this.onDragLeave} onDrop={this.onDrop}>
                <div className="list-header">
                    <div onClick={this.startUpdate}>
                        <h1>{this.state.headerBody}</h1>
                    </div>
                    <div className='header-buttons' onClick={this.removeGoal}>
                        <BiTrash/>
                    </div>
                </div>
                <div className="list-body">
                    <TaskList listID={this.props.id} tasks={this.state.tasks} removeTask={this.removeTask} editTask={this.editTask} updateTasks={this.updateTasks} dragTask={this.dragTask} endDragTask={this.endDragTask}/>
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
            pendingGoal: {goal: ""},

            draggedFrom: null,
            draggedTo: null,
            isDragging: false,
            originalOrder: [],
            updatedOrder: [],
        }
    }

    removeGoal = (goalID) => {
        var newGoalsList = this.state.goals
        var index = newGoalsList.findIndex(goal => goal.key === goalID)
        newGoalsList.splice(index, 1)
        this.setState({
            goals: newGoalsList
        })
        window.localStorage.setItem("goals", JSON.stringify(newGoalsList))
    }

    editGoal = newGoal => {
        var newGoalsList = this.state.goals
        newGoalsList.splice(newGoal.index, 1, newGoal)
        this.setState({
            goals: newGoalsList
        })
        window.localStorage.setItem("goals", JSON.stringify(newGoalsList))
    }

    updateTasks = (goalIndex, newTasks) => {
        var goal = this.state.goals[goalIndex]
        goal.tasks = newTasks
        this.editGoal(goal)
    }

    createList = (list, index) => {
        return <List key={list.key} index={index} id={list.key} goal={list.goal} tasks={list.tasks} 
            editGoal={this.editGoal} updateTasks={this.updateTasks} removeGoal={this.removeGoal}
            onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDrop={this.onDrop}/>
    }

    handleInput = input => {
        const item = input.target.value
        const pendingItem = {goal: item}
        this.setState({
            pendingGoal: pendingItem,
        })
    }

    addList = item => {
        item.preventDefault()
        let newItem = this.state.pendingGoal
        newItem.key = v4()
        newItem.index = this.state.goals.length
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

    onDragStart = index => {
        this.setState({
            draggedFrom: index,
            isDragging: true,
            originalOrder: this.state.goals
        })
    }

    onDragOver = index => {
        let newList = this.state.originalOrder
        const draggedFrom = this.state.draggedFrom
        const draggedTo = index
        const draggedGoal = newList[draggedFrom]
        const remainingGoals = newList.filter(goal => goal.index !== draggedFrom)

        newList = [
            ...remainingGoals.slice(0, draggedTo),
            draggedGoal,
            ...remainingGoals.slice(draggedTo)
        ]

        if(draggedTo != this.state.draggedTo){
            this.setState({
                updatedOrder: newList,
                draggedTo: draggedTo
            })
        }
    }

    onDrop = () => {
        let newOrder = this.state.updatedOrder
        for(let i = 0; i < newOrder.length; i++){
            newOrder[i].index = i
        }
        this.setState({
            goals: this.state.updatedOrder,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        })
        window.localStorage.setItem("goals", JSON.stringify(newOrder))
    }

    render(){
        const entries = this.state.goals
        const list = entries.map(this.createList)

        return(
            <div className="App">
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