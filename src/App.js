import './App.css';
import './components/stylesheet.css'
import ListGrid from './components/List'
import { v1 } from 'uuid';

const unparsedGoals = window.localStorage.getItem("goals")
const goals = unparsedGoals != null ? JSON.parse(unparsedGoals) : [{ goal: "Work", key: v1()}, { goal: "School", key: v1()}]

function App() {
  return (
    <div>
      <div className="App">
        <ListGrid goals={goals} />
      </div>
    </div>
  );
}

export default App;
