"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const database_1 = require("./config/database");
const cache_1 = require("./config/cache");
const seed_1 = require("./services/seed");
const auth_1 = require("./middleware/auth");
const authController = __importStar(require("./controllers/authController"));
const eventController = __importStar(require("./controllers/eventController"));
const clubController = __importStar(require("./controllers/clubController"));
const attendanceController = __importStar(require("./controllers/attendanceController"));
const notificationController = __importStar(require("./controllers/notificationController"));
const aiController = __importStar(require("./controllers/aiController"));
const adminController = __importStar(require("./controllers/adminController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Redis Cache Server
(0, cache_1.initRedis)();
// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'UniSphere API',
            version: '1.0.0',
            description: 'API Documentation for UniSphere Campus Hub backend'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },
    apis: ['./src/index.ts'] // Can extract comments here
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// ---------------- API ROUTES ----------------
// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
// Events Routes
app.get('/api/events', auth_1.authenticateToken, eventController.getEvents);
app.get('/api/events/coordinator', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), eventController.getCoordinatorEvents);
app.get('/api/events/my-registrations', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('STUDENT'), eventController.getMyRegistrations);
app.post('/api/events', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), eventController.createEvent);
app.delete('/api/events/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), eventController.deleteEvent);
app.post('/api/events/:id/register', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('STUDENT'), eventController.registerForEvent);
app.post('/api/events/:id/feedback', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('STUDENT'), eventController.submitFeedback);
// Clubs Routes
app.get('/api/clubs', auth_1.authenticateToken, clubController.getClubs);
app.post('/api/clubs', auth_1.authenticateToken, clubController.createClub);
// Attendance Routes
app.get('/api/attendance/event/:eventId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), attendanceController.getEventAttendees);
app.post('/api/attendance/check-in', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), attendanceController.checkInAttendance);
// Notifications Routes
app.get('/api/notifications', auth_1.authenticateToken, notificationController.getNotifications);
app.post('/api/notifications/:id/read', auth_1.authenticateToken, notificationController.readNotification);
// AI Engine Routes
app.get('/api/ai/recommendations', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('STUDENT'), aiController.getRecommendations);
app.get('/api/ai/predict-attendance', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), aiController.predictAttendance);
app.get('/api/ai/smart-schedule', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY'), aiController.getSmartSchedule);
app.get('/api/ai/engagement-stats', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('FACULTY', 'ADMIN'), aiController.getEngagementStats);
// Admin Approval Routes
app.get('/api/admin/events/pending', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('ADMIN'), adminController.getPendingEvents);
app.post('/api/admin/events/:id/approve', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('ADMIN'), adminController.approveEvent);
app.get('/api/admin/clubs/pending', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('ADMIN'), adminController.getPendingClubs);
app.post('/api/admin/clubs/:id/approve', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('ADMIN'), adminController.approveClub);
app.get('/api/admin/users', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('ADMIN'), adminController.getUsersList);
// Fallback Route for SPA Web Filter
app.get('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});
// Database Sync and Server Listen
async function startServer() {
    try {
        await database_1.sequelize.authenticate();
        console.log('Database connection authenticated successfully.');
        // Sync models (alter table structure if needed)
        await database_1.sequelize.sync();
        console.log('Database tables synchronized.');
        // Seed Data
        await (0, seed_1.seedDatabase)();
        app.listen(PORT, () => {
            console.log(`Node.js Express Server is listening on http://localhost:${PORT}`);
            console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('Fatal error occurred during server startup:', error);
        process.exit(1);
    }
}
startServer();
