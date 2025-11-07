# FeedbackLoop API Documentation

Complete API reference for FeedbackLoop endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API uses simple user identification via `userId` in request bodies. Future versions will implement proper authentication with NextAuth.js.

## Response Format

All responses are JSON with the following structure:

### Success Response
```json
{
  "id": "string",
  "data": "object or array"
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal server error |

---

## Feedback Endpoints

### List All Feedback

**Endpoint**: `GET /feedback`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category: `feature-request`, `bug-report`, `improvement`, `other` |
| `status` | string | Filter by status: `under-review`, `planned`, `completed`, `rejected` |
| `sort` | string | Sort order: `newest`, `popular`, `trending` |

**Example Request**:
```bash
curl "http://localhost:3000/api/feedback?category=feature-request&sort=popular"
```

**Example Response**:
```json
[
  {
    "id": "clh1a2b3c4d5e6f7g8h9i0j1",
    "title": "Dark mode support",
    "description": "Add dark mode theme to the application",
    "category": "feature-request",
    "status": "under-review",
    "upvotes": 42,
    "downvotes": 2,
    "author": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "_count": {
      "votes": 44,
      "comments": 5
    },
    "createdAt": "2025-11-07T12:00:00Z",
    "updatedAt": "2025-11-07T12:00:00Z"
  }
]
```

---

### Create Feedback

**Endpoint**: `POST /feedback`

**Request Body**:
```json
{
  "title": "string (5-100 characters)",
  "description": "string (10-5000 characters)",
  "category": "feature-request|bug-report|improvement|other",
  "authorId": "string"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Add export to PDF",
    "description": "Users should be able to export feedback reports as PDF files",
    "category": "feature-request",
    "authorId": "user123"
  }'
```

**Example Response** (201 Created):
```json
{
  "id": "clh1a2b3c4d5e6f7g8h9i0j1",
  "title": "Add export to PDF",
  "description": "Users should be able to export feedback reports as PDF files",
  "category": "feature-request",
  "status": "under-review",
  "upvotes": 0,
  "downvotes": 0,
  "authorId": "user123",
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:00:00Z"
}
```

**Validation Errors**:
```json
{
  "error": "Title must be at least 5 characters",
  "status": 400
}
```

---

### Get Feedback Details

**Endpoint**: `GET /feedback/[id]`

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Feedback post ID |

**Example Request**:
```bash
curl "http://localhost:3000/api/feedback/clh1a2b3c4d5e6f7g8h9i0j1"
```

**Example Response**:
```json
{
  "id": "clh1a2b3c4d5e6f7g8h9i0j1",
  "title": "Dark mode support",
  "description": "Add dark mode theme to the application",
  "category": "feature-request",
  "status": "under-review",
  "upvotes": 42,
  "downvotes": 2,
  "author": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "comments": [
    {
      "id": "comment1",
      "content": "This would be great!",
      "author": {
        "id": "user456",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2025-11-07T12:30:00Z"
    }
  ],
  "votes": [
    {
      "id": "vote1",
      "type": "upvote",
      "userId": "user456"
    }
  ],
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:00:00Z"
}
```

---

### Update Feedback

**Endpoint**: `PATCH /feedback/[id]`

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Feedback post ID |

**Request Body**:
```json
{
  "status": "under-review|planned|completed|rejected",
  "category": "feature-request|bug-report|improvement|other"
}
```

**Example Request**:
```bash
curl -X PATCH "http://localhost:3000/api/feedback/clh1a2b3c4d5e6f7g8h9i0j1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "planned"
  }'
```

**Example Response**:
```json
{
  "id": "clh1a2b3c4d5e6f7g8h9i0j1",
  "title": "Dark mode support",
  "description": "Add dark mode theme to the application",
  "category": "feature-request",
  "status": "planned",
  "upvotes": 42,
  "downvotes": 2,
  "authorId": "user123",
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:15:00Z"
}
```

---

### Delete Feedback

**Endpoint**: `DELETE /feedback/[id]`

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Feedback post ID |

**Example Request**:
```bash
curl -X DELETE "http://localhost:3000/api/feedback/clh1a2b3c4d5e6f7g8h9i0j1"
```

**Example Response** (200 OK):
```json
{
  "id": "clh1a2b3c4d5e6f7g8h9i0j1",
  "title": "Dark mode support",
  "description": "Add dark mode theme to the application",
  "category": "feature-request",
  "status": "under-review",
  "upvotes": 42,
  "downvotes": 2,
  "authorId": "user123",
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:00:00Z"
}
```

---

## Vote Endpoints

### Create or Toggle Vote

**Endpoint**: `POST /votes`

**Request Body**:
```json
{
  "postId": "string",
  "userId": "string",
  "type": "upvote|downvote"
}
```

**Vote Logic**:
- **New Vote**: Creates the vote and updates post counts
- **Same Vote Type**: Removes the vote and decrements count
- **Different Vote Type**: Changes vote type and updates counts accordingly

**Example Request - Upvote**:
```bash
curl -X POST "http://localhost:3000/api/votes" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
    "userId": "user456",
    "type": "upvote"
  }'
