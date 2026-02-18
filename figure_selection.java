public class figure_selection {
// Range + figure mapping for Ep
public static class EpFigure {
    public final Range range;
    public final int figure;   // your arbitrary figure ID/number

    public EpFigure(double low, double high, int figure) {
        this.range = new Range(low, high);
        this.figure = figure;
    }
}


// Class to store lower and upper bounds of a range
public static class Range {
    public final double low;
    public final double high;

    /** (low, high] by default in our checks */
    public Range(double low, double high) {
        if (low > high) throw new IllegalArgumentException("low > high");
        this.low = low;
        this.high = high;
    }

    
    public boolean contains(double x) {
        return x > low && x <= high;
    }

}


// Eb ranges (low, high]  → lower exclusive, upper inclusive
public static final EpFigure[] EP0_RANGES = new EpFigure[] {    
    new EpFigure(1, 5.5, 7),
    new EpFigure(5.5, 17.5, 8),
    new EpFigure(17.5, 37.5, 9),
    new EpFigure(37.5, 75.0, 10),
    new EpFigure(75, 500.0, 11)

};

public static final EpFigure[] EP1_RANGES = new EpFigure[] {    
    new EpFigure(1, 5.5, 1),
    new EpFigure(5.5, 17.5, 2),
    new EpFigure(17.5, 37.5, 3),
    new EpFigure(37.5, 75.0, 4),
    new EpFigure(75, 175, 5),
    new EpFigure(175, 800.0, 6)
};

public static final EpFigure[] EP2_RANGES = new EpFigure[] {    
    new EpFigure(1, 5.5, 12),
    new EpFigure(5.5, 17.5, 14),
    new EpFigure(17.5, 37.5, 15),
    new EpFigure(37.5, 75.0, 16),
    new EpFigure(75, 800.0, 17)
};

public static final EpFigure[] EP3_RANGES = new EpFigure[] {    
    new EpFigure(10, 55, 18),
    new EpFigure(55, 800, 19),
};

public static int FigureSelector(float Eb, float Ep) {
    int Eb_Section;

    // Safe proofing for testing (consider validating instead of mutating)
    if (Eb < 0.5f) {
        Eb = 0.5f;
    }

    // Select the appropriate section for Eb  → (low, high]
    if (0.5f <= Eb && Eb <= 0.75f) {
        Eb_Section = 0;
    } else if (0.75f < Eb && Eb <= 1.5f) {
        Eb_Section = 1;
    } else if (1.5f < Eb && Eb <= 3.5f) {
        Eb_Section = 2;
    } else {
        // If Eb is greater than 3.5, it falls into the last section
        Eb_Section = 3;
    }

    // Pick the Ep rules for the selected Eb section
    EpFigure[] rules;
    switch (Eb_Section) {
        case 0: rules = EP0_RANGES; break;
        case 1: rules = EP1_RANGES; break;
        case 2: rules = EP2_RANGES; break;
        case 3: rules = EP3_RANGES; break;
        default: return -1; // should not occur
    }

    // Find the first matching Ep range: (low, high]
    double epVal = Ep; // use double to match Range.contains logic if it uses double
    for (EpFigure rule : rules) {
        if (rule.range.contains(epVal)) {
            return rule.figure;  // return explicit mapped figure
        }
    }

    // No Ep rule matched in this Eb bucket
    return -1;
}

public static void main(String[] args) {
    float Eb = .2f;
    float Ep = 20;

    int result = FigureSelector(Eb, Ep);

    System.out.println("Selected Figure: " + result);
}

}