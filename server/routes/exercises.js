const pool = require('../db');

async function getExercises(req, res) {
  const {workoutId} = req.params;
  try {
    const results = await pool.query('SELECT * FROM workout_exercises WHERE workouts_id = ?', [workoutId]);
    if (!results) {
      return res.status(400).json({error: 'No exercises found'})
    }
    return res.send(results);
  } catch (err) {
    res.status(400).json(err)
  }
}

async function addExercise(req, res) {
  const {workoutId} = req.params;
  const {exercise_name, sets, reps} = req.body;
  try {
    const workouts = await pool.query('SELECT id FROM workouts WHERE id = ?', [workoutId]);
    if (!workouts) {
      return res.status(400).json({error: 'Something went wrong, try again'});
    }
    const results = await pool.query('INSERT INTO workout_exercises (exercise_name, sets, reps, workouts_id) VALUES (?,?,?,?)',
      [exercise_name, sets, reps, workoutId]);
    if (!results) {
      return res.status(400).json({error: 'Couldn\'t add exercise'});
    }
    return res.send(results);
  } catch (err) {
    res.status(401).json(err)
  }
}

async function editExercise(req, res) {
  const {workoutId, exerciseId} = req.params;
  const {exercise_name, sets, reps} = req.body;
  const newDetails = {exercise_name, sets, reps};
  try {
    const workout = await pool.query('SELECT id FROM workouts WHERE id = ?', [workoutId]);
    if (!workout.length) {
      return res.status(400).json({error: 'No workout found'});
    }
    let exercise = await pool.query('UPDATE workout_exercises SET ? WHERE id = ?', [newDetails, exerciseId]);
    if (!exercise) {
      return res.status(400).json({error: 'Couldn\'t update exercise'});
    }
    return res.send(exercise);

  } catch (err) {
    res.status(401).json(err);
  }
}

async function deleteExercise(req, res) {
  const {workoutId, exerciseId} = req.params;
  try {
    const workout = await pool.query('SELECT id FROM workouts WHERE id = ?', [workoutId]);
    if (!workout.length) {
      return res.status(400).json({error: 'No workout found'});
    }
    let exercise = await pool.query('DELETE FROM workout_exercises WHERE id = ?', [exerciseId]);
    if (!exercise) {
      return res.status(400).json({error: 'Couldn\'t update exercise'});
    }
    return res.send(exercise);

  } catch (err) {
    res.status(401).json(err);
  }
}

module.exports = {
  getExercises,
  addExercise,
  editExercise,
  deleteExercise
};