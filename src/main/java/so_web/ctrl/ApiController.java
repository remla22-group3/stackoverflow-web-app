package so_web.ctrl;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import so_web.data.Prediction;
import so_web.data.Tags;

import java.net.URI;
import java.net.URISyntaxException;

@Controller
@RequestMapping("/api")
public class ApiController {

    private final RestTemplateBuilder rest;
    private final String modelHost;
    private final MetricsController metricsController;

    public ApiController(RestTemplateBuilder rest, Environment env, MetricsController metricsController) {
        super();
        this.rest = rest;
        this.modelHost = env.getProperty("MODEL_HOST");
        this.metricsController = metricsController;
    }

    @GetMapping("/tags")
    @ResponseBody
    public Tags getTags() {
        try {
            var url = new URI(modelHost + "/tags");
            var c = rest.build().getForEntity(url, Tags.class);
            return c.getBody();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/predict")
    @ResponseBody
    public Prediction predict(@RequestBody Prediction prediction) {
        metricsController.addPrediction();
        try {
            var url = new URI(modelHost + "/predict");
            var c = rest.build().postForEntity(url, prediction, Prediction.class);
            return c.getBody();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
}
