import './App.css';
import './components/stylesheet.css'
import ListGrid from './components/List';

const goals = [{ goal: "Work" }, { goal: "School" }]

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
