package so_web.data;

public class PredictStats {
    public double shareChosenTags = 0, shareManualTags = 0, shareNewTags = 0;

    public void add(PredictStats other) {
        this.shareChosenTags += other.shareChosenTags;
        this.shareManualTags += other.shareManualTags;
        this.shareNewTags += other.shareNewTags;
    }
}
