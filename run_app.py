import subprocess
import time
import os
import sys
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
FRONTEND_PORT = "5173"
BACKEND_PORT = "8000"


def get_npm_command():
    npm_command = "npm.cmd" if os.name == "nt" else "npm"
    resolved = shutil.which(npm_command)
    if not resolved:
        raise RuntimeError("npm is not available. Install Node.js first, then run this script again.")
    return resolved


def run_commands():
    if not os.path.exists(os.path.join(ROOT_DIR, "server.py")):
        raise FileNotFoundError("server.py was not found. Run this script from the project root.")

    if not os.path.exists(FRONTEND_DIR):
        raise FileNotFoundError("frontend folder was not found. Run this script from the project root.")

    print("Starting Backend (FastAPI)...")
    backend_process = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=ROOT_DIR
    )
    
    print("Starting Frontend (Vite)...")
    frontend_process = subprocess.Popen(
        [get_npm_command(), "run", "dev", "--", "--host", "127.0.0.1", "--port", FRONTEND_PORT],
        cwd=FRONTEND_DIR
    )
    
    print("\n" + "="*40)
    print("Tomato Leaf Detector is running!")
    print(f"Backend:  http://localhost:{BACKEND_PORT}")
    print(f"Frontend: http://localhost:{FRONTEND_PORT}")
    print("Press Ctrl+C to stop both services.")
    print("="*40 + "\n")
    
    try:
        while backend_process.poll() is None and frontend_process.poll() is None:
            time.sleep(1)
        if backend_process.poll() is not None:
            print("Backend process stopped.")
        if frontend_process.poll() is not None:
            print("Frontend process stopped.")
    except KeyboardInterrupt:
        print("\nStopping services...")
    finally:
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.wait(timeout=5)
        frontend_process.wait(timeout=5)
        print("Done.")

if __name__ == "__main__":
    run_commands()
