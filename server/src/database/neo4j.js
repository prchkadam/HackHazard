import neo4j, { Driver, Session } from 'neo4j-driver';
let driver = null;
export function getDriver() {
    if (driver) {
        return driver;
    }
    const uri = process.env.NEO4J_URI;
    const username = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;
    if (!uri || !username || !password) {
        throw new Error('Neo4j environment variables are not configured');
    }
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    return driver;
}
export function getSession() {
    return getDriver().session();
}
export async function verifyConnection() {
    const session = getSession();
    try {
        await session.run('RETURN 1');
    }
    finally {
        await session.close();
    }
}
export async function closeDriver() {
    if (driver) {
        await driver.close();
        driver = null;
    }
}
//# sourceMappingURL=neo4j.js.map