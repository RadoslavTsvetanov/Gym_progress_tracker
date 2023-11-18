import subprocess


def docker_build_producer(name, building, run, directory):
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


def main():
    command = docker_build_producer(
        "noti2", "docker build -t", "docker run -p 3008:3008", r"C:\Users\Hrisi\Desktop\Gym_progress_tracker\gym\notification_service")
    run_container(command['build'], command['run'], command['directory'])


main()
