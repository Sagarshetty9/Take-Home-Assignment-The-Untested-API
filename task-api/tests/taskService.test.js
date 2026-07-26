const taskService = require("../src/services/taskService");

//Get all tasks///
describe("getAll", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("Test 1: return an empty array when there are no tasks", () => {
    const tasks = taskService.getAll();

    expect(tasks).toEqual([]);
  });

  test("Test 2: returns all created tasks", () => {
    taskService.create({ title: "Task 1" });
    taskService.create({ title: "Task 2" });

    const tasks = taskService.getAll();

    expect(tasks).toHaveLength(2);
  });
});

//Create task ///
describe("Create task with all fields", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("Test 1: Create a task with Title and default values", () => {
    const task = taskService.create({ title: "Task 1" });

    expect(task.title).toBe("Task 1");
    expect(task.id).toBeDefined();
  });

  test("Test 2: Create a task with custom values", () => {
    const task = taskService.create({
      title: "Task 1",
      description: "Good stuff",
      status: "in_progress",
      priority: "low",
    });

    expect(task.title).toBe("Task 1");
    expect(task.description).toBe("Good stuff");
    expect(task.status).toBe("in_progress");
    expect(task.priority).toBe("low");
    expect(task.id).toBeDefined();
  });
});

//Find By id ////
describe("Find by ID", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("Test 1 : returns task matched with req id", () => {
    const task = taskService.create({ title: "Task 1" });
    const foundTask = taskService.findById(task.id);

    expect(foundTask).toEqual(task);
  });

  test("Test 2 : returns undefined for unknown ID", () => {
    const task = taskService.findById("invalidId");

    expect(task).toBeUndefined();
  });
});


//Get By Status///
describe("getByStatus", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("Test 1: returns tasks with the requested status", () => {
    const task = taskService.create({
      title: "Task 1",
      status: "todo",
    });

    const foundTasks = taskService.getByStatus("todo");

    expect(foundTasks).toHaveLength(1);
    expect(foundTasks[0]).toEqual(task);
  });

  test("Test 2:returns an empty array when no tasks match", () => {
  taskService.create({ title: "Task 1", status: "done" });

  const foundTasks = taskService.getByStatus("todo");

  expect(foundTasks).toEqual([]);
});
});


//Get paginated///
describe("getPaginated", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("returns the first page with 10 tasks", () => {
    for (let i = 1; i <= 15; i++) {
      taskService.create({ title: `Task ${i}` });
    }

    const tasks = taskService.getPaginated(1, 10);

    expect(tasks).toHaveLength(10);
    expect(tasks[0].title).toBe("Task 1");
    expect(tasks[9].title).toBe("Task 10");
  });
});



// getPaginated()
// ☐ getStats()
// ☐ update()
// ☐ remove()
// ☐ completeTask()