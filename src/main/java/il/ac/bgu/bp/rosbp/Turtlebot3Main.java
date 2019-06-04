package il.ac.bgu.bp.rosbp;

import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BEvent;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.ResourceBProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;

public class Turtlebot3Main {

    public static void main(String[] args) {
        final BProgram bprog = new ResourceBProgram("simulation.js");
        bprog.setWaitForExternalEvents(true);

        BProgramRunner rnr = new BProgramRunner(bprog);
        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        rnr.addListener(new PrintBProgramRunnerListener());

        final RosBridge rosBridge = new RosBridge(bprog, rnr);
        bprog.putInGlobalScope("ros", rosBridge);

        rnr.run();
    }

}
