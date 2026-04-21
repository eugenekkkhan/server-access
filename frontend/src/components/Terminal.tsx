import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { io, Socket } from "socket.io-client";
import "@xterm/xterm/css/xterm.css";
import { theme, terminalTheme } from "../theme.config";

interface Props {
  token: string;
  onLogout: () => void;
}

export default function Terminal({ token, onLogout }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    const term = new XTerm({
      theme: terminalTheme,
      fontSize: 14,
      fontFamily: '"SpaceMono Nerd Font", monospace',
      cursorBlink: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    term.open(containerRef.current!);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // In production nginx proxies /socket.io/ to the backend; in dev Vite proxies it.
    const socket = io("/terminal", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      term.writeln("\r\n\x1b[32mConnected to server.\x1b[0m\r\n");
      socket.emit("resize", { cols: term.cols, rows: term.rows });
    });

    socket.on("output", (data: string) => {
      term.write(data);
    });

    socket.on("exit", (code: number) => {
      term.writeln(`\r\n\x1b[33mSession ended (exit ${code}).\x1b[0m`);
    });

    socket.on("error", (msg: string) => {
      term.writeln(`\r\n\x1b[31mError: ${msg}\x1b[0m`);
    });

    socket.on("disconnect", () => {
      term.writeln("\r\n\x1b[33mDisconnected.\x1b[0m");
    });

    term.onData((data) => {
      socket.emit("input", data);
    });

    const onResize = () => {
      fitAddon.fit();
      socket.emit("resize", { cols: term.cols, rows: term.rows });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      socket.disconnect();
      term.dispose();
    };
  }, [token]);

  return (
    <div style={theme.wrapper}>
      <div style={theme.titleBar}>
        <span style={theme.titleText}>dedicated-server</span>
        <button style={theme.logoutBtn} onClick={onLogout}>
          Disconnect
        </button>
      </div>
      <div ref={containerRef} style={theme.terminal} />
    </div>
  );
}
