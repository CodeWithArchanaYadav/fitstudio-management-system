# FitStudio backend (Spring Boot 3, Java 17, MySQL)

1. Create the DB: `mysql -u root -p < schema.sql`
   (also inserts 3 plans + admin `admin@fitstudio.com` / `Admin@123` - change it after first login)
2. Set secrets as environment variables (never commit them):
   ```
   export DB_PASSWORD=your_mysql_password
   export JWT_SECRET=<random string, at least 32 characters>
   # optional: DB_URL, DB_USERNAME
   ```
3. Run: `mvn spring-boot:run`  ->  http://localhost:5643

Login: `POST /api/auth/login {email,password}` -> `{token,email,role,name}`; send `Authorization: Bearer <token>`.
Errors are JSON `{status,error,message}` (400/401/403/404/409).