```

**Example Response**:
```json
{
  "upvotes": 43,
  "downvotes": 2,
  "message": "Vote created successfully"
}
```

**Example Request - Toggle Vote**:
```bash
curl -X POST "http://localhost:3000/api/votes" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
    "userId": "user456",
    "type": "upvote"
  }'
```

**Example Response** (Vote removed):
```json
{
  "upvotes": 42,
  "downvotes": 2,
  "message": "Vote removed successfully"
}
```

**Example Request - Change Vote**:
```bash
curl -X POST "http://localhost:3000/api/votes" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
    "userId": "user456",
    "type": "downvote"
  }'
```

**Example Response** (Vote changed):
```json
{
  "upvotes": 42,
  "downvotes": 3,
  "message": "Vote changed successfully"
}
```

---

## Comment Endpoints

### Create Comment

**Endpoint**: `POST /comments`

**Request Body**:
```json
{
  "postId": "string",
  "authorId": "string",
  "content": "string (1-5000 characters)"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
    "authorId": "user456",
    "content": "This feature would be incredibly useful!"
  }'
```

**Example Response** (201 Created):
```json
{
  "id": "comment123",
  "content": "This feature would be incredibly useful!",
  "authorId": "user456",
  "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
  "createdAt": "2025-11-07T12:30:00Z",
  "updatedAt": "2025-11-07T12:30:00Z"
}
```

---

### Update Comment

**Endpoint**: `PATCH /comments/[id]`

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Comment ID |

**Request Body**:
```json
{
  "content": "string (1-5000 characters)"
}
```

**Example Request**:
```bash
curl -X PATCH "http://localhost:3000/api/comments/comment123" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

**Example Response**:
```json
{
  "id": "comment123",
  "content": "Updated comment text",
  "authorId": "user456",
  "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
  "createdAt": "2025-11-07T12:30:00Z",
  "updatedAt": "2025-11-07T12:35:00Z"
}
```

---

### Delete Comment

**Endpoint**: `DELETE /comments/[id]`

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Comment ID |

**Example Request**:
```bash
curl -X DELETE "http://localhost:3000/api/comments/comment123"
```

**Example Response** (200 OK):
```json
{
  "id": "comment123",
  "content": "This feature would be incredibly useful!",
  "authorId": "user456",
  "postId": "clh1a2b3c4d5e6f7g8h9i0j1",
  "createdAt": "2025-11-07T12:30:00Z",
  "updatedAt": "2025-11-07T12:30:00Z"
}
```

---

## User Endpoints

### Create or Retrieve User

**Endpoint**: `POST /users`

**Request Body**:
```json
{
  "email": "string",
  "name": "string"
}
```

**Behavior**:
- If user with email exists: Returns existing user
- If user doesn't exist: Creates new user and returns it

**Example Request**:
```bash
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Example Response** (201 Created):
```json
{
  "id": "user123",
  "email": "john@example.com",
  "name": "John Doe",
  "isAdmin": false,
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:00:00Z"
}
```

**Example Response** (200 OK - Existing User):
```json
{
  "id": "user123",
  "email": "john@example.com",
  "name": "John Doe",
  "isAdmin": false,
  "createdAt": "2025-11-07T12:00:00Z",
  "updatedAt": "2025-11-07T12:00:00Z"
}
```

---

## Error Handling

### Common Errors

**Missing Required Fields**:
```json
{
  "error": "Missing required fields: title, description",
  "status": 400
}
```

**Invalid Category**:
```json
{
  "error": "Invalid category. Must be one of: feature-request, bug-report, improvement, other",
  "status": 400
}
```

**Resource Not Found**:
```json
{
  "error": "Feedback post not found",
  "status": 404
}
```

**Server Error**:
```json
{
  "error": "Failed to create feedback",
  "status": 500
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Exponential backoff for repeated failures

---

## Pagination

Future versions will support pagination with:
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

Example:
```bash
curl "http://localhost:3000/api/feedback?limit=20&offset=0"
```

---

## Webhooks

Future versions will support webhooks for:
- New feedback submitted
- Feedback status changed
- New comment added
- Vote threshold reached

---

## SDK/Client Libraries

Future versions will include:
- JavaScript/TypeScript SDK
- Python SDK
- REST API client

---

## Support

For API support:
- Check [DEVELOPMENT.md](./DEVELOPMENT.md) for architecture details
- Review [README.md](./README.md) for general information
- Check error messages in response bodies
- Review server logs for debugging

---

**Last Updated**: November 2025
