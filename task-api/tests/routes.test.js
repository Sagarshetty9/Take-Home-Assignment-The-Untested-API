const request = require("supertest");
const app = require("../src/app");
const taskService = require("../src/services/taskService");

beforeEach(() => {
  taskService._reset();
});


describe("GET /tasks", () => {
  test("returns all tasks", async () => {
    taskService.create({ title: "Task 1" });
    taskService.create({ title: "Task 2" });

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});


describe("POST /tasks", () => {
  test("creates a task", async () => {
    const res = await request(app).post("/tasks").send({title: "New task"});

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("New task");
  });

  test("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({});

    expect(res.statusCode).toBe(400);
  });
});

describe("PUT /tasks/:id", () => {
  test("updates a task", async () => {
    const task = taskService.create({ title: "Task 1" });

    const res = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  test("returns 404 for invalid id", async () => {
    const res = await request(app)
      .put("/tasks/invalid-id")
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(404);
  });
});


describe("PUT /tasks/:id", () => {
  test("updates a task", async () => {
    const task = taskService.create({ title: "Task 1" });

    const res = await request(app)
      .put(`/tasks/${task.id}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  test("returns 404 for invalid id", async () => {
    const res = await request(app)
      .put("/tasks/invalid-id")
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(404);
  });
});


describe("PATCH /tasks/:id/complete", () => {
  test("marks a task as complete", async () => {
    const task = taskService.create({ title: "Task 1" });

    const res = await request(app)
      .patch(`/tasks/${task.id}/complete`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("done");
  });
});


describe("GET /tasks/stats", () => {
  test("returns task statistics", async () => {
    taskService.create({ title: "Task 1", status: "todo" });

    const res = await request(app).get("/tasks/stats");

    expect(res.statusCode).toBe(200);
    expect(res.body.todo).toBe(1);
  });
});

//Feature test
describe("PATCH /tasks/:id/assign", () => {
  beforeEach(() => {
    taskService._reset();
  });

  test("assigns a task", async () => {
    const task = taskService.create({
      title: "Task 1",
    });

    const res = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: "Sagar",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.assignee).toBe("Sagar");
  });

  test("returns 404 when task does not exist", async () => {
    const res = await request(app)
      .patch("/tasks/invalid-id/assign")
      .send({
        assignee: "Sagar",
      });

    expect(res.statusCode).toBe(404);
  });

  test("returns 400 for an empty assignee", async () => {
    const task = taskService.create({
      title: "Task 1",
    });

    const res = await request(app)
      .patch(`/tasks/${task.id}/assign`)
      .send({
        assignee: "",
      });

    expect(res.statusCode).toBe(400);
  });
});