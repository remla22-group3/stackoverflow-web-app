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
    private final ModelInfo releaseInfo;

    public ApiController(RestTemplateBuilder rest, Environment env) throws URISyntaxException {
        super();
        this.rest = rest;
        releaseInfo = new ModelInfo(env.getProperty("RELEASE_HOST"));
    }

    @GetMapping("/tags")
    @ResponseBody
    public Tags getTags() {
       return rest.build().getForEntity(releaseInfo.tagsURI, Tags.class).getBody();
    }

    @PostMapping("/predict")
    @ResponseBody
    public PredictRes predict(@RequestBody PredictReq predictReq) {
        Metrics.getInstance().incrementPredictions();
        return getPrediction(predictReq);
    }

    private PredictRes getPrediction(PredictReq predictReq) {
        return rest.build().postForEntity(releaseInfo.predictURI, predictReq, PredictRes.class).getBody();
    }

    @PutMapping("/submit")
    @ResponseBody
    public Void submit(@RequestBody PredictRes userPredict) {
        PredictStats stats =
                rest.build().postForEntity(releaseInfo.submitURI, userPredict, PredictStats.class).getBody();
        Metrics.getInstance().processSubmissionStats(stats);
        Submissions.getInstance().addSubmission(userPredict);
        return null;
    }
}
