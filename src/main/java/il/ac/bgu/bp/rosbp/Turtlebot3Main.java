package il.ac.bgu.bp.rosbp;

import il.ac.bgu.cs.bp.bpjs.execution.BProgramRunner;
import il.ac.bgu.cs.bp.bpjs.execution.listeners.PrintBProgramRunnerListener;
import il.ac.bgu.cs.bp.bpjs.model.BProgram;
import il.ac.bgu.cs.bp.bpjs.model.eventselection.PrioritizedBSyncEventSelectionStrategy;
import il.ac.bgu.cs.bp.bpjs.context.*;

public class Turtlebot3Main {

    public static void main(String[] args) {
        final BProgram bprog = new ContextBProgram("simulation.dal.js", "simulation.bl.js");
        bprog.setWaitForExternalEvents(true);

        BProgramRunner rnr = new BProgramRunner(bprog);
        bprog.setEventSelectionStrategy(new PrioritizedBSyncEventSelectionStrategy());
        rnr.addListener(new PrintBProgramRunnerListener());

        final RosBridge rosBridge = new RosBridge(bprog, rnr);
        bprog.putInGlobalScope("ros", rosBridge);

        rnr.run();
    }

}
