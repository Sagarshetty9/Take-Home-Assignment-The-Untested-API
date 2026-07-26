# Bug Report

## Bug 1: Incorrect pagination offset

**Location**
- `src/services/taskService.js`
- Function: `getPaginated()`

**Expected Behaviour**
- Requesting page 1 with a limit of 10 should return the first 10 tasks.

**Actual Behaviour**
- Page 1 started with task number 11 instead of 1, skipped first 10 tasks.

**How I Discovered It**
- Wrote a unit test for `getPaginated()`.
- Created 15 tasks and requested `page = 1` with `limit = 10`.
- The test failed because the returned tasks started from Task 11.

**Cause**
```js
const offset = page * limit;
```

The offset calculation skips the first page.

**Fix**
```js
const offset = (page - 1) * limit;
```

## Bug 2: Completing a task changes its priority

**Location**
- `src/services/taskService.js`
- Function: `completeTask()`

**Expected Behaviour**
- Completing a task should only update its status and completion timestamp.
- Existing task fields, including priority, should remain unchanged.

**Actual Behaviour**
- Completing a task changes the priority to `"medium"`.

**How I Discovered It**
- Wrote a unit test to verify that task priority remains unchanged after completion.
- Created a task with `"high"` priority and completed it.
- The test failed because the priority changed to `"medium"`.

**Cause**
The `completeTask()` function explicitly overrides the priority:

```js
priority: "medium",
```

**Fix**
- Removed the priority update from `completeTask()`.
- The function now only updates:
  - `status`
  - `completedAt`

  ### What I'd test next

If I had more time, I would add more edge case and integration tests, particularly around request validation, invalid query parameters, and combinations of filtering and pagination. I would also test concurrent requests and additional failure scenarios.

### Anything that surprised me

The biggest surprise was that writing tests exposed bugs that weren't obvious during a manual code review. The pagination offset issue and the task priority being reset on completion were both discovered through testing rather than by simply reading the code.

### Questions before shipping to production

- Should completed tasks be allowed to be reassigned?
- Should fields such as `id` and `createdAt` be immutable during updates?
- Should filtering and pagination work together (e.g. `GET /tasks?status=todo&page=2&limit=10`)?
- Are there any authentication or authorization requirements planned for the API?