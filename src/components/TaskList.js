import {Component, createRef} from 'react'
import {FaEdit} from 'react-icons/fa'
import {BiTrash} from 'react-icons/bi'

// Task box
class Task extends Component{
    constructor(props){
        super(props)
        this.ref = createRef();

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
            document.getElementById(this.props.id).classList.add("complete-task")
        } else {
            document.getElementById(this.props.id).classList.remove("complete-task")
        }
    }

    startEdit = event => {
        var edit = <form onSubmit={this.finishEdit}><input ref={this.ref} value={this.state.taskText} onChange={this.updateTask} id={this.props.id}/></form>
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
                <div className='task' id={this.props.id}>{this.state.taskBody}</div>
                <div className='icons'>
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
    createTask = item => {
        return <Task id={item.key} task={item.text} key={item.key} removeTask={this.props.removeTask} editTask={this.props.editTask}/>
    }

    render(){
        const entries = this.props.entries
        const list = entries.map(this.createTask)

        return <ul className="tasklist">{list}</ul>
    }
}

export default TaskList