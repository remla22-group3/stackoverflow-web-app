package so_web.data;

public class Metrics {
    private static Metrics INSTANCE = null;
    private int nrPredictions = 0, nrSubmissions = 0;
    private final PredictStats aggregatePredictStats = new PredictStats();

    public static Metrics getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new Metrics();
        }
        return INSTANCE;
    }

    public void incrementPredictions() {
        nrPredictions++;
    }

    public void processSubmission(PredictStats predictStats) {
        nrSubmissions++;
        aggregatePredictStats.add(predictStats);
    }

    @Override
    public String toString() {
        return  "# HELP nr_predictions Total number of requested predictions\n" +
                "# TYPE nr_predictions counter\n" +
                "nr_predictions " + nrPredictions + "\n\n" +

                "# HELP  nr_submissions Total number of final submissions\n" +
                "# TYPE nr_submissions counter\n" +
                "nr_submissions " + nrSubmissions + "\n\n" +

                "# HELP tot_share_chosen_tags Summed shares of selected tags from predictions for all submissions\n" +
                "# TYPE tot_share_chosen_tags gauge\n" +
                "tot_share_chosen_tags " + aggregatePredictStats.shareChosenTags + "\n\n" +

                "# HELP tot_share_manual_tags Summed shares of manually added tags for all submissions\n" +
                "# TYPE tot_share_manual_tags gauge\n" +
                "tot_share_manual_tags " + aggregatePredictStats.shareManualTags + "\n\n" +

                "# HELP tot_share_new_tags Summed shares of newly added tags for all submissions\n" +
                "# TYPE tot_share_new_tags gauge\n" +
                "tot_share_new_tags " + aggregatePredictStats.shareNewTags + "\n\n";
    }
}
