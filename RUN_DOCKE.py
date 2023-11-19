import subprocess
from concurrent.futures import ThreadPoolExecutor


class CommandFactory:
    @staticmethod
    def create_command(name, building, run, directory):
        return {
            'directory': directory,
            'name': name,
            'build': f"{building} {name} .",
            'run': f"{run} {name}"
        }


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
        futures = {executor.submit(
            run_container, command['build'], command['run'], command['directory']): command for command in commands}
        for future in futures:
            try:
                future.result()
            except Exception as e:
                print(f"Command execution failed: {e}")


def main():
    command_factory = CommandFactory()
    commands = [
        command_factory.create_command(
            "noti2", "docker build -t", "docker run -p 3008:3008", r"C:\Users\Hrisi\Desktop\Gym_progress_tracker\gym\notification_service"),
        command_factory.create_command(
            "exercises_service", "docker build -t", "docker run -p 3007:3007", r"C:\Users\Hrisi\Desktop\Gym_progress_tracker\gym\exercises_service")
        # Add more commands here as needed
    ]

    execute_commands(commands)


if __name__ == "__main__":
    main()
