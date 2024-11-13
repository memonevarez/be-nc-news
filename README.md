# Northcoders News API

## Hosted Version

You can view the hosted version of this project here: [https://be-nc-news-r99v.onrender.com/api](https://be-nc-news-r99v.onrender.com/api)

## Project Summary

**NC NEWS** is the backend implementation of a News website where users can read and post articles organized by topics. Users can also add comments to the mentioned articles.

The endpoints include CRUD operations for the 4 tables of the database (`users`, `topics`, `articles`, `comments`):

- `GET /api/users`: Retrieves all users.
- `GET /api/topics`: Retrieves all topics.
- `GET /api/articles`: Retrieves all articles.
- `GET /api/articles/:article_id`: Retrieves a specific article by ID.
- `GET /api/comments/:comment_id`: Retrieves a specific comment by ID.
- `DELETE /api/comments/:comment_id`: Deletes a comment by ID.
- `POST /api/articles/:article_id/comments`: Adds a comment to a specific article.
- `PATCH /api/articles/:article_id`: Updates an article by ID.

## Setup Instructions

### Cloning the Repository

To get a copy of this project up and running on your local machine, follow these steps:

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Database Setup

To set up your local PostgreSQL database, run the following commands:

```bash
npm run setup-dbs
npm run seed

---
##Environment Variables Setup
You will need to create two .env files in the root of the project:

.env.development - For your development environment
.env.test - For your testing environment
These files should include the following:
PGDATABASE=your_db_name_here
PGUSER=your_postgres_username
PGPASSWORD=your_postgres_password

##Requirements
- Node.js: >=14.0.0
- PostgreSQL: >=12.0

---
For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).
This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
```
