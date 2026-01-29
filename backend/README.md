# Internship Fair Portal - Backend

A production-ready backend for managing internship fair operations with role-based access control for students, companies, and administrators.

## Features

- JWT-based authentication
- Role-based authorization (Student, Company, Admin)
- Student profile management and applications
- Company role management and applicant tracking
- Admin platform management and analytics
- MongoDB database with Mongoose ODM
- Secure password hashing with bcryptjs
- CORS enabled for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin support

## Installation

1. Clone the repository
2. Navigate to the backend folder: `cd backend`
3. Install dependencies: `npm install`
4. Create `.env` file with required environment variables (see `.env.example`)
5. Start the server: `npm run dev` (development) or `npm start` (production)

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/internship-fair
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Student Routes (Protected)
- `GET /api/student/companies` - Get all verified companies
- `GET /api/student/companies/:id` - Get company details with roles
- `POST /api/student/apply` - Apply for a role
- `GET /api/student/applications` - Get student's applications
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile

### Company Routes (Protected)
- `POST /api/company/role` - Create a new role
- `PUT /api/company/role/:id` - Update role details
- `DELETE /api/company/role/:id` - Delete a role
- `GET /api/company/roles` - Get all company roles
- `GET /api/company/applicants` - Get all applicants
- `PUT /api/company/applicants/:id/status` - Update application status
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile

### Admin Routes (Protected)
- `POST /api/admin/company` - Create a company
- `DELETE /api/admin/company/:id` - Delete a company
- `GET /api/admin/companies` - Get all companies
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students/bulk` - Bulk upload students
- `GET /api/admin/stats` - Get platform statistics

## Database Models

### User
- name, email, password, role (student/company/admin)

### Student
- userId, rollNo, branch, year, cgpa, resumeUrl, university

### Company
- userId, name, description, website, location, logo, verified

### Role
- companyId, title, description, stipend, eligibility, applicationsCount

### Application
- studentId, roleId, companyId, resumeUrl, status (applied/shortlisted/rejected/accepted), appliedAt

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token verification on protected routes
- Role-based access control
- CORS configuration for allowed origins
- Input validation on all endpoints
- MongoDB injection prevention via Mongoose

## Running the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on the port specified in `.env` (default: 5000).

## Example Requests

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

### Apply for Role
```bash
POST /api/student/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "roleId": "507f1f77bcf86cd799439011"
}
```

### Create Company Role
```bash
POST /api/company/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Internship in software development",
  "stipend": 50000,
  "eligibility": "BTech 3rd year and above"
}
```

## Error Handling

All endpoints return JSON responses with the following format:
```json
{
  "success": boolean,
  "message": string,
  "data": object (optional)
}
```

## License

MIT
