import { useState } from "react";
import "./index.css";

const initialWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    repsDifference: 0,
  },
  {
    id: 2,
    name: "Squats",
    repsDifference: 3,
  },
];

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorkOut, setNewWorkOut] = useState(initialWorkouts);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  function handleShowAddForm() {
    setShowAddForm((show) => !show);
  }

  function handleNewWorkOut(addNewWorkout) {
    setNewWorkOut((newWorkOut) => [...newWorkOut, addNewWorkout]);
    setShowAddForm(false);
  }

  function handleSelection(workout) {
    setSelectedWorkout((cur) => (cur?.id === workout.id ? null : workout));
  }

  function handleUpdateReps(difference) {
    setNewWorkOut((workouts) =>
      workouts.map((workout) =>
        workout.id === selectedWorkout.id
          ? { ...workout, repsDifference: difference }
          : workout,
      ),
    );
    setSelectedWorkout(null);
  }

  return (
    <div className="app">
      <div className="left-panel">
        <WorkOutList
          newWorkOut={newWorkOut}
          onSelectWorkout={handleSelection}
          selectedWorkout={selectedWorkout}
        />

        {showAddForm && <FromAddWorkout onNewWorkOut={handleNewWorkOut} />}

        <Button onClick={handleShowAddForm}>
          {showAddForm ? `Close` : "Add New Workout"}
        </Button>
      </div>

      {selectedWorkout && (
        <FormUpdateReps
          selectedWorkout={selectedWorkout}
          onUpdateReps={handleUpdateReps}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
}

function WorkOutList({ newWorkOut, onSelectWorkout, selectedWorkout }) {
  return (
    <ul className="workout-list">
      {newWorkOut.map((workout) => (
        <Workoutitem
          workout={workout}
          key={workout.id}
          onSelectWorkout={onSelectWorkout}
          selectedWorkout={selectedWorkout}
        />
      ))}
    </ul>
  );
}

function Workoutitem({ workout, onSelectWorkout, selectedWorkout }) {
  const isSelected = selectedWorkout?.id === workout.id;

  return (
    <li className={`workout-item ${isSelected ? "selected" : ""}`}>
      <h3>{workout.name}</h3>
      <p className={workout.repsDifference > 0 ? "text-win" : ""}>
        {workout.repsDifference > 0 &&
          `You won by ${workout.repsDifference} Reps`}
      </p>
      <p className={workout.repsDifference < 0 ? "text-lose" : ""}>
        {workout.repsDifference < 0 &&
          `You lost by ${Math.abs(workout.repsDifference)} Reps`}
      </p>
      <p className={workout.repsDifference === 0 ? "text-tie" : ""}>
        {workout.repsDifference === 0 && `ITS A TIE!!`}
      </p>
      <Button onClick={() => onSelectWorkout(workout)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FromAddWorkout({ onNewWorkOut }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;

    const addNewWorkout = {
      name,
      id: crypto.randomUUID(),
      repsDifference: 0,
    };

    onNewWorkOut(addNewWorkout);
    setName("");
  }

  return (
    <div>
      <form className="add-workout-form" onSubmit={handleSubmit}>
        <h2>Add a new workout 💪</h2>
        <label className="form-group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button className="btn">Add</button>
      </form>
    </div>
  );
}

function FormUpdateReps({ selectedWorkout, onUpdateReps }) {
  const [userReps, setUserReps] = useState("");
  const [friendReps, setFriendReps] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!userReps || !friendReps) return;

    const difference = Number(userReps) - Number(friendReps);
    onUpdateReps(difference);

    setUserReps("");
    setFriendReps("");
  }

  return (
    <div>
      <form className="form-panel" onSubmit={handleSubmit}>
        <h3>{selectedWorkout.name}</h3>
        <div className="form-group">
          <label>Your reps</label>
          <input
            type="number"
            value={userReps}
            onChange={(e) => setUserReps(e.target.value)}
          />
          <label>Friend's reps</label>
          <input
            type="number"
            value={friendReps}
            onChange={(e) => setFriendReps(e.target.value)}
          />
        </div>
        <button className="btn">Results</button>
      </form>
    </div>
  );
}

export default App;
