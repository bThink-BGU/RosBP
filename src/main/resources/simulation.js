var DEG2RAD = Math.PI / 180.0;
var RAD2DEG = 180.0 / Math.PI;
var CENTER = 0;
var RIGHT = 330;
var LEFT = 30;
var escape_range_       = 30.0 * DEG2RAD;
var minimum_forward_dist = 0.7;
var minimum_side_dist = 0.6;

var sensorsEventSet = bp.EventSet("", function (e) {
    var sensorsEvents = ["/scan", "/odom"];
    return sensorsEvents.indexOf(e.name)>-1;
});

var scanDataEventSet = bp.EventSet("", function (e) {
    return e.name.equals("scan_data");
});

var scanEventSet = bp.EventSet("", function (e) {
    return e.name.equals("/scan");
});

var odomEventSet = bp.EventSet("", function (e) {
    return e.name.equals("/odom");
});

var positionEventSet = bp.EventSet("", function (e) {
    return e.name.equals("position");
});

var updateVelocityEventSet = bp.EventSet("", function (e) {
    return e.name.equals("UpdateVelocity");
});

var moveEventSet = bp.EventSet("", function (e) {
    return e.name.equals("UpdateVelocity") && e.data.linear.x !== 0;
});

var leftEventSet = bp.EventSet("", function (e) {
    return e.name.equals("UpdateVelocity") && e.data.angular.z > 0;
});

var rightEventSet = bp.EventSet("", function (e) {
    return e.name.equals("UpdateVelocity") && e.data.angular.z < 0;
});

var turnEventSet = bp.EventSet("", function (e) {
    return e.name.equals("UpdateVelocity") && e.data.angular.z !== 0;
});

function getDistanceToObstacle(range, range_max) {
    return range == null ? range_max : range;
}


bp.registerBThread("init", function () {
    var properties = {"queue_length": 10, "throttle_rate": 125};
    ros.addTopic("/cmd_vel", "geometry_msgs/Twist", properties);
    ros.addTopic("/odom", "nav_msgs/Odometry", properties);
    ros.addTopic("/scan", "sensor_msgs/LaserScan", properties);
    ros.subscribe("/scan");
    //ros.subscribe("/gazebo/link_states"); for verification, see http://gazebosim.org/tutorials/?tut=ros_comm
    // ros.subscribe("/odom");
    ros.advertise("/cmd_vel", "UpdateVelocity");
});

bp.registerBThread("update scan data", function () {
    while (true) {
        var e = bp.sync({waitFor: scanEventSet});
        var data = JSON.parse(e.data);
        var scan_data = {"ranges": data.ranges, "range_max":data.ranges_max};
        bp.sync({request: bp.Event("scan_data", scan_data)});
        bp.sync({request: bp.Event("scan_completed")});
    }
});

bp.registerBThread("update position", function () {
    while (true) {
        var e = bp.sync({waitFor: odomEventSet});
        var orientation = JSON.parse(e.data).pose.pose.orientation;
        var w = orientation.w;
        var x = orientation.x;
        var y = orientation.y;
        var z = orientation.z;
        var siny = 2.0 * (w * z + x * y);
        var cosy = 1.0 - 2.0 * (y * y + z * z);

        bp.sync({request: bp.Event("position", Math.atan2(siny, cosy))});
        bp.sync({request: bp.Event("position_update_completed")});
    }
});

bp.registerBThread("move forward", function () {
    while(true) {
        bp.sync({request: bp.Event("UpdateVelocity", {"linear": {"x": 0.3}, "angular": {"z": 0}})}, 100);
        bp.log.info("move forward");
    }
});

bp.registerBThread("turn right", function () {
    while(true) {
        bp.sync({request: bp.Event("UpdateVelocity", {"linear": {"x": 0}, "angular": {"z": -1.5}})}, 50);
        bp.log.info("turn right");
    }
});

bp.registerBThread("turn left", function () {
    while(true) {
        bp.sync({request: bp.Event("UpdateVelocity", {"linear": {"x": 0}, "angular": {"z": 1.5}})}, 50);
        bp.log.info("turn left");
    }
});

bp.registerBThread("wait for scan to move", function () {
    while(true) {
        // bp.sync({waitFor: bp.Event("tick"), block:updateVelocityEventSet});
        bp.sync({waitFor: scanDataEventSet, block:updateVelocityEventSet});
        bp.sync({block: scanDataEventSet, waitFor:updateVelocityEventSet});
    }
});


bp.registerBThread("avoid walls ahead", function () {
    while(true) {
        var e = bp.sync({ waitFor: scanDataEventSet });
        var ranges = e.data.ranges;
        var range_max = e.data.range_max;
        if(getDistanceToObstacle(ranges[CENTER], range_max) < minimum_forward_dist) {
            bp.sync({block: moveEventSet, waitFor: updateVelocityEventSet})
        }
    }
});

bp.registerBThread("avoid walls on the left", function () {
    while(true) {
        var e = bp.sync({ waitFor: scanDataEventSet });
        var ranges = e.data.ranges;
        var range_max = e.data.range_max;
        if(getDistanceToObstacle(ranges[CENTER], range_max) > minimum_forward_dist &&
            getDistanceToObstacle(ranges[LEFT], range_max) < minimum_side_dist) {
                bp.sync({ block: [moveEventSet, leftEventSet], waitFor: updateVelocityEventSet});
        }
    }
});

bp.registerBThread("avoid walls on the right", function () {
    while(true) {
        var e = bp.sync({ waitFor: scanDataEventSet });
        var ranges = e.data.ranges;
        var range_max = e.data.range_max;
        if(getDistanceToObstacle(ranges[CENTER], range_max) > minimum_forward_dist &&
            getDistanceToObstacle(ranges[RIGHT], range_max) < minimum_side_dist) {
                bp.sync({ block: [moveEventSet, rightEventSet], waitFor: updateVelocityEventSet});
        }
    }
});

/*
bp.registerBThread("no flip-flop", function () {
    while(true) {
        var e = bp.sync({waitFor: turnEventSet});
        var block;
        if (e.data.angular.z > 0) {
            block = rightEventSet;
        } else {
            block = leftEventSet;
        }
        bp.sync({waitFor: moveEventSet, block:block});
    }
});

*/
