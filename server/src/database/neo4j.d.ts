import { Driver, Session } from 'neo4j-driver';
export declare function getDriver(): Driver;
export declare function getSession(): Session;
export declare function verifyConnection(): Promise<void>;
export declare function closeDriver(): Promise<void>;
//# sourceMappingURL=neo4j.d.ts.map