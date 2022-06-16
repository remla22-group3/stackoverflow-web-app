package so_web.ctrl;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import so_web.data.*;

import java.net.URISyntaxException;

@Controller
@RequestMapping("/api")
public class ApiController {

    private final RestTemplateBuilder rest;
    private final ModelInfo releaseInfo, shadowInfo;

    public ApiController(RestTemplateBuilder rest, Environment env) throws URISyntaxException {
        super();
        this.rest = rest;
        releaseInfo = new ModelInfo(env.getProperty("RELEASE_HOST"));
        shadowInfo = new ModelInfo(env.getProperty("SHADOW_HOST"));
        SubmissionsCollection.init(env.getProperty("MONGO_HOST"), env.getProperty("MONGO_ROOT_PASS"));
    }

    @GetMapping("/tags")
    @ResponseBody
    public Tags getTags() {
       return rest.build().getForEntity(releaseInfo.tagsURI, Tags.class).getBody();
    }

    @PostMapping("/predict")
    @ResponseBody
    public PredictRes predict(@RequestBody PredictReq predictReq) {
        Metrics.getInstance().incrementSuggestions();
        return getPrediction(predictReq);
    }

    private PredictRes getPrediction(PredictReq predictReq) {
        return rest.build().postForEntity(releaseInfo.predictURI, predictReq, PredictRes.class).getBody();
    }

    @PutMapping("/submit")
    @ResponseBody
    public Void submit(@RequestBody PredictRes userPredict) {
        PredictStats releaseStats =
                rest.build().postForEntity(releaseInfo.submitURI, userPredict, PredictStats.class).getBody();
        PredictStats shadowStats =
                rest.build().postForEntity(shadowInfo.submitURI, userPredict, PredictStats.class).getBody();
        Metrics.getInstance().processSubmissionStats(releaseStats, shadowStats);
        SubmissionsCollection.addSubmission(userPredict);
        return null;
    }
}
