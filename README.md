# Client-to-Client Messaging using Kafka and NestJS

A robust event-driven messaging system that enables asynchronous communication between clients using Apache Kafka and NestJS microservices architecture.

## 🎯 Project Overview

This project demonstrates the implementation of a client-to-client messaging system where multiple services communicate through Kafka topics. The system supports message routing, persistence, retry mechanisms, and dead-letter queue strategies.

### Key Features

- **Event-Driven Architecture**: Asynchronous communication using Kafka
- **Microservices Design**: Separate client services for scalability
- **Message Persistence**: MongoDB integration for message storage
- **Retry Logic**: Built-in retry mechanism with dead-letter queue
- **Message Filtering**: Clients receive only relevant messages
- **Docker Support**: Easy local development setup

## 🏗️ Architecture

```
┌─────────────┐    Kafka Topic      ┌─────────────┐
│   Client A  │ ──────────────────▶ │   Client B  │
│ (Producer)  │   client-messages   │ (Consumer)  │
└─────────────┘                     └─────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────┐
│                 MongoDB                         │
│            (Message Storage)                    │
└─────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker & Docker Compose
- PNPM package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sidheeqpallam/nestjs-kafka
   cd nestjs-kafka
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start Kafka infrastructure**
   ```bash
   docker-compose up -d
   ```
   
   This will start:
   - Zookeeper
   - Kafka Broker

4. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/messaging-db
   PORT=3000
   KAFKA_BROKER=localhost:9092
   ```

5. **Start the application**
   ```bash
   pnpm start
   ```

   For development with hot reload:
   ```bash
   pnpm start:dev
   ```

## 📡 API Endpoints

### Send Message

**POST** `/send-message`

Send a message from one client to another through Kafka.

**Request Body:**
```json
{
  "from": "clientA",
  "to": "clientB", 
  "message": "Hi there!"
}
```

**Responses:**
```bash
message created.
```
***or***
```bash
Failed to create message.
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "from": "clientA",
    "to": "clientB",
    "message": "Hello from Client A!"
  }'
```


### Retrieve messages

**GET** `/messages`

Retrieve all successful messages

**Response:**
```json
[
  {
        "_id": "68600e63b0acca2d65e89056",
        "from": "clientA",
        "to": "clientB",
        "message": "Hi there!",
        "send_time": "Sat Jun 28 2025 21:14:48 GMT+0530 (India Standard Time)",
        "__v": 0
    },
  {
        "_id": "68600e63b0acca2d65e89056",
        "from": "clientA",
        "to": "clientB",
        "message": "Hi there!",
        "send_time": "Sat Jun 28 2025 21:14:48 GMT+0530 (India Standard Time)",
        "__v": 0
    },    
]
```

### Retrieve failed messages

**GET** `/failed-messages`

Retrieve all failed messages

**Response:**
```json
[
 {
        "_id": "68600e63b0acca2d65e89056",
        "from": "clientA",
        "to": "clientB",
        "message": "",
        "reason": "Message validation failed: message: Path `message` is required.",
        "failedAt": "2025-06-28T15:46:40.591Z",
        "send_time": "Sat Jun 28 2025 21:14:48 GMT+0530 (India Standard Time)",
        "__v": 0
    } 
]
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/messaging-db` |
| `PORT` | Application port | `3000` |
| `KAFKA_BROKER` | Kafka broker address | `localhost:9092` |

### Kafka Topics

- **client-messages**: Main topic for client-to-client communication
- **client-messages-dlq**: Dead letter queue for failed messages

## 🔄 Message Flow

1. **Client A** sends a POST request to `/send-message`
2. **Producer Service** validates the message and publishes to `client-messages` topic
3. **Consumer Service** (Client B) receives the message from Kafka
4. **Message Filter** checks if the message is intended for Client B (`to === 'clientB'`)
5. **Message Storage** saves the message to MongoDB
6. **Retry Logic** handles failed message processing with exponential backoff
7. **Dead Letter Queue** stores messages that fail after maximum retry attempts

## 🛡️ Error Handling & Resilience

### Retry Strategy
- **Initial Retry Delay**: 1 second
- **Maximum Retries**: 3 attempts
- **Backoff Strategy**: Exponential with jitter
- **Dead Letter Queue**: Failed messages after max retries

### Message Validation
- Schema validation using class-validator
- Required fields: `from`, `to`, `message`
- Message length limits and sanitization


## 🚀 Deployment

### Local Development
```bash
docker-compose up -d
pnpm start:dev
```

<!-- **Deploy Link**: [Your deployment URL here] -->

## 🎥 Demo

**Recorded Video**: [Recorded Video Link](https://www.loom.com/share/61b005b763cc47169f6258f192c6dd14?sid=e5987ad0-e9dc-4de9-b2bf-fdf930005a17)

## 📚 Technologies Used

- **NestJS**: Progressive Node.js framework
- **Apache Kafka**: Distributed streaming platform
- **MongoDB**: Document database for message persistence
- **Docker**: Containerization platform
- **TypeScript**: Type-safe JavaScript
- **PNPM**: Fast, disk space efficient package manager

## 📞 Support

For questions or issues, please open an issue in the GitHub repository or contact the development team.

---

<!-- **Live Demo**: [Deployment Link]   -->
- 🎥 **Video Demo:** [Watch on Loom](https://www.loom.com/share/61b005b763cc47169f6258f192c6dd14?sid=e5987ad0-e9dc-4de9-b2bf-fdf930005a17)  
- 📬 **API Documentation:** [View on Postman](https://documenter.getpostman.com/view/22355633/2sB2xFfnsS)
