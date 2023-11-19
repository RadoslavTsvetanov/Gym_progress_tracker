import subprocess
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading


class CommandFactory:
    @staticmethod
    def create_command(name, building, run, directory):
        return {
            'directory': directory,
            'name': name,
            'build': f"{building} {name} .",
            'run': f"{run} {name}"
        }


def docker_compose(directory):
    try:
        subprocess.Popen(
            f"cd /d {directory} && docker-compose up", shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Docker Compose failed with error: {e}")


def build_container(command_to_run, directory_path):
    try:
        subprocess.run(
            f"cd /d {directory_path} && {command_to_run}", shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Command '{command_to_run}' failed with error: {e}")


def run_container(command_to_build, command_to_run, directory):
    try:
        build_container(command_to_build, directory)
        subprocess.run(["cmd", "/k", command_to_run], shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Command '{command_to_run}' failed with error: {e}")


def execute_commands(commands):
    with ThreadPoolExecutor(max_workers=len(commands)) as executor:
        futures = [executor.submit(run_container, command['build'],
                                   command['run'], command['directory']) for command in commands]
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print(f"Command execution failed: {e}")


def start_docker_compose(docker_compose_directory):
    docker_compose(docker_compose_directory)


def main():
    with open('commands.json', 'r') as file:
        data = json.load(file)

    commands_data = data.get('commands', [])
    docker_compose_directory = data.get('docker_compose_directory', '')

    command_factory = CommandFactory()
    commands = [
        command_factory.create_command(
            cmd['name'], cmd['building'], cmd['run'], cmd['directory']
        ) for cmd in commands_data
    ]

    docker_thread = threading.Thread(
        target=start_docker_compose, args=(docker_compose_directory,))
    docker_thread.start()

    execute_commands(commands)

    docker_thread.join()


if __name__ == "__main__":
    main()
