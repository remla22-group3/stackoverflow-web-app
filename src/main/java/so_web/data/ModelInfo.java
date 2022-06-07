package so_web.data;

import java.net.URI;
import java.net.URISyntaxException;

public class ModelInfo {
    public final URI tagsURI, predictURI, submitURI;

    public ModelInfo(String modelHost) throws URISyntaxException {
        tagsURI = new URI(modelHost + "/tags");
        predictURI = new URI(modelHost + "/predict");
        submitURI = new URI(modelHost + "/submit");
    }
}
