import {Component, createRef} from 'react'
import {FaEdit} from 'react-icons/fa'
import {BiTrash} from 'react-icons/bi'
import {v4} from 'uuid'

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

    componentDidMount() {
        if(this.state.complete){
            document.getElementById(this.props.listID + "," + this.props.id).classList.add("complete-task")
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
        this.props.editTask({text: this.state.taskText, key: this.props.id, index: this.props.index})
    }

    onDragStart = event => {
        this.props.onDragStart(this.props.index)
        event.dataTransfer.setData("text/html", "")
    }

    onDragOver = event => {
        this.props.onDragOver(this.props.index)
        event.preventDefault()
    }

    render(){
        return(
            <div className="taskbox" draggable="true" onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDrop={this.props.onDrop}>
                <div className='checkbox'>
                    <input type="checkbox" id='complete' name='complete' checked={this.state.complete} onChange={this.completeTask}/>
                </div>
                <div className='task' id={this.props.listID + "," + this.props.id} onBlur={this.finishEdit} onClick={this.startEdit}>{this.state.taskBody}</div>
                <div className='task-icons'>
                    <button onClick={() => this.startEdit(this.props.id)}>
                        <FaEdit/>
                    </button>  
                    <button onClick={() => this.props.removeTask(this.props.index)}>
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
            pendingItem: {text: "", complete: false},

            draggedFrom: null,
            draggedTo: null,
            isDragging: false,
            originalOrder: [],
            updatedOrder: [],
        }
    }

    handleInput = event => {
        const item = event.target.value
        const pendingItem = {text: item}
        this.setState({
            pendingItem: pendingItem,
        })
    }

    addTask = item => {
        item.preventDefault()
        let newItem = {text: this.state.pendingItem.text, key: v4(), index: this.state.tasks.length}
        if(newItem.text !== ""){
            const newItems = [...this.state.tasks, newItem]
            this.setState({
                tasks: newItems,
                pendingItem: {text: ""}
            })
            this.props.updateTasks(newItems)
        }
    }

    removeTask = (taskIndex) => {
        var newTasks = this.state.tasks
        newTasks.splice(taskIndex, 1)
        this.setState({
            tasks: newTasks
        })
        this.props.updateTasks(newTasks)
    }

    editTask = (task) => {
        var newTasks = this.state.tasks
        newTasks.splice(task.index, 1, task)
        this.setState({
            tasks: newTasks
        })
        this.props.updateTasks(newTasks)
    }

    completeTask = taskID => {
        var tasks = this.state.tasks
        var newTask = tasks[tasks.findIndex(currentTask => currentTask.key === taskID)]
        newTask.complete = !newTask.complete
        this.editTask(newTask)
    }

    onDragStart = index => {
        this.setState({
            draggedFrom: index,
            isDragging: true,
            originalOrder: this.state.tasks
        })
    }

    onDragOver = index => {
        let newList = this.state.originalOrder
        const draggedFrom = this.state.draggedFrom
        const draggedTo = index
        const draggedTask = newList[draggedFrom]
        const remainingTasks = newList.filter(task => task.index !== draggedFrom)

        newList = [
            ...remainingTasks.slice(0, draggedTo),
            draggedTask,
            ...remainingTasks.slice(draggedTo)
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
            tasks: this.state.updatedOrder,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        })
        this.props.updateTasks(this.state.updatedOrder)
    }

    createTask = (task, index)  => {
        return <Task index={index} listID={this.props.listID} id={task.key} task={task.text} complete={task.complete} key={task.key} 
            removeTask={this.removeTask} editTask={this.editTask} completeTask={this.completeTask}
            onDragStart={this.onDragStart} onDragOver={this.onDragOver} onDrop={this.onDrop} />
    }

    render(){
        var entries = this.state.tasks
        var list = entries.map(this.createTask)

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