import { useEffect, useRef, useState } from "react"
import { Socket } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from '@xterm/addon-fit';
const fitAddon = new FitAddon();

function ab2str(buf: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(buf);
}

export const TerminalComponent = ({ socket }: {socket: Socket | null}) => {
    const terminalRef = useRef<HTMLDivElement | null>(null);

    const [isdark, setIsDark] = useState('')

    const OPTIONS_TERM = {
        useStyle: true,
        screenKeys: true,
        cursorBlink: true,
        cols: 200,
        theme: {
            background: isdark
        }
    };

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme == 'dark') {
            setIsDark('black')
        }else {
            setIsDark('white')
        }
    })

    useEffect(() => {
        if (!terminalRef || !terminalRef.current || !socket) {
            return;
        }

        socket.emit("requestTerminal");
        socket.on("terminal", terminalHandler)
        const term = new Terminal(OPTIONS_TERM)
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
        function terminalHandler({data}:{ data: ArrayBuffer }) {
            if (data instanceof ArrayBuffer) {
                console.error(data);
                console.log(ab2str(data))
                term.write(ab2str(data))
            }
        }
        term.onData((data) => {
            console.log(data);
            socket.emit('terminalData', {
                data
            });
        });

        socket.emit('terminalData', {
            data: '\n'
        });

        return () => {
            socket.off("terminal")
        }
    }, [terminalRef]);

    return ( 
        <div className="w-[40vw] h-[400px] text-left" 
        ref={terminalRef}>
        </div>
    )
}