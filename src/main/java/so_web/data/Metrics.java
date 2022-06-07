package so_web.data;

public class Metrics {
    private static Metrics INSTANCE = null;
    private int nrPredictions = 0, nrSubmissions = 0;
    private final PredictStats
            aggStatsRelease = new PredictStats(),
            aggStatsShadow = new PredictStats();

    public static Metrics getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new Metrics();
        }
        return INSTANCE;
    }

    public void incrementPredictions() {
        nrPredictions++;
    }

    public void processSubmissionStats(PredictStats predictStats) {
        nrSubmissions++;
        aggStatsRelease.add(predictStats);
    }

    @Override
    public String toString() {
        return  "# HELP nr_predictions Total number of requested predictions\n" +
                "# TYPE nr_predictions counter\n" +
                "nr_predictions " + nrPredictions + "\n\n" +

                "# HELP  nr_submissions Total number of final submissions\n" +
                "# TYPE nr_submissions counter\n" +
                "nr_submissions " + nrSubmissions + "\n\n" +

                "# HELP release_agg_share_chosen_tags Summed shares of selected tags from predictions for all release submissions\n" +
                "# TYPE release_agg_share_chosen_tags gauge\n" +
                "release_agg_share_chosen_tags " + aggStatsRelease.shareChosenTags + "\n\n" +

                "# HELP release_agg_share_manual_tags Summed shares of manually added tags for all release submissions\n" +
                "# TYPE release_agg_share_manual_tags gauge\n" +
                "release_agg_share_manual_tags " + aggStatsRelease.shareManualTags + "\n\n" +

                "# HELP release_agg_share_new_tags Summed shares of newly added tags for all release submissions\n" +
                "# TYPE release_agg_share_new_tags gauge\n" +
                "release_agg_share_new_tags " + aggStatsRelease.shareNewTags + "\n\n" +

                "# HELP shadow_agg_share_chosen_tags Summed shares of selected tags from predictions for all shadow submissions\n" +
                "# TYPE shadow_agg_share_chosen_tags gauge\n" +
                "tot_share_chosen_tags " + aggStatsShadow.shareChosenTags + "\n\n" +

                "# HELP shadow_agg_share_manual_tags Summed shares of manually added tags for all shadow submissions\n" +
                "# TYPE shadow_agg_share_manual_tags gauge\n" +
                "shadow_agg_share_manual_tags " + aggStatsShadow.shareManualTags + "\n\n" +

                "# HELP shadow_agg_share_new_tags Summed shares of newly added tags for all shadow submissions\n" +
                "# TYPE shadow_agg_share_new_tags gauge\n" +
                "shadow_agg_share_new_tags " + aggStatsShadow.shareNewTags + "\n\n";
    }
}
