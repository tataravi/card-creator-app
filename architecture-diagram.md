# MCP Server Integration Architecture

## Simple Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Evernote      │  │   Import        │  │   Card          │ │
│  │   Connect       │  │   Wizard        │  │   Management    │ │
│  │   Component     │  │   Component     │  │   Component     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Redux Store   │  │   API Client    │  │   UI Components │ │
│  │   (State Mgmt)  │  │   (HTTP Calls)  │  │   (Views)       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js)                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Express API   │  │   MCP Client    │  │   Database      │ │
│  │   Routes        │  │   (Evernote)    │  │   (MongoDB)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MCP SERVER (Standalone)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   MCP Protocol  │  │   Tool Handlers │  │   Content       │ │
│  │   Handler       │  │   (Evernote)    │  │   Processor     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EVERNOTE API                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   OAuth 2.0     │  │   Notebooks     │  │   Notes         │ │
│  │   Authentication│  │   API           │  │   API           │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Sequence

```
1. User clicks "Connect to Evernote"
   ↓
2. Frontend → Backend: POST /api/evernote/connect
   ↓
3. Backend → MCP Server: get_evernote_notebooks(accessToken)
   ↓
4. MCP Server → Evernote API: List notebooks
   ↓
5. Evernote API → MCP Server: Notebook data
   ↓
6. MCP Server → Backend: Processed notebook list
   ↓
7. Backend → Frontend: Notebook list for selection
   ↓
8. User selects notebook and notes
   ↓
9. Frontend → Backend: POST /api/evernote/import-batch
   ↓
10. Backend → MCP Server: import_note_as_card(noteGuid, userId)
    ↓
11. MCP Server → Evernote API: Get note content
    ↓
12. MCP Server: Process content → Card format
    ↓
13. MCP Server → Backend: Card data
    ↓
14. Backend → Database: Save card
    ↓
15. Backend → Frontend: Import success
```

## Component Responsibilities

### Frontend (React)
- **EvernoteConnect**: Handle OAuth flow
- **ImportWizard**: Step-by-step import process
- **NotebookSelector**: Display and select notebooks
- **NoteSelector**: Display and select notes
- **ImportProgress**: Show import status

### Backend (Node.js)
- **Evernote Routes**: API endpoints for Evernote operations
- **MCP Client**: Communicate with MCP server
- **Card Service**: Create and manage cards
- **Auth Middleware**: Secure API access

### MCP Server (Standalone)
- **Tool Handlers**: Process MCP tool requests
- **Evernote Client**: Interface with Evernote API
- **Content Processor**: Convert notes to card format
- **Error Handler**: Manage and report errors

### Database (MongoDB)
- **Cards Collection**: Store imported cards
- **Users Collection**: User authentication data
- **Import Logs**: Track import history

## Key Integration Points

### 1. MCP Protocol Communication
```
Backend ←→ MCP Server
- Tool requests/responses
- Error handling
- Data transformation
```

### 2. Evernote API Integration
```
MCP Server ←→ Evernote API
- OAuth authentication
- Notebook/note fetching
- Content retrieval
```

### 3. Database Operations
```
 Backend ←→ MongoDB
- Card creation
- User management
- Import tracking
```

## Security Layers

### Authentication Flow
1. **Evernote OAuth**: User authenticates with Evernote
2. **JWT Tokens**:  app authentication
3. **API Keys**: Secure MCP server communication
4. **Data Encryption**: Sensitive data protection

### Data Privacy
- No permanent Evernote credential storage
- Secure token handling
- User data isolation
- Audit logging

## Deployment Architecture

### Development
```
Local Machine:
├── App (localhost:3000/5001)
├── MCP Server (stdio transport)
└── MongoDB (Docker container)
```

### Production
```
Cloud Infrastructure:
├── App (Web server)
├── MCP Server (Microservice)
├── MongoDB (Managed database)
└── Load Balancer
```

## Error Handling Strategy

### Frontend
- User-friendly error messages
- Retry mechanisms
- Progress indicators
- Graceful degradation

### Backend
- API error responses
- Logging and monitoring
- Circuit breaker patterns
- Fallback mechanisms

### MCP Server
- Tool error responses
- Evernote API error handling
- Content processing errors
- Connection timeouts

## Performance Considerations

### Optimization Points
- **Batch Processing**: Import multiple notes at once
- **Async Operations**: Non-blocking API calls
- **Caching**: Reduce redundant API calls
- **Progress Streaming**: Real-time updates
- **Rate Limiting**: Respect Evernote API limits

### Scalability
- **Horizontal Scaling**: Multiple MCP server instances
- **Queue System**: Background processing
- **Resource Monitoring**: Performance tracking
- **Auto-scaling**: Dynamic resource allocation
