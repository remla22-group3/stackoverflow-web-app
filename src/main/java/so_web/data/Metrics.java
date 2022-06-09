package so_web.data;

public class Metrics {
    private static Metrics INSTANCE = null;
    private int nrSuggestions = 0, nrSubmissions = 0;
    private final PredictStats
            aggStatsRelease = new PredictStats(),
            aggStatsShadow = new PredictStats();

    public static Metrics getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new Metrics();
        }
        return INSTANCE;
    }

    public void incrementSuggestions() {
        nrSuggestions++;
    }

    public void processSubmissionStats(PredictStats releaseStats, PredictStats shadowStats) {
        nrSubmissions++;
        aggStatsRelease.add(releaseStats);
        aggStatsShadow.add(shadowStats);
    }

    @Override
    public String toString() {
        return  "# HELP nr_suggestions Total number of requested suggestions from release\n" +
                "# TYPE nr_suggestions counter\n" +
                "nr_suggestions " + nrSuggestions + "\n\n" +

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
                "shadow_agg_share_chosen_tags " + aggStatsShadow.shareChosenTags + "\n\n" +

                "# HELP shadow_agg_share_manual_tags Summed shares of manually added tags for all shadow submissions\n" +
                "# TYPE shadow_agg_share_manual_tags gauge\n" +
                "shadow_agg_share_manual_tags " + aggStatsShadow.shareManualTags + "\n\n" +

                "# HELP shadow_agg_share_new_tags Summed shares of newly added tags for all shadow submissions\n" +
                "# TYPE shadow_agg_share_new_tags gauge\n" +
                "shadow_agg_share_new_tags " + aggStatsShadow.shareNewTags + "\n\n";
    }
}
