import os
import subprocess
import sys
import shutil

def run(command, cwd=None):
    try:
        print(f"\n🔧 Running: {command}\n")
        subprocess.run(command, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Command failed: {e}\n")
        sys.exit(1)

def is_tool_installed(name):
    """Check if a tool/command is available in the system PATH."""
    return shutil.which(name) is not None

def install_npm():
    """Install Node.js and npm if not installed."""
    if not is_tool_installed("npm"):
        print("\n⏳ npm not found. Installing Node.js and npm...\n")
        run("curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -")
        run("sudo apt-get install -y nodejs")
    else:
        print("\n✅ npm is already installed\n")

def install_cargo():
    """Install Rust and cargo if not installed."""
    if not is_tool_installed("cargo"):
        print("\n⏳ cargo not found. Installing Rust...\n")
        run("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y")
        # Add cargo to the current shell's PATH
        cargo_path = os.path.expanduser("~/.cargo/bin")
        os.environ["PATH"] += os.pathsep + cargo_path
    else:
        print("\n✅ cargo is already installed\n")

def main():
    # Check and install dependencies
    opt_delete_volumes = ""
    if len(sys.argv) > 1 and (sys.arg[1] == "v" or sys.arg[1] == "-v" ):
        opt_delete_volumes = "-v"
    
    root = os.getcwd()
    client_dir = os.path.join(root, "client")

    print("\n🛠️ Removing dangling images...\n")
    run('docker rmi $(docker images -f "dangling=true" -q)', cwd=root)
    print(f"\n🛠️ Stopping and removing containers{ '.' if opt_delete_volumes == '' else ' and deleting volumes' }...\n")
    run(f"docker compose down {opt_delete_volumes}", cwd=root)

    install_npm()
    install_cargo()

    print("\n🛠️ Building Angular project...\n")

    run("npm install", cwd=client_dir)
    run("npm run build -- --configuration production", cwd=client_dir)

    print("\n🛠️ Building Rust project...\n")
    rust_dir = os.path.join(root, "axum_server")
    run("cargo build --release", cwd=rust_dir)

    print("\n🚀 Starting Docker Compose...\n")
    try:
        command = "COMPOSE_BAKE=true docker compose up -d --build"
        subprocess.run(command, shell=True, check=True, cwd=client_dir)
    except subprocess.CalledProcessError as e:
        print(f"\n🔧 Running docker-compose alternative\n")
        run("docker-compose -f compose.yaml up -d --build")

    print("\n✅ Complete successfully...\n")

if __name__ == "__main__":
    main()