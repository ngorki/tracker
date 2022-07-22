import './App.css';
import './components/stylesheet.css'
import ListGrid from './components/List'

const unparsedGoals = window.localStorage.getItem("goals")
const goals = unparsedGoals != null ? JSON.parse(unparsedGoals) : [{ goal: "Work", key: 0}, { goal: "School", key: 1}]

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
