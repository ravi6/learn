package myactors;

import ptolemy.domains.continuous.lib.Integrator;  // base class
import ptolemy.domains.continuous.kernel.ContinuousIntegrator;  // base class
import ptolemy.data.DoubleToken;
import ptolemy.data.BooleanToken;
import ptolemy.data.expr.Parameter;
import ptolemy.kernel.CompositeEntity;
import ptolemy.kernel.util.*;
import ptolemy.actor.TypedIOPort;
import ptolemy.actor.TypedAtomicActor;
import ptolemy.actor.lib.*;

public class AntiWindupIntegrator extends ContinuousIntegrator {

    /** Upper saturation limit */
    public Parameter upperLimit;

    /** Lower saturation limit */
    public Parameter lowerLimit;

    /** Enable/disable anti-windup */
    public Parameter antiWindupEnabled;
    private TypedIOPort myInput;
    private TypedIOPort output;
    private TypedIOPort saturated;   

    public AntiWindupIntegrator(CompositeEntity container, String name)
            throws NameDuplicationException, IllegalActionException {
        super(container, name);

        upperLimit = new Parameter(this, "upperLimit", new DoubleToken(Double.POSITIVE_INFINITY));
        lowerLimit = new Parameter(this, "lowerLimit", new DoubleToken(Double.NEGATIVE_INFINITY));

        // Enable Disable Windup switch (Radio Button)
        antiWindupEnabled = new Parameter(this, "antiWindupEnabled", new BooleanToken(true));

	// Saturation Indicator port
        saturated = new TypedIOPort(this, "saturated", false, true);
  
       // We use our own input because original Integrator input is inaccisible
        myInput = new TypedIOPort(this, "myInput", true, false);


    }

    @Override
    public void fire() throws IllegalActionException {
        //super.fire();

        double outputValue = ((DoubleToken) output.get(0)).doubleValue();

        double inputValue = 0.0;

        if (myInput.hasToken(0)) {
            inputValue = ((DoubleToken) myInput.get(0)).doubleValue();
        }

        double uLim = ((DoubleToken) upperLimit.getToken()).doubleValue();
        double lLim = ((DoubleToken) lowerLimit.getToken()).doubleValue();
        boolean awEnabled = ((BooleanToken) antiWindupEnabled.getToken()).booleanValue();

        if (awEnabled) {
            // Anti-windup logic:
            boolean blockIntegration =
                (outputValue >= uLim && inputValue > 0.0) ||
                (outputValue <= lLim && inputValue < 0.0);

            if (blockIntegration) {
                derivative =  (0.0); // Hold integrator
            } else {
                derivative  = (inputValue);
            }
        } else {
            // Anti-windup disabled, normal integration
            derivative  = (inputValue);
        }

        // Send Saturation state
        saturated.send(0, new BooleanToken(blockIntegration));
    } // end fire
}
