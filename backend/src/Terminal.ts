//@ts-ignore => someone fix this
import { fork, IPty } from 'node-pty';
import path from "path";

const SHELL = "powershell.exe";

export class TerminalManager {
    private sessions: { [id: string]: { terminal: IPty, projectName: string; } } = {};

    constructor() {
        this.sessions = {};
    }

    createPty(id: string, projectName: string, onData: (data: string, id: number) => void) {
        let term = fork(SHELL, [], {
            cols: 100,
            name: 'xterm',
            cwd: path.join(__dirname, `../../tmp/${projectName}`)
        });

        term.on('data', (data: string) => onData(data, term.pid));
        this.sessions[id] = {
            terminal: term,
            projectName: projectName
        };
        term.on('exit', (code: any, signal: any) => {
            delete this.sessions[term.pid];
            console.log(`Process exited with code ${code} and signal ${signal}`)
        });
        return term;
    }

    write(terminalId: string, data: string) {
        this.sessions[terminalId]?.terminal.write(data);
    }

    clear(terminalId: string) {
        try {
            this.sessions[terminalId].terminal.kill();
            delete this.sessions[terminalId];
        } catch (error) {
            console.log(error)
        }
    }
}