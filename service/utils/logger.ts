
import dotenv from "dotenv";
import fs from "fs";
import { LogType } from "../types/index";

import path from "path";

dotenv.config();

class Logger {
    private logFile: string;

    private colors: Record<LogType, string> = {
        "info": '\x1b[36m',    // Cyan
        "error": '\x1b[31m',   // Red
        "warning": '\x1b[33m',    // Yellow
        "success": '\x1b[32m'  // Green
    }

    constructor({logFileName}: {logFileName: string}) {
        // Create logs directory if it doesn't exist
        const logsDir = path.join(__dirname, 'logs');
        if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        }

        this.logFile = path.join(logsDir, logFileName);
    }

    // Custom logger function that appends to single file
    log(level: LogType, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}`;
        const dataEntry = data ? `\n${JSON.stringify(data, null, 2)}` : '';
        const fullEntry = logEntry + dataEntry + '\n';
        
        // Console output with colors
        console.log(`${this.colors[level]}${logEntry}\x1b[0m`);
        if (data) console.log(data);
        
        // Append to single log file
        fs.appendFileSync(this.logFile, fullEntry);
    }
}

export default Logger;