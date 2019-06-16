# ROS-BP

A BPjs version for the TurtleBot simulation, presented in https://github.com/ROBOTIS-GIT/turtlebot3_simulations.

To run this project you need:
* [ROS with gazebo (tested with melodic)](http://wiki.ros.org/melodic/Installation)
* [ROS bridge](http://wiki.ros.org/rosbridge_suite/Tutorials/RunningRosbridge)
* run in shell: rscore
* run in shell: roslaunch turtlebot3_gazebo turtlebot3_world.launch
* run in shell: roslaunch rosbridge_server rosbridge_websocket.launch 
* run the project


## Please keep these (in case you fork):
* This project uses [BPjs](https://github.com/bThink-BGU/BPjs).
* BPjs uses the Mozilla Rhino Javascript engine. See [here](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino) for project page and source code.
