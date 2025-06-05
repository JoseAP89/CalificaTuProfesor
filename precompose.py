import os
import subprocess
import sys

def run(command, cwd=None):
    try:
        print(f"\n🔧 Running: {command}")
        subprocess.run(command, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed: {e}")
        sys.exit(1)

def main():
    print("🛠️ Building Angular project...")
    root = os.getcwd()
    client_dir = os.path.join(root, "client")

    run("npm install", cwd=client_dir)
    run("npm run build -- --configuration production", cwd=client_dir)

    print("🛠️ Building Rust project...")

    rust_dir = os.path.join(root, "axum_server")
    run("cargo build --release", cwd=rust_dir)

    print("🚀 Starting Docker Compose...")
    try:
        command = "docker compose up -d --build"
        subprocess.run(command, shell=True, check=True, cwd=client_dir)
    except subprocess.CalledProcessError as e:
        print(f"\n🔧 Running alternative")
        run("docker-compose -f compose.yaml up -d --build")


    print("✅ Complete successfully...")

if __name__ == "__main__":
    main()