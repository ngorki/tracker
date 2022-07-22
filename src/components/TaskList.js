import {Component, createRef} from 'react'
import {FaEdit} from 'react-icons/fa'
import {BiTrash} from 'react-icons/bi'

// Task box
class Task extends Component{
    constructor(props){
        super(props)
        this.ref = createRef()

        this.state = {
            taskText: this.props.task,
            taskBody: this.props.task,
            complete: this.props.complete ? this.props.complete : false,
        }
    }

    componentDidUpdate() {
        if(this.ref.current != null)
            this.ref.current.focus()
    }

    updateTask = event => {
        this.setState({
            taskText: event.target.value,
            taskBody: <form onSubmit={this.finishEdit}><input ref={this.ref} value={event.target.value} onChange={this.updateTask} id={this.props.id}/></form>
        })
    }

    completeTask = event => {
        const newState = !this.state.complete
        this.setState({
            complete: newState
        })
        if(newState){
            document.getElementById(this.props.listID + "," + this.props.id).classList.add("complete-task")
        } else {
            document.getElementById(this.props.listID + "," + this.props.id).classList.remove("complete-task")
        }
        this.props.completeTask(this.props.id)
    }

    startEdit = event => {
        var edit = <form onSubmit={this.finishEdit}><input  ref={this.ref} value={this.state.taskText} onChange={this.updateTask} id={this.props.id}/></form>
        this.setState({
            taskBody: edit
        })
    }

    finishEdit = event => {
        this.setState({
            taskBody: this.state.taskText
        })
        this.props.editTask({text: this.state.taskText, key: this.props.id})
    }

    render(){
        return(
            <div className="taskbox">
                <div className='checkbox'>
                    <input type="checkbox" id='complete' name='complete' checked={this.state.complete} onChange={this.completeTask}/>
                </div>
                <div className='task' id={this.props.listID + "," + this.props.id} onBlur={this.finishEdit} onClick={this.startEdit}>{this.state.taskBody}</div>
                <div className='task-icons'>
                    <button onClick={() => this.startEdit(this.props.id)}>
                        <FaEdit/>
                    </button>  
                    <button onClick={() => this.props.removeTask(this.props.id)}>
                        <BiTrash/>
                    </button>
                </div>
            </div>
        )
    }
}

class TaskList extends Component{
    constructor(props){
        super(props)

        this.state = {
            tasks: this.props.tasks ? this.props.tasks : [],
            pendingItem: {text: "", complete: false}
        }
    }

    handleInput = event => {
        const item = event.target.value
        const pendingItem = {text: item, key: this.state.tasks.length}
        this.setState({
            pendingItem: pendingItem,
        })
    }

    addTask = item => {
        item.preventDefault()
        const newItem = this.state.pendingItem
        if(newItem.text !== ""){
            const newItems = [...this.state.tasks, newItem]
            this.setState({
                tasks: newItems,
                pendingItem: {text: ""}
            })
            this.props.updateTasks(newItems)
        }
    }

    removeTask = (item) => {
        var newTasks = this.state.tasks
        newTasks.splice(item, 1)
        for(var i = item; i < this.state.tasks.length; i++){
            newTasks[i].key = i
        }
        this.setState({
            tasks: newTasks
        })
        this.props.updateTasks(newTasks)
    }

    editTask = (item) => {
        var newTasks = this.state.tasks
        newTasks.splice(item.key, 1, item)
        this.setState({
            tasks: newTasks
        })
        this.props.updateTasks(newTasks)
    }

    completeTask = taskID => {
        var newTask = this.state.tasks[taskID]
        newTask.complete = true
        this.editTask(newTask)
    }

    createTask = item => {
        return <Task listID={this.props.listID} id={item.key} task={item.text} key={item.key} removeTask={this.removeTask} editTask={this.editTask} completeTask={this.completeTask}/>
    }

    render(){
        const entries = this.props.tasks
        const list = entries.map(this.createTask)

        return (
            <div>
                <ul className="tasklist">{list}</ul>
                <form onSubmit={this.addTask}>
                    <input placeholder="Task" onChange={this.handleInput} value={this.state.pendingItem.text}/>
                    <button type="submit"> Add Task </button>
                </form>
            </div>
        )
    }
}

export default TaskList