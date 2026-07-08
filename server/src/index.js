import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { verifyConnection } from './database/neo4j';
import { seedMentors } from './services/mentor.service';
const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await verifyConnection();
        await seedMentors();
        app.listen(PORT, () => {
            process.stdout.write(`Avati server running on port ${PORT}\n`);
        });
    }
    catch (error) {
        process.stderr.write(`Failed to start server: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map