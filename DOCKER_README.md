# Trade Journal - Docker Setup

This project can be easily set up using Docker.

## Requirements

- Docker
- Docker Compose

## Quick Start

### 1. Clone the Project
```bash
git clone <repository-url>
cd trade-journal
```

### 2. Create Environment File
```bash
cp env.example .env
# Edit the .env file
```

### 3. Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# Follow logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f server
docker-compose logs -f client
docker-compose logs -f mongodb
```

### 4. Access the Application
- **Client (React)**: http://localhost:3000
- **Server (API)**: http://localhost:5000
- **MongoDB**: localhost:27017

## Services

### MongoDB
- **Port**: 27017
- **Database**: trade_journal
- **Root User**: admin
- **Root Password**: password123
- **App User**: trade_user
- **App Password**: trade_password

### Server (Node.js)
- **Port**: 5000
- **Environment**: development
- **Database**: Automatically connects to MongoDB

### Client (React)
- **Port**: 3000
- **API URL**: http://localhost:5000
- **Hot Reload**: Active

## Docker Commands

### Managing Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Remove all services and data
docker-compose down -v
```

### Viewing Logs
```bash
# All service logs
docker-compose logs

# Specific service logs
docker-compose logs server
docker-compose logs client
docker-compose logs mongodb

# Follow logs
docker-compose logs -f
```

### Accessing Containers
```bash
# Connect to server container
docker exec -it trade-journal-server sh

# Connect to client container
docker exec -it trade-journal-client sh

# Connect to MongoDB container
docker exec -it trade-journal-mongodb mongosh
```

## Development

### Hot Reload
- Hot reload is active for both client and server
- Code changes are automatically reflected

### Database
- MongoDB data is stored in `mongodb_data` volume
- Data persists even if containers are deleted

### Port Mapping
- Host ports are mapped to container ports
- Accessible via development tools (Postman, Browser)

## Troubleshooting

### Port Conflicts
If ports are in use:
```bash
# Find which process is using the port
lsof -i :3000
lsof -i :5000
lsof -i :27017

# Kill the process
kill -9 <PID>
```

### Container Won't Start
```bash
# Check container logs
docker-compose logs

# Rebuild container
docker-compose up --build
```

### Database Connection Error
```bash
# Check if MongoDB container is running
docker-compose ps mongodb

# Manually connect to MongoDB
docker exec -it trade-journal-mongodb mongosh
```

## Production

For production environment:
1. Update environment variables
2. Change JWT_SECRET to a strong value
3. Enable MongoDB authentication
4. Add SSL certificates
5. Create volume backup strategy

## Support

If you encounter issues:
1. Check Docker logs
2. Check container status
3. Check port conflicts
4. Check environment variables
