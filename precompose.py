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

    client_dir = os.path.join(os.getcwd(), "client")

    run("npm install", cwd=client_dir)
    run("npm run build -- --configuration production", cwd=client_dir)

    print("🚀 Starting Docker Compose...")
    try:
        run("docker compose up -d --build")
    except subprocess.CalledProcessError as e:
        print(f"\n🔧 Running alternative: {command}")
        run("docker-compose -f compose.yaml up -d --build")
    print("✅ Complete successfully...")

if __name__ == "__main__":
    main()